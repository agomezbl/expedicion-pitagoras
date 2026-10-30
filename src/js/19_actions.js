/* =========================================================
   ACCIONES Y EVENTOS
   ========================================================= */
function applyLang(){L=S.lang==='fr'?'fr':'es';document.documentElement.lang=L;loadVoices();const c=$('#calc');if(c){const was=!c.hidden;c.innerHTML=calcHTML();c.hidden=!was;}document.title=plain(t('L’Expédition Pythagore','La Expedición Pitágoras'));}
function setLang(l){if(l!=='fr'&&l!=='es'||l===L&&S.lang===l)return;S.lang=l;save();hush();applyLang();sfx('page');
  if(view==='play'||view==='summary'){go('map');toast(`<span>${t('Langue changée. La partie en cours a été fermée.','Idioma cambiado. La partida en curso se ha cerrado.')}</span>`,2600);}
  else{render();}
  if(!$('#modal').hidden&&$('#setMusic'))openSettings();}
const ACT={
  go:b=>{sfx('click');if(b.dataset.sage){codexSel=b.dataset.sage;codexTab='sages';}navGo(b.dataset.v,b);},
  start:()=>startGame(),
  enter:b=>navEnter(b.dataset.id,b),
  pick:b=>{const id=b.dataset.id;mapSel=id;sfx('page');$$('.tmap .node').forEach(n=>{const d=n.querySelector('[data-id]');n.classList.toggle('sel',!!d&&d.dataset.id===id);});const pn=$('.mpanel');if(pn){pn.outerHTML=mapPanel(id);revealText($('.mapwrap'));}say(S.revealed.includes(id)?chName(id)+'. '+(isUnlocked(ORDER.indexOf(id))?T(CH[id].desc):t('Fermée.','Cerrada.')):t('Une salle cachée dans la brume.','Una cámara oculta en la niebla.'));},
  sage:b=>{codexSel=b.dataset.id;sfx('page');const v=$('#view');v.innerHTML=codexHTML();revealText(v);const it=$(`.tl-item[data-id="${codexSel}"]`);if(it)it.scrollIntoView({block:'nearest',inline:'center',behavior:reduced()?'auto':'smooth'});readSage(codexSel);},
  sageAns:b=>sageAnswer(b.dataset.id,+b.dataset.i),
  sageRead:b=>readSage(b.dataset.id,true),
  codexTab:b=>{codexTab=b.dataset.v;sfx('page');hush();const v=$('#view');v.innerHTML=codexHTML();revealText(v);},
  replayScene:b=>{sfx('click');const id=b.dataset.id;playScene(id).then(()=>{if(view==='codex'){const v=$('#view');v.innerHTML=codexHTML();revealText(v);}});},
  next:()=>{sfx('click');next();},
  retry:()=>{const q=R&&R.q;if(!q)return;q.done=false;q.result=null;R.scored--;q.t0=Date.now();if(q.kind==='proof'){q.step=0;q.errs=0;q.steps.forEach(s=>{s.err=false;s.bad=[];s.msg='';});}renderQ();},
  endRun:()=>finish('end'),
  hint:useHint,calc:()=>toggleCalc(),speak:()=>{const q=R&&R.q;if(q)say(promptText(q),'manual');},
  choose:b=>answer(+b.dataset.i),role:b=>cycleRole(+b.dataset.k),ask:b=>setAsk(b.dataset.v),markCheck,proofPick:b=>proofPick(+b.dataset.i),
  relics:openRelics,guide:()=>{sfx('click');openGuide();},settings:()=>{audioInit();sfx('click');openSettings();},closeModal:()=>closeModal(true),
  mute:()=>{audioInit();S.audio.muted=!S.audio.muted;save();applyVolumes();if(S.audio.muted)hush();renderTop();},
  lang:()=>setLang(L==='fr'?'es':'fr'),setLang:b=>setLang(b.dataset.lang),
  diff:b=>{S.diff=b.dataset.v;save();sfx('click');openSettings();renderTop();if(view==='map'||view==='title'||view==='trainSetup')render();},
  voiceSrc:b=>{S.voice.src=b.dataset.v;save();sfx('click');openSettings();},
  testVoice:()=>say(t('Bonjour. Je suis la voix du temple. Le carré de l’hypoténuse est égal à la somme des carrés des deux autres côtés.','Hola. Soy la voz del templo. La hipotenusa al cuadrado es igual a la suma de los cuadrados de los catetos.'),'test'),
  testVoiceRec:()=>say(T(SCENES.c1.lines[0].t),'manual',{who:'teano'}),
  codeMake,codeCopy,codeLoad,codeApply,
  topic:b=>{const k=b.dataset.v;if(!topicOpen(k))return;const set=new Set(S.trainTopics||[]);set.has(k)?set.delete(k):set.add(k);S.trainTopics=[...set];save();sfx('click');render();},
  trainStart:()=>{const tp=(S.trainTopics||[]).filter(topicOpen);if(tp.length)startRun('train',{topics:tp});},
  expOpen:b=>{expSel=b.dataset.id;sfx('click');render();},ropeDone,calcKey:b=>calcKey(b.dataset.k),calcUse,
  saveNames:()=>{S.duel.p1=$('#gn1').value.trim()||'Nil';S.duel.p2=$('#gn2').value.trim()||t('Papa','Papá');save();toast(`<span>${t('Noms enregistrés.','Nombres guardados.')}</span>`,1800);if(view==='map')render();},
  toggleFree:()=>{S.free=!S.free;save();$('#modalCard').innerHTML=XBTN()+guideHTML();if(view==='map')render();},
  reset:()=>{if(!resetArmed){resetArmed=true;$('#modalCard').innerHTML=XBTN()+guideHTML();return;}const keepAudio=S.audio,keepVoice=S.voice,keepLang=S.lang;S=fresh();S.audio=keepAudio;S.voice=keepVoice;S.lang=keepLang;save();closeModal();go('map');toast(`<span>${t('Progression effacée. L’expédition repart de zéro.','Progreso borrado. La expedición empieza de cero.')}</span>`,2400);},
};
document.addEventListener('click',e=>{audioInit();const b=e.target.closest('[data-act]');if(!b||b.disabled)return;if(TALK.on&&!b.closest('#talk'))return;const f=ACT[b.dataset.act];if(f){e.preventDefault();f(b,e);}});
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal(true);});
document.addEventListener('submit',e=>{const id=e.target.id;if(id==='ansForm'){e.preventDefault();submitNum();}else if(id==='expForm'){e.preventDefault();expCheck();}});
document.addEventListener('input',e=>{
  const id=e.target.id;
  if(id==='la'||id==='lb')labUpdate();
  else if(id==='setMusic'){S.audio.music=+e.target.value;$('#musOut').textContent=Math.round(S.audio.music*100)+' %';applyVolumes();save();}
  else if(id==='setSfx'){S.audio.sfx=+e.target.value;$('#sfxOut').textContent=Math.round(S.audio.sfx*100)+' %';applyVolumes();save();}
  else if(id==='setRate'){S.voice.rate=+e.target.value;$('#rateOut').textContent=fmt(S.voice.rate)+'×';save();}
});
document.addEventListener('change',e=>{
  const id=e.target.id;
  if(id==='setSfx')sfx('ok');
  else if(id==='setMute'){S.audio.muted=e.target.checked;save();applyVolumes();renderTop();if(S.audio.muted)hush();}
  else if(id==='setVoiceOn'){S.voice.on=e.target.checked;save();if(!S.voice.on)hush();}
  else if(id==='setAuto'){S.voice.auto=e.target.checked;save();}
  else if(id==='setVoice'){S.voice.name=e.target.value;save();loadVoices();say(t('Voici ma voix.','Esta es mi voz.'),'test');}
  else if(id==='setRate'){say(t('Voilà à quelle vitesse je parle.','Así de rápido hablo.'),'test');}
});
document.addEventListener('keydown',e=>{
  if(TALK.on)return;
  const modal=$('#modal'),tg=e.target;
  if(e.key==='Escape'){if(!modal.hidden){closeModal(true);return;}if(!$('#calc').hidden){toggleCalc(false);return;}}
  if(tg.id==='calcIn'&&e.key==='Enter'){e.preventDefault();calcKey('=');return;}
  if(!modal.hidden||e.repeat)return;
  const inField=tg.matches&&tg.matches('input,textarea,select');
  if(inField)return;
  if((e.key==='Enter'||e.key===' ')&&tg.matches&&tg.matches('[data-act]:not(button)')){e.preventDefault();tg.dispatchEvent(new MouseEvent('click',{bubbles:true}));return;}
  if(e.key==='Enter'){if(tg.closest&&tg.closest('button'))return;const b=$('#view [data-act="next"], #view [data-act="retry"]');if(b){e.preventDefault();b.click();}return;}
  if(view==='play'&&R&&R.q&&!R.q.done&&/^[1-4]$/.test(e.key)){const i=+e.key-1;if(R.q.kind==='choice'&&i<R.q.choices.length)answer(i);else if(R.q.kind==='proof'){const b=$(`.pf-opts .pf-o[data-i="${i}"]`);if(b&&!b.disabled)proofPick(i);}}
});

/* ---------- arranque ---------- */
if(!Array.isArray(S.revealed)){S.revealed=ORDER.filter((id,i)=>isUnlocked(i));save();}
if(S.prologue){['pitagoras','teano'].forEach(k=>{if(!S.sages[k])S.sages[k]={q:false};});}
ORDER.forEach(id=>{if((S.stars[id]||0)>=1)SAGES.forEach(x=>{if(x.at===id&&!S.sages[x.id])S.sages[x.id]={q:false};});});
applyLang();loadRec();
makeGrain();requestAnimationFrame(parLoop);
go('title');
