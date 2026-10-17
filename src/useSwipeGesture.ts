import { useRef } from "react";
import type { MouseEvent, TouchEvent } from "react";

type Options = {
  ignore?: string;
  edge?: number;
  distance?: number;
  stopPropagation?: boolean;
};

export function useSwipeGesture(
  onSwipe: (direction: number) => void,
  {
    ignore = "",
    edge = 0,
    distance = 48,
    stopPropagation = true,
  }: Options = {},
) {
  const start = useRef<{
    x: number;
    y: number;
    id: number;
    time: number;
  } | null>(null);
  const suppressClickUntil = useRef(0);
  return {
    onTouchStart(event: TouchEvent<HTMLElement>) {
      start.current = null;
      if (stopPropagation) event.stopPropagation();
      const point = event.changedTouches[0];
      if (
        !point ||
        event.touches.length > 1 ||
        (ignore && (event.target as Element).closest(ignore)) ||
        point.clientX < edge ||
        point.clientX > window.innerWidth - edge
      )
        return;
      start.current = {
        x: point.clientX,
        y: point.clientY,
        id: point.identifier,
        time: performance.now(),
      };
    },
    onTouchMove(event: TouchEvent<HTMLElement>) {
      if (event.touches.length > 1) start.current = null;
    },
    onTouchEnd(event: TouchEvent<HTMLElement>) {
      const origin = start.current;
      start.current = null;
      if (!origin) return;
      const point = Array.from(event.changedTouches).find(
        (item) => item.identifier === origin.id,
      );
      if (!point) return;
      const x = point.clientX - origin.x;
      const y = point.clientY - origin.y;
      if (
        performance.now() - origin.time > 850 ||
        Math.abs(x) < distance ||
        Math.abs(x) < Math.abs(y) * 1.6
      )
        return;
      if (stopPropagation) event.stopPropagation();
      suppressClickUntil.current = performance.now() + 350;
      onSwipe(x < 0 ? 1 : -1);
    },
    onTouchCancel() {
      start.current = null;
    },
    onClickCapture(event: MouseEvent<HTMLElement>) {
      if (performance.now() < suppressClickUntil.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
  };
}
