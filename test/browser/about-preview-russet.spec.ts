import { test, expect } from '@playwright/test';

test('About preview renders the current navy/ivory/russet illustration, not a fake live lesson', async ({ page }) => {
  await page.goto('/about');

  const preview = page.locator('#product-preview img');
  await preview.scrollIntoViewIfNeeded();
  await expect(preview).toHaveAttribute('src', '/assets/cad-lesson-illustration.svg');
  await expect(preview).toHaveJSProperty('complete', true);
  await expect(preview).toHaveJSProperty('naturalWidth', 1182);
  await expect(preview).toHaveJSProperty('naturalHeight', 534);

  // Sample a rendered pixel of the actual illustration, not merely its filename.
  const buttonPixel = await preview.evaluate(async image => {
    const img = image as HTMLImageElement;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    return [...ctx.getImageData(950, 390, 1, 1).data];
  });
  expect(buttonPixel).toEqual([121, 51, 39, 255]);

  // The image is a navigation link, not another working CAD interface.
  await expect(page.locator('#product-preview button')).toHaveCount(0);
  await expect(page.locator('#product-preview a[href="/demo"]')).toHaveCount(1);
  await expect(page.locator('#product-preview').getByRole('link', { name: 'Explore Interactive Demo' })).toHaveCount(0);
  await expect(page.getByText('Illustrated preview — select to try the real demo')).toBeVisible();
  await expect(page.locator('#product-preview img')).toHaveAttribute(
    'alt', /Illustration of a 40 by 30 millimeter rectangle.*pictured controls are not interactive/
  );
});

for (const width of [320, 375, 768, 1440]) {
  test(`About illustration makes clear it is a preview and opens the real demo at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/about');
    const region = page.locator('#product-preview');
    const screenshotLink = region.getByRole('link', {
      name: 'Open the interactive CAD demo from this illustrated preview', exact: true
    });
    await screenshotLink.scrollIntoViewIfNeeded();
    await expect(screenshotLink).toBeVisible();
    await expect(region.getByText('Open interactive demo', { exact: true })).toBeVisible();
    await expect(page.locator('#product-preview').getByRole('button', {
      name: 'Start sketch', exact: true
    })).toHaveCount(0);

    // Click over the illustration, where the pictured (nonfunctional) controls appear:
    // it opens the real lesson instead of silently doing nothing.
    const bounds = await screenshotLink.boundingBox();
    expect(bounds).not.toBeNull();
    await screenshotLink.click({ position: { x: bounds!.width * 0.80, y: bounds!.height * 0.58 } });
    await expect(page).toHaveURL(/\/demo$/);
    await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
  });
}

test('the About illustration link is keyboard operable with a visible focus indicator', async ({ page }) => {
  await page.goto('/about');
  const screenshotLink = page.getByRole('link', {
    name: 'Open the interactive CAD demo from this illustrated preview', exact: true
  });
  await screenshotLink.focus();
  await expect(screenshotLink).toBeFocused();
  await expect(screenshotLink).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
});
