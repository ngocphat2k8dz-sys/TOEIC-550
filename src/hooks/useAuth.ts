import { useEffect, useState } from 'react'
import type { AuthError, User } from '@supabase/supabase-js'
import { callbackMode, hasAuthFragment, matchesRecovery, supabase } from '../lib/supabase'

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

function callbackRoute(route: string) {
  window.history.replaceState(null, '', `${window.location.pathname}#${route}`)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

export function authMessage(error: AuthError) {
  switch (error.code) {
    case 'invalid_credentials': return 'Email hoặc mật khẩu chưa đúng.'
    case 'email_not_confirmed': return 'Hãy xác nhận email đăng ký, sau đó thử đăng nhập lại.'
    case 'email_address_not_authorized': return 'Dịch vụ gửi thư của dự án chưa hỗ trợ địa chỉ này.'
    case 'weak_password': return 'Mật khẩu chưa đáp ứng yêu cầu. Hãy thử mật khẩu dài và khó đoán hơn.'
    case 'same_password': return 'Mật khẩu mới cần khác mật khẩu hiện tại.'
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
    if (!supabase) return
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const next = session?.user ?? null
      const recoveryLink = event === 'PASSWORD_RECOVERY' || !callbackHandled && matchesRecovery(session?.access_token)
      if (recoveryLink && next) rememberRecovery(next)
      if (event === 'SIGNED_OUT') rememberRecovery(null)
      setUser(next)
      setRecovering(Boolean(recoveryLink && next) || rememberedRecovery(next))
      setLoading(false)
      if (!callbackHandled && (event === 'INITIAL_SESSION' || event === 'PASSWORD_RECOVERY') && (callbackMode || hasAuthFragment)) {
        callbackHandled = true
        if (recoveryLink && next) callbackRoute('reset-password')
        else if (callbackMode === 'recovery') {
          setNotice('Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Bạn có thể yêu cầu liên kết mới.')
          callbackRoute('forgot-password')
        } else {
          setNotice(next ? 'Bạn đã đăng nhập. Tài khoản đã sẵn sàng.' : 'Mở liên kết xác nhận trong email rồi thử đăng nhập.')
          callbackRoute(next ? 'account' : 'login')
        }
      }
    })
    return () => data.subscription.unsubscribe()
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
