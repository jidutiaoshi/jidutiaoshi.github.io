const {chromium}=require('playwright');
const fs=require('fs');

const PAGES=[
  {name:'index',url:'https://jiduos.cn/'},
  {name:'pricing',url:'https://jiduos.cn/pricing'},
  {name:'cases',url:'https://jiduos.cn/cases'},
  {name:'contact',url:'https://jiduos.cn/contact'},
  {name:'404',url:'https://jiduos.cn/404.html'}
];

const results={};

(async()=>{
  const browser=await chromium.launch({headless:true});

  for(const pageInfo of PAGES){
    console.log(`\n=== ${pageInfo.name} ===`);
    const context=await browser.newContext({viewport:{width:1440,height:900}});
    const page=await context.newPage();

    // Collect console errors
    const errors=[];
    page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});
    page.on('pageerror',err=>errors.push(err.message));

    try{
      await page.goto(pageInfo.url,{waitUntil:'networkidle',timeout:15000});
      await page.waitForTimeout(2000);
    }catch(e){
      console.log(`  LOAD ERROR: ${e.message}`);
      results[pageInfo.name]={error:e.message};
      await context.close();
      continue;
    }

    // Screenshots
    await page.screenshot({path:`d:/AI/_audit_${pageInfo.name}_desktop.png`,fullPage:true});
    await page.setViewportSize({width:375,height:812});
    await page.waitForTimeout(500);
    await page.screenshot({path:`d:/AI/_audit_${pageInfo.name}_mobile.png`,fullPage:true});

    // Content checks
    const title=await page.title();
    const h1=await page.locator('h1').first().textContent().catch(()=>'no h1');
    const bodyText=await page.locator('body').innerText();

    // Image checks
    const imgs=await page.locator('img').all();
    let brokenImgs=[];
    for(const img of imgs){
      const natural=await img.evaluate(el=>el.naturalWidth).catch(()=>0);
      if(natural===0){
        const src=await img.getAttribute('src');
        brokenImgs.push(src);
      }
    }

    // Div balance
    const divCheck=await page.evaluate(()=>{
      const h=document.documentElement.outerHTML;
      const o=(h.match(/<div[ >]/g)||[]).length;
      const c=(h.match(/<\/div>/g)||[]).length;
      return {opens:o,closes:c,ok:o===c};
    });

    // Theme check
    const accent=await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--cyan'));
    const bg=await page.evaluate(()=>getComputedStyle(document.body).backgroundColor);

    // Link count
    const links=await page.locator('a[href]').count();

    results[pageInfo.name]={
      title,h1,h1Count:(await page.locator('h1').count()),
      accent,bg,links,brokenImgs,divCheck,errors,
      has111:bodyText.includes('111+'),
      hasV21:bodyText.includes('v2.1'),
      hasCyan:accent.trim()==='#0cf',
    };

    console.log(`  Title: ${title}`);
    console.log(`  H1: ${h1}`);
    console.log(`  Accent: ${accent.trim()}`);
    console.log(`  BG: ${bg}`);
    console.log(`  Divs: ${divCheck.opens}/${divCheck.closes} ${divCheck.ok?'OK':'X'}`);
    console.log(`  Broken imgs: ${brokenImgs.length?brokenImgs.join(','):'none'}`);
    console.log(`  Console errors: ${errors.length?errors.join('; '):'none'}`);

    await context.close();
  }

  // Summary
  console.log('\n\n=== AUDIT SUMMARY ===');
  for(const [name,r] of Object.entries(results)){
    if(r.error){console.log(`${name}: ERROR - ${r.error}`);continue;}
    const issues=[];
    if(!r.divCheck.ok)issues.push('DIV_MISMATCH');
    if(r.brokenImgs.length)issues.push('BROKEN_IMG');
    if(r.errors.length)issues.push('CONSOLE_ERRORS');
    if(!r.hasCyan)issues.push('WRONG_ACCENT');
    if(!r.has111)issues.push('MISSING_111+');
    console.log(`${name}: ${issues.length?issues.join(', '):'✅ ALL GOOD'}`);
  }

  // Save results
  fs.writeFileSync('d:/AI/_audit-results.json',JSON.stringify(results,null,2));
  console.log('\nResults saved to d:/AI/_audit-results.json');

  await browser.close();
})().catch(e=>{
  console.error('FATAL:',e.message);
  process.exit(1);
});
