import { beginnerQuestion } from './beginnerQuestion'

type Clip = {
  id: string
  text: string
  translation: string
  words: readonly (readonly [string, string])[]
  tip: string
  prompt: string
  options: string[]
  answer: number
  reasons: string[]
  example: string
  reuse?: string
}
type Step = { id: string; title: string; description: string; clips: Clip[] }

const steps: Step[] = [
  { id: 'sound', title: 'Nghe âm trong từ', description: 'Chú ý một âm trong từ. Nghe lại rồi đọc theo chậm.', clips: [
    { id: 'see', reuse: 'ipa-long-i', text: 'see', translation: 'nhìn thấy', words: [['see', 'nhìn thấy']], tip: 'Nghe phần nguyên âm giữ đều và rõ.',
      prompt: 'Nghe từ mẫu. Âm nguyên âm nào nổi bật?', options: ['/ɪ/', '/iː/', '/e/'], answer: 1,
      reasons: ['/ɪ/ ngắn và lưỡi hạ nhẹ hơn.', 'See đọc /siː/, nguyên âm /iː/.', '/e/ mở hàm hơn, như trong bet.'], example: 'meet /miːt/ → gặp' },
    { id: 'sip', reuse: 'ipa-s', text: 'sip', translation: 'nhấp một ngụm', words: [['sip', 'nhấp một ngụm']], tip: 'Nghe tiếng xì ở đầu từ, trước nguyên âm.',
      prompt: 'Âm đầu của từ bạn nghe là gì?', options: ['/s/', '/ʃ/', '/tʃ/'], answer: 0,
      reasons: ['Sip đọc /sɪp/, bắt đầu bằng /s/.', '/ʃ/ là tiếng xì như từ ship.', '/tʃ/ có phần bật trước tiếng xì.'], example: 'sun /sʌn/ → mặt trời' },
  ] },
  { id: 'word', title: 'Nghe từ', description: 'Nghe trọn một từ rồi nối âm với nghĩa tiếng Việt.', clips: [
    { id: 'bag', reuse: 'basic-word-bag', text: 'bag', translation: 'cái túi', words: [['bag', 'cái túi']], tip: 'Nghe âm đầu /b/ và âm cuối /ɡ/.',
      prompt: 'Từ nào được đọc?', options: ['bus', 'book', 'bag'], answer: 2,
      reasons: ['Bus có âm /ʌ/ và kết thúc /s/.', 'Book có âm /ʊ/ và kết thúc /k/.', 'Bag đọc /bæɡ/.'], example: 'My bag. → Túi của tôi.' },
    { id: 'ready', reuse: 'basic-word-ready', text: 'ready', translation: 'sẵn sàng', words: [['ready', 'sẵn sàng']], tip: 'Từ có hai phần, nhấn phần đầu REA.',
      prompt: 'Từ bạn nghe nghĩa là gì?', options: ['sẵn sàng', 'mới', 'nhỏ'], answer: 0,
      reasons: ['Ready có nghĩa là sẵn sàng.', 'Mới là new.', 'Nhỏ là small.'], example: 'I am ready. → Tôi đã sẵn sàng.' },
  ] },
  { id: 'phrase', title: 'Nghe cụm từ', description: 'Gom hai đến bốn từ thành một cụm có nghĩa.', clips: [
    { id: 'new-pen', text: 'a new pen', translation: 'một cây bút mới', words: [['new', 'mới'], ['pen', 'cây bút']], tip: 'Nghe danh từ pen, rồi nghe từ đứng trước mô tả nó.',
      prompt: 'Cụm từ nói về vật gì?', options: ['Một quyển sách mới', 'Một cây bút mới', 'Một cái túi cũ'], answer: 1,
      reasons: ['Sách là book, không xuất hiện.', 'Pen là bút và new là mới.', 'Túi là bag, không xuất hiện.'], example: 'a small pen → một cây bút nhỏ' },
    { id: 'on-monday', text: 'on Monday', translation: 'vào thứ Hai', words: [['Monday', 'thứ Hai']], tip: 'Nghe tên ngày, từ on thường được nói nhẹ hơn.',
      prompt: 'Bạn nghe ngày nào?', options: ['Thứ Tư', 'Thứ Sáu', 'Thứ Hai'], answer: 2,
      reasons: ['Thứ Tư là Wednesday.', 'Thứ Sáu là Friday.', 'Monday là thứ Hai.'], example: 'on Friday → vào thứ Sáu' },
  ] },
  { id: 'sentence', title: 'Nghe câu rất ngắn', description: 'Nghe một người hoặc vật và một chi tiết chính.', clips: [
    { id: 'i-work-here', text: 'I work here.', translation: 'Tôi làm việc ở đây.', words: [['I', 'tôi'], ['work', 'làm việc'], ['here', 'ở đây']], tip: 'Nghe I trước, sau đó nghe việc người nói làm.',
      prompt: 'Người nói làm gì ở đây?', options: ['Làm việc', 'Mua đồ', 'Đọc sách'], answer: 0,
      reasons: ['Work có nghĩa là làm việc.', 'Không có cụm buy hay shop.', 'Không có read hoặc book.'], example: 'I work at home. → Tôi làm việc ở nhà.' },
    { id: 'the-box', text: 'The box is small.', translation: 'Cái hộp nhỏ.', words: [['box', 'cái hộp'], ['small', 'nhỏ']], tip: 'Sau is là từ mô tả cái hộp.',
      prompt: 'Cái hộp được mô tả như thế nào?', options: ['Mới', 'Nhỏ', 'Màu xanh'], answer: 1,
      reasons: ['Mới là new.', 'Small nghĩa là nhỏ.', 'Không có từ chỉ màu sắc.'], example: 'The box is new. → Cái hộp mới.' },
  ] },
  { id: 'conversation', title: 'Nghe câu giao tiếp', description: 'Nghe câu hỏi và câu trả lời. Nhận ra thông tin người hỏi cần.', clips: [
    { id: 'where-bag', text: 'Where is my bag? It is under the chair.', translation: 'Túi của tôi ở đâu? Nó ở dưới ghế.', words: [['Where', 'ở đâu'], ['under', 'dưới'], ['chair', 'ghế']], tip: 'Where cho biết cần nghe vị trí.',
      prompt: 'Cái túi nằm ở đâu?', options: ['Trên bàn', 'Trong xe', 'Dưới ghế'], answer: 2,
      reasons: ['Không có on the table.', 'Không có in the car.', 'Under the chair là dưới ghế.'], example: 'The bag is here. → Cái túi ở đây.' },
    { id: 'meet', text: 'When do we meet? At nine.', translation: 'Khi nào chúng ta gặp nhau? Lúc chín giờ.', words: [['When', 'khi nào'], ['meet', 'gặp'], ['At nine', 'lúc chín giờ']], tip: 'When hỏi thời gian. Chú ý cụm at + giờ.',
      prompt: 'Họ gặp nhau lúc mấy giờ?', options: ['Chín giờ', 'Tám giờ', 'Hai giờ'], answer: 0,
      reasons: ['At nine là lúc chín giờ.', 'Không có số eight.', 'Không có số two.'], example: 'We meet at five. → Chúng ta gặp lúc năm giờ.' },
  ] },
  { id: 'short-talk', title: 'Nghe đoạn ngắn', description: 'Nối hai câu và giữ một hoặc hai chi tiết quan trọng.', clips: [
    { id: 'shop', text: 'The shop opens at eight. It is closed on Sunday.', translation: 'Cửa hàng mở lúc tám giờ. Cửa hàng đóng cửa vào Chủ Nhật.', words: [['opens', 'mở cửa'], ['at eight', 'lúc tám giờ'], ['on Sunday', 'vào Chủ Nhật']], tip: 'Tách giờ mở cửa ở câu đầu và ngày đóng cửa ở câu sau.',
      prompt: 'Cửa hàng đóng cửa vào ngày nào?', options: ['Thứ Hai', 'Chủ Nhật', 'Thứ Sáu'], answer: 1,
      reasons: ['Đoạn nghe không nêu Monday.', 'Closed on Sunday nghĩa là đóng cửa vào Chủ Nhật.', 'Đoạn nghe không nêu Friday.'], example: 'The shop is closed today. → Cửa hàng đóng cửa hôm nay.' },
    { id: 'bus-time', text: 'Your bus leaves at ten. Please wait by the front door.', translation: 'Xe buýt của bạn đi lúc mười giờ. Vui lòng chờ cạnh cửa trước.', words: [['leaves', 'khởi hành'], ['at ten', 'lúc mười giờ'], ['front door', 'cửa trước']], tip: 'Tách thông tin về giờ với hướng dẫn bắt đầu bằng Please.',
      prompt: 'Người nghe cần đợi ở đâu?', options: ['Bên cửa sau', 'Trong xe', 'Cạnh cửa trước'], answer: 2,
      reasons: ['Cửa sau là the back door.', 'Người nói yêu cầu đợi trước khi lên xe.', 'By the front door nghĩa là cạnh cửa trước.'], example: 'Please wait here. → Vui lòng chờ ở đây.' },
  ] },
]

export const listeningSteps = steps.map(({ clips, ...step }) => ({
  ...step,
  completionId: 'basic-listening-' + step.id,
  clips: clips.map(clip => ({ ...clip, audioId: clip.reuse ?? 'basic-listen-' + clip.id })),
  questions: clips.map(clip => beginnerQuestion('basic-listen-' + clip.id, 'beginner-listening', step.title,
    clip.prompt, clip.options, clip.answer,
    { translation: clip.text + ' → ' + clip.translation, words: clip.words,
      concept: step.title, simple: clip.reasons[clip.answer], example: clip.example },
    clip.reasons, clip.tip, { text: clip.text, audioId: clip.reuse ?? 'basic-listen-' + clip.id, keywords: clip.words.map(([word]) => word) })),
}))

export const beginnerListeningQuestions = listeningSteps.flatMap(step => step.questions)
