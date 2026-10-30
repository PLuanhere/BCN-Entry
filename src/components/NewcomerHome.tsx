import { photoUrl } from "../photoAlbums";
import type { PhotoAlbumId } from "../photoAlbums";

export default function NewcomerHome({ openPhotos }: {
  openPhotos: (album: PhotoAlbumId, index?: number) => void;
}) {
  return (
    <section className="stage identity-stage newcomer-home" aria-labelledby="stage-title">
      <h1 id="stage-title" className="notice-title"><span>Ban</span> <span>Công Nghệ</span></h1>
      <div className="notice-scene">
        <figure className="notice-photo">
          <button onClick={() => openPhotos("training")} aria-label="Xem ảnh các buổi học tại BCN">
            <img src={photoUrl("BCN_Train02.jpg")} alt="Một buổi training C của BCN: sinh viên thực hành trên laptop, giữa những dãy ghế cam và xanh lá." width="2048" height="1536" decoding="async" fetchPriority="high" />
            <span className="notice-photo-label">Xem ảnh <span aria-hidden="true">+</span></span>
          </button>
        </figure>
        <div className="notice-note welcome-copy">
          <span className="notice-role">Ban Công Nghệ thuộc</span>
          <h2 className="notice-affiliation">Đoàn Khoa CNTT, IUH</h2>
          <p>Học công nghệ, thực hành làm sản phẩm và chia sẻ kiến thức.</p>
        </div>
      </div>
      <div className="notice-tearoff">
        <p className="recruitment-note"><strong>Tuyển K23:</strong><span>Chờ thông báo chính thức.</span></p>
      </div>
    </section>
  );
}
