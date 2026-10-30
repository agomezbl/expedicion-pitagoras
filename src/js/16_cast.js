/* =========================================================
   PERSONAJES: retratos ilustrados (vectoriales) de los sabios
   ========================================================= */
const CAST={
  teano:{n:tf('Théano','Teano'),role:tf('Pythagoricienne · Crotone','Pitagórica · Crotona'),col:'#8fe3ec'},
  pitagoras:{n:tf('Pythagore','Pitágoras'),role:tf('Samos · vers 530 av. J.-C.','Samos · hacia el 530 a.C.'),col:'#ffd27f'},
  arpedonapta:{n:tf('L’arpenteur','El agrimensor'),role:tf('Tendeur de corde · Égypte','Tensador de cuerda · Egipto'),col:'#e6a35a'},
  tales:{n:tf('Thalès','Tales'),role:tf('Milet · vers 585 av. J.-C.','Mileto · hacia el 585 a.C.'),col:'#9cc472'},
  hipaso:{n:tf('Hippase','Hipaso'),role:tf('Métaponte · Ve siècle av. J.-C.','Metaponto · siglo V a.C.'),col:'#4cbccb'},
  aristoteles:{n:tf('Aristote','Aristóteles'),role:tf('Athènes · vers 335 av. J.-C.','Atenas · hacia el 335 a.C.'),col:'#d9c08a'},
  socrates:{n:tf('Socrate','Sócrates'),role:tf('Athènes · vers 400 av. J.-C.','Atenas · hacia el 400 a.C.'),col:'#ff9c86'},
  euclides:{n:tf('Euclide','Euclides'),role:tf('Alexandrie · vers 300 av. J.-C.','Alejandría · hacia el 300 a.C.'),col:'#8fb3ff'},
  hiparco:{n:tf('Hipparque','Hiparco'),role:tf('Rhodes · vers 140 av. J.-C.','Rodas · hacia el 140 a.C.'),col:'#b9a7ff'},
  descartes:{n:tf('René Descartes','René Descartes'),role:tf('France · 1637','Francia · 1637'),col:'#ff8f7a'},
  platon:{n:tf('Platon','Platón'),role:tf('Athènes · l’Académie','Atenas · la Academia'),col:'#f0e6cf'},
  hipatia:{n:tf('Hypatie','Hipatia'),role:tf('Alexandrie · vers 400','Alejandría · hacia el 400'),col:'#ff9fd2'},
  guardian:{n:tf('Le Gardien','El Guardián'),role:tf('Statue du temple','Estatua del templo'),col:'#f2a541'},
  nar:{n:tf('',''),role:tf('',''),col:'#c3b89f'},
};
const shade=(h,a)=>{const n=parseInt(h.slice(1),16);const f=c=>Math.max(0,Math.min(255,Math.round(c+(a>0?(255-c)*a:c*a))));return '#'+[f(n>>16),f((n>>8)&255),f(n&255)].map(v=>v.toString(16).padStart(2,'0')).join('');};
/* skin piel · body robe|peplos|egypt|doublet · coat manto · shirt túnica · trim cenefa · hair/hs pelo · fh barba · acc accesorios */
const CHARS={
  teano:{skin:'#e9c3a0',body:'peplos',coat:'#2f6f86',shirt:'#efe6d2',trim:'#d9b45a',hair:'#3b2418',hs:'bun',eye:'#5a3a22',brow:2.4,jaw:'soft',acc:['band','earrings'],band:'#d9b45a'},
  pitagoras:{skin:'#e3b892',body:'robe',coat:'#f1ead8',shirt:'#d9cfb6',trim:'#b3862f',hair:'#e8e4da',hs:'curly',eye:'#4a5a6a',brow:3.6,browc:'#bdb8ad',jaw:'long',fh:'beard',age:2,acc:['band'],band:'#ffffff'},
  arpedonapta:{skin:'#b47a4e',body:'egypt',coat:'#e9dcc0',shirt:'#e9dcc0',trim:'#3a7fa8',hair:'#151210',hs:'egypt',eye:'#2a1a10',brow:3,jaw:'square',acc:['kohl']},
  tales:{skin:'#deb08a',body:'robe',coat:'#6f7f3f',shirt:'#e7dcc4',trim:'#c9a24a',hair:'#bfb8aa',hs:'bald',eye:'#5a4a32',brow:3.4,browc:'#a8a196',jaw:'round',fh:'beard',age:2},
  hipaso:{skin:'#e6bf98',body:'robe',coat:'#245c6e',shirt:'#e9e0cc',trim:'#8fe3ec',hair:'#2a1a12',hs:'curly',eye:'#3a2a1c',brow:3,jaw:'round',fh:'shortbeard',acc:['band'],band:'#efe6d2'},
  aristoteles:{skin:'#e2b994',body:'robe',coat:'#7a5a34',shirt:'#e9e0cc',trim:'#e0c070',hair:'#5a4a3c',hs:'short',eye:'#4a3a2a',brow:3.2,jaw:'square',fh:'shortbeard',age:1},
  socrates:{skin:'#dcae88',body:'robe',coat:'#8a4a32',shirt:'#e2d6bc',trim:'#c98a5a',hair:'#cfcac0',hs:'bald',eye:'#3a2a1c',brow:4,browc:'#b2aca2',jaw:'round',fh:'beard',age:2,nose:'snub'},
  euclides:{skin:'#e0b790',body:'robe',coat:'#3a4e86',shirt:'#e9e0cc',trim:'#d9b45a',hair:'#6a6a6a',hs:'short',eye:'#3a4a6a',brow:3.2,browc:'#5a5a5a',jaw:'long',fh:'beard',age:1},
  hiparco:{skin:'#dfb48c',body:'robe',coat:'#4a3a7a',shirt:'#e5dcc6',trim:'#b9a7ff',hair:'#7a6a5a',hs:'wavy',eye:'#4a5a7a',brow:3,jaw:'long',fh:'shortbeard',age:1},
  descartes:{skin:'#ecc7a6',body:'doublet',coat:'#1c1a20',shirt:'#f4f0e6',trim:'#f4f0e6',hair:'#2a1c14',hs:'long',eye:'#4a3a2a',brow:3,jaw:'long',fh:'goatee'},
  platon:{skin:'#e2b892',body:'robe',coat:'#e9e2d0',shirt:'#cfc4a8',trim:'#4cbccb',hair:'#8a7a66',hs:'wavy',eye:'#4a4a5a',brow:3.6,browc:'#7a6a58',jaw:'square',fh:'beard',age:1,acc:['laurel']},
  hipatia:{skin:'#ebc6a4',body:'peplos',coat:'#3a2a4a',shirt:'#f2ead8',trim:'#ff9fd2',hair:'#5a2a1c',hs:'long',eye:'#4a5a3a',brow:2.4,jaw:'soft',acc:['earrings']},
};
function headPath(jaw){const J={round:[37,30,48],long:[35,25,52],square:[38,33,48],sharp:[35,20,52],soft:[35,26,47]}[jaw]||[37,30,48];const [w,jw,ch]=J,cx=100,cy=100;
  return `M${cx-w} ${cy-4} C${cx-w} ${cy-40} ${cx-w*.55} ${cy-50} ${cx} ${cy-50} C${cx+w*.55} ${cy-50} ${cx+w} ${cy-40} ${cx+w} ${cy-4} C${cx+w} ${cy+20} ${cx+jw} ${cy+34} ${cx+jw*.45} ${cy+ch-5} Q${cx} ${cy+ch+3} ${cx-jw*.45} ${cy+ch-5} C${cx-jw} ${cy+34} ${cx-w} ${cy+20} ${cx-w} ${cy-4}Z`;}
function eyesHTML(C,mood,u){const y=97;let s='';const fem=C.jaw==='soft';
  [-15,15].forEach(dx=>{const ex=100+dx,sg=dx<0?-1:1;
    if(mood==='happy'){s+=`<path d="M${ex-7} ${y+1} Q${ex} ${y-6} ${ex+7} ${y+1}" stroke="#2a1a12" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${ex-6} ${y+5} q6 3 12 0" stroke="#c98a6a" stroke-width="1.4" fill="none" opacity=".6"/>`;return;}
    const open=mood==='wow'?7:mood==='angry'?3.2:mood==='sad'||mood==='worried'?5:5.4,low=mood==='wow'?6:4.6,ir=mood==='wow'?3:3.8;
    s+=`<path d="M${ex-8} ${y} Q${ex} ${y-open*1.3} ${ex+8} ${y} Q${ex} ${y+low} ${ex-8} ${y}Z" fill="#fbf7f2"/>`+
      `<clipPath id="${u}e${dx<0?'l':'r'}"><path d="M${ex-8} ${y} Q${ex} ${y-open*1.3} ${ex+8} ${y} Q${ex} ${y+low} ${ex-8} ${y}Z"/></clipPath>`+
      `<g clip-path="url(#${u}e${dx<0?'l':'r'})"><circle cx="${ex}" cy="${y+.6}" r="${ir}" fill="${C.eye}"/><circle cx="${ex}" cy="${y+.6}" r="${ir}" fill="none" stroke="${shade(C.eye,-.5)}" stroke-width="1"/><circle cx="${ex}" cy="${y+.6}" r="${ir*.48}" fill="#120c0a"/><path d="M${ex-9} ${y-open*.9} Q${ex} ${y-open*1.6} ${ex+9} ${y-open*.9} L${ex+9} ${y-4} Q${ex} ${y-open*.6} ${ex-9} ${y-4}Z" fill="#000" opacity=".12"/></g>`+
      `<circle cx="${ex+1.4}" cy="${y-1.2}" r="1.3" fill="#fff"/><path d="M${ex-8.5} ${y+.3} Q${ex} ${y-open*1.35} ${ex+8.5} ${y+.3}" stroke="#2a1a12" stroke-width="${fem||(C.acc||[]).includes('kohl')?2.8:2}" fill="none" stroke-linecap="round"/><path d="M${ex+sg*8} ${y} l${sg*(fem?4:2.5)} ${fem?-2.6:-1.6}" stroke="#2a1a12" stroke-width="1.6" stroke-linecap="round"/>${(C.acc||[]).includes('kohl')?`<path d="M${ex+sg*8} ${y+1} l${sg*7} 1" stroke="#151210" stroke-width="2" stroke-linecap="round"/>`:''}`;});
  return s;}
function browsHTML(C,mood){const y=84,col=C.browc||shade(C.hair,-.2),w=C.brow;let s='';
  const tilt={angry:[6,-3],worried:[-5,3],sad:[-5,3],wow:[-5,-5],happy:[-2,-2]}[mood]||[0,0];
  [-1,1].forEach(sg=>{const ix=100+sg*6,ox=100+sg*24;s+=`<path d="M${ix} ${y+tilt[0]*.5+(mood==='wow'?-4:0)} Q${100+sg*15} ${y-4+tilt[1]+(mood==='wow'?-4:0)} ${ox} ${y+1+tilt[1]*.6+(mood==='wow'?-4:0)}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;});return s;}
function mouthHTML(mood,C){const x=100,y=128,lip=C&&C.jaw==='soft'?'#b8504a':'#8a3a32';
  if(mood==='happy')return `<path d="M${x-13} ${y-2} Q${x} ${y+13} ${x+13} ${y-2} Q${x} ${y+3} ${x-13} ${y-2}Z" fill="#7a2a24"/><path d="M${x-10} ${y} Q${x} ${y+4} ${x+10} ${y} L${x+9} ${y+2} Q${x} ${y+5} ${x-9} ${y+2}Z" fill="#fff"/><path d="M${x-5} ${y+8} q5 2 10 0" stroke="#e07a6a" stroke-width="2" fill="none" opacity=".7"/>`;
  if(mood==='wow')return `<ellipse cx="${x}" cy="${y+3}" rx="6" ry="8" fill="#5a1a18"/><ellipse cx="${x}" cy="${y+7}" rx="3.5" ry="2.5" fill="#c0504a"/>`;
  if(mood==='angry'||mood==='sad')return `<path d="M${x-11} ${y+5} Q${x} ${y-3} ${x+11} ${y+5}" stroke="${lip}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if(mood==='worried')return `<path d="M${x-10} ${y+3} Q${x-4} ${y-1} ${x} ${y+2} Q${x+5} ${y+5} ${x+10} ${y+1}" stroke="${lip}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  return `<path d="M${x-10} ${y+1} Q${x} ${y+4} ${x+10} ${y+1}" stroke="${lip}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${x-6} ${y+6} q6 2.5 12 0" stroke="#c97a68" stroke-width="2" fill="none" opacity=".55"/>`;}
/* pelo: [capa de atrás, capa de delante] */
function hairHTML(C,u){const h=C.hair,d=shade(h,-.35),l=shade(h,.28),g=`url(#${u}hr)`;const st=(ps,c,w)=>ps.map(p=>`<path d="${p}" stroke="${c}" stroke-width="${w||1.6}" fill="none" stroke-linecap="round" opacity=".75"/>`).join('');
  switch(C.hs){
  case 'curly':{const cs=[[64,66,11],[74,52,11],[88,45,11],[102,43,11],[116,45,11],[128,52,11],[137,65,11],[142,80,9],[58,82,9],[60,96,8],[140,96,8]];
    return [`<path d="M58 100 C52 56 78 40 100 42 C124 40 150 54 142 100 L146 118 L132 106 L68 106 L54 118Z" fill="${d}"/>`,
      cs.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${g}"/><path d="M${x-r*.5} ${y-r*.2} q${r*.5} ${-r*.6} ${r} 0" stroke="${l}" stroke-width="1.6" fill="none" opacity=".7"/>`).join('')];}
  case 'short':return [`<path d="M60 100 C56 60 76 44 100 44 C126 44 146 60 140 100 L140 108 L60 108Z" fill="${d}"/>`,
      `<path d="M61 94 C58 58 82 44 102 46 C126 46 146 62 139 94 C134 76 124 70 112 68 C100 64 86 66 76 74 C68 80 63 88 61 94Z" fill="${g}"/>`+[[72,72],[84,62],[98,58],[112,58],[126,64],[134,76]].map(([x,y])=>`<path d="M${x-6} ${y+3} q6 -9 12 0" stroke="${l}" stroke-width="1.6" fill="none" opacity=".7"/>`).join('')];
  case 'wavy':return [`<path d="M58 104 C50 58 76 40 100 42 C126 40 152 56 142 104 L148 124 L134 104 L66 104 L52 124Z" fill="${d}"/>`,
      `<path d="M60 96 C54 56 82 42 104 44 C130 46 150 62 140 98 C136 84 128 74 118 72 C112 66 100 70 90 66 C80 70 70 76 66 88Z" fill="${g}"/>`+[[70,66],[86,54],[104,50],[122,56],[136,70]].map(([x,y])=>`<path d="M${x-9} ${y+4} q9 -14 18 0" fill="${h}"/>`).join('')+st(['M68 84 Q76 70 92 66','M96 62 Q112 56 128 66','M120 72 Q132 76 138 90'],l)];
  case 'bun':return [`<path d="M58 104 C50 56 78 40 100 42 C124 40 152 56 142 104 L140 128 L60 128Z" fill="${d}"/><circle cx="100" cy="36" r="17" fill="${g}"/><path d="M88 30 q12 -10 24 0 M86 40 q14 8 28 0" stroke="${l}" stroke-width="1.6" fill="none" opacity=".7"/>`,
      `<path d="M62 98 C58 58 84 44 100 48 C116 44 142 58 138 98 C134 78 122 66 104 64 L100 58 L96 64 C78 66 66 78 62 98Z" fill="${g}"/>`+st(['M96 62 Q80 64 68 84','M104 62 Q120 64 132 84','M90 66 Q74 74 66 94','M110 66 Q126 74 134 94'],l,1.4)];
  case 'long':return [`<path d="M56 100 C48 54 78 40 100 42 C122 40 152 54 144 100 L150 168 Q138 176 128 170 L124 120 L76 120 L72 170 Q62 176 50 168Z" fill="${d}"/>`,
      `<path d="M62 100 C56 56 84 42 100 46 C116 42 144 56 138 100 C134 78 122 64 106 62 L100 54 L94 62 C78 64 66 78 62 100Z" fill="${g}"/><path d="M62 96 Q56 130 62 162 L72 160 Q66 128 70 100Z M138 96 Q144 130 138 162 L128 160 Q134 128 130 100Z" fill="${g}"/>`+st(['M94 60 Q78 66 68 90','M106 60 Q122 66 132 90','M64 112 Q60 136 66 156','M136 112 Q140 136 134 156'],l,1.4)];
  case 'egypt':return [`<path d="M56 104 C50 52 78 40 100 40 C122 40 150 52 144 104 L144 134 L56 134Z" fill="${d}"/>`,
      `<path d="M58 92 C56 54 80 42 100 42 C120 42 144 54 142 92 L142 76 L58 76Z" fill="${g}"/><path d="M60 76 H140" stroke="${shade(h,.3)}" stroke-width="1.4" opacity=".6"/><path d="M56 92 V132 M144 92 V132" stroke="${g}" stroke-width="10"/>`+st(['M70 48 V74','M84 44 V74','M100 42 V74','M116 44 V74','M130 48 V74'],l,1)];
  case 'bald':return [``,`<path d="M62 100 C58 82 62 68 70 62 C66 76 68 88 70 100Z M138 100 C142 82 138 68 130 62 C134 76 132 88 130 100Z" fill="${g}"/>`+st(['M64 92 Q64 78 70 68','M136 92 Q136 78 130 68'],l)+`<ellipse cx="88" cy="62" rx="14" ry="6" fill="#fff" opacity=".22" transform="rotate(-18 88 62)"/>`];
  default:return ['',''];}}
function facialHTML(C,u){const h=C.hair,g=`url(#${u}hr)`,l=shade(h,.28),dd=shade(h,-.25);
  switch(C.fh){
  case 'beard':return `<path d="M63 100 Q58 150 78 172 Q90 186 100 184 Q110 186 122 172 Q142 150 137 100 Q136 126 124 134 Q112 126 100 132 Q88 126 76 134 Q64 126 63 100Z" fill="${g}"/>`+[0,1,2,3,4,5,6].map(i=>`<path d="M${74+i*9} ${140+Math.abs(3-i)*-3} q${i<3?-3:3} 12 0 ${22-Math.abs(3-i)*3}" stroke="${l}" stroke-width="1.4" fill="none" opacity=".65"/>`).join('')+`<path d="M82 121 Q92 115 100 119 Q108 115 118 121 Q110 127 100 124 Q90 127 82 121Z" fill="${dd}"/>`;
  case 'shortbeard':return `<path d="M63 100 Q60 140 80 154 Q92 162 100 160 Q108 162 120 154 Q140 140 137 100 Q136 124 124 132 Q112 126 100 132 Q88 126 76 132 Q64 124 63 100Z" fill="${g}"/>`+[0,1,2,3,4].map(i=>`<path d="M${78+i*11} ${138} q${i<2?-2:2} 8 0 12" stroke="${l}" stroke-width="1.2" fill="none" opacity=".6"/>`).join('')+`<path d="M83 121 Q92 116 100 119 Q108 116 117 121 Q110 125 100 123 Q90 125 83 121Z" fill="${dd}"/>`;
  case 'goatee':return `<path d="M84 121 Q92 116 100 119 Q108 116 116 121 Q114 118 100 121 Q86 118 84 121Z" fill="${g}" stroke="${g}" stroke-width="2"/><path d="M95 140 Q100 152 105 140 Q100 144 95 140Z" fill="${g}"/>`;
  default:return '';}}
function accHTML(C,u,where){const A=C.acc||[];let s='';
  if(where==='head'){
    if(A.includes('band'))s+=`<path d="M60 76 Q100 62 140 76" stroke="${C.band||'#fff'}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M60 76 Q100 62 140 76" stroke="#000" stroke-opacity=".12" stroke-width="1" fill="none" transform="translate(0 2.5)"/><path d="M140 76 q8 6 4 16 M140 76 q12 2 14 12" stroke="${C.band||'#fff'}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    if(A.includes('laurel')){for(let i=0;i<7;i++){const a=(-160+i*20)*DEG,x=100+Math.cos(a)*44,y=78+Math.sin(a)*30;const b=(-20-i*20)*DEG,x2=100+Math.cos(b)*44,y2=78+Math.sin(b)*30;s+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7" ry="3.2" fill="#6f9a3f" transform="rotate(${(-70+i*20)} ${x.toFixed(1)} ${y.toFixed(1)})"/><ellipse cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" rx="7" ry="3.2" fill="#82ad4c" transform="rotate(${(70-i*20)} ${x2.toFixed(1)} ${y2.toFixed(1)})"/>`;}}
  }
  if(where==='ears'&&A.includes('earrings'))s+=`<circle cx="63" cy="118" r="3.2" fill="#e8c86a"/><circle cx="137" cy="118" r="3.2" fill="#e8c86a"/><path d="M63 121 v5 M137 121 v5" stroke="#e8c86a" stroke-width="1.6"/>`;
  return s;}
function bodyGreek(C,u){const c=C.coat,sh=C.shirt,tr=C.trim;
  if(C.body==='egypt')return `<path d="M10 240 C14 196 52 176 100 174 C148 176 186 196 190 240Z" fill="url(#${u}sk)"/>`+[0,1,2,3].map(i=>`<path d="M${64-i*9} ${176+i*7} Q100 ${206+i*12} ${136+i*9} ${176+i*7}" stroke="${['#3a7fa8','#d9b45a','#a83a2a','#3a9a6a'][i]}" stroke-width="6" fill="none"/>`).join('')+`<path d="M30 240 Q100 214 170 240" fill="${sh}"/>`;
  if(C.body==='doublet')return `<path d="M8 240 C12 190 52 170 100 168 C148 170 188 190 192 240Z" fill="url(#${u}c)"/>`+[198,212,226].map(y=>`<circle cx="100" cy="${y}" r="2.2" fill="#3a3640"/>`).join('')+`<path d="M62 168 Q100 182 138 168 L150 196 Q100 208 50 196Z" fill="${sh}"/><path d="M62 168 Q100 182 138 168" stroke="${shade(sh,-.2)}" stroke-width="1.4" fill="none"/><path d="M100 178 V204" stroke="${shade(sh,-.15)}" stroke-width="1.2"/><path d="M14 236 C20 196 56 178 100 174" stroke="#fff" stroke-opacity=".08" stroke-width="3" fill="none"/>`;
  /* túnica (quitón) + manto (himation) cruzado desde el hombro izquierdo */
  let s=`<path d="M8 240 C12 192 52 172 100 170 C148 172 188 192 192 240Z" fill="url(#${u}sh)"/>`+
    `<path d="M80 172 Q100 190 120 172" stroke="${shade(sh,-.25)}" stroke-width="1.6" fill="none"/>`+[0,1,2,3].map(i=>`<path d="M${84+i*10} ${190+i} q-2 24 ${i%2?3:-3} 48" stroke="${shade(sh,-.18)}" stroke-width="1.3" fill="none" opacity=".6"/>`).join('');
  if(C.body==='peplos')return s+`<path d="M8 240 C12 196 40 180 62 176 L80 240Z M192 240 C188 196 160 180 138 176 L120 240Z" fill="url(#${u}c)"/><path d="M62 176 L80 240 M138 176 L120 240" stroke="${tr}" stroke-width="3" fill="none"/><circle cx="68" cy="180" r="5" fill="#e8c86a" stroke="#8a6a1a"/><circle cx="132" cy="180" r="5" fill="#e8c86a" stroke="#8a6a1a"/>`;
  s+=`<path d="M8 240 C10 200 40 178 70 172 Q110 184 150 230 L156 240Z" fill="url(#${u}c)"/>`+
    `<path d="M70 172 Q110 184 150 230" stroke="${tr}" stroke-width="4" fill="none"/><path d="M70 172 Q110 184 150 230" stroke="${shade(tr,-.4)}" stroke-width="1" stroke-dasharray="5 4" fill="none" transform="translate(-2 6)"/>`+
    [0,1,2].map(i=>`<path d="M${30+i*18} ${210+i*4} Q${54+i*16} ${196+i*6} ${78+i*14} ${204+i*8}" stroke="${shade(c,-.3)}" stroke-width="1.8" fill="none" opacity=".6"/>`).join('')+
    `<circle cx="72" cy="176" r="5.5" fill="#e8c86a" stroke="#8a6a1a" stroke-width="1.2"/><path d="M14 236 C20 198 50 180 72 176" stroke="#fff" stroke-opacity=".14" stroke-width="3" fill="none"/>`;
  return s;}
function greekHTML(id,mood,u){const C=CHARS[id];const sk=C.skin,skd=shade(sk,-.22),skl=shade(sk,.35),col=(CAST[id]||{}).col||'#ffd27f';const hp=headPath(C.jaw);
  const defs=`<defs><radialGradient id="${u}s" cx=".36" cy=".34" r=".8"><stop offset="0" stop-color="${skl}"/><stop offset=".55" stop-color="${sk}"/><stop offset="1" stop-color="${skd}"/></radialGradient>
    <linearGradient id="${u}sk" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${skl}"/><stop offset="1" stop-color="${skd}"/></linearGradient>
    <linearGradient id="${u}c" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="${shade(C.coat,.25)}"/><stop offset=".6" stop-color="${C.coat}"/><stop offset="1" stop-color="${shade(C.coat,-.4)}"/></linearGradient>
    <linearGradient id="${u}sh" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${shade(C.shirt,.2)}"/><stop offset="1" stop-color="${shade(C.shirt,-.25)}"/></linearGradient>
    <linearGradient id="${u}hr" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${shade(C.hair,.18)}"/><stop offset="1" stop-color="${shade(C.hair,-.25)}"/></linearGradient>
    <linearGradient id="${u}rim" x1="0" y1="0" x2="1" y2="0"><stop offset=".6" stop-color="${col}" stop-opacity="0"/><stop offset="1" stop-color="${col}" stop-opacity=".5"/></linearGradient>
    <clipPath id="${u}hc"><path d="${hp}"/></clipPath></defs>`;
  const [hb,hf]=hairHTML(C,u);const bigBeard=C.fh==='beard'||C.fh==='shortbeard';
  const nose=C.nose==='snub'?`<path d="M98 102 Q92 114 95 119 Q101 123 107 118 Q108 112 104 108" stroke="${shade(sk,-.35)}" stroke-width="2.2" fill="${shade(sk,-.08)}" stroke-linecap="round" opacity=".85"/>`
    :`<path d="M99 100 Q93 114 96 118 Q100 121 105 118" stroke="${shade(sk,-.35)}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".75"/><path d="M101 98 Q103 108 103 112" stroke="#fff" stroke-width="2" opacity=".35" stroke-linecap="round"/>`;
  return defs+hb+`<path d="M88 128 L112 128 L114 174 Q100 182 86 174Z" fill="${skd}"/><path d="M86 140 Q100 152 114 140 L114 160 Q100 168 86 160Z" fill="#000" opacity=".14"/>`+bodyGreek(C,u)+
    `<ellipse cx="63" cy="104" rx="8" ry="12" fill="${skd}"/><ellipse cx="137" cy="104" rx="8" ry="12" fill="${skd}"/><path d="M60 98 q4 6 0 12 M140 98 q-4 6 0 12" stroke="${shade(skd,-.3)}" stroke-width="2" fill="none" opacity=".5"/>`+accHTML(C,u,'ears')+
    `<path d="${hp}" fill="url(#${u}s)"/>`+
    `<g clip-path="url(#${u}hc)"><path d="M118 40 Q146 90 120 160 L160 160 L160 40Z" fill="${shade(sk,-.5)}" opacity=".18"/><rect x="40" y="40" width="130" height="130" fill="url(#${u}rim)"/>${C.age>1?`<path d="M80 74 q20 -5 40 0 M84 79 q16 -3 32 0" stroke="${skd}" stroke-width="1.1" fill="none" opacity=".55"/>`:''}${C.age?`<path d="M74 104 q4 3 8 2 M126 104 q-4 3 -8 2" stroke="${skd}" stroke-width="1" fill="none" opacity=".6"/>`:''}</g>`+
    `<ellipse cx="78" cy="114" rx="9" ry="5.5" fill="#e0786a" opacity="${mood==='happy'||mood==='wow'?.32:.16}"/><ellipse cx="122" cy="114" rx="9" ry="5.5" fill="#e0786a" opacity="${mood==='happy'||mood==='wow'?.32:.16}"/>`+
    (bigBeard?facialHTML(C,u):'')+eyesHTML(C,mood,u)+browsHTML(C,mood)+nose+mouthHTML(mood,C)+(bigBeard?'':facialHTML(C,u))+hf+accHTML(C,u,'head');}
function guardianPortrait(mood,u){const eye=mood==='angry'?'#ff5a3c':mood==='happy'?'#ffd27f':'#f2a541';
  return `<defs><linearGradient id="${u}g" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#6a5f72"/><stop offset="1" stop-color="#2f2836"/></linearGradient><radialGradient id="${u}e"><stop offset="0" stop-color="#fff6d8"/><stop offset=".5" stop-color="${eye}"/><stop offset="1" stop-color="${eye}" stop-opacity="0"/></radialGradient></defs>
  <path d="M20 240 L52 150 L148 150 L180 240Z" fill="url(#${u}g)" stroke="#8a7f92" stroke-width="2"/><path d="M100 18 L168 150 L32 150Z" fill="url(#${u}g)" stroke="#a89cb2" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M100 18 L120 60 M70 110 L60 150 M138 120 l10 18" stroke="#1f1a26" stroke-width="2" fill="none" opacity=".6"/>
  <circle cx="80" cy="104" r="16" fill="url(#${u}e)"/><circle cx="120" cy="104" r="16" fill="url(#${u}e)"/><circle cx="80" cy="104" r="5" fill="#fff6d8"/><circle cx="120" cy="104" r="5" fill="#fff6d8"/>
  ${mood==='angry'?'<path d="M64 90 L92 98 M136 90 L108 98" stroke="#1f1a26" stroke-width="5" stroke-linecap="round"/>':''}
  <path d="${mood==='happy'?'M84 132 Q100 142 116 132':'M84 134 H116'}" stroke="#1f1a26" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M86 178 V214 H122 Z M86 204 h10 v10" fill="none" stroke="${eye}" stroke-width="3" opacity=".85"/>`;}
let PUID=0;
function portrait(id,mood){mood=mood||'neutral';const u='pt'+(++PUID);let s='';const col=(CAST[id]||{}).col||'#ffd27f';
  if(id==='guardian')s=guardianPortrait(mood,u);else if(CHARS[id])s=greekHTML(id,mood,u);
  if(!s)return '';
  const halo=`<defs><radialGradient id="${u}h" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="${col}" stop-opacity=".32"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><ellipse cx="100" cy="140" rx="98" ry="104" fill="url(#${u}h)"/>`;
  return `<svg viewBox="0 0 200 240" class="portrait" aria-hidden="true">${halo}${s}</svg>`;}

/* =========================================================
   FONDOS DE ESCENA (1000 × 560)
   ========================================================= */
function sceneBG(id){const W=1000,H=560;const sr=seeded(id.length*131+7);const stars=n=>Array.from({length:n},()=>`<circle cx="${(sr()*W).toFixed(0)}" cy="${(sr()*H*.5).toFixed(0)}" r="${(sr()*1.3+.4).toFixed(1)}" fill="#fff" opacity="${(sr()*.6+.25).toFixed(2)}"/>`).join('');
  const col=(x,y,h,w)=>`<rect x="${x-w/2}" y="${y-h}" width="${w}" height="${h}" fill="#4a4157"/><rect x="${x-w/2}" y="${y-h}" width="${w*.28}" height="${h}" fill="#fff" opacity=".06"/>${[1,2,3].map(i=>`<line x1="${x-w/2+i*w/4}" y1="${y-h+8}" x2="${x-w/2+i*w/4}" y2="${y-6}" stroke="#2a2433" stroke-width="2" opacity=".6"/>`).join('')}<rect x="${x-w/2-8}" y="${y-h-14}" width="${w+16}" height="14" fill="#5a5068"/><rect x="${x-w/2-8}" y="${y-8}" width="${w+16}" height="10" fill="#5a5068"/>`;
  const torchG=(x,y)=>`<g transform="translate(${x} ${y})"><rect x="-4" y="0" width="8" height="60" fill="#6b4f36"/><path d="M-11 0h22l-5 8h-12z" fill="#373042"/><path class="flame" d="M0 0c-10-9-6-21 0-32c9 10 12 22 0 32z" fill="#f2a541"/><path class="flame f2" d="M0 -2c-4-4-3-10 0-15c4 5 4 11 0 15z" fill="#ffd27f"/><circle r="60" cy="-14" fill="#f2a541" opacity=".08"/></g>`;
  const floor=c=>`<rect x="0" y="420" width="${W}" height="140" fill="${c||'#1e1a27'}"/>${Array.from({length:11},(_,i)=>`<line x1="${i*100}" y1="420" x2="${i*100-120+i*24}" y2="560" stroke="#000" opacity=".2"/>`).join('')}<line x1="0" y1="470" x2="${W}" y2="470" stroke="#000" opacity=".15"/><line x1="0" y1="520" x2="${W}" y2="520" stroke="#000" opacity=".15"/>`;
  const B={
  samos:`<defs><linearGradient id="bgSa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1f3a"/><stop offset=".55" stop-color="#c86a4a"/><stop offset="1" stop-color="#f2a541"/></linearGradient><linearGradient id="bgSe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6f86"/><stop offset="1" stop-color="#15303e"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bgSa)"/>${stars(30)}<circle cx="720" cy="300" r="70" fill="#ffd27f" opacity=".9"/><circle cx="720" cy="300" r="120" fill="#ffd27f" opacity=".15"/>
    <path d="M0 330 Q140 280 300 300 T620 290 L620 340 L0 360Z" fill="#3a2a3a"/><rect x="0" y="330" width="${W}" height="230" fill="url(#bgSe)"/>${Array.from({length:14},(_,i)=>`<path d="M${(i*73)%W} ${360+i*13} q20 -6 40 0" stroke="#8fe3ec" stroke-width="2" fill="none" opacity=".3"/>`).join('')}
    <path d="M680 330 L720 318 L760 330" stroke="#ffd27f" stroke-width="3" opacity=".5" fill="none"/><path d="M560 330 q8-30 20 0 M592 330 l14 -60 l14 60" fill="#1e1a27"/>${col(160,330,150,34)}${col(260,330,150,34)}<path d="M120 166 L300 166 L210 120Z" fill="#5a5068"/>`,
  temple:`<rect width="${W}" height="${H}" fill="#15121c"/><rect x="0" y="0" width="${W}" height="420" fill="#1e1a27"/>${[90,250,750,910].map(x=>col(x,420,330,64)).join('')}<path d="M300 420 V200 a200 160 0 0 1 400 0 V420Z" fill="#0d0b12"/><ellipse cx="500" cy="380" rx="170" ry="60" fill="#f2a541" opacity=".12"/>${torchG(360,250)}${torchG(640,250)}${floor()}`,
  tiles:`<rect width="${W}" height="${H}" fill="#1a1622"/>${col(80,420,330,60)}${col(920,420,330,60)}<g transform="translate(500 300) scale(1.4)" opacity=".85"><path d="M-30 40 L50 40 L-30 -20Z" fill="#373042" stroke="#f2a541" stroke-width="2"/><rect x="-30" y="40" width="80" height="80" fill="#4cbccb" opacity=".35"/><rect x="-90" y="-20" width="60" height="60" fill="#f2a541" opacity=".35"/><path d="M-30 -20 L50 40 L110 -40 L30 -100Z" fill="#9cc472" opacity=".35"/></g>${floor('#221d2c')}${torchG(200,240)}${torchG(800,240)}`,
  nile:`<defs><linearGradient id="bgNi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c77a"/><stop offset=".6" stop-color="#e89a5a"/><stop offset="1" stop-color="#c8784a"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#bgNi)"/><circle cx="820" cy="140" r="54" fill="#fff4cf"/>
    <path d="M380 380 L520 160 L660 380Z" fill="#d9a35a"/><path d="M520 160 L660 380 L600 380Z" fill="#b8824a"/><path d="M640 380 L730 240 L820 380Z" fill="#d0985a"/><path d="M730 240 L820 380 L780 380Z" fill="#aa7444"/><path d="M180 380 L250 280 L320 380Z" fill="#d7a462"/>
    <rect x="0" y="380" width="${W}" height="180" fill="#c89a5a"/><path d="M0 450 Q250 420 500 450 T1000 440 L1000 500 Q750 520 500 490 T0 500Z" fill="#2f6f86"/><path d="M60 470 q20 -6 40 0 M300 480 q20 -6 40 0 M700 470 q20 -6 40 0" stroke="#8fe3ec" stroke-width="2" fill="none" opacity=".5"/>
    ${[80,140,900,950].map(x=>`<path d="M${x} 400 V330" stroke="#5a3a20" stroke-width="5"/><path d="M${x} 330 q-30 0 -40 18 M${x} 330 q30 0 40 18 M${x} 330 q-20 -16 -36 -10 M${x} 330 q20 -16 36 -10" stroke="#3a6a2a" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}`,
  well:`<rect width="${W}" height="${H}" fill="#0b0a10"/><ellipse cx="500" cy="60" rx="260" ry="70" fill="#1c2240"/>${Array.from({length:30},()=>`<circle cx="${(320+sr()*360).toFixed(0)}" cy="${(20+sr()*80).toFixed(0)}" r="${(sr()*1.4+.4).toFixed(1)}" fill="#fff" opacity="${(.4+sr()*.5).toFixed(2)}"/>`).join('')}
    <path d="M240 0 L280 560 M760 0 L720 560" stroke="#2a2433" stroke-width="40"/>${Array.from({length:12},(_,i)=>`<line x1="${250+i*1.5}" y1="${i*46}" x2="${750-i*1.5}" y2="${i*46}" stroke="#2a2433" stroke-width="2" opacity=".6"/>`).join('')}<ellipse cx="500" cy="520" rx="200" ry="40" fill="#4cbccb" opacity=".15"/>${torchG(310,300)}`,
  fountain:`<defs><radialGradient id="bgFo" cx=".5" cy=".7" r=".7"><stop offset="0" stop-color="#1f4a56"/><stop offset="1" stop-color="#0d1218"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#bgFo)"/>
    <path d="M0 0 Q200 120 140 300 Q100 420 0 440Z M1000 0 Q800 140 860 300 Q900 420 1000 440Z" fill="#141a20"/>${Array.from({length:9},(_,i)=>`<path d="M${120+i*95} 0 q8 ${30+(i%3)*20} 0 ${60+(i%4)*24}" stroke="#2a3a40" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}
    <ellipse cx="500" cy="440" rx="260" ry="50" fill="#2f6f86"/><ellipse cx="500" cy="430" rx="230" ry="38" fill="#4cbccb" opacity=".45"/><rect x="470" y="300" width="60" height="130" fill="#4a5a60"/><path d="M500 300 q-40 -50 -90 70 M500 300 q40 -50 90 70" stroke="#8fe3ec" stroke-width="4" fill="none" opacity=".6"/>
    <text x="500" y="390" text-anchor="middle" font-family="Marcellus SC,serif" font-size="46" fill="#8fe3ec" opacity=".8">√</text>${floor('#10171c')}`,
  library:`<rect width="${W}" height="${H}" fill="#1e1712"/>${[0,1,2,3].map(r=>Array.from({length:12},(_,i)=>`<g transform="translate(${40+i*80} ${60+r*92})"><rect width="70" height="80" fill="#2a1f16" stroke="#4a3a28"/>${[0,1,2,3,4].map(k=>`<circle cx="${12+k*12}" cy="${60-((i+k+r)%3)*16}" r="6" fill="${['#e8d6a8','#d9c08a','#c8a86a'][(i+k)%3]}" stroke="#7a5a34"/>`).join('')}</g>`).join('')).join('')}<rect x="0" y="420" width="${W}" height="140" fill="#2a2018"/><ellipse cx="500" cy="300" rx="380" ry="200" fill="#f2a541" opacity=".07"/>`,
  tribunal:`<rect width="${W}" height="${H}" fill="#15121c"/><path d="M0 120 L500 20 L1000 120Z" fill="#2a2433"/>${[100,260,420,580,740,900].map(x=>col(x,420,280,46)).join('')}<path d="M300 420 h400 v-40 h-400z M340 380 h320 v-40 h-320z" fill="#3a3344"/><g transform="translate(500 250)"><path d="M0 -60 V40 M-70 -40 H70" stroke="#f2a541" stroke-width="5"/><path d="M-70 -40 l-24 46 a24 10 0 0 0 48 0z M70 -40 l-24 46 a24 10 0 0 0 48 0z" fill="#f2a541" opacity=".7"/></g>${floor()}`,
  observatory:`<defs><radialGradient id="bgOb" cx=".5" cy=".2" r=".9"><stop offset="0" stop-color="#2a2a5a"/><stop offset="1" stop-color="#0a0a18"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#bgOb)"/>${stars(140)}
    <path d="M150 90 L330 60 L520 120 L700 80 L860 140" stroke="#b9a7ff" stroke-width="1.4" opacity=".55" fill="none"/>${[[150,90],[330,60],[520,120],[700,80],[860,140]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.5" fill="#fff"/>`).join('')}
    <circle cx="200" cy="200" r="40" fill="#e9e2d0"/><circle cx="214" cy="190" r="40" fill="url(#bgOb)"/>
    <g transform="translate(760 330)"><circle r="90" fill="none" stroke="#d9b45a" stroke-width="6"/><circle r="70" fill="none" stroke="#d9b45a" stroke-width="2"/><path d="M-90 0 H90 M0 -90 V90 M-64 -64 L64 64" stroke="#d9b45a" stroke-width="2"/><path d="M0 0 L60 -50" stroke="#ffd27f" stroke-width="5"/></g>
    <path d="M0 440 Q500 380 1000 440 V560 H0Z" fill="#15121c"/>`,
  crypt:`<rect width="${W}" height="${H}" fill="#120f18"/><g opacity=".5">${Array.from({length:21},(_,i)=>`<line x1="${i*50}" y1="300" x2="${500+(i*50-500)*3}" y2="560" stroke="#4cbccb" stroke-width="1"/>`).join('')}${[310,330,360,400,460,540].map(y=>`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#4cbccb" stroke-width="1"/>`).join('')}</g>
    <g transform="translate(500 180)"><path d="M-80 -30 L0 -70 L80 -30 L80 50 L0 90 L-80 50Z" fill="none" stroke="#ff8f7a" stroke-width="3"/><path d="M-80 -30 L0 10 L80 -30 M0 10 V90" stroke="#ff8f7a" stroke-width="2" fill="none"/><path d="M-80 50 L80 -30" stroke="#ffd27f" stroke-width="3" stroke-dasharray="6 5" fill="none"/></g>${torchG(160,250)}${torchG(840,250)}`,
  sealed:`<rect width="${W}" height="${H}" fill="#15121c"/>${Array.from({length:10},(_,i)=>`<line x1="0" y1="${i*56}" x2="${W}" y2="${i*56}" stroke="#2a2433" stroke-width="2"/>`).join('')}<path d="M320 560 V230 a180 160 0 0 1 360 0 V560Z" fill="#2a2433" stroke="#4a4157" stroke-width="8"/>${[400,466,534,600].map(x=>`<circle cx="${x}" cy="360" r="24" fill="#1e1a27" stroke="#f2a541" stroke-width="3"/>`).join('')}${torchG(230,260)}${torchG(770,260)}`,
  hall:`<rect width="${W}" height="${H}" fill="#120e16"/><ellipse cx="500" cy="300" rx="420" ry="260" fill="#e66a50" opacity=".08"/>${[80,220,780,920].map(x=>col(x,440,380,56)).join('')}<path d="M500 60 L640 300 L360 300Z" fill="#2f2836" stroke="#6a5f72" stroke-width="4"/><circle cx="460" cy="230" r="10" fill="#f2a541"/><circle cx="540" cy="230" r="10" fill="#f2a541"/>${floor('#1a1520')}`,
  alexandria:`<defs><linearGradient id="bgAl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2a4a"/><stop offset=".6" stop-color="#6a4a7a"/><stop offset="1" stop-color="#e88a6a"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#bgAl)"/>${stars(50)}
    <rect x="760" y="140" width="60" height="260" fill="#d9cfb6"/><rect x="750" y="120" width="80" height="24" fill="#cfc4a8"/><path d="M770 120 L790 70 L810 120Z" fill="#cfc4a8"/><circle cx="790" cy="62" r="18" fill="#ffd27f"/><circle cx="790" cy="62" r="60" fill="#ffd27f" opacity=".15"/>
    ${[120,200,280,360].map(x=>col(x,400,200,30)).join('')}<path d="M90 200 L390 200 L240 150Z" fill="#5a5068"/><rect x="0" y="400" width="${W}" height="160" fill="#2f6f86"/>${Array.from({length:10},(_,i)=>`<path d="M${(i*97)%W} ${430+i*11} q20 -6 40 0" stroke="#8fe3ec" stroke-width="2" fill="none" opacity=".35"/>`).join('')}`,
  };
  return `<svg class="scene" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${B[id]||B.temple}</svg>`;}
