(() => {
  const nav = document.getElementById('click-nav');
  const panel = document.getElementById('click-stage');
  const names = ['La misma historia','Detective en castellano','Del castellano al inglés','Una visita médica','Construí oraciones','Examen en inglés'];
  let previousExam = [];
  let previousSpanish = [];
  const concepts = [0,1,2,3,5];
  function el(tag, text = '', style = '') {
    const item = document.createElement(tag);
    item.textContent = text;
    item.className = style;
    return item;
  }
  function btn(text, run, style = 'secondary') {
    const button = el('button',text,style);
    button.type = 'button';
    button.onclick = run;
    return button;
  }
  function en(tag, text, style) {
    const item = el(tag,text,style);
    item.lang = 'en';
    return item;
  }
  function mix(items) {
    return items.map(value => ({value, key:Math.random()})).sort((a,b)=>a.key-b.key).map(item=>item.value);
  }
  function picture(kind, caption) {
    const figure = el('figure','','click-picture click-picture-' + kind);
    const drawing = el('span','','click-drawing');
    drawing.setAttribute('aria-hidden','true');
    figure.append(drawing,el('figcaption',caption));
    return figure;
  }
  function progress(number, total) {
    const meter = el('progress');
    meter.max = total;
    meter.value = number;
    meter.setAttribute('aria-label', 'Actividad ' + number + ' de ' + total);
    panel.append(el('p',number + ' de ' + total,'click-count'),meter);
  }
  function open(stage) {
    for (const [index, button] of Array.from(nav.children).entries()) {
      button.setAttribute('aria-pressed',String(index === stage));
    }
    frame(stage);
    if (stage === 0 || stage === 3) story(stage);
    if (stage === 1 || stage === 5) quiz(stage);
    if (stage === 2) bridge();
    if (stage === 4) construct();
  }
  function frame(stage) {
    const heading = el('h2',names[stage]);
    heading.tabIndex = -1;
    panel.replaceChildren(heading);
    heading.focus();
  }
  function story(stage) {
    const medical = stage === 3;
    const scenes = medical ? clinic : ideas.map(idea=>idea.slice(1,3));
    const tabs = el('div','','click-buttons');
    const display = el('div');
    function scene(i) {
      const type = medical ? concepts[i] : i;
      const [spanish,english] = scenes[i];
      for (const [index, tab] of Array.from(tabs.children).entries()) tab.setAttribute('aria-pressed', String(index === i));
      const caption = medical ? ['Posibilidad','Intención anterior','Turno confirmado','Apertura · 09:00','Consulta en curso · 10:00'][i] : ideas[type][4];
      const reveal = btn('Descubrir en inglés',()=>{
        reveal.disabled = true;
        display.append(en('p',english,'explanation'));
      });
      const note = medical ? ['La visita se imagina como posibilidad.','La decisión de pedir turno ya estaba tomada.','El turno está confirmado.','La hora pertenece al consultorio.','A las diez la conversación ya está en curso.'][i] : ideas[type][3];
      display.replaceChildren(picture(type,caption),el('h3',spanish),el('p',note),reveal);
    }
    scenes.forEach((_,i)=>tabs.append(btn(ideas[medical ? concepts[i] : i][0],()=>scene(i))));
    panel.append(tabs,display,btn(medical ? 'Pasar a construir' : 'Practicar en castellano',()=>open(stage+1),'primary'));
    scene(0);
  }
  function bridge() {
    const table = el('table','','click-bridge');
    const pairs = ideas.map((idea,i)=>[idea[0],forms[mapping[i]]]);
    pairs.splice(2,0,['Predicción con evidencia presente',forms[1]]);
    for (const [idea,form] of pairs) {
      const row = el('tr');
      const label = el('th',idea);
      label.setAttribute('scope','row');
      row.append(label,en('td',form));
      table.append(row);
    }
    panel.append(table,el('p','Estas formas son habituales. A veces hay más de una opción gramatical y cambia lo que querés destacar. Usar will o going to no depende solo de si hay fecha.'));
    const comparisons = el('div','','click-comparisons');
    for (const i of [0,1,2]) {
      const card = el('article','','explanation');
      card.append(en('strong',ideas[i][2]),el('p',ideas[i][3]));
      comparisons.append(card);
    }
    panel.append(comparisons,en('p','Look at those clouds. It’s going to rain.'),el('p','Las nubes son una pista visible ahora. Por eso going to es habitual para esta predicción.'),btn('Explorar la visita médica',()=>open(3),'primary'));
  }
  function quiz(stage) {
    const spanish = stage === 1;
    const previous = spanish ? previousSpanish : previousExam;
    const source = spanish ? situations : examClick;
    const sample = source.flatMap((group,type)=>{
      const pool = mix(group.map((value,index)=>({value,type,id:type+'-'+index})));
      return [...pool.filter(q=>!previous.includes(q.id)), ...pool.filter(q=>previous.includes(q.id))].slice(0,spanish?1:3);
    });
    if (spanish) previousSpanish = sample.map(q=>q.id);
    else previousExam = sample.map(q=>q.id);
    const round = mix(sample);
    const results = [];
    function ask(index) {
      frame(stage);
      progress(index+1,round.length);
      const {value,type} = round[index];
      const [prompt,answer,wrong] = spanish ? [value,ideas[type][0],ideas.filter((_,i)=>i!==type).map(idea=>idea[0]).join('|')] : value;
      const concept = spanish ? type : concepts[type];
      const rule = spanish ? [
        'La frase habla de algo posible. No presenta una decisión.',
        'La persona ya tenía la intención antes de hablar.',
        'Hay un arreglo concreto, con una reserva, un encuentro o un turno.',
        'El dato viene de un programa o servicio.',
        'La persona reacciona y decide en ese instante.',
        'La hora indicada cae dentro de la actividad.'
      ][type] : [
        'Will + verbo base sirve para una reacción o promesa. La negativa usa won’t + verbo base.',
        'Am/is/are + going to + verbo base destaca una intención previa o evidencia presente.',
        'Am/is/are + verbo en -ing destaca un arreglo futuro confirmado.',
        'Para el horario usá present simple. Con sujeto singular suele ir -s o -es. Después de does va el verbo base.',
        'Will be + verbo en -ing enfoca la actividad en curso. Para negar se usa won’t be.'
      ][type];
      const support = picture(spanish ? 6 : concept,spanish ? 'Buscá la pista en la situación' : 'Leé el contexto antes de elegir');
      const feedback = el('p','','explanation');
      feedback.setAttribute('role','status');
      feedback.hidden = true;
      const options = el('div','','click-buttons');
      let first;
      const next = btn(index+1 === round.length ? 'Ver mi resultado' : 'Siguiente',()=>{
        results.push({prompt,answer,first,type,rule});
        if (index+1 === round.length) finish();
        else ask(index+1);
      },'primary');
      next.hidden = true;
      for (const choice of mix([answer,...wrong.split('|')])) {
        const control = btn(choice,()=>{
          if (first === undefined) first = choice;
          feedback.hidden = next.hidden = false;
          feedback.textContent = choice === answer ? '¡Bien! ' + rule : 'Elegiste «' + choice + '». La pista es esta: ' + rule + ' Podés volver a elegir.';
          for (const other of options.children) other.setAttribute('aria-pressed',String(other === control));
        });
        if (!spanish) control.lang = 'en';
        control.setAttribute('aria-pressed','false');
        options.append(control);
      }
      if (spanish) panel.append(support,el('h3',prompt),options,feedback,next);
      else panel.append(support,en('h3',prompt),options,feedback,next);
    }
    function finish() {
      frame(stage);
      const hits = results.filter(r=>r.first===r.answer).length;
      panel.append(el('h3',hits+' de '+results.length+' aciertos en el primer intento'),el('p',(results.length-hits)+' para repasar. Podés volver a practicar a tu ritmo.'));
      for (const result of results) {
        const card = el('article','','explanation');
        card.append(el('strong',result.prompt),el('p',(result.first===result.answer?'Acertaste. ':'Elegiste «'+result.first+'». ')+'Respuesta: '+result.answer+'. '+result.rule));
        if (result.first!==result.answer) card.append(btn(spanish?'Repasar la historia':'Repasar '+forms[result.type],()=>open(spanish?0:result.type===0||result.type===1?2:3)));
        panel.append(card);
      }
      panel.append(btn('Volver a jugar',()=>open(stage)),btn(spanish?'Pasar al inglés':'Volver a las situaciones',()=>open(spanish?2:1),'primary'));
    }
    ask(0);
  }
  function construct() {
    function build(i) {
      frame(4);
      progress(i+1,builds.length);
      const [rule,phrase,negative,question] = builds[i];
      const parts = phrase.split('|');
      const selected = [];
      const groups = el('div','','click-buttons');
      const output = en('p','', 'click-output');
      output.setAttribute('aria-live','polite');
      const feedback = el('p');
      feedback.setAttribute('role','status');
      const next = btn(i+1===builds.length?'Ir al examen':'Siguiente estructura',()=>i+1===builds.length?open(5):build(i+1),'primary');
      next.hidden = true;
      function refresh() {
        output.textContent = selected.map(button=>button.textContent).join(' ');
        check.disabled = selected.length!==parts.length;
        feedback.textContent = '';
        next.hidden = true;
      }
      const check = btn('Comprobar',()=>{
        const correct = output.textContent === parts.join(' ');
        feedback.textContent = correct ? '¡Bien! ' + rule + '.' : 'Revisá el orden: ' + rule + '. Deshacé los últimos bloques y probá otra vez.';
        next.hidden = !correct;
      },'primary');
      check.disabled = true;
      for (const word of mix(parts)) {
        const button = btn(word,()=>{selected.push(button);button.disabled=true;refresh();});
        button.lang = 'en';
        groups.append(button);
      }
      const models = el('div','','explanation');
      models.append(el('p','Afirmativa · '+rule),en('p','− '+negative),en('p','? '+question));
      panel.append(el('h3',forms[i]),models,el('p','Tocá los bloques para armar la oración.'),output,groups,btn('Deshacer',()=>{
        const last=selected.pop();
        if(last) {last.disabled=false; last.focus();}
        refresh();
      }),check,feedback,next);
    }
    build(0);
  }
  names.forEach((name,i)=>nav.append(btn((i+1)+' · '+name,()=>open(i))));
  open(0);
})();
