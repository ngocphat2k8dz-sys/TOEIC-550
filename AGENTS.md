# TOEIC 550+ STUDY

- Giữ React, TypeScript, Vite, hash routing và giao diện tiếng Việt. Mở rộng các tính năng hiện có theo mô-đun.
- Giữ nguyên ID câu hỏi, ID từ vựng và tài nguyên học đang dùng trừ khi có kế hoạch chuyển đổi dữ liệu. Câu hỏi TOEIC bổ sung phải là nội dung tự soạn.
- Chỉ mở trang học sau khi xác minh phiên Supabase. Giữ trang chào mừng và luồng tài khoản công khai. Tách cache và hàng đợi theo tài khoản. Chỉ nhập dữ liệu học khách từ phiên bản cũ khi người dùng đồng ý.
- Mọi bảng chứa dữ liệu người dùng phải có RLS. RPC nhận ID tài khoản phải đối chiếu với `auth.uid()`. Kiểm tra retry, trùng lặp và thao tác đồng thời khi sửa đồng bộ.
- Chỉ dùng khóa Supabase anon hoặc publishable ở frontend. Giữ token, mật khẩu, service-role key và tệp env thật ngoài source, log và Git.
- Chạy `npm run build` và kiểm tra các luồng bị ảnh hưởng trên trình duyệt. Nêu rõ backend thực hay mô phỏng khi báo kết quả.
