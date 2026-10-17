import { useEffect } from "react";
import type { RefObject } from "react";

type Motion = {
  phase: "opening" | "closing";
  animation?: Animation;
  timer?: number;
  done: (completed: boolean) => void;
  finish: () => void;
  promise: Promise<boolean>;
};
const motions = new WeakMap<HTMLDialogElement, Motion>();

function cancelMotion(dialog: HTMLDialogElement) {
  const motion = motions.get(dialog);
  if (!motion) return;
  motions.delete(dialog);
  window.clearTimeout(motion.timer);
  motion.animation?.cancel();
  motion.done(false);
}

function animateDialog(dialog: HTMLDialogElement, phase: Motion["phase"]) {
  const interrupted = motions.has(dialog);
  const style = getComputedStyle(dialog);
  const from = {
    opacity: phase === "opening" && !interrupted ? "0" : style.opacity,
    transform:
      phase === "opening" && !interrupted
        ? "translateY(18px) scale(0.985)"
        : style.transform,
  };
  cancelMotion(dialog);
  dialog.dataset.motion = phase;
  let done!: Motion["done"];
  const promise = new Promise<boolean>((resolve) => {
    done = resolve;
  });
  const motion: Motion = {
    phase,
    promise,
    done,
    finish: () => {
      if (motions.get(dialog) !== motion) return;
      motions.delete(dialog);
      window.clearTimeout(motion.timer);
      if (phase === "closing") dialog.close();
      else dialog.dataset.motion = "open";
      motion.animation?.cancel();
      done(true);
    },
  };
  motions.set(dialog, motion);
  const duration = phase === "opening" ? 360 : 220;
  if (
    typeof dialog.animate !== "function" ||
    document.visibilityState === "hidden"
  ) {
    motion.finish();
    return promise;
  }
  try {
    motion.animation = dialog.animate(
      [
        from,
        phase === "opening"
          ? { opacity: "1", transform: "none" }
          : { opacity: "0", transform: "translateY(10px) scale(0.99)" },
      ],
      {
        duration,
        easing:
          phase === "opening"
            ? "cubic-bezier(0.22, 1, 0.36, 1)"
            : "cubic-bezier(0.4, 0, 1, 1)",
        fill: "both",
      },
    );
    motion.animation.finished.then(motion.finish, () => {});
    motion.timer = window.setTimeout(motion.finish, duration + 200);
  } catch {
    motion.finish();
  }
  return promise;
}

export function openDialog(dialog: HTMLDialogElement | null) {
  if (!dialog) return;
  if (dialog.open && motions.get(dialog)?.phase !== "closing") return;
  if (!dialog.open) dialog.showModal();
  void animateDialog(dialog, "opening");
}

export function closeDialog(
  dialog: HTMLDialogElement | null,
): Promise<boolean> {
  if (!dialog?.open) return Promise.resolve(false);
  const active = motions.get(dialog);
  if (active?.phase === "closing") return active.promise;
  return animateDialog(dialog, "closing");
}

export function useDialogMotion(ref: RefObject<HTMLDialogElement | null>) {
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const cancel = (event: Event) => {
      event.preventDefault();
      void closeDialog(dialog);
    };
    const closed = () => {
      if (dialog.open) return;
      cancelMotion(dialog);
      delete dialog.dataset.motion;
    };
    const visibility = () => {
      if (document.visibilityState === "hidden") motions.get(dialog)?.finish();
    };
    dialog.addEventListener("cancel", cancel);
    dialog.addEventListener("close", closed);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("close", closed);
      document.removeEventListener("visibilitychange", visibility);
      cancelMotion(dialog);
    };
  }, [ref]);
}
