import { test, expect } from '@playwright/test';

test('returning to a tab does not redraw the offscreen footer', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.fillRect;
    const counters = window as unknown as { footerDraws: number };
    counters.footerDraws = 0;
    CanvasRenderingContext2D.prototype.fillRect = function (...args) {
      if (this.canvas.closest('footer')) counters.footerDraws++;
      return original.apply(this, args);
    };
  });
  await page.goto('/about');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('footer canvas').scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => page.locator('footer canvas').evaluate(canvas => canvas.getBoundingClientRect().top)).toBeGreaterThan(900);
  await page.waitForTimeout(150); // Allow IntersectionObserver to report the offscreen state.
  const draws = await page.evaluate(() => (window as unknown as { footerDraws: number }).footerDraws);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => (window as unknown as { footerDraws: number }).footerDraws)).toBe(draws);
});
