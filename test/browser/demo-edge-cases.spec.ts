import { test, expect, type Page } from '@playwright/test';

async function rectangle(page: Page) {
  await page.goto('/demo');
  for (const name of ['Start walkthrough', 'Select Top Plane', 'Start sketch', 'Draw rectangle']) {
    await page.getByRole('button', { name, exact: true }).click();
  }
}

test('dimension bounds and empty drafts gate actions without changing valid geometry', async ({ page }) => {
  await rectangle(page);
  const width = page.getByLabel('Width (mm)', { exact: true });
  for (const draft of ['', '19', '51']) {
    await width.fill(draft);
    await expect(width).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByRole('button', { name: /Set .* dimensions/ })).toBeDisabled();
    await expect(page.getByTestId('sketch-profile')).toHaveAttribute('aria-label', 'Rectangle 40 by 30 millimeters');
  }
  await width.fill('20');
  await page.getByLabel('Height (mm)', { exact: true }).fill('15');
  await page.getByRole('button', { name: 'Set 20 × 15 mm dimensions', exact: true }).click();
  await page.getByRole('button', { name: 'Finish sketch', exact: true }).click();
  await page.getByRole('button', { name: 'Start Extrude', exact: true }).click();
  const depth = page.getByLabel('Depth (mm)', { exact: true });
  for (const draft of ['', '0', '51']) {
    await depth.fill(draft);
    await expect(depth).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByRole('button', { name: 'Create solid', exact: true })).toBeDisabled();
  }
  await depth.fill('1');
  await page.getByRole('button', { name: 'Create solid', exact: true }).click();
  await expect(page.getByText('Part 1 created · 20 × 15 × 1 mm', { exact: true })).toBeVisible();
});

for (const extruding of [false, true]) {
  test(`restart clears geometry during ${extruding ? 'extrusion' : 'sketching'}`, async ({ page }) => {
    await rectangle(page);
    if (extruding) {
      for (const name of ['Set 40 × 30 mm dimensions', 'Finish sketch', 'Start Extrude']) {
        await page.getByRole('button', { name, exact: true }).click();
      }
    }
    await page.getByRole('button', { name: 'Restart', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
    await expect(page.getByTestId('sketch-profile')).toHaveCount(0);
    await expect(page.getByTestId('extruded-solid')).toHaveCount(0);
  });
}

test('keyboard shortcuts leave focused fields alone and rapid review creates no geometry', async ({ page }) => {
  await rectangle(page);
  await page.getByLabel('Width (mm)', { exact: true }).focus();
  for (const key of ['ArrowLeft', 'ArrowRight', 'r', 'n']) await page.keyboard.press(key);
  await expect(page.getByRole('button', { name: 'Set 40 × 30 mm dimensions', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
  for (let i = 0; i < 8; i++) await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: 'Select Top Plane', exact: true })).toBeVisible();
  await expect(page.getByTestId('sketch-profile')).toHaveCount(0);
  await expect(page.getByTestId('extruded-solid')).toHaveCount(0);
});
