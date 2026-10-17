import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { stages } from "./content";
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
          folder: valid(saved.folder, 5) ? saved.folder : 0,
          profile: valid(saved.profile, 3) ? saved.profile : null,
          activity: valid(saved.activity, 3) ? saved.activity : 0,
        }
      : defaults;
  } catch {
    return defaults;
  }
}
const route = () =>
  Math.max(
    0,
    stages.findIndex((item) => item.id === location.hash.replace(/^#\/?/, "")),
  );

export function useJourney() {
  const [stage, setStage] = useState(route);
  const [choices, setChoices] = useState(restore);
  const mainRef = useRef<HTMLElement>(null);
  const { run, transitioning, settle } = useStageTransition(mainRef);
  const current = useRef(stage);
  const navigated = useRef(false);
  function go(next: number, push = true) {
    if (next < 0 || next >= stages.length || next === current.current) return;
    const direction = next > current.current ? "forward" : "backward";
    current.current = next;
    if (push) history.pushState(null, "", `#/${stages[next].id}`);
    run(() => {
      navigated.current = true;
      setStage(next);
    }, direction);
  }
  function move(delta: number) {
    go(Math.max(0, Math.min(stages.length - 1, current.current + delta)));
  }
  function choose<K extends keyof Choices>(field: K, value: Choices[K]) {
    setChoices((previous) => ({ ...previous, [field]: value }));
  }
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(choices));
    } catch {
      /* Storage is optional. */
    }
  }, [choices]);
  useEffect(() => {
    const sync = () => go(route(), false);
    addEventListener("hashchange", sync);
    addEventListener("popstate", sync);
    const keyboard = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
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
    document.title = `${stages[stage].label} / BCN.OS`;
    if (navigated.current) {
      mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
      mainRef.current?.focus({ preventScroll: true });
      navigated.current = false;
    }
  }, [stage]);
  return { stage, choices, choose, go, move, mainRef, transitioning, settle };
}
