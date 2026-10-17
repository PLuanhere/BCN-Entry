# BCN.OS — triển khai theo hai HTML tham khảo

## Những gì lấy từ mẫu

Đã chạy `gehihi.html` và `gemini.html` bằng Chrome, thao tác giữ nút, chuyển đủ sáu màn, chọn thư mục và chọn cá tính. Chụp desktop 1440×900 và mobile 390×844. Kết quả đo lưu tại `reference-review.json`.

Hai mẫu cùng có một ngôn ngữ thiết kế: khung cửa sổ viền đen, header và footer cố định trong khung, Space Grotesk và Space Mono, xanh `#0044FF`, đen `#0A0A0A`, giấy `#F3F3F1`, các mảng màu lớn và cạnh vuông. Chuyển cảnh ngắn, chữ lớn, nội dung được mở bằng thao tác cụ thể.

Lấy `gehihi.html` làm nền cho nội dung và bố cục Learning / Projects / Product Labs. Kết hợp cách chia nửa màn và màn CTA xanh của `gemini.html`. Loại bỏ phong cách xanh lá, serif, khối isometric, vé và sandbox của lần dựng trước.

## Những gì được sửa khi triển khai

- `gemini.html` có nội dung văn hóa cao hơn viewport trên mobile nhưng không cho cuộn đúng vùng. Bản rebuild chuyển nội dung sang từng lựa chọn để màn chính vừa khung nhìn, giữ header/footer. Cuộn tự nhiên vẫn sẵn sàng khi phóng chữ để không mất nội dung.
- Hai mẫu dùng Tailwind CDN và Google Fonts; bản React dùng CSS trực tiếp, font self-hosted.
- Các chấm của mẫu chỉ là trang trí. Bản rebuild cho phép click để nhảy bước và mở mục lục 7 câu hỏi.
- Giữ cảm giác boot nhưng hỗ trợ pointer, touch, Enter/Space, hủy khi mất focus; không khóa người muốn bỏ qua.
- Cho phép zoom và tạm dừng marquee; hiệu ứng tự chạy theo yêu cầu của người dùng. Dialog và lựa chọn có hỗ trợ accessibility.

## Nguồn nội dung

Notion được đọc trực tiếp bằng cách mở các toggle. `brand-source/notion-full.txt` giữ toàn văn đã đọc; `brand-core.md` và `development-plan.md` giữ các bản nguồn Markdown trước đó. Nguồn ghi nhận diện chưa làm. Màu và font ở đây là ngôn ngữ của prototype người dùng yêu cầu, không gán thành nhận diện chính thức.

Prototype chỉ cung cấp cách thiết kế. Không dùng các phần tự sáng tác của chúng như AI/Data, AWS, Flutter, ảnh Unsplash hoặc câu chuyện “bàn nhậu” làm sự thật về BCN. Nội dung thực tế bám Purpose, Vision, 5 Mission, 6 Values, Brand Personality, Promise, Experience, Culture và Learning / Projects / Product Labs của tài liệu.

Những đề xuất và mục tiêu chưa được xem là thành tích: 50 users/năm, khả năng doanh thu, quy trình tuyển, thử thách nhập môn. Các ghi chú dự thảo được giữ trong toàn văn nguồn để không thất lạc, không đưa thành yêu cầu tuyển cố định trên màn chính.

## Kịch bản sáu màn

1. **BOOT.EXE:** màn tối, log ngắn, chữ Khám phá Hệ thống, giữ nút; có bỏ qua và mục lục.
2. **CORE_IDENTITY:** nửa trái xanh, nửa phải trắng. Ba chế độ nói rõ BCN là ai, sứ mệnh và tầm nhìn. Mở tài liệu đọc chi tiết.
3. **CULTURE.LOG:** marquee, chọn một trong ba trụ cột thái độ/chủ động, thực chiến/tư duy, cộng hưởng/trách nhiệm. Chạm để đọc từng nguyên tắc thực hành. Liên kết cam kết giúp hiểu kỳ vọng cụ thể.
4. **WORKSPACE.DIR:** thư mục trái, nội dung phải. Năm thư mục trả lời học gì, làm gì, Product Labs, một vòng thực hành dự án, và các hướng trưởng thành.
5. **MINDSET_SYNC:** câu hỏi khi gặp việc chưa từng làm; ba lựa chọn tự tìm hiểu, phân tích, trao đổi với mentor/team. Chọn mở lời mời riêng; không chấm điểm.
6. **COMMITMENT:** nền xanh, lời mời theo cá tính, CTA rõ và lộ trình Discover → Register → Try → Commit. Form giữ placeholder theo yêu cầu.

## Đủ bảy câu hỏi

| Câu hỏi trong ảnh                       | Câu trả lời trong app                       |
| --------------------------------------- | ------------------------------------------- |
| BCN là ai?                              | Màn 02 / Chúng mình / Purpose & Positioning |
| BCN làm gì?                             | Màn 02 / Sứ mệnh và màn 04                  |
| Văn hóa BCN là gì?                      | Màn 03 và cửa sổ tài liệu                   |
| Thành viên sẽ học và làm gì?            | Màn 04 / Learning, Projects, Product Labs   |
| BCN kỳ vọng gì ở thành viên?            | Cửa sổ cam kết mở tại màn 03 và 05          |
| Một ngày / một project diễn ra thế nào? | Màn 04 / Workflow bốn bước, ghi rõ minh họa |
| Những người tham gia BCN đang làm gì?   | Màn 04 / Người BCN đi tiếp đâu?             |

Theo người dùng làm rõ, câu cuối được thể hiện bằng lộ trình phát triển, không lập hồ sơ từng thành viên. Các hướng là xây nền tảng → thực hành dự án → có thể mentor hoặc tham gia Product Labs khi phù hợp về năng lực, thái độ và đóng góp.

## Kiểm tra

TypeScript, production build, Playwright desktop/mobile; giữ/thả nút và bàn phím, lịch sử, hash URL, toàn văn nguồn, các thư mục, cá nhân hóa, CTA placeholder, dialog/focus, giảm chuyển động, cuộn và tràn ngang. Ảnh của cả sáu màn được kiểm tra trực quan, gồm desktop và mobile. Có thêm viewport 320px, tablet và landscape thấp.

## Chữ lớn, màn gọn

Nội dung chính dùng 16–18px; tiêu đề 27–88px theo viewport. Loại bỏ các đoạn giới thiệu lặp, chia Learning thành cơ bản/nâng cao, mỗi dự án, bước workflow và hướng trưởng thành chỉ hiện một nội dung. Màn thấp dùng thêm các nút số có tên truy cập đầy đủ. Chi tiết lộ trình gia nhập và toàn văn nguồn đọc trong dialog. Không ép thu nhỏ toàn bộ giao diện hoặc giấu nội dung tràn bằng overflow hidden. Playwright kiểm tra tất cả lựa chọn ở 1440×900, 1280×720, 390×844, 360×640, 320×740, 768×844 và 844×390.

## Culture: cột mở ngang và marquee liên tục

Ba cột rộng bằng nhau lúc bắt đầu. Cột được chọn mở rộng ngang trong 480ms, hai cột còn lại trở thành thanh chọn; bấm lại để thu gọn. Nội dung giữ độ rộng đích trong lúc mở để chữ không bị xuống dòng liên tục. Có aria-expanded, điều khiển bằng bàn phím; animation mở ngang luôn được bật. Marquee gồm hai nhóm chữ giống nhau, dịch đúng một nhóm mỗi vòng 40 giây, không khởi động lại khi đổi cột. Chạm dải chữ để tạm dừng/tiếp tục. Dải chữ vẫn hiện trên màn thấp.

## Workspace: nội dung ngắn và đồ họa theo tab

Năm tab có indicator, roving focus và phím trái/phải/Home/End. Nội dung vào bằng trượt/fade 520ms; lựa chọn bên trong có reveal 440ms, đồ họa 560ms và chuyển động vòng lặp nhẹ. Learning có ba mô-đun nền tảng hoặc quỹ đạo logo stack; Projects có mô hình MVP; Labs ghép khối hình; Workflow có vòng lặp nét đứt; Growth có bậc thang phát triển. Chỉ giữ tóm tắt trên màn chính, phần nguồn đầy đủ nằm trong native dialog. Mở dialog kết thúc chuyển cảnh đang chạy. Chữ nội dung giữ 16–18px, hình vẽ được co theo màn; logo lưu tại máy, không phụ thuộc CDN.

Chuyển màn chính tăng thành 340/520ms để dễ thấy, vẫn hủy được khi bấm liên tiếp. Web Animations 440ms dự phòng cả khi trình duyệt không có View Transitions lẫn khi API có nhưng capture thất bại. Không có ON/OFF hoặc cài đặt hệ thống tắt hiệu ứng trên website.

## Animation tự động

Không có ON/OFF, hook tùy chọn hoặc chặn animation theo cài đặt hệ thống. Không dùng localStorage để điều khiển hiệu ứng. Trang tự chạy marquee, đồ họa và chuyển cảnh ngay khi mở, kể cả Windows đang giảm chuyển động hoặc còn lưu OFF của bản cũ. Kiểm thử layout đóng băng animation bằng stylesheet riêng chỉ trong test để đo kích thước ổn định; kiểm thử motion dùng chuyển động thật.
