/* =========================================================
   ICONOS Y DIBUJOS FIJOS
   ========================================================= */
const P={
  flame:'M12 3c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4 2-6 2 1 3 3 3 5 1-3 0-7 1-10z',
  sun:'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2',
  hex:'M12 2l8.7 5v10L12 22l-8.7-5V7z',
  soundOn:'M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
  soundOff:'M4 9h4l5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6',
  heart:'M12 20s-7-4.5-9-9a4.5 4.5 0 0 1 9-2 4.5 4.5 0 0 1 9 2c-2 4.5-9 9-9 9z',
  amulet:'M12 3l7 9-7 9-7-9z',
  star:'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z',
  ruler:'M3 16L16 3l5 5L8 21zM7 12l2 2M10 9l2 2M13 6l2 2',
  duel:'M4 4l16 16M20 4L4 20M4 4h4M4 4v4M20 4h-4M20 4v4M7 17l-2 2M17 17l2 2',
  relic:'M12 2l8.7 5v10L12 22l-8.7-5V7zM12 7l4 7H8z',
  book:'M4 5c3-1 6-1 8 1c2-2 5-2 8-1v14c-3-1-6-1-8 1c-2-2-5-2-8-1zM12 6v14',
  gear:'M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7zM19.4 13a7.5 7.5 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.5h-4l-.3 2.5a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.5 7.5 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4z',
  target:'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7a5 5 0 1 0 0 10a5 5 0 1 0 0-10zM12 11a1 1 0 1 0 0 2a1 1 0 1 0 0-2z',
  pulse:'M2 12h4l2.5-6 4 12 3-9 1.5 3H22',
  exam:'M6 3h9l4 4v14H6zM15 3v4h4M9 12l2 2 4-4M9 17h7',
  guide:'M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-6',
  voice:'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  save:'M5 3h11l3 3v15H5zM8 3v6h8V3M8 21v-7h8v7',
  globe:'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  scene:'M3 5h18v12H3zM8 21h8M12 17v4M8 9l3 2-3 2zM14 9h3M14 12h3',
  feather:'M20 4C12 4 6 10 5 19M20 4c0 7-5 12-12 12M9 15l-4 6M13 8l3 3M11 11l2 2',
  owl:'M6 4l3 3h6l3-3v9a6 6 0 0 1-12 0zM9.5 11a1.5 1.5 0 1 0 0 .1M14.5 11a1.5 1.5 0 1 0 0 .1M11 15l1 1 1-1',
};
const ico=(k,cls='ico')=>`<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[k]}"/></svg>`;
const EMB={
  c1:'M5 20V7l13 13zM5 16h4v4M5 7V3h4M18 20h3v-3',
  c2:'M2 7c5 7 15 7 20 0M2 7v10M22 7v10M7 11.5V17M12 12.6V17M17 11.5V17',
  c3:'M4 9h16M6 9v11h12V9M9 9V5h6v4M12 5V2M10 13v4M14 13v4',
  c4:'M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M9 8h7M9 12h7M9 16h4',
  c5:'M6 21V10a6 6 0 0 1 12 0v11zM4 21h16M9 15h.01M15 15h.01M12 8v3',
  c6:'M12 2l7 9H5zM6 11l-1 10h14l-1-10M9.5 7.5h.01M14.5 7.5h.01M10 16h4',
  c7:'M12 2v4M8 4l1.5 3M16 4l-1.5 3M5 11h14l-2 9H7zM3 11h18M9 15h2l1 2 2-5h2',
  c8:'M12 3v18M7 21h10M4 7h16M4 7l-2 6a3 3 0 0 0 6 0zM20 7l-2 6a3 3 0 0 0 6 0M12 3l-1.5 1.5h3z',
  c9:'M4 20h16M4 20L18 6M4 20a10 10 0 0 0 6-1M7.5 14.5a5 5 0 0 1 2.5 5M18 3v3h3',
  c10:'M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8M4 16l16-8',
  daily:P.sun,train:P.target,survival:P.pulse,exam:P.exam,
};
const embSVG=id=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${EMB[id]||P.relic}"/></svg>`;
const LOGO=`<svg class="logo" viewBox="0 0 34 34" aria-hidden="true"><rect x="1" y="1" width="32" height="32" rx="7" fill="var(--stone-2)" stroke="var(--line)"/><path d="M10 24V14l10 10z" fill="var(--torch-lo)" stroke="var(--torch)" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 20h4v4" fill="none" stroke="var(--sand-2)" stroke-width="1.3"/><path d="M10 14V9h5" fill="none" stroke="var(--lapis)" stroke-width="1.6"/><path d="M20 24h5v-5" fill="none" stroke="var(--moss)" stroke-width="1.6"/></svg>`;
const AV=`<ellipse class="av-sh" cx="0" cy="0" rx="10" ry="2.6"/><path class="av-leg" d="M-4 -1 L-3.5 -14 M4 -1 L3.5 -14"/><rect class="av-pack" x="-11" y="-31" width="7" height="14" rx="2"/><rect class="av-body" x="-6.5" y="-32" width="13" height="19" rx="4.5"/><path class="av-scarf" d="M-6.5 -30 h13 l-1.5 4 h-10z"/><circle class="av-head" cx="0" cy="-38" r="6.2"/><path class="av-hat" d="M-6.5 -41.5 q0 -8 6.5 -8 q6.5 0 6.5 8 z"/><path class="av-brim" d="M-11 -41.5 h22"/>`;
const avatar=(x,y,s=1,cls='bob')=>`<g transform="translate(${x} ${y}) scale(${s})"><g class="av ${cls}">${AV}</g></g>`;
const torch=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2.5" y="0" width="5" height="40" fill="var(--av-pack)"/><path d="M-7 0h14l-3 6h-8z" fill="var(--stone-3)"/><path class="flame" d="M0 0c-7-6-4-14 0-22c6 7 8 15 0 22z"/><path class="flame f2" d="M0 -1c-3-3-2-7 0-11c3 4 3 8 0 11z"/></g>`;
function templeSVG(){
  const sr=seeded(7);let stars='';for(let i=0;i<34;i++){stars+=`<circle class="t-star" cx="${(sr()*640).toFixed(0)}" cy="${(sr()*130).toFixed(0)}" r="${(sr()*1.4+.5).toFixed(1)}" style="animation-delay:${(sr()*3).toFixed(2)}s"/>`;}
  let cols='';[176,222,268,350,396,442].forEach(x=>{cols+=`<rect class="t-col" x="${x}" y="152" width="22" height="110" rx="2"/>`;});
  return `<svg class="temple" viewBox="0 0 640 380" role="img" aria-label="${esc(t('Temple au toit triangulaire et aux torches','Templo de tejado triangular con antorchas'))}">
  <defs><radialGradient id="doorGlow" cx="50%" cy="70%" r="60%"><stop offset="0" style="stop-color:var(--torch-hi);stop-opacity:.85"/><stop offset="1" style="stop-color:var(--torch);stop-opacity:0"/></radialGradient></defs>
  <g data-par="16">${stars}</g>
  <g data-par="-7"><path class="t-hill" d="M0 330 Q160 306 320 318 T640 322 V380 H0Z"/>
  <rect class="t-step" x="110" y="300" width="420" height="22"/><rect class="t-step" x="130" y="281" width="380" height="20"/><rect class="t-step" x="150" y="262" width="340" height="20"/>
  ${cols}
  <rect class="t-arch" x="155" y="136" width="330" height="17"/>
  <path class="t-roof" d="M155 136 L485 136 L155 50 Z"/>
  <path class="t-ra" d="M155 120 h16 v16"/>
  <path class="t-rune" d="M190 128 v-18 h18 M222 128 v-10 h10"/>
  <ellipse class="t-glow" cx="320" cy="244" rx="80" ry="46" fill="url(#doorGlow)"/>
  <path class="t-door" d="M292 262 V202 a28 28 0 0 1 56 0 V262Z"/>
  ${torch(118,262,1.3)}${torch(522,262,1.3)}
  <g class="tav">${avatar(430,334,1.8,'bob')}</g></g>
  </svg>`;
}

