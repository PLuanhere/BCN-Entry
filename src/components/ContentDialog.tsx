import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import { questions, stages } from "../content";
import type { DialogView } from "../Stages";
import { closeDialog, useDialogMotion } from "../useDialogMotion";
import { documents } from "../documents";
import DocumentContent from "./DocumentContent";

type Props = {
  view: DialogView;
  dialogRef: RefObject<HTMLDialogElement | null>;
  navigate: (stage: number, folder?: number) => void;
  read: (view: DialogView) => void;
};
export default function ContentDialog({
  view,
  dialogRef,
  navigate,
  read,
}: Props) {
  useDialogMotion(dialogRef);
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    dialog.querySelector(".dialog-scroll")?.scrollTo(0, 0);
    dialog
      .querySelector<HTMLElement>("#dialog-title")
      ?.focus({ preventScroll: true });
  }, [view, dialogRef]);
  const close = () => closeDialog(dialogRef.current);
  const closeAndNavigate = (stage: number, folder?: number) => {
    void close().then((completed) => {
      if (completed) navigate(stage, folder);
    });
  };
  return (
    <dialog
      className={`content-dialog dialog-${view}`}
      ref={dialogRef}
      aria-labelledby="dialog-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) void close();
      }}
    >
      <div className="dialog-shell">
        <header className="dialog-header">
          <span className="mono">
            BCN.OS /{" "}
            {view === "registration"
              ? "REGISTER"
              : view === "index"
                ? "QUESTIONS.INDEX"
                : documents[view].code}
          </span>
          <button aria-label="Đóng cửa sổ" onClick={close}>
            ×
          </button>
        </header>
        <div className="dialog-scroll" key={view}>
          {view === "registration" ? (
            <div className="registration-content">
              <span className="outlined-tag mono">
                NEXT CONNECTION / COMING SOON
              </span>
              <h2 id="dialog-title" tabIndex={-1}>
                HẸN BẠN Ở<br />
                BƯỚC TIẾP THEO.
              </h2>
              <p className="body-copy">
                Link đăng ký sẽ được cập nhật tại đây. Trong lúc chờ, bạn có thể
                xem lại hành trình gia nhập để chuẩn bị cho bước tiếp theo.
              </p>
              <button className="solid-button" onClick={() => read("process")}>
                XEM LỘ TRÌNH GIA NHẬP ↗
              </button>
              <button className="inline-link mono" onClick={close}>
                QUAY LẠI HÀNH TRÌNH ←
              </button>
            </div>
          ) : view === "index" ? (
            <>
              <span className="content-label mono">
                {questions.length} CÂU HỎI / {stages.length} ĐIỂM CHẠM
              </span>
              <h2 id="dialog-title" tabIndex={-1}>
                BẠN MUỐN BIẾT GÌ?
              </h2>
              <div className="question-index">
                {questions.map((question, index) => (
                  <button
                    key={question.text}
                    onClick={() =>
                      closeAndNavigate(question.stage, question.folder)
                    }
                  >
                    <span className="mono">0{index + 1}</span>
                    <strong>{question.text}</strong>
                    <span>↗</span>
                  </button>
                ))}
              </div>
              <div className="index-stages mono">
                {stages.map((stage, index) => (
                  <button
                    key={stage.id}
                    onClick={() => closeAndNavigate(index)}
                  >{`0${index + 1} / ${stage.label}`}</button>
                ))}
              </div>
            </>
          ) : (
            <DocumentContent document={documents[view]} />
          )}
        </div>
      </div>
    </dialog>
  );
}
