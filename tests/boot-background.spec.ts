import { test, expect } from "@playwright/test";

test("boot background visibly animates without covering controls or overflowing", async ({
  page,
}, info) => {
  for (const viewport of [
    { width: 1920, height: 900 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/#/boot");
    await expect(page.getByRole("main")).toHaveAttribute(
      "data-transitioning",
      "false",
    );
    await page.evaluate(() => document.fonts.ready);
    const background = page.locator(".boot-background");
    await expect(background).toHaveAttribute("aria-hidden", "true");
    await expect(background).toHaveCSS("pointer-events", "none");
    const frame = () =>
      page.evaluate(() => ({
        cube: getComputedStyle(document.querySelector(".boot-cube")!).transform,
        packet: getComputedStyle(document.querySelector(".boot-packets path")!)
          .strokeDashoffset,
        grid: getComputedStyle(document.querySelector(".boot-grid-lines")!)
          .backgroundPosition,
      }));
    const before = await frame();
    await page.waitForTimeout(300);
    const after = await frame();
    expect(after.cube).not.toBe(before.cube);
    expect(after.packet).not.toBe(before.packet);
    expect(after.grid).not.toBe(before.grid);
    const geometry = await page.evaluate(() => {
      const main = document.querySelector("main")!;
      const button = document.querySelector(".hold-button")!;
      const box = button.getBoundingClientRect();
      return {
        pageOverflow: document.documentElement.scrollHeight - innerHeight,
        verticalOverflow: main.scrollHeight - main.clientHeight,
        horizontalOverflow: main.scrollWidth - main.clientWidth,
        buttonReachable: Boolean(
          document
            .elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
            ?.closest(".hold-button"),
        ),
      };
    });
    expect(geometry).toEqual({
      pageOverflow: 0,
      verticalOverflow: 0,
      horizontalOverflow: 0,
      buttonReachable: true,
    });
    await page.screenshot({
      path: `test-results/boot/${info.project.name}-${viewport.width}x${viewport.height}.png`,
    });
    await page.getByRole("button", { name: /^Bước 2:/ }).click();
    await expect(page.locator(".boot-background")).toHaveCount(0);
    await expect(page.getByRole("main")).toHaveAttribute(
      "data-transitioning",
      "false",
    );
  }
});
