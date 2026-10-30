import { useEffect, useRef, useState } from "react";
import { stages } from "./content";
import { useJourney } from "./journey";
import Stage from "./Stages";
import type { DialogView } from "./Stages";
import ContentDialog from "./components/ContentDialog";
import { siteConfig } from "./siteConfig";
import PhotoDialog from "./components/PhotoDialog";
import type { PhotoAlbumId } from "./photoAlbums";
import { photoUrl } from "./photoAlbums";
import { closeDialog, openDialog } from "./useDialogMotion";
import { makeDialogEntry, readDialogEntry } from "./dialogHistory";
import TechBackground from "./components/TechBackground";
import { useResponsiveViewport } from "./useResponsiveViewport";
import { useEntryLoader } from "./useEntryLoader";

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);
  useResponsiveViewport(appRef);
  const entering = useEntryLoader(appRef);
  const { stage, furthest, maxStage, choices, choose, go, move, mainRef, transitioning, settle } =
    useJourney(entering);
  const startupDialog = useRef(readDialogEntry());
  const [view, setView] = useState<DialogView>(startupDialog.current?.type === "content" ? startupDialog.current.view : "guide");
  const [initialQuestion, setInitialQuestion] = useState(startupDialog.current?.type === "content" ? startupDialog.current.initialQuestion : 0);
  const [focusSearch, setFocusSearch] = useState(startupDialog.current?.type === "content" ? startupDialog.current.focusSearch : true);
  const [navigationHint, setNavigationHint] = useState("");
  const hintTimer = useRef<number | undefined>(undefined);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photoDialogRef = useRef<HTMLDialogElement>(null);
  const [photoSelection, setPhotoSelection] = useState<{
    album: PhotoAlbumId;
    index: number;
  }>(startupDialog.current?.type === "photo" ? { album: startupDialog.current.album, index: startupDialog.current.index } : { album: "training", index: 0 });
  useEffect(() => {
    const restore = () => {
      const entry = readDialogEntry();
      if (entry) settle();
      if (entry?.type === "content") {
        setView(entry.view);
        setInitialQuestion(entry.initialQuestion);
        setFocusSearch(entry.focusSearch);
        void closeDialog(photoDialogRef.current);
        openDialog(dialogRef.current, entry, true);
      } else if (entry?.type === "photo") {
        setPhotoSelection({ album: entry.album, index: entry.index });
        void closeDialog(dialogRef.current);
        openDialog(photoDialogRef.current, entry, true);
      } else {
        void closeDialog(dialogRef.current);
        void closeDialog(photoDialogRef.current);
      }
    };
    if (readDialogEntry()) restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [settle]);
  useEffect(() => {
    setNavigationHint("");
    window.clearTimeout(hintTimer.current);
    return () => window.clearTimeout(hintTimer.current);
  }, [stage]);
  function explainLockedStep() {
    setNavigationHint("Mục này chưa mở. Bấm Tiếp tục ở dưới để xem lần lượt.");
    window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setNavigationHint(""), 4000);
  }
  function openPhotos(album: PhotoAlbumId, index = 0) {
    settle();
    setPhotoSelection({ album, index });
    openDialog(photoDialogRef.current, makeDialogEntry({ type: "photo", album, index }));
  }
  function open(next: DialogView, search = true) {
    settle();
    if (next === "registration" && siteConfig.registrationUrl) {
      window.open(siteConfig.registrationUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setView(next);
    const question = [0, 2, 4, 5, 6][stage];
    setInitialQuestion(question);
    setFocusSearch(search);
    dialogRef.current?.querySelector(".dialog-scroll")?.scrollTo(0, 0);
    openDialog(dialogRef.current, makeDialogEntry({ type: "content", view: next, initialQuestion: question, focusSearch: search }));
  }
  function navigate(next: number, folder?: number) {
    if (folder !== undefined) choose("folder", folder);
    go(next);
  }
  return (
    <div className="app newcomer-app" ref={appRef} inert={entering} aria-busy={entering}>
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
        <TechBackground />
        <header className="os-header">
          <button
            className="os-brand"
            aria-label="Ban Công Nghệ — về tổng quan"
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
            <span>Ban Công Nghệ<small>Đoàn Khoa CNTT, IUH</small></span>
          </button>
          <nav className="primary-nav" aria-label="Điều hướng chính">
            {stages.map((item, index) => {
              const locked = index > maxStage || (transitioning && index > furthest);
              return <a key={item.id} href={`#/${item.id}`} aria-current={stage === index ? "page" : undefined} aria-disabled={locked || undefined} aria-describedby={index > maxStage ? "locked-step-description" : undefined} tabIndex={locked ? -1 : 0} className={index <= furthest && index !== stage ? "is-visited" : undefined} title={locked ? "Xem các mục trước để mở phần này" : undefined} onClick={(event) => { if (locked) { event.preventDefault(); if (index > maxStage) explainLockedStep(); } }}><span className="nav-step" aria-hidden="true">{index + 1}</span><span>{item.label}</span></a>;
            })}
          </nav>
          <span className="sr-only" id="locked-step-description">Xem lần lượt bằng nút Tiếp tục ở cuối màn hình để mở mục này.</span>
          <div className="header-right">
            <button
              className="search-trigger"
              aria-label="Tìm thông tin và hỏi đáp về BCN"
              onClick={() => open("index")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>
              <span>Tìm thông tin</span>
            </button>
          </div>
        </header>
        <main
          className="stage-viewport"
          ref={mainRef}
          id="main-content"
          aria-busy={transitioning}
          data-transitioning={transitioning ? "true" : "false"}
          onClickCapture={() => { if (mainRef.current?.dataset.entrance === "playing") settle(); }}
          onKeyDownCapture={() => { if (mainRef.current?.dataset.entrance === "playing") settle(); }}
          tabIndex={-1}
        >
          <div className="stage-mount" key={stage}>
            <Stage
              stage={stage}
              choices={choices}
              choose={choose}
              open={open}
              openPhotos={openPhotos}
            />
          </div>
        </main>
        <div className="navigation-hint" role="status" aria-live="polite">{navigationHint && <span>{navigationHint}</span>}</div>
        <footer className="os-footer journey-footer" aria-label="Chuyển từng bước">
          <button
            className="page-prev"
            aria-label="Xem mục trước"
            disabled={stage === 0}
            onClick={() => move(-1)}
          >
            <span aria-hidden="true">←</span> <span>{stage > 0 ? stages[stage - 1].label : "Tổng quan"}</span>
          </button>
          <div className="footer-center">
            <span className="page-count mono" aria-label={`Bước ${stage + 1} trên ${stages.length}`}>{stage + 1} <span>/ {stages.length}</span></span>
          </div>
          <div className="footer-right">
            {stage < stages.length - 1 ? (
              <button
                className="page-next action-primary journey-next"
                aria-label={`Xem tiếp: ${stages[stage + 1].label}`}
                disabled={transitioning}
                onClick={(event) => { if (event.detail <= 1) move(1); }}
              >
                <span className="journey-next-copy" key={stage}><small>Tiếp tục</small><strong>{stages[stage + 1].label}</strong></span><span className="journey-next-arrow" aria-hidden="true">→</span>
              </button>
            ) : <a className="action-primary journey-next journey-complete" href={siteConfig.fanpageUrl} target="_blank" rel="noopener noreferrer" aria-label="Mở fanpage BCN để theo dõi tuyển K23 (mở trong tab mới)" aria-disabled={transitioning || undefined} onClick={(event) => { if (transitioning || event.detail > 1) event.preventDefault(); }}><span className="journey-next-copy"><small>Fanpage BCN · mở tab mới</small><strong>Theo dõi tuyển K23</strong></span><span className="journey-next-arrow" aria-hidden="true">↗</span></a>}
          </div>
        </footer>
      </div>
      <ContentDialog
        view={view}
        dialogRef={dialogRef}
        navigate={navigate}
        maxStage={maxStage}
        initialQuestion={initialQuestion}
        focusSearch={focusSearch}
      />
      <PhotoDialog
        albumId={photoSelection.album}
        initialIndex={photoSelection.index}
        dialogRef={photoDialogRef}
      />
    </div>
  );
}
