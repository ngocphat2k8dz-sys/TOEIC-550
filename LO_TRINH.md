# Chương trình Mất gốc và Xây nền

| Giai đoạn | Trước khi mở rộng | Lộ trình chính hiện tại | Luyện thêm |
| --- | ---: | ---: | ---: |
| Mất gốc | 7 mục | 18 bài | 4 mục |
| Xây nền | 17 mục | 17 bài | 8 mục |

Lộ trình cũ tính cả các nhóm IPA, từ vựng và bài nghe trong tổng số mục. Các nội dung đó vẫn mở được từ menu và phần **Luyện thêm** trong lộ trình. Tiến độ của nội dung bổ trợ tiếp tục dùng ID cũ. Trong 35 bài của lộ trình chính có 23 bài mới, 12 bài được mở rộng, 396 câu mới và 17 câu cũ được giữ trong các bài tương ứng. Bài tổng quan **Các thì quan trọng** vẫn mở tại `/#foundation/tenses` và nằm trong phần luyện thêm.

## Mất gốc

| Nhóm | Bài học | Số câu | Thay đổi |
| --- | --- | ---: | --- |
| Từ chữ cái đến câu đầu tiên | Bảng chữ cái tiếng Anh | 10 | Mới |
| | Âm đầu tiên và bảng IPA | 10 | Mới |
| | Lời chào và giới thiệu tên | 12 | Mở rộng |
| | Từ, cụm từ và trật tự câu | 12 | Mở rộng |
| | Đại từ chỉ người và vật | 12 | Mở rộng |
| | Ôn tập · Chữ cái, câu và đại từ | 15 | Mới |
| Gọi tên và mô tả | Động từ BE với am, is, are | 10 | Mới |
| | Danh từ số ít và số nhiều | 12 | Mở rộng |
| | A, an, the và từ chỉ gần xa | 11 | Mở rộng |
| | Tính từ mô tả người và vật | 11 | Mở rộng |
| | Động từ thường với do và does | 12 | Mở rộng |
| | Ôn tập · BE, danh từ và động từ | 15 | Mới |
| Hỏi và nói trong tình huống quen thuộc | Từ để hỏi · What, Where, Who và các từ khác | 11 | Mở rộng |
| | Giới từ đầu tiên · Ở đâu và khi nào | 11 | Mở rộng |
| | Ai có gì? · My, ’s, have và has | 10 | Mới |
| | Có một hay nhiều? · There is và There are | 10 | Mới |
| | Nói khả năng và nhờ giúp · Can và can’t | 10 | Mới |
| | Ôn tập · Câu giao tiếp cơ bản | 15 | Mới |

## Xây nền

| Nhóm | Bài học | Số câu | Thay đổi |
| --- | --- | ---: | --- |
| Nói về hiện tại, quá khứ và tương lai | Hiện tại đơn · Việc làm thường xuyên | 10 | Mới |
| | Hiện tại tiếp diễn · Việc đang xảy ra | 10 | Mới |
| | Quá khứ đơn · Việc đã xảy ra | 10 | Mới |
| | Tương lai · Will và be going to | 10 | Mới |
| | Ôn tập · Các mốc thời gian | 16 | Mới |
| Nói rõ về người, vật và số lượng | Đếm và nói số lượng · Some, any, many, much | 10 | Mới |
| | Dùng đại từ theo vị trí trong câu | 10 | Mới |
| | Tính từ và trạng từ · Tả vật hay tả cách làm? | 11 | Mở rộng |
| | So sánh · Hơn và nhất | 10 | Mới |
| | Ôn tập · Từ loại, số lượng và so sánh | 16 | Mới |
| Nối ý, đặt câu hỏi và đọc đoạn ngắn | Giới từ · Thời gian, vị trí và hướng đi | 12 | Mới |
| | Liên từ · Nối ý cho rõ | 12 | Mới |
| | Can, could, should, must và have to | 12 | Mới |
| | Câu hỏi · Chọn đúng từ đứng đầu | 12 | Mới |
| | Đọc câu và đoạn thật ngắn | 13 | Mở rộng |
| | Ôn tập · Từ nối, câu hỏi và đọc hiểu | 15 | Mới |
| Làm quen với TOEIC | Làm quen với TOEIC · Nghe và đọc từng bước | 15 | Mở rộng |

Bài cầu nối giới thiệu Listening, Reading và thứ tự Part 1–7. Các bài tập rất ngắn tự soạn để người học tập làm quen trước TOEIC 350. [Cấu trúc bài thi TOEIC Listening and Reading của ETS](https://www.ets.org/toeic/about/listening-reading.html)

## Học tiếp và lưu tiến độ

- Mỗi nhóm đăng ký bài theo thứ tự trong [curriculum](src/data/curriculum/index.ts). Trang kết quả, trang học, trang lộ trình và Dashboard dùng thứ tự đó. Nút **Tiếp tục** đưa người học từ bài cuối mỗi nhóm đến bài ôn, từ bài ôn đến nhóm kế tiếp, rồi qua Xây nền và TOEIC 350. Người học có thể trực tiếp mở bài đã biết để ôn.
- Câu sai, bài hoàn thành, XP và thời gian học dùng luồng đồng bộ theo UUID hiện tại. Bài đã hoàn thành ở phiên bản trước tiếp tục được đánh dấu sau nâng cấp. Admin thấy tổng bài hoàn thành qua RPC đang có. Thay đổi nội dung này không cần migration.
- Các bài có 88 từ vựng với IPA, ví dụ và dịch. Từ mới, câu ví dụ, bảng chữ cái và mẫu tiếng Anh trong lời giải dùng MP3 của giọng Kokoro `af_heart` như audio luyện phát âm có sẵn.
- `npm test` kiểm tra dữ liệu, thứ tự chuyển bài và các ID cũ. Để tự xem giao diện, chạy `npm run dev`, đăng nhập bằng học viên và chọn **Tôi mất gốc tiếng Anh**.
