import { test, expect } from '@playwright/test';

test('demo code is deferred until navigation and the prerendered lesson hydrates', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', request => { if (request.resourceType() === 'script') scripts.push(request.url()); });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Explore Interactive Demo', exact: true })).toBeVisible();
  const initialScripts = new Set(scripts);
  await page.getByRole('link', { name: 'Explore Interactive Demo', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
  expect(scripts.filter(url => !initialScripts.has(url)).length, 'Demo navigation should load deferred JavaScript').toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Select Top Plane', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('link', { name: 'Explore Interactive Demo', exact: true })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('button', { name: 'Start walkthrough', exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Start walkthrough', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Select Top Plane', exact: true })).toBeVisible();
});
