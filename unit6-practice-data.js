const modes = ['Detective del futuro','Construí la oración','El error escondido','Viaje por el mundo','Extreme adjectives','Reading Detective','Gran reto mixto'];
const bank = [[],[],[],[],[],[]];
const forms = ['will / won’t','be going to','present continuous','present simple','future continuous'];
const why = ['Will sirve para reaccionar en el momento, ofrecer ayuda o prometer algo.','Am/is/are going to destaca una intención previa o una señal actual.','Be + verbo en -ing presenta el acuerdo como ya organizado.','El present simple comunica un horario oficial.','Will be + verbo en -ing muestra una acción en curso a esa hora.'];
const cases = [
 ['Se corta la luz. En ese instante te ofrecés a buscar una linterna.','Jurás ahora que no vas a contar el secreto.','El bolso de tu amigo se rompe y decidís ayudarlo en el acto.','Te piden ayuda y en ese momento prometés llamar esta noche.'],
 ['Ves un vaso inclinarse en el borde. Anticipá la caída basándote en esa señal.','Ya decidiste ahorrar para una bici, aunque todavía no arreglaste la compra. Destacá tu intención.','Sale humo de la tostadora. Anticipá lo que va a pasar a partir de esa señal.','Tenés pensado aprender batería algún día y todavía no reservaste clases. Destacá tu intención.'],
 ['La dentista confirmó un turno para el jueves. Presentalo como acuerdo confirmado.','Vos y Lara ya acordaron encontrarse a las seis. Destacá el encuentro organizado.','Pagaron y confirmaron la reserva para el sábado. Contá el arreglo personal.','Tenés entradas y ya acordaste con Nico dónde verse. Contá el encuentro organizado.'],
 ['Informá la hora de salida que figura en el tablero ferroviario.','Comunicá la hora de apertura que indica el programa oficial del museo.','Anunciá el inicio del acto según el cronograma escolar.','Leé la salida del último ferry según el horario de la empresa.'],
 ['Ensayás de 19 a 21. ¿Qué estructura muestra la acción en pleno desarrollo a las 20?','El vuelo dura de 9 a 12. Describí lo que estará ocurriendo a las 10.','Vas a cocinar de 12 a 13. Describí la acción en curso a las 12:30.','El partido va de 16 a 18. Describí qué estarán haciendo los jugadores a las 17.']
];
cases.forEach((group,i)=>group.forEach(prompt=>bank[0].push({prompt, options:forms, answer:forms[i], why:why[i], scene:i===3?'station':i===4?'clock':'future'})));
const order = [
 ['A las ocho estaré ensayando.','I|will|be|rehearsing|at eight.','will be + verbo en -ing'],
 ['¿Estarás trabajando al mediodía?','Will|you|be|working|at noon?','Will + sujeto + be + verbo en -ing'],
 ['No estaremos viajando esta noche.','We|won’t|be|travelling|tonight.','won’t be + verbo en -ing'],
 ['Voy a reservar un asiento.','I|am|going to|book|a seat.','am going to + verbo base'],
 ['¿Van a llevar un mapa?','Are|they|going to|bring|a map?','Are + sujeto + going to + verbo base'],
 ['Nos encontramos con Sol el lunes.','We|are|meeting|Sol|on Monday.','are meeting expresa el encuentro organizado'],
 ['El tranvía sale a las siete.','The tram|leaves|at seven.','leaves lleva -s con sujeto singular'],
 ['No me voy a olvidar.','I|won’t|forget.','won’t + verbo base']
];
order.forEach(([prompt,parts,rule])=>bank[1].push({prompt,parts:parts.split('|'),answer:parts.replaceAll('|',' '),why:'La estructura es ' +rule+'.',scene:'blocks'}));
function add(group,prompt,answer,others,why,scene,passage) {
 bank[group].push({prompt,answer,options:[answer,...others.split('|')],why,scene,passage});
}
add(2,'She will brings the tickets. Corregí el verbo.','bring','bringing|brought','Después de will se usa el verbo base.','blocks');
add(2,'At nine we will be wait. Corregí wait.','waiting','waits|waited','Después de will be, la forma continua lleva -ing.','clock');
add(2,'The last bus leave at seven. Corregí leave.','leaves','leaving|leave','El horario va en present simple y the bus es singular.','station');
add(2,'They are going visit the coast. Corregí el tramo final.','going to visit','going to visiting|going visits','La construcción es be going to + verbo base.','blocks');
add(2,'Are you meet the guide at ten? Conservá el present continuous.','meeting','met|meets','Are + verbo en -ing forma el present continuous.','clock');
add(2,'Will she be sleeps at midnight? Corregí sleeps.','sleeping','sleep|slept','Will + sujeto + be + verbo en -ing.','clock');
add(3,'En el aeropuerto: “We need to register for our flight.” ¿Qué deben hacer?','check in','get off|come back','Check in es registrarse antes de volar.','airport');
add(3,'“This is our stop. Let’s ___ the tram.”','get off','check in|get on','Get off es bajarse; get on es subirse.','station');
add(3,'Querés un solo pasaje que cubra ida y vuelta.','return ticket','one-way ticket|boarding pass','Return ticket cubre ambos trayectos.','station');
add(3,'Lleva pasajeros y sus autos de una orilla a otra cada media hora.','ferry','canoe|coach','Un ferry cumple un servicio regular de cruce.','port');
add(3,'El folleto usa un sustantivo general e incontable. “Air ___ is getting cheaper.”','travel','trip|journey','Travel nombra los viajes en general; trip y journey se refieren a viajes o trayectos concretos.','airport');
add(3,'Elegí la palabra que destaca el trayecto entre dos lugares, no la visita completa.','journey','trip|travel','Journey enfoca el desplazamiento; trip puede incluir la visita y el regreso.','station');
add(3,'“We went on a school ___ and visited a museum after lunch.” Elegí la expresión habitual para una excursión escolar.','trip','journey|travel','School trip es la expresión habitual para una excursión escolar.','tour');
add(3,'Estás recorriendo monumentos y lugares de interés.','sightseeing','checking in|sailing','Sightseeing es visitar lugares de interés.','tour');
const extremes = [
 ['very cold','freezing','Temperatura extremadamente baja.'],['very big','huge','Tamaño muy grande.'],['very small','tiny','Tamaño muy chico.'],['very tired','exhausted','Cansancio intenso.'],['very impressive','amazing','Algo causa admiración o sorpresa.'],['very bad','awful','Algo resulta muy malo o desagradable.'],['very old','ancient','Puede referirse a algo de una época muy lejana.'],['very tasty','delicious','El sabor es muy bueno.'],['very pleased','delighted','La persona está muy contenta.'],['very memorable','unforgettable','Es una experiencia que resulta difícil olvidar.']
];
extremes.forEach(([base,answer,reason],i)=>add(4,(i<4?'Completá la escala: ':'Elegí el adjetivo que mejor encaja con ') + base,answer,[1,3,5].map(n=>extremes[(i+n)%10][1]).join('|'),reason+' La equivalencia es aproximada y depende del contexto.','scale'));
const readings = [
 ['NORTH LINE\nWeekday departures: 08:10 and 09:40. On Sundays, trains start at 10:15.','What is the earliest Sunday departure?','10:15','08:10|09:40','La pista es “On Sundays, trains start at 10:15.”','station'],
 ['SCHOOL TRIP\nMeet at the sports hall at 08:00. Bring lunch. Water will be provided.','What should students bring?','Lunch','Water|Sports equipment','La pista es “Bring lunch.” El agua se provee.','tour'],
 ['Hi Ava! The café is closed. We’re meeting at the bookshop instead. Same time: 4:30. — Max','What has changed?','The meeting place','The meeting time|The person she’s meeting','La pista es “at the bookshop instead”. “Same time” confirma que la hora sigue igual.','tour'],
 ['FOR SALE\nUsed city bike, £70. Collect on Saturday. Helmet included. No delivery.','What comes with the bike?','A helmet','Home delivery|A new lock','La pista es “Helmet included.”','tour'],
 ['MARITIME MUSEUM\nThe main gallery closes at 5. The shop stays open until 6. Photography is allowed without flash.','When does the shop close?','At 6','At 5|The notice doesn’t say','La pista es “The shop stays open until 6.”','port'],
 ['ISLAND FERRY\nPassengers with bikes must arrive 30 minutes early. Foot passengers must arrive 15 minutes early.','Who needs to arrive half an hour early?','Passengers with bikes','Foot passengers|All passengers','La primera línea exige 30 minutos a quienes llevan bicicleta.','port']
];
readings.forEach(([passage,prompt,answer,other,reason,scene])=>add(5,prompt,answer,other,reason,scene,passage));
add(2,'We won’t to take the tram. Corregí el final.','take the tram','taking the tram|takes the tram','Won’t va seguido directamente del verbo base.','station');
add(2,'The museum open at ten on Tuesdays. Corregí open.','opens','opening|open','The museum es singular, por eso el horario usa opens.','tour');
add(5,'Which departure can you catch with a bike?', 'The 14:20 departure.', 'The 12:10 departure.|Both departures.', 'El aviso aclara “Bicycles accepted on the 14:20 service only.”', 'station', 'COAST LINE\nTrains leave at 12:10 and 14:20. Bicycles accepted on the 14:20 service only.');
add(5,'What do Saturday visitors need to reserve?', 'A workshop place.', 'A museum ticket.|A locker.', '“Book a workshop place in advance” se refiere al taller. La entrada es libre.', 'tour', 'SATURDAY AT THE SCIENCE MUSEUM\nMuseum entry is free. Book a workshop place in advance. Lockers are available at reception.');
add(3,'Relacioná el dibujo con el nombre del vehículo.','tram','coach|ferry','El tranvía circula sobre rieles urbanos.','tram');
add(4,'Clasificá “exhausted” según la cualidad que intensifica.','Cansancio','Temperatura|Tamaño','Exhausted describe un cansancio intenso.','scale');
add(4,'“Everyone asked for another slice. The cake was ___.”','delicious','awful|huge','Pedir otra porción sugiere que gustó el sabor. Delicious describe un sabor excelente.','scale');
