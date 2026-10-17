import { test as base, expect } from "@playwright/test";
const test = base.extend<{ errors: undefined }>({
  errors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await use(undefined);
      expect(errors).toEqual([]);
    },
    { auto: true },
  ],
});

test("tabs visibly animate content and graphics, and remain usable while moving", async ({
  page,
}, info) => {
  await page.goto("/#/workspace");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: ".workspace-scene{animation-duration:1s!important}",
  });
  await page.getByRole("tab", { name: "Projects", exact: true }).click();
  const scene = page.locator(".workspace-scene");
  await expect
    .poll(() =>
      scene.evaluate(
        (el) =>
          el
            .getAnimations()
            .filter(
              (x) =>
                x instanceof CSSAnimation &&
                x.animationName === "workspace-reveal",
            ).length,
      ),
    )
    .toBe(1);
  const frame = await scene.evaluate((el) => {
    const animation = el
      .getAnimations()
      .find(
        (x) =>
          x instanceof CSSAnimation && x.animationName === "workspace-reveal",
      )!;
    animation.pause();
    animation.currentTime = 200;
    return {
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform,
    };
  });
  expect(Number(frame.opacity)).toBeLessThan(1);
  expect(frame.transform).not.toBe("none");
  await page.screenshot({
    path: `test-results/workspace/${info.project.name}-midway.png`,
    animations: "allow",
  });
  await page.getByRole("tab", { name: "Product Labs", exact: true }).click();
  await expect(page.locator(".labs-machine")).toBeVisible();
  await page.getByRole("tab", { name: "Learning", exact: true }).click();
  await page
    .getByRole("button", { name: "02 / Nâng cao", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Fullstack Mobile", exact: true })
    .click();
  await expect(page.locator(".track-detail")).toContainText("React Native");
  await expect
    .poll(() =>
      page
        .locator(".workspace-focus")
        .evaluate(
          (el) =>
            el
              .getAnimations()
              .filter(
                (x) =>
                  x instanceof CSSAnimation &&
                  x.animationName === "workspace-focus-in",
              ).length,
        ),
    )
    .toBe(1);
  const icons = page.locator(".workspace-visual img");
  for (const icon of await icons.all())
    await expect
      .poll(() => icon.evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
  await page.evaluate(() => {
    for (const animation of document.getAnimations())
      if (animation.effect?.getComputedTiming().iterations !== Infinity)
        animation.finish();
  });
  await page.screenshot({
    path: `test-results/workspace/${info.project.name}-learning.png`,
    animations: "disabled",
  });
});

test("tabs support keyboard selection and every shortened item keeps its full source", async ({
  page,
}) => {
  await page.goto("/#/workspace");
  const tabs = page.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("button", { name: "Dự án nhóm từ năm 2", exact: true })
    .click();
  await expect(page.locator(".workspace-focus .body-copy")).not.toContainText(
    "50 người dùng",
  );
  await page.getByRole("button", { name: /ĐỌC CHI TIẾT/ }).click();
  await expect(page.getByRole("dialog")).toContainText("50 người dùng");
  await expect(page.getByRole("dialog")).toContainText(
    "không phải thành tích đã đạt",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: /ĐỌC CHI TIẾT/ }),
  ).toBeFocused();
  await tabs.nth(1).focus();
  await page.keyboard.press("End");
  await expect(tabs.last()).toBeFocused();
  await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(tabs.first()).toBeFocused();
});

test("workspace effects run without an ON/OFF switch and continue through OS preference changes", async ({
  page,
}) => {
  await page.goto("/#/workspace");
  await page.getByRole("tab", { name: "Projects", exact: true }).click();
  await expect(page.locator(".browser-block")).toHaveCSS(
    "animation-name",
    "workspace-block",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".browser-block")).toHaveCSS(
    "animation-name",
    "workspace-block",
  );
  await expect(
    page.getByRole("button", { name: /^(Bật|Tắt) chuyển động$/ }),
  ).toHaveCount(0);
});
