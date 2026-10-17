import {
  culturePillars,
  entryProcess,
  expectations,
  growthPaths,
  workflow,
} from "./content";
import { activities } from "./activitiesData";
import {
  advancedItems,
  foundationItems,
  labItems,
  projectItems,
} from "./workspaceData";

export type DocumentSection = {
  title: string;
  text?: string;
  points?: string[];
  wide?: boolean;
};
export type BcnDocument = {
  code: string;
  title: string;
  intro: string;
  sections: DocumentSection[];
  note?: string;
  image?: string;
};
export const documentPoints = (text: string) =>
  text.split(/(?<=[.!?])\s+/).filter(Boolean);

type ActivityDocId = "activity-midautumn" | "activity-nocode" | "activity-tet";
const activityDocuments = Object.fromEntries(
  activities.map((item) => [
    `activity-${item.id}`,
    {
      code: `NGOÀI CODE / ${item.label.toUpperCase()}`,
      title: item.title.replace("\n", " "),
      intro: item.text,
      sections: [{ title: item.label, points: item.moments }],
    },
  ]),
) as Record<ActivityDocId, BcnDocument>;

export const documents = {
  ...activityDocuments,
  guide: {
    image: "BCN_Logo.jpg",
    code: "BCN / GIỚI THIỆU",
    title: "MỘT CỘNG ĐỒNG THỰC HÀNH.",
    intro:
      "Học công nghệ, làm sản phẩm và cùng nhau trưởng thành. BCN tiếp nối tinh thần cựu sinh viên hỗ trợ sinh viên.",
    sections: [
      {
        title: "Một nơi để bắt đầu",
        points: [
          "Dành cho sinh viên yêu công nghệ và có ý chí vươn lên.",
          "Có người đồng hành để học, thực hành và tìm cách vượt qua khó khăn.",
        ],
      },
      {
        title: "Một cách để tiến bộ",
        points: [
          "Ứng dụng kiến thức vào công việc và dự án thực tế.",
          "Chia sẻ kinh nghiệm để người đi sau có thêm cơ hội phát triển.",
        ],
      },
    ],
  },
  purpose: {
    image: "BCN_Logo.jpg",
    code: "BẢN SẮC / CHÚNG MÌNH",
    title: "MÁI NHÀ CHUNG CỦA NGƯỜI YÊU CÔNG NGHỆ.",
    intro:
      "Ban Công Nghệ là cộng đồng thực hành dành cho sinh viên muốn học, xây dựng sản phẩm và trưởng thành qua dự án thực tế.",
    sections: [
      {
        title: "Vì sao BCN tồn tại?",
        points: [
          "Tiếp nối truyền thống cựu sinh viên hỗ trợ sinh viên.",
          "Tạo cơ hội học tập cho sinh viên có ý chí vươn lên, kể cả khi còn thiếu điều kiện.",
          "Xây dựng một mái nhà chung để sinh viên không cảm thấy cô đơn, lạc lõng.",
        ],
      },
      {
        title: "Chất riêng của BCN",
        points: [
          "Thực tế, chủ động và có trách nhiệm.",
          "Tò mò, thích khám phá và hướng tới phát triển năng lực.",
          "Đơn giản, gọn gàng, thân thiện và không phô trương.",
        ],
      },
      {
        title: "Môi trường BCN hướng tới",
        points: [
          "Huấn luyện phù hợp với hướng học của thành viên.",
          "Bồi dưỡng năng lực qua việc làm sản phẩm thực tế.",
          "Một cộng đồng cùng mục tiêu học tập và cùng phát triển.",
        ],
      },
      {
        title: "Trải nghiệm của thành viên",
        points: [
          "Được tham gia và đóng góp, không phân biệt xuất phát điểm.",
          "Được thử ý tưởng mới, được sai và học cách cải thiện.",
          "Được trao quyền chủ động, trách nhiệm và cơ hội trưởng thành.",
        ],
      },
    ],
  },
  mission: {
    code: "BẢN SẮC / 5 SỨ MỆNH",
    title: "HỌC ĐƯỢC. LÀM ĐƯỢC. CHIA SẺ LẠI.",
    intro:
      "Năm hướng hoạt động kết nối việc học, thực hành và đóng góp cho cộng đồng.",
    sections: [
      {
        title: "Training — Huấn luyện",
        points: [
          "Xây dựng môi trường rèn luyện từ năm nhất.",
          "Phát triển năng lực, tích lũy kinh nghiệm và tăng khả năng thích nghi với thị trường.",
        ],
      },
      {
        title: "Mentorship — Đồng hành",
        points: [
          "Thành viên đã thành thạo hỗ trợ sinh viên khóa sau.",
          "Thẩm định năng lực mentor để giữ chất lượng hướng dẫn.",
        ],
      },
      {
        title: "Community — Cộng đồng",
        points: [
          "Cùng học, rèn thái độ sống và ứng dụng kiến thức.",
          "Gắn bó lâu dài, vui vẻ nhưng luôn cùng tiến bộ; không bỏ lại người khác phía sau.",
        ],
      },
      {
        title: "Product Labs — Sản phẩm",
        points: [
          "Định hướng nhóm chuyên môn có năng lực và tinh thần làm việc nhóm.",
          "Phát triển ứng dụng có người dùng, hướng tới doanh thu; nghiên cứu ứng dụng và xây tài nguyên cộng đồng.",
        ],
      },
      {
        title: "Projects — Thực chiến",
        points: [
          "Ứng dụng kiến thức vào dự án phần mềm liên tục.",
          "Rèn kỹ năng qua vấn đề, sản phẩm và công việc thực tế.",
        ],
      },
    ],
  },
  vision: {
    code: "BẢN SẮC / TẦM NHÌN",
    title: "ĐI XA HƠN MỘT KHÓA HỌC.",
    intro:
      "BCN hướng tới một cộng đồng mà thành viên vẫn muốn thuộc về, kể cả sau khi ra trường.",
    sections: [
      {
        title: "Cộng đồng dài hạn",
        points: [
          "Tham gia để cùng phát triển, vượt ra ngoài việc hoàn thành một khóa học.",
          "Giữ kết nối và có một mái nhà chung sau khi tốt nghiệp.",
        ],
      },
      {
        title: "Giá trị từ năng lực",
        points: [
          "Tạo ra sản phẩm có người dùng thực.",
          "Hướng tới khả năng tạo thu nhập từ sản phẩm và năng lực đã rèn luyện.",
        ],
      },
    ],
    note: "Đây là định hướng phát triển dài hạn, không phải cam kết đầu ra hoặc thu nhập.",
  },
  culture: {
    code: "VĂN HÓA / CÁCH CÙNG LÀM",
    title: "NÓI RÕ. LÀM THẬT. CÙNG TIẾN.",
    intro:
      "Thái độ quan trọng hơn xuất phát điểm. Một người giỏi tạo ra năng lực; một tập thể tốt tạo ra sức mạnh.",
    sections: [
      {
        title: "Giao tiếp văn minh",
        points: [
          "Tiếp cận thông tin chung; chưa hiểu thì hỏi, không đồng ý thì nói rõ lý do.",
          "Mâu thuẫn cần trao đổi trực tiếp. Góp ý công việc, không công kích cá nhân.",
          "Nói rõ, nói thật, đúng lúc và văn minh.",
        ],
      },
      {
        title: "Chủ động và dám thử",
        points: [
          ...culturePillars[0].details,
          "Giữ sự tò mò, không giấu dốt; ưu tiên kết quả và giải thích được cách làm.",
        ],
      },
      {
        title: "Tư duy và thực chiến",
        points: [
          "Nhìn từ người dùng, sản phẩm, đội nhóm và mục tiêu chung.",
          "Kiến thức cần đi vào vấn đề và sản phẩm cụ thể.",
          "Đặt câu hỏi, thử cách mới và học từ kết quả; không chỉ code theo yêu cầu.",
        ],
      },
      {
        title: "Trách nhiệm và kỷ luật",
        points: [
          "Có mục tiêu mỗi học kỳ; nhận việc vừa sức, đúng giờ và đúng deadline.",
          "Khó khăn phải báo sớm; không ghost, không đổ lỗi hoặc bỏ dở việc tập thể.",
          "Duy trì nhịp tự học tối thiểu hai giờ mỗi ngày theo định hướng phát triển.",
        ],
      },
      {
        title: "Cộng tác và cộng hưởng",
        points: [
          "Người biết nhiều hỗ trợ người biết ít; cùng học ở thư viện hoặc Discord.",
          "Tôn trọng ý tưởng, lắng nghe và chia sẻ kiến thức, cơ hội, kinh nghiệm.",
          "Không gian lận, làm hộ hoặc làm qua loa; cùng có lợi và cùng tiến bộ.",
        ],
      },
      {
        title: "Phản hồi và nhìn lại",
        points: [
          "Kiểm tra kết quả: điều gì tốt, chưa tốt, vì sao và lần sau cải thiện gì?",
          "Góp ý sớm, cụ thể vào hành động; nêu vấn đề và cách cải thiện.",
          "Nhận sai, không xem feedback là công kích; tìm hỗ trợ từ ban quản trị khi cần.",
          "Ghi nhận đóng góp và lưu lại cách làm tốt thành kinh nghiệm chung.",
        ],
      },
    ],
  },
  learning: {
    code: "WORKSPACE / LEARNING",
    title: "XÂY NỀN TẢNG. CHỌN HƯỚNG ĐI.",
    intro:
      "Học đi cùng thực hành. Từ nền tảng chung, mỗi người chọn một hướng phát triển phù hợp.",
    sections: [
      {
        title: "01 / Nền tảng chung",
        points: foundationItems.map((item) => `${item.name}: ${item.summary}`),
        wide: true,
      },
      ...advancedItems.map((item) => ({
        title: `02 / ${item.label}`,
        points: documentPoints(item.detail),
      })),
      {
        title: "Giữ chất lượng học tập",
        points: [
          "Có mục tiêu học tập cụ thể và duy trì nhịp tự học.",
          "Review năng lực, sản phẩm định kỳ; chủ động hỏi và ứng dụng vào dự án chung.",
        ],
        wide: true,
      },
    ],
  },
  projects: {
    code: "WORKSPACE / PROJECTS",
    title: "HỌC QUA VIỆC LÀM SẢN PHẨM.",
    intro:
      "Dự án là hoạt động rèn luyện chính. Mỗi thành viên đều đóng góp và hiểu phần việc của mình.",
    sections: projectItems.map((item) => ({
      title: item.name,
      points: documentPoints(item.detail),
    })),
  },
  labs: {
    code: "WORKSPACE / PRODUCT LABS",
    title: "NHÓM CHUYÊN MÔN. GIÁ TRỊ THỰC TẾ.",
    intro:
      "Định hướng các nhóm nhỏ được huấn luyện chuyên sâu để phát triển sản phẩm và đóng góp cho BCN.",
    sections: labItems.map((item) => ({
      title: item.name,
      points: documentPoints(item.detail),
    })),
    note: "Product Labs là định hướng phát triển, không phải lời hứa về doanh thu hoặc vị trí việc làm.",
  },
  workflow: {
    code: "WORKSPACE / CÁCH CÙNG LÀM",
    title: "MỘT VÒNG THỰC HÀNH CỦA ĐỘI.",
    intro: "Hiểu mục tiêu, làm thử, review rồi chia sẻ lại kinh nghiệm.",
    sections: workflow.map((item) => ({
      title: item.label,
      points: documentPoints(item.text),
    })),
    note: "Quy trình minh họa từ nguyên tắc văn hóa BCN, không phải lịch sinh hoạt cố định.",
  },
  growth: {
    code: "WORKSPACE / HƯỚNG TRƯỞNG THÀNH",
    title: "HỌC. LÀM. RỒI CHIA SẺ.",
    intro:
      "Những hướng phát triển dựa trên năng lực, thái độ và mức độ đóng góp của thành viên.",
    sections: growthPaths.map((item) => ({
      title: item.title,
      points: documentPoints(item.text),
    })),
  },
  activities: {
    code: "HOẠT ĐỘNG / NGOÀI CODE",
    title: "THÊM THỜI GIAN ĐỂ HIỂU NHAU.",
    intro:
      "Những hoạt động ngoài lập trình tạo cơ hội giao lưu, thử vai trò mới và giữ kết nối trong đội.",
    sections: activities.map((item) => ({
      title: item.label,
      text: item.text,
      points: item.moments,
    })),
  },
  expectations: {
    code: "VĂN HÓA / CAM KẾT",
    title: "BCN KỲ VỌNG GÌ Ở THÀNH VIÊN?",
    intro: "Chủ động học, giữ cam kết và cùng nhau tiến bộ.",
    sections: expectations.map((item) => ({
      title: item.title,
      points: documentPoints(item.body),
    })),
    note: "Lịch hoạt động và yêu cầu tuyển cụ thể theo thông báo chính thức.",
  },
  process: {
    code: "GIA NHẬP / DISCOVER → REGISTER → TRY → COMMIT",
    title: "TỪ TÒ MÒ ĐẾN ĐỒNG HÀNH.",
    intro:
      "Bốn giai đoạn gia nhập dự kiến để bạn hiểu BCN, trải nghiệm rồi tự quyết định có muốn tiếp tục.",
    sections: entryProcess.map((item) => ({
      title: item.name,
      points: documentPoints(item.text),
    })),
    note: "Các yêu cầu thử thách cụ thể sẽ được cập nhật theo thông báo tuyển. Link đăng ký hiện đang chờ bổ sung.",
  },
} satisfies Record<string, BcnDocument>;

export type DocId = keyof typeof documents;
export const identityDocIds: DocId[] = ["purpose", "mission", "vision"];
export const workspaceDocIds: DocId[] = [
  "learning",
  "projects",
  "labs",
  "workflow",
  "growth",
];
export function contextDocument(
  stage: string,
  identity: number,
  folder: number,
  activity = 0,
): DocId {
  if (stage === "identity") return identityDocIds[identity];
  if (stage === "workspace") return workspaceDocIds[folder];
  if (stage === "culture") return "culture";
  if (stage === "activities") return `activity-${activities[activity].id}`;
  if (stage === "sync") return "expectations";
  if (stage === "commit") return "process";
  return "guide";
}
