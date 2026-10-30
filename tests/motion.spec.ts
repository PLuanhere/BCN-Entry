import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bcn-journey-progress-v1', '4'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
});

test('hiệu ứng tự chạy khi mở từng trang và tải lại, không có công tắc', async ({ page }) => {
  test.setTimeout(70_000);
  await page.addInitScript(() => localStorage.setItem('bcn-background-motion', 'off'));
  const assertVisibleEntrance = async () => {
    await expect(page.locator('main')).toHaveAttribute('data-entrance', 'playing');
    const rendered = await page.locator('main').evaluate(main => {
      const animations = main.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running');
      const first = animations.find(animation =>
        ((animation.effect as KeyframeEffect).target as HTMLElement).contains(main.querySelector('h1'))
      );
      if (!first) return null;
      const effect = first.effect as KeyframeEffect;
      const target = effect.target as HTMLElement;
      const time = first.currentTime;
      first.pause();
      first.currentTime = 0;
      const startOpacity = Number(getComputedStyle(target).opacity);
      first.currentTime = Number(effect.getTiming().duration) * .25;
      const middleOpacity = Number(getComputedStyle(target).opacity);
      first.currentTime = time;
      first.play();
      return { count: animations.length, startOpacity, middleOpacity };
    });
    expect(rendered).not.toBeNull();
    expect(rendered!.count).toBeGreaterThanOrEqual(2);
    expect(rendered!.startOpacity).toBe(0);
    expect(rendered!.middleOpacity).toBeGreaterThan(0);
    expect(rendered!.middleOpacity).toBeLessThan(1);
    await expect(page.locator('main')).toHaveAttribute('data-entrance', 'done');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('opacity', '1');
  };
  for (const preference of ['no-preference', 'reduce'] as const) {
    await page.emulateMedia({ reducedMotion: preference });
    for (const section of ['identity', 'workspace', 'activities', 'culture', 'commit']) {
      await page.goto(`/?entrance=${preference}-${section}#/${section}`, { waitUntil: 'domcontentloaded' });
      await assertVisibleEntrance();
      await expect(page.locator('main')).toHaveAttribute('data-transitioning', 'false');
    }
    await page.reload();
    await assertVisibleEntrance();
    await expect(page.getByRole('button', { name: /(bật|tắt|on|off).*(hiệu ứng|chuyển động)/i })).toHaveCount(0);
  }
});

test('chờ trang thật sự hiện lên rồi mới chạy màn chào, không bị resize hủy', async ({ page }) => {
  await page.addInitScript(() => {
    const state = { visible: false };
    (window as Window & { previewState?: typeof state }).previewState = state;
    Object.defineProperty(document, 'hidden', { get: () => !state.visible });
    Object.defineProperty(document, 'visibilityState', { get: () => state.visible ? 'visible' : 'hidden' });
  });
  await page.goto('/#/identity');
  await expect(page.locator('main')).toHaveAttribute('data-entrance', 'pending');
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await expect(page.locator('main')).toHaveAttribute('data-entrance', 'pending');
  await page.evaluate(() => {
    (window as Window & { previewState?: { visible: boolean } }).previewState!.visible = true;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('main')).toHaveAttribute('data-entrance', 'playing');
  await expect(page.getByRole('button', { name: 'Xem tiếp: Hướng học', exact: true })).toBeEnabled();
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await expect(page.locator('main')).toHaveAttribute('data-entrance', 'playing');
  await page.evaluate(() => {
    (window as Window & { previewState?: { visible: boolean } }).previewState!.visible = false;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => page.locator('main').evaluate(main =>
    main.getAnimations({ subtree: true }).filter(animation => animation.playState === 'paused').length
  )).toBeGreaterThan(0);
  await expect(page.locator('main')).toHaveAttribute('data-entrance', 'playing');
  await page.evaluate(() => {
    (window as Window & { previewState?: { visible: boolean } }).previewState!.visible = true;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('main')).toHaveAttribute('data-entrance', 'done');
});

test('đổi tab liên tục giữ nội dung cuối, chuyển động nhẹ và không tích lũy', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/workspace');
  const motion = await page.evaluate(async () => {
    const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    for (const name of ['Frontend', 'Backend', 'Mobile', 'Non-dev', 'Cơ Bản', 'Mobile']) {
      tabs.find(tab => tab.textContent?.trim() === name)!.click();
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
    const animations = document.querySelector('.workspace-scene')!.getAnimations({ subtree: true });
    return {
      count: animations.filter(animation => animation.playState === 'running').length,
      properties: [...new Set(animations.flatMap(animation =>
        (animation.effect as KeyframeEffect).getKeyframes().flatMap(frame => Object.keys(frame))
      ))].filter(key => !['offset', 'computedOffset', 'easing', 'composite'].includes(key)),
    };
  });
  expect(motion.count).toBeGreaterThan(0);
  expect(motion.count).toBeLessThanOrEqual(3);
  expect(motion.properties.sort()).toEqual(['opacity', 'transform']);
  await expect(page.getByRole('tab', { name: 'Mobile', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('Jetpack Compose');
  const panel = page.locator('.workspace-scene');
  await expect.poll(() => panel.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(page.locator('.workspace-focus')).toHaveCSS('opacity', '1');
  await expect(page.locator('.workspace-focus')).toHaveCSS('transform', 'none');
  expect(errors).toEqual([]);
});

test('bật giảm chuyển động giữa chuyển cảnh và popup không kẹt giao diện', async ({ page }) => {
  await page.goto('/#/identity');
  const started = await page.evaluate(() => {
    document.querySelector<HTMLAnchorElement>('.primary-nav a[href="#/workspace"]')!.click();
    return document.querySelector('main')!.getAttribute('data-transitioning');
  });
  expect(started).toBe('true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const main = page.locator('main');
  await expect(main).toHaveAttribute('data-transitioning', 'false');
  await expect.poll(() => main.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  const fade = await page.evaluate(async () => {
    document.querySelector<HTMLButtonElement>('#study-tab-5')!.click();
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    const animations = document.querySelector('.workspace-scene')!.getAnimations({ subtree: true });
    return {
      count: animations.filter(animation => animation.playState === 'running').length,
      frames: animations.flatMap(animation => (animation.effect as KeyframeEffect).getKeyframes()),
    };
  });
  expect(fade.count).toBeGreaterThan(0);
  expect(fade.frames.every(frame => !('transform' in frame) || frame.transform === 'none')).toBe(true);
  await expect.poll(() => main.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(page.getByRole('button', { name: 'Xem tiếp: Hoạt động', exact: true })).toBeEnabled();

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('.search-trigger').focus();
  const phase = await page.evaluate(() => {
    document.querySelector<HTMLButtonElement>('.search-trigger')!.click();
    return document.querySelector<HTMLDialogElement>('dialog[open]')!.dataset.motion;
  });
  expect(phase).toBe('opening');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const dialog = page.locator('dialog[open]');
  await expect(dialog).toHaveAttribute('data-motion', 'open');
  await expect(dialog).toHaveCSS('opacity', '1');
  await expect.poll(() => dialog.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await expect(page.locator('.search-trigger')).toBeFocused();
});
