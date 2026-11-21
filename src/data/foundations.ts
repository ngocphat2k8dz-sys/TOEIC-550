import { beginnerQuestion } from './beginnerQuestion'
import type { BeginnerExplanation } from '../types'

type Example = readonly [english: string, vietnamese: string]
type Check = readonly [prompt: string, options: string[], answer: number, explanation: BeginnerExplanation, reasons: string[], tip: string]
type LessonDraft = {
  id: string
  title: string
  goal: string
  notes: readonly (readonly [string, string])[]
  examples: readonly Example[]
  checks: readonly Check[]
}

const drafts: LessonDraft[] = [
  {
    id: 'hello', title: 'Làm quen tiếng Anh', goal: 'Đọc và hiểu lời chào, lời cảm ơn và một câu giới thiệu tên.',
    notes: [
      ['Bắt đầu bằng nhóm từ quen', 'Hello nghĩa là xin chào. Thank you là cảm ơn. Bạn có thể nói trọn cụm như một lời đáp.'],
      ['Giới thiệu mình', 'I nghĩa là tôi. I am Lan có nghĩa là Tôi là Lan. I’m là cách viết ngắn của I am.'],
      ['Khi đọc một câu', 'Tìm cụm mình đã biết trước. Chữ đầu của câu và tên riêng viết hoa. Dấu chấm thường kết thúc một câu kể.'],
    ],
    examples: [['Hello, I am Lan.', 'Xin chào, tôi là Lan.'], ['Thank you, Mai.', 'Cảm ơn Mai.']],
    checks: [
      ['Bạn muốn chào một người mới gặp. Hãy chọn lời phù hợp.', ['Thank you.', 'Hello.', 'Goodbye.'], 1,
        { translation: 'Hello. → Xin chào.', words: [['hello', 'xin chào']], concept: 'Lời chào', simple: 'Khi vừa gặp ai đó, Hello là lời mở đầu đơn giản.', example: 'Hi, Nam. → Chào Nam.' },
        ['Dùng để cảm ơn.', 'Dùng để chào khi vừa gặp.', 'Dùng để chào tạm biệt.'], 'Gặp mặt dùng Hello. Lúc rời đi dùng Goodbye.'],
      ['Câu nào giúp bạn giới thiệu mình là Lan?', ['I am Lan.', 'You are Lan.', 'Thank you, Lan.'], 0,
        { translation: 'I am Lan. → Tôi là Lan.', words: [['I', 'tôi'], ['am', 'là khi đi với I']], concept: 'Giới thiệu tên', simple: 'Bạn nói về chính mình nên bắt đầu bằng I. Cụm I am đứng trước tên của bạn.', example: 'I am Mai. → Tôi là Mai.' },
        ['I am + tên cho biết bạn là ai.', 'You là bạn, tức là người đang nghe.', 'Câu này đang cảm ơn Lan.'], 'Khi nói tên mình, dùng I am hoặc I’m.'],
    ],
  },
  {
    id: 'sentence', title: 'Cấu trúc câu cơ bản', goal: 'Tìm người hoặc vật làm việc gì và nhận ra trật tự của một câu ngắn.',
    notes: [
      ['Ai hoặc cái gì?', 'Phần cho biết câu đang nói về ai hoặc vật gì gọi là chủ ngữ (subject). Trong câu Lan reads, câu nói về Lan.'],
      ['Làm gì hoặc ở trạng thái nào?', 'Từ chỉ việc làm hoặc trạng thái gọi là động từ (verb). Reads là đọc. Is có thể nối người với đặc điểm như happy.'],
      ['Làm việc đó với cái gì?', 'Phần nhận hành động gọi là tân ngữ (object). Trong Lan reads a book, a book là thứ Lan đọc. Có những câu đủ ý mà không cần tân ngữ, như I sleep.'],
    ],
    examples: [['Lan reads a book.', 'Lan đọc một quyển sách.'], ['I sleep.', 'Tôi ngủ.'], ['She is happy.', 'Cô ấy vui.']],
    checks: [
      ['Trong “Mai opens the door”, ai mở cửa?', ['the door', 'opens', 'Mai'], 2,
        { translation: 'Mai opens the door. → Mai mở cửa.', words: [['opens', 'mở'], ['the door', 'cánh cửa']], concept: 'Người thực hiện việc làm, gọi là chủ ngữ (subject)', simple: 'Hỏi “ai mở?”. Câu trả lời là Mai. Cánh cửa là thứ được mở.', example: 'Nam sits. → Nam ngồi.' },
        ['Cánh cửa là thứ được mở.', 'Opens nói về việc làm.', 'Mai là người mở cửa.'], 'Tìm việc làm rồi hỏi “ai hoặc cái gì làm việc đó?”.'],
      ['Chọn câu có thứ tự “tôi → đọc → một quyển sách”.', ['I read a book.', 'A book I read.', 'Read I a book.'], 0,
        { translation: 'I read a book. → Tôi đọc một quyển sách.', words: [['I', 'tôi'], ['read', 'đọc'], ['a book', 'một quyển sách']], concept: 'Trật tự câu kể cơ bản', simple: 'Trong mẫu câu đang học, nói ai trước, rồi nói làm gì và cuối cùng là vật được nhắc tới.', example: 'I eat rice. → Tôi ăn cơm.' },
        ['Đúng thứ tự người làm, việc làm, vật nhận việc.', 'Đưa vật lên đầu, khác mẫu cần tìm.', 'Đưa việc làm lên trước người trong câu kể cơ bản.'], 'Đọc từng cụm từ trái sang phải bằng ba câu hỏi: ai, làm gì, với thứ nào.'],
    ],
  },
  {
    id: 'pronouns', title: 'Đại từ · Cách gọi thay tên', goal: 'Dùng I, you, he, she, it, we và they để chỉ người hoặc vật.',
    notes: [
      ['Đỡ lặp lại tên', 'Từ như tôi, cô ấy hoặc họ có thể dùng thay cho tên. Đó là đại từ (pronoun).'],
      ['Cách gọi người', 'I là tôi, you là bạn, he là anh ấy, she là cô ấy, we là chúng tôi hoặc chúng ta, they là họ.'],
      ['Cách gọi vật', 'It có thể chỉ một vật đã nhắc đến. They có thể chỉ nhiều người hoặc nhiều vật.'],
    ],
    examples: [['Mai is here. She is happy.', 'Mai ở đây. Cô ấy vui.'], ['I have a bag. It is blue.', 'Tôi có một cái túi. Nó màu xanh dương.']],
    checks: [
      ['Đã nhắc đến Mai. Chọn từ cho “Cô ấy vui”.', ['I am happy.', 'They are happy.', 'She is happy.'], 2,
        { translation: 'She is happy. → Cô ấy vui.', words: [['she', 'cô ấy'], ['happy', 'vui']], concept: 'Từ thay cho tên một người', simple: 'Đã biết người được nói đến là Mai. She thay tên Mai mà câu vẫn rõ nghĩa.', example: 'She is here. → Cô ấy ở đây.' },
        ['I chỉ người nói.', 'They chỉ họ, khác người được mô tả.', 'She thay cho Mai.'], 'Khi chọn từ thay tên, xác định người nói hay người được nói đến.'],
      ['Chọn câu nói “Nó màu xanh dương” về một cái túi.', ['We are blue.', 'It is blue.', 'I am blue.'], 1,
        { translation: 'It is blue. → Nó màu xanh dương.', words: [['it', 'nó, chỉ một vật'], ['blue', 'xanh dương']], concept: 'Dùng it cho một vật đã nhắc đến', simple: 'Cái túi là một vật. It thay cho the bag để ta không phải nói lại cả cụm.', example: 'It is new. → Nó mới.' },
        ['We nói về người, nghĩa là chúng tôi.', 'It thay cho cái túi.', 'I chỉ người nói.'], 'Đã nhắc một đồ vật thì thường dùng it để nói tiếp.'],
    ],
  },
  {
    id: 'nouns', title: 'Danh từ · Tên người, vật và nơi chốn', goal: 'Nhận ra từ gọi tên và phân biệt một với nhiều.',
    notes: [
      ['Gọi tên một thứ', 'Từ để gọi tên người, vật, nơi chốn hoặc sự việc là danh từ (noun). Book là sách, school là trường.'],
      ['Một hoặc nhiều thứ', 'Với nhiều từ đếm được, thêm s khi có từ hai trở lên. A bag là một cái túi. Two bags là hai cái túi. Một số từ có cách đổi riêng như person → people.'],
      ['Tìm nhanh khi đọc', 'Sau a hoặc an thường có tên một thứ đếm được, đôi khi có một từ mô tả chen vào trước tên.'],
    ],
    examples: [['I need a pen.', 'Tôi cần một cây bút.'], ['We have two bags.', 'Chúng tôi có hai cái túi.']],
    checks: [
      ['Điền từ để nói “Tôi cần một cây bút”. I need a _____.', ['write', 'pen', 'quickly'], 1,
        { translation: 'I need a pen. → Tôi cần một cây bút.', words: [['need', 'cần'], ['pen', 'bút']], concept: 'Từ gọi tên đồ vật, gọi là danh từ (noun)', simple: 'Sau a cần tên một thứ. Pen là tên của đồ vật bạn cần.', example: 'I need a bag. → Tôi cần một cái túi.' },
        ['Write nói về hành động viết.', 'Pen gọi tên một đồ vật đếm được.', 'Quickly nghĩa là một cách nhanh chóng.'], 'Thấy a hay an, hãy tìm từ gọi tên một đồ vật hoặc một người.'],
      ['Chọn từ để nói “hai quyển sách”. two _____', ['book', 'reads', 'books'], 2,
        { translation: 'two books → hai quyển sách', words: [['two', 'hai'], ['books', 'những quyển sách']], concept: 'Tên đồ vật ở dạng nhiều (plural noun)', simple: 'Two cho biết có hai quyển. Dạng nhiều của book là books.', example: 'two pens → hai cây bút' },
        ['Book là dạng một quyển.', 'Reads là việc đọc, khác tên đồ vật.', 'Books là dạng nhiều của book.'], 'Sau two, three, four, thử kiểm tra danh từ đếm được đã ở dạng nhiều chưa.'],
    ],
  },
  {
    id: 'verbs', title: 'Động từ · Việc làm và trạng thái', goal: 'Nhận diện động từ và dùng am, is, are ở mức cơ bản.',
    notes: [
      ['Việc làm', 'Work là làm việc, read là đọc, open là mở. Từ cho biết việc làm được gọi là động từ (verb).'],
      ['Trạng thái và đặc điểm', 'Am, is và are giúp nói ai là ai, ở đâu hoặc có đặc điểm gì. Chúng là các dạng của be.'],
      ['Nhớ theo cụm', 'I am, he/she/it is, you/we/they are. Khi nói việc lặp lại, I work nhưng she works.'],
    ],
    examples: [['I work here.', 'Tôi làm việc ở đây.'], ['She is tired.', 'Cô ấy mệt.'], ['They are ready.', 'Họ đã sẵn sàng.']],
    checks: [
      ['Điền từ cho câu “Cô ấy mệt”. She _____ tired.', ['is', 'am', 'are'], 0,
        { translation: 'She is tired. → Cô ấy mệt.', words: [['she', 'cô ấy'], ['tired', 'mệt']], concept: 'Cách dùng is để nói một người đang thế nào', simple: 'She đi với is. Is nối cô ấy với trạng thái mệt.', example: 'She is happy. → Cô ấy vui.' },
        ['She đi với is.', 'Am đi với I.', 'Are đi với you, we hoặc they.'], 'Đọc cụm She is thành một nhịp để dễ nhớ.'],
      ['Từ nào cho biết việc làm trong “I open the door”?', ['I', 'the door', 'open'], 2,
        { translation: 'I open the door. → Tôi mở cửa.', words: [['open', 'mở'], ['door', 'cửa']], concept: 'Từ chỉ việc làm, gọi là động từ (verb)', simple: 'Hỏi “tôi làm gì?”. Tôi mở cửa. Từ nói về việc làm là open.', example: 'I read. → Tôi đọc.' },
        ['I chỉ người làm.', 'The door gọi tên đồ vật.', 'Open chỉ hành động mở.'], 'Hỏi “làm gì?” để tìm động từ chỉ hành động.'],
    ],
  },
  {
    id: 'adjectives', title: 'Tính từ · Mô tả người và vật', goal: 'Dùng từ như new, small và happy để nêu đặc điểm.',
    notes: [
      ['Thứ đó như thế nào?', 'Một cái túi có thể nhỏ hoặc mới. Các từ nói về đặc điểm gọi là tính từ (adjective).'],
      ['Hai vị trí dễ gặp', 'A small bag đặt small trước tên đồ vật. The bag is small đặt small sau is để nói đặc điểm của túi.'],
    ],
    examples: [['This is a new bag.', 'Đây là một cái túi mới.'], ['The box is small.', 'Cái hộp nhỏ.']],
    checks: [
      ['Điền “mới” vào chỗ trống. This is a _____ bag.', ['open', 'quickly', 'new'], 2,
        { translation: 'This is a new bag. → Đây là một cái túi mới.', words: [['new', 'mới'], ['bag', 'cái túi']], concept: 'Từ mô tả đặc điểm, gọi là tính từ (adjective)', simple: 'Bag là cái túi. Đặt new trước bag để nói đó là cái túi mới.', example: 'a new pen → một cây bút mới' },
        ['Open ở đây sẽ cho nghĩa đang mở, khác nghĩa cần tìm.', 'Quickly mô tả cách làm việc gì.', 'New mô tả cái túi và có nghĩa là mới.'], 'Trong a + _____ + đồ vật, chỗ trống có thể là một từ chỉ đặc điểm.'],
    ],
  },
  {
    id: 'adverbs', title: 'Trạng từ · Làm như thế nào?', goal: 'Phân biệt từ mô tả đồ vật với từ mô tả cách làm.',
    notes: [
      ['Cách làm', 'Trong “cô ấy nói chậm”, chậm cho biết cô ấy nói như thế nào. Từ như slowly gọi là trạng từ (adverb).'],
      ['So sánh slow và slowly', 'A slow bus mô tả xe buýt. The bus moves slowly mô tả cách xe di chuyển. Nhiều từ chỉ cách làm kết thúc bằng ly, nhưng có ngoại lệ như fast.'],
    ],
    examples: [['She speaks slowly.', 'Cô ấy nói chậm.'], ['He runs fast.', 'Anh ấy chạy nhanh.']],
    checks: [
      ['Chọn từ cho nghĩa “Anh ấy đọc chậm”. He reads _____.', ['slow', 'slowly', 'book'], 1,
        { translation: 'He reads slowly. → Anh ấy đọc chậm.', words: [['reads', 'đọc'], ['slowly', 'một cách chậm rãi']], concept: 'Từ mô tả cách làm, gọi là trạng từ (adverb)', simple: 'Ta đã biết việc làm là đọc. Slowly bổ sung cách anh ấy đọc.', example: 'She walks slowly. → Cô ấy đi chậm.' },
        ['Slow thường mô tả người hoặc vật trong các mẫu đã học.', 'Slowly mô tả cách đọc.', 'Book là tên đồ vật.'], 'Hỏi “làm như thế nào?” Nếu trả lời chậm rãi, dùng slowly trong mẫu này.'],
    ],
  },
  {
    id: 'articles', title: 'Mạo từ · A, an và the', goal: 'Chọn từ đứng trước tên một đồ vật trong những câu đơn giản.',
    notes: [
      ['Nhắc lần đầu', 'A hoặc an đứng trước một tên đếm được khi người nghe chưa biết cụ thể là cái nào.'],
      ['Chọn theo âm đầu', 'A pen bắt đầu từ âm phụ âm. An apple bắt đầu từ âm nguyên âm. Hãy nghe âm đầu thay vì chỉ nhìn chữ.'],
      ['Thứ đã rõ', 'Dùng the để nói đến người hoặc vật hai bên đã biết. I have a bag. The bag is blue.'],
    ],
    examples: [['I eat an apple.', 'Tôi ăn một quả táo.'], ['I have a pen. The pen is blue.', 'Tôi có một cây bút. Cây bút đó màu xanh dương.']],
    checks: [
      ['Điền từ trong lần đầu nói tới một quả táo. I have _____ apple.', ['the', 'a', 'an'], 2,
        { translation: 'I have an apple. → Tôi có một quả táo.', words: [['have', 'có'], ['apple', 'quả táo']], concept: 'Cách chọn a hoặc an theo âm', simple: 'Apple bắt đầu bằng âm nguyên âm /æ/, vì vậy dùng an trước apple trong câu này.', example: 'an egg → một quả trứng' },
        ['The thường chỉ quả táo đã biết.', 'A dùng trước âm phụ âm.', 'An phù hợp với âm đầu của apple.'], 'Thử đọc từ ngay sau chỗ trống và chú ý âm đầu.'],
    ],
  },
  {
    id: 'prepositions', title: 'Giới từ · Nơi chốn và thời điểm', goal: 'Nói một vật ở đâu và một việc xảy ra lúc nào.',
    notes: [
      ['Chỉ vị trí', 'In là ở trong, on là ở trên bề mặt, under là ở bên dưới. Những từ này nối đồ vật với vị trí, gọi là giới từ (preposition).'],
      ['Chỉ thời gian', 'Nhớ theo cụm at 8 o’clock (lúc 8 giờ), on Monday (vào thứ Hai), in May (vào tháng Năm).'],
    ],
    examples: [['The pen is in the bag.', 'Cây bút ở trong túi.'], ['We meet at eight.', 'Chúng tôi gặp nhau lúc tám giờ.']],
    checks: [
      ['Điền từ cho nghĩa “Cây bút ở dưới bàn”. The pen is _____ the table.', ['under', 'on', 'in'], 0,
        { translation: 'The pen is under the table. → Cây bút ở dưới bàn.', words: [['under', 'ở bên dưới'], ['table', 'cái bàn']], concept: 'Từ nối đồ vật với vị trí, gọi là giới từ (preposition)', simple: 'Under cho biết cây bút ở thấp hơn mặt bàn, phía bên dưới.', example: 'The bag is under the chair. → Cái túi ở dưới ghế.' },
        ['Under cho vị trí bên dưới.', 'On nghĩa là trên bề mặt.', 'In là ở bên trong.'], 'Hình dung vị trí của vật trước khi chọn in, on hay under.'],
    ],
  },
  {
    id: 'tenses', title: 'Các thì quan trọng · Khi nào việc xảy ra?', goal: 'Phân biệt việc thường làm, đang làm, đã làm và sẽ làm.',
    notes: [
      ['Việc thường làm', 'I work every day diễn tả thói quen. Đây là hiện tại đơn (present simple). Với she, nói She works.'],
      ['Việc đang diễn ra', 'I am working now nói việc đang diễn ra. Đây là hiện tại tiếp diễn (present continuous). Cách ghép là am/is/are + động từ thêm ing.'],
      ['Việc đã qua', 'I worked yesterday nói việc đã làm hôm qua. Đây là quá khứ đơn (past simple). Nhiều từ thêm ed, nhưng có từ đổi khác, như go → went.'],
      ['Việc sẽ xảy ra', 'I will work tomorrow nói việc sẽ làm ngày mai. Mẫu dễ nhớ là will + động từ nguyên dạng.'],
    ],
    examples: [['He walks every day.', 'Anh ấy đi bộ mỗi ngày.'], ['He is walking now.', 'Anh ấy đang đi bộ.'], ['He walked yesterday.', 'Anh ấy đã đi bộ hôm qua.'], ['He will walk tomorrow.', 'Anh ấy sẽ đi bộ ngày mai.']],
    checks: [
      ['Đọc “yesterday” rồi chọn động từ. I _____ yesterday.', ['walked', 'will walk', 'am walking'], 0,
        { translation: 'I walked yesterday. → Tôi đã đi bộ hôm qua.', words: [['yesterday', 'hôm qua'], ['walked', 'đã đi bộ']], concept: 'Việc đã xảy ra, gọi là quá khứ đơn (past simple)', simple: 'Hôm qua đã qua. Walk là đi bộ. Thêm ed để nói hành động đi bộ đã xảy ra.', example: 'I worked yesterday. → Tôi đã làm việc hôm qua.' },
        ['Walked đúng với mốc hôm qua.', 'Will walk nói về tương lai.', 'Am walking nói việc đang diễn ra.'], 'Nhìn yesterday hoặc last week để nhận biết mốc đã qua.'],
      ['Câu nào nói “Tôi đang đọc bây giờ”?', ['I read every day.', 'I read yesterday.', 'I am reading now.'], 2,
        { translation: 'I am reading now. → Tôi đang đọc bây giờ.', words: [['now', 'bây giờ'], ['reading', 'đọc trong cấu trúc am reading']], concept: 'Việc đang làm, gọi là hiện tại tiếp diễn (present continuous)', simple: 'Now nghĩa là bây giờ. I am + reading diễn tả bạn đang thực hiện việc đọc.', example: 'I am eating now. → Tôi đang ăn.' },
        ['Every day nói thói quen.', 'Yesterday nói việc hôm qua.', 'Am reading đi với now.'], 'Khi nghe right now, thử nghĩ đến am/is/are + động từ thêm ing.'],
      ['Chọn câu nói “Chúng tôi sẽ làm việc ngày mai”.', ['We worked yesterday.', 'We will work tomorrow.', 'We are working now.'], 1,
        { translation: 'We will work tomorrow. → Chúng tôi sẽ làm việc ngày mai.', words: [['tomorrow', 'ngày mai'], ['will work', 'sẽ làm việc']], concept: 'Nói về việc sắp tới với will', simple: 'Tomorrow là thời gian chưa đến. Dùng will trước từ chỉ việc làm rồi giữ work ở dạng gốc.', example: 'I will call tomorrow. → Tôi sẽ gọi ngày mai.' },
        ['Worked yesterday nói việc đã qua.', 'Will work nói việc sẽ làm.', 'Are working now nói việc đang làm.'], 'Sau will, giữ động từ ở dạng gốc trong các câu đang học.'],
    ],
  },
  {
    id: 'questions', title: 'Câu hỏi cơ bản', goal: 'Hỏi có hay không, hỏi cái gì, ở đâu và lúc nào.',
    notes: [
      ['Hỏi có hoặc không', 'You are ready là câu kể. Are you ready? là câu hỏi. Đưa are lên trước you.'],
      ['Hỏi về một việc', 'Do you work here? hỏi bạn có làm việc ở đây không. Do giúp tạo câu hỏi khi động từ chính là work.'],
      ['Hỏi thông tin', 'What hỏi cái gì, where hỏi ở đâu, when hỏi lúc nào, who hỏi ai. Nhớ nghe từ đầu tiên.'],
    ],
    examples: [['Are you ready?', 'Bạn sẵn sàng chưa?'], ['Where is the bus?', 'Xe buýt ở đâu?'], ['When do we meet?', 'Khi nào chúng ta gặp nhau?']],
    checks: [
      ['Chọn từ để hỏi xe buýt ở đâu. _____ is the bus?', ['When', 'Where', 'Who'], 1,
        { translation: 'Where is the bus? → Xe buýt ở đâu?', words: [['where', 'ở đâu'], ['bus', 'xe buýt']], concept: 'Hỏi địa điểm', simple: 'Bạn cần biết vị trí của xe, vì thế bắt đầu bằng Where.', example: 'Where is my bag? → Cái túi của tôi ở đâu?' },
        ['When hỏi thời gian.', 'Where hỏi địa điểm.', 'Who hỏi người.'], 'Where thường dẫn đến câu trả lời có vị trí như in the room.'],
    ],
  },
  {
    id: 'short-reading', title: 'Đọc câu ngắn', goal: 'Đọc từng cụm và tìm đúng một thông tin trong câu.',
    notes: [
      ['Tách cụm', 'Trong Lan works / at home / on Monday, ta có ba cụm: Lan làm việc / ở nhà / vào thứ Hai.'],
      ['Tìm điều câu hỏi cần', 'Nếu hỏi ở đâu, tìm cụm nơi chốn. Nếu hỏi lúc nào, tìm giờ hoặc ngày.'],
      ['Chỉ dùng chi tiết đã có', 'Câu Lan works at home on Monday chưa cho biết cô ấy làm gì vào thứ Ba.'],
    ],
    examples: [['The shop opens at eight.', 'Cửa hàng mở cửa lúc tám giờ.'], ['Lan works at home on Monday.', 'Lan làm việc ở nhà vào thứ Hai.']],
    checks: [
      ['Đọc “The shop opens at eight.” Cửa hàng mở lúc mấy giờ?', ['Tám giờ', 'Chín giờ', 'Thứ Hai'], 0,
        { translation: 'The shop opens at eight. → Cửa hàng mở cửa lúc tám giờ.', words: [['shop', 'cửa hàng'], ['opens', 'mở cửa'], ['at eight', 'lúc tám giờ']], concept: 'Tìm mốc giờ trong câu', simple: 'Phần at eight trực tiếp cho biết giờ. Eight là số tám.', example: 'We meet at six. → Chúng ta gặp lúc sáu giờ.' },
        ['At eight nghĩa là lúc tám giờ.', 'Chín là nine, câu không nói nine.', 'Thứ Hai là một ngày, câu đang nêu giờ.'], 'Đọc câu hỏi trước rồi tìm cụm có số hoặc tên ngày.'],
    ],
  },
  {
    id: 'toeic-bridge', title: 'Xây nền TOEIC', goal: 'Nhận ra hai kỹ năng và tập đọc dấu hiệu trước khi luyện đề.',
    notes: [
      ['Phần nghe và phần đọc', 'Listening là nghe tiếng Anh rồi chọn đáp án. Reading là đọc câu hoặc văn bản rồi chọn đáp án.'],
      ['Ba dấu hiệu dễ dùng', 'Who hỏi người. When hỏi thời gian. A/an trước chỗ trống gợi ý tên một người hoặc vật.'],
      ['Học theo lượt ngắn', 'Bắt đầu bằng câu dễ. Sau khi kiểm tra, đọc lời giải và thử một ví dụ tương tự rồi chuyển bài.'],
    ],
    examples: [['When is the meeting? At nine.', 'Cuộc họp lúc nào? Lúc chín giờ.'], ['I have a ticket.', 'Tôi có một tấm vé.']],
    checks: [
      ['Bạn nghe “When is the meeting?”. Câu đáp nào phù hợp?', ['In the office.', 'At nine.', 'Mai.'], 1,
        { translation: 'When is the meeting? At nine. → Cuộc họp lúc nào? Lúc chín giờ.', words: [['when', 'khi nào'], ['meeting', 'cuộc họp'], ['at nine', 'lúc chín giờ']], concept: 'Nhận diện câu hỏi thời gian trong bài nghe', simple: 'When yêu cầu một mốc thời gian. At nine đưa ra giờ, đúng thông tin cần tìm.', example: 'When do we leave? At five. → Khi nào chúng ta đi? Lúc năm giờ.' },
        ['In the office chỉ nơi chốn.', 'At nine chỉ thời gian.', 'Mai là tên một người.'], 'Nghe When ở đầu câu, rồi tìm giờ, ngày hoặc một khoảng thời gian.'],
    ],
  },
]

export const foundationLessons = drafts.map(({ checks, ...lesson }) => ({
  ...lesson,
  completionId: 'foundation-' + lesson.id,
  questions: checks.map(([prompt, options, answer, explanation, reasons, tip], index) =>
    beginnerQuestion('foundation-' + lesson.id + '-' + (index + 1), 'foundation', lesson.title, prompt, options, answer, explanation, reasons, tip)),
}))

export const foundationQuestions = foundationLessons.flatMap(lesson => lesson.questions)
