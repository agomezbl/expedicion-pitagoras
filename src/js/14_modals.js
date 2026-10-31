/* =========================================================
   MODALES: RELIQUIAS, AJUSTES, COPIA DE SEGURIDAD, PANEL DEL GUÍA
   ========================================================= */
const XBTN=()=>`<button class="btn tiny ghost modal-x" data-act="closeModal" aria-label="${t('Fermer','Cerrar')}">×</button>`;
function showModal(html){$('#modal').classList.remove('closing');$('#modalCard').innerHTML=XBTN()+html;$('#modal').hidden=false;}
function closeModal(anim){const m=$('#modal');if(!m||m.hidden)return;resetArmed=false;if(anim&&!reduced()){m.classList.add('closing');setTimeout(()=>{m.hidden=true;m.classList.remove('closing');},220);}else m.hidden=true;}
function openRelics(){sfx('click');showModal(`<p class="eyebrow">${relicCount()} ${t('sur','de')} ${RELICS.length}</p><h2>${t('Vitrine des reliques','Vitrina de reliquias')}</h2><div class="relics">${RELICS.map(r=>`<div class="relic${S.relics[r.id]?'':' off'}">${relicSVG(r)}<b>${esc(T(r.name))}</b><span>${T(r.how)}</span></div>`).join('')}</div>`);}
function settingsHTML(){
  const v=SP.voices;
  return `<p class="eyebrow">${t('Réglages','Ajustes')}</p><h2>${t('Langue, difficulté et son','Idioma, dificultad y sonido')}</h2>
  <h3>${t('Langue','Idioma')}</h3>${langSwitch()}<p class="small otherlang">${t('Le français utilise le vocabulaire du collège (hypoténuse, réciproque, contraposée…). L’espagnol, celui de l’ESO (catetos, recíproco…).','El francés usa el vocabulario del collège (hypoténuse, réciproque…). El español, el de la ESO (catetos, recíproco, contrarrecíproco…).')}</p>
  <h3>${t('Difficulté','Dificultad')}</h3><div class="diffs">${Object.entries(DIFF).map(([k,d])=>`<button class="diff${S.diff===k?' on':''}" data-act="diff" data-v="${k}" aria-pressed="${S.diff===k}"><b>${T(d.name)}</b><span>${T(d.desc)}</span></button>`).join('')}</div>
  <p class="small">${t('Les étoiles et les reliques sont conservées quand tu changes de difficulté. Le record de Survie est gardé pour chacune.','Las estrellas y reliquias se conservan al cambiar de dificultad. El récord de Supervivencia se guarda aparte para cada una.')}</p>
  <h3>${t('Musique et effets','Música y efectos')}</h3>
  <div class="fgrid"><div class="field"><label for="setMusic">${t('Musique','Música')} : <span id="musOut">${Math.round(S.audio.music*100)} %</span></label><input type="range" id="setMusic" min="0" max="1" step=".05" value="${S.audio.music}"></div>
  <div class="field"><label for="setSfx">${t('Effets','Efectos')} : <span id="sfxOut">${Math.round(S.audio.sfx*100)} %</span></label><input type="range" id="setSfx" min="0" max="1" step=".05" value="${S.audio.sfx}"></div></div>
  <label class="check" for="setMute"><input type="checkbox" id="setMute" ${S.audio.muted?'checked':''}> ${t('Tout couper','Silenciar todo')}</label>
  <h3>${t('Voix','Voces')}</h3>
  <label class="check" for="setVoiceOn"><input type="checkbox" id="setVoiceOn" ${S.voice.on?'checked':''}> ${t('Les personnages parlent et le narrateur réagit aux réponses','Los personajes hablan y el narrador reacciona a las respuestas')}</label>
  <label class="check" for="setAuto"><input type="checkbox" id="setAuto" ${S.voice.auto?'checked':''}> ${t('Lire chaque question à voix haute (sauf contre-la-montre et Survie)','Leer en voz alta cada pregunta (menos en contrarreloj y Supervivencia)')}</label>
  <div class="seg" role="group" aria-label="${t('Type de voix','Tipo de voz')}"><button class="btn tiny${S.voice.src!=='device'?' on':''}" data-act="voiceSrc" data-v="rec">${t('Voix enregistrées (une par personnage)','Voces grabadas (una por personaje)')}</button><button class="btn tiny${S.voice.src==='device'?' on':''}" data-act="voiceSrc" data-v="device">${t('Voix de l’appareil','Voz del aparato')}</button></div>
  <p class="small">${SP.man?t('Les voix enregistrées sont disponibles. Les questions avec des nombres sont lues par la voix de l’appareil.','Las voces grabadas están disponibles. Las preguntas con números las lee la voz del aparato.'):t('Les voix enregistrées s’activent quand le jeu est ouvert depuis son site (GitHub). Ici, on utilise la voix de l’appareil.','Las voces grabadas se activan cuando el juego se abre desde su web (GitHub). Aquí se usa la voz del aparato.')}</p>
  ${SP.ok?`<div class="fgrid"><div class="field"><label for="setVoice">${t('Voix de l’appareil','Voz del aparato')}</label>${v.length?`<select id="setVoice">${v.map(x=>`<option value="${esc(x.name)}" ${SP.v&&SP.v.name===x.name?'selected':''}>${esc(x.name)} (${esc(x.lang)})</option>`).join('')}</select>`:`<p class="small">${t('Cet appareil n’a pas de voix françaises installées. Sous Windows : Paramètres → Heure et langue → Voix → Ajouter des voix.','Este ordenador no tiene voces en español instaladas. En Windows: Configuración → Hora e idioma → Voz → Agregar voces → Español (España). Microsoft Edge trae voces naturales muy buenas.')}</p>`}</div>
  <div class="field"><label for="setRate">${t('Vitesse','Velocidad')} : <span id="rateOut">${fmt(S.voice.rate)}×</span></label><input type="range" id="setRate" min=".7" max="1.3" step=".05" value="${S.voice.rate}"></div></div>`:''}
  <div class="row" style="justify-content:flex-start"><button class="btn" data-act="testVoice">${ico('voice')} ${t('Essayer la voix','Probar la voz')}</button>${SP.man?`<button class="btn" data-act="testVoiceRec">${ico('voice')} ${t('Écouter Théano','Escuchar a Teano')}</button>`:''}</div>
  <h3>${t('Jouer sans internet','Jugar sin internet')}</h3><div id="offBox"></div>
  <h3>${t('Copie de sauvegarde','Copia de seguridad')}</h3>
  <p class="small">${t('Ta progression est gardée dans ce navigateur. Pour la passer sur un autre appareil, copie ton code et colle-le là-bas.','Tu progreso se guarda en este navegador. Para pasarlo a otro aparato, copia tu código y pégalo allí.')}</p>
  <div class="row" style="justify-content:flex-start"><button class="btn" data-act="codeMake">${ico('save')} ${t('Créer mon code','Crear mi código')}</button><button class="btn" data-act="codeLoad">${t('Coller un code','Pegar un código')}</button></div>
  <div id="codeBox"></div>`;
}
function openSettings(){showModal(settingsHTML());offPaint();}
async function codeMake(){const box=$('#codeBox');if(!box)return;const c=await saveCode();box.innerHTML=`<textarea id="codeOut" class="codeta" readonly rows="4">${esc(c)}</textarea><div class="row" style="justify-content:flex-start"><button class="btn primary" data-act="codeCopy">${t('Copier','Copiar')}</button><span class="small">${t('Garde-le dans un message ou une note.','Guárdalo en un mensaje o una nota.')}</span></div>`;}
function codeCopy(){const ta=$('#codeOut');if(!ta)return;ta.select();let ok=false;try{navigator.clipboard.writeText(ta.value).then(()=>toast(`<span>${t('Code copié.','Código copiado.')}</span>`,1800)).catch(()=>{});ok=true;}catch(e){}if(!ok){try{document.execCommand('copy');toast(`<span>${t('Code copié.','Código copiado.')}</span>`,1800);}catch(e){}}}
function codeLoad(){const box=$('#codeBox');if(!box)return;box.innerHTML=`<textarea id="codeIn" class="codeta" rows="4" placeholder="PITA1Z-…"></textarea><div class="row" style="justify-content:flex-start"><button class="btn primary" data-act="codeApply">${t('Charger cette progression','Cargar este progreso')}</button></div><p class="small" id="codeMsg">${t('Attention : la progression actuelle de cet appareil sera remplacée.','Ojo: el progreso actual de este aparato se sustituirá.')}</p>`;}
async function codeApply(){const ta=$('#codeIn'),msg=$('#codeMsg');if(!ta)return;try{const o=await readCode(ta.value);S=merge(fresh(),o);L=S.lang||L;save();closeModal();applyLang();go('map');toast(`<span>${t('Progression chargée.','Progreso cargado.')}</span>`,2400);}catch(e){if(msg)msg.innerHTML=`<span class="mk-msg">${t('Ce code n’est pas valide. Vérifie que tu l’as copié en entier.','Ese código no es válido. Comprueba que lo has copiado entero.')}</span>`;}}
let resetArmed=false;
function guideHTML(){
  const st=S.stats,acc=st.answered?Math.round(st.correct/st.answered*100):0,avg=st.answered?fmt(st.time/st.answered):'—',mk=st.markTotal?Math.round(st.markFirst/st.markTotal*100)+' %':'—';
  const EL=ERRLAB(),keys=Object.keys(EL),max=Math.max(1,...keys.map(k=>st.err[k]||0)),tot=keys.reduce((a,k)=>a+(st.err[k]||0),0);
  const top=keys.slice().sort((a,b)=>(st.err[b]||0)-(st.err[a]||0))[0];
  const ADV={lectura:t('La plupart des erreurs viennent de la lecture : il calcule autre chose que ce qu’on lui demande. Avant de calculer, demandez-lui de dire à voix haute ce qu’on cherche et quelles données ne servent à rien. Les Parchemins du Scribe et l’entraînement « repérer les données » travaillent exactement ça.','La mayoría de fallos son de lectura: calcula algo distinto de lo que le piden. Antes de calcular, pídele que te diga en voz alta qué le preguntan y qué datos sobran. Los Pergaminos del Escriba y el entrenamiento de «Pergaminos marcando datos» trabajan justo eso.'),
    raiz:t('Il s’arrête souvent à c² et oublie la racine. Un truc : « carrés, somme, racine », comme un mantra.','Suele quedarse en c² y olvidar la raíz. Un truco: «cuadrados, suma, raíz», como un mantra.'),
    suma:t('Il additionne les côtés directement. Refaites la Salle des Carrés : voir les carreaux aide à comprendre pourquoi on élève au carré.','Suma los lados directamente. Repetid la Cámara de los Cuadrados: ver las baldosas ayuda a entender por qué se elevan al cuadrado.'),
    unidades:t('Il bute sur les unités. Qu’il écrive toutes les données dans la même unité avant de commencer.','Tropieza con las unidades. Que escriba todos los datos en la misma unidad antes de empezar.'),
    calculo:t('La méthode est souvent bonne ; les erreurs sont de calcul. Qu’il utilise l’abaque et vérifie le résultat.','El planteamiento suele estar bien; los fallos son de cuentas. Que use el ábaco y repase el resultado.'),
    reciproco:t('Il hésite entre théorème, réciproque et contraposée. Posez-lui la question clé : « Est-ce que tu sais déjà qu’il est rectangle, ou est-ce que tu veux le prouver ? » Et rappelez-lui de toujours comparer avec le plus grand côté.','Duda entre teorema, recíproco y contrarrecíproco. Hazle la pregunta clave: «¿Ya sabes que es rectángulo, o lo quieres demostrar?». Y recuérdale que siempre se compara con el lado mayor.'),
    coseno:t('Il confond le côté adjacent et l’hypoténuse. Faites-lui poser le doigt sur l’angle étudié : le côté qui le touche (et qui n’est pas l’hypoténuse) est l’adjacent.','Confunde el cateto contiguo y la hipotenusa. Que ponga el dedo en el ángulo: el lado que lo toca (y no es la hipotenusa) es el contiguo.'),
    raices:t('Il pense que √(a + b) = √a + √b. Testez ensemble √(9 + 16) et √9 + √16 : la différence se voit tout de suite.','Cree que √(a + b) = √a + √b. Probad juntos √(9 + 16) y √9 + √16: la diferencia se ve enseguida.'),
    pasos:t('Dans l’espace, il saute une étape. Dessinez la boîte et faites-lui tracer d’abord la diagonale du sol.','En el espacio se salta un paso. Dibujad la caja y que trace primero la diagonal del suelo.')};
  let advice=tot<4?t('Il y a encore peu de données. Revenez quand il aura joué un moment.','Todavía hay pocos datos. Vuelve cuando haya jugado un rato.'):ADV[top];
  if(st.answered>=8&&st.rush/Math.max(1,st.answered-st.correct)>=.4)advice+=' '+t('En plus, beaucoup d’erreurs arrivent en moins de 4 secondes : il répond avant d’avoir fini de lire.','Además, muchos fallos llegan en menos de 4 segundos: responde antes de terminar de leer.');
  const tp=TOPICS.map(([k,l])=>{const s=st.topic[k]||{n:0,ok:0};return {k,l:T(l),n:s.n,p:s.n?Math.round(s.ok/s.n*100):null};});
  const dl=DILEMMAS.filter(d=>S.dil[d.id]!=null);
  return `<p class="eyebrow">${t('Pour les parents','Para papá')}</p><h2>${t('Panneau du guide','Panel del guía')}</h2><p class="small">${t(`Comment avance ${esc(S.duel.p1||'Nil')} et où il se trompe. Les données restent dans ce navigateur.`,`Cómo va ${esc(S.duel.p1||'Nil')} y en qué se equivoca. Los datos se guardan solo en este navegador.`)}</p>
  <div class="kpis"><div><b>${st.answered}</b><span>${t('réponses','respuestas')}</span></div><div><b>${acc} %</b><span>${t('de réussite','aciertos')}</span></div><div><b>${avg} s</b><span>${t('temps moyen par défi','tiempo medio por reto')}</span></div><div><b>${st.rush}</b><span>${t('erreurs pressées (moins de 4 s)','fallos con prisa (menos de 4 s)')}</span></div><div><b>${mk}</b><span>${t('parchemins bien repérés du premier coup','pergaminos bien marcados a la primera')}</span></div><div><b>${S.proofs.perfect}/${S.proofs.done}</b><span>${t('rédactions parfaites','redacciones perfectas')}</span></div><div><b>${S.records.examBest?gradeTxt(S.records.examBest):'—'}</b><span>${t('meilleure note de contrôle','mejor nota de examen')}${S.records.examLast!=null?` (${t('dernière','última')} : ${gradeTxt(S.records.examLast)})`:''}</span></div><div><b>${S.records.survival[S.diff]||0}</b><span>${t('record de Survie','récord de Supervivencia')} (${dfName()})</span></div></div>
  <h3>${t('Maîtrise par thème','Dominio por tema')}</h3><div class="bars">${tp.map(x=>`<div class="bar-row"><span>${esc(x.l)}</span><div class="bar ok"><i style="width:${x.p||0}%"></i></div><b>${x.p==null?'—':x.p+' %'}</b></div>`).join('')}</div>
  <h3>${t('Types d’erreur','Tipos de error')}</h3><div class="bars">${keys.map(k=>`<div class="bar-row"><span>${EL[k]}</span><div class="bar"><i style="width:${(st.err[k]||0)/max*100}%"></i></div><b>${st.err[k]||0}</b></div>`).join('')}</div>
  <div class="advice"><b>${t('Conseil','Consejo')} :</b> ${advice}</div>
  ${dl.length?`<h3>${t('Ses réponses aux dilemmes (pour en discuter ensemble)','Sus respuestas a los dilemas (para hablarlo juntos)')}</h3><ul class="dil-list">${dl.map(d=>`<li><b>${esc(T(d.q))}</b><span>${esc(T(d.opts[S.dil[d.id]].t))}</span></li>`).join('')}</ul>`:''}
  <h3>${t('Salles','Cámaras')}</h3><ul class="chlist">${ORDER.map(id=>`<li><span>${chNum(id)} · ${chName(id)}</span><span class="ch-stars">${starsHTML(S.stars[id]||0)}</span></li>`).join('')}</ul>
  <h3>${t('Réglages du guide','Ajustes del guía')}</h3><div class="fgrid"><div class="field"><label for="gn1">${t('Nom de l’explorateur','Nombre del explorador')}</label><input id="gn1" value="${esc(S.duel.p1)}" maxlength="14"></div><div class="field"><label for="gn2">${t('Nom du guide','Nombre del guía')}</label><input id="gn2" value="${esc(S.duel.p2)}" maxlength="14"></div></div>
  <div class="row" style="justify-content:flex-start"><button class="btn" data-act="saveNames">${t('Enregistrer les noms','Guardar nombres')}</button><button class="btn" data-act="toggleFree">${S.free?t('Rebloquer les salles','Volver a bloquear cámaras'):t('Ouvrir toutes les salles et tous les modes','Abrir todas las cámaras y modos')}</button><button class="btn danger" data-act="reset">${resetArmed?t('Appuie encore pour tout effacer','Pulsa otra vez para borrar todo'):t('Effacer la progression','Borrar el progreso')}</button></div>`;
}
function openGuide(){showModal(guideHTML());}

/* =========================================================
   ÁBACO (calculadora con √, x², cos y cos⁻¹ en grados)
   ========================================================= */
function calcHTML(){const K=(k,l,c)=>`<button class="btn${c?' '+c:''}" data-act="calcKey" data-k="${k}"${k==='⌫'?` aria-label="${t('Effacer','Borrar')}"`:''}>${l||k}</button>`;
  return `<div class="calc-head"><span>${t('Abaque du temple','Ábaco del templo')}</span><button class="btn tiny ghost" data-act="calc" aria-label="${t('Fermer l’abaque','Cerrar el ábaco')}">×</button></div>
  <label for="calcIn" class="sr">${t('Opération','Operación')}</label><input id="calcIn" class="calc-in" autocomplete="off" placeholder="√(9+16)"><div class="calc-out" id="calcOut"></div>
  <div class="calc-keys">${K('√')}${K('²','x²')}${K('cos')}${K('acos','cos⁻¹')}${K('C')}${K('7')}${K('8')}${K('9')}${K('÷')}${K('⌫')}${K('4')}${K('5')}${K('6')}${K('×')}${K('−')}${K('1')}${K('2')}${K('3')}${K('+')}${K(',')}${K('0','0','k1')}${K('(')}${K(')')}${K('=','=','primary k2')}</div>
  <p class="calc-deg small">${t('Angles en degrés','Ángulos en grados')}</p><button class="btn tiny" data-act="calcUse">${t('Copier le résultat dans ma réponse','Copiar el resultado a mi respuesta')}</button>`;}
let calcLast=null;
function toggleCalc(force){const c=$('#calc');const show=typeof force==='boolean'?force:c.hidden;if(show&&!c.innerHTML.trim())c.innerHTML=calcHTML();c.hidden=!show;if(show){sfx('click');if(!TOUCH)$('#calcIn').focus();}}
function calcEval(src){
  const s=src.replace(/\s+/g,'').replace(/,/g,'.').replace(/cos⁻¹|arccos|acos/gi,'A').replace(/cos/gi,'K').replace(/[×xX*]/g,'*').replace(/[÷/:]/g,'/').replace(/[−–]/g,'-').replace(/sqrt|racine|raiz|raíz/gi,'√').replace(/\^2/g,'²');
  let i=0;const at=()=>s[i];
  function expr(){let v=term();for(;;){if(at()==='+'){i++;v+=term();}else if(at()==='-'){i++;v-=term();}else return v;}}
  function term(){let v=factor();for(;;){const c=at();if(c==='*'){i++;v*=factor();}else if(c==='/'){i++;v/=factor();}else if(c==='('||c==='√'||c==='K'||c==='A'||(c&&/[\d.]/.test(c))){v*=factor();}else return v;}}
  function factor(){if(at()==='-'){i++;return -factor();}if(at()==='+'){i++;return factor();}if(at()==='√'){i++;return Math.sqrt(factor());}if(at()==='K'){i++;return cosd(factor());}if(at()==='A'){i++;const x=factor();if(x<-1||x>1)throw new Error('dom');return acosd(x);}let v=prim();while(at()==='²'||at()==='^'){if(at()==='²'){i++;v=v*v;}else{i++;v=Math.pow(v,factor());}}return v;}
  function prim(){if(at()==='('){i++;const v=expr();if(at()===')')i++;return v;}const m=/^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));if(!m)throw new Error('x');i+=m[0].length;return parseFloat(m[0]);}
  if(!s)throw new Error('empty');const v=expr();if(i<s.length)throw new Error('rest');return v;
}
function calcKey(k){
  const inp=$('#calcIn'),out=$('#calcOut');sfx('click');
  if(k==='C'){inp.value='';out.textContent='';calcLast=null;}
  else if(k==='⌫'){inp.value=inp.value.slice(0,-1);}
  else if(k==='='){try{const v=calcEval(inp.value);if(!isFinite(v))throw 0;calcLast=v;out.textContent='= '+(Math.round(v*10000)/10000).toString().replace('.',',');}catch(e){calcLast=null;out.textContent=t('Vérifie l’opération','Revisa la operación');}}
  else inp.value+=(k==='√'?'√(':k==='cos'?'cos(':k==='acos'?'cos⁻¹(':k);
  if(!TOUCH)inp.focus();
}
function calcUse(){if(calcLast==null)calcKey('=');const a=$('#ans');if(calcLast!=null&&a&&!a.disabled){a.value=(Math.round(calcLast*100)/100).toString().replace('.',',');a.focus();}}
