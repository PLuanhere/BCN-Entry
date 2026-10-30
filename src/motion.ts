// Effects always start automatically. Reduced motion uses a short fade,
// rather than disabling the feedback or moving the content across the screen.
export function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const motionEase = "cubic-bezier(.22,1,.36,1)";

export const isMotionVisible = (element: HTMLElement) =>
  element.checkVisibility?.() ?? element.getClientRects().length > 0;

// Only opacity and transforms: no layout animation or page-sized snapshots.
export function reveal(element: HTMLElement, {
  x = 0, y = 8, delay = 0, duration = 240, fromOpacity = .72,
  reducedDuration = 160, reducedDelay = 0,
}: { x?: number; y?: number; delay?: number; duration?: number; fromOpacity?: number; reducedDuration?: number; reducedDelay?: number } = {}) {
  if (document.hidden || !isMotionVisible(element) || typeof element.animate !== "function") return null;
  try {
    const reduced = shouldReduceMotion();
    const timing = { duration: reduced ? reducedDuration : duration, delay: reduced ? reducedDelay : delay };
    const animation = element.animate([
      { opacity: fromOpacity, ...(!reduced && { transform: `translate3d(${x}px, ${y}px, 0)` }) },
      { opacity: 1, ...(!reduced && { transform: "none" }) },
    ], { ...timing, easing: motionEase, fill: "both" });
    // A busy renderer must never leave readable content waiting on its timeline.
    const fallback = window.setTimeout(() => {
      if (document.hidden || animation.playState === "paused") return;
      try { animation.finish(); } catch { animation.cancel(); }
    }, timing.duration + timing.delay + 600);
    void animation.finished.then(() => { clearTimeout(fallback); animation.cancel(); }, () => clearTimeout(fallback));
    return animation;
  } catch {
    return null;
  }
}
