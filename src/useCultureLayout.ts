import { useLayoutEffect } from "react";
import type { RefObject } from "react";

export function useCultureLayout(
  ref: RefObject<HTMLDivElement | null>,
  pillar: number | null,
  detail: boolean,
  tip: number,
) {
  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    const column = grid.querySelector(".culture-column.is-open");
    const heading = column?.querySelector<HTMLElement>(
      ".culture-column-heading",
    );
    const panel = column?.querySelector<HTMLElement>(".culture-panel");
    const update = () => {
      const style = getComputedStyle(grid);
      if (!heading || !panel || style.display !== "grid") {
        grid.style.removeProperty("--culture-content-height");
        return;
      }
      const rails = parseFloat(style.getPropertyValue("--culture-rail")) * 2;
      const height = `${Math.ceil(heading.getBoundingClientRect().height + panel.getBoundingClientRect().height + rails + 2)}px`;
      if (grid.style.getPropertyValue("--culture-content-height") !== height)
        grid.style.setProperty("--culture-content-height", height);
    };
    update();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(grid);
    if (heading) observer.observe(heading);
    if (panel) observer.observe(panel);
    return () => observer.disconnect();
  }, [ref, pillar, detail, tip]);
}
