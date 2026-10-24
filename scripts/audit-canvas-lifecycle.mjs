// Pass a locally served build URL as the first argument. Emits measured lifecycle counts as JSON.
import { chromium } from '@playwright/test';
const browser = await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.addInitScript(()=>{
 window.measure={cad:0,sonar:0,shader:0,balance:0,buffers:0,deletedBuffers:0,longTasks:[],cls:0};
 const m=window.measure;
 const proto=CanvasRenderingContext2D.prototype;
 for(const key of ['clearRect','save','restore']){const old=proto[key];proto[key]=function(...args){const cad=this.canvas.closest('[aria-label="Interactive 3D CAD Geometry Visualization"]');if(key==='clearRect'){m[cad?'cad':'sonar']++;}else if(cad)m.balance+=key==='save'?1:-1;return old.apply(this,args);};}
 for(const key of ['drawArrays','createBuffer','deleteBuffer']){const old=WebGL2RenderingContext.prototype[key];WebGL2RenderingContext.prototype[key]=function(...args){m[{drawArrays:'shader',createBuffer:'buffers',deleteBuffer:'deletedBuffers'}[key]]++;return old.apply(this,args);};}
 new PerformanceObserver(l=>m.longTasks.push(...l.getEntries().map(x=>x.duration))).observe({type:'longtask',buffered:true});
 new PerformanceObserver(l=>{for(const x of l.getEntries())if(!x.hadRecentInput)m.cls+=x.value;}).observe({type:'layout-shift',buffered:true});
});
await page.goto(process.argv[2]||'http://127.0.0.1:4173'); await page.waitForTimeout(3500);
const result={initial:await page.evaluate(()=>window.measure)};
async function sample(label){const a=await page.evaluate(()=>({...window.measure}));await page.waitForTimeout(1000);const b=await page.evaluate(()=>({...window.measure}));result[label]={cad:b.cad-a.cad,sonar:b.sonar-a.sonar,shader:b.shader-a.shader,balance:b.balance-a.balance,longTasks:b.longTasks.slice(a.longTasks.length),cls:b.cls-a.cls};}
await sample('visible');
await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
await sample('syntheticHidden');
await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
await sample('resumed');
await page.evaluate(()=>{for(const node of document.querySelectorAll('[data-metallic-cta], [aria-label="Interactive 3D CAD Geometry Visualization"]'))node.style.transform='translateY(10000px)';});
await page.waitForTimeout(100);await sample('offscreen');
await page.evaluate(()=>{for(const node of document.querySelectorAll('[data-metallic-cta], [aria-label="Interactive 3D CAD Geometry Visualization"]'))node.style.transform='';});
await page.waitForTimeout(100);
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);await sample('reduced');
const before=await page.locator('[aria-label="Interactive 3D CAD Geometry Visualization"] canvas').evaluate(x=>x.toDataURL());
await page.getByRole('button',{name:'3D Extrude: switch to 2D Sketch'}).click();await page.waitForTimeout(100);
result.reducedToggleChanged=before!==await page.locator('[aria-label="Interactive 3D CAD Geometry Visualization"] canvas').evaluate(x=>x.toDataURL());
await page.getByRole('link',{name:'Explore Interactive Demo',exact:true}).click();
await page.locator('[data-metallic-cta]').waitFor({state:'detached'});
result.final=await page.evaluate(()=>window.measure);
console.log(JSON.stringify(result,null,2));await browser.close();
