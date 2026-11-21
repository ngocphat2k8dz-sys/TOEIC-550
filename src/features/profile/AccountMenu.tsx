import { useEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import { authMessage } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { clearStudyRoute, navigate } from '../../routing'

export function AccountMenu({ user, displayName, route }: { user: User; displayName: string; route: string }) {
  const container = useRef<HTMLDetailsElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const label = displayName || user.email || 'Học viên'
  const letters = Array.from(label.trim())[0]?.toLocaleUpperCase('vi') || 'HV'
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node) && container.current) container.current.open = false
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])
  useEffect(() => {
    if (container.current) container.current.open = false
    setError('')
  }, [route])

  async function signOut() {
    if (!supabase || busy) return
    setError('')
    setBusy(true)
    try {
      const result = await supabase.auth.signOut({ scope: 'local' })
      if (result.error) setError(authMessage(result.error))
      else {
        clearStudyRoute()
        navigate('welcome', true)
      }
    } catch {
      setError('Không thể đăng xuất lúc này. Vui lòng thử lại.')
    } finally {
      setBusy(false)
    }
  }

  return <details className="account-menu" ref={container} onKeyDown={event => {
    if (event.key === 'Escape' && container.current?.open) {
      container.current.open = false
      container.current.querySelector('summary')?.focus()
    }
  }}>
    <summary aria-label={`Menu tài khoản ${label}`} className="account-trigger"><span className="account-avatar">{letters}</span><span className="account-trigger-label" title={label}>{label}</span><ChevronDown size={13} /></summary>
    <div className="panel account-dropdown">
      <div className="account-dropdown-identity"><strong>{label}</strong>{label !== user.email && <small>{user.email}</small>}</div>
      <a href="#account" onClick={() => { if (container.current) container.current.open = false }}><UserRound size={17} /> Hồ sơ tài khoản</a>
      <button type="button" onClick={() => void signOut()} disabled={busy}><LogOut size={17} /> {busy ? 'Đang đăng xuất…' : 'Đăng xuất'}</button>
      {error && <p className="account-error" role="alert">{error}</p>}
    </div>
  </details>
}
