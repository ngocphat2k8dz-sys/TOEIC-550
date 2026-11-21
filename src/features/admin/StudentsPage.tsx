import { useEffect, useState } from 'react'
import { FunctionsHttpError } from '@supabase/supabase-js'
import { UserPlus } from 'lucide-react'
import { validateStudentCredentials, type StudentCredentials } from '../../../supabase/functions/_shared/studentCredentials'
import { PageIntro } from '../../components/UI'
import type { StudentDirectoryRow } from '../../lib/database.types'
import { supabase } from '../../lib/supabase'
import './students.css'

const pageSize = 25
const dateFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' })
const statuses: Record<StudentDirectoryRow['status'], string> = {
  active: 'Hoạt động', blocked: 'Bị khóa', unconfirmed: 'Chưa xác nhận',
}
const errors: Record<string, string> = {
  invalid_name: 'Nhập tên học viên từ 1 đến 60 ký tự.',
  invalid_email: 'Nhập địa chỉ email hợp lệ.',
  email_exists: 'Email này đã có tài khoản.',
  weak_password: 'Mật khẩu cần ít nhất 12 ký tự, có chữ và số, tối đa 72 byte.',
}
const serverError = 'Chưa thể tạo tài khoản. Vui lòng thử lại sau.'

function CreateStudentForm({ onCreated }: { onCreated: () => void }) {
  const [issued, setIssued] = useState<StudentCredentials | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(form: HTMLFormElement) {
    if (busy || !supabase) return
    const fields = new FormData(form)
    const parsed = validateStudentCredentials(Object.fromEntries(fields))
    setError('')
    if ('error' in parsed) {
      setError(errors[parsed.error])
      return
    }
    if (parsed.credentials.password !== fields.get('password-confirmation')) {
      setError('Hai ô mật khẩu cần giống nhau.')
      return
    }

    setBusy(true)
    try {
      const { data, error: invokeError } = await supabase.functions.invoke<{ ok: boolean }>('create-student', { body: parsed.credentials })
      if (invokeError || data?.ok !== true) {
        let message = serverError
        if (invokeError instanceof FunctionsHttpError) {
          const response = invokeError.context as Response
          if (response.status === 401) message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
          else if (response.status === 403) message = 'Bạn không có quyền thực hiện thao tác này.'
          else {
            const payload = await response.json().catch(() => null)
            if (typeof payload?.error === 'string' && Object.hasOwn(errors, payload.error)) message = errors[payload.error]
          }
        }
        setError(message)
        return
      }
      form.reset()
      setIssued(parsed.credentials)
      onCreated()
    } catch {
      setError(serverError)
    } finally {
      setBusy(false)
    }
  }

  return <section className="panel content-panel">
    <div className="section-heading"><div><h2>Tạo tài khoản</h2><p>Học viên có thể đăng nhập ngay sau khi nhận thông tin.</p></div><span className="icon-tile blue"><UserPlus size={20} /></span></div>
    {issued ? <div className="student-issued">
      <p role="status" className="account-notice">Tạo tài khoản thành công.</p>
      <dl className="student-credentials">
        <div><dt>Tên học viên</dt><dd>{issued.name}</dd></div>
        <div><dt>Email</dt><dd>{issued.email}</dd></div>
        <div><dt>Mật khẩu tạm thời</dt><dd><code>{issued.password}</code></dd></div>
      </dl>
      <button type="button" className="button secondary" onClick={() => setIssued(null)}>Đóng thông tin</button>
    </div> : <form className="account-form" onSubmit={event => { event.preventDefault(); void submit(event.currentTarget) }}>
      <label>Tên học viên <input name="name" autoComplete="off" maxLength={60} required disabled={busy} /></label>
      <label>Email <input name="email" type="email" autoComplete="off" maxLength={254} required disabled={busy} /></label>
      <label>Mật khẩu tạm thời <input name="password" type="password" autoComplete="new-password" aria-describedby="student-password-rules" required disabled={busy} /></label>
      <p id="student-password-rules" className="muted">Ít nhất 12 ký tự, có chữ và số.</p>
      <label>Xác nhận mật khẩu <input name="password-confirmation" type="password" autoComplete="new-password" required disabled={busy} /></label>
      {error && <p className="account-error" role="alert">{error}</p>}
      <button type="submit" className="button primary" disabled={busy}>{busy ? 'Đang tạo…' : 'Tạo tài khoản'}</button>
    </form>}
  </section>
}

export function StudentsPage() {
  const [query, setQuery] = useState({ page: 0 })
  const [result, setResult] = useState<{ query: typeof query; rows: StudentDirectoryRow[] | null }>()
  const rows = result?.query === query ? result.rows : undefined
  const page = query.page

  useEffect(() => {
    const client = supabase
    const controller = new AbortController()
    async function load() {
      try {
        if (!client) throw new Error('Supabase unavailable')
        const { data, error } = await client.rpc('list_toeic_students', {
          p_limit: pageSize + 1, p_offset: query.page * pageSize,
        }).abortSignal(controller.signal)
        if (error) throw error
        if (!controller.signal.aborted) setResult({ query, rows: data })
      } catch {
        if (!controller.signal.aborted) setResult({ query, rows: null })
      }
    }
    void load()
    return () => controller.abort()
  }, [query])

  return <>
    <PageIntro title="Quản lý học viên" description="Cấp tài khoản và xem số bài học viên đã hoàn thành." />
    <div className="student-admin-grid">
      <CreateStudentForm onCreated={() => setQuery({ page: 0 })} />
      <section className="panel content-panel">
        <div className="section-heading"><div><h2 id="student-directory-title">Danh sách học viên</h2></div></div>
        {rows === null ? <div className="student-issued">
          <p className="account-error" role="alert">Chưa tải được danh sách học viên.</p>
          <button type="button" className="button secondary" onClick={() => setQuery({ page })}>Thử lại</button>
        </div> : rows === undefined ? <p className="muted" role="status">Đang tải danh sách…</p> : rows.length ?
          <div className="student-directory" role="region" aria-labelledby="student-directory-title" tabIndex={0}>
            <table role="table"><thead role="rowgroup"><tr role="row"><th scope="col">Tên</th><th scope="col">Email</th><th scope="col">Ngày tạo</th><th scope="col">Trạng thái</th><th scope="col">Bài đã học</th></tr></thead>
              <tbody role="rowgroup">{rows.slice(0, pageSize).map(student => <tr key={student.id} role="row">
                <th scope="row" role="rowheader">{student.display_name}</th><td role="cell">{student.email ?? '—'}</td>
                <td role="cell" data-label="Ngày tạo"><time dateTime={student.created_at}>{dateFormat.format(new Date(student.created_at))}</time></td>
                <td role="cell" data-label="Trạng thái">{statuses[student.status]}</td><td role="cell" data-label="Bài đã học">{student.lessons_completed}</td>
              </tr>)}</tbody>
            </table>
          </div> : <p className="muted">Chưa có học viên ở trang này.</p>}
        {(page > 0 || (rows && rows.length > pageSize)) && <div className="student-pagination">
          <button type="button" className="button secondary" disabled={page === 0} onClick={() => setQuery({ page: page - 1 })}>Trang trước</button>
          <span>Trang {page + 1}</span>
          <button type="button" className="button secondary" disabled={!rows || rows.length <= pageSize} onClick={() => setQuery({ page: page + 1 })}>Trang sau</button>
        </div>}
      </section>
    </div>
  </>
}
