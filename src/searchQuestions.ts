import { quickQuestions } from "./bcnInfo";

function normalize(value: string) {
  return value.toLocaleLowerCase("vi").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ")
    .replace(/\bdang ki\b/g, "dang ky")
    .replace(/\b(?:code|coding)\b/g, "lap trinh");
}

const keywords = [
  "giới thiệu đơn vị thuộc đoàn khoa",
  "học phí tiền chi phí đối tượng miễn phí",
  "đầu vào mới bắt đầu kỹ năng chưa biết code",
  "lộ trình hướng học ngành môn học web mobile android thiết kế",
  "video ngoại khóa nocode non dev",
  "lịch giờ địa điểm ở đâu sinh hoạt thời gian",
  "đăng ký tuyển thành viên ứng tuyển form hạn deadline tham gia",
];
const indexed = quickQuestions.map((item, index) => ({
  item,
  text: normalize(`${item.question} ${item.answer} ${keywords[index]}`),
}));
const intents: { index: number; pattern: RegExp }[] = [
  { index: 0, pattern: /\b(?:bcn la gi|ban cong nghe la gi|thuoc|don vi|gioi thieu)\b/ },
  { index: 1, pattern: /\b(?:hoc phi|chi phi|mien phi|mat phi|ton tien|dong tien|doi tuong|ai co the)\b/ },
  { index: 2, pattern: /\b(?:dau vao|chua biet|chua hoc|bat dau|khong biet lap trinh|can biet|ky nang)\b/ },
  { index: 3, pattern: /\b(?:co ban|huong hoc|hoc gi|lo trinh|mon hoc|android|kotlin|java|compose|frontend|backend|fullstack|oop|mobile)\b/ },
  { index: 4, pattern: /\b(?:nocode|no code|non dev|video|ngoai khoa)\b/ },
  { index: 5, pattern: /\b(?:sinh hoat|dia diem|lich hoc|may gio|bao nhieu thoi gian|thoi luong)\b/ },
  { index: 6, pattern: /\b(?:dang ky|k23|k22|tuyen|form|deadline|khi nao|han chot|tham gia)\b/ },
];
const fillers = new Set("minh toi em ban cho hoi la co khong thi duoc muon can nhu the nao lam sao de ve bcn nhe a voi vay va cua nhung gi".split(" "));

export function searchQuestions(query: string) {
  const normalized = normalize(query);
  if (!normalized) return [...quickQuestions];
  const matched = intents.filter(({ pattern }) => pattern.test(normalized));
  if (matched.length) {
    // A concrete concern (fees, beginner skills, schedule) comes before the
    // generic recruitment question when the query also says "tham gia".
    return matched.map(({ index }) => quickQuestions[index]);
  }
  if (/\bo dau\b/.test(normalized)) return [quickQuestions[5]];
  const terms = normalized.split(" ").filter((term) => !fillers.has(term));
  if (!terms.length) return [];
  const phrases = indexed.filter(({ text }) => text.includes(normalized));
  return (phrases.length ? phrases : indexed.filter(({ text }) => terms.every((term) => text.includes(term))))
    .map(({ item }) => item);
}
