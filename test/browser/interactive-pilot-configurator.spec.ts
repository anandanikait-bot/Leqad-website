import { test, expect } from '@playwright/test';

test('pilot planner presents questions rather than fabricated outcome promises', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/partners');
  const disclosure = page.locator('[data-evaluation-disclosure]');
  await expect(disclosure).not.toHaveAttribute('open', '');
  const planner = page.locator('[data-pilot-planner]');
  await expect(planner).toBeHidden();
  await disclosure.locator('summary').click();
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(planner.getByRole('heading', { name: 'Outline a potential CAD learning evaluation' })).toBeVisible();
  await expect(planner.locator('[data-pilot-summary]')).toHaveText('Engineering courses · Small group');
  await expect(planner.locator('[data-pilot-question]')).toContainText('first-part task');
  await expect(planner.locator('[data-pilot-baseline]')).toContainText('without Leqad guidance');
  await expect(planner).not.toContainText(/94%|91%|88%|instructor hours saved|100% Client-Side/i);
  await expect(planner).toContainText('An evaluation would need agreed tasks, participant consent');
  expect(errors).toEqual([]);
});

test('audience, group and focus update output and carry into the actual draft', async ({ page }) => {
  await page.goto('/partners');
  const disclosure = page.locator('[data-evaluation-disclosure]');
  await expect(disclosure).not.toHaveAttribute('open', '');
  const planner = page.locator('[data-pilot-planner]');
  await expect(planner).toBeHidden();
  await disclosure.locator('summary').click();
  await expect(disclosure).toHaveAttribute('open', '');
  await planner.getByRole('button', { name: 'Robotics teams' }).click();
  await planner.getByRole('button', { name: /Larger group/ }).click();
  await planner.getByRole('button', { name: 'Independent practice' }).click();
  await expect(planner.getByRole('button', { name: 'Robotics teams' })).toHaveAttribute('aria-pressed', 'true');
  await expect(planner.getByRole('button', { name: /Larger group/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(planner.getByRole('button', { name: 'Independent practice' })).toHaveAttribute('aria-pressed', 'true');
  await expect(planner.locator('[data-pilot-summary]')).toHaveText('Robotics teams · Larger group');
  await expect(planner.locator('[data-pilot-question]')).toContainText('comparable part');

  const trigger = planner.getByRole('button', { name: 'Contact Leqad' });
  await trigger.click();
  const modal = page.getByRole('dialog');
  await expect(modal.getByLabel('Area of Interest')).toHaveValue('Robotics Team');
  const note = modal.getByLabel('Brief Note or Context');
  await expect(note).toHaveValue(/Audience: Robotics teams/);
  await expect(note).toHaveValue(/41\+ participants; capacity to be confirmed/);
  await expect(note).toHaveValue(/Independent practice/);
  await expect(modal).toContainText('Nothing is sent by this website.');
  await page.keyboard.press('Escape');
  await expect(modal).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('platform evaluation uses technical topic and does not retain another audience draft', async ({ page }) => {
  await page.goto('/partners');
  const disclosure = page.locator('[data-evaluation-disclosure]');
  await expect(disclosure).not.toHaveAttribute('open', '');
  const planner = page.locator('[data-pilot-planner]');
  await expect(planner).toBeHidden();
  await disclosure.locator('summary').click();
  await expect(disclosure).toHaveAttribute('open', '');
  await planner.getByRole('button', { name: 'CAD platform teams' }).click();
  await planner.getByRole('button', { name: 'Help requests' }).click();
  await planner.getByRole('button', { name: 'Contact Leqad' }).click();
  const modal = page.getByRole('dialog');
  await expect(modal.getByLabel('Area of Interest')).toHaveValue('Technical Alignment');
  await expect(modal.getByLabel('Brief Note or Context')).toHaveValue(/Audience: CAD platform teams/);
  await expect(modal.getByLabel('Brief Note or Context')).toHaveValue(/Count support requests/);
  await page.keyboard.press('Escape');
  await page.locator('[data-parallax-anchor]').getByRole('button', { name: 'Contact Leqad', exact: true }).click();
  await expect(page.getByRole('dialog').getByLabel('Area of Interest')).toHaveValue('General Inquiry');
  await expect(page.getByRole('dialog').getByLabel('Brief Note or Context')).toBeEmpty();
});

for (const width of [320, 375, 768, 1440]) {
  test('pilot choices remain keyboard-accessible and within the page at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/partners');
    const disclosure = page.locator('[data-evaluation-disclosure]');
    await expect(disclosure).not.toHaveAttribute('open', '');
    const planner = page.locator('[data-pilot-planner]');
    await expect(planner).toBeHidden();
    const summary = disclosure.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(disclosure).toHaveAttribute('open', '');
    await expect(planner).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const option = planner.getByRole('button', { name: 'Robotics teams' });
    await option.focus();
    await page.keyboard.press('Enter');
    await expect(option).toHaveAttribute('aria-pressed', 'true');
    await expect(option).toBeFocused();
  });
}
