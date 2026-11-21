import { validateStudentCredentials, type StudentCredentials } from '../_shared/studentCredentials.ts'

export interface StudentAccountService {
  authorize(token: string): Promise<'allowed' | 'unauthenticated' | 'forbidden'>
  create(credentials: StudentCredentials): Promise<'created' | 'email_exists' | 'weak_password' | 'invalid_email'>
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-region',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
}

function failure(status: number, error: string) {
  return Response.json({ error }, { status, headers })
}

export async function createStudent(request: Request, service: StudentAccountService) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
  if (request.method !== 'POST') return failure(405, 'method_not_allowed')
  const token = request.headers.get('Authorization')?.match(/^Bearer\s+(\S+)$/i)?.[1]
  if (!token) return failure(401, 'unauthenticated')

  try {
    const permission = await service.authorize(token)
    if (permission === 'unauthenticated') return failure(401, permission)
    if (permission === 'forbidden') return failure(403, permission)

    const body: unknown = await request.json().catch(() => null)
    if (body === null) return failure(400, 'invalid_request')
    const validated = validateStudentCredentials(body)
    if ('error' in validated) return failure(422, validated.error)

    const created = await service.create(validated.credentials)
    if (created === 'created') return Response.json({ ok: true }, { status: 201, headers })
    return failure(created === 'email_exists' ? 409 : 422, created)
  } catch {
    return failure(500, 'server_error')
  }
}
