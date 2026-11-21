import { useEffect, useState, type ReactNode } from 'react'
import {
  AudioLines, BookOpen, BookOpenText, ChartNoAxesColumnIncreasing, ClipboardCheck,
  Clock3, Flame, GraduationCap, House, Languages, ListChecks, Menu, Moon, Route, Settings2, Sun, Target, X,
} from 'lucide-react'
import type { Settings } from '../types'
import { ProgressBar } from './UI'

const groups = [
  { title: 'Học tập', items: [
    ['home', 'Tổng quan', House], ['roadmap', 'Lộ trình 550+', Route], ['listening', 'Listening', AudioLines],
    ['reading', 'Reading', BookOpen], ['vocabulary', 'Từ vựng', Languages], ['grammar', 'Ngữ pháp', BookOpenText],
  ] },
  { title: 'Luyện tập', items: [
    ['weakness', 'Luyện điểm yếu', Target], ['mini-test', 'Mini Test', ClipboardCheck], ['mock-test', 'Thi thử', Clock3], ['mistakes', 'Sổ câu sai', ListChecks],
  ] },
  { title: 'Theo dõi', items: [
    ['plan', 'Kế hoạch học', GraduationCap], ['statistics', 'Thống kê', ChartNoAxesColumnIncreasing], ['settings', 'Cài đặt', Settings2],
  ] },
] as const

const accountPages: Record<string, string> = {
  login: 'Đăng nhập', register: 'Đăng ký', 'forgot-password': 'Quên mật khẩu', 'reset-password': 'Đặt lại mật khẩu', account: 'Tài khoản',
}

export function Shell({ route, settings, xp, streak, storageIssue, onTheme, account, children }: {
  route: string; settings: Settings; xp: number; streak: number; storageIssue: boolean; onTheme: () => void; account: ReactNode; children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const page = route.split('/')[0]
  const current = page === 'parts' ? Number(route.split('/')[1]) <= 4 ? 'listening' : 'reading' : page
  const label = groups.flatMap(group => [...group.items]).find(([key]) => key === current)?.[1] ?? accountPages[page] ?? 'Phiên luyện tập'
  const level = Math.floor(xp / 100) + 1
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [open])
  return <div className="app-shell">
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus() }}>Đến nội dung</a>
    {open && <button type="button" className="nav-backdrop" onClick={() => setOpen(false)} aria-label="Đóng menu" />}
    <aside className={`sidebar ${open ? 'open' : ''}`} id="main-navigation">
      <div className="brand-row">
        <a className="brand" href="#home" onClick={() => setOpen(false)}><div className="brand-symbol"><GraduationCap size={23} strokeWidth={2.1} /></div><span>TOEIC 550+<small>STUDY</small></span></a>
        <button className="icon-button nav-close" onClick={() => setOpen(false)} aria-label="Đóng menu"><X size={20} /></button>
      </div>
      <nav aria-label="Điều hướng chính">
        {groups.map(group => <div className="nav-group" key={group.title}>
          <p>{group.title}</p>
          {group.items.map(([key, title, Icon]) =>
            <a className={current === key ? 'active' : ''} aria-current={current === key ? 'page' : undefined} href={`#${key}`} key={key} onClick={() => setOpen(false)}><Icon size={17} strokeWidth={1.9} />{title}</a>,
          )}
        </div>)}
      </nav>
      <div className="sidebar-foot">
        <div className="level-heading"><span><Flame size={15} /> Cấp {level}</span><strong>{xp} XP</strong></div>
        <ProgressBar value={xp % 100} label="Tiến độ lên cấp" />
        <p>{100 - xp % 100} XP đến cấp tiếp theo</p>
      </div>
    </aside>
    <div className="workspace">
      <header className="topbar">
        <div className="breadcrumbs"><button className="icon-button nav-toggle" onClick={() => setOpen(true)} aria-label="Mở menu" aria-expanded={open} aria-controls="main-navigation"><Menu size={22} /></button><span className="crumb-root">Không gian học</span><span className="crumb-slash">/</span><strong>{label}</strong></div>
        <div className="header-actions">
          <a className="streak-chip" href="#statistics" aria-label={`${streak} ngày học liên tục`}><Flame size={16} /> <span>{streak} ngày</span></a>
          <button className="icon-button theme-button" onClick={onTheme} aria-label={settings.theme === 'dark' ? 'Chuyển chế độ sáng' : 'Chuyển chế độ tối'}>{settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
          {account}
        </div>
      </header>
      <main className="main-content" id="main-content" tabIndex={-1}>
        {storageIssue && <p className="storage-warning" role="status">Trình duyệt đang chặn lưu tiến độ. Dữ liệu phiên học có thể mất khi tải lại trang.</p>}
        {children}
      </main>
    </div>
  </div>
}
