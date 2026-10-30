import { useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import { isMotionVisible, reveal } from "./motion";

// Keep the panel and its focus in place while only its changing parts enter.
export function useContentMotion(ref: RefObject<HTMLElement | null>, value: string | number, selector: string) {
  const previous = useRef(value);
  useLayoutEffect(() => {
    if (previous.current === value) return;
    const direction = typeof value === "number" && typeof previous.current === "number" && value < previous.current ? -1 : 1;
    previous.current = value;
    const offset = ref.current?.closest('[data-keyboard="true"]') ? 0 : direction * 8;
    const animations = Array.from(ref.current?.querySelectorAll<HTMLElement>(selector) || [])
      .filter(isMotionVisible)
      .map((element, index) => reveal(element, { x: offset, y: 0, delay: index * 20 }))
      .filter((animation): animation is Animation => animation !== null);
    if (!animations.length) return;
    const stop = () => animations.forEach((animation) => animation.cancel());
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    window.addEventListener("resize", stop);
    return () => {
      stop();
      preference.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
      window.removeEventListener("resize", stop);
    };
  }, [ref, value, selector]);
}
