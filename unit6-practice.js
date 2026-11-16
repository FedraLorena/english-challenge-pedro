(() => {
  const $ = id => document.getElementById(id);
  const board = $('practice-board'), game = $('practice-game'), area = $('practice-round');
  const storageKey = 'english-challenge-unit6-arcade-v1';
  const last = new Map();
  const icons = ['↗','▦','⌕','✈','◈','▤','★'];
  const themes = ['Future tenses','Estructura','Corrección','Transport and travel','Extreme adjectives','Reading'];
  let records = {};
  try { records = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  if (typeof records !== 'object' || Array.isArray(records)) records = {};

  function node(tag, text = '', style = '') {
    const el = document.createElement(tag);
    el.textContent = text;
    el.className = style;
    return el;
  }

  function button(text, action, style = 'secondary') {
    const el = node('button', text, style);
    el.type = 'button';
    el.onclick = action;
    return el;
  }

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const pools = bank.map((items, group) => items.map((q, index) => ({...q, group, id: group + '-' + index})));
  function draw(mode) {
    const quotas = mode === 6 ? [5, 0, 1, 3, 3, 3] : pools.map((pool, i) => i === mode ? Math.min(i === 0 ? 8 : i === 4 ? 8 : 6, pool.length) : 0);
    const previous = last.get(mode) || [];
    const result = quotas.flatMap((count, i) => {
      const pool = shuffle(pools[i]);
      const ranked = [...pool.filter(q => !previous.includes(q.id)), ...pool.filter(q => previous.includes(q.id))];
      if (mode === 6 && i === 0) return forms.map(form => ranked.find(q => q.answer === form));
      return ranked.slice(0, count);
    });
    last.set(mode, result.map(q => q.id));
    return shuffle(result);
  }

  const schedules = [['19:00','20:00','21:00'],['09:00','10:00','12:00'],['12:00','12:30','13:00'],['16:00','17:00','18:00']];
  const scenes = {
    future: ['Ahora','→','Después'], station: ['Andén','━━','Salida'], clock: ['Inicio','● En curso','Fin'],
    tram: ['Vías','▣ ▣','Parada'], blocks: ['Inicio','＋','Final'], airport: ['Terminal','✈','Embarque'], port: ['Muelle','≈≈','Embarque'],
    tour: ['Mapa','···','Monumento'], scale: ['Intensidad','▂ ▄ ▆','Máxima']
  };

  function visual(q) {
    const key = q.scene;
    const timeline = q.group === 0 && key === 'clock' ? schedules[Number(q.id.split('-')[1]) - 16] : null;
    const graphic = node('div', '', 'practice-scene scene-' + key);
    for (const label of timeline || scenes[key]) graphic.append(node('span', label));
    return graphic;
  }

  function cards(focus = false) {
    board.hidden = false;
    game.hidden = true;
    const list = $('practice-cards');
    list.replaceChildren();
    modes.forEach((title, index) => {
      const card = node('article', '', 'unit6-card practice-card');
      const icon = node('span', icons[index], 'unit6-card-icon');
      icon.setAttribute('aria-hidden', 'true');
      const score = records[index];
      card.append(icon, node('h2', title), node('p', score ? 'Última partida · ' + score.correct + '/' + score.total : 'Disponible'), button('Jugar', () => start(index), 'primary'));
      list.append(card);
    });
    if (focus) list.children[focus - 1].children[3].focus();
  }

  function start(mode) {
    const questions = draw(mode);
    const results = [];
    let index = 0;
    board.hidden = true;
    game.hidden = false;
    $('practice-title').textContent = modes[mode];
    $('practice-back').onclick = () => cards(mode + 1);

    function question() {
      const q = questions[index];
      const card = node('article', '', 'question practice-panel');
      const meter = node('progress');
      meter.max = questions.length;
      meter.value = index;
      meter.setAttribute('aria-label', 'Preguntas completadas');
      const title = node('h3', q.prompt);
      title.tabIndex = -1;
      card.append(node('p', 'Desafío ' + (index + 1) + ' de ' + questions.length), meter, visual(q));
      if (q.passage) {
        const passage = node('p', q.passage, 'passage unit6-passage');
        passage.lang = 'en';
        card.append(passage);
      }
      card.append(title);
      const group = node('div', '', 'practice-controls');
      const response = node('p', '', 'explanation');
      response.tabIndex = -1;
      response.hidden = true;
      const status = node('p');
      status.setAttribute('aria-live', 'polite');
      let selected = '';
      let first;
      let locked = false;
      const check = button('Comprobar', () => {
        if (locked || !selected) return;
        locked = true;
        if (first === undefined) first = selected;
        const correct = selected === q.answer;
        response.hidden = false;
        response.textContent = correct ? '¡Bien! ' + q.why : 'Probá nuevamente. ' + q.why;
        group.hidden = true;
        check.hidden = true;
        status.hidden = true;
        retry.hidden = correct;
        advance.hidden = false;
        advance.textContent = correct ? 'Siguiente' : 'Seguir y guardar para repasar';
        response.focus();
      }, 'primary');
      const retry = button('Reintentar', () => {
        locked = false;
        response.hidden = retry.hidden = advance.hidden = true;
        group.hidden = check.hidden = status.hidden = false;
        group.children[0].focus();
      });
      const advance = button('Siguiente', () => {
        results.push({q, first, correct: first === q.answer});
        index++;
        if (index < questions.length) question();
        else summary();
      }, 'primary');
      retry.hidden = advance.hidden = true;
      check.disabled = true;
      if (q.parts) {
        const picked = [];
        function update() {
          selected = picked.map(el => el.textContent).join(' ');
          status.textContent = selected || 'Tocá las piezas en orden.';
          check.disabled = picked.length !== q.parts.length;
        }
        for (const part of shuffle(q.parts)) {
          const piece = button(part, () => {
            picked.push(piece);
            piece.disabled = true;
            update();
          });
          piece.lang = 'en';
          group.append(piece);
        }
        group.append(button('Deshacer', () => {
          const piece = picked.pop();
          if (piece) { piece.disabled = false; piece.focus(); }
          update();
        }));
        update();
      } else {
        for (const option of shuffle(q.options)) {
          const choice = button(option, () => {
            selected = option;
            for (const el of group.children) el.setAttribute('aria-pressed', String(el === choice));
            check.disabled = false;
          });
          choice.setAttribute('aria-pressed', 'false');
          choice.lang = q.answer === 'Cansancio' ? 'es' : 'en';
          group.append(choice);
        }
      }
      card.append(group, status, check, response, retry, advance);
      area.replaceChildren(card);
      title.focus();
    }

    function summary() {
      const correct = results.filter(result => result.correct).length;
      records[mode] = {correct, total: questions.length};
      try { localStorage.setItem(storageKey, JSON.stringify(records)); }
      catch { $('practice-storage').textContent = 'El navegador no pudo guardar el resultado local.'; }
      const title = node('h3', '★ Desafío completado');
      title.tabIndex = -1;
      const panel = node('article', '', 'question practice-panel');
      panel.append(title, node('p', correct + ' de ' + questions.length + ' correctas en el primer intento · ' + Math.round(100 * correct / questions.length) + '%'));
      for (const [group, theme] of themes.entries()) {
        const items = results.filter(result => result.q.group === group);
        if (!items.length) continue;
        const hits = items.filter(result => result.correct).length;
        panel.append(node('p', theme + ' · ' + hits + '/' + items.length + ' · ' + (hits === items.length ? 'Comprendido en esta ronda' : 'Conviene reforzar')));
      }
      if (mode === 6) {
        for (const form of forms) {
          const items = results.filter(result => result.q.group === 0 && result.q.answer === form);
          if (!items.length) continue;
          const hits = items.filter(result => result.correct).length;
          panel.append(node('p', form + ' · ' + hits + '/' + items.length + ' · ' + (hits === items.length ? 'Comprendido en esta ronda' : 'Conviene reforzar')));
        }
      }
      for (const {q, first, correct} of results) {
        if (correct) continue;
        const review = node('section', '', 'explanation');
        review.append(node('h4', q.prompt));
        if (q.passage) review.append(node('p', q.passage, 'unit6-passage'));
        review.append(node('p', 'Elegiste «' + first + '». Respuesta esperada: «' + q.answer + '». ' + q.why));
        panel.append(review);
      }
      panel.append(button('Volver a practicar', () => start(mode), 'primary'), button('Volver a desafíos', () => cards(mode + 1)));
      area.replaceChildren(panel);
      title.focus();
    }

    question();
  }

  cards();
})();


