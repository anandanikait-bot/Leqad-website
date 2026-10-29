import { expect, test } from '@playwright/test';

const labels = ['40 mm', '30 mm', '22 mm [EXT]'];

for (const width of [320, 375, 1440]) {
  test(`CAD dimensions retain small-text contrast across faces, rotation, and sketch mode at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      const clearRect = CanvasRenderingContext2D.prototype.clearRect;
      const fillText = CanvasRenderingContext2D.prototype.fillText;
      const luminance = (rgb: number[]) => rgb.reduce((sum, value, i) => {
        const channel = value / 255;
        return sum + (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) * [0.2126, 0.7152, 0.0722][i];
      }, 0);
      CanvasRenderingContext2D.prototype.clearRect = function (...args) {
        if (this.canvas.closest('[aria-label="Interactive 3D CAD Geometry Visualization"]')) {
          this.canvas.dataset.dimensionContrast = '{}';
        }
        return clearRect.apply(this, args);
      };
      CanvasRenderingContext2D.prototype.fillText = function (text, x, y, ...args) {
        if (['40 mm', '30 mm', '22 mm [EXT]'].includes(text)) {
          const metrics = this.measureText(text);
          const transform = this.getTransform();
          const left = Math.floor((x - metrics.actualBoundingBoxLeft) * transform.a);
          const top = Math.floor((y - metrics.actualBoundingBoxAscent) * transform.d);
          const width = Math.ceil((metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight) * transform.a);
          const height = Math.ceil((metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * transform.d);
          // Sample the real painted background before glyph antialiasing changes it.
          const background = this.getImageData(left, top, width, height).data;
          const foreground = luminance(String(this.fillStyle).slice(1).match(/../g)!.map(value => parseInt(value, 16)));
          let contrast = Infinity;
          for (let i = 0; i < background.length; i += 4) {
            const surface = luminance(Array.from(background.slice(i, i + 3)));
            contrast = Math.min(contrast, (Math.max(surface, foreground) + 0.05) / (Math.min(surface, foreground) + 0.05));
          }
          const measured = JSON.parse(this.canvas.dataset.dimensionContrast || '{}');
          measured[text] = { contrast, x, y };
          this.canvas.dataset.dimensionContrast = JSON.stringify(measured);
        }
        return fillText.call(this, text, x, y, ...args);
      };
    });
    await page.goto('/');
    const artwork = page.getByRole('region', { name: 'Interactive 3D CAD Geometry Visualization' });
    const canvas = artwork.locator('canvas');
    await artwork.scrollIntoViewIfNeeded();
    const measurements = async () => JSON.parse(await canvas.getAttribute('data-dimension-contrast') || '{}') as Record<string, { contrast: number; x: number; y: number }>;
    const assertContrast = async (expectedLabels: string[]) => {
      await expect.poll(async () => Object.keys(await measurements()).sort()).toEqual([...expectedLabels].sort());
      for (const label of expectedLabels) {
        expect((await measurements())[label].contrast, `${label} background contrast`).toBeGreaterThanOrEqual(4.5);
      }
    };

    await assertContrast(labels);
    const original = await measurements();
    const box = (await artwork.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 150, box.y + box.height / 2 + 45, { steps: 8 });
    await page.mouse.up();
    await expect.poll(async () => (await measurements())['40 mm']?.x).not.toBe(original['40 mm'].x);
    await assertContrast(labels);
    await artwork.getByRole('button', { name: '3D Extrude: switch to 2D Sketch' }).click();
    await assertContrast(labels.slice(0, 2));
    await artwork.getByRole('button', { name: '2D Sketch: switch to 3D Extrusion' }).click();
    await assertContrast(labels);
  });
}
