export type Activity = {
  id: "midautumn" | "nocode" | "tet";
  label: string;
  kicker: string;
  title: string;
  text: string;
  moments: string[];
  image: string | null;
  imageAlt: string;
  photoAlbum?: "midautumn";
};

// Add the filename from public/img to image when each activity photo is ready.
export const activities: Activity[] = [
  {
    id: "midautumn",
    label: "Trung Thu",
    kicker: "MỘT MÙA TRĂNG / MỘT ĐỘI",
    title: "Cùng làm.\nCùng vui.",
    text: "Cùng lên ý tưởng, chuẩn bị và dựng lồng đèn. Một dịp để cả đội gần nhau hơn.",
    moments: ["Khéo tay dựng đèn", "Cùng chuẩn bị", "Lưu lại khoảnh khắc"],
    image: null,
    photoAlbum: "midautumn",
    imageAlt: "Khoảnh khắc thành viên BCN cùng tham gia hoạt động Trung Thu.",
  },
  {
    id: "nocode",
    label: "NoCode",
    kicker: "NGOẠI KHÓA / ĐỜI SỐNG SINH VIÊN",
    title: "Kể chuyện\nđời sống sinh viên.",
    text: "Cùng làm video theo chủ đề đời sống và hoạt động sinh viên. Một hoạt động gắn kết ngoài lập trình.",
    moments: ["Cùng lên ý tưởng", "Cùng thực hiện video", "Kết nối ngoài giờ học"],
    image: null,
    imageAlt:
      "Thành viên BCN cùng trải nghiệm một hoạt động NoCode ngoài lập trình.",
  },
  {
    id: "tet",
    label: "Tết",
    kicker: "NHÌN LẠI / HẸN CHẶNG TIẾP THEO",
    title: "Khép một năm.\nGần nhau thêm.",
    text: "Nhìn lại một năm, gửi lời chúc và chia sẻ dự định mới. Giữ kết nối ngoài giờ học.",
    moments: ["Chuyện của một năm", "Gửi nhau lời chúc", "Hẹn chặng tiếp theo"],
    image: null,
    imageAlt: "Khoảnh khắc BCN gặp gỡ, chia sẻ và chúc nhau trong dịp Tết.",
  },
];
