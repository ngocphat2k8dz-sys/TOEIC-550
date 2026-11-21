import assert from 'node:assert/strict'
import { createStudent } from './handler.ts'
import { studentAccountService } from './service.ts'

const origin = 'https://supabase.example.invalid'
const credentials = { name: '  Học viên  ', email: '  HOC-VIEN@example.invalid  ', password: 'Example-only32' }

function setup({ createError = '', roleCheckFails = false } = {}) {
  const calls: string[] = []
  let adminReads = 0
  const service = studentAccountService(origin, 'public-test-key', () => {
    adminReads++
    return 'server-test-key'
  }, async (input, init) => {
    const request = new Request(input, init)
    const { pathname } = new URL(request.url)
    const authorization = request.headers.get('authorization')
    calls.push(pathname)
    if (pathname === '/auth/v1/user') {
      if (!['Bearer admin-session', 'Bearer learner-session'].includes(authorization ?? '')) {
        return Response.json({ error_code: 'bad_jwt', msg: 'invalid token' }, { status: 401 })
      }
      assert.equal(request.headers.get('apikey'), 'public-test-key')
      return Response.json({ id: authorization, user_metadata: { role: 'admin' } })
    }
    if (pathname === '/rest/v1/rpc/is_toeic_admin') {
      assert.equal(request.headers.get('apikey'), 'public-test-key')
      if (roleCheckFails) return Response.json({ message: 'internal credential details' }, { status: 400 })
      return Response.json(authorization === 'Bearer admin-session')
    }
    assert.equal(pathname, '/auth/v1/admin/users')
    assert.equal(request.headers.get('apikey'), 'server-test-key')
    assert.deepEqual(await request.json(), {
      email: 'hoc-vien@example.invalid', password: credentials.password, email_confirm: true,
      user_metadata: { display_name: 'Học viên' },
    })
    if (createError) return Response.json({ code: createError, message: 'internal credential details' }, {
      status: 422, headers: { 'x-supabase-api-version': '2024-01-01' },
    })
    return Response.json({ id: 'new-user', email_confirmed_at: new Date().toISOString() })
  })

  const submit = (token?: string, body: unknown = credentials) => createStudent(new Request(origin, {
    method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: JSON.stringify(body),
  }), service)
  return { calls, service, submit, serverKeyReads: () => adminReads }
}

Deno.test('missing or invalid session and signed-in learners are rejected before the server key is used', async () => {
  const test = setup()
  assert.equal((await test.submit()).status, 401)
  assert.equal((await test.submit('forged-session')).status, 401)
  assert.equal((await test.submit('learner-session', { ...credentials, role: 'admin' })).status, 403)
  assert.deepEqual(test.calls, ['/auth/v1/user', '/auth/v1/user', '/rest/v1/rpc/is_toeic_admin'])
  assert.equal(test.serverKeyReads(), 0)
})

Deno.test('role check errors fail closed and do not expose the upstream message', async () => {
  const test = setup({ roleCheckFails: true })
  const response = await test.submit('admin-session')
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { error: 'server_error' })
  assert.equal(test.serverKeyReads(), 0)
})

Deno.test('admin creates a confirmed email account with no password or user data in the response', async () => {
  const test = setup()
  const response = await test.submit('admin-session', { ...credentials, role: 'service_role' })
  assert.equal(response.status, 201)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await response.json(), { ok: true })
  assert.deepEqual(test.calls, ['/auth/v1/user', '/rest/v1/rpc/is_toeic_admin', '/auth/v1/admin/users'])
  assert.equal(test.serverKeyReads(), 1)
})

Deno.test('invalid credentials and malformed requests do not call the admin API', async () => {
  const test = setup()
  for (const [key, value, error] of [
    ['name', '   ', 'invalid_name'], ['email', 'bad-email', 'invalid_email'],
    ['password', 'short123', 'weak_password'], ['password', 'ê'.repeat(40) + '9', 'weak_password'],
  ]) {
    const response = await test.submit('admin-session', { ...credentials, [key]: value })
    assert.equal(response.status, 422)
    assert.deepEqual(await response.json(), { error })
  }
  const malformed = await createStudent(new Request(origin, {
    method: 'POST', headers: { Authorization: 'Bearer admin-session' }, body: '{',
  }), test.service)
  assert.equal(malformed.status, 400)
  assert.equal(test.serverKeyReads(), 0)
})

Deno.test('duplicate and weak password errors map to safe responses', async () => {
  for (const [upstream, error, status] of [
    ['email_exists', 'email_exists', 409], ['user_already_exists', 'email_exists', 409],
    ['weak_password', 'weak_password', 422], ['unknown', 'server_error', 500],
  ] as const) {
    const response = await setup({ createError: upstream }).submit('admin-session')
    assert.equal(response.status, status)
    assert.deepEqual(await response.json(), { error })
  }
})
