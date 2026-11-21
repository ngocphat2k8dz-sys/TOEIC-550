import type { Question } from '../types'

export interface VocabularyWord {
  id: string
  topic: string
  word: string
  ipa: string
  kind: string
  meaning: string
  example: string
  collocation: string
  synonym?: string
}

type WordEntry = [word: string, ipa: string, kind: string, meaning: string, example: string, collocation: string, synonym?: string]

const wordGroups: Record<string, WordEntry[]> = {
  Office: [
    ['supplies', '/səˈplaɪz/', 'danh từ số nhiều', 'vật dụng, đồ dùng', 'We keep office supplies in the cabinet by the door.', 'reorder office supplies', 'materials'],
    ['photocopier', '/ˈfoʊtoʊˌkɑːpiər/', 'danh từ', 'máy photocopy', 'The photocopier on the third floor needs more paper.', 'use the photocopier', 'copy machine'],
    ['stationery', '/ˈsteɪʃəneri/', 'danh từ không đếm được', 'văn phòng phẩm', 'Elena ordered stationery for the new office.', 'office stationery'],
  ],
  Company: [
    ['branch', '/bræntʃ/', 'danh từ', 'chi nhánh', 'The company opened a branch in Da Nang.', 'open a branch', 'local office'],
    ['headquarters', '/ˈhedkwɔːrtərz/', 'danh từ', 'trụ sở chính', 'Our headquarters will move in September.', 'corporate headquarters', 'head office'],
    ['department', '/dɪˈpɑːrtmənt/', 'danh từ', 'phòng, ban', 'Contact the sales department for a price list.', 'finance department', 'division'],
  ],
  Meeting: [
    ['agenda', '/əˈdʒendə/', 'danh từ', 'chương trình, nội dung cuộc họp', 'The budget review is first on the agenda.', 'circulate an agenda'],
    ['minutes', '/ˈmɪnɪts/', 'danh từ số nhiều', 'biên bản cuộc họp', 'I will send the meeting minutes to everyone this afternoon.', 'take meeting minutes', 'written record'],
    ['postpone', '/poʊstˈpoʊn/', 'động từ', 'hoãn sang thời điểm sau', 'We have to postpone the discussion until Friday.', 'postpone a meeting', 'put off'],
  ],
  Marketing: [
    ['campaign', '/kæmˈpeɪn/', 'danh từ', 'chiến dịch', 'The summer campaign will appear on local radio.', 'launch a campaign'],
    ['promote', '/prəˈmoʊt/', 'động từ', 'quảng bá', 'The team will promote the app at a trade fair.', 'promote a product', 'advertise'],
    ['audience', '/ˈɔːdiəns/', 'danh từ', 'khán giả, nhóm người tiếp nhận', 'The ad reached a younger audience than expected.', 'target audience', 'viewers'],
  ],
  Finance: [
    ['budget', '/ˈbʌdʒɪt/', 'danh từ', 'ngân sách', 'We have a small budget for office renovations.', 'set a budget', 'spending plan'],
    ['revenue', '/ˈrevənuː/', 'danh từ', 'doanh thu', 'Online sales accounted for half of our revenue.', 'increase revenue', 'sales income'],
    ['expense', '/ɪkˈspens/', 'danh từ', 'khoản chi phí', 'Keep a receipt for each business expense.', 'claim an expense', 'cost'],
  ],
  Banking: [
    ['deposit', '/dɪˈpɑːzɪt/', 'động từ', 'gửi tiền vào tài khoản', 'You can deposit the check through our app.', 'deposit a check', 'pay in'],
    ['withdraw', '/wɪðˈdrɔː/', 'động từ', 'rút tiền', 'Customers can withdraw cash from the machine outside.', 'withdraw cash', 'take out'],
    ['balance', '/ˈbæləns/', 'danh từ', 'số dư', 'I checked my account balance before paying the bill.', 'check a balance'],
  ],
  Travel: [
    ['itinerary', '/aɪˈtɪnəreri/', 'danh từ', 'lịch trình chuyến đi', 'Please share your travel itinerary with the office.', 'prepare an itinerary', 'travel schedule'],
    ['departure', '/dɪˈpɑːrtʃər/', 'danh từ', 'sự khởi hành', 'Please get to the station before your scheduled departure.', 'departure time'],
    ['fare', '/fer/', 'danh từ', 'giá vé đi lại', 'The bus fare is lower on weekends.', 'pay the fare', 'ticket price'],
  ],
  Hotel: [
    ['reservation', '/ˌrezərˈveɪʃən/', 'danh từ', 'việc đặt chỗ trước', 'I have a reservation for two nights.', 'make a reservation', 'booking'],
    ['amenities', '/əˈmenətiz/', 'danh từ số nhiều', 'tiện nghi', 'The hotel amenities include a gym and a pool.', 'hotel amenities', 'facilities'],
    ['vacancy', '/ˈveɪkənsi/', 'danh từ', 'phòng còn trống', 'The inn has one vacancy for Saturday evening.', 'check for vacancies', 'available room'],
  ],
  Restaurant: [
    ['appetizer', '/ˈæpətaɪzər/', 'danh từ', 'món khai vị', 'We ordered soup as an appetizer.', 'serve an appetizer', 'starter'],
    ['ingredient', '/ɪnˈɡriːdiənt/', 'danh từ', 'nguyên liệu', 'The server checked whether the sauce contained an ingredient I could not eat.', 'fresh ingredients', 'component'],
    ['portion', '/ˈpɔːrʃən/', 'danh từ', 'khẩu phần', 'A small portion of rice comes with the lunch special.', 'serve a portion', 'serving'],
  ],
  Shopping: [
    ['receipt', '/rɪˈsiːt/', 'danh từ', 'biên lai', 'Keep your receipt in case you need to exchange the shirt.', 'show a receipt', 'proof of purchase'],
    ['refund', '/ˈriːfʌnd/', 'danh từ', 'khoản tiền hoàn lại', 'The store offered a refund for the damaged kettle.', 'issue a refund', 'repayment'],
    ['discount', '/ˈdɪskaʊnt/', 'danh từ', 'khoản giảm giá', 'Members get a discount on weekend purchases.', 'offer a discount', 'price reduction'],
  ],
  Shipping: [
    ['shipment', '/ˈʃɪpmənt/', 'danh từ', 'lô hàng được gửi', 'A shipment of glass bottles arrived this morning.', 'track a shipment', 'consignment'],
    ['warehouse', '/ˈwerhaʊs/', 'danh từ', 'kho hàng', 'The boxes will stay in the warehouse until Monday.', 'store goods in a warehouse', 'storage facility'],
    ['deliver', '/dɪˈlɪvər/', 'động từ', 'giao hàng', 'We can deliver the parcel to your office tomorrow.', 'deliver a package', 'bring'],
  ],
  Recruitment: [
    ['applicant', '/ˈæplɪkənt/', 'danh từ', 'người nộp đơn ứng tuyển', 'Each applicant must submit two references.', 'screen applicants', 'candidate'],
    ['qualification', '/ˌkwɑːləfɪˈkeɪʃən/', 'danh từ', 'bằng cấp hoặc điều kiện chuyên môn', 'A food safety certificate is an essential qualification for the job.', 'meet a qualification', 'credential'],
    ['hire', '/ˈhaɪər/', 'động từ', 'tuyển dụng', 'The bakery plans to hire two assistants.', 'hire new staff', 'employ'],
  ],
  Technology: [
    ['update', '/ʌpˈdeɪt/', 'động từ', 'cập nhật', 'Please update the scheduling software before Friday.', 'update software', 'bring up to date'],
    ['device', '/dɪˈvaɪs/', 'danh từ', 'thiết bị', 'You can connect one device to the monitor at a time.', 'mobile device', 'piece of equipment'],
    ['outage', '/ˈaʊtɪdʒ/', 'danh từ', 'sự gián đoạn dịch vụ', 'An Internet outage delayed our morning orders.', 'network outage', 'service interruption'],
  ],
  'Customer Service': [
    ['inquiry', '/ˈɪnkwəri/', 'danh từ', 'câu hỏi, yêu cầu cung cấp thông tin', 'We received an inquiry about the return policy.', 'respond to an inquiry', 'question'],
    ['complaint', '/kəmˈpleɪnt/', 'danh từ', 'lời phàn nàn, khiếu nại', 'The manager called the customer to discuss her complaint.', 'handle a complaint', 'grievance'],
    ['resolve', '/rɪˈzɑːlv/', 'động từ', 'giải quyết', 'The support team resolved the billing issue by noon.', 'resolve an issue', 'settle'],
  ],
  Manufacturing: [
    ['assembly', '/əˈsembli/', 'danh từ', 'sự lắp ráp', 'Assembly takes place in the new section of the factory.', 'assembly line'],
    ['component', '/kəmˈpoʊnənt/', 'danh từ', 'linh kiện, bộ phận cấu thành', 'We test each component before installing it in the machine.', 'electronic component', 'part'],
    ['defect', '/ˈdiːfekt/', 'danh từ', 'lỗi, khuyết điểm của sản phẩm', 'An inspector found a defect in the battery cover.', 'manufacturing defect', 'flaw'],
  ],
}

export const vocabularyTopics = Object.keys(wordGroups)

export const vocabulary: VocabularyWord[] = Object.entries(wordGroups).flatMap(([topic, words]) =>
  words.map(([word, ipa, kind, meaning, example, collocation, synonym]) => ({
    id: `vocab-${word.toLowerCase()}`, topic, word, ipa, kind, meaning, example, collocation, synonym,
  })),
)

interface VocabularyExercise {
  topic: string
  prompt: string
  clues: string[]
  options: string[]
  answer: number
  reasons: string[]
  tip: string
}

const exercises: VocabularyExercise[] = [
  {
    topic: 'Office', prompt: 'We have run out of pens and folders, so I will order more office _____.', clues: ['pens and folders', 'order'],
    options: ['minutes', 'supplies', 'fares', 'branches'], answer: 1,
    reasons: ['Minutes là biên bản họp.', 'Supplies bao gồm đồ dùng như bút và bìa hồ sơ.', 'Fares là giá vé đi lại.', 'Branches là các chi nhánh.'],
    tip: 'Ghi nhớ cụm office supplies và liên hệ với ví dụ được liệt kê trong câu.',
  },
  {
    topic: 'Company', prompt: 'The company is based in Hue but has a local _____ in Quy Nhon.', clues: ['based in Hue', 'local'],
    options: ['branch', 'complaint', 'receipt', 'campaign'], answer: 0,
    reasons: ['Branch chỉ chi nhánh hoạt động ở một địa phương.', 'Complaint chỉ lời khiếu nại.', 'Receipt là biên lai.', 'Campaign là chiến dịch quảng bá.'],
    tip: 'Local office là cách nói tương đương với branch trong ngữ cảnh công ty.',
  },
  {
    topic: 'Meeting', prompt: 'Could you send the _____ so we can see which topics will be discussed tomorrow?', clues: ['which topics', 'will be discussed'],
    options: ['portion', 'deposit', 'advertisement', 'agenda'], answer: 3,
    reasons: ['Portion là khẩu phần hoặc một phần.', 'Deposit là khoản tiền gửi hoặc tiền đặt cọc.', 'Advertisement là quảng cáo.', 'Agenda liệt kê nội dung dự kiến thảo luận.'],
    tip: 'Cuộc họp sắp diễn ra cần agenda. Văn bản ghi lại nội dung đã họp là minutes.',
  },
  {
    topic: 'Marketing', prompt: 'To _____ its new hiking boots, the store will run ads in a travel magazine.', clues: ['new hiking boots', 'run ads'],
    options: ['withdraw', 'promote', 'inspect', 'postpone'], answer: 1,
    reasons: ['Withdraw nghĩa là rút tiền hoặc rút lui.', 'Promote nghĩa là quảng bá sản phẩm qua quảng cáo.', 'Inspect nghĩa là kiểm tra trực tiếp.', 'Postpone nghĩa là hoãn lại.'],
    tip: 'Promote đi cùng sản phẩm thường mang nghĩa quảng bá. Đi cùng nhân viên, từ này có thể mang nghĩa thăng chức.',
  },
  {
    topic: 'Finance', prompt: 'Ticket sales generated most of the theater’s _____ last year.', clues: ['ticket sales', 'generated'],
    options: ['expense', 'budget', 'revenue', 'receipt'], answer: 2,
    reasons: ['Expense là khoản tiền phải chi.', 'Budget là khoản tiền được lên kế hoạch chi.', 'Revenue là doanh thu thu được từ việc bán vé.', 'Receipt là biên lai cho một giao dịch.'],
    tip: 'Revenue nói về tiền thu vào từ hoạt động kinh doanh.',
  },
  {
    topic: 'Banking', prompt: 'You can _____ cash from your account at the machine by the front entrance.', clues: ['cash from your account', 'machine'],
    options: ['withdraw', 'deposit', 'deliver', 'promote'], answer: 0,
    reasons: ['Withdraw cash from an account là rút tiền từ tài khoản.', 'Deposit cash là nộp tiền vào tài khoản, thường dùng into.', 'Deliver nghĩa là giao hàng.', 'Promote nghĩa là quảng bá hoặc thăng chức.'],
    tip: 'Giới từ from gợi ý hướng tiền đi ra khỏi tài khoản.',
  },
  {
    topic: 'Travel', prompt: 'The group’s _____ lists each airport, hotel, and tour stop in order.', clues: ['lists each', 'in order'],
    options: ['receipt', 'vacancy', 'refund', 'itinerary'], answer: 3,
    reasons: ['Receipt là bằng chứng thanh toán.', 'Vacancy là chỗ hoặc phòng còn trống.', 'Refund là khoản hoàn tiền.', 'Itinerary liệt kê lịch trình tại từng điểm dừng.'],
    tip: 'Flight times, hotel dates và tour stops có thể cùng xuất hiện trong một itinerary.',
  },
  {
    topic: 'Hotel', prompt: 'Among the hotel’s _____ are a fitness room and a rooftop pool.', clues: ['fitness room', 'rooftop pool'],
    options: ['reservations', 'amenities', 'expenses', 'complaints'], answer: 1,
    reasons: ['Reservations là các lượt đặt phòng hoặc đặt chỗ.', 'Amenities là các tiện nghi như phòng tập và hồ bơi.', 'Expenses là các khoản chi.', 'Complaints là các lời phàn nàn.'],
    tip: 'Khi thấy danh sách dịch vụ hoặc cơ sở vật chất có sẵn cho khách, nghĩ đến amenities.',
  },
  {
    topic: 'Restaurant', prompt: 'The soup is served as an _____ before the main course.', clues: ['soup', 'before the main course'],
    options: ['ingredient', 'outage', 'appetizer', 'expense'], answer: 2,
    reasons: ['Ingredient là nguyên liệu làm món ăn.', 'Outage là sự cố mất dịch vụ.', 'Appetizer là món khai vị trước món chính.', 'Expense là chi phí.'],
    tip: 'Appetizer và starter có nghĩa gần nhau trong thực đơn.',
  },
  {
    topic: 'Shopping', prompt: 'The cashier issued a full _____ after I returned the defective fan.', clues: ['full', 'returned the defective fan'],
    options: ['refund', 'discount', 'receipt', 'fare'], answer: 0,
    reasons: ['Refund là khoản hoàn tiền khi trả lại hàng.', 'Discount giảm giá lúc mua.', 'Receipt là biên lai giao dịch.', 'Fare là giá vé phương tiện đi lại.'],
    tip: 'Issue a full refund nghĩa là hoàn trả toàn bộ số tiền đã thanh toán.',
  },
  {
    topic: 'Shipping', prompt: 'The _____ of printer cartridges is scheduled to arrive on Tuesday.', clues: ['printer cartridges', 'scheduled to arrive'],
    options: ['warehouse', 'refund', 'component', 'shipment'], answer: 3,
    reasons: ['Warehouse là nơi lưu kho với vị trí cố định.', 'Refund là tiền hoàn trả.', 'Component là một bộ phận trong thiết bị.', 'Shipment là lô hộp mực đang vận chuyển.'],
    tip: 'Track a shipment nghĩa là theo dõi lô hàng.',
  },
  {
    topic: 'Recruitment', prompt: 'Every _____ for the position must provide a résumé and an email address.', clues: ['for the position', 'provide a résumé'],
    options: ['department', 'applicant', 'qualification', 'campaign'], answer: 1,
    reasons: ['Department là phòng ban.', 'Applicant là người ứng tuyển, có thể nộp hồ sơ cá nhân.', 'Qualification là điều kiện chuyên môn hoặc bằng cấp.', 'Campaign là chiến dịch.'],
    tip: 'Nhận diện cặp apply for a job và an applicant for a job.',
  },
  {
    topic: 'Technology', prompt: 'The online shop could not process orders during a network _____.', clues: ['could not process', 'network'],
    options: ['device', 'appointment', 'outage', 'receipt'], answer: 2,
    reasons: ['Device chỉ một thiết bị, ví dụ điện thoại.', 'Appointment là một cuộc hẹn.', 'Outage là khoảng thời gian dịch vụ bị gián đoạn.', 'Receipt là biên lai.'],
    tip: 'Network outage là sự cố mạng. Power outage là sự cố mất điện.',
  },
  {
    topic: 'Customer Service', prompt: 'A representative will call you this afternoon to _____ the issue with your bill.', clues: ['the issue', 'your bill'],
    options: ['resolve', 'withdraw', 'promote', 'ship'], answer: 0,
    reasons: ['Resolve an issue nghĩa là giải quyết vấn đề.', 'Withdraw thường đi với tiền, đơn xin hoặc sự tham gia.', 'Promote nghĩa là quảng bá hoặc thăng chức.', 'Ship nghĩa là vận chuyển hàng.'],
    tip: 'Học cụm resolve an issue và resolve a problem để nhận ra hành động xử lý khiếu nại.',
  },
  {
    topic: 'Manufacturing', prompt: 'The inspector found a _____ in the handle, so the product could not be sold.', clues: ['inspector found', 'could not be sold'],
    options: ['assembly', 'receipt', 'reservation', 'defect'], answer: 3,
    reasons: ['Assembly chỉ quá trình lắp ráp hoặc cụm bộ phận được lắp.', 'Receipt là biên lai.', 'Reservation là việc đặt chỗ.', 'Defect là lỗi của tay cầm khiến sản phẩm không đạt yêu cầu.'],
    tip: 'Kết quả như không bán được hay phải sửa thường báo hiệu defect hoặc flaw.',
  },
]

export const vocabularyQuestions: Question[] = exercises.map((exercise, index) => ({
  id: `vocabulary-question-${index + 1}`,
  part: 5,
  topic: `Vocabulary – ${exercise.topic}`,
  prompt: exercise.prompt,
  options: exercise.options,
  answer: exercise.answer,
  rationale: exercise.reasons[exercise.answer],
  optionReasons: exercise.reasons,
  tip: exercise.tip,
  keywords: exercise.clues,
  vocabulary: [exercise.options[exercise.answer]],
}))
