import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const p = await b.newPage(); await p.setViewport({ width: 1024, height: 500 });
await p.goto('http://localhost:4324/store/feature.html', { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: '/Users/linoybenshitrit/Public/app-24/store/play/feature-graphic-1024x500.png' }); await b.close();
