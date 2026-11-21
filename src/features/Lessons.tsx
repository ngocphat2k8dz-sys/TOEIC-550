import { useRef, useState } from 'react'
import {
  AudioLines, BookOpen, Check, CheckCircle2, Circle, GraduationCap,
  Lightbulb, ListChecks, RotateCcw, Volume2,
} from 'lucide-react'
import { grammarLessons } from '../data/grammar'
import { vocabulary, vocabularyQuestions, vocabularyTopics } from '../data/vocabulary'
import type { Question, WordStatus } from '../types'
import './lessons.css'

type WordFilter = 'all' | 'known' | 'review'
type PracticeHandler = (questions: Question[], title: string, lessonId: string) => void

interface VocabularyProps {
  statuses: Record<string, WordStatus>
  topic?: string
  onMark: (id: string, status: WordStatus, topic: string, seconds: number) => void
  onPractice: PracticeHandler
}

const filters: { value: WordFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả từ' },
  { value: 'review', label: 'Ôn lại' },
  { value: 'known', label: 'Đã nhớ' },
]

export function VocabularyPage(props: VocabularyProps) {
  return <VocabularyDeck key={props.topic || 'all-topics'} {...props} />
}

function VocabularyDeck({ statuses, topic, onMark, onPractice }: VocabularyProps) {
  const [activeTopic, setActiveTopic] = useState(
    () => vocabularyTopics.find(item => item.toLowerCase() === topic?.toLowerCase()) ?? '',
  )
  const [filter, setFilter] = useState<WordFilter>('all')
  const [activeId, setActiveId] = useState<string>()
  const [flipped, setFlipped] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const started = useRef(Date.now())
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  const topicWords = activeTopic ? vocabulary.filter(word => word.topic === activeTopic) : vocabulary
  const words = topicWords.filter(word => filter === 'all' || statuses[word.id] === filter)
  const knownCount = topicWords.filter(word => statuses[word.id] === 'known').length
  const wordIndex = Math.max(0, words.findIndex(item => item.id === activeId))
  const word = words[wordIndex]
  const quiz = activeTopic ? vocabularyQuestions.filter(question => question.topic === `Vocabulary – ${activeTopic}`) : vocabularyQuestions

  function showWord(id?: string) {
    setActiveId(id)
    setFlipped(false)
    started.current = Date.now()
  }

  function chooseTopic(value: string) {
    setActiveTopic(value)
    showWord()
  }

  function chooseFilter(value: WordFilter) {
    setFilter(value)
    showWord()
  }

  function mark(status: WordStatus) {
    if (!word) return
    const seconds = Math.round((Date.now() - started.current) / 1000)
    onMark(word.id, status, word.topic, seconds)
    setAnnouncement(`${word.word} · ${status === 'known' ? 'đã nhớ' : 'đã thêm vào danh sách ôn lại'}`)
    showWord(words[(wordIndex + 1) % words.length]?.id)
  }

  function pronounce() {
    if (!canSpeak || !word) return
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    const englishVoice = speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase() === 'en-us')
    if (englishVoice) utterance.voice = englishVoice
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }

  return (
    <>
      <header className="page-intro lesson-page-title">
        <h1>Từ vựng</h1>
        <p>Học từ theo ngữ cảnh công việc và đời sống thường gặp trong TOEIC.</p>
      </header>

      <div className="lessons-layout">
        <aside className="panel lessons-catalog" aria-label="Chủ đề từ vựng">
          <h2><BookOpen size={19} aria-hidden="true" /> Chủ đề</h2>
          <div className="lesson-nav">
            <button type="button" className="lesson-nav-item" aria-pressed={activeTopic === ''} onClick={() => chooseTopic('')}>
              <span>Tất cả chủ đề</span><span className="lesson-nav-count">{vocabulary.length}</span>
            </button>
            {vocabularyTopics.map(name => (
              <button type="button" className="lesson-nav-item" aria-pressed={name === activeTopic} key={name} onClick={() => chooseTopic(name)}>
                <span>{name}</span>
                <span className="lesson-nav-count">{vocabulary.filter(item => item.topic === name && statuses[item.id] === 'known').length}/{vocabulary.filter(item => item.topic === name).length}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="lessons-main">
          <section className="panel lesson-deck" aria-label="Bộ flashcard">
            <div className="lesson-deck-heading">
              <div>
                <h2>{activeTopic || 'Tất cả chủ đề'}</h2>
                <p className="muted">{knownCount}/{topicWords.length} từ đã nhớ</p>
              </div>
              <button type="button" className="button secondary" onClick={() => onPractice(quiz, `Kiểm tra từ vựng · ${activeTopic || 'Tất cả chủ đề'}`, `vocab-quiz-${activeTopic || 'all'}`)}>
                <ListChecks size={16} aria-hidden="true" /> Kiểm tra từ vựng
              </button>
            </div>
            <progress className="lesson-vocab-progress" value={knownCount} max={topicWords.length} aria-label="Số từ đã nhớ" />

            <div className="lesson-filters" aria-label="Lọc trạng thái ghi nhớ">
              {filters.map(item => (
                <button type="button" aria-pressed={filter === item.value} key={item.value} onClick={() => chooseFilter(item.value)}>
                  {item.label}
                </button>
              ))}
            </div>

            {word ? (
              <>
                <div className="lesson-flashcard">
                  <div className="lesson-flashcard-header">
                    <div className="lesson-flashcard-meta">
                      <span className="lesson-flashcard-topic">{word.topic}</span>
                      {statuses[word.id] && <span className="lesson-flashcard-status">{statuses[word.id] === 'known' ? 'Đã nhớ' : 'Cần ôn'}</span>}
                    </div>
                    {canSpeak && <button className="lesson-icon-button" type="button" aria-label={`Phát âm ${word.word}`} onClick={pronounce}><Volume2 size={21} aria-hidden="true" /></button>}
                  </div>
                  <button type="button" className="lesson-flashcard-content" aria-pressed={flipped} onClick={() => setFlipped(value => !value)}>
                    <span className="lesson-flashcard-word" lang="en">{word.word}</span>
                    <span className="lesson-flashcard-ipa">{word.ipa}</span>
                    {flipped && <span className="lesson-flashcard-meaning">{word.meaning}</span>}
                    {flipped && <span className="lesson-flashcard-kind">{word.kind}</span>}
                    <span className="lesson-flashcard-hint"><RotateCcw size={14} aria-hidden="true" /> {flipped ? 'Ẩn nghĩa' : 'Lật thẻ để xem nghĩa'}</span>
                  </button>
                </div>

                {flipped && (
                  <dl className="lesson-word-details">
                    <div><dt>Ví dụ</dt><dd lang="en">{word.example}</dd></div>
                    <div><dt>Cụm từ thường gặp</dt><dd lang="en">{word.collocation}</dd></div>
                    {word.synonym && <div><dt>Từ đồng nghĩa</dt><dd lang="en">{word.synonym}</dd></div>}
                  </dl>
                )}

                <div className="lesson-flashcard-footer">
                  <div className="lesson-carousel">
                    <button type="button" aria-label="Thẻ trước" disabled={words.length < 2} onClick={() => showWord(words[(wordIndex - 1 + words.length) % words.length].id)}>Trước</button>
                    <span>{wordIndex + 1} / {words.length}</span>
                    <button type="button" aria-label="Thẻ tiếp theo" disabled={words.length < 2} onClick={() => showWord(words[(wordIndex + 1) % words.length].id)}>Tiếp</button>
                  </div>
                  <div className="lesson-mark-actions">
                    <button type="button" className="button secondary" onClick={() => mark('review')}><RotateCcw size={16} aria-hidden="true" /> Chưa nhớ</button>
                    <button type="button" className="button primary" onClick={() => mark('known')}><Check size={17} aria-hidden="true" /> Đã nhớ</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="lesson-empty">
                <AudioLines size={28} aria-hidden="true" />
                <h3>{filter === 'review' ? 'Chưa có từ cần ôn' : 'Chưa có từ đã nhớ'}</h3>
                <p>Đánh dấu từ khi học để cập nhật danh sách này.</p>
                <button type="button" className="button secondary" onClick={() => chooseFilter('all')}>Xem tất cả từ</button>
              </div>
            )}
            <p className="lesson-announcement" aria-live="polite">{announcement}</p>
          </section>
        </div>
      </div>
    </>
  )
}

interface GrammarProps {
  topic?: string
  completed: string[]
  onPractice: PracticeHandler
}

export function GrammarPage(props: GrammarProps) {
  return <GrammarLessons key={props.topic || 'all-grammar'} {...props} />
}

function GrammarLessons({ topic, completed, onPractice }: GrammarProps) {
  const [activeId, setActiveId] = useState(() => {
    const normalized = topic?.trim().toLowerCase()
    return grammarLessons.find(item => item.id === normalized || item.topic.toLowerCase() === normalized)?.id ?? grammarLessons[0].id
  })
  const lesson = grammarLessons.find(item => item.id === activeId) ?? grammarLessons[0]
  const completedCount = grammarLessons.filter(item => completed.includes(item.id)).length
  const finished = completed.includes(lesson.id)

  return (
    <>
      <header className="page-intro lesson-page-title">
        <h1>Ngữ pháp</h1>
        <p>Học công thức, nhận diện dấu hiệu và làm mini quiz theo từng chủ điểm TOEIC.</p>
      </header>
      <div className="lessons-layout">
        <aside className="panel lessons-catalog" aria-label="Các bài ngữ pháp">
          <h2><GraduationCap size={20} aria-hidden="true" /> Bài học</h2>
          <p className="lesson-catalog-subtitle">{completedCount}/{grammarLessons.length} bài hoàn thành</p>
          <div className="lesson-nav">
            {grammarLessons.map(item => (
              <button type="button" key={item.id} className="lesson-nav-item" aria-pressed={item.id === lesson.id} onClick={() => setActiveId(item.id)}>
                {completed.includes(item.id) ? <CheckCircle2 className="lesson-completion-icon" size={16} aria-label="Đã hoàn thành" /> : <Circle size={15} aria-hidden="true" />}
                <span>{item.topic}</span>
              </button>
            ))}
          </div>
        </aside>
        <article className="panel lesson-article">
          <header className="lesson-article-header">
            <span className="tag lesson-topic-tag">{lesson.topic}</span>
            {finished && <span className="lesson-finished"><CheckCircle2 size={16} aria-hidden="true" /> Đã hoàn thành</span>}
            <h2>{lesson.title}</h2>
            <p>{lesson.summary}</p>
          </header>
          <section className="lesson-article-section">
            <h3>Công thức</h3>
            <ul className="lesson-formulas">{lesson.formulas.map(formula => <li key={formula}>{formula}</li>)}</ul>
          </section>
          <section className="lesson-article-section">
            <h3>Ví dụ</h3>
            <div className="lesson-examples">
              {lesson.examples.map(example => (
                <div key={example.english}>
                  <strong lang="en">{example.english}</strong>
                  <p>{example.vietnamese}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="lesson-article-section">
            <h3><Lightbulb size={18} aria-hidden="true" /> Dấu hiệu trong TOEIC</h3>
            <ul className="lesson-point-list">{lesson.indicators.map(indicator => <li key={indicator}>{indicator}</li>)}</ul>
          </section>
          <section className="lesson-article-section">
            <h3>Lỗi thường gặp</h3>
            <ul className="lesson-point-list">{lesson.mistakes.map(mistake => <li key={mistake}>{mistake}</li>)}</ul>
          </section>
          <footer className="lesson-quiz-footer">
            <div><h3>Mini quiz</h3><p>{lesson.questions.length} câu áp dụng công thức vừa học</p></div>
            <button className="button primary" type="button" onClick={() => onPractice(lesson.questions, `Ngữ pháp · ${lesson.title}`, lesson.id)}>
              <ListChecks size={17} aria-hidden="true" /> {finished ? 'Làm lại mini quiz' : 'Làm mini quiz'}
            </button>
          </footer>
        </article>
      </div>
    </>
  )
}
