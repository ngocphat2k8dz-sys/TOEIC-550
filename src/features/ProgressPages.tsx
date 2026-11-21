import { useState } from 'react'
import { BookOpen, ChartNoAxesColumnIncreasing, Check, Flame, Moon, RotateCcw, Sun, Target, TriangleAlert } from 'lucide-react'
import { AnswerExplanation, optionText, Passage } from '../components/QuestionContent'
import { EmptyState, PageIntro, ProgressBar } from '../components/UI'
import { guideFor, parts } from '../data/course'
import { questionGroup } from '../data/beginnerQuestion'
import { questionById } from '../data/questions'
import { compactDate, durationText, getStats } from '../progress'
import type { ProgressData, Question, Settings, Speed } from '../types'
import { topicLabel, WeekChart } from './Dashboard'

type Stats = ReturnType<typeof getStats>
type Start = (questions: Question[], title: string) => void

export function StatisticsPage({ progress, stats }: { progress: ProgressData; stats: Stats }) {
  const strong = [...stats.topics].filter(topic => topic.correct > 0).sort((a, b) => b.rate - a.rate || b.total - a.total).slice(0, 4)
  return <>
    <PageIntro title="Thống kê học tập" description="Xem tỷ lệ đúng, thời gian học và các chủ đề cần ôn thêm." />
    <div className="metric-grid">
      {[
        { label: 'Số câu đã làm', value: stats.total, detail: `${stats.correct} đúng · ${stats.total - stats.correct} sai`, Icon: ChartNoAxesColumnIncreasing, tint: 'blue' },
        { label: 'Tỷ lệ đúng tổng', value: `${stats.rate}%`, detail: 'Toàn bộ bài luyện và quiz', Icon: Target, tint: 'purple' },
        { label: 'Từ đã nhớ', value: stats.known, detail: 'Từ đã đánh dấu trong flashcard', Icon: BookOpen, tint: 'green' },
        { label: 'Chuỗi học tập', value: `${stats.streak} ngày`, detail: durationText(stats.totalSeconds) + ' đã học', Icon: Flame, tint: 'orange' },
      ].map(({ label, value, detail, Icon, tint }) => <div className="panel metric-card" key={label}><span className={`icon-tile ${tint}`}><Icon size={19} /></span><div><p>{label}</p><strong>{value}</strong><span className="metric-detail">{detail}</span></div></div>)}
    </div>
    <div className="dashboard-grid">
      <section className="panel content-panel">
        <div className="section-heading"><div><h2>Độ chính xác theo kỹ năng</h2><p>Tính từ ngân hàng câu hỏi TOEIC</p></div></div>
        {([{ name: 'Listening', value: stats.listening, color: 'blue' }, { name: 'Reading', value: stats.reading, color: 'purple' }] as const).map(({ name, value, color }) => <div className="breakdown-row" key={name}><div><strong>{name}</strong><span>{value.total ? `${value.rate}% · ${value.correct}/${value.total}` : 'Chưa làm bài'}</span></div><ProgressBar label={name} value={value.rate} color={color} /></div>)}
        <h3 className="small-section-title">Từng Part</h3>
        {stats.parts.map(part => <div className="breakdown-row" key={part.part}><div><strong>Part {part.part} · {guideFor(part.part).name}</strong><span>{part.total ? `${part.rate}% · ${part.correct}/${part.total}` : '—'}</span></div><ProgressBar label={`Tỷ lệ đúng Part ${part.part}`} value={part.rate} color={part.part > 4 ? 'purple' : 'blue'} /></div>)}
      </section>
      <section className="panel content-panel"><div className="section-heading"><div><h2>Thời gian học trong tuần</h2><p>Thời gian từ thứ Hai đến Chủ Nhật</p></div></div><WeekChart secondsByDay={stats.secondsByDay} goal={progress.settings.dailyGoal} /></section>
      <section className="panel content-panel"><div className="section-heading"><div><h2>Chủ đề làm tốt</h2><p>Xếp theo tỷ lệ đúng</p></div></div>
        {strong.length ? <ul className="activity-list">{strong.map(topic => <li key={topic.key}><span className="icon-tile green"><Check size={17} /></span><div><strong>{topicLabel(topic)}</strong><small>{topic.correct}/{topic.total} câu đúng</small></div><b>{topic.rate}%</b></li>)}</ul> : <EmptyState title="Chưa đủ dữ liệu về chủ đề làm tốt" />}
      </section>
      <section className="panel content-panel"><div className="section-heading"><div><h2>Chủ đề cần ôn</h2><p>Xếp theo số câu sai</p></div></div>
        {stats.weak.length ? <ul className="activity-list">{stats.weak.slice(0, 4).map(topic => <li key={topic.key}><span className="icon-tile orange"><Target size={17} /></span><div><strong>{topicLabel(topic)}</strong><small>{topic.wrong} câu sai · {topic.rate}% đúng</small></div><a className="text-link" href={`#weakness/${encodeURIComponent(topic.key)}`}>Luyện</a></li>)}</ul> : <EmptyState title="Chưa ghi nhận chủ đề có câu sai" />}
      </section>
    </div>
  </>
}

export function WeaknessPage({ stats, selected, onStart }: { stats: Stats; selected?: string; onStart: Start }) {
  const visible = selected ? stats.weak.filter(topic => topic.key === selected) : stats.weak
  const createSet = (keys: string[]) => {
    const priorities = stats.weak.filter(topic => keys.includes(topic.key))
    const wrongIds = priorities.flatMap(topic => topic.questionIds)
    const similarIds = [...questionById.values()].filter(question => priorities.some(topic => question.part === topic.part && question.topic === topic.topic)).map(question => question.id)
    return [...new Set([...wrongIds, ...similarIds])].slice(0, 10).flatMap(id => questionById.get(id) ?? [])
  }
  return <>
    <PageIntro title="Luyện điểm yếu" description="Ôn câu đã làm sai và luyện thêm câu cùng chủ đề. Chủ đề có nhiều lỗi nhất được ưu tiên."
      action={visible.length > 0 && <button className="button primary" onClick={() => onStart(createSet(visible.map(topic => topic.key)), 'Luyện điểm yếu')}><Target size={17} /> Bắt đầu ôn điểm yếu</button>} />
    {selected && <a className="text-link back-link" href="#weakness">Xem tất cả chủ đề</a>}
    <section className="panel content-panel">
      <div className="section-heading"><div><h2>Chủ đề ưu tiên</h2><p>Dựa trên lịch sử trả lời của bạn</p></div></div>
      {visible.length ? <ul className="activity-list">{visible.map(topic => <li key={topic.key}><span className="icon-tile orange"><Target size={18} /></span><div><strong>{topicLabel(topic)}</strong><small>{topic.wrong} lượt sai · {topic.rate}% đúng trên {topic.total} lượt</small></div><button className="button secondary" onClick={() => onStart(createSet([topic.key]), `Luyện điểm yếu · ${topicLabel(topic)}`)}>Luyện chủ đề</button></li>)}</ul>
        : <EmptyState title="Chưa có chủ đề cần ôn ở đây"><p>Làm một bài luyện hoặc Mini Test để nhận đề xuất dựa trên các câu bạn trả lời sai.</p><a className="button primary" href="#mini-test">Mở Mini Test</a></EmptyState>}
    </section>
  </>
}

export function MistakesPage({ progress, onStart, onUnderstand }: {
  progress: ProgressData; onStart: Start; onUnderstand: (id: string, checked: boolean) => void
}) {
  const [part, setPart] = useState('')
  const [topic, setTopic] = useState('')
  const [openOnly, setOpenOnly] = useState(false)
  const ids = new Set<string>()
  const mistakes = [...progress.answers].reverse().flatMap(record => {
    const question = questionById.get(record.questionId)
    if (record.correct || !question || ids.has(question.id)) return []
    ids.add(question.id)
    return [{ question, record }]
  })
  const partMatches = mistakes.filter(({ question }) => !part || (question.track ?? String(question.part)) === part)
  const options = [...new Set(partMatches.map(({ question }) => question.topic))].sort()
  const filtered = partMatches.filter(({ question }) => (!topic || topic === question.topic) && (!openOnly || !progress.understood[question.id]))
  return <>
    <PageIntro title="Sổ câu sai" description="Xem lại lựa chọn, đọc giải thích hoặc thử làm lại các câu đã sai."
      action={filtered.length > 0 && <button className="button primary" onClick={() => onStart(filtered.map(item => item.question), 'Làm lại câu sai')}><RotateCcw size={17} /> Làm lại câu đã lọc</button>} />
    <div className="panel filters">
      <label>Part hoặc nhóm học<select value={part} onChange={event => { setPart(event.target.value); setTopic('') }}>
        <option value="">Tất cả nhóm</option><option value="foundation">Tiếng Anh nền tảng</option><option value="ipa">Phát âm IPA</option><option value="beginner-listening">Nghe từ đầu</option>
        {parts.map(item => <option key={item} value={item}>Part {item}</option>)}
      </select></label>
      <label>Chủ đề<select value={topic} onChange={event => setTopic(event.target.value)}><option value="">Tất cả chủ đề</option>{options.map(item => <option key={item}>{item}</option>)}</select></label>
      <label className="checkbox-label"><input type="checkbox" checked={openOnly} onChange={event => setOpenOnly(event.target.checked)} /> Chỉ câu chưa hiểu</label>
    </div>
    {!filtered.length && <div className="panel content-panel"><EmptyState title={mistakes.length ? 'Không có câu sai phù hợp với bộ lọc' : 'Sổ câu sai đang trống'}>{!mistakes.length && <a href="#roadmap" className="text-link">Bắt đầu một bài luyện</a>}</EmptyState></div>}
    <div className="mistake-list">{filtered.map(({ question, record }) => <article className="panel content-panel mistake-card" key={question.id}>
      <div className="section-heading"><div><div className="mistake-meta"><span className="tag">{questionGroup(question)}</span><span>{question.topic}</span><span>{compactDate(record.at)}</span></div><h2>{question.prompt}</h2></div>
        <label className="checkbox-label"><input type="checkbox" checked={Boolean(progress.understood[question.id])} onChange={event => onUnderstand(question.id, event.target.checked)} /> Đã hiểu</label>
      </div>
      <p className="mistake-choice"><b>Bạn chọn</b> · {record.choice === null ? 'Bỏ trống' : optionText(question, record.choice)}<br /><b>Đáp án đúng</b> · {optionText(question, question.answer)}</p>
      <div className="mistake-details"><details><summary>Xem giải thích</summary>
        {question.image && <img className="question-image" src={question.image.src} alt={question.image.alt} />}
        {question.passages?.map(passage => <Passage key={passage.title} passage={passage} highlight={false} />)}
        <AnswerExplanation question={question} choice={record.choice} />
      </details><button className="button secondary" onClick={() => onStart([question], 'Làm lại câu sai')}><RotateCcw size={16} /> Làm lại câu này</button></div>
    </article>)}</div>
  </>
}

export function SettingsPage({ settings, onChange, onReset, accountMode }: {
  settings: Settings; onChange: (settings: Partial<Settings>) => void; onReset: () => void; accountMode: boolean
}) {
  const [confirm, setConfirm] = useState(false)
  const [target, setTarget] = useState<string>()
  const [goal, setGoal] = useState<string>()
  const [saved, setSaved] = useState('')
  return <>
    <PageIntro title="Cài đặt" description="Cá nhân hóa mục tiêu, giao diện và tốc độ bài nghe." />
    <div className="dashboard-grid">
      <section className="panel content-panel">
        <div className="section-heading"><div><h2>Giao diện và âm thanh</h2><p>{accountMode ? 'Đồng bộ theo tài khoản' : 'Áp dụng cho thiết bị hiện tại'}</p></div></div>
        <div className="setting-row"><div><strong>Chế độ tối</strong><small>Điều chỉnh màu nền và độ tương phản</small></div><button className={`button ${settings.theme === 'dark' ? 'primary' : 'secondary'}`}
          aria-pressed={settings.theme === 'dark'} onClick={() => onChange({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}>{settings.theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />} {settings.theme === 'dark' ? 'Đang bật' : 'Đang tắt'}</button></div>
        <label className="setting-row"><div><strong>Tốc độ Listening</strong><small>Tốc độ mặc định khi mở câu hỏi</small></div><select aria-label="Tốc độ Listening" value={settings.speed} onChange={event => onChange({ speed: Number(event.target.value) as Speed })}><option value={0.75}>0.75×</option><option value={1}>1×</option><option value={1.25}>1.25×</option></select></label>
      </section>
      <section className="panel content-panel">
        <div className="section-heading"><div><h2>Mục tiêu học tập</h2><p>Hiển thị trên dashboard và tiến độ tuần</p></div></div>
        <form className="settings-form" onSubmit={event => {
          event.preventDefault()
          onChange({ ...(target !== undefined && { target: Number(target) }), ...(goal !== undefined && { dailyGoal: Number(goal) }) })
          setTarget(undefined)
          setGoal(undefined)
          setSaved('Đã lưu mục tiêu.')
        }}>
          <label>Mục tiêu điểm TOEIC <input type="number" min={10} max={990} step={5} required value={target ?? settings.target} onChange={event => { setTarget(event.target.value); setSaved('') }} /></label>
          <label>Mục tiêu mỗi ngày (phút) <input type="number" min={1} max={360} step={1} required value={goal ?? settings.dailyGoal} onChange={event => { setGoal(event.target.value); setSaved('') }} /></label>
          <div className="button-group"><button className="button primary" type="submit"><Check size={17} /> Lưu mục tiêu</button><span className="muted" role="status">{saved}</span></div>
        </form>
      </section>
      <section className="panel content-panel reset-panel">
        <div className="section-heading"><div><h2>Dữ liệu học tập</h2><p>Xóa lịch sử, câu sai, flashcard đã học, kế hoạch và XP {accountMode ? 'của tài khoản này trên mọi thiết bị' : 'trên trình duyệt này'}.</p></div><button className="button danger" onClick={() => setConfirm(true)}><RotateCcw size={16} /> Đặt lại tiến độ</button></div>
      </section>
    </div>
    {confirm && <div className="dialog-backdrop" onClick={() => setConfirm(false)}><section className="panel dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title" onClick={event => event.stopPropagation()} onKeyDown={event => { if (event.key === 'Escape') setConfirm(false) }}>
      <span className="icon-tile orange"><TriangleAlert size={22} /></span><h2 id="reset-title">Xóa toàn bộ tiến độ?</h2><p>Tùy chọn giao diện và mục tiêu vẫn được lưu. Dữ liệu học đã xóa không thể khôi phục.</p>
      <div className="button-group"><button className="button secondary" autoFocus onClick={() => setConfirm(false)}>Hủy</button><button className="button danger" onClick={() => { onReset(); setConfirm(false); setSaved('Đã xóa tiến độ học.') }}>Xóa tiến độ</button></div>
    </section></div>}
  </>
}
