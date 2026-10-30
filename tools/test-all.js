// Prueba de punta a punta: prólogo con escena, las 10 cámaras resueltas desde la interfaz, modos, códice, ajustes,
// copia de seguridad y cambio de idioma. Revisa errores JS, textos sin traducir y desbordes.
// Uso: node tools/test-all.js fr-pc|es-pc|fr-movil|es-movil
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const cfg=process.argv[2]||'fr-pc',[lang,dev]=cfg.split('-');const SH=path.join(__dirname,'..','shots','test-'+cfg);fs.mkdirSync(SH,{recursive:true});
const BAD={fr:/[¿¡ñ]|(?<![\p{L}])(el|los|las|del|cámara|hipotenusa|cateto|catetos|pulsa|toca|aciertos|reto|retos|ángulo)(?![\p{L}])/iu,es:/[çèêœ]|(?<![\p{L}])(les|des|est|une|côté|avec|salle|réussi|défi|angle)(?![\p{L}])/iu};
(async()=>{const b=await chromium.launch();const errs=[],issues=[];let steps=0;
 const ctx=await b.newContext(dev==='movil'?{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1280,height:860}});
 await ctx.addInitScript(l=>{if(!sessionStorage.getItem('init')){sessionStorage.setItem('init','1');localStorage.setItem('expedicion-pitagoras-v1',JSON.stringify({lang:l,voice:{on:false},audio:{muted:true},duel:{p1:'Nil'}}));}},lang);
 const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
 await p.goto('file://'+path.join(__dirname,'..','dist','test.html'));await p.waitForTimeout(500);
 const W=ms=>p.waitForTimeout(ms);
 const check=async tag=>{steps++;const r=await p.evaluate(()=>{const vis=el=>{if(!el||el.hidden)return '';return el.innerText||''};const txt=['#top','#view','#modal','#talk','#curtain'].map(s=>vis(document.querySelector(s))).join('\n').replace(/Français|Español/g,'');const sk=[...document.querySelectorAll('.otherlang')].map(e=>e.innerText);let tx2=txt;sk.forEach(x=>{tx2=tx2.split(x).join('')});
    const sw=document.scrollingElement.scrollWidth,iw=innerWidth;const over=[...document.querySelectorAll('#view *,#talk *,#modal *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>iw+2&&getComputedStyle(e).position!=='fixed'&&!e.closest('.tl,.tk-scene,.scene-grid')}).slice(0,3).map(e=>e.className&&e.className.baseVal!=null?e.tagName:(e.tagName+'.'+e.className));return {txt:tx2,sw,iw,over};});
   const m=r.txt.match(BAD[lang]);if(m){const i=r.txt.search(BAD[lang]);issues.push(`${tag}: texto en otro idioma «${r.txt.slice(Math.max(0,i-40),i+40).replace(/\n/g,' ')}»`);}
   if(r.sw>r.iw+2)issues.push(`${tag}: desborde horizontal ${r.sw}>${r.iw}`);if(r.over.length)issues.push(`${tag}: elementos fuera de pantalla ${r.over.join(', ')}`);
   if(/undefined|NaN/.test(r.txt))issues.push(`${tag}: undefined/NaN en pantalla`);};
 const talkThrough=async tag=>{for(let k=0;k<60;k++){const on=await p.evaluate(()=>!document.querySelector('#talk').hidden);if(!on)return true;
   const opt=await p.$('#tkOpts:not([hidden]) .tk-o');if(opt){await check(tag+' dilema');await opt.click();await W(150);continue;}
   await p.click('#tkText').catch(()=>{});await W(60);await p.click('#tkText').catch(()=>{});await W(60);}
   issues.push(tag+': la escena no termina');return false;};
 const snap=async n=>{await p.screenshot({path:path.join(SH,n+'.png')});};
 // --- título y prólogo ---
 await check('título');await snap('00-titulo');
 await p.click('[data-act="start"]');await W(4500);
 await p.click('#curtain').catch(()=>{});await W(2200);
 for(let k=0;k<20&&await p.evaluate(()=>document.querySelector('#talk').hidden);k++)await W(300);
 await check('prólogo');await snap('01-prologo');await talkThrough('prólogo');await W(400);
 // --- resolver una cámara desde la interfaz ---
 const solveRun=async(id,maxQ=40,quiet)=>{for(let k=0;k<maxQ*3;k++){await W(80);
   const st=await p.evaluate(()=>{const R=__P.R;if(!R)return {end:true};if(R.over)return {end:true};const q=R.q;if(!q)return {wait:true};
     return {kind:q.kind,done:!!q.done,mark:!!(q.mark&&!q.markDone),ans:q.answer,step:q.step,type:q.type,mode:R.ch.mode};});
   if(st.end)return true;if(st.wait)continue;
   if(st.mode==='arcade')await p.evaluate(()=>{const R=__P.R;if(R&&R.correct>=13&&R.time>1)R.time=0.5;});
   if(await p.evaluate(()=>!document.querySelector('#talk').hidden)){await talkThrough(id+' escena');continue;}
   const nx=await p.$('#view [data-act="next"]:not([disabled])');
   if(st.kind==='intro'||st.kind==='info'||st.kind==='lab'||st.done){if(nx){await nx.click({timeout:4000}).catch(()=>{});await W(330);}else await W(200);continue;}
   if(st.mark){await p.evaluate(()=>{const q=__P.R.q;const tk=[...q.prompt.matchAll(/\[\[([hpqd]):/g)].map(m=>({h:'hipotenusa',p:'cateto',q:'cateto',d:'nosirve'})[m[1]]);q.roles=tk;q.askSel={cat:'cateto',hyp:'hipotenusa',ahorro:'diferencia'}[q.ask];});await p.click('[data-act="markCheck"]',{timeout:4000}).catch(()=>{});await W(200);continue;}
   if(st.kind==='choice'){await p.click(`#answerBox .choice[data-i="${st.ans}"]`,{timeout:4000}).catch(()=>{});await W(250);continue;}
   if(st.kind==='proof'){const a=await p.evaluate(()=>{const q=__P.R.q;return q.steps[q.step].a});await p.click(`.pf-o[data-i="${a}"]`,{timeout:4000}).catch(()=>{});await W(120);continue;}
   if(st.kind==='num'){const v=String(Math.round(st.ans*100)/100).replace('.',',');await p.fill('#ans',v,{timeout:4000}).catch(()=>{});await p.click('#ansForm button[type=submit]',{timeout:4000}).catch(()=>{});await W(250);continue;}
  }if(!quiet)issues.push(id+': no termina');return false;};
 const finishTo=async()=>{for(let k=0;k<30&&!(await p.evaluate(()=>document.body.dataset.view==='summary'&&document.querySelector('#curtain').hidden));k++)await W(200);await W(1600);for(let k=0;k<12&&await p.evaluate(()=>!document.querySelector('#talk').hidden||!document.querySelector('#curtain').hidden);k++){if(await p.evaluate(()=>!document.querySelector('#talk').hidden))await talkThrough('outro');else await W(300);}};
 for(const id of await p.evaluate(()=>__P.ORDER)){
   if(await p.evaluate(()=>!document.querySelector('#talk').hidden))await talkThrough('outro tardío');
   await p.evaluate(()=>__P.go('map'));await W(900);for(let k=0;k<20&&await p.evaluate(id=>!__P.S.revealed.includes(id),id);k++)await W(300);await W(300);
   await p.evaluate(id=>{document.querySelector(`.tmap [data-id="${id}"]`).dispatchEvent(new MouseEvent('click',{bubbles:true}))},id);await W(300);
   const btn=await p.$(`.mpanel [data-act="enter"][data-id="${id}"]`);if(!btn){issues.push(id+': no se puede entrar (¿bloqueada?)');continue;}
   await btn.click();await W(1500);for(let k=0;k<40&&await p.evaluate(()=>!document.querySelector('#curtain').hidden);k++)await W(200);await W(500);
   if(await p.evaluate(()=>!document.querySelector('#talk').hidden)){await snap(`s-${id}`);await check(id+' escena');await talkThrough(id+' escena');}
   await W(300);await check(id+' intro');
   let qn=0;const t0=Date.now();
   await solveRun(id);await finishTo();await check(id+' resumen');await snap(`r-${id}`);
   const stars=await p.evaluate(id=>__P.S.stars[id]||0,id);if(!stars)issues.push(id+': sin estrellas al final');
   console.log('cámara',id,'estrellas',stars,Math.round((Date.now()-t0)/1000)+'s');
 }
 // --- modos ---
 for(const m of ['daily','exam','survival']){await p.evaluate(m=>__P.startRun(m),m);await W(400);await check(m+' intro');
   if(m==='survival'){await p.evaluate(()=>{__P.R.maxLives=1;});for(let k=0;k<6;k++){await solveRun(m,1,true);}await p.evaluate(()=>{const R=__P.R;if(R&&!R.over)__P.finish('dead')});}else await solveRun(m);
   await finishTo();await check(m+' resumen');console.log('modo',m,'ok');}
 await p.evaluate(()=>__P.go('trainSetup'));await W(300);await check('entrenamiento');
 await p.evaluate(()=>{__P.S.trainTopics=__P.TOPICS.map(x=>x[0]);__P.startRun('train',{topics:__P.S.trainTopics});});await W(300);
 for(let k=0;k<12;k++){await solveRun('train',1,true);await p.evaluate(()=>{const R=__P.R;if(R&&R.q&&R.q.done)__P.next();});await W(300);await check('entrenamiento reto');}
 await p.evaluate(()=>{if(__P.R&&!__P.R.over)__P.finish('end')});await W(2500);
 // --- códice, ajustes, panel, copia ---
 await p.evaluate(()=>__P.go('codex'));await W(500);await check('códice');await snap('c-codex');
 for(const tab of ['dil','scenes']){await p.click(`[data-act="codexTab"][data-v="${tab}"]`);await W(300);await check('códice '+tab);}
 await p.evaluate(()=>__P.go('exp'));await W(300);await check('expediciones');
 await p.fill('#e1','30');await p.fill('#e2','40');await p.fill('#e3','50');await p.fill('#e4','50,5');await p.click('#expForm button[type=submit]');await W(300);await check('expedición resultado');
 await p.evaluate(()=>__P.go('map'));await W(400);await p.click('#top [data-act="settings"]');await W(300);await check('ajustes');await snap('c-ajustes');
 await p.click('[data-act="codeMake"]');await W(500);const code=await p.inputValue('#codeOut');
 const back=await p.evaluate(async c=>{const o=await __P.readCode(c);return o.xp===__P.S.xp&&JSON.stringify(o.stars)===JSON.stringify(__P.S.stars);},code);if(!back)issues.push('copia de seguridad no recupera el estado');
 await p.click('[data-act="closeModal"]');await W(300);await p.click('#top [data-act="guide"]');await W(300);await check('panel del guía');await snap('c-guia');
 await p.click('[data-act="closeModal"]');await W(300);
 const st=await p.evaluate(()=>({rel:Object.keys(__P.S.relics).length,dil:Object.keys(__P.S.dil).length,xp:__P.S.xp}));
 console.log('reliquias',st.rel,'dilemas',st.dil,'XP',st.xp);if(st.dil<12)issues.push('faltan dilemas: '+st.dil);
 await b.close();
 console.log(cfg,'pasos',steps,'errores JS',errs.length);errs.slice(0,8).forEach(e=>console.log('  JS',e));
 console.log('incidencias',issues.length);[...new Set(issues)].slice(0,25).forEach(x=>console.log('  ',x));
 console.log(!errs.length&&!issues.length?'TODO OK':'HAY FALLOS');})();
