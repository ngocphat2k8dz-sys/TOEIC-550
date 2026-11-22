import type { Question } from '../../types'
import { beginnerQuestion } from '../beginnerQuestion'
import { foundationLessons } from '../foundations'
import type { Exercise, LessonMaterial } from './author'
import { foundationCore } from './foundation-core'
import { foundationExtension } from './foundation-extension'
import { starterBasics } from './starter-basics'
import { starterSentences } from './starter-sentences'
import { studyWords } from './words'

export interface StudyLesson {
  id: string
  completionId: string
  title: string
  goal: string
  notes: LessonMaterial['notes']
  examples: LessonMaterial['examples']
  vocabulary: readonly string[]
  questions: Question[]
  review: boolean
}

interface StudyModule { id: string; title: string; lessons: StudyLesson[] }
interface StudyStage { id: 'starter' | 'foundation'; title: string; modules: StudyModule[] }

function makeQuestion(id: string, material: LessonMaterial, exercise: Exercise, index: number): Question {
  const [prompt, choices, translation, why, context] = exercise
  const options = choices.split(' | ')
  const reasons = options.map((option, position) => position === 0 ? why :
    context?.reasons?.[position - 1] ?? `“${option}” chưa khớp với cách dùng hoặc ý cần diễn đạt trong câu này.`)
  const shift = (index + material.id.length) % options.length
  const wordsInQuestion = new Set(`${translation.split('→')[0]} ${context?.passage ?? ''} ${prompt}`
    .toLowerCase().match(/(?<!\p{L})[a-z]+(?!\p{L})/gu))
  const terms = [...wordsInQuestion].flatMap(word => {
    const entry = studyWords.get(word)
    return entry ? [[entry.word, entry.meaning] as const] : []
  }).slice(0, 3)
  const [english, vietnamese] = material.examples[index % material.examples.length]
  const spoken = context?.audio && { text: context.audio[0], audioId: context.audio[1] }
  const question = beginnerQuestion(id, 'foundation', material.title, prompt,
    [...options.slice(shift), ...options.slice(0, shift)], (options.length - shift) % options.length,
    { translation, words: context?.words ?? terms, concept: material.title, simple: why, example: context?.example ?? `${english} → ${vietnamese}` },
    [...reasons.slice(shift), ...reasons.slice(0, shift)], context?.tip ?? '', spoken)
  if (context?.passage) question.passages = [{ title: 'Đoạn đọc', text: context.passage }]
  return question
}

function buildLesson(material: LessonMaterial): StudyLesson {
  const existing = foundationLessons.find(lesson => lesson.id === material.id)
  const completionId = existing?.completionId ?? 'foundation-' + material.id
  const questions = material.practice.map((exercise, index) => makeQuestion(`${completionId}-practice-${index + 1}`, material, exercise, index))
  return {
    id: material.id, completionId, title: material.title, goal: material.goal, notes: material.notes,
    examples: material.examples, vocabulary: material.vocabulary, questions: [...questions, ...(existing?.questions ?? [])], review: false,
  }
}

const materialById = new Map([...starterBasics, ...starterSentences, ...foundationCore, ...foundationExtension].map(material => [material.id, material]))

function buildModule(id: string, title: string, lessonIds: string[], reviewTitle?: string): StudyModule {
  const materials = lessonIds.map(lessonId => {
    const material = materialById.get(lessonId)
    if (!material) throw new Error(`Missing lesson material: ${lessonId}`)
    return material
  })
  const lessons = materials.map(buildLesson)
  if (reviewTitle) {
    const reviewId = 'review-' + id
    const completionId = 'foundation-' + reviewId
    const rounds = Math.max(...materials.map(material => material.review?.length ?? 0))
    const questions = Array.from({ length: rounds }, (_, index) => materials.flatMap(material => {
      const exercise = material.review?.[index]
      return exercise ? [makeQuestion(`${completionId}-${material.id}-${index + 1}`, material, exercise, index)] : []
    })).flat()
    lessons.push({
      id: reviewId, completionId, title: reviewTitle, review: true,
      goal: 'Dùng lại kiến thức của các bài vừa học trong tình huống mới.',
      notes: materials.map(material => [material.title, material.goal]),
      examples: materials.map(material => material.examples[0]),
      vocabulary: [], questions,
    })
  }
  return { id, title, lessons }
}

export const courseStages: StudyStage[] = [
  { id: 'starter', title: 'Mất gốc', modules: [
    buildModule('first-words', '1. Từ chữ cái đến câu đầu tiên',
      ['alphabet', 'sounds', 'hello', 'sentence', 'pronouns'], 'Ôn tập · Chữ cái, câu và đại từ'),
    buildModule('simple-sentences', '2. Gọi tên và mô tả',
      ['be', 'nouns', 'articles', 'adjectives', 'verbs'], 'Ôn tập · BE, danh từ và động từ'),
    buildModule('everyday-sentences', '3. Hỏi và nói trong tình huống quen thuộc',
      ['questions', 'prepositions', 'ownership', 'there', 'can'], 'Ôn tập · Câu giao tiếp cơ bản'),
  ] },
  { id: 'foundation', title: 'Xây nền', modules: [
    buildModule('time', '1. Nói về hiện tại, quá khứ và tương lai',
      ['present-simple', 'present-continuous', 'past-simple', 'future'], 'Ôn tập · Các mốc thời gian'),
    buildModule('description', '2. Nói rõ về người, vật và số lượng',
      ['quantifiers', 'pronoun-forms', 'adverbs', 'comparison'], 'Ôn tập · Từ loại, số lượng và so sánh'),
    buildModule('connecting', '3. Nối ý, đặt câu hỏi và đọc đoạn ngắn',
      ['preposition-use', 'conjunctions', 'modals', 'question-patterns', 'short-reading'], 'Ôn tập · Từ nối, câu hỏi và đọc hiểu'),
    buildModule('meet-toeic', '4. Làm quen với TOEIC', ['toeic-bridge']),
  ] },
]

const lessonEntries = courseStages.flatMap(stage => {
  let number = 0
  return stage.modules.flatMap(group => group.lessons.map(lesson => ({ stage, group, lesson, number: ++number })))
})

export const studyLessons = lessonEntries.map(({ lesson }) => lesson)
export const studyQuestions = studyLessons.flatMap(lesson => lesson.questions)
export const studyLessonById = new Map(lessonEntries.map(entry => [entry.lesson.id, entry]))
export const studyLessonByCompletion = new Map(lessonEntries.map(entry => [entry.lesson.completionId, entry]))

export const studyLessonRoute = (id: string) => `foundation/${id}`
