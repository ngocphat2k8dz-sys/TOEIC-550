import { useRef, useState } from 'react'
import { Check, CircleHelp, Highlighter, Lightbulb, X } from 'lucide-react'
import type { Question } from '../types'

export const optionLetter = (index: number) => 'ABCD'[index] ?? ''
export const optionText = (question: Question, index: number) => `${optionLetter(index)}. ${question.options[index]}`

function MarkedText({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return text
  const literalTerms = [...new Set(terms.filter(Boolean))].map(term => term.replace(/[.*+?^{}$()|[\]\\]/g, '\\$&'))
  if (!literalTerms.length) return text
  const fragments = text.split(new RegExp(`(${literalTerms.join('|')})`, 'gi'))
  return fragments.map((fragment, index) => index % 2 ? <mark key={index}>{fragment}</mark> : fragment)
}

export function Passage({ passage, highlight }: { passage: { title: string; text: string }; highlight: boolean }) {
  const [terms, setTerms] = useState<string[]>([])
  const [selection, setSelection] = useState('')
  const content = useRef<HTMLDivElement>(null)
  function readSelection() {
    const current = window.getSelection()
    setSelection(current?.anchorNode && current.focusNode && content.current?.contains(current.anchorNode) && content.current.contains(current.focusNode) ? current.toString().trim() : '')
  }
  return <article className="passage">
    <div className="passage-heading"><h3>{passage.title}</h3>
      {highlight && <div className="button-group">
        <button className="icon-button bordered" aria-label="Tô đoạn đã chọn" title="Tô đoạn đã chọn" disabled={!selection} onClick={() => { setTerms([...terms, selection]); setSelection(''); window.getSelection()?.removeAllRanges() }}><Highlighter size={17} /></button>
        {terms.length > 0 && <button className="icon-button bordered" aria-label="Xóa tô sáng" title="Xóa tô sáng" onClick={() => setTerms([])}><X size={16} /></button>}
      </div>}
    </div>
    <div ref={content} onPointerUp={readSelection} onKeyUp={readSelection} className="passage-text"><MarkedText text={passage.text} terms={terms} /></div>
    {highlight && <small>Bôi đen một đoạn rồi chọn biểu tượng bút để tô sáng.</small>}
  </article>
}

export function AnswerExplanation({ question, choice }: { question: Question; choice: number | null }) {
  const correct = choice === question.answer
  return <div className="answer-feedback" aria-live="polite">
    <div className={`feedback-banner ${correct ? 'correct' : 'incorrect'}`}>
      {correct ? <Check size={21} /> : <CircleHelp size={21} />}
      <div><strong>{correct ? 'Chính xác!' : choice === null ? 'Bạn bỏ trống câu này' : 'Đáp án chưa đúng'}</strong><p>{optionText(question, question.answer)}</p></div>
    </div>
    <div className="explanation">
      <h3>Vì sao đáp án này đúng?</h3><p>{question.rationale}</p>
      {question.grammar && <p><b>Điểm ngữ pháp</b> · {question.grammar}</p>}
      {question.keywords?.length ? <p><b>Từ khóa</b> · {question.keywords.join(' · ')}</p> : null}
      {question.vocabulary?.length ? <p><b>Từ vựng cần nhớ</b> · {question.vocabulary.join(' · ')}</p> : null}
      <h3>Phân tích từng lựa chọn</h3>
      <ul className="option-reasons">{question.optionReasons.map((reason, index) => <li key={index}><span className={index === question.answer ? 'right' : ''}>{optionLetter(index)}</span><div><strong>{question.options[index]}</strong><p>{reason}</p></div></li>)}</ul>
      <div className="tip-box"><Lightbulb size={19} /><div><strong>Mẹo cho câu tương tự</strong><p>{question.tip}</p></div></div>
      {question.transcript && <details className="transcript"><summary>Xem transcript</summary><div><MarkedText text={question.transcript} terms={question.keywords ?? []} /></div></details>}
    </div>
  </div>
}
