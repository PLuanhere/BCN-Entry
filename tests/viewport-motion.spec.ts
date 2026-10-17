import { test, expect } from "@playwright/test";

test("the frame fits while scenes and their contents animate", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const viewport of [
    { width: 1366, height: 640 },
    { width: 320, height: 568 },
    { width: 390, height: 700 },
    { width: 667, height: 375 },
  ]) {
    await page.setViewportSize(viewport);
    for (const stage of [
      "boot",
      "identity",
      "culture",
      "workspace",
      "activities",
      "sync",
      "commit",
    ]) {
      await page.goto(`/#/${stage}`);
      await page.evaluate(() => document.fonts.ready);
      const sample = async (variant: string) => {
        const overflow = await page.evaluate(async () => {
          const main = document.querySelector("main")!;
          const maximum = { page: 0, vertical: 0, horizontal: 0 };
          const start = performance.now();
          await new Promise<void>((resolve) => {
            function frame() {
              maximum.page = Math.max(
                maximum.page,
                document.documentElement.scrollHeight - innerHeight,
              );
              maximum.vertical = Math.max(
                maximum.vertical,
                main.scrollHeight - main.clientHeight,
              );
              maximum.horizontal = Math.max(
                maximum.horizontal,
                main.scrollWidth - main.clientWidth,
              );
              if (performance.now() - start < 700) requestAnimationFrame(frame);
              else resolve();
            }
            requestAnimationFrame(frame);
          });
          return maximum;
        });
        expect
          .soft(
            overflow,
            `${viewport.width}x${viewport.height}/${stage}/${variant}`,
          )
          .toEqual({ page: 0, vertical: 0, horizontal: 0 });
      };
      await sample("entry");
      if (stage === "activities") {
        await page.getByRole("tab", { name: "Tết", exact: true }).click();
        await sample("changing activity");
      }
      if (stage === "culture") {
        await page.locator(".culture-toggle").first().click();
        await sample("expanding");
      }
      if (stage === "workspace") {
        await page.locator(".folder-navigation > button").nth(2).click();
        await sample("changing folder");
        await page.locator(".item-selector button").nth(1).click();
        await sample("changing item");
      }
      if (stage === "identity" || stage === "workspace" || stage === "culture")
        await page.screenshot({
          path: `test-results/viewport/${viewport.width}x${viewport.height}-${stage}.png`,
        });
    }
  }
});
