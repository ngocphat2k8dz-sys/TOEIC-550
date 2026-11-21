import { useCallback, useEffect, useRef, useState } from 'react'
import { readGuestProgress, storageKey } from '../progress'
import { commitLearning, loadLearning } from '../services/cloudLearning'
import { applyLearning, hasLearning, normalizeLearning, type LearningAction, type PendingAction, type VersionedLearning } from '../services/learningState'

export type SyncPhase = 'local' | 'connecting' | 'synced' | 'offline' | 'error'

function read<T>(key: string): T | undefined {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) as T : undefined
  } catch {
    return undefined
  }
}

const accountPrefix = (id: string) => `toeic-account-v1:${id}:`

function readSnapshot(prefix: string): VersionedLearning | null {
  const cached = read<VersionedLearning>(`${prefix}cache`)
  return cached?.state ? { revision: cached.revision, state: normalizeLearning(cached.state) } : null
}

function readQueue(prefix: string) {
  const operations: PendingAction[] = []
  try {
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith(`${prefix}pending:`)) continue
      const pending = read<PendingAction>(key)
      if (pending?.id && pending.action && Number.isFinite(pending.stamp)) operations.push(pending)
    }
  } catch {
    return operations
  }
  return operations
}

function combineQueue(...queues: PendingAction[][]) {
  return [...new Map(queues.flat().map(item => [item.id, item])).values()]
    .sort((a, b) => a.stamp - b.stamp || a.id.localeCompare(b.id))
}

interface Store {
  base: VersionedLearning | null
  queue: PendingAction[]
  phase: SyncPhase
}

let lastStamp = 0

export function useLearning(userId?: string) {
  const prefix = userId ? accountPrefix(userId) : ''
  const [store, setStore] = useState<Store>(() => ({
    base: userId ? readSnapshot(prefix) : { revision: 0, state: normalizeLearning({ progress: readGuestProgress() }) },
    queue: userId ? readQueue(prefix) : [],
    phase: navigator.onLine ? userId ? 'connecting' : 'local' : 'offline',
  }))
  const [storageIssue, setStorageIssue] = useState(false)
  const [importDecided, setImportDecided] = useState(() => Boolean(prefix && read(`${prefix}import-choice`)))
  const live = useRef(store)
  const running = useRef<AbortController | null>(null)

  const publish = useCallback((patch: Partial<Store>) => {
    live.current = { ...live.current, ...patch }
    setStore(live.current)
  }, [])

  const persist = useCallback((key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      setStorageIssue(true)
      return false
    }
  }, [])

  const acknowledge = useCallback((ids: string[], snapshot: VersionedLearning | null) => {
    const removed = new Set(ids)
    const queue = live.current.queue.filter(item => !removed.has(item.id))
    // Write the accepted snapshot before clearing the durable queue.
    if (snapshot) {
      const cached = readSnapshot(prefix)
      if (!cached || cached.revision < snapshot.revision) persist(`${prefix}cache`, snapshot)
      if (!live.current.base || live.current.base.revision <= snapshot.revision) publish({ base: snapshot })
    }
    if (ids.length) {
      try {
        for (const id of ids) localStorage.removeItem(`${prefix}pending:${id}`)
      } catch {
        setStorageIssue(true)
      }
    }
    publish({ queue })
  }, [persist, prefix, publish])

  const sync = useCallback(async () => {
    if (!navigator.onLine) { publish({ phase: 'offline' }); return }
    if (!userId) { publish({ phase: 'local' }); return }
    if (running.current) return
    const request = new AbortController()
    running.current = request
    const abort = window.setTimeout(() => request.abort(), 20_000)
    try {
      for (let pass = 0; pass < 5; pass++) {
        const queue = combineQueue(live.current.queue, readQueue(prefix))
        publish({ queue, phase: 'connecting' })
        const cloud = await loadLearning(userId, queue.map(item => item.id), request.signal)
        if (request.signal.aborted) return
        acknowledge(cloud.acknowledged, cloud.snapshot)
        const confirmed = new Set(cloud.acknowledged)
        const pending = queue.filter(item => !confirmed.has(item.id))
        if (!pending.length) {
          if (live.current.queue.length) continue
          publish({ phase: 'synced' })
          return
        }
        const next = pending.reduce(applyLearning, cloud.snapshot.state)
        const ids = pending.map(item => item.id)
        const revision = await commitLearning(userId, { revision: cloud.snapshot.revision, state: next }, ids, request.signal)
        if (request.signal.aborted) return
        if (revision === null) continue
        acknowledge(ids, { revision, state: next })
        if (!live.current.queue.length && !readQueue(prefix).length) {
          publish({ phase: 'synced' })
          return
        }
      }
      publish({ phase: 'error' })
    } catch {
      if (running.current === request) publish({ phase: navigator.onLine ? 'error' : 'offline' })
    } finally {
      window.clearTimeout(abort)
      if (running.current === request) {
        running.current = null
        if (request.signal.aborted) publish({ phase: navigator.onLine ? 'error' : 'offline' })
      }
    }
  }, [acknowledge, prefix, publish, userId])

  useEffect(() => {
    void sync()
    const online = () => { void sync() }
    const offline = () => publish({ phase: 'offline' })
    const focus = () => { if (document.visibilityState === 'visible') void sync() }
    const checkStorage = (event: StorageEvent) => {
      if (userId && event.key?.startsWith(prefix) && !event.key.endsWith('import-choice')) void sync()
      if (!userId && event.key === storageKey) publish({ base: { revision: 0, state: normalizeLearning({ progress: readGuestProgress() }) } })
    }
    const interval = userId ? window.setInterval(focus, 25_000) : undefined
    window.addEventListener('online', online)
    window.addEventListener('offline', offline)
    window.addEventListener('focus', focus)
    window.addEventListener('storage', checkStorage)
    document.addEventListener('visibilitychange', focus)
    return () => {
      const request = running.current
      running.current = null
      request?.abort()
      window.clearInterval(interval)
      window.removeEventListener('online', online)
      window.removeEventListener('offline', offline)
      window.removeEventListener('focus', focus)
      window.removeEventListener('storage', checkStorage)
      document.removeEventListener('visibilitychange', focus)
    }
  }, [prefix, publish, sync, userId])

  function dispatch(action: LearningAction) {
    const stamp = Math.max(Date.now(), lastStamp + 1, (live.current.base?.state.resetAt ?? 0) + 1, (live.current.queue.at(-1)?.stamp ?? 0) + 1)
    lastStamp = stamp
    const item = { id: crypto.randomUUID(), stamp, action }
    if (!userId) {
      const state = applyLearning(live.current.base?.state ?? normalizeLearning(), item)
      persist(storageKey, state.progress)
      publish({ base: { revision: 0, state } })
    } else {
      persist(`${prefix}pending:${item.id}`, item)
      publish({ queue: combineQueue(live.current.queue, [item]) })
      void sync()
    }
  }

  const guest = userId && !importDecided ? readGuestProgress() : null
  const hasGuestData = Boolean(store.base && guest && hasLearning(guest))
  function chooseImport(accept: boolean) {
    if (!hasGuestData || !guest) return
    if (accept) dispatch({ type: 'import', guest })
    persist(`${prefix}import-choice`, accept ? 'accepted' : 'declined')
    setImportDecided(true)
  }

  const state = store.queue.reduce(applyLearning, store.base?.state ?? normalizeLearning())
  return {
    ...state, phase: store.phase, ready: Boolean(store.base), pending: store.queue.length,
    storageIssue, dispatch, sync, hasGuestData, chooseImport,
  }
}
