import type { Part, Skill } from '../types'

interface PartGuide {
  part: Part
  name: string
  description: string
  method: string
  keywords: string
  trap: string
  tip: string
}

export const guides: PartGuide[] = [
  { part: 1, name: 'Photographs', description: 'Nhìn ảnh và chọn một trong bốn câu mô tả đúng nhất.', method: 'Quan sát người, đồ vật, hành động và vị trí trước khi nghe. Kiểm tra từng câu theo đúng chi tiết trong ảnh.', keywords: 'is carrying, are standing, next to, on top of, have been placed', trap: 'Động từ đúng nhưng chủ thể sai, hoặc đúng đồ vật nhưng sai vị trí.', tip: 'Phân biệt hành động đang diễn ra (is being moved) với trạng thái hiện tại (is placed).' },
  { part: 2, name: 'Question–Response', description: 'Nghe một câu hỏi hoặc lời nói, rồi chọn một trong ba câu đáp phù hợp.', method: 'Tập trung vào vài từ đầu để nhận ra loại câu hỏi. Xác định người nói cần thông tin, lời xác nhận hay một hành động.', keywords: 'who, where, when, why, how long, would you', trap: 'Câu đáp lặp lại từ trong câu hỏi nhưng trả lời sai ý. Câu trả lời đúng đôi khi gián tiếp.', tip: 'Với câu hỏi Yes/No, chấp nhận câu cung cấp thông tin đủ để suy ra câu trả lời.' },
  { part: 3, name: 'Conversations', description: 'Nghe hội thoại và trả lời câu hỏi về bối cảnh, chi tiết hoặc bước tiếp theo.', method: 'Đọc nhanh câu hỏi trước. Khi nghe, theo dõi người nào nói gì và điều gì thay đổi ở cuối.', keywords: 'actually, instead, I can, could you, by tomorrow', trap: 'Thông tin được nhắc đầu tiên có thể bị sửa lại hoặc thuộc về người khác.', tip: 'Nếu câu hỏi hỏi bước tiếp theo, nghe kỹ lời hứa hoặc đề nghị ở cuối đoạn.' },
  { part: 4, name: 'Talks', description: 'Nghe một người nói trong thông báo, lời nhắn hoặc hướng dẫn.', method: 'Dùng câu mở đầu để nhận ra mục đích. Sau đó theo dõi chi tiết theo thứ tự xuất hiện.', keywords: 'reminder, due to, starting on, please note, for assistance', trap: 'Ngày cũ và ngày mới, giờ mở cửa và giờ khởi hành dễ bị đánh tráo.', tip: 'Một cụm như due to báo hiệu nguyên nhân. Please báo hiệu hành động người nghe cần làm.' },
  { part: 5, name: 'Incomplete Sentences', description: 'Chọn từ hoặc cụm từ hoàn thành một câu.', method: 'Nhìn vị trí chỗ trống để đoán loại từ, rồi kiểm tra sự hòa hợp, thì và nghĩa.', keywords: 'a/an/the, very, already, since, by, although', trap: 'Đáp án có cùng gốc từ nhưng khác loại từ, hoặc đúng ngữ pháp mà sai ngữ cảnh.', tip: 'Nếu bốn lựa chọn có cùng gốc, kiểm tra cấu trúc trước khi dịch cả câu.' },
  { part: 6, name: 'Text Completion', description: 'Điền từ hoặc cả câu vào email, thông báo và văn bản ngắn.', method: 'Đọc tiêu đề và câu mở đầu để biết mục đích. Đọc cả câu trước và sau chỗ trống.', keywords: 'therefore, however, this change, also, regarding', trap: 'Một lựa chọn có thể đúng riêng lẻ nhưng sai với thời gian, giọng văn hoặc câu nối.', tip: 'Với câu điền nguyên câu, tìm danh từ mà this, these hoặc they đang nhắc tới.' },
  { part: 7, name: 'Reading Comprehension', description: 'Đọc một, hai hoặc ba văn bản và tìm thông tin để trả lời.', method: 'Đọc câu hỏi rồi dò tên, ngày, giá hoặc hành động. Với nhiều văn bản, nối các thông tin cùng nói về một việc.', keywords: 'deadline, eligible, revised, attached, as requested', trap: 'Đáp án lặp từ trong bài nhưng gán sai người, nhầm ngày hoặc sai điều kiện.', tip: 'Chỉ chọn suy luận có thể đối chiếu bằng một hoặc nhiều chi tiết trong văn bản.' },
]

export const parts = guides.map(({ part }) => part)
export const skillOf = (part: Part): Skill => part <= 4 ? 'Listening' : 'Reading'
export const guideFor = (part: Part) => guides[part - 1]

export interface CourseLesson {
  id: string
  title: string
  route: string
}

export const stages: { title: string; goal: string; lessons: CourseLesson[] }[] = [
  { title: 'Nền tảng tiếng Anh', goal: 'Nhận diện từ loại và tích lũy từ vựng văn phòng trước khi làm câu TOEIC.', lessons: [
    { id: 'grammar-parts-of-speech', title: 'Nhận diện từ loại', route: 'grammar/Parts%20of%20Speech' },
    { id: 'vocab-office', title: 'Từ vựng văn phòng', route: 'vocabulary/Office' },
    { id: 'part-5-noun', title: 'Part 5 · Nhận diện danh từ', route: 'parts/5/Noun' },
  ] },
  { title: 'TOEIC cơ bản', goal: 'Làm quen với bài nghe ngắn và các tín hiệu ngữ pháp thường gặp.', lessons: [
    { id: 'part-1', title: 'Part 1 · Mô tả ảnh', route: 'parts/1' },
    { id: 'part-2', title: 'Part 2 · Hỏi và đáp', route: 'parts/2' },
    { id: 'part-5-tense', title: 'Part 5 · Các thì', route: 'parts/5/Tense' },
  ] },
  { title: 'Luyện từng Part', goal: 'Bắt ý chính trong bài nghe dài và tìm bằng chứng trong văn bản.', lessons: [
    { id: 'part-3', title: 'Part 3 · Hội thoại', route: 'parts/3' },
    { id: 'part-4', title: 'Part 4 · Bài nói ngắn', route: 'parts/4' },
    { id: 'part-5', title: 'Part 5 · Hoàn thành câu', route: 'parts/5' },
    { id: 'part-6', title: 'Part 6 · Hoàn thành đoạn văn', route: 'parts/6' },
    { id: 'part-7', title: 'Part 7 · Đọc hiểu', route: 'parts/7' },
  ] },
  { title: 'Luyện đề', goal: 'Phân bổ thời gian và so sánh kết quả Listening với Reading.', lessons: [
    { id: 'mini', title: 'Hoàn thành một Mini Test', route: 'mini-test' },
    { id: 'mock', title: 'Hoàn thành đề thi thử rút gọn', route: 'mock-test' },
  ] },
  { title: 'Ổn định mức 550+', goal: 'Ôn câu thường sai và theo dõi sự tiến bộ qua các bài kiểm tra.', lessons: [
    { id: 'weakness', title: 'Luyện các chủ đề yếu', route: 'weakness' },
    { id: 'review', title: 'Làm lại câu trong sổ câu sai', route: 'mistakes' },
    { id: 'mock-target', title: 'Đạt mức mục tiêu trong bài thi thử', route: 'mock-test' },
  ] },
]

export const studyPlan = [
  { day: 'Thứ Hai', short: 'T2', task: 'Từ vựng + Part 5', detail: 'Từ vựng công sở, danh từ và dạng từ', route: 'vocabulary/Office' },
  { day: 'Thứ Ba', short: 'T3', task: 'Part 2 + Listening', detail: 'Câu hỏi Wh- và phản hồi gián tiếp', route: 'parts/2' },
  { day: 'Thứ Tư', short: 'T4', task: 'Ngữ pháp + Part 5', detail: 'Ôn thì và làm câu điền từ', route: 'grammar/Tenses' },
  { day: 'Thứ Năm', short: 'T5', task: 'Part 3', detail: 'Theo dõi người nói và hành động tiếp theo', route: 'parts/3' },
  { day: 'Thứ Sáu', short: 'T6', task: 'Part 6 + Part 7', detail: 'Điền đoạn văn và đọc hiểu', route: 'parts/6' },
  { day: 'Thứ Bảy', short: 'T7', task: 'Mini Test', detail: 'Kiểm tra Listening và Reading', route: 'mini-test' },
  { day: 'Chủ Nhật', short: 'CN', task: 'Ôn lỗi + Từ vựng', detail: 'Làm lại câu sai và ôn flashcard', route: 'mistakes' },
]

export function lessonForPart(part: Part, topic?: string) {
  return topic ? `part-${part}-${topic.toLowerCase().replaceAll(' ', '-')}` : `part-${part}`
}
