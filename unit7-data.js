// Contenido original basado en el temario proporcionado para Unit 7.
const unit7Tech = [
  ['Apps','aplicaciones','I use apps to practise English.','Elegís una herramienta para estudiar en el teléfono.'],
  ['Comment','comentario','Her comment was helpful.','Leés una opinión debajo de una publicación.'],
  ['Instant messaging','mensajería instantánea','Instant messaging helps us organise meetings.','Conversás por mensajes que llegan al instante.'],
  ['Password','contraseña','My password is hard to guess.','Protegés el acceso a una cuenta.'],
  ['Privacy settings','configuración de privacidad','Check your privacy settings.','Elegís quién puede ver tu información.'],
  ['Profile','perfil','My profile shows my interests.','La página de tu cuenta presenta información sobre vos.'],
  ['Social networking sites','redes sociales','We share news on social networking sites.','Las personas se conectan y comparten publicaciones.'],
  ['Video game','videojuego','This video game has a creative mode.','Jugás una aventura digital.'],
  ['Change your privacy settings','cambiar tu configuración de privacidad','Change your privacy settings to limit who can see your photos.','Querés limitar la visibilidad de tus fotos.'],
  ['Check your phone','revisar tu teléfono','Check your phone for the new message.','Buscás un mensaje que acaba de llegar.'],
  ['Delete a post','borrar una publicación','Delete a post if you shared it by mistake.','Publicaste algo por error y querés quitarlo.'],
  ['Install antivirus software','instalar software antivirus','Install antivirus software on your computer.','Querés ayudar a proteger la computadora de programas maliciosos.'],
  ['Post a comment','publicar un comentario','Post a comment below the video.','Querés dejar una opinión debajo de un video.'],
  ['Report a problem','informar un problema','Report a problem if the app stops working.','Avisás de una falla al servicio.'],
  ['Send instant messages','enviar mensajes instantáneos','We send instant messages to plan our project.','Coordinás un trabajo con tus compañeros.'],
  ['Set a password','establecer una contraseña','Set a password for your new account.','Estás creando el acceso a una cuenta.'],
  ['Tag a friend','etiquetar a un amigo','Tag a friend in the photo.','Vinculás a tu amigo con una publicación usando su nombre de cuenta.'],
  ['Update your profile','actualizar tu perfil','Update your profile with your new interests.','Querés cambiar la información de tu cuenta.'],
  ['Upload a photo','subir una foto','Upload a photo from your computer.','Transferís una imagen de tu dispositivo al sitio.']
];
const unit7Phrasal = [
  ['Chill out','relajarse','I chill out by listening to music.','Después de estudiar, escuchás música para relajarte.'],
  ['Get away from','alejarse de','Let’s get away from our screens.','Querés pasar un rato lejos de las pantallas.'],
  ['Hang out with','pasar tiempo con','I hang out with my friends after school.','Pasás un rato informal con amigos.'],
  ['Log off','cerrar la sesión','Log off when you finish using the school computer.','Terminaste de usar una cuenta en una computadora compartida.'],
  ['Meet up with','encontrarse con','I’ll meet up with my cousins at the park.','Arreglás un encuentro con tus primos.'],
  ['Print out','imprimir','Print the timetable out.','Querés una copia en papel de un archivo.'],
  ['Switch off','apagar','Switch your phone off. Switch it off.','Apagás el teléfono para concentrarte.'],
  ['Sign out','cerrar la sesión','Sign out of your account before leaving.','Salís de una cuenta al terminar. Log off puede expresar una idea similar.'],
  ['Take up','empezar una actividad o pasatiempo','I’d like to take up the guitar.','Querés empezar un pasatiempo.'],
  ['Work out','hacer ejercicio','We work out at the sports centre.','En este contexto hablás de entrenar el cuerpo.']
];
const unit7Readings = [
  {
    title:'A Day Without My Phone',
    vocab:'battery = batería · bench = banco para sentarse · at first = al principio · notice = notar',
    text:'Last Sunday, my phone battery died before breakfast. At first, I felt bored. I wanted to send instant messages, but I went to the park instead. I met up with my friend Leo near a bench, and we played football. I noticed birds and people that I usually ignore when I look at my screen. If I had charged my phone, I would have stayed in my room. Now I switch it off during meals. If the weather is fine next Sunday, I will go to the park again. I would feel lonely if I spent every weekend online.'
  },
  {
    title:'The School Technology Challenge',
    vocab:'repair = reparar · lend = prestar · workshop = taller · device = dispositivo · share = compartir',
    text:'Our class is designing a technology project for the school fair. We want to repair old devices and lend them to students. If we collect five laptops, we will run a free workshop. Nina says, “If I knew more about computers, I would help with repairs.” She is learning with our teacher. Last week, we forgot to save our poster before the computer crashed. If we had saved it, we wouldn’t have lost our work. Now we save regularly. We will upload a photo of each repaired device, but we won’t tag students without asking them. The project is about helping people, not selling computers.'
  }
];
function u7Card(title, explanation, left, right, example, translation, check, answer, wrong, why) {
  return {title, explanation, structure:[left,right], example, translation, check, answer, wrong, why};
}
const unit7Missions = [
  {id:'first',title:'First Conditional',icon:'🔮',game:'Future Predictor',cards:[
    u7Card('Una posibilidad y su consecuencia','Lo usamos para una situación posible del presente o futuro y su consecuencia probable. Primero pensá qué condición tiene que cumplirse.','IF + present simple','WILL + verbo base','If I study, I will pass the exam.','Si estudio, aprobaré el examen.','¿La oración presenta una posibilidad real o un pasado que ya ocurrió?','Una posibilidad real','Un pasado que ya ocurrió','Estudiar es una condición posible; aprobar es su consecuencia probable.'),
    u7Card('Cada parte tiene su trabajo','Después de if, en este modelo, va present simple. Will aparece en la consecuencia. Con he/she/it, el presente suele llevar -s.','If she practises','she will improve','If she practises, she will improve.','Si practica, va a mejorar.','En la condición “If she ___”, ¿qué forma corresponde?','practises','will practise','La condición de este modelo usa present simple, practises.'),
    u7Card('Negar y cambiar el orden','Podés negar con don’t/doesn’t en la condición y con won’t en la consecuencia. Si empezás con if, separá las dos partes con coma. Si la condición va al final, normalmente no hace falta.','If + don’t/doesn’t + verbo','won’t + verbo base','I won’t play if I don’t finish my homework.','No voy a jugar si no termino la tarea.','¿“If I finish, I will rest” conserva su significado como “I will rest if I finish”?','Sí, cambia el orden de las partes','No, siempre hay que empezar con if','El orden de las partes puede cambiar. La condición sigue usando presente.')
  ]},
  {id:'second',title:'Second Conditional',icon:'🎮',game:'What Would You Do?',cards:[
    u7Card('Imaginar otra realidad','Lo usamos para situaciones hipotéticas, improbables o irreales del presente o futuro. El pasado gramatical acá marca distancia con la realidad.','IF + past simple','WOULD + verbo base','If I had more time, I would play the guitar.','Si tuviera más tiempo, tocaría la guitarra.','¿Esta persona cuenta algo que ya sucedió?','No, imagina otra situación','Sí, had siempre cuenta el pasado','Had es past simple de have, pero en esta estructura presenta una hipótesis.'),
    u7Card('Would y wouldn’t','La condición usa pasado y la consecuencia usa would o wouldn’t + verbo base. No agregues -s ni to después de would. Formas útiles: have → had (tener); know → knew (saber); live → lived (vivir); practise → practised (practicar); study → studied (estudiar).','If I didn’t have a phone','I wouldn’t send messages','If I didn’t have a phone, I wouldn’t send messages.','Si no tuviera teléfono, no enviaría mensajes.','Después de would, ¿cuál es la forma base?','play','played','Would se combina con play. El pasado pertenece a la condición.'),
    u7Card('Consejo y comparación','If I were you es una fórmula de consejo. Usá were con todos los sujetos en este modelo. First plantea una posibilidad real; second invita a imaginar.','First · if I have, I will','Second · if I had, I would','If I were you, I would rest.','Si yo fuera vos, descansaría.','Para aconsejar, ¿qué fórmula estamos practicando?','If I were you','If I will be you','Were introduce la situación imaginaria de estar en el lugar de otra persona.')
  ]},
  {id:'third',title:'Third Conditional',icon:'⏳',game:'Time Machine',cards:[
    u7Card('Un pasado que ya no cambia','Imaginamos una condición diferente en el pasado y su resultado alternativo. Primero identificá lo que realmente pasó.','IF + had + participio','WOULD HAVE + participio','If I had charged my phone, I wouldn’t have missed the call.','Si hubiera cargado mi teléfono, no habría perdido la llamada.','¿Todavía puedo cambiar esa llamada del pasado?','No, imagino otro resultado','Sí, es un plan para mañana','Third Conditional imagina cómo habría sido diferente un pasado terminado.'),
    u7Card('Dos bloques diferentes','Had + participio arma la condición. Would have + participio arma la consecuencia. No intercambies los auxiliares. La negativa puede ser hadn’t o wouldn’t have.','If I had saved the file','I wouldn’t have lost it','If I had saved the file, I wouldn’t have lost it.','Si hubiera guardado el archivo, no lo habría perdido.','¿Qué bloque corresponde a la consecuencia?','would have + participio','had + participio','Would have + participio presenta el resultado que no ocurrió.'),
    u7Card('Regulares e irregulares','Regular: charge → charged → charged; save → saved → saved. Irregular: go → went → gone; see → saw → seen; eat → ate → eaten; take → took → taken; lose → lost → lost; know → knew → known; send → sent → sent; forget → forgot → forgotten; have → had → had; be → was/were → been; tell → told → told; keep → kept → kept; leave → left → left. Regulares: miss → missed; arrive → arrived; travel → travelled; reply → replied; die → died. Después de had o would have usá la tercera forma.','If + had gone / had seen','would have taken / would have eaten','If we had left earlier, we would have seen the start.','Si hubiéramos salido antes, habríamos visto el comienzo. Leave → left → left.','Después de had, ¿qué forma de go corresponde?','gone','went','Went es pasado simple. Gone es el participio que necesita had.')
  ]},
  {id:'master',title:'Conditional Master',icon:'⚡',game:'Conditional Battle',cards:[
    u7Card('Una idea, tres miradas','First mira un futuro posible. Second imagina otro presente o futuro. Third imagina otro pasado. Buscá el sentido antes de mirar los auxiliares.','First · if + presente → will','Second · if + pasado → would','If I practise, I will improve. If I practised more, I would improve.','Si practico, mejoraré. Si practicara más, mejoraría.','“Si hubiera practicado, habría mejorado” habla de…','Un pasado alternativo','Un horario futuro','Hubiera y habría ubican la hipótesis en el pasado.'),
    u7Card('Compará la misma acción','If I have time, I’ll play. If I had time, I’d play. If I had had time, I would have played. En la tercera, el primer had es auxiliar y el segundo es el participio de have.','First · posible / Second · imaginario','Third · if + past perfect → would have','If I had had time, I would have played.','Si hubiera tenido tiempo, habría jugado.','En “had had”, ¿qué hace el segundo had?','Es el participio de have','Es un segundo futuro','Have → had → had. El auxiliar had precede al participio had.'),
    u7Card('Reescribir sin perder el sentido','Al transformar una historia, conservá el momento y la relación causa-consecuencia. No basta con cambiar una sola palabra.','Posible · I study → I will pass','Pasado alternativo · I had studied → I would have passed','I didn’t study, so I failed. If I had studied, I would have passed.','No estudié y desaprobé. Si hubiera estudiado, habría aprobado.','¿Por qué usamos third en esa transformación?','Porque los hechos ya ocurrieron','Porque todo resultado usa would have','La historia original es pasada y terminada.')
  ]},
  {id:'tech',title:'Technology & IT',icon:'🕵️',game:'Tech Detective',cards:[
    u7Card('Palabras para la vida digital','Apps son aplicaciones; comment es un comentario; instant messaging es mensajería instantánea; password es contraseña. Cada una nombra algo distinto.','Herramienta · apps','Acceso · password','I use apps to learn, and I protect my account with a password.','Uso aplicaciones para aprender y protejo mi cuenta con una contraseña.','¿Qué protege el acceso a una cuenta?','Password','Comment','Password es contraseña; comment es una opinión escrita debajo de una publicación.'),
    u7Card('Perfil y privacidad','Profile es la página de tu cuenta. Privacy settings decide quién puede ver la información. Social networking sites son redes sociales. Video game es videojuego.','Información · profile','Visibilidad · privacy settings','Change your privacy settings to limit who can see your profile.','Cambiá la configuración de privacidad para limitar quién ve tu perfil.','Querés limitar quién ve tus fotos. ¿Qué cambiás?','Privacy settings','Video game','La visibilidad se controla en la configuración de privacidad.'),
    u7Card('Acciones digitales','En las tarjetas de vocabulario de abajo vas a ver cada expresión con traducción, ejemplo y una situación. Distinguí subir contenido, borrarlo, comentar y avisar de una falla.','Upload · subir / Delete · borrar','Post · publicar / Report · informar','Report a problem if the app stops working.','Informá un problema si la aplicación deja de funcionar.','Si la app falla, ¿qué acción corresponde?','Report a problem','Tag a friend','Report a problem comunica la falla al servicio.')
  ]},
  {id:'phrasal',title:'Screen-life balance',icon:'🧩',game:'Phrasal Match',cards:[
    u7Card('Un verbo y otras palabras','Un phrasal verb combina un verbo con otra palabra o palabras y forma un significado. Chill out es relajarse; take up es empezar un pasatiempo. El contexto ayuda a entenderlo.','chill out · relajarse','take up · empezar un pasatiempo','I chill out with music. I want to take up the guitar.','Me relajo con música. Quiero empezar a tocar la guitarra.','¿Qué expresión sirve para empezar un hobby?','Take up','Chill out','Take up expresa empezar una actividad; chill out expresa relajarse.'),
    u7Card('Separables y pronombres','Switch off y print out son separables. Con un sustantivo podés usar switch off your phone o switch your phone off. Con pronombre, ponelo en el medio.','Switch your phone off','Switch it off','Print the poster out. Print it out.','Imprimí el póster. Imprimilo.','¿Dónde va it en esta estructura?','Switch it off','Switch off it','Con este verbo separable, el pronombre objeto va entre verbo y partícula.'),
    u7Card('Grupos que se mantienen juntos','Hang out with, meet up with y get away from mantienen el grupo antes del objeto: hang out with them. Log off y sign out pueden significar cerrar la sesión; no vamos a enfrentarlos como si uno fuera incorrecto por sí solo. Work out acá es hacer ejercicio.','Hang out with your friends','Hang out with them','I’ll meet up with them after school.','Me voy a encontrar con ellos después del colegio.','¿Qué orden conserva el grupo?','Hang out with them','Hang them out with','With queda unido al grupo antes del objeto.')
  ]},
  {id:'reading',title:'Reading & comprehension',icon:'📖',game:'Reading Detective',cards:[
    u7Card('Prepará la lectura','Antes de leer, mirá el título y el vocabulario. Después buscá quién hace qué, cuándo y por qué. Para justificar true/false, encontrá una frase del texto.','Texto A · rutina sin teléfono','Texto B · proyecto escolar','If I had charged my phone, I would have stayed in my room.','Si hubiera cargado mi teléfono, me habría quedado en mi habitación.','¿Abrir el texto alcanza para demostrar comprensión?','No, necesito justificar mis respuestas','Sí, alcanza con abrirlo','Comprender requiere conectar la pregunta con la evidencia.'),
    u7Card('Inferir con pistas','Una inferencia une datos del texto para deducir una idea. Evitá agregar hechos que la lectura no cuenta. Vas a leer dos historias originales y responder sobre ambas.','Dato del texto','Conclusión apoyada en el dato','I noticed birds that I usually ignore.','Noté pájaros que normalmente ignoro.','¿Qué sugiere esa frase en el contexto del teléfono?','Prestó más atención a su entorno','Compró un teléfono nuevo','Notar cosas antes ignoradas sugiere un cambio de atención.'),
    u7Card('Reconocé las estructuras','First combina presente y will; second combina pasado y would; third combina had + participio y would have + participio. Leé también qué momento representa cada oración.','Posibilidad → First','Hipótesis presente → Second / pasado → Third','If we collect five laptops, we will run a free workshop.','Si juntamos cinco computadoras, haremos un taller gratuito.','¿Qué clase de situación muestra collect → will run?','Una posibilidad futura','Un pasado alternativo','El presente en la condición y will en la consecuencia construyen first conditional.')
  ]}
];
const unit7Bank = [];
function u7q(topic, prompt, answer, wrong, why, type='choice', parts=null, reading=null) {
  unit7Bank.push({id:topic+'-'+unit7Bank.filter(q=>q.topic===topic).length,topic,prompt,answer,wrong,why,type,parts,reading});
}
u7q('first','If I ___ tonight, I will be ready for the test.','study',['will study','studied'],'La condición posible usa presente. Will queda en el resultado.','gap');
u7q('first','If she practises every day, she ___ better.','will play',['plays','would played'],'La consecuencia probable usa will + verbo base.','gap');
u7q('first','Elegí la corrección de “If it will rain, we will stay home”.','If it rains, we will stay home.',['If it will rain, we stay home.','If it rain, we will stay home.'],'En la condición de este modelo va rains, presente con it.','error');
u7q('first','Ordená la consecuencia de una posibilidad: si termino la tarea, voy a jugar.','I will play if I finish my homework.',['I play will if I finish my homework.','I will play if I will finish my homework.'],'La cláusula if puede ir al final. Su verbo sigue en presente.','order',['I','will','play','if I finish my homework.']);
u7q('first','If you don’t charge your phone, it ___ working.','won’t keep',['wouldn’t kept','doesn’t will keep'],'Won’t + keep forma la consecuencia negativa. Keep significa seguir.','gap');
u7q('first','“I will help if you ask.” El cambio de orden conserva el significado.','True',['False'],'Equivale a If you ask, I will help. La condición es la misma.','truth');
u7q('first','If Leo ___ early, he will have time for breakfast.','gets up',['will get up','get up'],'Leo es tercera persona singular. Gets up es presente.','gap');
u7q('first','Future Predictor: llueve y querés expresar un resultado posible de esa condición.','If it rains, we will practise indoors.',['If it will rain, we will practise indoors.','If it rains, we would practised indoors.'],'Rains pone la condición en presente y will practise expresa el resultado probable.');
u7q('first','If I don’t save the file, I ___ my work.','will lose',['would lost','lose will'],'El resultado usa will lose. Lose significa perder.','gap');
u7q('first','Corregí “If she don’t study, she won’t pass”.','If she doesn’t study, she won’t pass.',['If she doesn’t studies, she won’t pass.','If she won’t study, she won’t pass.'],'Con she va doesn’t + verbo base.','error');
u7q('first','If the app works, we ___ instant messages.','will send',['will sent','would sending'],'Después de will va send, la forma base.','gap');
u7q('first','Reescribí “I will rest if I finish” empezando con if.','If I finish, I will rest.',['If I will finish, I rest.','If I finished, I will rest.'],'El orden cambia, pero finish sigue en presente y will rest es el resultado.','choice');

u7q('second','If I ___ a bigger room, I would practise the guitar there.','had',['have','would have'],'La habitación es imaginaria. Had es pasado simple de have en la condición.','gap');
u7q('second','If she knew the answer, she ___ us.','would tell',['will told','would told'],'La consecuencia de la hipótesis usa would + tell.','gap');
u7q('second','Corregí el consejo “If I was you, I will rest” usando el modelo estudiado.','If I were you, I would rest.',['If I were you, I will rest.','If I would be you, I rest.'],'Para este consejo usamos If I were you y would + verbo.','error');
u7q('second','If I had no internet, I ___ online games.','wouldn’t play',['won’t played','wouldn’t played'],'Wouldn’t + play expresa el resultado imaginario negativo.','gap');
u7q('second','Ordená el consejo.','If I were you, I would ask for help.',['If I were you, I ask would for help.','If I were you, I would asked for help.'],'Were introduce la hipótesis y would ask el consejo.','order',['If I were you,','I','would','ask','for help.']);
u7q('second','“If I had a spaceship, I would visit Mars” cuenta un viaje real que ya ocurrió.','False',['True'],'Imagina una nave y un viaje. La forma past no cuenta acá un hecho pasado.','truth');
u7q('second','No tengo una consola nueva. Imaginá qué haría si la tuviera.','If I had a new console, I would try that game.',['If I have a new console, I will try that game.','If I had had a new console, I would have tried that game.'],'Had + would try plantea otra situación presente. Las otras opciones miran un futuro posible o un pasado alternativo.');
u7q('second','If we ___ closer, we would hang out more often.','lived',['live','would live'],'Para la situación hipotética usamos pasado simple en la condición.','gap');
u7q('second','If I didn’t have homework, I ___ a song.','would record',['would recorded','will recorded'],'Would lleva record en forma base.','gap');
u7q('second','Corregí “If I would have more time, I would learn coding”.','If I had more time, I would learn coding.',['If I would had more time, I learn coding.','If I have more time, I would learned coding.'],'En second, if lleva pasado simple; would queda en el resultado.','error');
u7q('second','If she ___ here now, she would help us. Usá el modelo formal estudiado.','were',['will be','would be'],'Were es la forma de be que usamos en esta hipótesis.','gap');
u7q('second','Transformá “I don’t know how to repair it, so I can’t help” en una hipótesis presente.','If I knew how to repair it, I would help.',['If I know how to repair it, I will help.','If I had known how to repair it, I would have helped.'],'Knew y would help imaginan una capacidad que ahora no tiene.');

u7q('third','If I had ___ the photo, you would have seen it.','sent',['send','sending'],'Send → sent → sent. Después de had va el participio sent.','gap');
u7q('third','No cargué el teléfono y perdí la llamada. Elegí el pasado alternativo.','If I had charged my phone, I wouldn’t have missed the call.',['If I charged my phone, I wouldn’t miss the call.','If I have charged my phone, I won’t miss the call.'],'Had charged y wouldn’t have missed imaginan otro pasado. Missed es participio regular de miss.');
u7q('third','If she had saved the file, she ___ her work.','wouldn’t have lost',['wouldn’t lost','wouldn’t have lose'],'La consecuencia usa would not have + participio. Lose → lost → lost.','gap');
u7q('third','Corregí “If I would have seen it, I would have told you”.','If I had seen it, I would have told you.',['If I had saw it, I would have told you.','If I have seen it, I would told you.'],'La condición usa had seen. See → saw → seen; tell → told → told.','error');
u7q('third','Ordená el resultado alternativo del archivo que no guardaste.','If I had saved it, I would have kept my work.',['If I had saved it, I have would kept my work.','If I had saved it, I would kept have my work.'],'Would have precede al participio kept. Keep → kept → kept.','order',['If I had saved it,','I','would','have','kept my work.']);
u7q('third','“If I had taken the bus, I would have arrived earlier” imagina una diferencia en el pasado.','True',['False'],'Had taken y would have arrived describen otro pasado. Arrived es participio regular.','truth');
u7q('third','If we had ___ earlier, we would have seen the start.','gone',['went','go'],'Go → went → gone. Had necesita gone.','gap');
u7q('third','If he had eaten breakfast, he ___ hungry.','wouldn’t have been',['wouldn’t have be','wouldn’t been'],'La consecuencia requiere would have + been, participio de be.','gap');
u7q('third','Olvidé el pasaje y no viajé. Completá: If I hadn’t forgotten my ticket, I ___ .','would have travelled',['would travel','will travel'],'Como los hechos ya ocurrieron, usamos would have travelled. Travel es regular.','gap');
u7q('third','If I had ___ about the problem, I would have helped.','known',['knew','know'],'Know → knew → known. Had lleva participio.','gap');
u7q('third','Corregí “I would have saw the film if I had had time”.','I would have seen the film if I had had time.',['I would have see the film if I had had time.','I would seen the film if I had had time.'],'Después de would have va seen. Had had significa hubiera tenido.','error');
u7q('third','Reescribí “She didn’t save the photo, so she lost it”.','If she had saved the photo, she wouldn’t have lost it.',['If she saves the photo, she won’t lose it.','If she saved the photo, she wouldn’t lose it.'],'La historia está terminada. Cambiamos la condición y el resultado usando third.');

u7q('master','Tengo posibilidades reales de estudiar esta noche. ¿Qué modelo expresa su resultado futuro probable?','First',['Second','Third'],'First habla de una posibilidad real y su consecuencia.');
u7q('master','No soy director del colegio. Imagino qué cambiaría si lo fuera.','Second',['First','Third'],'Second imagina otro presente o futuro.');
u7q('master','Ayer no guardé el archivo. Imagino qué habría cambiado si lo hubiera guardado.','Third',['First','Second'],'Third reconstruye una alternativa a un pasado terminado.');
u7q('master','If I ___ enough tomorrow, I will buy the ticket.','save',['saved','had saved'],'Tomorrow y will buy presentan una posibilidad real: if + presente.','gap');
u7q('master','Si tuviera una guitarra eléctrica ahora, tocaría esa canción.','If I had an electric guitar, I would play that song.',['If I have an electric guitar, I will play that song.','If I had had an electric guitar, I would have played that song.'],'La hipótesis es presente, por eso usamos second.');
u7q('master','If I had practised last week, I ___ better yesterday.','would have played',['will play','would play'],'Last week y yesterday ubican una alternativa pasada.','gap');
u7q('master','“If I have time, I will help” y “If I had time, I would help” presentan exactamente la misma perspectiva.','False',['True'],'First plantea una posibilidad real. Second presenta una situación imaginaria.','truth');
u7q('master','Corregí la condición de un third conditional: If I ___ the message, I would have replied.','had seen',['saw','will see'],'Had seen es past perfect. Replied es el participio regular de reply.','gap');
u7q('master','Ordená la hipótesis presente.','If I knew the password, I would help.',['If I knew the password, I help would.','If I knew the password, I would helped.'],'Knew señala la hipótesis y would help la consecuencia.','order',['If I knew the password,','I','would','help.']);
u7q('master','Si mañana hace buen tiempo, voy a salir. Elegí el modelo correcto.','If the weather is good tomorrow, I will go out.',['If the weather will be good tomorrow, I go out.','If the weather is good tomorrow, I would gone out.'],'La condición posible usa is; el resultado usa will go.');
u7q('master','¿Qué parte imagina el resultado pasado en “If we had studied, we would have passed”?','we would have passed',['If we had studied','studied'],'Would have + participio forma la consecuencia imaginada.');
u7q('master','Transformá “I didn’t charge the battery, so it died” en un pasado alternativo.','If I had charged the battery, it wouldn’t have died.',['If I charge the battery, it won’t die.','If I charged the battery, it wouldn’t die.'],'Had charged y wouldn’t have died reconstruyen ese pasado. Died es participio regular de die.');
// Vocabulario: cada opción errónea tiene una función plausible distinta.
unit7Tech.forEach(([word,meaning,example,situation],i)=>{
  const others = [3,7,11].map(offset=>unit7Tech[(i+offset)%unit7Tech.length][0]);
  u7q('tech',situation+' Elegí la expresión correspondiente.',word,others,word+' significa '+meaning+'. Ejemplo: '+example,i%3===0?'gap':'choice');
});
unit7Phrasal.forEach(([word,meaning,example,situation],i)=>{
  // Log off y sign out comparten significado: nunca aparecen enfrentados.
  const others = unit7Phrasal.filter(([candidate])=>candidate!==word && !(['Log off','Sign out'].includes(word)&&['Log off','Sign out'].includes(candidate))).map(([candidate])=>candidate);
  u7q('phrasal',situation+' ¿Qué expresión sirve?',word,[others[i%others.length],others[(i+2)%others.length]],word+' significa '+meaning+'. '+example,i%2===0?'gap':'choice');
});
u7q('phrasal','Corregí “Switch off it” manteniendo el pronombre.','Switch it off.',['Switch off it.','Switch it.'],'Switch off es separable. Con it, el pronombre va en el medio.','error');
u7q('phrasal','Completá: “I want to spend time with my friends. I want to ___ them.”','hang out with',['hang them out with','hang out them with'],'Hang out with se mantiene junto antes del pronombre.','gap');
u7q('phrasal','Ordená la instrucción para una copia en papel.','Print it out.',['Print out it.','Out print it.'],'Print out es separable. Con it va print it out.','order',['Print','it','out.']);
u7q('phrasal','“I’ll meet up with them after school” mantiene el grupo correctamente.','True',['False'],'Meet up with mantiene with antes del objeto.','truth');

u7q('reading','Reading A: Why did the narrator go without the phone that morning?','The battery had died.',['The phone was at school.','A friend had borrowed it.'],'La primera frase dice “my phone battery died before breakfast”.','choice',null,0);
u7q('reading','Reading A: The narrator stayed alone in the room all day.','False',['True'],'Fue al parque y jugó al fútbol con Leo. La frase “we played football” lo demuestra.','truth',null,0);
u7q('reading','Reading A: What can we infer about attention that day?','The narrator paid more attention to the surroundings.',['The narrator ignored the park completely.','The narrator used the phone all afternoon.'],'“I noticed birds and people that I usually ignore” apoya esa inferencia.','choice',null,0);
u7q('reading','Reading A: Which sentence imagines another past?','If I had charged my phone, I would have stayed in my room.',['If the weather is fine next Sunday, I will go to the park again.','I would feel lonely if I spent every weekend online.'],'Had charged y would have stayed forman third conditional.','choice',null,0);
u7q('reading','Reading A: What does the narrator now do during meals?','Switches the phone off.',['Sends instant messages.','Charges Leo’s phone.'],'El texto dice “Now I switch it off during meals”.','choice',null,0);
u7q('reading','Reading A: “If the weather is fine next Sunday, I will go to the park again” is First Conditional.','True',['False'],'Is es presente y will go presenta el resultado de una posibilidad futura.','truth',null,0);
u7q('reading','Reading B: What is the purpose of the project?','To repair and lend old devices.',['To sell new computers.','To build video games for sale.'],'La segunda oración explica el objetivo. El final aclara que se trata de ayudar.','choice',null,1);
u7q('reading','Reading B: Nina already knows enough to repair every computer alone.','False',['True'],'“If I knew more...” y “She is learning with our teacher” muestran que sigue aprendiendo.','truth',null,1);
u7q('reading','Reading B: What did the class learn from losing the poster?','They should save their work regularly.',['They should stop using posters.','They should delete all their photos.'],'Perdieron el trabajo sin guardar y ahora guardan con frecuencia.','choice',null,1);
u7q('reading','Reading B: Which condition could lead to a free workshop?','Collecting five laptops.',['Selling five phones.','Tagging every student.'],'La pista es “If we collect five laptops, we will run a free workshop”.','choice',null,1);
u7q('reading','Reading B: The class will tag students without asking.','False',['True'],'El texto dice que no van a etiquetarlos sin preguntar.','truth',null,1);
u7q('reading','Reading B: “If I knew more about computers, I would help with repairs” is…','Second Conditional',['First Conditional','Third Conditional'],'Knew + would help presenta una hipótesis sobre la capacidad actual de Nina.','choice',null,1);
// Se agregan al final para conservar los identificadores del progreso existente.
u7q('reading','Reading A: Complete the sentence using evidence from the story. “At the park, the narrator ___.”','played football with Leo',['sent messages all afternoon','repaired five laptops'],'“I met up with my friend Leo” y “we played football” permiten completar la oración.','gap',null,0);
u7q('reading','Reading B: Complete the plan described in the text. “If the class collects five laptops, they will ___.”','run a free workshop',['sell the school computers','stop saving their work'],'La condición y su consecuencia aparecen juntas: “If we collect five laptops, we will run a free workshop.”','gap',null,1);
u7q('tech','Completá el diálogo: “The app keeps crashing.” “You should ___ to the support team.”','report a problem',['upload a photo','tag a friend'],'Report a problem significa informar una falla. El equipo de soporte necesita saber qué está fallando.','gap');
