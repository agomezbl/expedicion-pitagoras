/* =========================================================
   LISTA DE FRASES GRABABLES (para tools/voces-lista.js)
   Cada frase fija del juego con su personaje; las que llevan números se leen con la voz del aparato.
   ========================================================= */
function voiceLines(){const out=[],seen=new Set();const add=(tx,who)=>{const p=plain(String(tx||''));if(!p||!/[\p{L}]/u.test(p))return;who=who||'nar';const k=voKey(p,who);if(seen.has(k))return;seen.add(k);out.push({who,text:p,key:k,say:speakable(p)});};
  Object.values(SCENES).forEach(sc=>sc.lines.forEach(x=>{if(x.t)add(dropName(T(x.t)),x.w);}));
  DILEMMAS.forEach(d=>{add(T(d.q),'teano');d.opts.forEach(o=>add(dropName(T(o.r.t)),o.r.w));});
  Object.values(INTROS).forEach(I=>add(T(I.story)+(I.echo?' '+T(I.echo):''),'nar'));
  const LL=[];const walk=v=>{if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object'&&(v.fr!=null||v.es!=null))LL.push(T(v));else if(v&&typeof v==='object')Object.values(v).forEach(walk);};walk(LINES);LL.forEach(x=>add(x));
  SAGES.forEach(x=>{add(sageSpeech(x,false));add(sageSpeech(x,true));});
  ORDER.forEach((id,i)=>{add(cardSay(id,i));add(t('La brume se dissipe. ','La niebla se disipa. ')+T(CH[id].name)+'.');add(chName(id)+'. '+T(CH[id].desc));add(chName(id)+'. '+t('Fermée.','Cerrada.'));});
  ['daily','train','survival','exam'].forEach(id=>add(cardSay(id,-1)));
  RANKS.forEach((r,i)=>add(t('Nouveau rang : ','Nuevo rango: ')+rankName(i)+'.'));
  const P0=PROLOGUE();add(plain(P0.replace(/<br>/g,' ')));
  [t('La brume se dissipe. De nouvelles salles sont révélées.','La niebla se disipa. Se han revelado nuevas cámaras.'),t('Une salle cachée dans la brume.','Una cámara oculta en la niebla.'),
   t('Dans le Codex des Sages, tu as déjà les premières pages : l’histoire de Pythagore et de Théano. Commence par la Salle des Carrés.','En el Códice de los Sabios ya tienes las primeras páginas: la historia de Pitágoras y de Teano. Empieza por la Cámara de los Cuadrados.'),
   t('Bon retour. Choisis ta prochaine salle.','Bienvenido de nuevo. Elige tu próxima cámara.'),t('Bienvenue. Commence par la Salle des Carrés.','Bienvenido. Empieza por la Cámara de los Cuadrados.'),
   t('Laboratoire du temple. Change les côtés et vérifie si le secret marche toujours.','Laboratorio del templo. Mueve los catetos y comprueba si el secreto funciona siempre.'),
   t('Tu as découvert le sceau de Pythagore. Dans un triangle rectangle, le carré de l’hypoténuse est égal à la somme des carrés des deux autres côtés.','Has descubierto el sello de Pitágoras. En todo triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.'),
   t('Œil de faucon. Données parfaites. Maintenant, calcule.','Ojo de halcón. Datos perfectos. Ahora calcula.'),t('Données prêtes. Maintenant, calcule.','Datos listos. Ahora calcula.'),
   t('Ce n’est pas ça. Relis l’histoire.','No es esa. Vuelve a leer la historia.'),t('Expédition terminée. La réalité confirme Pythagore.','Expedición completada. La realidad confirma a Pitágoras.'),
   t('Salle réussie','Cámara superada'),t('Plus d’amulettes','Sin amuletos'),t('La torche s’est éteinte','Se apagó la antorcha'),t('Tu t’es échappé !','¡Has escapado!'),t('Le sable est écoulé','Se acabó la arena'),t('Tu as vaincu le Gardien !','¡Has vencido al Guardián!'),t('Le Gardien résiste','El Guardián resiste'),t('Contrôle corrigé','Examen corregido'),t('Nouveau record !','¡Nuevo récord!'),t('Fin de l’escalier','Fin de la escalera'),t('Entraînement terminé','Entrenamiento terminado'),t('Défi terminé','Desafío completado'),
   t('Tu n’as plus d’amulettes. Ce que tu as appris reste avec toi : réessaie.','Te has quedado sin amuletos. Lo que has aprendido sigue contigo: vuelve a intentarlo.'),t('La porte reste scellée. Chaque essai te rapproche : les serrures changent à chaque fois.','La puerta sigue sellada. Cada intento te deja más cerca: las cerraduras cambian cada vez.'),
  ].forEach(x=>add(x));
  return out;}
