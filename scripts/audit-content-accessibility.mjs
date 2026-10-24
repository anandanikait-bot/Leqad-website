import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
// Keep the optional audit tool outside the website dependency tree.
// AXE_SOURCE_PATH=/path/to/axe.min.js node scripts/audit-content-accessibility.mjs
if (!process.env.AXE_SOURCE_PATH) throw Error('Set AXE_SOURCE_PATH to an installed axe-core/axe.min.js');
const axeSource = await readFile(process.env.AXE_SOURCE_PATH, 'utf8');
const origin = process.env.SCREENSHOT_ORIGIN || 'http://127.0.0.1:4173';
const output = 'docs/screenshots/content-ux';
await mkdir(output, {recursive:true});
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
const checks = [];
try {
  for (const width of [320,375,768,1024,1440]) {
    const page = await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const scan = async (state) => {
      await page.evaluate(() => document.fonts.ready);
      await page.addScriptTag({content:axeSource});
      const result = await page.evaluate(async () => {
        const results = await window.axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});
        return {version:results.testEngine.version, violations: results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})), needsReview: results.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))};
      });
      checks.push({width,state,...result});
      console.log(width,state,JSON.stringify(result.violations));
    };
    for(const route of ['/','/about','/partners','/demo']) {
      await page.goto(origin+route);
      await scan(route);
    }
    const activate = async name => {
      const button=page.getByRole('button',{name,exact:true});
      await button.focus();
      await page.keyboard.press('Enter');
    };
    for(const name of ['Start walkthrough','Select Top Plane','Start sketch','Draw rectangle','Set 40 × 30 mm dimensions','Finish sketch','Start Extrude','Create solid']) await activate(name);
    await page.getByRole('heading',{name:"You've completed the interactive walkthrough."}).waitFor();
    await scan('/demo completed via keyboard');
    const about=page.locator('main').getByRole('link',{name:'Learn About Leqad',exact:true});
    await about.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL('**/about');
    await page.goto(origin+'/partners');
    const summary=page.locator('[data-evaluation-disclosure] summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await scan('/partners expanded planner');
    await page.locator('[data-pilot-planner]').getByRole('button',{name:'Contact Leqad'}).click();
    await page.getByLabel('Area of Interest').focus();
    await scan('/partners draft dialog');
    await page.getByRole('button',{name:'Send inquiry'}).focus();
    await page.keyboard.press('Tab');
    if (!(await page.getByRole('button',{name:'Close dialog'}).evaluate(el=>el===document.activeElement))) throw Error('Forward dialog focus trap failed');
    await page.keyboard.press('Shift+Tab');
    if (!(await page.getByRole('button',{name:'Send inquiry'}).evaluate(el=>el===document.activeElement))) throw Error('Reverse dialog focus trap failed');
    await page.keyboard.press('Escape');
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile(output+'/accessibility.json',JSON.stringify(checks,null,2)+'\n');
}
if(checks.some(c=>c.violations.length)) process.exitCode=1;
