import { chromium } from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
const output='docs/screenshots/visual-followup/typography';
const origin=process.env.AUDIT_ORIGIN || 'http://127.0.0.1:4354';
await mkdir(output,{recursive:true});
const executablePath=['/usr/bin/chromium','/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell','/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell'].find(existsSync);
const browser=await chromium.launch({executablePath,args:['--no-sandbox']});
const phrases=['building, not just watching.','designing with guidance.','understanding every step.'];
const rows=[];
for(const width of [375,768,1440]) {
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 await page.goto(origin + '/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 for(const variant of ['instrument-serif','space-grotesk']) {
  if(variant==='space-grotesk') await page.addStyleTag({content:".hero-rotating-phrase{font-family:'Space Grotesk'!important;font-style:normal!important;font-weight:500!important}"});
  await page.evaluate(()=>document.fonts.ready);
  for(let index=0;index<phrases.length;index++) {
   await page.locator('.hero-rotating-phrase').evaluate((element,phrase)=>element.textContent=phrase,phrases[index]);
   await page.waitForTimeout(50);
   rows.push(await page.locator('.hero-rotating-phrase').evaluate((element,meta)=>{
    const box=element.getBoundingClientRect(),parent=element.parentElement.getBoundingClientRect(),style=getComputedStyle(element),range=document.createRange();range.selectNodeContents(element);const ink=range.getBoundingClientRect();
    return {...meta,text:element.textContent,font:style.fontFamily,fontSize:style.fontSize,fontStyle:style.fontStyle,fontWeight:style.fontWeight,element:{x:box.x,y:box.y,width:box.width,height:box.height},textBounds:{x:ink.x,y:ink.y,width:ink.width,height:ink.height},parent:{x:parent.x,y:parent.y,width:parent.width,height:parent.height},clipped:ink.left<parent.left-1||ink.right>parent.right+1||ink.top<parent.top-1||ink.bottom>parent.bottom+1,documentOverflow:document.documentElement.scrollWidth>innerWidth};
   },{width,variant,index}));
   await page.screenshot({path:`${output}/${variant}-${width}-phrase-${index+1}.png`,animations:'disabled'});
  }
 }
 await page.close();
}
await writeFile(`${output}/comparison.json`,JSON.stringify(rows,null,2)+'\n');
await browser.close();
console.log(JSON.stringify(rows.map(r=>({width:r.width,variant:r.variant,index:r.index,clipped:r.clipped,font:r.font,fontSize:r.fontSize,textWidth:r.textBounds.width,parentWidth:r.parent.width})),null,2));
