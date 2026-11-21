import { useEffect, useRef, useState } from 'react'
import { AudioLines, Pause, Play, RotateCcw } from 'lucide-react'
import type { Speed } from '../types'

type Playback = 'idle' | 'playing' | 'paused'

function englishVoice() {
  const voices = window.speechSynthesis.getVoices()
  return voices.find(voice => /^en[-_]US/i.test(voice.lang) && voice.localService)
    ?? voices.find(voice => /^en/i.test(voice.lang))
}

export function ListeningPlayer({ transcript, src, speed, onSpeed }: { transcript: string; src?: string; speed: Speed; onSpeed: (rate: Speed) => void }) {
  const [status, setStatus] = useState<Playback>('idle')
  const [error, setError] = useState('')
  const audio = useRef<HTMLAudioElement>(null)
  const utterance = useRef<SpeechSynthesisUtterance | null>(null)
  const [usingFile, setUsingFile] = useState(Boolean(src))
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

  useEffect(() => {
    const player = audio.current
    return () => {
      player?.pause()
      if (utterance.current && canSpeak) window.speechSynthesis.cancel()
      utterance.current = null
    }
  }, [canSpeak])

  function speak(rate: Speed, restart = false) {
    if (!canSpeak) {
      setError('Trình duyệt chưa hỗ trợ phát giọng đọc tiếng Anh.')
      setStatus('idle')
      return
    }
    const speaker = window.speechSynthesis
    if (!restart && utterance.current && speaker.paused) {
      speaker.resume()
      setStatus('playing')
      return
    }
    utterance.current = null
    speaker.cancel()
    const text = transcript.replace(/^(?:Man|Woman|Narrator):\s*/gim, '').replace(/^[A-D]\. /gm, match => `Option ${match}`)
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = 'en-US'
    speech.rate = rate
    const voice = englishVoice()
    if (voice) speech.voice = voice
    speech.onend = () => {
      if (utterance.current !== speech) return
      utterance.current = null
      setStatus('idle')
    }
    speech.onerror = () => {
      if (utterance.current !== speech) return
      utterance.current = null
      setStatus('idle')
      setError('Không phát được giọng đọc. Kiểm tra giọng tiếng Anh trên thiết bị rồi thử lại.')
    }
    utterance.current = speech
    speaker.speak(speech)
    setStatus('playing')
  }

  function play(rate = speed, restart = false) {
    setError('')
    const player = audio.current
    if (usingFile && player && !player.error) {
      if (restart) player.currentTime = 0
      player.playbackRate = rate
      void player.play().then(() => setStatus('playing')).catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setUsingFile(false)
        speak(rate, restart)
      })
      return
    }
    speak(rate, restart)
  }

  function pause() {
    if (usingFile) audio.current?.pause()
    else if (canSpeak) window.speechSynthesis.pause()
    setStatus('paused')
  }

  return <div className="audio-player">
    {src && usingFile && <audio ref={audio} src={src} preload="none" onEnded={() => setStatus('idle')} />}
    <div className="audio-label"><span className="icon-tile blue"><AudioLines size={21} /></span><div><strong>Bài nghe</strong><small>{status === 'playing' ? 'Đang phát' : status === 'paused' ? 'Đã tạm dừng' : 'Nghe và chọn đáp án'}</small></div></div>
    <div className="audio-controls">
      <button className="button primary" onClick={() => status === 'playing' ? pause() : play()}>{status === 'playing' ? <><Pause size={16} fill="currentColor" /> Tạm dừng</> : <><Play size={15} fill="currentColor" /> {status === 'paused' ? 'Tiếp tục' : 'Phát audio'}</>}</button>
      <button className="icon-button bordered" onClick={() => play(speed, true)} aria-label="Nghe lại" title="Nghe lại"><RotateCcw size={17} /></button>
      <select aria-label="Tốc độ bài nghe" value={speed} onChange={event => {
        const rate = Number(event.target.value) as Speed
        onSpeed(rate)
        if (usingFile && audio.current) audio.current.playbackRate = rate
        else if (status === 'playing' || status === 'paused') play(rate, true)
      }}><option value={0.75}>0.75×</option><option value={1}>1×</option><option value={1.25}>1.25×</option></select>
    </div>
    {error && <small className="audio-error" role="status">{error}</small>}
  </div>
}
