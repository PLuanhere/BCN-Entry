import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { flushSync } from "react-dom";

type Direction = "forward" | "backward";

export function useStageTransition(viewportRef: RefObject<HTMLElement | null>) {
  const [transitioning, setTransitioning] = useState(false);
  const version = useRef(0);
  const active = useRef<ViewTransition | null>(null);
  const fallback = useRef<Animation | null>(null);
  const settledVersion = useRef(-1);

  const run = useCallback(
    (commit: () => void, direction: Direction) => {
      // A skipped native transition still runs its update callback. Only the
      // newest request may commit, including browser Back/Forward requests.
      const request = ++version.current;
      active.current?.skipTransition();
      fallback.current?.cancel();
      active.current = null;
      fallback.current = null;

      const finish = () => {
        if (request !== version.current) return;
        active.current = null;
        fallback.current?.cancel();
        fallback.current = null;
        setTransitioning(false);
      };
      const apply = () => {
        if (request === version.current) flushSync(commit);
      };

      if (document.visibilityState !== "visible") {
        apply();
        finish();
        return;
      }

      document.documentElement.dataset.stageDirection = direction;
      setTransitioning(true);

      const animateFallback = (commitChange = true) => {
        if (commitChange) apply();
        if (request !== version.current || settledVersion.current === request)
          return;
        const content =
          viewportRef.current?.querySelector<HTMLElement>(".stage-mount");
        if (!content || typeof content.animate !== "function") {
          finish();
          return;
        }
        const offset = direction === "forward" ? 48 : -48;
        const animation = content.animate(
          [
            { opacity: 0, transform: `translateX(${offset}px)` },
            { opacity: 1, transform: "translateX(0)" },
          ],
          { duration: 440, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" },
        );
        fallback.current = animation;
        void animation.finished.then(finish, finish);
      };

      if (typeof document.startViewTransition !== "function") {
        animateFallback();
        return;
      }

      try {
        const transition = document.startViewTransition(apply);
        active.current = transition;
        let captureFailed = false;
        // Some embedded browsers expose this API but cannot capture snapshots.
        // Animate the committed content when capture fails, unless cancelled.
        void transition.ready.catch(() => {
          if (
            request !== version.current ||
            settledVersion.current === request ||
            document.hidden
          )
            return;
          captureFailed = true;
          void transition.updateCallbackDone.then(
            () => animateFallback(false),
            finish,
          );
        });
        void transition.updateCallbackDone.catch(finish);
        const nativeFinished = () => {
          if (!captureFailed) finish();
        };
        void transition.finished.then(nativeFinished, nativeFinished);
      } catch {
        animateFallback();
      }
    },
    [viewportRef],
  );

  const settle = useCallback(() => {
    settledVersion.current = version.current;
    active.current?.skipTransition();
    fallback.current?.cancel();
    fallback.current = null;
    setTransitioning(false);
  }, []);

  useEffect(() => {
    const visibility = () => {
      if (document.hidden) settle();
    };
    addEventListener("resize", settle);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      ++version.current;
      active.current?.skipTransition();
      fallback.current?.cancel();
      delete document.documentElement.dataset.stageDirection;
      removeEventListener("resize", settle);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [settle]);

  return { run, transitioning, settle };
}
