import { test, expect } from "@playwright/test";

test("identity links and header docs show one topic without Notion or unrelated tabs", async ({
  page,
}, info) => {
  await page.goto("/#/identity");
  for (const [tab, button, topic, count] of [
    ["Chúng mình", "ĐỌC VỀ BCN", "purpose", 4],
    ["Sứ mệnh", "ĐỌC 5 SỨ MỆNH", "mission", 5],
    ["Tầm nhìn", "ĐỌC TẦM NHÌN", "vision", 2],
  ] as const) {
    await page.getByRole("button", { name: tab, exact: true }).click();
    await page.getByRole("button", { name: new RegExp(button) }).click();
    const dialog = page.locator(`.dialog-${topic}`);
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(".doc-section")).toHaveCount(count);
    await expect(dialog.locator(".doc-section li").first()).toBeVisible();
    await expect(dialog.getByRole("link")).toHaveCount(0);
    await expect(
      dialog.locator(".document-tabs, .source-document"),
    ).toHaveCount(0);
    await expect(dialog).not.toContainText("Notion");
    await expect(dialog).not.toContainText("Product Basic");
    if (topic === "purpose") {
      await expect(page.locator(".os-brand img")).toHaveAttribute(
        "src",
        /BCN_Logo\.jpg$/,
      );
      await expect(page.locator(".os-brand img")).toHaveCSS(
        "object-fit",
        "contain",
      );
      const logo = dialog.locator(".doc-brand-image img");
      await expect(logo).toHaveAttribute("src", /BCN_Logo\.jpg$/);
      await expect(logo).toHaveCSS("object-fit", "contain");
      const size = await logo.boundingBox();
      expect(Math.abs(size!.width - size!.height)).toBeLessThan(1);
    }
    if (topic === "mission") {
      await expect(dialog).toHaveAttribute("data-motion", "open");
      await page.screenshot({
        path: `test-results/documents/${info.project.name}-mission.png`,
      });
    }
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await page.getByRole("button", { name: "[ DOCS ↗ ]", exact: true }).click();
    await expect(dialog).toBeVisible();
    expect(
      await dialog.locator(".dialog-scroll").evaluate((el) => el.scrollTop),
    ).toBe(0);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  }
});

test("workspace documents follow the current folder and item details have no extra subjects", async ({
  page,
}) => {
  await page.goto("/#/workspace");
  for (const [index, topic, expected, excluded] of [
    [0, "learning", "Product Basic", "50 người dùng"],
    [1, "projects", "Dự án nhóm từ năm 2", "Mentorship — Đồng hành"],
    [2, "labs", "Năng lực & thái độ", "Dự án NoCode"],
    [3, "workflow", "Hiểu & chia việc", "Product Basic"],
    [4, "growth", "Người đang học", "Kỷ luật và cam kết"],
  ] as const) {
    await page.locator(".workspace-tabs button").nth(index).click();
    await page.getByRole("button", { name: "[ DOCS ↗ ]", exact: true }).click();
    const dialog = page.locator(`.dialog-${topic}`);
    await expect(dialog).toContainText(expected);
    await expect(dialog).not.toContainText(excluded);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await page.getByRole("button", { name: "[ DOCS ↗ ]", exact: true }).click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  }
  await page.locator(".workspace-tabs button").first().click();
  await page.getByRole("button", { name: "OOP Java", exact: true }).click();
  await page.getByRole("button", { name: /ĐỌC CHI TIẾT/ }).click();
  const detail = page.locator(".workspace-detail-dialog");
  await expect(detail.getByRole("heading", { level: 2 })).toHaveText(
    "OOP Java",
  );
  await expect(detail).not.toContainText("Kotlin");
  await expect(detail).not.toContainText("Product Basic");
  await expect(detail.locator(".doc-section li")).toHaveCount(2);
});

test("activity docs follow the selected activity and registration keeps reading inside the app", async ({
  page,
}) => {
  await page.goto("/#/activities");
  for (const label of ["Trung Thu", "NoCode", "Tết"]) {
    await page.getByRole("tab", { name: label, exact: true }).click();
    await page.getByRole("button", { name: "[ DOCS ↗ ]", exact: true }).click();
    const dialog = page.locator("dialog[open]");
    await expect(dialog.locator(".doc-section h3")).toHaveText(label);
    await expect(dialog.locator(".doc-section")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
  }
  await page.goto("/#/commit");
  const cta = page.getByRole("button", { name: /ĐĂNG KÝ THAM GIA/ });
  await cta.click();
  await page.getByRole("button", { name: /XEM LỘ TRÌNH GIA NHẬP/ }).click();
  const process = page.locator(".dialog-process");
  await expect(process.locator(".doc-section")).toHaveCount(4);
  await expect(process.getByRole("link")).toHaveCount(0);
  await expect(process.getByRole("heading", { level: 2 })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(process).not.toBeVisible();
  await expect(cta).toBeFocused();
});
