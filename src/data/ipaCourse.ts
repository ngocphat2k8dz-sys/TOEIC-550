import { beginnerQuestion } from './beginnerQuestion'
import { ipaSounds, type IpaSound } from './ipa'

type CourseWord = { word: string; ipa: string; meaning: string; audioId: string }
type ContrastWord = readonly [word: string, ipa: string, meaning: string]
type Contrast = readonly [ContrastWord, ContrastWord]
type LessonDraft = {
  sounds: string[]
  goal: string
  contrasts?: Contrast[]
  note?: string
}

const usSymbols: Record<string, string> = {
  'long-i': 'iː', e: 'ɛ', lot: 'ɑ', ah: 'ɑ', aw: 'ɔ', er: 'ɝ',
  oh: 'oʊ', ear: 'ɪr', air: 'ɛr', oor: 'ʊr',
}
const usSpeechNotes: Record<string, string> = {
  'long-i': 'Trong nhiều bảng Anh–Mỹ, /iː/ được ghi là /i/. Nghe độ rõ và vị trí lưỡi, không chỉ độ dài.',
  e: 'Bảng tra cứu ghi /e/. Trong phiên âm Anh–Mỹ, âm trong bet hay pen thường ghi /ɛ/.',
  ah: 'Bảng tra cứu ghi /ɑː/. Trong phần nghe Anh–Mỹ, đặt lưỡi thấp về sau và giữ môi tự nhiên.',
  lot: 'Bảng tra cứu ghi /ɒ/ cho cot theo Anh–Anh. Phần nghe Anh–Mỹ dùng /ɑ/, thường không tròn môi.',
  aw: 'Bảng tra cứu ghi /ɔː/. Nhiều giọng Anh–Mỹ dùng /ɔ/ cho saw; ở giọng có nhập âm cot–caught, nó gần hoặc trùng /ɑ/.',
  er: 'Bird có âm /ɝ/ trong Anh–Mỹ. Lưỡi tạo âm r trong nguyên âm, thay cho mẫu /ɜː/ không r ở bảng tra cứu.',
  oh: 'Go trong Anh–Mỹ thường ghi /oʊ/. Bắt đầu với môi hơi tròn và lướt về /ʊ/.',
  ear: 'Here trong Anh–Mỹ giữ âm r, thường ghi /hɪr/. Bảng tra cứu ghi /ɪə/ theo Anh–Anh.',
  air: 'Hair trong Anh–Mỹ giữ âm r, thường ghi /hɛr/. Bảng tra cứu ghi /eə/ theo Anh–Anh.',
  oor: 'Tour trong Anh–Mỹ giữ âm r. Có thể gặp cả nguyên âm /ʊ/ và /ɔ/ trước r, tùy người nói.',
}
const americanPronunciation: Record<string, string> = {
  calm: 'kɑm', cot: 'kɑt', saw: 'sɔ', bird: 'bɝd', go: 'ɡoʊ',
  here: 'hɪr', hair: 'hɛr', tour: 'tʊr', bet: 'bɛt', pen: 'pɛn', den: 'dɛn',
  then: 'ðɛn', nose: 'noʊz', red: 'rɛd', yes: 'jɛs', wet: 'wɛt',
}

export function studySymbol(sound: IpaSound) {
  return usSymbols[sound.id] ?? sound.symbol
}

export function pronunciationNote(sound: IpaSound) {
  return usSpeechNotes[sound.id]
}

const usMouth: Record<string, string> = {
  lot: 'Hạ hàm, để lưỡi thấp và hơi lùi. Giữ môi tự nhiên khi nói cot.',
  er: 'Giữ lưỡi nâng về phía giữa vòm miệng để có màu âm r. Đầu lưỡi không gõ vào vòm.',
  oh: 'Môi hơi tròn lúc đầu, rồi khép nhẹ hơn khi kết thúc phần lướt.',
  ear: 'Bắt đầu với lưỡi cao gần phía trước. Sau đó gom lưỡi về tư thế r mà không chạm vòm.',
  air: 'Mở hàm vừa và đưa lưỡi ra trước ở phần nguyên âm, rồi chuyển sang âm r.',
  oor: 'Bắt đầu bằng môi tròn nhẹ, sau đó nâng và gom lưỡi để giữ âm r.',
}

export function studyMouth(sound: IpaSound) {
  return usMouth[sound.id] ?? sound.mouth
}

export function spokenIpa(word: string, reference: string) {
  return americanPronunciation[word] ?? reference
}

const drafts: LessonDraft[] = [
  { sounds: ['long-i', 'short-i'], goal: 'Nghe nguyên âm rõ, lưỡi cao trong sheep và âm thả lỏng trong ship.',
    contrasts: [
      [['sheep', 'ʃiːp', 'con cừu'], ['ship', 'ʃɪp', 'con tàu']],
      [['seat', 'siːt', 'chỗ ngồi'], ['sit', 'sɪt', 'ngồi']],
      [['beat', 'biːt', 'đánh, đập'], ['bit', 'bɪt', 'một chút']],
    ] },
  { sounds: ['e', 'ash'], goal: 'Nghe sự khác biệt khi hạ hàm và mở miệng rộng hơn trong pan.',
    contrasts: [
      [['pen', 'pɛn', 'cây bút'], ['pan', 'pæn', 'cái chảo']],
      [['men', 'mɛn', 'những người đàn ông'], ['man', 'mæn', 'một người đàn ông']],
      [['bet', 'bɛt', 'vụ cá cược'], ['bat', 'bæt', 'con dơi']],
    ] },
  { sounds: ['uh', 'ah'], goal: 'Phân biệt âm /ʌ/ gọn ở giữa miệng với /ɑ/ mở rộng hơn.',
    contrasts: [[['cut', 'kʌt', 'cắt'], ['cot', 'kɑt', 'giường nhỏ']]] },
  { sounds: ['short-u', 'oo'], goal: 'Nghe âm ngắn, thả lỏng trong full và âm cao hơn trong fool.',
    contrasts: [[['full', 'fʊl', 'đầy'], ['fool', 'fuːl', 'người ngốc']]] },
  { sounds: ['lot', 'aw'], goal: 'Nghe cot và saw theo mẫu Anh–Mỹ, rồi đối chiếu cách ghi Anh–Anh.',
    note: 'Có người nói /ɑ/ và /ɔ/ giống nhau. Bài này dùng lựa chọn dựa vào từ mẫu và phiên âm, tránh chấm một biến thể giọng là sai.' },
  { sounds: ['er', 'schwa'], goal: 'Nghe âm /ɝ/ có r trong bird và nhận ra âm /ə/ rất nhẹ ở đầu away.' },
  { sounds: ['ay', 'eye'], goal: 'Giữ nguyên âm lướt trong một nhịp và phân biệt /eɪ/ với /aɪ/.',
    contrasts: [[['late', 'leɪt', 'muộn'], ['light', 'laɪt', 'ánh sáng']]] },
  { sounds: ['oy', 'ow', 'oh'], goal: 'Nghe ba kiểu lướt âm trong toy, now và go.' },
  { sounds: ['ear', 'air', 'oor'], goal: 'Nghe nguyên âm trước r trong here, hair và tour.',
    note: 'Phần nghe dùng giọng Anh–Mỹ có r. Các ký hiệu /ɪə/, /eə/ và /ʊə/ vẫn có trong bảng 44 âm để đối chiếu. Cách đọc của tour có thể khác giữa các giọng.' },
  { sounds: ['p', 'b'], goal: 'Cùng bật từ hai môi. Chú ý tiếng rung và mức bật hơi.',
    contrasts: [[['pat', 'pæt', 'vỗ nhẹ'], ['bat', 'bæt', 'con dơi']]] },
  { sounds: ['t', 'd'], goal: 'Đặt đầu lưỡi sau răng trên và nghe khác biệt giữa /t/ và /d/.',
    contrasts: [[['tie', 'taɪ', 'cà vạt'], ['die', 'daɪ', 'chết']]] },
  { sounds: ['k', 'g'], goal: 'Dùng phần sau lưỡi để bật hơi; thêm tiếng rung khi đọc /ɡ/.',
    contrasts: [[['coat', 'koʊt', 'áo khoác'], ['goat', 'ɡoʊt', 'con dê']]] },
  { sounds: ['f', 'v'], goal: 'Giữ răng trên chạm môi dưới rồi thêm tiếng rung để tạo /v/.',
    contrasts: [[['fan', 'fæn', 'cái quạt'], ['van', 'væn', 'xe tải nhỏ']]] },
  { sounds: ['s', 'z'], goal: 'So sánh hai tiếng rít và thử đặt tay lên cổ để cảm nhận tiếng rung.',
    contrasts: [[['sip', 'sɪp', 'nhấp một ngụm'], ['zip', 'zɪp', 'khóa kéo']]] },
  { sounds: ['sh', 'ch'], goal: 'Giữ luồng hơi ở /ʃ/ rồi nghe tiếng bật ngắn trước /tʃ/.',
    contrasts: [
      [['ship', 'ʃɪp', 'con tàu'], ['chip', 'tʃɪp', 'miếng khoai chiên']],
      [['sip', 'sɪp', 'nhấp một ngụm'], ['ship', 'ʃɪp', 'con tàu']],
    ],
    note: 'Khi so sánh sip với ship, chú ý lưỡi lùi và môi hơi tròn ở /ʃ/.' },
  { sounds: ['zh', 'j'], goal: 'Chú ý tiếng rung trong vision và phần chặn rồi nhả trong jam.' },
  { sounds: ['th-air', 'th-voice'], goal: 'Đặt lưỡi chạm nhẹ mép răng, để hơi thoát liên tục và phân biệt có rung với không rung.',
    contrasts: [
      [['thin', 'θɪn', 'mỏng'], ['tin', 'tɪn', 'hộp thiếc']],
      [['then', 'ðɛn', 'sau đó'], ['den', 'dɛn', 'hang thú']],
    ],
    note: 'Với /θ/ và /ð/, hơi tiếp tục đi qua kẽ quanh lưỡi. Với /t/ và /d/, lưỡi chặn hơi rồi nhả.' },
  { sounds: ['m', 'n', 'ng'], goal: 'Phân biệt âm mũi tạo bằng môi, đầu lưỡi và cuống lưỡi.',
    contrasts: [[['sin', 'sɪn', 'tội lỗi'], ['sing', 'sɪŋ', 'hát']]] },
  { sounds: ['l', 'r'], goal: 'Chạm đầu lưỡi ở /l/ và giữ đầu lưỡi không chạm lợi ở /r/.',
    contrasts: [[['light', 'laɪt', 'ánh sáng'], ['right', 'raɪt', 'bên phải']]] },
  { sounds: ['h', 'y', 'w'], goal: 'Nghe hơi nhẹ trong hat, âm lướt phía trước trong yes và môi tròn trong wet.' },
]

const soundById = new Map(ipaSounds.map(sound => [sound.id, sound]))
const existingWords = new Map(ipaSounds.flatMap(sound => sound.examples.map(word => [word.word, word.audioId] as const)))
function contrastWord([word, ipa, meaning]: ContrastWord): CourseWord {
  return { word, ipa, meaning, audioId: existingWords.get(word) ?? 'ipa-course-' + word }
}

function sample(sound: IpaSound): CourseWord {
  const { word, transcription, meaning, audioId } = sound.examples[0]
  return { word, ipa: spokenIpa(word, transcription), meaning, audioId }
}

function makeQuiz(id: string, number: number, sounds: IpaSound[], contrasts: CourseWord[][]) {
  const samples = sounds.map(sample)
  // Use the matching pair as the target when both words illustrate this lesson's sounds.
  const pair = contrasts[0]?.length === sounds.length && number !== 17 ? contrasts[0] : samples
  const writtenOnlySymbols = number === 5 || number === 9
  return Array.from({ length: 4 }, (_, index) => {
    const targetIndex = (number - 1 + Math.floor(index / 2)) % sounds.length
    const sound = sounds[targetIndex]
    const targetSet = index === 0 || index === 2 && !writtenOnlySymbols ? pair : samples
    const target = targetSet[targetIndex]
    const example = sound.examples[0]
    const listen = index === 0 || index === 2 && !writtenOnlySymbols
    const symbols = index === 2
    const prompt = index === 0 ? 'Nghe audio. Bạn nghe thấy từ nào?' :
      index === 1 ? 'Từ mẫu nào minh họa cho âm /' + studySymbol(sound) + '/?' :
        symbols && listen ? 'Nghe từ mẫu. Âm đang luyện là âm nào?' :
          symbols ? 'Trong phiên âm /' + target.ipa + '/, đâu là âm đang luyện?' : 'Từ nào có phiên âm /' + target.ipa + '/?'
    const ordered = targetSet.map((_, i) => (i + index) % sounds.length)
    const options = ordered.map(i => symbols ? '/' + studySymbol(sounds[i]) + '/' : targetSet[i].word)
    return beginnerQuestion(id + '-q' + (index + 1), 'ipa', 'IPA · Bài ' + number, prompt,
      options, ordered.indexOf(targetIndex),
      {
        translation: listen ? target.word + ' → ' + target.meaning : example.sentence + ' → ' + example.translation,
        words: [[target.word, target.meaning]],
        concept: 'Nhận ra âm /' + studySymbol(sound) + '/ trong từ mẫu.',
        simple: target.word + ' đọc là /' + target.ipa + '/. ' + (pronunciationNote(sound) ?? sound.cue),
        example: example.sentence + ' → ' + example.translation,
      },
      ordered.map(i => i === targetIndex ? target.word + ' có cách đọc được hỏi.' :
        targetSet[i].word + ' đọc /' + targetSet[i].ipa + '/, ứng với mẫu /' + studySymbol(sounds[i]) + '/ ở đây.'),
      pronunciationNote(sound) ?? sound.tip,
      listen ? { text: target.word, audioId: target.audioId, keywords: [target.word] } : undefined,
    )
  })
}

export const ipaCourse = drafts.map((draft, index) => {
  const number = index + 1
  const id = 'ipa-course-' + String(number).padStart(2, '0')
  const sounds = draft.sounds.map(soundId => soundById.get(soundId)!)
  const contrasts = (draft.contrasts ?? []).map(pair => pair.map(contrastWord))
  const title = sounds.map(sound => '/' + studySymbol(sound) + '/').join(' và ')
  return {
    id, number, title, sounds, contrasts, group: sounds[0].group,
    goal: draft.goal, note: draft.note,
    questions: makeQuiz(id, number, sounds, contrasts),
  }
})

export const ipaCourseQuestions = ipaCourse.flatMap(lesson => lesson.questions)
export const ipaCourseAudio = ipaCourse.flatMap(lesson => lesson.contrasts.flat())

export function nextIpaLesson(completed: string[], group?: string) {
  return ipaCourse.find(lesson => (!group || lesson.group === group) && !completed.includes(lesson.id))
}
