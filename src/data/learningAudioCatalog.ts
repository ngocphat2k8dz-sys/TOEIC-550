import { listeningSteps } from './beginnerListening'
import { beginnerWords } from './beginnerVocabulary'
import { ipaComparisons, ipaSounds } from './ipa'
import { ipaCourseAudio } from './ipaCourse'
import { normalizeLearningText } from './learningAudio'
import { vocabulary } from './vocabulary'

export interface LearningClip { id: string; text: string }

function wordAndSentence(id: string, word: string, sentence: string): LearningClip[] {
  return [{ id, text: word }, { id: id + '-sentence', text: sentence }]
}

export const originalLearningClips: LearningClip[] = [
  ...beginnerWords.flatMap(({ audioId, word, example }) => wordAndSentence(audioId, word, example)),
  ...ipaSounds.flatMap(sound => sound.examples.flatMap(({ audioId, word, sentence }) => wordAndSentence(audioId, word, sentence))),
  ...ipaComparisons.flatMap(comparison => comparison.examples.map(({ audioId, word }) => ({ id: audioId, text: word }))),
  ...vocabulary.flatMap(({ id, word, example }) => wordAndSentence(id, word, example)),
  ...listeningSteps.flatMap(step => step.clips.map(({ audioId, text }) => ({ id: audioId, text }))),
  ...ipaCourseAudio.map(({ audioId, word }) => ({ id: audioId, text: word })),
]

export const originalClipByText = new Map<string, LearningClip>()
for (const clip of originalLearningClips) {
  const text = normalizeLearningText(clip.text)
  if (!originalClipByText.has(text)) originalClipByText.set(text, clip)
}
