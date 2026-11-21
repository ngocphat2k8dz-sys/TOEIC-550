import type { Question } from '../types'

interface GrammarChallenge {
  prompt: string
  options: string[]
  answer: number
  reasons: string[]
  keywords: string[]
  tip: string
}

interface LessonContent {
  id: string
  topic: string
  title: string
  summary: string
  formulas: string[]
  examples: { english: string; vietnamese: string }[]
  indicators: string[]
  mistakes: string[]
  challenge: GrammarChallenge
}

const content: LessonContent[] = [
  {
    id: 'grammar-parts-of-speech', topic: 'Parts of Speech', title: 'Từ loại trong câu',
    summary: 'Vị trí của từ giúp bạn quyết định chọn danh từ, động từ, tính từ hay trạng từ. Hãy đọc cụm từ quanh chỗ trống trước khi dịch cả câu.',
    formulas: ['Mạo từ + (tính từ) + danh từ', 'Chủ ngữ + động từ + (tân ngữ)', 'Động từ thường + trạng từ chỉ cách thức'],
    examples: [
      { english: 'The careful assistant checked the form.', vietnamese: 'Trợ lý cẩn thận đã kiểm tra biểu mẫu. Careful mô tả assistant.' },
      { english: 'The assistant checked the form carefully.', vietnamese: 'Trợ lý kiểm tra biểu mẫu một cách cẩn thận. Carefully mô tả hành động checked.' },
    ],
    indicators: ['Các lựa chọn có chung gốc, ví dụ inform, information, informative.', 'Mạo từ, tính từ sở hữu và danh từ đứng cạnh chỗ trống là những dấu hiệu quan trọng.'],
    mistakes: ['Chọn từ theo nghĩa tiếng Việt mà bỏ qua vị trí trong câu.', 'Giả định mọi từ đuôi -ly đều là trạng từ. Friendly thường là tính từ.'],
    challenge: {
      prompt: 'The guide includes _____ information about each bus route.',
      options: ['use', 'useful', 'usefully', 'usefulness'], answer: 1, keywords: ['includes', 'information'],
      reasons: ['Use là động từ hoặc danh từ, không phù hợp với cụm useful information.', 'Useful là tính từ bổ nghĩa cho danh từ information.', 'Usefully là trạng từ, không đứng trực tiếp để bổ nghĩa cho information.', 'Usefulness là danh từ chỉ tính hữu ích, không đi với information trong cấu trúc này.'],
      tip: 'Gạch chân danh từ ngay sau chỗ trống. Nếu chỗ trống mô tả danh từ đó, ưu tiên tính từ.',
    },
  },
  {
    id: 'grammar-noun', topic: 'Noun', title: 'Danh từ',
    summary: 'Danh từ gọi tên người, vật hoặc khái niệm. Dạng số ít, số nhiều và tính đếm được quyết định từ đứng trước danh từ.',
    formulas: ['a / an + danh từ đếm được số ít', 'many / several + danh từ đếm được số nhiều', 'much / a little + danh từ không đếm được'],
    examples: [{ english: 'Several applicants are waiting outside.', vietnamese: 'Một số ứng viên đang đợi bên ngoài.' }, { english: 'We need more information about the venue.', vietnamese: 'Chúng ta cần thêm thông tin về địa điểm.' }],
    indicators: ['Every và each thường đi với danh từ đếm được số ít.', 'Sau several, many hoặc a few phải kiểm tra dạng số nhiều.'],
    mistakes: ['Viết informations hay equipments. Hai danh từ này thường không đếm được.', 'Thêm a hoặc an trước một danh từ số nhiều.'],
    challenge: {
      prompt: 'Several _____ have requested more time to review the contract.',
      options: ['vendor', 'vend', 'vendors', 'vended'], answer: 2, keywords: ['Several', 'have'],
      reasons: ['Vendor là danh từ số ít, không theo sau several.', 'Vend là động từ chỉ việc bán hàng.', 'Vendors là danh từ số nhiều phù hợp với several và have.', 'Vended là dạng quá khứ hoặc phân từ của vend.'],
      tip: 'Several đứng trước một danh từ đếm được số nhiều, nên kiểm tra đuôi -s hoặc dạng số nhiều bất quy tắc.',
    },
  },
  {
    id: 'grammar-verb', topic: 'Verb', title: 'Động từ',
    summary: 'Một mệnh đề thường cần động từ chính. Dạng động từ phụ thuộc vào chủ ngữ và những từ đứng trước nó, chẳng hạn trợ động từ hoặc động từ khuyết thiếu.',
    formulas: ['Chủ ngữ + động từ chính + (tân ngữ)', 'can / must / should + động từ nguyên mẫu', 'do / does / did + động từ nguyên mẫu'],
    examples: [{ english: 'You must sign the form today.', vietnamese: 'Bạn phải ký biểu mẫu hôm nay.' }, { english: 'Did the courier collect the package?', vietnamese: 'Nhân viên giao nhận đã lấy kiện hàng chưa?' }],
    indicators: ['Tìm can, may, should, will hoặc must ngay trước chỗ trống.', 'Sau did, dùng động từ nguyên mẫu kể cả khi hành động xảy ra trong quá khứ.'],
    mistakes: ['Thêm to sau can hoặc must.', 'Dùng chữ s cho động từ chính sau does hoặc can.'],
    challenge: {
      prompt: 'Staff members may _____ the training room after lunch.',
      options: ['reserves', 'reserved', 'to reserve', 'reserve'], answer: 3, keywords: ['may', 'the training room'],
      reasons: ['Reserves là dạng hiện tại của ngôi thứ ba số ít, không theo sau may.', 'Reserved là dạng quá khứ hoặc phân từ.', 'To reserve có to, không phù hợp trực tiếp sau may.', 'Reserve là động từ nguyên mẫu không to, đúng sau may.'],
      tip: 'Đọc may reserve thành một cụm. Quy tắc này cũng áp dụng với can, should và must.',
    },
  },
  {
    id: 'grammar-adjective', topic: 'Adjective', title: 'Tính từ',
    summary: 'Tính từ mô tả danh từ hoặc nêu trạng thái của chủ ngữ sau các động từ nối như be, seem và remain.',
    formulas: ['Tính từ + danh từ', 'Chủ ngữ + be / seem / remain + tính từ'],
    examples: [{ english: 'Please use the available desks.', vietnamese: 'Vui lòng dùng các bàn còn trống.' }, { english: 'The desks are available today.', vietnamese: 'Hôm nay các bàn vẫn còn trống.' }],
    indicators: ['Chỗ trống ngay trước danh từ thường cần một từ mô tả danh từ.', 'Sau remain, look hoặc seem, xác định xem từ cần điền có mô tả trạng thái hay không.'],
    mistakes: ['Chọn trạng từ khi cần mô tả danh từ.', 'Thêm -s vào tính từ khi danh từ đi sau ở dạng số nhiều.'],
    challenge: {
      prompt: 'The instructions are _____ enough for new employees to follow.',
      options: ['clear', 'clearly', 'clarity', 'clearance'], answer: 0, keywords: ['instructions are', 'enough'],
      reasons: ['Clear là tính từ mô tả instructions sau are.', 'Clearly là trạng từ, không làm bổ ngữ trạng thái cho are ở đây.', 'Clarity là danh từ chỉ sự rõ ràng.', 'Clearance là danh từ nghĩa là sự thông qua, khoảng trống hoặc đợt thanh lý.'],
      tip: 'Cụm tính từ + enough thường biểu thị mức độ đủ để thực hiện hành động.',
    },
  },
  {
    id: 'grammar-adverb', topic: 'Adverb', title: 'Trạng từ',
    summary: 'Trạng từ thường cho biết cách thức, mức độ hoặc thời điểm của hành động. Trạng từ cũng có thể bổ nghĩa cho tính từ hoặc một trạng từ khác.',
    formulas: ['Động từ + (tân ngữ) + trạng từ chỉ cách thức', 'Trạng từ mức độ + tính từ', 'Chủ ngữ + trạng từ tần suất + động từ thường'],
    examples: [{ english: 'The technician answered promptly.', vietnamese: 'Kỹ thuật viên đã trả lời nhanh chóng.' }, { english: 'The instructions are extremely clear.', vietnamese: 'Hướng dẫn cực kỳ rõ ràng.' }],
    indicators: ['Sau tân ngữ, hỏi “hành động được thực hiện như thế nào?”.', 'Các từ very, highly, extremely thường đứng ngay trước tính từ.'],
    mistakes: ['Dùng careful khi cần carefully để mô tả hành động.', 'Nhầm hard nghĩa là chăm chỉ với hardly nghĩa là hầu như không.'],
    challenge: {
      prompt: 'The technician examined the damaged cable _____.',
      options: ['care', 'careful', 'carefulness', 'carefully'], answer: 3, keywords: ['examined', 'damaged cable'],
      reasons: ['Care là danh từ hoặc động từ, không chỉ cách thức kiểm tra ở vị trí này.', 'Careful là tính từ và không bổ nghĩa cho examined.', 'Carefulness là danh từ, không làm trạng ngữ theo cấu trúc câu.', 'Carefully là trạng từ mô tả cách kỹ thuật viên kiểm tra dây cáp.'],
      tip: 'Nếu câu đã đủ chủ ngữ, động từ và tân ngữ, từ bổ sung cách thức thường là trạng từ.',
    },
  },
  {
    id: 'grammar-tenses', topic: 'Tenses', title: 'Các thì thường gặp',
    summary: 'Chọn thì theo thời điểm và cách hành động liên hệ với hiện tại. Các câu TOEIC thường dùng lịch, thời hạn hoặc mốc hoàn thành để xác định thì.',
    formulas: ['Hiện tại đơn · S + V / V-s', 'Hiện tại tiếp diễn · S + am / is / are + V-ing', 'Quá khứ đơn · S + V-ed / V2', 'Hiện tại hoàn thành · S + have / has + V3', 'Tương lai đơn · S + will + V'],
    examples: [{ english: 'The store opened in May.', vietnamese: 'Cửa hàng mở cửa vào tháng Năm, một thời điểm đã qua.' }, { english: 'The store has been open since May.', vietnamese: 'Cửa hàng đã hoạt động từ tháng Năm đến nay.' }],
    indicators: ['Last week, yesterday và ago thường đi với quá khứ đơn.', 'Since và so far thường gợi ý hiện tại hoàn thành khi khoảng thời gian kéo dài đến hiện tại.'],
    mistakes: ['Dùng hiện tại hoàn thành với mốc thời gian đã kết thúc như yesterday.', 'Chọn thì trước khi đọc hết câu để tìm trạng ngữ chỉ thời gian.'],
    challenge: {
      prompt: 'The finance team _____ the revised budget yesterday.',
      options: ['approves', 'approved', 'has approved', 'will approve'], answer: 1, keywords: ['yesterday'],
      reasons: ['Approves diễn tả hiện tại hoặc thói quen, không khớp yesterday.', 'Approved là quá khứ đơn, phù hợp mốc thời gian đã qua yesterday.', 'Has approved là hiện tại hoàn thành và không đi với mốc yesterday trong câu này.', 'Will approve diễn tả tương lai.'],
      tip: 'Dò cụm chỉ thời gian trước. Yesterday đưa toàn bộ sự việc về quá khứ đơn.',
    },
  },
  {
    id: 'grammar-passive', topic: 'Passive Voice', title: 'Câu bị động',
    summary: 'Dùng thể bị động khi chủ ngữ là đối tượng nhận hành động. Động từ be mang thì, còn động từ chính ở dạng phân từ quá khứ.',
    formulas: ['Chủ ngữ nhận hành động + be theo thì + V3', 'modal + be + V3', 'have / has + been + V3'],
    examples: [{ english: 'The invoices were sent on Monday.', vietnamese: 'Các hóa đơn đã được gửi vào thứ Hai.' }, { english: 'The form must be signed today.', vietnamese: 'Biểu mẫu phải được ký hôm nay.' }],
    indicators: ['Chủ ngữ là hóa đơn, hàng hóa hoặc biểu mẫu và không tự thực hiện hành động.', 'Cụm by + người thực hiện có thể xuất hiện sau động từ.'],
    mistakes: ['Thiếu be sau động từ khuyết thiếu.', 'Dùng V-ing sau be dù chủ ngữ là đối tượng được tác động.'],
    challenge: {
      prompt: 'The replacement parts will _____ to your office tomorrow.',
      options: ['deliver', 'delivering', 'be delivered', 'have delivering'], answer: 2, keywords: ['replacement parts', 'will', 'tomorrow'],
      reasons: ['Deliver sau will hợp dạng chủ động nhưng linh kiện tự giao hàng thì không hợp nghĩa.', 'Delivering không thể theo trực tiếp sau will.', 'Be delivered tạo thể bị động will be delivered, nghĩa là sẽ được giao.', 'Have delivering không tạo cấu trúc đúng sau will.'],
      tip: 'Hỏi “ai giao hàng?”. Khi chủ ngữ là món hàng được giao, chọn will be + V3.',
    },
  },
  {
    id: 'grammar-gerund', topic: 'Gerund & Infinitive', title: 'Danh động từ và động từ nguyên mẫu',
    summary: 'Một số động từ đi với V-ing, một số khác đi với to + V. Học các cụm thường gặp sẽ nhanh và chính xác hơn khi dịch từng từ.',
    formulas: ['avoid / enjoy / consider + V-ing', 'decide / plan / agree + to + V', 'giới từ + danh từ hoặc V-ing'],
    examples: [{ english: 'We agreed to extend the deadline.', vietnamese: 'Chúng tôi đã đồng ý gia hạn thời hạn.' }, { english: 'Please avoid sending duplicate files.', vietnamese: 'Vui lòng tránh gửi các tệp trùng lặp.' }],
    indicators: ['Đọc động từ ngay trước chỗ trống và nhớ mẫu câu của động từ đó.', 'Trong look forward to và be used to, to là giới từ và theo sau là V-ing hoặc danh từ.'],
    mistakes: ['Dùng to + V sau avoid.', 'Cho rằng bất kỳ to nào cũng phải đi cùng động từ nguyên mẫu.'],
    challenge: {
      prompt: 'The café is considering _____ its opening hours on Saturdays.',
      options: ['extend', 'to extend', 'extends', 'extending'], answer: 3, keywords: ['is considering', 'its opening hours'],
      reasons: ['Extend là động từ nguyên mẫu không to, không dùng theo mẫu consider + V-ing.', 'To extend không đứng trực tiếp sau consider trong câu này.', 'Extends là động từ chia ngôi và không thể làm bổ ngữ cho considering.', 'Extending là danh động từ đúng theo mẫu consider + V-ing.'],
      tip: 'Ghi nhớ theo cụm consider doing something thay vì học consider riêng lẻ.',
    },
  },
  {
    id: 'grammar-prepositions', topic: 'Prepositions', title: 'Giới từ',
    summary: 'Giới từ nối danh từ hoặc cụm danh từ với phần còn lại của câu. Cần phân biệt mốc thời gian, khoảng thời gian và hạn chót.',
    formulas: ['at + giờ', 'on + ngày / ngày cụ thể', 'in + tháng / năm / mùa', 'by + hạn chót', 'until + mốc kết thúc'],
    examples: [{ english: 'Send the file by Friday.', vietnamese: 'Gửi tệp chậm nhất vào thứ Sáu.' }, { english: 'The shop is open until eight.', vietnamese: 'Cửa hàng mở cửa đến tám giờ.' }],
    indicators: ['Submit hoặc send đi với hạn cuối thường gợi ý by.', 'Stay, remain hoặc be open có thể đi với until để nói trạng thái kéo dài tới một mốc.'],
    mistakes: ['Dùng in với ngày cụ thể như in Monday.', 'Dùng until để diễn tả hạn chót của một hành động hoàn thành một lần.'],
    challenge: {
      prompt: 'Completed applications must be received _____ 5 p.m. on Tuesday.',
      options: ['by', 'until', 'during', 'between'], answer: 0, keywords: ['must be received', '5 p.m.'],
      reasons: ['By 5 p.m. đặt hạn cuối là 5 giờ chiều.', 'Until nói về trạng thái hoặc hoạt động kéo dài liên tục, còn việc một đơn được nhận là một sự kiện.', 'During cần một khoảng thời gian hoặc sự kiện, không phải giờ cụ thể.', 'Between cần hai mốc kết nối bằng and.'],
      tip: 'Với hồ sơ cần đến nơi chậm nhất ở một giờ cụ thể, dùng by.',
    },
  },
  {
    id: 'grammar-conjunctions', topic: 'Conjunctions', title: 'Liên từ',
    summary: 'Liên từ nối từ, cụm từ hoặc mệnh đề. Hãy xác định quan hệ giữa hai ý và kiểm tra sau chỗ trống có chủ ngữ lẫn động từ không.',
    formulas: ['because + S + V · nguyên nhân', 'although + S + V · nhượng bộ', 'and / but / or + thành phần song song', 'because of / despite + danh từ hoặc V-ing'],
    examples: [{ english: 'The delivery was late because the roads were closed.', vietnamese: 'Đơn giao bị trễ vì các tuyến đường bị đóng.' }, { english: 'Although the room is small, it seats ten people.', vietnamese: 'Dù phòng nhỏ, phòng vẫn có chỗ cho mười người.' }],
    indicators: ['Nếu sau chỗ trống có chủ ngữ và động từ, cân nhắc liên từ dẫn mệnh đề.', 'Nếu hai ý đối lập, although hoặc but có thể phù hợp tùy cấu trúc.'],
    mistakes: ['Dùng because of trước một mệnh đề hoàn chỉnh.', 'Viết although và but để nối cùng một cặp mệnh đề.'],
    challenge: {
      prompt: '_____ the warehouse is closed today, we cannot pick up the boxes.',
      options: ['Despite', 'Because', 'Because of', 'And'], answer: 1, keywords: ['the warehouse is closed', 'cannot pick up'],
      reasons: ['Despite cần cụm danh từ hoặc V-ing, không đi trực tiếp với mệnh đề ở đây.', 'Because dẫn mệnh đề chỉ nguyên nhân vì sao không thể lấy các hộp hàng.', 'Because of cần cụm danh từ, không đi trực tiếp với the warehouse is closed.', 'And không mở đầu mệnh đề phụ chỉ nguyên nhân trước dấu phẩy trong câu này.'],
      tip: 'Nhìn cả cụm the warehouse is closed. Có cả chủ ngữ và động từ nên dùng because.',
    },
  },
  {
    id: 'grammar-relative', topic: 'Relative Clauses', title: 'Mệnh đề quan hệ',
    summary: 'Mệnh đề quan hệ bổ sung thông tin về danh từ đứng trước. Chọn từ quan hệ dựa trên danh từ đó và vai trò của phần còn thiếu.',
    formulas: ['người + who + động từ', 'vật + which + động từ', 'danh từ + whose + danh từ + động từ', 'nơi chốn + where + S + V'],
    examples: [{ english: 'The applicant who called yesterday is here.', vietnamese: 'Ứng viên đã gọi hôm qua đang ở đây.' }, { english: 'This is the hall where we hold the seminar.', vietnamese: 'Đây là hội trường nơi chúng tôi tổ chức hội thảo.' }],
    indicators: ['Nếu chỗ trống theo sau danh từ chỉ người và ngay trước động từ, who thường phù hợp.', 'Sau whose có một danh từ chỉ vật hoặc người thuộc về danh từ đứng trước.'],
    mistakes: ['Dùng where để làm chủ ngữ của động từ.', 'Dùng that sau dấu phẩy trong mệnh đề quan hệ không xác định.'],
    challenge: {
      prompt: 'The employee _____ prepared the sales report will present it on Monday.',
      options: ['where', 'whose', 'who', 'which'], answer: 2, keywords: ['employee', 'prepared'],
      reasons: ['Where bổ sung thông tin về nơi chốn, không làm chủ ngữ cho prepared.', 'Whose chỉ sở hữu và cần một danh từ theo sau.', 'Who thay thế người là the employee và làm chủ ngữ của prepared.', 'Which thường thay thế một vật hoặc sự việc.'],
      tip: 'Đọc employee + prepared. Từ cần điền phải thay thế một người, nên dùng who.',
    },
  },
  {
    id: 'grammar-comparisons', topic: 'Comparisons', title: 'So sánh',
    summary: 'Xác định câu so sánh hai đối tượng, một đối tượng với cả nhóm, hay hai đối tượng bằng nhau.',
    formulas: ['tính từ ngắn + -er + than', 'more + tính từ dài + than', 'the + tính từ ngắn -est / most + tính từ dài', 'as + tính từ + as'],
    examples: [{ english: 'The new printer is faster than the old one.', vietnamese: 'Máy in mới nhanh hơn máy cũ.' }, { english: 'This is the most affordable hotel in the area.', vietnamese: 'Đây là khách sạn có giá phải chăng nhất trong khu vực.' }],
    indicators: ['Than thường đi sau dạng so sánh hơn.', 'The kết hợp với in the area, in the group hoặc of the three thường gợi ý so sánh nhất.'],
    mistakes: ['Dùng more faster, kết hợp đồng thời hai cách tạo so sánh hơn.', 'Quên dạng bất quy tắc good → better → best.'],
    challenge: {
      prompt: 'The new shipping option is _____ than the previous one.',
      options: ['fast', 'fastest', 'most fast', 'faster'], answer: 3, keywords: ['new shipping option', 'than'],
      reasons: ['Fast là tính từ gốc và không tạo so sánh hơn với than.', 'Fastest là so sánh nhất và không phù hợp với than.', 'Most fast dùng sai cấu trúc so sánh ở đây.', 'Faster là dạng so sánh hơn của fast và kết hợp đúng với than.'],
      tip: 'Than là dấu hiệu trực tiếp. Với fast chỉ có một âm tiết, thêm -er.',
    },
  },
  {
    id: 'grammar-conditionals', topic: 'Conditionals', title: 'Câu điều kiện',
    summary: 'Mệnh đề if đưa ra điều kiện. Câu loại 1 nói về khả năng thực tế trong tương lai, loại 2 nói về giả định ít thực tế, và loại 3 giả định về quá khứ đã qua.',
    formulas: ['Loại 0 · If + hiện tại đơn, hiện tại đơn', 'Loại 1 · If + hiện tại đơn, will + V', 'Loại 2 · If + quá khứ đơn, would + V', 'Loại 3 · If + had + V3, would have + V3'],
    examples: [{ english: 'If it rains, we will move the event indoors.', vietnamese: 'Nếu trời mưa, chúng tôi sẽ chuyển sự kiện vào trong nhà.' }, { english: 'If we had a larger room, we would invite more guests.', vietnamese: 'Nếu có phòng lớn hơn, chúng tôi sẽ mời thêm khách.' }],
    indicators: ['Will trong mệnh đề kết quả thường gợi ý câu điều kiện loại 1.', 'Unless mang nghĩa if ... not trong nhiều câu thông báo và chính sách.'],
    mistakes: ['Đặt will trong mệnh đề if của câu điều kiện loại 1 thông thường.', 'Thêm not sau unless khi nghĩa đã phủ định.'],
    challenge: {
      prompt: 'If the supplier _____ the samples today, we will review them tomorrow.',
      options: ['sends', 'will send', 'had sent', 'sending'], answer: 0, keywords: ['If', 'we will review'],
      reasons: ['Sends là hiện tại đơn với chủ ngữ supplier trong câu điều kiện loại 1.', 'Will send không dùng trong mệnh đề if của mẫu loại 1 thông thường.', 'Had sent diễn tả giả định quá khứ, không khớp mệnh đề will review và today.', 'Sending thiếu động từ chia thì cho mệnh đề if.'],
      tip: 'Với kết quả có will và khả năng có thật, dùng hiện tại đơn sau if.',
    },
  },
  {
    id: 'grammar-agreement', topic: 'Subject–Verb Agreement', title: 'Hòa hợp chủ ngữ và động từ',
    summary: 'Động từ hòa hợp với chủ ngữ chính. Các cụm giới từ như of the rooms hoặc with the files có thể chen giữa và làm bạn chọn nhầm.',
    formulas: ['Chủ ngữ số ít + is / has / V-s', 'Chủ ngữ số nhiều + are / have / V nguyên mẫu', 'each / every + danh từ số ít + động từ số ít'],
    examples: [{ english: 'The list of attendees is on the desk.', vietnamese: 'Danh sách người tham dự ở trên bàn. Chủ ngữ chính là list.' }, { english: 'The attendees are waiting in the hall.', vietnamese: 'Những người tham dự đang đợi ở hội trường.' }],
    indicators: ['Tìm danh từ đứng trước cụm of khi cụm đó chỉ bổ nghĩa cho chủ ngữ.', 'Each, every và everyone thường dùng với động từ số ít.'],
    mistakes: ['Chia động từ theo danh từ gần nhất dù danh từ đó nằm trong cụm giới từ.', 'Thấy danh từ có -s rồi mặc định nó luôn là chủ ngữ số nhiều.'],
    challenge: {
      prompt: 'The list of available seats _____ on the registration desk now.',
      options: ['are', 'is', 'were', 'be'], answer: 1, keywords: ['The list', 'of available seats', 'now'],
      reasons: ['Are phù hợp với chủ ngữ số nhiều, nhưng seats nằm trong cụm bổ nghĩa.', 'Is hòa hợp với chủ ngữ số ít the list và diễn tả hiện tại với now.', 'Were sai cả số của chủ ngữ và thời điểm now.', 'Be là dạng nguyên mẫu và câu không có trợ động từ để đi trước nó.'],
      tip: 'Che cụm of available seats rồi đọc lại câu rút gọn “The list is on the registration desk.”',
    },
  },
]

export const grammarLessons = content.map(({ challenge, ...lesson }) => {
  const question: Question = {
    id: `${lesson.id}-quiz`,
    part: 5,
    topic: lesson.topic,
    prompt: challenge.prompt,
    options: challenge.options,
    answer: challenge.answer,
    rationale: challenge.reasons[challenge.answer],
    optionReasons: challenge.reasons,
    keywords: challenge.keywords,
    grammar: lesson.formulas[0],
    tip: challenge.tip,
  }

  return { ...lesson, questions: [question] }
})

export const grammarQuestions = grammarLessons.flatMap(lesson => lesson.questions)
