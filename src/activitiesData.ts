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
    title: "CÙNG LÀM.\nCÙNG VUI.",
    text: "Cùng dựng đèn, góp ý tưởng và sẻ chia một mùa trăng. Một việc nhỏ để cả đội gần nhau hơn.",
    moments: ["Khéo tay dựng đèn", "Cùng chuẩn bị", "Lưu lại khoảnh khắc"],
    image: null,
    photoAlbum: "midautumn",
    imageAlt: "Khoảnh khắc thành viên BCN cùng tham gia hoạt động Trung Thu.",
  },
  {
    id: "nocode",
    label: "NoCode",
    kicker: "ĐỔI KHÔNG KHÍ / THỬ VAI TRÒ MỚI",
    title: "ĐỔI VAI.\nTHỬ ĐIỀU MỚI.",
    text: "Một thử thách sáng tạo, một trò chơi nhóm hay một món đồ tự tay làm. Ai cũng có thể góp ý tưởng và cùng tạo nên kết quả.",
    moments: ["Thử thách sáng tạo", "Phối hợp đồng đội", "Khám phá sở trường"],
    image: null,
    imageAlt:
      "Thành viên BCN cùng trải nghiệm một hoạt động NoCode ngoài lập trình.",
  },
  {
    id: "tet",
    label: "Tết",
    kicker: "NHÌN LẠI / HẸN CHẶNG TIẾP THEO",
    title: "KHÉP MỘT NĂM.\nGẦN NHAU THÊM.",
    text: "Hẹn nhau nhìn lại điều đã học, gửi lời chúc và chia sẻ dự định mới. Giữ kết nối bằng những cuộc trò chuyện ngoài deadline.",
    moments: ["Chuyện của một năm", "Gửi nhau lời chúc", "Hẹn chặng tiếp theo"],
    image: null,
    imageAlt: "Khoảnh khắc BCN gặp gỡ, chia sẻ và chúc nhau trong dịp Tết.",
  },
];
