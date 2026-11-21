# Thiết lập Supabase và triển khai TOEIC 550+

Làm theo các phần A đến E. Các URL mẫu dùng cho cấu hình, hãy thay bằng domain ứng dụng của bạn.

## A. Supabase

1. Đăng nhập [Supabase Dashboard](https://supabase.com/dashboard), chọn **New project**, chọn tổ chức và khu vực rồi đặt mật khẩu database. Lưu mật khẩu database riêng.
2. Trong **Connect** hoặc phần **API Keys** của dự án, lấy **Project URL** và **Publishable key**. Nếu dùng khóa kiểu cũ, sao chép **anon public**. [Hướng dẫn API keys của Supabase](https://supabase.com/docs/guides/getting-started/api-keys)
3. Mở **SQL Editor → New query**. Dán toàn bộ [migration learning accounts](supabase/migrations/202611210001_learning_accounts.sql) rồi bấm **Run**. Dùng một dự án trống hoặc kiểm tra các bảng trùng tên trước khi áp dụng.
4. Trong **Table Editor**, kiểm tra **profiles**, **user_progress**, **question_attempts**, **wrong_questions**, **vocabulary_progress**, **study_sessions**, **study_plan_progress**, **lesson_completions** và **learning_sync_receipts**. RLS phải bật trên cả chín bảng. Có thể kiểm tra bằng đoạn SQL bên dưới. [Tài liệu RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
5. Trong **Authentication → Sign In / Providers**, bật **Email** và quyết định có yêu cầu **Confirm email**. Để gửi xác nhận và thư đặt lại mật khẩu cho người dùng ngoài nhóm dự án, cấu hình **Custom SMTP** trong Authentication. Dùng địa chỉ thử thuộc nhóm nếu đang dùng SMTP mặc định. [Thiết lập SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
6. Trong **Authentication → URL Configuration**, đặt **Site URL** thành **http://localhost:5173** trong lúc thử local. Thêm hai địa chỉ dưới đây vào **Redirect URLs**. Dùng đúng host và port đang mở trong trình duyệt. [Cấu hình URL chuyển hướng](https://supabase.com/docs/guides/auth/redirect-urls)

~~~text
http://localhost:5173/?auth=confirm
http://localhost:5173/?auth=recovery
~~~

Kiểm tra RLS trong SQL Editor. Kết quả mong đợi là **rls_enabled = true** và **owner_policies = 4** trên cả chín dòng. SQL Editor chạy với quyền quản trị, nên kiểm tra chặn chéo tài khoản qua hai phiên đăng nhập hoặc role **authenticated**.

~~~sql
select c.relname as table_name, c.relrowsecurity as rls_enabled,
       (select count(*) from pg_policy p where p.polrelid = c.oid) as owner_policies
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in (
  'profiles', 'user_progress', 'question_attempts', 'wrong_questions',
  'vocabulary_progress', 'study_sessions', 'study_plan_progress',
  'lesson_completions', 'learning_sync_receipts'
)
order by c.relname;
~~~

## B. Biến môi trường local và thử đăng nhập

1. Mở PowerShell tại thư mục dự án và chạy **Copy-Item .env.example .env**.
2. Mở **.env** và điền hai giá trị đã lấy ở phần A.

~~~dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
~~~

3. Chạy **npm install**, sau đó **npm run dev** hoặc khởi động lại Vite nếu đang chạy.
4. Mở **http://localhost:5173/#register**, đăng ký một tài khoản thử. Nếu bật Confirm email, mở liên kết xác nhận trong thư. Sau đó đăng nhập tại **/#login**.
5. Làm một câu Part 5 và đánh dấu một từ đã nhớ. Tải lại, vào **Hồ sơ tài khoản** và xác nhận thông báo đồng bộ. Thử đăng xuất rồi đăng nhập lại.
6. Chạy **npm run build**. Nếu kiểm tra bản preview khi có email Auth, thêm URL chuyển hướng chính xác của preview vào Supabase.

## C. GitHub

1. Tạo một repository trống tên **TOEIC-550** trên GitHub. Bỏ chọn tạo README, license và gitignore trên GitHub vì local đã có nội dung dự án.
2. Tại thư mục dự án, chạy **git status**. Nếu chưa có Git, chạy **git init -b main**. Nếu đã có commit đầu tiên và cây làm việc sạch, bỏ qua thao tác tạo commit dưới đây.
3. Xem **git status --ignored --short**. **node_modules/**, **dist/** và các tệp **.env** thật phải bị bỏ qua. Sau đó chạy:

~~~powershell
git add .
git diff --cached --name-only
git commit -m "Set up TOEIC accounts and cloud sync"
git branch -M main
~~~

4. Sao chép URL HTTPS của repo từ GitHub. Cấu hình xác thực GitHub trên máy, rồi dùng tên GitHub của bạn thay cho **YOUR-USERNAME**.

~~~powershell
git remote add origin https://github.com/YOUR-USERNAME/TOEIC-550.git
git remote -v
git push -u origin main
~~~

Nếu **origin** đã tồn tại, xem URL trước bằng **git remote -v** và dùng **git remote set-url origin ...** nếu URL cần đổi. [Hướng dẫn GitHub cho mã local](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github?platform=windows)

## D. Vercel

1. Đăng nhập Vercel, chọn **Add New → Project**, kết nối GitHub nếu cần và chọn **Import** bên cạnh repo **TOEIC-550**.
2. Chọn **Framework Preset = Vite**, để **Root Directory** ở thư mục chứa **package.json** và chọn Node.js 22.x hoặc bản được hỗ trợ mới hơn. Kiểm tra **Build Command = npm run build** và **Output Directory = dist**. [Vite trên Vercel](https://vercel.com/docs/frameworks/frontend/vite)
3. Trong **Environment Variables**, thêm **VITE_SUPABASE_URL** và **VITE_SUPABASE_ANON_KEY** vào môi trường **Production** trước khi build. Thêm vào **Preview** nếu muốn thử Preview, ưu tiên Supabase riêng cho môi trường thử nếu có.
4. Bấm **Deploy**, mở deployment và lấy URL HTTPS production. Nếu cập nhật biến môi trường sau bước này, chạy **Redeploy** để Vite đóng gói các giá trị mới.
5. Quay lại Supabase **Authentication → URL Configuration**. Đổi **Site URL** thành domain production. Thêm chính xác **https://your-app.vercel.app/?auth=confirm** và **https://your-app.vercel.app/?auth=recovery** vào **Redirect URLs**, thay bằng domain thật. Giữ địa chỉ local nếu còn dùng local. Với Preview, thêm URL cụ thể cho site thử.
6. Mở **/#account** và **/#parts/5** trên domain Vercel rồi tải lại. Hash được xử lý phía trình duyệt, nên cấu hình Vercel hiện tại không cần rewrite route.

## E. Kiểm tra online trên hai thiết bị

- [ ] Trên laptop, đăng ký tài khoản thử mới, mở thư xác nhận nếu bật tính năng này và đăng nhập.
- [ ] Làm một câu Part 5 sai, đánh dấu một flashcard đã nhớ, hoàn thành Mini Test và chỉnh mục tiêu trong hồ sơ.
- [ ] Chờ trạng thái **Tiến độ đã đồng bộ**. Tải lại một lần rồi đăng xuất.
- [ ] Trên điện thoại hoặc cửa sổ trình duyệt mới, mở **cùng domain**, đăng nhập cùng tài khoản. So sánh XP, mục tiêu, lịch sử, flashcard và sổ câu sai.
- [ ] Thử đăng nhập bằng tài khoản thứ hai và xác minh giao diện hiển thị tiến độ riêng của tài khoản đó.
- [ ] Với tài khoản thử, bấm **Quên mật khẩu**, mở thư, nhập mật khẩu mới và thử đăng nhập lại.
- [ ] Tắt mạng sau khi đã mở app, thực hiện một thao tác, bật mạng và xác nhận phần tiến độ mới xuất hiện trên thiết bị kia.

Build tĩnh có thể mở khi thiếu cấu hình Supabase ở chế độ khách. Việc xác nhận email, đặt lại mật khẩu qua email và đồng bộ trên Vercel cần được kiểm tra trên dự án thật sau các bước trên.
