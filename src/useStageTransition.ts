import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { flushSync } from "react-dom";
import { isMotionVisible, reveal, shouldReduceMotion } from "./motion";

type Direction = "forward" | "backward";
const entranceParts = ".notice-title, .notice-photo, .notice-note, .notice-tearoff, .workspace-header, .workspace-tabs, .workspace-copy, .study-photo, .activities-heading, .activity-tabs, .activity-copy-panel.is-active, .activity-media-panel.is-active, .reading-heading, .value-card, .join-intro, .join-community-photo, .join-next, .section-tools";

export function useStageTransition(viewportRef: RefObject<HTMLElement | null>, entranceBlocked = false) {
  const [transitioning, setTransitioning] = useState(false);
  const version = useRef(0);
  const active = useRef<Animation[]>([]);
  const cancelStartup = useRef<(() => void) | null>(null);

  const play = useCallback((direction: Direction, entrance = false) => {
    const request = ++version.current;
    active.current.forEach((animation) => animation.cancel());
    active.current = [];
    const animate = document.visibilityState === "visible";
    // The entrance never blocks the navigation controls.
    setTransitioning(animate && !entrance);
    if (viewportRef.current) viewportRef.current.dataset.entrance = "playing";
    const finish = () => {
      if (request !== version.current) return;
      active.current.forEach((animation) => animation.cancel());
      active.current = [];
      if (viewportRef.current) viewportRef.current.dataset.entrance = "done";
      setTransitioning(false);
    };
    const content = viewportRef.current?.querySelector<HTMLElement>(".stage-mount");
    if (!animate || !content || typeof content.animate !== "function") {
      finish();
      return;
    }
    try {
      const offset = direction === "forward" ? 18 : -18;
      const fadeOnly = !entrance && shouldReduceMotion();
      const parts = Array.from(content.querySelectorAll<HTMLElement>(entranceParts)).filter(isMotionVisible);
      const animations = (fadeOnly || !parts.length ? [
        reveal(content, { fromOpacity: 0, x: 0, y: 0, duration: 400, reducedDuration: 360 }),
      ] : parts.map((element, index) => reveal(element, {
        x: entrance ? 0 : offset, y: entrance ? 30 : 8,
        fromOpacity: 0, duration: entrance ? 640 : 400, delay: index * (entrance ? 95 : 50),
        reducedDuration: 560, reducedDelay: index * 95,
      }))).filter((animation): animation is Animation => animation !== null);
      active.current = animations;
      void Promise.allSettled(animations.map((animation) => animation.finished)).then(finish);
    } catch {
      finish();
    }
  }, [viewportRef]);

  // Wait for the first visible paint and critical assets, so the entrance
  // isn't over before an embedded browser actually presents the page.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = viewport?.querySelector<HTMLElement>(".stage-mount");
    if (!viewport || !content) return;
    if (entranceBlocked) {
      viewport.dataset.entrance = "pending";
      content.style.opacity = "0";
      return () => content.style.removeProperty("opacity");
    }
    let cancelled = false;
    let ready = false;
    let started = false;
    let firstFrame = 0;
    let secondFrame = 0;
    viewport.dataset.entrance = "pending";
    content.style.opacity = "0";
    const show = () => content.style.removeProperty("opacity");
    const start = () => {
      if (cancelled || started || !ready || document.hidden || firstFrame) return;
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          firstFrame = 0;
          if (cancelled || document.hidden) return;
          started = true;
          cancelStartup.current = null;
          document.removeEventListener("visibilitychange", start);
          show();
          play("forward", true);
        });
      });
    };
    const timer = window.setTimeout(() => { ready = true; start(); }, 450);
    const image = Array.from(content.querySelectorAll<HTMLImageElement>("img")).find(isMotionVisible);
    void Promise.allSettled([document.fonts.ready, image?.decode?.()]).then(() => {
      if (cancelled) return;
      clearTimeout(timer);
      ready = true;
      start();
    });
    document.addEventListener("visibilitychange", start);
    const cancel = () => {
      cancelled = true;
      clearTimeout(timer);
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      document.removeEventListener("visibilitychange", start);
      show();
      viewport.dataset.entrance = "done";
    };
    cancelStartup.current = cancel;
    return () => {
      cancel();
      cancelStartup.current = null;
      ++version.current;
      active.current.forEach((animation) => animation.cancel());
    };
  }, [play, viewportRef, entranceBlocked]);

  const run = useCallback((commit: () => void, direction: Direction) => {
    cancelStartup.current?.();
    cancelStartup.current = null;
    if (viewportRef.current) viewportRef.current.dataset.entrance = "done";
    // Show the latest route immediately without capturing page snapshots.
    flushSync(() => { setTransitioning(!document.hidden); commit(); });
    play(direction);
  }, [play, viewportRef]);

  const settle = useCallback(() => {
    cancelStartup.current?.();
    cancelStartup.current = null;
    ++version.current;
    active.current.forEach((animation) => animation.cancel());
    active.current = [];
    if (viewportRef.current) viewportRef.current.dataset.entrance = "done";
    setTransitioning(false);
  }, [viewportRef]);

  useEffect(() => {
    const visibility = () => {
      if (cancelStartup.current) return;
      // A preview can be covered just after loading. Preserve its remaining
      // entrance instead of consuming it while the user cannot see the page.
      for (const animation of active.current) {
        if (document.hidden && animation.playState === "running") animation.pause();
        else if (!document.hidden && animation.playState === "paused") animation.play();
      }
    };
    const resize = () => {
      // Embedded previews can resize during startup. Transform-only entrance
      // parts already follow the layout, so let that first entrance finish.
      if (viewportRef.current?.dataset.entrance === "pending" || viewportRef.current?.dataset.entrance === "playing") return;
      settle();
    };
    addEventListener("resize", resize);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", settle);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      ++version.current;
      active.current.forEach((animation) => animation.cancel());
      removeEventListener("resize", resize);
      preference.removeEventListener("change", settle);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [settle, viewportRef]);

  return { run, transitioning, settle };
}
