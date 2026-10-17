import { useEffect, useRef, useState } from "react";
import { folders } from "./content";
import {
  advancedItems,
  foundationItems,
  growthItems,
  labItems,
  projectItems,
  workflowItems,
  workspaceSections,
} from "./workspaceData";
import type { WorkspaceItem } from "./workspaceData";
import TechIcon from "./components/TechIcon";
import PhotoStory from "./components/PhotoStory";
import type { PhotoAlbumId } from "./photoAlbums";
import { closeDialog, openDialog, useDialogMotion } from "./useDialogMotion";
import DocumentContent from "./components/DocumentContent";
import { documentPoints } from "./documents";

type Props = {
  folder: number;
  onFolder: (index: number) => void;
  beforeRead: () => void;
  openPhotos: (album: PhotoAlbumId, index?: number) => void;
};
export default function Workspace({
  folder,
  onFolder,
  beforeRead,
  openPhotos,
}: Props) {
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nav = navRef.current;
    const selected = nav?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (nav && selected && nav.scrollWidth > nav.clientWidth)
      nav.scrollTo({
        left: Math.max(0, selected.offsetLeft - nav.offsetLeft - 8),
        behavior: "instant",
      });
  }, [folder]);
  return (
    <section className="stage workspace-stage" aria-labelledby="stage-title">
      <header className="workspace-header">
        <h1 id="stage-title">BẠN SẼ LÀM GÌ Ở ĐÂY?</h1>
        <span className="mono">
          <i /> HỌC → LÀM → CHIA SẺ
        </span>
      </header>
      <div
        className="folder-navigation workspace-tabs"
        role="tablist"
        aria-label="Thư mục hoạt động"
        ref={navRef}
      >
        {folders.map((tab, index) => (
          <button
            role="tab"
            aria-label={tab.label}
            id={`workspace-tab-${index}`}
            aria-controls="workspace-panel"
            aria-selected={folder === index}
            tabIndex={folder === index ? 0 : -1}
            key={tab.id}
            onClick={() => onFolder(index)}
            onKeyDown={(event) => {
              let next: number;
              if (event.key === "ArrowRight")
                next = (index + 1) % folders.length;
              else if (event.key === "ArrowLeft")
                next = (index + folders.length - 1) % folders.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = folders.length - 1;
              else return;
              event.preventDefault();
              onFolder(next);
              navRef.current
                ?.querySelectorAll<HTMLButtonElement>("button")
                [next]?.focus();
            }}
          >
            <span className="mono tab-index">0{index + 1}</span>
            <span>
              {
                [
                  "Learning",
                  "Projects",
                  "Product Labs",
                  "Một project",
                  "Đi tiếp",
                ][index]
              }
            </span>
            <span className="tab-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>
      <WorkspaceScene
        key={folder}
        folder={folder}
        beforeRead={beforeRead}
        openPhotos={openPhotos}
      />
    </section>
  );
}

function WorkspaceScene({
  folder,
  beforeRead,
  openPhotos,
}: {
  folder: number;
  beforeRead: () => void;
  openPhotos: (album: PhotoAlbumId, index?: number) => void;
}) {
  const [advanced, setAdvanced] = useState(false);
  const [selected, setSelected] = useState(0);
  const itemsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = itemsRef.current;
    const active = strip?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!strip || !active || strip.scrollWidth <= strip.clientWidth) return;
    const item = active.getBoundingClientRect();
    const frame = strip.getBoundingClientRect();
    if (item.left < frame.left + 4 || item.right > frame.right - 4) {
      strip.scrollTo({
        left: strip.scrollLeft + item.left - frame.left - 8,
        behavior: "smooth",
      });
    }
  }, [selected, advanced, folder]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useDialogMotion(dialogRef);
  const section = workspaceSections[folder];
  const items =
    folder === 0
      ? advanced
        ? advancedItems
        : foundationItems
      : folder === 1
        ? projectItems
        : folder === 2
          ? labItems
          : folder === 3
            ? workflowItems
            : growthItems;
  const item = items[selected];
  const key = `${folder}-${advanced}-${selected}`;
  const detailClass =
    folder === 0
      ? "track-detail"
      : folder === 1
        ? "project-detail"
        : folder === 2
          ? "lab-detail"
          : folder === 3
            ? "workflow-detail"
            : "growth-path";
  return (
    <div
      className={`folder-content workspace-scene scene-${section.shape}`}
      role="tabpanel"
      id="workspace-panel"
      aria-labelledby={`workspace-tab-${folder}`}
      tabIndex={0}
    >
      <div className="workspace-copy">
        <div className="workspace-intro">
          <span className="content-label mono">
            {section.code}
            {folder === 4 && " / CÁC HƯỚNG TRƯỞNG THÀNH"}
          </span>
          <h2 className="workspace-section-title">{section.title}</h2>
          <p>{section.lead}</p>
        </div>
        {folder === 0 && (
          <div
            className="learning-levels"
            role="group"
            aria-label="Cấp độ học tập"
          >
            <button
              aria-pressed={!advanced}
              onClick={() => {
                setAdvanced(false);
                setSelected(0);
              }}
            >
              01 / Cơ bản
            </button>
            <button
              aria-pressed={advanced}
              onClick={() => {
                setAdvanced(true);
                setSelected(0);
              }}
            >
              02 / Nâng cao
            </button>
          </div>
        )}
        <div
          className="item-selector"
          ref={itemsRef}
          role="group"
          aria-label={
            folder === 0
              ? advanced
                ? "Hướng học nâng cao"
                : "Nền tảng chung"
              : "Chọn nội dung"
          }
        >
          {items.map((option, index) => (
            <button
              key={option.name}
              aria-label={option.name}
              title={option.name}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span className="item-dot" />
              {option.label}
            </button>
          ))}
        </div>
        <div
          className={`workspace-focus ${detailClass}`}
          key={key}
          aria-live="polite"
        >
          <h3>{item.title}</h3>
          <p className="body-copy">{item.summary}</p>
          <button
            className="workspace-read mono"
            onClick={() => {
              beforeRead();
              if (item.photoAlbum) openPhotos(item.photoAlbum);
              else {
                dialogRef.current
                  ?.querySelector(".dialog-scroll")
                  ?.scrollTo(0, 0);
                openDialog(dialogRef.current);
              }
            }}
          >
            {item.photoAlbum ? "XEM 7 ẢNH TRAINING" : "ĐỌC CHI TIẾT"}{" "}
            <span>↗</span>
          </button>
        </div>
      </div>
      <WorkspaceVisual
        key={key}
        folder={folder}
        selected={selected}
        advanced={advanced}
        item={item}
        openPhotos={openPhotos}
      />
      <dialog
        className="content-dialog workspace-detail-dialog"
        ref={dialogRef}
        aria-labelledby="workspace-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget)
            void closeDialog(dialogRef.current);
        }}
      >
        <div className="dialog-shell">
          <header className="dialog-header">
            <span className="mono">BCN / {section.code}</span>
            <button
              aria-label="Đóng cửa sổ"
              onClick={() => void closeDialog(dialogRef.current)}
            >
              ×
            </button>
          </header>
          <div className="dialog-scroll">
            <DocumentContent
              titleId="workspace-dialog-title"
              document={{
                code: section.code,
                title: item.name,
                intro: item.summary,
                sections: [
                  {
                    title: "Nội dung chính",
                    points: documentPoints(item.detail),
                    wide: true,
                  },
                ],
                note:
                  folder === 3
                    ? "Minh họa từ văn hóa làm việc BCN."
                    : undefined,
              }}
            />
            {item.tech.some((tech) => !["code", "team"].includes(tech)) && (
              <div className="document-tech" aria-label="Công nghệ liên quan">
                {item.tech
                  .filter((tech) => !["code", "team"].includes(tech))
                  .map((tech) => (
                    <TechIcon name={tech} label key={tech} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}

function WorkspaceVisual({
  folder,
  selected,
  advanced,
  item,
  openPhotos,
}: {
  folder: number;
  selected: number;
  advanced: boolean;
  item: WorkspaceItem;
  openPhotos: (album: PhotoAlbumId, index?: number) => void;
}) {
  if (item.photoAlbum)
    return (
      <div className="workspace-visual workspace-photo">
        <PhotoStory
          albumId={item.photoAlbum}
          onExpand={(index) => openPhotos("training", index)}
        />
      </div>
    );
  const codes = [
    advanced ? "CHOOSE_YOUR_STACK" : "FOUNDATION_FIRST",
    "BUILD_TEST_REPEAT",
    "BETTER_TOGETHER",
    "ONE_TEAM_ONE_RHYTHM",
    "PASS_IT_FORWARD",
  ];
  return (
    <div className={`workspace-visual visual-${folder}`} aria-hidden="true">
      <div className="visual-caption mono">
        <span>BCN / {codes[folder]}</span>
        <span>0{selected + 1}</span>
      </div>
      <div className="visual-canvas">
        {folder === 0 && !advanced ? (
          <div className="foundation-machine">
            <div className="machine-axis" />
            {foundationItems
              .filter((step) => !step.photoAlbum)
              .map((step, index) => (
                <div
                  className={`machine-step ${item === step ? "machine-active" : ""}`}
                  key={step.name}
                >
                  <span className="mono">0{index + 1}</span>
                  <TechIcon name={step.tech[0]} />
                  <strong>{step.label.toUpperCase()}</strong>
                  <span className="machine-corner">↗</span>
                </div>
              ))}
          </div>
        ) : folder === 0 ? (
          <div className="stack-orbit">
            <div className="orbit-ring ring-one" />
            <div className="orbit-ring ring-two" />
            <div className="orbit-center">
              <TechIcon name={item.tech[0]} />
            </div>
            <div className="orbit-tag mono">{item.label.toUpperCase()}</div>
            {item.tech.slice(1).map((tech, index) => (
              <div
                className={`orbit-satellite satellite-${["one", "two", "three"][index]}`}
                key={tech}
              >
                <TechIcon name={tech} />
              </div>
            ))}
          </div>
        ) : folder === 1 ? (
          <div className="build-machine">
            <div className="mini-browser">
              <div className="browser-bar">
                <i />
                <i />
                <i />
                <span className="mono">YOUR_IDEA / MVP</span>
              </div>
              <div className="browser-content">
                <span className="browser-block" />
                <div className="browser-lines">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="browser-play">↗</span>
              </div>
            </div>
            <div className="build-stamp mono">
              BUILD.
              <br />
              TEST.
              <br />
              IMPROVE.
            </div>
            <span className="build-cursor">↖</span>
          </div>
        ) : folder === 2 ? (
          <div className="labs-machine">
            <div className="lab-square square-one" />
            <div className="lab-square square-two" />
            <div className="lab-square square-three" />
            <div className="lab-center">+</div>
            <span className="lab-label mono">SKILLS × PEOPLE</span>
          </div>
        ) : folder === 3 ? (
          <div className="flow-machine">
            <svg viewBox="0 0 400 300">
              <path className="flow-line" d="M80 70h240v160H80z" />
            </svg>
            {workflowItems.map((step, index) => (
              <div
                className={`flow-node node-${index} ${selected === index ? "node-active" : ""}`}
                key={step.label}
              >
                <span className="mono">0{index + 1}</span>
                <strong>{step.label}</strong>
              </div>
            ))}
            <span className="flow-center">↻</span>
          </div>
        ) : (
          <div className="growth-machine">
            {growthItems.map((step, index) => (
              <div
                className={`growth-step ${index <= selected ? "step-reached" : ""}`}
                key={step.label}
              >
                <span className="mono">0{index + 1}</span>
                <strong>{step.label}</strong>
              </div>
            ))}
            <span className="growth-arrow">↗</span>
          </div>
        )}
      </div>
      <div className="visual-bottom">
        <div className="tech-list">
          {item.tech.map((tech) => (
            <TechIcon name={tech} label key={tech} />
          ))}
        </div>
        <span className="mono visual-footer">
          {folder === 3 ? "NHỊP THỰC HÀNH MINH HỌA" : "LEARN. BUILD. SHARE."}
        </span>
      </div>
    </div>
  );
}
