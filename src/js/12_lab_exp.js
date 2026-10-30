/* =========================================================
   LABORATORIO
   ========================================================= */
function labHTML(){
  return `<div class="figcard" id="labFig"></div><div class="qcard lab"><p class="eyebrow">${t('Laboratoire du temple','Laboratorio del templo')}</p><h2>${t('Est-ce que ça marche toujours ?','¿Funciona siempre?')}</h2><p>${t('Change la longueur des côtés de l’angle droit et regarde combien de carreaux a chaque carré.','Cambia la medida de los catetos y mira cuántas baldosas tiene cada cuadrado.')}</p>
  <div class="sliders"><label for="la">${t('Côté','Cateto')} <span class="k-a">${t('turquoise','turquesa')}</span> <output id="oa">3</output></label><input type="range" id="la" min="1" max="12" value="3"><label for="lb">${t('Côté','Cateto')} <span class="k-b">${t('ambre','ámbar')}</span> <output id="ob">4</output></label><input type="range" id="lb" min="1" max="12" value="4"></div>
  <div class="labeq" id="labEq"></div><p class="labmsg" id="labMsg"></p><p class="small">${t('Triplets pythagoriciens trouvés (les trois côtés entiers) :','Ternas pitagóricas encontradas (los tres lados enteros):')} <span id="labFound"></span></p>
  <button class="btn primary" data-act="next" style="justify-self:start">${t('J’ai vu le secret','He visto el secreto')} ⏎</button></div>`;
}
function labUpdate(){
  const a=+$('#la').value,b=+$('#lb').value,c2=a*a+b*b,c=Math.sqrt(c2),ok=Number.isInteger(c);
  $('#oa').textContent=a;$('#ob').textContent=b;
  $('#labFig').innerHTML=figTri({a,b,squares:true,grid:true,sqLabels:{a:a*a,b:b*b,c:c2}});
  $('#labEq').innerHTML=`<span><span class="k-a">${a}²</span> + <span class="k-b">${b}²</span> = ${a*a} + ${b*b} = <span class="k-c">${c2}</span></span><span>${W.hyp} = √${c2} ${ok?'=':'≈'} ${fmt(c)}</span>`;
  const msg=$('#labMsg');
  if(ok){const key=[Math.min(a,b),Math.max(a,b),c].join('-');if(!S.labTriples.includes(key)){S.labTriples.push(key);save();sfx('relic');say(t(`Triplet pythagoricien ! ${Math.min(a,b)}, ${Math.max(a,b)} et ${c}.`,`¡Terna pitagórica! ${Math.min(a,b)}, ${Math.max(a,b)} y ${c}.`));}msg.className='labmsg win';msg.textContent=t(`Triplet pythagoricien ! ${Math.min(a,b)}, ${Math.max(a,b)} et ${c} : les trois côtés sont des nombres entiers.`,`¡Terna pitagórica! ${Math.min(a,b)}, ${Math.max(a,b)} y ${c}: los tres lados son números enteros.`);}
  else{msg.className='labmsg';msg.textContent=t('Le carré vert a toujours autant de carreaux que les deux autres réunis.','El cuadrado verde siempre tiene tantas baldosas como los otros dos juntos.');}
  $('#labFound').textContent=S.labTriples.length?S.labTriples.map(k=>k.split('-').join('·')).join(', '):t('aucun pour l’instant. Essaie 6 et 8.','ninguna todavía. Prueba 6 y 8.');
}

/* =========================================================
   EXPEDICIONES REALES
   ========================================================= */
const EXPS=[
  {id:'pantalla',name:tf('L’écran de l’ordinateur','La pantalla del ordenador'),mode:'hyp',la:tf('Largeur de l’écran (cm)','Ancho de la pantalla (cm)'),lb:tf('Hauteur de l’écran (cm)','Alto de la pantalla (cm)'),lc:tf('la diagonale','la diagonal'),bonus:true,steps:[tf('Mesure la largeur de la zone qui s’allume, d’un bord à l’autre.','Mide el ancho de la zona que se ilumina, de borde a borde.'),tf('Mesure la hauteur de cette même zone.','Mide el alto de esa misma zona.'),tf('Calcule la diagonale avec Pythagore. Tu peux utiliser la calculatrice.','Calcula la diagonal con Pitágoras. Puedes usar calculadora.'),tf('Mesure la diagonale d’un coin à l’autre et compare.','Mide la diagonal de esquina a esquina y compárala.')]},
  {id:'puerta',name:tf('La porte de ta chambre','La puerta de tu cuarto'),mode:'hyp',la:tf('Largeur de la porte (cm)','Ancho de la puerta (cm)'),lb:tf('Hauteur de la porte (cm)','Alto de la puerta (cm)'),lc:tf('la diagonale','la diagonal'),steps:[tf('Mesure la largeur de la porte.','Mide el ancho de la hoja de la puerta.'),tf('Mesure sa hauteur.','Mide su alto.'),tf('Calcule la diagonale.','Calcula la diagonal.'),tf('Mesure-la avec le mètre d’un coin à l’autre. Demande de l’aide : c’est long.','Mídela con la cinta de esquina a esquina. Pide ayuda: es larga.')]},
  {id:'mesa',name:tf('La table du salon','La mesa del comedor'),mode:'hyp',la:tf('Longueur de la table (cm)','Largo de la mesa (cm)'),lb:tf('Largeur de la table (cm)','Ancho de la mesa (cm)'),lc:tf('la diagonale','la diagonal'),steps:[tf('Mesure la longueur du plateau.','Mide el largo del tablero.'),tf('Mesure la largeur.','Mide el ancho.'),tf('Calcule la diagonale.','Calcula la diagonal.'),tf('Mesure d’un coin à l’autre et compare.','Mide de esquina a esquina y compara.')]},
  {id:'libro',name:tf('Ton cahier de maths','Tu libro de mates'),mode:'hyp',la:tf('Largeur de la couverture (cm)','Ancho de la tapa (cm)'),lb:tf('Hauteur de la couverture (cm)','Alto de la tapa (cm)'),lc:tf('la diagonale','la diagonal'),steps:[tf('Mesure la largeur de la couverture avec une règle.','Mide el ancho de la tapa con una regla.'),tf('Mesure la hauteur.','Mide el alto.'),tf('Calcule la diagonale.','Calcula la diagonal.'),tf('Mesure-la et compare. Ici, chaque millimètre compte.','Mídela y compara. Aquí cada milímetro cuenta.')]},
  {id:'habitacion',name:tf('Ta chambre en diagonale','Tu habitación en diagonal'),mode:'hyp',la:tf('Longueur du sol (cm)','Largo del suelo (cm)'),lb:tf('Largeur du sol (cm)','Ancho del suelo (cm)'),lc:tf('la diagonale','la diagonal'),steps:[tf('Mesure la longueur du sol, d’un mur à l’autre.','Mide el largo del suelo de pared a pared.'),tf('Mesure la largeur.','Mide el ancho.'),tf('Calcule la diagonale du sol.','Calcula la diagonal del suelo.'),tf('Vérifie avec le mètre, d’un coin à l’autre.','Comprueba con la cinta de rincón a rincón.')]},
  {id:'escoba',name:tf('Le balai contre le mur','La escoba contra la pared'),mode:'cat',la:tf('Longueur du balai (cm)','Largo de la escoba (cm)'),lb:tf('Distance du pied au mur (cm)','Distancia del pie a la pared (cm)'),lc:tf('la hauteur où il touche le mur','la altura a la que toca la pared'),steps:[tf('Appuie un balai contre un mur.','Apoya una escoba contra una pared.'),tf('Mesure la longueur du balai et la distance de son pied au mur.','Mide el largo de la escoba y la distancia de su pie a la pared.'),tf('Calcule à quelle hauteur il touche le mur. Maintenant, le balai est l’hypoténuse.','Calcula a qué altura toca la pared. Ahora la escoba es la hipotenusa.'),tf('Mesure cette hauteur et compare.','Mide esa altura y compárala.')]},
  {id:'caja',name:tf('La boîte à chaussures en 3D','La caja de zapatos en 3D'),mode:'box',la:tf('Longueur de la boîte (cm)','Largo de la caja (cm)'),lb:tf('Largeur de la boîte (cm)','Ancho de la caja (cm)'),lh:tf('Hauteur de la boîte (cm)','Alto de la caja (cm)'),lc:tf('la grande diagonale','la diagonal del espacio'),steps:[tf('Mesure la longueur, la largeur et la hauteur d’une boîte à chaussures.','Mide el largo, el ancho y el alto de una caja de zapatos.'),tf('Calcule la grande diagonale : d² = L² + l² + h².','Calcula la diagonal del espacio: d² = largo² + ancho² + alto².'),tf('Tends une ficelle à l’intérieur, d’un coin du fond au coin opposé du haut, et mesure-la.','Tensa un cordel por dentro, de una esquina de abajo a la esquina opuesta de arriba, y mídelo.'),tf('Bonus : quel est le crayon le plus long qui rentre dans la boîte ?','Extra: ¿cuál es el lápiz más largo que cabe dentro de la caja?')]},
  {id:'tele',name:tf('Les pouces de la télé','Las pulgadas de la tele'),mode:'hyp',la:tf('Largeur de l’image (cm)','Ancho de la imagen (cm)'),lb:tf('Hauteur de l’image (cm)','Alto de la imagen (cm)'),lc:tf('la diagonale','la diagonal'),bonus:true,steps:[tf('Mesure la largeur et la hauteur de l’image de la télé (sans le cadre).','Mide el ancho y el alto de la imagen de la tele (sin el marco).'),tf('Calcule la diagonale en centimètres.','Calcula la diagonal en centímetros.'),tf('Mesure la vraie diagonale.','Mide la diagonal real.'),tf('Regarde combien de pouces ça fait et compare avec ce qui est écrit sur la télé ou sa boîte.','Mira cuántas pulgadas salen y compáralo con lo que pone la tele o su caja.')]},
  {id:'cuerda',name:tf('La corde à 12 nœuds','La cuerda de 12 nudos'),mode:'rope',steps:[tf('Prends une ficelle et fais 13 nœuds séparés exactement de la même distance, par exemple 10 cm. Il reste 12 morceaux égaux.','Coge un cordel y haz 13 nudos separados exactamente por la misma distancia, por ejemplo 10 cm. Quedan 12 tramos iguales.'),tf('Rejoins le premier nœud au dernier pour fermer la corde.','Une el primer nudo con el último para cerrar la cuerda.'),tf('Avec papa, tendez-la en triangle : un côté de 3 morceaux, un autre de 4 et un autre de 5.','Con papá, tensadla formando un triángulo: un lado de 3 tramos, otro de 4 y otro de 5.'),tf('Vérifiez le coin entre le côté de 3 et celui de 4 avec le coin d’un livre. Est-ce un angle droit ?','Comprobad la esquina entre el lado de 3 y el de 4 con la esquina de un libro. ¿Es un ángulo recto?'),tf('On raconte que les bâtisseurs de l’Égypte ancienne traçaient ainsi les angles droits, parce que 3² + 4² = 5². C’est la réciproque du théorème !','Se cuenta que así trazaban ángulos rectos los constructores del antiguo Egipto, porque 3² + 4² = 5². ¡Es el recíproco del teorema!')]},
];
let expSel='pantalla';const expRes={};
function expHTML(){
  const n=EXPS.filter(e=>S.exp[e.id]&&S.exp[e.id].done).length,sel=EXPS.find(e=>e.id===expSel)||EXPS[0];
  return `<section><div class="playbar"><button class="btn ghost" data-act="go" data-v="map">← ${t('Carte','Mapa')}</button><div class="pb-emb"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${P.ruler}"/></svg></div><div class="pb-title"><p class="eyebrow">${t('Hors du temple','Fuera del templo')} · ${n} ${t('sur','de')} ${EXPS.length} ${t('terminées','completadas')}</p><h2>${t('Expéditions réelles','Expediciones reales')}</h2></div></div>
  <p class="lead">${t('Prends un mètre ruban. Pythagore marche aussi chez toi : mesure deux côtés, calcule le troisième et vérifie en mesurant.','Coge una cinta métrica. Pitágoras también funciona en tu casa: mide dos lados, calcula el tercero y comprueba midiendo.')}</p>
  <div class="exp-layout"><ul class="exp-list">${EXPS.map(e=>{const dn=S.exp[e.id]&&S.exp[e.id].done;return `<li><button class="exp-item${e.id===sel.id?' on':''}${dn?' done':''}" data-act="expOpen" data-id="${e.id}"><span>${esc(T(e.name))}</span><span class="exp-st">${dn?t('Faite','Hecha'):t('À faire','Pendiente')}</span></button></li>`;}).join('')}</ul>
  <div class="qcard">${expDetail(sel)}</div></div></section>`;
}
function expDetail(e){
  const st=S.exp[e.id]||{},v=st.v||[];
  let h=`<p class="eyebrow">${st.done?t('Expédition terminée','Expedición completada'):t('Expédition','Expedición')}</p><h2>${esc(T(e.name))}</h2><ol class="steps">${e.steps.map(s=>`<li>${T(s)}</li>`).join('')}</ol>`;
  if(e.mode==='rope')return h+(st.done?`<p class="mk-ok">${t('Angle droit confirmé.','Ángulo recto confirmado.')}</p>`:`<button class="btn primary" data-act="ropeDone" style="justify-self:start">${t('Papa confirme : angle droit réussi !','Papá lo confirma: ¡ángulo recto conseguido!')}</button>`);
  const val=i=>v[i]!=null&&!isNaN(v[i])?fmt(v[i]):'';const box=e.mode==='box';
  return h+`<form id="expForm" autocomplete="off" style="display:grid;gap:14px"><div class="fgrid">
    <div class="field"><label for="e1">${T(e.la)}</label><input id="e1" inputmode="decimal" value="${val(0)}"></div>
    <div class="field"><label for="e2">${T(e.lb)}</label><input id="e2" inputmode="decimal" value="${val(1)}"></div>
    ${box?`<div class="field"><label for="e5">${T(e.lh)}</label><input id="e5" inputmode="decimal" value="${val(4)}"></div>`:''}
    <div class="field"><label for="e3">${t('Ton calcul de','Tu cálculo de')} ${T(e.lc)} (cm)</label><input id="e3" inputmode="decimal" value="${val(2)}"></div>
    <div class="field"><label for="e4">${t('Ce que tu mesures en vrai (cm)','Lo que mides de verdad (cm)')}</label><input id="e4" inputmode="decimal" value="${val(3)}"></div></div>
    <button class="btn primary" type="submit" style="justify-self:start">${t('Vérifier l’expédition','Comprobar la expedición')}</button></form><div id="expResult">${expRes[e.id]||''}</div>`;
}
function expCheck(){
  const e=EXPS.find(x=>x.id===expSel)||EXPS[0];
  const A=parseNum($('#e1').value),B=parseNum($('#e2').value),mine=parseNum($('#e3').value),real=parseNum($('#e4').value),Hh=e.mode==='box'?parseNum($('#e5').value):0;
  let html='',success=false;
  if([A,B,mine].some(isNaN)||A<=0||B<=0||(e.mode==='box'&&(isNaN(Hh)||Hh<=0))){expRes[e.id]=`<p class="mk-msg">${t('Écris les mesures et ton calcul avant de vérifier.','Escribe las medidas y tu cálculo antes de comprobar.')}</p>`;render();return;}
  if(e.mode==='cat'&&A<=B){expRes[e.id]=`<p class="mk-msg">${t('Le balai doit être plus long que la distance de son pied au mur. Revois les mesures.','La escoba tiene que ser más larga que la distancia de su pie a la pared. Revisa las medidas.')}</p>`;render();return;}
  const truth=e.mode==='cat'?Math.sqrt(A*A-B*B):e.mode==='box'?Math.hypot(A,B,Hh):Math.hypot(A,B);
  const calcOk=Math.abs(mine-truth)<=Math.max(0.6,truth*0.01);
  const ex=e.mode==='cat'?explCat(A,B,'cm',true):e.mode==='box'?`<span class="m">d² = ${fmt(A)}² + ${fmt(B)}² + ${fmt(Hh)}² = ${fmt(A*A+B*B+Hh*Hh)}</span><span class="m">d ≈ ${fmt1(truth)} cm</span>`:explHyp(A,B,'cm',true);
  if(!calcOk){const d=e.mode==='box'?['pasos',t('Revois le calcul','Revisa el cálculo'),t('Il faut les trois dimensions au carré.','Hacen falta las tres dimensiones al cuadrado.')]:diagnose({meta:e.mode==='cat'?{mode:'cat',h:A,p:B}:{mode:'hyp',p:A,q:B}},mine);S.stats.err[d[0]]=(S.stats.err[d[0]]||0)+1;sfx('bad');
    html=`<div class="fb bad"><p class="fb-title">${d[1]}</p><p>${d[2]}</p><div class="fb-body"><span class="fb-sub">${t('Voici le calcul','Así se calcula')}</span>${ex}</div></div>`;}
  else{
    html=`<div class="fb ok"><p class="fb-title">${t('Calcul juste','Cálculo correcto')}</p><div class="fb-body">${ex}</div>`;
    if(!isNaN(real)&&real>0){const diff=Math.abs(real-truth)/truth*100;
      if(diff<=5){success=true;html+=`<p>${t(`Tu as mesuré ${fmt(real)} cm : un écart de ${fmt(diff)} %. La réalité confirme Pythagore.`,`Mediste ${fmt(real)} cm: una diferencia del ${fmt(diff)} %. La realidad confirma a Pitágoras.`)}</p>`;}
      else html+=`<p>${t(`Tu as mesuré ${fmt(real)} cm, soit ${Math.round(diff)} % d’écart. Revois les mesures : as-tu mesuré exactement d’un bord à l’autre ?`,`Mediste ${fmt(real)} cm, un ${Math.round(diff)} % distinto. Repasa las medidas: ¿mediste de borde a borde exacto?`)}</p>`;}
    else html+=`<p>${t(`Maintenant mesure ${T(e.lc)} en vrai et écris-la pour terminer l’expédition.`,`Ahora mide ${T(e.lc)} de verdad y escríbela para cerrar la expedición.`)}</p>`;
    if(e.bonus)html+=`<p class="small">${t(`${fmt(truth)} cm font ${fmt(truth/2.54)} pouces (1 pouce = 2,54 cm). C’est comme ça qu’on annonce les écrans.`,`${fmt(truth)} cm son ${fmt(truth/2.54)} pulgadas (1 pulgada = 2,54 cm). Así se anuncian las pantallas.`)}</p>`;
    html+='</div>';sfx('ok');
  }
  const first=!(S.exp[e.id]&&S.exp[e.id].done);
  S.exp[e.id]={done:success||!first,v:[A,B,mine,real,Hh]};
  if(success&&first){gainXP(40);html+=`<p class="xpgain">+${Math.round(40*DF().xp)} XP</p>`;confetti(80);say(t('Expédition terminée. La réalité confirme Pythagore.','Expedición completada. La realidad confirma a Pitágoras.'));}
  save();expRes[e.id]=html;render();
  if(success&&first&&EXPS.filter(x=>S.exp[x.id]&&S.exp[x.id].done).length>=3)grant('medidor');
}
function ropeDone(){const first=!(S.exp.cuerda&&S.exp.cuerda.done);S.exp.cuerda={done:true};save();if(first){gainXP(40);sfx('win');confetti(80);}render();if(EXPS.filter(x=>S.exp[x.id]&&S.exp[x.id].done).length>=3)grant('medidor');}
