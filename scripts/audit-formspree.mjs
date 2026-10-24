// Mock Formspree responses so visual/accessibility checks never create real inquiries.
import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const output='docs/screenshots/formspree';await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
try{
 for(const width of [320,375,768,1024,1440])for(const state of ['ready','success','error']){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.route('https://formspree.io/f/xoeevqpq',r=>r.fulfill({status:state==='error'?429:200,contentType:'application/json',body:state==='error'?'{"errors":[{"message":"Rate limited"}]}':'{"ok":true}'}));
  await page.goto((process.env.SCREENSHOT_ORIGIN||'http://127.0.0.1:4173')+'/partners');
  await page.getByRole('button',{name:'Contact Leqad',exact:true}).click();
  await page.evaluate(()=>document.fonts.ready);
  if(state!=='ready'){
   await page.getByLabel('Work / School Email').fill('ada@example.org');
   await page.getByLabel('Brief Note or Context').fill('A question about guided CAD learning.');
   await page.getByRole('button',{name:'Send inquiry',exact:true}).click();
   await page.getByRole(state==='success'?'status':'alert').waitFor();
  }
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  results.push({width,state,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),violations:axe.violations,manualReview:axe.incomplete.map(x=>({id:x.id,nodes:x.nodes.length}))});
  await page.getByRole('dialog').screenshot({path:`${output}/${state}-${width}.png`});
  await context.close();
 }
}finally{await browser.close();await writeFile(output+'/accessibility.json',JSON.stringify(results,null,2)+'\n');}
if(results.some(x=>x.overflow||x.violations.length))throw Error('Formspree visual/accessibility audit failed');
console.log(`${results.length} mocked form states passed accessibility and overflow checks.`);
