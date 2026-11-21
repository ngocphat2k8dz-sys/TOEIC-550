import { useState } from 'react'
import { AudioLines, Check, Headphones } from 'lucide-react'
import { PageIntro } from '../../components/UI'
import { ipaComparisons, ipaLessons, ipaSounds, soundGroups } from '../../data/ipa'
import { pronunciationNote, spokenIpa, studyMouth } from '../../data/ipaCourse'
import type { Question } from '../../types'
import { Pronounce } from '../../components/Pronounce'
import { IpaCourseLesson, IpaCoursePage, IpaTabs } from './IpaCoursePage'

export type PracticeStarter = (questions: Question[], title: string, lessonId: string) => void

export function IpaPage({ section, detail, completed, onPractice }: { section?: string; detail?: string; completed: string[]; onPractice: PracticeStarter }) {
  if (section === 'lesson') return <IpaCourseLesson number={Number(detail)} completed={completed} onPractice={onPractice} />
  const oldGroup = ipaLessons.find(item => item.id === section)
  if (!oldGroup && section !== 'reference') return <IpaCoursePage completed={completed} group={section === 'course' ? detail : undefined} />
  const group = oldGroup ?? ipaLessons.find(item => item.id === detail) ?? ipaLessons[0]
  return <IpaGroup key={group.id} group={group} completed={completed} onPractice={onPractice} />
}

function IpaGroup({ group, completed, onPractice }: { group: typeof ipaLessons[number]; completed: string[]; onPractice: PracticeStarter }) {
  const sounds = ipaSounds.filter(item => item.group === group.id)
  const [selected, setSelected] = useState(sounds[0].id)
  const [pair, setPair] = useState(0)
  const sound = sounds.find(item => item.id === selected) ?? sounds[0]
  const comparison = ipaComparisons[pair]
  const done = completed.includes(group.completionId)

  return <>
    <PageIntro title="Tra cứu bảng IPA 44 âm" description="Chọn một âm để xem khẩu hình và nghe từ mẫu. Bảng giữ các ký hiệu quen dùng, kèm cách đọc Anh–Mỹ khi có khác biệt." />
    <IpaTabs reference />
    <div className="path-tabs" aria-label="Nhóm âm">{soundGroups.map(item =>
      <a key={item.id} href={'#ipa/reference/' + item.id} className={'button ' + (item.id === group.id ? 'primary' : 'secondary')} aria-current={item.id === group.id ? 'page' : undefined}>{item.name}</a>,
    )}</div>
    <div className="dashboard-grid ipa-layout">
      <section className="panel content-panel">
        <div className="section-heading"><div><h2>{group.name}</h2><p>{group.description}</p></div><span className="icon-tile blue"><AudioLines size={20} /></span></div>
        <div className="ipa-symbol-grid" role="group" aria-label="Chọn một âm">
          {sounds.map(item => <button type="button" key={item.id} className="ipa-symbol" aria-pressed={item.id === sound.id} onClick={() => setSelected(item.id)}>
            <strong>/{item.symbol}/</strong><small lang="en">{item.examples[0].word}</small>
          </button>)}
        </div>
      </section>
      <section className="panel content-panel ipa-sound" aria-labelledby="selected-sound">
        <div className="section-heading"><div><h2 id="selected-sound">/{sound.symbol}/</h2><p>{group.name} · {sound.cue}</p></div><Pronounce text={sound.examples[0].word} audioId={sound.examples[0].audioId} /></div>
        <dl className="learning-definitions">
          <div><dt>Khẩu hình</dt><dd>{studyMouth(sound)}</dd></div>
          <div><dt>Mẹo phát âm</dt><dd>{pronunciationNote(sound) ?? sound.tip}</dd></div>
          <div><dt>Lỗi thường gặp khi học từ tiếng Việt</dt><dd>{sound.mistake}</dd></div>
        </dl>
        <div className="ipa-examples">
          {sound.examples.map(example => <article key={example.word}>
            <div><strong lang="en">{example.word}</strong> <span className="ipa-transcript">/{example.transcription}/</span> · {example.meaning}</div>
            {spokenIpa(example.word, example.transcription) !== example.transcription && <p className="muted">Giọng trong clip · /{spokenIpa(example.word, example.transcription)}/</p>}
            <div className="learning-sentence"><p lang="en">{example.sentence}</p><Pronounce text={example.sentence} audioId={example.audioId + '-sentence'} /></div><p className="muted">{example.translation}</p>
            {example !== sound.examples[0] && <Pronounce text={example.word} audioId={example.audioId} />}
          </article>)}
        </div>
      </section>
      <section className="panel content-panel">
        <div className="section-heading"><div><h2>Hai âm dễ nhầm</h2><p>Nghe hai từ và tập trung vào âm đổi khác.</p></div></div>
        <label className="pair-picker">Cặp âm<select value={pair} onChange={event => setPair(Number(event.target.value))}>{ipaComparisons.map((item, index) =>
          <option key={index} value={index}>/{item.left}/ và /{item.right}/</option>,
        )}</select></label>
        <div className="ipa-pair">{comparison.examples.map((example, index) => <article key={example.word}>
          <strong lang="en">{example.word}</strong><span> /{index ? comparison.right : comparison.left}/ · {example.meaning}</span>
          <Pronounce text={example.word} audioId={example.audioId} />
        </article>)}</div>
        <p className="muted">{comparison.tip}</p>
      </section>
      <section className="panel content-panel">
        <div className="section-heading"><div><h2>Quiz {group.name.toLowerCase()}</h2><p>Nghe và chọn âm, tìm từ, phân biệt âm và ghép ký hiệu với từ.</p></div><span className="icon-tile purple"><Headphones size={20} /></span></div>
        <button type="button" className="button primary" onClick={() => onPractice(group.questions, 'IPA · ' + group.name, group.completionId)}>Làm quiz IPA</button>
        {done && <p className="path-done"><Check size={16} /> Đã hoàn thành nhóm âm</p>}
      </section>
    </div>
  </>
}
