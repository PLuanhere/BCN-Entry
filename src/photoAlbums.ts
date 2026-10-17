export type PhotoAlbumId = "training" | "midautumn" | "recruitment";
export type Photo = {
  file: string;
  caption: string;
  alt: string;
  position?: string;
};
export type PhotoAlbum = {
  title: string;
  code: string;
  intro: string;
  photos: Photo[];
};

export const photoAlbums: Record<PhotoAlbumId, PhotoAlbum> = {
  training: {
    title: "CÙNG BẮT ĐẦU TỪ C.",
    code: "TRAINING C / KHÓA MỚI",
    intro:
      "Những buổi training C dành cho khóa mới: cùng học, thực hành và trao đổi trực tiếp.",
    photos: [
      {
        file: "BCN_Train02.jpg",
        caption: "Một lớp học, nhiều khởi đầu.",
        alt: "Toàn cảnh các bạn tham gia buổi training C, cùng học với laptop trong phòng học.",
        position: "50% 65%",
      },
      {
        file: "BCN_Train05.jpg",
        caption: "Theo dõi phần hướng dẫn chung.",
        alt: "Các thành viên ngồi học, phía trước là người hướng dẫn và màn hình trình chiếu.",
        position: "50% 60%",
      },
      {
        file: "BCN_Train06.jpg",
        caption: "Từ phần hướng dẫn đến thực hành.",
        alt: "Buổi training với màn hình trình chiếu, các bạn thực hành trên laptop.",
        position: "50% 65%",
      },
      {
        file: "BCN_Train07.jpg",
        caption: "Cùng thực hành, cùng trao đổi.",
        alt: "Một nhóm thành viên ngồi cùng bàn, sử dụng laptop trong buổi training C.",
      },
      {
        file: "BCN_Train04.jpg",
        caption: "Đưa cách hiểu lên bảng để cùng trao đổi.",
        alt: "Hai thành viên trao đổi và viết minh họa trên bảng trong buổi học.",
      },
      {
        file: "BCN_Train01.jpg",
        caption: "Thêm một góc nhìn từ lớp học.",
        alt: "Các bạn tham gia training ngồi theo dãy bàn, mỗi người sử dụng laptop.",
        position: "50% 65%",
      },
      {
        file: "BCN_Train03.jpg",
        caption: "Học tập trong một không gian chung.",
        alt: "Góc nhìn từ cuối lớp học với các nhóm thành viên tham gia training C.",
        position: "50% 60%",
      },
    ],
  },
  midautumn: {
    title: "NGOÀI DÒNG CODE, CÒN CÓ NHAU.",
    code: "VĂN HÓA / TRUNG THU",
    intro:
      "Đêm hội trăng rằm và những chiếc lồng đèn trong hoạt động “Khéo tay dựng đèn”. Một phần đời sống BCN ngoài giờ học.",
    photos: [
      {
        file: "BCN_TrungThu.jpg",
        caption: "Đêm hội trăng rằm cùng Ban Công Nghệ.",
        alt: "Ấn phẩm Đêm hội trăng rằm của Ban Công Nghệ với hình trăng, đèn lồng và hoa sen.",
      },
      {
        file: "BCN_TrungThu_Product01.jpg",
        caption: "Khéo tay dựng đèn — những sản phẩm của hoạt động.",
        alt: "Ấn phẩm cuộc thi Khéo tay dựng đèn với ba góc nhìn của chiếc lồng đèn hoa.",
      },
      {
        file: "BCN_TrungThi_Product02.jpg",
        caption: "Cận cảnh chiếc lồng đèn hoa.",
        alt: "Chiếc lồng đèn được trang trí bằng hoa màu hồng, trắng và lá xanh, phát sáng trong đêm.",
      },
      {
        file: "BCN_TrungThi_Product03.jpg",
        caption: "Một góc khác của sản phẩm lồng đèn.",
        alt: "Góc nhìn cận cảnh khác của chiếc lồng đèn hoa với ánh sáng vàng.",
      },
    ],
  },
  recruitment: {
    title: "NHỮNG MÙA KẾT NỐI.",
    code: "ẤN PHẨM / TUYỂN CTV",
    intro:
      "Ấn phẩm tuyển cộng tác viên BCN các mùa 2025 và 2026. Đây là ảnh tư liệu; thông tin đăng ký hiện tại sẽ được cập nhật ở nút đăng ký của hành trình.",
    photos: [
      {
        file: "BCN_TuyenCTV_2026.jpg",
        caption: "Ấn phẩm tuyển CTV K22 — 2026.",
        alt: "Ấn phẩm tuyển cộng tác viên Ban Công Nghệ K22 năm 2026, có ảnh tập thể lớp học.",
      },
      {
        file: "BCN_TuyenCTV_2025.jpg",
        caption: "Ấn phẩm giới thiệu và tuyển CTV — 2025.",
        alt: "Ấn phẩm năm 2025 giới thiệu Ban Công Nghệ, các hoạt động học và làm sản phẩm.",
      },
    ],
  },
};

export const photoUrl = (file: string) =>
  `${import.meta.env.BASE_URL}img/${file}`;
