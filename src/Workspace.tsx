import { useEffect, useRef } from "react";
import { studyTracks } from "./bcnInfo";
import TechIcon from "./components/TechIcon";
import ContentIcon from "./components/ContentIcon";
import { photoAlbums, photoUrl } from "./photoAlbums";
import { useContentMotion } from "./useContentMotion";

type Props = { selected: number; onSelect: (index: number) => void; openQuestions: () => void };
export default function Workspace({ selected, onSelect, openQuestions }: Props) {
  const navRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const current = Math.min(selected, studyTracks.length - 1);
  const item = studyTracks[current];
  const photoIndex = [0, 2, 3, 4, 1, 2][current];
  const photo = photoAlbums.training.photos[photoIndex];
  useContentMotion(panelRef, current, ".workspace-focus, .track-icons, .study-photo");
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (nav && active && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: Math.max(0, active.offsetLeft - nav.offsetLeft - 8), behavior: "instant" });
  }, [current]);
  return (
    <section className="stage workspace-stage" aria-labelledby="stage-title">
      <header className="workspace-header"><div><span className="eyebrow">HỌC & THỰC HÀNH</span><h1 id="stage-title">Bạn muốn học gì?</h1></div></header>
      <div className="folder-navigation workspace-tabs" role="tablist" aria-label="Các hướng học" ref={navRef}>
        {studyTracks.map((track, index) => <button role="tab" id={`study-tab-${index}`} aria-controls="study-panel" aria-selected={current === index} tabIndex={current === index ? 0 : -1} key={track.id} onClick={() => onSelect(index)} onKeyDown={(event) => {
          let next: number;
          if (event.key === "ArrowRight") next = (index + 1) % studyTracks.length;
          else if (event.key === "ArrowLeft") next = (index + studyTracks.length - 1) % studyTracks.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = studyTracks.length - 1;
          else return;
          event.preventDefault(); onSelect(next); navRef.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
        }}><span className="track-tab-icon" aria-hidden="true">{track.id === "backend" ? <ContentIcon name="server" /> : <TechIcon name={track.tech[0]} />}</span><span>{track.label}</span></button>)}
      </div>
      <div className="folder-content workspace-scene scene-learn" ref={panelRef} role="tabpanel" id="study-panel" aria-labelledby={`study-tab-${current}`} tabIndex={0}>
        <div className="workspace-copy">
          <div className="workspace-focus track-detail" key={item.id} aria-live="polite"><h2 className="study-track-title">{item.title}</h2><p className="body-copy">{item.text}</p></div>
          <div className="track-icons" aria-label={`Công nghệ và nội dung ${item.label}`}>{item.tech.map((tech) => <TechIcon name={tech} label key={tech} />)}</div>
        </div>
        <figure className="workspace-visual study-photo" key={item.id}><img src={photoUrl(photo.file)} alt={photo.alt} width="2048" height="1536" decoding="async" style={{ objectPosition: photo.position || "50% 50%" }} /><figcaption><span className="eyebrow">MỘT GÓC BUỔI HỌC BCN</span><p>{photo.caption}</p></figcaption></figure>
      </div>
      <div className="section-tools workspace-help"><button className="text-action" onClick={openQuestions}>Đầu vào & câu hỏi thường gặp <span aria-hidden="true">↗</span></button></div>
    </section>
  );
}
