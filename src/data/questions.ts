import type { Part, Question, Skill } from '../types'
import { parts, skillOf } from './course'
import { grammarQuestions } from './grammar'
import { listeningQuestions } from './listening'
import { readingQuestions } from './reading'
import { vocabularyQuestions } from './vocabulary'

export const bank = [...listeningQuestions, ...readingQuestions]
export const questionById = new Map([...bank, ...grammarQuestions, ...vocabularyQuestions].map(question => [question.id, question]))
export const bankIds = new Set(bank.map(question => question.id))

function shuffle<T>(values: T[]): T[] {
  const result = [...values]
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[other]] = [result[other], result[index]]
  }
  return result
}

export function createMini(size: number, skill: Skill | 'Mixed') {
  const eligible = parts.filter(part => skill === 'Mixed' || skillOf(part) === skill)
  const queues = eligible.map(part => shuffle(bank.filter(question => question.part === part)))
  const selected: Question[] = []
  while (selected.length < size && queues.some(queue => queue.length)) {
    for (const queue of queues) {
      const question = queue.pop()
      if (question) selected.push(question)
      if (selected.length === size) break
    }
  }
  return inPartOrder(selected)
}

function inPartOrder(questions: Question[]) {
  const originalOrder = new Map(bank.map((question, index) => [question.id, index]))
  return questions.sort((a, b) => (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0))
}

export const mockDistribution: Record<Part, number> = { 1: 3, 2: 6, 3: 6, 4: 5, 5: 12, 6: 8, 7: 10 }

export function createMock() {
  return inPartOrder(parts.flatMap(part => shuffle(bank.filter(question => question.part === part)).slice(0, mockDistribution[part])))
}
