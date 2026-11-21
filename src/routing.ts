import { useSyncExternalStore } from 'react'

const publicRoutes = new Set(['welcome', 'login', 'forgot-password', 'reset-password'])
const nextKey = 'toeic-next-study-route'

export function currentRoute() {
  return window.location.hash.slice(1).replace(/^\/+|\/+$/g, '')
}

function subscribe(update: () => void) {
  window.addEventListener('hashchange', update)
  return () => window.removeEventListener('hashchange', update)
}

export function useRoute() {
  return useSyncExternalStore(subscribe, currentRoute)
}

export function isPublicRoute(route: string) {
  return publicRoutes.has(route)
}

export function navigate(route: string, replace = false) {
  if (replace) {
    const url = new URL(window.location.href)
    url.search = ''
    url.hash = route
    window.history.replaceState(null, '', url)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    window.location.hash = route
  }
}

function validReturnRoute(route: string) {
  return /^[a-z][a-z0-9-]*(\/[a-z0-9%._~&–-]+){0,3}$/i.test(route) && route !== 'register' && !isPublicRoute(route)
}

export function rememberStudyRoute(route: string) {
  if (!validReturnRoute(route)) return
  try { sessionStorage.setItem(nextKey, route) } catch { /* Dashboard remains the default. */ }
}

export function clearStudyRoute() {
  try { sessionStorage.removeItem(nextKey) } catch { /* Navigation still works without session storage. */ }
}

export function continueAfterSignIn() {
  let route: string | null = null
  try { route = sessionStorage.getItem(nextKey) } catch { /* Dashboard remains the default. */ }
  clearStudyRoute()
  navigate(route && validReturnRoute(route) ? route : 'home', true)
}
