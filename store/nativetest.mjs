import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const p = await b.newPage();
const errors = []; p.on('pageerror', e => errors.push(String(e)));
// A bare native bridge like the real one on iOS: no registerPlugin.
await p.evaluateOnNewDocument(() => {
  window.__calls = []; window.webkit = { messageHandlers: { bridge: { postMessage: m => window.__calls.push(['post', m && m.methodName]) } } };
  window.Capacitor = {
    isNativePlatform: () => true, getPlatform: () => 'ios', isPluginAvailable: n => n === 'LocalNotifications',
    PluginHeaders: [{ name: 'LocalNotifications', methods: [
      { name: 'schedule', rtype: 'promise' }, { name: 'cancel', rtype: 'promise' },
      { name: 'checkPermissions', rtype: 'promise' }, { name: 'requestPermissions', rtype: 'promise' },
      { name: 'addListener', rtype: 'callback' }, { name: 'removeAllListeners', rtype: 'promise' } ] }],
    nativePromise: (plugin, method, opts) => { window.__calls.push([plugin, method]);
      if (method === 'checkPermissions') return Promise.resolve({ display: 'prompt' });
      if (method === 'requestPermissions') return Promise.resolve({ display: 'granted' });
      return Promise.resolve({}); },
    nativeCallback: (plugin, method) => { window.__calls.push([plugin, method]); return 'cb1'; },
  };
});
for (const step of ['fresh', 'onboarded']) {
  await p.goto('http://localhost:4350/index.html', { waitUntil: 'networkidle0' });
  if (step === 'onboarded') {
    await p.evaluate(() => localStorage.setItem('app24.v1', JSON.stringify({ name: 'x', threshold: 200, onboarded: true, items: [] })));
    await p.reload({ waitUntil: 'networkidle0' });
  } else await p.evaluate(() => localStorage.clear()), await p.reload({ waitUntil: 'networkidle0' });
  const r = await p.evaluate(() => ({ native: IS_NATIVE, notif: !!Notif, text: document.querySelector('#app').innerText.slice(0, 40).replace(/\n/g, ' ') }));
  console.log(step, JSON.stringify(r));
}
await p.evaluate(() => { draft = null; go('add'); draft.name = 'נעליים'; draft.price = '400'; draft.step = 3; render(); document.querySelector('[data-act=save]').click(); });
await new Promise(r => setTimeout(r, 500));
console.log('native calls:', JSON.stringify(await p.evaluate(() => window.__calls.map(c => c[1]))));
console.log('page errors:', JSON.stringify(errors));
await b.close();
