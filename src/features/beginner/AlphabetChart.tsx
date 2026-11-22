import { useState } from 'react'
import { Pronounce } from '../../components/Pronounce'
import { alphabet } from '../../data/curriculum/audio'

export function AlphabetChart() {
  const [selected, setSelected] = useState(0)
  const { letter, ipa, clip } = alphabet[selected]
  return <section className="panel content-panel course-lesson-words" aria-labelledby="alphabet-chart-title">
    <div className="section-heading"><div><h2 id="alphabet-chart-title">Nghe tên 26 chữ cái</h2><p>Chọn một chữ để xem cách đọc và nghe tên chữ.</p></div></div>
    <div className="alphabet-letters" role="group" aria-label="Chọn chữ cái">{alphabet.map(({ letter: item }, index) =>
      <button type="button" className="button secondary" key={item} aria-pressed={index === selected} onClick={() => setSelected(index)}>{item}</button>,
    )}</div>
    <div className="alphabet-pronunciation">
      <strong>{letter} · {letter.toLowerCase()}</strong><span className="ipa-transcript">/{ipa}/</span>
      <Pronounce key={letter} text={`chữ ${letter}`} audioId={clip.id} label={`Nghe tên chữ ${letter}`} compact />
    </div>
    {letter === 'Z' && <p className="muted">Cách đọc ghi ở trên là Anh–Mỹ. Anh–Anh thường đọc /zɛd/.</p>}
  </section>
}
