import { test, expect } from '@playwright/test';

test('Partners pilot configurator updates only arithmetic planning quantities', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/partners');
  const planner = page.locator('[data-pilot-planner]');
  await expect(planner.getByRole('heading', { name: 'Sketch an educational pilot' })).toBeVisible();
  await expect(planner.locator('[data-pilot-contact-hours]')).toHaveText('4 hours');
  await expect(planner.locator('[data-pilot-participant-hours]')).toHaveText('48 learner-hours');

  const learners = planner.getByRole('slider', { name: 'Learners' });
  const sessions = planner.getByRole('slider', { name: 'Sessions' });
  const minutes = planner.getByRole('slider', { name: 'Minutes per session' });
  await learners.focus();
  await learners.press('End');
  await sessions.focus();
  await sessions.press('End');
  await minutes.focus();
  await minutes.press('End');
  await expect(learners).toHaveValue('40');
  await expect(sessions).toHaveValue('8');
  await expect(minutes).toHaveValue('120');
  await expect(planner.locator('[data-pilot-contact-hours]')).toHaveText('16 hours');
  await expect(planner.locator('[data-pilot-participant-hours]')).toHaveText('640 learner-hours');

  await planner.getByRole('button', { name: 'Draft a Pilot Inquiry' }).click();
  await expect(page.getByRole('dialog').getByLabel('Area of Interest')).toHaveValue('Educational Pilot');
  await expect(page.getByRole('dialog')).toContainText('does not send messages directly');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(errors).toEqual([]);
});

for (const width of [320, 375, 768, 1440]) {
  test('pilot planner stays within Partners page at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/partners');
    await expect(page.locator('[data-pilot-planner]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const slider = page.getByRole('slider', { name: 'Learners' });
    await slider.focus();
    await expect(slider).toBeFocused();
  });
}
