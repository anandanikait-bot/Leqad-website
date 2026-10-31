import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
const checks=[];
try {
 for(const width of [375,1440]) {
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  const scan=async state=>{const r=await new AxeBuilder({page}).analyze();checks.push({width,state,violations:r.violations,incomplete:r.incomplete});};
  for(const route of ['/','/about','/partners','/demo']) {
   await page.goto('http://127.0.0.1:4355'+route);await page.evaluate(()=>document.fonts.ready);await scan(route);
  }
  for(const name of ['Start walkthrough','Select Top Plane','Start sketch','Draw rectangle']) await page.getByRole('button',{name,exact:true}).click();
  await scan('drawn rectangle');
  await page.goto('http://127.0.0.1:4355/partners');
  await page.getByRole('button',{name:'Contact Leqad',exact:true}).click();await scan('contact dialog');
  await context.close();
 }
}finally{await browser.close();await writeFile('docs/screenshots/visual-followup/accessibility.json',JSON.stringify(checks,null,2)+'\n');}
if(checks.some(c=>c.violations.length))process.exitCode=1;
console.log(checks.length+' scans; '+checks.reduce((s,c)=>s+c.violations.length,0)+' violations');
