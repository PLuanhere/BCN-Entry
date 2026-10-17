import { test, expect } from "@playwright/test";

const paths = [
  "boot",
  "identity",
  "culture",
  "workspace",
  "activities",
  "sync",
  "commit",
];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 320, height: 740 },
  { width: 768, height: 844 },
  { width: 844, height: 390 },
  { width: 1366, height: 640 },
  { width: 1024, height: 600 },
  { width: 375, height: 667 },
  { width: 360, height: 568 },
  { width: 320, height: 568 },
  { width: 667, height: 375 },
];

for (const viewport of viewports)
  test(`readable scenes fit ${viewport.width}x${viewport.height}`, async ({
    page,
  }, info) => {
    test.setTimeout(120000);
    // Freeze motion only for deterministic layout measurements; motion.spec.ts verifies live effects.
    await page.addInitScript(() =>
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          const style = document.createElement("style");
          style.textContent =
            "*,*::before,*::after,::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important;transition:none!important}";
          document.head.append(style);
        },
        { once: true },
      ),
    );
    const overflows: string[] = [];
    await page.setViewportSize(viewport);
    for (const path of paths) {
      await page.goto(`/#/${path}`);
      await page.evaluate(() => document.fonts.ready);
      const check = async (variant: string) => {
        const size = await page.getByRole("main").evaluate((el) => ({
          extra: el.scrollHeight - el.clientHeight,
          horizontal: el.scrollWidth - el.clientWidth,
        }));
        if (size.extra || size.horizontal)
          overflows.push(
            `${viewport.width}x${viewport.height}/${path}/${variant}: ${JSON.stringify(size)}`,
          );
        await expect(page.locator(".stage h1")).toBeInViewport();
        if (path === "workspace") {
          const graphic = await page
            .locator(".visual-canvas > div, .workspace-photo .photo-story")
            .evaluate((el) => {
              const bounds = el.getBoundingClientRect();
              const viewport = el
                .closest(".workspace-visual")!
                .getBoundingClientRect();
              return {
                top: Math.max(0, viewport.top - bounds.top),
                bottom: Math.max(0, bounds.bottom - viewport.bottom),
              };
            });
          expect
            .soft(graphic.top, `${viewport.width}/${variant}: graphic top`)
            .toBeLessThanOrEqual(4);
          expect
            .soft(
              graphic.bottom,
              `${viewport.width}/${variant}: graphic bottom`,
            )
            .toBeLessThanOrEqual(4);
        }
        if (path === "culture") {
          const panel = page.locator(".culture-panel:visible");
          if (await panel.count()) {
            const visibleContent = await panel.evaluate((el) => {
              const column = el.closest(".culture-column")!;
              const title = column.querySelector<HTMLElement>(
                ".culture-toggle-title",
              )!;
              return {
                clipped:
                  el.getBoundingClientRect().bottom >
                  column.getBoundingClientRect().bottom + 1,
                titleClipped: title.scrollHeight > title.clientHeight + 1,
              };
            });
            expect
              .soft(
                visibleContent,
                `${viewport.width}/${variant}: expanded content must remain complete`,
              )
              .toEqual({ clipped: false, titleClipped: false });
          }
        }
        const copy = page.locator(".stage .body-copy").first();
        if (await copy.count())
          expect(
            await copy.evaluate((el) =>
              parseFloat(getComputedStyle(el).fontSize),
            ),
          ).toBeGreaterThanOrEqual(15);
      };
      await check("initial");
      if (path === "identity") {
        for (const tab of ["Chúng mình", "Sứ mệnh", "Tầm nhìn"]) {
          await page.getByRole("button", { name: tab, exact: true }).click();
          await check(tab);
        }
      }
      if (path === "culture") {
        for (let i = 0; i < 3; i++) {
          await page.locator(".culture-toggle").nth(i).click();
          await check(`pillar-${i}`);
          await page
            .getByRole("button", { name: /TRONG CÁCH CHÚNG MÌNH LÀM/ })
            .click();
          await check(`principles-${i}`);
          for (let tip = 0; tip < 3; tip++) {
            await page
              .getByRole("button", {
                name: `Nguyên tắc ${tip + 1}`,
                exact: true,
              })
              .click();
            await check(`principle-${i}-${tip}`);
          }
        }
      }
      if (path === "workspace") {
        for (let i = 0; i < 5; i++) {
          await page.locator(".folder-navigation > button").nth(i).click();
          await check(`folder-${i}`);
          if (i === 0)
            await page
              .getByRole("button", { name: "02 / Nâng cao", exact: true })
              .click();
          const count = await page.locator(".item-selector button").count();
          for (let j = 0; j < count; j++) {
            await page.locator(".item-selector button").nth(j).click();
            await check(`folder-${i}/item-${j}`);
          }
        }
      }
      if (path === "activities") {
        for (const tab of ["Trung Thu", "NoCode", "Tết"]) {
          await page.getByRole("tab", { name: tab, exact: true }).click();
          await check(tab);
        }
      }
      if (path === "commit") {
        for (let profile = 0; profile < 3; profile++) {
          await page.goto("/#/sync");
          await page.locator(".quiz-options button").nth(profile).click();
          await expect(page).toHaveURL(/commit/);
          await check(`profile-${profile}`);
        }
      }
      if (viewport.width === 390)
        await page.screenshot({
          path: `test-results/readability/${info.project.name}-${path}.png`,
          animations: "disabled",
        });
    }
    expect(overflows).toEqual([]);
  });
