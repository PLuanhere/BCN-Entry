import { test, expect } from "@playwright/test";

test("identity tabs animate in an equal, stable layout", async ({
  page,
}, info) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 600 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/#/identity");
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() =>
        page
          .locator(".identity-backdrop")
          .nth(1)
          .evaluate((el) => (el as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    const tabs = page.locator(".identity-tabs button");
    await tabs.first().click();
    await page.evaluate(async () => {
      await Promise.all(
        document
          .querySelector(".identity-content")!
          .getAnimations({ subtree: true })
          .map((animation) => animation.finished),
      );
    });
    const geometry = () =>
      page.evaluate(() => {
        const rect = (selector: string) => {
          const { x, y, width, height } = document
            .querySelector(selector)!
            .getBoundingClientRect();
          return { x, y, width, height };
        };
        return {
          tabs: rect(".identity-tabs"),
          content: rect(".identity-content"),
        };
      });
    const original = await geometry();
    const widths = await tabs.evaluateAll((buttons) =>
      buttons.map((button) => button.getBoundingClientRect().width),
    );
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
    for (const index of [1, 2, 0, 2, 1]) {
      await tabs.nth(index).click();
      await expect(page.locator(".identity-panel.is-active")).toHaveCount(1);
      expect(
        await page
          .locator(".identity-panel.is-active")
          .evaluate((el) =>
            el
              .getAnimations()
              .some((animation) => animation.playState === "running"),
          ),
      ).toBe(true);
      expect(
        await geometry(),
        `${viewport.width}: layout during transition`,
      ).toEqual(original);
      await page.evaluate(async () => {
        await Promise.all(
          document
            .querySelector(".identity-content")!
            .getAnimations({ subtree: true })
            .map((animation) => animation.finished),
        );
      });
      expect(await geometry(), `${viewport.width}: settled layout`).toEqual(
        original,
      );
      const hidden = page.locator(".identity-panel:not(.is-active)");
      await expect(hidden).toHaveCount(2);
      expect(
        await hidden.evaluateAll((panels) =>
          panels.every(
            (panel) =>
              panel.hasAttribute("inert") &&
              panel.getAttribute("aria-hidden") === "true",
          ),
        ),
      ).toBe(true);
      expect(
        await page
          .getByRole("main")
          .evaluate((el) => el.scrollHeight - el.clientHeight),
      ).toBe(0);
    }
    await page.screenshot({
      path: `test-results/identity/${info.project.name}-${viewport.width}x${viewport.height}.png`,
    });
  }
});
