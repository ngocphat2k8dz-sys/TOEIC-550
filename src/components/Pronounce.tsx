import { Turtle, Volume2 } from 'lucide-react'
import { learningAudio } from '../data/learningAudio'
import { useAudioPlayback } from '../hooks/useAudioPlayback'

export function Pronounce({ text, audioId, label, compact = false }: {
  text: string; audioId: string; label?: string; compact?: boolean
}) {
  const src = learningAudio(audioId)
  const { media, status, error, play } = useAudioPlayback(text, src)
  return <span className={'pronounce' + (compact ? ' pronounce-compact' : '')} data-playback={status}>
    <audio ref={media} src={src} preload="none" />
    <button type="button" className="icon-button bordered" onClick={() => play(1)} aria-label={label ?? 'Nghe ' + text} title={label ?? 'Nghe ' + text}><Volume2 size={17} /></button>
    <button type="button" className="icon-button bordered" onClick={() => play(0.85)} aria-label={'Nghe chậm ' + text} title="Nghe chậm 0.85×"><Turtle size={16} /></button>
    {error && <small role="status">{error}</small>}
  </span>
}
