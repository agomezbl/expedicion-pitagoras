/* =========================================================
   RELIQUIAS, RANGOS, DIFICULTAD
   ========================================================= */
const RELICS=[
  {id:'cuerda',name:tf('Première Corde','Primera Cuerda'),how:tf('Tends ton premier pont.','Tiende tu primer puente.'),d:'M3 9c4-4 6 4 9 0s5-4 9 0M3 15c4-4 6 4 9 0s5-4 9 0'},
  {id:'sello',name:tf('Sceau de Pythagore','Sello de Pitágoras'),how:tf('Réussis la Salle des Carrés.','Supera la Cámara de los Cuadrados.'),d:'M5 4v16h15zM5 16h4v4'},
  {id:'halcon',name:tf('Œil de faucon','Ojo de Halcón'),how:tf('Repère bien les données du premier coup 5 fois.','Marca bien los datos a la primera 5 veces.'),d:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z'},
  {id:'racha',name:tf('Flamme éternelle','Llama Eterna'),how:tf('Fais une série ×8 sur les Ponts.','Consigue una racha ×8 en los Puentes.'),d:P.flame},
  {id:'pozo',name:tf('Fond du Puits','Fondo del Pozo'),how:tf("Réussis le Puits sans perdre d'amulette.",'Supera el Pozo sin perder ningún amuleto.'),d:'M4 6h16M6 6v11a6 3 0 0 0 12 0V6M9 10h6M9 14h6'},
  {id:'raiz',name:tf("Goutte d'Hippase",'Gota de Hipaso'),how:tf('Réussis la Fontaine des Racines.','Supera la Fuente de las Raíces.'),d:'M12 3c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12zM9 15h2l1 2 2-5h2'},
  {id:'escriba',name:tf('Grand Scribe','Escriba Mayor'),how:tf('Trois étoiles aux Parchemins.','Tres estrellas en los Pergaminos.'),d:'M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M9 8h7M9 12h7M9 16h4'},
  {id:'juez',name:tf('Balance du Tribunal','Balanza del Tribunal'),how:tf('Réussis le Tribunal des Triangles.','Supera el Tribunal de los Triángulos.'),d:EMB.c8},
  {id:'redactor',name:tf("Plume d'Euclide",'Pluma de Euclides'),how:tf('Rédige 5 démonstrations sans aucune erreur.','Redacta 5 demostraciones sin ningún error.'),d:'M20 4C12 4 6 10 5 19M20 4c0 7-5 12-12 12M9 15l-4 6'},
  {id:'astrolabio',name:tf("Astrolabe d'Hipparque",'Astrolabio de Hiparco'),how:tf("Réussis l'Observatoire du Cosinus.",'Supera el Observatorio del Coseno.'),d:'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 3v18M5 9l14 6M12 12l5-7'},
  {id:'cubo',name:tf('Cube de Descartes','Cubo de Descartes'),how:tf('Réussis la Crypte des Distances.','Supera la Cripta de las Distancias.'),d:EMB.c10},
  {id:'llave',name:tf('Clé runique','Llave Rúnica'),how:tf('Échappe-toi de la Salle scellée.','Escapa de la Cámara Sellada.'),d:'M8 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM12 12h9M18 12v3M21 12v2'},
  {id:'guardian',name:tf('Couronne du Gardien','Corona del Guardián'),how:tf('Bats le Gardien du Théorème.','Vence al Guardián del Teorema.'),d:'M3 18h18L19 7l-4 5-3-7-3 7-4-5z'},
  {id:'leyenda',name:tf('Légende du Temple','Leyenda del Templo'),how:tf('Bats le Gardien en difficulté Légende.','Vence al Guardián en dificultad Leyenda.'),d:'M12 2l3 6 6 1-4.5 4.5 1 6.5L12 17l-5.5 3 1-6.5L3 9l6-1z M12 7v6'},
  {id:'medidor',name:tf("Bâton de l'arpenteur",'Vara del Medidor'),how:tf('Termine 3 expéditions réelles.','Completa 3 expediciones reales.'),d:P.ruler},
  {id:'sol',name:tf('Soleil constant','Sol Constante'),how:tf('Fais le défi du jour 3 jours de suite.','Haz el desafío del día 3 días seguidos.'),d:P.sun},
  {id:'cartografo',name:tf('Cartographe','Cartógrafo'),how:tf('Obtiens au moins une étoile dans les dix salles.','Consigue al menos una estrella en las diez cámaras.'),d:'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14'},
  {id:'historiador',name:tf('Historien','Historiador'),how:tf('Réponds bien à la question de tous les sages du Codex.','Responde bien la pregunta de todos los sabios del Códice.'),d:'M4 5c3-1 6-1 8 1c2-2 5-2 8-1v14c-3-1-6-1-8 1c-2-2-5-2-8-1zM12 6v14'},
  {id:'filosofo',name:tf('Ami de la sagesse','Amigo de la Sabiduría'),how:tf('Réponds à tous les dilemmes des sages.','Responde a todos los dilemas de los sabios.'),d:P.owl},
  {id:'sabio',name:tf('Esprit serein','Mente Serena'),how:tf("Réussis 10 défis d'affilée.",'Acierta 10 retos seguidos.'),d:P.star},
  {id:'superviviente',name:tf('Survivant','Superviviente'),how:tf('Tiens 15 défis en Survie.','Aguanta 15 retos en Supervivencia.'),d:P.pulse},
  {id:'sobresaliente',name:tf('Mention du Temple','Matrícula del Templo'),how:tf('Obtiens 18/20 ou plus en mode contrôle.','Saca un 9 o más en el modo examen.'),d:P.exam},
  {id:'constante',name:tf('Constance','Constancia'),how:tf("Réussis 25 défis dans une séance d'entraînement.",'Acierta 25 retos en una sesión de entrenamiento.'),d:P.target},
];
const relicSVG=r=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${r.d}"/></svg>`;
const RANKS=[[0,tf('Apprenti des sables','Aprendiz de la Arena')],[120,tf('Porteur de torche','Portador de Antorcha')],[300,tf('Lecteur de parchemins','Lector de Pergaminos')],[550,tf('Cartographe du Temple','Cartógrafo del Templo')],[900,tf('Arpenteur royal','Agrimensor Real')],[1350,tf('Architecte du Temple','Arquitecto del Templo')],[2000,tf('Maître pythagoricien','Maestro Pitagórico')],[2800,tf("Disciple d'Euclide",'Discípulo de Euclides')],[3800,tf("Astronome d'Alexandrie",'Astrónomo de Alejandría')],[5000,tf('Légende vivante','Leyenda Viva')]];
const rankOf=xp=>{let i=0;RANKS.forEach((r,k)=>{if(xp>=r[0])i=k;});return i;};
const rankName=i=>T(RANKS[i][1]);
const DIFF={
  aprendiz:{name:tf('Apprenti','Aprendiz'),desc:tf('Petits nombres exacts, plus de temps et 4 amulettes.','Números pequeños y exactos, más tiempo y 4 amuletos.'),lives:4,arcade:120,escape:360,hp:8,hearts:4,xp:1,survLives:2,survTime:0,crit:20},
  explorador:{name:tf('Explorateur','Explorador'),desc:tf('Équilibré. Le conseillé pour commencer.','Equilibrado. El recomendado para empezar.'),lives:3,arcade:90,escape:300,hp:10,hearts:3,xp:1.2,survLives:1,survTime:45,crit:15},
  leyenda:{name:tf('Légende','Leyenda'),desc:tf('Grands nombres, décimaux avec l’abaque et moins de temps. XP ×1,5.','Números grandes, decimales con ábaco y menos tiempo. XP ×1,5.'),lives:2,arcade:75,escape:240,hp:12,hearts:3,xp:1.5,survLives:1,survTime:30,crit:12},
};

/* =========================================================
   ESTADO GUARDADO
   ========================================================= */
const KEY='expedicion-pitagoras-v1';
const VERSION='2.1';
const ERRKEYS=['lectura','raiz','suma','unidades','calculo','reciproco','coseno','raices','pasos'];
const fresh=()=>({v:VERSION,xp:0,torches:5,stars:{},relics:{},free:false,traps:0,runStreak:0,bestRun:0,diff:'explorador',lang:null,
  audio:{music:.5,sfx:.8,muted:false},voice:{on:true,auto:true,name:'',rate:1,src:'rec'},
  stats:{answered:0,correct:0,time:0,rush:0,markFirst:0,markTotal:0,err:Object.fromEntries(ERRKEYS.map(k=>[k,0])),topic:{}},
  daily:{last:null,streak:0,done:{}},exp:{},duel:{p1:'Nil',p2:'Papá',w1:0,w2:0,hc:false},labTriples:[],
  records:{survival:{aprendiz:0,explorador:0,leyenda:0},examBest:0,examLast:null,train:0},trainTopics:['hyp','cat'],revealed:null,prologue:false,sages:{},
  seen:{},dil:{},proofs:{done:0,perfect:0},updated:0});
function merge(a,b){for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==='object'&&!Array.isArray(a[k]))merge(a[k],b[k]);else a[k]=b[k];}return a;}
function load(){try{const raw=localStorage.getItem(KEY);if(raw)return merge(fresh(),JSON.parse(raw));}catch(e){}return fresh();}
let S=load();
function save(){S.updated=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
addEventListener('pagehide',()=>save());
const DF=()=>DIFF[S.diff]||DIFF.explorador;
const dfName=()=>T(DF().name);
/* idioma inicial: el guardado, o el del navegador (francés si el aparato está en francés) */
function initLang(){if(S.lang!=='fr'&&S.lang!=='es'){let n='';try{n=(navigator.languages&&navigator.languages[0])||navigator.language||'';}catch(e){}S.lang=/^fr/i.test(n)?'fr':'es';}L=S.lang;document.documentElement.lang=L;}
initLang();

/* ---------- copia de seguridad: un código de texto para llevar el progreso a otro aparato ---------- */
const B64=u8=>{let s='';u8.forEach(b=>s+=String.fromCharCode(b));return btoa(s);};
const UNB64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function zip(str,inflate){const CS=inflate?window.DecompressionStream:window.CompressionStream;if(!CS)return null;
  const st=new Blob([str]).stream().pipeThrough(new CS('deflate-raw'));return new Uint8Array(await new Response(st).arrayBuffer());}
async function saveCode(){const json=JSON.stringify(S);let body,tag;try{const z=await zip(new TextEncoder().encode(json));if(z){body=B64(z);tag='Z';}}catch(e){}
  if(!body){body=B64(new TextEncoder().encode(json));tag='P';}
  let sum=0;for(const ch of body)sum=(sum*31+ch.charCodeAt(0))>>>0;return `PITA1${tag}-${(sum%46656).toString(36).padStart(3,'0')}-${body}`;}
async function readCode(code){const m=String(code).trim().replace(/\s+/g,'').match(/^PITA1([ZP])-([0-9a-z]{3})-([A-Za-z0-9+/=]+)$/);if(!m)throw new Error('format');
  let sum=0;for(const ch of m[3])sum=(sum*31+ch.charCodeAt(0))>>>0;if((sum%46656).toString(36).padStart(3,'0')!==m[2])throw new Error('sum');
  const raw=UNB64(m[3]);const bytes=m[1]==='Z'?await zip(raw,true):raw;if(!bytes)throw new Error('zip');const o=JSON.parse(new TextDecoder().decode(bytes));
  if(!o||typeof o!=='object'||typeof o.xp!=='number'||!o.stars)throw new Error('data');return o;}
