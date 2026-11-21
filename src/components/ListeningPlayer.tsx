import { AudioLines, Pause, Play, RotateCcw } from 'lucide-react'
import { useAudioPlayback } from '../hooks/useAudioPlayback'
import type { Speed } from '../types'

export function ListeningPlayer({ transcript, src, speed, onSpeed, instruction = 'Nghe và chọn đáp án' }: {
  transcript: string; src?: string; speed: Speed; onSpeed: (rate: Speed) => void; instruction?: string
}) {
  const { media, status, error, play, pause, resume, setRate } = useAudioPlayback(transcript, src)
  return <div className="audio-player">
    {src && <audio ref={media} src={src} preload="none" />}
    <div className="audio-label"><span className="icon-tile blue"><AudioLines size={21} /></span><div>
      <strong>Bài nghe</strong><small>{status === 'playing' ? 'Đang phát' : status === 'paused' ? 'Đã tạm dừng' : status === 'loading' ? 'Đang chuẩn bị audio…' : instruction}</small>
    </div></div>
    <div className="audio-controls">
      <button className="button primary" onClick={() => {
        if (status === 'playing') pause()
        else if (status === 'paused') resume()
        else play(speed)
      }}>
        {status === 'playing' ? <><Pause size={16} fill="currentColor" /> Tạm dừng</> :
          <><Play size={15} fill="currentColor" /> {status === 'paused' ? 'Tiếp tục' : 'Phát audio'}</>}
      </button>
      <button className="icon-button bordered" onClick={() => play(speed)} aria-label="Nghe lại" title="Nghe lại"><RotateCcw size={17} /></button>
      <select aria-label="Tốc độ bài nghe" value={speed} onChange={event => {
        const rate = Number(event.target.value) as Speed
        onSpeed(rate)
        setRate(rate)
      }}><option value={0.75}>0.75×</option><option value={1}>1×</option><option value={1.25}>1.25×</option></select>
    </div>
    {error && <small className="audio-error" role="status">{error}</small>}
  </div>
}
