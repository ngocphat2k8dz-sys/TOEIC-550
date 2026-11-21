import type { BeginnerExplanation, Question } from '../types'

type Translation = readonly [text: string, term: string, meaning: string]

const partOne: Translation[] = [
  ['Người phụ nữ đang tưới một số cây.', 'watering', 'đang tưới nước'],
  ['Người đàn ông đang sửa bánh xe đạp.', 'bicycle wheel', 'bánh xe đạp'],
  ['Những chiếc ghế đã được xếp xung quanh một cái bàn.', 'around', 'xung quanh'],
  ['Một công nhân đang chồng các thùng lên nhau.', 'stacking', 'đang xếp chồng'],
  ['Người đàn ông đang đọc sách trên ghế băng.', 'bench', 'ghế băng'],
  ['Một người đàn ông đang rót nước vào cốc.', 'pouring', 'đang rót'],
  ['Xe đạp được xếp thành hàng bên cạnh lan can.', 'lined up', 'xếp thành hàng'],
  ['Một vị khách đang kéo va li qua sảnh.', 'lobby', 'sảnh'],
  ['Hai nhân viên đang sắp xếp một số trái cây.', 'arranging', 'đang sắp xếp'],
  ['Một vài chiếc ô đang mở ở phía trên các bàn.', 'umbrellas', 'những chiếc ô'],
]

const partTwo: Translation[] = [
  ['Tôi có thể nhận thẻ khách ở đâu? → Tại quầy lễ tân.', 'pick up', 'đến nhận'],
  ['Khi nào máy in sẽ được sửa? → Chậm nhất là sáng thứ Năm.', 'by Thursday morning', 'chậm nhất vào sáng thứ Năm'],
  ['Ai trình bày số liệu bán hàng chiều nay? → Daniel bên tài chính.', 'sales figures', 'số liệu bán hàng'],
  ['Tại sao chuyến giao hàng bị trễ? → Tài xế bị kẹt xe.', 'got stuck in traffic', 'bị kẹt xe'],
  ['Bạn biết về vị trí đang tuyển bằng cách nào? → Qua một đồng nghiệp cũ.', 'job opening', 'vị trí đang tuyển'],
  ['Bạn chuyển tiếp ghi chú cuộc họp cho tôi được không? → Được, tôi sẽ gửi sau bữa trưa.', 'forward', 'chuyển tiếp'],
  ['Bạn muốn gặp trực tiếp hay gọi video hơn? → Gọi video sẽ tiện hơn cho tôi.', 'in person', 'trực tiếp'],
  ['Hôm nay cửa phía bắc có mở không? → Không, vui lòng dùng cửa chính.', 'main doors', 'cửa chính'],
  ['Bạn đã đặt bàn cho sáu người chưa? → Nhà hàng vẫn chưa gọi lại cho tôi.', 'book a table', 'đặt bàn'],
  ['Tôi nên mang gì đến buổi định hướng? → Chỉ cần giấy tờ có ảnh và một cây bút.', 'photo ID', 'giấy tờ tùy thân có ảnh'],
  ['Chúng ta cần bao nhiêu bản sao cho buổi hướng dẫn? → Mỗi người tham dự một bản.', 'per participant', 'cho mỗi người tham dự'],
  ['Sao chúng ta không chuyển buổi đào tạo sang phòng lớn hơn? → Hay đấy. Tôi sẽ xem phòng nào còn trống.', 'larger room', 'phòng lớn hơn'],
  ['Chúng ta nên gửi hóa đơn qua email hay bưu điện? → Hãy gửi email cho bộ phận kế toán.', 'invoice', 'hóa đơn'],
  ['Bạn có thể cập nhật banner của website sớm đến mức nào? → Tôi có thể làm xong trước hoặc vào buổi trưa.', 'by noon', 'chậm nhất là buổi trưa'],
  ['Bạn đã để chìa khóa dự phòng ở đâu? → Trong ngăn kéo dưới cùng.', 'bottom drawer', 'ngăn kéo dưới cùng'],
  ['Phòng họp đã được dọn chưa? → Nhân viên vệ sinh vẫn đang làm trong đó.', 'still working', 'vẫn đang làm việc'],
  ['Tôi nên liên hệ với ai về máy lạnh bị hỏng? → Thử hỏi Hana bên bảo trì tòa nhà.', 'maintenance', 'bảo trì'],
  ['Lô hàng buổi chiều phải đến ngày mai mới tới. → Vậy chúng ta nên báo cho khách hàng.', 'notify', 'thông báo'],
  ['Máy tính xách tay của bạn hình như bị gì? → Màn hình trống khi tôi đăng nhập.', 'goes blank', 'trở nên trống'],
  ['Bạn đã gửi lịch sửa đổi rồi, đúng không? → Vâng, tôi đã gửi email cho mọi người sáng nay.', 'revised schedule', 'lịch đã sửa đổi'],
]

const partThree: Translation[] = [
  ['Tại sao người đàn ông muốn đổi lịch hẹn? → Anh ấy có cuộc họp nhân viên.', 'staff meeting', 'cuộc họp nhân viên'],
  ['Người đàn ông nên đỗ xe ở đâu? → Trên đường Garden.', 'park', 'đỗ xe'],
  ['Người đàn ông báo vấn đề gì? → Một số món hàng chưa đến.', 'items', 'các món hàng'],
  ['Người phụ nữ nói cô ấy sẽ làm gì tiếp theo? → Gửi email chi tiết giao hàng.', 'shipment details', 'chi tiết giao hàng'],
  ['Người phụ nữ đang muốn làm gì? → Đặt chỗ trong một buổi hướng dẫn.', 'reserve a place', 'đặt một chỗ'],
  ['Người đàn ông yêu cầu người phụ nữ làm gì trước buổi học? → Sạc thiết bị.', 'charge', 'sạc pin'],
  ['Đèn bàn có vấn đề gì? → Công tắc hoạt động không đúng.', 'switch', 'công tắc'],
  ['Nhân viên đề nghị cho người đàn ông xem gì? → Một chiếc đèn tương tự.', 'similar', 'tương tự'],
  ['Tại sao người đàn ông đề nghị đổi lịch? → Nhân viên mới cần thẻ nhận dạng để đi tham quan.', 'identification cards', 'thẻ nhận dạng'],
  ['Người đàn ông sẽ báo cho ai? → Người hướng dẫn an toàn.', 'safety instructor', 'người hướng dẫn an toàn'],
]

const partFour: Translation[] = [
  ['Thay đổi nào đang được thông báo? → Tàu sẽ khởi hành từ sân ga khác.', 'platform', 'sân ga'],
  ['Hành khách có thể tìm cầu thang lên sân ga số sáu ở đâu? → Bên cạnh phòng bán vé.', 'ticket office', 'phòng bán vé'],
  ['Tại sao Rina gọi cho ông Evans? → Để báo xe đạp của ông đã bảo dưỡng xong.', 'bicycle service', 'việc bảo dưỡng xe đạp'],
  ['Khi đến lấy xe, ông Evans nên mang gì? → Phiếu bảo dưỡng.', 'service slip', 'phiếu bảo dưỡng'],
  ['Quảng cáo đang nói về loại hình kinh doanh nào? → Không gian làm việc chung.', 'shared workspace', 'không gian làm việc chung'],
  ['Khách mới nhận ưu đãi tháng Tám bằng cách nào? → Nhập mã trên website.', 'offer', 'ưu đãi'],
  ['Người nói sắp dẫn hoạt động gì? → Chuyến tham quan một nhà kho.', 'warehouse', 'nhà kho'],
  ['Khách được phép chụp ảnh ở đâu? → Tại khu vực bốc hàng.', 'loading area', 'khu vực bốc hàng'],
  ['Điều gì khiến địa điểm tổ chức thay đổi? → Dự báo có mưa.', 'rain is forecast', 'dự báo có mưa'],
  ['Buổi đọc sách cho trẻ em sẽ bắt đầu lúc mấy giờ? → Mười một giờ.', 'reading session', 'buổi đọc sách'],
]

const partFive: Translation[] = [
  ['Kỹ thuật viên cần sự chấp thuận của bạn trước khi mở chiếc tủ bị khóa.', 'approval', 'sự chấp thuận'],
  ['Ba chuyên viên phân tích của nhóm tài chính sẽ tham dự buổi phổ biến thông tin.', 'analysts', 'các chuyên viên phân tích'],
  ['Trước khi in thực đơn, hãy kiểm tra độ chính xác của từng mức giá.', 'accuracy', 'độ chính xác'],
  ['Nhân viên giao hàng để lại một thông báo tại quầy lễ tân vì văn phòng đã đóng cửa.', 'notice', 'thông báo'],
  ['Nhân viên phải trả lại thẻ khách tại quầy an ninh.', 'return', 'trả lại'],
  ['Người quản lý thư viện kiểm tra các phòng học mỗi sáng trước khi mở cửa.', 'checks', 'kiểm tra'],
  ['Nhóm phụ trách sự kiện đã đồng ý dời buổi thuyết trình sang thứ Sáu.', 'move', 'dời sang'],
  ['Chúng tôi khuyên nên đặt bàn trước cho nhóm từ sáu người trở lên.', 'reserving', 'việc đặt chỗ trước'],
  ['Vui lòng mang bản in xác nhận đặt chỗ tới quầy lễ tân.', 'printed', 'được in ra'],
  ['Hướng dẫn đủ rõ để các thực tập sinh mới làm theo vào ngày đầu tiên.', 'clear', 'rõ ràng'],
  ['Khu lễ tân mới trông sáng sủa ngay cả vào những buổi chiều nhiều mây.', 'bright', 'sáng sủa'],
  ['Nhân viên bối rối vì quy định ra vào tòa nhà thay đổi đột ngột.', 'confused', 'bối rối'],
  ['Vui lòng dán nhãn thay thế cẩn thận lên mặt trước của từng thùng.', 'carefully', 'một cách cẩn thận'],
  ['Máy quét mới nhanh hơn đáng kể so với mẫu chúng tôi dùng năm ngoái.', 'significantly', 'đáng kể'],
  ['Phòng khám gần đây đã cập nhật trang đặt lịch để bổ sung khung giờ buổi tối.', 'recently', 'gần đây'],
  ['Nhóm kho sẽ nhanh chóng kiểm tra danh sách giao hàng trước khi chất hàng lên xe.', 'quickly', 'nhanh chóng'],
  ['Điều phối viên đào tạo đã xác nhận các lượt đặt phòng chiều hôm qua.', 'confirmed', 'đã xác nhận'],
  ['Trung tâm hỗ trợ đã xử lý hơn 600 yêu cầu kể từ khi trang trợ giúp mới đi vào hoạt động.', 'has handled', 'đã xử lý'],
  ['Hiện tại nhóm thiết kế đang chuẩn bị hai phiên bản của tờ giới thiệu để so sánh.', 'is preparing', 'đang chuẩn bị'],
  ['Nhân viên giao nhận đã lấy tài liệu gốc trước khi chúng tôi tìm thấy các bản đã sửa.', 'had collected', 'đã lấy trước đó'],
  ['Tất cả thẻ dự buổi hướng dẫn đã được một tình nguyện viên in trước giờ khai mạc hôm qua.', 'were printed', 'đã được in'],
  ['Tất cả đơn phải được nộp qua cổng trực tuyến chậm nhất lúc 5 giờ chiều.', 'be submitted', 'được nộp'],
  ['Khi bạn tạo tài khoản xong, hệ thống sẽ tự động gửi tin nhắn chào mừng.', 'is sent', 'được gửi'],
  ['Mức phí đỗ xe mới sẽ có hiệu lực vào ngày 1 tháng Bảy.', 'take effect', 'có hiệu lực'],
  ['Để được hoàn tiền toàn bộ, cửa hàng phải nhận yêu cầu của bạn chậm nhất vào thứ Sáu.', 'by', 'chậm nhất vào'],
  ['Rina chịu trách nhiệm cập nhật báo cáo hàng tồn kho hằng tháng.', 'responsible for', 'chịu trách nhiệm về'],
  ['Máy tính xách tay đi kèm túi đựng và bảo hành hai năm.', 'comes with', 'đi kèm với'],
  ['Chuyến tham quan ngoài trời bị hủy vì gió mạnh làm lối đi không an toàn.', 'because', 'vì'],
  ['Mặc dù buổi đào tạo sáng là tự chọn, tất cả nhân viên mới đều quyết định tham dự.', 'although', 'mặc dù'],
  ['Khách có thể vào triển lãm miễn là xuất trình vé điện tử hợp lệ.', 'as long as', 'miễn là'],
  ['Hãy chép mã xác nhận trước khi đóng màn hình đặt chỗ. Bạn không thể lấy mã đó sau khi rời trang.', 'before', 'trước khi'],
  ['Nhân viên tổ chức buổi bán hàng từ thiện đã nhận được thiệp cảm ơn.', 'who', 'người mà, dùng để bổ sung thông tin về người'],
  ['Nhà cung cấp có xe giao hàng bị hỏng đã gọi để hẹn lại lịch giao.', 'whose', 'có, chỉ mối quan hệ sở hữu'],
  ['Phòng chụp nơi ảnh sản phẩm được chụp còn nhận đặt chỗ vào buổi tối.', 'where', 'nơi mà'],
  ['Để yêu cầu hoàn tiền, vui lòng đính kèm bản sao biên lai làm bằng chứng mua hàng.', 'receipt', 'biên lai'],
  ['Thư viện sẽ tạm đóng lối vào chính trong khi công nhân thay cửa.', 'temporarily', 'tạm thời'],
  ['Khách hàng có thể đổi hàng chưa mở trong vòng 30 ngày nếu cần kích cỡ khác.', 'exchange', 'đổi'],
  ['Video đào tạo mới giải thích quy trình an toàn theo cách dễ hiểu đến bất ngờ.', 'accessible', 'dễ hiểu trong ngữ cảnh này'],
  ['Vui lòng cập nhật thông tin liên hệ trước khi bắt đầu giai đoạn gia hạn thành viên.', 'contact information', 'thông tin liên hệ'],
  ['Để tránh lỗi tính tiền, vui lòng kiểm tra số tiền trên cả hai biểu mẫu trước khi nộp.', 'verify', 'kiểm tra, xác minh'],
]

const partSix: Translation[] = [
  ['Vì hội trường chính sẽ được sơn sáng hôm đó, chúng tôi đã chuyển buổi học sang Phòng 3.', 'moved', 'đã chuyển'],
  ['Vui lòng đến sớm mười phút.', 'arrive early', 'đến sớm'],
  ['Nếu bạn đã nhận thẻ tên, vui lòng mang theo thẻ.', 'bring', 'mang theo'],
  ['Hồ bơi sẽ mở vào 12 giờ trưa thứ Ba, ngày 13 tháng Mười.', 'on Tuesday', 'vào thứ Ba'],
  ['Hai buổi học bơi dự kiến sáng hôm đó đã bị hủy.', 'have been canceled', 'đã bị hủy'],
  ['Cảm ơn bạn đã kiên nhẫn trong lúc chúng tôi hoàn tất công việc này.', 'patience', 'sự kiên nhẫn'],
  ['Từ ngày 4 đến 18 tháng Ba, thợ của chúng tôi sẽ kiểm tra phanh và điều chỉnh yên với giá ưu đãi 22 đô la.', 'special price', 'giá ưu đãi'],
  ['Vui lòng đặt giờ trước khi mang xe đạp đến.', 'book a time', 'đặt một khung giờ'],
  ['Mỗi lượt hẹn mất khoảng 25 phút, nhưng các hư hỏng được phát hiện lúc kiểm tra có thể cần một lần đến khác.', 'approximately', 'xấp xỉ, khoảng'],
  ['Máy in dùng chung cạnh Phòng họp B sẽ được thay vào sáng thứ Năm.', 'on Thursday morning', 'vào sáng thứ Năm'],
  ['Chúng tôi sẽ gửi mã cho tất cả nhân viên tầng hai qua email.', 'second-floor staff', 'nhân viên tầng hai'],
  ['Các lệnh in còn trong hàng đợi cũ sẽ bị xóa trong lúc lắp đặt, nên vui lòng gửi lại sau đó.', 'deleted', 'bị xóa'],
  ['Chúng tôi đã sắp xếp phòng cho 24 người theo nội dung ghi trong đặt chỗ trực tuyến của bà.', 'as indicated', 'như đã ghi'],
  ['Chúng tôi đã thu xếp để một nhà cung cấp khác giao bữa trưa.', 'supplier', 'nhà cung cấp'],
  ['Vui lòng xác nhận số khách cuối cùng chậm nhất ngày 4 tháng Tám để chúng tôi đặt đúng số suất ăn.', 'order', 'đặt mua'],
]

const partSeven: Translation[] = [
  ['Mục đích chính của bài viết là gì? → Giới thiệu cách mới để người dùng thư viện đến nhận sách.', 'pickup option', 'cách hoặc lựa chọn đến nhận'],
  ['Bạn đọc nhận mã tủ như thế nào? → Mã được gửi qua tin nhắn.', 'text message', 'tin nhắn văn bản'],
  ['Bài viết nói gì về sách khổ lớn? → Phải nhận tại quầy phục vụ.', 'oversized books', 'sách khổ lớn'],
  ['Người bán giao một lô hàng nhỏ lúc 9 giờ sáng ngày 11 tháng Năm nên đi đâu? → Cổng D.', 'vendor', 'người bán'],
  ['Trong thời gian sửa chữa, người mua hàng vẫn dùng được chỗ nào? → Lối vào phía trước.', 'front entrance', 'lối vào phía trước'],
  ['Người bán giao 26 thùng hàng nên làm gì? → Gọi văn phòng chợ trước thứ Sáu.', 'delivery', 'lô hàng giao'],
  ['Tessa nên trả bao nhiêu cho buổi hướng dẫn? → 28 đô la.', 'pay', 'trả tiền'],
  ['Tessa có khả năng cao sẽ chụp gì trong buổi hướng dẫn? → Một chiếc cốc gốm.', 'ceramic cup', 'cốc gốm'],
  ['Có thể kết luận điều gì về đăng ký của Tessa? → Đơn được gửi trước hạn.', 'deadline', 'hạn chót'],
  ['Mia nhờ Omar làm gì? → Kiểm tra tên đường trên bản đồ.', 'street names', 'tên đường'],
  ['Mia sẽ đổi gì ở trang 2? → Sửa tên đường từ Briar Place thành Briar Lane.', 'change', 'đổi, sửa'],
  ['Có thể suy ra gì về phản hồi của Omar? → Phản hồi đến kịp để Mia sửa.', 'in time', 'kịp lúc'],
  ['Priya sẽ đến phòng nào để nghe hướng dẫn? → Phòng Elm.', 'orientation', 'buổi hướng dẫn ban đầu'],
  ['Priya nên xuất trình gì ở quầy lễ tân? → Một giấy tờ tùy thân có ảnh.', 'show', 'xuất trình'],
  ['Tại sao Priya vẫn có thể tham gia đóng gói? → Buổi hướng dẫn muộn hơn kết thúc trước khi bắt đầu đóng gói.', 'take part', 'tham gia'],
]

const grammar: Record<string, Translation> = {
  'grammar-parts-of-speech-quiz': ['Tài liệu hướng dẫn có thông tin hữu ích về từng tuyến xe buýt.', 'useful', 'hữu ích'],
  'grammar-noun-quiz': ['Một vài nhà cung cấp đã xin thêm thời gian để xem lại hợp đồng.', 'vendors', 'các nhà cung cấp'],
  'grammar-verb-quiz': ['Nhân viên có thể đặt phòng đào tạo sau bữa trưa.', 'reserve', 'đặt trước'],
  'grammar-adjective-quiz': ['Các hướng dẫn đủ rõ để nhân viên mới làm theo.', 'clear', 'rõ ràng'],
  'grammar-adverb-quiz': ['Kỹ thuật viên kiểm tra kỹ lưỡng dây cáp bị hỏng.', 'carefully', 'một cách cẩn thận'],
  'grammar-tenses-quiz': ['Nhóm tài chính đã duyệt ngân sách sửa đổi hôm qua.', 'approved', 'đã phê duyệt'],
  'grammar-passive-quiz': ['Linh kiện thay thế sẽ được giao đến văn phòng của bạn vào ngày mai.', 'be delivered', 'được giao'],
  'grammar-gerund-quiz': ['Quán cà phê đang cân nhắc kéo dài giờ mở cửa vào thứ Bảy.', 'extending', 'việc kéo dài'],
  'grammar-prepositions-quiz': ['Đơn đã điền phải đến nơi chậm nhất lúc 5 giờ chiều thứ Ba.', 'by', 'chậm nhất vào'],
  'grammar-conjunctions-quiz': ['Vì kho đóng cửa hôm nay, chúng ta không thể đến lấy các thùng hàng.', 'because', 'vì'],
  'grammar-relative-quiz': ['Nhân viên chuẩn bị báo cáo bán hàng sẽ trình bày nó vào thứ Hai.', 'who', 'người mà, chỉ người đứng trước'],
  'grammar-comparisons-quiz': ['Lựa chọn vận chuyển mới nhanh hơn lựa chọn trước.', 'faster', 'nhanh hơn'],
  'grammar-conditionals-quiz': ['Nếu nhà cung cấp gửi mẫu hôm nay, chúng tôi sẽ xem xét chúng vào ngày mai.', 'if', 'nếu'],
  'grammar-agreement-quiz': ['Danh sách chỗ còn trống hiện ở trên bàn đăng ký.', 'list', 'danh sách'],
}

const vocabulary: Translation[] = [
  ['Chúng ta đã hết bút và bìa hồ sơ, nên tôi sẽ đặt thêm đồ dùng văn phòng.', 'office supplies', 'đồ dùng văn phòng'],
  ['Công ty đặt trụ sở ở Huế nhưng có một chi nhánh địa phương tại Quy Nhơn.', 'branch', 'chi nhánh'],
  ['Bạn có thể gửi chương trình họp để chúng tôi biết ngày mai sẽ thảo luận các chủ đề nào không?', 'agenda', 'chương trình họp'],
  ['Để quảng bá giày đi bộ đường dài mới, cửa hàng sẽ đăng quảng cáo trên tạp chí du lịch.', 'promote', 'quảng bá'],
  ['Doanh số bán vé tạo ra phần lớn doanh thu của nhà hát năm ngoái.', 'revenue', 'doanh thu'],
  ['Bạn có thể rút tiền mặt từ tài khoản tại máy gần lối vào chính.', 'withdraw', 'rút tiền'],
  ['Lịch trình của đoàn liệt kê theo thứ tự từng sân bay, khách sạn và điểm dừng tham quan.', 'itinerary', 'lịch trình'],
  ['Trong số tiện ích của khách sạn có phòng tập và hồ bơi trên sân thượng.', 'amenities', 'các tiện ích'],
  ['Súp được phục vụ như món khai vị trước món chính.', 'appetizer', 'món khai vị'],
  ['Nhân viên thu ngân hoàn lại toàn bộ tiền sau khi tôi trả chiếc quạt bị lỗi.', 'refund', 'khoản hoàn tiền'],
  ['Lô hộp mực máy in dự kiến đến vào thứ Ba.', 'shipment', 'lô hàng'],
  ['Mỗi ứng viên cho vị trí này phải cung cấp hồ sơ xin việc và địa chỉ email.', 'applicant', 'ứng viên'],
  ['Cửa hàng trực tuyến không xử lý được đơn trong lúc mạng bị gián đoạn.', 'outage', 'sự gián đoạn dịch vụ'],
  ['Một nhân viên đại diện sẽ gọi cho bạn chiều nay để giải quyết vấn đề với hóa đơn.', 'resolve', 'giải quyết'],
  ['Nhân viên kiểm tra phát hiện một lỗi ở tay cầm, nên sản phẩm không thể bán được.', 'defect', 'lỗi, khuyết điểm'],
]

function indexed(prefix: string, list: Translation[], padded = false) {
  return list.map((item, i) => [prefix + String(i + 1).padStart(padded ? 2 : 1, '0'), item] as const)
}

const translations = new Map([
  ...indexed('p1-', partOne), ...indexed('p2-', partTwo), ...indexed('p3-', partThree), ...indexed('p4-', partFour),
  ...indexed('r5-', partFive, true), ...indexed('r6-', partSix, true), ...indexed('r7-', partSeven, true),
  ...Object.entries(grammar), ...indexed('vocabulary-question-', vocabulary),
])

const byTopic: Record<string, readonly [concept: string, example: string]> = {
  noun: ['Danh từ (noun) là từ để gọi tên người, vật, nơi chốn hoặc sự việc. Chỗ cần tên một thứ thường dùng danh từ.', 'I need a pen. → Tôi cần một cây bút. Pen là tên đồ vật.'],
  verb: ['Động từ (verb) nói về việc làm hoặc trạng thái. Tìm người thực hiện và dấu hiệu đứng trước phần cần điền.', 'I open the door. → Tôi mở cửa. Open nói việc tôi làm.'],
  adjective: ['Tính từ (adjective) mô tả đặc điểm của người hay vật. Tìm thứ được mô tả trước.', 'a small bag → một cái túi nhỏ. Small mô tả cái túi.'],
  adverb: ['Trạng từ (adverb) có thể nói việc được làm như thế nào, khi nào hoặc ở mức nào.', 'She reads slowly. → Cô ấy đọc chậm. Slowly nói cách đọc.'],
  tense: ['Thì (tense) giúp xác định thời điểm và cách nhìn hành động. Chú ý từ cho biết khi nào.', 'I worked yesterday. → Tôi đã làm việc hôm qua.'],
  'passive voice': ['Khi muốn nói một vật được ai đó tác động, ta có thể dùng câu bị động (passive voice).', 'The door was opened. → Cánh cửa đã được mở.'],
  preposition: ['Giới từ (preposition) thường nối một người, vật, nơi hoặc thời điểm với phần còn lại của câu.', 'We meet on Monday. → Chúng ta gặp vào thứ Hai.'],
  conjunction: ['Liên từ (conjunction) nối hai ý và cho biết chúng liên hệ thế nào, chẳng hạn nguyên nhân hoặc điều kiện.', 'I stayed home because it rained. → Tôi ở nhà vì trời mưa.'],
  'relative clause': ['Mệnh đề quan hệ (relative clause) bổ sung thông tin về một người, vật hoặc nơi đã nêu.', 'The girl who sings is Mai. → Cô bé đang hát là Mai.'],
  vocabulary: ['Đọc cụm xung quanh chỗ trống để chọn từ đúng nghĩa và đúng vị trí trong câu.', 'I have a receipt. → Tôi có một biên lai. Sau a là từ gọi tên một thứ.'],
  'word form': ['Một nhóm từ có thể có chung gốc nhưng làm việc khác nhau trong câu. Hãy xem chỗ trống cần tên, việc làm hay đặc điểm.', 'a clear answer → một câu trả lời rõ ràng. Clear mô tả answer.'],
  'parts of speech': ['Tên đồ vật, việc làm và đặc điểm là các vai trò khác nhau. Các nhóm đó gọi là từ loại (parts of speech).', 'a new pen → một cây bút mới. New mô tả pen.'],
  'gerund & infinitive': ['Có từ đi với phần sau dạng thêm ing, có từ đi với to + động từ. Ghi nhớ theo cụm.', 'I enjoy reading. → Tôi thích đọc sách.'],
  comparisons: ['So sánh (comparison) cho biết hai thứ giống hay khác nhau về một đặc điểm.', 'This bus is faster. → Xe buýt này nhanh hơn.'],
  conditionals: ['Câu điều kiện (conditional) nói việc gì xảy ra nếu điều kiện đi kèm đúng.', 'If it rains, we will stay home. → Nếu trời mưa, chúng tôi sẽ ở nhà.'],
  'subject–verb agreement': ['Tìm người hoặc vật mà câu đang nói đến rồi chọn dạng động từ đi cùng.', 'The bag is here. The bags are here. → Một cái túi hoặc nhiều cái túi đang ở đây.'],
}

const byPart: Record<number, readonly [concept: string, example: string]> = {
  1: ['Ghép câu nghe được với một người, vật, hành động hoặc vị trí thật sự thấy trong ảnh.', 'A man is reading. → Một người đàn ông đang đọc. Tìm người và việc đọc trong ảnh.'],
  2: ['Nghe mục đích của lời đầu tiên. Nếu là câu hỏi, xác định đang cần người, nơi, thời gian hay cách làm.', 'Where is the bag? On the desk. → Cái túi ở đâu? Trên bàn.'],
  3: ['Trong hội thoại, theo dõi ai nói gì rồi nối đúng chi tiết với điều câu hỏi cần.', 'Where do we meet? At the bank. → Chúng ta gặp ở đâu? Tại ngân hàng.'],
  4: ['Trong thông báo hoặc tin nhắn, tách ý chính khỏi những chi tiết về giờ, nơi chốn và việc cần làm.', 'The train leaves at eight. → Tàu khởi hành lúc tám giờ.'],
  5: ['Đọc chỗ trống cùng các từ đứng sát nó trước khi dịch cả câu.', 'I need a pen. → Tôi cần một cây bút. Sau a là tên một thứ.'],
  6: ['Đọc cả câu trước và sau chỗ trống. Xem văn bản đang muốn báo gì hoặc yêu cầu người đọc làm gì.', 'The meeting is at nine. Please come early. → Cuộc họp lúc chín giờ. Vui lòng đến sớm.'],
  7: ['Đọc câu hỏi để biết cần tìm thông tin gì. Quay lại văn bản và chỉ chọn điều có chi tiết hỗ trợ.', 'The shop opens at eight. → Cửa hàng mở lúc tám giờ. Nếu hỏi giờ mở, tìm at eight.'],
}

export function explainForBeginner(question: Question): BeginnerExplanation | undefined {
  if (question.beginner) return question.beginner
  const translated = translations.get(question.id)
  if (!translated) return undefined
  const [translation, term, meaning] = translated
  const topic = question.topic.toLowerCase().replace(/s$/, '')
  const [concept, example] = (topic.startsWith('vocabulary') ? byTopic.vocabulary : byTopic[question.topic.toLowerCase()] ?? byTopic[topic]) ?? byPart[question.part]
  const words = new Map([[term, meaning]])
  for (const note of question.vocabulary ?? []) {
    const [english, vietnamese] = note.split(' · ')
    if (vietnamese && !words.has(english)) words.set(english, vietnamese)
  }
  return {
    translation, words: [...words], concept: question.id === 'r5-35' ? byTopic.noun[0] : concept,
    simple: question.rationale, example,
  }
}
