import { useState } from "react";
import { photoAlbums, photoUrl } from "../photoAlbums";

export default function CommitGallery() {
  const [selected, setSelected] = useState(0);
  const album = photoAlbums.recruitment;
  const photo = album.photos[selected];
  return (
    <section className="commit-gallery" aria-labelledby="commit-gallery-title">
      <header className="commit-gallery-header">
        <h2 id="commit-gallery-title">NHỮNG MÙA KẾT NỐI.</h2>
        <div
          className="commit-years mono"
          role="group"
          aria-label="Chọn ấn phẩm tuyển CTV"
        >
          {album.photos.map((item, index) => (
            <button
              key={item.file}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              {index === 0 ? "2026" : "2025"}
            </button>
          ))}
        </div>
      </header>
      <figure className="commit-poster">
        <img
          key={photo.file}
          src={photoUrl(photo.file)}
          alt={photo.alt}
          decoding="async"
        />
      </figure>
      <p className="commit-gallery-note mono">
        TƯ LIỆU CÁC ĐỢT TUYỂN / 2025 — 2026
      </p>
    </section>
  );
}
