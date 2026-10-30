export const studyTracks = [
  { id: "basic", label: "Cơ Bản", title: "Xây nền tảng\ntư duy lập trình.", text: "Bắt đầu với C, Java và lập trình hướng đối tượng (OOP).", start: "Bạn quan tâm đến nền tảng?", startText: "Làm quen với C và Java, học cách tổ chức chương trình bằng đối tượng.", tech: ["c", "java", "oop"] },
  { id: "frontend", label: "Frontend", title: "Xây giao diện\ncho website.", text: "Lộ trình Web cơ bản → nâng cao với HTML, CSS và JavaScript.", start: "Bạn thích phần người dùng nhìn thấy?", startText: "Khám phá cách tạo giao diện và tương tác trên website.", tech: ["html5", "css", "javascript"] },
  { id: "backend", label: "Backend", title: "Phát triển\nphía máy chủ.", text: "Học xây dựng phần xử lý và dữ liệu phía sau ứng dụng.", start: "Bạn tò mò ứng dụng hoạt động ra sao?", startText: "Tìm hiểu phần xử lý yêu cầu và tổ chức dữ liệu để giao diện có thể hoạt động.", tech: ["code"] },
  { id: "nondev", label: "Non-dev", title: "Làm sản phẩm\nbằng góc nhìn khác.", text: "Thiết kế giao diện, trải nghiệm người dùng và phân tích yêu cầu sản phẩm.", start: "Bạn quan tâm thiết kế và người dùng?", startText: "Khám phá thiết kế giao diện, trải nghiệm người dùng và phân tích yêu cầu sản phẩm.", tech: ["figma"] },
  { id: "fullstack", label: "Fullstack", title: "Kết nối giao diện\nvà phía máy chủ.", text: "Phát triển ở cả giao diện và phía máy chủ để xây dựng sản phẩm hoàn chỉnh.", start: "Bạn muốn hiểu toàn bộ một ứng dụng?", startText: "Tìm hiểu cách Frontend và Backend kết nối, từ thao tác trên giao diện đến dữ liệu phía sau.", tech: ["code", "html5", "javascript"] },
  { id: "mobile", label: "Mobile", title: "Làm ứng dụng\nAndroid.", text: "Lập trình Android với Java, Kotlin và xây dựng giao diện bằng Jetpack Compose.", start: "Bạn muốn làm ứng dụng điện thoại?", startText: "Tìm hiểu Android, Java, Kotlin và Jetpack Compose.", tech: ["android", "java", "kotlin", "compose"] },
] as const;

export const quickQuestions = [
  { question: "BCN là gì, thuộc đơn vị nào?", answer: "Ban Công Nghệ thuộc Đoàn khoa Công nghệ Thông tin, Trường Đại học Công nghiệp TP.HCM (IUH). Sinh viên cùng học, thực hành và kết nối qua các hoạt động chung.", stage: "identity" },
  { question: "Ai có thể tham gia? Có mất phí không?", answer: "BCN dành cho sinh viên khoa Công nghệ Thông tin, IUH và không thu phí. Điều kiện tuyển cụ thể cho K23 hiện chưa chốt.", stage: "commit" },
  { question: "Chưa biết lập trình có được ứng tuyển không?", answer: "Yêu cầu kỹ năng đầu vào cho K23 chưa chốt. BCN đề cao tinh thần học hỏi và đang có Training C cho khóa mới. Điều kiện ứng tuyển sẽ theo thông báo chính thức.", stage: "workspace" },
  { question: "BCN có những hướng học nào?", answer: "Cơ Bản (C, Java, OOP); Frontend (Web cơ bản → nâng cao); Backend; Non-dev (Design, BA, UX/UI); Fullstack; Mobile (Android, Java, Kotlin, Jetpack Compose).", stage: "workspace" },
  { question: "NoCode và Non-dev khác nhau thế nào?", answer: "NoCode là hoạt động ngoại khóa làm video theo chủ đề đời sống sinh viên. Non-dev là các vai trò ngoài lập trình như Design, BA, UX/UI.", stage: "activities" },
  { question: "Sinh hoạt ở đâu, cần dành bao nhiêu thời gian?", answer: "Lịch, địa điểm và thời lượng tham gia tối thiểu chưa chốt. BCN khuyến nghị tự học khoảng 2 giờ mỗi ngày; đây là gợi ý, không phải điều kiện bắt buộc.", stage: "culture" },
  { question: "Khi nào tuyển K23 và đăng ký ở đâu?", answer: "K22 đã tuyển xong. Lịch, điều kiện và các vòng tuyển K23 chưa chốt. Thông tin chính thức sẽ cập nhật trên fanpage BCN.", stage: "commit" },
] as const;
