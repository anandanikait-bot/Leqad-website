import { expect, test } from '@playwright/test';

const tools = [
  { name: 'Sketch tool', label: 'Sketch' },
  { name: 'Extrude 3D tool', label: 'Extrude' },
  { name: 'Corner Rectangle tool', label: 'Rectangle' },
  { name: 'Dimension tool', label: 'Dimension' },
];

for (const width of [320, 375, 1440]) {
  test(`CAD tools stay identifiable and usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/demo');
    const toolbar = page.getByRole('toolbar', { name: 'CAD tools', exact: true });

    for (const tool of tools) {
      const button = toolbar.getByRole('button', { name: tool.name, exact: true });
      await expect(button).toBeDisabled();
      if (width < 640) await expect(button.getByText(tool.label, { exact: true })).toBeVisible();
      const box = (await button.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    expect(await toolbar.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await toolbar.locator(':scope > div').first().evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    for (const name of ['Start walkthrough', 'Select Top Plane']) {
      await page.getByRole('button', { name, exact: true }).click();
    }
    const sketch = toolbar.getByRole('button', { name: 'Sketch tool', exact: true });
    await sketch.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(sketch).toBeFocused();
    expect(await sketch.evaluate(element => {
      const style = getComputedStyle(element);
      return element.matches(':focus-visible') && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
    })).toBe(true);
    await page.keyboard.press('Enter');

    const rectangle = toolbar.getByRole('button', { name: 'Corner Rectangle tool', exact: true });
    await expect(rectangle).toBeEnabled();
    await rectangle.focus();
    await page.keyboard.press('g');
    await expect(rectangle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('sketch-profile')).toHaveCount(0);
    await expect(toolbar.getByRole('button', { name: 'Dimension tool', exact: true })).toBeDisabled();
    await page.keyboard.press('Escape');
    await expect(rectangle).toHaveAttribute('aria-pressed', 'false');

    await page.getByRole('button', { name: 'Draw rectangle', exact: true }).click();
    const dimension = toolbar.getByRole('button', { name: 'Dimension tool', exact: true });
    await expect(dimension).toBeEnabled();
    await page.getByLabel('Width (mm)', { exact: true }).fill('');
    await expect(dimension).toBeDisabled();
    await page.getByLabel('Width (mm)', { exact: true }).fill('40');
    await dimension.focus();
    await page.keyboard.press('d');
    await expect(page.getByRole('button', { name: 'Finish sketch', exact: true })).toBeEnabled();
    await expect(toolbar.getByRole('button', { name: 'Extrude 3D tool', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: 'Finish sketch', exact: true }).click();
    await toolbar.getByRole('button', { name: 'Extrude 3D tool', exact: true }).click();
    await expect(page.getByText('Extrude preview · 40 × 30 × 10 mm', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Create solid', exact: true }).click();
    await expect(page.getByRole('heading', { name: "You've completed the interactive walkthrough." })).toBeVisible();
  });
}
