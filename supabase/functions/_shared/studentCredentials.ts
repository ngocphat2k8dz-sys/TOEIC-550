export interface StudentCredentials {
  name: string
  email: string
  password: string
}

export type StudentValidationError = 'invalid_name' | 'invalid_email' | 'weak_password'

export function validStudentPassword(password: string) {
  return Array.from(password).length >= 12 && new TextEncoder().encode(password).length <= 72
    && /\p{L}/u.test(password) && /\p{N}/u.test(password) && !password.includes('\0')
}

export function validateStudentCredentials(input: unknown): { credentials: StudentCredentials } | { error: StudentValidationError } {
  const fields = input && typeof input === 'object' ? input as Record<string, unknown> : {}
  const name = typeof fields.name === 'string' ? fields.name.trim() : ''
  const email = typeof fields.email === 'string' ? fields.email.trim().toLowerCase() : ''
  const password = typeof fields.password === 'string' ? fields.password : ''

  if (!name || name.length > 60 || name.includes('\0')) return { error: 'invalid_name' }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.includes('\0')) return { error: 'invalid_email' }
  if (!validStudentPassword(password)) return { error: 'weak_password' }
  return { credentials: { name, email, password } }
}
