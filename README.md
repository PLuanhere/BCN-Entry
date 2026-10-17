# Ban Công Nghệ / BCN.OS

Interactive Entrypage gồm bảy màn hình, dựng lại theo hai HTML người dùng cung cấp: `D:/WEB/basic/gehihi.html` và `D:/WEB/basic/gemini.html`.

Giữ cách trình bày của hai mẫu: khung cửa sổ viền đen dày, màu xanh `#0044FF`, Be Vietnam Pro / Space Mono, boot screen tối, bố cục chia đôi, văn hóa gồm ba cột mở ngang trên desktop và các hàng ảnh mở dọc trên điện thoại, workspace với tab và đồ họa chuyển động và màn Commit chia đôi với ảnh tuyển CTV lớn. Project dùng React + TypeScript + CSS trực tiếp, không phụ thuộc Tailwind CDN, Google Fonts hoặc một thư viện hiệu ứng khi chạy.

## Chạy

Node.js 22.12+:

```sh
npm install
npm run dev
```

Mở địa chỉ Vite in trong terminal. Windows có thể chạy `start.cmd` sau khi cài dependencies.

```sh
npm run build
npm run preview
npm test
```

`dist/` chứa bản production để triển khai trên hosting tĩnh. `base: './'` hỗ trợ thư mục con. Playwright dùng Chrome đã cài trên máy và tự khởi động/dừng Vite khi kiểm thử.

## Bảy màn hình

| Màn                    | Nội dung và thao tác                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 01 / BOOT.EXE          | Giữ nút 1,2 giây hoặc giữ Enter để khởi động; thả sớm thì hủy. Có mục lục 7 câu hỏi.                                                         |
| 02 / CORE_IDENTITY     | Hai nửa xanh/trắng; chuyển Chúng mình / Sứ mệnh / Tầm nhìn. Mở tài liệu để đọc Purpose, Vision, 5 Mission, 6 Values, Promise, Experience.    |
| 03 / CULTURE.LOG       | Ba cột accordion mở ngang, bấm lại để thu gọn; marquee nối vòng liên tục có tạm dừng; đọc từng nguyên tắc và cam kết.                        |
| 04 / WORKSPACE.DIR     | Năm tab Learning / Projects / Product Labs / Một project / Đi tiếp; nội dung ngắn, đồ họa động riêng, logo công nghệ và cửa sổ đọc chi tiết. |
| 05 / LIFE.OUTSIDE_CODE | Trung Thu có bộ 4 ảnh; NoCode / Tết giữ placeholder; chuyển tab và nội dung ngắn.                                                                |
| 06 / MINDSET_SYNC      | Chọn cách bắt đầu một việc chưa từng làm; chuyển đến lời mời cá nhân hóa. Có thể bỏ qua.                                                     |
| 07 / COMMITMENT        | Lời mời theo lựa chọn, CTA đăng ký và ấn phẩm tuyển CTV 2026 / 2025 hiển thị lớn, chuyển năm ngay trên trang.                                                                    |

URL: `/#/boot`, `/#/identity`, `/#/culture`, `/#/workspace`, `/#/activities`, `/#/sync`, `/#/commit`. Hỗ trợ nhảy bước, Back/Forward trình duyệt, phím trái/phải khi focus ngoài điều khiển, vuốt ngang trên nội dung trống.

## Đủ 7 câu hỏi trong ảnh

| Câu hỏi                                  | Vị trí                                    |
| ---------------------------------------- | ----------------------------------------- |
| BCN là ai?                               | Màn 02 / Chúng mình                       |
| BCN làm gì?                              | Màn 02 / Sứ mệnh; màn 04                  |
| Văn hóa BCN là gì?                       | Màn 03; cửa sổ cam kết; tài liệu gốc      |
| Thành viên sẽ học và làm gì?             | Màn 04 / Learning, Projects, Product Labs |
| BCN kỳ vọng gì ở thành viên?             | Màn 03 và 06 / Xem cam kết                |
| Một ngày / một project diễn ra thế nào?  | Màn 04 / Một ngày / một project           |
| Những người đã tham gia BCN đang làm gì? | Màn 04 / Người BCN đi tiếp đâu?           |

Theo người dùng làm rõ, câu cuối thể hiện hướng trưởng thành trong lộ trình: học nền tảng, làm dự án, trở thành người hướng dẫn hoặc tham gia Product Labs. Không dựng hồ sơ cá nhân hoặc thành tích giả.

## Tài liệu Notion

Nguồn: https://scientific-light-5a3.notion.site/BrandGuide-Ban-C-ng-Ngh-3ea4aa36118d80249099cd4865443da5

Đã mở các toggle trên trang công khai và đối chiếu trực tiếp vào ngày 16/10/2026. Bản toàn văn lưu tại `docs/brand-source/notion-full.txt`, bao gồm Brand Core và Kế hoạch phát triển. Hai bản Markdown nguồn trước đó vẫn được giữ nguyên để đối chiếu. Nguồn gốc được giữ để đối chiếu trong repository. Giao diện Docs dùng dữ liệu đã chia mục tại `src/documents.ts`; không hiển thị toàn văn nguồn, tab Notion hoặc link dẫn ra Notion.

Các mục Ecosystem và Phát triển thương hiệu trong bản Notion đã đọc chỉ có đề mục. Không tự tạo nội dung rồi gán cho nguồn. Brand Identity ghi “Chưa làm”; màu và font của giao diện lấy theo hai prototype được người dùng chọn, không được gọi là nhận diện chính thức.

Mục tiêu 50 người dùng/năm, các hướng đào tạo, Product Labs và quy trình gia nhập được trình bày đúng là định hướng. Workflow là minh họa từ nguyên tắc văn hóa, không phải lịch sinh hoạt đã công bố. Các chi tiết dự thảo như coins vẫn giữ trong toàn văn nguồn, không biến thành điều kiện tuyển hiện hành trên màn chính.

## CTA placeholder

URL đăng ký tiếp tục để trống theo yêu cầu trước đó. Điền HTTPS URL chính thức vào `registrationUrl` trong `src/siteConfig.ts` để mở form trong tab mới. Khi URL trống, CTA mở thông báo “Link đăng ký sẽ được cập nhật tại đây”, kèm nút xem lộ trình gia nhập ngay trong app. Không thu thập dữ liệu hoặc báo đăng ký thành công giả.

## UX và accessibility

App giữ header/footer trong khung. Mỗi màn chính trình bày một ý tại một thời điểm, vừa khung nhìn ở các kích thước đã kiểm tra; chữ nội dung 16–18px, tiêu đề 27–88px. Văn hóa, hoạt động và lộ trình dùng lựa chọn để thay nội dung thay vì xếp thành trang dài. Trên màn thấp, bố cục đổi thành hai cột hoặc thu gọn phần phụ; không dùng scale để thu nhỏ chữ. Tài liệu và chi tiết gia nhập mở trong cửa sổ đọc có cuộn. `main` vẫn cho cuộn tự nhiên khi người dùng phóng chữ hoặc dùng kích thước đặc biệt, tránh cắt nội dung; wheel không đổi bước. Trên điện thoại, thư mục có thể vuốt ngang; thư mục đang chọn tự hiện trong thanh.

Bố cục mobile được tinh chỉnh trong `src/mobile.css`: điều hướng và nút đóng/đổi ảnh có vùng chạm 44px, tiến trình có vùng chạm riêng 26×44px, Docs giữ nút đóng cố định trong khi vùng đọc cuộn. Khung dùng `100dvh` và safe-area, bao gồm màn hình thấp và xoay ngang. Culture trên màn dọc dùng tiêu đề ngang, phần tóm tắt ngắn và các nguyên tắc chi tiết; bản đầy đủ vẫn có trong Docs. `src/useSwipeGesture.ts` tách vuốt ảnh khỏi chuyển bước, bỏ qua thao tác nhiều ngón, vuốt dọc, thao tác tại mép màn hình và thanh lựa chọn. Vuốt ảnh tại Identity hoặc bộ ảnh không mở nhầm popup; giữ nút ở Boot vẫn là thao tác bắt đầu hành trình.

Không tắt pinch zoom. Có safe area cho thiết bị di động, focus khi chuyển màn, skip link, điều hướng bàn phím, lựa chọn `aria-pressed`, bước hiện tại `aria-current` và native dialog hỗ trợ Escape/focus trap. Animation tự chạy trên desktop và mobile, theo yêu cầu của người dùng; không có nút ON/OFF và không phụ thuộc `prefers-reduced-motion` của hệ thống. Marquee có tạm dừng riêng.

Lựa chọn nội dung chỉ lưu trong `sessionStorage`, không gửi ra ngoài. Animation không đọc hoặc lưu tùy chọn ON/OFF. Storage bị chặn hoặc dữ liệu hỏng thì dùng mặc định. Font Be Vietnam Pro và Space Mono được lưu tại `public/fonts` cùng giấy phép OFL. Be Vietnam Pro dùng cho tiêu đề và nội dung với ba độ đậm 400/600/700; Space Mono chỉ dùng cho nhãn kỹ thuật. Khoảng cách tiêu đề được nới về -0.015em đến 0 và giãn dòng 1.22–1.35 để dấu tiếng Việt có đủ khoảng thở. Nguồn font: https://github.com/google/fonts/tree/main/ofl/bevietnampro.

## Chuyển cảnh

Tất cả cửa sổ tài liệu, chi tiết Workspace và bộ ảnh dùng chung `src/useDialogMotion.ts`: mở bằng fade/trượt nhẹ 360ms, đóng 220ms, lớp nền tối chuyển đồng bộ. Nút đóng, Escape và bấm ngoài đều chờ hiệu ứng thoát trước khi đóng native dialog và trả focus. Docs chỉ hiển thị chủ đề đang đọc; đổi nội dung trong dialog sẽ đưa vùng đọc về đầu. Các yêu cầu lặp được gộp, animation bị ngắt tiếp tục từ vị trí đang hiển thị.

Ảnh nền màn Bản sắc tự trượt ngang khoảng 5 giây/lần, nối vòng từ ảnh cuối về ảnh đầu. Tiêu đề và lớp phủ tối đứng yên. Bản desktop có nút trước/sau và số ảnh; trên điện thoại giữ dải chỉ báo gọn để không chiếm chỗ của nội dung. Danh sách ảnh nằm trong `src/components/IdentityCarousel.tsx`, dùng ảnh training từ `public/img`.

Tiến/lùi dùng hiệu ứng trượt nhẹ kết hợp fade: màn cũ ra trong 340ms, màn mới vào trong 520ms. Chỉ vùng đọc nội dung được chụp để chuyển cảnh bằng View Transitions; header, footer và khung BCN.OS đứng yên. Trên mobile khoảng dịch chuyển được giảm để đỡ gây mất phương hướng.

Mỗi yêu cầu có phiên bản riêng. Bấm liên tiếp, vuốt, nhảy bước hoặc Back/Forward sẽ ưu tiên yêu cầu mới nhất; callback cũ không được ghi đè màn mới. Lớp chuyển cảnh cho phép thao tác xuyên qua, nên thanh điều hướng vẫn dùng được trong lúc animation chạy. Không nhân bản cây React hoặc giữ các nút của trang cũ trong DOM.

Trình duyệt chưa hỗ trợ View Transitions, hoặc có API nhưng không tạo được snapshot, dùng fade/trượt 440ms qua Web Animations; nếu cũng không có API này thì đổi màn trực tiếp. Animation luôn tự chạy khi trang đang hiển thị; cài đặt giảm chuyển động của OS và giá trị OFF cũ trong localStorage không tắt hiệu ứng. Resize, xoay màn hình và chuyển tab sẽ kết thúc hiệu ứng đang chạy. Scroll/focus được đặt lại trước khi vẽ màn mới; hoàn tất animation dựa trên promise của trình duyệt, không dựa vào bộ đếm thời gian để gỡ màn.

## Source và xác minh

- `src/App.tsx`: khung BCN.OS, điều hướng, cử chỉ, dialog và chuyển động.
- `src/Stages.tsx`: điều phối bảy màn hình.
- `src/Activities.tsx`, `src/activitiesData.ts`: giao diện Ngoài code, nội dung và tên file ảnh cho từng hoạt động.
- `src/Workspace.tsx`, `src/workspaceData.ts`, `src/workspace.css`: tab, nội dung tóm tắt, chi tiết và đồ họa riêng của Workspace.
- `src/components/TechIcon.tsx`: logo công nghệ lưu tại máy và các glyph tự vẽ.
- `src/journey.ts`: URL, lịch sử và trạng thái trong phiên.
- `src/useStageTransition.ts`: chuyển cảnh, hủy yêu cầu cũ và fallback tự động.
- `src/content.ts`: dữ liệu BCN đã biên tập từ nguồn.
- `src/components/BootButton.tsx`: giữ/thả bằng pointer và bàn phím, hủy khi mất focus.
- `src/components/ContentDialog.tsx`: mục lục, cam kết, tài liệu nguồn và CTA placeholder.
- `src/culture.css`: accordion ngang, dải chữ nối vòng và responsive của màn văn hóa.
- `src/styles.css`: layout theo HTML tham khảo, responsive và animation.
- `tests/journey.spec.ts`: hành vi desktop/mobile, nội dung, scroll, responsive và animation tự động.
- `tests/motion.spec.ts`: animation tự chạy trên Windows thật, khi OS giảm chuyển động, có giá trị OFF cũ hoặc storage bị chặn; xác minh CSS, accordion và chuyển màn.
- `tests/workspace.spec.ts`: xác minh animation đang chạy, khung hình giữa chuyển động, tab bàn phím, chi tiết nguồn, icon và giảm chuyển động.
- `tests/culture.spec.ts`: mở/thu cột, đổi nhanh bằng chuột/bàn phím, điểm nối marquee, tạm dừng và giảm chuyển động.
- `tests/readability.spec.ts`: kiểm tra chiều cao, tràn ngang, cỡ chữ và từng lựa chọn ở 7 kích thước màn hình.
- `tests/transitions.spec.ts`: hai chiều chuyển cảnh, click giữa animation, bấm liên tục, lịch sử, resize, fallback và vuốt cảm ứng.
- `docs/design-direction.md`: phân tích tham khảo và ánh xạ nội dung.
- `docs/reference-review.json`: kết quả chạy đủ 6 màn của cả hai HTML ở desktop/mobile.

Ảnh QA sau `npm test` nằm tại `test-results/visual/`. Màn hình được kiểm tra ở desktop, 390px, 320px, tablet và landscape thấp.

## Workspace và chuyển động

Tab mới vào bằng trượt/fade 520ms; khi đổi lựa chọn, nội dung và đồ họa vào riêng trong 440–560ms. Learning dùng sơ đồ nền tảng và quỹ đạo stack, Projects dùng mô hình trình duyệt/MVP, Product Labs dùng các khối giao nhau, Workflow dùng đường nối chuyển động, Growth dùng bậc thang. Nội dung chính rút gọn; “Đọc chi tiết” giữ nội dung gốc, bao gồm điều kiện và mục tiêu trong kế hoạch. Tab hỗ trợ trái/phải, Home/End; có thể đổi tiếp giữa animation.

Logo React, JavaScript, HTML5, Kotlin và Figma lưu tại `public/tech`, lấy từ Simple Icons cùng giấy phép CC0; Java, code và team dùng glyph minh họa tự vẽ. Màu biểu tượng bám giao diện, không gọi đây là stack bắt buộc hoặc đối tác của BCN. Các hiệu ứng tự khởi chạy, không cần bật ON/OFF và không bị OS giảm chuyển động vô hiệu hóa. Marquee có tạm dừng riêng.

## Animation tự động

Theo yêu cầu người dùng, chuyển động luôn tự khởi chạy. Đã xóa nút ON/OFF, hook tùy chọn, các quy tắc CSS và nhánh JavaScript tắt hiệu ứng theo OS. Không đọc khóa localStorage `bcn-motion-v1`; giá trị OFF từ bản cũ không ảnh hưởng. Marquee, accordion, đồ họa Workspace và chuyển màn được kiểm tra khi Windows thực tế đang báo giảm chuyển động. Chỉ kết thúc chuyển cảnh đang chạy khi mở dialog, đổi kích thước hoặc trang chuyển sang ẩn để tránh lớp snapshot bị kẹt.

## Ảnh cho trang Ngoài code

Trung Thu dùng bộ 4 ảnh từ `src/photoAlbums.ts`, có điều hướng ảnh và mở xem lớn ngay trong Activities. NoCode và Tết trong `src/activitiesData.ts` vẫn để `image: null`. Thêm ảnh vào `public/img`, rồi thay `null` bằng tên file, ví dụ `image: "BCN_Tet.jpg"`. Chỉnh `imageAlt` để mô tả ảnh thực tế. Khung ảnh giữ nguyên kích thước khi thay placeholder bằng ảnh.

## Docs theo ngữ cảnh

Docs trên thanh đầu trang mở nội dung của màn và tab hiện tại: bản sắc, thư mục Workspace, hoạt động, cam kết hoặc lộ trình gia nhập. Nút đọc tại Identity chỉ mở Chúng mình, Sứ mệnh hoặc Tầm nhìn. Chi tiết Workspace chỉ gồm lựa chọn hiện tại, các ý chính và công nghệ liên quan; không dẫn tới tài liệu tổng hợp.

Nội dung chia thành các phần đánh số và danh sách ngắn, hai cột trên desktop, một cột trên mobile. Ảnh BCN_Logo.jpg hiển thị nguyên tấm trong Docs giới thiệu BCN, không cắt ảnh hoặc đặt ở header. Commit giữ hai ấn phẩm 2026/2025 trên trang, không có thao tác xem lớn.

## Trang Mindset Sync

Màn Sync dùng nền giấy sáng với lưới mảnh, nét sơ đồ kỹ thuật và tín hiệu SVG tự chuyển động. Desktop chia câu hỏi và ba lựa chọn thành hai cột; điện thoại dùng một cột, giữ tiêu đề và thao tác chính vừa khung. Màu xanh chỉ dùng làm điểm nhấn. Mỗi lựa chọn vẫn dẫn tới lời mời cá nhân hóa ở Commit; tài liệu cam kết mở đúng nội dung trong app. Hiệu ứng không phụ thuộc tùy chọn giảm chuyển động của OS. Kiểm tra riêng tại tests/sync.spec.ts gồm 13 kích thước màn hình, trạng thái animation và lựa chọn cá nhân hóa.
