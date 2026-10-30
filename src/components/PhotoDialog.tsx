import { useState } from "react";
import type { RefObject } from "react";
import { photoAlbums, photoUrl } from "../photoAlbums";
import type { PhotoAlbumId } from "../photoAlbums";
import PhotoStory from "./PhotoStory";
import { closeDialog, useDialogMotion } from "../useDialogMotion";

export default function PhotoDialog({
  albumId,
  initialIndex,
  dialogRef,
}: {
  albumId: PhotoAlbumId;
  initialIndex: number;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  const album = photoAlbums[albumId];
  const [session, setSession] = useState(0);
  useDialogMotion(dialogRef);
  const close = () => closeDialog(dialogRef.current);
  return (
    <dialog
      className="content-dialog fit-dialog photo-dialog"
      ref={dialogRef}
      aria-labelledby="photo-dialog-title"
      onClose={() => setSession((value) => value + 1)}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="dialog-shell">
        <header className="dialog-header">
          <span className="dialog-brand"><img src={photoUrl("BCN_Logo.jpg")} alt="" width="28" height="28" /><span>{album.code}</span></span>
          <button aria-label="Đóng bộ ảnh" onClick={close}>
            ×
          </button>
        </header>
        <div className="dialog-scroll photo-dialog-body">
          <div className="album-heading"><h2 id="photo-dialog-title">{album.title}</h2><p className="photo-intro">{album.intro}</p></div>
          <PhotoStory
            key={`${albumId}-${initialIndex}-${session}`}
            albumId={albumId}
            initialIndex={initialIndex}
            full
          />
        </div>
      </div>
    </dialog>
  );
}
