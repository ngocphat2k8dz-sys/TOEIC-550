import { useState } from 'react'
import { ArrowRight, BookOpen, Check, Headphones, Play } from 'lucide-react'
import { ListeningPlayer } from '../../components/ListeningPlayer'
import { MarkedText } from '../../components/QuestionContent'
import { EmptyState, PageIntro, ProgressBar } from '../../components/UI'
import { beginnerWordQuestions, beginnerWords } from '../../data/beginnerVocabulary'
import { foundationLessons } from '../../data/foundations'
import { studyLessonById, studyLessonRoute, studyLessons } from '../../data/curriculum'
import { curriculumClip } from '../../data/curriculum/audio'
import { studyWords } from '../../data/curriculum/words'
import { listeningSteps } from '../../data/beginnerListening'
import { learningPath, levelCompletion, levelPractices, nextPathLesson, recommend } from '../../data/path'
import { questionById } from '../../data/questions'
import { accuracy } from '../../progress'
import type { ProgressData, Speed, WordStatus } from '../../types'
import { Pronounce } from '../../components/Pronounce'
import { learningAudio } from '../../data/learningAudio'
import type { PracticeStarter } from './IpaPage'
import { AlphabetChart } from './AlphabetChart'

export function FoundationPage({ lessonId, progress, onPractice }: { lessonId?: string; progress: ProgressData; onPractice: PracticeStarter }) {
  const nextRoute = recommend(progress).next?.route
  const id = lessonId ?? (nextRoute?.startsWith('foundation/') ? nextRoute.split('/')[1] : studyLessons[0].id)
  const entry = studyLessonById.get(id)
  const lesson = entry?.lesson ?? foundationLessons.find(item => item.id === id)
  if (!lesson) return <EmptyState title="Chưa tìm thấy bài này"><a className="text-link" href="#roadmap">Về lộ trình</a></EmptyState>
  const completed = new Set(progress.completed)
  const stageLessons = entry?.stage.modules.flatMap(group => group.lessons) ?? []
  const stageDone = stageLessons.filter(item => completed.has(item.completionId)).length
  const words = entry?.lesson.vocabulary.flatMap(word => studyWords.get(word) ?? []) ?? []
  const next = nextPathLesson(lesson.completionId)
  return <>
    <PageIntro eyebrow={entry ? `${entry.stage.title} · Bài ${entry.number}/${stageLessons.length}` : 'Tiếng Anh nền tảng'} title={lesson.title} description={lesson.goal}
      action={<a className="button secondary" href={entry ? `#roadmap/${entry.stage.id}` : '#roadmap'}>Xem lộ trình</a>} />
    {entry && <section className="panel content-panel course-lesson-progress" aria-label={`Tiến độ ${entry.stage.title}`}>
      <div><strong>{entry.group.title}</strong><span>{stageDone}/{stageLessons.length} bài hoàn thành · {accuracy(stageDone, stageLessons.length)}%</span></div>
      <ProgressBar label={`Tiến độ ${entry.stage.title}`} value={accuracy(stageDone, stageLessons.length)} />
    </section>}
    <div className="dashboard-grid foundation-layout">
      <section className="panel content-panel">
        <div className="section-heading"><div><h2>{entry?.lesson.review ? 'Nhắc lại các bài vừa học' : 'Đọc từng bước'}</h2></div><span className="icon-tile blue"><BookOpen size={20} /></span></div>
        <dl className="learning-definitions">{lesson.notes.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
        {lesson.id === 'sounds' && <a className="text-link" href="#ipa">Mở khóa IPA 20 bài</a>}
      </section>
      <section className="panel content-panel">
        <div className="section-heading"><div><h2>Ví dụ ngắn</h2><p>Đọc câu rồi đối chiếu nghĩa tiếng Việt.</p></div></div>
        <ul className="examples-list">{lesson.examples.map(([english, vietnamese]) => <li key={english}>
          <div className="learning-sentence"><strong lang="en">{english}</strong><Pronounce compact text={english} audioId={curriculumClip(english).id} /></div>
          <p>{vietnamese}</p>
        </li>)}</ul>
      </section>
    </div>
    {lesson.id === 'alphabet' && <AlphabetChart />}
    {words.length > 0 && <section className="panel content-panel course-lesson-words" aria-labelledby="course-word-title">
      <div className="section-heading"><div><h2 id="course-word-title">Từ vựng trong bài</h2></div></div>
      <ul className="course-word-grid">{words.map(word => <li key={word.word}>
        <div className="course-word-heading"><strong lang="en">{word.word}</strong><Pronounce text={word.word} audioId={word.audioId ?? curriculumClip(word.word).id} compact /></div>
        <p><span className="ipa-transcript">/{word.ipa}/</span> · {word.meaning}</p>
        <div className="learning-sentence"><p lang="en">{word.example}</p><Pronounce compact text={word.example} audioId={curriculumClip(word.example).id} /></div>
        <p className="muted">{word.translation}</p>
      </li>)}</ul>
    </section>}
    <section className="panel content-panel course-lesson-practice" aria-labelledby="course-practice-title">
      <div><h2 id="course-practice-title">{entry?.lesson.review ? 'Bài ôn tập' : 'Bài luyện'}</h2><p className="muted">{lesson.questions.length} câu có giải thích sau khi trả lời</p>
        {completed.has(lesson.completionId) && <p className="path-done"><Check size={16} /> Đã hoàn thành bài</p>}</div>
      <div className="button-group">
        {next && completed.has(lesson.completionId) && <a className="button primary" href={`#${next.route}`}>Tiếp tục · {next.title}<ArrowRight size={16} /></a>}
        <button className={`button ${next && completed.has(lesson.completionId) ? 'secondary' : 'primary'}`} onClick={() => onPractice(lesson.questions, lesson.title, lesson.completionId)}><Play size={16} /> Luyện bài này</button>
      </div>
    </section>
    {entry && <details className="panel content-panel course-module-lessons">
      <summary>Bài học trong nhóm · {entry.group.lessons.length} bài</summary>
      <ul className="activity-list">{entry.group.lessons.map((item, index) => <li key={item.id}>
        <span className={`icon-tile ${completed.has(item.completionId) ? 'green' : 'blue'}`}>{completed.has(item.completionId) ? <Check size={16} aria-label="Hoàn thành" /> : index + 1}</span>
        <div><a href={`#${studyLessonRoute(item.id)}`} className="text-link" aria-current={item === entry.lesson ? 'page' : undefined}>{item.title}</a>
          <small>{item === entry.lesson ? 'Bài đang mở' : item.completionId === next?.id ? 'Bài kế tiếp' : completed.has(item.completionId) ? 'Hoàn thành' : 'Chưa hoàn thành'}</small></div>
      </li>)}</ul>
    </details>}
  </>
}

const wordStatus = { known: 'Đã học', review: 'Cần ôn', new: 'Chưa học' }
export function BeginnerVocabulary({ progress, onMark, onPractice }: {
  progress: ProgressData
  onMark: (id: string, status: WordStatus, topic: string, seconds: number) => void
  onPractice: PracticeStarter
}) {
  const [filter, setFilter] = useState<'all' | 'known' | 'review' | 'new'>('all')
  const [index, setIndex] = useState(0)
  const [since, setSince] = useState(() => Date.now())
  const words = beginnerWords.filter(word => filter === 'all' || (progress.vocabulary[word.id] ?? 'new') === filter)
  const word = words[index % Math.max(1, words.length)]
  const status = word && (progress.vocabulary[word.id] ?? 'new')
  const known = beginnerWords.filter(item => progress.vocabulary[item.id] === 'known').length
  const showToeic = status === 'known' || progress.settings.studyTrack === 'toeic' || progress.completed.includes('foundation-toeic-bridge')

  function choose(next: number) {
    setIndex(next)
    setSince(Date.now())
  }
  function mark(value: WordStatus) {
    if (!word) return
    const seconds = Math.max(1, Math.round((Date.now() - since) / 1000))
    onMark(word.id, value, 'Từ vựng cơ bản', seconds)
    choose(filter === 'all' ? (index + 1) % words.length : index)
  }

  return <>
    <PageIntro title="Từ vựng cơ bản" description="Học từ quen thuộc qua một câu thật ngắn. Nghe, đọc theo rồi chọn mức ghi nhớ." action={
      <a className="button secondary" href="#vocabulary">Từ vựng TOEIC</a>
    } />
    <section className="panel content-panel basic-vocab">
      <div className="section-heading"><div><h2>Bộ từ đầu tiên</h2><p>{known}/{beginnerWords.length} từ đã học</p></div>
        <button className="button secondary" onClick={() => onPractice(beginnerWordQuestions, 'Từ vựng cơ bản', 'basic-vocab')}>Quiz từ vựng</button>
      </div>
      <ProgressBar label="Từ cơ bản đã học" value={accuracy(known, beginnerWords.length)} />
      <label className="pair-picker">Trạng thái<select value={filter} onChange={event => { setFilter(event.target.value as typeof filter); choose(0) }}>
        <option value="all">Tất cả</option><option value="new">Chưa học</option><option value="known">Đã học</option><option value="review">Cần ôn</option>
      </select></label>
      {word && status ? <article className="basic-word-card" key={word.id}>
        <div className="section-heading"><div><span className="tag">{wordStatus[status]}</span><h3 lang="en">{word.word}</h3><p className="ipa-transcript">/{word.ipa}/</p></div>
          <Pronounce text={word.word} audioId={word.audioId} />
        </div>
        <p><strong>{word.meaning}</strong> · {word.kind}</p>
        <div className="basic-word-example"><div className="learning-sentence"><p lang="en">{word.example}</p><Pronounce text={word.example} audioId={word.audioId + '-sentence'} /></div><p className="muted">{word.translation}</p></div>
        {showToeic && <details className="transcript"><summary>Ví dụ trong ngữ cảnh TOEIC</summary><p lang="en">{word.toeic}</p><p className="muted">{word.toeicTranslation}</p></details>}
        <div className="basic-word-actions">
          <div className="button-group">
            <button className="button secondary" disabled={words.length < 2} onClick={() => choose((index + words.length - 1) % words.length)}>Từ trước</button>
            <button className="button secondary" disabled={words.length < 2} onClick={() => choose((index + 1) % words.length)}>Từ tiếp</button>
          </div>
          <div className="button-group"><button className="button secondary" onClick={() => mark('review')}>Cần ôn</button><button className="button primary" onClick={() => mark('known')}>Đã học</button></div>
        </div>
      </article> : <EmptyState title="Chưa có từ ở trạng thái này"><button className="button secondary" onClick={() => { setFilter('all'); choose(0) }}>Xem tất cả từ</button></EmptyState>}
    </section>
  </>
}

export function BeginnerListening({ stepId, progress, onPractice }: { stepId?: string; progress: ProgressData; onPractice: PracticeStarter }) {
  const step = listeningSteps.find(item => item.id === stepId) ?? listeningSteps[0]
  const next = listeningSteps[listeningSteps.indexOf(step) + 1]
  const [pace, setPace] = useState<Speed>(progress.settings.speed)
  const done = progress.completed.includes(step.completionId)
  return <>
    <PageIntro title="Nghe từ đầu" description="Đi từ âm trong một từ đến đoạn ngắn. Học với bản chép lời trước rồi làm quiz chỉ có audio." />
    <nav className="path-tabs" aria-label="Các bước luyện nghe">{listeningSteps.map(item =>
      <a key={item.id} href={'#beginner-listening/' + item.id} className={'button ' + (item === step ? 'primary' : 'secondary')} aria-current={item === step ? 'page' : undefined}>
        {progress.completed.includes(item.completionId) && <Check size={16} />}{item.title}
      </a>,
    )}<a className="button secondary" href="#listening">Listening TOEIC</a></nav>
    <section className="panel content-panel">
      <div className="section-heading"><div><h2>{step.title}</h2><p>{step.description}</p></div><span className="icon-tile blue"><Headphones size={20} /></span></div>
      <div className="dashboard-grid">{step.clips.map((clip, index) => <article className="passage" key={clip.id}>
        <h3>Mẫu nghe {index + 1}</h3>
        <ListeningPlayer transcript={clip.text} src={learningAudio(clip.audioId)} speed={pace} onSpeed={setPace} instruction="Nghe rồi đọc theo" />
        <details className="transcript"><summary>Xem lời thoại và bản dịch</summary>
          <p lang="en"><MarkedText text={clip.text} terms={clip.words.map(([word]) => word)} /></p>
          <p>{clip.translation}</p><p className="muted">{clip.tip}</p>
        </details>
      </article>)}</div>
      <div className="button-group learning-actions">
        <button className="button primary" onClick={() => onPractice(step.questions, 'Nghe từ đầu · ' + step.title, step.completionId)}>Luyện nghe không lời thoại</button>
        {next && <a className="button secondary" href={'#beginner-listening/' + next.id}>Học bước tiếp theo</a>}
      </div>
      {done && <p className="path-done"><Check size={16} /> Đã hoàn thành bước này</p>}
    </section>
  </>
}

export function LevelPage({ level, practiceId, progress, onPractice }: { level?: string; practiceId?: string; progress: ProgressData; onPractice: PracticeStarter }) {
  const stage = learningPath.find(item => item.id === level && item.id.startsWith('toeic'))
  if (!stage) return <EmptyState title="Chưa tìm thấy giai đoạn này"><a className="text-link" href="#roadmap">Về lộ trình</a></EmptyState>
  const exercise = levelPractices.find(item => item.level === level && item.id === practiceId)
  const complete = stage.lessons.filter(lesson => progress.completed.includes(lesson.id)).length
  return <>
    <PageIntro title={stage.title} description={stage.goal} action={<a className="button secondary" href="#roadmap">Xem lộ trình</a>} />
    {exercise ? <section className="panel content-panel">
      <div className="section-heading"><div><h2>{exercise.title}</h2><p>{exercise.description}</p></div></div>
      <button className="button primary" onClick={() => onPractice(exercise.questionIds.flatMap(id => questionById.get(id) ?? []),
        stage.title + ' · ' + exercise.title, levelCompletion(exercise.level, exercise.id),
      )}>Bắt đầu luyện</button>
    </section> : <section className="panel content-panel">
      <div className="section-heading"><div><h2>Bài học trong giai đoạn</h2><p>{complete}/{stage.lessons.length} bài đã hoàn thành</p></div></div>
      <ProgressBar label={'Tiến độ ' + stage.title} value={accuracy(complete, stage.lessons.length)} />
      <ul className="activity-list">{stage.lessons.map(lesson => <li key={lesson.id}>
        <span className="icon-tile blue">{progress.completed.includes(lesson.id) ? <Check size={16} /> : <BookOpen size={16} />}</span>
        <div><a className="text-link" href={'#' + lesson.route}>{lesson.title}</a></div>
      </li>)}</ul>
    </section>}
  </>
}
