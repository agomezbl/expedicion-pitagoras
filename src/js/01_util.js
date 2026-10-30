/* =========================================================
   UTILIDADES
   ========================================================= */
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>Array.from(el.querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>{const r=Math.round(n*100)/100;return (Object.is(r,-0)?0:r).toString().replace('.',',');};
const fmt1=n=>{const r=Math.round(n*10)/10;return (Object.is(r,-0)?0:r).toString().replace('.',',');};
const r1=x=>Math.round(x*10)/10;
const parseNum=v=>{const s=String(v==null?'':v).trim().replace(/\s/g,'').replace(',','.');return /^-?(\d+\.?\d*|\.\d+)$/.test(s)?parseFloat(s):NaN;};
const near=(x,y)=>Math.abs(x-y)<=Math.max(0.11,Math.abs(y)*0.012);
const isExact=x=>Math.abs(x-Math.round(x*100)/100)<1e-9;
let rnd=Math.random;
const ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const pick=a=>a[Math.floor(rnd()*a.length)];
const shuffle=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
function seeded(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const pad2=n=>String(n).padStart(2,'0');
const dayStr=d=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const todayStr=()=>dayStr(new Date());
const yesterdayStr=()=>{const d=new Date();d.setDate(d.getDate()-1);return dayStr(d);};
const reduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}};
const TOUCH=(()=>{try{return matchMedia('(hover: none)').matches;}catch(e){return false;}})();
const plain=html=>{const d=document.createElement('div');d.innerHTML=html;return (d.textContent||'').replace(/\s+/g,' ').trim();};
const DEG=Math.PI/180;
const cosd=a=>Math.cos(a*DEG),acosd=x=>Math.acos(x)/DEG;
/* letras de vértices al azar para los triángulos «à la française»: ABC, EFG, RST… */
const VERTS=[['A','B','C'],['E','F','G'],['R','S','T'],['K','L','M'],['D','E','F'],['I','J','K'],['M','N','P'],['U','V','W']];
const seg=(p,q)=>p+q;
