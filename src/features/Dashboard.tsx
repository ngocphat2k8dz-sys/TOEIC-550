import {
  AudioLines, BookOpen, CalendarDays, Check, CircleCheck, ClipboardCheck, Clock3, Crosshair, Flame,
  Headphones, Play, Target, TrendingUp,
} from 'lucide-react'
import { EmptyState, PageIntro, ProgressBar } from '../components/UI'
import { stages, studyPlan } from '../data/course'
import { compactDate, dayKey, durationText, getStats, weekDays, type TopicBreakdown } from '../progress'
import type { ProgressData } from '../types'

export function topicLabel(topic: TopicBreakdown) {
  return topic.topic === `Part ${topic.part}` || topic.topic.startsWith('Vocabulary –') || topic.topic.startsWith('Grammar –')
    ? topic.topic : `Part ${topic.part} · ${topic.topic}`
}

export function Dashboard({ progress, stats, onPlan }: {
  progress: ProgressData; stats: ReturnType<typeof getStats>; onPlan: (key: string, checked: boolean) => void
}) {
  const allLessons = stages.flatMap(stage => stage.lessons)
  const next = allLessons.find(lesson => !progress.completed.includes(lesson.id))
  const goal = progress.settings.dailyGoal
  const target = progress.settings.target
  const goalPercent = Math.min(100, Math.floor(stats.todaySeconds / (goal * 60) * 100))
  const targetPercent = stats.totalScore === null ? 0 : Math.min(100, Math.round(stats.totalScore / target * 100))
  const recent = progress.sessions.slice(-4).reverse()
  const weakest = stats.listening.total && stats.reading.total && stats.listening.rate !== stats.reading.rate
    ? stats.listening.rate < stats.reading.rate ? 'Listening' : 'Reading'
    : null
  const metrics = [
    { label: 'Chuỗi học tập', value: String(stats.streak), unit: 'ngày', detail: 'Ngày học liên tục', icon: Flame, tint: 'orange' },
    { label: 'Bài hoàn thành', value: String(progress.completed.length), unit: 'bài', detail: 'Bài học và bài kiểm tra', icon: CircleCheck, tint: 'green' },
    { label: 'Tỷ lệ đúng', value: `${stats.rate}%`, unit: '', detail: `${stats.correct} đúng · ${stats.total - stats.correct} sai`, icon: Crosshair, tint: 'purple' },
    { label: 'Thời gian học', value: durationText(stats.totalSeconds), unit: '', detail: 'Tổng thời gian đã ghi nhận', icon: Clock3, tint: 'blue' },
  ]
  const dateLabel = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
  return <>
    <PageIntro title="Tổng quan học tập" description="Theo dõi tiến độ và tiếp tục lộ trình Listening & Reading của bạn."
      action={<span className="date-chip"><CalendarDays size={16} />{dateLabel}</span>} />
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-art" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}images/study-hero.webp`} alt="" /></div>
      <div className="hero-copy">
        <span className="hero-badge"><Target size={15} /> Mục tiêu của bạn</span>
        <h2 id="hero-title">Chinh phục TOEIC {target}+</h2>
        <p>{next ? <>Bài tiếp theo · <strong>{next.title}</strong></> : 'Bạn đã hoàn thành lộ trình. Hãy làm một bài thi thử để duy trì kết quả.'}</p>
        <div className="hero-actions">
          <a className="button hero-primary" href={`#${next?.route ?? 'mock-test'}`}><Play size={15} fill="currentColor" />{progress.completed.length ? 'Tiếp tục học' : 'Bắt đầu học'}</a>
          <a className="button hero-secondary" href="#roadmap">Xem lộ trình</a>
        </div>
      </div>
    </section>

    <div className="metric-grid">
      {metrics.map(({ label, value, unit, detail, icon: Icon, tint }) => <div className="panel metric-card" key={label}>
        <span className={`icon-tile ${tint}`}><Icon size={19} strokeWidth={2} /></span>
        <div><p>{label}</p><strong>{value} {unit && <small>{unit}</small>}</strong><span className="metric-detail">{detail}</span></div>
      </div>)}
    </div>

    <div className="dashboard-grid">
      <section className="panel dash-panel" aria-labelledby="skills-title">
        <div className="section-heading"><div><h2 id="skills-title">Tiến độ kỹ năng</h2><p>Điểm ước tính luyện tập</p></div><a className="text-link" href="#statistics">Xem thống kê</a></div>
        <div className="skill-lines">
          <SkillLine icon={Headphones} tint="blue" title="Listening" href="listening" score={stats.listeningScore} rate={stats.listening.rate} total={stats.listening.total} />
          <SkillLine icon={BookOpen} tint="purple" title="Reading" href="reading" score={stats.readingScore} rate={stats.reading.rate} total={stats.reading.total} />
        </div>
        {weakest && <p className="weakest-skill"><Target size={15} /> Kỹ năng cần ưu tiên <strong>{weakest}</strong></p>}
        <div className="estimate-row"><div><Target size={17} /> <span>Tổng điểm ước tính <small>Mục tiêu {target}+</small></span></div><strong>{stats.totalScore ?? '—'} <small>/ {target}</small></strong></div>
        <ProgressBar label="Tiến độ tới điểm mục tiêu" value={targetPercent} />
      </section>
      <section className="panel dash-panel" aria-labelledby="weekly-title">
        <div className="section-heading"><div><h2 id="weekly-title">Tiến độ tuần</h2><p>Thời gian học từ thứ Hai đến Chủ Nhật</p></div><span className="icon-tile blue"><CalendarDays size={19} /></span></div>
        <WeekChart secondsByDay={stats.secondsByDay} goal={goal} />
        <div className="daily-summary"><div><span>Mục tiêu hôm nay</span><strong>{durationText(stats.todaySeconds)} / {goal} phút</strong></div><ProgressBar label="Mục tiêu học hôm nay" value={goalPercent} /></div>
      </section>
      <section className="panel dash-panel" aria-labelledby="history-title">
        <div className="section-heading"><div><h2 id="history-title">Lịch sử học tập</h2><p>Các phiên học gần đây</p></div></div>
        {recent.length ? <ul className="activity-list">{recent.map(session => <li key={session.id}>
          <span className="icon-tile blue"><ClipboardCheck size={17} /></span><div><strong>{session.title}</strong><small>{compactDate(session.at)} · {durationText(session.seconds)}</small></div>
          <b>{session.total ? `${session.correct}/${session.total}` : '✓'}</b>
        </li>)}</ul> : <EmptyState title="Bạn chưa có phiên học nào"><a href="#roadmap" className="text-link">Chọn bài học đầu tiên</a></EmptyState>}
      </section>
      <section className="panel dash-panel" aria-labelledby="next-title">
        <div className="section-heading"><div><h2 id="next-title">Nên học tiếp</h2><p>{stats.weak.length ? 'Các chủ đề có nhiều câu sai nhất' : 'Theo lộ trình và kế hoạch hôm nay'}</p></div><span className="icon-tile purple"><TrendingUp size={19} /></span></div>
        {stats.weak.length ? <ul className="activity-list">{stats.weak.slice(0, 3).map(topic => <li key={topic.key}><span className="icon-tile orange"><Target size={17} /></span><div><strong>{topicLabel(topic)}</strong><small>{topic.wrong} câu sai · {topic.rate}% đúng</small></div><a className="text-link" href={`#weakness/${encodeURIComponent(topic.key)}`}>Luyện</a></li>)}</ul>
          : <TodayTask onPlan={onPlan} progress={progress} />}
      </section>
    </div>
  </>
}

function SkillLine({ icon: Icon, tint, title, href, score, rate, total }: {
  icon: typeof AudioLines; tint: 'blue' | 'purple'; title: string; href: string; score: number | null; rate: number; total: number
}) {
  return <div className="skill-line">
    <div className="skill-row"><span className={`icon-tile ${tint}`}><Icon size={18} /></span><div><a href={`#${href}`}>{title}</a><small>{total ? `${rate}% đúng · ${total} lượt trả lời` : 'Chưa có kết quả'}</small></div><strong>{score ?? '—'} <small>/ 495</small></strong></div>
    <ProgressBar label={`Tỷ lệ đúng ${title}`} value={rate} color={tint} />
  </div>
}

export function WeekChart({ secondsByDay, goal }: { secondsByDay: Record<string, number>; goal: number }) {
  const days = weekDays()
  const amounts = days.map(date => secondsByDay[dayKey(date)] ?? 0)
  const max = Math.ceil(Math.max(goal * 60, ...amounts, 600) / 600) * 600
  return <div className="week-chart">
    <div className="chart-axis" aria-hidden="true"><span>{max / 60}p</span><span>{max / 120}p</span><span>0p</span></div>
    <div className="chart-body">
      <div className="chart-gridlines" aria-hidden="true"><i /><i /><i /></div>
      <div className="chart-columns">{days.map((date, index) => {
        const key = dayKey(date)
        return <div className={`chart-column ${key === dayKey() ? 'current' : ''}`} key={key} aria-label={`${studyPlan[index].day}: ${durationText(amounts[index])}`} title={`${studyPlan[index].day} · ${durationText(amounts[index])}`}>
          <div className="chart-bar"><i style={{ height: amounts[index] ? `${Math.max(4, amounts[index] / max * 100)}%` : '0%' }} /></div>
          <span>{studyPlan[index].short}</span>
        </div>
      })}</div>
    </div>
  </div>
}

function TodayTask({ progress, onPlan }: { progress: ProgressData; onPlan: (key: string, checked: boolean) => void }) {
  const today = studyPlan[(new Date().getDay() + 6) % 7]
  const checked = Boolean(progress.plan[dayKey()])
  return <div className="today-task">
    <div><span className="tag">{today.day}</span><h3>{today.task}</h3><p>{today.detail}</p></div>
    <div className="button-group">
      <a className="button secondary" href={`#${today.route}`}>Mở bài</a>
      <button className={`button ${checked ? 'ghost' : 'secondary'}`} onClick={() => onPlan(dayKey(), !checked)} aria-pressed={checked}><Check size={16} />{checked ? 'Đã hoàn thành' : 'Đánh dấu xong'}</button>
    </div>
  </div>
}
