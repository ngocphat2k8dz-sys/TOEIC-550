import type { Question } from '../types'

type AudioPart = Extract<Question['part'], 1 | 2 | 3 | 4>
type AnswerSet = {
  options: string[]
  answer: number
  optionReasons: string[]
  tip: string
  keywords: string[]
}

function spokenOptions(options: string[]) {
  return options.map((option, index) => `${'ABCD'[index]}. ${option}`).join('\n')
}

function makeQuestion(
  part: AudioPart,
  number: number,
  topic: string,
  prompt: string,
  transcript: string,
  answers: AnswerSet,
  audioNumber = number,
): Question {
  return {
    id: `p${part}-${number}`,
    part,
    topic,
    prompt,
    transcript,
    audio: `/listening/p${part}-${audioNumber}.mp3`,
    ...answers,
    rationale: answers.optionReasons[answers.answer],
  }
}

function response(number: number, topic: string, utterance: string, answers: AnswerSet) {
  return makeQuestion(
    2,
    number,
    topic,
    'Nghe câu hỏi hoặc lời nói, rồi chọn phản hồi phù hợp nhất.',
    `${utterance}\n${spokenOptions(answers.options)}`,
    answers,
  )
}

const responses = [
  response(1, 'Câu hỏi Where', 'Where can I pick up my visitor badge?', {
    options: ['It expires at six.', 'At the front desk.', 'I visited on Friday.'],
    answer: 1,
    keywords: ['Where', 'pick up', 'visitor badge', 'front desk'],
    optionReasons: [
      'Nêu giờ thẻ hết hạn. Câu hỏi yêu cầu nơi nhận thẻ.',
      'At the front desk (tại quầy lễ tân) đưa ra đúng địa điểm nhận thẻ khách.',
      'Visited gần âm với visitor. Câu này nói về một chuyến thăm trong quá khứ.',
    ],
    tip: 'Nghe Where ở đầu câu và dự đoán cụm chỉ nơi chốn.',
  }),
  response(2, 'Câu hỏi When', 'When will the printer be repaired?', {
    options: ['By Thursday morning.', 'On the second floor.', 'It prints in color.'],
    answer: 0,
    keywords: ['When', 'be repaired', 'By Thursday morning'],
    optionReasons: [
      'By Thursday morning nghĩa là chậm nhất vào sáng thứ Năm, phù hợp để báo thời điểm máy sẽ được sửa.',
      'On the second floor là một địa điểm, phù hợp với câu hỏi Where.',
      'It prints in color mô tả chức năng in màu, không nêu thời gian sửa.',
    ],
    tip: 'Với When, chú ý mốc giờ, ngày và cụm by + thời điểm.',
  }),
  response(3, 'Câu hỏi Who', 'Who is presenting the sales figures this afternoon?', {
    options: ['About forty percent.', 'In the small meeting room.', 'Daniel from the finance team.'],
    answer: 2,
    keywords: ['Who', 'presenting', 'Daniel'],
    optionReasons: [
      'About forty percent là số liệu bán hàng giả định. Câu hỏi cần tên người trình bày.',
      'In the small meeting room là nơi diễn ra buổi trình bày.',
      'Daniel from the finance team xác định người trình bày là Daniel bên tài chính.',
    ],
    tip: 'Tách từ hỏi Who khỏi các từ chỉ chủ đề như sales figures để nhận ra đáp án phải là người.',
  }),
  response(4, 'Câu hỏi Why', 'Why was the delivery delayed?', {
    options: ['Three boxes of paper.', 'The driver got stuck in traffic.', 'At the side entrance.'],
    answer: 1,
    keywords: ['Why', 'delayed', 'stuck in traffic'],
    optionReasons: [
      'Three boxes of paper mô tả hàng được giao, chưa giải thích sự chậm trễ.',
      'Tài xế bị kẹt xe. Đó là nguyên nhân hợp lý khiến chuyến giao hàng bị chậm.',
      'At the side entrance nói hàng sẽ được giao ở đâu.',
    ],
    tip: 'Câu trả lời Why có thể đưa ra nguyên nhân trực tiếp mà không dùng because.',
  }),
  response(5, 'Câu hỏi How', 'How did you hear about the job opening?', {
    options: ['From a former colleague.', 'The shop opens at ten.', 'For about three years.'],
    answer: 0,
    keywords: ['How', 'hear about', 'job opening', 'former colleague'],
    optionReasons: [
      'From a former colleague nêu nguồn thông tin là một đồng nghiệp cũ.',
      'Opens gợi lại opening nhưng câu này nói giờ mở cửa hàng. Job opening là vị trí đang tuyển.',
      'For about three years là khoảng thời gian. Câu hỏi hỏi bằng cách nào người nghe biết tin tuyển dụng.',
    ],
    tip: 'How đi với hear about thường hỏi nguồn tin, ví dụ through a friend hoặc from a website.',
  }),
  response(6, 'Lời nhờ vả', 'Could you forward me the meeting notes?', {
    options: ['The meeting lasted an hour.', 'They are taking notes now.', 'Sure, I’ll send them after lunch.'],
    answer: 2,
    keywords: ['Could you', 'forward', 'send them'],
    optionReasons: [
      'Thời lượng cuộc họp không trả lời lời nhờ gửi ghi chú.',
      'Lặp lại notes nhưng chỉ nói người khác đang ghi chép. Người nói chưa đáp lại lời nhờ.',
      'Sure đồng ý và I’ll send them hứa gửi ghi chú sau bữa trưa. Them thay cho the meeting notes.',
    ],
    tip: 'Could you + động từ thường là lời nhờ. Tìm lời đồng ý, từ chối hoặc giải thích khả năng thực hiện.',
  }),
  response(7, 'Câu hỏi lựa chọn', 'Would you rather meet in person or on a video call?', {
    options: ['The office is on Oak Street.', 'A video call would be easier for me.', 'Yes, I met her yesterday.'],
    answer: 1,
    keywords: ['rather', 'or', 'A video call'],
    optionReasons: [
      'Địa chỉ văn phòng không xác định phương án gặp mặt hay gọi video.',
      'Người trả lời chọn gọi video và giải thích đó là phương án thuận tiện hơn.',
      'Lặp meet dưới dạng met nhưng nói về quá khứ. Yes cũng không xác định phương án được chọn.',
    ],
    tip: 'Nếu nghe or giữa hai phương án, chờ một lựa chọn hoặc một đề xuất thay thế.',
  }),
  response(8, 'Câu hỏi Yes/No', 'Is the north entrance open today?', {
    options: ['I entered the data on Monday.', 'The opening date is in May.', 'No, please use the main doors.'],
    answer: 2,
    keywords: ['north entrance', 'open today', 'main doors'],
    optionReasons: [
      'Entered ở đây nghĩa là nhập dữ liệu, khác với entrance nghĩa là lối vào.',
      'Opening date nói ngày khai trương. Người hỏi cần biết lối vào phía bắc có mở hôm nay hay không.',
      'No cho biết cửa phía bắc không mở và câu sau hướng dẫn đi cửa chính.',
    ],
    tip: 'Ở câu Yes/No, kiểm tra xem thông tin sau Yes hoặc No có đúng đối tượng đang được hỏi không.',
  }),
  response(9, 'Phản hồi gián tiếp', 'Have you booked a table for six?', {
    options: ['The restaurant hasn’t called me back yet.', 'They sell tables across the street.', 'I’ll read it next week.'],
    answer: 0,
    keywords: ['booked a table', 'for six', 'called me back yet'],
    optionReasons: [
      'Nhà hàng chưa gọi lại, ngụ ý người trả lời chưa có xác nhận đặt bàn cho sáu người.',
      'Tables được dùng theo nghĩa đồ nội thất. Tình huống cần đặt chỗ ở nhà hàng.',
      'Read it gợi book theo nghĩa cuốn sách. Book dùng làm động từ ở đây nghĩa là đặt trước.',
    ],
    tip: 'Câu trả lời gián tiếp thường nêu bước còn vướng. Suy ra câu trả lời từ tình trạng đó.',
  }),
  response(10, 'Câu hỏi What', 'What should I bring to the orientation?', {
    options: ['On your first day.', 'Just a photo ID and a pen.', 'I’ll bring you there.'],
    answer: 1,
    keywords: ['What', 'bring', 'orientation', 'photo ID'],
    optionReasons: [
      'On your first day chỉ thời gian, chưa nêu vật cần mang.',
      'Photo ID và pen là hai vật cần mang đến buổi định hướng.',
      'I’ll bring you there là lời đề nghị chở người hỏi tới nơi. Câu hỏi cần danh sách đồ dùng.',
    ],
    tip: 'What + bring thường cần tên đồ vật. Để ý các cụm danh từ sau just hoặc only.',
  }),
  response(11, 'Câu hỏi số lượng', 'How many copies do we need for the workshop?', {
    options: ['The copier is beside reception.', 'Only for the morning session.', 'One per participant.'],
    answer: 2,
    keywords: ['How many', 'copies', 'one per participant'],
    optionReasons: [
      'Copier là máy photocopy. Vị trí máy không cho biết số bản.',
      'Morning session chỉ buổi sẽ dùng tài liệu, chưa cho biết lấy bao nhiêu bản.',
      'One per participant nghĩa là mỗi người tham gia một bản. Đây là quy tắc xác định số lượng.',
    ],
    tip: 'Câu trả lời How many có thể dùng per (mỗi), enough hoặc một khoảng số lượng.',
  }),
  response(12, 'Lời đề nghị', 'Why don’t we move the training to a larger room?', {
    options: ['Good idea. I’ll check what’s available.', 'The equipment is quite heavy.', 'The trainer moved here last year.'],
    answer: 0,
    keywords: ['Why don’t we', 'larger room', 'Good idea', 'available'],
    optionReasons: [
      'Người nghe đồng ý và sẽ kiểm tra phòng trống để thực hiện đề xuất.',
      'Trọng lượng thiết bị không liên hệ rõ với đề xuất đổi phòng đào tạo.',
      'Moved here chỉ việc chuyển đến sinh sống. Câu hỏi dùng move với nghĩa chuyển địa điểm buổi đào tạo.',
    ],
    tip: 'Why don’t we + động từ là lời gợi ý. Tìm phản hồi đồng ý hoặc đưa ra một lựa chọn khác.',
  }),
  response(13, 'Câu hỏi lựa chọn', 'Should we email the invoice or send it by post?', {
    options: ['The postage rate went up.', 'Email it to the accounting department.', 'It was paid last Friday.'],
    answer: 1,
    keywords: ['email', 'invoice', 'by post', 'accounting department'],
    optionReasons: [
      'Giá bưu phí tăng là chi tiết có liên quan đến việc gửi thư nhưng chưa xác định cách gửi hóa đơn.',
      'Email it chọn đúng một trong hai cách và nêu nơi nhận là phòng kế toán.',
      'Thời điểm thanh toán không xác định hóa đơn cần được gửi bằng cách nào.',
    ],
    tip: 'Đáp án cho câu lựa chọn có thể lặp trực tiếp một phương án rồi bổ sung nơi nhận, thời gian hoặc điều kiện.',
  }),
  response(14, 'Câu hỏi How', 'How soon can you update the website banner?', {
    options: ['It’s at the top of the page.', 'The designer chose blue.', 'I can have it ready by noon.'],
    answer: 2,
    keywords: ['How soon', 'update', 'ready by noon'],
    optionReasons: [
      'Nêu vị trí banner trên trang chứ chưa trả lời tiến độ cập nhật.',
      'Nêu màu do người thiết kế chọn, không có mốc hoàn thành.',
      'By noon nghĩa là chậm nhất vào buổi trưa. Người nói cam kết cập nhật xong vào mốc đó.',
    ],
    tip: 'How soon hỏi việc có thể hoàn tất sớm đến mức nào. Đáp án thường có in + khoảng thời gian hoặc by + mốc giờ.',
  }),
  response(15, 'Câu hỏi Where', 'Where did you leave the spare key?', {
    options: ['In the bottom drawer.', 'The locksmith will come later.', 'I left the office at five.'],
    answer: 0,
    keywords: ['Where', 'spare key', 'bottom drawer'],
    optionReasons: [
      'In the bottom drawer xác định chìa khóa dự phòng ở ngăn kéo dưới cùng.',
      'Nhắc đến thợ khóa nhưng chỉ thông báo thời gian đến.',
      'Left là dạng quá khứ của leave nhưng ở đây mang nghĩa rời văn phòng. Người hỏi muốn biết vị trí chìa khóa.',
    ],
    tip: 'Leave có thể nghĩa là để đồ ở đâu hoặc rời đi. Dựa vào tân ngữ the spare key để chọn nghĩa đúng.',
  }),
  response(16, 'Phản hồi gián tiếp', 'Has the conference room been cleaned yet?', {
    options: ['We ordered some new chairs.', 'The cleaners are still working in there.', 'The conference starts at two.'],
    answer: 1,
    keywords: ['cleaned yet', 'still working', 'in there'],
    optionReasons: [
      'Việc đặt ghế mới không cho biết phòng đã được dọn xong chưa.',
      'Still working nghĩa là nhân viên vẫn đang dọn. Có thể suy ra phòng chưa được dọn xong.',
      'Giờ bắt đầu hội nghị không xác nhận công tác dọn phòng.',
    ],
    tip: 'Still + V-ing thường cho biết công việc đang tiếp diễn. Yet trong câu hỏi thường hỏi việc đã xong chưa.',
  }),
  response(17, 'Câu hỏi Who', 'Who should I contact about the broken air conditioner?', {
    options: ['It stopped working yesterday.', 'Please turn the fan on.', 'Try Hana in building maintenance.'],
    answer: 2,
    keywords: ['Who', 'contact', 'building maintenance', 'Hana'],
    optionReasons: [
      'Nêu thời điểm máy hỏng. Câu hỏi cần một người liên hệ.',
      'Bật quạt có thể giúp giảm nóng tạm thời, nhưng không chỉ ra ai phụ trách sửa máy.',
      'Hana thuộc bộ phận bảo trì tòa nhà, phù hợp để báo máy lạnh hỏng.',
    ],
    tip: 'Try + tên người trong tình huống này có nghĩa là hãy thử liên hệ người đó.',
  }),
  response(18, 'Lời thông báo', 'The afternoon shipment won’t arrive until tomorrow.', {
    options: ['Then we should notify our customers.', 'The ship was built in 2015.', 'Yes, I arrived in the afternoon.'],
    answer: 0,
    keywords: ['shipment', 'won’t arrive until tomorrow', 'notify our customers'],
    optionReasons: [
      'Then nối sự chậm trễ với việc cần làm tiếp theo là báo cho khách hàng.',
      'Ship trong đáp án là con tàu. Shipment trong lời báo là lô hàng hoặc chuyến giao hàng.',
      'Arrived trùng từ nhưng câu này chuyển sang việc người nghe đến nơi, không phản hồi tin lô hàng bị chậm.',
    ],
    tip: 'Sau một thông báo, phản hồi có thể là một hành động tiếp theo hợp lý. Chú ý từ nối then.',
  }),
  response(19, 'Câu hỏi What', 'What seems to be wrong with your laptop?', {
    options: ['It’s the latest model.', 'The screen goes blank when I log in.', 'I bought it with my own money.'],
    answer: 1,
    keywords: ['what seems to be wrong', 'goes blank', 'log in'],
    optionReasons: [
      'Mẫu máy không mô tả sự cố đang gặp.',
      'Màn hình chuyển sang trạng thái trống khi đăng nhập. Đây là mô tả cụ thể về lỗi của laptop.',
      'Cách thanh toán không cho biết máy gặp lỗi gì.',
    ],
    tip: 'What seems to be wrong hỏi triệu chứng. Dự đoán các động từ như freezes, crashes hoặc goes blank.',
  }),
  response(20, 'Câu hỏi đuôi', 'You sent the revised schedule, didn’t you?', {
    options: ['Next Tuesday at ten.', 'The schedule has three sessions.', 'Yes, I emailed it to everyone this morning.'],
    answer: 2,
    keywords: ['sent', 'revised schedule', 'didn’t you', 'emailed'],
    optionReasons: [
      'Nêu một ngày giờ có thể có trong lịch, nhưng không xác nhận đã gửi.',
      'Mô tả số buổi trong lịch. Người hỏi đang xác minh hành động gửi bản sửa.',
      'Yes xác nhận việc gửi, và emailed làm rõ kênh gửi. It thay cho the revised schedule.',
    ],
    tip: 'Ở câu hỏi đuôi, nghe mệnh đề chính để biết thông tin cần xác nhận, nhất là chủ ngữ và hành động.',
  }),
]


function passageQuestions(
  part: 3 | 4,
  firstNumber: number,
  topic: string,
  transcript: string,
  items: (AnswerSet & { prompt: string })[],
) {
  return items.map(({ prompt, ...answers }, index) =>
    makeQuestion(part, firstNumber + index, topic, prompt, transcript, answers, firstNumber),
  )
}

const conversations = [
  ...passageQuestions(3, 1, 'Lịch hẹn và địa điểm', `Woman: Hi, this is Mei from the Lakeside Dental Clinic. I’m calling about your appointment on Wednesday at two.
Man: I wrote that down, but could I come in later? I have a staff meeting that ends at three.
Woman: Dr. Roy can see you at half past four. The parking lot behind our building is closed this week, so please park on Garden Street.
Man: Four thirty works for me. Thanks for letting me know.`, [
    {
      prompt: 'Why does the man want to change his appointment?',
      options: ['He has a staff meeting.', 'He needs to work on Garden Street.', 'He is waiting for a phone call.', 'He has to park a company vehicle.'],
      answer: 0,
      keywords: ['staff meeting', 'ends at three', 'come in later'],
      optionReasons: [
        'Cuộc họp nhân viên kết thúc lúc 3 giờ, sau lịch hẹn lúc 2 giờ. Đó là lý do anh ấy muốn đến muộn hơn.',
        'Garden Street là nơi đỗ xe được gợi ý. Người đàn ông không nói phải làm việc ở đó.',
        'Mei đang gọi từ phòng khám. Người đàn ông không nói còn chờ một cuộc gọi khác.',
        'Việc đỗ xe được nói sau khi đã đổi giờ hẹn. Không có thông tin về xe công ty.',
      ],
      tip: 'Với câu hỏi Why, nghe mệnh đề ngay sau yêu cầu thay đổi lịch.',
    },
    {
      prompt: 'Where should the man park?',
      options: ['Across from the city hall', 'Behind the dental clinic', 'On Garden Street', 'In an underground garage'],
      answer: 2,
      keywords: ['parking lot', 'closed', 'park on Garden Street'],
      optionReasons: [
        'Đoạn hội thoại không nhắc đến tòa thị chính.',
        'Bãi xe sau phòng khám có được nhắc tới, nhưng đang đóng cửa tuần này.',
        'Mei dùng please park on Garden Street, chỉ dẫn trực tiếp nơi đỗ xe thay thế.',
        'Không có thông tin về một bãi xe ngầm.',
      ],
      tip: 'Chi tiết được nghe rõ vẫn có thể là bẫy nếu đi kèm từ phủ định hoặc closed.',
    },
  ]),
  ...passageQuestions(3, 3, 'Giao hàng và đơn hàng', `Man: I’m calling about order 642. The store received the six display stands, but none of the price cards were in the cartons.
Woman: I’m sorry about that. The cards were sent separately because the printer finished them late. The courier is due to deliver them before noon tomorrow.
Man: Great. Our new section opens on Friday, so that gives us enough time to set up.
Woman: I’ll email you the tracking number now.`, [
    {
      prompt: 'What problem does the man report?',
      options: ['Several stands are damaged.', 'Some items have not arrived.', 'The shop received the wrong product.', 'The opening date was changed.'],
      answer: 1,
      keywords: ['received', 'none of', 'price cards', 'sent separately'],
      optionReasons: [
        'Cửa hàng đã nhận đủ sáu kệ trưng bày. Hội thoại không nhắc đến hư hỏng.',
        'Các thẻ giá không có trong thùng, vì chúng được gửi riêng và chưa đến nơi.',
        'Kệ trưng bày đúng như đơn hàng. Vấn đề là thiếu thẻ giá trong đợt giao này.',
        'Thứ Sáu là ngày khai trương. Người đàn ông không nói lịch khai trương đã bị đổi.',
      ],
      tip: 'None of + danh từ nghĩa là không có món nào trong nhóm đó. Xác định món đồ ngay sau cụm này.',
    },
    {
      prompt: 'What does the woman say she will do next?',
      options: ['Call the printer', 'Send replacement stands', 'Visit the new section', 'Email shipment details'],
      answer: 3,
      keywords: ['I’ll email you', 'tracking number'],
      optionReasons: [
        'Lý do in xong muộn là thông tin quá khứ. Cô ấy không hứa gọi nhà in.',
        'Kệ trưng bày đã được giao, nên không cần gửi kệ thay thế.',
        'Khu trưng bày mới sẽ mở thứ Sáu, nhưng không có kế hoạch đến thăm trong câu cuối.',
        'Tracking number (mã theo dõi lô hàng) là một shipment detail. Cô ấy sẽ gửi qua email ngay.',
      ],
      tip: 'Câu hỏi về việc làm tiếp theo thường được trả lời ở lượt nói cuối, sau I’ll hoặc I’m going to.',
    },
  ]),
  ...passageQuestions(3, 5, 'Đăng ký sự kiện', `Woman: I’m here to register for the beginner photography workshop on Saturday.
Man: The outdoor session is full, but there are seats in the indoor session at eleven.
Woman: Is it okay if I bring a phone instead of a camera?
Man: Absolutely. Just make sure the battery is charged. We have a few portable chargers, but we can’t promise one for everyone.`, [
    {
      prompt: 'What is the woman trying to do?',
      options: ['Buy a new camera', 'Charge her phone', 'Reserve a place in a workshop', 'Find an outdoor venue'],
      answer: 2,
      keywords: ['register for', 'workshop', 'seats'],
      optionReasons: [
        'Camera xuất hiện khi hỏi có thể mang điện thoại thay cho máy ảnh không. Không ai mua máy ảnh.',
        'Sạc pin là việc cần làm trước buổi học, chưa phải mục đích đến đây.',
        'Register for the beginner photography workshop nghĩa là đăng ký tham gia buổi học chụp ảnh cho người mới.',
        'Buổi học ngoài trời đã hết chỗ. Cô ấy không đi tìm địa điểm tổ chức.',
      ],
      tip: 'Câu mở đầu I’m here to + động từ thường nêu mục đích của người nói.',
    },
    {
      prompt: 'What does the man ask the woman to do before the session?',
      options: ['Charge her device', 'Download a photo editor', 'Borrow a camera', 'Pay for a portable charger'],
      answer: 0,
      keywords: ['make sure', 'battery', 'charged'],
      optionReasons: [
        'Make sure the battery is charged là lời nhắc sạc thiết bị trước khi đến lớp.',
        'Đoạn hội thoại không nói về phần mềm chỉnh sửa ảnh.',
        'Bring a phone instead of a camera chấp nhận điện thoại. Cô ấy không cần mượn máy ảnh.',
        'Có vài pin sạc dự phòng, nhưng không có yêu cầu mua hay trả tiền.',
      ],
      tip: 'Sau make sure, nghe kỹ việc cần xác nhận hoặc chuẩn bị.',
    },
  ]),
  ...passageQuestions(3, 7, 'Dịch vụ khách hàng', `Man: I bought this desk lamp here on Tuesday. It turns on, but the switch only works if I hold it down.
Woman: Do you have your receipt? We can exchange it today if you do.
Man: I can’t find the paper copy, but I have the receipt in my email.
Woman: That’s fine. The same model is sold out, but we have a similar one in black. Let me show it to you.`, [
    {
      prompt: 'What is wrong with the desk lamp?',
      options: ['It arrived without a bulb.', 'The switch does not work properly.', 'It is the wrong color.', 'A part was damaged during shipping.'],
      answer: 1,
      keywords: ['switch', 'only works', 'hold it down'],
      optionReasons: [
        'Đèn bật lên được, nên không có căn cứ nói thiếu bóng đèn.',
        'Công tắc chỉ hoạt động khi giữ tay nhấn xuống. Đây là lỗi của công tắc.',
        'Màu đen là màu đèn thay thế được đề xuất, chưa phải vấn đề của đèn cũ.',
        'Anh ấy mua đèn tại cửa hàng. Không có thông tin về hỏng hóc khi vận chuyển.',
      ],
      tip: 'Trong mô tả lỗi, nghe kỹ but và only vì chúng thường giới hạn điều kiện thiết bị hoạt động.',
    },
    {
      prompt: 'What does the employee offer to show the man?',
      options: ['A copy of the paper receipt', 'A different switch', 'Instructions for ordering online', 'A similar lamp'],
      answer: 3,
      keywords: ['same model', 'sold out', 'similar one', 'show it'],
      optionReasons: [
        'Bản giấy không tìm thấy. Nhân viên chấp nhận hóa đơn qua email.',
        'Nhân viên đề nghị đổi đèn. Không có lời đề nghị thay riêng công tắc.',
        'Không ai nói về việc đặt hàng trực tuyến. Email được nhắc vì chứa hóa đơn.',
        'Mẫu cũ đã hết. Nhân viên đề nghị cho xem một chiếc tương tự màu đen.',
      ],
      tip: 'One thường thay cho một danh từ đã nhắc, ở đây là chiếc desk lamp.',
    },
  ]),
  ...passageQuestions(3, 9, 'Công việc và đào tạo', `Woman: Have you looked at the schedule for our new hires? The safety tour is listed for Monday morning, before they get their identification cards.
Man: They won’t be allowed onto the factory floor without those cards. Could we switch it with the payroll session?
Woman: The payroll session is on Monday afternoon. That should work. I’ll update the schedule and send it to the supervisors.
Man: Thanks. I’ll tell the safety instructor about the change.`, [
    {
      prompt: 'Why does the man suggest changing the schedule?',
      options: ['The factory will close on Monday.', 'The safety instructor is on vacation.', 'New hires need identification cards to go on the tour.', 'The supervisors asked to shorten the tour.'],
      answer: 2,
      keywords: ['safety tour', 'identification cards', 'won’t be allowed', 'without'],
      optionReasons: [
        'Nhà máy vẫn có lịch tham quan. Không có thông báo đóng cửa.',
        'Anh ấy sẽ báo thay đổi cho người hướng dẫn. Không có thông tin người đó nghỉ phép.',
        'Nhân viên mới chưa nhận thẻ vào giờ tham quan cũ. Without those cards cho biết thẻ là điều kiện để vào khu sản xuất.',
        'Giám sát viên sẽ nhận lịch mới. Họ không được dẫn lời yêu cầu rút ngắn buổi tham quan.',
      ],
      tip: 'Without + danh từ trong câu phủ định thường cho thấy điều kiện bắt buộc.',
    },
    {
      prompt: 'Who will the man inform?',
      options: ['The safety instructor', 'The payroll manager', 'The new hires', 'The supervisors'],
      answer: 0,
      keywords: ['I’ll tell', 'safety instructor'],
      optionReasons: [
        'Trong lượt nói cuối, người đàn ông nói I’ll tell the safety instructor about the change.',
        'Buổi hướng dẫn về tiền lương là hoạt động đổi giờ. Người phụ trách tiền lương không được nhắc như người nhận thông báo.',
        'Nhân viên mới chịu ảnh hưởng của thay đổi, nhưng người đàn ông chưa nói sẽ báo trực tiếp cho họ.',
        'Người phụ nữ sẽ gửi lịch cho các giám sát viên. Câu hỏi hỏi người đàn ông sẽ báo cho ai.',
      ],
      tip: 'Ở đoạn hội thoại, gắn từng lời hứa với người nói. Cùng một thay đổi có thể cần nhiều người nhận khác nhau.',
    },
  ]),
]

const talks = [
  ...passageQuestions(4, 1, 'Thông báo tại nhà ga', `Attention, passengers for the eight fifteen train to Westford. Because of maintenance on track three, your train will leave from platform six today. Please use the stairs next to the ticket office to reach platform six. Allow a few extra minutes if you are carrying heavy luggage. Your tickets and departure time are unchanged.`, [
    {
      prompt: 'What change is being announced?',
      options: ['The train will leave from a different platform.', 'The departure will be delayed.', 'The ticket office will move.', 'The train will end its trip in a different city.'],
      answer: 0,
      keywords: ['leave from platform six', 'track three', 'unchanged'],
      optionReasons: [
        'Tàu đi Westford sẽ khởi hành từ sân ga số 6 vì việc bảo trì. Nơi lên tàu thay đổi.',
        'Người nói xác nhận giờ khởi hành unchanged (giữ nguyên).',
        'Phòng vé là mốc tìm cầu thang. Không có thông báo chuyển phòng vé.',
        'Westford vẫn là điểm đến của chuyến tàu được thông báo.',
      ],
      tip: 'Ghi tắt giờ, địa điểm và thay đổi thành ba cột để tránh nhầm số đường ray với số sân ga.',
    },
    {
      prompt: 'Where can passengers find the stairs to platform six?',
      options: ['Behind the luggage counter', 'Near the station entrance', 'Next to the ticket office', 'Across from track three'],
      answer: 2,
      keywords: ['stairs', 'next to', 'ticket office'],
      optionReasons: [
        'Thông báo đề cập hành lý nặng, nhưng không nhắc quầy gửi hành lý.',
        'Không có chỉ dẫn cầu thang nằm gần lối vào nhà ga.',
        'Next to the ticket office nghĩa là ngay cạnh phòng vé. Đây là vị trí của cầu thang.',
        'Track three là đường ray đang bảo trì, chưa phải mốc vị trí cầu thang.',
      ],
      tip: 'Khi nghe chỉ đường, ghi nhớ cả vật mốc và giới từ như next to hoặc across from.',
    },
  ]),
  ...passageQuestions(4, 3, 'Tin nhắn thoại', `Hello, this is Rina from Maple Bicycle Repair calling for Mr. Evans. We replaced the rear tire and checked the brakes. Your bicycle is ready to collect. We normally stay open until seven, but today we’re closing at five for a staff event. If you can’t make it by five, you can pick it up anytime after nine tomorrow. Please bring your service slip.`, [
    {
      prompt: 'Why is Rina calling Mr. Evans?',
      options: ['To confirm a reservation', 'To report that his bicycle service is complete', 'To ask for permission to replace a tire', 'To invite him to a staff event'],
      answer: 1,
      keywords: ['replaced', 'checked', 'ready to collect'],
      optionReasons: [
        'Tin nhắn không đề cập đặt chỗ hay xác nhận lịch hẹn.',
        'Việc thay lốp và kiểm tra phanh đã hoàn tất. Ready to collect nghĩa là xe đã sẵn sàng để khách đến nhận.',
        'Replaced ở quá khứ cho biết lốp đã được thay. Cô ấy không xin phép để thực hiện tiếp.',
        'Sự kiện nhân viên giải thích việc đóng cửa sớm. Khách không được mời dự sự kiện.',
      ],
      tip: 'Trong tin nhắn dịch vụ, tìm cụm trạng thái như ready to collect để xác định mục đích cuộc gọi.',
    },
    {
      prompt: 'What should Mr. Evans bring when he picks up the bicycle?',
      options: ['A bicycle pump', 'A replacement tire', 'An employee badge', 'A service slip'],
      answer: 3,
      keywords: ['Please bring', 'service slip'],
      optionReasons: [
        'Tin nhắn không yêu cầu mang bơm xe.',
        'Lốp sau mới đã được lắp. Khách không cần mang lốp thay thế.',
        'Sự kiện là dành cho nhân viên. Khách không cần thẻ nhân viên.',
        'Please bring your service slip yêu cầu mang phiếu dịch vụ khi tới nhận xe.',
      ],
      tip: 'Một yêu cầu nhỏ như Please bring thường nằm ở cuối thông báo, sau chi tiết về giờ mở cửa.',
    },
  ]),
  ...passageQuestions(4, 5, 'Quảng cáo', `Looking for a place to work between appointments? Park Lane Workspace offers quiet desks by the hour. Every booking includes high-speed internet and unlimited tea. For the month of August, first-time customers can book two hours and get a third hour free. To claim the offer, book through our website and enter the code SUMMER at checkout. The offer applies on weekdays only.`, [
    {
      prompt: 'What business is being advertised?',
      options: ['A tea shop', 'An internet provider', 'A shared workspace', 'An appointment booking service'],
      answer: 2,
      keywords: ['workspace', 'quiet desks', 'by the hour'],
      optionReasons: [
        'Trà là tiện ích đi kèm. Sản phẩm chính là chỗ ngồi làm việc.',
        'Internet được bao gồm trong mỗi lượt đặt. Công ty không quảng cáo gói internet riêng.',
        'Park Lane Workspace cho thuê bàn làm việc yên tĩnh theo giờ, đặc trưng của không gian làm việc chung.',
        'Website dùng để đặt bàn làm việc. Công ty không cung cấp hệ thống quản lý cuộc hẹn.',
      ],
      tip: 'Phân biệt sản phẩm chính và tiện ích được giới thiệu sau includes.',
    },
    {
      prompt: 'How can a new customer claim the August offer?',
      options: ['By entering a code on the website', 'By buying tea at the front desk', 'By signing up for a monthly membership', 'By making a weekend booking'],
      answer: 0,
      keywords: ['claim the offer', 'website', 'enter the code', 'weekdays only'],
      optionReasons: [
        'Khách mới phải đặt trên website và nhập mã SUMMER khi thanh toán để nhận ưu đãi.',
        'Trà đã đi kèm lượt đặt. Không có yêu cầu mua trà tại quầy.',
        'Quảng cáo nhắc đặt theo giờ, không yêu cầu đăng ký thành viên tháng.',
        'Weekdays only giới hạn ưu đãi vào các ngày trong tuần, không áp dụng cuối tuần.',
      ],
      tip: 'Trong quảng cáo, nghe cụm to claim hoặc to get để tìm cách nhận ưu đãi, rồi kiểm tra giới hạn sau only.',
    },
  ]),
  ...passageQuestions(4, 7, 'Hướng dẫn tại nơi làm việc', `Before we start today’s warehouse tour, please put on the orange vests in the box by the door. Visitors must stay inside the yellow lines marked on the floor. These lines separate the walkway from the vehicle lanes. You may take pictures at the loading area, but please keep your phone put away when we pass the packing machines.`, [
    {
      prompt: 'What is the speaker about to lead?',
      options: ['A photo contest', 'A tour of a warehouse', 'A meeting with a delivery company', 'A demonstration of safety clothing'],
      answer: 1,
      keywords: ['Before we start', 'warehouse tour', 'Visitors'],
      optionReasons: [
        'Chụp ảnh chỉ được cho phép ở một khu vực, không phải nội dung chính.',
        'Câu mở đầu xác định hoạt động sắp diễn ra là một chuyến tham quan nhà kho.',
        'Khu bốc dỡ được nhắc tới, nhưng không có cuộc họp nào với đơn vị giao hàng.',
        'Mặc áo phản quang là bước chuẩn bị để tham quan, chưa phải buổi trình diễn về trang phục.',
      ],
      tip: 'Before we start + tên hoạt động thường xác định sự kiện người nói đang hướng dẫn.',
    },
    {
      prompt: 'Where may visitors take pictures?',
      options: ['Next to the vests', 'In the vehicle lanes', 'At the packing machines', 'At the loading area'],
      answer: 3,
      keywords: ['may take pictures', 'loading area', 'keep your phone put away'],
      optionReasons: [
        'Hộp áo gần cửa là nơi lấy áo. Người nói không chỉ định đây là nơi được chụp.',
        'Khách phải đi trong vạch vàng để tránh làn xe. Không có quyền chụp ở làn xe.',
        'Keep your phone put away yêu cầu cất điện thoại khi đi qua máy đóng gói.',
        'You may take pictures at the loading area cho phép chụp tại khu bốc dỡ.',
      ],
      tip: 'Nghe may cho việc được phép và nghe but để phân biệt nơi có quy định khác.',
    },
  ]),
  ...passageQuestions(4, 9, 'Bản tin và sự kiện', `Here’s an update on the Riverside Book Fair. Because rain is expected, Saturday’s event will move from the park to the community center on Elm Street. The fair still opens at ten. All talks will go ahead, but the children’s reading session will start at eleven instead of ten thirty. Use the main entrance and pick up a free program at the welcome table.`, [
    {
      prompt: 'What caused the event venue to change?',
      options: ['Fewer speakers signed up.', 'The park was double-booked.', 'Rain is forecast.', 'Road work has started on Elm Street.'],
      answer: 2,
      keywords: ['because', 'rain is expected', 'will move'],
      optionReasons: [
        'Các buổi nói chuyện vẫn diễn ra. Không có chi tiết về việc thiếu người nói.',
        'Bản tin nhắc công viên là nơi cũ. Không nói có hai sự kiện cùng đặt địa điểm.',
        'Because rain is expected nêu rõ nguyên nhân là trời được dự báo có mưa.',
        'Elm Street là đường của trung tâm cộng đồng. Không có thông tin sửa đường.',
      ],
      tip: 'Khi nghe because, ghi từ ngay sau nó để bắt nguyên nhân trước khi người nói chuyển sang chi tiết mới.',
    },
    {
      prompt: 'What time will the children’s reading session start?',
      options: ['Eleven o’clock', 'Ten o’clock', 'Ten thirty', 'Eleven thirty'],
      answer: 0,
      keywords: ['children’s reading session', 'eleven', 'instead of ten thirty'],
      optionReasons: [
        'Sau khi chuyển địa điểm, giờ đọc sách cho trẻ em là 11 giờ.',
        '10 giờ là giờ khai mạc hội sách. Câu hỏi cần giờ của riêng buổi đọc sách.',
        'Ten thirty đứng sau instead of, cho biết đó là giờ cũ đã được thay.',
        'Bản tin không nhắc đến 11 giờ 30.',
      ],
      tip: 'Với X instead of Y, X là lựa chọn mới và Y là lựa chọn được thay thế.',
    },
  ]),
]


function photograph(number: number, topic: string, alt: string, answers: AnswerSet): Question {
  return {
    ...makeQuestion(
      1,
      number,
      topic,
      'Quan sát ảnh, nghe bốn câu và chọn câu mô tả đúng nhất.',
      spokenOptions(answers.options),
      answers,
    ),
    image: { src: `/listening/photo-${number}.jpg`, alt },
  }
}

const photographs = [
  photograph(1, 'Hành động của một người', 'Một phụ nữ cầm bình xanh bên các chậu cây trước cửa hàng.', {
    options: ['The woman is washing a window.', 'The woman is sweeping the sidewalk.', 'The woman is watering some plants.', 'The woman is hanging a flower basket.'],
    answer: 2,
    keywords: ['watering', 'plants', 'window', 'sweeping'],
    optionReasons: [
      'Cửa kính có trong ảnh, nhưng người phụ nữ đang hướng vòi bình vào chậu cây chứ không rửa kính.',
      'Vỉa hè xuất hiện ở bên trái. Người phụ nữ cầm bình tưới, không cầm chổi.',
      'Bình tưới đang nghiêng và có nước chảy xuống cây. Water ở đây là động từ nghĩa là tưới.',
      'Có một chậu treo gần cửa kính, nhưng người phụ nữ đang tưới cây chứ không treo chậu.',
    ],
    tip: 'Khi nhiều đáp án nhắc đến đồ vật có trong ảnh, dùng động từ sau is để kiểm tra hành động chính.',
  }),
  photograph(2, 'Hành động của một người', 'Một người đàn ông quỳ bên bánh trước của xe đạp trên vỉa hè.', {
    options: ['The man is riding along the sidewalk.', 'The man is working on a bicycle wheel.', 'The man is carrying a bicycle up some steps.', 'The man is locking a gate.'],
    answer: 1,
    keywords: ['working on', 'bicycle wheel', 'riding', 'locking'],
    optionReasons: [
      'Anh ấy đang quỳ cạnh bánh xe, không ngồi trên yên hay đạp xe.',
      'Tay anh ấy đưa dụng cụ vào bánh trước. Work on a bicycle wheel diễn tả kiểm tra hoặc sửa bánh xe.',
      'Xe ở sát hàng rào và bánh trước vẫn ở sát mặt đất. Không có cảnh nhấc xe lên bậc thang.',
      'Hàng rào ở phía sau, nhưng dụng cụ đang hướng vào bánh xe, không phải khóa cổng.',
    ],
    tip: 'Quan sát cả tư thế và vật tiếp xúc với tay. Một vật xuất hiện ở nền ảnh chưa chắc là tân ngữ của hành động.',
  }),
  photograph(3, 'Vị trí và đồ vật', 'Một phòng họp có bàn dài ở giữa, ghế ở hai bên và màn hình trên tường.', {
    options: ['Some files are spread across the table.', 'The chairs are stacked against the wall.', 'Someone is moving a screen.', 'Chairs have been arranged around a table.'],
    answer: 3,
    keywords: ['arranged around', 'table', 'stacked', 'have been arranged'],
    optionReasons: [
      'Mặt bàn gần như trống, ngoại trừ các ô cắm điện cố định. Không có tập hồ sơ bày trên bàn.',
      'Ghế để riêng lẻ cạnh bàn. Stack nghĩa là chồng lên nhau, không giống cách ghế đang được xếp.',
      'Màn hình gắn trên tường ở phía cuối phòng. Trong ảnh không có người di chuyển nó.',
      'Ghế đã được bố trí quanh bàn dài. Have been arranged là hiện tại hoàn thành bị động, diễn tả kết quả đang nhìn thấy.',
    ],
    tip: 'Với ảnh phòng trống, nghe giới từ chỉ vị trí và các mô tả trạng thái như have been arranged.',
  }),
  photograph(4, 'Công việc và thiết bị', 'Nhân viên đeo tạp dề và găng tay đứng cạnh các thùng carton trong kho.', {
    options: ['A worker is stacking some boxes.', 'A worker is unpacking a box.', 'A worker is driving a forklift.', 'A worker is sweeping the warehouse floor.'],
    answer: 0,
    keywords: ['stacking', 'boxes', 'unpacking', 'forklift'],
    optionReasons: [
      'Cô ấy đang giữ một thùng kín phía trên các thùng khác. Stacking nghĩa là xếp chồng lên nhau.',
      'Các nắp thùng đang đóng và cô ấy không lấy vật gì ra. Unpacking nghĩa là mở và lấy đồ khỏi thùng.',
      'Có thiết bị vận chuyển phía sau, nhưng nhân viên không đứng ở vị trí điều khiển xe nâng.',
      'Không thấy cô ấy cầm chổi. Hai tay cô ấy đang đặt vào thùng.',
    ],
    tip: 'Khi cùng tân ngữ như boxes xuất hiện, phân biệt động từ mô tả hướng di chuyển hoặc trạng thái của đồ vật.',
  }),
  photograph(5, 'Hành động của một người', 'Một người đàn ông ngồi trên ghế dài trong công viên với quyển sách đang mở.', {
    options: ['The man is opening his backpack.', 'The man is reading a book on a bench.', 'The man is painting a park bench.', 'The man is looking up at a tree.'],
    answer: 1,
    keywords: ['reading', 'book', 'bench', 'looking up'],
    optionReasons: [
      'Ba lô để bên cạnh. Hai tay người đàn ông đang cầm sách, không mở ba lô.',
      'Anh ấy ngồi trên ghế dài, cầm sách mở và nhìn vào trang. Cả hành động reading và vị trí on a bench đều khớp.',
      'Ghế dài đúng là có trong ảnh, nhưng không có dụng cụ sơn hay động tác sơn.',
      'Có thân cây ngay cạnh ghế, nhưng người đàn ông đang nhìn xuống trang sách.',
    ],
    tip: 'Kiểm tra cả hai phần của câu mô tả: V-ing đang xảy ra và cụm vị trí đi cùng.',
  }),
  photograph(6, 'Hành động trong nhóm', 'Ba người bên bàn cà phê, người ở giữa cầm một bình thủy tinh.', {
    options: ['The group is standing beside the table.', 'A woman is carrying a tray of drinks.', 'One of the men is cleaning the table.', 'A man is pouring water into a glass.'],
    answer: 3,
    keywords: ['pouring', 'water', 'into a glass', 'standing'],
    optionReasons: [
      'Cả ba người chính đều ngồi quanh bàn, không đứng cạnh bàn.',
      'Hai người phụ nữ đang ngồi. Không người nào cầm khay đồ uống.',
      'Người đàn ông cầm bình, không có khăn lau và không lau mặt bàn.',
      'Bình được nghiêng về phía ly, thấy được nước chảy xuống. Pour water into a glass nghĩa là rót nước vào ly.',
    ],
    tip: 'Chú ý ai thực hiện hành động. Pour into cho biết chất lỏng được rót vào vật nào.',
  }),
  photograph(7, 'Vị trí và đồ vật', 'Dãy xe đạp màu vàng cạnh lan can nhìn ra sông.', {
    options: ['Bicycles are lined up beside a railing.', 'Cyclists are crossing a bridge.', 'Several bicycles are being loaded onto a truck.', 'A worker is replacing a bicycle seat.'],
    answer: 0,
    keywords: ['lined up', 'beside', 'railing', 'being loaded'],
    optionReasons: [
      'Những chiếc xe đạp đứng thành hàng cạnh lan can. Lined up diễn tả cách sắp xếp nhìn thấy trong ảnh.',
      'Cầu nằm phía sau. Không có người nào đang đạp xe qua cầu trong phần hình chính.',
      'Không có chiếc xe tải nào và các xe đạp đang được giữ ở điểm đỗ bên sông.',
      'Các yên xe nhìn thấy trên dãy xe. Không thấy nhân viên đang thay yên.',
    ],
    tip: 'Are lined up mô tả trạng thái đã xếp thành hàng. Are being loaded mô tả việc bốc hàng đang diễn ra.',
  }),
  photograph(8, 'Hành động của một người', 'Một người đàn ông đeo ba lô đi qua sảnh gần quầy lễ tân, cạnh va li xanh.', {
    options: ['A guest is sitting near the reception desk.', 'A clerk is carrying a suitcase.', 'A guest is pulling a suitcase through a lobby.', 'A man is pushing a luggage cart.'],
    answer: 2,
    keywords: ['pulling', 'suitcase', 'through a lobby', 'luggage cart'],
    optionReasons: [
      'Người khách đang bước đi, không ngồi cạnh quầy.',
      'Nhân viên đứng phía sau quầy. Người khách mới là người cầm tay kéo va li.',
      'Người khách nắm tay kéo va li và đi qua sảnh. Pulling khớp với việc kéo va li theo sau.',
      'Xe đẩy hành lý đứng gần cửa phía sau. Người khách không cầm hoặc đẩy xe đó.',
    ],
    tip: 'Phân biệt pull (kéo về phía mình) và push (đẩy ra xa) dựa vào vị trí của người và vật.',
  }),
  photograph(9, 'Hành động trong nhóm', 'Hai nhân viên đeo tạp dề bên khu trưng bày táo trong cửa hàng.', {
    options: ['Two employees are checking a receipt.', 'Two employees are arranging some fruit.', 'A customer is pushing a shopping cart.', 'Some apples are being put into paper bags.'],
    answer: 1,
    keywords: ['arranging', 'fruit', 'shopping cart', 'paper bags'],
    optionReasons: [
      'Cả hai đang cầm hoặc chạm vào trái cây. Không có hóa đơn trong tay họ.',
      'Cả hai mặc tạp dề và đang sắp trái cây ở khu trưng bày. Arranging some fruit phù hợp với hành động của cả hai.',
      'Người ở gần kệ không đẩy xe mua hàng. Hai người chính đều là nhân viên đang sắp trái cây.',
      'Táo nằm trên kệ và khay mở. Không thấy túi giấy được dùng để đựng táo.',
    ],
    tip: 'Khi nghe chủ ngữ số nhiều như two employees, kiểm tra hành động đó có đúng với cả hai người hay không.',
  }),
  photograph(10, 'Vị trí và đồ vật', 'Một khu bàn ghế ngoài trời cạnh tòa nhà, phía trên có nhiều ô vàng.', {
    options: ['Customers are folding the umbrellas.', 'Tables are being carried inside.', 'Some chairs have been stacked in a corner.', 'Several umbrellas are open above the tables.'],
    answer: 3,
    keywords: ['umbrellas', 'open', 'above', 'folding'],
    optionReasons: [
      'Các ô đang mở và không có thực khách nào gấp ô.',
      'Bàn đặt ngoài trời và không có người khiêng bàn vào trong.',
      'Ghế đặt quanh các bàn riêng lẻ. Không thấy ghế được chồng ở góc.',
      'Nhiều ô màu vàng đang mở phía trên bàn. Open ở đây là tính từ mô tả trạng thái.',
    ],
    tip: 'Phân biệt be + tính từ mô tả trạng thái với be + V-ing mô tả hành động đang diễn ra.',
  }),
]

export const listeningQuestions: Question[] = [
  ...photographs,
  ...responses,
  ...conversations,
  ...talks,
]
