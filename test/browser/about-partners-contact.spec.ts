import { test, expect } from '@playwright/test';

test('About education inquiry opens with a valid selected topic', async ({ page }) => {
  await page.goto('/about');
  const trigger = page.getByRole('button', { name: /Draft an education inquiry note/i });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const topic = dialog.getByLabel('Area of Interest');
  await expect(topic).toHaveValue('Educational Pilot');
  await expect(topic).toBeFocused();
  await expect(dialog).toContainText('does not send messages directly');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('Partners hero and closing inquiries select General Inquiry, never a blank option', async ({ page }) => {
  await page.goto('/partners');
  for (const name of ['Draft an Inquiry Note', 'Draft a Collaboration Note']) {
    const trigger = page.getByRole('button', { name, exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByLabel('Area of Interest')).toHaveValue('General Inquiry');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  }
});

test('Partners individual collaboration buttons preselect their matching topics', async ({ page }) => {
  await page.goto('/partners');
  const options: Array<{ name: RegExp; expected: string }> = [
    { name: /Discuss technical alignment/i, expected: 'Technical Alignment' },
    { name: /Discuss classroom pilots/i, expected: 'Educational Pilot' },
    { name: /Discuss distribution paths/i, expected: 'Commercial Exploration' },
  ];
  for (const { name, expected } of options) {
    const trigger = page.getByRole('button', { name });
    await trigger.click();
    await expect(page.getByRole('dialog').getByLabel('Area of Interest')).toHaveValue(expected);
    await page.keyboard.press('Escape');
  }
});

for (const path of ['/about', '/partners']) {
  for (const width of [320, 375, 1440]) {
    test(path + ' retains mobile readability and navigation at ' + width + 'px', async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(path);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.getByRole('navigation', { name: 'Footer navigation' })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Interactive Demo' }).click();
      await expect(page).toHaveURL(/\/demo$/);
      await expect(page.getByRole('button', { name: 'Start walkthrough' })).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
}
