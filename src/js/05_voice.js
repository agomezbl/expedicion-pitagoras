/* =========================================================
   NARRADOR: voces grabadas (Kokoro, una por personaje y por idioma) y,
   si falta la grabación, la voz sintetizada del aparato.
   ========================================================= */
const SP={ok:'speechSynthesis' in window,voices:[],v:null,man:null,aud:null};
function loadVoices(){if(!SP.ok)return;try{const all=speechSynthesis.getVoices(),re=L==='fr'?/^fr([-_]|$)/i:/^es([-_]|$)/i,reg=L==='fr'?/fr[-_]FR/i:/es[-_]ES/i;
  SP.voices=all.filter(v=>re.test(v.lang));
  const sc=v=>(/natural|neural|online|premium|enhanced/i.test(v.name)?10:0)+(reg.test(v.lang)?4:0)+(/google/i.test(v.name)?2:0)+(/microsoft/i.test(v.name)?1:0);
  SP.v=SP.voices.find(v=>v.name===S.voice.name)||SP.voices.slice().sort((a,b)=>sc(b)-sc(a))[0]||null;}catch(e){}}
if(SP.ok){loadVoices();try{speechSynthesis.onvoiceschanged=()=>{loadVoices();if(!$('#modal').hidden&&$('#setVoice'))openSettings();};}catch(e){}}
/* grabaciones: solo cuando el juego se sirve por http(s) (GitHub Pages); en un archivo suelto se usa la voz del aparato */
function loadRec(){if(!/^https?:$/.test(location.protocol))return;try{fetch('audio/manifest.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(j=>{if(j&&j.fr)SP.man={fr:new Set(j.fr),es:new Set(j.es||[])};}).catch(()=>{});}catch(e){}}
const recOn=()=>S.voice.src!=='device'&&!!SP.man;
function voKey(text,who,l){const s=(l||L)+'|'+(who||'nar')+'|'+String(text).trim();let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h.toString(16).padStart(8,'0');}
function speakable(text,l){
  l=l||L;let s=plain(text).replace(/[«»“”]/g,'').replace(/\u0302/g,'').replace(/\[([A-Z]{2})\]/g,'$1');
  s=s.replace(/(\d)[.\u00a0\u202f ](\d{3})\b/g,'$1$2').replace(/π/g,l==='fr'?'pi':'pi').replace(/ \+ /g,l==='fr'?' plus ':' más ').replace(/(\d)\/(\d)/g,l==='fr'?'$1 sur $2':'$1 entre $2').replace(/√(?=\s|[.,;:)]|$)/g,l==='fr'?'racine':'raíz').replace(/(\d),(\d{4,})/g,(m,a,b)=>a+','+b.split('').join(' '));
  if(l==='fr')s=s.replace(/\bav\. J\.-C\./g,'avant Jésus-Christ').replace(/\bXVIIe/g,'dix-septième').replace(/\bVIe/g,'sixième').replace(/\bVe\b/g,'cinquième').replace(/\bIVe\b/g,'quatrième').replace(/\bvers (\d)/g,'vers $1');
  else s=s.replace(/\ba\.C\./g,'antes de Cristo').replace(/\bd\.C\./g,'después de Cristo').replace(/\bsiglo XVII\b/gi,'siglo diecisiete').replace(/\bSiglo VI\b/g,'Siglo sexto').replace(/\bsiglo V\b/gi,'siglo quinto').replace(/\bSiglo IV\b/g,'Siglo cuarto').replace(/\bc\. (\d)/g,'hacia el $1');
  if(l==='fr'){
    s=s.replace(/km\/h/g,'kilomètres par heure').replace(/(\d),(\d)/g,'$1 virgule $2').replace(/cos ?⁻¹/g,'cosinus inverse de').replace(/\bcos\b/g,'cosinus').replace(/(\d) ?°/g,'$1 degrés')
     .replace(/([A-Za-z)\d])³/g,'$1 au cube').replace(/([A-Za-z)\d])²/g,'$1 au carré').replace(/√/g,' racine de ').replace(/×/g,' fois ').replace(/÷/g,' divisé par ').replace(/−/g,' moins ').replace(/ = /g,' égale ').replace(/≈/g,' environ ').replace(/≠/g,' différent de ').replace(/·/g,', ')
     .replace(/\b(\d+) cm(?![\p{L}])/gu,'$1 centimètres').replace(/\b(\d+) m(?![\p{L}])/gu,'$1 mètres').replace(/\b(\d+) km(?![\p{L}])/gu,'$1 kilomètres');
  }else{
    s=s.replace(/km\/h/g,'kilómetros por hora').replace(/(\d),(\d)/g,'$1 coma $2').replace(/cos ?⁻¹/g,'arco coseno de').replace(/\bcos\b/g,'coseno').replace(/(\d) ?°/g,'$1 grados')
     .replace(/([A-Za-z)\d])³/g,'$1 al cubo').replace(/([A-Za-z)\d])²/g,'$1 al cuadrado').replace(/√/g,' raíz de ').replace(/×/g,' por ').replace(/÷/g,' entre ').replace(/−/g,' menos ').replace(/ = /g,' igual a ').replace(/≈/g,' aproximadamente ').replace(/≠/g,' distinto de ').replace(/·/g,', ')
     .replace(/\b(\d+) cm(?![\p{L}])/gu,'$1 centímetros').replace(/\b(\d+) m(?![\p{L}])/gu,'$1 metros').replace(/\b(\d+) km(?![\p{L}])/gu,'$1 kilómetros');
  }
  return s.replace(/\s+/g,' ').trim();
}
function stopAudio(){if(SP.aud){try{SP.aud.pause();}catch(e){}SP.aud=null;}}
function playRec(url){return new Promise(res=>{stopAudio();let done=false;const fin=()=>{if(!done){done=true;duck(false);res();}};
  try{const a=new Audio(url);SP.aud=a;a.volume=1;a.onplay=()=>duck(true);a.onended=fin;a.onerror=fin;a.play().catch(fin);}catch(e){fin();}});}
/* kind: 'narr' (historia y reacciones), 'read' (leer preguntas), 'manual'/'test' (el jugador lo ha pedido) */
function say(text,kind='narr',opts={}){
  if(!text)return Promise.resolve();
  if(kind!=='manual'&&kind!=='test'&&!S.voice.on)return Promise.resolve();
  if(kind==='read'&&!S.voice.auto)return Promise.resolve();
  const who=opts.who||'nar',p=plain(text);
  if(recOn()&&kind!=='test'){const k=voKey(p,who);if(SP.man[L]&&SP.man[L].has(k)){try{speechSynthesis.cancel();}catch(e){}return playRec('audio/'+L+'/'+k+'.mp3');}}
  if(!SP.ok)return Promise.resolve();
  stopAudio();
  return new Promise(res=>{let done=false;const fin=()=>{if(!done){done=true;res();}};
    try{speechSynthesis.cancel();const sp=speakable(p);const u=new SpeechSynthesisUtterance(sp);if(SP.v){u.voice=SP.v;u.lang=SP.v.lang;}else u.lang=L==='fr'?'fr-FR':'es-ES';
      u.rate=S.voice.rate*(opts.rate||1);u.pitch=opts.pitch||1;u.onstart=()=>duck(true);
      u.onend=u.onerror=()=>{setTimeout(()=>{try{if(!speechSynthesis.speaking)duck(false);}catch(e){duck(false);}},120);fin();};
      setTimeout(fin,sp.length*95+1800);speechSynthesis.speak(u);}catch(e){fin();}});
}
const speaking=()=>{if(SP.aud&&!SP.aud.paused&&!SP.aud.ended)return true;try{return SP.ok&&speechSynthesis.speaking;}catch(e){return false;}};
function hush(){stopAudio();try{if(SP.ok)speechSynthesis.cancel();}catch(e){}duck(false);}
/* frases de reacción (se graban todas) */
const LINES={
  ok:[tf('Exact !','¡Exacto!'),tf('Bien vu !','¡Bien visto!'),tf('Correct. Le temple te reconnaît.','Correcto. El templo te reconoce.'),tf("C'est ça !",'¡Eso es!'),tf('Parfait, explorateur.','Perfecto, explorador.'),tf('Très bien !','¡Muy bien!'),tf('La pierre cède. Correct.','La piedra cede. Correcto.'),tf('Impeccable.','Impecable.')],
  fast:[tf('Ultra rapide !','¡Rapidísimo!'),tf('Quelle vitesse !','¡Qué velocidad!'),tf("Tu n'as même pas hésité.",'Ni lo has dudado.')],
  trap:[tf("Tu n'es pas tombé dans le piège. Bien lu !",'No has caído en la trampa. ¡Bien leído!'),tf("Piège évité. C'est comme ça qu'on lit un parchemin.",'Trampa evitada. Así se lee un pergamino.')],
  bad:{lectura:[tf('Attention. Relis ce que l’on te demande.','Cuidado. Vuelve a leer qué te piden.'),tf('Piège de lecture. Regarde bien la dernière phrase.','Trampa de lectura. Mira bien la última frase.')],raiz:[tf('Presque. Il manquait la racine carrée.','Casi. Te faltó la raíz cuadrada.')],suma:[tf('Rappelle-toi : on additionne les carrés, pas les côtés.','Recuerda: se suman los cuadrados, no los lados.')],unidades:[tf('Attention aux unités.','Ojo con las unidades.')],calculo:[tf('Vérifie les calculs. La méthode était bonne.','Revisa las cuentas. El camino era bueno.')],tiempo:[tf('Le temps est écoulé.','Se acabó el tiempo.')],
    reciproco:[tf('Attention : on compare toujours avec le plus grand côté.','Cuidado: siempre se compara con el lado mayor.')],coseno:[tf("Repère bien le côté adjacent et l'hypoténuse.",'Localiza bien el cateto contiguo y la hipotenusa.')],raices:[tf("La racine d'une somme n'est pas la somme des racines.",'La raíz de una suma no es la suma de las raíces.')],pasos:[tf('Il fallait deux étapes : d’abord une face, puis la diagonale.','Hacían falta dos pasos: primero una cara y después la diagonal.')]},
  rush:[tf('Et calmement : lire tranquillement, ça compte aussi.','Y tranquilo: leer con calma también cuenta.')],
  combo:{5:tf('Série de feu !','¡Racha de fuego!'),8:tf('Flamme éternelle !','¡Llama eterna!')},
  bossHit:[tf('Touché !','¡Golpe!'),tf('Le Gardien vacille.','El Guardián se tambalea.')],bossCrit:[tf('Coup critique !','¡Golpe crítico!')],bossHurt:[tf('Le Gardien te touche.','El Guardián te alcanza.')],
  proof:[tf('Démonstration impeccable.','Demostración impecable.'),tf('Euclide serait fier de toi.','Euclides estaría orgulloso.')],
};
const sayL=(o,kind,opts)=>say(T(o),kind,opts);
