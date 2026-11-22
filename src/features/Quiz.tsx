import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, ClipboardCheck, Clock3, FileText, Flag, RotateCcw, Target, Trophy, X } from 'lucide-react'
import { ListeningPlayer } from '../components/ListeningPlayer'
import { AnswerExplanation, optionLetter, optionText, Passage } from '../components/QuestionContent'
import { EmptyState, PageIntro, ProgressBar } from '../components/UI'
import { guideFor } from '../data/course'
import { questionGroup } from '../data/beginnerQuestion'
import { questionById } from '../data/questions'
import { studyLessonByCompletion } from '../data/curriculum'
import { nextPathLesson } from '../data/path'
import { accuracy, byPart, clockText, durationText, recordAnswer, scoreBySkill, weakTopics } from '../progress'
import { getQuizDraft, saveQuizDraft, type QuizResult } from '../quizDraft'
import type { AnswerRecord, QuizConfig, Speed } from '../types'
import { topicLabel } from './Dashboard'

export function Quiz({ config, speed, ownerId, onAnswer, onFinish, onRestart }: {
  config: QuizConfig; speed: Speed; ownerId?: string; onAnswer: (record: AnswerRecord) => void;
  onFinish: (config: QuizConfig, records: AnswerRecord[], seconds: number, exam: boolean) => void;
  onRestart: () => void
}) {
  const exam = config.mode === 'mini' || config.mode === 'mock'
  const total = config.questions.length
  const [draft] = useState(() => getQuizDraft(config, speed, ownerId))
  const [index, setIndex] = useState(draft.index)
  const [choices, setChoices] = useState(draft.choices)
  const [graded, setGraded] = useState(draft.graded)
  const [result, setResult] = useState(draft.result)
  const [confirm, setConfirm] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(draft.playbackSpeed)
  const [now, setNow] = useState(() => Date.now())
  const start = draft.start
  const finished = useRef(Boolean(draft.result))
  const top = useRef<HTMLDivElement>(null)
  const question = config.questions[index]
  const chosen = choices[index]
  const marked = graded[index]
  const answered = choices.filter(choice => choice !== null).length
  const timeLimit = config.minutes ? config.minutes * 60 : undefined
  const elapsed = Math.floor((now - start) / 1000)

  useEffect(() => {
    saveQuizDraft({ id: config.id, index, choices, graded, result, start, playbackSpeed }, ownerId)
  }, [config.id, index, choices, graded, result, start, playbackSpeed, ownerId])

  const submit = useCallback(() => {
    if (finished.current) return
    finished.current = true
    const timestamp = new Date().toISOString()
    const seconds = Math.max(1, Math.min(timeLimit ?? Infinity, Math.round((Date.now() - start) / 1000)))
    const records = config.questions.map((item, questionIndex) => graded[questionIndex] ?? recordAnswer(item, choices[questionIndex], timestamp, `${config.id}:${questionIndex}`))
    onFinish(config, records, seconds, exam)
    setResult({ records, seconds })
    setConfirm(false)
    window.scrollTo(0, 0)
  }, [choices, config, exam, graded, onFinish, start, timeLimit])

  useEffect(() => {
    if (result) return
    const interval = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(interval)
  }, [result])

  useEffect(() => {
    if (timeLimit && elapsed >= timeLimit && !result) submit()
  }, [elapsed, result, submit, timeLimit])

  function go(next: number) {
    setIndex(next)
    top.current?.scrollIntoView({ block: 'start' })
  }

  function grade() {
    if (chosen === null || marked) return
    const record = recordAnswer(question, chosen, new Date().toISOString(), `${config.id}:${index}`)
    setGraded(previous => ({ ...previous, [index]: record }))
    onAnswer(record)
  }

  if (result) return <ResultView config={config} result={result} onRestart={onRestart} />
  if (!question) return <EmptyState title="Chưa có câu hỏi cho phiên này"><a className="button secondary" href={`#${config.returnTo}`}>Quay về</a></EmptyState>

  const examLabel = config.mode === 'mock' ? 'Thi thử TOEIC' : config.mode === 'mini' ? 'Mini Test' : 'Phiên luyện tập'
  const finishLabel = config.lessonId && (studyLessonByCompletion.has(config.lessonId) || config.lessonId.startsWith('ipa-course-')) ? 'Hoàn thành bài' : 'Xem kết quả'
  return <div className="quiz-page" ref={top}>
    <PageIntro eyebrow={examLabel} title={config.title} description={exam ? 'Chọn đáp án cho từng câu, rồi nộp bài để xem kết quả và giải thích.' : 'Kiểm tra từng câu để xem lời giải tiếng Việt ngay sau khi trả lời.'}
      action={<a className="button secondary" href={`#${config.returnTo}`}>Thoát bài</a>} />
    <div className={`quiz-layout ${exam ? 'has-index' : ''}`}>
      <div>
        <section className="panel quiz-card" aria-labelledby="question-heading">
          <div className="quiz-top">
            <div><span className="tag">{questionGroup(question)}</span><span className="muted">{question.topic}</span></div>
            <div><span className="muted">Câu {index + 1}/{total}</span><span className={`quiz-time ${timeLimit && timeLimit - elapsed < 60 ? 'urgent' : ''}`} aria-label={timeLimit ? 'Thời gian còn lại' : 'Thời gian đã làm'}><Clock3 size={16} /> {clockText(timeLimit ? timeLimit - elapsed : elapsed)}</span></div>
          </div>
          <ProgressBar label={exam ? 'Câu đã trả lời' : 'Câu đã kiểm tra'} value={(exam ? answered : Object.keys(graded).length) / total * 100} />
          {question.image && <img className="question-image" src={question.image.src} alt={question.image.alt} />}
          {question.transcript && <ListeningPlayer key={question.id} transcript={question.transcript} src={question.audio} speed={playbackSpeed} onSpeed={setPlaybackSpeed} />}
          {question.passages?.length ? <div className="passages">{question.passages.map(passage => <Passage key={`${passage.title}:${passage.text}`} passage={passage} highlight={question.part === 7} />)}</div> : null}
          <h2 id="question-heading">{question.prompt}</h2>
          <div className="options" role="group" aria-label="Các phương án">
            {question.options.map((option, optionIndex) => {
              const state = marked && optionIndex === question.answer ? 'is-right' : marked && chosen === optionIndex ? 'is-wrong' : chosen === optionIndex ? 'selected' : ''
              const visible = Boolean(question.track) || question.part > 2 || Boolean(marked) || !question.transcript
              return <button className={`option ${state}`} key={optionIndex} type="button" aria-pressed={chosen === optionIndex} disabled={Boolean(marked)} onClick={() => setChoices(previous => previous.map((choice, current) => current === index ? optionIndex : choice))}>
                <span className="option-letter">{optionLetter(optionIndex)}</span><span>{visible ? option : `Phương án ${optionLetter(optionIndex)}`}</span>
                {state === 'is-right' && <Check size={19} />}{state === 'is-wrong' && <X size={19} />}
              </button>
            })}
          </div>
          <div className="quiz-actions">
            {exam ? <>
              <button className="button secondary" disabled={index === 0} onClick={() => go(index - 1)}>Câu trước</button>
              {index === total - 1 ? <button className="button primary" onClick={() => setConfirm(true)}><Flag size={16} /> Nộp bài</button> : <button className="button primary" onClick={() => go(index + 1)}>Câu tiếp theo</button>}
            </> : <button className="button primary" disabled={chosen === null} onClick={() => marked ? index === total - 1 ? submit() : go(index + 1) : grade()}>
              {marked ? index === total - 1 ? finishLabel : 'Câu tiếp theo' : 'Kiểm tra đáp án'}
            </button>}
          </div>
          {marked && <AnswerExplanation question={question} choice={marked.choice} />}
        </section>
      </div>
      {exam && <aside className="panel question-index">
        <h2>Danh sách câu</h2><p>{answered}/{total} câu đã trả lời</p>
        <div className="index-grid">{config.questions.map((item, itemIndex) => <button key={item.id} onClick={() => go(itemIndex)}
          className={`${choices[itemIndex] !== null ? 'answered' : ''} ${index === itemIndex ? 'current' : ''}`}
          aria-current={index === itemIndex ? 'step' : undefined} aria-label={`Câu ${itemIndex + 1}${choices[itemIndex] !== null ? ', đã chọn đáp án' : ', chưa trả lời'}`}>{itemIndex + 1}</button>)}</div>
        <button className="button secondary" onClick={() => setConfirm(true)}><Flag size={16} /> Nộp bài</button>
      </aside>}
    </div>
    {confirm && <div className="dialog-backdrop" onClick={() => setConfirm(false)}><section className="panel dialog" role="dialog" aria-modal="true" aria-labelledby="submit-title" onClick={event => event.stopPropagation()} onKeyDown={event => { if (event.key === 'Escape') setConfirm(false) }}>
      <span className="icon-tile blue"><Flag size={22} /></span><h2 id="submit-title">Nộp bài kiểm tra?</h2>
      <p>{answered === total ? 'Bạn đã trả lời tất cả các câu hỏi.' : `Bạn còn ${total - answered} câu bỏ trống. Các câu này sẽ được tính là sai.`}</p>
      <div className="button-group"><button className="button secondary" autoFocus onClick={() => setConfirm(false)}>Làm tiếp</button><button className="button primary" onClick={submit}>Nộp và chấm bài</button></div>
    </section></div>}
  </div>
}

function ResultView({ config, result, onRestart }: { config: QuizConfig; result: QuizResult; onRestart: () => void }) {
  const [all, setAll] = useState(false)
  const [reviewSpeed, setReviewSpeed] = useState<Speed>(1)
  const ipaLesson = config.lessonId?.startsWith('ipa-course-')
  const courseLesson = config.lessonId && studyLessonByCompletion.has(config.lessonId)
  const next = nextPathLesson(config.lessonId)
  const total = result.records.length
  const correct = result.records.filter(record => record.correct).length
  const wrong = total - correct
  const scores = scoreBySkill(result.records)
  const weak = weakTopics(result.records).slice(0, 3)
  const partScores = byPart(result.records.filter(record => !questionById.get(record.questionId)?.track)).filter(part => part.total)
  return <>
    <PageIntro eyebrow="Kết quả luyện tập" title={config.title} description={partScores.length ? 'Xem điểm theo từng Part và mở các câu cần ôn lại.' : 'Xem câu đã làm và ôn lại từng bước trong phần giải thích.'}
      action={<div className="button-group">
        {next && <a className="button primary" href={`#${next.route}`}>{ipaLesson ? 'Bài tiếp theo' : `Tiếp tục · ${next.title}`}<ArrowRight size={17} /></a>}
        <a className="button secondary" href={`#${config.returnTo}`}>{ipaLesson ? 'Học lại âm' : 'Quay về'}</a>
        <button className={`button ${next ? 'secondary' : 'primary'}`} onClick={onRestart}><RotateCcw size={16} /> Làm lại bài</button>
      </div>} />
    <section className="panel result-summary">
      <span className="icon-tile green"><Trophy size={24} /></span>
      <div><h2>{accuracy(correct, total)}% đúng</h2><p>{correct}/{total} câu trả lời chính xác{(ipaLesson || courseLesson) && ' · Đã hoàn thành bài'}</p></div>
      <dl><div><dt>Đúng</dt><dd>{correct}</dd></div><div><dt>Sai</dt><dd>{wrong}</dd></div><div><dt>Thời gian</dt><dd>{durationText(result.seconds)}</dd></div></dl>
    </section>
    {config.mode === 'mock' && <section className="panel content-panel score-estimate">
      <div className="section-heading"><div><h2>Điểm ước tính luyện tập</h2><p>Điểm quy đổi tuyến tính từ tỷ lệ đúng trong đề rút gọn. Điểm TOEIC chính thức do đơn vị tổ chức kỳ thi công bố.</p></div><span className="icon-tile blue"><Target size={20} /></span></div>
      <dl><div><dt>Listening</dt><dd>{scores.listeningScore} <small>/ 495</small></dd></div><div><dt>Reading</dt><dd>{scores.readingScore} <small>/ 495</small></dd></div><div><dt>Tổng điểm</dt><dd>{scores.totalScore} <small>/ 990</small></dd></div></dl>
    </section>}
    <div className="dashboard-grid result-grid">
      {partScores.length > 0 && <section className="panel content-panel"><div className="section-heading"><div><h2>Tỷ lệ đúng theo Part</h2><p>Kết quả của phiên này</p></div><span className="icon-tile blue"><ClipboardCheck size={19} /></span></div>
        {partScores.map(part => <div className="breakdown-row" key={part.part}><div><strong>Part {part.part} · {guideFor(part.part).name}</strong><span>{part.correct}/{part.total} · {part.rate}%</span></div><ProgressBar label={`Tỷ lệ đúng Part ${part.part}`} value={part.rate} color={part.part > 4 ? 'purple' : 'blue'} /></div>)}
      </section>}
      <section className="panel content-panel"><div className="section-heading"><div><h2>Phần nên ôn</h2><p>Chủ đề có nhiều câu sai trong bài này</p></div><span className="icon-tile orange"><Target size={19} /></span></div>
        {weak.length ? <ul className="activity-list">{weak.map(topic => <li key={topic.key}><div><strong>{topicLabel(topic)}</strong><small>{topic.wrong} câu sai</small></div><a className="text-link" href={`#weakness/${encodeURIComponent(topic.key)}`}>Luyện</a></li>)}</ul> : <EmptyState title="Bạn làm đúng tất cả các câu" />}
      </section>
    </div>
    <section className="panel content-panel review-result">
      <div className="section-heading"><div><h2>Đáp án và lời giải</h2><p>{wrong} câu sai được lưu vào sổ câu sai.</p></div><label className="checkbox-label"><input type="checkbox" checked={all} onChange={event => setAll(event.target.checked)} /> Hiện cả câu đúng</label></div>
      {!all && wrong === 0 && <EmptyState title="Không có câu sai trong phiên này" />}
      {config.questions.map((question, index) => {
        const record = result.records[index]
        return (all || !record.correct) && <details className="result-answer" key={question.id}>
          <summary><FileText size={17} /> Câu {index + 1} · {questionGroup(question)} <span>{record.correct ? 'Đúng' : record.choice === null ? 'Bỏ trống' : 'Sai'}</span></summary>
          <div><h3>{question.prompt}</h3>{question.image && <img className="question-image" src={question.image.src} alt={question.image.alt} />}
            {question.passages?.map(passage => <Passage key={passage.title} passage={passage} highlight={false} />)}
            {question.track && question.transcript && <ListeningPlayer transcript={question.transcript} src={question.audio} speed={reviewSpeed} onSpeed={setReviewSpeed} instruction="Nghe lại" />}
            <p className="muted">Bạn chọn {record.choice === null ? '—' : optionText(question, record.choice)}</p><AnswerExplanation question={question} choice={record.choice} /></div>
        </details>
      })}
    </section>
  </>
}
