import { test as base, expect } from "@playwright/test";
const test = base.extend<{ errors: undefined }>({
  errors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await use(undefined);
      expect(errors).toEqual([]);
    },
    { auto: true },
  ],
});

test("animations start automatically on the real Windows setting and ignore a saved OFF value", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: null });
  await page.addInitScript(() => localStorage.setItem("bcn-motion-v1", "off"));
  await page.goto("/#/workspace");
  const nativeReduced = await page.evaluate(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  console.log(
    `Native prefers-reduced-motion: ${nativeReduced}; animations automatic`,
  );
  await page.getByRole("tab", { name: "Projects", exact: true }).click();
  await expect(page.locator(".browser-block")).toHaveCSS(
    "animation-name",
    "workspace-block",
  );
  await expect
    .poll(() =>
      page
        .locator(".browser-block")
        .evaluate(
          (el) =>
            el.getAnimations().filter((x) => x.playState === "running").length,
        ),
    )
    .toBeGreaterThan(0);
  await expect(
    page.getByRole("button", { name: /^(Bật|Tắt) chuyển động$/ }),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".browser-block")).toHaveCSS(
    "animation-name",
    "workspace-block",
  );
  await page.screenshot({
    path: `test-results/motion/${info.project.name}-automatic.png`,
    animations: "disabled",
  });
});

test("CSS, marquee, accordion and page transitions run automatically even with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/workspace");
  await page.getByRole("tab", { name: "Projects", exact: true }).click();
  await expect(page.locator(".browser-block")).toHaveCSS(
    "animation-name",
    "workspace-block",
  );
  await page.evaluate(() => {
    const native = document.startViewTransition.bind(document);
    document.startViewTransition = (callback) => {
      const transition = native(callback);
      void transition.ready.then(
        () => {
          (window as unknown as { motionPair: string[] }).motionPair = [
            "old",
            "new",
          ].map(
            (view) =>
              getComputedStyle(
                document.documentElement,
                `::view-transition-${view}(bcn-stage)`,
              ).animationName,
          );
        },
        () => {},
      );
      return transition;
    };
  });
  await page.getByRole("button", { name: /^Bước 3:/ }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { motionPair?: string[] }).motionPair,
      ),
    )
    .toEqual(["stage-leave", "stage-arrive"]);
  await expect(page.getByRole("main")).toHaveAttribute(
    "data-transitioning",
    "false",
  );
  await expect(page.locator(".marquee-track")).toHaveCSS(
    "animation-name",
    "marquee",
  );
  await page.locator(".culture-toggle").first().click();
  await expect
    .poll(() =>
      page
        .locator(".culture-column")
        .first()
        .evaluate(
          (el) =>
            el
              .getAnimations()
              .filter(
                (x) =>
                  x instanceof CSSTransition &&
                  x.transitionProperty === "flex-basis",
              ).length,
        ),
    )
    .toBe(1);
  await page.reload();
  await expect(page.locator(".marquee-track")).toHaveCSS(
    "animation-name",
    "marquee",
  );
});

test("storage being blocked and OS preference changes never stop the effects", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    }),
  );
  await page.goto("/#/workspace");
  await page.getByRole("tab", { name: "Projects", exact: true }).click();
  await expect(page.locator(".browser-block")).toHaveCSS(
    "animation-name",
    "workspace-block",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".browser-block")).toHaveCSS(
    "animation-name",
    "workspace-block",
  );
});
