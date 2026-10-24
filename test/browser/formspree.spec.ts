import { test, expect } from '@playwright/test';
const endpoint = 'https://formspree.io/f/xoeevqpq';
async function openForm(page: import('@playwright/test').Page) {
  await page.goto('/partners');
  await page.getByRole('button', { name: 'Contact Leqad', exact: true }).click();
  await page.getByLabel('Your Name').fill('Ada');
  await page.getByLabel('Work / School Email').fill('ada@example.org');
  await page.getByLabel('Organization / School / Team').fill('Robotics');
  await page.getByLabel('Brief Note or Context').fill('A question & details.');
}
test('Formspree receives the complete inquiry once and success waits for acceptance', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const requests: Record<string, string>[] = [];
  await page.route(endpoint, async route => {
    requests.push(route.request().postDataJSON());
    expect(route.request().headers().accept).toBe('application/json');
    await gate;
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await openForm(page);
  await page.getByRole('button', { name: 'Send inquiry', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled();
  await expect(page.getByRole('dialog').getByRole('status')).toHaveCount(0);
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0]).toEqual({name:'Ada',email:'ada@example.org',organization:'Robotics',topic:'General Inquiry',message:'A question & details.',_subject:'Leqad inquiry: General Inquiry',_gotcha:''});
  release();
  await expect(page.getByRole('status')).toHaveText('Inquiry submitted to Leqad support.');
  await expect(page.getByRole('button', { name: 'Submitted', exact: true })).toBeDisabled();
});
for (const status of [422,429,500]) {
  test(`Formspree ${status} preserves the draft and permits a retry`, async ({ page }) => {
    let attempts = 0;
    await page.route(endpoint, route => {
      attempts++;
      return route.fulfill({status:attempts===1?status:200,contentType:'application/json',body:attempts===1?'{"errors":[{"message":"Request rejected"}]}':'{"ok":true}'});
    });
    await openForm(page);
    await page.getByRole('button', { name: 'Send inquiry', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('Your draft is kept');
    await expect(page.getByRole('dialog').getByRole('status')).toHaveCount(0);
    await expect(page.getByLabel('Brief Note or Context')).toHaveValue('A question & details.');
    await expect(page.getByLabel('Work / School Email')).toHaveValue('ada@example.org');
    await page.getByRole('button', { name: 'Send inquiry', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Inquiry submitted');
  });
}
test('network failure and non-JSON success response never claim submission', async ({ page }) => {
  let attempts = 0;
  await page.route(endpoint, route => ++attempts===1?route.abort():route.fulfill({status:200,contentType:'text/html',body:'Unexpected proxy page'}));
  await openForm(page);
  for (let i=0;i<2;i++) {
    await page.getByRole('button', { name: 'Send inquiry', exact: true }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('status')).toHaveCount(0);
    await expect(page.getByLabel('Brief Note or Context')).toHaveValue('A question & details.');
  }
});
test('required email and message block incomplete submissions', async ({ page }) => {
  let attempts = 0;
  await page.route(endpoint, route => {attempts++;return route.abort();});
  await openForm(page);
  await page.getByLabel('Work / School Email').fill('invalid');
  await page.getByRole('button', { name: 'Send inquiry', exact: true }).click();
  expect(attempts).toBe(0);
  await page.getByLabel('Work / School Email').fill('ada@example.org');
  await page.getByLabel('Brief Note or Context').fill('');
  await page.getByRole('button', { name: 'Send inquiry', exact: true }).click();
  expect(attempts).toBe(0);
});
