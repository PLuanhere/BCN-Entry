import { test, expect } from "@playwright/test";

test("sync uses a light animated background and keeps all choices inside the viewport", async ({
  page,
}, info) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/sync");
  await page.evaluate(() => document.fonts.ready);
  const background = page.locator(".sync-background");
  await expect(background).toHaveAttribute("aria-hidden", "true");
  await expect(background).toHaveCSS("pointer-events", "none");
  await expect(page.locator(".sync-stage")).toHaveCSS(
    "background-color",
    "rgb(244, 243, 239)",
  );
  const signal = page.locator(".sync-routing-lines");
  const before = await signal.evaluate(
    (el) => getComputedStyle(el).strokeDashoffset,
  );
  await page.waitForTimeout(160);
  expect(
    await signal.evaluate((el) => getComputedStyle(el).strokeDashoffset),
  ).not.toBe(before);
  for (const [width, height] of [
    [1440, 900],
    [1280, 720],
    [360, 640],
    [390, 844],
    [320, 740],
    [768, 844],
    [844, 390],
    [1366, 640],
    [1024, 600],
    [375, 667],
    [360, 568],
    [320, 568],
    [667, 375],
  ]) {
    await page.setViewportSize({ width, height });
    const overflow = await page.getByRole("main").evaluate((el) => ({
      x: el.scrollWidth - el.clientWidth,
      y: el.scrollHeight - el.clientHeight,
    }));
    expect.soft(overflow, `${width}x${height}`).toEqual({ x: 0, y: 0 });
    for (const button of await page.locator(".quiz-options button").all())
      await expect(button).toBeInViewport();
    await expect(
      page.getByRole("button", { name: /XEM CAM KẾT/ }),
    ).toBeInViewport();
    if ([1440, 390, 320, 667].includes(width))
      await page.screenshot({
        path: `test-results/sync/${info.project.name}-${width}x${height}.png`,
      });
  }
  await page.locator(".quiz-options button").first().click();
  await expect(page).toHaveURL(/#\/commit$/);
  await expect(page.locator(".commit-content")).toContainText(
    "BUILDER_MINDSET",
  );
});
