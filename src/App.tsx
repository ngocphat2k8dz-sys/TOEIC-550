import { lazy, Suspense, useEffect } from 'react'
import { AuthPage, type AuthRoute } from './features/auth/AuthPage'
import { AuthLoading, PublicLayout, Welcome } from './features/auth/PublicLayout'
import { useAuth } from './hooks/useAuth'
import { currentRoute, isPublicRoute, navigate, rememberStudyRoute, useRoute } from './routing'

const Workspace = lazy(() => import('./Workspace'))

function RequireSignIn({ route }: { route: string }) {
  useEffect(() => {
    if (currentRoute() !== route) return
    rememberStudyRoute(route)
    navigate('login', true)
  }, [route])
  return <PublicLayout><p role="status">Đang chuyển đến trang đăng nhập…</p></PublicLayout>
}

export default function App() {
  const auth = useAuth()
  const route = useRoute()

  if (auth.loading) return <AuthLoading />
  const destination = auth.recovering ? 'reset-password' : route || (auth.user ? 'home' : 'welcome')
  if (destination === 'welcome') return <PublicLayout><Welcome /></PublicLayout>
  if (isPublicRoute(destination)) {
    const page = destination as AuthRoute
    return <PublicLayout><AuthPage key={page} page={page} auth={auth} /></PublicLayout>
  }
  if (!auth.user) return <RequireSignIn route={destination} />

  return <Suspense fallback={<AuthLoading />}>
    <Workspace key={auth.user.id} auth={{ ...auth, user: auth.user }} route={destination} />
  </Suspense>
}
