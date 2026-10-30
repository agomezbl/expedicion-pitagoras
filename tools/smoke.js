const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const errs=[];
 for(const lang of ['fr','es']){const ctx=await b.newContext({viewport:{width:1280,height:860}});
  await ctx.addInitScript(l=>localStorage.setItem('expedicion-pitagoras-v1',JSON.stringify({lang:l,voice:{on:false},audio:{muted:true}})),lang);
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(lang+': '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(lang+' console: '+m.text())});
  await p.goto('file://'+path.join(__dirname,'..','dist','test.html'));await p.waitForTimeout(500);
  await p.screenshot({path:`/tmp/claude-0/-home-claude/696a25bd-debd-5ac8-9a48-ce202486a912/scratchpad/title-${lang}.png`});
  await p.evaluate(()=>window.__P.go('map'));await p.waitForTimeout(500);
  await p.screenshot({path:`/tmp/claude-0/-home-claude/696a25bd-debd-5ac8-9a48-ce202486a912/scratchpad/map-${lang}.png`,fullPage:true});
  await ctx.close();}
 console.log('errores',errs.length,errs.slice(0,10));await b.close();})();
