(() => {
  const $ = id => document.getElementById(id);
  const forTopic = id => unit6Questions.filter(question => question.topic === id);
  const categories = [
    {title: 'Grammar', items: unit6Lessons},
    {title: 'Vocabulary', items: unit6Vocabulary},
    {title: 'Reading', items: unit6Readings}
  ];
  const readingByTopic = new Map(unit6Readings.map(reading => [reading.id, reading]));
  const exam = $('unit6-exam');
  const score = $('unit6-score');
  const start = $('unit6-start');
  let previousSelection = '';

  function make(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function english(node) {
    node.lang = 'en';
    return node;
  }

  function shuffled(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function choices(question) {
    return shuffled([question.answer, ...question.distractors.map(([option]) => option)]);
  }

  function passage(reading) {
    return english(make('p', reading.text, 'passage unit6-passage'));
  }

  const visuals = {
    will: [['💬', 'Surge una situación'], ['⚡', 'Decidís ahora'], ['🤝', 'I’ll help.']],
    going: [['☁️', 'Ves nubes oscuras'], ['🔎', 'Detectás una señal'], ['🌧️', 'It’s going to rain.']],
    arrangement: [['📅', 'Agendás una cita'], ['✅', 'Confirman las 3'], ['🦷', 'I’m seeing the dentist.']],
    schedule: [['🚆', 'Tren a Tigre · 08:10'], ['🚆', 'Tren a Retiro · 08:25'], ['🕗', 'The train leaves at 8:25.']],
    ongoing: [['🎸', '7 · Empezás'], ['🎵', '8 · You’ll be playing'], ['🏁', '9 · Terminás']],
    adjectives: [['❄️', 'cold · frío'], ['🧊', 'very cold · muy frío'], ['🥶', 'freezing · helado']],
    transport: [['🚌', 'Tierra · coach'], ['⛴️', 'Agua · ferry'], ['✈️', 'Aire · plane']],
    travelling: [['🎫', 'Pasaje · ticket'], ['🚆', 'Trayecto · journey'], ['📷', 'Visita · sightseeing']],
    notice: [['⛴️', 'Servicio'], ['🕘', 'Salidas'], ['🎫', 'Condiciones']],
    message: [['💬', 'Mensaje'], ['🔄', 'Cambio'], ['🤝', 'Nuevo encuentro']],
    sign: [['🏛️', 'Lugar'], ['🚪', 'Instrucción'], ['📸', 'Permiso']],
    trip: [['🏫', 'Salida'], ['🚍', 'Trayecto'], ['🏙️', 'Actividad']],
    story: [['🎫', 'Plan inicial'], ['🔋', 'Imprevisto'], ['↩️', 'Decisión']]
  };
  const hints = {
    will: 'Fijate si la decisión nace en ese momento. Después de will va el verbo base.',
    going: 'Buscá una intención previa o una señal visible. Revisá am, is o are.',
    arrangement: 'Buscá un acuerdo confirmado y la estructura be + verbo en -ing.',
    schedule: 'Identificá si habla un horario oficial. Revisá el sujeto y la terminación del verbo.',
    ongoing: 'Ubicá el momento señalado dentro de la acción y buscá will be + verbo en -ing.',
    adjectives: 'Buscá qué cualidad describe la oración: tamaño, temperatura, ánimo o sabor.',
    transport: 'Fijate por dónde va el transporte y qué lleva.',
    travelling: 'Preguntate si falta una acción, un documento, una persona o el trayecto.'
  };

  const missions = categories.flatMap(category => category.items);
  const board = $('unit6-board');
  const play = $('unit6-play');
  const mission = $('unit6-mission');
  const storageKey = 'english-challenge-unit6-missions-v1';
  let progress = {};
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) progress = saved;
  } catch {}
  let entry;
  const cards = new Map();

  function button(label, action, style = 'secondary') {
    const control = make('button', label, style);
    control.type = 'button';
    control.onclick = action;
    return control;
  }

  function refreshBoard() {
    let complete = 0;
    for (const [id, {status, launch}] of cards) {
      const saved = progress[id];
      if (saved?.done) complete++;
      status.textContent = saved?.done ? '✓ Completada' : saved ? 'En curso' : 'Por explorar';
      launch.textContent = saved?.done ? 'Volver a jugar' : saved ? 'Continuar' : 'Jugar';
    }
    const status = $('board-progress');
    status.textContent = complete + ' de ' + missions.length + ' misiones completadas';
    if (status.getAttribute('data-storage-unavailable')) status.textContent += ' · El navegador no pudo guardar el avance.';
  }

  function openScreen(screen, opener = entry) {
    entry = opener;
    board.hidden = true;
    play.hidden = false;
    for (const panel of [mission, $('writing'), $('mock')]) panel.hidden = panel !== screen;
    $('unit6-return').focus();
  }

  function returnToBoard() {
    play.hidden = true;
    $('writing').hidden = $('mock').hidden = true;
    board.hidden = false;
    refreshBoard();
    (entry || $('board-title')).focus();
  }

  $('unit6-return').onclick = returnToBoard;
  $('mock-writing').onclick = () => openScreen($('writing'));

  function save(item, position, stage, done = false) {
    progress[item.id] = {position, stage, done: done || Boolean(progress[item.id]?.done)};
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      $('board-progress').setAttribute('data-storage-unavailable', 'true');
    }
  }

  function playChallenge(body, item, question, reveal) {
    const options = choices(question);
    const choose = option => reveal(question, option);
    const group = make('div', '', 'unit6-choices');
    if (item.text) {
      const clues = make('div', '', 'unit6-clues');
      const note = make('p', 'Tocá una línea del texto para marcar la pista que querés usar.');
      note.setAttribute('role', 'status');
      for (const line of item.text.split(/\n|(?<=[.!?]) +/).filter(Boolean)) {
        const mark = english(button(line, () => {
          for (const other of clues.children) other.setAttribute('aria-pressed', String(other === mark));
          note.textContent = 'Pista marcada. Ahora elegí la respuesta que podés justificar con el texto.';
        }));
        mark.setAttribute('aria-pressed', 'false');
        clues.append(mark);
      }
      body.append(note, clues);
    }
    if (['will', 'going', 'ongoing'].includes(item.id) && !question.prompt.includes('___')) {
      body.append(make('p', 'Construí la respuesta tocando los bloques en orden.'));
      const words = shuffled(question.answer.split(' '));
      const row = make('div', '', 'unit6-blocks');
      const assembled = english(make('p', 'Tu frase aparece acá.', 'explanation'));
      assembled.setAttribute('aria-live', 'polite');
      const picked = [];
      const check = button('Comprobar frase', () => choose(picked.map(block => block.textContent).join(' ')), 'primary');
      check.disabled = true;
      function update() {
        assembled.textContent = picked.map(block => block.textContent).join(' ') || 'Tu frase aparece acá.';
        check.disabled = picked.length !== words.length;
      }
      for (const word of words) {
        const block = english(button(word, () => {
          picked.push(block);
          block.disabled = true;
          update();
        }));
        row.append(block);
      }
      body.append(assembled, row, button('Deshacer bloque', () => {
        const last = picked.pop();
        if (last) last.disabled = false;
        update();
      }), check);
      return;
    }
    if (question.prompt.includes('___')) {
      const label = make('label', 'Elegí qué va en el espacio ');
      const select = make('select');
      const placeholder = make('option', 'Elegí una opción');
      placeholder.value = '';
      select.append(placeholder);
      for (const option of options) {
        const choice = english(make('option', option));
        choice.value = option;
        select.append(choice);
      }
      const check = button('Completar oración', () => choose(select.value), 'primary');
      check.disabled = true;
      select.onchange = () => { check.disabled = !select.value; };
      label.append(select);
      body.append(label, check);
      return;
    }
    const activity = {
      adjectives: 'Uní la descripción con su significado en inglés.',
      transport: 'Clasificá el vehículo a partir de sus características.',
      schedule: 'Detectá la oración que respeta la regla.',
      arrangement: 'Identificá cómo se presenta el plan.'
    };
    if (activity[item.id]) body.append(make('p', activity[item.id]));
    for (const option of options) group.append(english(button(option, () => choose(option))));
    body.append(group);
  }

  function showMission(item) {
    const [worked, ...challenges] = forTopic(item.id);
    const saved = progress[item.id];
    let position = saved && !saved.done && Number.isInteger(saved.position) && challenges[saved.position] ? saved.position : 0;
    let stage = saved && !saved.done && Number.isInteger(saved.stage) && saved.stage >= 0 && saved.stage <= 3 ? saved.stage : 0;
    const title = make('h3', item.title);
    const step = make('h4');
    step.tabIndex = -1;
    const meter = make('progress');
    meter.max = 5;
    meter.setAttribute('aria-label', 'Pasos de la misión');
    const body = make('div');
    const forward = make('button', '', 'primary');
    const back = make('button', 'Anterior', 'secondary');
    forward.type = back.type = 'button';
    const actions = make('div', '', 'result-actions unit6-actions');
    actions.append(back, forward);
    mission.replaceChildren(title, meter, step, body, actions);

    function draw(moveFocus = true) {
      const names = ['Mirá el gráfico', 'Entendé la regla', 'Descubrí el ejemplo', 'Resolvé el desafío', 'Comprendé tu resultado'];
      meter.value = stage + 1;
      save(item, position, Math.min(stage, 3));
      step.textContent = 'Paso ' + (stage + 1) + ' de 5 · ' + names[stage];
      body.replaceChildren();
      back.hidden = stage === 0;
      forward.hidden = stage === 3 || stage === 4;
      forward.textContent = stage === 2 ? 'Ir al desafío' : 'Siguiente';
      if (stage === 0) {
        const scene = make('ol', '', 'unit6-scene');
        const detail = make('p');
        detail.setAttribute('role', 'status');
        for (const [icon, label] of visuals[item.id]) {
          const tile = make('li');
          const symbol = make('span', icon);
          symbol.setAttribute('aria-hidden', 'true');
          tile.append(symbol, make('strong', label));
          scene.append(tile);
        }
        body.append(scene);
        const comparisons = {
          will: ['Una situación inesperada pide una respuesta. I’ll help es un ofrecimiento en ese momento.'],
          going: ['Hay una señal ahora: las nubes anuncian lluvia.', 'Ya lo decidiste antes: I’m going to visit the museum.']
        };
        if (comparisons[item.id]) {
          comparisons[item.id].forEach((message, index) => {
            const label = item.id === 'will' ? '¿Qué hacés si se rompe la bolsa?' : ['Ves nubes oscuras', 'Ya tenés un plan'][index];
            body.append(button(label, () => { detail.textContent = message; }));
          });
          body.append(detail);
        }
        if (item.id === 'transport' || item.id === 'adjectives') {
          const match = item.id === 'adjectives';
          const pairs = match
            ? [['very big', 'huge'], ['very tasty', 'delicious'], ['very old', 'ancient']]
            : [['tram', 'Tierra'], ['canoe', 'Agua'], ['hot air balloon', 'Aire']];
          let current = 0;
          const instruction = make('p', match ? 'Asociá cada descripción con su adjetivo extremo.' : 'Clasificá cada transporte según por dónde viaja.');
          const target = make('strong', pairs[current][0]);
          target.lang = 'en';
          const choicesRow = make('div', '', 'unit6-blocks');
          for (const [, choice] of shuffled(pairs)) {
            choicesRow.append(button(choice, () => {
              if (choice !== pairs[current][1]) {
                detail.textContent = match ? 'Pista: buscá un adjetivo que intensifique esa misma cualidad.' : 'Pista: imaginá la superficie por la que se desplaza.';
                return;
              }
              detail.textContent = pairs[current].join(' → ') + '.';
              current++;
              if (current < pairs.length) {
                target.textContent = pairs[current][0];
              } else {
                target.textContent = '¡Tres resueltos!';
                target.lang = 'es';
                for (const control of choicesRow.children) control.disabled = true;
                forward.focus();
              }
            }));
          }
          body.append(instruction, target, choicesRow, detail);
        }
      }
      if (stage === 1) {
        body.append(make('p', item.rule || 'Leé buscando el dato que responde la pregunta. En un aviso, separá los horarios de las condiciones. En un mensaje o relato, seguí los cambios de plan.'));
        if (item.contrast) body.append(make('p', item.contrast, 'explanation'));
        if (item.examples) {
          for (const [example, translation] of item.examples) {
            const line = make('p');
            line.append(english(make('strong', example)), ' · ' + translation);
            body.append(line);
          }
        }
        if (item.entries) {
          const glossary = make('dl', '', 'unit6-glossary');
          for (const [word, meaning] of Object.entries(item.entries)) {
            const entry = make('div');
            entry.append(english(make('dt', word)), make('dd', meaning));
            glossary.append(entry);
          }
          body.append(glossary);
        }
      }
      if (stage === 2) {
        if (item.text) body.append(passage(item));
        const steps = make('ol');
        steps.append(
          make('li', worked.prompt),
          make('li', hints[item.id] || 'Localizá la frase que contesta exactamente lo que se pregunta.'),
          make('li', worked.answer + ' · ' + worked.explanation)
        );
        body.append(steps);
      }
      if (stage === 3) {
        const question = challenges[position];
        const prompt = make('p', question.prompt);
        body.append(make('p', 'Desafío ' + (position + 1) + ' de ' + challenges.length, 'eyebrow'), prompt);
        playChallenge(body, item, question, reveal);
      }
      if (moveFocus) step.focus();
    }

    function reveal(question, option) {
      const correct = option === question.answer;
      const reason = correct ? question.explanation : question.distractors.find(([choice]) => choice === option)?.[1] || 'Revisá el orden de los bloques antes de comprobar la frase.';
      stage = 4;
      draw(false);
      body.append(make('p', question.prompt), make('p', 'Elegiste «' + option + '».'));
      if (item.text) body.append(passage(item));
      body.append(make('p', (correct ? '¡Misión resuelta! ' : 'Probá otra vez. ') + reason, 'explanation'));
      if (correct) {
        const alternatives = make('details');
        const list = make('ul');
        for (const [choice, why] of question.distractors) list.append(make('li', choice + ' · ' + why));
        alternatives.append(make('summary', 'Comparar las otras opciones'), list);
        body.append(alternatives);
      } else {
        body.append(make('p', 'Pista · ' + (hints[item.id] || 'Volvé al texto y buscá la frase que responde la pregunta.')));
      }
      const retry = make('button', 'Reintentar desafío', 'secondary');
      retry.type = 'button';
      retry.onclick = () => { stage = 3; draw(); };
      body.append(retry);
      if (correct && position + 1 < challenges.length) {
        save(item, position + 1, 3);
        forward.hidden = false;
        forward.textContent = 'Siguiente desafío';
      }
      if (correct && position + 1 === challenges.length) {
        save(item, position, 4, true);
        body.append(make('h4', '✨ ¡Misión completada!', 'unit6-reward'));
        body.append(make('p', item.contrast || (item.text ? 'Encontraste pistas en el texto para justificar tus respuestas.' : item.rule)));
        const next = missions[missions.indexOf(item) + 1];
        if (next) body.append(button('Continuar con ' + next.title, () => openMission(next, cards.get(next.id).launch), 'primary'));
      }
      step.focus();
    }

    back.onclick = () => { stage = stage === 4 ? 3 : stage - 1; draw(); };
    forward.onclick = () => {
      if (stage === 4) {
        position = (position + 1) % challenges.length;
        stage = position === 0 ? 0 : 3;
      } else {
        stage++;
      }
      draw();
    };
    draw();
  }

  function openMission(item, opener) {
    openScreen(mission, opener);
    showMission(item);
  }

  function tile(icon, title, description, launch) {
    const card = make('article', '', 'unit6-card');
    const art = make('span', icon, 'unit6-card-icon');
    art.setAttribute('aria-hidden', 'true');
    card.append(art, make('h3', title), description, launch);
    return card;
  }

  for (const [index, category] of categories.entries()) {
    const section = $([ 'grammar', 'vocabulary', 'reading' ][index]);
    const map = make('div', '', 'unit6-map');
    for (const item of category.items) {
      const status = make('p', '', 'unit6-status');
      const launch = button('Jugar', () => openMission(item, launch), 'primary');
      launch.setAttribute('aria-label', 'Abrir misión: ' + item.title);
      cards.set(item.id, {status, launch});
      map.append(tile(visuals[item.id][0][0], item.title, status, launch));
    }
    section.append(map);
  }
  for (const [id, icon, title, description] of [
    ['writing', '✍️', 'Writing', 'Armá y revisá tu texto de opinión.'],
    ['mock', '🏁', 'Simulacro', 'Poné a prueba lo aprendido en 12 preguntas.']
  ]) {
    const launch = button('Abrir ' + title, () => openScreen($(id), launch), 'primary');
    $('unit6-extra').append(tile(icon, title, make('p', description), launch));
  }
  refreshBoard();

  function selection() {
    const pools = categories.map(({items}) =>
      unit6Questions.filter(question => items.some(item => item.id === question.topic))
    );
    let chosen = pools.flatMap(pool => shuffled(pool).slice(0, 4));
    const fingerprint = questions => questions.map(question => question.id).sort((a, b) => a - b).join(',');
    // Si se repite exactamente el banco, cambiá una pregunta por otra de su categoría.
    if (fingerprint(chosen) === previousSelection) {
      chosen[0] = pools[0].find(question => !chosen.includes(question));
    }
    previousSelection = fingerprint(chosen);
    return shuffled(chosen);
  }

  function begin() {
    start.hidden = true;
    score.textContent = '';
    const questions = selection();
    const form = make('form');
    const selected = new Map();
    for (const [index, question] of questions.entries()) {
      const card = make('fieldset', '', 'question');
      const legend = make('legend', (index + 1) + '. ' + question.prompt);
      card.append(legend);
      const reading = readingByTopic.get(question.topic);
      if (reading) card.append(passage(reading));
      const options = make('div', '', 'options');
      for (const option of choices(question)) {
        const label = make('label', '', 'option');
        const radio = make('input');
        radio.type = 'radio';
        radio.name = 'unit6-answer-' + question.id;
        radio.required = true;
        radio.onchange = () => selected.set(question.id, option);
        label.append(radio, english(make('span', option)));
        options.append(label);
      }
      card.append(options);
      form.append(card);
    }
    const finish = make('button', 'Finalizar simulacro', 'primary');
    finish.type = 'submit';
    form.append(finish);
    form.onsubmit = event => {
      event.preventDefault();
      if (selected.size !== questions.length) return;
      const errors = questions.filter(question => selected.get(question.id) !== question.answer);
      const correct = questions.length - errors.length;
      score.textContent = Math.round(100 * correct / questions.length) + '/100 · ' +
        correct + ' de ' + questions.length + ' correctas · ' + errors.length + ' errores';
      score.className = 'result-card';
      exam.replaceChildren();
      for (const question of errors) {
        const wrong = selected.get(question.id);
        const [, reason] = question.distractors.find(([option]) => option === wrong);
        const review = make('article', '', 'question');
        review.append(make('h3', question.prompt));
        const reading = readingByTopic.get(question.topic);
        if (reading) review.append(passage(reading));
        const response = make('p');
        response.append('Elegiste ', english(make('strong', wrong)));
        const solution = make('p');
        solution.append('Respuesta correcta ', english(make('strong', question.answer)));
        review.append(response, solution, make('p', reason + ' ' + question.explanation, 'explanation'));
        exam.append(review);
      }
      start.textContent = 'Repetir simulacro';
      start.hidden = false;
      score.focus();
    };
    exam.replaceChildren(form);
    form.children[0].tabIndex = -1;
    form.children[0].focus();
  }

  start.onclick = begin;
})();


