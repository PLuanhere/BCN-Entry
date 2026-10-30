import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { stages } from "./content";
import { studyTracks } from "./bcnInfo";
import { useStageTransition } from "./useStageTransition";

export type Choices = {
  identity: number;
  folder: number;
  profile: number | null;
  activity: number;
};
const defaults: Choices = {
  identity: 0,
  folder: 0,
  profile: null,
  activity: 0,
};
const key = "bcn-os-v1";
function restore(): Choices {
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) || "null");
    const valid = (n: unknown, max: number) =>
      typeof n === "number" && Number.isInteger(n) && n >= 0 && n < max;
    return saved && typeof saved === "object"
      ? {
          identity: valid(saved.identity, 3) ? saved.identity : 0,
          folder: valid(saved.folder, studyTracks.length) ? saved.folder : 0,
          profile: valid(saved.profile, 3) ? saved.profile : null,
          activity: valid(saved.activity, 3) ? saved.activity : 0,
        }
      : defaults;
  } catch {
    return defaults;
  }
}
const route = () => {
  const aliases: Record<string, string> = { boot: "identity", sync: "culture", about: "identity", learning: "workspace", life: "activities", fit: "culture", join: "commit" };
  const requested = location.hash.replace(/^#\/?/, "");
  return Math.max(0, stages.findIndex((item) => item.id === (aliases[requested] ?? requested)));
};

const progressKey = "bcn-journey-progress-v1";
function startJourney() {
  let furthest = -1;
  try {
    const saved = localStorage.getItem(progressKey);
    const value = saved === null ? -1 : Number(saved);
    if (Number.isInteger(value) && value >= 0 && value < stages.length) furthest = value;
  } catch { /* Navigation still works when browser storage is unavailable. */ }
  const stage = Math.min(route(), furthest + 1);
  return { stage, furthest: Math.max(furthest, stage) };
}

export function useJourney(entranceBlocked = false) {
  const [{ stage, furthest }, setJourney] = useState(startJourney);
  const [choices, setChoices] = useState(restore);
  const mainRef = useRef<HTMLElement>(null);
  const { run, transitioning, settle } = useStageTransition(mainRef, entranceBlocked);
  const current = useRef(stage);
  const reached = useRef(furthest);
  const navigated = useRef(false);
  function go(requested: number, push = true) {
    if (!Number.isInteger(requested) || requested < 0 || requested >= stages.length) return;
    // Revisit any opened section, but introduce unseen sections one at a time.
    // Apply this to links, keyboard, history and direct URL changes alike.
    const next = Math.min(requested, reached.current + 1);
    const canonical = `#/${stages[next].id}`;
    if (next === current.current) {
      if (location.hash !== canonical) history.replaceState(null, "", canonical);
      return;
    }
    const direction = next > current.current ? "forward" : "backward";
    current.current = next;
    reached.current = Math.max(reached.current, next);
    if (push) history.pushState(null, "", canonical);
    else if (location.hash !== canonical) history.replaceState(null, "", canonical);
    run(() => {
      navigated.current = true;
      setJourney({ stage: next, furthest: reached.current });
    }, direction);
  }
  function move(delta: number) {
    go(Math.max(0, Math.min(stages.length - 1, current.current + delta)));
  }
  function choose<K extends keyof Choices>(field: K, value: Choices[K]) {
    setChoices((previous) => ({ ...previous, [field]: value }));
  }
  useEffect(() => {
    const canonical = `#/${stages[current.current].id}`;
    history.replaceState(location.hash === canonical ? history.state : null, "", canonical);
    try {
      sessionStorage.setItem(key, JSON.stringify(choices));
    } catch {
      /* Storage is optional. */
    }
  }, [choices]);
  useEffect(() => {
    try { localStorage.setItem(progressKey, String(furthest)); } catch { /* Optional progress memory. */ }
  }, [furthest]);
  useEffect(() => {
    const sync = () => {
      go(route(), false);
    };
    addEventListener("hashchange", sync);
    addEventListener("popstate", sync);
    const keyboard = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.repeat ||
        document.getElementById("entry-loader") ||
        document.querySelector("dialog[open]")
      )
        return;
      if (
        (event.target as HTMLElement).closest(
          "button,a,input,select,textarea,summary,[role=tablist]",
        )
      )
        return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(current.current + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(current.current - 1);
      }
    };
    addEventListener("keydown", keyboard);
    return () => {
      removeEventListener("hashchange", sync);
      removeEventListener("popstate", sync);
      removeEventListener("keydown", keyboard);
    };
  }, []);
  useLayoutEffect(() => {
    document.title = `${stages[stage].label} / Ban Công Nghệ`;
    if (navigated.current) {
      mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
      mainRef.current?.focus({ preventScroll: true });
      navigated.current = false;
    }
  }, [stage]);
  return { stage, furthest, maxStage: Math.min(furthest + 1, stages.length - 1), choices, choose, go, move, mainRef, transitioning, settle };
}
