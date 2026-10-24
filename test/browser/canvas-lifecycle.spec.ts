import { test, expect } from '@playwright/test';

const artwork = '[aria-label="Interactive 3D CAD Geometry Visualization"] canvas';

test('CAD frames balance canvas state saves and restores', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['save', 'restore'] as const) {
      const original = CanvasRenderingContext2D.prototype[method];
      CanvasRenderingContext2D.prototype[method] = function () {
        if (this.canvas.closest('[aria-label="Interactive 3D CAD Geometry Visualization"]')) {
          this.canvas.dataset.balance = String(Number(this.canvas.dataset.balance || 0) + (method === 'save' ? 1 : -1));
        }
        return original.call(this);
      };
    }
  });
  await page.goto('/');
  await expect(page.locator(artwork)).toHaveAttribute('data-balance', '0');
});

test('metallic shader pauses on visibility change, resumes, and releases its buffer', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['drawArrays', 'createBuffer', 'deleteBuffer'] as const) {
      const original = WebGL2RenderingContext.prototype[method];
      Object.defineProperty(WebGL2RenderingContext.prototype, method, { value: function (...args: unknown[]) {
        document.documentElement.dataset[method] = String(Number(document.documentElement.dataset[method] || 0) + 1);
        return Reflect.apply(original, this, args);
      } });
    }
  });
  await page.goto('/');
  await expect(page.locator('[data-metallic-cta]')).toHaveAttribute('data-shader-status', 'ready');
  const frames = () => page.evaluate(() => Number(document.documentElement.dataset.drawArrays || 0));
  await expect.poll(frames).toBeGreaterThan(2);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const hiddenFrames = await frames();
  await page.waitForTimeout(200);
  expect(await frames()).toBe(hiddenFrames);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(frames).toBeGreaterThan(hiddenFrames);
  await page.getByRole('link', { name: 'Explore Interactive Demo', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-delete-buffer', '1');
});

test('shader program allocation failure releases compiled shaders and keeps navigation', async ({ page }) => {
  await page.addInitScript(() => {
    const original = WebGL2RenderingContext.prototype.deleteShader;
    WebGL2RenderingContext.prototype.deleteShader = function (shader) {
      document.documentElement.dataset.deletedShaders = String(Number(document.documentElement.dataset.deletedShaders || 0) + 1);
      return original.call(this, shader);
    };
    Object.defineProperty(WebGL2RenderingContext.prototype, 'createProgram', { value: () => null });
  });
  await page.goto('/');
  await expect(page.locator('[data-metallic-cta]')).toHaveAttribute('data-shader-status', 'fallback');
  await expect(page.locator('html')).toHaveAttribute('data-deleted-shaders', '2');
  await page.getByRole('link', { name: 'Explore Interactive Demo', exact: true }).click();
  await expect(page).toHaveURL(/\/demo$/);
});
