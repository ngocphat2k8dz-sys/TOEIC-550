import { parts, skillOf } from './data/course'
import { bankIds, questionById } from './data/questions'
import type { AnswerRecord, Part, ProgressData, Question, StudySession } from './types'

export const storageKey = 'toeic-550-study-progress-v1'
export const defaultProgress: ProgressData = {
  answers: [], sessions: [], completed: [], vocabulary: {}, wordReviews: {}, earnedWords: [], understood: {}, plan: {}, planDates: {}, xp: 0,
  settings: { theme: 'light', speed: 1, dailyGoal: 30, target: 550 },
}

export function normalizeProgress(stored?: Partial<ProgressData> | null): ProgressData {
  const data = stored && typeof stored === 'object' ? stored : undefined
  return { ...defaultProgress, ...data, settings: { ...defaultProgress.settings, ...data?.settings } }
}

export function readGuestProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return defaultProgress
    return normalizeProgress(JSON.parse(raw))
  } catch {
    return defaultProgress
  }
}

export function dayKey(value = new Date()) {
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${value.getFullYear()}-${month}-${day}`
}

export function compactDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(new Date(value))
}

export function localDate(offset = 0, from = new Date()) {
  return new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset, 12)
}

export function weekDays(value = new Date()) {
  const weekday = (value.getDay() + 6) % 7
  return Array.from({ length: 7 }, (_, index) => localDate(index - weekday, value))
}

export function clockText(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds))
  return `${Math.floor(safe / 60).toString().padStart(2, '0')}:${(safe % 60).toString().padStart(2, '0')}`
}

export function durationText(seconds: number) {
  if (seconds < 60) return seconds ? `${seconds} giây` : '0 phút'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} phút`
  return `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`
}

export function accuracy(correct: number, total: number) {
  return total ? Math.round(correct / total * 100) : 0
}

export function estimate(correct: number, total: number) {
  return total ? Math.round((5 + correct / total * 490) / 5) * 5 : null
}

export function attemptId(record: AnswerRecord): string {
  return record.id ?? `legacy:${record.questionId}:${record.at}:${record.choice}`
}

export function recordAnswer(question: Question, choice: number | null, at: string, id: string): AnswerRecord {
  return { id, questionId: question.id, choice, correct: choice === question.answer, at }
}

export function addAnswers(progress: ProgressData, records: AnswerRecord[]): ProgressData {
  const understood = { ...progress.understood }
  const existing = new Set(progress.answers.map(attemptId))
  const added: AnswerRecord[] = []
  for (const record of records) {
    const id = attemptId(record)
    if (existing.has(id)) continue
    existing.add(id)
    added.push(record)
    if (!record.correct) delete understood[record.questionId]
  }
  return added.length ? {
    ...progress, answers: [...progress.answers, ...added].sort((a, b) => a.at.localeCompare(b.at)), understood,
  } : progress
}

export function addSession(progress: ProgressData, session: StudySession, lessonIds: string[], award: number): ProgressData {
  if (progress.sessions.some(previous => previous.id === session.id)) return progress
  return {
    ...progress,
    sessions: [...progress.sessions, session].sort((a, b) => a.at.localeCompare(b.at)),
    completed: [...new Set([...progress.completed, ...lessonIds])],
    xp: progress.xp + award,
  }
}

export interface Breakdown {
  total: number
  correct: number
  rate: number
}

function summarize(records: AnswerRecord[]): Breakdown {
  const correct = records.filter(record => record.correct).length
  return { total: records.length, correct, rate: accuracy(correct, records.length) }
}

export interface TopicBreakdown extends Breakdown {
  topic: string
  part: Part
  key: string
  wrong: number
  questionIds: string[]
}

export function groupTopics(records: AnswerRecord[]): TopicBreakdown[] {
  const groups = new Map<string, { topic: string; part: Part; records: AnswerRecord[] }>()
  for (const record of records) {
    const question = questionById.get(record.questionId)
    if (!question) continue
    const key = `${question.part}:${question.topic}`
    const group = groups.get(key) ?? { topic: question.topic, part: question.part, records: [] }
    group.records.push(record)
    groups.set(key, group)
  }
  return [...groups.entries()].map(([key, { topic, part, records: attempts }]) => {
    const result = summarize(attempts)
    return { ...result, key, topic, part, wrong: result.total - result.correct, questionIds: [...new Set(attempts.filter(attempt => !attempt.correct).map(attempt => attempt.questionId))] }
  })
}

export function weakTopics(records: AnswerRecord[]) {
  return groupTopics(records).filter(topic => topic.wrong > 0).sort((a, b) => b.wrong - a.wrong || a.rate - b.rate)
}

export function byPart(records: AnswerRecord[]) {
  return parts.map(part => ({ part, ...summarize(records.filter(record => questionById.get(record.questionId)?.part === part)) }))
}

export function scoreBySkill(records: AnswerRecord[]) {
  const forSkill = (skill: 'Listening' | 'Reading') => summarize(records.filter(record => {
    const question = questionById.get(record.questionId)
    return question && skillOf(question.part) === skill
  }))
  const listening = forSkill('Listening')
  const reading = forSkill('Reading')
  const listeningScore = estimate(listening.correct, listening.total)
  const readingScore = estimate(reading.correct, reading.total)
  const totalScore = listeningScore === null || readingScore === null ? null : listeningScore + readingScore
  return { listening, reading, listeningScore, readingScore, totalScore }
}

export function getStats(progress: ProgressData) {
  const records = progress.answers.filter(record => questionById.has(record.questionId))
  const examRecords = records.filter(record => bankIds.has(record.questionId))
  const today = dayKey()
  const secondsByDay: Record<string, number> = {}
  const activeDays = new Set(records.map(record => dayKey(new Date(record.at))))
  for (const session of progress.sessions) {
    const key = dayKey(new Date(session.at))
    activeDays.add(key)
    secondsByDay[key] = (secondsByDay[key] ?? 0) + session.seconds
  }
  let streak = 0
  let offset = activeDays.has(today) ? 0 : -1
  while (activeDays.has(dayKey(localDate(offset)))) {
    streak++
    offset--
  }
  return {
    ...summarize(records),
    ...scoreBySkill(examRecords),
    parts: byPart(examRecords),
    topics: groupTopics(records),
    weak: weakTopics(records),
    streak,
    activeDays,
    secondsByDay,
    todaySeconds: secondsByDay[today] ?? 0,
    totalSeconds: progress.sessions.reduce((total, session) => total + session.seconds, 0),
    known: Object.values(progress.vocabulary).filter(state => state === 'known').length,
  }
}
