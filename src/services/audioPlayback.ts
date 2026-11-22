export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused'
export type PlaybackState = { status: PlaybackStatus; error?: string }

interface AudioRequest {
  owner: symbol
  media: HTMLAudioElement | null
  text: string
  rate: number
  allowSpeechFallback: boolean
  notify: (state: PlaybackState) => void
}

interface Playback extends AudioRequest {
  status: PlaybackStatus
  utterance?: SpeechSynthesisUtterance
  detach?: () => void
  cancelVoiceWait?: () => void
}

let active: Playback | undefined
let fallbackVoice: SpeechSynthesisVoice | undefined

const women = /\b(?:female|ava|emma|jenny|aria|michelle|ana|samantha|allison|susan|zira|karen|victoria|salli|joanna|ivy|danielle|sonia|serena|lily|tessa|moira)\b|google us english/i
const men = /\b(?:male|guy|andrew|brian|davis|roger|jason|tony|david|mark|alex|fred|tom|daniel|matthew|joey)\b/i
const quality = /\b(?:natural|neural|premium|enhanced|studio|online|wavenet)\b/i

function speechEngine() {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window ? window.speechSynthesis : undefined
}

function voiceScore(voice: SpeechSynthesisVoice) {
  const englishUS = /^en[-_]us$/i.test(voice.lang)
  return (women.test(voice.name) ? 120 : 0) - (men.test(voice.name) ? 20 : 0) +
    (englishUS ? 55 : 0) + (quality.test(voice.name) ? 42 : 0) + (voice.localService ? 4 : 0)
}

function rankVoices(engine: SpeechSynthesis) {
  return engine.getVoices().filter(voice => /^en(?:[-_]|$)/i.test(voice.lang))
    .sort((a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name))[0]
}

function chooseVoice(engine: SpeechSynthesis, playback: Playback): Promise<SpeechSynthesisVoice | undefined> {
  if (fallbackVoice) return Promise.resolve(fallbackVoice)
  const best = rankVoices(engine)
  if (best && women.test(best.name) && quality.test(best.name)) return Promise.resolve(best)
  return new Promise(resolve => {
    const finish = (voice?: SpeechSynthesisVoice) => {
      window.clearTimeout(timer)
      engine.removeEventListener('voiceschanged', changed)
      playback.cancelVoiceWait = undefined
      resolve(voice)
    }
    const changed = () => {
      const next = rankVoices(engine)
      if (next && quality.test(next.name) && women.test(next.name)) finish(next)
    }
    const timer = window.setTimeout(() => finish(rankVoices(engine) ?? best), 550)
    playback.cancelVoiceWait = () => finish()
    engine.addEventListener('voiceschanged', changed)
  })
}

function update(playback: Playback, status: PlaybackStatus) {
  if (active !== playback) return
  playback.status = status
  playback.notify({ status })
}

function release(playback: Playback, error?: string) {
  if (active !== playback) return
  active = undefined
  playback.detach?.()
  playback.cancelVoiceWait?.()
  playback.media?.pause()
  if (playback.utterance) speechEngine()?.cancel()
  playback.notify({ status: 'idle', error })
}

function spokenText(text: string) {
  return text.replace(/^(?:Man|Woman|Narrator):\s*/gim, '').replace(/^[A-D]\. /gm, match => 'Option ' + match)
}

async function speak(playback: Playback) {
  const engine = speechEngine()
  if (!engine || !playback.text.trim()) {
    release(playback, 'Chưa phát được audio trên thiết bị này.')
    return
  }
  const voice = await chooseVoice(engine, playback)
  if (active !== playback) return
  if (!voice) {
    release(playback, 'Chưa tìm thấy giọng tiếng Anh trên thiết bị. Hãy thử tải lại audio.')
    return
  }
  fallbackVoice = voice
  if (engine.paused) engine.resume()
  const utterance = new SpeechSynthesisUtterance(spokenText(playback.text))
  utterance.lang = voice.lang
  utterance.voice = voice
  utterance.rate = playback.rate
  utterance.onstart = () => update(playback, 'playing')
  utterance.onend = () => release(playback)
  utterance.onerror = () => release(playback, 'Chưa phát được giọng đọc. Vui lòng thử lại.')
  playback.utterance = utterance
  engine.speak(utterance)
}

export function stopAudio(owner?: symbol) {
  if (active && (!owner || active.owner === owner)) release(active)
}

export function playAudio(request: AudioRequest) {
  stopAudio()
  const { media, allowSpeechFallback } = request
  const playback: Playback = { ...request, status: 'loading' }
  active = playback
  update(playback, 'loading')
  const useFallback = () => {
    if (allowSpeechFallback) void speak(playback)
    else release(playback, 'Chưa phát được tệp audio. Bấm nghe để thử lại.')
  }
  if (!media) {
    useFallback()
    return
  }
  const fallback = () => {
    if (active !== playback || !playback.detach) return
    playback.detach()
    playback.detach = undefined
    media.pause()
    playback.media = null
    useFallback()
  }
  const ended = () => release(playback)
  playback.detach = () => {
    media.removeEventListener('ended', ended)
    media.removeEventListener('error', fallback)
  }
  media.addEventListener('ended', ended)
  media.addEventListener('error', fallback)
  if (media.error) media.load()
  if (media.readyState > 0) media.currentTime = 0
  media.playbackRate = playback.rate
  media.preservesPitch = true
  void Promise.resolve(media.play()).then(() => update(playback, 'playing')).catch(fallback)
}

export function pauseAudio(owner: symbol) {
  if (active?.owner !== owner || active.status !== 'playing') return
  active.media?.pause()
  if (active.utterance) speechEngine()?.pause()
  update(active, 'paused')
}

export function resumeAudio(owner: symbol) {
  const playback = active
  if (playback?.owner !== owner || playback.status !== 'paused') return
  if (playback.media) {
    void playback.media.play().then(() => update(playback, 'playing'))
      .catch(() => release(playback, 'Chưa thể tiếp tục phát audio.'))
  } else if (playback.utterance?.rate !== playback.rate) {
    playAudio(playback)
  } else {
    speechEngine()?.resume()
    update(playback, 'playing')
  }
}

export function setAudioRate(owner: symbol, rate: number) {
  const playback = active
  if (playback?.owner !== owner || playback.rate === rate) return
  playback.rate = rate
  if (playback.media) playback.media.playbackRate = rate
  else if (playback.utterance && playback.status === 'playing') playAudio(playback)
}
