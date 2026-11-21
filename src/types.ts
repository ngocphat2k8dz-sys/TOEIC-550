export type Part = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type Skill = 'Listening' | 'Reading'
export type Mode = 'practice' | 'mini' | 'mock' | 'review' | 'weakness'
export type Speed = 0.75 | 1 | 1.25
export type WordStatus = 'known' | 'review'

export interface Question {
  id: string
  part: Part
  topic: string
  prompt: string
  options: string[]
  answer: number
  rationale: string
  optionReasons: string[]
  tip: string
  keywords?: string[]
  grammar?: string
  vocabulary?: string[]
  passages?: { title: string; text: string }[]
  transcript?: string
  image?: { src: string; alt: string }
  audio?: string
}

export interface AnswerRecord {
  id?: string
  questionId: string
  choice: number | null
  correct: boolean
  at: string
}

export interface StudySession {
  id: string
  mode: Mode | 'vocab'
  title: string
  seconds: number
  at: string
  total: number
  correct: number
  listeningScore?: number | null
  readingScore?: number | null
}

export interface Settings {
  theme: 'light' | 'dark'
  speed: Speed
  dailyGoal: number
  target: number
}

export interface ProgressData {
  answers: AnswerRecord[]
  sessions: StudySession[]
  completed: string[]
  vocabulary: Record<string, WordStatus>
  wordReviews: Record<string, { count: number; at: string | null }>
  earnedWords: string[]
  understood: Record<string, boolean>
  plan: Record<string, boolean>
  planDates: Record<string, string | null>
  settings: Settings
  xp: number
}

export interface QuizConfig {
  id: string
  title: string
  mode: Mode
  questions: Question[]
  lessonId?: string
  minutes?: number
  returnTo: string
}
