import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const devices = [
  [320,568], [360,640], [375,667], [390,844], [412,915], [430,932],
  [540,720], [600,960], [768,1024], [820,1180], [1024,768], [1024,600],
  [1280,720], [1440,900], [1920,1080], [2560,1080],
  [568,320], [667,375], [844,390], [932,430],
];

async function assertFrame(page: Page, label: string) {
  const result = await page.locator('main').evaluate(main => {
    const stage = main.querySelector<HTMLElement>('.stage')!;
    const bounds = main.getBoundingClientRect();
    const visible = (el: HTMLElement) => el.checkVisibility() && !el.closest('.sr-only,[aria-hidden="true"]') &&
      !Array.from((function* () { for (let p: HTMLElement | null = el; p && p !== main; p = p.parentElement) yield p; })()).some(p => getComputedStyle(p).clipPath === 'inset(50%)');
    const clipped = Array.from(stage.querySelectorAll<HTMLElement>('h1,h2,p,dl,a,button,.track-icons'))
      .filter(visible).filter(el => {
        const r = el.getBoundingClientRect();
        return r.left < bounds.left - 1 || r.right > bounds.right + 1 || r.top < bounds.top - 1 || r.bottom > bounds.bottom + 1 || el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
      }).map(el => ({ element: el.className || el.tagName, text: el.textContent?.trim() }));
    const containers = [main, stage, ...stage.querySelectorAll<HTMLElement>('.notice-scene,.notice-note,.workspace-copy,.workspace-scene,.activity-tabs,.activities-layout,.activities-copy,.values-grid,.value-card,.join-layout,.join-intro,.join-next')];
    const overflow = containers.filter(el => visible(el) && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)).map(el => ({ element: el.className, height: el.clientHeight, content: el.scrollHeight, width: el.clientWidth, contentWidth: el.scrollWidth }));
    const smallTargets = Array.from(document.querySelectorAll<HTMLElement>('.primary-nav a,.search-trigger,.journey-next,.page-prev,[role="tab"],main .text-action,.photo-controls button'))
      .filter(el => el.checkVisibility() && !el.closest('[aria-hidden="true"]')).filter(el => {
        const r = el.getBoundingClientRect(); return r.width < 43.5 || r.height < 43.5;
      }).map(el => el.textContent?.trim() || el.getAttribute('aria-label'));
    const chrome = Array.from(document.querySelectorAll<HTMLElement>('.os-header,.os-footer,.os-brand small,.primary-nav a,.journey-next'))
      .filter(el => el.checkVisibility()).filter(el => {
        const r = el.getBoundingClientRect(); return r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || el.scrollWidth > el.clientWidth + 1;
      }).map(el => el.className || el.tagName);
    return { clipped, overflow, smallTargets, chrome, pageOverflow: document.documentElement.scrollHeight - innerHeight };
  });
  expect.soft(result, label).toEqual({ clipped: [], overflow: [], smallTargets: [], chrome: [], pageOverflow: 0 });
}

test('ảnh trang Tham gia luôn hiện trên điện thoại, tablet, desktop và màn hình ngang', async ({browser}, info) => {
  test.skip(info.project.name !== 'desktop', 'Dùng một context cho toàn bộ kích thước.');
  test.setTimeout(60_000);
  const context = await browser.newContext({ viewport: {width:375,height:667}, isMobile:true, hasTouch:true, reducedMotion:'reduce' });
  await context.addInitScript(() => localStorage.setItem('bcn-journey-progress-v1','4'));
  const page = await context.newPage();
  try {
    await page.goto('/#/commit');
    await expect(page.locator('main')).toHaveAttribute('data-entrance','done');
    const photo = page.locator('.join-community-photo img');
    await photo.evaluate((image: HTMLImageElement) => image.decode());
    for (const [width,height] of devices) {
      await page.setViewportSize({width,height});
      await expect(photo).toBeVisible();
      await assertFrame(page, `Tham gia ${width}x${height}`);
      const rect = (await photo.boundingBox())!;
      expect.soft(rect.width, `Ảnh ${width}x${height}`).toBeGreaterThanOrEqual(72);
      expect.soft(rect.height, `Ảnh ${width}x${height}`).toBeGreaterThanOrEqual(64);
      if ([320,375,568,1024].includes(width)) await page.screenshot({path:`test-results/join-photo-${width}x${height}.png`});
    }
    for (const [width,height,top,right,bottom,left] of [[375,550,0,0,0,0], [390,844,47,0,34,0], [844,390,0,47,21,47]]) {
      await page.setViewportSize({width,height});
      await page.evaluate(({top,right,bottom,left}) => {
        for (const [side,value] of Object.entries({top,right,bottom,left})) document.documentElement.style.setProperty(`--safe-${side}`, `${value}px`);
      }, {top,right,bottom,left});
      await assertFrame(page, `Tham gia với vùng an toàn ${width}x${height}`);
      await expect(photo).toBeVisible();
      expect.soft((await photo.boundingBox())!.height).toBeGreaterThanOrEqual(64);
    }
  } finally { await context.close(); }
});

for (const [width,height] of devices) {
  test(`responsive ${width}x${height}: năm mục, mọi tab và vùng chạm`, async ({browser}, info) => {
    test.skip(info.project.name !== 'desktop', 'Mỗi cỡ màn hình có context riêng.');
    test.setTimeout(40_000);
    const context = await browser.newContext({ viewport: {width,height}, isMobile: width < 768, hasTouch: width < 1024, reducedMotion:'reduce' });
    await context.addInitScript(() => localStorage.setItem('bcn-journey-progress-v1','4'));
    const page = await context.newPage();
    await page.bringToFront();
    try {
      for (const id of ['identity','workspace','activities','culture','commit']) {
        await page.goto('/#/'+id);
        await expect(page.locator('main')).toHaveAttribute('data-entrance','done');
        await assertFrame(page, `${id} ${width}x${height}`);
        if (id === 'workspace' && width < 768 && height > width && (await page.locator('main').boundingBox())!.height >= 620) {
          expect((await page.locator('.study-photo').boundingBox())!.height).toBeGreaterThan(96);
        }
        for (const tab of await page.getByRole('tab').all()) {
          await tab.click();
          await expect.poll(() => page.locator('main').evaluate(el => el.getAnimations({subtree:true}).length)).toBe(0);
          await assertFrame(page, `${id}/${await tab.innerText()} ${width}x${height}`);
        }
        if ([320,390,768,568].includes(width)) await page.screenshot({path:`test-results/responsive-${id}-${width}x${height}.png`});
      }
    } finally { await context.close(); }
  });
}

async function assertDialog(page: Page, label: string) {
  const result = await page.locator('dialog[open]').evaluate(root => {
    const visible = (el: HTMLElement) => el.checkVisibility() && !el.closest('.sr-only');
    const containers = [root, ...root.querySelectorAll<HTMLElement>('.dialog-shell,.dialog-scroll,.question-view,.question-content,.question-answer,.registration-content,.photo-story-full,.photo-frame,.photo-caption,.photo-picker,.document-content,.doc-sections,.doc-section')];
    const overflow = containers.filter(el => visible(el) && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)).map(el => ({element:el.className,height:el.clientHeight,content:el.scrollHeight,width:el.clientWidth,contentWidth:el.scrollWidth}));
    const body = root.querySelector('.dialog-scroll')!.getBoundingClientRect();
    const clipped = Array.from(root.querySelectorAll<HTMLElement>('.dialog-scroll h2,.dialog-scroll h3,.dialog-scroll p,.dialog-scroll dd,.dialog-scroll button,.dialog-scroll select,.dialog-scroll input'))
      .filter(visible).filter(el => {
        const r = el.getBoundingClientRect(); return r.left < body.left - 1 || r.right > body.right + 1 || r.top < body.top - 1 || r.bottom > body.bottom + 1;
      }).map(el => el.textContent?.trim() || el.tagName);
    const tiny = Array.from(root.querySelectorAll<HTMLElement>('button,input,select')).filter(el => visible(el) && !el.closest('.photo-thumbnails')).filter(el => {
      const r = el.getBoundingClientRect(); return r.height < 43.5 || r.width < 43.5;
    }).map(el => el.getAttribute('aria-label') || el.textContent?.trim());
    const r = root.getBoundingClientRect();
    return {overflow,clipped,tiny,outside:r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1};
  });
  expect.soft(result,label).toEqual({overflow:[],clipped:[],tiny:[],outside:false});
}

for (const [width,height] of [[320,568],[375,667],[390,844],[600,960],[768,1024],[1024,600],[920,668],[568,320],[844,390]]) {
  test(`popup responsive ${width}x${height}: hỏi đáp, ảnh và thông tin`, async ({browser},info) => {
    test.skip(info.project.name !== 'desktop');
    test.setTimeout(45_000);
    const context=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:true,reducedMotion:'reduce'});
    await context.addInitScript(()=>localStorage.setItem('bcn-journey-progress-v1','4'));
    const page=await context.newPage();
    try {
      await page.goto('/#/commit');
      await page.getByRole('button',{name:'Điều kiện & lịch sinh hoạt',exact:true}).click();
      await expect(page.locator('dialog[open]')).toHaveAttribute('data-motion','open');
      await assertDialog(page,'registration');
      await page.keyboard.press('Escape');
      await expect(page.locator('dialog[open]')).toHaveCount(0);
      await page.locator('.search-trigger').click();
      await expect(page.locator('dialog[open]')).toHaveAttribute('data-motion','open');
      for (let index=0;index<7;index++) {
        const picker=page.getByRole('combobox',{name:'Chọn câu hỏi',exact:true});
        if(await picker.isVisible()) await picker.selectOption(String(index));
        else await page.locator('.question-list button').nth(index).click();
        await assertDialog(page,`question ${index}`);
      }
      await page.keyboard.press('Escape');
      await expect(page.locator('dialog[open]')).toHaveCount(0);
      await page.getByRole('button',{name:'Ấn phẩm các mùa tuyển trước',exact:true}).click();
      await expect(page.locator('dialog[open]')).toHaveAttribute('data-motion','open');
      await assertDialog(page,'album');
      const photoPicker=page.getByRole('combobox',{name:'Chọn ảnh trong album'});
      if(await photoPicker.isVisible()) {
        await expect(photoPicker).toHaveCSS('font-size','16px');
        for(let index=0;index<await photoPicker.locator('option').count();index++) {
          await photoPicker.selectOption(String(index));
          await page.locator('.photo-frame > img').evaluate((el:HTMLImageElement)=>el.decode());
        }
      }
      await page.screenshot({path:`test-results/responsive-dialog-${width}x${height}.png`});
    } finally {await context.close();}
  });
}

test('mobile: safe area và bàn phím không che hộp tìm kiếm', async ({page},info) => {
  test.skip(info.project.name !== 'mobile');
  await page.addInitScript(()=>{
    localStorage.setItem('bcn-journey-progress-v1','4');
    const state={height:844};
    (window as Window & {keyboardViewport?: typeof state}).keyboardViewport=state;
    Object.defineProperty(window.visualViewport,'height',{get:()=>state.height});
  });
  await page.goto('/#/identity');
  await page.locator('.newcomer-app').evaluate(app=>{
    (app as HTMLElement).style.setProperty('--safe-top','47px');
    (app as HTMLElement).style.setProperty('--safe-bottom','34px');
  });
  await expect(page.locator('main')).toHaveAttribute('data-entrance','done');
  await assertFrame(page,'notched portrait');
  await page.locator('.search-trigger').click();
  const search=page.getByRole('searchbox');
  await search.fill('dang ky');
  await page.evaluate(()=>{
    (window as Window & {keyboardViewport?:{height:number}}).keyboardViewport!.height=350;
    window.visualViewport!.dispatchEvent(new Event('resize'));
  });
  await expect(page.locator('.newcomer-app')).toHaveAttribute('data-keyboard','true');
  await expect(search).toBeInViewport();
  await expect(search).toHaveCSS('font-size','16px');
  const keyboardDialog = await page.locator('dialog[open]').boundingBox();
  expect(keyboardDialog!.y + keyboardDialog!.height).toBeLessThanOrEqual(350);
  await assertDialog(page,'keyboard open');
  await search.fill('zzzzzz');
  await expect(page.locator('.search-empty')).toBeVisible();
  await assertDialog(page,'keyboard empty results');
  await search.fill('dang ky');
  await search.press('Enter');
  await page.evaluate(()=>{
    (window as Window & {keyboardViewport?:{height:number}}).keyboardViewport!.height=844;
    window.visualViewport!.dispatchEvent(new Event('resize'));
  });
  await expect(page.locator('.newcomer-app')).toHaveAttribute('data-keyboard','false');
  await expect(page.locator('.question-answer')).toBeVisible();
  await expect(page.locator('.question-answer')).toContainText('K23');
});

test('safe area: đủ năm mục trên máy có notch và khi xoay ngang', async ({browser},info) => {
  test.skip(info.project.name !== 'desktop');
  test.setTimeout(40_000);
  for (const [width,height,insets] of [
    [390,844,{top:47,bottom:34,left:0,right:0}],
    [844,390,{top:0,bottom:21,left:47,right:47}],
    [320,568,{top:20,bottom:0,left:0,right:0}],
  ] as const) {
    const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
    await context.addInitScript(()=>localStorage.setItem('bcn-journey-progress-v1','4'));
    const page=await context.newPage();
    try {
      for (const id of ['identity','workspace','activities','culture','commit']) {
        await page.goto('/#/'+id);
        await page.locator('.newcomer-app').evaluate((app,insets)=>{
          for(const [side,value] of Object.entries(insets)) (app as HTMLElement).style.setProperty('--safe-'+side,value+'px');
        },insets);
        await expect(page.locator('main')).toHaveAttribute('data-entrance','done');
        await assertFrame(page,`safe area ${id} ${width}x${height}`);
      }
    } finally {await context.close();}
  }
});
