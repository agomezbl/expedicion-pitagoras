// Comprueba todos los generadores en los dos idiomas y las tres dificultades: respuestas coherentes, sin NaN/undefined.
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>localStorage.setItem('expedicion-pitagoras-v1',JSON.stringify({voice:{on:false},audio:{muted:true},free:true,stars:{c1:1,c2:1,c3:1,c7:1,c4:1,c8:1,c9:1,c10:1,c5:1,c6:1}})));
 await p.goto('file://'+path.join(__dirname,'..','dist','test.html'));await p.waitForTimeout(300);
 const res=await p.evaluate(()=>{const P=window.__P,bad=[];let n=0;
  const gens=['qRootPerfect','qRootBetween','qRootSum','qIrrational','qSqOfRoot','qRootApprox','qDiagSquare','qSquareFromArea','qRightAt','qWhichTool','qCarpenter','qProofRecip','qProofDirect','qCosId','qCosValue','qCosAdj','qCosHyp','qCosAngle','qCosImpossible','qCosCtx','qGridDist','qGridMap','qBoxFace','qBoxSpace','qBoxFit','qCube','qCircle','qCircleWhy'];
  const builds=['buildC1','buildC3','buildC4','buildC5','buildC7','buildC8','buildC9','buildC10','buildDaily','buildExam'];
  const chk=(q,src)=>{n++;const s=JSON.stringify([q.prompt,q.choices,q.explain,q.hint,q.steps]);if(/undefined|NaN|\[object/.test(s))bad.push(src+': undefined/NaN '+s.slice(0,200));
   const fig=q.fig?q.fig():'';if(/undefined|NaN/.test(fig))bad.push(src+': figura con NaN/undefined');
   if(q.kind==='num'){if(!isFinite(q.answer))bad.push(src+': answer '+q.answer);if(!P.checkAnswer(q,q.answer))bad.push(src+': answer no pasa su propia comprobación '+q.answer+' '+q.exact);}
   if(q.kind==='choice'){if(!(q.answer>=0&&q.answer<q.choices.length))bad.push(src+': choice index');if(new Set(q.choices.map(c=>P.plain(c))).size!==q.choices.length)bad.push(src+': opciones repetidas '+q.choices.map(c=>P.plain(c)).join(' | '));}
   if(q.kind==='proof'){q.steps.forEach((s,i)=>{if(!(s.a>=0&&s.a<s.opts.length))bad.push(src+': paso '+i);if(new Set(s.opts).size!==s.opts.length)bad.push(src+': paso con opciones repetidas '+s.opts.join(' | '));});}};
  for(const l of ['fr','es'])for(const d of ['aprendiz','explorador','leyenda']){P.setLang(l);P.S.diff=d;
   for(const g of gens)for(let k=0;k<60;k++){try{chk(P[g](),g+' '+l+' '+d);}catch(e){bad.push(g+' '+l+' '+d+': '+e.message);}}
   for(const g of builds)for(let k=0;k<15;k++){try{P[g]().forEach(q=>{if(q.kind!=='intro'&&q.kind!=='lab'&&q.kind!=='info')chk(q,g+' '+l+' '+d);});}catch(e){bad.push(g+': '+e.message);}}
   for(const tp of P.TOPICS)for(let k=0;k<40;k++){try{chk(P.genTopic(tp[0]),'topic '+tp[0]);}catch(e){bad.push('topic '+tp[0]+': '+e.message);}}
   for(let k=0;k<200;k++){try{chk(P.nextBoss(),'boss');}catch(e){bad.push('boss: '+e.message);}}
  }
  /* proof: el triángulo dice la verdad sobre ser rectángulo */
  return {n,bad:[...new Set(bad)].slice(0,40),nb:bad.length};});
 console.log('preguntas comprobadas',res.n,'fallos',res.nb);res.bad.forEach(x=>console.log('  ',x));console.log('errores JS',errs.slice(0,5));
 console.log(res.nb||errs.length?'HAY FALLOS':'TODO OK');await b.close();})();
