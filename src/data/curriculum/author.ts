export type Pair = readonly [string, string]

export type Exercise = readonly [
  prompt: string,
  choices: string,
  translation: string,
  why: string,
  context?: {
    words?: readonly Pair[]
    passage?: string
    audio?: readonly [text: string, audioId: string]
    reasons?: readonly string[]
    tip?: string
    example?: string
  },
]

export interface LessonMaterial {
  id: string
  title: string
  goal: string
  notes: readonly Pair[]
  examples: readonly Pair[]
  vocabulary: readonly string[]
  practice: readonly Exercise[]
  review?: readonly Exercise[]
}
