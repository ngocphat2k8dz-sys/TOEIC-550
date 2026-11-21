import { useState } from 'react'
import { KeyRound, LogIn, Mail, UserPlus } from 'lucide-react'
import { EmptyState, PageIntro } from '../../components/UI'
import { authMessage, authRedirect, type AuthState } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { continueAfterSignIn } from '../../routing'

export type AuthRoute = 'login' | 'register' | 'forgot-password' | 'reset-password'

const copy = {
  login: { title: 'Đăng nhập', description: 'Tiếp tục lộ trình và tiến độ từ các thiết bị của bạn.', button: 'Đăng nhập', Icon: LogIn },
  register: { title: 'Đăng ký', description: 'Tạo tài khoản để lưu và đồng bộ tiến độ TOEIC.', button: 'Tạo tài khoản', Icon: UserPlus },
  'forgot-password': { title: 'Quên mật khẩu', description: 'Nhập email tài khoản để nhận liên kết đặt lại mật khẩu.', button: 'Gửi liên kết', Icon: Mail },
  'reset-password': { title: 'Đặt lại mật khẩu', description: 'Chọn mật khẩu mới cho tài khoản của bạn.', button: 'Lưu mật khẩu mới', Icon: KeyRound },
}

export function AuthPage({ page, auth }: { page: AuthRoute; auth: AuthState }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { title, description, button, Icon } = copy[page]
  const passwordReset = page === 'reset-password'
  const registration = page === 'register'
  const forgot = page === 'forgot-password'

  async function submit(form: FormData) {
    if (!supabase || busy) return
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    setError('')
    setSuccess('')
    if ((registration || passwordReset) && password !== form.get('password-confirmation')) {
      setError('Hai ô mật khẩu cần giống nhau.')
      return
    }
    setBusy(true)
    try {
      if (page === 'login') {
        const result = await supabase.auth.signInWithPassword({ email, password })
        if (result.error) setError(authMessage(result.error))
        else continueAfterSignIn()
      } else if (registration) {
        const displayName = String(form.get('display-name') ?? '').trim()
        const result = await supabase.auth.signUp({
          email, password, options: { data: { display_name: displayName }, emailRedirectTo: authRedirect('confirm') },
        })
        if (result.error) setError(authMessage(result.error))
        else if (result.data.session) continueAfterSignIn()
        else setSuccess('Nếu email đăng ký hợp lệ, bạn sẽ nhận được liên kết xác nhận. Mở liên kết trước khi đăng nhập.')
      } else if (forgot) {
        const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: authRedirect('recovery') })
        if (result.error) setError(authMessage(result.error))
        else setSuccess('Nếu email thuộc một tài khoản, bạn sẽ nhận được liên kết đặt lại mật khẩu.')
      } else if (auth.recovering) {
        const result = await supabase.auth.updateUser({ password })
        if (result.error) setError(authMessage(result.error))
        else auth.finishRecovery()
      }
    } catch {
      setError('Kết nối gián đoạn. Vui lòng thử lại.')
    } finally {
      setBusy(false)
    }
  }

  return <>
    <PageIntro title={title} description={description} />
    <section className="panel content-panel auth-panel">
      <div className="section-heading"><div><h2>Tài khoản TOEIC 550+</h2><p>{description}</p></div><span className="icon-tile blue"><Icon size={20} /></span></div>
      {auth.notice && !error && <p className="account-notice" role="status">{auth.notice}</p>}
      {!auth.configured ? <EmptyState title="Tài khoản chưa khả dụng trên bản này">
        <p>Cần cấu hình Supabase để đăng nhập và mở nội dung học.</p><a className="button primary" href="#welcome">Về trang chào mừng</a>
      </EmptyState> : passwordReset && !auth.recovering ? <EmptyState title="Cần liên kết đặt lại mật khẩu">
        <a className="button primary" href="#forgot-password">Yêu cầu liên kết mới</a>
      </EmptyState> : auth.user && !passwordReset ? <EmptyState title="Bạn đang đăng nhập">
        <div className="button-group"><a className="button primary" href="#home">Về trang học</a><a className="button secondary" href="#account">Mở hồ sơ</a></div>
      </EmptyState> : <>
        <form className="account-form" onSubmit={event => { event.preventDefault(); void submit(new FormData(event.currentTarget)) }}>
          {registration && <label>Tên hiển thị <input name="display-name" autoComplete="nickname" maxLength={60} /></label>}
          {!passwordReset && <label>Email <input name="email" type="email" autoComplete="email" required /></label>}
          {!forgot && <label>{passwordReset ? 'Mật khẩu mới' : 'Mật khẩu'} <input name="password" type="password" autoComplete={page === 'login' ? 'current-password' : 'new-password'} required /></label>}
          {(registration || passwordReset) && <label>Nhập lại mật khẩu <input name="password-confirmation" type="password" autoComplete="new-password" required /></label>}
          {error && <p className="account-error" role="alert">{error}</p>}
          {success && <p className="account-notice" role="status">{success}</p>}
          <button className="button primary" type="submit" disabled={busy}>{busy ? 'Đang xử lý…' : button}</button>
        </form>
        <div className="account-links">
          {page !== 'login' && <a className="text-link" href="#login">Đăng nhập</a>}
          {page !== 'register' && !passwordReset && <a className="text-link" href="#register">Đăng ký</a>}
          {page === 'login' && <a className="text-link" href="#forgot-password">Quên mật khẩu?</a>}
          <a className="text-link" href="#welcome">Về trang chào mừng</a>
        </div>
      </>}
    </section>
  </>
}
