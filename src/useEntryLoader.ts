import { useLayoutEffect, useState } from "react";
import type { RefObject } from "react";
import { readDialogEntry } from "./dialogHistory";
import { isMotionVisible } from "./motion";

const assembly = [
  { part: "body", at: 0, duration: 0, text: "Đang lắp ráp robot BCN" },
  { part: "head", at: 250, duration: 550, text: "Đang lắp đầu" },
  { part: "left-arm", at: 900, duration: 400, text: "Đang lắp hai tay" },
  { part: "right-arm", at: 1300, duration: 400, text: "Đang lắp hai tay" },
  { part: "legs", at: 1800, duration: 450, text: "Đang lắp chân" },
  { part: "power", at: 2350, duration: 300, text: "Đang khởi động robot" },
  { part: "hello", at: 2750, duration: 250, text: "Hello World" },
] as const;

export function useEntryLoader(appRef: RefObject<HTMLDivElement | null>) {
  // Restoring a dialog with Back/Forward or reload should restore that task
  // directly. Hash navigation never creates another loading screen.
  const [entering, setEntering] = useState(() => !!document.getElementById("entry-loader") && !readDialogEntry());
  useLayoutEffect(() => {
    const loader = document.getElementById("entry-loader");
    if (!entering) { loader?.remove(); return; }
    if (!loader) { setEntering(false); return; }
    let cancelled = false;
    let ready = false;
    let elapsed = 0;
    let previous = 0;
    let frame = 0;
    let exitStarted: number | undefined;
    let exitDuration = 320;
    let safety = 0;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const speed = preference.matches ? .35 : 1;
    // A single timeline drives assembly, lighting, greeting and status copy.
    for (const {part, at, duration} of assembly) {
      loader.style.setProperty(`--entry-${part}-at`, `${at * speed}ms`);
      loader.style.setProperty(`--entry-${part}-duration`, `${duration * speed}ms`);
    }
    loader.style.setProperty("--entry-wave-at", `${2800 * speed}ms`);
    loader.style.setProperty("--entry-wave-duration", `${650 * speed}ms`);
    loader.style.setProperty("--entry-light-gap", `${90 * speed}ms`);
    loader.dataset.phase = "waiting";
    loader.dataset.step = "body";
    const status = loader.querySelector("[data-entry-status]");
    if (status) status.textContent = assembly[0].text;
    const complete = () => {
      if (cancelled) return;
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(safety);
      loader.remove();
      // Release native keyboard navigation in the same event as a Tab press.
      if (appRef.current) appRef.current.inert = false;
      setEntering(false);
    };
    const leave = () => {
      if (exitStarted !== undefined) return;
      exitStarted = elapsed;
      exitDuration = preference.matches ? 140 : 320;
      loader.dataset.phase = "leaving";
    };
    const tick = (now: number) => {
      frame = 0;
      if (cancelled || document.hidden) return;
      if (loader.dataset.phase === "waiting") loader.dataset.phase = "booting";
      elapsed += previous ? now - previous : 0;
      previous = now;
      if (exitStarted === undefined) {
        let step: typeof assembly[number] = assembly[0];
        for (const candidate of assembly) {
          if (elapsed >= candidate.at * speed) step = candidate;
        }
        if (loader.dataset.step !== step.part) {
          loader.dataset.step = step.part;
          if (status && status.textContent !== step.text) status.textContent = step.text;
        }
      }
      const minimum = 3550 * speed;
      const maximum = 4300 * speed;
      if (elapsed >= minimum && (ready || elapsed >= maximum)) leave();
      if (exitStarted !== undefined && elapsed - exitStarted >= exitDuration) { complete(); return; }
      frame = requestAnimationFrame(tick);
    };
    const visibility = () => {
      loader.dataset.paused = String(document.hidden);
      previous = 0;
      cancelAnimationFrame(frame);
      clearTimeout(safety);
      if (!document.hidden && !cancelled) {
        frame = requestAnimationFrame(tick);
        // A busy preview renderer must never strand the user on the intro.
        safety = window.setTimeout(() => { if (!document.hidden) complete(); }, preference.matches ? 2500 : 5500);
      }
    };
    const keyboard = (event: KeyboardEvent) => {
      if (!["Tab", "Enter", "Escape"].includes(event.key)) return;
      if (event.key !== "Tab") event.preventDefault();
      complete();
    };
    const motionPreference = () => {
      if (!preference.matches) return;
      loader.dataset.step = "hello";
      if (status) status.textContent = assembly[assembly.length - 1].text;
      leave();
    };
    const image = Array.from(appRef.current?.querySelectorAll<HTMLImageElement>(".stage img") ?? []).find(isMotionVisible);
    void Promise.allSettled([document.fonts.ready, image?.decode?.()]).then(() => {
      if (cancelled) return;
      ready = true;
      loader.dataset.resourcesReady = "true";
    });
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("keydown", keyboard);
    preference.addEventListener("change", motionPreference);
    visibility();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(safety);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("keydown", keyboard);
      preference.removeEventListener("change", motionPreference);
    };
  }, [appRef, entering]);
  return entering;
}
