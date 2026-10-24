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

  // The image is a navigation link, not another working CAD interface.
  await expect(page.locator('#product-preview button')).toHaveCount(0);
  await expect(page.locator('#product-preview a[href="/demo"]')).toHaveCount(2);
  await expect(page.getByText('Screenshot preview — not an interactive CAD window')).toBeVisible();
  await expect(page.locator('#product-preview img')).toHaveAttribute(
    'alt', /Static screenshot.*pictured controls are not interactive/
  );
});

for (const width of [320, 375, 768, 1440]) {
  test(`About screenshot makes clear it is a preview and opens the real demo at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/about');
    const region = page.locator('#product-preview');
    const screenshotLink = region.getByRole('link', {
      name: 'Open the interactive CAD demo from this static screenshot', exact: true
    });
    await screenshotLink.scrollIntoViewIfNeeded();
    await expect(screenshotLink).toBeVisible();
    await expect(region.getByText('Open interactive demo', { exact: true })).toBeVisible();
    await expect(page.locator('#product-preview').getByRole('button', {
      name: 'Start sketch', exact: true
    })).toHaveCount(0);

    // Click on the part of the image where a fake CAD control is pictured:
    // it opens the real lesson instead of silently doing nothing.
    const bounds = await screenshotLink.boundingBox();
    expect(bounds).not.toBeNull();
    await screenshotLink.click({ position: { x: bounds!.width * 0.80, y: bounds!.height * 0.58 } });
    await expect(page).toHaveURL(/\/demo$/);
    await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
  });
}

test('the About screenshot link is keyboard operable with a visible focus indicator', async ({ page }) => {
  await page.goto('/about');
  const screenshotLink = page.getByRole('link', {
    name: 'Open the interactive CAD demo from this static screenshot', exact: true
  });
  await screenshotLink.focus();
  await expect(screenshotLink).toBeFocused();
  await expect(screenshotLink).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
});
