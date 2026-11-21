import { useState } from 'react'
import {
  BookOpen, CalendarDays, Circle, CircleCheck, ClipboardCheck, Clock3, FileText,
  Headphones, KeyRound, Lightbulb, Play, Target, TriangleAlert,
} from 'lucide-react'
import { PageIntro, ProgressBar } from '../components/UI'
import { guideFor, guides, lessonForPart, parts, skillOf, studyPlan, type CourseLesson } from '../data/course'
import { attemptedLesson, learningPath } from '../data/path'
import { grammarLessons } from '../data/grammar'
import { bank, createMini, createMock, mockDistribution } from '../data/questions'
import { vocabulary } from '../data/vocabulary'
import { accuracy, dayKey, weekDays } from '../progress'
import type { Part, ProgressData, Question, QuizConfig, Skill } from '../types'
import './study-pages.css'

const partLabels: Record<Part, string> = {
  1: 'Mô tả ảnh',
  2: 'Hỏi và đáp',
  3: 'Hội thoại',
  4: 'Bài nói ngắn',
  5: 'Hoàn thành câu',
  6: 'Hoàn thành đoạn văn',
  7: 'Đọc hiểu',
}

const topicLabels: Record<string, string> = {
  Noun: 'Danh từ',
  Verb: 'Động từ',
  Adjective: 'Tính từ',
  Adverb: 'Trạng từ',
  Tense: 'Thì của động từ',
  'Passive voice': 'Câu bị động',
  Preposition: 'Giới từ',
  Conjunction: 'Liên từ',
  'Relative clause': 'Mệnh đề quan hệ',
  Vocabulary: 'Từ vựng',
  'Word form': 'Dạng từ',
  Email: 'Email',
  Notice: 'Thông báo',
  Advertisement: 'Quảng cáo',
  Memo: 'Bản ghi nhớ',
  Letter: 'Thư',
  'Single Passage': 'Một văn bản',
  'Double Passage': 'Hai văn bản',
  'Triple Passage': 'Ba văn bản',
}

export function SkillPage({ skill }: { skill: Skill }) {
  const listening = skill === 'Listening'
  const SkillIcon = listening ? Headphones : BookOpen
  const skillGuides = guides.filter(guide => skillOf(guide.part) === skill)
  return <>
    <PageIntro title={skill} description={listening
      ? 'Luyện nghe từ mô tả ảnh đến hội thoại và thông báo ngắn, với giải thích bằng tiếng Việt.'
      : 'Luyện nhận diện từ loại, điền đoạn văn và tìm thông tin trong văn bản.'} />
    <div className="dashboard-grid study-grid">
      {skillGuides.map(guide => {
        const questionCount = bank.filter(question => question.part === guide.part).length
        return <section key={guide.part} className="panel content-panel study-card" aria-labelledby={`skill-part-${guide.part}`}>
          <div className="study-card-overview">
            <span className={`icon-tile ${listening ? 'blue' : 'purple'}`}><SkillIcon size={20} aria-hidden="true" /></span>
            <span className="tag">Part {guide.part}</span>
          </div>
          <h2 id={`skill-part-${guide.part}`}>{guide.name}</h2>
          <p className="study-card-subtitle">{partLabels[guide.part]}</p>
          <p className="muted">{guide.description}</p>
          <div className="study-card-footer">
            <small className="muted">{questionCount} câu luyện tập</small>
            <a className="button secondary" href={`#parts/${guide.part}`} aria-label={`Học Part ${guide.part} · ${partLabels[guide.part]}`}>Học Part {guide.part}</a>
          </div>
        </section>
      })}
    </div>
  </>
}

export function PartPage({ part, topic, onStart }: {
  part: Part
  topic?: string
  onStart: (questions: Question[], title: string, lessonId: string) => void
}) {
  const guide = guideFor(part)
  const skill = skillOf(part)
  const allQuestions = bank.filter(question => question.part === part)
  const topics = skill === 'Reading' ? [...new Set(allQuestions.map(question => question.topic))] : []
  const selected = topics.find(item => item.toLowerCase() === topic?.toLowerCase())
  const questions = selected ? allQuestions.filter(question => question.topic === selected) : allQuestions
  const info = [
    { title: 'Cách làm', body: guide.method, icon: Target, tint: 'blue' },
    { title: skill === 'Listening' ? 'Từ khóa cần nghe' : 'Tín hiệu cần tìm', body: guide.keywords, icon: KeyRound, tint: 'purple' },
    { title: 'Bẫy thường gặp', body: guide.trap, icon: TriangleAlert, tint: 'orange' },
    { title: 'Mẹo làm bài', body: guide.tip, icon: Lightbulb, tint: 'green' },
  ]
  return <>
    <PageIntro eyebrow={`${skill} · Part ${part}`} title={guide.name} description={guide.description}
      action={<a className="button secondary" href={`#${skill.toLowerCase()}`}>Các Part {skill}</a>} />
    <section className="panel content-panel study-card" aria-labelledby="part-guide-title">
      <h2 id="part-guide-title">Học dạng bài</h2>
      <div className="study-guide-grid">
        {info.map(({ title, body, icon: Icon, tint }) => <div className="study-guide-item" key={title}>
          <span className={`icon-tile ${tint}`}><Icon size={18} aria-hidden="true" /></span>
          <div><h3>{title}</h3><p className="muted">{body}</p></div>
        </div>)}
      </div>
    </section>
    <section className="panel content-panel study-card" aria-labelledby="part-practice-title">
      <div className="section-heading">
        <div><h2 id="part-practice-title">Luyện tập</h2><p>{selected ? `${topicLabels[selected] ?? selected} · ` : ''}{questions.length} câu kèm lời giải tiếng Việt</p></div>
      </div>
      {topics.length > 0 && <nav aria-label="Lọc chủ đề bài tập" className="button-group study-topic-list">
        <a className={`button ${!selected ? 'primary' : 'secondary'}`} aria-current={!selected ? 'page' : undefined} href={`#parts/${part}`}>Tất cả chủ đề</a>
        {topics.map(item => <a key={item} className={`button ${item === selected ? 'primary' : 'secondary'}`}
          aria-current={item === selected ? 'page' : undefined} href={`#parts/${part}/${encodeURIComponent(item)}`}>{topicLabels[item] ?? item}</a>)}
      </nav>}
      <button className="button primary study-launch" type="button" onClick={() => onStart(
        questions,
        `Part ${part} · ${selected ? topicLabels[selected] ?? selected : guide.name}`,
        lessonForPart(part, selected),
      )}><Play size={16} aria-hidden="true" /> Bắt đầu luyện tập</button>
    </section>
  </>
}

function hasStartedLesson(lesson: CourseLesson, progress: ProgressData, attempted: Set<string>) {
  if (attemptedLesson(lesson.id, attempted)) return true
  const [section, target, topic] = lesson.route.split('/')
  if (section === 'parts') {
    return bank.some(question => String(question.part) === target && (!topic || question.topic === decodeURIComponent(topic)) && attempted.has(question.id))
  }
  if (section === 'grammar') {
    return grammarLessons.some(item => item.id === lesson.id && item.questions.some(question => attempted.has(question.id)))
  }
  if (section === 'vocabulary') {
    return vocabulary.some(word => word.topic === decodeURIComponent(target) && word.id in progress.vocabulary)
  }
  if (section === 'beginner-vocabulary') {
    return Object.keys(progress.vocabulary).some(id => id.startsWith('basic-word-'))
  }
  return lesson.id === 'mock-target' && progress.sessions.some(session => session.mode === 'mock')
}

export function RoadmapPage({ progress, selected }: { progress: ProgressData; selected?: string }) {
  const attempted = new Set(progress.answers.filter(record => record.choice !== null).map(record => record.questionId))
  const completed = new Set(progress.completed)
  const totalLessons = learningPath.flatMap(stage => stage.lessons).length
  const finishedLessons = learningPath.flatMap(stage => stage.lessons.filter(lesson => completed.has(lesson.id))).length
  const active = learningPath.find(stage => stage.id === selected)
  return <>
    <PageIntro title="Lộ trình học" description="Các bài được xếp theo thứ tự gợi ý. Bạn có thể mở giai đoạn phù hợp với mình."
      action={<a className="button secondary" href="#onboarding">Chọn điểm bắt đầu</a>} />
    <nav className="path-tabs" aria-label="Chọn giai đoạn lộ trình">
      <a className={`button ${!active ? 'primary' : 'secondary'}`} href="#roadmap">Tất cả giai đoạn</a>
      {learningPath.map(stage => <a key={stage.id} className={`button ${stage === active ? 'primary' : 'secondary'}`} href={`#roadmap/${stage.id}`}>{stage.title}</a>)}
    </nav>
    <section className="panel content-panel study-card" aria-labelledby="roadmap-progress">
      <div className="section-heading"><div><h2 id="roadmap-progress">Tiến độ lộ trình</h2><p>{finishedLessons}/{totalLessons} bài hoàn thành</p></div><span className="icon-tile blue"><Target size={20} aria-hidden="true" /></span></div>
      <ProgressBar label="Tiến độ lộ trình" value={accuracy(finishedLessons, totalLessons)} />
    </section>
    {(active ? [active] : learningPath).map(stage => {
      const title = stage.title
      const rows = stage.lessons.map(lesson => {
        const done = completed.has(lesson.id)
        const started = !done && hasStartedLesson(lesson, progress, attempted)
        return { lesson, done, started, status: done ? 'Hoàn thành' : started ? 'Đang học' : 'Chưa học' }
      })
      const doneCount = rows.filter(row => row.done).length
      const stageDone = doneCount === rows.length
      const stageStarted = doneCount > 0 || rows.some(row => row.started)
      return <section className="panel content-panel study-card" key={stage.id} aria-labelledby={`stage-${stage.id}`}>
        <div className="section-heading">
          <div><h2 id={`stage-${stage.id}`}>{title}</h2><p>{stage.goal}</p></div>
          <span className={`tag ${stageDone ? 'study-status-done' : ''}`}>{stageDone ? 'Hoàn thành' : stageStarted ? 'Đang học' : 'Chưa học'}</span>
        </div>
        <div className="study-stage-progress"><ProgressBar label={`Tiến độ ${title}`} value={accuracy(doneCount, rows.length)} color={stageDone ? 'green' : 'blue'} /><small className="muted">{doneCount}/{rows.length} bài</small></div>
        <ul className="activity-list study-activity">
          {rows.map(({ lesson, done, started, status }) => {
            const StatusIcon = done ? CircleCheck : started ? Clock3 : Circle
            return <li key={lesson.id}>
              <span className={`icon-tile ${done ? 'green' : 'blue'}`}><StatusIcon size={16} aria-hidden="true" /></span>
              <div><a className="text-link" href={`#${lesson.route}`}>{lesson.title}</a><small>{status}</small></div>
            </li>
          })}
        </ul>
      </section>
    })}
  </>
}

const planDate = new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'numeric' })

export function PlanPage({ progress, onPlan }: {
  progress: ProgressData
  onPlan: (key: string, checked: boolean) => void
}) {
  const dates = weekDays()
  const today = dayKey()
  const finished = dates.filter(date => progress.plan[dayKey(date)]).length
  return <>
    <PageIntro title="Kế hoạch học" description={`Lịch học mỗi tuần cho mục tiêu TOEIC ${progress.settings.target}+.`} />
    <section className="panel content-panel study-card" aria-labelledby="week-plan-heading">
      <div className="section-heading">
        <div><h2 id="week-plan-heading">Tuần này</h2><p>{planDate.format(dates[0])} – {planDate.format(dates[6])} · {finished}/7 ngày hoàn thành</p></div>
        <span className="icon-tile blue"><CalendarDays size={20} aria-hidden="true" /></span>
      </div>
      <ProgressBar label="Số ngày hoàn thành trong tuần" value={accuracy(finished, dates.length)} />
      <ul className="study-plan-list">
        {dates.map((date, index) => {
          const key = dayKey(date)
          const { day, task, detail, route } = studyPlan[index]
          const checked = Boolean(progress.plan[key])
          const isToday = key === today
          return <li key={key} className={isToday ? 'study-plan-today' : undefined}>
            <div className="study-plan-date"><strong>{day}</strong><time dateTime={key}>{planDate.format(date)}</time></div>
            <div className="study-plan-task"><strong>{task}</strong><small>{detail}</small></div>
            <div className="study-plan-actions">
              <a href={`#${route}`} className="button secondary" aria-label={`Mở bài ${task} · ${day}`}>Mở bài</a>
              <label className="study-plan-check"><input type="checkbox" checked={checked} onChange={event => onPlan(key, event.target.checked)} aria-label={`Hoàn thành ${day} · ${task}`} /> Hoàn thành</label>
            </div>
          </li>
        })}
      </ul>
    </section>
  </>
}

const miniSizes = [10, 20, 30] as const
const miniSkills = [
  { id: 'Listening', label: 'Listening', icon: Headphones },
  { id: 'Reading', label: 'Reading', icon: BookOpen },
  { id: 'Mixed', label: 'Cả hai kỹ năng', icon: FileText },
] as const
const mockMinutes = 30
const mockTotal = Object.values(mockDistribution).reduce((total, count) => total + count, 0)

export function TestPage({ mode, onStart }: {
  mode: 'mini' | 'mock'
  onStart: (options: Omit<QuizConfig, 'id'>) => void
}) {
  const [size, setSize] = useState<(typeof miniSizes)[number]>(10)
  const [skill, setSkill] = useState<Skill | 'Mixed'>('Mixed')
  const mock = mode === 'mock'

  function begin() {
    onStart(mock ? {
      mode,
      title: 'Đề thi thử rút gọn',
      lessonId: 'mock',
      questions: createMock(),
      minutes: mockMinutes,
      returnTo: 'mock-test',
    } : {
      mode,
      title: `Mini Test · ${skill === 'Mixed' ? 'Listening & Reading' : skill} · ${size} câu`,
      lessonId: 'mini',
      questions: createMini(size, skill),
      returnTo: 'mini-test',
    })
  }

  return <>
    <PageIntro title={mock ? 'Thi thử TOEIC' : 'Mini Test'} description={mock
      ? 'Làm đề rút gọn có đồng hồ đếm ngược, gồm đủ bảy Part của Listening và Reading.'
      : 'Chọn số câu và kỹ năng để kiểm tra nhanh, rồi xem lời giải và các phần cần ôn.'} />
    <div className="dashboard-grid study-grid">
      <section className="panel content-panel study-card" aria-labelledby="test-setup">
        <div className="section-heading"><div><h2 id="test-setup">{mock ? 'Đề thi thử rút gọn' : 'Thiết lập bài kiểm tra'}</h2></div><span className="icon-tile blue"><ClipboardCheck size={20} aria-hidden="true" /></span></div>
        {mock ? <>
          <div className="study-test-meta"><span><FileText size={17} aria-hidden="true" />{mockTotal} câu</span><span><Clock3 size={17} aria-hidden="true" />{mockMinutes} phút</span></div>
          <p className="muted">Đề tự nộp khi hết giờ. Bạn có thể quay lại các câu trước trong thời gian làm bài.</p>
        </> : <>
          <fieldset className="study-choice-list">
            <legend>Số câu</legend>
            <div>{miniSizes.map(count => <label key={count}>
              <input type="radio" name="mini-size" checked={size === count} onChange={() => setSize(count)} />
              <span>{count} câu</span>
            </label>)}</div>
          </fieldset>
          <fieldset className="study-choice-list">
            <legend>Kỹ năng</legend>
            <div>{miniSkills.map(({ id, label, icon: Icon }) => <label key={id}>
              <input type="radio" name="mini-skill" checked={skill === id} onChange={() => setSkill(id)} />
              <span><Icon size={16} aria-hidden="true" /> {label}</span>
            </label>)}</div>
          </fieldset>
        </>}
        <button type="button" className="button primary study-launch" onClick={begin}><Play size={16} aria-hidden="true" />{mock ? 'Bắt đầu thi thử' : 'Bắt đầu Mini Test'}</button>
      </section>
      <section className="panel content-panel study-card" aria-labelledby="test-summary">
        <div className="section-heading"><div><h2 id="test-summary">{mock ? 'Cấu trúc đề' : 'Kết quả sau khi nộp'}</h2></div><span className="icon-tile purple"><Target size={20} aria-hidden="true" /></span></div>
        {mock ? <>
          <ul className="study-test-parts">
            {parts.map(part => <li key={part}><span>Part {part} · {partLabels[part]}</span><strong>{mockDistribution[part]} câu</strong></li>)}
          </ul>
          <p className="muted">Điểm từng kỹ năng và tổng điểm chỉ là ước tính luyện tập.</p>
        </> : <ul className="study-test-parts">
          <li>Số câu đúng, số câu sai, tỷ lệ đúng và thời gian làm bài</li>
          <li>Tỷ lệ đúng theo Part</li>
          <li>Các chủ đề cần ôn và lời giải cho từng câu sai</li>
        </ul>}
      </section>
    </div>
  </>
}
