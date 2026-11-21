import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type AdminAccess = 'checking' | 'allowed' | 'denied' | 'unavailable'

export function useAdminAccess() {
  const [access, setAccess] = useState<AdminAccess>('checking')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const client = supabase
    const controller = new AbortController()
    async function verify() {
      try {
        if (!client) throw new Error('Supabase unavailable')
        const { data, error } = await client.rpc('is_toeic_admin').abortSignal(controller.signal)
        if (error) throw error
        if (!controller.signal.aborted) setAccess(data === true ? 'allowed' : 'denied')
      } catch {
        if (!controller.signal.aborted) setAccess('unavailable')
      }
    }
    void verify()
    return () => controller.abort()
  }, [attempt])

  function retry() {
    setAccess('checking')
    setAttempt(previous => previous + 1)
  }

  return { access, retry }
}
