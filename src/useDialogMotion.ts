import { useEffect } from "react";
import type { RefObject } from "react";
import { motionEase, shouldReduceMotion } from "./motion";
import { releaseDialogHistory, trackDialogHistory } from "./dialogHistory";
import type { DialogEntry } from "./dialogHistory";

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
  const reduced = shouldReduceMotion();
  const from = {
    opacity: phase === "opening" && !interrupted ? "0" : style.opacity,
    transform: reduced ? "none" :
      phase === "opening" && !interrupted
        ? "translateY(12px) scale(0.99)"
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
      if (phase === "closing") void releaseDialogHistory(dialog).then(() => done(true));
      else done(true);
    },
  };
  motions.set(dialog, motion);
  const duration = reduced ? 160 : phase === "opening" ? 240 : 160;
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
          : { opacity: "0", transform: reduced ? "none" : "translateY(6px) scale(0.995)" },
      ],
      {
        duration,
        easing:
          phase === "opening"
            ? motionEase
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

export function openDialog(dialog: HTMLDialogElement | null, entry?: DialogEntry, restore = false) {
  if (!dialog) return;
  if (dialog.open && motions.get(dialog)?.phase !== "closing") return;
  if (entry) trackDialogHistory(dialog, entry, restore);
  if (!dialog.open) dialog.showModal();
  const focusTarget = entry?.type === "content"
    ? entry.view === "index" ? entry.focusSearch ? "#question-search" : ".question-answer" : "#dialog-title"
    : "[data-dialog-autofocus]";
  dialog.querySelector<HTMLElement>(focusTarget)?.focus({ preventScroll: true });
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
    const settle = () => motions.get(dialog)?.finish();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", settle);
    window.addEventListener("resize", settle);
    dialog.addEventListener("cancel", cancel);
    dialog.addEventListener("close", closed);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("close", closed);
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", settle);
      window.removeEventListener("resize", settle);
      cancelMotion(dialog);
    };
  }, [ref]);
}
