import { test, expect } from '@playwright/test';

// The canvas used to jump to a viewBox whose origin was 75% down the SVG
// after entering sketch mode. It hid the upper grid and made drawing feel broken.
for (const viewport of [
  {width: 320, height: 568},
  {width: 375, height: 900},
  {width: 768, height: 1024},
  {width: 1366, height: 768},
  {width: 1920, height: 1080},
]) {
  test(`sketch-mode grid and origin stay framed at ${viewport.width}x${viewport.height}`, async ({page}) => {
    await page.setViewportSize(viewport);
    await page.goto('/demo');
    for(const name of ['Start walkthrough','Select Top Plane','Start sketch']) {
      await page.getByRole('button', {name, exact: true}).click();
    }
    const canvas = page.getByRole('group', {name:'CAD drawing viewport',exact:true});
    const data = await canvas.evaluate(element => {
      const svg = element as SVGSVGElement;
      const bounds = svg.getBoundingClientRect();
      const view = svg.viewBox.baseVal;
      const pt = svg.createSVGPoint();
      pt.x = 0;
      pt.y = 0;
      const origin = pt.matrixTransform(svg.getScreenCTM()!);
      const corner = svg.createSVGPoint();
      corner.x = 150;
      corner.y = -120;
      const far = corner.matrixTransform(svg.getScreenCTM()!);
      return {
        relativeX: (origin.x-bounds.left)/bounds.width,
        relativeY: (origin.y-bounds.top)/bounds.height,
        viewTop: view.y,
        viewBottom: view.y + view.height,
        cornerX: (far.x-bounds.left)/bounds.width,
        cornerY: (far.y-bounds.top)/bounds.height,
        gridLines: svg.querySelectorAll('g[stroke-opacity="0.08"] line').length,
      };
    });
    expect(data.relativeY, 'sketch origin must not jump to bottom of screen').toBeGreaterThan(0.38);
    expect(data.relativeY).toBeLessThan(0.67);
    expect(data.relativeX).toBeGreaterThan(0.10);
    expect(data.relativeX).toBeLessThan(0.45);
    expect(data.viewTop).toBe(-175);
    expect(data.viewBottom).toBe(135);
    expect(data.cornerX).toBeGreaterThan(0);
    expect(data.cornerX).toBeLessThan(1);
    expect(data.cornerY).toBeGreaterThan(0);
    expect(data.cornerY).toBeLessThan(1);
    expect(data.gridLines).toBeGreaterThanOrEqual(20);
    await page.getByRole('button', {name:'Draw rectangle',exact:true}).click();
    await expect(page.getByTestId('sketch-profile')).toHaveAttribute('aria-label','Rectangle 40 by 30 millimeters');
  });
}

test('sketch origin remains usable for precise two-point drawing after repositioning', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/demo');
  for(const name of ['Start walkthrough','Select Top Plane','Start sketch']) {
    await page.getByRole('button',{name,exact:true}).click();
  }
  await page.getByRole('button', {name:'Corner Rectangle tool',exact:true}).click();
  const canvas = page.getByRole('group', {name:'CAD drawing viewport',exact:true});
  const point = async (x:number,y:number) => canvas.evaluate((element,p)=>{
    const svg = element as SVGSVGElement;
    const pt=svg.createSVGPoint();
    pt.x=p.x; pt.y=p.y;
    const screen=pt.matrixTransform(svg.getScreenCTM()!);
    return {x:screen.x,y:screen.y};
  },{x,y});
  const origin = await point(0,0);
  await page.mouse.click(origin.x,origin.y);
  const second = await point(120,-90);
  await page.mouse.move(second.x,second.y);
  await expect(page.getByRole('img', {name:'Rectangle drawing preview',exact:true})).toBeVisible();
  await page.mouse.click(second.x,second.y);
  await expect(page.getByTestId('sketch-profile')).toHaveAttribute('aria-label','Rectangle 40 by 30 millimeters');
});
