import { growthPaths, learningTracks, projectKinds, workflow } from "./content";

export type WorkspaceItem = {
  name: string;
  label: string;
  title: string;
  summary: string;
  detail: string;
  tech: string[];
  photoAlbum?: "training";
};
export const workspaceSections = [
  {
    title: "HỌC ĐỂ LÀM.",
    lead: "Cơ Bản (C, Java, OOP), Frontend, Backend, Non-dev, Fullstack và Mobile.",
    code: "LEARNING.PATH",
    shape: "learn",
  },
  {
    title: "LÀM RA ĐIỀU THẬT.",
    lead: "Việc thật, trách nhiệm thật. Học qua mỗi lần thử và sửa.",
    code: "PROJECT.BUILD",
    shape: "build",
  },
  {
    title: "TỪ NHÓM NHỎ.\nĐẾN GIÁ TRỊ THẬT.",
    lead: "Định hướng nhóm chuyên môn cùng phát triển sản phẩm có người dùng.",
    code: "PRODUCT.LABS",
    shape: "labs",
  },
  {
    title: "MỘT NHỊP\nCÙNG TIẾN.",
    lead: "Một vòng thực hành minh họa từ cách BCN học, làm và phản hồi.",
    code: "TEAM.WORKFLOW",
    shape: "flow",
  },
  {
    title: "HỌC. LÀM.\nRỒI CHIA SẺ.",
    lead: "Đi tiếp bằng năng lực, thái độ và những gì bạn đóng góp.",
    code: "GROWTH.PATH",
    shape: "grow",
  },
];

export const foundationItems: WorkspaceItem[] = [
  {
    name: "Training C cho khóa mới",
    label: "Training C",
    title: "CÙNG BẮT ĐẦU\nTỪ NHỮNG DÒNG C.",
    summary:
      "Buổi training C dành cho khóa mới. Cùng học, thực hành và trao đổi.",
    detail:
      "Hoạt động training C cho khóa mới của BCN, được ghi lại qua những buổi học và thực hành trực tiếp.",
    tech: ["code"],
    photoAlbum: "training",
  },
  {
    name: "Cơ Bản",
    label: "Cơ Bản",
    title: "XÂY NỀN TẢNG\nTƯ DUY LẬP TRÌNH.",
    summary: "Bắt đầu với C, Java và lập trình hướng đối tượng (OOP).",
    detail:
      "Làm quen với C và Java, học cách tổ chức chương trình bằng đối tượng (OOP).",
    tech: ["c", "java", "oop"],
  },
  {
    name: "Frontend Web Basic",
    label: "Web Basic",
    title: "DỰNG TRANG WEB\nĐẦU TIÊN CỦA BẠN.",
    summary: "Học nền tảng web. Áp dụng ngay vào sản phẩm của nhóm.",
    detail:
      "Frontend Web Basic thuộc lộ trình cơ bản. Hoạt động dự án của tân sinh viên đi cùng Website Basic để hiểu cách làm phần mềm, ứng dụng kiến thức và tạo sản phẩm mang dấu ấn nhóm.",
    tech: ["html5", "css", "javascript"],
  },
  {
    name: "Mobile cơ bản",
    label: "Mobile",
    title: "BẮT ĐẦU\nVỚI ỨNG DỤNG DI ĐỘNG.",
    summary: "Học Mobile từ cơ bản, rồi phát triển lên nâng cao.",
    detail:
      "Hướng Mobile đang triển khai từ cơ bản đến nâng cao, song song với lộ trình Web.",
    tech: ["android"],
  },
];
const advancedCopy = [
  {
    label: "Frontend",
    title: "TỪ GIAO DIỆN\nĐẾN WEBSITE HOÀN CHỈNH.",
    summary: "Web và Mobile, từ cơ bản đến nâng cao.",
    tech: ["html5", "javascript", "react", "nextdotjs"],
  },
  {
    label: "Backend",
    title: "XÂY PHẦN XỬ LÝ\nPHÍA MÁY CHỦ.",
    summary:
      "Hướng học Backend đang được triển khai tại BCN.",
    tech: ["code"],
  },
  {
    label: "Non-dev",
    title: "LÀM SẢN PHẨM\nBẰNG GÓC NHÌN KHÁC.",
    summary:
      "Product Design, Business Analyst, UX/UI, thiết kế và truyền thông.",
    tech: ["figma"],
  },
  {
    label: "Fullstack",
    title: "KẾT NỐI FRONTEND\nVÀ BACKEND.",
    summary: "Phát triển năng lực ở cả giao diện và phía máy chủ.",
    tech: ["code"],
  },
];
export const advancedItems: WorkspaceItem[] = learningTracks.map(
  (item, index) => ({ ...item, ...advancedCopy[index], detail: item.detail }),
);

const projectCopy = [
  {
    label: "Đánh giá",
    title: "LÀM ĐƯỢC.\nHIỂU ĐIỀU MÌNH LÀM.",
    summary: "Mỗi người đều đóng góp và giải thích được phần việc của mình.",
  },
  {
    label: "Tân SV",
    title: "DỰ ÁN ĐẦU TIÊN.\nDẤU ẤN CỦA NHÓM.",
    summary: "Áp dụng Website Basic để cùng tạo một sản phẩm.",
  },
  {
    label: "Từ năm 2",
    title: "XÂY MVP.\nTÌM NGƯỜI DÙNG.",
    summary:
      "Thử sản phẩm, nhận phản hồi, rồi cải tiến. Mục tiêu nằm trong kế hoạch phát triển.",
  },
];
export const projectItems: WorkspaceItem[] = projectKinds.map(
  (item, index) => ({
    ...item,
    ...projectCopy[index],
    tech: index === 3 ? ["figma"] : ["html5", "javascript"],
    detail: item.detail,
  }),
);
export const labItems: WorkspaceItem[] = [
  {
    name: "Năng lực & thái độ",
    label: "Năng lực",
    title: "THÁI ĐỘ TỐT.\nNĂNG LỰC THẬT.",
    summary: "Chú trọng hiệu quả và cộng tác. Huấn luyện sâu theo nhóm nhỏ.",
    detail:
      "Không giới hạn bởi tuổi hay xuất phát điểm. Product Labs chú trọng thái độ, năng lực, hiệu quả làm việc và tinh thần cộng tác; hướng tới huấn luyện chuyên sâu theo nhóm nhỏ.",
    tech: ["code"],
  },
  {
    name: "Sản phẩm thực tế",
    label: "Sản phẩm",
    title: "CÙNG TẠO RA\nGIÁ TRỊ CÓ ÍCH.",
    summary:
      "Phát triển ứng dụng có người dùng, hướng tới khả năng tạo doanh thu.",
    detail:
      "Định hướng nhóm chuyên môn cùng phát triển ứng dụng có người dùng, hướng tới khả năng tạo doanh thu; nghiên cứu ứng dụng, xây tài nguyên cho cộng đồng và tham gia quản lý, phát triển BCN.",
    tech: ["react", "figma"],
  },
  {
    name: "Trở thành người đồng hành",
    label: "Đồng hành",
    title: "GIỎI HƠN.\nRỒI GIÚP NHAU GIỎI.",
    summary: "Khi đủ năng lực, cùng mentor, đứng lớp và hỗ trợ khóa sau.",
    detail:
      "Rèn giao tiếp, thuyết trình và làm việc nhóm. Khi đủ năng lực và được thẩm định, tham gia mentor, đứng lớp và hỗ trợ thành viên.",
    tech: ["team"],
  },
];
export const workflowItems: WorkspaceItem[] = workflow.map((item, index) => ({
  name: item.label,
  label: ["Hiểu", "Làm thử", "Review", "Chia sẻ"][index],
  title: item.title,
  summary: [
    "Hiểu người dùng. Chia việc vừa sức. Thống nhất thời hạn.",
    "Tự học, thực hành. Vướng thì hỏi và báo sớm.",
    "Điều gì tốt? Chưa tốt ở đâu? Lần sau cải thiện gì?",
    "Sửa vấn đề, ghi lại bài học và chia sẻ với đội.",
  ][index],
  detail: item.text,
  tech: ["team"],
}));
export const growthItems: WorkspaceItem[] = growthPaths.map((item, index) => ({
  name: item.title,
  label: ["Học", "Làm", "Hướng dẫn", "Sản phẩm"][index],
  title: [
    "BẮT ĐẦU\nTỪ NỀN TẢNG.",
    "ĐƯA KIẾN THỨC\nVÀO DỰ ÁN.",
    "MANG KINH NGHIỆM\nCHIA SẺ LẠI.",
    "ĐI TIẾP CÙNG\nPRODUCT LABS.",
  ][index],
  summary: [
    "C, Java, OOP, Web và Mobile. Rèn tự học và giữ cam kết.",
    "Làm MVP, tìm người dùng và cải tiến qua phản hồi.",
    "Khi đủ năng lực, hỗ trợ khóa sau và rèn kỹ năng hướng dẫn.",
    "Tham gia nhóm chuyên môn theo năng lực và mức độ đóng góp.",
  ][index],
  detail: item.text,
  tech: index === 0 ? ["html5", "java"] : index === 1 ? ["react"] : ["team"],
}));
