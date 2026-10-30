/* =========================================================
   CINE: TRANSICIONES, LUZ, GRANO, TEXTO
   ========================================================= */
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const EASE={in:p=>p*p*p,out:p=>1-Math.pow(1-p,3)};
function tween(ms,fn,e){return new Promise(res=>{const t0=performance.now();(function f(now){const p=Math.min(1,Math.max(0,(now-t0)/ms));fn(e(p));if(p<1)requestAnimationFrame(f);else res();})(t0);});}
const CINE={busy:false};
function setIris(cx,cy,r){const c=$('#curtain');const a=Math.max(0,r),b=Math.max(0,r+110);if(b<=0){c.style.webkitMaskImage='none';c.style.maskImage='none';c.style.background='#07060a';return;}const m=`radial-gradient(circle at ${cx}px ${cy}px, transparent ${a}px, #000 ${b}px)`;c.style.webkitMaskImage=m;c.style.maskImage=m;c.style.background=`radial-gradient(circle at ${cx}px ${cy}px, rgba(242,165,65,0) ${a}px, rgba(242,165,65,.25) ${Math.max(0,r+26)}px, #07060a ${Math.max(0,r+120)}px)`;}
function centerOf(el){if(!el)return null;const b=el.getBoundingClientRect();if(!b.width&&!b.height)return null;return [b.left+b.width/2,b.top+b.height/2];}
function cardHTML(c){return `${c.emb?`<svg class="cur-emb" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="${EMB[c.emb]||c.emb}"/></svg>`:''}${c.k?`<p class="cur-k">${esc(c.k)}</p>`:''}<p class="cur-t" data-reveal=".25">${esc(c.t)}</p><span class="cur-line"></span>${c.p?`<p class="cur-p">${c.p}</p>`:''}${c.skip?`<p class="cur-skip">${t('Touche pour continuer','Pulsa para continuar')}</p>`:''}`;}
async function cine(o){
  if(CINE.busy||reduced()){try{o.swap&&o.swap();}catch(e){}o.after&&o.after();return;}
  CINE.busy=true;PAR.freeze=true;
  const cur=$('#curtain'),card=$('#curCard'),W=innerWidth,H=innerHeight,Rm=Math.hypot(W,H)+60;
  const [x0,y0]=o.from||[W/2,H/2];
  card.classList.remove('show');card.innerHTML='';cur.classList.remove('block');cur.onclick=null;
  setIris(x0,y0,Rm);cur.hidden=false;
  sfx(o.card?'cineClose':'cineSoft');
  if(o.zoom){try{const el=o.zoom.el,b=el.getBoundingClientRect();el.style.transformOrigin=`${o.zoom.x-b.left}px ${o.zoom.y-b.top}px`;el.animate([{transform:'scale(1)',filter:'brightness(1)'},{transform:`scale(${o.zoom.s||2.4})`,filter:'brightness(1.5) blur(2px)'}],{duration:(o.closeMs||800)+100,easing:'cubic-bezier(.6,0,.85,.4)',fill:'forwards'});}catch(e){}}
  await tween(o.closeMs||(o.card?750:420),p=>setIris(x0,y0,(Rm+120)*(1-p)-120),EASE.in);
  try{o.swap&&o.swap();}catch(e){console.error(e);}
  window.scrollTo(0,0);
  if(o.card){
    card.innerHTML=cardHTML(o.card);revealText(card);void card.offsetWidth;card.classList.add('show');sfx('boom');
    if(o.card.say)say(o.card.say,'narr',o.card.voice||{});
    let skip;const skipP=new Promise(r=>{skip=r;});
    if(o.card.skip){cur.classList.add('block');cur.onclick=()=>{hush();skip(1);};}
    await Promise.race([wait(o.card.ms||2100),skipP]);
    if(o.card.waitSpeech){const t0=Date.now();while(Date.now()-t0<(o.card.maxMs||14000)){let sp=false;try{sp=S.voice.on&&speaking();}catch(e){}if(!sp)break;const r=await Promise.race([wait(200).then(()=>0),skipP]);if(r)break;}}
    cur.onclick=null;cur.classList.remove('block');card.classList.remove('show');await wait(420);
  }
  const [x1,y1]=o.to||[W/2,H/2];
  sfx('cineOpen');
  await tween(o.openMs||(o.card?1050:620),p=>setIris(x1,y1,(Rm+120)*p-120),EASE.out);
  cur.hidden=true;CINE.busy=false;PAR.freeze=false;
  try{o.after&&o.after();}catch(e){console.error(e);}
}
function revealText(root){
  if(!root||reduced())return;
  $$('[data-reveal]',root).forEach(el=>{
    if(el.dataset.done)return;el.dataset.done='1';el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
    const base=parseFloat(el.dataset.reveal)||0;let i=0;
    const walk=n=>{Array.from(n.childNodes).forEach(c=>{
      if(c.nodeType===3){const frag=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){frag.appendChild(document.createTextNode(' '));return;}const ws=document.createElement('span');ws.className='rw';ws.setAttribute('aria-hidden','true');Array.from(w).forEach(ch=>{const l=document.createElement('span');l.className='rl';l.textContent=ch;l.style.animationDelay=(base+i++*0.032).toFixed(3)+'s';ws.appendChild(l);});frag.appendChild(ws);});c.replaceWith(frag);}
      else if(c.nodeType===1&&c.tagName!=='BR')walk(c);});};
    walk(el);
  });
}
const PAR={x:.5,y:.4,tx:.5,ty:.4,freeze:false};
addEventListener('pointermove',e=>{PAR.tx=e.clientX/innerWidth;PAR.ty=e.clientY/innerHeight;},{passive:true});
function parLoop(){
  requestAnimationFrame(parLoop);if(document.hidden)return;
  PAR.x+=(PAR.tx-PAR.x)*.08;PAR.y+=(PAR.ty-PAR.y)*.08;
  const d=$('#dark');if(d){d.style.setProperty('--mx',(PAR.x*100).toFixed(2)+'%');d.style.setProperty('--my',(PAR.y*100).toFixed(2)+'%');}
  if(PAR.freeze||reduced()||(view!=='title'&&view!=='map'))return;
  $$('[data-par]').forEach(el=>{const k=+el.dataset.par;el.style.transform=`translate(${((.5-PAR.x)*k).toFixed(2)}px,${((.5-PAR.y)*k*.6).toFixed(2)}px)`;});
  const t=$('.tmap');if(t)t.style.transform=`rotateX(${((PAR.y-.5)*-4).toFixed(2)}deg) rotateY(${((PAR.x-.5)*5).toFixed(2)}deg)`;
}
function makeGrain(){try{const c=document.createElement('canvas');c.width=c.height=160;const x=c.getContext('2d'),d=x.createImageData(160,160);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}x.putImageData(d,0,0);$('#grain').style.backgroundImage=`url(${c.toDataURL()})`;}catch(e){}}
let lastHover=null,lastHoverT=0;
document.addEventListener('pointerover',e=>{const n=e.target.closest&&e.target.closest('.node [data-act], .mode, .btn.primary, .diff, .topic, .tl-item');if(!n||n===lastHover)return;lastHover=n;const now=performance.now();if(now-lastHoverT<70||n.disabled)return;lastHoverT=now;sfx('hover',n.dataset&&n.dataset.id?ORDER.indexOf(n.dataset.id):-1);});
document.addEventListener('pointerout',e=>{if(lastHover&&!lastHover.contains(e.relatedTarget))lastHover=null;});
let mapRevealing=false;
function mapArrive(){
  if(view!=='map'||mapRevealing)return;if(CINE.busy){setTimeout(mapArrive,300);return;}
  const newly=ORDER.filter((id,i)=>isUnlocked(i)&&!S.revealed.includes(id));if(!newly.length)return;
  mapRevealing=true;
  setTimeout(()=>{
    if(view!=='map'){mapRevealing=false;return;}
    newly.forEach(id=>{const f=$(`.fog[data-fog="${id}"]`);if(f)f.classList.add('clearing');});
    sfx('reveal');const last=CH[newly[newly.length-1]];
    say(newly.length>1?t('La brume se dissipe. De nouvelles salles sont révélées.','La niebla se disipa. Se han revelado nuevas cámaras.'):t('La brume se dissipe. ','La niebla se disipa. ')+T(last.name)+'.');
    setTimeout(()=>{S.revealed=S.revealed.concat(newly);save();mapSel=newly[newly.length-1];mapRevealing=false;if(view==='map'){$('#view').innerHTML=mapHTML();revealText($('.mapwrap'));}},1800);
  },350);
}
function navGo(v,src){
  if(CINE.busy)return;if(v===view&&v!=='codex')return;
  if(R){R.paused=true;stopTimers();}
  hush();
  const card=v==='codex'?{emb:P.book,k:t('Bibliothèque du temple','Biblioteca del templo'),t:t('Le Codex des Sages','El Códice de los Sabios'),ms:1600}:null;
  cine({from:centerOf(src),swap:()=>go(v),card,after:()=>{if(v==='codex'&&codexTab==='sages')readSage(codexSel);}});
}
const NUMW=()=>L==='fr'?['','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix']:['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez'];
const cardSay=(id,i)=>i>=0?t('Salle ','Cámara ')+NUMW()[i+1]+'. '+chName(id)+'.':chName(id);
function navEnter(id,src){
  if(CINE.busy)return;const i=ORDER.indexOf(id);if(i>=0&&!isUnlocked(i))return;
  const ch=CH[id];let from=centerOf(src),zoom=null;
  if(view==='map'&&i>=0){const node=$(`.tmap [data-id="${id}"]`),p=centerOf(node),map=$('.tmap');if(p&&map){from=p;zoom={el:map,x:p[0],y:p[1],s:2.6};}}
  if(R){R.paused=true;stopTimers();}
  hush();
  cine({from,zoom,closeMs:850,swap:()=>startRun(id,{silent:true}),
    card:{emb:id,k:i>=0?`${t('Salle','Cámara')} ${chNum(id)}`:T(ch.tag),t:chName(id),ms:2300,say:cardSay(id,i),voice:{pitch:.8,rate:.88}},
    after:()=>{const I=INTROS[id];const intro2=()=>{if(I&&R&&R.q&&R.q.kind==='intro')say(T(I.story)+(I.echo?' '+T(I.echo):''));};if(SCENES[id]&&!S.seen[id]&&ORDER.includes(id))playScene(id).then(intro2);else intro2();}});
}
const PROLOGUE=()=>t('Il y a plus de 2 500 ans, sur l’île grecque de Samos, est né un sage appelé <b>Pythagore</b>. Lui et ses disciples gardaient leurs découvertes secrètes.<br><br>La légende raconte que la plus importante, une règle que respectent tous les triangles rectangles, est restée cachée dans un temple.<br><br>Personne n’a réussi à la déchiffrer en entier. Jusqu’à aujourd’hui.','Hace más de 2.500 años, en la isla griega de Samos, nació un sabio llamado <b>Pitágoras</b>. Él y sus discípulos guardaban sus descubrimientos en secreto.<br><br>Cuenta la leyenda que el más importante, una regla que cumplen todos los triángulos rectángulos, quedó escondido en un templo.<br><br>Nadie ha conseguido descifrarlo entero. Hasta hoy.');
async function startGame(){
  if(CINE.busy)return;audioInit();
  const first=!S.prologue,name=S.duel.p1||t('explorateur','explorador');
  const after=()=>{if(first){S.prologue=true;unlockSages('start');save();playScene('prologue').then(()=>say(t('Dans le Codex des Sages, tu as déjà les premières pages : l’histoire de Pythagore et de Théano. Commence par la Salle des Carrés.','En el Códice de los Sabios ya tienes las primeras páginas: la historia de Pitágoras y de Teano. Empieza por la Cámara de los Cuadrados.')));return;}
    say((S.stars.c1||0)?t('Bon retour. Choisis ta prochaine salle.','Bienvenido de nuevo. Elige tu próxima cámara.'):t('Bienvenue. Commence par la Salle des Carrés.','Bienvenido. Empieza por la Cámara de los Cuadrados.'));};
  const art=$('.title-art svg'),tav=$('.title-art .tav');
  if(!art||reduced()){go('map');after();return;}
  CINE.busy=true;PAR.freeze=true;
  sfx('steps');if(tav){tav.style.transition='transform 1.1s ease-in-out';tav.style.transform='translate(-112px,-46px) scale(.72)';}
  await wait(1050);CINE.busy=false;
  const b=art.getBoundingClientRect(),dx=b.left+b.width*(320/640),dy=b.top+b.height*(236/380);
  sfx('door');
  const P0=PROLOGUE();
  cine({from:[dx,dy],zoom:{el:art,x:dx,y:dy,s:3.4},closeMs:1000,swap:()=>go('map'),
    card:first?{k:t('Prologue','Prólogo'),t:t('Le secret de Samos','El secreto de Samos'),p:P0,say:plain(P0.replace(/<br>/g,' ')),ms:2600,waitSpeech:true,maxMs:20000,skip:true}
               :{emb:'c1',k:t('Journal d’expédition','Diario de expedición'),t:t(`Bon retour, ${name}`,`Bienvenido, ${name}`),ms:1700},
    after});
}
