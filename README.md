# TOEIC 550+ STUDY

Website luyện TOEIC Listening & Reading bằng tiếng Việt. Dự án có 120 câu tự soạn cho Part 1–7, audio và transcript, flashcard, ngữ pháp, lộ trình, Mini Test, thi thử và sổ câu sai. Điểm TOEIC hiển thị là ước tính luyện tập.

Frontend dùng React, TypeScript, Vite, CSS và điều hướng bằng hash. Supabase Auth quản lý tài khoản email, PostgreSQL lưu tiến độ theo người dùng, và Vercel phục vụ bản build tĩnh.

## Chạy local

Cài Node.js từ 22.12 trở lên và npm. Tại thư mục dự án, chạy:

~~~powershell
npm install
npm run dev
~~~

Mở địa chỉ Vite in trong terminal, thường là http://localhost:5173. Bạn có thể học ở chế độ khách ngay. Để bật tài khoản và đồng bộ, làm lần lượt **A → B** trong [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

~~~powershell
npm run check
npm run build
npm run preview
~~~

Bản build xuất ra **dist/**. Dùng preview để kiểm tra bản build trước khi triển khai. Hash routing giữ URL như **/#account** và **/#parts/5** hoạt động khi tải lại.

## Thư mục chính

| Đường dẫn | Nội dung |
| --- | --- |
| [src/data](src/data) và [public/listening](public/listening) | Nội dung gốc, ảnh và audio |
| [src/features/auth](src/features/auth) và [src/features/profile](src/features/profile) | Đăng ký, đăng nhập, khôi phục mật khẩu và hồ sơ |
| [src/hooks](src/hooks) và [src/services](src/services) | Phiên đăng nhập, hàng đợi, hợp nhất và cập nhật cloud |
| [src/lib](src/lib) | Supabase client và kiểu dữ liệu RPC |
| [supabase/migrations](supabase/migrations) | Schema, chính sách RLS và RPC |
| [vercel.json](vercel.json) | Preset Vite, lệnh build và thư mục xuất bản |

## Tiến độ, đồng bộ và ngoại tuyến

- Học khách dùng localStorage. Khi đăng nhập, ứng dụng đọc tiến độ Supabase và giữ cache riêng cho từng tài khoản trên trình duyệt. Nếu có lịch sử học khách, người dùng có thể chọn nhập hoặc giữ trên thiết bị.
- Nhập dữ liệu giữ thiết lập và trạng thái đã có trên cloud. Nó thêm lần làm bài, phiên học, bài hoàn thành và từ mới dựa trên ID. Với lịch sử cũ thiếu ID, khóa được tạo từ câu hỏi, thời điểm và lựa chọn. Đối với XP của hai lịch sử chồng lấp, ứng dụng chỉ cộng phần xác định từ hoạt động được thêm.
- Mỗi thao tác đã ghi được xếp hàng theo tài khoản. Ứng dụng thử gửi lại khi mạng trở lại, khi cửa sổ được mở lại hoặc theo chu kỳ lúc trang hiển thị. RPC kiểm tra revision, ghi dữ liệu trong một giao dịch và lưu mã thao tác đã nhận. Nếu revision đổi, trình duyệt tải bản mới rồi áp dụng lại các thao tác chưa xác nhận.
- Bản production dùng service worker cho trang và các tài nguyên tĩnh đã tải. Khi đang ngoại tuyến, người dùng có phiên xác thực và cache còn dùng được có thể tiếp tục học. Bài đang làm ở lại tab hiện tại qua tải lại, còn các câu đã chấm và bài đã nộp được đồng bộ.
- Đặt lại tiến độ tài khoản xóa lịch sử trên cloud khi đồng bộ. Các thao tác học từ trước lần đặt lại không khôi phục lịch sử đã xóa. Mục tiêu và tùy chọn giao diện được giữ.

## Đưa lên GitHub và Vercel

Làm lần lượt **C → E** trong [hướng dẫn triển khai](SUPABASE_SETUP.md). Vercel cần **VITE_SUPABASE_URL** và **VITE_SUPABASE_ANON_KEY** tại thời điểm build. Frontend dùng khóa anon hoặc publishable. Tệp env thật và thông tin xác thực SMTP để ngoài Git.
