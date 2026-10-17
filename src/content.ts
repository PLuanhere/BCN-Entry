export const stages = [
  { id: "boot", label: "Khởi động", code: "BOOT.EXE" },
  { id: "identity", label: "BCN là ai?", code: "CORE_IDENTITY" },
  { id: "culture", label: "Văn hóa", code: "CULTURE.LOG" },
  { id: "workspace", label: "Học & làm", code: "WORKSPACE.DIR" },
  { id: "activities", label: "Ngoài code", code: "LIFE.OUTSIDE_CODE" },
  { id: "sync", label: "Điểm chung", code: "MINDSET_SYNC" },
  { id: "commit", label: "Gõ cửa BCN", code: "COMMITMENT" },
];
export const stageIndex = (id: string) =>
  stages.findIndex((stage) => stage.id === id);

export const questions = [
  { text: "BCN là ai?", stage: 1 },
  { text: "BCN làm gì?", stage: 1 },
  { text: "Văn hóa BCN là gì?", stage: 2 },
  { text: "Thành viên sẽ học và làm gì?", stage: 3, folder: 0 },
  { text: "BCN kỳ vọng gì ở thành viên?", stage: stageIndex("sync") },
  {
    text: "Một ngày / một project ở BCN diễn ra như thế nào?",
    stage: 3,
    folder: 3,
  },
  { text: "Những người đã tham gia BCN đang làm gì?", stage: 3, folder: 4 },
];

export const identityViews = [
  {
    label: "Chúng mình",
    tag: "PURPOSE / POSITIONING",
    title: "MÁI NHÀ CHUNG\nCỦA SINH VIÊN\nYÊU CÔNG NGHỆ.",
    text: "Ban Công Nghệ tiếp nối truyền thống cựu sinh viên hỗ trợ sinh viên. Một cộng đồng thực hành để cùng học, xây dựng sản phẩm và trưởng thành qua dự án thực tế.",
    note: "Tạo cơ hội cho sinh viên có ý chí vươn lên. Có người đồng hành, có nơi để thuộc về.",
  },
  {
    label: "Sứ mệnh",
    tag: "TRAINING / MENTORSHIP / COMMUNITY",
    title: "HỌC ĐƯỢC.\nLÀM ĐƯỢC.\nCHIA SẺ LẠI.",
    text: "Huấn luyện từ nền tảng, kết nối mentor và cộng đồng, rèn năng lực bằng dự án. Product Labs là định hướng phát triển các nhóm chuyên môn để tạo sản phẩm có người dùng.",
    note: "5 sứ mệnh: Training · Mentorship · Community · Product Labs · Projects.",
  },
  {
    label: "Tầm nhìn",
    tag: "VISION / LONG-TERM COMMUNITY",
    title: "ĐI XA HƠN\nMỘT KHÓA HỌC.",
    text: "BCN hướng tới một cộng đồng gắn bó lâu dài, nơi thành viên tạo sản phẩm có người dùng, có khả năng tạo thu nhập và vẫn tìm thấy một mái nhà chung sau khi ra trường.",
    note: "Định hướng phát triển dài hạn, không phải cam kết đầu ra hoặc thu nhập.",
  },
];

export const culturePillars = [
  {
    title: "Thái độ &\nChủ động",
    photo: "BCN_Train05.jpg",
    photoPosition: "56% 64%",
    mobileText:
      "Chủ động tìm hiểu, thử giải quyết vấn đề và hỏi khi cần. Tinh thần học hỏi quan trọng hơn xuất phát điểm.",
    text: "Xuất phát điểm không quan trọng bằng tinh thần học hỏi. Thấy vấn đề thì thử tìm cách giải quyết. Chưa biết thì tìm cách học và chủ động hỏi.",
    command: "ASK → TRY → LEARN",
    details: [
      "Không giấu điều chưa biết, không ngại yêu cầu hướng dẫn.",
      "Hiểu mục tiêu trước khi làm, chủ động đề xuất cách tốt hơn.",
      "Dám thử, dám sai, dám thay đổi; không bỏ cuộc khi gặp khó.",
    ],
  },
  {
    title: "Thực chiến &\nTư duy",
    photo: "BCN_Train04.jpg",
    photoPosition: "55% 50%",
    mobileText:
      "Học qua việc thật: thử, sai, sửa. Hiểu vấn đề từ người dùng, sản phẩm và đội nhóm.",
    text: "Kiến thức cần được áp dụng vào việc thật. Được thử, được sai và tự tìm cách vượt qua. Nhìn vấn đề từ người dùng, sản phẩm, đội nhóm và mục tiêu chung.",
    command: "BUILD → REVIEW → IMPROVE",
    details: [
      "Làm xong phải kiểm tra và giải thích được mình đã làm gì, vì sao.",
      "Không làm hộ, không gian lận, không phụ thuộc AI để đối phó.",
      "Góp ý vào hành động và kết quả; chỉ rõ vấn đề, đưa cách cải thiện.",
    ],
  },
  {
    title: "Cộng hưởng &\nTrách nhiệm",
    photo: "BCN_Train07.jpg",
    photoPosition: "66% 60%",
    mobileText:
      "Cùng học, chia sẻ và giữ cam kết. Mỗi người tiến bộ cũng giúp đồng đội đi xa hơn.",
    text: "Một người giỏi tạo ra năng lực. Một tập thể tốt tạo ra sức mạnh. Phát triển cá nhân đi cùng trách nhiệm kéo những người xung quanh cùng tiến bộ.",
    command: "SHARE → SUPPORT → GROW",
    details: [
      "Người đi trước hỗ trợ người đi sau, không làm thay.",
      "Nhận việc thì theo đến cùng; khó khăn phải báo sớm, không ghost.",
      "Tôn trọng đóng góp, trao đổi văn minh và ghi nhận điều làm tốt.",
    ],
  },
];

export const expectations = [
  {
    title: "Chủ động với việc học",
    body: "Tự tìm hiểu, hỏi khi chưa hiểu, có mục tiêu cụ thể mỗi học kỳ. Kế hoạch phát triển đặt ra nhịp tự học tối thiểu hai giờ mỗi ngày.",
  },
  {
    title: "Có trách nhiệm với cam kết",
    body: "Đúng giờ, giữ deadline, nhận việc vừa sức và theo đến cùng. Không thể hoàn thành thì thông báo sớm để nhóm có giải pháp.",
  },
  {
    title: "Giao tiếp rõ ràng",
    body: "Không hiểu phải hỏi, không đồng ý phải nói rõ lý do. Trao đổi trực tiếp khi có mâu thuẫn, feedback công việc không công kích cá nhân.",
  },
  {
    title: "Làm thật và hiểu việc mình làm",
    body: "Tham gia dự án chung, không gian lận, không nhờ làm hộ, không lạm dụng AI. Hoàn thành phải kiểm tra và hiểu được sản phẩm.",
  },
  {
    title: "Cùng nhau tiến bộ",
    body: "Chia sẻ kiến thức, tôn trọng ý tưởng, hỗ trợ đồng đội. Biết lắng nghe, nhận sai và cải thiện sau phản hồi.",
  },
];

export const folders = [
  { id: "learning", label: "Learning", sub: "Lộ trình học tập" },
  { id: "projects", label: "Projects", sub: "Thực chiến dự án" },
  { id: "labs", label: "Product Labs", sub: "Nhóm chuyên môn" },
  { id: "workflow", label: "Một ngày / một project", sub: "Cách cùng làm" },
  { id: "path", label: "Người BCN đi tiếp đâu?", sub: "Hướng trưởng thành" },
];

export const learningTracks = [
  {
    name: "Fullstack Website",
    detail:
      "Từ Frontend Web Basic, phát triển năng lực xây dựng website hoàn chỉnh với React và Next.js.",
  },
  {
    name: "Fullstack Mobile",
    detail:
      "Phát triển ứng dụng với React Native, hoặc xây dựng ứng dụng Android bằng Java / Kotlin từ nền tảng OOP Java.",
  },
  {
    name: "NoCode",
    detail:
      "Product Design, Business Analyst, UX/UI, Graphic Design, truyền thông và các vai trò đóng góp cho sản phẩm.",
  },
  {
    name: "Lộ trình tự chọn",
    detail:
      "Chọn hướng học riêng, vẫn review sản phẩm và năng lực định kỳ, cùng tham gia dự án chung.",
  },
];

export const projectKinds = [
  {
    name: "Dự án đánh giá năng lực",
    detail:
      "Trong hoặc cuối khóa huấn luyện. Mỗi thành viên đều đóng góp và hiểu dự án; không làm hộ, không phụ thuộc AI.",
  },
  {
    name: "Dự án của tân sinh viên",
    detail:
      "Đi cùng Website Basic: hiểu cách làm phần mềm, ứng dụng kiến thức và tạo sản phẩm mang dấu ấn nhóm.",
  },
  {
    name: "Dự án nhóm từ năm 2",
    detail:
      "Sau lộ trình cơ bản, xây MVP, tìm người dùng và cải tiến qua feedback. Kế hoạch đặt mục tiêu tối thiểu 50 người dùng trong một năm, không phải thành tích đã đạt.",
  },
  {
    name: "Dự án NoCode",
    detail:
      "Hoạt động gắn kết dành cho mọi thành viên, thử trải nghiệm mới ngoài lập trình, tương tự một hình thức team building.",
  },
];

export const workflow = [
  {
    label: "Hiểu & chia việc",
    title: "RÕ MỤC TIÊU, RÕ TRÁCH NHIỆM.",
    text: "Cùng hiểu vấn đề của người dùng, xác định kết quả cần có và chia phần việc vừa sức. Người nhận việc chủ động thống nhất cách làm và thời hạn.",
  },
  {
    label: "Học & làm thử",
    title: "THỬ LÀM. HỎI KHI CẦN.",
    text: "Giữ nhịp tự học, thực hành phần được giao. Có thể cùng học ở thư viện hoặc qua Discord theo định hướng cộng tác. Vướng thì báo sớm và nhờ hướng dẫn.",
  },
  {
    label: "Review & góp ý",
    title: "NHÌN LẠI ĐỂ TỐT HƠN.",
    text: "Kiểm tra kết quả, giải thích cách làm, nhận feedback cụ thể. Điều gì tốt? Điều gì chưa tốt? Vì sao? Lần sau cần cải thiện gì?",
  },
  {
    label: "Sửa & chia sẻ",
    title: "CẢI TIẾN RỒI CHIA SẺ LẠI.",
    text: "Sửa vấn đề, thử với người dùng, ghi lại bài học và cách làm hiệu quả. Ghi nhận đóng góp để kinh nghiệm trở thành năng lực chung của đội.",
  },
];

export const growthPaths = [
  {
    code: "01 / FOUNDATION",
    title: "Người đang học",
    text: "Xây nền tảng Product Basic, Frontend Web Basic và OOP Java. Tập thói quen tự học, cộng tác và giữ cam kết.",
  },
  {
    code: "02 / PRACTICE",
    title: "Người làm dự án",
    text: "Áp dụng kiến thức vào dự án cá nhân và nhóm; học cách làm MVP, tìm người dùng và cải tiến sản phẩm từ phản hồi.",
  },
  {
    code: "03 / GIVE BACK",
    title: "Người hướng dẫn",
    text: "Khi đủ năng lực và được thẩm định, ứng dụng kinh nghiệm để hỗ trợ khóa sau, rèn giao tiếp, thuyết trình và đứng lớp.",
  },
  {
    code: "04 / PRODUCT LABS",
    title: "Người phát triển sản phẩm",
    text: "Có thể tham gia nhóm chuyên môn theo năng lực và hiệu quả làm việc; cùng xây sản phẩm thực tế, nghiên cứu ứng dụng và đóng góp cho BCN.",
  },
];

export const profiles = [
  {
    id: "builder",
    label: "Tự tìm hiểu & làm bản thử",
    sub: "Bắt đầu nhỏ, thử một cách, sai ở đâu sửa ở đó.",
    tag: "BUILDER_MINDSET",
    title: "Ý TƯỞNG CỦA BẠN.\nCÙNG LÀM CHO RA HÌNH.",
    reply:
      "Tinh thần thực chiến là điểm gặp nhau. Mang theo sự chủ động, nhận phản hồi và cùng đồng đội làm điều có ích.",
  },
  {
    id: "planner",
    label: "Phân tích & lên kế hoạch",
    sub: "Hiểu vấn đề và kết quả cần có trước khi bắt tay làm.",
    tag: "THOUGHTFUL_PLANNER",
    title: "MỘT GÓC NHÌN MỚI.\nMỘT CÁCH LÀM TỐT HƠN.",
    reply:
      "BCN cần tư duy nhìn vấn đề từ nhiều phía. Hiểu mục tiêu, chủ động đề xuất và có trách nhiệm với kế hoạch của mình.",
  },
  {
    id: "connector",
    label: "Trao đổi với mentor / team",
    sub: "Chia sẻ chỗ mình đang vướng, rồi tìm cách cùng nhau.",
    tag: "TEAM_CONNECTOR",
    title: "BẠN TÌM ĐỒNG ĐỘI.\nCHÚNG MÌNH CŨNG THẾ.",
    reply:
      "Tinh thần cộng hưởng giúp mỗi người tiến bộ. Học từ người đi trước, chia sẻ điều mình biết và cùng chịu trách nhiệm với tập thể.",
  },
];

export const entryProcess = [
  {
    name: "Discover",
    text: "Khám phá BCN, hiểu cách học, cách làm và văn hóa.",
  },
  {
    name: "Register",
    text: "Chia sẻ về bạn, điều muốn học và lý do muốn đồng hành.",
  },
  {
    name: "Try",
    text: "Trải nghiệm cách BCN học và làm qua hoạt động nhập môn dự kiến.",
  },
  {
    name: "Commit",
    text: "Tự nhìn lại trải nghiệm và quyết định có tiếp tục trở thành CTV BCN.",
  },
];
