import { questionById } from './data/questions'
import type { AnswerRecord, QuizConfig, Speed } from './types'

const configKey = 'toeic-study-active-quiz'
const stateKey = 'toeic-study-quiz-state'
const scoped = (key: string, ownerId?: string) => ownerId ? `${key}:${ownerId}` : key

export interface QuizResult {
  records: AnswerRecord[]
  seconds: number
}

export interface QuizDraft {
  id: string
  index: number
  choices: (number | null)[]
  graded: Record<number, AnswerRecord>
  result: QuizResult | null
  start: number
  playbackSpeed: Speed
}

export function activeQuiz(ownerId?: string): QuizConfig | null {
  try {
    const raw = sessionStorage.getItem(scoped(configKey, ownerId))
    if (!raw) return null
    const { questionIds, ...config }: Omit<QuizConfig, 'questions'> & { questionIds: string[] } = JSON.parse(raw)
    const questions = questionIds.flatMap(id => questionById.get(id) ?? [])
    return questions.length && questions.length === questionIds.length && config.id ? { ...config, questions } : null
  } catch {
    return null
  }
}

export function setActiveQuiz(config: QuizConfig | null, ownerId?: string) {
  try {
    sessionStorage.removeItem(scoped(stateKey, ownerId))
    if (!config) {
      sessionStorage.removeItem(scoped(configKey, ownerId))
      return
    }
    const { questions, ...settings } = config
    sessionStorage.setItem(scoped(configKey, ownerId), JSON.stringify({ ...settings, questionIds: questions.map(question => question.id) }))
  } catch {
    // The current session still works if browser storage is unavailable.
  }
}

export function getQuizDraft(config: QuizConfig, speed: Speed, ownerId?: string): QuizDraft {
  try {
    const raw = sessionStorage.getItem(scoped(stateKey, ownerId))
    const draft: QuizDraft | null = raw ? JSON.parse(raw) : null
    if (draft?.id === config.id && draft.choices.length === config.questions.length && config.questions[draft.index]) return draft
  } catch {
    // Start with an empty quiz if the previous draft cannot be read.
  }
  return {
    id: config.id, index: 0, choices: config.questions.map(() => null), graded: {}, result: null,
    start: Date.now(), playbackSpeed: speed,
  }
}

export function saveQuizDraft(draft: QuizDraft, ownerId?: string) {
  try {
    if (activeQuiz(ownerId)?.id === draft.id) sessionStorage.setItem(scoped(stateKey, ownerId), JSON.stringify(draft))
  } catch {
    // The current session still works if browser storage is unavailable.
  }
}
