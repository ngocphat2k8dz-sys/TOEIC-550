import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import type { AuthChangeEvent, AuthError, Session, User } from '@supabase/supabase-js'
import { callbackMode, hasAuthFragment, matchesRecovery, supabase } from '../lib/supabase'
import { continueAfterSignIn, navigate } from '../routing'

const recoveryKey = 'toeic-recovery-account'
let callbackHandled = false

function rememberedRecovery(user: User | null) {
  try { return Boolean(user && sessionStorage.getItem(recoveryKey) === user.id) } catch { return false }
}

function rememberRecovery(user: User | null) {
  try {
    if (user) sessionStorage.setItem(recoveryKey, user.id)
    else sessionStorage.removeItem(recoveryKey)
  } catch {
    // Recovery is still available until reloading the page.
  }
}

export function authMessage(error: AuthError) {
  switch (error.code) {
    case 'invalid_credentials': return 'Email hoặc mật khẩu chưa đúng.'
    case 'email_not_confirmed': return 'Email của tài khoản chưa được xác nhận. Vui lòng liên hệ quản trị viên nếu bạn chưa có liên kết xác nhận.'
    case 'email_address_not_authorized': return 'Dịch vụ gửi thư của dự án chưa hỗ trợ địa chỉ này.'
    case 'weak_password': return 'Mật khẩu chưa đáp ứng yêu cầu. Hãy thử mật khẩu dài và khó đoán hơn.'
    case 'same_password': return 'Mật khẩu mới cần khác mật khẩu hiện tại.'
    case 'reauthentication_needed': return 'Hãy đăng xuất và đăng nhập lại trước khi đổi mật khẩu.'
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit': return 'Bạn đã thử nhiều lần. Hãy đợi một lúc rồi thử lại.'
    case 'user_already_exists': return 'Tài khoản này đã tồn tại. Hãy đăng nhập hoặc đặt lại mật khẩu.'
    default: return navigator.onLine ? 'Không thể hoàn tất yêu cầu tài khoản. Vui lòng thử lại.' : 'Bạn đang ngoại tuyến. Hãy kết nối mạng để tiếp tục.'
  }
}

export function authRedirect(mode: 'confirm' | 'recovery') {
  const url = new URL(window.location.pathname, window.location.origin)
  url.searchParams.set('auth', mode)
  return url.toString()
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [recovering, setRecovering] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const client = supabase
    if (!client) return
    const auth = client.auth
    let version = 0
    let trustedToken = ''
    let trustedUser: User | null = null
    let expiry: number | undefined
    let deferred: number | undefined
    let timeout: number | undefined
    let live = true

    function accept(event: AuthChangeEvent, session: Session | null, next: User | null) {
      trustedToken = next && session ? session.access_token : ''
      trustedUser = next
      const recoveryLink = Boolean(next && (event === 'PASSWORD_RECOVERY' || !callbackHandled && matchesRecovery(session?.access_token)))
      if (recoveryLink && next) rememberRecovery(next)
      if (event === 'SIGNED_OUT') {
        rememberRecovery(null)
        setNotice('')
      }
      setUser(next)
      setRecovering(Boolean(recoveryLink && next) || rememberedRecovery(next))
      setLoading(false)
      if (!callbackHandled && (next || event === 'INITIAL_SESSION' || event === 'PASSWORD_RECOVERY') && (callbackMode || hasAuthFragment)) {
        callbackHandled = true
        if (recoveryLink && next) navigate('reset-password', true)
        else if (callbackMode === 'recovery') {
          setNotice('Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Bạn có thể yêu cầu liên kết mới.')
          navigate('forgot-password', true)
        } else if (next) {
          setNotice('Bạn đã đăng nhập. Tài khoản đã sẵn sàng.')
          continueAfterSignIn()
        } else {
          setNotice('Mở liên kết xác nhận trong email rồi thử đăng nhập.')
          navigate('login', true)
        }
      }
      window.clearTimeout(expiry)
      if (next && session?.expires_at) {
        const remaining = Math.max(0, session.expires_at * 1000 - Date.now())
        expiry = window.setTimeout(checkStoredSession, remaining)
      }
    }

    function verify(event: AuthChangeEvent, session: Session | null) {
      if (!live) return
      const check = ++version
      window.clearTimeout(deferred)
      window.clearTimeout(timeout)
      if (!session?.access_token || (session.expires_at && session.expires_at * 1000 <= Date.now())) {
        accept(event, null, null)
        return
      }
      if (trustedUser && trustedToken === session.access_token) {
        accept(event, session, event === 'USER_UPDATED' && session.user.id === trustedUser.id ? session.user : trustedUser)
        return
      }
      if (trustedUser?.id !== session.user.id) setLoading(true)
      function complete(next: User | null) {
        if (!live || check !== version) return
        version++
        window.clearTimeout(timeout)
        if (!next) setNotice('Chưa xác minh được phiên đăng nhập. Hãy kiểm tra kết nối và đăng nhập lại.')
        accept(event, session, next)
      }
      timeout = window.setTimeout(() => complete(null), 12_000)
      // Avoid running another auth request synchronously inside the Supabase callback.
      deferred = window.setTimeout(() => {
        void auth.getUser(session.access_token).then(({ data, error }) => {
          complete(!error && data.user?.id === session.user.id ? data.user : null)
        }).catch(() => complete(null))
      }, 0)
    }

    function checkStoredSession() {
      if (!live) return
      const check = ++version
      trustedToken = ''
      trustedUser = null
      setLoading(true)
      void auth.getSession().then(({ data }) => {
        if (check === version) verify('INITIAL_SESSION', data.session)
      }).catch(() => {
        if (check === version) verify('INITIAL_SESSION', null)
      })
    }

    const { data } = auth.onAuthStateChange(verify)
    const hide = (event: PageTransitionEvent) => {
      if (!event.persisted) return
      version++
      flushSync(() => setLoading(true))
    }
    const show = (event: PageTransitionEvent) => { if (event.persisted) checkStoredSession() }
    window.addEventListener('pagehide', hide)
    window.addEventListener('pageshow', show)
    return () => {
      live = false
      data.subscription.unsubscribe()
      window.clearTimeout(expiry)
      window.clearTimeout(deferred)
      window.clearTimeout(timeout)
      window.removeEventListener('pagehide', hide)
      window.removeEventListener('pageshow', show)
    }
  }, [])

  function finishRecovery() {
    rememberRecovery(null)
    setRecovering(false)
    setNotice('Đã đổi mật khẩu.')
    window.location.hash = 'account'
  }

  return { user, loading, recovering, notice, finishRecovery, configured: Boolean(supabase) }
}

export type AuthState = ReturnType<typeof useAuth>
