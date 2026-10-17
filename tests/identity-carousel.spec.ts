import { test, expect } from "@playwright/test";

test("identity photos slide automatically, loop and keep foreground stable", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#/identity");
  await page.evaluate(() => document.fonts.ready);
  const track = page.locator(".identity-carousel-track");
  const count = page.locator(".identity-carousel-count");
  const title = page.locator("#stage-title");
  const original = await title.boundingBox();
  await expect
    .poll(() =>
      track
        .locator("img")
        .evaluateAll((images) =>
          images.every((image) => image.complete && image.naturalWidth > 0),
        ),
    )
    .toBe(true);
  await expect(count).toHaveText("01 / 04");
  await expect(count).toHaveText("02 / 04", { timeout: 7000 });
  const start = await track.evaluate(
    (el) => new DOMMatrix(getComputedStyle(el).transform).m41,
  );
  await page.waitForTimeout(220);
  const middle = await track.evaluate(
    (el) => new DOMMatrix(getComputedStyle(el).transform).m41,
  );
  expect(middle).toBeLessThan(start - 2);
  expect(await title.boundingBox()).toEqual(original);
  await expect(track).not.toHaveClass(/is-sliding/);

  const previous = page.getByRole("button", {
    name: "Ảnh BCN trước",
    exact: true,
  });
  const next = page.getByRole("button", {
    name: "Ảnh BCN tiếp theo",
    exact: true,
  });
  for (const [button, expected] of [
    [previous, "01 / 04"],
    [previous, "04 / 04"],
    [next, "01 / 04"],
  ] as const) {
    await button.click();
    await expect(count).toHaveText(expected);
    await expect(track).not.toHaveClass(/is-sliding/);
    expect(await title.boundingBox()).toEqual(original);
  }
  await page.screenshot({
    path: `test-results/identity-carousel/${info.project.name}-desktop.png`,
  });

  // The same background keeps animating in the compact photo strip on phones.
  await page.setViewportSize({ width: 320, height: 568 });
  await expect(count).toHaveText("02 / 04", { timeout: 7000 });
  await expect(track).not.toHaveClass(/is-sliding/);
  expect(
    await page
      .getByRole("main")
      .evaluate((el) => ({
        x: el.scrollWidth - el.clientWidth,
        y: el.scrollHeight - el.clientHeight,
      })),
  ).toEqual({ x: 0, y: 0 });
  await page.screenshot({
    path: `test-results/identity-carousel/${info.project.name}-mobile.png`,
  });
  await page.getByRole("button", { name: "Bước 3: Văn hóa", exact: true }).click();
  await expect(track).toHaveCount(0);
});
