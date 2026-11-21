import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { isPublicSupabaseKey } from './publicSupabaseKey'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

function configure() {
  if (!url || !key || !isPublicSupabaseKey(key)) return null
  try {
    const endpoint = new URL(url)
    if (endpoint.protocol !== 'https:' && !(endpoint.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(endpoint.hostname))) {
      return null
    }
    return createClient<Database>(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' },
    })
  } catch {
    return null
  }
}

// Preserve callback state before the SDK cleans up the authentication fragment.
const params = new URLSearchParams(window.location.search)
const fragment = new URLSearchParams(window.location.hash.slice(1))
export const callbackMode = params.get('auth')
export const hasAuthFragment = fragment.has('access_token') || fragment.has('error_code') || fragment.has('error')
export const matchesRecovery = (token?: string) =>
  Boolean(token && fragment.get('type') === 'recovery' && fragment.get('access_token') === token)

export const supabase = configure()
