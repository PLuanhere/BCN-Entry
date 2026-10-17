import { test, expect } from "@playwright/test";

test("culture photos and opening effects run automatically and content fits every viewport", async ({
  page,
}, info) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/culture");
  await page.evaluate(() => document.fonts.ready);
  const photos = page.locator(".culture-photo img");
  await expect(photos).toHaveCount(3);
  await expect
    .poll(() =>
      photos.evaluateAll((images) =>
        images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
      ),
    )
    .toBe(true);
  expect(
    new Set(
      await photos.evaluateAll((images) =>
        images.map((image) => image.getAttribute("src")),
      ),
    ).size,
  ).toBe(3);
  for (const scene of await page.locator(".culture-scene").all()) {
    await expect(scene).toHaveAttribute("aria-hidden", "true");
    await expect(scene).toHaveCSS("pointer-events", "none");
  }
  const before = await photos
    .first()
    .evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(() => photos.first().evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(before);
  await page.screenshot({
    path: `test-results/culture/${info.project.name}-photos-closed.png`,
  });
  for (let i = 0; i < 3; i++) {
    await page.locator(".culture-toggle").nth(i).click();
    const column = page.locator(".culture-column").nth(i);
    const trace = column.locator(".culture-trace path").first();
    await expect(trace).toHaveCSS("animation-name", "culture-trace-flow");
    const dash = await trace.evaluate(
      (el) => getComputedStyle(el).strokeDashoffset,
    );
    await expect
      .poll(() => trace.evaluate((el) => getComputedStyle(el).strokeDashoffset))
      .not.toBe(dash);
    await expect(column.locator(".culture-reading")).toHaveCSS(
      "animation-name",
      "culture-foreground-enter",
    );
    await expect(column.locator(".culture-scene-signal")).toHaveCSS(
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)",
    );
    await page.screenshot({
      path: `test-results/culture/${info.project.name}-photo-${i}.png`,
    });
  }
  // Freeze only after testing live motion, to check all content states deterministically.
  await page.addStyleTag({
    content:
      "*,*::before,*::after {animation:none!important;transition:none!important}",
  });
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
    // Return all columns to the same starting state before testing each size.
    await page.locator('.culture-toggle[aria-expanded="true"]').click();
    for (let i = 0; i < 3; i++) {
      await page.locator(".culture-toggle").nth(i).click();
      for (let detail = 0; detail < 2; detail++) {
        if (detail)
          await page
            .getByRole("button", { name: /TRONG CÁCH CHÚNG MÌNH LÀM/ })
            .click();
        const bounds = await page
          .locator(".culture-panel:visible")
          .evaluate((panel) => {
            const column = panel.closest(".culture-column")!;
            const main = panel.closest("main")!;
            return {
              x: main.scrollWidth - main.clientWidth,
              y: main.scrollHeight - main.clientHeight,
              clipped:
                panel.getBoundingClientRect().bottom >
                column.getBoundingClientRect().bottom + 1,
            };
          });
        expect
          .soft(bounds, `${width}x${height}, pillar ${i}, detail ${detail}`)
          .toEqual({ x: 0, y: 0, clipped: false });
      }
    }
  }
});

test("culture expands in the screen direction, supports rapid changes and collapses by keyboard", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#/culture");
  await page.evaluate(() => document.fonts.ready);
  const columns = page.locator(".culture-column");
  const toggles = page.locator(".culture-toggle");
  const initial = await columns.first().boundingBox();
  const dimension =
    page.viewportSize()!.width <= 767 &&
    page.viewportSize()!.height > page.viewportSize()!.width
      ? "height"
      : "width";
  const cross = dimension === "width" ? "height" : "width";
  for (let i = 0; i < 3; i++)
    expect(
      Math.abs((await columns.nth(i).boundingBox())!.width - initial!.width),
    ).toBeLessThan(2);
  await toggles.first().click();
  await expect(toggles.first()).toHaveAttribute("aria-expanded", "true");
  await expect
    .poll(async () => (await columns.first().boundingBox())![dimension])
    .toBeGreaterThan(initial![dimension] * 1.5);
  await expect(page.locator(".culture-panel:visible")).toHaveCount(1);
  const unchanged = (await columns.first().boundingBox())![cross];
  await page.screenshot({
    path: `test-results/culture/${info.project.name}-expanded.png`,
    animations: "disabled",
  });
  await page.evaluate(() => {
    const buttons =
      document.querySelectorAll<HTMLButtonElement>(".culture-toggle");
    for (const i of [2, 1, 0, 2]) buttons[i].click();
  });
  await expect(toggles.nth(2)).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".culture-panel:visible")).toHaveCount(1);
  await expect(page.locator(".culture-panel:visible")).toContainText(
    "Một tập thể tốt",
  );
  await expect
    .poll(async () => (await columns.nth(2).boundingBox())![dimension])
    .toBeGreaterThan(initial![dimension] * 1.5);
  expect((await columns.nth(2).boundingBox())![cross]).toBeCloseTo(
    unchanged,
    0,
  );
  await toggles.nth(2).focus();
  await page.keyboard.press("Enter");
  await expect(toggles.nth(2)).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".culture-panel:visible")).toHaveCount(0);
  await expect
    .poll(async () =>
      Math.abs(
        (await columns.first().boundingBox())![dimension] - initial![dimension],
      ),
    )
    .toBeLessThan(2);
  expect(errors).toEqual([]);
});

test("marquee moves continuously with identical copies at the loop boundary and can pause", async ({
  page,
}) => {
  await page.goto("/#/culture");
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator(".marquee-track");
  const groups = page.locator(".marquee-group");
  expect(await groups.nth(0).textContent()).toEqual(
    await groups.nth(1).textContent(),
  );
  const first = await track.evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(() => track.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(first);
  const geometry = await track.evaluate((el) => {
    const animation = el.getAnimations()[0];
    const duration = Number(animation.effect!.getTiming().duration);
    animation.pause();
    animation.currentTime = duration;
    const start = el.children[0].getBoundingClientRect();
    animation.currentTime = duration - 0.01;
    const end = el.children[1].getBoundingClientRect();
    animation.play();
    return {
      difference: Math.abs(start.x - end.x),
      firstWidth: start.width,
      secondWidth: end.width,
      trackWidth: el.getBoundingClientRect().width,
    };
  });
  expect(geometry.difference).toBeLessThan(1);
  expect(geometry.firstWidth).toBeCloseTo(geometry.secondWidth, 1);
  expect(geometry.trackWidth).toBeCloseTo(geometry.firstWidth * 2, 1);
  await page.getByRole("button", { name: "Tạm dừng dòng chữ văn hóa" }).click();
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.locator(".culture-toggle").nth(1).click();
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.getByRole("button", { name: "Tiếp tục dòng chữ văn hóa" }).click();
  await expect(track).toHaveCSS("animation-play-state", "running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(track).toHaveCSS("animation-name", "marquee");
});
