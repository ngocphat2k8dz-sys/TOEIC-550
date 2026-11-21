export function isPublicSupabaseKey(key: string) {
  if (key.startsWith('sb_publishable_')) return true
  try {
    const payload = key.split('.')[1]
    if (!payload) return false
    const decoded = atob(payload.replaceAll('-', '+').replaceAll('_', '/'))
    return JSON.parse(decoded).role === 'anon'
  } catch {
    return false
  }
}
