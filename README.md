# TOEIC 550+ STUDY

Website học từ mất gốc đến TOEIC 550+ bằng tiếng Việt. Lộ trình gồm phát âm IPA, từ và câu cơ bản, nghe từ đầu, sau đó luyện từng mốc 350, 450 và 550+. Ngân hàng 120 câu tự soạn Part 1–7, Mini Test, thi thử và sổ câu sai tiếp tục dùng chung tiến độ. Điểm TOEIC hiển thị là ước tính luyện tập.

IPA có khóa 20 bài bắt đầu bằng các cặp nguyên âm rồi chuyển sang nguyên âm đôi và phụ âm. Bảng tra cứu giữ đủ 44 ký hiệu và ghi chú các cách đọc khác nhau giữa Anh–Anh và Anh–Mỹ. IPA, từ vựng, nghe cơ bản, bảng chữ cái và các bài Mất gốc / Xây nền dùng MP3 dựng sẵn bằng giọng nữ Anh–Mỹ **af_heart** của Kokoro-82M. Khi tệp luyện phát âm gặp lỗi, trình phát báo lỗi và cho phép nghe lại. Đề TOEIC dùng bản thu riêng từ trước. [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) · [Quy trình tạo audio](#tạo-audio-cho-bài-học)

Frontend dùng React, TypeScript, Vite, CSS và điều hướng bằng hash. Supabase Auth quản lý tài khoản email, PostgreSQL lưu tiến độ theo người dùng, và Vercel phục vụ bản build tĩnh.

## Chạy local

Cài Node.js từ 22.12 trở lên và npm. Tại thư mục dự án, chạy:

~~~powershell
npm install
npm run dev
~~~

Mở địa chỉ Vite in trong terminal, thường là http://localhost:5173. Để đăng nhập và mở bài học, cấu hình Supabase theo **A → B** trong [SUPABASE_SETUP.md](SUPABASE_SETUP.md). Xem [hướng dẫn cấp tài khoản](ADMIN_SETUP.md) để gán Admin và bật trang quản lý học viên. Khi thiếu cấu hình, bản local vẫn có trang chào mừng.

~~~powershell
npm run check
npm test
npm run build
npm run preview
~~~

Bản build xuất ra **dist/**. Dùng preview để kiểm tra bản build trước khi triển khai. Hash routing giữ URL như **/#account** và **/#parts/5** hoạt động khi tải lại.

## Thư mục chính

| Đường dẫn | Nội dung |
| --- | --- |
| [src/data](src/data) và [public/listening](public/listening) | Nội dung gốc, ảnh và audio |
| [src/features/auth](src/features/auth) và [src/features/profile](src/features/profile) | Đăng nhập, khôi phục hoặc đổi mật khẩu và hồ sơ |
| [src/features/admin](src/features/admin) và [supabase/functions/create-student](supabase/functions/create-student) | Danh sách và cấp tài khoản học viên |
| [src/data/curriculum](src/data/curriculum) | Bài học tuần tự Mất gốc và Xây nền. Xem [danh sách bài và số câu](LO_TRINH.md) |
| [src/hooks](src/hooks) và [src/services](src/services) | Phiên đăng nhập, hàng đợi, hợp nhất và cập nhật cloud |
| [src/lib](src/lib) | Supabase client và kiểu dữ liệu RPC |
| [supabase/migrations](supabase/migrations) | Schema, chính sách RLS và RPC |
| [vercel.json](vercel.json) | Preset Vite, lệnh build và thư mục xuất bản |

## Tiến độ, đồng bộ và ngoại tuyến

- Trang học chỉ được tải sau khi Auth xác minh phiên Supabase. Khi đăng nhập, ứng dụng đọc tiến độ Supabase và giữ cache riêng cho từng tài khoản. Nếu trình duyệt còn lịch sử học khách từ bản cũ, người dùng có thể chọn nhập hoặc giữ trên thiết bị.
- Nhập dữ liệu giữ thiết lập và trạng thái đã có trên cloud. Nó thêm lần làm bài, phiên học, bài hoàn thành và từ mới dựa trên ID. Với lịch sử cũ thiếu ID, khóa được tạo từ câu hỏi, thời điểm và lựa chọn. Đối với XP của hai lịch sử chồng lấp, ứng dụng chỉ cộng phần xác định từ hoạt động được thêm.
- Mỗi thao tác đã ghi được xếp hàng theo tài khoản. Ứng dụng thử gửi lại khi mạng trở lại, khi cửa sổ được mở lại hoặc theo chu kỳ lúc trang hiển thị. RPC kiểm tra revision, ghi dữ liệu trong một giao dịch và lưu mã thao tác đã nhận. Nếu revision đổi, trình duyệt tải bản mới rồi áp dụng lại các thao tác chưa xác nhận.
- Bản production dùng service worker cho tài nguyên tĩnh đã tải. Khi mất mạng trong một phiên học đã xác minh, thao tác vẫn được ghi vào hàng đợi. Mở lại trang học hoặc tải lại cần kết nối để xác minh phiên với Supabase. Bản nháp bài đang làm vẫn lưu theo tài khoản trong tab.
- Điểm bắt đầu, quiz nền tảng, bài đã hoàn thành và từ đã học dùng dữ liệu tiến độ hiện có. Migration tài khoản quản trị bổ sung quyền cấp tài khoản và đọc số bài đã hoàn thành.
- Đặt lại tiến độ tài khoản xóa lịch sử trên cloud khi đồng bộ. Các thao tác học từ trước lần đặt lại không khôi phục lịch sử đã xóa. Mục tiêu và tùy chọn giao diện được giữ.

## Tạo audio cho bài học

Script [generate-learning-audio.mjs](scripts/generate-learning-audio.mjs) dùng Kokoro-82M v1.0 ONNX `q8` trên CPU, giọng `af_heart` (`en-US`), tốc độ dựng `0.94` và FFmpeg để xuất MP3 mono `64 kbps`. Script tái sử dụng tệp hợp lệ đã có trong `public/listening/english/` và chỉ tạo tệp còn thiếu. Frontend phát ở `1×`, có nút nghe chậm `0.85×`, và bài Listening có các mức `0.75×`, `1×`, `1.25×` với cao độ được giữ khi đổi tốc độ.

Trên Windows, cài công cụ dựng vào thư mục local đã được Git bỏ qua nếu máy chưa có. Có thể dùng `TOEIC_KOKORO_DIR` cho thư mục công cụ khác và `TOEIC_FFMPEG` cho đường dẫn FFmpeg. Chạy lệnh từ thư mục project.

~~~powershell
npm install --prefix node_modules/.toeic-npm/neural-audio --save-exact kokoro-js@1.2.1 @huggingface/transformers@3.8.1 @ffmpeg-installer/win32-x64@4.1.0
node scripts/generate-learning-audio.mjs --plan
node scripts/generate-learning-audio.mjs
node scripts/generate-learning-audio.mjs --verify-reference
~~~

Lệnh cuối dựng lại bốn mẫu cũ trong thư mục tạm và so sánh từng byte với bản gốc để kiểm tra cấu hình.

## Đưa lên GitHub và Vercel

Làm lần lượt **C → E** trong [hướng dẫn triển khai](SUPABASE_SETUP.md). Vercel cần **VITE_SUPABASE_URL** và **VITE_SUPABASE_ANON_KEY** tại thời điểm build. Frontend dùng khóa anon hoặc publishable. Tệp env thật và thông tin xác thực SMTP để ngoài Git.
