import { createClient } from 'npm:@supabase/supabase-js@2.119.2'
import type { StudentAccountService } from './handler.ts'

const auth = { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }

export function studentAccountService(url: string, publicKey: string, readServerKey: () => string, transport: typeof fetch = fetch): StudentAccountService {
  return {
    async authorize(token) {
      const client = createClient(url, publicKey, { auth, global: { fetch: transport, headers: { Authorization: `Bearer ${token}` } } })
      const { data: { user }, error: authError } = await client.auth.getUser(token)
      if (authError && (authError.status ?? 0) >= 500) throw new Error('Auth unavailable')
      if (authError || !user) return 'unauthenticated'

      const { data, error } = await client.rpc('is_toeic_admin')
      if (error) throw new Error('Admin check unavailable')
      return data === true ? 'allowed' : 'forbidden'
    },
    async create({ name, email, password }) {
      const server = createClient(url, readServerKey(), { auth, global: { fetch: transport } })
      const { data, error } = await server.auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { display_name: name },
      })
      if (!error && data.user) return 'created'
      if (error?.code === 'email_exists' || error?.code === 'user_already_exists') return 'email_exists'
      if (error?.code === 'weak_password') return 'weak_password'
      if (error?.code === 'email_address_invalid' || error?.code === 'validation_failed') return 'invalid_email'
      throw new Error('Account creation failed')
    },
  }
}
