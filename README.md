# Ban Công Nghệ / BCN.OS

Entry Page cho sinh viên mới khoa Công nghệ Thông tin, IUH. Ưu tiên ba câu hỏi: BCN là gì, bạn có thể học gì và làm thế nào để tham gia. Giao diện nền tối, điểm nhấn #2fff00 và ảnh hoạt động thật; điều hướng lần lượt qua 5 mục và cho phép quay lại các mục đã xem. Tiêu đề dùng Chakra Petch, nhãn dùng Space Mono, nội dung dùng Be Vietnam Pro. Font được lưu cục bộ kèm giấy phép.

`src/components/TechBackground.tsx` tạo nền đen với các đường nối và vật thể phân bố khắp màn hình, tự chuyển động bằng CSS/SVG. Nền không bắt chuột, không tham gia bố cục nội dung và tạm dừng khi mở popup hoặc ẩn trang. Bảng màu và hiệu ứng tập trung ở `src/theme.css`, đồng bộ với tab, icon, ảnh và popup.

Hiệu ứng tự chạy khi vào web, tải lại và thao tác; không có công tắc hoặc lựa chọn tắt từ bản cũ. Lượt vào trang chờ khung thực sự hiện lên và font/ảnh ưu tiên sẵn sàng (giới hạn chờ 450 ms), rồi tiêu đề, ảnh và khối thông tin xuất hiện lần lượt từ opacity 0 trong khoảng một giây. Lượt này không khóa điều hướng và không bị các lần resize lúc khởi tạo khung xem thử hủy. Chuyển mục dùng nhịp ngắn hơn; chọn tab hoặc thao tác ngay sẽ kết thúc lượt chào để nội dung phản hồi ngay. Đổi tab, câu trả lời và ảnh chỉ chuyển opacity/transform, không tạo bản chụp trang hoặc giữ hiệu ứng đã hoàn thành. Giảm chuyển động vẫn giữ fade rõ, bỏ dịch chuyển. Popup mở 240 ms, đóng 160 ms, không làm mờ toàn màn hình.

| Mục | Nội dung chính |
| --- | --- |
| `#/identity` | Ban Công Nghệ thuộc Đoàn Khoa CNTT, IUH; học, làm sản phẩm và chia sẻ kiến thức. |
| `#/workspace` | OOP, Frontend Web, Backend, Non-dev, Fullstack và Mobile (Android, Java, Kotlin, Compose). |
| `#/activities` | Video NoCode, Trung Thu, gắn kết dịp Tết. |
| `#/culture` | Chủ động học hỏi, trách nhiệm và cùng tiến bộ. |
| `#/commit` | K22 đã kết thúc; theo dõi thông tin K23 qua fanpage. |

Mỗi mục nằm trọn trong một màn hình, không cuộn trang hoặc khung nội dung chính. Bố cục sử dụng chiều cao còn lại sau header/footer; màn hình thấp ưu tiên chữ và hành động, lược bớt ảnh trang trí. Trang tổng quan giữ giới thiệu ngắn, đơn vị trực thuộc và tình trạng K23. Nút Tiếp tục ở chân trang dẫn lần lượt qua năm mục.

Phần Hướng học chỉ có một cấp tab; cả 6 lựa chọn đều hiện trên điện thoại theo hai hàng, đổi thành một hàng khi xoay ngang. Ảnh buổi học xuất hiện khi chiều cao sử dụng cho phép; không có lối mở album trên mục này. Ba ý chính về tinh thần BCN có ảnh và icon riêng. Tablet dọc đặt phần giới thiệu dưới ảnh để tránh cột chữ quá hẹp. Ảnh nhóm ưu tiên chủ thể, ấn phẩm trong album luôn giữ nguyên tỉ lệ.

Hỏi đáp, điều kiện, lịch sinh hoạt và album nằm trong popup vừa khung màn hình, không cuộn nội dung. Hỏi đáp dùng danh sách khi đủ chỗ, ô chọn khi màn hình hẹp hoặc thấp; tài liệu dài chia theo phần. Album giữ ảnh lớn, chú thích và nút chuyển; trên điện thoại nhỏ, ô chọn ảnh thay cho dải thumbnail quá nhỏ. Các vùng chạm chính tối thiểu 44px, ô nhập/chọn trên thiết bị cảm ứng dùng chữ 16px. Popup tìm kiếm theo chiều cao thực còn lại khi mở bàn phím; phím Tìm đóng bàn phím để đọc câu trả lời. Có xử lý safe area cho notch và thanh thao tác hệ thống.

Nút Tiếp tục ở chân trang dẫn lần lượt qua năm mục; các mục đã xem có thể mở lại trên menu. Trang cuối mới hiển thị hành động mở fanpage.

Nút Tìm thông tin luôn có trên header, hỗ trợ tìm trong câu hỏi và câu trả lời, không phân biệt dấu hoặc chữ hoa. Có gợi ý từ khóa, xóa tìm kiếm, kết quả rỗng và liên kết đến mục liên quan. Các thông tin đầu vào, lịch, địa điểm và thời lượng chưa chốt được ghi rõ. Tự học 2 giờ/ngày là khuyến nghị, không bắt buộc.

Các đường dẫn `boot`, `sync` và các đường dẫn của bản trước vẫn chuyển tới nội dung tương ứng. Hỗ trợ menu, nút trước/tiếp có tên mục, bàn phím và Back/Forward trình duyệt. Vuốt trên nội dung không chuyển trang; các album ảnh vẫn hỗ trợ vuốt. Tôn trọng tùy chọn giảm chuyển động.

## Chạy và kiểm tra

```sh
npm install
npm run dev
npm run build
npm test
```

Windows có thể dùng `start.cmd`. Playwright dùng Chrome đã cài, chạy kiểm tra trên desktop và điện thoại ở cổng 5174. `dist/` là bản build tĩnh; không có dịch vụ gửi form hoặc thu thập đăng ký.

## Nguồn chính

- `src/Stages.tsx`: các mục nội dung và trang Tham gia.
- `src/components/NewcomerHome.tsx`: tổng quan ngắn gọn và ảnh thật cho người mới.
- `src/usability.css`: khung cố định theo màn hình, bố cục từng mục và điều chỉnh theo chiều cao/chiều rộng.
- `src/Workspace.tsx`: một cấp tab cho 6 hướng học.
- `src/bcnInfo.ts`: các hướng học và câu trả lời nhanh.
- `src/content.ts`, `src/activitiesData.ts`: nhãn mục, văn hóa và hoạt động.
- `src/components/ContentDialog.tsx`, `src/components/QuickAnswers.tsx`: thông tin bổ sung và tìm hỏi đáp theo từng câu.
- `src/components/PhotoDialog.tsx`, `src/components/PhotoStory.tsx`: album vừa khung, ảnh giữ tỉ lệ và phục hồi khi tải lỗi.
- `src/media-dialogs.css`, `src/components/ContentIcon.tsx`: bố cục popup, ảnh và icon của nội dung.
- `src/siteConfig.ts`: fanpage, đối tượng, chi phí và thông tin chưa chốt.
- `src/journey.ts`: điều hướng và tương thích đường dẫn.
- `src/responsive.css`, `src/useResponsiveViewport.ts`: bố cục theo chiều rộng/chiều cao, safe area và bàn phím mobile.
- `src/radius.css`: hệ bo góc dùng chung cho khối, nút, popup và nhóm tab.
- `tests/responsive.spec.ts`: 20 kích thước từ 320 đến 2560px, mọi tab của năm mục, 9 cỡ popup, vùng chạm, notch và bàn phím.
- `src/motion.ts`, `src/useStageTransition.ts`, `src/useContentMotion.ts`, `src/useDialogMotion.ts`: chuyển động nội dung, hủy hiệu ứng và hỗ trợ giảm chuyển động.
- `tests/motion.spec.ts`: đổi tab liên tục và thay đổi chế độ giảm chuyển động trong lúc chuyển trang hoặc mở popup.
- `tests/entry.spec.ts`: kiểm tra hành động chính, menu, hướng học, tìm hỏi đáp không dấu, fanpage, album và đường dẫn cũ. Kiểm tra không cuộn, không tràn, không cắt chữ/nút ở cả 5 mục và mọi tab trên 9 kích thước: 320×568, 360×640, 390×844, 768×1024, 844×390, 1024×600, 1280×720, 1366×768, 1440×900.

Ảnh và font dùng tài nguyên trong `public/`. Ấn phẩm tuyển 2025/2026 được giữ làm tư liệu; thông tin K23 theo fanpage chính thức.
