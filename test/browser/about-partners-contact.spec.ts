import { test, expect } from '@playwright/test';

test('About education inquiry opens with a valid selected topic', async ({ page }) => {
  await page.goto('/about');
  const trigger = page.getByRole('button', { name: /Contact Leqad/i });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const topic = dialog.getByLabel('Area of Interest');
  await expect(topic).toHaveValue('Educational Pilot');
  await expect(topic).toBeFocused();
  await expect(dialog).toContainText('Your inquiry is submitted through Formspree');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('Partners has one visible drafting action and clearly states contact availability', async ({ page }) => {
  await page.goto('/partners');
  const trigger = page.getByRole('button', { name: 'Contact Leqad', exact: true });
  await expect(trigger).toBeVisible();
  await expect(page.getByText('Send your inquiry directly to Leqad support.', { exact: false })).toBeVisible();
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByLabel('Area of Interest')).toHaveValue('General Inquiry');
  await expect(dialog).toContainText('Your inquiry is submitted through Formspree');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('inquiry topics remain selectable, copy the actual note, and never submit a request', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const submissions: string[] = [];
  page.on('request', request => {
    if (request.method() !== 'GET') submissions.push(request.url());
  });
  await page.goto('/partners');
  await page.getByRole('button', { name: 'Contact Leqad', exact: true }).click();
  const dialog = page.getByRole('dialog');
  for (const topic of ['Technical Alignment', 'Educational Pilot', 'Commercial Exploration']) {
    await dialog.getByLabel('Area of Interest').selectOption(topic);
    await dialog.getByLabel('Brief Note or Context').fill('Discuss a first-sketch evaluation.');
    await dialog.getByRole('button', { name: 'Copy Inquiry Note' }).click();
    await expect(dialog.getByRole('status')).toContainText('Inquiry note copied to clipboard.');
    const note = await page.evaluate(() => navigator.clipboard.readText());
    expect(note).toContain('Topic: ' + topic);
    expect(note).toContain('Discuss a first-sketch evaluation.');
    // Reopening clears the copied state, without sending anything.
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Contact Leqad', exact: true }).click();
  }
  expect(submissions).toEqual([]);
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
