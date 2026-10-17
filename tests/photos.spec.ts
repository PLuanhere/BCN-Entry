import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

async function settlePhotos(page: Page) {
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.effect?.getComputedTiming().iterations !== Infinity,
        )
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
}

test("training C previews real photos and opens the selected image without changing the learning paths", async ({
  page,
}, info) => {
  await page.goto("/#/workspace");
  await page.getByRole("tab", { name: "Learning", exact: true }).click();
  await page
    .getByRole("button", { name: "Training C cho khóa mới", exact: true })
    .click();
  const preview = page.locator(".workspace-photo");
  await expect(preview.locator(".photo-frame img")).toHaveAttribute(
    "src",
    /BCN_Train02/,
  );
  await preview
    .getByRole("button", { name: "Ảnh tiếp theo", exact: true })
    .click();
  await expect(preview.locator(".photo-frame img")).toHaveAttribute(
    "src",
    /BCN_Train05/,
  );
  await preview
    .getByRole("button", { name: "Xem lớn bộ ảnh training C" })
    .click();
  const reader = page.locator(".photo-dialog");
  await expect(reader).toBeVisible();
  await expect(reader.locator(".photo-frame img")).toHaveAttribute(
    "src",
    /BCN_Train05/,
  );
  await expect(reader.locator(".photo-thumbnails button")).toHaveCount(7);
  for (let index = 0; index < 7; index++) {
    await reader.locator(".photo-thumbnails button").nth(index).click();
    await expect
      .poll(() =>
        reader
          .locator(".photo-frame img")
          .evaluate((el) => (el as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  }
  await page.keyboard.press("Escape");
  await expect(
    preview.getByRole("button", { name: "Xem lớn bộ ảnh training C" }),
  ).toBeFocused();
  await preview
    .getByRole("button", { name: "Xem lớn bộ ảnh training C" })
    .click();
  await expect(reader.locator(".photo-frame img")).toHaveAttribute(
    "src",
    /BCN_Train05/,
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Product Basic", exact: true })
    .click();
  await expect(page.locator(".foundation-machine")).toBeVisible();
  await page.getByRole("button", { name: "OOP Java", exact: true }).click();
  await expect(page.locator(".workspace-focus")).toContainText(
    "hướng đối tượng",
  );
  await page
    .getByRole("button", { name: "Training C cho khóa mới", exact: true })
    .click();
  await settlePhotos(page);
  await page.screenshot({
    path: `test-results/photos/${info.project.name}-training.png`,
  });
});

test("activities groups the event poster and lantern products in the Mid Autumn album", async ({
  page,
}, info) => {
  await page.goto("/#/culture");
  await expect(page.locator(".culture-album-link")).toHaveCount(0);
  await page.goto("/#/activities");
  const preview = page.locator(".activities-media .photo-story-preview");
  await expect(preview.locator(".photo-count")).toHaveText("01 / 04");
  await preview
    .getByRole("button", { name: "Ảnh tiếp theo", exact: true })
    .click();
  await expect(preview.locator(".photo-count")).toHaveText("02 / 04");
  const trigger = page.getByRole("button", {
    name: "Xem lớn bộ ảnh Trung Thu",
  });
  await trigger.click();
  const reader = page.locator(".photo-dialog");
  await expect(reader.locator(".photo-frame img")).toHaveAttribute(
    "src",
    /BCN_TrungThu_Product01/,
  );
  await expect(reader).toContainText("Khéo tay dựng đèn");
  await expect(reader.locator(".photo-thumbnails button")).toHaveCount(4);
  for (let index = 0; index < 4; index++) {
    await reader.locator(".photo-thumbnails button").nth(index).click();
    await expect
      .poll(() =>
        reader
          .locator(".photo-frame img")
          .evaluate((el) => (el as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    await expect(reader.locator(".photo-frame img")).toHaveCSS(
      "object-fit",
      "contain",
    );
  }
  await settlePhotos(page);
  await page.screenshot({
    path: `test-results/photos/${info.project.name}-midautumn.png`,
  });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  expect(
    await page
      .getByRole("main")
      .evaluate((el) => el.scrollHeight - el.clientHeight),
  ).toBe(0);
});

test("commit displays recruitment artwork without an expand action and keeps the registration placeholder", async ({
  page,
}, info) => {
  await page.goto("/#/commit");
  const gallery = page.locator(".commit-gallery");
  await expect(gallery).toBeVisible();
  await expect(gallery.locator("img")).toHaveAttribute(
    "src",
    /BCN_TuyenCTV_2026/,
  );
  const original = await gallery.boundingBox();
  await gallery.getByRole("button", { name: "2025", exact: true }).click();
  await expect(gallery.locator("img")).toHaveAttribute(
    "src",
    /BCN_TuyenCTV_2025/,
  );
  expect(await gallery.boundingBox()).toEqual(original);
  await expect(gallery.getByRole("button", { name: /Xem lớn/i })).toHaveCount(
    0,
  );
  await expect(gallery).not.toContainText("XEM LỚN");
  await expect
    .poll(() =>
      gallery
        .locator("img")
        .evaluate((el) => (el as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await gallery.locator("img").click();
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await gallery.getByRole("button", { name: "2026", exact: true }).click();
  await settlePhotos(page);
  await page.screenshot({
    path: `test-results/photos/${info.project.name}-commit.png`,
  });
  await page.getByRole("button", { name: /ĐĂNG KÝ THAM GIA/ }).click();
  const registration = page.locator(".dialog-registration");
  await expect(registration).toContainText("Link đăng ký sẽ được cập nhật");
  await expect(registration.locator(".recruitment-album-link")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(registration).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: /ĐĂNG KÝ THAM GIA/ }),
  ).toBeFocused();
});
