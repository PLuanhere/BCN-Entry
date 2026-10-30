import { useEffect, useRef, useState } from "react";
import { reveal } from "../motion";
import { useContentMotion } from "../useContentMotion";
import type { CSSProperties } from "react";
import { photoAlbums, photoUrl } from "../photoAlbums";
import type { PhotoAlbumId } from "../photoAlbums";
import { useSwipeGesture } from "../useSwipeGesture";
import ContentIcon from "./ContentIcon";

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
  const [failed, setFailed] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const photo = album.photos[index];
  const figureRef = useRef<HTMLElement>(null);
  const photoMotion = useRef<Animation | null>(null);
  useContentMotion(figureRef, index, ".photo-caption-copy");
  useEffect(() => () => { photoMotion.current?.cancel(); }, [photo.file, retry]);
  useEffect(() => {
    const stop = () => photoMotion.current?.cancel();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      stop();
      preference.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, []);
  const move = (offset: number) =>
    setIndex(
      (current) =>
        (current + offset + album.photos.length) % album.photos.length,
    );
  const swipe = useSwipeGesture(move, {
    ignore: "button:not(.photo-expand),a,select",
  });
  return (
    <figure
      ref={figureRef}
      className={`photo-story ${full ? "photo-story-full" : "photo-story-preview"}`}
      aria-label={album.code}
      style={full ? { "--photo-count": album.photos.length } as CSSProperties : undefined}
      {...swipe}
      onKeyDown={(event) => {
        if ((event.target as HTMLElement).closest("select")) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          event.stopPropagation();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="photo-frame">
        <img
          key={`${photo.file}-${retry}`}
          src={photoUrl(photo.file)}
          alt={photo.alt}
          width="2048"
          height="1536"
          loading={full ? "eager" : "lazy"}
          hidden={failed === photo.file}
          onError={() => setFailed(photo.file)}
          onLoad={(event) => { setFailed(null); photoMotion.current?.cancel(); photoMotion.current = reveal(event.currentTarget, { y: 0, duration: 220 }); }}
          decoding="async"
          draggable="false"
          style={{ objectPosition: photo.position || "50% 50%" }}
        />
        {failed === photo.file && <div className="photo-error" role="status"><ContentIcon name="photo" /><span>Ảnh chưa tải được.</span><button className="text-action" onClick={() => { setFailed(null); setRetry((value) => value + 1); }}>Tải lại ảnh ↻</button></div>}
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
        <>
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
                loading="eager"
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
        <label className="photo-picker"><span className="sr-only">Chọn ảnh trong album</span><select value={index} onChange={(event) => setIndex(Number(event.target.value))}>{album.photos.map((item, photoIndex) => <option key={item.file} value={photoIndex}>{photoIndex + 1} / {album.photos.length} · {item.caption}</option>)}</select></label>
        </>
      )}
    </figure>
  );
}
