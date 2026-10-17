import { useRef } from "react";
import { activities } from "./activitiesData";
import type { Activity } from "./activitiesData";
import { photoUrl } from "./photoAlbums";
import type { PhotoAlbumId } from "./photoAlbums";
import PhotoStory from "./components/PhotoStory";

function ActivityDrawing({ type }: { type: Activity["id"] }) {
  return (
    <svg
      className={`activity-drawing drawing-${type}`}
      viewBox="0 0 240 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        className="activity-drawing-guide"
        d="M0 100h240M120 0v200"
        strokeDasharray="3 7"
      />
      {type === "midautumn" ? (
        <>
          <path
            className="activity-art-main"
            d="M152 30c-39 3-53 49-24 75-38 5-68-21-65-52 2-28 26-47 54-43-13 5-20 15-22 27"
          />
          <g className="activity-art-float">
            <path d="M158 68v26m-26 0h52v14h-52zm-8 14h68v50h-68zm8 50h52v10h-52zm26 10v22m-12-10v12m24-12v12M142 108v50m32-50v50" />
            <path d="m124 108 16 25-16 25m68-50-16 25 16 25" />
          </g>
          <path d="m188 35 3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
        </>
      ) : type === "nocode" ? (
        <>
          <rect
            className="activity-art-main"
            x="45"
            y="36"
            width="88"
            height="88"
          />
          <circle className="activity-art-float" cx="153" cy="114" r="48" />
          <path d="m65 159 47-72 47 72zm113-128v24m-12-12h24" />
        </>
      ) : (
        <>
          <g className="activity-art-main activity-flower">
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx="120"
                cy="61"
                rx="20"
                ry="35"
                transform={`rotate(${angle} 120 100)`}
              />
            ))}
            <circle cx="120" cy="100" r="13" />
          </g>
          <path
            className="activity-art-float"
            d="m49 148 3 9 9 3-9 3-3 9-3-9-9-3 9-3zm142-116 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"
          />
        </>
      )}
    </svg>
  );
}

export default function Activities({
  selected,
  onSelect,
  openPhotos,
}: {
  selected: number;
  onSelect: (index: number) => void;
  openPhotos: (album: PhotoAlbumId, index?: number) => void;
}) {
  const tabsRef = useRef<HTMLDivElement>(null);
  return (
    <section className="stage activities-stage" aria-labelledby="stage-title">
      <header className="activities-heading">
        <div>
          <span className="content-label mono">05 / BCN AFTER HOURS</span>
          <h1 id="stage-title">
            NGOÀI CODE. <br />
            VẪN CÙNG MỘT ĐỘI.
          </h1>
        </div>
        <p>
          Tạm gác laptop.
          <br />
          Thêm thời gian để hiểu nhau.
        </p>
      </header>
      <div
        className="activity-tabs"
        role="tablist"
        aria-label="Hoạt động ngoài code"
        ref={tabsRef}
      >
        {activities.map((item, index) => (
          <button
            key={item.id}
            id={`activity-tab-${index}`}
            role="tab"
            aria-label={item.label}
            aria-selected={index === selected}
            aria-controls="activity-panel"
            tabIndex={index === selected ? 0 : -1}
            onClick={() => onSelect(index)}
            onKeyDown={(event) => {
              let next: number;
              if (event.key === "ArrowRight")
                next = (index + 1) % activities.length;
              else if (event.key === "ArrowLeft")
                next = (index + activities.length - 1) % activities.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = activities.length - 1;
              else return;
              event.preventDefault();
              onSelect(next);
              tabsRef.current
                ?.querySelectorAll<HTMLButtonElement>("button")
                [next]?.focus();
            }}
          >
            <span className="mono">0{index + 1}</span>
            {item.label}
            <span className="activity-tab-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
        <span
          className="activity-tab-indicator"
          aria-hidden="true"
          style={{ transform: `translateX(${selected * 100}%)` }}
        />
      </div>
      <div
        className="activities-layout"
        id="activity-panel"
        role="tabpanel"
        aria-labelledby={`activity-tab-${selected}`}
        tabIndex={0}
      >
        <div className="activities-copy">
          <div className="activity-copy-stack" aria-live="polite">
            {activities.map((item, index) => (
              <div
                className={`activity-copy-panel ${index === selected ? "is-active" : ""}`}
                key={item.id}
                aria-hidden={index !== selected}
                inert={index !== selected}
              >
                <span className="content-label mono">{item.kicker}</span>
                <h2>{item.title}</h2>
                <p className="body-copy">{item.text}</p>
                <ul className="activity-moments">
                  {item.moments.map((moment) => (
                    <li key={moment}>
                      <span aria-hidden="true">↗</span>
                      {moment}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="activities-media">
          {activities.map((item, index) => (
            <div
              className={`activity-media-panel ${index === selected ? "is-active" : ""}`}
              key={item.id}
              aria-hidden={index !== selected}
              inert={index !== selected}
            >
              {item.photoAlbum ? (
                <PhotoStory
                  albumId={item.photoAlbum}
                  onExpand={(photoIndex) =>
                    openPhotos(item.photoAlbum!, photoIndex)
                  }
                />
              ) : item.image ? (
                <img
                  className="activity-photo"
                  src={photoUrl(item.image)}
                  alt={item.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div
                  className="activity-placeholder"
                  role="img"
                  aria-label={`Vị trí ảnh ${item.label}, sẽ được bổ sung`}
                >
                  <span className="activity-frame-number mono">
                    PHOTO / 0{index + 1}
                  </span>
                  <ActivityDrawing type={item.id} />
                  <div className="activity-placeholder-caption mono">
                    <strong>ẢNH {item.label.toUpperCase()}</strong>
                    <span>Ảnh sẽ được bổ sung</span>
                  </div>
                  <span className="activity-frame-cross" aria-hidden="true">
                    +
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
