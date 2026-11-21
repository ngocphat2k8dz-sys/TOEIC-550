import { createStudent } from './handler.ts'
import { studentAccountService } from './service.ts'

function projectKey(keys: string, legacyKey: string): string {
  const key = JSON.parse(Deno.env.get(keys) ?? '{}').default ?? Deno.env.get(legacyKey)
  if (typeof key !== 'string' || !key) throw new Error('Supabase key unavailable')
  return key
}

const service = studentAccountService(
  Deno.env.get('SUPABASE_URL') ?? '',
  projectKey('SUPABASE_PUBLISHABLE_KEYS', 'SUPABASE_ANON_KEY'),
  () => projectKey('SUPABASE_SECRET_KEYS', 'SUPABASE_SERVICE_ROLE_KEY'),
)

Deno.serve(request => createStudent(request, service))
