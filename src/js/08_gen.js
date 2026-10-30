/* =========================================================
   TRIÁNGULOS Y GENERADORES (teorema directo)
   ========================================================= */
const T_EASY=[[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17],[12,16,20]];
const T_MID=[[15,20,25],[7,24,25],[10,24,26],[20,21,29],[12,35,37],[9,40,41],[16,30,34],[18,24,30],[24,32,40],[21,28,35],[15,36,39],[30,40,50]];
const T_BIG=[[33,56,65],[28,45,53],[36,77,85],[39,80,89],[48,55,73],[13,84,85],[60,91,109],[65,72,97],[11,60,61],[20,99,101]];
const T_NO=[[4,5,6],[5,6,8],[6,7,9],[7,8,11],[8,9,12],[9,10,13],[10,11,15],[5,11,12],[6,9,11],[12,13,18]];
const triPool=()=>S.diff==='aprendiz'?T_EASY:S.diff==='leyenda'?T_MID.concat(T_BIG):T_EASY.concat(T_MID);
const anyTri=()=>S.diff==='leyenda'&&rnd()<.4?{t:null,round:true}:{t:pick(triPool()),round:false};
const sq=x=>x+'²';
/* explicaciones paso a paso; n = nombres de los lados (BC, AB, AC) si el triángulo tiene vértices */
function explHyp(p,q,unit,round,n){const s=p*p+q*q,c=Math.sqrt(s),ex=isExact(c),h=n?n.h:'c',u=unit?' '+unit:'';
  return (n?`<span>${t(`Dans le triangle ${n.tri} rectangle en ${n.r}, d’après le théorème de Pythagore :`,`En el triángulo ${n.tri}, rectángulo en ${n.r}, por el teorema de Pitágoras:`)}</span><span class="m">${sq(n.h)} = ${sq(n.p)} + ${sq(n.q)}</span>`:'')+
  `<span class="m">${sq(h)} = ${fmt(p)}² + ${fmt(q)}²</span><span class="m">${sq(h)} = ${fmt(p*p)} + ${fmt(q*q)} = ${fmt(s)}</span><span class="m">${h} = √${fmt(s)} ${ex?'=':'≈'} ${fmt(ex?c:(round?r1(c):c))}${u}</span>`;}
function explCat(hh,p,unit,round,n){const d=hh*hh-p*p,x=Math.sqrt(d),ex=isExact(x),k=n?n.x:'x',u=unit?' '+unit:'';
  return (n?`<span>${t(`Dans le triangle ${n.tri} rectangle en ${n.r}, d’après le théorème de Pythagore :`,`En el triángulo ${n.tri}, rectángulo en ${n.r}, por el teorema de Pitágoras:`)}</span><span class="m">${sq(n.h)} = ${sq(n.p)} + ${sq(n.x)}</span><span class="m">${sq(n.x)} = ${sq(n.h)} − ${sq(n.p)}</span>`:'')+
  `<span class="m">${sq(k)} = ${fmt(hh)}² − ${fmt(p)}²</span><span class="m">${sq(k)} = ${fmt(hh*hh)} − ${fmt(p*p)} = ${fmt(d)}</span><span class="m">${k} = √${fmt(d)} ${ex?'=':'≈'} ${fmt(ex?x:(round?r1(x):x))}${u}</span>`;}
function qHyp(o){const c=Math.sqrt(o.p*o.p+o.q*o.q);return {kind:'num',type:'hyp',topic:'hyp',answer:o.round?r1(c):c,exact:c,round:!!o.round,unit:o.unit||'',trap:!!o.trap,
  prompt:o.prompt||t(`Les côtés de l’angle droit mesurent ${fmt(o.p)} et ${fmt(o.q)}. Combien mesure l’hypoténuse ?`,`Los catetos miden ${fmt(o.p)} y ${fmt(o.q)}. ¿Cuánto mide la hipotenusa?`),fig:o.fig,meta:{mode:'hyp',p:o.p,q:o.q,c},
  hint:t(`Il manque l’<b>hypoténuse</b>, le plus grand côté. Additionne les carrés des deux autres côtés, puis prends la racine : <span class="m">c² = ${fmt(o.p)}² + ${fmt(o.q)}²</span>`,`Lo que falta es la <b>hipotenusa</b>, el lado largo. Suma los cuadrados de los catetos y haz la raíz: <span class="m">c² = ${fmt(o.p)}² + ${fmt(o.q)}²</span>`),
  explain:explHyp(o.p,o.q,o.unit,o.round,o.names)};}
function qCat(o){const x=Math.sqrt(o.h*o.h-o.p*o.p);return {kind:'num',type:'cat',topic:'cat',answer:o.round?r1(x):x,exact:x,round:!!o.round,unit:o.unit||'',trap:!!o.trap,
  prompt:o.prompt||t(`L’hypoténuse mesure ${fmt(o.h)} et un côté de l’angle droit ${fmt(o.p)}. Combien mesure l’autre côté ?`,`La hipotenusa mide ${fmt(o.h)} y un cateto ${fmt(o.p)}. ¿Cuánto mide el otro cateto?`),fig:o.fig,meta:{mode:'cat',h:o.h,p:o.p,x},
  hint:t(`Il manque un <b>côté de l’angle droit</b>. Au carré de l’hypoténuse, enlève le carré du côté connu : <span class="m">x² = ${fmt(o.h)}² − ${fmt(o.p)}²</span>`,`Lo que falta es un <b>cateto</b>. Al cuadrado de la hipotenusa réstale el cuadrado del cateto que conoces: <span class="m">x² = ${fmt(o.h)}² − ${fmt(o.p)}²</span>`),
  explain:explCat(o.h,o.p,o.unit,o.round,o.names)};}
function hypTri(tr,round){
  let a,b;if(round||!tr){a=ri(4,19);b=ri(4,19);round=!Number.isInteger(Math.hypot(a,b));}else{[a,b]=rnd()<.5?[tr[0],tr[1]]:[tr[1],tr[0]];}
  const rot=ri(0,359),flip=rnd()<.5;
  if(rnd()<.6){const V=pick(VERTS),[A,B,C]=V,n={tri:A+B+C,r:A,h:B+C,p:A+B,q:A+C};
    return qHyp({p:a,q:b,round,names:n,prompt:t(`Le triangle ${n.tri} est rectangle en ${A}. ${A}${B} = ${a} et ${A}${C} = ${b}. Calcule la longueur ${B}${C}.`,`El triángulo ${n.tri} es rectángulo en ${A}. ${A}${B} = ${a} y ${A}${C} = ${b}. ¿Cuánto mide ${B}${C}?`)+(round?t(' Arrondis au dixième.',' Redondea a las décimas.'):''),
      fig:()=>figTri({a,b,la:String(a),lb:String(b),lc:'?',unk:'c',rot,flip,verts:[A,B,C]})});}
  return qHyp({p:a,q:b,round,prompt:t(`Les côtés de l’angle droit de ce triangle mesurent ${a} et ${b}. Combien mesure le côté <i>x</i> ?`,`Los catetos de este triángulo miden ${a} y ${b}. ¿Cuánto mide el lado <i>x</i>?`),fig:()=>figTri({a,b,la:String(a),lb:String(b),lc:'x',unk:'c',rot,flip})});
}
function catTri(tr,round){
  let a,b,c;
  if(round||!tr){b=ri(3,15);c=ri(b+2,b+14);a=Math.sqrt(c*c-b*b);round=!Number.isInteger(a);}else{[a,b,c]=rnd()<.5?tr:[tr[1],tr[0],tr[2]];}
  const rot=ri(0,359),flip=rnd()<.5;
  if(rnd()<.6){const V=pick(VERTS),[A,B,C]=V,n={tri:A+B+C,r:A,h:B+C,p:A+C,x:A+B};
    return qCat({h:c,p:b,round,names:n,prompt:t(`Le triangle ${n.tri} est rectangle en ${A}. ${B}${C} = ${c} et ${A}${C} = ${b}. Calcule la longueur ${A}${B}.`,`El triángulo ${n.tri} es rectángulo en ${A}. ${B}${C} = ${c} y ${A}${C} = ${b}. ¿Cuánto mide ${A}${B}?`)+(round?t(' Arrondis au dixième.',' Redondea a las décimas.'):''),
      fig:()=>figTri({a,b,la:'?',lb:String(b),lc:String(c),unk:'a',rot,flip,verts:[A,B,C]})});}
  return qCat({h:c,p:b,round,prompt:t(`L’hypoténuse de ce triangle mesure ${c} et l’un des côtés de l’angle droit ${b}. Combien mesure le côté <i>x</i> ?`,`La hipotenusa de este triángulo mide ${c} y uno de los catetos, ${b}. ¿Cuánto mide el lado <i>x</i>?`),fig:()=>figTri({a,b,la:'x',lb:String(b),lc:String(c),unk:'a',rot,flip})});
}
const tiles=n=>t(`${n} carreaux`,`${n} baldosas`);
function qSqSum(tr){const[p,q,c]=tr;return {kind:'num',type:'sq',topic:'sq',answer:c*c,prompt:t(`Les carrés construits sur les côtés de l’angle droit ont <b>${p*p}</b> et <b>${q*q}</b> carreaux. Combien de carreaux a le carré de l’hypoténuse ?`,`Los cuadrados de los catetos tienen <b>${p*p}</b> y <b>${q*q}</b> baldosas. ¿Cuántas baldosas tiene el cuadrado de la hipotenusa?`),fig:()=>figTri({a:p,b:q,squares:true,sqLabels:{a:p*p,b:q*q,c:'?'}}),meta:{mode:'sq',side:c,parts:[p,q]},
  hint:t('Le grand carré a autant de carreaux que les deux petits réunis.','El cuadrado grande tiene tantas baldosas como los dos pequeños juntos.'),explain:`<span class="m">${p*p} + ${q*q} = ${tiles(c*c)}</span>`};}
function qSqDiff(tr){const[p,q,c]=tr;return {kind:'num',type:'sq',topic:'sq',answer:q*q,prompt:t(`Le carré de l’hypoténuse a <b>${c*c}</b> carreaux et celui d’un côté de l’angle droit <b>${p*p}</b>. Combien de carreaux a le carré de l’autre côté ?`,`El cuadrado de la hipotenusa tiene <b>${c*c}</b> baldosas y el de un cateto, <b>${p*p}</b>. ¿Cuántas baldosas tiene el cuadrado del otro cateto?`),fig:()=>figTri({a:p,b:q,squares:true,sqLabels:{a:p*p,b:'?',c:c*c}}),meta:{mode:'sqd',big:c*c,small:p*p,side:q},
  hint:t('Si le grand est la somme des deux petits, enlève au grand celui que tu connais.','Si el grande es la suma de los dos pequeños, al grande le quitas el que conoces.'),explain:`<span class="m">${c*c} − ${p*p} = ${tiles(q*q)}</span>`};}
function qSqSide(tr){const c=tr[2];return {kind:'num',type:'sqside',topic:'sq',answer:c,prompt:t(`Le carré construit sur l’hypoténuse a <b>${c*c}</b> carreaux. Combien mesure l’hypoténuse ?`,`El cuadrado construido sobre la hipotenusa tiene <b>${c*c}</b> baldosas. ¿Cuánto mide la hipotenusa?`),fig:()=>figTri({a:tr[0],b:tr[1],squares:true,sqLabels:{c:c*c},lc:'?',unk:'c'}),meta:{mode:'sqside',area:c*c},
  hint:t('Cherche quel nombre multiplié par lui-même donne ce nombre de carreaux : c’est la racine carrée.','Busca qué número multiplicado por sí mismo da ese número de baldosas. Eso es la raíz cuadrada.'),explain:`<span class="m">√${c*c} = ${c}, ${t('car','porque')} ${c} × ${c} = ${c*c}</span>`};}
function qIdHyp(){
  const tr=pick([[3,4,5],[5,12,13],[8,15,17],[6,8,10],[7,24,25],[20,21,29]]);
  const Lt=shuffle(['m','n','t','r','s','k']).slice(0,3),rot=ri(0,359),flip=rnd()<.5,order=shuffle([0,1,2]);
  return {kind:'choice',type:'id',topic:'id',prompt:t('Ce triangle rectangle est tourné. Lequel de ses côtés est l’<b>hypoténuse</b> ?','Este triángulo rectángulo está girado. ¿Cuál de sus lados es la <b>hipotenusa</b>?'),fig:()=>figTri({a:tr[0],b:tr[1],la:Lt[0],lb:Lt[1],lc:Lt[2],rot,flip,italic:true}),
    choices:order.map(i=>t(`Le côté <i>${Lt[i]}</i>`,`El lado <i>${Lt[i]}</i>`)),answer:order.indexOf(2),explain:t('<span>L’hypoténuse est <b>en face de l’angle droit</b> (le petit carré) et c’est toujours le plus grand côté.</span>','<span>La hipotenusa está <b>enfrente del ángulo recto</b> (el cuadradito) y siempre es el lado más largo.</span>'),
    diag:()=>['lectura',t('Cherche d’abord l’angle droit','Busca primero el ángulo recto'),t('Ce côté touche l’angle droit : c’est un côté de l’angle droit. L’hypoténuse est le côté d’en face.','Ese lado toca el ángulo recto, así que es un cateto. La hipotenusa es el lado de enfrente.')]};
}
function qRect(){
  const s=rnd()<.5?pick(S.diff==='aprendiz'?T_EASY:T_EASY.concat(T_MID)):pick(T_NO);const[a,b,c]=s;const Ls=a*a+b*b,Rr=c*c,ok=Ls===Rr;
  return {kind:'choice',type:'rect',topic:'rect',prompt:t(`Un triangle a des côtés de <b>${a}</b>, <b>${b}</b> et <b>${c}</b>. Est-il rectangle ?`,`Un triángulo tiene lados de <b>${a}</b>, <b>${b}</b> y <b>${c}</b>. ¿Es un triángulo rectángulo?`),fig:()=>figSides(s),choices:[t('Oui, il est rectangle','Sí, es rectángulo'),t('Non, il ne l’est pas','No, no lo es')],answer:ok?0:1,
    explain:`<span class="m">${a}² + ${b}² = ${a*a} + ${b*b} = ${Ls}</span><span class="m">${c}² = ${Rr}</span><span>${ok?t('Égalité : il est rectangle (réciproque du théorème de Pythagore).','Coinciden: sí es rectángulo (recíproco del teorema de Pitágoras).'):t('Pas d’égalité : il n’est pas rectangle (contraposée du théorème).','No coinciden: no es rectángulo (contrarrecíproco del teorema).')}</span>`,
    diag:()=>['calculo',t('Vérifie avec les carrés','Compruébalo con los cuadrados'),t('Additionne les carrés des deux petits côtés et compare avec le carré du plus grand. Il n’est rectangle que s’il y a égalité.','Suma los cuadrados de los dos lados cortos y compáralo con el cuadrado del lado largo. Solo si coinciden es rectángulo.')]};
}
