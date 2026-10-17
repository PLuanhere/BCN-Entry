import { test, expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

async function sampleMotion(dialog: Locator) {
  return dialog.evaluate((element) => {
    const animation = element
      .getAnimations()
      .find((candidate) =>
        (candidate.effect as KeyframeEffect | null)
          ?.getKeyframes()
          .some((frame) => "opacity" in frame),
      );
    if (!animation) throw new Error("Dialog has no opacity animation");
    const running = animation.playState === "running";
    animation.pause();
    animation.currentTime = Number(animation.effect!.getTiming().duration) / 2;
    return {
      running,
      open: (element as HTMLDialogElement).open,
      opacity: Number(getComputedStyle(element).opacity),
      transform: getComputedStyle(element).transform,
    };
  });
}

async function finishMotion(dialog: Locator) {
  await dialog.evaluate((element) => {
    for (const animation of element.getAnimations())
      if (
        (animation.effect as KeyframeEffect | null)
          ?.getKeyframes()
          .some((frame) => "opacity" in frame)
      )
        animation.finish();
  });
}

test("documents, workspace details and photos animate both ways and restore focus", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const kind of ["documents", "workspace", "photos"]) {
    await page.goto(
      kind === "workspace"
        ? "/#/workspace"
        : kind === "photos"
          ? "/#/activities"
          : "/#/boot",
    );
    if (kind === "workspace")
      await page.getByRole("button", { name: "OOP Java", exact: true }).click();
    const trigger =
      kind === "documents"
        ? page.getByRole("button", { name: "[ DOCS ↗ ]", exact: true })
        : kind === "workspace"
          ? page.getByRole("button", { name: /ĐỌC CHI TIẾT/ })
          : page.getByRole("button", {
              name: "Xem lớn bộ ảnh Trung Thu",
              exact: true,
            });
    await trigger.click();
    const dialog = page.locator(
      kind === "workspace"
        ? ".workspace-detail-dialog"
        : kind === "photos"
          ? ".photo-dialog"
          : ".dialog-guide",
    );
    const opening = await sampleMotion(dialog);
    expect(opening.running).toBe(true);
    expect(opening.opacity).toBeGreaterThan(0);
    expect(opening.opacity).toBeLessThan(1);
    expect(opening.transform).not.toBe("none");
    await finishMotion(dialog);
    await expect(dialog).toHaveAttribute("data-motion", "open");
    // Exercise all three supported ways to dismiss a native modal.
    if (kind === "documents") await page.keyboard.press("Escape");
    else if (kind === "workspace")
      await dialog
        .getByRole("button", { name: "Đóng cửa sổ", exact: true })
        .click();
    else await page.mouse.click(1, 1);
    await expect(dialog).toHaveAttribute("data-motion", "closing");
    const closing = await sampleMotion(dialog);
    expect(closing.running).toBe(true);
    expect(closing.open).toBe(true);
    expect(closing.opacity).toBeGreaterThan(0);
    expect(closing.opacity).toBeLessThan(1);
    await page.screenshot({
      path: `test-results/dialog-motion/${info.project.name}-${kind}-closing.png`,
    });
    await finishMotion(dialog);
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
});

test("Escape during entry and repeated reopening never leave a modal stuck", async ({
  page,
}) => {
  await page.goto("/#/boot");
  const trigger = page.getByRole("button", { name: "[ DOCS ↗ ]", exact: true });
  for (let cycle = 0; cycle < 4; cycle++) {
    await trigger.click();
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
});

test("workspace details and section docs stay scoped while preserving modal motion", async ({
  page,
}) => {
  await page.goto("/#/workspace");
  await page.getByRole("button", { name: "OOP Java", exact: true }).click();
  await page.getByRole("button", { name: /ĐỌC CHI TIẾT/ }).click();
  const detail = page.locator(".workspace-detail-dialog");
  await expect(detail).toHaveAttribute("data-motion", "open");
  await expect(detail).not.toContainText("Kotlin");
  await expect(
    detail.getByRole("button", { name: /ĐỌC TÀI LIỆU ĐẦY ĐỦ/ }),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(detail).toHaveAttribute("data-motion", "closing");
  await expect(detail).not.toBeVisible();
  const docs = page.getByRole("button", { name: "[ DOCS ↗ ]", exact: true });
  await docs.click();
  await expect(page.locator(".dialog-learning")).toBeVisible();
  await expect(page.locator(".dialog-learning")).not.toContainText(
    "50 người dùng",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await expect(docs).toBeFocused();
});
