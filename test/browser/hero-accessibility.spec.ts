import { expect, test } from '@playwright/test';

test('hero exposes one complete heading while its visual phrase changes', async ({ page }) => {
  const clockTime = new Date('2026-01-01T00:00:00Z');
  await page.clock.install({ time: clockTime });
  await page.clock.pauseAt(new Date(clockTime.getTime() + 1000));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const heading = page.getByRole('heading', { level: 1 });
  const phrase = page.locator('.hero-rotating-phrase');
  await expect(heading).toHaveCount(1);
  await expect(heading).toHaveAccessibleName('Learn CAD by building.');
  await expect(phrase).toHaveAttribute('aria-hidden', 'true');
  const initialButton = await page.getByRole('link', { name: 'Explore Interactive Demo' }).boundingBox();
  await page.clock.runFor(4500);
  await expect(phrase).toHaveText('designing with guidance.');
  await expect(heading).toHaveAccessibleName('Learn CAD by building.');
  const cycledButton = await page.getByRole('link', { name: 'Explore Interactive Demo' }).boundingBox();
  expect(cycledButton?.y).toBeCloseTo(initialButton!.y, 0);
  await expect(page.locator('header')).toHaveCount(0);
  await expect(page.getByRole('img', { name: 'Leqad logo' })).toHaveAttribute('src', '/assets/brand/leqad-official-horizontal-light-v1.svg');
});

test('changing motion preference cancels a pending phrase transition and can resume it', async ({ page }) => {
  const clockTime = new Date('2026-01-01T00:00:00Z');
  await page.clock.install({ time: clockTime });
  await page.clock.pauseAt(new Date(clockTime.getTime() + 1000));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const phrase = page.locator('.hero-rotating-phrase');
  await page.clock.runFor(4100);
  await expect(phrase).toHaveClass(/opacity-0/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(phrase).toHaveText('building, not just watching.');
  await expect(phrase).toHaveClass(/opacity-100/);
  await page.clock.runFor(8500);
  await expect(phrase).toHaveText('building, not just watching.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.runFor(4500);
  await expect(phrase).toHaveText('designing with guidance.');
});
