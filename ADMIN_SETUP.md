# Cấp tài khoản học viên

Bản local dùng `/#admin/users` cho **Quản lý học viên**. Học viên vào `/#login` bằng tài khoản được cấp. Nút đăng ký công khai đã được gỡ và đường dẫn `/#register` chuyển sang đăng nhập.

## Bật trên project Supabase hiện có

Áp dụng các bước này khi bạn sẵn sàng bật tính năng trên project Supabase mà frontend đang dùng. Giữ các biến môi trường frontend hiện tại.

1. Trong **SQL Editor** của đúng project, chạy toàn bộ [migration `202611210002_admin_accounts.sql`](supabase/migrations/202611210002_admin_accounts.sql) một lần. Migration thêm bảng quyền riêng và hai RPC. Bảng quyền ban đầu rỗng. Migration học tập trước đó phải đã được áp dụng.
2. Vào **Authentication → Users**, mở đúng tài khoản hiện tại của bạn và sao chép **User UID**. Trong SQL Editor, thay giá trị mẫu trong câu `select` sau bằng UID đó. Kiểm tra email trả về là email bạn dùng để đăng nhập.

   ```sql
   select id, email, created_at
   from auth.users
   where id = 'YOUR_AUTH_USER_UUID'::uuid;
   ```

   Khi xác nhận đúng tài khoản, dùng chính UID đó để cấp quyền. Bảng chỉ chấp nhận một Admin và câu lệnh này sẽ báo lỗi nếu đã có một UID được cấp quyền.

   ```sql
   insert into private.toeic_admin (user_id)
   values ('YOUR_AUTH_USER_UUID'::uuid);
   ```

3. Đăng nhập **Supabase CLI** bằng `supabase login`, rồi chạy lệnh dưới đây từ thư mục project. Thay `YOUR_PROJECT_REF` bằng project ref của đúng Supabase project. Giữ **Verify JWT** bật. Function cũng gọi Supabase Auth `getUser()` và đối chiếu quyền trong database trước khi dùng Admin API. [Triển khai Edge Functions](https://supabase.com/docs/guides/functions/deploy) · [Xác thực Edge Functions](https://supabase.com/docs/guides/functions/auth-headers)

   ```powershell
   supabase functions deploy create-student --project-ref YOUR_PROJECT_REF
   ```

4. Trong **Authentication → Sign In / Providers**, tắt **Allow new users to sign up** và giữ **Allow anonymous sign-ins** ở trạng thái tắt. Giữ provider **Email** bật để học viên đăng nhập bằng mật khẩu. Auth xử lý public signup và `auth.admin.createUser()` bằng hai endpoint riêng. Function tạo học viên với `email_confirm: true`, vì vậy tài khoản được xác nhận khi tạo và Supabase Auth không gửi thư xác nhận signup. [Cấu hình Auth](https://supabase.com/docs/guides/auth/general-configuration) · [Admin createUser](https://supabase.com/docs/reference/javascript/auth-admin-createuser)
5. Mở Vite local, đăng nhập lại bằng tài khoản Admin, vào **Quản lý học viên** và cấp một tài khoản thử. Thử đăng nhập bằng tài khoản vừa cấp trong cửa sổ riêng. Kiểm tra trực tiếp đường dẫn `/#admin/users` từ phiên học viên để xác nhận bị từ chối. Trong hồ sơ học viên, dùng **Đổi mật khẩu** để thay mật khẩu tạm thời. **Quên mật khẩu** dùng cấu hình email và URL chuyển hướng của Supabase hiện tại.

## Dữ liệu và khóa

- Edge Function nhận khóa từ biến môi trường do Supabase cấp. Function dùng khóa `default` trong `SUPABASE_SECRET_KEYS` hoặc khóa cũ `SUPABASE_SERVICE_ROLE_KEY` khi project dùng khóa legacy. Frontend dùng `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`. [Biến môi trường Edge Functions](https://supabase.com/docs/guides/functions/secrets)
- Mật khẩu tạm thời hiện sau khi tạo thành công và biến mất khi đóng thông tin hoặc rời trang. Supabase Auth xử lý và băm mật khẩu. Danh sách học viên hiển thị tên, email, ngày tạo, trạng thái và số bài đã học.
- Lần đăng nhập đầu tiên dùng RPC `load_learning` hiện tại để tạo hồ sơ và khởi tạo tiến độ theo UUID của học viên. RPC quản trị chỉ đọc phần tóm tắt. RLS theo `auth.uid()` vẫn áp dụng cho dữ liệu học tập chi tiết, kể cả khi đăng nhập bằng tài khoản Admin.
- `supabase/config.toml` tắt đăng ký công khai và đăng nhập ẩn danh cho stack Supabase local. Cấu hình của project Supabase trên cloud được chỉnh riêng ở bước 4.

## Kiểm tra Edge Function local

Cài Deno rồi chạy từ thư mục project. Bộ test dùng phản hồi Auth mô phỏng để kiểm tra thứ tự xác thực, phân quyền, xác nhận sẵn email và lỗi trả về.

```powershell
deno check --node-modules-dir=none --no-lock supabase/functions/create-student/index.ts
deno test --node-modules-dir=none --no-lock supabase/functions/create-student/handler.test.ts
```
