/* =========================================================
   ESCENAS CON PERSONAJES Y DILEMAS FILOSÓFICOS
   Línea: {w:quién, m:ánimo, t:tf(fr,es)} · {bg:'fondo'} · {dil:'id'}
   {N} = nombre del jugador (siempre como vocativo «, {N}» para que la voz grabada lo pueda omitir)
   ========================================================= */
const L_=(w,m,fr,es)=>({w,m,t:tf(fr,es)});
const DILEMMAS=[
  {id:'d1',q:tf('Les nombres, on les invente ou on les découvre ?','¿Los números se inventan o se descubren?'),opts:[
    {t:tf('On les découvre : ils étaient là avant nous.','Se descubren: ya estaban ahí antes que nosotros.'),r:L_('pitagoras','happy','C’est ce que je crois ! Le 3, le 4 et le 5 formaient un triangle rectangle bien avant que quelqu’un naisse pour les compter.','¡Eso creo yo! El 3, el 4 y el 5 encajaban en un triángulo rectángulo mucho antes de que naciera nadie para contarlos.')},
    {t:tf('On les invente : ce sont les humains qui les créent pour compter.','Se inventan: los creamos las personas para contar.'),r:L_('teano','neutral','Intéressant. Les noms et les symboles, oui, on les invente : les Romains écrivaient V et nous écrivons 5. Mais les règles qu’ils suivent, qui les a inventées ?','Interesante. Los nombres y los símbolos sí los inventamos: los romanos escribían V y nosotros 5. Pero las reglas que cumplen, ¿quién las inventó?')},
    {t:tf('Un peu des deux.','Un poco las dos cosas.'),r:L_('pitagoras','neutral','Peut-être as-tu raison : on invente les mots pour en parler, et on découvre ce qu’ils font. Les philosophes en discutent depuis 2 500 ans.','Quizá tengas razón: inventamos las palabras para hablar de ellos y descubrimos lo que hacen. Los filósofos llevan 2.500 años discutiéndolo.')}]},
  {id:'d2',q:tf('Si le secret marche sur 3 triangles, est-il démontré ?','Si el secreto funciona en 3 triángulos, ¿ya está demostrado?'),best:1,opts:[
    {t:tf('Oui, trois exemples suffisent.','Sí, tres ejemplos bastan.'),r:L_('pitagoras','neutral','Trois jours de soleil ne prouvent pas qu’il ne pleuvra pas demain. Il nous faut quelque chose de plus solide que des exemples.','Tres días de sol no demuestran que mañana no vaya a llover. Necesitamos algo más fuerte que los ejemplos.')},
    {t:tf('Non : il pourrait rater sur un autre triangle.','No: podría fallar en otro triángulo.'),r:L_('pitagoras','happy','Exactement ! C’est pour ça que les mathématiciens démontrent : un raisonnement valable pour tous les triangles rectangles, sans exception.','¡Exacto! Por eso los matemáticos demuestran: un razonamiento que vale para todos los triángulos rectángulos, sin excepción.')},
    {t:tf('Oui, si les triangles sont très différents.','Sí, si los triángulos son muy distintos.'),r:L_('teano','neutral','Ça aide, mais ça ne suffit pas : il pourrait toujours y en avoir un bizarre qu’on n’a pas essayé. Il faut une démonstration.','Ayuda, pero no basta: siempre podría haber uno raro que no hemos probado. Hace falta una demostración.')}]},
  {id:'d3',q:tf('À quoi sert le plus la géométrie ?','¿Para qué sirve más la geometría?'),opts:[
    {t:tf('À construire : des champs, des pyramides, des maisons.','Para construir: campos, pirámides, casas.'),r:L_('arpedonapta','happy','C’est ce que je dis ! Sans géométrie, chaque crue du Nil finirait en dispute entre voisins.','¡Eso digo yo! Sin geometría, cada crecida del Nilo acabaría en una pelea entre vecinos.')},
    {t:tf('À mieux penser.','Para pensar mejor.'),r:L_('teano','neutral','C’est ce que diraient les Grecs : Platon pensait que la géométrie entraîne l’esprit à raisonner.','Eso dirían los griegos: Platón creía que la geometría entrena la mente para razonar.')},
    {t:tf('Aux deux.','Para las dos cosas.'),r:L_('teano','happy','Les Égyptiens s’en servaient pour mesurer, les Grecs pour démontrer… et aujourd’hui elle sert partout, des ponts aux jeux vidéo.','Los egipcios la usaban para medir, los griegos para demostrar… y hoy se usa para todo, desde los puentes hasta los videojuegos.')}]},
  {id:'d4',q:tf('La servante avait-elle raison de se moquer de Thalès ?','¿Tenía razón la sirvienta al reírse de Tales?'),opts:[
    {t:tf('Oui : il faut regarder où on met les pieds.','Sí: hay que mirar dónde pisas.'),r:L_('tales','neutral','Elle a un peu raison… mais si personne ne regardait les étoiles, personne n’aurait prévu une éclipse. On dit que moi, je l’ai fait.','Tiene su parte de razón… pero si nadie mirara las estrellas, nadie habría predicho un eclipse. Dicen que yo lo hice.')},
    {t:tf('Non : sans rêveurs, pas de découvertes.','No: sin soñadores no hay descubrimientos.'),r:L_('tales','happy','Aristote raconte que, pour prouver que la philosophie sert à quelque chose, j’ai prévu une grosse récolte d’olives et loué tous les pressoirs. Je suis devenu riche !','Aristóteles cuenta que, para demostrar que la filosofía sirve, adiviné una gran cosecha de aceitunas y alquilé todas las prensas. ¡Me hice rico!')},
    {t:tf('Il faut faire les deux.','Hay que hacer las dos cosas.'),r:L_('teano','happy','Regarder loin et regarder près. Dans ce puits, tu auras besoin des deux.','Mirar lejos y mirar cerca. En este pozo vas a necesitar las dos.')}]},
  {id:'d5',q:tf('√2 existe-t-il, si on ne peut jamais l’écrire en entier ?','¿Existe √2, si nunca se puede escribir entero?'),opts:[
    {t:tf('Oui : c’est la diagonale, je peux la tracer avec une règle.','Sí: es la diagonal, la puedo dibujar con una regla.'),r:L_('hipaso','happy','C’est ce que je pense ! Elle est là, la diagonale, parfaitement réelle. Ce qui n’existe pas, c’est une fraction qui la mesure.','¡Eso pienso yo! Ahí está la diagonal, perfectamente real. Lo que no existe es una fracción que la mida.')},
    {t:tf('Non : si on ne peut pas l’écrire, ce n’est pas un nombre.','No: si no se puede escribir, no es un número.'),r:L_('teano','neutral','Beaucoup de Grecs pensaient comme toi. Aujourd’hui, on dit qu’il existe et on l’appelle un nombre irrationnel : impossible à écrire en fraction, mais bien réel.','Muchos griegos pensaban así. Hoy decimos que existe y lo llamamos número irracional: no se puede escribir como fracción, pero existe.')},
    {t:tf('Il existe, mais c’est un nombre d’un autre genre.','Existe, pero es un número de otro tipo.'),r:L_('hipaso','happy','Exactement ! Un nombre nouveau, qui n’est pas une fraction. Aujourd’hui, on les appelle les irrationnels.','¡Exacto! Un número nuevo, que no es una fracción. Hoy los llamamos irracionales.')}]},
  {id:'d6',q:tf('Tu découvres une chose qui contredit ce que croit ton école. Que fais-tu ?','Descubres algo que contradice lo que cree tu escuela. ¿Qué haces?'),opts:[
    {t:tf('Je le dis : la vérité, c’est la vérité.','Lo cuento: la verdad es la verdad.'),r:L_('hipaso','worried','La légende dit que je l’ai raconté hors de l’école… et que j’ai disparu dans un naufrage. Ce n’est sûrement qu’une légende.','La leyenda dice que lo conté fuera de la escuela… y que desaparecí en un naufragio. Seguramente es solo una leyenda.')},
    {t:tf('Je le garde secret pour ne pas causer de problèmes.','Lo guardo en secreto para no causar problemas.'),r:L_('teano','worried','Les pythagoriciens étaient très discrets. Mais un secret pareil ne se garde pas pour toujours : la vérité finit par sortir.','Los pitagóricos eran muy reservados. Pero un secreto así no se puede guardar para siempre: la verdad acaba saliendo.')},
    {t:tf('Je vérifie encore une fois, puis je le dis.','Lo compruebo otra vez y luego lo cuento.'),r:L_('teano','happy','Très scientifique : vérifier, puis partager. Si la démonstration est bonne, personne ne pourra la nier.','Muy científico: revisar y luego compartir. Si la demostración es buena, nadie podrá negarla.')}]},
  {id:'d7',q:tf('Tous les carrés sont des rectangles. Donc, tous les rectangles sont des carrés ?','Todos los cuadrados son rectángulos. Entonces, ¿todos los rectángulos son cuadrados?'),best:1,opts:[
    {t:tf('Oui, c’est la même phrase à l’envers.','Sí, es lo mismo dicho al revés.'),r:L_('aristoteles','neutral','Attention : retourner une phrase change son sens. Une feuille de papier est un rectangle, mais pas un carré.','Cuidado: dar la vuelta a una frase cambia su significado. Un folio es un rectángulo, pero no es un cuadrado.')},
    {t:tf('Non : un rectangle peut avoir des côtés différents.','No: un rectángulo puede tener lados distintos.'),r:L_('aristoteles','happy','Bien raisonné ! « Si A, alors B » ne veut pas dire « si B, alors A ». Cette phrase retournée s’appelle la réciproque.','¡Bien razonado! «Si A, entonces B» no significa «si B, entonces A». Esa frase al revés se llama el recíproco.')},
    {t:tf('Ça dépend du rectangle.','Depende del rectángulo.'),r:L_('aristoteles','neutral','Presque : certains rectangles sont des carrés, mais pas tous. Donc la phrase générale est fausse.','Casi: algunos rectángulos son cuadrados, pero no todos. Así que la frase general es falsa.')}]},
  {id:'d8',q:tf('Qu’est-ce que démontrer ?','¿Qué es demostrar?'),best:1,opts:[
    {t:tf('Montrer beaucoup d’exemples qui marchent.','Enseñar muchos ejemplos que funcionan.'),r:L_('socrates','neutral','Et si demain on en trouve un qui ne marche pas ? Alors tu ne le savais pas : tu le croyais seulement.','¿Y si mañana aparece uno que no funciona? Entonces no lo sabías: solo lo creías.')},
    {t:tf('Raisonner étape par étape à partir de ce qu’on sait déjà, sans exception.','Razonar paso a paso desde lo que ya sabemos, sin excepciones.'),r:L_('socrates','happy','Alors personne ne pourra t’enlever cette vérité, pas même moi avec mes questions.','Entonces nadie podrá quitarte esa verdad, ni siquiera yo con mis preguntas.')},
    {t:tf('Que quelqu’un de très savant le dise.','Que lo diga alguien que sabe mucho.'),r:L_('socrates','neutral','Et qui vérifie celui qui sait beaucoup ? Moi, je sais seulement que je ne sais rien… c’est pour ça que je pose des questions.','¿Y quién comprueba al que sabe mucho? Yo solo sé que no sé nada… por eso pregunto.')}]},
  {id:'d9',q:tf('Peut-on mesurer ce qu’on ne peut pas toucher ?','¿Se puede medir algo que no se puede tocar?'),best:1,opts:[
    {t:tf('Non : pour mesurer, il faut aller jusque là-bas.','No: para medir hay que llegar hasta allí.'),r:L_('hiparco','neutral','Alors on ne connaîtrait jamais la taille de la Terre… et Ératosthène l’a mesurée avec l’ombre d’un bâton.','Entonces nunca sabríamos el tamaño de la Tierra… y Eratóstenes la midió con la sombra de un palo.')},
    {t:tf('Oui : avec des angles et des triangles.','Sí: con ángulos y triángulos.'),r:L_('hiparco','happy','C’est ça, la trigonométrie ! Si tu connais un angle et un côté, le triangle t’offre tout le reste.','¡Eso es la trigonometría! Si conoces un ángulo y un lado, el triángulo te regala los demás.')},
    {t:tf('Seulement en devinant.','Solo adivinando.'),r:L_('teano','neutral','Deviner ne suffit pas pour un astronome. Avec des angles, on peut vraiment calculer.','Adivinar no basta para un astrónomo. Con ángulos se puede calcular de verdad.')}]},
  {id:'d10',q:tf('Comment dirais-tu exactement où est la mouche ?','¿Cómo dirías exactamente dónde está la mosca?'),best:0,opts:[
    {t:tf('Avec deux nombres : sa distance à deux murs.','Con dos números: su distancia a dos paredes.'),r:L_('descartes','happy','Voilà ! Deux nombres, ses coordonnées, et n’importe quel point est repéré. La géométrie devient des nombres.','¡Voilà! Dos números, sus coordenadas, y cualquier punto queda localizado. Así la geometría se convierte en números.')},
    {t:tf('En la montrant du doigt.','Señalándola con el dedo.'),r:L_('descartes','neutral','Et si je te le demande par lettre ? Il nous faut quelque chose qu’on peut écrire : des nombres.','¿Y si te lo pregunto por carta? Necesitamos algo que se pueda escribir: números.')},
    {t:tf('En disant « près de la lampe ».','Diciendo «cerca de la lámpara».'),r:L_('descartes','neutral','Trop vague pour un mathématicien. Mieux : « à 2 mètres de ce mur et à 3 mètres de celui-là ».','Demasiado vago para un matemático. Mejor: «a 2 metros de esta pared y a 3 de aquella».')}]},
  {id:'d11',q:tf('Est-il juste d’interdire l’entrée à ceux qui ne savent pas la géométrie ?','¿Es justo prohibir la entrada a quien no sabe geometría?'),opts:[
    {t:tf('Oui : il faut arriver préparé.','Sí: hay que llegar preparado.'),r:L_('platon','neutral','Pour moi, la géométrie était la porte de la pensée : elle apprend à raisonner sur ce qu’on ne voit pas.','Para mí, la geometría era la puerta del pensamiento: enseña a razonar sobre lo que no se ve.')},
    {t:tf('Non : l’école, c’est fait pour apprendre.','No: la escuela está para aprender.'),r:L_('teano','happy','Beaucoup pensent comme toi : aujourd’hui l’école est pour tout le monde, et la géométrie s’apprend à l’intérieur.','Muchos opinan como tú: hoy la escuela es para todos, y la geometría se aprende dentro.')},
    {t:tf('Oui, si on t’a appris avant ailleurs.','Sí, si antes te enseñan en otro sitio.'),r:L_('platon','neutral','Un juste milieu. Peut-être la phrase voulait-elle dire : ici, on vient pour penser sérieusement.','Un término medio. Quizá la frase quería decir: aquí se viene a pensar en serio.')}]},
  {id:'d12',q:tf('Maintenant tu connais le secret du temple. Qu’en feras-tu ?','Ahora conoces el secreto del templo. ¿Qué harás con él?'),opts:[
    {t:tf('Le garder secret, comme les pythagoriciens.','Guardarlo en secreto, como los pitagóricos.'),r:L_('hipatia','neutral','Un secret gardé meurt avec celui qui le garde. Si les copistes n’avaient pas partagé les livres, on ne saurait rien de Pythagore.','Un secreto guardado muere con quien lo guarda. Si los copistas no hubieran compartido los libros, hoy no sabríamos nada de Pitágoras.')},
    {t:tf('Le partager et l’expliquer aux autres.','Compartirlo y enseñarlo.'),r:L_('hipatia','happy','C’est la meilleure façon de faire survivre le savoir : l’expliquer aux autres. Apprendre en enseignant, c’est apprendre deux fois.','Esa es la mejor forma de que el saber sobreviva: explicarlo a otros. Aprender enseñando es aprender dos veces.')},
    {t:tf('M’en servir pour construire des choses.','Usarlo para construir cosas.'),r:L_('teano','happy','Des ponts, des écrans, des cartes, des satellites… Le théorème travaille encore tous les jours.','Puentes, pantallas, mapas, satélites… El teorema sigue trabajando cada día.')}]},
];
const DIL=Object.fromEntries(DILEMMAS.map(d=>[d.id,d]));
const SCENES={
  prologue:{bg:'samos',cast:['teano','pitagoras'],lines:[
    L_('nar','','Samos, une île grecque, il y a environ 2 500 ans.','Samos, isla griega, hace unos 2.500 años.'),
    L_('teano','happy','Te voilà enfin, {N} ! Je suis Théano. J’étudie dans l’école de Pythagore, à Crotone. Je serai ta guide dans le temple.','¡Por fin llegas, {N}! Soy Teano. Estudio en la escuela de Pitágoras, en Crotona. Seré tu guía en el templo.'),
    L_('pitagoras','neutral','Bienvenue. Dans mon école, nous croyons que tout est nombre : la musique, les étoiles, les formes…','Bienvenido. En mi escuela creemos que todo es número: la música, las estrellas, las formas…'),
    L_('pitagoras','neutral','Dans ce temple, nous avons caché notre plus grand secret : une règle que respectent tous les triangles rectangles.','Dentro de este templo escondimos nuestro mayor secreto: una regla que cumplen todos los triángulos rectángulos.'),
    L_('teano','neutral','Avant d’entrer, le maître pose toujours une question. Réfléchis bien : il n’y a pas de réponse bête.','Antes de entrar, el maestro siempre hace una pregunta. Piénsalo bien: no hay respuesta tonta.'),
    {dil:'d1'},
    L_('teano','happy','De toute façon, le temple ne s’ouvre qu’à ceux qui découvrent le secret de leurs propres yeux. Commence par la Salle des Carrés.','Sea como sea, el templo solo se abre a quien descubre el secreto con sus propios ojos. Empieza por la Cámara de los Cuadrados.'),
    L_('pitagoras','happy','Et souviens-toi : ne crois rien parce que c’est moi qui le dis. Vérifie-le.','Y recuerda: no te creas nada porque lo diga yo. Compruébalo.')]},
  c1:{bg:'tiles',cast:['teano','pitagoras'],lines:[
    L_('teano','neutral','Regarde le sol : sur chaque côté du triangle, quelqu’un a construit un carré de carreaux.','Mira el suelo: sobre cada lado del triángulo alguien construyó un cuadrado de baldosas.'),
    L_('pitagoras','neutral','Compte les carreaux de chaque carré. Les nombres vont te raconter quelque chose.','Cuenta las baldosas de cada cuadrado. Los números te contarán algo.'),
    L_('teano','worried','Mais attention : un exemple peut tromper. Comment saurons-nous si le secret marche toujours ?','Pero cuidado: un ejemplo puede engañar. ¿Cómo sabremos si el secreto vale siempre?'),
    {dil:'d2'},
    L_('teano','happy','D’abord, compte. Ensuite, au laboratoire, essaie autant de triangles que tu veux.','Primero, cuenta. Después, en el laboratorio, prueba todos los triángulos que quieras.')]},
  c2:{bg:'nile',cast:['teano','arpedonapta'],lines:[
    L_('nar','','Égypte. Chaque année, le Nil déborde et efface les limites des champs.','Egipto. Cada año, el Nilo se desborda y borra los límites de los campos.'),
    L_('arpedonapta','neutral','Je suis arpenteur. Quand l’eau redescend, nous tendons des cordes pour mesurer à nouveau les terres de chaque famille.','Soy agrimensor. Cuando baja el agua, tensamos cuerdas para volver a medir las tierras de cada familia.'),
    L_('arpedonapta','happy','Avec une corde à 12 nœuds, je fais un triangle de 3, 4 et 5 morceaux. Et le coin sort droit !','Con una cuerda de 12 nudos hago un triángulo de 3, 4 y 5 tramos. ¡Y la esquina sale recta!'),
    L_('teano','neutral','On raconte qu’ils faisaient comme ça, même si on n’en a pas de preuve sûre. Ce qui est sûr, c’est que ça marche.','Se cuenta que lo hacían así, aunque no hay pruebas seguras. Lo que sí sabemos es que funciona.'),
    {dil:'d3'},
    L_('arpedonapta','neutral','À toi : il y a des gouffres à traverser. Calcule chaque corde avant que la torche s’éteigne.','Ahora tú: hay abismos que cruzar. Calcula cada cuerda antes de que se apague la antorcha.')]},
  c3:{bg:'well',cast:['teano','tales'],lines:[
    L_('tales','wow','Aïe ! Aide-moi à sortir. Je marchais en regardant les étoiles et… je suis tombé dans le puits.','¡Ay! Ayúdame a salir. Iba mirando las estrellas y… me he caído al pozo.'),
    L_('teano','neutral','C’est Thalès de Milet, le premier grand sage grec. C’est Platon qui raconte l’anecdote : une servante s’est moquée de lui.','Es Tales de Mileto, el primer gran sabio griego. La anécdota la cuenta Platón: una sirvienta se rio de él.'),
    L_('tales','sad','Elle a ri parce que je voulais connaître le ciel et que je ne voyais pas ce qu’il y avait à mes pieds.','Se rio porque quería conocer el cielo y no veía lo que tenía a los pies.'),
    {dil:'d4'},
    L_('tales','neutral','Pour descendre, il te faut des échelles de la bonne longueur. Attention : cette fois, l’échelle est l’hypoténuse.','Para bajar necesitas escaleras de la medida justa. Cuidado: ahora la escalera es la hipotenusa.')]},
  c7:{bg:'fountain',cast:['teano','hipaso'],lines:[
    L_('hipaso','worried','Théano… Qui est-ce ? Tu es venue me surveiller ?','Teano… ¿Quién es? ¿Has venido a vigilarme?'),
    L_('teano','neutral','Calme-toi, Hippase. Ce visiteur vient apprendre. Raconte-lui ce que tu as découvert.','Tranquilo, Hipaso. Viene a aprender. Cuéntale lo que descubriste.'),
    L_('hipaso','neutral','Nous, les pythagoriciens, croyons que toute mesure peut s’écrire comme une fraction de nombres entiers : 3/2, 7/5…','Los pitagóricos creemos que toda medida se puede escribir como una fracción de números enteros: 3/2, 7/5…'),
    L_('hipaso','neutral','Mais j’ai calculé la diagonale d’un carré de côté 1 avec le théorème : d² = 1 + 1 = 2. Donc d = √2.','Pero calculé la diagonal de un cuadrado de lado 1 con el teorema: d² = 1 + 1 = 2. Así que d = √2.'),
    L_('hipaso','wow','Et √2 n’est aucune fraction. Je l’ai démontré. Ses décimales continuent pour toujours sans se répéter : 1,41421356…','Y √2 no es ninguna fracción. Lo demostré. Sus decimales siguen para siempre sin repetirse: 1,41421356…'),
    {dil:'d5'},{dil:'d6'},
    L_('teano','neutral','La fontaine ne donne de l’eau qu’à ceux qui comprennent les racines. Vas-y.','La fuente solo da agua a quien entiende las raíces. Adelante.')]},
  c4:{bg:'library',cast:['teano','aristoteles'],lines:[
    L_('aristoteles','neutral','Bienvenue à la bibliothèque. Je suis Aristote. J’ai écrit les règles de la logique : comment raisonner sans se tromper.','Bienvenido a la biblioteca. Soy Aristóteles. Escribí las reglas de la lógica: cómo razonar sin equivocarse.'),
    L_('aristoteles','angry','Le scribe qui a écrit ces parchemins ne les respectait pas : il a mélangé des données inutiles et des unités différentes.','El escriba que escribió estos pergaminos no las respetaba: mezcló datos inútiles y unidades distintas.'),
    L_('aristoteles','neutral','Avant d’entrer, une petite épreuve de logique.','Antes de entrar, una prueba de lógica.'),
    {dil:'d7'},
    L_('teano','neutral','Retiens-le : la réciproque n’est pas toujours vraie. Pour Pythagore, si… mais il faudra le démontrer plus tard.','Recuérdalo: el recíproco no siempre es verdad. Con el de Pitágoras, sí… pero habrá que demostrarlo más adelante.'),
    L_('aristoteles','neutral','Maintenant, aux parchemins : avant de calculer, repère ce qu’est chaque donnée.','Ahora, a los pergaminos: antes de calcular, marca qué es cada dato.')]},
  c8:{bg:'tribunal',cast:['teano','socrates','euclides'],lines:[
    L_('nar','','Athènes. Sur la place, un homme pieds nus pose des questions à tout le monde.','Atenas. En la plaza, un hombre descalzo hace preguntas a todo el mundo.'),
    L_('socrates','neutral','Alors c’est toi, le nouvel explorateur, {N} ? On m’a dit que tu sais que ce triangle est rectangle. Comment le sais-tu ?','¿Así que tú eres el nuevo explorador, {N}? Me han dicho que sabes que este triángulo es rectángulo. ¿Cómo lo sabes?'),
    L_('teano','neutral','Socrate ne donne jamais de réponses. Il pose des questions… jusqu’à ce que tu découvres toi-même ce que tu penses.','Sócrates nunca da respuestas. Solo pregunta… hasta que descubres tú mismo lo que piensas.'),
    {dil:'d8'},
    L_('euclides','neutral','Socrate a raison. Dans mes Éléments, juste après le théorème, j’ai démontré sa réciproque.','Sócrates tiene razón. En mis Elementos, justo después del teorema, demostré su recíproco.'),
    L_('euclides','neutral','Si le carré du plus grand côté est égal à la somme des carrés des deux autres, le triangle est rectangle. Et sinon, il ne l’est pas : c’est la contraposée.','Si el cuadrado del lado mayor es igual a la suma de los cuadrados de los otros dos, el triángulo es rectángulo. Y si no coinciden, no lo es: es el contrarrecíproco.'),
    L_('teano','happy','Dans ce tribunal, chaque triangle accusé mérite une démonstration. Rédige avec soin.','En este tribunal, cada triángulo acusado merece una demostración. Redacta con cuidado.')]},
  c9:{bg:'observatory',cast:['teano','hiparco'],lines:[
    L_('hiparco','neutral','Regarde le ciel. Je suis Hipparque. Depuis l’île de Rhodes, j’ai mesuré les étoiles : j’en ai fait un catalogue de plusieurs centaines.','Mira el cielo. Soy Hiparco. Desde la isla de Rodas medí las estrellas: hice un catálogo con cientos de ellas.'),
    L_('hiparco','worried','Je voulais savoir à quelle distance est la Lune. Mais on ne peut pas y aller avec une corde !','Quería saber a qué distancia está la Luna. ¡Pero no se puede llegar con una cuerda!'),
    {dil:'d9'},
    L_('hiparco','neutral','J’ai fait une table qui relie les angles aux cordes d’un cercle. Des siècles plus tard, en Inde, Aryabhata a utilisé des demi-cordes : le sinus.','Hice una tabla que relacionaba ángulos y cuerdas de un círculo. Siglos después, en la India, Aryabhata usó medias cuerdas: el seno.'),
    L_('teano','neutral','Ici, tu utiliseras le cosinus : le côté adjacent divisé par l’hypoténuse. Attention, calculatrice en degrés.','Aquí usarás el coseno: el cateto contiguo dividido entre la hipotenusa. Ojo, la calculadora en grados.')]},
  c10:{bg:'crypt',cast:['teano','descartes'],lines:[
    L_('nar','','Un saut dans le temps : la France, au XVIIe siècle.','Un salto en el tiempo: Francia, siglo XVII.'),
    L_('descartes','neutral','Bonjour. Je suis René Descartes. On raconte qu’un matin, au lit, je regardais une mouche se promener au plafond…','Bonjour. Soy René Descartes. Se cuenta que una mañana, en la cama, miraba una mosca que paseaba por el techo…'),
    {dil:'d10'},
    L_('descartes','neutral','Et avec des coordonnées, la distance entre deux points se calcule avec… devine ? Pythagore.','Y con coordenadas, la distancia entre dos puntos se calcula con… ¿adivinas? Pitágoras.'),
    L_('descartes','wow','Et si la mouche s’envole ? Il faut un troisième nombre : la hauteur. Bienvenue dans l’espace.','¿Y si la mosca echa a volar? Hace falta un tercer número: la altura. Bienvenido al espacio.'),
    L_('teano','neutral','Retiens sa phrase la plus célèbre : « Je pense, donc je suis. » Il doutait de tout pour trouver quelque chose de sûr.','Recuerda su frase más famosa: «Pienso, luego existo». Dudaba de todo para encontrar algo seguro.')]},
  c5:{bg:'sealed',cast:['teano','platon'],lines:[
    L_('platon','neutral','Je suis Platon. À l’entrée de mon école, l’Académie, on dit qu’il était écrit : « Que nul n’entre ici s’il n’est géomètre. »','Soy Platón. En la entrada de mi escuela, la Academia, se dice que había un aviso: «Que no entre nadie que no sepa geometría».'),
    {dil:'d11'},
    L_('platon','neutral','Cette salle s’est scellée. Tu ne sortiras qu’en utilisant tout ce que tu as appris.','Esta cámara se ha sellado. Solo saldrás si usas todo lo que has aprendido.')]},
  c6:{bg:'hall',cast:['teano','guardian'],lines:[
    L_('guardian','angry','QUI RÉVEILLE LE GARDIEN ?','¿QUIÉN DESPIERTA AL GUARDIÁN?'),
    L_('teano','worried','Mon élève vient avec moi, Gardien. Il a parcouru tout le temple.','Viene conmigo, Guardián. Ha recorrido todo el templo.'),
    L_('guardian','neutral','Beaucoup de sages ont connu mon secret sous des noms différents. En Chine, on l’appelait gougu. Prouve que tu le maîtrises en entier.','Muchos sabios conocieron mi secreto con nombres distintos. En China lo llamaban gougu. Demuestra que lo dominas entero.'),
    L_('teano','happy','Hypoténuses, racines, réciproques, cosinus, distances… Tu peux le faire, {N} !','Hipotenusas, raíces, recíprocos, cosenos, distancias… ¡Tú puedes, {N}!')]},
  o_c1:{bg:'library',cast:['teano','euclides'],lines:[
    L_('euclides','neutral','Salut. Je suis Euclide, d’Alexandrie. J’ai vécu environ 200 ans après Pythagore.','Saludos. Soy Euclides, de Alejandría. Viví unos 200 años después de Pitágoras.'),
    L_('euclides','happy','Ce que tu as vu avec des carreaux, je l’ai démontré dans mon livre, les Éléments : c’est la proposition 47 du premier livre.','Lo que has visto con baldosas, yo lo demostré en mi libro, los Elementos: es la proposición 47 del primer libro.'),
    L_('euclides','neutral','Je n’ai pas utilisé d’exemples. Je suis parti de quelques vérités évidentes et j’ai raisonné étape par étape. Ainsi, le théorème vaut pour tous les triangles rectangles.','No usé ejemplos. Partí de unas pocas verdades evidentes y fui razonando paso a paso. Así, el teorema vale para todos los triángulos rectángulos.'),
    L_('teano','happy','Retiens bien son nom. Tu le reverras au Tribunal des Triangles.','Guarda bien su nombre. Volverás a verlo en el Tribunal de los Triángulos.')]},
  o_c7:{bg:'fountain',cast:['teano','hipaso'],lines:[
    L_('hipaso','happy','Tu as compris les racines ! Maintenant tu sais pourquoi √2 m’a tant fait trembler.','¡Has entendido las raíces! Ahora sabes por qué √2 me hizo temblar tanto.'),
    L_('teano','neutral','Les pythagoriciens ont dû accepter qu’il existe des longueurs qu’aucune fraction ne mesure. Les mathématiques ont grandi grâce à cette surprise.','Los pitagóricos tuvieron que aceptar que hay longitudes que ninguna fracción mide. Las matemáticas crecieron gracias a esa sorpresa.')]},
  o_c6:{bg:'hall',cast:['teano','guardian','hipatia','pitagoras'],lines:[
    L_('guardian','happy','Tu as vaincu. Le temple est à toi.','Has vencido. El templo es tuyo.'),
    {bg:'alexandria'},
    L_('nar','','Alexandrie, vers l’an 400. La ville de la grande Bibliothèque.','Alejandría, hacia el año 400. La ciudad de la gran Biblioteca.'),
    L_('hipatia','neutral','Bonjour. Je suis Hypatie. J’enseigne les mathématiques et la philosophie, comme mon père, Théon.','Hola. Soy Hipatia. Enseño matemáticas y filosofía, como mi padre, Teón.'),
    L_('hipatia','neutral','Théon a préparé une édition des Éléments d’Euclide qu’on a recopiée à la main pendant des siècles. C’est comme ça que le théorème est arrivé jusqu’à toi.','Teón preparó una edición de los Elementos de Euclides que se copió a mano durante siglos. Así llegó el teorema hasta ti.'),
    {dil:'d12'},
    L_('teano','happy','Merci de m’avoir accompagnée, {N}. Le temple restera ici : reviens quand tu veux chercher plus d’étoiles.','Gracias por acompañarme, {N}. El templo seguirá aquí: vuelve cuando quieras a por más estrellas.'),
    L_('pitagoras','happy','Et souviens-toi : ne crois rien parce que c’est moi qui le dis. Vérifie-le… et démontre-le !','Y recuerda: no te creas nada porque lo diga yo. Compruébalo… ¡y demuéstralo!')]},
};
const OUTROS={c1:'o_c1',c7:'o_c7',c6:'o_c6'};
const SCENE_TITLE={prologue:tf('Prologue · Samos','Prólogo · Samos'),o_c1:tf('Euclide','Euclides'),o_c7:tf('Après la fontaine','Después de la fuente'),o_c6:tf('Épilogue · Alexandrie','Epílogo · Alejandría')};
const playerName=()=>S.duel.p1||t('explorateur','explorador');
const withName=s=>s.replace(/\{N\}/g,esc(playerName()));
const dropName=s=>s.replace(/,\s*\{N\}/g,'').replace(/\{N\},?\s*/g,'').replace(/\s+([!?.,])/g,'$1').replace(/¡\s+/g,'¡');
/* ---------- motor de diálogo ---------- */
const TALK={on:false};
function playScene(id,o={}){const sc=SCENES[id];if(!sc)return Promise.resolve();
  return new Promise(res=>{TALK.on=true;hush();if(R)R.paused=true;const prevMus=AU.cur&&AU.cur.name;musicPlay('talk');
    const box=$('#talk');box.hidden=false;box.innerHTML=`<div class="tk-scene" id="tkScene">${sceneBG(sc.bg)}</div><div class="tk-cast"><div class="tk-p left" id="tkL"></div><div class="tk-p right" id="tkR"></div></div>
      <div class="tk-box" id="tkBox"><div class="tk-name" id="tkName"></div><p class="tk-text" id="tkText" aria-live="polite"></p><div class="tk-opts" id="tkOpts" hidden></div><div class="tk-foot"><span class="tk-hint">${TOUCH?t('Touche pour continuer','Toca para continuar'):t('Clic ou Entrée pour continuer','Clic o Intro para continuar')}</span><button class="btn tiny ghost" id="tkSkip">${t('Passer','Saltar')} ⏭</button></div></div>`;
    const fitCast=()=>{const b=$('#tkBox');if(b)box.style.setProperty('--tkb',(b.offsetHeight+26)+'px');};fitCast();let ro=null;try{ro=new ResizeObserver(fitCast);ro.observe($('#tkBox'));}catch(e){}
    const queue=sc.lines.slice();let typing=false,full='',timer=null,ended=false,waitChoice=false;
    const setP=(slot,who,mood)=>{const el=$(slot==='left'?'#tkL':'#tkR');const key=who+':'+mood;if(el.dataset.k===key)return;const isNew=el.dataset.who!==who;el.dataset.k=key;el.dataset.who=who;el.innerHTML=who?portrait(who,mood):'';if(isNew&&who){el.classList.remove('enter');void el.offsetWidth;el.classList.add('enter');}};
    const show=(Ln)=>{const who=Ln.w||'nar',c=CAST[who]||CAST.nar;const side=who==='nar'?null:who==='teano'?'left':'right';
      if(side)setP(side,who,Ln.m||'neutral');
      $$('.tk-p').forEach(p=>p.classList.toggle('dim',p.dataset.who!==who));
      $('#tkName').innerHTML=who==='nar'?'':`<b style="color:${c.col}">${esc(T(c.n))}</b><span>${esc(T(c.role))}</span>`;$('#tkName').hidden=who==='nar';$('#tkBox').classList.toggle('nar',who==='nar');
      const raw=T(Ln.t);full=withName(raw);const el=$('#tkText');el.innerHTML='';typing=true;$('#tkBox').classList.remove('ready');let k=0;const pt=plain(full);
      say(dropName(raw),'narr',{who});
      const tick=()=>{if(!typing)return;k+=reduced()?9999:2;if(k%6===0)sfx('type');if(k>=pt.length){typing=false;el.innerHTML=full;$('#tkBox').classList.add('ready');return;}el.textContent=pt.slice(0,k);timer=setTimeout(tick,16);};tick();};
    function step(){if(ended||waitChoice)return;if(!queue.length)return finish();const Ln=queue.shift();
      if(Ln.bg){const s2=$('#tkScene');s2.classList.remove('fade');void s2.offsetWidth;s2.classList.add('fade');s2.innerHTML=sceneBG(Ln.bg);$('#tkL').innerHTML='';$('#tkR').innerHTML='';$('#tkL').dataset.who='';$('#tkR').dataset.who='';$('#tkL').dataset.k='';$('#tkR').dataset.k='';return step();}
      if(Ln.dil){const D=DIL[Ln.dil];waitChoice=true;typing=false;
        $('#tkName').innerHTML=`<b style="color:var(--torch-hi)">${ico('owl')} ${t('Dilemme','Dilema')}</b><span>${t('Il n’y a pas de mauvaise réponse : explique-toi à toi-même pourquoi.','No hay respuesta mala: piensa por qué eliges la tuya.')}</span>`;$('#tkName').hidden=false;$('#tkBox').classList.remove('nar','ready');
        $('#tkText').innerHTML=esc(T(D.q));say(T(D.q),'narr',{who:'teano'});
        const op=$('#tkOpts');op.hidden=false;op.innerHTML=D.opts.map((x,i)=>`<button class="btn choice tk-o" data-i="${i}"><kbd>${i+1}</kbd> ${esc(T(x.t))}</button>`).join('');fitCast();
        op.onclick=e=>{const b=e.target.closest('.tk-o');if(!b)return;e.stopPropagation();const i=+b.dataset.i;const first=S.dil[D.id]==null;S.dil[D.id]=i;save();sfx('choice');op.hidden=true;op.innerHTML='';waitChoice=false;
          if(first){const n=gainXP(D.best===i?15:10);toast(`${relicSVG({d:P.owl})}<span><small>${t('Sagesse','Sabiduría')}</small><b>+${n} XP</b></span>`,2200);if(DILEMMAS.every(d=>S.dil[d.id]!=null))grant('filosofo');}
          queue.unshift(D.opts[i].r);step();};
        return;}
      show(Ln);}
    function adv(){if(ended||waitChoice)return;if(typing){typing=false;clearTimeout(timer);$('#tkText').innerHTML=full;$('#tkBox').classList.add('ready');return;}sfx('click');step();}
    function finish(){if(ended)return;ended=true;if(ro)ro.disconnect();hush();removeEventListener('keydown',kd,true);box.hidden=true;box.innerHTML='';TALK.on=false;S.seen[id]=todayStr();save();if(R)R.paused=false;if(prevMus&&prevMus!=='talk')musicPlay(prevMus);res();}
    const kd=e=>{if(!TALK.on)return;if(waitChoice&&/^[1-3]$/.test(e.key)){const b=$(`#tkOpts .tk-o[data-i="${+e.key-1}"]`);if(b){e.preventDefault();e.stopPropagation();b.click();}return;}if(e.key===' '||e.key==='Enter'){e.preventDefault();e.stopPropagation();adv();}if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(!waitChoice)finish();}};addEventListener('keydown',kd,true);
    $('#tkBox').addEventListener('click',e=>{if(e.target.closest('#tkSkip')||e.target.closest('#tkOpts'))return;adv();});$('#tkScene').addEventListener('click',adv);
    $('#tkSkip').onclick=e=>{e.stopPropagation();/* los dilemas no se saltan: se salta hasta el siguiente dilema pendiente */const di=queue.findIndex(x=>x.dil&&S.dil[x.dil]==null);if(waitChoice)return;if(di>=0){queue.splice(0,di);hush();typing=false;step();}else finish();};
    step();});}
