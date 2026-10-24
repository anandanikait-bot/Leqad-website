import { test, expect } from '@playwright/test';

test('About preview uses the updated Hay\'s Russet asset without becoming a live lesson', async ({ page }) => {
  await page.goto('/about');

  const preview = page.locator('#product-preview img');
  await preview.scrollIntoViewIfNeeded();
  await expect(preview).toHaveAttribute('src', '/assets/cad-lesson-preview-russet.svg');
  await expect(preview).toHaveJSProperty('complete', true);
  await expect(preview).toHaveJSProperty('naturalWidth', 1182);
  await expect(preview).toHaveJSProperty('naturalHeight', 534);

  // Sample an actual rendered pixel in the former orange CTA. This detects
  // broken SVG filters or outdated assets, not only a matching file name.
  const buttonPixel = await preview.evaluate(async image => {
    const img = image as HTMLImageElement;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    return [...ctx.getImageData(950, 303, 1, 1).data];
  });
  expect(buttonPixel).toEqual([121, 51, 39, 255]);

  // The About image remains non-interactive and does not duplicate the CAD demo.
  await expect(page.locator('#product-preview button')).toHaveCount(0);
  await expect(page.locator('#product-preview a[href="/demo"]')).toHaveCount(1);
});
