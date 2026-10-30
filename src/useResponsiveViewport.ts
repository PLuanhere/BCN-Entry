import { useEffect } from "react";
import type { RefObject } from "react";

// Mobile keyboards can shrink the visible viewport without changing 100dvh.
export function useResponsiveViewport(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const app = ref.current;
    const viewport = window.visualViewport;
    if (!app || !viewport) return;
    let frame = 0;
    let restingHeight = innerHeight;
    let restingWidth = innerWidth;
    const update = () => {
      const editing = document.activeElement?.matches('input, textarea, [contenteditable="true"]');
      if (Math.abs(innerWidth - restingWidth) > 80) { restingWidth = innerWidth; restingHeight = innerHeight; }
      const keyboard = (!!editing || app.dataset.keyboard === "true") && Math.abs(viewport.scale - 1) < .05 && Math.max(innerHeight, restingHeight) - viewport.height > 100;
      if (!keyboard && !editing) restingHeight = innerHeight;
      app.dataset.keyboard = String(keyboard);
      app.dataset.keyboardCompact = String(keyboard && viewport.height < 440);
      if (keyboard) {
        app.style.setProperty("--app-height", `${Math.round(viewport.height)}px`);
        app.style.setProperty("--visual-top", `${Math.round(viewport.offsetTop)}px`);
      } else {
        app.style.removeProperty("--app-height");
        app.style.removeProperty("--visual-top");
      }
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    viewport.addEventListener("resize", schedule);
    viewport.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", schedule);
      viewport.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
    };
  }, [ref]);
}
