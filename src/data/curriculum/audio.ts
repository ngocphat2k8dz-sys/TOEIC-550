import type { Question } from '../../types'
import { beginnerWordQuestions } from '../beginnerVocabulary'
import { foundationLessons } from '../foundations'
import { normalizeLearningText } from '../learningAudio'
import { originalClipByText, type LearningClip } from '../learningAudioCatalog'
import { studyLessons } from './index'
import { studyWords } from './words'

export const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ', (letter, index) => ({
  letter,
  ipa: ['eɪ', 'biː', 'siː', 'diː', 'iː', 'ɛf', 'dʒiː', 'eɪtʃ', 'aɪ', 'dʒeɪ', 'keɪ', 'ɛl', 'ɛm', 'ɛn', 'oʊ', 'piː', 'kjuː', 'ɑr', 'ɛs', 'tiː', 'juː', 'viː', 'ˈdʌbəl juː', 'ɛks', 'waɪ', 'ziː'][index],
  clip: curriculumClip(`Letter ${letter}.`),
}))

export function curriculumClip(content: string): LearningClip {
  const text = normalizeLearningText(content
    .replace(/^A\s*→\s*a$/, 'Uppercase A. Lowercase A.')
    .replace(/\/[^/\n]+\//g, '')
    .replace(/\s+\/\s+/g, '. ')
    .replace(/\b([A-Z])(?=[–-][A-Z]\b)/g, '$1,')
    .replace(/(?<=\b[A-Z],)[–-](?=[A-Z]\b)/g, ' ')
    .replace(/\s*→\s*/g, '. ')
    .replace(/\s+([.,!?])/g, '$1'))
  const original = originalClipByText.get(text)
  if (original) return original
  let hash = 2166136261
  for (const character of text) hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619)
  return { id: 'curriculum-' + (hash >>> 0).toString(16).padStart(8, '0'), text }
}

function englishSide(value?: string) {
  const text = value?.split(/[→=]/, 1)[0].replace(/\/[^/\n]+\//g, '').trim()
  return text && /[a-z]/i.test(text) && !/[^\u0000-\u007f‘’“”–—…]/.test(text) ? text : undefined
}

export function curriculumAnswerClip(question: Question) {
  if (question.track !== 'foundation' || question.transcript) return undefined
  const answer = question.options[question.answer]
  if (question.id.includes('-alphabet-')) {
    if (/^[a-z]$/i.test(answer)) return curriculumClip(`Letter ${answer.toUpperCase()}.`)
    if (/^[A-Z](?:[–-][A-Z]|, [A-Z])+$/.test(answer)) return curriculumClip(`Letters ${answer.replace(/[–-]/g, ', ')}.`)
  }
  const text = question.passages?.map(passage => passage.text).join('\n') || englishSide(question.beginner?.translation)
    || englishSide(answer) || englishSide(question.beginner?.example)
  return text ? curriculumClip(text) : undefined
}

export function curriculumClips(): LearningClip[] {
  return [
    ...alphabet.map(item => item.clip),
    ...Array.from(studyWords.values()).flatMap(word => [curriculumClip(word.word), curriculumClip(word.example)]),
    ...beginnerWordQuestions.flatMap(question => curriculumAnswerClip(question) ?? []),
    ...[...studyLessons, ...foundationLessons].flatMap(lesson => [
      ...lesson.examples.map(([english]) => curriculumClip(english)),
      ...lesson.questions.flatMap(question => curriculumAnswerClip(question) ?? []),
    ]),
  ]
}
