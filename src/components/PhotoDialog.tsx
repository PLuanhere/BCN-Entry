import { useState } from "react";
import type { RefObject } from "react";
import { photoAlbums } from "../photoAlbums";
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
      className="content-dialog photo-dialog"
      ref={dialogRef}
      aria-labelledby="photo-dialog-title"
      onClose={() => setSession((value) => value + 1)}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="dialog-shell">
        <header className="dialog-header">
          <span className="mono">BCN / {album.code}</span>
          <button aria-label="Đóng bộ ảnh" onClick={close}>
            ×
          </button>
        </header>
        <div className="dialog-scroll">
          <h2 id="photo-dialog-title">{album.title}</h2>
          <p className="body-copy photo-intro">{album.intro}</p>
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
