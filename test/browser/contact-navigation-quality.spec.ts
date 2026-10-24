import { test, expect } from '@playwright/test';

test('clipboard rejection exposes the complete selectable draft and preserves edits on reopen', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Permission denied'); } } }));
  await page.goto('/partners');
  const trigger = page.getByRole('button', { name: 'Contact Leqad', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Area of Interest').selectOption('Robotics Team');
  await dialog.getByLabel('Your Name').fill('Ada');
  await dialog.getByLabel('Work / School Email').fill('ada@example.org');
  await dialog.getByLabel('Organization / School / Team').fill('Robotics club');
  await dialog.getByLabel('Brief Note or Context').fill('A complete inquiry.');
  await dialog.getByRole('button', { name: 'Copy Inquiry Note' }).click();
  const draft = dialog.getByLabel('Complete inquiry text');
  await expect(draft).toHaveValue('--- Leqad Partnership Inquiry ---\nTopic: Robotics Team\nName: Ada\nEmail: ada@example.org\nOrganization: Robotics club\nMessage: A complete inquiry.\n---------------------------------');
  await expect(dialog.getByRole('status')).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Select All', exact: true }).click();
  await expect(draft).toBeFocused();
  expect(await draft.evaluate((element: HTMLTextAreaElement) => element.selectionEnd - element.selectionStart)).toBe((await draft.inputValue()).length);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(dialog.getByLabel('Area of Interest')).toHaveValue('Robotics Team');
  await expect(dialog.getByLabel('Brief Note or Context')).toHaveValue('A complete inquiry.');
  await expect(dialog.getByLabel('Your Name')).toHaveValue('Ada');
});

test('closing and reopening an inquiry retains the selected topic and message', async ({ page }) => {
  await page.goto('/about');
  const trigger = page.getByRole('button', { name: 'Contact Leqad' });
  await trigger.click();
  await page.getByLabel('Area of Interest').selectOption('Robotics Team');
  await page.getByLabel('Brief Note or Context').fill('Keep this draft.');
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await trigger.click();
  await expect(page.getByLabel('Area of Interest')).toHaveValue('Robotics Team');
  await expect(page.getByLabel('Brief Note or Context')).toHaveValue('Keep this draft.');
});

test('mobile menu Escape restores toggle focus and external route changes close the menu', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/about');
  const toggle = page.getByRole('button', { name: /navigation menu/ });
  await toggle.click();
  const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
  await menu.getByRole('link', { name: 'About', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(menu).toHaveCount(0);
  await toggle.click();
  await page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'For Partners' }).click();
  await expect(page).toHaveURL(/\/partners$/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(menu.getByRole('link', { name: 'For Partners' })).toHaveAttribute('aria-current', 'page');
});

test('dialog traps keyboard focus in both directions and restores its opener', async ({ page }) => {
  await page.goto('/about');
  const opener = page.getByRole('button', { name: 'Contact Leqad' });
  await opener.click();
  const dialog = page.getByRole('dialog');
  const close = dialog.getByRole('button', { name: 'Close dialog' });
  const lastAction = dialog.getByRole('button', { name: 'Open Email App' });
  await close.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(lastAction).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test('clipboard unavailable uses manual recovery without a success claim', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: undefined }));
  await page.goto('/partners');
  await page.getByRole('button', { name: 'Contact Leqad', exact: true }).click();
  await page.getByLabel('Brief Note or Context').fill('Manual copy');
  await page.getByRole('button', { name: 'Copy Inquiry Note' }).click();
  await expect(page.getByLabel('Complete inquiry text')).toHaveValue(/Message: Manual copy/);
  await expect(page.getByRole('dialog').getByRole('status')).toHaveCount(0);
});

test('support action validates email and opens the approved destination with the complete note', async ({ page }) => {
  await page.goto('/partners');
  await page.getByRole('button', { name: 'Contact Leqad', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Your Name').fill('Ada');
  await dialog.getByLabel('Brief Note or Context').fill('A question & details.');
  const email = dialog.getByLabel('Work / School Email');
  await expect(dialog).toContainText('Leqad support');
  await expect(dialog.getByRole('status')).toHaveCount(0);
  const client = await page.context().newCDPSession(page);
  await client.send('Page.enable');
  const intents: string[] = [];
  client.on('Page.frameRequestedNavigation', event => {
    if (event.url.startsWith('mailto:')) intents.push(event.url);
  });
  await email.fill('invalid');
  await dialog.getByRole('button', { name: 'Open Email App' }).click();
  expect(await email.evaluate((el: HTMLInputElement) => el.checkValidity())).toBe(false);
  expect(intents).toEqual([]);
  await email.fill('ada@example.org');
  await dialog.getByRole('button', { name: 'Open Email App' }).click();
  await expect.poll(() => intents.length).toBe(1);
  const destination = new URL(intents[0]);
  expect(destination.pathname).toBe('anandanikait@gmail.com');
  expect(destination.searchParams.get('subject')).toBe('Leqad inquiry: General Inquiry');
  expect(destination.searchParams.get('body')).toContain('Name: Ada\nEmail: ada@example.org');
  expect(destination.searchParams.get('body')).toContain('Message: A question & details.');
});
