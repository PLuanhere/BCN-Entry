import { test, expect } from "@playwright/test";

test("commit keeps artwork and the invitation in view for every profile and screen size", async ({
  page,
}, info) => {
  test.setTimeout(90000);
  const viewports = [
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
  ];
  await page.goto("/#/commit");
  await page.evaluate(() => document.fonts.ready);
  for (let profile = -1; profile < 3; profile++) {
    if (profile >= 0) {
      await page.goto("/#/sync");
      await page.locator(".quiz-options button").nth(profile).click();
      await expect(page.getByRole("main")).toHaveAttribute(
        "data-transitioning",
        "false",
      );
    }
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      const overflow = await page
        .getByRole("main")
        .evaluate((el) => ({
          x: el.scrollWidth - el.clientWidth,
          y: el.scrollHeight - el.clientHeight,
        }));
      expect
        .soft(overflow, `${width}x${height}, profile ${profile}`)
        .toEqual({ x: 0, y: 0 });
      await expect(
        page.getByRole("button", { name: /ĐĂNG KÝ THAM GIA/ }),
      ).toBeInViewport();
      await expect(page.locator(".commit-poster")).toBeInViewport();
      if (profile === -1 && [1440, 390, 320, 667].includes(width))
        await page.screenshot({
          path: `test-results/commit/${info.project.name}-${width}x${height}.png`,
        });
    }
  }
});
