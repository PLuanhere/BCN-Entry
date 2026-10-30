import { expect, test } from '@playwright/test';

const sections = [
  ['identity', 'Tổng quan'], ['workspace', 'Hướng học'], ['activities', 'Hoạt động'], ['culture', 'Tinh thần'], ['commit', 'Tham gia'],
];

// Existing feature checks represent a returning visitor. The fresh guided
// journey and its navigation restrictions are covered in journey.spec.ts.
test.beforeEach(async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('bcn-journey-progress-v1', '4'));
});

test('Tổng quan giới thiệu BCN bằng ảnh thật và một hành động chính', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/#\/identity$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ban Công Nghệ');
  await expect(page.locator('.notice-affiliation')).toHaveText('Đoàn Khoa CNTT, IUH');
  await expect(page.locator('.notice-role')).toHaveText('Ban Công Nghệ thuộc');
  await expect(page.locator('.welcome-copy')).toContainText('thực hành làm sản phẩm');
  await expect(page.locator('.action-primary')).toHaveCount(1);
  await expect(page.locator('.tech-background')).toHaveCount(1);
  await expect(page.locator('.notice-photo img')).toBeInViewport();
  await expect(page.locator('.newcomer-home')).not.toContainText(/không thu phí/i);
  const next = page.getByRole('button', {name:'Xem tiếp: Hướng học',exact:true});
  await expect(next).toBeInViewport();
  await expect(page.locator('.recruitment-note')).toContainText(/chờ thông báo chính thức/i);
  await next.click();
  await expect(page).toHaveURL(/#\/workspace$/);
});

test('menu có tên rõ ràng, mở trực tiếp đủ năm mục và không tràn ngang', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
  let sharedTheme: unknown;
  await expect(nav.getByRole('link')).toHaveCount(5);
  for (const [id, label] of sections) {
    const link = nav.getByRole('link', { name: label, exact: true });
    await expect(link).toBeInViewport();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#/${id}$`));
    await expect(link).toHaveAttribute('aria-current', 'page');
    await expect(link).toHaveCSS('box-shadow', 'none');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('main')).toHaveAttribute('data-transitioning', 'false');
    await expect(page.locator('.tech-background')).toHaveCount(1);
    const theme = await page.evaluate(() => {
      const root = getComputedStyle(document.querySelector('.newcomer-app')!);
      return {
        background: root.backgroundColor,
        primary: root.getPropertyValue('--primary'),
        accent: root.getPropertyValue('--accent'),
        heading: getComputedStyle(document.querySelector('h1')!).fontFamily,
        header: getComputedStyle(document.querySelector('.os-header')!).backgroundColor,
        navigation: getComputedStyle(document.querySelector('.primary-nav a')!).fontFamily,
      };
    });
    sharedTheme ??= theme;
    expect(theme, `Giao diện thống nhất: ${id}`).toEqual(sharedTheme);
    if (id !== 'identity') await expect(page.locator('main')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), id).toBeLessThanOrEqual(1);
    expect(await page.locator('main').evaluate((el) => el.scrollWidth - el.clientWidth), id).toBeLessThanOrEqual(1);
    for (const image of await page.locator('.stage img:visible').all()) await image.evaluate((element: HTMLImageElement) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) return element.decode();
    });
    await page.screenshot({ path: `test-results/newcomer-${id}-${info.project.name}.png`, animations: 'disabled' });
  }
  expect(errors).toEqual([]);
});

test('điều hướng trước, tiếp, bàn phím và Back của trình duyệt', async ({ page }) => {
  await page.goto('/#/identity');
  await page.getByRole('button', { name: 'Xem tiếp: Hướng học', exact: true }).click();
  await expect(page).toHaveURL(/#\/workspace$/);
  await page.getByRole('main').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/#\/activities$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ngoài giờ học');
  await page.getByRole('button', { name: 'Xem mục trước', exact: true }).click();
  await expect(page).toHaveURL(/#\/workspace$/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/activities$/);
});

test('6 hướng học truy cập được bằng chuột, chạm và bàn phím', async ({ page }) => {
  await page.goto('/#/workspace');
  await expect(page.getByRole('tab')).toHaveCount(6);
  await expect(page.locator('.workspace-stage')).not.toContainText(/đang triển khai/i);
  await expect(page.getByRole('button', { name: /Ảnh buổi học/ })).toHaveCount(0);
  for (const name of ['Cơ Bản', 'Frontend', 'Backend', 'Non-dev', 'Fullstack', 'Mobile']) {
    const tab = page.getByRole('tab', { name, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(tab).toHaveCSS('box-shadow', 'none');
    await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', await tab.getAttribute('id') as string);
  }
  for (const name of ['Android', 'Java', 'Kotlin', 'Compose']) {
    await expect(page.locator('.track-icons').getByText(name, { exact: true })).toBeVisible();
  }
  await page.locator('.track-icons img').evaluateAll((images) => Promise.all(images.map((image) => (image as HTMLImageElement).decode())));
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Mobile', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.workspace-focus')).toContainText('Jetpack Compose');
  await page.getByRole('tab', { name: 'Mobile', exact: true }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Cơ Bản', exact: true })).toBeFocused();
  await page.getByRole('tab', { name: 'Frontend', exact: true }).click();
  await expect(page.locator('.workspace-focus')).toContainText('Web cơ bản → nâng cao');
  await expect(page.locator('.workspace-focus')).not.toContainText('Mobile');
  await page.getByRole('tab', { name: 'Frontend', exact: true }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Backend', exact: true })).toBeFocused();
  await page.getByRole('tab', { name: 'Non-dev', exact: true }).click();
  await expect(page.locator('.workspace-focus')).toContainText('Thiết kế giao diện, trải nghiệm người dùng và phân tích yêu cầu sản phẩm');
});

test('hoạt động và tinh thần đọc được mà không phải mở các lớp nội dung', async ({ page }) => {
  await page.goto('/#/activities');
  await page.getByRole('tab', { name: 'Làm video (NoCode)', exact: true }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Cùng làm video');
  await page.goto('/#/culture');
  await expect(page.locator('.value-card')).toHaveCount(3);
  for (const card of await page.locator('.value-card').all()) await expect(card.locator('p')).toBeVisible();
  await expect(page.locator('.values-grid')).toContainText('báo sớm');
  await page.getByRole('button', { name: /Điều kiện & thời gian/ }).click();
  await expect(page.locator('.dialog-expectations')).toContainText('chưa chốt');
  await expect(page.locator('.dialog-expectations')).toContainText('khuyến nghị, không bắt buộc');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('tìm hỏi đáp không dấu, gợi ý, xóa từ khóa và phục hồi focus', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Tìm thông tin và hỏi đáp về BCN' });
  await trigger.click();
  const dialog = page.locator('.dialog-index');
  const search = dialog.getByRole('searchbox');
  await search.fill('hoc phi');
  await expect(dialog.locator('.question-list button')).toHaveCount(1);
  await expect(dialog.locator('.question-answer')).toContainText('không thu phí');
  await search.fill('DANG KY');
  await expect(dialog.locator('.question-answer')).toContainText('K23');
  await dialog.getByRole('button', { name: 'Lịch sinh hoạt', exact: true }).click();
  await expect(dialog.locator('.question-answer')).toContainText('không phải điều kiện bắt buộc');
  await dialog.getByRole('button', { name: 'Xóa từ khóa tìm kiếm' }).click();
  await expect(dialog.locator('.question-list button')).toHaveCount(7);
  await expect(search).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(search).toHaveValue('');
});

test('kết quả tìm kiếm dẫn đúng mục và trạng thái không có kết quả có lối ra', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Tìm thông tin và hỏi đáp về BCN' }).click();
  const dialog = page.locator('.dialog-index');
  await dialog.getByRole('searchbox').fill('zzzzzz');
  await expect(dialog.locator('.search-empty')).toBeVisible();
  await dialog.getByRole('button', { name: /Xem tất cả câu hỏi/ }).click();
  await dialog.getByRole('searchbox').fill('hướng học');
  await expect(dialog.locator('.question-list button')).toHaveCount(1);
  await dialog.getByRole('button', { name: /Xem phần liên quan/ }).click();
  await expect(page).toHaveURL(/#\/workspace$/);
  await expect(dialog).not.toBeVisible();
});

test('trang tham gia phân biệt thông báo hiện tại và tư liệu cũ', async ({ page }) => {
  await page.goto('/#/commit');
  await expect(page.locator('.join-next')).toContainText('K22 đã khép lại');
  await expect(page.locator('.join-next')).toContainText('chưa chốt');
  await expect(page.locator('.join-facts')).toContainText('Sinh viên khoa CNTT, IUH');
  const fanpage = page.getByRole('link', { name: /Mở fanpage BCN/ });
  await expect(fanpage).toHaveAttribute('href', 'https://www.facebook.com/profile.php?id=61572321333029');
  await expect(fanpage).toHaveAttribute('target', '_blank');
  await expect(page.locator('.photo-dialog')).not.toBeVisible();
  await page.getByRole('button', { name: /Ấn phẩm các mùa tuyển trước/ }).click();
  await expect(page.locator('.photo-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.photo-dialog')).not.toBeVisible();
  await page.getByRole('button', { name: /Điều kiện & lịch sinh hoạt/ }).click();
  await expect(page.locator('.dialog-registration')).toContainText('thời lượng');
});

test('ảnh buổi học mở được và đóng bằng Escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Xem ảnh các buổi học tại BCN' }).click();
  await expect(page.locator('.photo-dialog')).toBeVisible();
  await expect(page.locator('.tech-grid')).toHaveCSS('animation-play-state', 'paused');
  await page.keyboard.press('Escape');
  await expect(page.locator('.photo-dialog')).not.toBeVisible();
  await expect(page.locator('.tech-grid')).toHaveCSS('animation-play-state', 'running');
});

test('các đường dẫn cũ được đưa về đúng mục', async ({ page }) => {
  for (const [oldRoute, newRoute] of [['boot','identity'], ['sync','culture'], ['about','identity'], ['learning','workspace'], ['life','activities'], ['fit','culture'], ['join','commit']]) {
    await page.goto(`/#/${oldRoute}`);
    await expect(page).toHaveURL(new RegExp(`#/${newRoute}$`));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('mọi mục nằm trọn trong một màn hình, không cuộn và không cắt nội dung', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Kiểm tra kích thước bổ sung một lần.');
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const size of [
    { width: 320, height: 568 }, { width: 360, height: 640 }, { width: 390, height: 844 },
    { width: 768, height: 1024 }, { width: 844, height: 390 }, { width: 1024, height: 600 },
    { width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(size);
    await page.goto('/');
    for (const [id, label] of sections) {
      const link = page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('link', { name: label, exact: true });
      await expect(link).toBeInViewport();
      await link.click();
      await expect(page.locator(`.${id}-stage`)).toBeVisible();
      const checkFrame = async (selection = '') => {
        const metrics = await page.locator('main').evaluate((main) => {
          const stage = main.querySelector<HTMLElement>('.stage')!;
          const bounds = main.getBoundingClientRect();
          const clipped = Array.from(stage.querySelectorAll<HTMLElement>('h1,h2,.body-copy,.value-card p,.join-facts,.join-status-copy,.welcome-copy > p,.welcome-facts,.recruitment-note,a,button'))
            .filter((node) => node.checkVisibility() && !node.closest('[aria-hidden="true"]'))
            .filter((node) => {
              const box = node.getBoundingClientRect();
              return box.top < bounds.top - 1 || box.bottom > bounds.bottom + 1 || box.left < bounds.left - 1 || box.right > bounds.right + 1 || node.scrollHeight > node.clientHeight + 1;
            }).map((node) => node.textContent?.trim());
          const overflowingContent = Array.from(stage.querySelectorAll<HTMLElement>('.welcome-copy,.workspace-copy,.values-grid,.value-card,.join-layout,.join-intro,.join-next,.activities-copy'))
            .filter((node) => node.checkVisibility() && node.scrollHeight > node.clientHeight + 1)
            .map((node) => ({ element: node.className, height: node.clientHeight, contentHeight: node.scrollHeight, children: Array.from(node.children).map((child) => ({ element: child.className, height: child.getBoundingClientRect().height })) }));
          return { pageOverflow: document.documentElement.scrollHeight - innerHeight, mainOverflow: main.scrollHeight - main.clientHeight, stageOverflow: stage.scrollHeight - stage.clientHeight, horizontalOverflow: main.scrollWidth - main.clientWidth, clipped, overflowingContent };
        });
        expect.soft(metrics, `${id}/${selection} at ${size.width}x${size.height}`).toEqual({ pageOverflow: 0, mainOverflow: 0, stageOverflow: 0, horizontalOverflow: 0, clipped: [], overflowingContent: [] });
      };
      await checkFrame();
      const nextAction = page.locator('.journey-footer .journey-next');
      await expect(nextAction).toBeInViewport();
      const actionBounds = await nextAction.boundingBox();
      expect(actionBounds!.height).toBeGreaterThanOrEqual(44);
      expect(actionBounds!.y + actionBounds!.height).toBeLessThanOrEqual(size.height);
      if (id === 'identity') await expect(page.locator('.notice-photo img')).toBeVisible();
      if (id === 'workspace' || id === 'activities') {
        for (const tab of await page.getByRole('tab').all()) {
          await tab.click();
          await checkFrame(await tab.innerText());
        }
      }
      await page.screenshot({ path: `test-results/fit-${id}-${size.width}x${size.height}.png`, animations: 'disabled' });
    }
  }
});

test('popup, hỏi đáp và album vừa khung; toàn bộ ảnh tải được', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Đo nhiều kích thước trên một phiên.');
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const badAssets: string[] = [];
  page.on('response', (response) => { if (/\/(img|tech)\//.test(response.url()) && response.status() >= 400) badAssets.push(response.url()); });
  const assertFit = async (label: string) => {
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    const problems = await dialog.evaluate((root) => {
      const body = root.querySelector<HTMLElement>('.dialog-scroll')!;
      const bounds = body.getBoundingClientRect();
      const containers = [root, ...root.querySelectorAll<HTMLElement>('.dialog-shell,.dialog-scroll,.registration-content,.question-view,.question-content,.question-answer,.question-list,.document-content,.doc-sections,.doc-section,.photo-story-full,.photo-frame,.photo-caption,.photo-thumbnails')];
      const overflows = containers.filter((el) => el.checkVisibility() && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)).map((el) => ({ element: el.className, height: el.clientHeight, contentHeight: el.scrollHeight, width: el.clientWidth, contentWidth: el.scrollWidth }));
      const clipped = Array.from(body.querySelectorAll<HTMLElement>('h2,h3,p,dd,a,button,select,input')).filter((el) => el.checkVisibility() && !el.closest('.sr-only') && el.id !== 'search-count').filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1 || rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || el.scrollHeight > el.clientHeight + 1;
      }).map((el) => el.textContent?.trim() || el.tagName);
      return { overflows, clipped };
    });
    expect(problems, label).toEqual({ overflows: [], clipped: [] });
  };
  for (const size of [{width:320,height:568},{width:390,height:844},{width:766,height:842},{width:920,height:668},{width:1050,height:853},{width:1280,height:720},{width:844,height:390}]) {
    await page.setViewportSize(size);
    await page.goto('/#/commit');
    await page.getByRole('button', {name:'Điều kiện & lịch sinh hoạt',exact:true}).click();
    await assertFit(`registration ${size.width}x${size.height}`);
    await page.screenshot({path:`test-results/dialog-registration-${size.width}x${size.height}.png`,animations:'disabled'});
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await page.getByRole('button',{name:'Ấn phẩm các mùa tuyển trước',exact:true}).click();
    for (const [index, thumb] of (await page.locator('.photo-dialog .photo-thumbnails button').all()).entries()) {
      const picker = page.getByRole('combobox', { name: 'Chọn ảnh trong album' });
      if (await picker.isVisible()) await picker.selectOption(String(index));
      else await thumb.click();
      await page.locator('.photo-dialog .photo-frame > img').evaluate((el: HTMLImageElement) => el.decode());
      await expect(page.locator('.photo-dialog .photo-frame > img')).toHaveCSS('object-fit','contain');
      await assertFit(`recruitment ${size.width}x${size.height}`);
    }
    await page.screenshot({path:`test-results/dialog-album-${size.width}x${size.height}.png`,animations:'disabled'});
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await page.getByRole('button',{name:'Tìm thông tin và hỏi đáp về BCN'}).click();
    await assertFit(`questions ${size.width}x${size.height}`);
    for (let index=0;index<7;index++) {
      const picker=page.getByRole('combobox',{name:'Chọn câu hỏi'});
      if(await picker.isVisible()) await picker.selectOption(String(index));
      else await page.locator('.question-list button').nth(index).click();
      await assertFit(`question ${index+1} ${size.width}x${size.height}`);
    }
    await page.screenshot({path:`test-results/dialog-questions-${size.width}x${size.height}.png`,animations:'disabled'});
    await page.getByRole('searchbox').fill('zzzzzz');
    await assertFit(`empty search ${size.width}x${size.height}`);
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await page.getByRole('navigation',{name:'Điều hướng chính'}).getByRole('link',{name:'Tinh thần',exact:true}).click();
    await page.getByRole('button',{name:/Điều kiện & thời gian/}).click();
    await assertFit(`expectations ${size.width}x${size.height}`);
    await page.screenshot({path:`test-results/dialog-expectations-${size.width}x${size.height}.png`,animations:'disabled'});
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await page.getByRole('navigation',{name:'Điều hướng chính'}).getByRole('link',{name:'Tổng quan',exact:true}).click();
    await page.getByRole('button',{name:'Xem ảnh các buổi học tại BCN',exact:true}).click();
    for (const [index, thumb] of (await page.locator('.photo-dialog .photo-thumbnails button').all()).entries()) {
      const picker = page.getByRole('combobox', { name: 'Chọn ảnh trong album' });
      if (await picker.isVisible()) await picker.selectOption(String(index));
      else await thumb.click();
      await page.locator('.photo-dialog .photo-frame > img').evaluate((el: HTMLImageElement) => el.decode());
      await assertFit(`training ${size.width}x${size.height}`);
    }
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
  }
  expect(badAssets).toEqual([]);
});

test('ảnh tải lỗi có thông báo và tải lại được', async ({page}) => {
  await page.route('**/img/BCN_TuyenCTV_2026.jpg', route => route.abort());
  await page.goto('/#/commit');
  await page.getByRole('button',{name:'Ấn phẩm các mùa tuyển trước',exact:true}).click();
  await expect(page.locator('.photo-dialog .photo-error')).toContainText('Ảnh chưa tải được');
  await page.unroute('**/img/BCN_TuyenCTV_2026.jpg');
  await page.getByRole('button',{name:/Tải lại ảnh/}).click();
  await expect(page.locator('.photo-dialog .photo-error')).toHaveCount(0);
  await page.locator('.photo-dialog .photo-frame > img').evaluate((el: HTMLImageElement) => el.decode());
});

test('nền chuyển động tự chạy khi vào web, chuyển trang và tải lại', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  // A saved choice from the old UI must not prevent automatic startup.
  await page.addInitScript(() => localStorage.setItem('bcn-background-motion', 'off'));
  await page.goto('/#/workspace');
  const background = page.locator('.tech-background');
  const grid = page.locator('.tech-grid');
  const field = page.locator('.tech-constellation');
  const particle = page.locator('.tech-particle').first();
  await expect(background).toHaveAttribute('aria-hidden','true');
  await expect(background).toHaveCSS('pointer-events','none');
  await expect(page.getByRole('button',{name:/[BbTt]ật.*chuyển động/})).toHaveCount(0);
  await expect(page.getByRole('button',{name:/Tắt.*chuyển động/})).toHaveCount(0);
  await expect(grid).toHaveCSS('animation-name','tech-grid-drift');
  await expect(field).toHaveCSS('animation-name','tech-field-drift');
  await expect(particle).toHaveCSS('animation-name','tech-particle-drift');
  const backgroundAnimations = await background.evaluate(el => el.getAnimations({subtree:true}).filter(animation => animation.playState === 'running').length);
  expect(backgroundAnimations, 'Giới hạn chuyển động nền chạy đồng thời').toBeGreaterThan(0);
  expect(backgroundAnimations, 'Giới hạn chuyển động nền chạy đồng thời').toBeLessThanOrEqual(50);
  console.log(`Chuyển động nền đang chạy: ${backgroundAnimations}`);
  const fieldStart = await field.evaluate(el => getComputedStyle(el).transform);
  await expect.poll(() => field.evaluate(el => getComputedStyle(el).transform)).not.toBe(fieldStart);
  const particleStart = await particle.evaluate(el => getComputedStyle(el).transform);
  await expect.poll(() => particle.evaluate(el => getComputedStyle(el).transform)).not.toBe(particleStart);
  await page.getByRole('navigation',{name:'Điều hướng chính'}).getByRole('link',{name:'Hoạt động',exact:true}).click();
  await expect(page).toHaveURL(/#\/activities$/);
  await expect(page.locator('main')).toHaveAttribute('data-transitioning', 'false');
  await expect(field).toHaveCSS('animation-name','tech-field-drift');
  await page.reload();
  await expect(grid).toHaveCSS('animation-name','tech-grid-drift');
  const reloadStart = await grid.evaluate(el => getComputedStyle(el).transform);
  await expect.poll(() => grid.evaluate(el => getComputedStyle(el).transform)).not.toBe(reloadStart);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.getByRole('navigation',{name:'Điều hướng chính'}).getByRole('link',{name:'Hướng học',exact:true}).click();
  await expect(page.locator('main')).toHaveAttribute('data-transitioning','false');
});

test('đổi mục liên tiếp rồi mở ảnh không kẹt chuyển cảnh hoặc tạo lại nền', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/identity');
  const background = await page.locator('.tech-background').elementHandle();
  await page.evaluate(async () => {
    for (const route of ['workspace','activities','culture','commit','identity','workspace','culture','commit']) {
      document.querySelector<HTMLAnchorElement>(`.primary-nav a[href="#/${route}"]`)!.click();
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
  });
  await expect(page).toHaveURL(/#\/commit$/);
  await page.getByRole('button',{name:'Ấn phẩm các mùa tuyển trước',exact:true}).click();
  await expect(page.locator('.photo-dialog')).toBeVisible();
  await expect(page.locator('main')).toHaveAttribute('data-transitioning','false');
  await expect(page.locator('.stage-mount')).toHaveCSS('opacity','1');
  expect(await background!.evaluate(el => el.isConnected)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('.photo-dialog')).not.toBeVisible();
  await expect(page.locator('.tech-grid')).toHaveCSS('animation-play-state','running');
  expect(errors).toEqual([]);
});
