import type { ReactNode } from 'react'
import { BookOpen, GraduationCap, Headphones, Sprout } from 'lucide-react'
import { EmptyState } from '../../components/UI'

export function PublicLayout({ children }: { children: ReactNode }) {
  return <>
    <header className="welcome-topbar">
      <a className="brand" href="#welcome"><div className="brand-symbol"><GraduationCap size={23} /></div><span>TOEIC 550+<small>STUDY</small></span></a>
      <nav aria-label="Tài khoản" className="button-group"><a className="button secondary" href="#login">Đăng nhập</a><a className="button primary" href="#register">Đăng ký</a></nav>
    </header>
    <main className="welcome-main" id="public-main">{children}</main>
  </>
}

export function AuthLoading() {
  return <PublicLayout><EmptyState title="Đang kiểm tra phiên đăng nhập"><p role="status">Vui lòng đợi trong giây lát.</p></EmptyState></PublicLayout>
}

export function Welcome() {
  return <>
    <section className="hero welcome-hero">
      <div className="hero-art" aria-hidden="true"><img src={import.meta.env.BASE_URL + 'images/study-hero.webp'} alt="" /></div>
      <div className="hero-copy">
        <span className="hero-badge"><Sprout size={16} /> Dành cho người Việt học từ đầu</span>
        <h1>Từ mất gốc đến TOEIC 550+</h1>
        <p>Học từng bước bằng tiếng Việt. Bắt đầu với âm, từ và câu ngắn rồi chuyển sang luyện Listening và Reading theo mục tiêu.</p>
        <div className="hero-actions"><a className="button hero-primary" href="#register">Tạo tài khoản</a><a className="button hero-secondary" href="#login">Đăng nhập để học</a></div>
      </div>
    </section>
    <div className="welcome-features">
      <article className="panel content-panel"><span className="icon-tile green"><Sprout size={20} /></span><h2>Mất gốc và xây nền</h2><p>Làm quen phát âm, từ thường dùng và cấu trúc câu.</p></article>
      <article className="panel content-panel"><span className="icon-tile blue"><Headphones size={20} /></span><h2>TOEIC 350 và 450</h2><p>Đi từ câu ngắn đến các dạng bài và chiến thuật từng Part.</p></article>
      <article className="panel content-panel"><span className="icon-tile purple"><BookOpen size={20} /></span><h2>TOEIC 550+</h2><p>Luyện đề có đồng hồ, xem lời giải và theo dõi lỗi sai.</p></article>
    </div>
  </>
}
