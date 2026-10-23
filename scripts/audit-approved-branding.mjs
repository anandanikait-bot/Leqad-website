// Capture the approved built site and check typography, navigation, and responsive bounds.
import {chromium,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const output='docs/screenshots/approved-branding';
const modes=[{id:'final',type:'a',origin:process.env.SCREENSHOT_ORIGIN || 'http://127.0.0.1:4173',routes:['home','about','partners','demo']}];
const fonts={a:['Space Grotesk','Manrope','IBM Plex Mono']};
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const results=[];const errors=[];
try{
 for(const mode of modes){
  await mkdir(output+'/'+mode.id,{recursive:true});
  for(const width of [320,375,768,1024,1440]){
   const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce',deviceScaleFactor:1});
   page.on('pageerror',e=>errors.push({mode:mode.id,width,error:e.message}));
   for(const route of mode.routes){
    const path=route==='home'?'/':'/'+route;
    const url=mode.origin+path;
    const response=await page.goto(url);expect(response.status()).toBe(200);
    if(fonts[mode.type]) await page.evaluate(async families=>{for(const family of families)for(const weight of [400,500,600,700])await document.fonts.load(`${weight} 16px "${family}"`);},fonts[mode.type]);
    await page.evaluate(()=>document.fonts.ready);
    if(route!=='home'){
     await page.locator('footer canvas').scrollIntoViewIfNeeded();
     await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
     await page.evaluate(()=>window.scrollTo(0,0));
    }
    await page.screenshot({path:`${output}/${mode.id}/${route}-${width}.png`,fullPage:true,animations:'disabled'});
    const metrics=await page.evaluate(()=>{
     const nodes=[...document.querySelectorAll('main h1,main h2,main h3,main p,header nav a,footer p,footer nav a')].filter(el=>!el.classList.contains('sr-only')&&el.getBoundingClientRect().width>0);
     const clipped=nodes.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>({text:el.textContent.trim().slice(0,100),width:el.clientWidth,scrollWidth:el.scrollWidth}));
     const header=document.querySelector('header');const logo=header?.querySelector('img');
     const rect=logo?.getBoundingClientRect();const headerRect=header?.getBoundingClientRect();
     const nav=header?.querySelector('nav[aria-label="Main navigation"]');const navRect=nav?.getBoundingClientRect();
     return {overflow:document.documentElement.scrollWidth>innerWidth,clipped,headingFont:getComputedStyle(document.querySelector('main h1')).fontFamily,bodyFont:getComputedStyle(document.querySelector('main p')).fontFamily,headerHeight:headerRect?.height,logo:rect?{width:rect.width,height:rect.height,src:logo.getAttribute('src'),naturalWidth:logo.naturalWidth,naturalHeight:logo.naturalHeight}:null,logoOverlapsNav:rect&&navRect&&navRect.width>0?rect.right+12>navRect.left:false,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,weight:f.weight})),documentHeight:document.documentElement.scrollHeight};
    });
    results.push({mode:mode.id,width,route,...metrics});
    expect(metrics.overflow,`${mode.id} ${route} ${width} overflow`).toBe(false);
    expect(metrics.clipped,`${mode.id} ${route} ${width} clipped text`).toEqual([]);
    expect(metrics.logoOverlapsNav).toBeFalsy();
    if(route==='about'){
     expect(metrics.headerHeight).toBe(65);
     expect(metrics.logo.width/metrics.logo.height).toBeCloseTo(1625/470,3);
     await page.locator('header').screenshot({path:`${output}/${mode.id}/navbar-${width}.png`,animations:'disabled'});
     await page.locator('footer').screenshot({path:`${output}/${mode.id}/footer-${width}.png`,animations:'disabled'});
     await page.locator('main section').first().screenshot({path:`${output}/${mode.id}/intro-${width}.png`,animations:'disabled'});
     if(width<1024){
      await page.getByRole('button',{name:'Open navigation menu'}).click();
      await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeVisible();
      await page.locator('header').screenshot({path:`${output}/${mode.id}/menu-${width}.png`,animations:'disabled'});
      await page.getByRole('button',{name:'Close navigation menu'}).click();
     }
    }
    if(route==='demo'){
     await page.getByRole('heading',{name:'Introduction',exact:true}).locator('..').screenshot({path:`${output}/${mode.id}/instruction-${width}.png`,animations:'disabled'});
     if(width===375||width===1440){
      for(const name of ['Start walkthrough','Select Top Plane','Start sketch','Draw rectangle','Set 40 × 30 mm dimensions','Finish sketch','Start Extrude','Create solid'])await page.getByRole('button',{name,exact:true}).click();
      await expect(page.getByRole('heading',{name:"You've completed the interactive walkthrough."})).toBeVisible();
      await page.getByRole('button',{name:'Restart walkthrough',exact:true}).click();
      await expect(page.getByRole('button',{name:'Start walkthrough',exact:true})).toBeVisible();
     }
    }
    console.log(mode.id,width,route,'OK');
   }
   await page.close();
  }
 }
}finally{
 await browser.close();
 await writeFile(output+'/browser-combined.json',JSON.stringify({results,errors},null,2)+'\n');
}
expect(errors).toEqual([]);
console.log('Completed',results.length,'route/width/mode checks.');
