import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { validStudentPassword } from '../../../supabase/functions/_shared/studentCredentials'
import { authMessage } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

export function ChangePassword() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function submit(form: HTMLFormElement) {
    if (!supabase || busy) return
    const fields = new FormData(form)
    const currentPassword = String(fields.get('current-password') ?? '')
    const password = String(fields.get('new-password') ?? '')
    setError('')
    setSaved(false)
    if (!validStudentPassword(password)) {
      setError('Mật khẩu mới cần ít nhất 12 ký tự, có chữ và số, tối đa 72 byte.')
      return
    }
    if (password === currentPassword) {
      setError('Mật khẩu mới cần khác mật khẩu hiện tại.')
      return
    }
    if (password !== fields.get('password-confirmation')) {
      setError('Hai ô mật khẩu mới cần giống nhau.')
      return
    }

    setBusy(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ current_password: currentPassword, password })
      if (updateError) {
        setError(String(updateError.code) === 'current_password_mismatch' ? 'Mật khẩu hiện tại chưa đúng.' : authMessage(updateError))
        return
      }
      form.reset()
      setSaved(true)
    } catch {
      setError('Chưa thể đổi mật khẩu. Vui lòng thử lại.')
    } finally {
      setBusy(false)
    }
  }

  return <section className="panel content-panel">
    <div className="section-heading"><div><h2>Đổi mật khẩu</h2><p>Đặt mật khẩu riêng sau khi nhận tài khoản.</p></div><span className="icon-tile blue"><KeyRound size={20} /></span></div>
    <form className="account-form" onSubmit={event => { event.preventDefault(); void submit(event.currentTarget) }}>
      <label>Mật khẩu hiện tại <input name="current-password" autoComplete="current-password" type="password" required disabled={busy} /></label>
      <label>Mật khẩu mới <input name="new-password" autoComplete="new-password" type="password" required disabled={busy} /></label>
      <label>Nhập lại mật khẩu mới <input name="password-confirmation" autoComplete="new-password" type="password" required disabled={busy} /></label>
      {error && <p role="alert" className="account-error">{error}</p>}
      {saved && <p role="status" className="account-notice">Đã đổi mật khẩu.</p>}
      <button type="submit" className="button secondary" disabled={busy}>{busy ? 'Đang lưu…' : 'Đổi mật khẩu'}</button>
    </form>
  </section>
}
