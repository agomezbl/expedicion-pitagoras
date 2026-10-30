/* =========================================================
   PANTALLAS: TÍTULO, MAPA, ENTRENAMIENTO
   ========================================================= */
function starsHTML(n,cls='st'){return [0,1,2].map(k=>`<svg class="${cls}${k<n?' on':''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P.star}"/></svg>`).join('');}
const gameTitle=()=>t('L’Expédition <b>Pythagore</b>','La Expedición <b>Pitágoras</b>');
function renderTop(){
  const ri2=rankOf(S.xp),cur=RANKS[ri2][0],nx=RANKS[ri2+1]?RANKS[ri2+1][0]:null,pct=nx?(S.xp-cur)/(nx-cur)*100:100;
  $('#top').innerHTML=`<button class="brand" data-act="go" data-v="map" aria-label="${t('Aller à la carte','Ir al mapa')}">${LOGO}<span>${gameTitle()}</span></button>
  <div class="rank"><div class="rank-row"><span class="rank-name">${rankName(ri2)}</span><span class="xpnum">${S.xp}${nx?' / '+nx:''} XP</span></div><div class="xpbar"><i style="width:${pct}%"></i></div></div>
  <div class="chips"><span class="chip" title="${t('Chaque indice coûte une torche','Cada pista cuesta una antorcha')}">${ico('flame')}<b>${S.torches}</b><span class="chip-l">${t('torches','antorchas')}</span></span>
  <span class="chip" title="${t('Jours de suite avec le défi du jour','Días seguidos con el desafío del día')}">${ico('sun')}<b>${dailyStreak()}</b><span class="chip-l">${t('série','racha')}</span></span>
  <button class="chip" data-act="relics">${ico('hex')}<b>${relicCount()}/${RELICS.length}</b><span class="chip-l">${t('reliques','reliquias')}</span></button>
  <button class="chip" data-act="settings" title="${t('Langue, difficulté, musique, voix','Idioma, dificultad, música, voces')}">${ico('gear')}<b>${dfName()}</b></button>
  ${view==='play'?'':`<button class="chip" data-act="lang" aria-label="${t('Cambiar a español','Passer en français')}">${ico('globe')}<b>${L==='fr'?'FR':'ES'}</b></button>`}
  <button class="chip" data-act="mute" aria-label="${S.audio.muted?t('Activer le son','Activar el sonido'):t('Couper le son','Silenciar')}">${ico(S.audio.muted?'soundOff':'soundOn')}</button>
  <button class="chip" data-act="guide">${ico('guide')}<span class="chip-l" style="color:inherit;font-weight:700">${t('Panneau du guide','Panel del guía')}</span></button></div>`;
}
function langSwitch(){return `<div class="langsw" role="group" aria-label="${t('Langue','Idioma')}"><button class="lang-btn${L==='fr'?' on':''}" data-act="setLang" data-lang="fr" aria-pressed="${L==='fr'}">Français</button><button class="lang-btn${L==='es'?' on':''}" data-act="setLang" data-lang="es" aria-pressed="${L==='es'}">Español</button></div>`;}
function titleHTML(){
  return `<section class="title"><div class="title-art">${templeSVG()}<div class="title-cast"><span class="tc-p tc-l">${portrait('teano','happy')}</span><span class="tc-p tc-r">${portrait('pitagoras','neutral')}</span></div></div><div class="title-txt">${langSwitch()}<p class="eyebrow">${t('Un jeu pour maîtriser le théorème','Un juego para dominar el teorema')}</p><h1 class="title-h" data-reveal=".4">${t('L’Expédition<br><span>Pythagore</span>','La Expedición<br><span>Pitágoras</span>')}</h1>
  <p class="lead">${t('Dix salles, un Gardien de pierre et les sages qui ont découvert le secret des triangles rectangles.','Diez cámaras, un Guardián de piedra y los sabios que descubrieron el secreto de los triángulos rectángulos.')}</p>
  <p class="small">${esc(S.duel.p1)} · ${rankName(rankOf(S.xp))} · ${t('Difficulté','Dificultad')} ${dfName()}</p>
  <div class="row" style="justify-content:flex-start"><button class="btn primary big" data-act="start">${S.prologue?t('Continuer l’expédition','Continuar la expedición'):t('Entrer dans le temple','Entrar al templo')}</button><button class="btn" data-act="settings">${ico('gear')} ${t('Réglages','Ajustes')}</button></div>
  <p class="small">${t('Avec musique, effets et voix. Tu peux les régler ou les couper à tout moment.','Con música, efectos y voces. Puedes ajustarlos o silenciarlos en cualquier momento.')}</p></div></section>`;
}
const NODES={c1:[150,575],c2:[370,560],c3:[610,590],c7:[850,540],c4:[750,380],c8:[480,400],c9:[215,375],c10:[250,165],c5:[520,165],c6:[810,165]};
const SEGS=[[[40,690],[70,630],'c1'],['c1',[250,610],'c2'],['c2',[490,620],'c3'],['c3',[760,620],'c7'],['c7',[840,450],'c4'],['c4',[615,360],'c8'],['c8',[340,430],'c9'],['c9',[170,260],'c10'],['c10',[385,110],'c5'],['c5',[665,110],'c6']];
function curChamber(){for(let i=0;i<ORDER.length;i++){if(isUnlocked(i)&&!(S.stars[ORDER[i]]||0))return ORDER[i];}for(let i=ORDER.length-1;i>=0;i--){if(isUnlocked(i)&&(S.stars[ORDER[i]]||0)<3)return ORDER[i];}return 'c6';}
function mapSVG(sel,cur){
  let walls='',cors='',lines='';
  SEGS.forEach(([a,c,b])=>{const A=typeof a==='string'?NODES[a]:a,B=NODES[b];const d=`M${A[0]} ${A[1]} Q${c[0]} ${c[1]} ${B[0]} ${B[1]}`;walls+=`<path class="m-wall" d="${d}"/>`;cors+=`<path class="m-cor" d="${d}"/>`;lines+=`<path class="m-line${isUnlocked(ORDER.indexOf(b))?' lit':''}" d="${d}"/>`;});
  let nodes='',fogs='';
  ORDER.forEach((id,i)=>{const[x,y]=NODES[id],u=isUnlocked(i),st=S.stars[id]||0,fog=!S.revealed.includes(id);
    const cls=['node',u?'':'locked',fog?'fogged':'',id===sel?'sel':'',id===cur&&!fog?'cur':'',st?'done':''].filter(Boolean).join(' ');
    if(fog)fogs+=`<g class="fog" data-fog="${id}" transform="translate(${x} ${y})" filter="url(#fogBlur)" aria-hidden="true"><ellipse class="fg f1" rx="80" ry="46"/><ellipse class="fg f2" cx="-40" cy="28" rx="56" ry="34"/><ellipse class="fg f3" cx="42" cy="-22" rx="60" ry="38"/></g>`;
    nodes+=`<g class="${cls}" transform="translate(${x} ${y})"><g data-act="pick" data-id="${id}" tabindex="0" role="button" aria-label="${fog?t('Salle inconnue','Cámara desconocida'):esc(chName(id))}${u?'':', '+t('fermée','cerrada')}${st?', '+st+' '+t('étoiles','estrellas'):''}">
      <circle class="n-halo" r="58"/><circle class="n-disc" r="46"/><path class="n-emb" transform="translate(-18 -29) scale(1.5)" d="${EMB[id]}"/><text class="n-num" y="33">${chNum(id)}</text>
      ${u?'':`<g class="n-lock" transform="translate(30 -38)"><path d="M-5 -2v-5a5 5 0 0 1 10 0v5"/><rect x="-9" y="-2" width="18" height="14" rx="3"/></g>`}
      <text class="n-name" y="72">${fog?'· · ·':esc(chName(id))}</text>
      ${fog?'':`<g transform="translate(-33 82)">${[0,1,2].map(k=>`<path class="n-star${k<st?' on':''}" transform="translate(${k*24} 0) scale(.75)" d="${P.star}"/>`).join('')}</g>`}</g></g>`;});
  const[cx,cy]=NODES[cur];
  return `<svg class="tmap" viewBox="0 0 1000 700" role="group" aria-label="${t('Carte du temple','Mapa del templo')}">
  <defs><pattern id="tiles" width="40" height="40" patternUnits="userSpaceOnUse"><path class="m-tile" d="M40 0H0V40"/></pattern><filter id="fogBlur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16"/></filter></defs>
  <rect x="0" y="0" width="1000" height="700" fill="url(#tiles)"/>
  <g class="m-mark" transform="translate(600 300) scale(.55)"><path d="M0 0 L160 0 L0 -120Z"/><rect x="0" y="0" width="160" height="160"/><rect x="-120" y="-120" width="120" height="120"/><path d="M0 -120 L160 0 L280 -160 L120 -280Z"/></g>
  <ellipse class="m-water" cx="70" cy="470" rx="40" ry="18"/><ellipse class="m-water" cx="930" cy="640" rx="44" ry="18"/>
  <g class="m-deco"><rect x="660" y="22" width="70" height="12" rx="2"/><rect x="660" y="40" width="70" height="12" rx="2"/><rect x="950" y="300" width="28" height="60" rx="4"/><rect x="950" y="420" width="28" height="60" rx="4"/><rect x="40" y="250" width="24" height="24" rx="3"/><rect x="380" y="300" width="24" height="24" rx="3"/></g>
  ${torch(30,60,1)}${torch(970,60,1)}${torch(640,470,.8)}${torch(40,330,.8)}
  <text class="m-text" x="86" y="690">${t('ENTRÉE','ENTRADA')}</text>
  ${walls}${cors}${lines}${nodes}${fogs}
  ${avatar(cx-72,cy+30,1.25,'bob')}
  </svg>`;
}
function mapPanel(id){
  const i=ORDER.indexOf(id),c=CH[id],u=isUnlocked(i),st=S.stars[id]||0,D0=DF();
  if(!S.revealed.includes(id))return `<aside class="mpanel"><div class="mp-emb"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 1-1 1.7V15M12 18h.01"/></svg></div><p class="eyebrow">${t('Salle','Cámara')} ${chNum(id)} · ${t('Inconnue','Desconocida')}</p><h2 data-reveal>${t('Cachée dans la brume','Oculta en la niebla')}</h2><p>${t('Personne ne sait ce qu’il y a de l’autre côté.','Nadie sabe qué hay al otro lado.')}</p><p class="small">${u?t('La brume commence à se dissiper…','La niebla está empezando a disiparse…'):t('Gagne au moins une étoile dans la salle précédente pour la révéler.','Consigue al menos una estrella en la cámara anterior para revelarla.')}</p></aside>`;
  const lv=t(`${D0.lives} amulettes.`,`${D0.lives} amuletos.`);
  const info={c1:t('Pas d’amulettes à perdre : apprends à ton rythme.','Sin amuletos que perder: aprende a tu ritmo.'),c2:t(`${D0.arcade} secondes de torche.`,`${D0.arcade} segundos de antorcha.`),c3:lv+(S.diff==='leyenda'?t(' Avec décimaux et abaque.',' Con decimales y ábaco.'):''),c7:lv+t(' Abaque disponible.',' Ábaco disponible.'),c4:lv+t(' Abaque disponible.',' Ábaco disponible.'),c8:lv+t(' Avec rédactions.',' Con redacciones.'),c9:lv+t(' Abaque avec cos.',' Ábaco con cos.'),c10:lv,c5:t(`${Math.round(D0.escape/60)} minutes de sable.`,`${Math.round(D0.escape/60)} minutos de arena.`),c6:t(`Gardien avec ${D0.hp} points de vie. Tu as ${D0.hearts} cœurs.`,`Guardián con ${D0.hp} de vida. Tú tienes ${D0.hearts} corazones.`)}[id];
  const sc=SCENES[id],who=sc&&sc.cast?sc.cast.filter(w=>w!=='teano')[0]:null;
  return `<aside class="mpanel"><div class="mp-emb">${embSVG(id)}</div>${who?`<div class="mp-sage">${portrait(who,'neutral')}<span>${esc(T(CAST[who].n))}</span></div>`:''}<p class="eyebrow">${t('Salle','Cámara')} ${chNum(id)} · ${T(c.tag)}</p><h2 data-reveal>${chName(id)}</h2><p>${T(c.desc)}</p><p class="small">${info} ${t('Difficulté','Dificultad')} ${dfName()}.</p><div class="ch-stars">${starsHTML(st)}</div>${u?`<button class="btn primary big" data-act="enter" data-id="${id}">${st?t('Y retourner','Volver a entrar'):t('Entrer dans la salle','Entrar en la cámara')}</button>`:`<p class="mk-msg">${t('Fermée. Gagne au moins une étoile dans la salle précédente.','Cerrada. Consigue al menos una estrella en la cámara anterior.')}</p>`}</aside>`;
}
function mapHTML(){
  const cur=curChamber();if(!mapSel||!CH[mapSel])mapSel=cur;
  const open=modesOpen(),today=todayStr(),done=!!S.daily.done[today],st=dailyStreak(),en=EXPS.filter(e=>S.exp[e.id]&&S.exp[e.id].done).length;
  const lockTxt=t('S’ouvre avec une étoile dans la Salle I.','Se abre al conseguir una estrella en la Cámara I.');
  const nd=DILEMMAS.filter(d=>S.dil[d.id]!=null).length;
  const modes=[
    {act:'enter',id:'daily',ic:'sun',name:t('Défi du jour','Desafío del día'),txt:open?(done?t(`Fait aujourd’hui. Série : ${st}. Reviens demain.`,`Hecho hoy. Racha: ${st}. Vuelve mañana.`):t(`Cinq nouveaux défis. Série : ${st}. Récompense : 40 XP et 1 torche.`,`Cinco retos nuevos. Racha: ${st}. Premio: 40 XP y 1 antorcha.`)):lockTxt,lock:!open},
    {act:'go',v:'trainSetup',ic:'target',name:t('Entraînement libre','Entrenamiento libre'),txt:open?t('Choisis ce que tu veux travailler, sans horloge ni amulettes.','Elige qué practicar, sin relojes ni amuletos.'):lockTxt,lock:!open},
    {act:'enter',id:'survival',ic:'pulse',name:t('Survie','Supervivencia'),txt:open?t(`Des défis sans fin jusqu’à l’erreur. Record en ${dfName()} : ${S.records.survival[S.diff]||0}.`,`Retos sin fin hasta fallar. Récord en ${dfName()}: ${S.records.survival[S.diff]||0}.`):lockTxt,lock:!open},
    {act:'enter',id:'exam',ic:'exam',name:t('Mode contrôle','Modo examen'),txt:open?t(`10 questions comme au collège et une note. Meilleure note : ${S.records.examBest?gradeTxt(S.records.examBest):'—'}.`,`10 preguntas como en el cole y nota final. Mejor nota: ${S.records.examBest?gradeTxt(S.records.examBest):'—'}.`):lockTxt,lock:!open},
    {act:'go',v:'codex',ic:'book',name:t('Le Codex des Sages','El Códice de los Sabios'),txt:t(`L’histoire de Pythagore, Hippase, Euclide, Hypatie, Descartes et d’autres sages. ${sageCount()} fragments sur ${SAGES.length} · ${nd} dilemmes sur ${DILEMMAS.length}.`,`La historia de Pitágoras, Hipaso, Euclides, Hipatia, Descartes y otros sabios. ${sageCount()} de ${SAGES.length} fragmentos · ${nd} de ${DILEMMAS.length} dilemas.`),lock:false},
    {act:'go',v:'exp',ic:'ruler',name:t('Expéditions réelles','Expediciones reales'),txt:t(`Mesure des objets de la maison et vérifie que Pythagore a raison. ${en} sur ${EXPS.length} faites.`,`Mide cosas de casa y comprueba que Pitágoras acierta. ${en} de ${EXPS.length} hechas.`),lock:false},
  ];
  return `<section class="map">
  <div class="map-head"><div><p class="eyebrow">${t('Journal d’expédition','Diario de expedición')} · ${esc(S.duel.p1||'Nil')}</p><h1 data-reveal>${t('Le temple','El templo')}</h1></div><button class="btn tiny" data-act="settings">${ico('gear')} ${t('Difficulté','Dificultad')} : ${dfName()}</button></div>
  <div class="mapwrap"><div>${mapSVG(mapSel,cur)}</div>${mapPanel(mapSel)}</div>
  <h2 class="sec">${t('Modes de jeu','Modos de juego')}</h2>
  <div class="modes">${modes.map(m=>`<button class="mode" data-act="${m.act}" ${m.id?`data-id="${m.id}"`:''} ${m.v?`data-v="${m.v}"`:''} ${m.lock?'disabled':''}><span class="mi">${ico(m.ic)}</span><b>${m.name}</b><span>${m.txt}</span></button>`).join('')}</div>
  </section>`;
}
function trainHTML(){
  const sel=new Set((S.trainTopics||[]).filter(topicOpen));
  return `<section><div class="playbar"><button class="btn ghost" data-act="go" data-v="map">← ${t('Carte','Mapa')}</button><div class="pb-emb">${embSVG('train')}</div><div class="pb-title"><p class="eyebrow">${t('Pratique','Práctica')} · ${dfName()}</p><h2>${t('Entraînement libre','Entrenamiento libre')}</h2></div></div>
  <div class="qcard setup"><p class="lead">${t('Choisis ce que tu veux travailler. Les défis sont mélangés entre les thèmes choisis, sans horloge ni amulettes.','Elige qué quieres practicar. Los retos salen mezclados entre los temas que marques, sin relojes ni amuletos.')}</p>
  <div class="topics">${TOPICS.map(([k,l,c])=>{const op=topicOpen(k);return `<button class="topic${sel.has(k)?' on':''}" data-act="topic" data-v="${k}" aria-pressed="${sel.has(k)}" ${op?'':'disabled'}><span class="box"></span>${esc(T(l))}${op?'':`<small>${t('Salle','Cámara')} ${chNum(c)}</small>`}</button>`;}).join('')}</div>
  <p class="small">${t('Record de réussites en une séance','Récord de aciertos en una sesión')} : ${S.records.train||0}.</p>
  <button class="btn primary big" data-act="trainStart" style="justify-self:start" ${sel.size?'':'disabled'}>${t('Commencer l’entraînement','Empezar a entrenar')}</button></div></section>`;
}
function render(){
  renderTop();const m=$('#view');
  if(view==='title')m.innerHTML=titleHTML();
  else if(view==='map')m.innerHTML=mapHTML();
  else if(view==='exp')m.innerHTML=expHTML();
  else if(view==='codex')m.innerHTML=codexHTML();
  else if(view==='trainSetup')m.innerHTML=trainHTML();
  revealText(m);
}
function setView(v){view=v;document.body.dataset.view=v;}
function arrive(){const v=$('#view');v.classList.remove('arrive');void v.offsetWidth;v.classList.add('arrive');}
function go(v){
  if(R){stopTimers();R=null;}
  toggleCalc(false);closeModal();hush();
  setView(v);render();window.scrollTo(0,0);arrive();
  const mus={title:'title',map:'map',exp:'calm',trainSetup:'calm',codex:'codex'}[v];if(mus)musicPlay(mus);
  setScene({title:'stars',map:'embers',codex:'dust'}[v]||'dust');
  if(v==='map')setTimeout(mapArrive,700);
}
