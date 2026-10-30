/* =========================================================
   EFECTOS VISUALES
   ========================================================= */
const tok=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const FX={ps:[],raf:0};
function fxLoop(){
  const cv=$('#fx'),ctx=cv.getContext('2d');if(cv.width!==innerWidth||cv.height!==innerHeight){cv.width=innerWidth;cv.height=innerHeight;}
  ctx.clearRect(0,0,cv.width,cv.height);FX.ps=FX.ps.filter(p=>p.life>0);
  FX.ps.forEach(p=>{p.vy+=p.g;p.vx*=p.drag;p.vy*=p.drag;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.life--;ctx.globalAlpha=Math.min(1,p.life/25);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;if(p.tri){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(p.s,0);ctx.lineTo(0,p.s*.8);ctx.closePath();ctx.fill();}else ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);ctx.restore();});
  ctx.globalAlpha=1;
  if(FX.ps.length)FX.raf=requestAnimationFrame(fxLoop);else{FX.raf=0;ctx.clearRect(0,0,cv.width,cv.height);}
}
function addPs(a){if(reduced())return;FX.ps.push(...a);if(!FX.raf)FX.raf=requestAnimationFrame(fxLoop);}
function confetti(n=120){const W=innerWidth,H=innerHeight,cols=['--torch','--torch-hi','--lapis','--moss','--sand'].map(tok);addPs(Array.from({length:n},()=>({x:W/2+(Math.random()-.5)*W*.4,y:H*.38,vx:(Math.random()-.5)*12,vy:-Math.random()*11-4,g:.26,drag:.995,s:Math.random()*7+5,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[Math.random()*cols.length|0],tri:Math.random()<.6,life:150})));}
function burst(el,kind='ok',n=26){if(!el)return;const b=el.getBoundingClientRect(),x=b.left+Math.min(b.width,260)/2,y=b.top+b.height/2;const cols=(kind==='ok'?['--lapis','--lapis-hi','--torch-hi']:['--torch','--torch-hi','--ember']).map(tok);addPs(Array.from({length:n},()=>{const a=Math.random()*Math.PI*2,sp=Math.random()*6+2;return{x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,g:.14,drag:.97,s:Math.random()*6+4,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cols[Math.random()*cols.length|0],tri:true,life:50};}));}
function flash(k){const f=$('#flash');f.className='flash';void f.offsetWidth;f.className='flash '+k;}
function shakeEl(el){if(!el)return;el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}
function flyXP(n){
  const from=$('#answerBox'),to=$('.xpbar');if(!from||!to||reduced())return;
  const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();if(!a.width)return;
  const el=document.createElement('div');el.className='flyxp';el.textContent=`+${n} XP`;el.style.left=(a.left+30)+'px';el.style.top=(a.top)+'px';document.body.appendChild(el);
  const dx=b.left+b.width*.5-(a.left+30),dy=b.top-a.top;
  try{const an=el.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx*.25}px,${dy*.25-50}px) scale(1.3)`,opacity:1,offset:.35},{transform:`translate(${dx}px,${dy}px) scale(.6)`,opacity:.15}],{duration:950,easing:'cubic-bezier(.5,0,.7,1)'});
    an.onfinish=()=>{el.remove();const bar=$('.xpbar');if(bar){bar.classList.add('pulse-bar');setTimeout(()=>bar.classList.remove('pulse-bar'),450);}sfx('coin');};}catch(e){el.remove();}
}
/* partículas de ambiente */
const AMB={type:'embers',ps:[],raf:0};
function setScene(type){if(AMB.type===type)return;AMB.type=type;AMB.ps=[];if(!AMB.raf&&!reduced())AMB.raf=requestAnimationFrame(ambLoop);}
function ambSpawn(type,W,H,init){
  const r=Math.random;const base={x:r()*W,y:init?r()*H:H+10,vx:(r()-.5)*.3,vy:-(r()*.5+.2),s:r()*1.6+.6,a:r()*.35+.1,ph:r()*6};
  if(type==='drops')return Object.assign(base,{y:init?r()*H:-10,vy:r()*2.5+2,vx:0,s:1,a:.22});
  if(type==='sand')return Object.assign(base,{y:init?r()*H:-10,vy:r()*1.2+.6,vx:(r()-.5)*.2,a:.25});
  if(type==='dust')return Object.assign(base,{vy:(r()-.5)*.2,vx:(r()-.5)*.25,a:r()*.12+.04});
  if(type==='sparks')return Object.assign(base,{vy:-(r()*1.2+.4),a:r()*.4+.15});
  if(type==='stars')return Object.assign(base,{y:r()*H*.6,vy:0,vx:0,a:r()*.5+.1});
  return base;
}
function ambLoop(){
  AMB.raf=requestAnimationFrame(ambLoop);
  if(document.hidden)return;
  const cv=$('#amb'),ctx=cv.getContext('2d');if(cv.width!==innerWidth||cv.height!==innerHeight){cv.width=innerWidth;cv.height=innerHeight;}
  const W=cv.width,H=cv.height,type=AMB.type,want={embers:34,dust:40,drops:36,sand:60,sparks:44,stars:70}[type]||0;
  while(AMB.ps.length<want)AMB.ps.push(ambSpawn(type,W,H,true));
  const col={embers:tok('--torch'),dust:tok('--sand'),drops:tok('--lapis-hi'),sand:tok('--torch-hi'),sparks:tok('--ember-hi'),stars:tok('--sand')}[type];
  ctx.clearRect(0,0,W,H);ctx.fillStyle=col;ctx.strokeStyle=col;
  AMB.ps.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;p.ph+=.03;
    const out=p.y<-20||p.y>H+20||p.x<-20||p.x>W+20;if(out){AMB.ps[i]=ambSpawn(type,W,H,false);return;}
    const al=type==='stars'||type==='embers'||type==='sparks'?p.a*(.6+.4*Math.sin(p.ph)):p.a;ctx.globalAlpha=al;
    if(type==='drops'){ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x,p.y-8);ctx.stroke();}
    else{ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill();}});
  ctx.globalAlpha=1;
}

/* =========================================================
   PROGRESO
   ========================================================= */
function toast(html,ms=3600){const el=document.createElement('div');el.className='toast';el.innerHTML=html;$('#toasts').appendChild(el);setTimeout(()=>el.remove(),ms);}
function banner(eyebrow,text){const b=$('#banner');b.innerHTML=`<p class="eyebrow">${eyebrow}</p><p class="banner-t">${esc(text)}</p>`;b.hidden=false;clearTimeout(banner.t);banner.t=setTimeout(()=>{b.hidden=true;},3000);}
function addXPraw(n){const before=rankOf(S.xp);S.xp+=n;save();renderTop();const after=rankOf(S.xp);if(after>before){sfx('rank');banner(t('Nouveau rang','Nuevo rango'),rankName(after));confetti(140);say(t('Nouveau rang : ','Nuevo rango: ')+rankName(after)+'.');}}
function gainXP(n){n=Math.round(n*DF().xp);if(!n)return 0;if(R&&!R.over)R.xp+=n;addXPraw(n);return n;}
function grant(id){
  if(S.relics[id])return;S.relics[id]=todayStr();save();
  const r=RELICS.find(x=>x.id===id);if(R)R.newRelics.push(id);
  toast(`${relicSVG(r)}<span><small>${t('Relique obtenue','Reliquia conseguida')}</small><b>${esc(T(r.name))}</b></span>`);
  sfx('relic');confetti(70);renderTop();
}
const relicCount=()=>RELICS.filter(r=>S.relics[r.id]).length;
const dailyStreak=()=>(S.daily.last===todayStr()||S.daily.last===yesterdayStr())?S.daily.streak:0;

