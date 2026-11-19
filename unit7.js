(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const key = 'english-challenge-unit7-v1';
  const content = $('u7-content');
  const finalMission = {id:'final',title:'Final Exam Simulator',icon:'🏆',game:'Final Mission'};
  const missions = [...unit7Missions,finalMission];
  const questionById = new Map(unit7Bank.map(q=>[q.id,q]));
  let active = 0;
  let consultation = false;
  let storageAvailable = true;
  let state = {missions:{},previous:{}};
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && saved.missions && typeof saved.missions === 'object' && !Array.isArray(saved.missions)) {
      state = {missions:saved.missions,previous:saved.previous && typeof saved.previous === 'object' ? saved.previous : {}};
    }
  } catch { storageAvailable = false; }

  function save() {
    try { localStorage.setItem(key,JSON.stringify(state)); }
    catch { storageAvailable = false; }
    $('u7-storage').textContent = storageAvailable
      ? 'El progreso se guarda en este navegador y dispositivo. Puede perderse al borrar sus datos o cambiar de dispositivo.'
      : 'Este navegador no pudo guardar el progreso. Podés seguir practicando mientras mantengas la página abierta.';
  }

  function record(index=active) {
    const id = missions[index].id;
    if (!state.missions[id] || typeof state.missions[id] !== 'object') state.missions[id] = {};
    return state.missions[id];
  }

  function unlocked(index) {
    return index === 0 || Boolean(record(index-1).passed);
  }

  function el(tag,text='',style='') {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = style;
    return element;
  }

  function en(tag,text,style) {
    const element = el(tag,text,style);
    element.lang = 'en';
    return element;
  }

  function button(text,action,style='secondary') {
    const control = el('button',text,style);
    control.type = 'button';
    control.onclick = action;
    return control;
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i=copy.length-1;i>0;i--) {
      const j = Math.floor(Math.random()*(i+1));
      [copy[i],copy[j]] = [copy[j],copy[i]];
    }
    return copy;
  }

  function frame(title,phase,current=1,total=1) {
    content.replaceChildren(el('h2',title,'u7-title'));
    $('u7-phase').textContent = phase;
    $('u7-progress').max = total;
    $('u7-progress').value = current;
    $('u7-rules').hidden = active===7 || consultation;
    content.focus();
  }

  function actions(...controls) {
    const row = el('div','','u7-actions');
    row.append(...controls);
    content.append(row);
  }

  function scene(left,right) {
    const graphic = el('div','','u7-scene');
    const labels = el('div','','u7-scene-labels');
    labels.append(el('span',left),el('span',right));
    const track = el('div','','u7-track');
    track.setAttribute('aria-hidden','true');
    graphic.append(labels,track);
    return graphic;
  }

  function structure(left,right) {
    const boxes = el('div','','u7-structure');
    [left,right].forEach((text,index)=>{
      const box = el('div');
      box.append(el('small',index===0?'Condición / punto de partida':'Resultado / significado'),el('strong',text));
      boxes.append(box);
    });
    return boxes;
  }

  function board() {
    consultation=false;
    $('u7-board').hidden=false;
    $('u7-play').hidden=true;
    const map=$('u7-map');
    map.replaceChildren();
    let completed=0;
    missions.forEach((mission,index)=>{
      const rec=record(index);
      if(rec.passed) completed++;
      const card=el('article','','u7-card');
      const icon=el('span',mission.icon,'u7-card-icon');
      icon.setAttribute('aria-hidden','true');
      const available=unlocked(index);
      const status=rec.passed?'✓ Completada':available?'Disponible':'Se abre al completar la misión anterior con 80 %';
      const launch=button(rec.passed?'Repasar y jugar':rec.card||rec.run||rec.learned?'Continuar':'Entrar',()=>open(index),'primary');
      launch.disabled=!available;
      launch.setAttribute('aria-label','Misión '+(index+1)+' · '+mission.title);
      card.append(icon,el('h2',(index+1)+' · '+mission.title),el('p',status));
      if(rec.best!==undefined) card.append(el('p','Mejor resultado · '+Math.round(rec.best)+' %'));
      card.append(launch);
      map.append(card);
    });
    $('u7-total').textContent=completed+' de 8 misiones completadas';
    $('u7-complete').hidden=completed!==8;
    save();
  }

  function open(index) {
    if(!unlocked(index)) return;
    active=index;
    consultation=false;
    $('u7-board').hidden=true;
    $('u7-play').hidden=false;
    resume();
  }

  function resume() {
    const rec=record();
    if(active===7) {
      if(rec.run) renderRun();
      else finalIntro();
    } else if(!rec.learned) {
      lesson(Number.isInteger(rec.card)&&rec.card>=0&&rec.card<3?rec.card:0);
    } else if(rec.run) renderRun();
    else hub();
  }

  function glossary(entries) {
    const grid=el('div','','u7-glossary');
    entries.forEach(([word,meaning,example,situation])=>{
      const card=el('article');
      card.append(en('h3',word),el('p',meaning),en('p',example),el('p',situation));
      grid.append(card);
    });
    content.append(grid);
  }

  function comparison() {
    const table=el('table','','u7-table');
    const header=el('tr');
    ['Conditional','Cuándo','Estructura'].forEach(text=>header.append(el('th',text)));
    table.append(header);
    [
      ['First','Futuro posible','If + present → will + verbo'],
      ['Second','Presente o futuro imaginario','If + past → would + verbo'],
      ['Third','Otro pasado','If + past perfect → would have + participio']
    ].forEach(row=>{
      const tr=el('tr');
      row.forEach(text=>tr.append(el('td',text)));
      table.append(tr);
    });
    content.append(table);
  }

  function readingText(index) {
    const reading=unit7Readings[index];
    const box=el('div','','passage');
    box.append(en('h3',reading.title),el('p',reading.vocab),en('p',reading.text));
    return box;
  }

  function lesson(index) {
    const mission=missions[active];
    const card=mission.cards[index];
    const rec=record();
    if(!consultation) {rec.card=index;save();}
    frame(card.title,'Misión '+(active+1)+' · Comprendé · Tarjeta '+(index+1)+'/3',index+1,3);
    content.append(scene(active===2?'Lo que pasó':'La situación',active===2?'El pasado que imaginamos':'Lo que se sigue de ella'));
    content.append(el('p',card.explanation),structure(...card.structure),en('p',card.example,'explanation'),el('p',card.translation));
    if(active===3) comparison();
    if(active===4 && index===2) glossary(unit7Tech);
    if(active===5 && index===2) glossary(unit7Phrasal);
    if(active===6 && index<2) content.append(readingText(index));
    const feedback=el('p','','u7-feedback');
    feedback.hidden=true;
    feedback.setAttribute('role','status');
    const next=button(index===2?'Ir al entrenamiento':'Siguiente tarjeta',()=>{
      if(index<2) lesson(index+1);
      else if(consultation) {consultation=false;resume();}
      else {rec.learned=true;save();hub();}
    },'primary');
    next.disabled=true;
    const options=el('div','','u7-options');
    content.append(el('h3',card.check));
    shuffle([card.answer,card.wrong]).forEach(answer=>{
      const control=button(answer,()=>{
        feedback.hidden=false;
        const correct=answer===card.answer;
        feedback.setAttribute('data-correct',String(correct));
        feedback.textContent=(correct?'¡Excelente, Pedro! ':'Casi. ')+card.why+(correct?'':' Volvé a elegir.');
        next.disabled=!correct;
        for(const other of options.children) other.setAttribute('aria-pressed',String(other===control));
      });
      control.setAttribute('aria-pressed','false');
      options.append(control);
    });
    content.append(options,feedback);
    const previous=button('Anterior',()=>lesson(index-1));
    previous.disabled=index===0;
    actions(previous,next);
    if(consultation) actions(button('Volver a mi actividad',()=>{consultation=false;resume();}));
  }

  function hub() {
    const rec=record(),mission=missions[active];
    frame(mission.title,'Misión '+(active+1)+' · Elegí tu próximo paso');
    content.append(el('p','Recorré el entrenamiento y el juego. Después resolvé la mini evaluación. Necesitás 80 % para abrir la siguiente misión.'));
    actions(button((rec.guided?'✓ ':'')+'Ejercicios guiados',()=>startRound('guided'),'primary'));
    const practice=button((rec.practice?'✓ ':'')+'Práctica interactiva',()=>startRound('practice'),'primary');
    practice.disabled=!rec.guided;
    const play=button((rec.game?'✓ ':'')+mission.game,()=>startGame(),'primary');
    play.disabled=!rec.practice;
    const mini=button('Mini evaluación · 80 % para avanzar',()=>startRound('mini'),'primary');
    mini.disabled=!rec.game;
    actions(practice,play,mini,button('Volver a las explicaciones',()=>{consultation=true;lesson(0);}));
    if(rec.passed) actions(button('Siguiente misión',()=>open(active+1),'primary'));
  }

  function sample(topic,count,bucket) {
    const previous=Array.isArray(state.previous[bucket])?state.previous[bucket]:[];
    const pool=shuffle(unit7Bank.filter(q=>q.topic===topic));
    const chosen=[...pool.filter(q=>!previous.includes(q.id)),...pool.filter(q=>previous.includes(q.id))].slice(0,count);
    state.previous[bucket]=chosen.map(q=>q.id);
    return chosen;
  }

  function startRound(kind) {
    const topic=missions[active].id;
    const rec=record();
    const count=kind==='mini'?(topic==='reading'?6:5):2;
    let questions=sample(topic,count,topic+'-'+kind);
    if(kind==='practice'&&!questions.some(q=>q.type==='gap'&&q.prompt.includes('___'))) {
      questions[0]=unit7Bank.find(q=>q.topic===topic&&q.type==='gap'&&q.prompt.includes('___'));
    }
    // La mini lectura exige comprensión de los dos textos, con tres preguntas por texto.
    if(topic==='reading'&&kind==='mini') {
      const previous=state.previous['reading-mini-both']||[];
      questions=[0,1].flatMap(reading=>{
        const pool=shuffle(unit7Bank.filter(q=>q.topic===topic&&q.reading===reading));
        return [...pool.filter(q=>!previous.includes(q.id)),...pool.filter(q=>previous.includes(q.id))].slice(0,3);
      });
      state.previous['reading-mini-both']=questions.map(q=>q.id);
    }
    rec.run={kind,ids:shuffle(questions).map(q=>q.id),index:0,answers:{},done:false};
    save();renderRun();
  }

  function finalIntro() {
    frame('Final Exam Simulator','Misión 8 · La última misión');
    content.append(scene('Todo lo que practicaste','30 desafíos sin reloj'),el('p','Vas a resolver 30 preguntas de los siete temas. Podés revisar tus respuestas antes de entregar. Al finalizar verás la nota sobre 10 y qué conviene repasar.'));
    if(record().best!==undefined) content.append(el('p','Mejor resultado · '+(record().best/10).toFixed(1)+'/10'));
    actions(button('Empezar simulacro',startFinal,'primary'));
  }

  function startFinal() {
    const quotas=[4,4,4,4,5,4,5];
    const questions=unit7Missions.flatMap((mission,index)=>{
      const selected=sample(mission.id,quotas[index],'final-'+mission.id);
      // Conservá variedad de temas y garantizá tareas de transformación y estructura.
      const required={first:'order',second:'transform',third:'error'}[mission.id];
      const matches=q=>required==='transform'?/Transformá/.test(q.prompt):q.type===required;
      if(required&&!selected.some(matches)) selected[0]=unit7Bank.find(q=>q.topic===mission.id&&matches(q));
      return selected;
    });
    // Ambas lecturas siempre están presentes.
    if(!questions.some(q=>q.reading===0)) questions[questions.length-1]=unit7Bank.find(q=>q.reading===0);
    if(!questions.some(q=>q.reading===1)) questions[questions.length-2]=unit7Bank.find(q=>q.reading===1);
    record().run={kind:'final',ids:shuffle(questions).map(q=>q.id),index:0,answers:{},done:false};
    save();renderRun();
  }

  function validRun() {
    const run=record().run;
    if(!run||!Array.isArray(run.ids)||!run.ids.length||!run.ids.every(id=>questionById.has(id))||!['guided','practice','mini','final'].includes(run.kind)) return null;
    if(!run.answers||typeof run.answers!=='object') run.answers={};
    if(!Number.isInteger(run.index)||run.index<0||run.index>=run.ids.length) run.index=0;
    return run;
  }

  function renderRun() {
    const run=validRun();
    if(!run) {delete record().run;save();active===7?finalIntro():hub();return;}
    if(run.done) {results();return;}
    const question=questionById.get(run.ids[run.index]);
    const exam=run.kind==='mini'||run.kind==='final';
    const labels={guided:'Ejercices guiados',practice:'Práctica interactiva',mini:'Mini evaluación',final:'Simulacro final'};
    frame(question.prompt,labels[run.kind]+' · '+(run.index+1)+'/'+run.ids.length,run.index+1,run.ids.length);
    if(question.reading!==null) content.append(readingText(question.reading));
    else if(question.topic==='tech'||question.topic==='phrasal') content.append(scene('Una situación cotidiana','Elegí la acción que la resuelve'));
    else content.append(scene('Condición · if','Consecuencia'));
    if(run.kind==='guided') content.append(el('p','Primero ubicá el momento: posible, imaginario ahora o pasado alternativo. Después elegí los bloques de la estructura.','explanation'));
    if(question.type==='error') content.append(el('p','Encontrá el error y elegí la corrección que conserva el sentido.'));
    if(question.type==='truth') content.append(el('p','Elegí True (verdadero) o False (falso). Al revisar vas a ver la justificación.'));
    let chosen=run.answers[question.id]||'';
    const status=el('p','','u7-feedback');
    status.setAttribute('role','status');
    status.hidden=true;
    const container=el('div','','u7-options');
    const next=button(run.index+1===run.ids.length?(exam?'Revisar y entregar':'Terminar práctica'):'Guardar y seguir',()=>{
      if(!chosen) return;
      run.answers[question.id]=chosen;
      if(run.index+1<run.ids.length) {run.index++;save();renderRun();}
      else if(exam) confirmRound();
      else completeRound();
    },'primary');
    next.disabled=exam?!chosen:true;
    const update=value=>{
      chosen=value;
      run.answers[question.id]=value;
      save();
      next.disabled=!value;
      status.hidden=true;
      if(!exam) next.disabled=true;
    };
    const check=button('Comprobar',()=>{
      if(!chosen) return;
      status.hidden=false;
      status.setAttribute('data-correct',String(chosen===question.answer));
      status.textContent=(chosen===question.answer?'¡Esa estructura está perfecta! ':'Casi. Revisemos la idea. ')+question.why;
      next.disabled=chosen!==question.answer;
    },'primary');
    check.hidden=exam;
    if(question.type==='order') {
      // Cada bloque tiene identidad propia, incluso si se repite una palabra.
      const parts=question.parts;
      const picked=[];
      const output=en('p','','u7-answer');
      output.setAttribute('aria-live','polite');
      const blocks=el('div','','u7-blocks');
      function refresh() {
        const value=picked.map(piece=>piece.textContent).join(' ');
        output.textContent=value||'Tocá las palabras para armar tu oración.';
        update(picked.length===parts.length?value:'');
      }
      shuffle(parts.map((part,id)=>({part,id}))).forEach(({part})=>{
        const piece=button(part,()=>{picked.push(piece);piece.disabled=true;refresh();});
        piece.lang='en';
        blocks.append(piece);
      });
      container.append(output,blocks,button('Deshacer',()=>{
        const piece=picked.pop();
        if(piece) {piece.disabled=false;piece.focus();}
        refresh();
      }));
      if(chosen) content.append(en('p','Respuesta guardada: '+chosen,'explanation'));
      content.append(el('p','Tocá los bloques para ordenar. Podés deshacer todos los que necesites.'));
    } else if(question.type==='gap') {
      const label=el('label','Elegí la opción para completar la idea');
      const select=el('select');
      const placeholder=el('option','Elegí una opción');
      placeholder.value='';
      select.append(placeholder);
      shuffle([question.answer,...question.wrong]).forEach(value=>{
        const option=en('option',value);
        option.value=value;
        select.append(option);
      });
      select.value=chosen;
      select.onchange=()=>{update(select.value);check.disabled=!select.value;};
      label.append(select);
      container.append(label);
    } else {
      shuffle([question.answer,...question.wrong]).forEach(value=>{
        const control=button(value,()=>{
          update(value);
          for(const other of container.children) other.setAttribute('aria-pressed',String(other===control));
          check.disabled=false;
        });
        control.lang='en';
        control.setAttribute('aria-pressed',String(chosen===value));
        container.append(control);
      });
    }
    check.disabled=!chosen;
    // Los bloques habilitan Comprobar recién cuando la frase está completa.
    if(question.type==='order') {
      const controls=container.children[1];
      for(const piece of controls.children) {
        const click=piece.onclick;
        piece.onclick=()=>{click();check.disabled=!chosen;};
      }
      const undo=container.children[2];
      const click=undo.onclick;
      undo.onclick=()=>{click();check.disabled=!chosen;};
    }
    content.append(container,status);
    const previous=button('Anterior',()=>{run.index--;save();renderRun();});
    previous.disabled=run.index===0;
    actions(previous,check,next);
  }

  function confirmRound() {
    const run=validRun();
    frame('¿Listo para entregar?',run.kind==='final'?'Simulacro final':'Mini evaluación');
    content.append(el('p','Guardaste '+Object.keys(run.answers).length+' respuestas. Podés revisarlas antes de ver la corrección.'));
    actions(button('Revisar desde el comienzo',()=>{run.index=0;save();renderRun();}),button('Entregar y ver resultado',completeRound,'primary'));
  }

  function completeRound() {
    const rec=record(),run=validRun();
    if(!run) return;
    if(run.kind==='guided'||run.kind==='practice') {
      rec[run.kind]=true;
      delete rec.run;
      save();hub();return;
    }
    const correct=run.ids.filter(id=>run.answers[id]===questionById.get(id).answer).length;
    const percent=correct/run.ids.length*100;
    run.done=true;
    run.correct=correct;
    rec.best=Math.max(Number(rec.best)||0,percent);
    if(percent>=80) rec.passed=true;
    save();results();
  }

  function results() {
    const rec=record(),run=validRun();
    const correct=run.ids.filter(id=>run.answers[id]===questionById.get(id).answer).length;
    const percent=correct/run.ids.length*100;
    frame(percent>=80?'¡Misión cumplida! 🚀':'Una nueva oportunidad para comprender',run.kind==='final'?'Resultado final':'Resultado de la mini evaluación');
    const score=el('div','','u7-result');
    score.setAttribute('data-completed',String(percent>=80));
    score.append(el('strong',run.kind==='final'?(percent/10).toFixed(1)+'/10':Math.round(percent)+' %'),el('p',correct+' aciertos · '+(run.ids.length-correct)+' errores · '+Math.round(percent)+' %'));
    content.append(score,el('p','Cada intento es una oportunidad de aprender. Para completar esta misión necesitás al menos el 80 %.'));
    for(const mission of unit7Missions) {
      const questions=run.ids.map(id=>questionById.get(id)).filter(q=>q.topic===mission.id);
      if(!questions.length) continue;
      const hits=questions.filter(q=>run.answers[q.id]===q.answer).length;
      content.append(el('p',mission.title+' · '+hits+'/'+questions.length));
      if(hits<questions.length) {
        const index=unit7Missions.indexOf(mission);
        actions(button('Repasar '+mission.title,()=>open(index)));
      }
    }
    for(const id of run.ids) {
      const q=questionById.get(id);
      if(run.answers[id]===q.answer) continue;
      const review=el('section','','explanation');
      review.append(el('h3',q.prompt));
      if(q.reading!==null) review.append(readingText(q.reading));
      review.append(en('p','Elegiste: '+run.answers[id]),en('p','Respuesta: '+q.answer),el('p',q.why));
      content.append(review);
    }
    actions(button('Nueva práctica con otras preguntas',()=>run.kind==='final'?startFinal():startRound('mini'),'primary'));
    if(percent<80) actions(button('Revisar mis explicaciones',()=>{if(active===7) open(3);else {consultation=true;lesson(0);}}));
    if(rec.passed) {
      if(active<7) actions(button('Desbloqueaste la siguiente misión →',()=>open(active+1),'primary'));
      else actions(button('Ver mi diploma',()=>{board();$('u7-complete').scrollIntoView();}));
    }
    actions(button('Volver a misiones',board));
  }

  function finishGame() {
    const rec=record();
    rec.game=true;
    delete rec.gameState;
    save();
    frame('¡Juego completado! ✨',missions[active].game);
    content.append(el('p','Aplicaste las ideas de esta misión. Ahora podés comprobar tu comprensión con una mini evaluación.'));
    actions(button('Ir a la mini evaluación',()=>startRound('mini'),'primary'),button('Volver al entrenamiento',hub));
  }

  function startGame() {
    const rec=record();
    // Guardamos la fase alcanzada. Al recargar se puede volver al juego desde el entrenamiento.
    rec.gameState=true;
    save();
    if(active===4) memoryGame();
    else if(active===5) matchingGame();
    else if(active===2) timeMachine();
    else if(active===1) personalGame();
    else {
      const mission=missions[active];
      let pool=unit7Bank.filter(q=>q.topic===mission.id);
      if(active===3) pool=pool.slice(0,3);
      if(active===6) pool=[pool[0],pool[1],pool[6],pool[7]];
      else pool=shuffle(pool).slice(0,3);
      gameQuestions(pool,0);
    }
  }

  function gameQuestions(questions,index) {
    const q=questions[index];
    frame(q.prompt,missions[active].game,index+1,questions.length);
    if(q.reading!==null) content.append(readingText(q.reading));
    else content.append(scene('Leé la situación','Pensá la consecuencia'));
    const feedback=el('p','','u7-feedback');
    feedback.setAttribute('role','status');
    feedback.hidden=true;
    const next=button('Siguiente',()=>index+1<questions.length?gameQuestions(questions,index+1):finishGame(),'primary');
    next.disabled=true;
    const options=el('div','','u7-options');
    shuffle([q.answer,...q.wrong]).forEach(value=>options.append(button(value,()=>{
      feedback.hidden=false;
      feedback.setAttribute('data-correct',String(value===q.answer));
      feedback.textContent=(value===q.answer?'¡Excelente, Pedro! ':'Buscá esta pista. ')+q.why;
      next.disabled=value!==q.answer;
    })));
    content.append(options,feedback);
    actions(next);
  }

  function personalGame() {
    frame('What Would You Do?','Elegí tu propia respuesta');
    content.append(scene('Imaginá que tenés una tarde libre','¿Qué elegirías hacer?'),en('p','If you had a free afternoon, what would you do?'),el('p','Las tres preferencias son válidas. Fijate que todas usan would + verbo base.'));
    const feedback=el('p','','u7-feedback');
    feedback.hidden=true;
    const next=button('Practicar la estructura',()=>gameQuestions(shuffle(unit7Bank.filter(q=>q.topic==='second')).slice(0,3),0),'primary');
    next.disabled=true;
    ['I would play the guitar.','I would hang out with friends.','I would play a video game.'].forEach(value=>content.append(button(value,()=>{
      feedback.hidden=false;
      feedback.textContent='Tu elección es válida. '+value+' La forma would + verbo base expresa tu respuesta a la situación imaginaria.';
      next.disabled=false;
    })));
    content.append(feedback);actions(next);
  }

  function timeMachine() {
    const cases=[
      ['No guardaste el archivo y lo perdiste.','If I had saved it,|I|wouldn’t|have|lost it.','Had saved es la condición alternativa y wouldn’t have lost es la consecuencia.'],
      ['No cargaste el teléfono y perdiste la llamada.','If I had charged my phone,|I|wouldn’t|have|missed the call.','Ambas partes miran un pasado que ya no puede cambiar.'],
      ['No tuviste tiempo y no viste la película.','If I had had time,|I|would|have|seen the film.','Had had significa hubiera tenido; would have seen, habría visto.']
    ];
    function build(index) {
      const [story,phrase,why]=cases[index];
      const parts=phrase.split('|'),picked=[];
      frame(story,'Time Machine · Reconstruí el pasado',index+1,cases.length);
      content.append(scene('Pasó esto','Imaginá una alternativa'));
      const row=el('div','','u7-blocks');
      const output=en('p','','u7-answer');
      const feedback=el('p','','u7-feedback');
      feedback.setAttribute('role','status');
      feedback.hidden=true;
      const next=button('Siguiente',()=>index+1<cases.length?build(index+1):finishGame(),'primary');
      next.disabled=true;
      const check=button('Comprobar',()=>{
        const correct=output.textContent===parts.join(' ');
        feedback.hidden=false;
        feedback.setAttribute('data-correct',String(correct));
        feedback.textContent=(correct?'¡Bien! ':'Probá de nuevo. ')+why;
        next.disabled=!correct;
      },'primary');
      check.disabled=true;
      function refresh() {
        output.textContent=picked.map(piece=>piece.textContent).join(' ');
        check.disabled=picked.length!==parts.length;
        next.disabled=true;
        feedback.hidden=true;
      }
      shuffle(parts).forEach(part=>{
        const piece=button(part,()=>{piece.disabled=true;picked.push(piece);refresh();});
        row.append(piece);
      });
      content.append(output,row,feedback);
      actions(button('Deshacer',()=>{const piece=picked.pop();if(piece)piece.disabled=false;refresh();}),check,next);
    }
    build(0);
  }

  function memoryGame() {
    const entries=shuffle(unit7Tech).slice(0,4);
    frame('Encontrá las parejas de tecnología','Tech Detective · Memotest',0,4);
    content.append(el('p','Tocá dos tarjetas. Buscá la expresión y su significado. Si no coinciden, podés volver a taparlas sin perder puntos.'));
    const grid=el('div','','u7-memory');
    const message=el('p');
    message.setAttribute('role','status');
    const faceUp=[],matched=new Set();
    const cards=shuffle(entries.flatMap(([word,meaning],id)=>[{id,label:word},{id,label:meaning}]));
    const again=button('Volver a tapar',()=>{
      faceUp.splice(0).forEach(control=>{control.textContent='?';control.disabled=false;control.setAttribute('aria-label','Tarjeta oculta');});
      again.disabled=true;
    });
    again.disabled=true;
    cards.forEach(card=>{
      const control=button('?',()=>{
        if(faceUp.length===2) return;
        control.textContent=card.label;
        control.setAttribute('aria-label',card.label);
        control.disabled=true;
        faceUp.push(control);
        if(faceUp.length<2) return;
        const other=cards[Array.from(grid.children).indexOf(faceUp[0])];
        if(other.id===card.id) {
          matched.add(card.id);
          message.textContent='¡Pareja encontrada! '+entries[card.id][0]+' = '+entries[card.id][1]+'. '+entries[card.id][3];
          faceUp.splice(0);
          $('u7-progress').value=matched.size;
          if(matched.size===4) actions(button('Terminar juego',finishGame,'primary'));
        } else {
          message.textContent='Estas tarjetas tienen significados distintos. Volvé a taparlas y buscá otra pareja.';
          again.disabled=false;
        }
      });
      control.setAttribute('aria-label','Tarjeta oculta');
      grid.append(control);
    });
    content.append(grid,message);
    actions(again);
  }

  function matchingGame() {
    // Evitamos presentar log off y sign out como significados distintos.
    const entries=shuffle(unit7Phrasal.filter(([word])=>word!=='Sign out')).slice(0,4);
    frame('Uní la expresión con el significado','Phrasal Match',0,4);
    const grid=el('div','','u7-matching');
    const left=el('div','','u7-options'),right=el('div','','u7-options');
    const message=el('p','','u7-feedback');
    message.setAttribute('role','status');
    let selected=null,solved=0;
    const controls=new Map();
    entries.forEach(([word],index)=>{
      const control=button(word,()=>{
        selected=index;
        for(const other of left.children) other.setAttribute('aria-pressed',String(other===control));
      });
      control.setAttribute('aria-pressed','false');
      controls.set(index,control);left.append(control);
    });
    shuffle(entries.map((entry,index)=>({entry,index}))).forEach(({entry,index})=>{
      const control=button(entry[1],()=>{
        if(selected===null) {message.textContent='Primero tocá una expresión en inglés.';return;}
        if(selected!==index) {message.textContent='Revisá el contexto de '+entries[selected][0]+'. '+entries[selected][3];return;}
        controls.get(index).disabled=control.disabled=true;
        message.textContent='¡Bien! '+entry[2]+' '+entry[3];
        selected=null;solved++;
        $('u7-progress').value=solved;
        if(solved===4) actions(button('Terminar juego',finishGame,'primary'));
      });
      right.append(control);
    });
    grid.append(left,right);content.append(el('p','Tocá una expresión y después su significado.'),grid,message);
  }

  $('u7-home').onclick=board;
  $('u7-rules').onclick=()=>{consultation=true;lesson(0);};
  $('u7-print').onclick=()=>window.print();
  board();
})();
