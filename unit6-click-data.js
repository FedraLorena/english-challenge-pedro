const ideas = [
 ['Predicción incierta','Quizás algún día viaje a Japón.','Maybe I’ll travel to Japan someday.','Pedro imagina una posibilidad. Todavía no expresa una decisión.','Pensamiento'],
 ['Intención previa','Tengo pensado viajar a Japón algún día.','I’m going to travel to Japan someday.','La intención ya existía antes de hablar, aunque todavía no reservó nada.','Intención → viaje'],
 ['Plan organizado','Ya tengo el pasaje. Viajo a Japón el sábado.','I’m flying to Japan on Saturday.','El pasaje y el día muestran que el viaje ya está organizado.','Pasaje confirmado'],
 ['Horario establecido','El avión sale el sábado a las 8.','The plane leaves at 8 on Saturday.','La hora forma parte del horario del servicio.','Salida · 08:00'],
 ['Decisión espontánea','¡Qué buena oferta! La voy a comprar.','I’ll buy it!','Ve la oferta y decide en ese mismo momento.','Oferta → decisión'],
 ['Acción futura en desarrollo','Mañana a las 8 voy a estar viajando.','I’ll be travelling at 8 tomorrow.','A las 8 miramos el viaje en pleno desarrollo.','Inicio → 08:00 → llegada']
];
const situations = [
 ['Quizás llueva mañana.','Creo que nos tocará un rival difícil.','Tal vez vea nieve estas vacaciones.'],
 ['Tengo pensado empezar el gimnasio algún día.','Ya decidí ahorrar para una guitarra, aunque todavía no la elegí.','Hace semanas que quiero aprender a programar y ya me propuse hacerlo.'],
 ['Ya saqué turno con el médico para mañana a las 10.','Compramos las entradas y arreglamos encontrarnos a las seis.','Reservé cancha con mi equipo para el viernes.'],
 ['En el cartel dice que el colectivo sale a las 7:30.','Según el cronograma, el museo abre a las nueve.','La función figura a las 18 en la cartelera.'],
 ['Se te cayó la mochila. ¡Te ayudo!','Sonó el timbre. ¡Yo abro!','Veo una oferta por primera vez y digo: ¡La compro!'],
 ['Mañana a las 9 voy a estar rindiendo inglés.','El ensayo dura de 5 a 7. A las 6 voy a estar tocando.','A mitad del vuelo, al mediodía, voy a estar cruzando la cordillera.']
];
const forms = ['Will','Be going to','Present continuous','Present simple','Future continuous'];
const mapping = [0,1,2,3,0,4];
const clinic = [
 ['Creo que algún día voy a visitar al médico.','I think I’ll see a doctor someday.'],
 ['Ya decidí pedir turno.','I’m going to make an appointment.'],
 ['Tengo un turno confirmado para mañana.','I’m seeing the doctor tomorrow.'],
 ['El consultorio abre mañana a las nueve.','The clinic opens at nine tomorrow.'],
 ['Mañana a las diez estaré hablando con el médico.','I’ll be talking to the doctor at ten tomorrow.']
];
const builds = [
 ['sujeto + will + verbo base','I|will|call|tonight.','I won’t call tonight.','Will you call tonight?'],
 ['sujeto + am/is/are + going to + verbo base','I|am|going to|book|a room.','I’m not going to book a room.','Are you going to book a room?'],
 ['sujeto + am/is/are + verbo en -ing','We|are|meeting|the guide|tomorrow.','We aren’t meeting the guide tomorrow.','Are you meeting the guide tomorrow?'],
 ['sujeto + verbo. Con he/she/it, agregá -s o -es según el verbo','The train|leaves|at nine.','The train doesn’t leave at nine.','Does the train leave at nine?'],
 ['sujeto + will be + verbo en -ing','Will|you|be|studying|at eight?','I won’t be studying at eight.','Will you be studying at eight?']
];
const examClick = [
 [['The phone rings. Make an offer right now. “I ___ it!”','’ll answer','answer|am answering'],['“I promise I ___ your secret.”','won’t tell','don’t tell|am not telling'],['A friend drops their books. Offer help on the spot. “I ___ them.”','’ll pick up','pick up|picked up'],['You’ve just heard the news. Make a quick decision. “I ___ her now.”','’ll call','called|call']],
 [['You’ve already decided to repaint the room. Use going to. “We ___ it blue.”','are going to paint','is going to paint|are going to painting'],['Look! The glass is sliding off the table. Use going to. “It ___.”','is going to fall','going to fall|is going to falling'],['Ask about an intention with going to.','Are you going to apply?','Do you going to apply?|Are you going to applying?'],['Use going to to show a prior decision. “She ___ a camera.”','is going to buy','is going to buys|going to buy']],
 [['The guide confirmed the appointment. Use the present continuous. “We ___ her tomorrow.”','are meeting','meet|are meet'],['Your band has reserved the studio. Use the present continuous. “We ___ on Friday.”','are recording','record|recorded'],['Ask about a confirmed plan in the present continuous.','Are you leaving tomorrow?','Do you leave tomorrow?|Did you leave tomorrow?'],['The dinner booking is confirmed. Use the present continuous. “They ___ at seven.”','are having dinner','have dinner|are have dinner']],
 [['Use the published timetable. “The coach ___ at 6:20.”','departs','depart|departing'],['Ask for the official opening time in the present simple.','What time does the library open?','What time does the library opens?|What time is the library opening?'],['According to the programme, the first match ___ at noon. Use the present simple.','starts','start|is starting'],['Use the official schedule. “The doors ___ at eight.”','open','opens|opening']],
 [['You’ll be on the road from 9 to 11. “At 10, I ___.”','will be driving','will be drive|will start driving'],['You study from 6 to 8. Ask whether the same activity will be in progress for your friend at 7.','Will you be studying at seven?','Will you start studying at seven?|Will you be study at seven?'],['Class finishes at five. Use the negative future continuous for six. “I ___ in class at six.”','won’t be sitting','won’t be sit|won’t sitting'],['The oven runs from 1 to 2. Describe the action in progress at 1:30. “The bread ___ then.”','will be baking','will be bake|will start baking']]
];
