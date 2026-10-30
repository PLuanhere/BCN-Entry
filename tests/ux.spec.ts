import { expect, test } from '@playwright/test';

const openSearch = async (page: import('@playwright/test').Page) => {
  await page.getByRole('button', { name: 'Tìm thông tin và hỏi đáp về BCN' }).click();
  return page.locator('.dialog-index');
};

test('máy tính hiện sẵn bảy câu hỏi bên trái, không buộc dùng danh sách thả xuống', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop', 'Kiểm tra bố cục danh sách trên màn hình rộng.');
  await page.goto('/');
  const dialog = await openSearch(page);
  for (const [width,height] of [[1266,882], [1280,720], [920,668], [1024,600], [768,541]]) {
    await page.setViewportSize({width,height});
    await expect(dialog.locator('.question-picker')).not.toBeVisible();
    await expect(dialog.locator('.question-list')).toBeVisible();
    for (const item of await dialog.locator('.question-list button').all()) {
      await expect(item).toBeInViewport();
      expect((await item.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
    await dialog.locator('.question-list button').last().click();
    await expect(dialog.locator('.question-answer')).toContainText('Lịch, điều kiện và các vòng tuyển K23 chưa chốt');
  }
  await page.setViewportSize({width:1266,height:882});
  await dialog.locator('.question-list button').first().click();
  await page.screenshot({path:'test-results/search-restored-desktop.png', animations:'disabled'});
});

test('câu hỏi tự nhiên dẫn đến câu trả lời đúng, kể cả không dấu và đăng kí', async ({ page }) => {
  await page.goto('/');
  const dialog = await openSearch(page);
  const search = dialog.getByRole('searchbox');
  for (const [query, heading] of [
    ['Mình chưa biết code, có được tham gia không?', 'Chưa biết lập trình'],
    ['lam sao de tham gia', 'Khi nào tuyển K23'],
    ['đăng kí', 'Khi nào tuyển K23'],
    ['Mình đăng ký ở đâu?', 'Khi nào tuyển K23'],
    ['BCN học gì?', 'BCN có những hướng học'],
    ['Có miễn phí không?', 'Ai có thể tham gia'],
    ['sinh hoạt ở đâu vậy', 'Sinh hoạt ở đâu'],
    ['non-dev', 'NoCode và Non-dev'],
    ['BCN thuộc đơn vị nào?', 'BCN là gì'],
  ]) {
    await search.fill(query);
    await expect(dialog.locator('.question-answer h3'), query).toContainText(heading);
  }
  await search.fill('zzzzzz');
  await expect(dialog.locator('.search-empty')).toBeVisible();
  await dialog.getByRole('button', { name: /Xem tất cả câu hỏi/ }).click();
  await expect(dialog.locator('.question-list button')).toHaveCount(7);
});

test('hỏi đầu vào mở đúng câu trả lời và tìm kiếm luôn được focus khi mở lại', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Xem tiếp: Hướng học', exact: true }).click();
  await page.getByRole('button', { name: /Đầu vào & câu hỏi thường gặp/ }).click();
  const dialog = page.locator('.dialog-index');
  await expect(dialog.locator('.question-answer')).toContainText('Yêu cầu kỹ năng đầu vào cho K23 chưa chốt');
  await expect(dialog.locator('.question-answer')).toBeFocused();
  await expect(dialog.getByRole('searchbox')).not.toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean(history.state?.bcnOverlay))).toBe(false);
  await openSearch(page);
  await expect(dialog.getByRole('searchbox')).toBeFocused();
  await expect(dialog.getByRole('searchbox')).toHaveValue('');
});

test('Back đóng hỏi đáp trước, Forward và tải lại mở đúng cửa sổ, đóng không thêm bước thừa', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Xem tiếp: Hướng học', exact: true }).click();
  const dialog = await openSearch(page);
  await expect(dialog).toBeVisible();
  await page.goBack();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#\/workspace$/);
  await page.goForward();
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.question-answer')).toContainText('Yêu cầu kỹ năng đầu vào');
  await page.reload();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('searchbox')).toBeFocused();
  await dialog.getByRole('button', { name: 'Đóng cửa sổ' }).click();
  await expect(dialog).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean(history.state?.bcnOverlay))).toBe(false);
  await page.goBack();
  await expect(page).toHaveURL(/#\/identity$/);
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('Back khi xem ảnh giữ nguyên trang, liên kết từ hỏi đáp không bị vướng lịch sử popup', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('bcn-journey-progress-v1', '4'));
  await page.goto('/');
  await page.getByRole('button', { name: 'Xem ảnh các buổi học tại BCN' }).click();
  const photo = page.locator('.photo-dialog');
  await expect(photo).toBeVisible();
  await page.goBack();
  await expect(photo).not.toBeVisible();
  await expect(page).toHaveURL(/#\/identity$/);
  const dialog = await openSearch(page);
  await dialog.getByRole('searchbox').fill('hướng học');
  await dialog.getByRole('button', { name: /Xem phần liên quan/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#\/workspace$/);
  await expect(page.getByRole('main')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/#\/identity$/);
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('mục chưa mở giải thích cách đi tiếp, bước cuối có hành động tuyển K23 rõ ràng', async ({ page }) => {
  await page.goto('/');
  const join = page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('link', { name: 'Tham gia', exact: true });
  await join.click({ force: true });
  await expect(page.locator('.navigation-hint')).toContainText('Bấm Tiếp tục');
  await expect(page).toHaveURL(/#\/identity$/);
  for (const label of ['Hướng học', 'Hoạt động', 'Tinh thần', 'Tham gia']) {
    await page.getByRole('button', { name: `Xem tiếp: ${label}`, exact: true }).click();
  }
  await expect(page.locator('.navigation-hint')).toBeEmpty();
  const finalAction = page.locator('.journey-complete');
  await expect(finalAction).toContainText('Theo dõi tuyển K23');
  await expect(finalAction).toContainText('mở tab mới');
  await expect(finalAction).toHaveAttribute('target', '_blank');
  const fits = await finalAction.evaluate((link) => {
    const box = link.getBoundingClientRect();
    return box.bottom <= innerHeight && link.scrollWidth <= link.clientWidth + 1 &&
      Array.from(link.querySelectorAll('small,strong')).every((text) => text.getBoundingClientRect().bottom <= box.bottom - 4);
  });
  expect(fits).toBe(true);
});

test('hành động K23 dễ đọc và vừa màn hình điện thoại nhỏ, ngang và tablet', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Chạy một lần cho các kích thước bổ sung.');
  await page.addInitScript(() => localStorage.setItem('bcn-journey-progress-v1', '4'));
  await page.goto('/#/commit');
  await page.locator('main').click({ position: { x: 4, y: 4 } });
  for (const [width, height] of [[320, 568], [360, 640], [390, 844], [568, 320], [768, 1024]]) {
    await page.setViewportSize({ width, height });
    const metrics = await page.locator('.journey-complete').evaluate((button) => {
      const bounds = button.getBoundingClientRect();
      const footer = button.closest('footer')!.getBoundingClientRect();
      return {
        inside: bounds.bottom <= innerHeight && bounds.top >= footer.top,
        overflow: button.scrollWidth - button.clientWidth,
        textInside: Array.from(button.querySelectorAll('small,strong')).every((text) => {
          const box = text.getBoundingClientRect();
          return box.bottom <= bounds.bottom - 4 && box.right <= bounds.right - 4;
        }),
      };
    });
    expect(metrics, `${width} × ${height}`).toEqual({ inside: true, overflow: 0, textInside: true });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/ux-k23-mobile.png', animations: 'disabled' });
});

test('khôi phục popup không vượt qua tiến độ người mới khi xóa dữ liệu trình duyệt', async ({ page }) => {
  await page.goto('/');
  for (const label of ['Hướng học', 'Hoạt động', 'Tinh thần', 'Tham gia']) {
    await page.getByRole('button', { name: `Xem tiếp: ${label}`, exact: true }).click();
  }
  await page.getByRole('button', { name: 'Điều kiện & lịch sinh hoạt' }).click();
  await expect(page.locator('.dialog-registration')).toBeVisible();
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page).toHaveURL(/#\/identity$/);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean(history.state?.bcnOverlay))).toBe(false);
});
