import { readingPassageQuestions } from './reading-authoring';

const fillBlank = (number: number) => `Which option best completes blank (${number})?`;

export const partSixQuestions = [
  ...readingPassageQuestions(6, 'Email', [{
    title: 'Email · Friday orientation',
    text: `To: New volunteers
From: Nuri Dawson, Braywell Repair Café
Subject: Orientation room

Hello everyone,

The orientation is still scheduled for Friday at 10 a.m. Because the main hall will be painted that morning, we have (1) _____ the session to Room 3. Room 3 is on the ground floor, next to the bicycle workshop.

(2) _____ This gives us time to hand out name badges before the session starts. If you have already received a badge, please (3) _____ it with you.

See you on Friday,
Nuri`,
  }], [
    {
      id: 'r6-01',
      prompt: fillBlank(1),
      answer: 2,
      options: [
        ['move', 'Sau have chỉ hành động đã hoàn thành, cần phân từ moved.'],
        ['moves', 'Dạng ngôi ba số ít không dùng sau have.'],
        ['moved', 'Have moved diễn tả việc đã dời địa điểm và thông tin mới vẫn có hiệu lực.'],
        ['moving', 'Muốn dùng moving trong hiện tại hoàn thành tiếp diễn cần have been moving.'],
      ],
      rationale: 'The main hall will be painted giải thích lý do đã chuyển buổi hướng dẫn sang Phòng 3. Have + moved tạo hiện tại hoàn thành.',
      grammar: 'Have/has + quá khứ phân từ',
      vocabulary: ['orientation · buổi hướng dẫn ban đầu', 'move the session · chuyển buổi học'],
      keywords: ['have', 'Room 3'],
      tip: 'Kiểm tra dạng từ trước, rồi xác nhận động từ tạo đúng ý nghĩa với địa điểm mới.',
    },
    {
      id: 'r6-02',
      prompt: fillBlank(2),
      answer: 0,
      options: [
        ['Please arrive ten minutes early.', 'Việc đến sớm giải thích thời gian để phát thẻ trước buổi hướng dẫn.'],
        ['The bicycle workshop opens at noon.', 'Giờ mở cửa xưởng không tạo thêm thời gian phát thẻ trước 10 giờ.'],
        ['You can pick up your badge after the session.', 'After the session mâu thuẫn với before the session starts ở câu sau.'],
        ['The main hall can seat sixty people.', 'Sức chứa của phòng cũ không giải thích việc phát thẻ trước khi bắt đầu.'],
      ],
      rationale: 'Cụm This gives us time ở câu sau nhắc lại việc tình nguyện viên đến sớm mười phút.',
      grammar: 'This thay cho sự việc vừa nêu',
      vocabulary: ['hand out · phát cho mọi người', 'name badge · thẻ tên'],
      keywords: ['This gives us time', 'before the session starts'],
      tip: 'Khi điền cả câu, đọc cả câu sau ô trống để xác định từ như this đang nhắc tới điều gì.',
    },
    {
      id: 'r6-03',
      prompt: fillBlank(3),
      answer: 3,
      options: [
        ['borrow', 'Người đọc đã được phát thẻ nên không cần mượn lại thẻ.'],
        ['leave', 'Leave it with you không diễn đạt yêu cầu đem theo thẻ đến buổi học.'],
        ['send', 'Send thường chỉ việc gửi đồ đến người hoặc địa điểm khác.'],
        ['bring', 'Bring it with you nghĩa là mang thẻ theo khi đến buổi hướng dẫn.'],
      ],
      rationale: 'It thay cho a badge. Người đã nhận thẻ cần mang thẻ theo, nên dùng bring.',
      grammar: 'Please + động từ nguyên mẫu',
      vocabulary: ['bring it with you · mang nó theo', 'receive a badge · nhận thẻ'],
      keywords: ['already received', 'with you'],
      tip: 'Xác định danh từ mà đại từ it thay thế để chọn cụm động từ thích hợp.',
    },
  ]),
  ...readingPassageQuestions(6, 'Notice', [{
    title: 'Notice · Hatchmere Community Pool',
    text: `The pool will open at 12 noon (1) _____ Tuesday, October 13. Staff will test the new water filters in the morning. The changing rooms and the front desk will also open at noon.

(2) _____ Reception staff will contact affected swimmers to arrange a replacement lesson. Public swimming will run on its usual schedule starting Wednesday.

We appreciate your (3) _____ while we finish this work.`,
  }], [
    {
      id: 'r6-04',
      prompt: fillBlank(1),
      answer: 1,
      options: [
        ['at', 'At đi với giờ, ví dụ at 12 noon, nhưng ô trống đứng trước ngày.'],
        ['on', 'On đi với thứ trong tuần và ngày cụ thể.'],
        ['in', 'In dùng với tháng hoặc năm khi không nêu ngày cụ thể.'],
        ['from', 'From chỉ thời điểm bắt đầu một khoảng thời gian. Đoạn này thông báo giờ mở cửa muộn cho một ngày.'],
      ],
      rationale: 'Tuesday, October 13 là một ngày cụ thể. Dùng on để gắn thông báo mở lúc trưa với ngày đó.',
      grammar: 'On + ngày',
      vocabulary: ['water filter · bộ lọc nước', 'changing room · phòng thay đồ'],
      keywords: ['Tuesday, October 13'],
      tip: 'Với hai mốc trong một câu, kiểm tra danh từ đứng ngay sau mỗi chỗ trống.',
    },
    {
      id: 'r6-05',
      prompt: fillBlank(2),
      answer: 3,
      options: [
        ['The morning lessons are especially popular this month.', 'Mức độ phổ biến không giải thích vì sao nhân viên phải sắp xếp buổi học thay thế.'],
        ['Lockers are available near the entrance.', 'Vị trí tủ đồ không liên quan đến affected swimmers hoặc replacement lesson.'],
        ['All evening classes will run as planned.', 'Các lớp diễn ra đúng lịch thì không cần buổi thay thế.'],
        ['The two swim lessons planned for that morning have been canceled.', 'Việc hủy hai lớp sáng giải thích ai bị ảnh hưởng và vì sao cần buổi học thay thế.'],
      ],
      rationale: 'Affected swimmers là những người đăng ký hai lớp bơi sáng bị hủy do hồ mở cửa muộn.',
      grammar: 'Hiện tại hoàn thành bị động: have been + V3',
      vocabulary: ['affected swimmer · người học bơi bị ảnh hưởng', 'replacement lesson · buổi học thay thế'],
      keywords: ['affected swimmers', 'replacement lesson'],
      tip: 'Tìm đối tượng được nhắc lại ở câu kế tiếp để kiểm tra mạch thông tin.',
    },
    {
      id: 'r6-06',
      prompt: fillBlank(3),
      answer: 0,
      options: [
        ['patience', 'Patience là danh từ chỉ sự kiên nhẫn và tạo cụm lịch sự appreciate your patience.'],
        ['patient', 'Patient là tính từ hoặc danh từ chỉ bệnh nhân, không chỉ sự kiên nhẫn.'],
        ['patiently', 'Patiently là trạng từ, không đứng sau your trong cụm này.'],
        ['impatience', 'Impatience nghĩa là sự thiếu kiên nhẫn, trái với ý cảm ơn khách đã chờ đợi.'],
      ],
      rationale: 'Thông báo cảm ơn khách đã kiên nhẫn trong thời gian công việc còn dang dở.',
      grammar: 'Your + danh từ',
      vocabulary: ['appreciate your patience · cảm ơn sự kiên nhẫn của bạn', 'finish this work · hoàn tất công việc này'],
      keywords: ['your', 'while we finish this work'],
      tip: 'Trong thông báo dịch vụ, appreciate your patience thường đi cùng thông tin gây bất tiện tạm thời.',
    },
  ]),
  ...readingPassageQuestions(6, 'Advertisement', [{
    title: 'Advertisement · Cleaford Cycle Shop',
    text: `Make your next ride more comfortable. From March 4 to 18, our mechanics will check your brakes and adjust your seat for a (1) _____ price of $22. The offer is available for standard bicycles only.

(2) _____ This allows us to have a mechanic ready when you arrive. Each appointment takes (3) _____ 25 minutes, but repairs that we identify during an inspection may require a separate visit.`,
  }], [
    {
      id: 'r6-07',
      prompt: fillBlank(1),
      answer: 2,
      options: [
        ['specialty', 'Specialty là danh từ chỉ sản phẩm hoặc lĩnh vực chuyên môn, không mô tả mức giá ưu đãi.'],
        ['specially', 'Specially là trạng từ, không bổ nghĩa trực tiếp cho price.'],
        ['special', 'Special là tính từ đứng trước price và chỉ mức giá ưu đãi.'],
        ['specialize', 'Specialize là động từ chỉ việc chuyên về một lĩnh vực.'],
      ],
      rationale: 'A special price of $22 là mức giá ưu đãi 22 đô la trong thời gian quảng cáo.',
      grammar: 'A + tính từ + danh từ',
      vocabulary: ['special price · giá ưu đãi', 'adjust your seat · chỉnh yên xe'],
      keywords: ['a', 'price'],
      tip: 'Giá ưu đãi thường đi cùng special price, introductory rate hoặc discounted fee.',
    },
    {
      id: 'r6-08',
      prompt: fillBlank(2),
      answer: 1,
      options: [
        ['Bicycle helmets are sold next to the register.', 'Nơi bán mũ bảo hiểm không giúp cửa hàng bố trí thợ khi khách tới.'],
        ['Please book a time before bringing in your bicycle.', 'Đặt giờ trước giúp cửa hàng sắp sẵn thợ khi khách đến.'],
        ['We recently changed the color of our shop sign.', 'Đổi màu bảng hiệu không liên quan đến việc sắp xếp thợ.'],
        ['You can pay by card at the front desk.', 'Cách thanh toán không cung cấp thời điểm khách đến cho cửa hàng.'],
      ],
      rationale: 'This allows us to have a mechanic ready nối với yêu cầu đặt lịch trước.',
      grammar: 'Allow + người + to-infinitive',
      vocabulary: ['book a time · đặt lịch', 'mechanic · thợ sửa xe'],
      keywords: ['mechanic ready', 'when you arrive'],
      tip: 'Khi đoạn văn nêu lợi ích của một việc, tìm hành động trực tiếp tạo ra lợi ích đó.',
    },
    {
      id: 'r6-09',
      prompt: fillBlank(3),
      answer: 3,
      options: [
        ['approximately of', 'Không dùng of giữa approximately và số chỉ thời gian.'],
        ['approximation', 'Approximation là danh từ và không bổ nghĩa trực tiếp cho con số.'],
        ['approximate', 'Approximate dạng tính từ phù hợp trong an approximate duration nhưng không đứng trực tiếp trước số trong mẫu này.'],
        ['approximately', 'Approximately đứng trước con số và cho biết thời lượng ước chừng.'],
      ],
      rationale: 'Takes approximately 25 minutes báo thời lượng kiểm tra xe khoảng 25 phút.',
      grammar: 'Trạng từ ước lượng + số',
      vocabulary: ['approximately · xấp xỉ', 'inspection · lần kiểm tra', 'separate visit · lượt đến khác'],
      keywords: ['takes', '25 minutes'],
      tip: 'Approximately, about và around thường đứng ngay trước con số ước tính.',
    },
  ]),
  ...readingPassageQuestions(6, 'Memo', [{
    title: 'Memo · Shared printer setup',
    text: `To: Staff on the second floor
From: Laila Chen, Facilities
Date: June 16

The shared printer beside Meeting Room B will be replaced (1) _____ Thursday morning. Installation is expected to finish by 11 a.m. While it is in progress, please use the printer in the ground-floor resource room.

The replacement printer requires a new access code. (2) _____ Keep that message so you can find the code when you next need to print. Please contact Facilities if you do not receive it by 12 noon.

All print jobs left in the old queue will be (3) _____ during installation, so please send them again afterwards.`,
  }], [
    {
      id: 'r6-10',
      prompt: fillBlank(1),
      answer: 0,
      options: [
        ['on', 'On Thursday morning chỉ thời gian lắp máy vào sáng thứ Năm.'],
        ['at', 'At thường đứng trước giờ hoặc một thời điểm ngắn như at noon.'],
        ['since', 'Since chỉ mốc bắt đầu của thời kỳ kéo dài, không hợp với việc thay máy vào một buổi tương lai.'],
        ['until', 'Until chỉ hành động hoặc trạng thái kéo dài đến mốc, nhưng be replaced ở đây là một sự kiện bắt đầu vào sáng thứ Năm.'],
      ],
      rationale: 'Dùng on với tên ngày kèm buổi trong ngày, chẳng hạn on Thursday morning.',
      grammar: 'On + thứ trong tuần + buổi trong ngày',
      vocabulary: ['shared printer · máy in dùng chung', 'installation · việc lắp đặt'],
      keywords: ['Thursday morning'],
      tip: 'Dùng in the morning nếu chỉ nói buổi, nhưng on nếu có tên ngày đi cùng.',
    },
    {
      id: 'r6-11',
      prompt: fillBlank(2),
      answer: 2,
      options: [
        ['The code is written on a sticker beside the printer.', 'Một nhãn dán không phải tin nhắn có thể lưu hoặc nhận vào buổi trưa.'],
        ['The new printer sits beside the same meeting room.', 'Vị trí máy in không cung cấp mã và không giải thích that message.'],
        ['We will send it to all second-floor staff by email.', 'Email là tin nhắn được nhắc ở câu sau và it thay cho mã truy cập.'],
        ['Print speeds vary depending on the paper size.', 'Tốc độ in không liên quan tới mã truy cập hoặc tin nhắn cần giữ.'],
      ],
      rationale: 'That message và do not receive it phù hợp với việc mã mới được gửi qua email cho nhân viên tầng hai.',
      grammar: 'Đại từ it thay cho danh từ xuất hiện trước',
      vocabulary: ['access code · mã truy cập', 'by email · qua email'],
      keywords: ['access code', 'that message', 'receive it'],
      tip: 'Một câu điền phù hợp thường nối được chủ đề từ câu trước với đại từ chỉ định ở câu sau.',
    },
    {
      id: 'r6-12',
      prompt: fillBlank(3),
      answer: 1,
      options: [
        ['stored', 'Nếu lệnh in được lưu, yêu cầu gửi lại vì lý do lắp đặt sẽ không hợp lý.'],
        ['deleted', 'Nếu lệnh in cũ bị xóa, người dùng cần gửi lại sau khi lắp máy.'],
        ['completed', 'Lệnh in đã hoàn thành không cần gửi lại.'],
        ['delivered', 'Delivered không diễn đạt việc lệnh in bị mất khỏi hàng đợi.'],
      ],
      rationale: 'So please send them again cho biết các lệnh in đang chờ sẽ bị xóa khi lắp máy.',
      grammar: 'Tương lai bị động: will be + V3',
      vocabulary: ['print job · lệnh in', 'print queue · hàng đợi in', 'delete · xóa'],
      keywords: ['old queue', 'send them again'],
      tip: 'Từ so báo hiệu kết quả. Dùng kết quả để suy ra sự kiện phù hợp trước nó.',
    },
  ]),
  ...readingPassageQuestions(6, 'Letter', [{
    title: 'Letter · Silverbend Conference Center',
    text: `Dear Ms. Kim,

Thank you for reserving the Rowan Room on August 9. We have set it up for a group of 24, as (1) _____ on your online reservation. The booking includes the use of a projector and wireless internet.

There is one change to the catering arrangement. The usual supplier cannot deliver that day. (2) _____ The new supplier can provide the same menu at the agreed price.

Please confirm your final guest count no later than August 4 so we can (3) _____ the correct number of meals.

Sincerely,
Omar Lewis`,
  }], [
    {
      id: 'r6-13',
      prompt: fillBlank(1),
      answer: 3,
      options: [
        ['indicate', 'Động từ nguyên mẫu không phù hợp với cụm rút gọn chỉ thông tin đã được ghi.'],
        ['indicates', 'Indicates cần một chủ ngữ và không tạo đúng cụm as indicated.'],
        ['indicating', 'Indicating mang nghĩa chủ động, còn thông tin được ghi trong đơn đặt chỗ.'],
        ['indicated', 'As indicated là dạng rút gọn của as it was indicated và nghĩa là như đã ghi.'],
      ],
      rationale: 'Số lượng 24 khách là thông tin đã ghi trên đơn đặt chỗ, nên dùng as indicated.',
      grammar: 'As + phân từ quá khứ trong mệnh đề bị động rút gọn',
      vocabulary: ['set up a room · bố trí phòng', 'reservation · đặt chỗ'],
      keywords: ['as', 'on your online reservation'],
      tip: 'Các cụm as requested, as discussed và as indicated thường nhắc tới thông tin đã có.',
    },
    {
      id: 'r6-14',
      prompt: fillBlank(2),
      answer: 1,
      options: [
        ['As a result, lunch has been removed from your booking.', 'Việc đã bỏ bữa trưa khỏi đơn không phù hợp khi câu sau nói nhà cung cấp mới có thể phục vụ cùng thực đơn.'],
        ['We have arranged for another supplier to deliver lunch.', 'Câu này giải thích đã tìm được đơn vị khác và giới thiệu đối tượng the new supplier.'],
        ['Please bring your own projector.', 'Thông tin máy chiếu không liên quan đến việc thay nhà cung cấp suất ăn.'],
        ['The original supplier will deliver as planned.', 'Câu trước cho biết nhà cung cấp cũ không giao hàng hôm đó.'],
      ],
      rationale: 'Another supplier giới thiệu đơn vị thay thế. The new supplier trong câu tiếp theo nói về đơn vị đó.',
      grammar: 'Another + danh từ đếm được số ít',
      vocabulary: ['catering arrangement · kế hoạch phục vụ ăn uống', 'supplier · nhà cung cấp'],
      keywords: ['usual supplier', 'new supplier'],
      tip: 'Tìm câu giải quyết vấn đề vừa nêu và làm rõ chủ thể xuất hiện ngay sau ô trống.',
    },
    {
      id: 'r6-15',
      prompt: fillBlank(3),
      answer: 0,
      options: [
        ['order', 'Order the correct number of meals nghĩa là đặt đúng số suất ăn.'],
        ['cancel', 'Mục đích hỏi số khách là để đặt suất ăn, không phải hủy bữa.'],
        ['borrow', 'Borrow nghĩa là mượn để hoàn lại, không dùng với suất ăn.'],
        ['refund', 'Refund nói về hoàn lại tiền. Đoạn không nhắc hoàn phí.'],
      ],
      rationale: 'Trung tâm cần số khách cuối cùng để đặt đúng số suất ăn, nên chọn order.',
      grammar: 'Can + động từ nguyên mẫu',
      vocabulary: ['guest count · số lượng khách', 'order meals · đặt suất ăn', 'no later than · chậm nhất vào'],
      keywords: ['final guest count', 'number of meals'],
      tip: 'Cụm so we can chỉ mục đích. Hãy chọn hành động cần đến thông tin vừa yêu cầu.',
    },
  ]),
];
