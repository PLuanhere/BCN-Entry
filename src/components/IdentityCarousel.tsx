import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useSwipeGesture } from "../useSwipeGesture";
import { photoAlbums, photoUrl } from "../photoAlbums";

const photos = [
  "BCN_Train01.jpg",
  "BCN_Train05.jpg",
  "BCN_Train07.jpg",
  "BCN_Train04.jpg",
].map((file) =>
  photoAlbums.training.photos.find((photo) => photo.file === file)!,
);
const slides = [photos[photos.length - 1], ...photos, photos[0]];
const slideDuration = 800;
const dwellDuration = 4400;

export default function IdentityCarousel({
  children,
}: {
  children: ReactNode;
}) {
  const [frame, setFrame] = useState({ position: 1, moving: false });
  const current = (frame.position - 1 + photos.length) % photos.length;

  const move = (direction: number) => {
    setFrame((previous) =>
      previous.moving
        ? previous
        : { position: previous.position + direction, moving: true },
    );
  };
  const swipe = useSwipeGesture(move, { ignore: "button,a" });

  useEffect(() => {
    // Normalize the duplicate end slides only after the visible slide has settled.
    // A timer also settles correctly if the browser skips a transition event.
    const timer = window.setTimeout(
      () => {
        if (frame.moving) {
          setFrame({ position: current + 1, moving: false });
        } else {
          move(1);
        }
      },
      frame.moving ? slideDuration + 40 : dwellDuration,
    );
    return () => window.clearTimeout(timer);
  }, [frame, current]);

  return (
    <div className="identity-blue" {...swipe}>
      <div className="identity-carousel" aria-hidden="true">
        <div
          className={`identity-carousel-track ${frame.moving ? "is-sliding" : ""}`}
          style={{ transform: `translate3d(-${frame.position * 100}%, 0, 0)` }}
        >
          {slides.map((photo, index) => (
            <img
              className="identity-backdrop"
              key={`${photo.file}-${index}`}
              src={photoUrl(photo.file)}
              alt=""
              decoding="async"
              draggable="false"
              style={{ objectPosition: photo.position || "50% 50%" }}
              width="2048"
              height="1536"
            />
          ))}
        </div>
      </div>
      {children}
      <div
        className="identity-carousel-controls mono"
        role="group"
        aria-label="Ảnh hoạt động BCN"
      >
        <span className="identity-carousel-label">
          TRAINING C / CÙNG NHAU BẮT ĐẦU
        </span>
        <div className="identity-carousel-pagination" aria-hidden="true">
          {photos.map((photo, index) => (
            <span
              key={photo.file}
              className={current === index ? "is-current" : ""}
            />
          ))}
        </div>
        <span className="identity-carousel-count" aria-hidden="true">
          0{current + 1}
          <span> / 0{photos.length}</span>
        </span>
        <button
          aria-label="Ảnh BCN trước"
          aria-disabled={frame.moving}
          onClick={() => move(-1)}
        >
          ←
        </button>
        <button
          aria-label="Ảnh BCN tiếp theo"
          aria-disabled={frame.moving}
          onClick={() => move(1)}
        >
          →
        </button>
      </div>
    </div>
  );
}
