import { foundationLessons } from './foundations'
import { ipaLessons } from './ipa'
import { ipaCourse } from './ipaCourse'
import { listeningSteps } from './beginnerListening'
import { beginnerWordQuestions } from './beginnerVocabulary'
import { questionById } from './questions'
import { stages as originalStages, type CourseLesson } from './course'
import { courseStages, studyLessonRoute, studyLessons } from './curriculum'
import type { ProgressData, StudyTrack } from '../types'

export const trackChoices = [
  { id: 'starter', label: 'Tôi mất gốc tiếng Anh', description: 'Bắt đầu với bảng chữ cái, phát âm và những câu đầu tiên.' },
  { id: 'foundation', label: 'Tôi đã có kiến thức cơ bản', description: 'Học cách nói về thời gian, nối ý, đặt câu hỏi và đọc đoạn ngắn.' },
  { id: 'toeic', label: 'Tôi muốn luyện TOEIC', description: 'Làm quen dạng bài ở mốc 350, rồi luyện chiến thuật và thi thử.' },
] as const satisfies readonly { id: StudyTrack; label: string; description: string }[]

const grammar = Object.fromEntries(foundationLessons.map(lesson => [lesson.id, {
  id: lesson.completionId, title: lesson.title, route: 'foundation/' + lesson.id,
}]))
const original = Object.fromEntries(originalStages.flatMap(stage => stage.lessons).map(lesson => [lesson.id, lesson]))
const pronunciation = ipaLessons.map(lesson => ({ id: lesson.completionId, title: 'IPA · ' + lesson.name, route: 'ipa/course/' + lesson.id }))
const vocabulary: CourseLesson = { id: 'basic-vocab', title: 'Từ vựng cơ bản', route: 'beginner-vocabulary' }
const listening = listeningSteps.map(step => ({ id: step.completionId, title: step.title, route: 'beginner-listening/' + step.id }))

export const levelPractices = [
  { level: 'toeic350', id: 'easy-listen', title: 'Nghe câu hỏi ngắn', description: 'Nghe từ hỏi đầu câu. Thử riêng câu hỏi nơi chốn, thời gian và người.', questionIds: ['p2-1', 'p2-2', 'p2-3', 'p2-4'] },
  { level: 'toeic350', id: 'easy-read', title: 'Điền từ ở câu ngắn', description: 'Tập nhìn vị trí từ còn thiếu trước khi dịch. Ưu tiên danh từ và động từ.', questionIds: ['r5-04', 'r5-05', 'r5-11', 'r5-24'] },
  { level: 'toeic450', id: 'strategy-listen', title: 'Theo dõi chi tiết và lời sửa', description: 'Đọc câu hỏi trước, nghe ở tốc độ 1× và chú ý thông tin thay đổi trong đoạn.', questionIds: ['p2-10', 'p2-15', 'p3-1', 'p3-2', 'p4-1', 'p4-2'] },
  { level: 'toeic450', id: 'strategy-read', title: 'Dấu hiệu thì, bị động và liên từ', description: 'Xác định dấu hiệu thời gian, ai làm việc và mối quan hệ giữa hai vế.', questionIds: ['r5-18', 'r5-20', 'r5-21', 'r5-28', 'r5-30', 'r5-33'] },
] as const

export function levelCompletion(level: string, id: string) {
  return 'level-' + level + '-' + id
}
function sets(level: string): CourseLesson[] {
  return levelPractices.filter(item => item.level === level).map(item => ({
    id: levelCompletion(item.level, item.id), title: item.title, route: 'level/' + item.level + '/' + item.id,
  }))
}

interface PathModule { id: string; title: string; lessons: CourseLesson[] }
interface PathStage {
  id: string
  title: string
  goal: string
  modules: PathModule[]
  lessons: CourseLesson[]
  resources?: CourseLesson[]
}

function toeicStage(id: string, title: string, goal: string, lessons: CourseLesson[]): PathStage {
  return { id, title, goal, lessons, modules: [{ id, title, lessons }] }
}

export const learningPath: PathStage[] = [
  ...courseStages.map(stage => {
    const starter = stage.id === 'starter'
    const modules = stage.modules.map(group => ({
      id: group.id, title: group.title, lessons: group.lessons.map(lesson => ({
        id: lesson.completionId, title: lesson.title, route: studyLessonRoute(lesson.id),
      })),
    }))
    return {
      ...stage, modules, lessons: modules.flatMap(group => group.lessons),
      goal: starter ? 'Từ bảng chữ cái đến những câu ngắn dùng hằng ngày.' : 'Nói về thời gian, nối ý, đọc đoạn ngắn và làm quen đề TOEIC.',
      resources: starter ? [...pronunciation, vocabulary] : [...listening, grammar.tenses, original['grammar-parts-of-speech']],
    }
  }),
  toeicStage('toeic350', 'TOEIC 350', 'Làm quen đề bằng câu dễ, từ vựng phổ biến và bài nghe ngắn.',
    [...sets('toeic350'), original['vocab-office'], original['part-1'], original['part-5-noun']]),
  toeicStage('toeic450', 'TOEIC 450', 'Nghe ở tốc độ thông thường và áp dụng chiến thuật cho từng dạng câu.',
    [...sets('toeic450'), original['part-2'], original['part-3'], original['part-4'], original['part-5-tense'], original['part-5']]),
  toeicStage('toeic550', 'TOEIC 550+', 'Luyện bài gần format, theo dõi thời gian và ôn bẫy sau mỗi lần làm.',
    [original['part-6'], original['part-7'], original.mini, original.mock, original.weakness, original.review, original['mock-target']]),
]

function sequence(lessons: CourseLesson[]) {
  return lessons.slice(0, -1).map((lesson, index) => [lesson.id, lessons[index + 1]] as const)
}

const nextByLesson = new Map([
  ...sequence(learningPath.flatMap(stage => stage.lessons)),
  ...sequence(ipaCourse.map(lesson => ({ id: lesson.id, title: lesson.title, route: `ipa/lesson/${lesson.number}` }))),
  ...sequence(listening),
])

export function nextPathLesson(completionId?: string) {
  return completionId ? nextByLesson.get(completionId) : undefined
}

export const placementQuestions = [foundationLessons[0].questions[0], grammarCheck('sentence'), grammarCheck('tenses'), questionById.get('r5-21')!]

function grammarCheck(id: string) {
  return foundationLessons.find(lesson => lesson.id === id)!.questions[0]
}

export function recommendedTrack(correct: number): StudyTrack {
  return correct < 2 ? 'starter' : correct < placementQuestions.length ? 'foundation' : 'toeic'
}

export function recommend(progress: ProgressData) {
  const from = progress.settings.studyTrack === 'toeic' ? 2 : progress.settings.studyTrack === 'foundation' ? 1 : 0
  const completed = new Set(progress.completed)
  const active = learningPath.slice(from).find(stage => stage.lessons.some(lesson => !completed.has(lesson.id))) ?? learningPath[4]
  const next = active.lessons.find(lesson => !completed.has(lesson.id))
  return { active, next }
}

const attemptLists = new Map<string, readonly string[]>([
  ...foundationLessons.map(lesson => [lesson.completionId, lesson.questions.map(question => question.id)] as const),
  ...studyLessons.map(lesson => [lesson.completionId, lesson.questions.map(question => question.id)] as const),
  ...ipaLessons.map(lesson => [lesson.completionId, [
    ...lesson.questions, ...ipaCourse.filter(item => item.group === lesson.id).flatMap(item => item.questions),
  ].map(question => question.id)] as const),
  ...listeningSteps.map(lesson => [lesson.completionId, lesson.questions.map(question => question.id)] as const),
  ...levelPractices.map(lesson => [levelCompletion(lesson.level, lesson.id), [...lesson.questionIds]] as const),
  ['basic-vocab', beginnerWordQuestions.map(question => question.id)] as const,
])

export function attemptedLesson(id: string, attempts: Set<string>) {
  return attemptLists.get(id)?.some(question => attempts.has(question)) ?? false
}
