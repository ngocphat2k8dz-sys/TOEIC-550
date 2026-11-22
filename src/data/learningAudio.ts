const learningAudioRoot = import.meta.env.BASE_URL + 'listening/english/'

export function learningAudio(id: string) {
  return learningAudioRoot + id + '.mp3'
}

export function isLearningAudio(src?: string) {
  return src?.startsWith(learningAudioRoot) ?? false
}

export function normalizeLearningText(text: string) {
  return text.replace(/[‘’]/g, "'").replace(/[^\S\n]+/g, ' ').trim()
}
