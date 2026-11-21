import { useState } from 'react'
import { BookOpen, Check, CircleHelp, GraduationCap, Headphones, Play } from 'lucide-react'
import { ListeningPlayer } from '../../components/ListeningPlayer'
import { Pronounce } from '../../components/Pronounce'
import { EmptyState, PageIntro, ProgressBar } from '../../components/UI'
import { soundGroups } from '../../data/ipa'
import { ipaCourse, nextIpaLesson, pronunciationNote, spokenIpa, studyMouth, studySymbol } from '../../data/ipaCourse'
import type { Speed } from '../../types'
import type { PracticeStarter } from './IpaPage'

export function IpaTabs({ reference = false }: { reference?: boolean }) {
  return <nav className="path-tabs" aria-label="Cách học IPA">
    <a href="#ipa" className={'button ' + (reference ? 'secondary' : 'primary')} aria-current={reference ? undefined : 'page'}><GraduationCap size={16} /> Học IPA từng bước</a>
    <a href="#ipa/reference" className={'button ' + (reference ? 'primary' : 'secondary')} aria-current={reference ? 'page' : undefined}><BookOpen size={16} /> Tra cứu bảng IPA 44 âm</a>
  </nav>
}

export function IpaCoursePage({ completed, group }: { completed: string[]; group?: string }) {
  const done = ipaCourse.filter(lesson => completed.includes(lesson.id)).length
  const next = nextIpaLesson(completed, group) ?? nextIpaLesson(completed)
  return <>
    <PageIntro title="Học IPA từng bước" description="Học ít âm mỗi lần với giọng Anh–Mỹ. Nghe từ mẫu, xem khẩu hình, nói theo và làm quiz ngắn." />
    <IpaTabs />
    <div className="ipa-course-summary">
      <section className="panel content-panel ipa-next">
        <div className="section-heading"><div><span className="tag">{next ? 'Bài tiếp theo của bạn' : 'Bạn đã hoàn thành khóa học'}</span>
          <h2>Bài {next?.number ?? 1} · {(next ?? ipaCourse[0]).title}</h2><p>{(next ?? ipaCourse[0]).goal}</p></div><span className="icon-tile blue"><Headphones size={20} /></span></div>
        <a className="button primary" href={'#ipa/lesson/' + (next?.number ?? 1)}><Play size={16} /> {next ? done ? 'Học tiếp' : 'Học ngay' : 'Ôn lại từ bài 1'}</a>
      </section>
      <section className="panel content-panel" aria-labelledby="ipa-progress-title">
        <div className="section-heading"><div><h2 id="ipa-progress-title">Tiến độ IPA</h2><p>{done} / {ipaCourse.length} bài hoàn thành</p></div><span className="icon-tile green"><Check size={20} /></span></div>
        <ProgressBar label="Tiến độ khóa IPA" value={Math.round(done / ipaCourse.length * 100)} />
      </section>
    </div>
    <div className="ipa-group-list">
      {soundGroups.map(groupInfo => {
        const lessons = ipaCourse.filter(item => item.group === groupInfo.id)
        return <section className="panel content-panel" key={groupInfo.id}>
          <div className="section-heading"><div><h2>{groupInfo.name}</h2><p>{lessons.filter(item => completed.includes(item.id)).length}/{lessons.length} bài hoàn thành</p></div></div>
          <ul className="ipa-course-list">{lessons.map(lesson => {
            const complete = completed.includes(lesson.id)
            return <li key={lesson.id} className={lesson === next ? 'recommended' : undefined}>
              <span className={'icon-tile ' + (complete ? 'green' : 'blue')}>{complete ? <Check size={17} /> : lesson.number}</span>
              <div><a className="text-link" href={'#ipa/lesson/' + lesson.number}>Bài {lesson.number} · {lesson.title}</a><small>{complete ? 'Đã hoàn thành' : lesson === next ? 'Bài nên học tiếp' : lesson.goal}</small></div>
              <a className="button secondary" href={'#ipa/lesson/' + lesson.number} aria-label={(complete ? 'Ôn lại ' : 'Học ') + 'Bài ' + lesson.number}>{complete ? 'Ôn lại' : 'Học bài này'}</a>
            </li>
          })}</ul>
        </section>
      })}
    </div>
  </>
}

export function IpaCourseLesson({ number, completed, onPractice }: { number: number; completed: string[]; onPractice: PracticeStarter }) {
  const lesson = ipaCourse[number - 1]
  if (!lesson) return <EmptyState title="Chưa tìm thấy bài IPA"><a href="#ipa" className="text-link">Về khóa IPA</a></EmptyState>
  return <Lesson key={lesson.id} lesson={lesson} complete={completed.includes(lesson.id)} onPractice={onPractice} />
}

const stepNames = ['Nghe từ mẫu', 'Nhìn và nói theo', 'Phân biệt', 'Quiz']

function Lesson({ lesson, complete, onPractice }: { lesson: typeof ipaCourse[number]; complete: boolean; onPractice: PracticeStarter }) {
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState<Speed>(1)
  const [picked, setPicked] = useState<number>()
  const previous = ipaCourse[lesson.number - 2]
  const next = ipaCourse[lesson.number]
  const challenge = lesson.questions[2].transcript ? lesson.questions[2] : lesson.questions[0]
  const examples = lesson.sounds.map(sound => sound.examples[0])

  return <>
    <PageIntro eyebrow={'Bài ' + lesson.number + ' / ' + ipaCourse.length} title={'Bài ' + lesson.number + ' · ' + lesson.title} description={lesson.goal}
      action={<a href="#ipa" className="button secondary">Danh sách bài</a>} />
    <div className="ipa-lesson-nav" aria-label="Điều hướng bài IPA">
      {previous ? <a className="button secondary" href={'#ipa/lesson/' + previous.number}>Bài trước</a> : <button className="button secondary" type="button" disabled>Bài trước</button>}
      <span>Bài {lesson.number} / {ipaCourse.length}{complete && <small><Check size={14} /> Đã hoàn thành</small>}</span>
      {next ? <a className="button secondary" href={'#ipa/lesson/' + next.number}>Bài tiếp theo</a> : <a className="button secondary" href="#ipa">Về khóa học</a>}
    </div>
    <div className="ipa-step-picker" role="group" aria-label="Các bước của bài">
      {stepNames.map((name, index) => <button type="button" className={'button ' + (step === index ? 'primary' : 'secondary')} aria-pressed={step === index}
        key={name} onClick={() => setStep(index)}>{index + 1}. {name}</button>)}
    </div>
    <div className="ipa-step-list">
      {step === 0 && <section className="panel content-panel">
        <div className="section-heading"><div><h2>1. Nghe từ mẫu</h2><p>Nghe mỗi từ hai lượt. Dùng con rùa để nghe chậm 0.85×.</p></div><span className="icon-tile blue"><Headphones size={20} /></span></div>
        <div className="ipa-sample-grid">
          {examples.map((word, index) => <div className="ipa-sample" key={word.audioId}>
            <div><strong lang="en">{word.word}</strong><span className="ipa-transcript">/{spokenIpa(word.word, word.transcription)}/</span><small>{word.meaning} · âm /{studySymbol(lesson.sounds[index])}/</small></div>
            <Pronounce text={word.word} audioId={word.audioId} />
          </div>)}
        </div>
      </section>}
      {step === 1 && <section className="panel content-panel">
        <div className="section-heading"><div><h2>2. Xem khẩu hình và nói theo</h2><p>Đọc từ riêng trước rồi thử nói lại câu mẫu.</p></div></div>
        <div className="ipa-sample-grid">
          {lesson.sounds.map(sound => <article key={sound.id} className="ipa-mouth-card">
            <h3 className="ipa-transcript">/{studySymbol(sound)}/</h3>
            <dl className="learning-definitions">
              <div><dt>Khẩu hình</dt><dd>{studyMouth(sound)}</dd></div>
              <div><dt>Mẹo</dt><dd>{pronunciationNote(sound) ?? sound.tip}</dd></div>
              <div><dt>Lỗi dễ gặp</dt><dd>{sound.mistake}</dd></div>
            </dl>
            <ul className="ipa-speak-words">{sound.examples.map(word => <li key={word.audioId}>
              <div className="learning-sentence"><span><strong lang="en">{word.word}</strong> <span className="ipa-transcript">/{spokenIpa(word.word, word.transcription)}/</span> · {word.meaning}</span>
                {word !== sound.examples[0] && <Pronounce text={word.word} audioId={word.audioId} />}</div>
              <div className="learning-sentence"><span lang="en">{word.sentence}</span><Pronounce compact text={word.sentence} audioId={word.audioId + '-sentence'} /></div>
              <small className="muted">{word.translation}</small>
            </li>)}</ul>
          </article>)}
        </div>
      </section>}
      {step === 2 && <section className="panel content-panel">
        <div className="section-heading"><div><h2>3. So sánh và luyện tai</h2><p>Nghe luân phiên rồi thử nhận ra âm hoặc từ.</p></div><span className="icon-tile purple"><CircleHelp size={20} /></span></div>
        {lesson.note && <p className="ipa-accent-note">{lesson.note}</p>}
        {lesson.contrasts.length > 0 && <div className="ipa-contrast-list">{lesson.contrasts.map(pair => <div className="ipa-sample-grid" key={pair.map(word => word.word).join('/')}>
          {pair.map(word => <div className="ipa-sample" key={word.audioId}>
            <div><strong lang="en">{word.word}</strong><span className="ipa-transcript">/{word.ipa}/</span><small>{word.meaning}</small></div><Pronounce text={word.word} audioId={word.audioId} />
          </div>)}
        </div>)}</div>}
        <div className="ipa-ear-practice">
          <h3>{challenge.prompt}</h3>
          {challenge.transcript && <ListeningPlayer transcript={challenge.transcript} src={challenge.audio} speed={speed} onSpeed={setSpeed} instruction="Nghe trước khi chọn" />}
          <div className="button-group">{challenge.options.map((option, index) =>
            <button type="button" className={'button ' + (picked === index ? 'primary' : 'secondary')} aria-pressed={picked === index} key={option} onClick={() => setPicked(index)}>{option}</button>,
          )}</div>
          {picked !== undefined && <p role="status">{picked === challenge.answer ? 'Bạn nghe đúng.' : 'Thử nghe lại.'} {challenge.beginner?.simple}</p>}
        </div>
      </section>}
      {step === 3 && <section className="panel content-panel">
        <div className="section-heading"><div><h2>4. Làm quiz</h2><p>Bốn câu ngắn. Sau khi chấm, bạn có thể nghe lại và học tiếp.</p></div></div>
        <button type="button" className="button primary" onClick={() => onPractice(lesson.questions, 'IPA · Bài ' + lesson.number + ' · ' + lesson.title, lesson.id)}>Làm quiz</button>
        {complete && <p className="path-done"><Check size={16} /> Bạn đã hoàn thành bài này.</p>}
      </section>}
    </div>
    {step < stepNames.length - 1 && <button type="button" className="button secondary ipa-continue" onClick={() => {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }}>Tiếp tục · {stepNames[step + 1]}</button>}
  </>
}
