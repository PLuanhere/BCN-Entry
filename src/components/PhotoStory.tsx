import { useState } from "react";
import { photoAlbums, photoUrl } from "../photoAlbums";
import type { PhotoAlbumId } from "../photoAlbums";
import { useSwipeGesture } from "../useSwipeGesture";

export default function PhotoStory({
  albumId,
  initialIndex = 0,
  full = false,
  onExpand,
}: {
  albumId: PhotoAlbumId;
  initialIndex?: number;
  full?: boolean;
  onExpand?: (index: number) => void;
}) {
  const album = photoAlbums[albumId];
  const [index, setIndex] = useState(initialIndex);
  const photo = album.photos[index];
  const move = (offset: number) =>
    setIndex(
      (current) =>
        (current + offset + album.photos.length) % album.photos.length,
    );
  const swipe = useSwipeGesture(move, {
    ignore: "button:not(.photo-expand),a",
  });
  return (
    <figure
      className={`photo-story ${full ? "photo-story-full" : "photo-story-preview"}`}
      aria-label={album.code}
      {...swipe}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          event.stopPropagation();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="photo-frame">
        <img
          key={photo.file}
          src={photoUrl(photo.file)}
          alt={photo.alt}
          width="2048"
          height="1536"
          loading="lazy"
          decoding="async"
          draggable="false"
          style={{ objectPosition: photo.position || "50% 50%" }}
        />
        {onExpand && (
          <button
            className="photo-expand"
            aria-label={`Xem lớn bộ ảnh ${albumId === "training" ? "training C" : albumId === "midautumn" ? "Trung Thu" : "tuyển CTV"}`}
            onClick={() => onExpand(index)}
          >
            <span className="mono">XEM LỚN ↗</span>
          </button>
        )}
      </div>
      <figcaption className="photo-caption">
        <div className="photo-caption-copy" aria-live="polite">
          <span className="photo-category mono">{album.code}</span>
          <p>{photo.caption}</p>
        </div>
        <div
          className="photo-controls"
          role="group"
          aria-label="Điều hướng ảnh"
        >
          <span className="mono photo-count">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(album.photos.length).padStart(2, "0")}
          </span>
          <button aria-label="Ảnh trước" onClick={() => move(-1)}>
            ←
          </button>
          <button aria-label="Ảnh tiếp theo" onClick={() => move(1)}>
            →
          </button>
        </div>
      </figcaption>
      {full && (
        <div className="photo-thumbnails" role="group" aria-label="Chọn ảnh">
          {album.photos.map((item, photoIndex) => (
            <button
              key={item.file}
              aria-label={`Ảnh ${photoIndex + 1}: ${item.caption}`}
              aria-pressed={index === photoIndex}
              onClick={() => setIndex(photoIndex)}
            >
              <img
                src={photoUrl(item.file)}
                alt=""
                loading="lazy"
                decoding="async"
                width="96"
                height="64"
              />
              <span className="mono">
                {String(photoIndex + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}
