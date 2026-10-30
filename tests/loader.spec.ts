import { expect, test } from '@playwright/test';

test('robot tự khởi động, bàn giao sang nội dung và không chạy lại khi đổi mục', async ({page}, info) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/#/identity', {waitUntil:'domcontentloaded'});
  const loader = page.locator('#entry-loader');
  await expect(loader).toBeVisible();
  await expect(loader).toHaveAttribute('data-phase','booting');
  await expect(page.locator('.newcomer-app')).toHaveAttribute('inert','');
  const motion = await loader.evaluate(root => {
    const head = root.querySelector('.entry-loader__head')!;
    const animation = head.getAnimations()[0];
    const time = animation.currentTime;
    animation.pause();
    animation.currentTime = 0;
    const start = getComputedStyle(head).transform;
    animation.currentTime = 300;
    const middle = getComputedStyle(head).transform;
    animation.currentTime = time;
    animation.play();
    return {start,middle};
  });
  expect(motion.start).not.toBe(motion.middle);
  await expect(loader.locator('.entry-loader__eyes')).toHaveCSS('opacity','1');
  await expect(loader.locator('.entry-loader__greeting')).toHaveCSS('opacity','1');
  await page.screenshot({path:`test-results/entry-robot-${info.project.name}.png`});
  await expect(loader).toHaveCount(0);
  await expect(page.locator('.newcomer-app')).not.toHaveAttribute('inert');
  await expect(page.locator('main')).toHaveAttribute('data-entrance','done');
  await page.getByRole('button',{name:'Xem tiếp: Hướng học',exact:true}).click();
  await expect(page).toHaveURL(/#\/workspace$/);
  await expect(loader).toHaveCount(0);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(loader).toBeVisible();
  await expect(loader).toHaveCount(0);
});

test('lắp đúng thứ tự thân, đầu, hai tay, chân rồi mới sáng đèn và chào', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.addInitScript(() => {
    type Frame = {step:string; opacity:Record<string,number>};
    const frames: Frame[] = [];
    (window as Window & {assemblyFrames?:Frame[]}).assemblyFrames = frames;
    let last = '';
    const observer = new MutationObserver(() => {
      const loader = document.getElementById('entry-loader');
      const step = loader?.dataset.step;
      if (!loader || !step || step === last) return;
      last = step;
      requestAnimationFrame(() => {
        const parts = ['body','head','arm-left','arm-right','legs','eyes','greeting'];
        frames.push({step,opacity:Object.fromEntries(parts.map(part => [part,Number(getComputedStyle(loader.querySelector(`.entry-loader__${part}`)!).opacity)]))});
      });
    });
    observer.observe(document, {subtree:true,childList:true,attributes:true,attributeFilter:['data-step']});
  });
  await page.goto('/', {waitUntil:'domcontentloaded'});
  await expect(page.locator('#entry-loader')).toHaveCount(0);
  const frames = await page.evaluate(() => (window as Window & {assemblyFrames?:{step:string;opacity:Record<string,number>}[]}).assemblyFrames!);
  expect(frames.map(frame=>frame.step)).toEqual(['body','head','left-arm','right-arm','legs','power','hello']);
  const state = (step:string) => frames.find(frame=>frame.step===step)!.opacity;
  expect(state('body')).toMatchObject({body:1,head:0,'arm-left':0,'arm-right':0,legs:0,eyes:0,greeting:0});
  expect(state('left-arm')).toMatchObject({head:1,'arm-right':0,legs:0,eyes:0,greeting:0});
  expect(state('right-arm')).toMatchObject({'arm-left':1,legs:0,eyes:0,greeting:0});
  expect(state('legs')).toMatchObject({'arm-left':1,'arm-right':1,eyes:0,greeting:0});
  expect(state('power')).toMatchObject({head:1,'arm-left':1,'arm-right':1,legs:1,greeting:0});
  expect(state('hello')).toMatchObject({head:1,'arm-left':1,'arm-right':1,legs:1,eyes:1});
});

test('màn chào hiện ngay cả khi phần mã của trang chưa tải xong', async ({page}) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/src/main.tsx', async route => { await gate; await route.continue(); });
  try {
    await page.goto('/', {waitUntil:'commit'});
    await expect(page.locator('#entry-loader')).toBeVisible();
    await expect(page.locator('#entry-loader')).toHaveAttribute('data-phase','waiting');
    await expect(page.locator('.newcomer-app')).toHaveCount(0);
  } finally { release(); }
  await expect(page.locator('#entry-loader')).toHaveCount(0);
  await expect(page.getByRole('heading',{level:1})).toHaveText('Ban Công Nghệ');
});

test('màn chào vừa điện thoại nhỏ và xoay ngang, giảm chuyển động vẫn vào được trang', async ({page},info) => {
  test.skip(info.project.name !== 'mobile');
  await page.setViewportSize({width:320,height:568});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/', {waitUntil:'domcontentloaded'});
  const assertFits = async () => {
    const outside = await page.locator('#entry-loader').evaluate(root => Array.from(root.querySelectorAll('.entry-loader__scene,strong,p,.entry-loader__header')).filter(el => {
      const box = el.getBoundingClientRect();
      return box.left < 0 || box.top < 0 || box.right > innerWidth || box.bottom > innerHeight;
    }).map(el => el.className));
    expect(outside).toEqual([]);
  };
  await assertFits();
  await page.setViewportSize({width:568,height:320});
  await assertFits();
  await page.screenshot({path:'test-results/entry-robot-landscape.png'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('#entry-loader')).toHaveCount(0);
  await expect(page.locator('.newcomer-app')).not.toHaveAttribute('inert');
  await expect(page.getByRole('heading',{level:1})).toContainText('Ban Công Nghệ');
});

test('Tab vào ngay nội dung, không giữ người dùng bàn phím trên màn chào', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/', {waitUntil:'domcontentloaded'});
  await expect(page.locator('#entry-loader')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('#entry-loader')).toHaveCount(0);
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});
