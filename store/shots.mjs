// Renders App Store / Play screenshots of the running app (python3 -m http.server 4324 in app-24).
// Usage: node store/shots.mjs   ->  store/shots/*.png at 1284x2778 (iPhone 6.7")
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'fs';

const APP = 'http://localhost:4324/index.html';
const PLAY = process.argv[2] === 'play';
// App Store: 428x926 @3 = 1284x2778. Google Play needs at most 2:1, so 360x720 @3 = 1080x2160.
const VIEW = PLAY ? { width: 360, height: 720 } : { width: 428, height: 926 };
const OUT = new URL(PLAY ? './play/' : './shots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const H = 3600e3, now = Date.now();
const demo = {
  name: 'לינוי', threshold: 200, onboarded: true,
  items: [
    { id: 'w1', name: 'נעלי סניקרס', price: 349, store: 'ZARA', link: '', photo: '', place: 'אינסטגרם', feelings: ['עייפה'], demon: 'temp', createdAt: now - 17 * H - 22 * 60e3, status: 'waiting' },
    { id: 'w2', name: 'מעיל צמר', price: 640, store: '', link: '', photo: '', place: 'אתר', feelings: ['משועממת'], demon: 'rel', createdAt: now - 25 * H, status: 'waiting' },
    { id: 's1', name: 'שמלת ערב', price: 420, store: '', link: '', photo: '', place: 'אינסטגרם', feelings: ['עייפה'], demon: 'comp', createdAt: now - 3 * 24 * H, status: 'skipped', decidedAt: now - 2 * 24 * H },
    { id: 's2', name: 'אוזניות', price: 590, store: '', link: '', photo: '', place: 'אתר', feelings: ['ראיתי אצל חברה'], demon: 'herd', createdAt: now - 4 * 24 * H, status: 'skipped', decidedAt: now - 3 * 24 * H },
    { id: 's3', name: 'תיק עור', price: 380, store: '', link: '', photo: '', place: 'חנות', feelings: ['עייפה', 'לחוצה'], demon: 'temp', createdAt: now - 5 * 24 * H, status: 'skipped', decidedAt: now - 4 * 24 * H },
    { id: 'b1', name: 'נעלי ריצה', price: 450, store: '', link: '', photo: '', place: 'חנות', feelings: ['פחד לפספס'], demon: 'temp', createdAt: now - 6 * 24 * H, status: 'bought', decidedAt: now - 5 * 24 * H },
  ],
};

const shots = [
  { name: '01-splash', data: null, wait: 2300 },
  { name: '02-home', data: demo, run: "focusId='w1'; go('home');" },
  { name: '03-add', data: demo, run: "draft=null; go('add'); draft.name='נעלי סניקרס'; draft.price='349'; draft.feelings=['עייפה']; draft.demon='temp'; draft.step=2; render();" },
  { name: '04-decide', data: demo, run: "go('decide','w2');" },
  { name: '05-insights', data: demo, run: "insTab='week'; go('insights');" },
  { name: '06-skip', data: demo, run: "go('home'); celebrate('skip','השדון ניסה ולא הצליח.', money(380)+' נשארו אצלך. סך הכול: '+money(1390));", wait: 1800 },
];

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true, args: ['--lang=he-IL'],
});
for (const s of shots) {
  const page = await browser.newPage();
  await page.setViewport({ ...VIEW, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.goto(APP, { waitUntil: 'networkidle0' });
  await page.evaluate(d => { localStorage.clear(); if (d) localStorage.setItem('app24.v1', JSON.stringify(d)); }, s.data);
  await page.reload({ waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  if (s.run) await page.evaluate(s.run);
  await new Promise(r => setTimeout(r, s.wait || 900));
  await page.screenshot({ path: OUT + s.name + '.png' });
  await page.close();
  console.log('saved', s.name);
}
await browser.close();
