// Cold browser contexts; optional BASELINE_ORIGIN adds a comparison build.
import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
try{
 for(const mode of (process.env.BASELINE_ORIGIN?['current','final']:['final']))for(const width of [375,768,1440])for(const route of ['/','/about','/partners','/demo'])for(const delay of [0,250]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});const p=await context.newPage();
  await p.addInitScript(()=>{window.__fontShifts=[];new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__fontShifts.push({value:entry.value,time:entry.startTime,sources:entry.sources.map(s=>({tag:s.node?.tagName,text:s.node?.textContent?.slice(0,60)}))});}).observe({type:'layout-shift',buffered:true});});
  if(delay)await p.route(/\.(woff2?|ttf)(\?.*)?$/,async route=>{await new Promise(resolve=>setTimeout(resolve,delay));await route.continue();});
  const origin=mode==='current'?process.env.BASELINE_ORIGIN:(process.env.SCREENSHOT_ORIGIN || 'http://127.0.0.1:4173');
  await p.goto(origin+route);
  await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
  const data=await p.evaluate(()=>({shifts:window.__fontShifts,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,weight:f.weight})),fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime}));
  // All entries occur in the short initial-load observation window; their sum bounds CLS.
  const cls=data.shifts.reduce((sum,s)=>sum+s.value,0);
  results.push({mode,width,route,fontDelayMs:delay,cls,...data});
  console.log(mode,width,route,delay,'CLS',cls.toFixed(5));await context.close();
 }
}finally{await browser.close();await writeFile('docs/screenshots/approved-branding/font-loading-cls.json',JSON.stringify(results,null,2)+'\n');}
console.log('Maximum CLS:',Math.max(...results.map(x=>x.cls)));expect(results.every(x=>x.cls<.1)).toBe(true);
