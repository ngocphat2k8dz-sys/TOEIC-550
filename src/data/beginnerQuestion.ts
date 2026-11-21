import type { BeginnerExplanation, LearningTrack, Question } from '../types'
import { learningAudio } from './learningAudio'

export function beginnerQuestion(
  id: string, track: LearningTrack, topic: string, prompt: string, options: string[], answer: number,
  beginner: BeginnerExplanation, optionReasons: string[], tip: string,
  spoken?: { text: string; audioId: string; keywords?: string[] },
): Question {
  return {
    id, track, part: track === 'foundation' ? 5 : 2, topic, prompt, options, answer,
    beginner, rationale: beginner.simple, optionReasons, tip,
    ...(spoken && { transcript: spoken.text, audio: learningAudio(spoken.audioId), keywords: spoken.keywords }),
  }
}

export function questionGroup(question: Pick<Question, 'track' | 'part'>): string {
  if (question.track === 'ipa') return 'Phát âm IPA'
  if (question.track === 'beginner-listening') return 'Nghe từ đầu'
  if (question.track === 'foundation') return 'Tiếng Anh nền tảng'
  return 'Part ' + question.part
}
