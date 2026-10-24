import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
const origin = process.env.SCREENSHOT_ORIGIN || 'http://127.0.0.1:4173';
const output = 'docs/screenshots/quality-pass';
await mkdir(output, {recursive:true});
const browser = await chromium.launch({executablePath: [process.env.CHROMIUM_PATH,'/usr/bin/chromium'].find(p=>p&&existsSync(p)),args:['--no-sandbox']});
const checks=[];
try {
 for(const width of [320,375,768,1024,1440]) {
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  const scan=async state=>{
   await page.evaluate(()=>document.fonts.ready);
   const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
   checks.push({width,state,version:result.testEngine.version,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),needsReview:result.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))});
   console.log(width,state,result.violations.map(v=>v.id).join(','));
  };
  for(const route of ['/','/about','/partners','/demo','/quality-pass-missing']) {await page.goto(origin+route);await scan(route);}
  await page.goto(origin+'/partners');
  await page.getByRole('button',{name:/Prepare an Inquiry|Draft an Inquiry|Contact Leqad/i}).first().click();
  await page.getByRole('dialog').waitFor();await scan('inquiry dialog');
  await page.evaluate(() => Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Clipboard denied for audit');}}}));
  await page.getByRole('button',{name:'Copy Inquiry Note',exact:true}).click();
  await page.getByLabel('Complete inquiry text',{exact:true}).waitFor();
  await scan('manual copy fallback');
  await page.screenshot({path:`${output}/after/clipboard-fallback-${width}.png`});
  await page.keyboard.press('Escape');
  await page.locator('[data-evaluation-disclosure] summary').click();await scan('expanded evaluation planner');
  await page.goto(origin+'/demo');
  for (const name of ['Start walkthrough','Select Top Plane','Start sketch','Draw rectangle','Set 40 × 30 mm dimensions','Finish sketch','Start Extrude','Create solid']) await page.getByRole('button',{name,exact:true}).click();
  await page.getByRole('heading',{name:"You've completed the interactive walkthrough."}).waitFor();
  await scan('completed demo');
  if(width<1024){await page.getByRole('button',{name:'Open navigation menu'}).click();await scan('mobile navigation');}
  await context.close();
 }
}finally{await browser.close();await writeFile(`${output}/accessibility.json`,JSON.stringify(checks,null,2)+'\n');}
if(checks.some(c=>c.violations.length))process.exitCode=1;
