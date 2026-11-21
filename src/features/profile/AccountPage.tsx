import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { RefreshCw, Save, UserRound } from 'lucide-react'
import { PageIntro } from '../../components/UI'
import { compactDate, durationText } from '../../progress'
import type { useLearning } from '../../hooks/useLearning'
import { ChangePassword } from './ChangePassword'

type Learning = ReturnType<typeof useLearning>

export function AccountPage({ user, learning, streak, seconds, notice }: {
  user: User; learning: Learning; streak: number; seconds: number; notice: string
}) {
  const [draft, setDraft] = useState<{ name?: string; target?: string; goal?: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const { progress, displayName, ready } = learning
  const name = draft.name ?? displayName
  const target = draft.target ?? String(progress.settings.target)
  const goal = draft.goal ?? String(progress.settings.dailyGoal)
  return <>
    <PageIntro title="Hồ sơ tài khoản" description="Quản lý thông tin cá nhân, mục tiêu và tiến độ đồng bộ." />
    {notice && <p className="account-notice profile-notice" role="status">{notice}</p>}
    <div className="dashboard-grid">
      <section className="panel content-panel">
        <div className="section-heading"><div><h2>Thông tin tài khoản</h2><p>Ngày đăng ký {compactDate(user.created_at)}</p></div><span className="icon-tile blue"><UserRound size={20} /></span></div>
        <p className="profile-email"><strong>Email</strong><span>{user.email}</span></p>
        {ready ? <form className="account-form" onSubmit={event => {
          event.preventDefault()
          learning.dispatch({ type: 'preferences', displayName: name.trim(), settings: {
            ...(draft.target !== undefined && { target: Number(target) }),
            ...(draft.goal !== undefined && { dailyGoal: Number(goal) }),
          } })
          setDraft({})
          setSubmitted(true)
        }}>
          <label>Tên hiển thị <input value={name} maxLength={60} autoComplete="nickname" onChange={event => { setDraft({ ...draft, name: event.target.value }); setSubmitted(false) }} /></label>
          <label>Mục tiêu điểm TOEIC <input type="number" min={10} max={990} step={5} required value={target} onChange={event => { setDraft({ ...draft, target: event.target.value }); setSubmitted(false) }} /></label>
          <label>Mục tiêu mỗi ngày (phút) <input type="number" min={1} max={360} required value={goal} onChange={event => { setDraft({ ...draft, goal: event.target.value }); setSubmitted(false) }} /></label>
          <button className="button primary" type="submit"><Save size={16} /> Lưu hồ sơ</button>
          {submitted && <p className="account-notice" role="status">{learning.pending ? 'Đã ghi thay đổi trên thiết bị. Đang chờ đồng bộ.' : 'Đã lưu hồ sơ.'}</p>}
        </form> : <p className="muted" role="status">{learning.phase === 'connecting' ? 'Đang tải hồ sơ…' : 'Chưa tải được dữ liệu tài khoản. Hãy thử đồng bộ khi có mạng.'}</p>}
      </section>
      <section className="panel content-panel">
        <div className="section-heading"><div><h2>Tiến độ và đồng bộ</h2><p>Thống kê tài khoản hiện tại</p></div></div>
        {ready && <dl className="profile-summary">
          <div><dt>Cấp</dt><dd>{Math.floor(progress.xp / 100) + 1}</dd></div>
          <div><dt>Điểm kinh nghiệm</dt><dd>{progress.xp} XP</dd></div>
          <div><dt>Chuỗi học</dt><dd>{streak} ngày</dd></div>
          <div><dt>Tổng thời gian</dt><dd>{durationText(seconds)}</dd></div>
        </dl>}
        <button className="button secondary" onClick={() => void learning.sync()} disabled={learning.phase === 'connecting'}><RefreshCw size={16} /> Đồng bộ ngay</button>
        {learning.phase === 'synced' && !learning.pending && <p className="profile-synced" role="status">Tiến độ đã đồng bộ.</p>}
      </section>
      <ChangePassword />
    </div>
  </>
}
