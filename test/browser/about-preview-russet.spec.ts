import { test, expect } from '@playwright/test';

test('About illustration is a technical drawing, not a fake CAD control panel', async ({ page }) => {
  await page.goto('/about');

  const region = page.locator('#product-preview');
  const illustration = region.locator('img');
  await illustration.scrollIntoViewIfNeeded();

  await expect(illustration).toHaveAttribute('src', '/assets/cad-lesson-illustration.svg');
  await expect(illustration).toHaveJSProperty('complete', true);
  await expect(illustration).toHaveJSProperty('naturalWidth', 780);
  await expect(illustration).toHaveJSProperty('naturalHeight', 440);
  await expect(illustration).toHaveAttribute('alt', /Simplified 2D CAD diagram.*marked origin/);
  await expect(region.getByText('Illustration · 40 × 30 mm sketch', {exact:true})).toBeVisible();
  await expect(region.getByRole('heading', {name:'Start with a rectangle.'})).toBeVisible();
  await expect(region.getByRole('link', {name:'Try the interactive demo',exact:true})).toHaveAttribute('href','/demo');

  // Image itself is not a clickable mock interface: only the real CTA navigates.
  await expect(region.locator('figure a, figure button')).toHaveCount(0);
  await expect(region.getByRole('link')).toHaveCount(1);
  await expect(region.getByRole('button')).toHaveCount(0);
  await expect(region.getByText('Draw rectangle', {exact:true})).toHaveCount(0);

  const response = await page.request.get('/assets/cad-lesson-illustration.svg');
  expect(response.ok()).toBe(true);
  const artwork = await response.text();
  expect(artwork).toContain('#0E2943'); // navy
  expect(artwork).toContain('#793327'); // russet
  expect(artwork).toContain('#EDF1F3'); // neutral engineering grid
  expect(artwork).not.toMatch(/LEQAD TEACHING PANEL|DO THIS NEXT|<foreignObject|All steps|Restart|<button/i);
});

for(const width of [320,375,768,1024,1440,1920]){
  test(`About preview stays readable and opens demo at ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:900});
    await page.goto('/about');
    const region = page.locator('#product-preview');
    const cta = region.getByRole('link',{name:'Try the interactive demo',exact:true});
    const img = region.locator('img');
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
    const bounds = await Promise.all([cta.boundingBox(),img.boundingBox()]);
    expect(bounds[0]).not.toBeNull();
    expect(bounds[1]).not.toBeNull();
    expect(bounds[0]!.x).toBeGreaterThanOrEqual(0);
    expect(bounds[0]!.x+bounds[0]!.width).toBeLessThanOrEqual(width+1);
    expect(bounds[1]!.x+bounds[1]!.width).toBeLessThanOrEqual(width+1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);
    await cta.click();
    await expect(page).toHaveURL(/\/demo$/);
    await expect(page.getByRole('button',{name:'Start walkthrough',exact:true})).toBeVisible();
  });
}

test('About demo link has keyboard focus and activates with Enter', async ({page})=>{
  await page.goto('/about');
  const link=page.locator('#product-preview').getByRole('link',{name:'Try the interactive demo',exact:true});
  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('outline-style','solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/demo$/);
});
