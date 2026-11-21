import { questionById } from '../data/questions'
import { vocabulary } from '../data/vocabulary'
import { accuracy, addAnswers, addSession, attemptId, defaultProgress, getStats, normalizeProgress, scoreBySkill } from '../progress'
import type { AnswerRecord, ProgressData, Settings, StudySession, WordStatus } from '../types'

export interface LearningState {
  progress: ProgressData
  displayName: string
  resetAt: number
}

export type LearningAction =
  | { type: 'answer'; record: AnswerRecord }
  | { type: 'finish'; session: StudySession; records: AnswerRecord[]; lessonId?: string }
  | { type: 'word'; id: string; status: WordStatus; topic: string; session: StudySession }
  | { type: 'plan'; id: string; checked: boolean }
  | { type: 'understood'; id: string; checked: boolean }
  | { type: 'preferences'; settings: Partial<Settings>; displayName?: string }
  | { type: 'reset' }
  | { type: 'import'; guest: ProgressData }

export interface PendingAction {
  id: string
  stamp: number
  action: LearningAction
}

export interface VersionedLearning {
  revision: number
  state: LearningState
}

export function normalizeLearning(state?: Partial<LearningState>): LearningState {
  return {
    progress: normalizeProgress(state?.progress),
    displayName: state?.displayName ?? '',
    resetAt: state?.resetAt ?? 0,
  }
}

export function hasLearning(progress: ProgressData) {
  return Boolean(progress.answers.length || progress.sessions.length || progress.completed.length ||
    Object.keys(progress.vocabulary).length || Object.values(progress.plan).some(Boolean) || progress.xp)
}

function mergeGuest(cloud: ProgressData, guest: ProgressData): ProgressData {
  const cloudSessions = new Set(cloud.sessions.map(session => session.id))
  const cloudQuestions = new Set(cloud.answers.filter(answer => !answer.correct).map(answer => answer.questionId))
  const sessions = guest.sessions.filter(session => !cloudSessions.has(session.id))
  const additions = guest.completed.filter(id => !cloud.completed.includes(id))
  const newWords = guest.earnedWords.filter(id => !cloud.earnedWords.includes(id))
  const newTests = sessions.filter(session => session.mode === 'mini' || session.mode === 'mock').length
  const newLessons = additions.filter(id => !['mini', 'mock', 'mock-target', 'vocab-office'].includes(id)).length
  const extraXP = 20 * newTests + 10 * newLessons + 2 * newWords.length
  const guestFlags = Object.fromEntries(Object.entries(guest.understood).filter(([id]) => !cloudQuestions.has(id)))
  const considered = addAnswers(cloud, guest.answers)
  const fresh = !hasLearning(cloud)
  return {
    ...considered,
    sessions: [...cloud.sessions, ...sessions].sort((a, b) => a.at.localeCompare(b.at)),
    completed: [...new Set([...cloud.completed, ...additions])],
    earnedWords: [...new Set([...cloud.earnedWords, ...newWords])],
    vocabulary: { ...guest.vocabulary, ...cloud.vocabulary },
    wordReviews: { ...guest.wordReviews, ...cloud.wordReviews },
    plan: { ...guest.plan, ...cloud.plan },
    planDates: { ...guest.planDates, ...cloud.planDates },
    understood: { ...considered.understood, ...guestFlags, ...cloud.understood },
    settings: fresh && JSON.stringify(cloud.settings) === JSON.stringify(defaultProgress.settings) ? guest.settings : cloud.settings,
    xp: cloud.xp + (fresh ? guest.xp : Math.min(guest.xp, extraXP)),
  }
}

export function applyLearning(state: LearningState, { action, stamp }: PendingAction): LearningState {
  const progress = state.progress
  if (action.type === 'preferences') return {
    ...state, displayName: action.displayName ?? state.displayName,
    progress: { ...progress, settings: { ...progress.settings, ...action.settings } },
  }
  if (action.type === 'import') return { ...state, progress: mergeGuest(progress, action.guest) }
  if (stamp <= state.resetAt) return state
  if (action.type === 'reset') return {
    ...state, resetAt: stamp, progress: { ...defaultProgress, settings: progress.settings },
  }
  if (action.type === 'answer') return { ...state, progress: addAnswers(progress, [action.record]) }
  if (action.type === 'finish') {
    const { session, records, lessonId } = action
    if (progress.sessions.some(entry => entry.id === session.id)) return state
    const lessonIds = lessonId ? [lessonId] : []
    if (lessonId === 'vocab-quiz-Office') lessonIds.push('vocab-office')
    const exam = session.mode === 'mini' || session.mode === 'mock'
    const scores = exam ? scoreBySkill(records) : undefined
    if (session.mode === 'mock' && (scores?.totalScore ?? 0) >= progress.settings.target) lessonIds.push('mock-target')
    const award = exam ? 20 : lessonIds.some(id => !progress.completed.includes(id)) ? 10 : 0
    return {
      ...state,
      progress: addSession(addAnswers(progress, records), {
        ...session, listeningScore: scores?.listeningScore, readingScore: scores?.readingScore,
      }, lessonIds, award),
    }
  }
  if (action.type === 'word') {
    const { id, status, topic, session } = action
    if (progress.sessions.some(entry => entry.id === session.id)) return state
    const statuses = { ...progress.vocabulary, [id]: status }
    const newWord = status === 'known' && !progress.earnedWords.includes(id)
    const learned = topic === 'Office' && vocabulary.filter(word => word.topic === topic).every(word => statuses[word.id] === 'known')
    const reviews = { count: (progress.wordReviews[id]?.count ?? Number(id in progress.vocabulary)) + 1, at: session.at }
    return {
      ...state,
      progress: addSession({
        ...progress, vocabulary: statuses,
        wordReviews: { ...progress.wordReviews, [id]: reviews },
        earnedWords: newWord ? [...progress.earnedWords, id] : progress.earnedWords,
      }, session, learned ? ['vocab-office'] : [], newWord ? 2 : 0),
    }
  }
  if (action.type === 'plan') return {
    ...state, progress: {
      ...progress, plan: { ...progress.plan, [action.id]: action.checked },
      planDates: { ...progress.planDates, [action.id]: action.checked ? new Date(stamp).toISOString() : null },
    },
  }
  return {
    ...state, progress: { ...progress, understood: { ...progress.understood, [action.id]: action.checked } },
  }
}

export function learningRows(progress: ProgressData) {
  const stats = getStats(progress)
  const attempts = [...new Map(progress.answers.map(answer => [attemptId(answer), answer])).entries()].flatMap(([id, answer]) => {
    const question = questionById.get(answer.questionId)
    return question ? [{
      id, question_id: answer.questionId, part: question.part, topic: question.topic, selected_answer: answer.choice,
      correct_answer: question.answer, is_correct: answer.correct, attempted_at: answer.at,
    }] : []
  })
  const firstWrong = new Map<string, typeof attempts[number]>()
  for (const attempt of attempts) {
    if (!attempt.is_correct && !firstWrong.has(attempt.question_id)) firstWrong.set(attempt.question_id, attempt)
  }
  return {
    totals: {
      streak: stats.streak, minutes: stats.totalSeconds / 60, correct: stats.correct, wrong: stats.total - stats.correct,
      listening: stats.listeningScore, reading: stats.readingScore,
    },
    attempts,
    wrong: [...firstWrong.values()].map(a => ({
      question_id: a.question_id, part: a.part, topic: a.topic, created_at: a.attempted_at,
      status: progress.understood[a.question_id] ? 'understood' : 'open',
    })),
    vocabulary: Object.entries(progress.vocabulary).map(([id, status]) => ({
      vocab_id: id, status, review_count: progress.wordReviews[id]?.count ?? 1, last_reviewed_at: progress.wordReviews[id]?.at ?? null,
    })),
    sessions: progress.sessions.map(s => ({
      id: s.id, activity_type: s.mode, title: s.title, duration_minutes: s.seconds / 60, score: s.total ? accuracy(s.correct, s.total) : null,
      correct_count: s.correct, total_count: s.total, created_at: s.at,
      listening_score_estimate: s.listeningScore ?? null, reading_score_estimate: s.readingScore ?? null,
    })),
    plan: Object.entries(progress.plan).map(([id, completed]) => ({
      plan_item_id: id, completed, completed_at: completed ? progress.planDates[id] ?? null : null,
    })),
  }
}
