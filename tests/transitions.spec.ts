import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const step = (page: Page, index: number) =>
  page
    .getByRole("navigation", { name: "Tiến trình hành trình" })
    .getByRole("button", { name: new RegExp(`^Bước ${index}:`) });
const idle = (page: Page) =>
  expect(page.getByRole("main")).toHaveAttribute("data-transitioning", "false");

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.exposeFunction("transitionErrors", () => errors);
});
test.afterEach(async ({ page }) => {
  expect(
    await page.evaluate(() =>
      (
        window as unknown as { transitionErrors: () => Promise<string[]> }
      ).transitionErrors(),
    ),
  ).toEqual([]);
});

test("forward/back transitions animate both views while the OS frame stays fixed", async ({
  page,
}, info) => {
  await page.goto("/#/identity");
  await page.evaluate(() => document.fonts.ready);
  const header = await page.locator(".os-header").boundingBox();
  const footer = await page.locator(".os-footer").boundingBox();
  await page.evaluate(() => {
    const native = document.startViewTransition.bind(document);
    let captureFirstFrame = true;
    document.startViewTransition = (callback) => {
      const transition = native(callback);
      void transition.ready.then(
        () => {
          const oldStyle = getComputedStyle(
            document.documentElement,
            "::view-transition-old(bcn-stage)",
          );
          const newStyle = getComputedStyle(
            document.documentElement,
            "::view-transition-new(bcn-stage)",
          );
          (window as unknown as { transitionPair: string[] }).transitionPair = [
            oldStyle.animationName,
            newStyle.animationName,
          ];
          if (captureFirstFrame) {
            captureFirstFrame = false;
            for (const animation of document.getAnimations()) {
              if (
                animation instanceof CSSAnimation &&
                ["stage-leave", "stage-arrive"].includes(
                  animation.animationName,
                )
              ) {
                animation.pause();
                animation.currentTime = 140;
              }
            }
          }
        },
        () => {},
      );
      return transition;
    };
  });
  await step(page, 3).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { transitionPair?: string[] }).transitionPair,
      ),
    )
    .toEqual(["stage-leave", "stage-arrive"]);
  expect(await page.locator(".os-header").boundingBox()).toEqual(header);
  expect(await page.locator(".os-footer").boundingBox()).toEqual(footer);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await page.screenshot({
    path: `test-results/transitions/${info.project.name}-midway.png`,
    animations: "allow",
  });
  // The snapshot is paused indefinitely: a real click must still reach the
  // footer and supersede it instead of waiting for an overlay to disappear.
  await step(page, 2).click();
  await idle(page);
  await expect(page.locator("html")).toHaveAttribute(
    "data-stage-direction",
    "backward",
  );
  await expect(page.getByRole("main")).toBeFocused();
  await step(page, 3).click();
  await idle(page);
  await expect(page.locator("html")).toHaveAttribute(
    "data-stage-direction",
    "forward",
  );
  await expect(page.locator(".stage-mount")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await page.screenshot({
    path: `test-results/transitions/${info.project.name}-settled.png`,
  });
  await step(page, 2).click();
  await idle(page);
  await expect(page.locator("html")).toHaveAttribute(
    "data-stage-direction",
    "backward",
  );
  await expect(page.getByRole("main")).toBeFocused();
});

test("rapid navigation commits only the latest request and leaves native history consistent", async ({
  page,
}) => {
  await page.goto("/#/identity");
  await page.evaluate(() => {
    const buttons =
      document.querySelectorAll<HTMLButtonElement>(".step-dots>button");
    for (const index of [2, 6, 1, 5, 3, 6, 2]) buttons[index].click();
  });
  await idle(page);
  await expect(step(page, 3)).toHaveAttribute("aria-current", "step");
  await expect(page).toHaveURL(/#\/culture$/);
  await expect(page.locator(".stage-mount")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "VĂN HÓA BCN",
  );
  await page.goBack();
  await idle(page);
  await expect(step(page, 7)).toHaveAttribute("aria-current", "step");
  await page.goForward();
  await idle(page);
  await expect(step(page, 3)).toHaveAttribute("aria-current", "step");
  await page.evaluate(() => {
    const next = document.querySelector<HTMLButtonElement>(".next-button")!;
    next.click();
    next.click();
    next.click();
    next.click();
  });
  await idle(page);
  await expect(step(page, 7)).toHaveAttribute("aria-current", "step");
  await expect(page).toHaveURL(/#\/commit$/);
});

test("overflow at enlarged text resets on navigation without moving the frame", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/culture");
  await page.locator(".culture-toggle").first().click();
  await page.addStyleTag({
    content:
      ".culture-reading { font-size: 36px } .culture-reading .body-copy { font-size: 36px; line-height: 2 }",
  });
  await page.getByRole("main").evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  await expect
    .poll(() => page.getByRole("main").evaluate((el) => el.scrollTop))
    .toBeGreaterThan(0);
  const header = await page.locator(".os-header").boundingBox();
  await step(page, 4).click();
  await idle(page);
  await expect
    .poll(() => page.getByRole("main").evaluate((el) => el.scrollTop))
    .toBe(0);
  expect(await page.locator(".os-header").boundingBox()).toEqual(header);
  await expect(page.getByRole("main")).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
});

test("resize during animation settles cleanly and the next transition still works", async ({
  page,
}) => {
  await page.goto("/#/identity");
  await step(page, 3).click();
  await page.setViewportSize({ width: 320, height: 740 });
  await idle(page);
  await expect(step(page, 3)).toHaveAttribute("aria-current", "step");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(1);
  await step(page, 4).click();
  await idle(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "BẠN SẼ LÀM GÌ Ở ĐÂY?",
  );
  await step(page, 5).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await idle(page);
  await expect(step(page, 5)).toHaveAttribute("aria-current", "step");
});

test("unsupported browsers use a cancellable fallback without leaving transforms behind", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(document, "startViewTransition", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.goto("/#/identity");
  await step(page, 3).click();
  await idle(page);
  await expect(step(page, 3)).toHaveAttribute("aria-current", "step");
  await expect(page.locator(".stage-mount")).toHaveCSS("transform", "none");
  await page.evaluate(() => {
    const buttons =
      document.querySelectorAll<HTMLButtonElement>(".step-dots>button");
    buttons[4].click();
    buttons[1].click();
    buttons[3].click();
  });
  await idle(page);
  await expect(step(page, 4)).toHaveAttribute("aria-current", "step");
  await expect(page.locator(".stage-mount")).toHaveCSS("transform", "none");
});

test("a browser that exposes View Transitions but rejects capture still animates the new screen", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const frames: string[] = [];
    (window as unknown as { fallbackFrames: string[] }).fallbackFrames = frames;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (keyframes, options) {
      if (this.classList.contains("stage-mount"))
        frames.push(JSON.stringify(keyframes));
      return animate.call(this, keyframes, options);
    };
    document.startViewTransition = ((update: () => void) => {
      const done = Promise.resolve().then(update);
      return {
        ready: Promise.reject(
          new DOMException("Capture unavailable", "InvalidStateError"),
        ),
        updateCallbackDone: done,
        finished: done,
        skipTransition() {},
      };
    }) as typeof document.startViewTransition;
  });
  await page.goto("/#/identity");
  await step(page, 4).click();
  await idle(page);
  expect(
    await page.evaluate(
      () => (window as unknown as { fallbackFrames: string[] }).fallbackFrames,
    ),
  ).toEqual([expect.stringContaining("translateX(48px)")]);
  await expect(step(page, 4)).toHaveAttribute("aria-current", "step");
  await expect(page.locator(".stage-mount")).toHaveCSS("transform", "none");
});

test("opening documents during a transition immediately clears the snapshot layer", async ({
  page,
}) => {
  await page.goto("/#/identity");
  await page.addStyleTag({
    content:
      "::view-transition-old(bcn-stage),::view-transition-new(bcn-stage){animation-duration:2s!important}",
  });
  await step(page, 3).click();
  await expect(page.getByRole("main")).toHaveAttribute(
    "data-transitioning",
    "true",
  );
  await page.getByRole("button", { name: "[ DOCS ↗ ]", exact: true }).click();
  await idle(page);
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (animation) =>
                animation instanceof CSSAnimation &&
                ["stage-arrive", "stage-leave"].includes(
                  animation.animationName,
                ),
            ).length,
      ),
    )
    .toBe(0);
  await page.getByRole("button", { name: "Đóng cửa sổ" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(step(page, 3)).toHaveAttribute("aria-current", "step");
});

test("stage transitions still run when the OS requests reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/identity");
  await page.evaluate(() => {
    (window as unknown as { transitionCount: number }).transitionCount = 0;
    const native = document.startViewTransition.bind(document);
    document.startViewTransition = (callback) => {
      (window as unknown as { transitionCount: number }).transitionCount++;
      return native(callback);
    };
  });
  await step(page, 3).click();
  await idle(page);
  await expect(step(page, 3)).toHaveAttribute("aria-current", "step");
  expect(
    await page.evaluate(
      () => (window as unknown as { transitionCount: number }).transitionCount,
    ),
  ).toBe(1);
  await expect(page.locator(".marquee-track")).toHaveCSS(
    "animation-name",
    "marquee",
  );
});

test("a touch swipe transitions once while vertical gestures preserve the scene", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Touch interaction is covered on the mobile project.");
  await page.goto("/#/identity");
  const swipe = async (x: number, y: number) =>
    page.getByRole("main").evaluate(
      (target, { x, y }) => {
        const point = (x: number, y: number) =>
          new Touch({ identifier: 1, target, clientX: x, clientY: y });
        target.dispatchEvent(
          new TouchEvent("touchstart", {
            bubbles: true,
            changedTouches: [point(320, 220)],
          }),
        );
        target.dispatchEvent(
          new TouchEvent("touchend", {
            bubbles: true,
            changedTouches: [point(x, y)],
          }),
        );
      },
      { x, y },
    );
  await swipe(315, 500);
  await expect(step(page, 2)).toHaveAttribute("aria-current", "step");
  await swipe(60, 225);
  await idle(page);
  await expect(step(page, 3)).toHaveAttribute("aria-current", "step");
});
