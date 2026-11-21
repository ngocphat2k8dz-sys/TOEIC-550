import { readingPassageQuestions } from './reading-authoring';

export const partSevenQuestions = [
  ...readingPassageQuestions(7, 'Single Passage', [{
    title: 'Article · After-hours book pickup',
    text: `Two Greenwick Library branches have added outdoor lockers for readers who cannot visit during regular hours. The Cedar Street and Riverside branches are the first to offer the service. When placing a hold online, readers can select “Outdoor Locker” at either location.

As soon as an item is ready, the library sends a six-digit code by text message. Readers have three days to collect the item. After that, it returns to the regular hold shelf for one more day before it is offered to the next reader. Oversized books are still held at the service desk because they do not fit inside the lockers.`,
  }], [
    {
      id: 'r7-01',
      prompt: 'What is the main purpose of the article?',
      answer: 1,
      options: [
        ['To invite people to apply for library jobs', 'Bài không đề cập tuyển nhân viên hay cách ứng tuyển.'],
        ['To introduce a new pickup option for library users', 'Bài giới thiệu tủ lấy sách ngoài giờ và giải thích cách dùng dịch vụ.'],
        ['To announce shorter opening hours at the Riverside branch', 'Bài nhắc regular hours để nêu lợi ích của tủ, không thay đổi giờ mở cửa.'],
        ['To explain how to return damaged books', 'Quy trình trong bài là nhận sách đặt trước, không phải trả sách hỏng.'],
      ],
      rationale: 'Câu mở đầu giới thiệu outdoor lockers. Các chi tiết còn lại giải thích cách chọn tủ và nhận sách.',
      vocabulary: ['outdoor locker · tủ khóa ngoài trời', 'place a hold · đặt giữ sách trước'],
      keywords: ['outdoor lockers', 'cannot visit during regular hours'],
      tip: 'Câu hỏi mục đích thường được trả lời bằng ý xuất hiện ở câu mở đầu và xuyên suốt đoạn.',
    },
    {
      id: 'r7-02',
      prompt: 'How does a reader receive the code for a locker?',
      answer: 3,
      options: [
        ['It appears on the library card.', 'Bài không nói in hoặc hiển thị mã trên thẻ thư viện.'],
        ['It is given at the service desk.', 'Quầy dịch vụ giữ sách quá khổ, còn mã được gửi khi sách trong tủ sẵn sàng.'],
        ['It is printed on a receipt.', 'Không có biên lai nào được nêu trong quy trình đặt giữ sách.'],
        ['It is sent in a text message.', 'Câu đầu đoạn hai nêu rõ gửi mã sáu chữ số qua tin nhắn.'],
      ],
      rationale: 'By text message mô tả cách người đọc nhận mã để mở tủ.',
      vocabulary: ['six-digit code · mã sáu chữ số', 'text message · tin nhắn'],
      keywords: ['sends', 'by text message'],
      tip: 'Đọc quanh cụm code để tìm giới từ by và phương thức gửi đi kèm.',
    },
    {
      id: 'r7-03',
      prompt: 'What is indicated about oversized books?',
      answer: 0,
      options: [
        ['They must be picked up at the service desk.', 'Sách quá khổ vẫn được giữ tại quầy vì không vừa tủ.'],
        ['They may be held in a locker for one additional day.', 'Thêm một ngày là thời gian trên kệ giữ sách thông thường sau khi hết hạn tủ.'],
        ['They are available only at Cedar Street.', 'Bài không giới hạn sách quá khổ cho chi nhánh Cedar Street.'],
        ['They require an eight-digit pickup code.', 'Bài chỉ nhắc mã sáu chữ số và sách quá khổ không dùng tủ.'],
      ],
      rationale: 'Still held at the service desk cho thấy ngoại lệ đối với sách không vừa tủ.',
      vocabulary: ['oversized · quá khổ', 'fit inside · vừa bên trong'],
      keywords: ['Oversized books', 'service desk'],
      tip: 'Các từ still, only và except thường báo hiệu một ngoại lệ đáng chú ý.',
    },
  ]),
  ...readingPassageQuestions(7, 'Single Passage', [{
    title: 'Notice · Ashmere Market deliveries',
    text: `Attention Ashmere Market vendors:

The freight elevator near Gate B will be unavailable on Monday, May 11, from 7 a.m. until 1 p.m. while a technician replaces its control panel. During this time, use Gate D for deliveries. A market attendant at Gate D can help carry boxes to your stall.

The front entrance will remain open to shoppers throughout the morning. To keep that walkway clear, delivery carts must stay out of the front lobby. Vendors expecting a delivery of more than 20 boxes should call the market office before Friday to arrange a time after the repair.`,
  }], [
    {
      id: 'r7-04',
      prompt: 'Where should a vendor go for a small delivery at 9 a.m. on May 11?',
      answer: 2,
      options: [
        ['Gate B', 'Thang chở hàng gần Gate B không hoạt động từ 7 giờ đến 13 giờ.'],
        ['The front lobby', 'Thông báo yêu cầu xe chở hàng không đi vào sảnh trước.'],
        ['Gate D', 'Trong lúc sửa thang, Gate D là điểm giao hàng được chỉ định.'],
        ['The market office', 'Văn phòng nhận cuộc gọi để hẹn lô hơn 20 hộp, không phải cổng giao hàng.'],
      ],
      rationale: '9 giờ nằm trong khung 7 giờ đến 13 giờ. Trong khung này, người bán dùng Gate D cho các lần giao nhỏ.',
      vocabulary: ['freight elevator · thang máy chở hàng', 'stall · quầy hàng'],
      keywords: ['from 7 a.m. until 1 p.m.', 'use Gate D'],
      tip: 'Đối chiếu giờ trong câu hỏi với khoảng thời gian áp dụng hướng dẫn.',
    },
    {
      id: 'r7-05',
      prompt: 'What will remain available to shoppers during the repair?',
      answer: 0,
      options: [
        ['The front entrance', 'Thông báo nói lối chính vẫn mở cho khách mua hàng suốt buổi sáng.'],
        ['The freight elevator', 'Thang chở hàng là thiết bị đang sửa.'],
        ['Help carrying delivery boxes', 'Nhân viên ở Gate D giúp người bán chuyển hàng đến quầy, không phải dịch vụ được nêu cho người mua.'],
        ['Delivery cart access through the lobby', 'Xe giao hàng phải tránh sảnh trước để giữ lối đi thông thoáng.'],
      ],
      rationale: 'Remain open to shoppers xác nhận khách mua hàng vẫn vào được qua lối chính.',
      vocabulary: ['remain open · tiếp tục mở cửa', 'keep the walkway clear · giữ lối đi thông thoáng'],
      keywords: ['front entrance', 'shoppers'],
      tip: 'Kiểm tra đối tượng mà quy định áp dụng, vì cùng một địa điểm có thể có hướng dẫn khác nhau cho khách và nhà bán.',
    },
    {
      id: 'r7-06',
      prompt: 'What should a vendor with a delivery of 26 boxes do?',
      answer: 3,
      options: [
        ['Bring the boxes through the front lobby.', 'Sảnh trước cấm xe giao hàng trong thời gian sửa.'],
        ['Leave the boxes at Gate B at 7 a.m.', '7 giờ là lúc bắt đầu ngừng sử dụng thang gần Gate B.'],
        ['Ask a shopper to help with the boxes.', 'Thông báo không yêu cầu khách mua hỗ trợ giao hàng.'],
        ['Call the market office before Friday.', '26 lớn hơn 20 nên người bán cần gọi trước thứ Sáu để hẹn sau sửa chữa.'],
      ],
      rationale: 'More than 20 boxes đặt điều kiện cho lô lớn. Hành động được yêu cầu là gọi văn phòng trước thứ Sáu.',
      vocabulary: ['arrange a time · sắp xếp giờ', 'expect a delivery · dự kiến nhận hàng'],
      keywords: ['more than 20 boxes', 'call the market office'],
      tip: 'Với ngưỡng số lượng như more than, so sánh số trong tình huống trước khi chọn quy định.',
    },
  ]),
  ...readingPassageQuestions(7, 'Double Passage', [
    {
      title: 'Advertisement · First product photos workshop',
      text: `Brightloom Studio is offering a beginner workshop on taking product photos with a phone. Saturday, May 30 has two sessions, 9 to 11 a.m. and 2 to 4 p.m. Both cover lighting small items and choosing a plain background.

The fee is $36, or $28 for studio members. Bring a charged phone and one small item to photograph. The studio provides lamps and backgrounds. Complete the registration form by May 26 to reserve a place.`,
    },
    {
      title: 'Form · Workshop registration',
      text: `Name: Tessa Park
Studio member: Yes
Preferred session: May 30, 2 to 4 p.m.
Item for practice: A handmade ceramic cup
Registration submitted: May 23
Request: I would like to work near a power outlet because my phone battery runs out quickly.`,
    },
  ], [
    {
      id: 'r7-07',
      prompt: 'How much should Tessa pay for the workshop?',
      answer: 1,
      options: [
        ['$8', '8 đô là mức chênh lệch giữa hai giá, không phải học phí.'],
        ['$28', 'Mẫu đăng ký ghi Tessa là hội viên, áp dụng học phí hội viên 28 đô.'],
        ['$36', '36 đô là giá thường cho người không phải hội viên.'],
        ['$64', 'Đây là tổng hai mức phí, nhưng mỗi người chỉ trả một mức.'],
      ],
      rationale: 'Nối Studio member: Yes trên mẫu với $28 for studio members trong quảng cáo để xác định học phí.',
      vocabulary: ['fee · học phí hoặc lệ phí', 'studio member · hội viên studio'],
      keywords: ['$28 for studio members', 'Studio member: Yes'],
      tip: 'Đọc giá trong quảng cáo rồi tìm điều kiện tương ứng với người cụ thể trong văn bản thứ hai.',
    },
    {
      id: 'r7-08',
      prompt: 'What will Tessa most likely photograph during the workshop?',
      answer: 2,
      options: [
        ['A lamp', 'Studio cung cấp đèn để chiếu sáng, mẫu không ghi dùng đèn làm vật chụp.'],
        ['A plain background', 'Phông nền hỗ trợ chụp ảnh, không phải món đồ thực hành đã chọn.'],
        ['A ceramic cup', 'Mẫu ghi chiếc cốc gốm thủ công ở mục Item for practice.'],
        ['A phone charger', 'Tessa xin chỗ gần ổ điện vì pin yếu, nhưng không đăng ký chụp bộ sạc.'],
      ],
      rationale: 'Quảng cáo yêu cầu đem một đồ vật nhỏ, và Tessa ghi rõ món cô đem để thực hành là một chiếc cốc gốm.',
      vocabulary: ['handmade ceramic cup · cốc gốm làm thủ công', 'power outlet · ổ cắm điện'],
      keywords: ['item to photograph', 'Item for practice'],
      tip: 'Phân biệt dụng cụ được cấp với đồ người tham gia chủ động mang đến.',
    },
    {
      id: 'r7-09',
      prompt: 'What can be concluded about Tessa’s registration?',
      answer: 0,
      options: [
        ['It was submitted before the deadline.', 'Mẫu gửi ngày 23 tháng 5, trước hạn ngày 26 tháng 5.'],
        ['It was for the morning session.', 'Tessa chọn 2 đến 4 giờ chiều.'],
        ['It included a request to borrow a phone.', 'Tessa xin chỗ gần ổ cắm để dùng điện thoại của mình.'],
        ['It was submitted on the day of the workshop.', 'Lớp học ngày 30 tháng 5, sau ngày gửi mẫu một tuần.'],
      ],
      rationale: 'So sánh ngày trên mẫu với hạn đăng ký trong quảng cáo. Ngày 23 đến trước ngày 26 tháng 5.',
      vocabulary: ['submit a registration · gửi đơn đăng ký', 'reserve a place · giữ chỗ'],
      keywords: ['by May 26', 'submitted: May 23'],
      tip: 'Khi có nhiều ngày, ghi nhanh ngày sự kiện, hạn cuối và ngày thực tế để tránh nhầm.',
    },
  ]),
  ...readingPassageQuestions(7, 'Double Passage', [
    {
      title: 'Email · Neighborhood guide print proof',
      text: `To: Omar Haddad
From: Mia Nolan
Subject: Guide proof for the printers

Hi Omar,

The printers can start the neighborhood guide tomorrow if we send the approved proof by 4 p.m. today. Could you check the street names on the map? I have already checked the opening hours listed on page 3.

Please let me know of any corrections by 3 p.m. so I can update the file before it goes out.

Thanks,
Mia`,
    },
    {
      title: 'Message · Map correction',
      text: `2:35 p.m. — Omar: I checked the map against the city directory. One change on page 2: “Briar Place” should read “Briar Lane.” Everything else on the map is accurate.

2:42 p.m. — Mia: Thanks. I’ll fix that entry and send the proof to the printers by four.`,
    },
  ], [
    {
      id: 'r7-10',
      prompt: 'Which task did Mia ask Omar to do?',
      answer: 3,
      options: [
        ['Ask the printers for a later deadline.', 'Mia nêu hạn của nhà in và không yêu cầu đàm phán lại.'],
        ['Update the opening hours on page 3.', 'Mia nói cô đã kiểm tra giờ hoạt động trên trang 3.'],
        ['Send the proof directly to the printers.', 'Mia sẽ cập nhật và gửi bản in thử.'],
        ['Check the street names on the map.', 'Mia hỏi trực tiếp Could you check the street names on the map?'],
      ],
      rationale: 'Could you check... là lời yêu cầu. Mia giao Omar việc soát tên đường, còn cô xử lý giờ mở cửa và gửi bản cuối.',
      vocabulary: ['print proof · bản in thử', 'street name · tên đường'],
      keywords: ['Could you check', 'street names'],
      tip: 'Trong email công việc, tìm câu hỏi lịch sự như Could you để nhận ra nhiệm vụ được giao.',
    },
    {
      id: 'r7-11',
      prompt: 'What will Mia change on page 2?',
      answer: 1,
      options: [
        ['The opening time of the printers', 'Giờ hoạt động đã kiểm tra trên trang 3, không liên quan đến chỉnh sửa trang 2.'],
        ['A street name from Briar Place to Briar Lane', 'Omar nêu tên đang ghi và tên đúng cho đúng một mục trên bản đồ trang 2.'],
        ['The name of the city directory', 'City directory là nguồn đối chiếu, không phải chi tiết cần sửa trong hướng dẫn.'],
        ['The date for printing the guide', 'Tin nhắn không nói đến thay đổi ngày in.'],
      ],
      rationale: 'Briar Place should read Briar Lane xác định hướng sửa từ bản đang có sang tên đúng.',
      vocabulary: ['directory · danh bạ hoặc danh mục', 'should read · phải được ghi là'],
      keywords: ['One change on page 2', 'should read'],
      tip: 'Với cấu trúc X should read Y, X là thông tin cũ, Y là thông tin thay thế.',
    },
    {
      id: 'r7-12',
      prompt: 'What is suggested about Omar’s reply?',
      answer: 2,
      options: [
        ['It was sent after the approved proof went out.', 'Mia vẫn nói sẽ sửa và gửi bản in thử sau khi đọc tin nhắn.'],
        ['It stated that no corrections were needed.', 'Omar tìm được một tên đường cần chỉnh.'],
        ['It arrived in time for Mia to make the correction.', 'Omar phản hồi 2:35 p.m., trước hạn 3 p.m. mà Mia yêu cầu.'],
        ['It dealt mainly with the opening hours on page 3.', 'Tin nhắn nói về bản đồ trang 2 và tên đường.'],
      ],
      rationale: 'Hạn báo chỉnh sửa trong email là 3 giờ chiều. Tin nhắn lúc 2:35 đến kịp để Mia cập nhật tệp.',
      vocabulary: ['make a correction · thực hiện chỉnh sửa', 'in time · kịp lúc'],
      keywords: ['by 3 p.m.', '2:35 p.m.'],
      tip: 'Với câu suy luận về thời gian, ghép hạn trong email với dấu giờ ở tin nhắn.',
    },
  ]),
  ...readingPassageQuestions(7, 'Triple Passage', [
    {
      title: 'Schedule · Westmere Service Center, September 12',
      text: `9:00 a.m. — New volunteer orientation — Maple Room
10:00 a.m. — Sorting donated books — Storage Room
10:30 a.m. — New volunteer orientation — Elm Room
11:30 a.m. — Packing school supplies — Main Hall

Orientation lasts 25 minutes. New volunteers only need to attend one orientation before taking part in another activity.`,
    },
    {
      title: 'Email · First volunteer shift',
      text: `To: Priya Shah
From: Elena Reed, Volunteer Coordinator

Welcome to the center! I have you down for the 9 a.m. orientation and the 11:30 a.m. packing activity. Please check in at the front desk on arrival. Bring a photo ID so we can issue your volunteer badge. If your arrival time changes, message me and I will check whether there is space in the later orientation.`,
    },
    {
      title: 'Messages · September 12',
      text: `8:15 a.m. — Priya: My train is delayed, so I expect to reach the center at 10:20. Can I still help pack supplies?

8:23 a.m. — Elena: Yes. I’ve reserved a spot for you in the later orientation. The packing activity will run as scheduled. I’ll let the front desk know you’re coming.`,
    },
  ], [
    {
      id: 'r7-13',
      prompt: 'Which room will Priya visit for orientation?',
      answer: 0,
      options: [
        ['Elm Room', 'Buổi hướng dẫn muộn hơn bắt đầu 10:30 tại Elm Room và đã có chỗ cho Priya.'],
        ['Maple Room', 'Đây là phòng của buổi 9 giờ mà Priya không thể đến kịp.'],
        ['Storage Room', 'Đây là nơi phân loại sách, không phải nơi hướng dẫn.'],
        ['Main Hall', 'Đây là nơi đóng gói đồ dùng học tập sau buổi hướng dẫn.'],
      ],
      rationale: 'Later orientation trong tin nhắn là buổi 10:30 trong lịch. Lịch ghi buổi này ở Elm Room.',
      vocabulary: ['orientation · buổi hướng dẫn ban đầu', 'reserve a spot · giữ một chỗ'],
      keywords: ['later orientation', '10:30 a.m.', 'Elm Room'],
      tip: 'Khi một văn bản dùng từ later, tìm tất cả các lượt của cùng hoạt động trong lịch để xác định lượt sau.',
    },
    {
      id: 'r7-14',
      prompt: 'What should Priya show at the front desk?',
      answer: 2,
      options: [
        ['A train ticket', 'Vé tàu không phải thứ được trung tâm yêu cầu xuất trình.'],
        ['A sample school supply pack', 'Việc đóng gói diễn ra sau buổi hướng dẫn, không cần mang mẫu lúc điểm danh.'],
        ['A photo ID', 'Email yêu cầu mang giấy tờ có ảnh để trung tâm cấp thẻ tình nguyện viên.'],
        ['An existing volunteer badge', 'Priya là người mới và sẽ nhận thẻ sau khi xuất trình giấy tờ có ảnh.'],
      ],
      rationale: 'Bring a photo ID là hướng dẫn đi kèm việc điểm danh ở quầy và cấp thẻ.',
      vocabulary: ['photo ID · giấy tờ tùy thân có ảnh', 'issue a badge · cấp thẻ'],
      keywords: ['check in', 'photo ID'],
      tip: 'Tìm các câu mệnh lệnh như bring hoặc show để xác định vật cần chuẩn bị.',
    },
    {
      id: 'r7-15',
      prompt: 'Why can Priya still take part in the packing activity?',
      answer: 3,
      options: [
        ['The packing activity has moved to the afternoon.', 'Elena xác nhận hoạt động giữ nguyên giờ 11:30.'],
        ['The center has waived the orientation requirement.', 'Trung tâm vẫn yêu cầu tham gia một buổi hướng dẫn và đã giữ chỗ ở lượt sau.'],
        ['She attended the 9 a.m. orientation.', 'Cô dự kiến đến 10:20 nên lỡ buổi 9 giờ.'],
        ['The later orientation ends before packing begins.', 'Buổi 10:30 kéo dài 25 phút, kết thúc lúc 10:55, trước giờ đóng gói 11:30.'],
      ],
      rationale: 'Tin nhắn xác nhận Priya dự được lượt sau. Lịch cho biết lượt đó kết thúc lúc 10:55, nên cô đáp ứng yêu cầu hướng dẫn trước hoạt động 11:30.',
      vocabulary: ['run as scheduled · diễn ra theo lịch', 'take part in · tham gia'],
      keywords: ['10:30 a.m.', '25 minutes', '11:30 a.m.'],
      tip: 'Đối chiếu quy định tham gia, giờ bắt đầu và thời lượng khi câu hỏi yêu cầu suy ra lịch trình.',
    },
  ]),
];
