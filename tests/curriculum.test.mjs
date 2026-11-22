import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { after, test } from 'node:test'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true, ws: false, watch: null } })
after(() => vite.close())

const { courseStages, studyLessons, studyQuestions } = await vite.ssrLoadModule('/src/data/curriculum/index.ts')
const { studyWords } = await vite.ssrLoadModule('/src/data/curriculum/words.ts')
const { alphabet, curriculumClip, curriculumClips, curriculumAnswerClip } = await vite.ssrLoadModule('/src/data/curriculum/audio.ts')
const { originalLearningClips } = await vite.ssrLoadModule('/src/data/learningAudioCatalog.ts')
const { foundationLessons, foundationQuestions } = await vite.ssrLoadModule('/src/data/foundations.ts')
const { bankIds, questionById } = await vite.ssrLoadModule('/src/data/questions.ts')
const { learningPath, nextPathLesson, recommend, attemptedLesson } = await vite.ssrLoadModule('/src/data/path.ts')
const { defaultProgress } = await vite.ssrLoadModule('/src/progress.ts')

test('lessons have unique IDs, original exercises, translations and vocabulary or review material', () => {
  assert.equal(studyLessons.length, new Set(studyLessons.map(lesson => lesson.completionId)).size)
  assert.equal(studyQuestions.length, new Set(studyQuestions.map(question => question.id)).size)
  const oldQuestions = new Set(foundationQuestions.map(question => question.id))
  const newPrompts = new Set()

  for (const stage of courseStages) for (const group of stage.modules) {
    if (group.lessons.length > 1) assert(group.lessons.at(-1).review, group.title)
    for (const lesson of group.lessons) {
      const { questions } = lesson
      assert(questions.length >= (lesson.review ? 15 : 10) && questions.length <= 20, lesson.title)
      assert(lesson.examples.length && lesson.notes.length, lesson.title)
      for (const word of lesson.vocabulary) assert(studyWords.has(word), `Missing ${word} in ${lesson.title}`)
      for (const question of questions) {
        assert(question.beginner.translation && question.beginner.simple && question.beginner.example, question.id)
        assert.equal(question.optionReasons.length, question.options.length, question.id)
        assert.equal(question.options.length, new Set(question.options).size, question.id)
        assert(question.options[question.answer], question.id)
        assert.equal(questionById.get(question.id), question, question.id)
        assert(!bankIds.has(question.id), question.id)
        if (question.audio) assert(existsSync('public' + question.audio), question.audio)
        if (oldQuestions.has(question.id)) continue
        const prompt = question.prompt.toLowerCase().trim()
        const signature = JSON.stringify([prompt, question.transcript, question.passages, question.options[question.answer]])
        assert(!newPrompts.has(signature), question.prompt)
        newPrompts.add(signature)
      }
    }
  }
})

test('the path goes through reviews and stage transitions using registered lesson IDs', () => {
  const stages = learningPath.slice(0, 2)
  const sequence = stages.flatMap(stage => stage.lessons)
  for (let index = 1; index < sequence.length; index++) {
    assert.equal(nextPathLesson(sequence[index - 1].id), sequence[index])
  }
  assert.equal(nextPathLesson(sequence.at(-1).id), learningPath[2].lessons[0])
  assert.equal(nextPathLesson('ipa-course-01').route, 'ipa/lesson/2')
  assert.equal(nextPathLesson('basic-listening-sound').route, 'beginner-listening/word')
  assert.equal(recommend({ ...defaultProgress, settings: { ...defaultProgress.settings, studyTrack: 'starter' } }).next, stages[0].lessons[0])
  assert.equal(recommend({ ...defaultProgress, completed: stages[0].lessons.map(lesson => lesson.id) }).next, stages[1].lessons[0])
})

test('upgrading leaves earlier completions, quiz draft question IDs and wrong answers usable', () => {
  const knownLessons = new Set(learningPath.flatMap(stage => [...stage.lessons, ...(stage.resources ?? [])].map(lesson => lesson.id)))
  for (const lesson of foundationLessons) {
    assert(knownLessons.has(lesson.completionId), lesson.completionId)
    assert(attemptedLesson(lesson.completionId, new Set([lesson.questions[0].id])))
    assert.deepEqual(lesson.questions.map(question => questionById.get(question.id)), lesson.questions)
  }
  const first = studyLessons[0]
  assert(attemptedLesson(first.completionId, new Set([first.questions[0].id])))
})

test('curriculum examples, alphabet and questions resolve to the same local MP3 catalog as the original lessons', () => {
  assert.equal(alphabet.length, 26)
  assert.equal(curriculumClip('book').id, 'basic-word-book')
  assert.equal(curriculumClip('I read a book.').id, 'basic-word-book-sentence')
  assert.equal(curriculumClip('see').id, 'ipa-long-i')
  assert.equal(curriculumClip('When do we meet? At nine.').id, 'basic-listen-meet')
  for (const question of studyQuestions) {
    const feedback = curriculumAnswerClip(question)
    assert(question.audio || feedback, question.id)
    if (feedback) assert(!/\/[^/]+\//.test(feedback.text), question.id)
  }
  const clips = new Map([...originalLearningClips, ...curriculumClips()].map(clip => [clip.id, clip.text]))
  for (const [id, text] of clips) {
    assert(text.trim(), id)
    const file = readFileSync(`public/listening/english/${id}.mp3`)
    const hasMp3Header = file.subarray(0, 3).toString('ascii') === 'ID3' || (file[0] === 0xff && (file[1] & 0xe0) === 0xe0)
    assert(file.length > 512 && hasMp3Header, id)
  }
})
