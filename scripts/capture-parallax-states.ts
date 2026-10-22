import { chromium, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.SCREENSHOT_ORIGIN || 'http://127.0.0.1:4173';
const executablePath = [process.env.CHROMIUM_PATH, '/usr/bin/chromium', '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell']
  .find(path => path && existsSync(path));
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
await mkdir('docs/screenshots/parallax', { recursive: true });
const evidence: object[] = [];
try {
  for (const [device, width] of [['desktop', 1440], ['mobile', 375]] as const) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, hasTouch: device === 'mobile', reducedMotion: 'no-preference' });
    for (const [name, route, selector] of [
      ['about-preview', '/about', '#product-preview img'],
      ['about-grid', '/about', '[aria-hidden="true"][data-parallax-travel="20"]'],
      ['about-secondary', '/about', '[data-parallax-direction="-1"]'],
      ['partners-grid', '/partners', '[data-parallax-travel="20"]'],
      ['partners-secondary', '/partners', '[data-parallax-direction="-1"]'],
    ]) {
      await page.goto(origin + route);
      await page.evaluate(() => document.fonts.ready);
      const layer = page.locator(selector);
      const section = layer.locator('..');
      await section.scrollIntoViewIfNeeded();
      // Let native scroll events reach the existing Lenis subscription.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const sample = () => layer.evaluate(element => {
        const text = element.parentElement!.querySelector('p, h2')!;
        return {
          offset: new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
          textTop: text.getBoundingClientRect().top + scrollY,
          scrollY,
          maxTravel: Number((element as HTMLElement).dataset.parallaxMobileTravel && window.innerWidth < 640
            ? (element as HTMLElement).dataset.parallaxMobileTravel
            : (element as HTMLElement).dataset.parallaxTravel),
        };
      });
      const before = await sample();
      await page.evaluate(() => scrollBy(0, 160));
      await expect.poll(async () => (await sample()).offset).not.toBe(before.offset);
      const after = await sample();
      expect(Math.abs(after.offset)).toBeLessThanOrEqual(after.maxTravel / 2);
      expect(after.textTop).toBeCloseTo(before.textTop, 1);
      await section.screenshot({ path: `docs/screenshots/parallax/${name}-${device}.png`, animations: 'disabled' });
      evidence.push({ name, device, before, after });
    }
    await page.close();
  }
  await writeFile('docs/screenshots/parallax/scroll-measurements.json', JSON.stringify(evidence, null, 2) + '\n');
} finally {
  await browser.close();
}
