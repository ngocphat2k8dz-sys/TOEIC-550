import { beginnerQuestion } from './beginnerQuestion'

const words = [
  ['book', 'bʊk', 'quyển sách', 'Tên đồ vật · danh từ', 'I read a book.', 'Tôi đọc một quyển sách.', 'Please bring the training book on Monday.', 'Vui lòng mang sách đào tạo vào thứ Hai.'],
  ['pen', 'pɛn', 'cây bút', 'Tên đồ vật · danh từ', 'This is my pen.', 'Đây là cây bút của tôi.', 'Please use a black pen on the application form.', 'Vui lòng dùng bút đen trên đơn đăng ký.'],
  ['bag', 'bæɡ', 'cái túi', 'Tên đồ vật · danh từ', 'My bag is blue.', 'Túi của tôi màu xanh dương.', 'Keep your bag with you at the airport.', 'Hãy giữ túi bên mình tại sân bay.'],
  ['bus', 'bʌs', 'xe buýt', 'Tên phương tiện · danh từ', 'I see a bus.', 'Tôi nhìn thấy một chiếc xe buýt.', 'The shuttle bus leaves from the hotel entrance.', 'Xe buýt đưa đón khởi hành từ lối vào khách sạn.'],
  ['go', 'ɡoʊ', 'đi', 'Từ chỉ việc làm · động từ', 'I go home.', 'Tôi về nhà.', 'Go to Gate 4 for the morning train.', 'Hãy đến Cổng 4 để lên chuyến tàu buổi sáng.'],
  ['help', 'hɛlp', 'giúp đỡ', 'Từ chỉ việc làm · động từ', 'I can help.', 'Tôi có thể giúp.', 'Our staff can help you complete the form.', 'Nhân viên của chúng tôi có thể giúp bạn điền biểu mẫu.'],
  ['work', 'wɝk', 'làm việc', 'Từ chỉ việc làm · động từ', 'I work here.', 'Tôi làm việc ở đây.', 'Staff will work from home on Friday.', 'Nhân viên sẽ làm việc tại nhà vào thứ Sáu.'],
  ['open', 'ˈoʊpən', 'mở', 'Từ chỉ việc làm · động từ', 'I open the door.', 'Tôi mở cửa.', 'The service desk will open at eight.', 'Quầy hỗ trợ sẽ mở cửa lúc tám giờ.'],
  ['new', 'nuː', 'mới', 'Từ mô tả · tính từ', 'My bag is new.', 'Túi của tôi mới.', 'The company installed a new printer.', 'Công ty đã lắp một máy in mới.'],
  ['small', 'smɔl', 'nhỏ', 'Từ mô tả · tính từ', 'The box is small.', 'Cái hộp nhỏ.', 'A small meeting room is available upstairs.', 'Có một phòng họp nhỏ còn trống ở tầng trên.'],
  ['happy', 'ˈhæpi', 'vui', 'Từ mô tả · tính từ', 'I am happy.', 'Tôi vui.', 'We are happy to confirm your reservation.', 'Chúng tôi vui mừng xác nhận đặt chỗ của bạn.'],
  ['ready', 'ˈrɛdi', 'sẵn sàng', 'Từ mô tả · tính từ', 'I am ready.', 'Tôi đã sẵn sàng.', 'Your order will be ready by noon.', 'Đơn hàng của bạn sẽ sẵn sàng trước hoặc vào buổi trưa.'],
] as const

export const beginnerWords = words.map(([word, ipa, meaning, kind, example, translation, toeic, toeicTranslation]) => ({
  id: 'basic-word-' + word, word, ipa, meaning, kind, example, translation, toeic, toeicTranslation,
  audioId: 'basic-word-' + word,
}))

const targetWords = ['pen', 'work', 'ready']
export const beginnerWordQuestions = targetWords.map((word, index) => {
  const target = beginnerWords.find(item => item.word === word)!
  const choices = beginnerWords.slice(3, 6)
  choices.splice(index, 1, target)
  return beginnerQuestion('basic-vocab-quiz-' + (index + 1), 'foundation', 'Từ vựng cơ bản',
    'Từ “' + word + '” có nghĩa là gì trong “' + target.example + '”?',
    choices.map(choice => choice.meaning), index,
    {
      translation: target.example + ' → ' + target.translation,
      words: [[target.word, target.meaning]],
      concept: 'Hiểu từ trong một câu ngắn',
      simple: target.kind + '. Trong câu này, ' + target.word + ' có nghĩa là ' + target.meaning + '.',
      example: target.word + ' /' + target.ipa + '/ → ' + target.meaning,
    },
    choices.map(choice => choice === target ? 'Đúng nghĩa của ' + target.word + ' trong câu.' : 'Đây là nghĩa của từ ' + choice.word + '.'),
    'Học một từ cùng một câu ngắn để dễ nhớ nghĩa.',
  )
})
