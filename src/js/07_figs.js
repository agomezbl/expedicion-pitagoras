/* =========================================================
   FIGURAS
   ========================================================= */
function fitter(pts,W,H,P){
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
  const minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys);
  const s=Math.min((W-2*P)/((maxx-minx)||1),(H-2*P)/((maxy-miny)||1));
  const ox=(W-(maxx-minx)*s)/2,oy=(H-(maxy-miny)*s)/2;
  return ([x,y])=>[ox+(x-minx)*s,H-(oy+(y-miny)*s)];
}
const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
const pt=p=>p[0].toFixed(1)+','+p[1].toFixed(1);
const lab=(x,y,t,cls='')=>`<text class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">${esc(t)}</text>`;
function figTri(o){
  const W=o.w||400,H=o.h||300,PAD=o.pad||(o.squares?16:46);
  let pts=[[0,0],[o.a,0],[0,o.b]];
  if(o.flip)pts=pts.map(p=>[-p[0],p[1]]);
  const rr=(o.rot||0)*Math.PI/180,cs=Math.cos(rr),sn=Math.sin(rr);
  pts=pts.map(([x,y])=>[x*cs-y*sn,x*sn+y*cs]);
  const SIDES={a:[0,1,2],b:[0,2,1],c:[1,2,0]};
  const sq={};
  if(o.squares){for(const k in SIDES){const[i,j,m]=SIDES[k];const pi=pts[i],pj=pts[j],pm=pts[m];let nx=-(pj[1]-pi[1]),ny=pj[0]-pi[0];if(nx*(pm[0]-pi[0])+ny*(pm[1]-pi[1])>0){nx=-nx;ny=-ny;}sq[k]=[pi,pj,[pj[0]+nx,pj[1]+ny],[pi[0]+nx,pi[1]+ny]];}}
  const T=fitter(pts.concat(...Object.values(sq)),W,H,PAD);
  const sp=pts.map(T);const ssq={};for(const k in sq)ssq[k]=sq[k].map(T);
  const len={a:o.a,b:o.b,c:Math.hypot(o.a,o.b)};
  let out='';
  for(const k of ['a','b','c']){
    if(!ssq[k])continue;
    out+=`<polygon class="sq sq-${k}${o.hl===k?' hl':''}" points="${ssq[k].map(pt).join(' ')}"/>`;
    if(o.grid){const n=Math.round(len[k]);if(Math.abs(n-len[k])<1e-6&&n>1){const[p0,p1,p2,p3]=ssq[k];for(let t=1;t<n;t++){const f=t/n;const A=lerp(p0,p1,f),B=lerp(p3,p2,f),C=lerp(p0,p3,f),D=lerp(p1,p2,f);out+=`<line class="grid" x1="${A[0].toFixed(1)}" y1="${A[1].toFixed(1)}" x2="${B[0].toFixed(1)}" y2="${B[1].toFixed(1)}"/><line class="grid" x1="${C[0].toFixed(1)}" y1="${C[1].toFixed(1)}" x2="${D[0].toFixed(1)}" y2="${D[1].toFixed(1)}"/>`;}}}
  }
  out+=`<polygon class="tri" points="${sp.map(pt).join(' ')}"/>`;
  if(o.unk){const[i,j]=SIDES[o.unk];out+=`<line class="side-unk" x1="${sp[i][0].toFixed(1)}" y1="${sp[i][1].toFixed(1)}" x2="${sp[j][0].toFixed(1)}" y2="${sp[j][1].toFixed(1)}"/>`;}
  const u=(p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy)||1;return[dx/l,dy/l];};
  const u1=u(sp[0],sp[1]),u2=u(sp[0],sp[2]),m=13;
  out+=`<path class="ra" d="M${(sp[0][0]+u1[0]*m).toFixed(1)} ${(sp[0][1]+u1[1]*m).toFixed(1)} L${(sp[0][0]+(u1[0]+u2[0])*m).toFixed(1)} ${(sp[0][1]+(u1[1]+u2[1])*m).toFixed(1)} L${(sp[0][0]+u2[0]*m).toFixed(1)} ${(sp[0][1]+u2[1]*m).toFixed(1)}"/>`;
  const cen=[(sp[0][0]+sp[1][0]+sp[2][0])/3,(sp[0][1]+sp[1][1]+sp[2][1])/3];
  for(const k of ['a','b','c']){
    const t=o['l'+k];if(t==null||t==='')continue;
    const[i,j]=SIDES[k];const mx=(sp[i][0]+sp[j][0])/2,my=(sp[i][1]+sp[j][1])/2;
    let nx=-(sp[j][1]-sp[i][1]),ny=sp[j][0]-sp[i][0];const nl=Math.hypot(nx,ny)||1;nx/=nl;ny/=nl;
    if(nx*(cen[0]-mx)+ny*(cen[1]-my)>0){nx=-nx;ny=-ny;}
    const off=o.squares?-17:Math.min(34,10+String(t).length*3.6);
    out+=lab(mx+nx*off,my+ny*off,t,(o.unk===k?'unk ':'')+(o.italic?'it':''));
  }
  if(o.verts){o.verts.forEach((v,i)=>{if(!v)return;const p=sp[i];let dx=p[0]-cen[0],dy=p[1]-cen[1];const l=Math.hypot(dx,dy)||1;out+=lab(p[0]+dx/l*17,p[1]+dy/l*17,v,'vtx');});}
  if(o.ang){const i=o.ang,j=0,k=i===1?2:1,p=sp[i],ua=u(p,sp[j]),ub=u(p,sp[k]),rA=28;const a0=Math.atan2(ua[1],ua[0]),a1=Math.atan2(ub[1],ub[0]);let da=a1-a0;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
    const A=[p[0]+Math.cos(a0)*rA,p[1]+Math.sin(a0)*rA],B=[p[0]+Math.cos(a1)*rA,p[1]+Math.sin(a1)*rA];out+=`<path class="angarc" d="M${pt(A)} A${rA} ${rA} 0 0 ${da>0?1:0} ${pt(B)}"/>`;
    if(o.angLab){const am=a0+da/2;out+=lab(p[0]+Math.cos(am)*(rA+18),p[1]+Math.sin(am)*(rA+18),o.angLab,'anglab'+(o.angLab==='?'?' unk':''));}}
  if(o.sqLabels)for(const k in o.sqLabels){if(!ssq[k])continue;const c=ssq[k].reduce((a,p)=>[a[0]+p[0]/4,a[1]+p[1]/4],[0,0]);const v=String(o.sqLabels[k]);out+=lab(c[0],c[1],v,v==='?'?'unk area':'area');}
  return `<svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria||t('Triangle rectangle','Triángulo rectángulo'))}">${out}</svg>`;
}
function figSides(s,verts){
  const[a,b,L]=s.slice().sort((x,y)=>x-y);
  const x=(a*a-b*b+L*L)/(2*L),y=Math.sqrt(Math.max(0,a*a-x*x));
  const T=fitter([[0,0],[L,0],[x,y]],400,280,48);
  const p=[[0,0],[L,0],[x,y]].map(T);
  const cen=[(p[0][0]+p[1][0]+p[2][0])/3,(p[0][1]+p[1][1]+p[2][1])/3];
  let out=`<polygon class="tri" points="${p.map(pt).join(' ')}"/>`;
  [[0,1,L],[0,2,a],[1,2,b]].forEach(([i,j,v])=>{const mx=(p[i][0]+p[j][0])/2,my=(p[i][1]+p[j][1])/2;let nx=-(p[j][1]-p[i][1]),ny=p[j][0]-p[i][0];const nl=Math.hypot(nx,ny)||1;nx/=nl;ny/=nl;if(nx*(cen[0]-mx)+ny*(cen[1]-my)>0){nx=-nx;ny=-ny;}out+=lab(mx+nx*20,my+ny*20,String(v));});
  const q=p[2];out+=`<path class="qarc" d="M${(q[0]-14).toFixed(1)} ${(q[1]+12).toFixed(1)} Q${q[0].toFixed(1)} ${(q[1]+26).toFixed(1)} ${(q[0]+14).toFixed(1)} ${(q[1]+12).toFixed(1)}"/>`+lab(q[0],q[1]+40,t('90° ?','¿90°?'),'unk');
  if(verts){const nm=[verts[0],verts[1],verts[2]];[0,1,2].forEach(i=>{const pp=p[i];let dx=pp[0]-cen[0],dy=pp[1]-cen[1];const l=Math.hypot(dx,dy)||1;out+=lab(pp[0]+dx/l*16,pp[1]+dy/l*16,nm[i],'vtx');});}
  return `<svg class="fig" viewBox="0 0 400 280" role="img" aria-label="${t('Triangle de côtés','Triángulo de lados')} ${s.join(', ')}">${out}</svg>`;
}
function figBridge(o){
  const W=400,H=280,s=Math.min(250/o.a,150/o.b),X1=72,X2=X1+o.a*s,Yb=228,Y1=Yb-o.b*s;
  const mx=(X1+X2)/2,my=(Y1+Yb)/2,dx=X2-X1,dy=Yb-Y1,l=Math.hypot(dx,dy);const nx=dy/l,ny=-dx/l;
  return `<svg class="fig bridge" id="bridgeSvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('Deux falaises et une corde','Dos acantilados y una cuerda')}">
  <defs><linearGradient id="abyss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--stone-2)"/><stop offset="1" style="stop-color:var(--night)"/></linearGradient></defs>
  <path class="far" d="M0 150 L40 120 L80 140 L130 95 L190 135 L240 105 L300 140 L350 110 L400 130 V${H} H0Z"/>
  <rect x="${X1}" y="${Yb}" width="${(X2-X1).toFixed(1)}" height="${H-Yb}" fill="url(#abyss)"/>
  <ellipse class="mist" cx="${mx.toFixed(1)}" cy="${H-12}" rx="${((X2-X1)/2+20).toFixed(1)}" ry="16"/>
  <path class="rock" d="M0 ${Y1.toFixed(1)} L${X1} ${Y1.toFixed(1)} L${X1+7} ${H} L0 ${H}Z"/>
  <path class="rock" d="M${X2.toFixed(1)} ${Yb} L${W} ${Yb} L${W} ${H} L${(X2-9).toFixed(1)} ${H}Z"/>
  ${torch(26,Y1,.8)}
  <line class="guide${o.unk==='b'?' unk':''}" x1="${X1}" y1="${Y1.toFixed(1)}" x2="${X1}" y2="${Yb}"/>
  <line class="guide${o.unk==='a'?' unk':''}" x1="${X1}" y1="${Yb}" x2="${X2.toFixed(1)}" y2="${Yb}"/>
  <path d="M${X1+12} ${Yb} V${Yb-12} H${X1}" style="fill:none;stroke:var(--sand-2);stroke-width:1.5"/>
  <line class="rope${o.unk==='c'?' unk':''}" x1="${X1}" y1="${Y1.toFixed(1)}" x2="${X2.toFixed(1)}" y2="${Yb}"/>
  ${lab(X1-30,(Y1+Yb)/2,o.lb,o.unk==='b'?'unk':'')}
  ${lab(mx,Yb+24,o.la,o.unk==='a'?'unk':'')}
  ${lab(mx+nx*26,my+ny*26,o.lc,o.unk==='c'?'unk':'')}
  <g class="walker" data-end="${X2.toFixed(1)},${Yb}" style="transform:translate(${X1-14}px,${Y1.toFixed(1)}px)"><g transform="scale(.95)"><g class="av bob">${AV}</g></g></g>
  </svg>`;
}
function figLadder(o){
  const s=Math.min(220/o.base,180/o.height),wallX=318,floorY=246;
  const foot=[wallX-o.base*s,floorY],top=[wallX,floorY-o.height*s];
  const dx=top[0]-foot[0],dy=top[1]-foot[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,px=-uy*5,py=ux*5;
  let rungs='';const n=Math.max(3,Math.floor(L/22));for(let i=1;i<n;i++){const t=i/n,x=foot[0]+dx*t,y=foot[1]+dy*t;rungs+=`<line class="rung" x1="${(x-px).toFixed(1)}" y1="${(y-py).toFixed(1)}" x2="${(x+px).toFixed(1)}" y2="${(y+py).toFixed(1)}"/>`;}
  let bricks='';for(let y=40;y<floorY;y+=22)bricks+=`<line class="brick" x1="${wallX}" y1="${y}" x2="${wallX+30}" y2="${y}"/>`;
  const nx=dy/L,ny=-dx/L,mx=(foot[0]+top[0])/2,my=(foot[1]+top[1])/2;
  return `<svg class="fig ladder" viewBox="0 0 400 290" role="img" aria-label="${t('Échelle appuyée contre un mur','Escalera apoyada en una pared')}">
  <rect class="wallr" x="${wallX}" y="22" width="30" height="${floorY-22}"/>${bricks}
  <line class="floor" x1="20" y1="${floorY}" x2="380" y2="${floorY}"/>
  <line class="guide${o.unk==='b'?' unk':''}" x1="${foot[0].toFixed(1)}" y1="${floorY+.5}" x2="${wallX}" y2="${floorY+.5}"/>
  <line class="guide${o.unk==='h'?' unk':''}" x1="${wallX-1}" y1="${top[1].toFixed(1)}" x2="${wallX-1}" y2="${floorY}"/>
  <path d="M${wallX-12} ${floorY} V${floorY-12} H${wallX}" style="fill:none;stroke:var(--sand-2);stroke-width:1.5"/>
  <g class="${o.unk==='l'?'rails-unk':''}"><line class="rail" x1="${(foot[0]+px).toFixed(1)}" y1="${(foot[1]+py).toFixed(1)}" x2="${(top[0]+px).toFixed(1)}" y2="${(top[1]+py).toFixed(1)}"/><line class="rail" x1="${(foot[0]-px).toFixed(1)}" y1="${(foot[1]-py).toFixed(1)}" x2="${(top[0]-px).toFixed(1)}" y2="${(top[1]-py).toFixed(1)}"/>${rungs}</g>
  ${lab((foot[0]+wallX)/2,floorY+24,o.lb,o.unk==='b'?'unk':'')}
  ${lab(wallX-34,(top[1]+floorY)/2+18,o.lh,o.unk==='h'?'unk':'')}
  ${lab(mx+nx*26,my+ny*26,o.ll,o.unk==='l'?'unk':'')}
  ${avatar(Math.max(40,foot[0]-40),floorY,1.1,'bob')}
  </svg>`;
}
function figDoor(newIdx=-1){
  const seals=R.seals||[];let s='';
  [128,176,224,272].forEach((x,i)=>{const on=i<seals.length;s+=on?`<g class="seal on${i===newIdx?' new':''}"><circle cx="${x}" cy="206" r="19"/>${lab(x,207,String(seals[i]))}</g>`:`<g class="seal"><circle cx="${x}" cy="206" r="19"/><path d="M${x-7} 213V199l14 14z"/></g>`;});
  let bricks='';for(let y=30;y<300;y+=34)bricks+=`<line class="brick" x1="0" y1="${y}" x2="400" y2="${y}"/>`;
  return `<svg class="fig door" id="doorSvg" viewBox="0 0 400 300" role="img" aria-label="${t('Porte à quatre sceaux, ouverts :','Puerta con cuatro sellos, abiertos:')} ${seals.length}">
  <defs><clipPath id="archClip"><path d="M92 300 V132 A108 96 0 0 1 308 132 V300 Z"/></clipPath></defs>
  <rect class="wallbg" x="0" y="0" width="400" height="300"/>${bricks}
  <path class="frame" d="M70 300 V128 A130 116 0 0 1 330 128 V300 Z"/>
  <path class="light" d="M92 300 V132 A108 96 0 0 1 308 132 V300 Z"/>
  <g clip-path="url(#archClip)"><g class="leafg"><path class="leaf" d="M92 300 V132 A108 96 0 0 1 308 132 V300 Z"/>${s}${lab(200,108,t('SCELLÉE','SELLADA'))}</g></g>
  ${torch(40,170,.9)}${torch(360,170,.9)}
  </svg>`;
}
function figGuardian(){
  const hp=Math.max(0,R.hp),mx=R.maxHp,r=hp/mx;
  return `<div class="guardian" id="guardian"><svg class="g-svg" viewBox="0 0 300 190" role="img" aria-label="${t('Le Gardien','El Guardián')}">
  <path class="g-arm" d="M80 112 L38 150 L50 162 L92 130Z"/><path class="g-arm" d="M220 112 L262 150 L250 162 L208 130Z"/>
  <path class="g-body" d="M70 190 L96 100 L204 100 L230 190Z"/>
  <path class="g-head" d="M150 10 L220 102 L80 102Z"/>
  <circle class="g-eye" cx="128" cy="72" r="7.5"/><circle class="g-eye" cx="172" cy="72" r="7.5"/>
  <path class="g-mouth" d="M136 90 h28"/>
  <path class="g-rune" d="M128 122 V160 H166 Z M128 150 h10 v10"/>
  <path class="g-crack" style="opacity:${r<.75?1:0}" d="M160 22 l-8 16 l10 10 l-6 16"/>
  <path class="g-crack" style="opacity:${r<.5?1:0}" d="M108 110 l12 18 l-6 14 l10 20"/>
  <path class="g-crack" style="opacity:${r<.25?1:0}" d="M190 104 l-10 22 l12 12 l-8 26 M118 60 l12 6 l-4 12"/>
  </svg><div class="hp"><span>${t('Gardien','Guardián')}</span><div class="hpbar"><i style="width:${r*100}%"></i></div><span>${hp}/${mx}</span></div></div>`;
}
function depthGauge(){const qs=R.list.filter(scorable),n=qs.length,k=R.correct,pc=n?Math.min(1,k/n):0;return `<div class="gauge" aria-label="${t('Profondeur du puits','Profundidad del pozo')}"><span>0 m</span><div class="g-track"><i style="height:${pc*100}%"></i><svg class="g-av" viewBox="-14 -52 28 56" style="top:calc(${pc*100}% - 40px)" aria-hidden="true"><g class="av bob">${AV}</g></svg></div><span>−${n*3} m</span></div>`;}
function hourglass(r){const top=Math.max(0,Math.min(1,r)),bot=1-top;return `<svg class="hg" viewBox="0 0 28 40" aria-hidden="true"><defs><clipPath id="hgT"><path d="M5 4h18L14 20z"/></clipPath><clipPath id="hgB"><path d="M14 20L23 36H5z"/></clipPath></defs><rect class="hg-sand" id="hgTop" clip-path="url(#hgT)" x="4" y="${(4+16*(1-top)).toFixed(1)}" width="20" height="${(16*top).toFixed(1)}"/><rect class="hg-sand" id="hgBot" clip-path="url(#hgB)" x="4" y="${(36-16*bot).toFixed(1)}" width="20" height="${(16*bot).toFixed(1)}"/><path class="hg-glass" d="M4 3h20M4 37h20M5 4L14 20L5 36M23 4L14 20L23 36"/></svg>`;}
const SCROLL_FIG=()=>`<div class="placeholder"><svg viewBox="0 0 120 90" aria-hidden="true"><path d="M20 15h70a10 10 0 0 1 10 10v45a10 10 0 0 1-10 10H30M20 15a8 8 0 0 0 0 16h10V15M30 31v49a8 8 0 0 1-8-8"/><path d="M42 36h44M42 48h44M42 60h28"/></svg><p>${t('Le schéma apparaîtra quand tu auras bien repéré les données et choisi ce que l’on te demande.','El esquema aparecerá cuando marques bien los datos y elijas qué te piden.')}</p></div>`;


/* ---------- figuras nuevas: raíces, rejilla, caja 3D, círculo ---------- */
function figRootLine(o){
  /* recta numérica de lo a hi con √N marcado entre dos enteros */
  const lo=o.lo,hi=o.hi,W0=400,H0=150,X=v=>30+(v-lo)/(hi-lo)*(W0-60);let out=`<line class="nl" x1="20" y1="90" x2="${W0-20}" y2="90"/>`;
  for(let v=lo;v<=hi;v++)out+=`<line class="nl-t" x1="${X(v).toFixed(1)}" y1="82" x2="${X(v).toFixed(1)}" y2="98"/>`+lab(X(v),116,String(v),'nl-n');
  if(o.band)out+=`<rect class="nl-band" x="${X(o.band[0]).toFixed(1)}" y="80" width="${(X(o.band[1])-X(o.band[0])).toFixed(1)}" height="20" rx="4"/>`;
  if(o.mark!=null){const x=X(o.mark);out+=`<path class="nl-m" d="M${x.toFixed(1)} 88 l-7 -18 h14z"/>`+lab(x,52,o.markLab||'?','nl-ml'+(o.markLab==='?'?' unk':''));}
  return `<svg class="fig" viewBox="0 0 ${W0} ${H0}" role="img" aria-label="${esc(t('Droite graduée','Recta numérica'))}">${out}</svg>`;
}
function figSquareDiag(o){
  const x0=110,y0=40,s=180;
  return `<svg class="fig" viewBox="0 0 400 260" role="img" aria-label="${esc(t('Carré et sa diagonale','Cuadrado y su diagonal'))}"><rect class="sqd" x="${x0}" y="${y0}" width="${s}" height="${s}"/><line class="side-unk" x1="${x0}" y1="${y0+s}" x2="${x0+s}" y2="${y0}"/>
  <path class="ra" d="M${x0+13} ${y0+s} V${y0+s-13} H${x0}"/>${lab(x0+s/2,y0+s+20,o.ls||'1')}${lab(x0-22,y0+s/2,o.ls||'1')}${lab(x0+s/2+22,y0+s/2-16,o.ld||'d','unk')}</svg>`;
}
function figGrid(o){
  /* puntos en una cuadrícula con coordenadas; o.tri dibuja el triángulo rectángulo escondido */
  const nx=o.nx||10,ny=o.ny||8,W0=400,cell=Math.min((W0-50)/nx,(300-50)/ny),H0=ny*cell+50,ox=34,oy=H0-26;
  const X=v=>ox+v*cell,Y=v=>oy-v*cell;let g='';
  for(let i=0;i<=nx;i++)g+=`<line class="grid${i===0?' axis':''}" x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(ny)}"/>`;
  for(let j=0;j<=ny;j++)g+=`<line class="grid${j===0?' axis':''}" x1="${X(0)}" y1="${Y(j)}" x2="${X(nx)}" y2="${Y(j)}"/>`;
  if(o.axes!==false){for(let i=0;i<=nx;i+=o.step||1)g+=lab(X(i),Y(0)+14,String(i),'ax-n');for(let j=1;j<=ny;j+=o.step||1)g+=lab(X(0)-12,Y(j),String(j),'ax-n');}
  const [A,B]=o.pts;
  if(o.tri){const C=[B[0],A[1]];g+=`<path class="leg" d="M${X(A[0])} ${Y(A[1])} H${X(B[0])} V${Y(B[1])}"/><path class="ra" d="M${X(C[0])+(B[0]>A[0]?-10:10)} ${Y(C[1])} V${Y(C[1])+(B[1]>A[1]?-10:10)} H${X(C[0])}"/>`;
    if(o.legLab){g+=lab((X(A[0])+X(B[0]))/2,Y(A[1])+(B[1]>A[1]?16:-12),o.legLab[0],'leg-l');g+=lab(X(B[0])+(B[0]>A[0]?18:-18),(Y(A[1])+Y(B[1]))/2,o.legLab[1],'leg-l');}}
  g+=`<line class="side-unk dist" x1="${X(A[0])}" y1="${Y(A[1])}" x2="${X(B[0])}" y2="${Y(B[1])}"/>`;
  (o.names||['A','B']).forEach((n,i)=>{const p=o.pts[i];g+=`<circle class="gpt" cx="${X(p[0])}" cy="${Y(p[1])}" r="5"/>`+lab(X(p[0])+(i?12:-12),Y(p[1])-14,n+(o.coords?`(${p[0]};${p[1]})`:''),'vtx');});
  if(o.icons)o.icons.forEach(([k,p])=>{g+=`<text class="gico" x="${X(p[0])}" y="${Y(p[1])+6}" text-anchor="middle">${k}</text>`;});
  return `<svg class="fig" viewBox="0 0 ${W0} ${H0.toFixed(0)}" role="img" aria-label="${esc(t('Points dans un repère','Puntos en unos ejes de coordenadas'))}">${g}</svg>`;
}
function figBox(o){
  /* ortoedro / pavé droit en perspectiva caballera: L (ancho), P (fondo), H (alto) */
  const Lx=o.L,P=o.P,Hh=o.H,k=.5,ang=-35*DEG;
  const pr=([x,y,z])=>[x+z*k*Math.cos(ang),-(y)+z*k*Math.sin(ang)];
  const V={A:[0,0,0],B:[Lx,0,0],C:[Lx,0,P],D:[0,0,P],E:[0,Hh,0],F:[Lx,Hh,0],G:[Lx,Hh,P],H:[0,Hh,P]};
  const P2=Object.fromEntries(Object.entries(V).map(([n,v])=>[n,pr(v)]));
  const Tt=fitter(Object.values(P2).map(p=>[p[0],-p[1]]),400,290,40);const Q=Object.fromEntries(Object.entries(P2).map(([n,p])=>[n,Tt([p[0],-p[1]])]));
  const ln=(a,b,cls)=>`<line class="${cls}" x1="${Q[a][0].toFixed(1)}" y1="${Q[a][1].toFixed(1)}" x2="${Q[b][0].toFixed(1)}" y2="${Q[b][1].toFixed(1)}"/>`;
  let g=`<polygon class="bx-face" points="${['A','B','F','E'].map(n=>pt(Q[n])).join(' ')}"/><polygon class="bx-top" points="${['E','F','G','H'].map(n=>pt(Q[n])).join(' ')}"/><polygon class="bx-side" points="${['B','C','G','F'].map(n=>pt(Q[n])).join(' ')}"/>`;
  g+=ln('A','D','bx-hid')+ln('D','C','bx-hid')+ln('D','H','bx-hid');
  ['AB','BF','FE','EA','BC','CG','GF','EH','HG'].forEach(e=>{g+=ln(e[0],e[1],'bx-e');});
  if(o.face)g+=ln('A','C','bx-fd'+(o.unk==='face'?' unk':''));
  if(o.space)g+=ln('A','G','bx-sd'+(o.unk==='space'?' unk':''));
  if(o.face&&o.space)g+=`<path class="ra" d="${(()=>{const c=Q.C,u1=[Q.A[0]-c[0],Q.A[1]-c[1]],u2=[Q.G[0]-c[0],Q.G[1]-c[1]],n1=Math.hypot(...u1),n2=Math.hypot(...u2),m=11;const a=[c[0]+u1[0]/n1*m,c[1]+u1[1]/n1*m],b=[c[0]+u2[0]/n2*m,c[1]+u2[1]/n2*m];return `M${pt(a)} L${pt([a[0]+u2[0]/n2*m,a[1]+u2[1]/n2*m])} L${pt(b)}`;})()}"/>`;
  const mid=(a,b,dx,dy)=>[(Q[a][0]+Q[b][0])/2+dx,(Q[a][1]+Q[b][1])/2+dy];
  if(o.lL!=null){const m=mid('A','B',0,18);g+=lab(m[0],m[1],o.lL);}
  if(o.lH!=null){const m=mid('A','E',-24,0);g+=lab(m[0],m[1],o.lH);}
  if(o.lP!=null){const m=mid('B','C',22,8);g+=lab(m[0],m[1],o.lP);}
  if(o.lF!=null){const m=mid('A','C',6,14);g+=lab(m[0],m[1],o.lF,o.unk==='face'?'unk':'');}
  if(o.lS!=null){const m=mid('A','G',-14,-10);g+=lab(m[0],m[1],o.lS,o.unk==='space'?'unk':'');}
  if(o.verts)Object.keys(Q).forEach(n=>{const c=[(Q.A[0]+Q.G[0])/2,(Q.A[1]+Q.G[1])/2],p=Q[n];let dx=p[0]-c[0],dy=p[1]-c[1];const l=Math.hypot(dx,dy)||1;g+=lab(p[0]+dx/l*13,p[1]+dy/l*13,n,'vtx sm');});
  return `<svg class="fig" viewBox="0 0 400 290" role="img" aria-label="${esc(t('Pavé droit et sa diagonale','Ortoedro y su diagonal'))}">${g}</svg>`;
}
function figCircle(o){
  /* triángulo inscrito en una semicircunferencia (teorema de Tales) */
  const cx=200,cy=150,r=116,th=(o.th||62)*DEG,A=[cx-r,cy],B=[cx+r,cy],M=[cx+r*Math.cos(th),cy-r*Math.sin(th)];
  const u=(p,q)=>{const dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy);return[dx/l,dy/l];},m=12,u1=u(M,A),u2=u(M,B);
  let g=`<circle class="circ" cx="${cx}" cy="${cy}" r="${r}"/><circle class="gpt" cx="${cx}" cy="${cy}" r="3.5"/>${lab(cx,cy+16,'O','vtx sm')}<polygon class="tri" points="${[A,M,B].map(pt).join(' ')}"/>`;
  if(o.ra!==false)g+=`<path class="ra" d="M${pt([M[0]+u1[0]*m,M[1]+u1[1]*m])} L${pt([M[0]+(u1[0]+u2[0])*m,M[1]+(u1[1]+u2[1])*m])} L${pt([M[0]+u2[0]*m,M[1]+u2[1]*m])}"/>`;
  g+=lab(A[0]-14,A[1],o.n?o.n[0]:'A','vtx')+lab(B[0]+14,B[1],o.n?o.n[1]:'B','vtx')+lab(M[0],M[1]-16,o.n?o.n[2]:'M','vtx');
  if(o.lAB)g+=lab(cx,cy+34,o.lAB,o.unk==='AB'?'unk':'');
  if(o.lAM){const p=[(A[0]+M[0])/2-18,(A[1]+M[1])/2-10];g+=lab(p[0],p[1],o.lAM,o.unk==='AM'?'unk':'');}
  if(o.lMB){const p=[(B[0]+M[0])/2+18,(B[1]+M[1])/2-10];g+=lab(p[0],p[1],o.lMB,o.unk==='MB'?'unk':'');}
  return `<svg class="fig" viewBox="0 0 400 300" role="img" aria-label="${esc(t('Triangle inscrit dans un demi-cercle','Triángulo inscrito en una semicircunferencia'))}">${g}</svg>`;
}
