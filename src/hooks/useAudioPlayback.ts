import { useEffect, useRef, useState } from 'react'
import { isLearningAudio } from '../data/learningAudio'
import { pauseAudio, playAudio, resumeAudio, setAudioRate, stopAudio, type PlaybackState } from '../services/audioPlayback'

export function useAudioPlayback(text: string, src?: string) {
  const owner = useRef(Symbol()).current
  const media = useRef<HTMLAudioElement>(null)
  const [state, setState] = useState<PlaybackState>({ status: 'idle' })

  useEffect(() => {
    const onHide = () => stopAudio(owner)
    window.addEventListener('pagehide', onHide)
    return () => {
      window.removeEventListener('pagehide', onHide)
      stopAudio(owner)
    }
  }, [owner, src, text])

  return {
    ...state,
    media,
    play: (rate: number) => playAudio({ owner, media: media.current, text, rate, allowSpeechFallback: !isLearningAudio(src), notify: setState }),
    pause: () => pauseAudio(owner),
    resume: () => resumeAudio(owner),
    setRate: (rate: number) => setAudioRate(owner, rate),
  }
}
