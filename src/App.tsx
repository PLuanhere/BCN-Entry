import { useRef, useState } from "react";
import { stages } from "./content";
import { useJourney } from "./journey";
import Stage from "./Stages";
import type { DialogView } from "./Stages";
import ContentDialog from "./components/ContentDialog";
import { siteConfig } from "./siteConfig";
import PhotoDialog from "./components/PhotoDialog";
import type { PhotoAlbumId } from "./photoAlbums";
import { photoUrl } from "./photoAlbums";
import { openDialog } from "./useDialogMotion";
import { contextDocument } from "./documents";
import { useSwipeGesture } from "./useSwipeGesture";

export default function App() {
  const { stage, choices, choose, go, move, mainRef, transitioning, settle } =
    useJourney();
  const [view, setView] = useState<DialogView>("guide");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photoDialogRef = useRef<HTMLDialogElement>(null);
  const [photoSelection, setPhotoSelection] = useState<{
    album: PhotoAlbumId;
    index: number;
  }>({ album: "training", index: 0 });
  function openPhotos(album: PhotoAlbumId, index = 0) {
    settle();
    setPhotoSelection({ album, index });
    openDialog(photoDialogRef.current);
  }
  const swipe = useSwipeGesture(
    (direction) => {
      if (stage > 0) move(direction);
    },
    {
      ignore:
        "button,a,input,select,textarea,summary,dialog,nav,[role=tablist],[role=group],.photo-story,.identity-blue,.item-selector,.learning-levels",
      edge: 20,
      distance: 88,
      stopPropagation: false,
    },
  );
  function open(next: DialogView) {
    settle();
    if (next === "registration" && siteConfig.registrationUrl) {
      window.open(siteConfig.registrationUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setView(next);
    dialogRef.current?.querySelector(".dialog-scroll")?.scrollTo(0, 0);
    openDialog(dialogRef.current);
  }
  function navigate(next: number, folder?: number) {
    if (folder !== undefined) choose("folder", folder);
    go(next);
  }
  return (
    <div className="app">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus({ preventScroll: true });
        }}
      >
        Đến nội dung
      </a>
      <div className="os-frame">
        <header className="os-header">
          <button
            className="os-brand mono"
            aria-label="Ban Công Nghệ — về bước đầu"
            onClick={() => go(0)}
          >
            <img
              src={photoUrl("BCN_Logo.jpg")}
              alt=""
              width="40"
              height="40"
              decoding="async"
              draggable={false}
            />
            BAN_CÔNG_NGHỆ
          </button>
          <span className="os-process mono">{stages[stage].code}</span>
          <div className="header-right">
            <button
              className="docs-button mono"
              aria-label="[ DOCS ↗ ]"
              title="Tài liệu BCN"
              onClick={() =>
                open(
                  contextDocument(
                    stages[stage].id,
                    choices.identity,
                    choices.folder,
                    choices.activity,
                  ),
                )
              }
            >
              <span className="docs-label">[ DOCS ↗ ]</span>
              <span className="docs-icon" aria-hidden="true">
                DOCS
              </span>
            </button>
            <button
              className="step-badge mono"
              aria-label="Mở 7 câu hỏi về BCN"
              onClick={() => open("index")}
            >
              STEP [<strong>{String(stage + 1).padStart(2, "0")}</strong>/
              {String(stages.length).padStart(2, "0")}]
            </button>
          </div>
        </header>
        <main
          className="stage-viewport"
          ref={mainRef}
          id="main-content"
          aria-busy={transitioning}
          data-transitioning={transitioning ? "true" : "false"}
          tabIndex={-1}
          {...swipe}
        >
          <div className="stage-mount" key={stage}>
            <Stage
              stage={stage}
              choices={choices}
              choose={choose}
              go={go}
              open={open}
              settle={settle}
              openPhotos={openPhotos}
            />
          </div>
        </main>
        <footer className="os-footer">
          <button
            className="nav-button prev-button mono"
            aria-label="Quay lại bước trước"
            disabled={stage === 0}
            onClick={() => move(-1)}
          >
            <span className="prev-label">&lt; BACK</span>
            <span className="prev-compact" aria-hidden="true">
              ←
            </span>
          </button>
          <div className="footer-center">
            <nav className="step-dots" aria-label="Tiến trình hành trình">
              {stages.map((item, index) => (
                <button
                  key={item.id}
                  aria-label={`Bước ${index + 1}: ${item.label}`}
                  aria-current={stage === index ? "step" : undefined}
                  onClick={() => go(index)}
                >
                  <span />
                </button>
              ))}
            </nav>
            <span className="footer-stage mono">{stages[stage].label}</span>
          </div>
          <div className="footer-right">
            {stage > 0 && stage < stages.length - 1 && (
              <button
                className="nav-button next-button mono"
                aria-label="NEXT >"
                onClick={() => move(1)}
              >
                <span className="next-label">NEXT &gt;</span>
                <span className="next-compact" aria-hidden="true">
                  &gt;
                </span>
              </button>
            )}
          </div>
        </footer>
      </div>
      <ContentDialog
        view={view}
        dialogRef={dialogRef}
        navigate={navigate}
        read={open}
      />
      <PhotoDialog
        albumId={photoSelection.album}
        initialIndex={photoSelection.index}
        dialogRef={photoDialogRef}
      />
    </div>
  );
}
