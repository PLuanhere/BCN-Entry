import { useLayoutEffect, useState } from "react";
import type { RefObject } from "react";
import { siteConfig } from "../siteConfig";
import type { DialogView } from "../Stages";
import { closeDialog, useDialogMotion } from "../useDialogMotion";
import { documents } from "../documents";
import { photoUrl } from "../photoAlbums";
import DocumentContent from "./DocumentContent";
import QuickAnswers from "./QuickAnswers";
import ContentIcon from "./ContentIcon";

export default function ContentDialog({ view, dialogRef, navigate, maxStage, initialQuestion = 0, focusSearch }: {
  view: DialogView;
  dialogRef: RefObject<HTMLDialogElement | null>;
  navigate: (stage: number, folder?: number) => void;
  maxStage: number;
  initialQuestion?: number;
  focusSearch: boolean;
}) {
  const [session, setSession] = useState(0);
  useDialogMotion(dialogRef);
  useLayoutEffect(() => {
    if (dialogRef.current?.open) dialogRef.current.querySelector<HTMLElement>(view === "index" ? focusSearch ? "#question-search" : ".question-answer" : "#dialog-title")?.focus({ preventScroll: true });
  }, [view, dialogRef, focusSearch, initialQuestion]);
  const close = () => closeDialog(dialogRef.current);
  const closeAndNavigate = (stage: number) => void close().then((completed) => { if (completed) navigate(stage); });
  return <dialog className={`content-dialog fit-dialog dialog-${view}`} ref={dialogRef} aria-labelledby="dialog-title" onClose={() => setSession((value) => value + 1)} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); void close(); } }} onClick={(event) => { if (event.target === event.currentTarget) void close(); }}>
    <div className="dialog-shell">
      <header className="dialog-header"><span className="dialog-brand"><img src={photoUrl("BCN_Logo.jpg")} alt="" width="28" height="28" /><span>{view === "registration" ? "Thông tin tham gia" : view === "index" ? "Hỏi đáp BCN" : "Tìm hiểu BCN"}</span></span><button aria-label="Đóng cửa sổ" onClick={close}>×</button></header>
      <div className="dialog-scroll" key={`${view}-${session}`}>
        {view === "registration" ? <div className="registration-layout">
          <div className="registration-content"><span className="status-label"><span className="status-dot" aria-hidden="true" />K23 · Chờ thông báo tuyển</span><h2 id="dialog-title" tabIndex={-1}>Hẹn bạn ở BCN.</h2><p className="registration-intro">K22 đã kết thúc. Lịch và các vòng tuyển K23 chưa chốt.</p>
            <dl className="registration-facts">
              <div><ContentIcon name="people" /><dt>Dành cho</dt><dd>Sinh viên khoa CNTT, IUH</dd></div>
              <div><ContentIcon name="calendar" /><dt>Sinh hoạt</dt><dd>Lịch, địa điểm và thời lượng tối thiểu chưa chốt.</dd></div>
            </dl>
            <a className="action-primary" href={siteConfig.fanpageUrl} target="_blank" rel="noopener noreferrer">Mở fanpage BCN <span aria-hidden="true">↗</span><span className="sr-only"> (mở trong tab mới)</span></a>
          </div>
          <figure className="registration-photo"><img src={photoUrl("BCN_Train07.jpg")} alt="Các thành viên BCN cùng học và trao đổi trên laptop." width="2048" height="1536" /><img src={photoUrl("BCN_Train04.jpg")} alt="Hai thành viên giải thích và trao đổi ý tưởng trên bảng." width="2048" height="1536" /><figcaption>Học, thực hành và kết nối.</figcaption></figure>
        </div> : view === "index" ? <QuickAnswers key={initialQuestion} initialQuestion={initialQuestion} focusSearch={focusSearch} navigate={closeAndNavigate} maxStage={maxStage} /> : <DocumentContent key={view} document={documents[view]} />}
      </div>
    </div>
  </dialog>;
}
