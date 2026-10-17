import { test as base, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { stages } from "../src/content";

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
const step = (page: Page, index: number) =>
  page
    .getByRole("navigation", { name: "Tiến trình hành trình" })
    .getByRole("button", { name: new RegExp(`^Bước ${index}:`) });
async function go(page: Page, index: number) {
  await step(page, index).click();
  await expect(step(page, index)).toHaveAttribute("aria-current", "step");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

test("hold-to-boot cancels cleanly and opens identity only after completion", async ({
  page,
}) => {
  await page.goto("/");
  const hold = page.getByRole("button", {
    name: "Giữ để khởi động",
    exact: true,
  });
  await hold.scrollIntoViewIfNeeded();
  const box = (await hold.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect
    .poll(() => page.locator(".boot-percentage").textContent())
    .not.toBe("00%");
  await page.mouse.up();
  await expect(page.locator(".boot-percentage")).toHaveText("00%");
  await expect(step(page, 1)).toHaveAttribute("aria-current", "step");
  await page.mouse.down();
  await expect(step(page, 2)).toHaveAttribute("aria-current", "step");
  await page.mouse.up();
  await expect(page.getByRole("main")).toBeFocused();
  await go(page, 1);
  await hold.focus();
  await page.keyboard.down("Enter");
  await expect(step(page, 2)).toHaveAttribute("aria-current", "step");
  await page.keyboard.up("Enter");
});

test("stage shortcuts, native history and keyboard navigation remain available", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Quay lại bước trước" }),
  ).toBeDisabled();
  await expect(page.locator(".next-button")).toHaveCount(0);
  await go(page, 2);
  await expect(step(page, 2)).toHaveAttribute("aria-current", "step");
  for (let i = 3; i <= stages.length; i++) {
    await page.getByRole("button", { name: "NEXT >", exact: true }).click();
    await expect(step(page, i)).toHaveAttribute("aria-current", "step");
  }
  await expect(page.locator(".commit-content")).toContainText("SYSTEM.READY");
  await page.goBack();
  await expect(step(page, 6)).toHaveAttribute("aria-current", "step");
  await page.goForward();
  await expect(step(page, 7)).toHaveAttribute("aria-current", "step");
  await go(page, 3);
  await page.getByRole("main").focus();
  await page.keyboard.press("ArrowRight");
  await expect(step(page, 4)).toHaveAttribute("aria-current", "step");
  await page.getByRole("link", { name: "Đến nội dung" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expect(step(page, 4)).toHaveAttribute("aria-current", "step");
});

test("identity opens only the selected topic in a structured reader", async ({
  page,
}) => {
  await page.goto("/#/identity");
  await page.getByRole("button", { name: "Sứ mệnh", exact: true }).click();
  await expect(page.locator(".identity-content")).toContainText("5 sứ mệnh");
  await page.getByRole("button", { name: "Tầm nhìn", exact: true }).click();
  await expect(page.locator(".identity-content")).toContainText(
    "sau khi ra trường",
  );
  await page.getByRole("button", { name: /ĐỌC TẦM NHÌN/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Cộng đồng dài hạn");
  await expect(dialog.locator(".doc-section")).toHaveCount(2);
  await expect(dialog).not.toContainText("Product Basic");
  await expect(dialog.getByRole("link")).toHaveCount(0);
  await expect(dialog.getByRole("button", { name: /Notion/ })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("culture interactions and commitments explain the actual working principles", async ({
  page,
}) => {
  await page.goto("/#/culture");
  await page.locator(".culture-toggle").first().click();
  await page.getByRole("button", { name: /TRONG CÁCH CHÚNG MÌNH LÀM/ }).click();
  await expect(page.locator(".culture-reading")).toContainText(
    "Không giấu điều chưa biết",
  );
  await page.getByRole("button", { name: "Tạm dừng dòng chữ văn hóa" }).click();
  await expect(page.locator(".marquee>div")).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await page.getByRole("button", { name: /BCN KỲ VỌNG GÌ Ở BẠN/ }).click();
  await expect(page.getByRole("dialog")).toContainText("hai giờ mỗi ngày");
  await expect(page.getByRole("dialog")).toContainText("thông báo sớm");
  await page.getByRole("button", { name: "Đóng cửa sổ" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("workspace exposes learning, projects, labs, a real workflow and growth paths", async ({
  page,
}) => {
  await page.goto("/#/workspace");
  await page
    .getByRole("button", { name: "02 / Nâng cao", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Fullstack Mobile", exact: true })
    .click();
  await expect(page.locator(".track-detail")).toContainText("React Native");
  await page.getByRole("button", { name: "NoCode", exact: true }).click();
  await expect(page.locator(".track-detail")).toContainText("Business Analyst");
  await page.getByRole("tab", { name: "Projects", exact: true }).click();
  await page
    .getByRole("button", { name: "Dự án nhóm từ năm 2", exact: true })
    .click();
  await page.getByRole("button", { name: /ĐỌC CHI TIẾT/ }).click();
  const project = page.getByRole("dialog");
  await expect(project).toContainText("50 người dùng");
  await expect(project).toContainText("không phải thành tích đã đạt");
  await page.keyboard.press("Escape");
  await page.getByRole("tab", { name: "Product Labs", exact: true }).click();
  await expect(
    page.getByRole("button", {
      name: "Trở thành người đồng hành",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("tab", { name: "Một ngày / một project", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Review & góp ý", exact: true })
    .click();
  await expect(page.locator(".workflow-detail")).toContainText("Điều gì tốt?");
  await page
    .getByRole("tab", { name: "Người BCN đi tiếp đâu?", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Người hướng dẫn", exact: true })
    .click();
  await page.getByRole("button", { name: /ĐỌC CHI TIẾT/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Người hướng dẫn");
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Người phát triển sản phẩm", exact: true })
    .click();
  await page.getByRole("button", { name: /ĐỌC CHI TIẾT/ }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Người phát triển sản phẩm",
  );
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(
    page.getByRole("tab", { name: "Người BCN đi tiếp đâu?", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
});

test("profile selection opens a personal invitation and survives back/reload", async ({
  page,
}) => {
  await page.goto("/#/sync");
  await page.getByRole("button", { name: /Trao đổi với mentor/ }).click();
  await expect(step(page, 7)).toHaveAttribute("aria-current", "step");
  await expect(page.locator(".commit-content")).toContainText("TEAM_CONNECTOR");
  await expect(page.locator(".commit-personal")).toContainText(
    "BẠN TÌM ĐỒNG ĐỘI",
  );
  await page.reload();
  await expect(page.locator(".commit-content")).toContainText("TEAM_CONNECTOR");
  await go(page, 6);
  await expect(
    page.getByRole("button", { name: /Trao đổi với mentor/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Phân tích & lên kế hoạch/ }).click();
  await expect(page.locator(".commit-content")).toContainText(
    "THOUGHTFUL_PLANNER",
  );
});

test("all seven questions navigate to their actual content and registration is an explicit placeholder", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Mở 7 câu hỏi về BCN" }).click();
  await expect(page.locator(".question-index>button")).toHaveCount(7);
  await page
    .getByRole("button", { name: /Những người đã tham gia BCN/ })
    .click();
  await expect(step(page, 4)).toHaveAttribute("aria-current", "step");
  await expect(page.locator(".folder-content")).toContainText(
    "CÁC HƯỚNG TRƯỞNG THÀNH",
  );
  await go(page, 7);
  await page.getByRole("button", { name: /LỘ TRÌNH GIA NHẬP DỰ KIẾN/ }).click();
  await expect(page.getByRole("dialog")).toContainText("trở thành CTV BCN");
  await expect(page.getByRole("dialog").locator(".doc-section")).toHaveCount(4);
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "ĐĂNG KÝ THAM GIA", exact: false })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Link đăng ký sẽ được cập nhật tại đây",
  );
  await expect(page.getByRole("dialog").getByRole("link")).toHaveCount(0);
  await expect(
    page
      .getByRole("dialog")
      .getByRole("button", { name: /XEM LỘ TRÌNH GIA NHẬP/ }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: /ĐĂNG KÝ THAM GIA/ }),
  ).toBeFocused();
});

test("compact scenes keep navigation visible and wheel gestures never switch stages", async ({
  page,
}, info) => {
  await page.goto("/");
  for (let i = 1; i <= stages.length; i++) {
    if (i > 1) await go(page, i);
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      )
      .toBeLessThanOrEqual(1);
    if (i > 1 && i < stages.length)
      await expect(page.locator(".next-button")).toBeInViewport();
    else await expect(page.locator(".next-button")).toHaveCount(0);
    await expect(page.locator(".os-header")).toBeInViewport();
    await page.screenshot({
      path: `test-results/visual/${info.project.name}-${i}.png`,
      animations: "disabled",
    });
  }
  for (const viewport of [
    { width: 320, height: 740 },
    { width: 768, height: 844 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    for (let i = 1; i <= stages.length; i++) {
      await go(page, i);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          ),
        )
        .toBeLessThanOrEqual(1);
      if (i > 1 && i < stages.length)
        await expect(page.locator(".next-button")).toBeInViewport();
      else await expect(page.locator(".next-button")).toHaveCount(0);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await go(page, 3);
  await page.locator(".culture-column").first().hover();
  await page.mouse.wheel(0, 600);
  await expect(step(page, 3)).toHaveAttribute("aria-current", "step");
  expect(await page.getByRole("main").evaluate((el) => el.scrollTop)).toBe(0);
  await page.getByRole("button", { name: /BCN KỲ VỌNG GÌ/ }).click();
  const reader = page.locator(".dialog-scroll:visible");
  await reader.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  expect(await reader.evaluate((el) => el.scrollTop)).toBeGreaterThan(50);
});

test("OS preferences and blocked browser storage do not block the animated journey", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    }),
  );
  await page.goto("/#/culture");
  await expect(page.locator(".app")).toHaveClass("app");
  await expect(page.locator(".marquee>div")).toHaveCSS(
    "animation-name",
    "marquee",
  );
  await go(page, 6);
  await page.getByRole("button", { name: /Tự tìm hiểu & làm bản thử/ }).click();
  await expect(page.locator(".commit-content")).toContainText(
    "BUILDER_MINDSET",
  );
});
