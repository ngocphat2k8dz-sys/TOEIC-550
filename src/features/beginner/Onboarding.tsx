import { useState } from 'react'
import { BookOpen, ClipboardCheck, Sprout, Target } from 'lucide-react'
import { placementQuestions, recommendedTrack, trackChoices } from '../../data/path'
import type { StudyTrack } from '../../types'

const icons = { starter: Sprout, foundation: BookOpen, toeic: Target }

export function Onboarding({ onChoose }: { onChoose: (track: StudyTrack) => void }) {
  const [assessment, setAssessment] = useState(false)
  const [picks, setPicks] = useState<Record<number, number>>({})
  const [result, setResult] = useState<StudyTrack>()
  const recommendation = result && trackChoices.find(choice => choice.id === result)

  return <section className="panel content-panel path-onboarding" aria-labelledby="placement-title">
    <div className="section-heading"><div>
      <h2 id="placement-title">Bạn muốn bắt đầu từ đâu?</h2>
      <p>Chọn điểm xuất phát để nhận bài phù hợp. Bạn có thể đổi lựa chọn hoặc mở các giai đoạn bất cứ lúc nào.</p>
    </div></div>
    <div className="path-choices">
      {trackChoices.map(choice => {
        const Icon = icons[choice.id]
        return <button type="button" key={choice.id} className="path-choice" onClick={() => onChoose(choice.id)}>
          <span className={'icon-tile ' + (choice.id === 'starter' ? 'green' : choice.id === 'toeic' ? 'purple' : 'blue')}><Icon size={20} /></span>
          <span><strong>{choice.label}</strong><small>{choice.description}</small></span>
        </button>
      })}
    </div>
    {!assessment && <button className="button secondary" type="button" onClick={() => setAssessment(true)}><ClipboardCheck size={16} /> Làm bài kiểm tra đầu vào</button>}
    {assessment && <div className="placement">
      <h3>Bài kiểm tra đầu vào</h3>
      <p className="muted">4 câu để gợi ý mức bắt đầu. Kết quả dùng để chọn lộ trình.</p>
      {placementQuestions.map((question, index) => <fieldset key={question.id} disabled={Boolean(result)}>
        <legend>{index + 1}. {question.prompt}</legend>
        {question.options.map((option, optionIndex) => <label key={option}><input type="radio" name={'placement-' + index} checked={picks[index] === optionIndex} onChange={() => setPicks({ ...picks, [index]: optionIndex })} /> {option}</label>)}
      </fieldset>)}
      {recommendation ? <div className="placement-result" role="status">
        <p><strong>Gợi ý</strong> · {recommendation.label}</p><p>{recommendation.description}</p>
        <button className="button primary" type="button" onClick={() => onChoose(recommendation.id)}>Bắt đầu theo gợi ý</button>
      </div> : <button className="button primary" type="button" disabled={Object.keys(picks).length < placementQuestions.length} onClick={() =>
        setResult(recommendedTrack(placementQuestions.filter((question, index) => picks[index] === question.answer).length))
      }>Xem gợi ý</button>}
    </div>}
  </section>
}
