import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

test("touch boot can be cancelled and completed without a swipe bypass", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await page.goto("/#/boot");
  await drag(page, ".boot-content", -150);
  await expect(page).toHaveURL(/#\/boot$/);
  const box = (await page.locator(".hold-button").boundingBox())!;
  const touchPoints = [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }];
  const client = await page.context().newCDPSession(page);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints,
  });
  await page.waitForTimeout(250);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.locator(".boot-percentage")).toHaveText("00%");
  await expect(page).toHaveURL(/#\/boot$/);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints,
  });
  await page.waitForTimeout(1250);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page).toHaveURL(/#\/identity$/);
  await client.detach();
});

async function drag(page: Page, selector: string, dx: number, dy = 0) {
  await expect(page.locator("main")).toHaveAttribute("aria-busy", "false");
  const box = (await page.locator(selector).first().boundingBox())!;
  const x = box.x + box.width * (dx < 0 ? 0.8 : 0.2);
  const y = box.y + box.height * (dy < 0 ? 0.8 : 0.5);
  const client = await page.context().newCDPSession(page);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  for (let i = 1; i <= 6; i++) {
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x + (dx * i) / 6, y: y + (dy * i) / 6 }],
    });
    await page.waitForTimeout(20);
  }
  await page.waitForTimeout(100);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await client.detach();
}

test("mobile navigation has separated touch targets and portrait culture titles remain horizontal", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  for (const [width, height] of [
    [320, 568],
    [360, 640],
    [390, 844],
    [430, 932],
    [667, 375],
    [844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/#/culture");
    await page.evaluate(() => document.fonts.ready);
    const targets = page.locator(".os-footer button,.docs-button,.step-badge");
    for (const target of await targets.all()) {
      const bounds = (await target.boundingBox())!;
      expect(bounds.height).toBeGreaterThanOrEqual(44);
      expect(bounds.width).toBeGreaterThanOrEqual(24);
      await expect(target).toBeInViewport({ ratio: 1 });
    }
    const footer = await page
      .locator(".os-footer button")
      .evaluateAll((buttons) =>
        buttons
          .map((button) => button.getBoundingClientRect().toJSON())
          .sort((a, b) => a.x - b.x),
      );
    for (let i = 1; i < footer.length; i++)
      expect(footer[i].x).toBeGreaterThanOrEqual(footer[i - 1].right - 0.5);
    if (height > width) {
      await expect(page.locator(".culture-toggle-title").first()).toHaveCSS(
        "writing-mode",
        "horizontal-tb",
      );
      if (
        (await page
          .locator(".culture-toggle")
          .nth(2)
          .getAttribute("aria-expanded")) !== "true"
      ) {
        await page.locator(".culture-toggle").nth(2).tap();
        expect(
          await page
            .locator(".culture-grid")
            .evaluate((el) =>
              el
                .getAnimations()
                .some((animation) => animation.playState === "running"),
            ),
        ).toBe(true);
      }
      await expect(page.locator(".culture-toggle").nth(2)).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      await expect(
        page.locator(".culture-column.is-open .culture-toggle-title"),
      ).toBeInViewport({ ratio: 1 });
      await page.waitForTimeout(750);
      await page.screenshot({
        path: `test-results/mobile/culture-${width}x${height}.png`,
      });
    }
    const overflow = await page.locator("main").evaluate((el) => ({
      x: el.scrollWidth - el.clientWidth,
      y: el.scrollHeight - el.clientHeight,
    }));
    expect(overflow, `${width}x${height}`).toEqual({ x: 0, y: 0 });
  }
});

test("real touch drags change photos and scroll tabs without navigating the journey", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await page.goto("/#/identity");
  await page.evaluate(() => document.fonts.ready);
  const index = () =>
    page
      .locator(".identity-carousel-pagination")
      .evaluate((el) =>
        [...el.children].findIndex((child) =>
          child.classList.contains("is-current"),
        ),
      );
  const before = await index();
  await drag(page, ".identity-blue", -190);
  await expect.poll(index).toBe((before + 1) % 4);
  await expect(page).toHaveURL(/#\/identity$/);
  await page.goto("/#/workspace");
  const photo = page.locator(".workspace-photo .photo-frame > img");
  const original = await photo.getAttribute("src");
  await drag(page, ".workspace-photo .photo-frame", -190);
  await expect(photo).not.toHaveAttribute("src", original!);
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await expect(page).toHaveURL(/#\/workspace$/);
  await drag(page, ".folder-navigation", -190);
  await expect
    .poll(() =>
      page.locator(".folder-navigation").evaluate((el) => el.scrollLeft),
    )
    .toBeGreaterThan(30);
  await expect(page).toHaveURL(/#\/workspace$/);
});

test("mobile dialogs keep their animation, independent scrolling and reachable close button", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile);
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/#/identity");
  await page.getByRole("button", { name: "Sứ mệnh", exact: true }).tap();
  await page.getByRole("button", { name: "[ DOCS ↗ ]", exact: true }).tap();
  const dialog = page.locator("dialog[open]");
  await expect(dialog).toHaveAttribute("data-motion", /opening|open/);
  await expect(dialog).toHaveAttribute("data-motion", "open");
  const close = dialog.locator(".dialog-header > button");
  expect((await close.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await expect(close).toBeInViewport({ ratio: 1 });
  await drag(page, "dialog[open] .dialog-scroll", 0, -200);
  await expect
    .poll(() => dialog.locator(".dialog-scroll").evaluate((el) => el.scrollTop))
    .toBeGreaterThan(20);
  await expect(close).toBeInViewport({ ratio: 1 });
  expect(await page.locator("main").evaluate((el) => el.scrollTop)).toBe(0);
  await close.tap();
  await expect(dialog).toHaveAttribute("data-motion", "closing");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
});
