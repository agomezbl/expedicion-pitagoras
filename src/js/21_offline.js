/* =========================================================
   APP INSTALABLE: service worker y voces para jugar sin internet
   ========================================================= */
const OFF={cache:'pita-audio',flag:'pita-offline-ok',busy:false,done:0,total:0};
const standalone=()=>{try{return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;}catch(e){return false;}};
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){try{navigator.serviceWorker.register('sw.js').catch(()=>{});}catch(e){}}
async function offList(){const r=await fetch('audio/manifest.json',{cache:'no-cache'});const j=await r.json();return ['fr','es'].flatMap(l=>(j[l]||[]).map(k=>new URL(`audio/${l}/${k}.mp3`,location.href).href));}
async function offStatus(){if(!('caches' in window)||!/^https?:$/.test(location.protocol))return null;try{const urls=await offList(),c=await caches.open(OFF.cache),have=new Set((await c.keys()).map(r=>r.url));return {have:urls.filter(u=>have.has(u)).length,total:urls.length};}catch(e){return null;}}
async function offDownload(onProg){if(OFF.busy)return;OFF.busy=true;try{const urls=await offList(),c=await caches.open(OFF.cache),have=new Set((await c.keys()).map(r=>r.url));const todo=urls.filter(u=>!have.has(u));OFF.total=urls.length;OFF.done=urls.length-todo.length;onProg&&onProg();
  let i=0;const worker=async()=>{while(i<todo.length){const u=todo[i++];try{const r=await fetch(u);if(r.ok&&r.status===200)await c.put(u,r);}catch(e){}OFF.done++;onProg&&onProg();}};
  await Promise.all([worker(),worker(),worker(),worker(),worker()]);try{localStorage.setItem(OFF.flag,'1');}catch(e){}}finally{OFF.busy=false;onProg&&onProg();}}
function offPaint(){const b=$('#offBox');if(!b)return;
  if(!/^https?:$/.test(location.protocol)||!('caches' in window)){b.innerHTML=`<p class="small">${t('Disponible quand le jeu est ouvert depuis son site ou installé comme app.','Disponible cuando el juego se abre desde su web o instalado como app.')}</p>`;return;}
  if(OFF.busy){const pc=OFF.total?Math.round(OFF.done/OFF.total*100):0;b.innerHTML=`<p class="small">${t('Téléchargement des voix…','Descargando las voces…')} ${pc} %</p><div class="bar ok"><i style="width:${pc}%"></i></div>`;return;}
  offStatus().then(s=>{if(!b.isConnected)return;if(!s){b.innerHTML='';return;}const full=s.have>=s.total;
    b.innerHTML=full?`<p class="mk-ok">${t('Prêt : tout le jeu, voix comprises, marche sans internet.','Listo: todo el juego, voces incluidas, funciona sin internet.')}</p>`
      :`<p class="small">${t(`Voix enregistrées sur cet appareil : ${s.have} sur ${s.total}. Télécharge-les une fois (environ 20 Mo, mieux en wifi) pour jouer sans internet.`,`Voces guardadas en este aparato: ${s.have} de ${s.total}. Descárgalas una vez (unos 20 MB, mejor con wifi) para jugar sin internet.`)}</p><button class="btn" data-act="offGet">${ico('save')} ${t('Préparer pour jouer sans internet','Preparar para jugar sin internet')}</button>`;});}
ACT.offGet=()=>{sfx('click');offDownload(offPaint);offPaint();};
/* instalada como app y sin ahorro de datos: las voces se descargan solas la primera vez */
setTimeout(()=>{let ok=false;try{ok=localStorage.getItem(OFF.flag)==='1';}catch(e){}const cn=navigator.connection||{};if(standalone()&&!ok&&!cn.saveData&&cn.type!=='cellular'&&/^https:$/.test(location.protocol))offDownload(()=>{if($('#offBox'))offPaint();});},4000);
