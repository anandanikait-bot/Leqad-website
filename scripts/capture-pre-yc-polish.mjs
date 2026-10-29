import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const origin=process.env.SCREENSHOT_ORIGIN||'http://127.0.0.1:4341';
const label=process.env.CAPTURE_LABEL||'after';const out=`docs/screenshots/pre-yc/${label}`;await mkdir(out,{recursive:true});
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
try{for(const width of [320,375,1440]){
 const ctx=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const p=await ctx.newPage();let errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const route of ['/','/about','/partners','/demo']){
  const r=await p.goto(origin+route);if(r.status()!==200)throw Error('Route failed');await p.reload();await p.evaluate(()=>document.fonts.ready);
  if(await p.locator('footer canvas').count()){await p.locator('footer canvas').scrollIntoViewIfNeeded();await p.waitForTimeout(250);await p.evaluate(()=>scrollTo(0,0));}
  await p.screenshot({path:`${out}/${route==='/'?'home':route.slice(1)}-${width}.png`,fullPage:true});
  results.push({width,route,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors:[...errors]});
 }
 await p.goto(origin+'/');await p.evaluate(()=>document.fonts.ready);const art=p.getByRole('img',{name:'Interactive 3D CAD Geometry Visualization'});
 // The artwork has role=group on some revisions; use its stable accessible-label selector.
 const canvasArt=p.locator('[aria-label="Interactive 3D CAD Geometry Visualization"]');
 await canvasArt.screenshot({path:`${out}/artwork-3d-${width}.png`});await p.getByRole('button',{name:'3D Extrude: switch to 2D Sketch'}).click();await p.waitForTimeout(100);await canvasArt.screenshot({path:`${out}/artwork-2d-${width}.png`});
 await p.goto(origin+'/demo');for(const name of ['Start walkthrough','Select Top Plane','Start sketch'])await p.getByRole('button',{name,exact:true}).click();
 await p.getByRole('toolbar',{name:'CAD tools'}).screenshot({path:`${out}/toolbar-rectangle-${width}.png`});
 await p.getByRole('button',{name:'Draw rectangle',exact:true}).click();await p.getByRole('toolbar',{name:'CAD tools'}).screenshot({path:`${out}/toolbar-dimension-${width}.png`});
 {const a=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();results.push({width,state:'dimension',violations:a.violations,manualReview:a.incomplete.map(x=>({id:x.id,nodes:x.nodes.length}))});}
 await ctx.close();
}}finally{await b.close();await writeFile(out+'/checks.json',JSON.stringify(results,null,2)+'\n');}
if(results.some(x=>x.overflow||x.errors?.length))throw Error('Route or overflow regression');
if(label==='after') {
 const baseline=JSON.parse(await readFile('docs/screenshots/pre-yc/before/checks.json','utf8'));
 const signatures=rows=>rows.flatMap(x=>(x.violations||[]).map(v=>JSON.stringify({width:x.width,id:v.id,targets:v.nodes.map(n=>n.target)}))).sort();
 if(JSON.stringify(signatures(results))!==JSON.stringify(signatures(baseline)))throw Error('Accessibility findings changed; review required');
}
console.log('Captured and checked',results.length,'route and state cases.');
