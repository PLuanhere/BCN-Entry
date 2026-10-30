import { expect, test } from '@playwright/test';

const steps = [
  ['identity', 'Tổng quan'], ['workspace', 'Hướng học'], ['activities', 'Hoạt động'], ['culture', 'Tinh thần'], ['commit', 'Tham gia'],
];

test('người mới đi lần lượt năm mục trước khi đến fanpage', async ({page}) => {
  await page.goto('/#/commit');
  await expect(page).toHaveURL(/#\/identity$/);
  const nav = page.getByRole('navigation', {name:'Điều hướng chính'});
  const join = nav.getByRole('link', {name:'Tham gia',exact:true});
  await expect(join).toHaveAttribute('aria-disabled','true');
  await join.click({force:true});
  await expect(page).toHaveURL(/#\/identity$/);
  await expect(page.getByRole('link', {name:'Cách tham gia',exact:true})).toHaveCount(0);
  await expect(page.getByRole('link', {name:/Mở fanpage BCN/})).not.toBeVisible();
  await page.screenshot({path:`test-results/journey-start-${test.info().project.name}.png`,animations:'disabled'});

  for (let index = 0; index < steps.length - 1; index++) {
    const next = page.getByRole('button', {name:`Xem tiếp: ${steps[index+1][1]}`,exact:true});
    await expect(next).toBeInViewport();
    expect((await next.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await expect(page.locator('.page-count')).toHaveAttribute('aria-label', `Bước ${index+1} trên 5`);
    if (index === 0) await next.dblclick();
    else await next.click();
    await expect(page).toHaveURL(new RegExp(`#/${steps[index+1][0]}$`));
    await expect(nav.getByRole('link', {name:steps[index+1][1],exact:true})).toHaveAttribute('aria-current','page');
    await expect(page.getByRole('heading', {level:1})).toBeVisible();
  }
  await expect(page.locator('.page-count')).toHaveAttribute('aria-label','Bước 5 trên 5');
  await expect(page.locator('.journey-footer').getByRole('link', {name:/Mở fanpage BCN/})).toBeInViewport();
  await expect(page.locator('.journey-next')).toHaveCount(1);
  await expect(page.locator('.join-next')).toContainText('Chờ thông báo tuyển');
  await expect(page.locator('main')).toHaveAttribute('data-transitioning','false');
  await page.screenshot({path:`test-results/journey-finish-${test.info().project.name}.png`,animations:'disabled'});
});

test('ghi nhớ mục đã mở khi tải lại và cho phép quay lại ngay', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button', {name:'Xem tiếp: Hướng học',exact:true}).click();
  await page.getByRole('button', {name:'Xem tiếp: Hoạt động',exact:true}).click();
  await page.reload();
  await expect(page).toHaveURL(/#\/activities$/);
  const nav = page.getByRole('navigation', {name:'Điều hướng chính'});
  await expect(nav.getByRole('link', {name:'Tham gia',exact:true})).toHaveAttribute('aria-disabled','true');
  await nav.getByRole('link', {name:'Tổng quan',exact:true}).click();
  await nav.getByRole('link', {name:'Hoạt động',exact:true}).click();
  await expect(page).toHaveURL(/#\/activities$/);
  await page.goto('/#/commit');
  await expect(page).toHaveURL(/#\/culture$/);
  await page.getByRole('button', {name:'Xem tiếp: Tham gia',exact:true}).click();
  await page.reload();
  await nav.getByRole('link', {name:'Tổng quan',exact:true}).click();
  await nav.getByRole('link', {name:'Tham gia',exact:true}).click();
  await expect(page).toHaveURL(/#\/commit$/);
});

test('hỏi đáp không tạo lối nhảy đến mục chưa mở', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button', {name:'Tìm thông tin và hỏi đáp về BCN'}).click();
  const dialog = page.locator('.dialog-index');
  await dialog.getByRole('searchbox').fill('đăng ký');
  await expect(dialog.locator('.question-answer')).toContainText('K23');
  await expect(dialog.getByRole('button', {name:/Xem phần liên quan/})).toHaveCount(0);
  await dialog.getByRole('searchbox').fill('zzzzzz');
  await expect(dialog.locator('.search-empty')).toBeVisible();
  await expect(dialog.getByRole('link', {name:/Mở fanpage BCN/})).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await page.getByRole('main').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/#\/workspace$/);
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/#\/identity$/);
});

test('hành trình vẫn hoạt động khi trình duyệt không lưu được tiến độ', async ({page}) => {
  await page.addInitScript(() => {
    const read = Storage.prototype.getItem;
    const write = Storage.prototype.setItem;
    Storage.prototype.getItem = function(key) { if (key === 'bcn-journey-progress-v1') throw new Error('Storage unavailable'); return read.call(this,key); };
    Storage.prototype.setItem = function(key,value) { if (key === 'bcn-journey-progress-v1') throw new Error('Storage unavailable'); write.call(this,key,value); };
  });
  await page.goto('/#/join');
  await expect(page).toHaveURL(/#\/identity$/);
  for (const [, label] of steps.slice(1)) await page.getByRole('button', {name:`Xem tiếp: ${label}`,exact:true}).click();
  await expect(page).toHaveURL(/#\/commit$/);
});
