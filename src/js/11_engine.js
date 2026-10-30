/* =========================================================
   MOTOR DE JUEGO
   ========================================================= */
let R=null,view='title',lastId=null,mapSel=null;
const scorable=q=>q.kind==='num'||q.kind==='choice'||q.kind==='proof';
function stopTimers(){if(R&&R.timer){clearInterval(R.timer);R.timer=null;}setHot(false);}
function startRun(id,opts={}){
  stopTimers();closeModal();hush();
  const ch=CH[id];lastId=id;const D0=DF();
  R={id,ch,i:-1,list:[],correct:0,scored:0,xp:0,lives:0,maxLives:0,newRelics:[],traps:0,combo:0,maxCombo:0,over:false};
  const lv=ch.lives==='D'?D0.lives:(ch.lives||0);R.lives=lv;R.maxLives=lv;
  if(ch.mode==='arcade'){R.time=D0.arcade;R.maxTime=D0.arcade;R.list=[intro(id)];R.gen=nextBridge;}
  else if(ch.mode==='boss'){R.hp=D0.hp;R.maxHp=D0.hp;R.hearts=D0.hearts;R.maxHearts=D0.hearts;R.list=[intro(id)];R.gen=nextBoss;}
  else if(ch.mode==='train'){R.topics=opts.topics||['hyp'];R.list=[intro(id)];R.gen=nextTrain;}
  else if(ch.mode==='survival'){R.lives=D0.survLives;R.maxLives=D0.survLives;R.qtime=D0.survTime;R.list=[intro(id)];R.gen=nextSurvival;}
  else{R.list=ch.build();if(ch.mode==='escape'){R.time=D0.escape;R.maxTime=D0.escape;R.seals=[];}}
  if(ch.mode==='exam'){R.t0=Date.now();R.list=R.list.filter(q=>q.kind!=='proof');}
  R.silentIntro=!!opts.silent;
  setView('play');toggleCalc(false);setScene(ch.scene||'dust');musicPlay(ch.music||'calm');if(!opts.silent)sfx('enter');
  const isCh=ORDER.includes(id);
  $('#view').innerHTML=`<section class="play scene-${id}"><div class="playbar"><button class="btn ghost" data-act="go" data-v="map">← ${t('Carte','Mapa')}</button><div class="pb-emb">${embSVG(id)}</div><div class="pb-title"><p class="eyebrow">${isCh?t('Salle ','Cámara ')+chNum(id)+' · ':''}${T(ch.tag)} · ${dfName()}</p><h2 data-reveal=".6">${chName(id)}</h2></div><div class="pb-status" id="pbStatus"></div></div><div class="stage" id="stage"></div></section>`;
  renderTop();window.scrollTo(0,0);arrive();revealText($('#view'));next();
}
function next(){
  if(!R||R.over||R.leaving)return;
  const st=$('#stage');
  if(st&&st.childElementCount&&!reduced()){R.leaving=true;st.classList.remove('enter');st.classList.add('leave');setTimeout(()=>{if(!R||R.over)return;R.leaving=false;st.classList.remove('leave');advance();},230);}
  else advance();
}
function advance(){
  if(!R||R.over)return;
  R.paused=false;
  if(R.maxLives&&R.lives<=0)return finish(R.ch.mode==='survival'?'dead':'nolives');
  if(R.ch.mode==='boss'){if(R.hp<=0)return finish('win');if(R.hearts<=0)return finish('lose');}
  R.i++;
  if(R.i>=R.list.length){if(R.gen){let q=R.gen();if(R.ch.mode==='arcade'||R.ch.mode==='survival'){let k=0;while(q.kind==='proof'&&k++<5)q=R.gen();}R.list.push(q);}else return finish(R.ch.mode==='escape'?'escaped':'done');}
  R.q=R.list[R.i];R.q.t0=Date.now();
  if(R.ch.mode==='survival'&&R.qtime&&scorable(R.q)){R.time=R.q.kind==='proof'?R.qtime*2:R.qtime;R.maxTime=R.time;}
  renderQ();
  const timed=R.ch.mode==='arcade'||R.ch.mode==='escape'||R.ch.mode==='exam'||(R.ch.mode==='survival'&&R.qtime);
  if(timed&&R.q.kind!=='intro'&&!R.timer)startTimer();
}
function startTimer(){
  R.timer=setInterval(()=>{
    if(!R||R.over)return;
    if(R.ch.mode==='exam'){tickStatus();return;}
    if(R.paused||TALK.on||(R.q&&R.q.done&&R.ch.mode==='survival'))return;
    const before=Math.ceil(R.time);R.time=Math.max(0,R.time-.1);
    if(R.time<=10&&Math.ceil(R.time)<before&&R.time>0)sfx('clock');
    tickStatus();
    if(R.time<=0){
      if(R.ch.mode==='survival'){timeUp();return;}
      stopTimers();finish(R.ch.mode==='escape'?'timeout':'end');
    }
  },100);
}
function timerHTML(label){const pct=R.time/R.maxTime*100,s=Math.ceil(R.time);const txt=R.ch.mode==='escape'?`${Math.floor(s/60)}:${pad2(s%60)}`:`${s} s`;return `<div class="timer">${R.ch.mode==='escape'?hourglass(R.time/R.maxTime):`<span class="small">${label}</span>`}<div class="tbar${pct<20?' low':''}"><i style="width:${pct}%"></i></div><span class="tnum">${txt}</span></div>`;}
function updateStatus(){
  const el=$('#pbStatus');if(!el||!R)return;const m=R.ch.mode;let h='';
  if(m==='std'||m==='exam'){const qs=R.list.filter(scorable);h+=`<div class="dots" aria-label="${t('Progression','Progreso')}">${qs.map(q=>`<span class="dot${q.result?' '+(m==='exam'?'done':q.result):''}${q===R.q?' cur':''}"></span>`).join('')}</div>`;}
  if((m==='std'||m==='survival')&&R.maxLives)h+=`<div class="lives" aria-label="${R.lives} ${t('amulettes','amuletos')}">${Array.from({length:R.maxLives},(_,i)=>ico('amulet','ico'+(i>=R.lives?' lost':''))).join('')}</div>`;
  if(m==='exam'){const s=Math.floor((Date.now()-R.t0)/1000);h+=`<span class="tnum" id="examClock">${Math.floor(s/60)}:${pad2(s%60)}</span>`;}
  if(m==='arcade'||m==='escape')h+=timerHTML(t('Torche','Antorcha'));
  if(m==='arcade')h+=`<span class="combo">${t('Ponts','Puentes')}: ${R.correct}${R.combo>=3?` · ${t('série','racha')} ×${R.combo>=8?4:R.combo>=5?3:2}`:''}</span>`;
  if(m==='boss')h+=`<div class="lives hearts" aria-label="${R.hearts} ${t('cœurs','corazones')}">${Array.from({length:R.maxHearts},(_,i)=>ico('heart','ico'+(i>=R.hearts?' lost':''))).join('')}</div>`;
  if(m==='train')h+=`<span class="combo">${t('Réussites','Aciertos')} ${R.correct}/${R.scored} · ${t('série','racha')} ${R.combo}</span><button class="btn tiny" data-act="endRun">${t('Terminer','Terminar')}</button>`;
  if(m==='survival'){h+=`<span><span class="survn">${R.correct}</span> <span class="small">${t('défis · record','retos · récord')} ${S.records.survival[S.diff]||0}</span></span>`;if(R.qtime&&R.q&&scorable(R.q))h+=timerHTML(t('Temps','Tiempo'));}
  el.innerHTML=h;
}
function tickStatus(){
  if(!R)return;
  if(R.ch.mode==='exam'){const c=$('#examClock');if(c){const s=Math.floor((Date.now()-R.t0)/1000);c.textContent=`${Math.floor(s/60)}:${pad2(s%60)}`;}return;}
  const bar=$('#pbStatus .tbar'),num=$('#pbStatus .tnum');if(!bar||!num){updateStatus();return;}
  const pct=R.time/R.maxTime*100,s=Math.ceil(R.time);bar.firstElementChild.style.width=pct+'%';bar.classList.toggle('low',pct<20);
  num.textContent=R.ch.mode==='escape'?`${Math.floor(s/60)}:${pad2(s%60)}`:`${s} s`;
  if(R.ch.mode==='escape'){const tp=$('#hgTop'),b=$('#hgBot'),r=R.time/R.maxTime;if(tp){tp.setAttribute('y',(4+16*(1-r)).toFixed(1));tp.setAttribute('height',(16*r).toFixed(1));b.setAttribute('y',(36-16*(1-r)).toFixed(1));b.setAttribute('height',(16*(1-r)).toFixed(1));}}
  setHot(pct<25);
}
function qLabel(){
  const m=R.ch.mode;
  if(m==='arcade')return `${t('Pont','Puente')} ${R.correct+1}`;
  if(m==='boss')return t('Le Gardien attaque','El Guardián ataca');
  if(m==='escape')return t(`Sceau ${(R.seals||[]).length+1} sur 4`,`Sello ${(R.seals||[]).length+1} de 4`);
  if(m==='train')return `${t('Défi','Reto')} ${R.scored+1}`;
  if(m==='survival')return `${t('Marche','Peldaño')} ${R.scored+1}`;
  const qs=R.list.filter(scorable);return `${m==='exam'?t('Question','Pregunta'):t('Défi','Reto')} ${qs.indexOf(R.q)+1} ${t('sur','de')} ${qs.length}`;
}
function figFor(q,o={}){
  const m=R.ch.mode;
  if(m==='escape')return figDoor(o.newSeal);
  const inner=q.type==='word'?(q.mark&&!q.markDone?SCROLL_FIG():wordFig(q)):(q.fig?q.fig():'');
  if(m==='boss')return `<div class="bossfig">${figGuardian()}${inner?`<div class="bossq">${inner}</div>`:''}</div>`;
  if(R.id==='c3')return `<div class="figwrap">${inner}${depthGauge()}</div>`;
  return inner||SCROLL_FIG();
}
function renderQ(){
  const q=R.q,st=$('#stage');updateStatus();
  st.classList.remove('enter');void st.offsetWidth;st.classList.add('enter');
  if(q.kind==='intro'){const I=INTROS[q.id],ch=R.ch,rules=typeof I.rules==='function'?I.rules():I.rules;const hasSc=!!SCENES[q.id];
    st.innerHTML=`<div class="intro full"><div class="intro-art">${embSVG(q.id)}${SCENES[q.id]&&SCENES[q.id].cast?`<div class="intro-cast">${SCENES[q.id].cast.slice(0,2).map(w=>`<span class="ic-p">${portrait(w,'neutral')}</span>`).join('')}</div>`:''}</div><div class="intro-txt"><p class="eyebrow">${ORDER.includes(q.id)?t('Salle ','Cámara ')+chNum(q.id):T(ch.tag)} · ${t('Difficulté','Dificultad')} ${dfName()}</p><h2 data-reveal>${chName(q.id)}</h2><p class="lead">${T(I.story)}</p>${I.echo?`<p class="echo"><span>${t('Écho de l’histoire','Eco de la historia')}</span>${T(I.echo)}</p>`:''}<ul>${rules.map(r=>`<li>${r}</li>`).join('')}</ul><div class="row" style="justify-content:flex-start"><button class="btn primary big" data-act="next">${t('Entrer','Entrar')} ⏎</button>${hasSc?`<button class="btn" data-act="replayScene" data-id="${q.id}">${ico('scene')} ${t('Revoir la scène','Ver la escena')}</button>`:''}</div></div></div>`;
    revealText(st);if(!R.silentIntro)say(T(I.story)+(I.echo?' '+T(I.echo):''));R.silentIntro=false;return;}
  if(q.kind==='info'){st.innerHTML=`<div class="figcard">${q.fig()}</div><div class="qcard info"><p class="eyebrow">${t('Sceau débloqué','Sello desbloqueado')}</p><h2>${q.title}</h2>${q.html}<button class="btn primary" data-act="next" style="justify-self:start">${t('Continuer','Seguir')} ⏎</button></div>`;sfx('relic');say(q.say);return;}
  if(q.kind==='lab'){st.innerHTML=labHTML();labUpdate();say(t('Laboratoire du temple. Change les côtés et vérifie si le secret marche toujours.','Laboratorio del templo. Mueve los catetos y comprueba si el secreto funciona siempre.'));return;}
  const exam=R.ch.mode==='exam';
  st.innerHTML=`<div class="figcard" id="figBox">${figFor(q)}</div><div class="qcard${q.type==='word'?' parch':''}${q.kind==='proof'?' proofcard':''}" id="qcard">
    <div class="qhead"><span class="eyebrow">${qLabel()}</span>${SP.ok||SP.man?`<button class="btn tiny ghost" data-act="speak">${ico('voice')} ${t('Lire à voix haute','Leer en voz alta')}</button>`:''}</div>
    <div class="prompt" id="prompt">${promptHTML(q)}</div>
    <div id="markBox"></div><div id="answerBox"></div>
    <div class="qtools">${q.hint&&!exam?`<button class="btn tiny" data-act="hint" ${S.torches<1||q.hintUsed?'disabled':''}>${ico('flame')} ${t('Indice (1 torche)','Pista (1 antorcha)')}</button>`:''}${calcOn()?`<button class="btn tiny" data-act="calc">${t('Abaque','Ábaco')}</button>`:''}</div>
    <div id="hintBox" class="hintbox" ${q.hintUsed?'':'hidden'}>${q.hintUsed?'<b>'+t('Indice','Pista')+' :</b> '+q.hint:''}</div>
    <div id="feedback"></div></div>`;
  if(q.mark&&!q.markDone)renderMark();else renderAnswer();
  if(R.ch.mode!=='arcade'&&R.ch.mode!=='survival')say(promptText(q),'read');
}
function renderAnswer(){
  const q=R.q,box=$('#answerBox');if(!box)return;
  if(q.kind==='choice'){box.innerHTML=`<div class="choices${q.choices.some(c=>plain(c).length>60)?' long':''}">${q.choices.map((c,i)=>`<button class="btn choice" data-act="choose" data-i="${i}"><kbd>${i+1}</kbd> ${c}</button>`).join('')}</div>`;return;}
  if(q.kind==='proof'){box.innerHTML=proofHTML(q);return;}
  box.innerHTML=`<form class="ansrow" id="ansForm" autocomplete="off"><label for="ans" class="sr">${t('Ta réponse','Tu respuesta')}</label><input id="ans" inputmode="decimal" placeholder="?" autocomplete="off"><span class="unit">${q.unit||''}</span><button class="btn primary" type="submit">${t('Vérifier','Comprobar')}</button></form>${q.roundTxt?`<p class="small">${q.roundTxt}</p>`:q.round?`<p class="small">${roundTxt()}</p>`:''}`;
  const i=$('#ans');if(i&&!TOUCH)i.focus({preventScroll:true});
}
/* ---------- redacción de demostraciones ---------- */
function proofHTML(q){
  return `<ol class="proof">${q.steps.map((s,i)=>{const done=i<q.step,cur=i===q.step&&!q.done;
    const blank=done?`<span class="pf-fill${s.err?' had-err':''}">${s.opts[s.a]}</span>`:cur?`<span class="pf-blank">…</span>`:`<span class="pf-blank dim">…</span>`;
    return `<li class="${done?'done':cur?'cur':'todo'}">${s.pre?s.pre+' ':''}${blank}${s.post}${cur?`<div class="pf-opts">${s.opts.map((o,k)=>`<button class="btn choice pf-o${(s.bad||[]).includes(k)?' wrong':''}" data-act="proofPick" data-i="${k}" ${(s.bad||[]).includes(k)?'disabled':''}>${o}</button>`).join('')}</div>${s.msg?`<p class="mk-msg">${s.msg}</p>`:''}`:''}</li>`;}).join('')}</ol><p class="small">${t('Erreurs','Errores')} : <b id="pfErr">${q.errs}</b> · ${t('une seule est pardonnée','se perdona una')}</p>`;
}
function proofPick(k){
  const q=R&&R.q;if(!q||q.kind!=='proof'||q.done||R.over)return;const s=q.steps[q.step];if(!s)return;
  if(k===s.a){sfx('seal');q.step++;if(q.step>=q.steps.length){$('#answerBox').innerHTML=proofHTML(q);answer(q.errs);return;}$('#answerBox').innerHTML=proofHTML(q);const c=$('.proof li.cur');if(c)c.scrollIntoView({block:'nearest',behavior:reduced()?'auto':'smooth'});return;}
  q.errs++;s.err=true;s.bad=(s.bad||[]).concat(k);s.msg=s.why||t('Ce n’est pas ça. Relis la ligne d’avant.','No es eso. Vuelve a leer la línea anterior.');sfx('bad');S.stats.err.reciproco=(S.stats.err.reciproco||0)+(q.steps.length>4?1:0);
  $('#answerBox').innerHTML=proofHTML(q);shakeEl($('.proof li.cur'));if(s.why)say(plain(s.why));
}
function renderMark(msg){
  const q=R.q,box=$('#markBox');
  const opts=[['hipotenusa',t('L’hypoténuse','La hipotenusa')],['cateto',t('Un côté de l’angle droit','Un cateto')],['diferencia',t('Une différence (ce qu’on économise)','Una diferencia (cuánto se ahorra)')]];
  box.innerHTML=`<div class="markbox"><p class="mk-title">1 · ${t('Repère les données','Marca los datos')} <small>${t('Touche chaque nombre du parchemin jusqu’à ce qu’il dise ce qu’il est.','Pulsa cada número del pergamino hasta que diga lo que es.')}</small></p>
    <p class="mk-title">2 · ${t('Que dois-tu calculer ?','¿Qué te piden calcular?')}</p><div class="seg">${opts.map(([v,l])=>`<button class="btn tiny${q.askSel===v?' on':''}" data-act="ask" data-v="${v}">${l}</button>`).join('')}</div>
    <div><button class="btn primary" data-act="markCheck">${t('Vérifier les données','Comprobar datos')}</button></div>${msg?`<p class="mk-msg">${msg}</p>`:''}</div>`;
  $('#answerBox').innerHTML='';
}
function cycleRole(k){const q=R.q;if(!q||!q.mark||q.markDone)return;const order=[null,'cateto','hipotenusa','nosirve'];const cur=order.indexOf(q.roles[k]||null);q.roles[k]=order[(cur+1)%order.length];q.wrongIdx=(q.wrongIdx||[]).filter(i=>i!==k);$('#prompt').innerHTML=promptHTML(q);sfx('click');const b=$(`#prompt [data-k="${k}"]`);if(b)b.focus();}
function setAsk(v){R.q.askSel=v;sfx('click');const msg=$('.mk-msg');renderMark(msg?msg.innerHTML:'');}
function markCheck(){
  const q=R.q,toks=tokens(q.prompt);q.wrongIdx=[];
  toks.forEach((tk,i)=>{if(q.roles[i]!==EXPROLE[tk.role])q.wrongIdx.push(i);});
  const askOk=q.askSel==={cat:'cateto',hyp:'hipotenusa',ahorro:'diferencia'}[q.ask];
  if(!q.wrongIdx.length&&askOk){
    q.markDone=true;S.stats.markTotal++;sfx('seal');
    const first=!q.markFails;if(first)S.stats.markFirst++;save();
    $('#prompt').innerHTML=promptHTML(q);$('#figBox').innerHTML=figFor(q);
    $('#markBox').innerHTML=`<p class="mk-ok">${first?t('Œil de faucon : données parfaites du premier coup. +5 XP','Ojo de halcón: datos perfectos a la primera. +5 XP'):t('Données prêtes.','Datos listos.')} ${t('Maintenant, calcule.','Ahora calcula.')}</p>`;
    if(first){gainXP(5);if(S.stats.markFirst>=5)grant('halcon');say(t('Œil de faucon. Données parfaites. Maintenant, calcule.','Ojo de halcón. Datos perfectos. Ahora calcula.'));}else say(t('Données prêtes. Maintenant, calcule.','Datos listos. Ahora calcula.'));
    renderAnswer();return;
  }
  q.markFails=(q.markFails||0)+1;sfx('bad');shakeEl($('#qcard'));
  if(q.markFails>=3){toks.forEach((tk,i)=>{q.roles[i]=EXPROLE[tk.role];});q.askSel={cat:'cateto',hyp:'hipotenusa',ahorro:'diferencia'}[q.ask];q.wrongIdx=[];$('#prompt').innerHTML=promptHTML(q);renderMark(t('Je les repère pour toi cette fois. Regarde pourquoi chaque donnée est ce qu’elle est, puis touche « Vérifier les données ».','Te lo marco yo esta vez. Fíjate en por qué cada dato es lo que es y pulsa «Comprobar datos».'));return;}
  let msg=q.wrongIdx.length?(q.wrongIdx.length===1?t('Revois la donnée marquée en rouge.','Revisa el dato marcado en rojo.'):t('Revois les données marquées en rouge.','Revisa los datos marcados en rojo.')):'';
  if(!askOk)msg+=(msg?' ':'')+t('Relis la dernière question : que te demande-t-on exactement ?','Vuelve a leer la última pregunta: ¿qué te piden exactamente?');
  if(q.markFails===2)msg+=' '+t('Indice : l’hypoténuse, c’est ce qui est penché ou en diagonale (l’échelle, le câble, la corde, la diagonale).','Pista: la hipotenusa es lo que va inclinado o en diagonal (la escalera, el cable, la cuerda, la diagonal).');
  $('#prompt').innerHTML=promptHTML(q);renderMark(msg);say(plain(msg));
}
function submitNum(){
  const inp=$('#ans');if(!inp||inp.disabled)return;const x=parseNum(inp.value);
  if(isNaN(x)){shakeEl(inp);inp.focus();return;}
  answer(x);
}
function checkAnswer(q,x){if(q.kind==='choice')return x===q.answer;if(q.kind==='proof')return x<=1;const target=q.exact!=null?q.exact:q.answer;if(q.tol!=null)return Math.abs(x-target)<=q.tol+1e-9;return Math.abs(x-target)<=(q.round?0.11:0.02)+1e-9;}
function choiceDiag(q,x){const o=q.wrongOf?q.wrongOf(x):x;return q.diag?q.diag(o):['calculo',t('Ce n’est pas ça','No es esa'),''];}
function topicStat(q,ok){const k=q.topic||'hyp';const s=S.stats.topic[k]||(S.stats.topic[k]={n:0,ok:0});s.n++;if(ok)s.ok++;}
function timeUp(){
  const q=R.q;if(!q||q.done)return;q.done=true;q.result='bad';R.scored++;R.combo=0;S.runStreak=0;topicStat(q,false);
  const inp=$('#ans');if(inp)inp.disabled=true;$$('#answerBox button').forEach(b=>b.disabled=true);
  R.lives--;sfx('bad');flash('bad');showFeedback(false,q,{d:['tiempo',t('Temps écoulé','Se acabó el tiempo'),t('Le sable s’est écoulé avant ta réponse.','La arena se agotó antes de responder.')],rushed:false});sayL(LINES.bad.tiempo[0]);save();updateStatus();
}
function answer(x){
  const q=R.q;if(!q||q.done||R.over)return;q.done=true;
  const dt=(Date.now()-q.t0)/1000,ok=checkAnswer(q,x),mode=R.ch.mode;
  S.stats.answered++;S.stats.time+=Math.min(dt,180);R.scored++;topicStat(q,ok);
  const inp=$('#ans');if(inp)inp.disabled=true;$$('#answerBox button').forEach(b=>b.disabled=true);
  if(mode==='exam'){
    q.given=x;q.result=ok?'ok':'bad';if(ok){S.stats.correct++;R.correct++;}else{const d=q.kind==='choice'?choiceDiag(q,x):diagnose(q,x);S.stats.err[d[0]]=(S.stats.err[d[0]]||0)+1;}
    if(q.kind==='choice'){const bs=$$('#answerBox .choice');if(bs[x])bs[x].classList.add('picked');}
    sfx('seal');$('#feedback').innerHTML=`<div class="fb neutral" role="status"><p class="fb-title">${t('Réponse enregistrée','Respuesta guardada')}</p></div>`;save();updateStatus();
    setTimeout(()=>{if(R&&R.q===q&&!R.over)next();},650);return;
  }
  if(q.kind==='choice'){const bs=$$('#answerBox .choice');if(bs[q.answer])bs[q.answer].classList.add('right');if(!ok&&bs[x])bs[x].classList.add('wrong');}
  if(ok){
    q.result='ok';S.stats.correct++;R.correct++;R.combo++;R.maxCombo=Math.max(R.maxCombo,R.combo);
    S.runStreak++;S.bestRun=Math.max(S.bestRun,S.runStreak);
    let xp=q.hintUsed?5:10;const tags=[];
    if(q.kind==='proof'){xp=q.errs?12:20;S.proofs.done++;if(!q.errs){S.proofs.perfect++;tags.push(t('Rédaction parfaite','Redacción perfecta'));if(S.proofs.perfect>=5)grant('redactor');}}
    if(mode==='arcade'){const mult=R.combo>=8?4:R.combo>=5?3:R.combo>=3?2:1;xp*=mult;if(mult>1)tags.push(`${t('Série','Racha')} ×${mult}`);}
    if(mode==='survival')xp+=Math.min(10,Math.floor(R.correct/3)*2);
    if(q.trap){S.traps++;R.traps++;xp+=5;tags.push(t('Piège évité','Trampa evitada'));}
    let crit=false;
    if(mode==='boss'){crit=dt<DF().crit*(q.kind==='proof'?2.5:1);const dmg=crit?2:1;R.hp=Math.max(0,R.hp-dmg);tags.push(crit?t('Coup critique −2','Golpe crítico −2'):t('Coup −1','Golpe −1'));}
    if(mode==='escape'){R.seals.push(q.answer);R.paused=true;}
    const shown=gainXP(xp);
    sfx(mode==='escape'?'seal':mode==='boss'?'hit':mode==='arcade'?'rope':'ok');
    burst($('#answerBox'),'ok');flash('ok');flyXP(shown);
    showFeedback(true,q,{tags,xp:shown});
    if(mode==='arcade'){grant('cuerda');if(R.combo>=8)grant('racha');if(LINES.combo[R.combo])sayL(LINES.combo[R.combo]);}
    else if(mode==='boss')sayL(pick(crit?LINES.bossCrit:LINES.bossHit));
    else sayL(pick(q.kind==='proof'&&!q.errs?LINES.proof:q.trap?LINES.trap:dt<6?LINES.fast.concat(LINES.ok):LINES.ok));
    if(S.runStreak>=10)grant('sabio');
    if(mode==='train'&&R.correct>=25)grant('constante');
    if(mode==='escape'){$('#figBox').innerHTML=figFor(q,{newSeal:R.seals.length-1});if(R.seals.length>=4){setTimeout(()=>{const d=$('#doorSvg');if(d){d.classList.add('open');sfx('door');}},500);}}
    if(mode==='boss'){$('#figBox').innerHTML=figFor(q);const g=$('#guardian');if(g){g.classList.add('hit');const dm=document.createElement('span');dm.className='dmg';dm.textContent=crit?'−2':'−1';g.appendChild(dm);setTimeout(()=>{g.classList.remove('hit');dm.remove();},1000);}}
    if(R.id==='c3'){const gg=$('.gauge');if(gg)gg.outerHTML=depthGauge();sfx('stone');}
    if(mode==='arcade'){const svg=$('#bridgeSvg');if(svg){svg.classList.add('solved');const w=svg.querySelector('.walker');if(w){const[ex,ey]=w.dataset.end.split(',');requestAnimationFrame(()=>{w.style.transform=`translate(${ex}px,${ey}px)`;});sfx('steps');}}
      setTimeout(()=>{if(R&&R.q===q&&!R.over)next();},1150);}
  }else{
    q.result='bad';R.combo=0;S.runStreak=0;
    const d=q.kind==='proof'?['reciproco',t('Trop d’erreurs dans la rédaction','Demasiados errores en la redacción'),t('Relis la démonstration complète ci-dessus : chaque ligne s’appuie sur la précédente.','Vuelve a leer la demostración completa: cada línea se apoya en la anterior.')]:q.kind==='choice'?choiceDiag(q,x):diagnose(q,x);
    S.stats.err[d[0]]=(S.stats.err[d[0]]||0)+1;
    const rushed=q.kind!=='proof'&&dt<(q.kind==='choice'?2.5:4);if(rushed)S.stats.rush++;
    if(R.maxLives)R.lives--;
    if(mode==='boss'){R.hearts--;const g=$('#guardian');if(g){g.classList.add('attack');setTimeout(()=>g.classList.remove('attack'),600);}sfx('growl');}
    else sfx('bad');
    if(mode==='arcade'){R.time=Math.max(0,R.time-5);R.paused=true;}
    if(mode==='escape'){R.time=Math.max(0,R.time-20);}
    flash('bad');shakeEl($('#qcard'));
    showFeedback(false,q,{d,rushed,dt});
    sayL(pick(mode==='boss'?LINES.bossHurt:(LINES.bad[d[0]]||LINES.bad.calculo)));
  }
  save();updateStatus();
}
function showFeedback(ok,q,o){
  const fb=$('#feedback');if(!fb)return;const mode=R.ch.mode;
  if(ok){
    const auto=mode==='arcade';
    fb.innerHTML=`<div class="fb ok" role="status"><p class="fb-title">${q.okTitle||(mode==='escape'?(R.seals.length>=4?t('La porte s’ouvre !','¡La puerta se abre!'):t('Le sceau cède !','¡El sello cede!')):t('Correct !','¡Correcto!'))} <span class="xpgain">+${o.xp} XP</span>${o.tags.map(x=>`<span class="tag">${x}</span>`).join('')}</p>${auto?'':`<div class="fb-body">${q.explain||''}</div><button class="btn primary" data-act="next">${t('Continuer','Continuar')} ⏎</button>`}</div>`;
  }else{
    const[,title,msg]=o.d;
    const rushLine=o.rushed?`<p class="rushed">${t(`Tu as répondu en ${fmt(o.dt)} s. Lire calmement fait aussi partie du jeu.`,`Has respondido en ${fmt(o.dt)} s. Leer con calma también es parte del juego.`)}</p>`:'';
    if(mode==='escape'){fb.innerHTML=`<div class="fb bad" role="status"><p class="fb-title">${title} <span class="tag">${t('−20 s de sable','−20 s de arena')}</span></p><p>${msg}</p>${rushLine}<button class="btn primary" data-act="retry">${t('Réessayer','Intentarlo otra vez')} ⏎</button></div>`;}
    else fb.innerHTML=`<div class="fb bad" role="status"><p class="fb-title">${title}${mode==='arcade'?' <span class="tag">−5 s</span>':''}${R.maxLives?' <span class="tag">−1 '+(mode==='survival'?t('vie','vida'):t('amulette','amuleto'))+'</span>':''}${mode==='boss'?' <span class="tag">−1 '+t('cœur','corazón')+'</span>':''}</p>${msg?`<p>${msg}</p>`:''}${rushLine}${q.explain?`<div class="fb-body"><span class="fb-sub">${t('Voici comment on fait','Así se resuelve')}</span>${q.explain}</div>`:''}<button class="btn primary" data-act="next">${t('Continuer','Continuar')} ⏎</button></div>`;
  }
  const b=fb.querySelector('.btn');if(b)setTimeout(()=>{if(document.activeElement===document.body||!document.activeElement)b.focus({preventScroll:true});},350);
  fb.scrollIntoView({block:'nearest',behavior:reduced()?'auto':'smooth'});
}
function useHint(){
  const q=R&&R.q;if(!q||q.done||q.hintUsed||S.torches<1)return;
  S.torches--;q.hintUsed=true;save();renderTop();sfx('whoosh');
  const hb=$('#hintBox');hb.innerHTML=`<b>${t('Indice','Pista')} :</b> ${q.hint}`;hb.hidden=false;say(t('Indice. ','Pista. ')+q.hint);
  const b=$('[data-act="hint"]');if(b)b.disabled=true;
}
const RELIC_OF={c1:'sello',c7:'raiz',c8:'juez',c9:'astrolabio',c10:'cubo'};
function finish(reason){
  if(!R||R.over)return;R.over=true;stopTimers();toggleCalc(false);
  const mode=R.ch.mode,id=R.id,isCh=ORDER.includes(id);let stars=0,bonus=0;const ex={};
  if(mode==='std'&&isCh&&reason!=='nolives'){const acc=R.scored?R.correct/R.scored:0;stars=acc>=.9?3:acc>=.7?2:1;}
  if(mode==='arcade')stars=R.correct>=12?3:R.correct>=9?2:R.correct>=5?1:0;
  if(mode==='escape')stars=reason==='escaped'?(R.time>=R.maxTime*.5?3:R.time>=R.maxTime*.2?2:1):0;
  if(mode==='boss')stars=reason==='win'?Math.max(1,Math.min(3,R.hearts)):0;
  if(isCh){
    const had=S.stars[id]||0;R.firstStar=!had&&stars>0;
    if(stars>had)S.stars[id]=stars;
    bonus=stars*15;if(stars===3)S.torches++;
    if(RELIC_OF[id]&&stars)grant(RELIC_OF[id]);
    if(id==='c3'&&stars&&R.lives===R.maxLives)grant('pozo');
    if(id==='c4'&&stars===3)grant('escriba');
    if(id==='c5'&&reason==='escaped')grant('llave');
    if(id==='c6'&&reason==='win'){grant('guardian');if(S.diff==='leyenda')grant('leyenda');}
    if(ORDER.every(c=>(S.stars[c]||0)>=1))grant('cartografo');
    if(stars>=1)R.newSages=unlockSages(id);
  }
  if(id==='daily'){const today=todayStr();if(!S.daily.done[today]){S.daily.done[today]=true;S.daily.streak=S.daily.last===yesterdayStr()?S.daily.streak+1:1;S.daily.last=today;S.torches++;bonus=40;if(S.daily.streak>=3)grant('sol');}}
  if(mode==='exam'){const total=R.list.filter(scorable).length;ex.grade=Math.round(R.correct/total*100)/10;ex.time=Math.floor((Date.now()-R.t0)/1000);bonus=R.correct*8;if(ex.grade>(S.records.examBest||0)){S.records.examBest=ex.grade;ex.rec=true;}S.records.examLast=ex.grade;if(ex.grade>=9)grant('sobresaliente');}
  if(mode==='survival'){const rec=S.records.survival[S.diff]||0;if(R.correct>rec){S.records.survival[S.diff]=R.correct;ex.rec=true;}if(R.correct>=15)grant('superviviente');bonus=R.correct>=5?R.correct*2:0;}
  if(mode==='train'&&R.correct>(S.records.train||0))S.records.train=R.correct;
  const runXP=R.xp;let added=0;if(bonus){added=Math.round(bonus*DF().xp);addXPraw(added);}
  save();
  const good=stars>=1||reason==='win'||reason==='escaped'||(mode==='exam'&&ex.grade>=5)||(mode==='survival'&&ex.rec)||mode==='train'||id==='daily';
  const fire=stars===3||reason==='win'||reason==='escaped'||ex.rec||(mode==='exam'&&ex.grade>=9);
  const head=summaryHead(reason,stars,ex);
  musicPlay('map');
  const outro=isCh&&R.firstStar&&OUTROS[id];
  cine({closeMs:750,swap:()=>{setView('summary');setScene('embers');renderSummary(reason,stars,runXP+added,ex);},
    card:{k:head.eb,t:head.title,ms:1800,say:head.eb,voice:{pitch:.85,rate:.9}},
    after:()=>{sfx(good?'win':'lose');const bs=$('.bigstars');if(bs){bs.classList.remove('wait');for(let k=0;k<stars;k++)setTimeout(()=>sfx('star',k),180+k*220);}if(fire)confetti(160);
      const ns=(R&&R.newSages)||[];
      const go2=()=>say(plain(head.line)+(ns.length?' '+(ns.length===1?t('Tu as trouvé un fragment d’histoire : ','Has encontrado un fragmento de historia: '):t('Tu as trouvé des fragments d’histoire : ','Has encontrado fragmentos de historia: '))+ns.map(x=>T(SAGE[x].name)).join(t(' et ',' y '))+'.':''));
      if(outro)setTimeout(()=>playScene(outro,{}).then(go2),900);else go2();}});
}
const gradeShow=g=>L==='fr'?`${fmt(g*2)}<small> / 20</small>`:`${fmt(g)}<small> / 10</small>`;
const gradeTxt=g=>L==='fr'?fmt(g*2)+'/20':fmt(g);
function summaryHead(reason,stars,ex){
  const id=R.id,ch=R.ch,mode=ch.mode;let eb=t('Salle réussie','Cámara superada'),title=chName(id),line='',big='';
  if(id==='daily'){eb=t('Défi terminé','Desafío completado');line=t(`Série : ${dailyStreak()} jour${dailyStreak()===1?'':'s'} de suite. Reviens demain : le temple prépare de nouveaux défis chaque jour.`,`Racha: ${dailyStreak()} ${dailyStreak()===1?'día':'días'} seguidos. Vuelve mañana: el templo prepara retos nuevos cada día.`);}
  else if(mode==='std'){if(reason==='nolives'){eb=t('Plus d’amulettes','Sin amuletos');line=t('Tu n’as plus d’amulettes. Ce que tu as appris reste avec toi : réessaie.','Te has quedado sin amuletos. Lo que has aprendido sigue contigo: vuelve a intentarlo.');}else line=t(`Tu as réussi ${R.correct} sur ${R.scored}.`,`Has acertado ${R.correct} de ${R.scored}.`);}
  else if(mode==='arcade'){eb=t('La torche s’est éteinte','Se apagó la antorcha');line=t(`Tu as tendu ${R.correct} pont${R.correct===1?'':'s'}. Avec 5 tu gagnes une étoile, avec 9 deux et avec 12 trois.`,`Has tendido ${R.correct} ${R.correct===1?'puente':'puentes'}. Con 5 consigues una estrella, con 9 dos y con 12 tres.`);}
  else if(mode==='escape'){if(reason==='escaped'){eb=t('Tu t’es échappé !','¡Has escapado!');line=t(`Le code était ${R.seals.join(' · ')}. Il te restait ${Math.floor(R.time/60)}:${pad2(Math.ceil(R.time)%60)} de sable.`,`El código era ${R.seals.join(' · ')}. Te sobraron ${Math.floor(R.time/60)}:${pad2(Math.ceil(R.time)%60)} de arena.`);}else{eb=t('Le sable est écoulé','Se acabó la arena');line=t('La porte reste scellée. Chaque essai te rapproche : les serrures changent à chaque fois.','La puerta sigue sellada. Cada intento te deja más cerca: las cerraduras cambian cada vez.');}}
  else if(mode==='boss'){if(reason==='win'){eb=t('Tu as vaincu le Gardien !','¡Has vencido al Guardián!');line=t(`Tu l’as battu avec ${R.hearts} cœur${R.hearts===1?'':'s'} de reste.`,`Lo has derrotado con ${R.hearts} ${R.hearts===1?'corazón':'corazones'} de sobra.`);}else{eb=t('Le Gardien résiste','El Guardián resiste');line=t(`Il lui restait ${R.hp} points de vie. Revois tes erreurs et reviens le défier.`,`Le dejaste con ${R.hp} de vida. Repasa los errores y vuelve a por él.`);}}
  else if(mode==='exam'){const g=ex.grade,w=L==='fr'?(g>=8?'Très bien':g>=7?'Bien':g>=6?'Assez bien':g>=5?'Passable':'À retravailler'):(g>=9?'Sobresaliente':g>=7?'Notable':g>=6?'Bien':g>=5?'Aprobado':'Hay que repasar');eb=t('Contrôle corrigé','Examen corregido');title=w;big=`<p class="grade">${gradeShow(g)}</p>`;line=t(`${R.correct} sur ${R.scored} justes en ${Math.floor(ex.time/60)} min ${ex.time%60} s.${ex.rec?' Ta meilleure note !':''}`,`${R.correct} de ${R.scored} bien en ${Math.floor(ex.time/60)} min ${ex.time%60} s.${ex.rec?' ¡Tu mejor nota!':''}`);}
  else if(mode==='survival'){eb=ex.rec?t('Nouveau record !','¡Nuevo récord!'):t('Fin de l’escalier','Fin de la escalera');big=`<p class="grade">${R.correct}</p>`;line=t(`Marches franchies en difficulté ${dfName()}. Record : ${S.records.survival[S.diff]}.`,`Peldaños superados en dificultad ${dfName()}. Récord: ${S.records.survival[S.diff]}.`);}
  else if(mode==='train'){eb=t('Entraînement terminé','Entrenamiento terminado');line=t(`Réussites ${R.correct} sur ${R.scored}. Meilleure série : ${R.maxCombo}.`,`Aciertos ${R.correct} de ${R.scored}. Mejor racha: ${R.maxCombo}.`);}
  return {eb,title,line,big};
}
function renderSummary(reason,stars,xpTotal,ex){
  const id=R.id,ch=R.ch,mode=ch.mode,isCh=ORDER.includes(id);const {eb,title,line,big}=summaryHead(reason,stars,ex);
  const idx=ORDER.indexOf(id),nid=ORDER[idx+1],canNext=idx>=0&&nid&&isUnlocked(idx+1)&&stars>0;
  const review=mode==='exam'?`<div class="review">${R.list.filter(scorable).map((q,i)=>{const giv=q.kind==='choice'?plain(q.choices[q.given]||'—'):(q.given!=null?fmt(q.given)+(q.unit?' '+q.unit:''):'—');const cor=q.kind==='choice'?plain(q.choices[q.answer]):fmt(q.answer)+(q.unit?' '+q.unit:'');return `<details class="rev ${q.result}"><summary><span class="rev-n">${i+1}</span><span class="rev-q">${esc(plain(promptText(q)))}</span><span class="rev-a">${q.result==='ok'?'✓':'✗'} ${esc(giv)}</span></summary><div class="fb-body"><span>${t('Bonne réponse','Respuesta correcta')} : <b>${esc(cor)}</b></span>${q.explain||''}</div></details>`;}).join('')}</div>`:'';
  const winArt=stars>=1||reason==='win'||reason==='escaped'||mode==='train'||id==='daily'||(mode==='exam'&&ex.grade>=5)||ex.rec;
  $('#view').innerHTML=`<section class="summary"><div class="sum-card">
    <div class="sum-art"><svg viewBox="0 0 180 90" aria-hidden="true">${winArt?`${torch(30,70,.8)}${torch(150,70,.8)}`:''}${avatar(90,86,1.6,'bob')}</svg></div>
    <p class="eyebrow">${eb}</p><h2 data-reveal=".2">${title}</h2>${big}<p class="lead">${line}</p>
    ${isCh?`<div class="bigstars wait" aria-label="${stars} ${t('étoiles sur 3','de 3 estrellas')}">${[0,1,2].map(k=>`<svg class="bst${k<stars?' on':''}" style="animation-delay:${k*.18}s" viewBox="0 0 24 24" aria-hidden="true"><path d="${P.star}"/></svg>`).join('')}</div>`:''}
    <dl class="sumstats"><div><dt>${t('Réussites','Aciertos')}</dt><dd>${R.correct}/${R.scored}</dd></div><div><dt>${t('XP gagnée','XP ganada')}</dt><dd>+${xpTotal}</dd></div><div><dt>${t('Pièges évités','Trampas evitadas')}</dt><dd>${R.traps}</dd></div>${mode==='arcade'||mode==='train'?`<div><dt>${t('Meilleure série','Mejor racha')}</dt><dd>${R.maxCombo}</dd></div>`:''}</dl>
    ${R.newRelics.length?`<div><p class="fb-sub">${t('Nouvelles reliques','Reliquias nuevas')}</p><div class="nr">${R.newRelics.map(rid=>{const r=RELICS.find(x=>x.id===rid);return `<span>${relicSVG(r)}${esc(T(r.name))}</span>`;}).join('')}</div></div>`:''}
    ${(R.newSages||[]).length?`<div><p class="fb-sub">${t('Fragments d’histoire trouvés','Fragmentos de historia encontrados')}</p><div class="nr">${R.newSages.map(x=>`<span>${sageSVG(x)}${esc(T(SAGE[x].name))}</span>`).join('')}</div><p style="margin-top:10px"><button class="btn" data-act="go" data-v="codex" data-sage="${R.newSages[0]}">${ico('book')} ${t('Les lire dans le Codex','Leerlos en el Códice')}</button></p></div>`:''}
    ${review}
    <div class="row">${canNext?`<button class="btn primary" data-act="enter" data-id="${nid}">${t('Suivante','Siguiente')} : ${chName(nid)}</button>`:''}<button class="btn${canNext?'':' primary'}" data-act="${mode==='train'?'go':'enter'}" data-id="${id}" data-v="trainSetup">${mode==='train'?t('S’entraîner encore','Entrenar otra vez'):t('Rejouer','Jugar otra vez')}</button><button class="btn ghost" data-act="go" data-v="map">${t('Retour à la carte','Volver al mapa')}</button></div>
  </div></section>`;
  renderTop();window.scrollTo(0,0);revealText($('#view'));
}
