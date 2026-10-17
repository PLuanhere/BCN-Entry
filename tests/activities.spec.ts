import { test, expect } from "@playwright/test";

test("outside-code stage sits between workspace and sync and preserves the selected activity", async ({
  page,
}) => {
  await page.goto("/#/workspace");
  await page.getByRole("button", { name: "NEXT >", exact: true }).click();
  await expect(page).toHaveURL(/#\/activities$/);
  await expect(page.getByRole("main")).toHaveAttribute(
    "data-transitioning",
    "false",
  );
  await expect(page.locator(".step-badge")).toHaveText("STEP [05/07]");
  await expect(page.locator(".step-dots > button")).toHaveCount(7);
  await expect(
    page.locator(".activities-media .photo-story-preview"),
  ).toHaveCount(1);
  await expect(page.locator(".activity-placeholder")).toHaveCount(2);
  const tabs = page.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("End");
  await expect(tabs.last()).toBeFocused();
  await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".activity-copy-panel.is-active")).toContainText(
    "KHÉP MỘT NĂM",
  );
  await expect(
    page.getByRole("img", { name: "Vị trí ảnh Tết, sẽ được bổ sung" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "NEXT >", exact: true }).click();
  await expect(page).toHaveURL(/#\/sync$/);
  await expect(page.locator(".step-badge")).toHaveText("STEP [06/07]");
  await page.goBack();
  await expect(page).toHaveURL(/#\/activities$/);
  await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
  await page.reload();
  await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "NEXT >", exact: true }).click();
  await page.getByRole("button", { name: /Tự tìm hiểu & làm bản thử/ }).click();
  await expect(page).toHaveURL(/#\/commit$/);
  await expect(page.locator(".step-badge")).toHaveText("STEP [07/07]");
  await page.getByRole("button", { name: /CHỌN LẠI ĐIỂM CHUNG/ }).click();
  await expect(page).toHaveURL(/#\/sync$/);
});

test("activity tabs keep equal widths and steady content during animation", async ({
  page,
}, info) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 600 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
    { width: 667, height: 375 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/#/activities");
    await expect(page.getByRole("main")).toHaveAttribute(
      "data-transitioning",
      "false",
    );
    await page.evaluate(() => document.fonts.ready);
    const bounds = () => page.locator(".activity-copy-stack").boundingBox();
    const original = await bounds();
    const widths = await page
      .locator(".activity-tabs button")
      .evaluateAll((buttons) =>
        buttons.map((button) => button.getBoundingClientRect().width),
      );
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
    for (const label of ["Trung Thu", "NoCode", "Tết"]) {
      await page.getByRole("tab", { name: label, exact: true }).click();
      expect(await bounds()).toEqual(original);
      await expect(page.locator(".activity-copy-panel.is-active")).toHaveCount(
        1,
      );
      await expect(page.locator(".activity-media-panel.is-active")).toHaveCount(
        1,
      );
      await page.evaluate(async () => {
        await Promise.all(
          document
            .querySelector(".activities-stage")!
            .getAnimations({ subtree: true })
            .filter(
              (animation) =>
                animation.effect?.getComputedTiming().iterations !== Infinity,
            )
            .map((animation) => animation.finished.catch(() => {})),
        );
      });
      expect(await bounds()).toEqual(original);
      expect(
        await page
          .getByRole("main")
          .evaluate((el) => el.scrollHeight - el.clientHeight),
      ).toBe(0);
    }
    await page.screenshot({
      path: `test-results/activities/${info.project.name}-${viewport.width}x${viewport.height}.png`,
    });
  }
});
