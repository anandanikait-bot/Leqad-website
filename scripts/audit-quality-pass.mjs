import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const origin = process.env.SCREENSHOT_ORIGIN || 'http://127.0.0.1:4173';
const label = process.env.QUALITY_LABEL || 'after';
const output = `docs/screenshots/quality-pass/${label}`;
await mkdir(output, { recursive: true });
const executablePath = [process.env.CHROMIUM_PATH, '/usr/bin/chromium'].find(p => p && existsSync(p));
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const results = [];
try {
  for (const width of [320, 375, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    for (const [name, route] of [['home','/'],['demo','/demo'],['about','/about'],['partners','/partners'],['unknown','/quality-pass-missing']]) {
      await page.goto(origin + route);
      await page.evaluate(() => document.fonts.ready);
      if (await page.locator('footer canvas').count()) {
        await page.locator('footer canvas').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => {
          const c = document.querySelector('footer canvas');
          if (!c || !c.width || !c.height) return false;
          const d = c.getContext('2d').getImageData(0,0,c.width,c.height).data;
          let ink = 0;
          for (let i=0;i<d.length;i+=4) if (d[i]>150 && d[i+1]>150) ink++;
          return ink>100;
        });
      }
      await page.waitForTimeout(100);
      await page.evaluate(() => scrollTo(0,0));
      await page.screenshot({ path: `${output}/${name}-${width}.png`, fullPage: true, animations: 'disabled' });
      results.push({ width, route, ...await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, headings: [...document.querySelectorAll('h1')].map(e=>e.textContent), fonts: document.fonts.status })) });
      if (route === '/partners') {
        const trigger = page.getByRole('button', { name: /Prepare an Inquiry|Draft an Inquiry|Contact Leqad/i }).first();
        if (await trigger.count()) {
          await trigger.click();
          await page.getByRole('dialog').waitFor();
          await page.screenshot({ path: `${output}/dialog-${width}.png`, animations: 'disabled' });
          await page.keyboard.press('Escape');
        }
        if (width < 1024) {
          await page.getByRole('button', { name: 'Open navigation menu' }).click();
          await page.screenshot({ path: `${output}/menu-${width}.png`, animations: 'disabled' });
        }
      }
    }
    await page.close();
  }
  // Three cold-page samples with motion enabled. These are local lab measurements,
  // not Lighthouse scores or estimates of production user experience.
  const performance = [];
  for (let sample = 0; sample < 3; sample++) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => {
      window.__quality = { cls: 0, longTasks: [], frames: 0 };
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__quality.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.__quality.longTasks.push(e.duration); }).observe({ type: 'longtask', buffered: true });
      const raf = window.requestAnimationFrame;
      window.requestAnimationFrame = function(callback) { return raf.call(window, time => { window.__quality.frames++; callback(time); }); };
    });
    await page.goto(origin);
    await page.waitForTimeout(5000);
    const visible = await page.evaluate(() => ({ ...window.__quality, fontStatus: document.fonts.status, fonts: performance.getEntriesByType('resource').filter(e => /woff/.test(e.name)).map(e=>({name:e.name.split('/').pop(),duration:e.duration,transferSize:e.transferSize})) }));
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const start = await page.evaluate(() => window.__quality.frames);
    await page.waitForTimeout(3000);
    performance.push({ sample, visible, offscreenRafCallbacksOver3s: await page.evaluate(start => window.__quality.frames - start,start) });
    await page.close();
  }
  await writeFile(`${output}/performance.json`, JSON.stringify(performance,null,2)+'\n');
} finally {
  await writeFile(`${output}/responsive.json`, JSON.stringify(results,null,2)+'\n');
  await browser.close();
}
