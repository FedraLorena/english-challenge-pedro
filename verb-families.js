const VerbFamilies = (() => {
  const table=[['play','played','played','jugar'],['finish','finished','finished','terminar'],['go','went','gone','ir'],['eat','ate','eaten','comer'],['see','saw','seen','ver'],['write','wrote','written','escribir'],['do','did','done','hacer'],['have','had','had','tener']];
  const choice=(id,group,prompt,options,correct,why,errors)=>({id,group,prompt,options,correct,why,errors});
  const blocks=[
    {title:'La familia no se decide por el infinitivo',rule:'Mirá la transformación, no solo cómo termina el infinitivo.',diagram:'families'},
    {title:'Clasificar el verbo no es nombrar el tiempo',rule:'Dos preguntas distintas: ¿qué tipo de verbo es? ¿En qué tiempo está?',timeline:[['13:00','had eaten','Había comido'],['14:00','left','Salió']],sentence:'When Pedro left, he had already eaten.',translation:'Cuando Pedro salió, ya había comido.'},
    {title:'Reconstruí la historia antes de elegir',rule:'La acción anterior ya estaba terminada cuando ocurrió la otra.',timeline:[['17:00','had tuned','Había afinado la guitarra'],['18:00','recorded','Grabó un video']],sentence:'When Pedro recorded a video, he had already tuned his guitar.',translation:'Cuando Pedro grabó un video, ya había afinado su guitarra.'},
    {title:'Analizá una oración nueva y justificá',rule:'Ubicá los hechos → buscá la referencia → elegí la forma.',timeline:[['16:00','had written','Había escrito la canción'],['17:00','started','Empezó el ensayo']],sentence:'When rehearsal started, Pedro had already written the song.',translation:'Cuando empezó el ensayo, Pedro ya había escrito la canción.'}
  ];
  const exercises=[
    choice('vf01','Clasificá','Aplicá la idea a otros verbos: bailar → bailé y saber → supe. ¿Cómo los clasificás?',['Ambos regulares por su infinitivo.','Bailar es regular; saber es irregular.','Ambos irregulares.'],1,'Bailar sigue el modelo regular: bailé. Saber usa una raíz propia: supe. La terminación del infinitivo no decide la clasificación.',['La terminación agrupa infinitivos; no garantiza que sigan el modelo regular.','','Bailar sí sigue su modelo regular. No todo cambio de terminación es una irregularidad.']),
    choice('vf02','Clasificá','Otro par: vivir → viví y venir → vine. Ambos terminan en -ir. ¿Cuál es regular?',['Vivir.','Venir.','Los dos, porque terminan en -ir.'],0,'Vivir sigue su modelo (viví); venir tiene una forma propia (vine). -ar, -er e -ir no indican regularidad.',['','Vine es una forma propia de venir, que es irregular.','Las terminaciones no permiten decidir: hay que comparar cómo se conjugan.']),
    choice('vf03','Clasificá','Ahora sin copiar los ejemplos: practice → practiced; see → saw. ¿Qué pareja está bien clasificada?',['Practice irregular; see regular.','Ambos regulares porque están en pasado.','Practice regular; see irregular.'],2,'Practice agrega -ed: practiced. See usa una forma propia: saw. Regular e irregular clasifican al verbo, no al tiempo.',['Practiced sigue el modelo de -ed; saw no lo sigue.','Estar en pasado no hace regular a un verbo. See sigue siendo irregular.','']),
    choice('vf2-04','Elegí y justificá','“I played a game after school.” ¿Qué análisis explica la oración?',['Play es regular y played cuenta una acción terminada en Simple Past.','Played lleva -ed, así que es Past Perfect.','Play es regular; por eso no tiene tiempo verbal.'],0,'I played = jugué. Play es regular y aquí está en Simple Past. La familia y el tiempo son dos datos compatibles.',['','-Ed no basta para Past Perfect: haría falta had + participio.','Todo verbo conjugado se usa en una estructura temporal; regular no reemplaza al tiempo.']),
    choice('vf2-05','Clasificá dos dimensiones','“I had gone to school before it rained.” Elegí familia y tiempo de had gone.',['Go regular · Past Perfect.','Go irregular · Simple Past.','Go irregular · Past Perfect.'],2,'Go es irregular (went/gone). Had gone = había ido: had + participio, Past Perfect. La ida ocurrió antes de la lluvia.',['Gone no sigue el modelo regular de -ed.','La clasificación es correcta, pero had gone no es went: la estructura indica Past Perfect.','']),
    choice('vf2-06','Corregí','Un compañero dice: “I had played es regular, así que no puede ser Past Perfect”. ¿Cómo lo corregís?',['Es Past Perfect porque todos los participios son irregulares.','Play es regular y had played es Past Perfect: familia y tiempo se combinan.','Es Simple Past porque played termina en -ed.'],1,'I had played = había jugado; I had gone = había ido. Ambos son Past Perfect, con un verbo regular y otro irregular.',['Played es participio regular: no todos los participios son irregulares.','','No mires played aislado: had played es la estructura completa.']),
    {id:'vf2-07',group:'Ordená',prompt:'Otra historia: “When I sent the video at 20:00, I had already recorded it at 19:00”. Ordená los hechos.',actions:['Envié el video.','Grabé el video.'],correct:[1,0],why:'Primero grabé a las 19:00; después envié a las 20:00. Had recorded marca lo que ya estaba hecho; sent es el momento de referencia.'},
    choice('vf2-08','Relacioná forma y acción','En “When I sent the video, I had recorded it”, ¿cómo traducís had recorded en esta historia?',['Envié el video.','Había grabado el video.','Estaba grabando el video.'],1,'Had recorded = había grabado. La grabación ya estaba terminada cuando lo envié; no dice que todavía estaba grabando.',['Envié corresponde a sent, no a had recorded.','','Estaba grabando sugiere una acción en curso; had recorded señala algo ya terminado.']),
    choice('vf2-09','Justificá el tiempo','En esa historia nueva, ¿por qué sent está en Simple Past?',['Porque es la última palabra de acción que ocurrió.','Porque todos los verbos regulares se usan solo en Simple Past.','Porque cuenta el envío terminado, referencia para la grabación anterior.'],2,'Sent cuenta el envío de las 20:00. Had recorded destaca la grabación anterior. Send es irregular, pero eso no decide el tiempo: la estructura y la relación entre hechos lo justifican.',['La posición temporal por sí sola no explica la forma: importa cómo se relaciona con la otra acción.','Un verbo regular también puede formar Past Perfect con had + participio.','']),
    choice('vf2-10','Corregí la oración','Querés decir: “Cuando empezó la clase, yo ya había visto el video musical”. Corregí “When class started, I had saw the music video”.',['When class started, I had seen the music video.','When class started, I saw the music video.','When class started, I had see the music video.'],0,'Had seen conserva la idea de anterioridad: ya había visto el video cuando empezó la clase. Saw es pasado simple; seen es el participio que necesita had.',['','Saw cuenta vi, pero pierde la estructura que destaca ya había visto antes de la clase.','See es la base. Después de had, en esta estructura, necesitás seen.']),
    {id:'vf2-11',group:'Ordená una historia nueva',prompt:'“When the online match started, I had already done my homework.” Ordená los hechos aunque la oración mencione primero la partida.',actions:['Hice la tarea.','Empezó la partida online.'],correct:[0,1],why:'Primero hice la tarea; después empezó la partida. Had done señala la acción anterior. Done es participio de do; did sería pasado simple.'},
    choice('vf2-12','Elegí y justificá','Terminaste el nivel a las 20:00. Tu amigo llegó a las 20:30. Querés destacar que ya estaba terminado al llegar él. ¿Qué análisis sirve?',['I had finished the level when my friend arrived: had + participio destaca lo anterior.','I finished the level when my friend arrived: muestra que ya lo había terminado antes.','I had finish the level when my friend arrived: finish es regular y no cambia después de had.'],0,'Had finished destaca que el nivel ya estaba terminado antes de la llegada. Finished puede ser pasado o participio: la estructura had finished y la relación entre hechos justifican Past Perfect.',['','Finished solo puede contar una acción pasada, pero no marca explícitamente que ya estaba terminada antes de la llegada.','Regular no significa invariable: el participio de finish es finished.'])
  ];
  const scope=typeof location!=='undefined'?location.pathname.replace(/[^/]*$/,''):'/';
  const key=`english-challenge-unit4:pedro:verb-families:v1:${scope}`;
  const check=(e,a)=>Array.isArray(e.correct)?JSON.stringify(a)===JSON.stringify(e.correct):a===e.correct;
  const complete=(state,b)=>exercises.slice(b*3,b*3+3).every(e=>state.solved.includes(e.id));
  const unlocked=state=>{let b=0;while(b<blocks.length-1&&complete(state,b))b++;return b;};
  return {table,blocks,exercises,key,check,complete,unlocked};
})();
function initVerbFamilies(){
  const $=id=>document.querySelector('#'+id),el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const button=(label,cls,fn)=>{const b=el('button',cls,label);b.type='button';b.onclick=fn;return b;};
  const {exercises,blocks}=VerbFamilies;let state={cursor:0,solved:[]},canSave=true,selected=[],feedback='',success=false;
  try{const raw=localStorage.getItem(VerbFamilies.key);if(raw!==null){const data=JSON.parse(raw);if(data.version!==1||!Array.isArray(data.solved))throw Error();state={cursor:Number.isInteger(data.cursor)?Math.max(0,Math.min(11,data.cursor)):0,solved:[...new Set(data.solved.filter(id=>typeof id==='string'))]};state.cursor=Math.min(state.cursor,VerbFamilies.unlocked(state)*3+2);}}catch{canSave=false;}
  function storage(){$('families-storage').textContent=canSave?'Tu avance se guarda por separado. Los ejercicios de la versión anterior se conservan; las consignas nuevas se practican de nuevo.':'No se pudo recuperar o guardar esta sección. Podés practicar igual; los datos anteriores no se sobrescriben.';}
  function persist(){if(canSave)try{localStorage.setItem(VerbFamilies.key,JSON.stringify({...state,version:1}));}catch{canSave=false;}storage();}
  VerbFamilies.table.forEach(values=>{const row=el('tr');values.forEach((v,i)=>{const cell=el('td','',v);if(i<3)cell.lang='en';row.append(cell);});$('families-table').append(row);});
  function move(index){if(Math.floor(index/3)>VerbFamilies.unlocked(state))return;state.cursor=index;selected=[];feedback='';success=false;persist();render();$('families-concept').focus();}
  function drawConcept(parent,block,bi){
    if(block.diagram==='families'){
      const columns=el('div','vf-languages');
      const groups=[['CASTELLANO',[['cantar','canté',true],['comer','comí',true],['tener','tuve',false],['ir','fui',false]]],['INGLÉS',[['play','played',true],['finish','finished',true],['go','went',false],['eat','ate',false]]]];
      groups.forEach(([title,pairs])=>{const col=el('section','vf-language');col.append(el('h3','',title));pairs.forEach(([base,past,regular])=>{const row=el('div','vf-transform '+(regular?'vf-regular':'vf-irregular'));row.append(el('span','vf-type',regular?'REGULAR · sigue el modelo':'IRREGULAR · forma propia'));const flow=el('div','vf-flow');flow.append(el('strong','',base),el('span','vf-arrow','→'),el('strong','vf-result',past));if(title==='INGLÉS')flow.lang='en';row.append(flow);col.append(row);});columns.append(col);});parent.append(columns,el('p','vf-note','-ar / -er / -ir: terminaciones del infinitivo ≠ regularidad. En inglés, el modelo regular suele agregar -ed.'));
    }
    if(bi<2){
      const split=el('div','vf-dimensions');
      [['TIPO DE VERBO','¿Cómo cambia?','Regular ↔ Irregular'],['TIEMPO VERBAL','¿Qué relación temporal expresa?','Simple Past ↔ Past Perfect']].forEach(([label,question,values])=>{const branch=el('div');branch.append(el('strong','',label),el('span','',question),el('span','vf-down','↓'),el('b','',values));split.append(branch);});
      parent.append(split,el('p','vf-note','Se combinan: go es irregular; had gone está en Past Perfect.'));
    }
    if(block.timeline){
      const figure=el('figure','vf-figure');figure.append(el('figcaption','','EJEMPLO RESUELTO · dos momentos del pasado'));
      const line=el('ol','vf-time');line.setAttribute('aria-label','Línea temporal de izquierda a derecha: primero y después');
      block.timeline.forEach(([time,verb,translation],i)=>{const point=el('li',i===0?'vf-earlier':'vf-later');const en=el('strong','vf-verb',verb);en.lang='en';point.append(el('b','vf-step',i===0?'1 · PRIMERO':'2 · DESPUÉS'),el('span','vf-clock',time),el('span','vf-dot','●'),en,el('span','vf-translation',translation),el('span','vf-tense',i===0?'Past Perfect':'Simple Past'));line.append(point);});figure.append(line);
      const back=el('div','vf-lookback');back.append(el('span','vf-back-arrow','←'),el('strong','','Desde el segundo momento, miramos lo que YA había pasado.'));figure.append(back);
      const sentence=el('p','vf-sentence',block.sentence);sentence.lang='en';figure.append(sentence,el('p','vf-note',block.translation),el('p','vf-formula','had + participio → acción anterior · pasado simple → momento de referencia'));parent.append(figure);
    }
    if(bi===3)parent.append(el('p','vf-note','write → wrote → written · see → saw → seen · do → did → done. Después de had va el participio. Before/after no obligan a usar Past Perfect.'));
    parent.append(el('p','vf-transfer','Ahora probá con otros ejemplos. El gráfico resuelto no contiene las respuestas.'));
  }
  function render(){
    const bi=Math.floor(state.cursor/3),block=blocks[bi],e=exercises[state.cursor],area=$('families-practice');area.replaceChildren();
    $('families-progress').textContent=`${exercises.filter(e=>state.solved.includes(e.id)).length} de 12 explorados · bloque ${bi+1} de 4 · sin nota`;
    const nav=$('families-nav');nav.replaceChildren();blocks.forEach((item,i)=>{const b=button(`${i+1}. ${item.title}${VerbFamilies.complete(state,i)?' ✓':''}`,'secondary',()=>move(i*3));b.disabled=i>VerbFamilies.unlocked(state);if(i===bi)b.setAttribute('aria-current','step');nav.append(b);});
    const concept=$('families-concept');concept.replaceChildren(el('span','eyebrow',`BLOQUE ${bi+1} · EXPLICACIÓN BREVE`),el('h2','',block.title),el('p','',block.rule));
    drawConcept(concept,block,bi);
    area.append(el('span','eyebrow',`PRÁCTICA ${state.cursor%3+1} DE 3 · ${e.group}`),el('h2','practice-heading',e.prompt));
    const options=el('div','exercise-options');
    const result=answer=>{success=VerbFamilies.check(e,answer);const reason=!success&&e.errors?e.errors[answer]+' ':'';feedback=(success?'¡Bien razonado! ':'Revisemos: ')+reason+e.why+(success?'':' Podés reintentar.');if(success&&!state.solved.includes(e.id))state.solved.push(e.id);selected=[];persist();render();area.querySelector('[role="status"]').focus();};
    if(e.actions){
      area.append(el('p','activity-intro','Tocá primero la acción anterior y después la posterior.'));
      const timeline=el('ol','timeline');['Antes','Después'].forEach((label,i)=>{const li=el('li');li.append(el('strong','',label),el('span','',selected[i]===undefined?'Elegí una acción.':e.actions[selected[i]]));timeline.append(li);});area.append(timeline);
      e.actions.forEach((label,i)=>{const b=button(label,'',()=>{selected.push(i);if(selected.length===2)result(selected);else{render();area.querySelector('[role="status"]').focus();}});b.disabled=selected.includes(i);options.append(b);});
    }else e.options.forEach((label,i)=>options.append(button(label,'',()=>result(i))));
    area.append(options);
    const status=el('div',success?'feedback success':'feedback',feedback||(state.solved.includes(e.id)?'Ya resolviste esta actividad. Podés repetirla sin perder tu avance.':'Probá y justificá tu elección comparando los hechos y la estructura.'));status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.tabIndex=-1;area.append(status);
    const controls=el('div','practice-actions');controls.append(button('Reintentar','secondary',()=>{selected=[];feedback='';success=false;render();area.querySelector('button').focus();}));if(state.cursor>0)controls.append(button('Anterior','secondary',()=>move(state.cursor-1)));
    if(state.cursor<11){const next=button(state.cursor%3===2?'Siguiente concepto →':'Siguiente →','primary',()=>move(state.cursor+1));next.disabled=state.cursor%3===2?!VerbFamilies.complete(state,bi):!state.solved.includes(e.id);controls.append(next);}area.append(controls);
    if(!VerbFamilies.complete(state,bi))area.append(el('p','answer-line','Resolvé las tres actividades de este bloque para desbloquear el próximo concepto. Podés volver atrás y consultar la tabla.'));
    if(blocks.every((_,i)=>VerbFamilies.complete(state,i)))area.append(el('p','feedback success','¡Completaste la secuencia! Ante una oración nueva: ubicá los hechos, buscá la referencia pasada y justificá la estructura. Podés repetir cualquier bloque sin penalización.'));
  }
  storage();render();
}
if(typeof document!=='undefined')initVerbFamilies();
if(typeof module!=='undefined')module.exports={VerbFamilies};


