import { useEffect, useState } from 'react'
import { Shell } from './components/Shell'
import { EmptyState } from './components/UI'
import { parts } from './data/course'
import { grammarLessons } from './data/grammar'
import { AccountMenu } from './features/profile/AccountMenu'
import { AccountPage } from './features/profile/AccountPage'
import { IpaPage } from './features/beginner/IpaPage'
import { BeginnerListening, BeginnerVocabulary, FoundationPage, LevelPage } from './features/beginner/LearningPages'
import { Onboarding } from './features/beginner/Onboarding'
import './features/beginner/learning.css'
import { Dashboard } from './features/Dashboard'
import { GrammarPage, VocabularyPage } from './features/Lessons'
import { MistakesPage, SettingsPage, StatisticsPage, WeaknessPage } from './features/ProgressPages'
import { Quiz } from './features/Quiz'
import { PartPage, PlanPage, RoadmapPage, SkillPage, TestPage } from './features/StudyPages'
import { useLearning } from './hooks/useLearning'
import type { AuthState } from './hooks/useAuth'
import { getStats } from './progress'
import { activeQuiz, setActiveQuiz } from './quizDraft'
import { navigate } from './routing'
import type { AnswerRecord, Part, Question, QuizConfig, Settings, StudyTrack, WordStatus } from './types'

function decode(path?: string) {
  if (!path) return undefined
  try { return decodeURIComponent(path) } catch { return path }
}

export default function Workspace({ auth, route }: { auth: AuthState & { user: NonNullable<AuthState['user']> }; route: string }) {
  const ownerId = auth.user.id
  const [quiz, setQuiz] = useState<QuizConfig | null>(() => route === 'practice' ? activeQuiz(ownerId) : null)
  const learning = useLearning(ownerId)
  const { progress, dispatch, storageIssue } = learning
  const stats = getStats(progress)
  const [page, section, focus] = route.split('/')

  useEffect(() => {
    window.scrollTo(0, 0)
    if (page !== 'practice') {
      setQuiz(null)
      setActiveQuiz(null, ownerId)
    }
  }, [route, page, ownerId])

  useEffect(() => {
    document.documentElement.dataset.theme = progress.settings.theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', progress.settings.theme === 'dark' ? '#0e1728' : '#f5f7fb')
  }, [progress.settings.theme])

  function start(config: Omit<QuizConfig, 'id'>) {
    if (!config.questions.length) return
    const next = { ...config, id: crypto.randomUUID() }
    setActiveQuiz(next, ownerId)
    setQuiz(next)
    window.location.hash = 'practice'
  }

  function practice(questions: Question[], title: string, lessonId?: string) {
    const grammar = grammarLessons.find(lesson => lesson.id === lessonId)
    const vocabTopic = lessonId?.startsWith('vocab-quiz-') ? lessonId.slice('vocab-quiz-'.length) : undefined
    const returnTo = grammar ? `grammar/${encodeURIComponent(grammar.topic)}`
      : vocabTopic && vocabTopic !== 'all' ? `vocabulary/${encodeURIComponent(vocabTopic)}` : route
    start({ questions, title, lessonId, mode: 'practice', returnTo })
  }

  function onFinish(config: QuizConfig, records: AnswerRecord[], seconds: number, exam: boolean) {
    const correct = records.filter(record => record.correct).length
    const at = new Date().toISOString()
    const session = { id: config.id, title: config.title, mode: config.mode, at, seconds, total: records.length, correct }
    dispatch({ type: 'finish', session, records: exam ? records : [], lessonId: config.lessonId })
  }

  function onMark(id: string, status: WordStatus, topic: string, seconds: number) {
    const at = new Date().toISOString()
    dispatch({ type: 'word', id, status, topic, session: {
      id: crypto.randomUUID(), title: `Từ vựng · ${topic}`, mode: 'vocab', seconds, at, total: 0, correct: 0,
    } })
  }

  function onPlan(key: string, checked: boolean) {
    dispatch({ type: 'plan', id: key, checked })
  }

  function onSettings(settings: Partial<Settings>) {
    dispatch({ type: 'preferences', settings })
  }

  function toggleTheme() {
    onSettings({ theme: progress.settings.theme === 'dark' ? 'light' : 'dark' })
  }

  function chooseTrack(studyTrack: StudyTrack) {
    onSettings({ studyTrack })
    navigate('home', true)
  }

  function showPage() {
    if (page === 'account') return <AccountPage user={auth.user} learning={learning} streak={stats.streak} seconds={stats.totalSeconds} notice={auth.notice} />
    if (!learning.ready) return <EmptyState title={learning.phase === 'connecting' ? 'Đang tải tiến độ tài khoản' : 'Chưa tải được tiến độ tài khoản'}>
      {learning.phase !== 'connecting' && <button className="button secondary" onClick={() => void learning.sync()}>Thử đồng bộ lại</button>}
    </EmptyState>
    switch (page) {
      case 'home': return <Dashboard progress={progress} stats={stats} onPlan={onPlan} onChoose={chooseTrack} />
      case 'roadmap': return <RoadmapPage progress={progress} selected={section} />
      case 'onboarding': return <Onboarding onChoose={chooseTrack} />
      case 'foundation': return <FoundationPage lessonId={section} completed={progress.completed} onPractice={practice} />
      case 'ipa': return <IpaPage section={section} detail={focus} completed={progress.completed} onPractice={practice} />
      case 'beginner-vocabulary': return <BeginnerVocabulary progress={progress} onMark={onMark} onPractice={practice} />
      case 'beginner-listening': return <BeginnerListening stepId={section} progress={progress} onPractice={practice} />
      case 'level': return <LevelPage level={section} practiceId={focus} progress={progress} onPractice={practice} />
      case 'listening': return <SkillPage skill="Listening" />
      case 'reading': return <SkillPage skill="Reading" />
      case 'parts': {
        const part = Number(section) as Part
        if (parts.includes(part)) return <PartPage part={part} topic={decode(focus)} onStart={practice} />
        break
      }
      case 'vocabulary': return <VocabularyPage statuses={progress.vocabulary} topic={decode(section)} onMark={onMark} onPractice={practice} />
      case 'grammar': return <GrammarPage topic={decode(section)} completed={progress.completed} onPractice={practice} />
      case 'weakness': return <WeaknessPage stats={stats} selected={decode(section)} onStart={(questions, title) => start({ questions, title, mode: 'weakness', lessonId: 'weakness', returnTo: route })} />
      case 'mini-test': return <TestPage mode="mini" onStart={start} />
      case 'mock-test': return <TestPage mode="mock" onStart={start} />
      case 'mistakes': return <MistakesPage progress={progress}
        onStart={(questions, title) => start({ questions, title, mode: 'review', lessonId: 'review', returnTo: route })}
        onUnderstand={(id, checked) => dispatch({ type: 'understood', id, checked })} />
      case 'plan': return <PlanPage progress={progress} onPlan={onPlan} />
      case 'statistics': return <StatisticsPage progress={progress} stats={stats} />
      case 'settings': return <SettingsPage settings={progress.settings} onChange={onSettings} accountMode={Boolean(ownerId)} onReset={() => dispatch({ type: 'reset' })} />
      case 'practice': return quiz ? <Quiz key={quiz.id} config={quiz} speed={progress.settings.speed} ownerId={ownerId}
        onAnswer={record => dispatch({ type: 'answer', record })} onFinish={onFinish}
        onRestart={() => start(quiz)} /> : <EmptyState title="Hãy chọn một bài để bắt đầu luyện tập"><a href="#roadmap" className="button primary">Mở lộ trình</a></EmptyState>
    }
    return <EmptyState title="Trang này không tồn tại"><a className="button primary" href="#home">Về tổng quan</a></EmptyState>
  }

  return <Shell route={route} settings={progress.settings} xp={progress.xp} streak={stats.streak} storageIssue={storageIssue}
    onTheme={() => { if (learning.ready) toggleTheme() }}
    account={<AccountMenu user={auth.user} displayName={learning.displayName} route={route} />}>
    {learning.phase === 'offline' && <p className="storage-warning" role="status">Bạn đang ngoại tuyến. {learning.ready ? 'Thay đổi được lưu trên thiết bị này.' : 'Kết nối mạng để tải tiến độ tài khoản.'}{ownerId && learning.pending > 0 && ` ${learning.pending} thay đổi chờ đồng bộ.`}</p>}
    {ownerId && learning.phase === 'error' && <div className="account-banner" role="status"><span>Đồng bộ chưa thành công. {learning.pending ? `${learning.pending} thay đổi đang chờ trên thiết bị.` : 'Hãy thử lại khi kết nối ổn định.'}</span><button className="button secondary" onClick={() => void learning.sync()}>Thử lại</button></div>}
    {ownerId && learning.hasGuestData && <section className="account-banner" aria-label="Nhập tiến độ học khách">
      <div><strong>Đồng bộ tiến độ học khách?</strong><p>Thêm bài học trên thiết bị này vào tài khoản. Khi dữ liệu trùng, giữ mục đã lưu trên tài khoản.</p></div>
      <div className="button-group"><button className="button secondary" onClick={() => learning.chooseImport(false)}>Để trên thiết bị</button><button className="button primary" onClick={() => learning.chooseImport(true)}>Nhập tiến độ</button></div>
    </section>}
    {showPage()}
  </Shell>
}
