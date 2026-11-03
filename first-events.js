function initFirstEvents(){
  const M=FirstEvents,$=id=>document.querySelector('#'+id),el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const button=(label,cls,fn)=>{const n=el('button',cls,label);n.type='button';n.onclick=fn;return n;};
  const loaded=M.load();let data=loaded.data,canSave=loaded.canSave,round=data.rounds[data.rounds.length-1],feedback=null,returnTo=null,drag=null;
  const current=()=>M.bank.find(q=>q.id===round.order[round.cursor]);
  function persist(){if(canSave&&!M.save(data))canSave=false;$('events-storage').textContent=canSave?'Esta ronda se guarda por separado. Las rondas anteriores se conservan.':'No se pudo recuperar o guardar este módulo. Podés practicar; los datos anteriores no se sobrescriben.';}
  function move(i){round.cursor=Math.max(0,Math.min(23,i));round.summary=false;feedback=null;persist();render();$('events-activity').focus();}
  function scene(q,parent){
    const figure=el('figure','events-scene');figure.append(el('figcaption','','Observá las dos escenas y sus momentos.'));
    const line=el('ol','events-timeline');line.setAttribute('aria-label','Línea temporal de izquierda a derecha');
    q.events.forEach((event,i)=>{const li=el('li',i===0?'event-earlier':'event-later');li.append(el('span','event-sequence',i===0?'1 · PRIMERO':'2 · DESPUÉS'),el('strong','event-time',event.time));const art=el('div','event-art');art.innerHTML=FirstEventArt.svg(event.icon);art.setAttribute('role','img');art.setAttribute('aria-label',event.text);li.append(art,el('span','event-label',event.text));line.append(li);});figure.append(line);parent.append(figure);
  }
  function setToken(q,r,kind,index,to){
    if(kind==='bank'){if(!r.tokens.includes(index)){const pos=Number.isInteger(to)?Math.max(0,Math.min(to,r.tokens.length)):r.tokens.length;r.tokens.splice(pos,0,index);}}
    else if(kind==='remove')r.tokens.splice(index,1);
    else if(kind==='move'){const [token]=r.tokens.splice(index,1);r.tokens.splice(Math.max(0,Math.min(to,r.tokens.length)),0,token);}
    persist();render();
  }
  function pieces(q,r,parent){
    parent.append(el('p','event-fixed',q.fixed),el('p','answer-line','Arrastrá o tocá las piezas. En tu oración podés quitar cada pieza y moverla a izquierda o derecha.'));
    const build=el('div','events-build');build.setAttribute('role','group');build.setAttribute('aria-label','Zona de construcción de la oración');
    const acceptDrop=(event,to)=>{event.preventDefault();if(!drag)return;const source=drag;drag=null;setToken(q,r,source.kind==='bank'?'bank':'move',source.index,source.kind==='built'&&source.index<to?to-1:to);};
    build.ondragover=e=>e.preventDefault();build.ondrop=e=>acceptDrop(e,r.tokens.length);
    if(!r.tokens.length)build.append(el('p','answer-line','Tu oración va acá. Tocá una pieza o arrastrala a esta zona.'));
    r.tokens.forEach((id,i)=>{const tile=el('div','event-built-tile');tile.draggable=true;tile.ondragstart=e=>{drag={kind:'built',index:i};e.dataTransfer?.setData('text/plain',String(id));};tile.ondragend=()=>{drag=null;};tile.ondragover=e=>e.preventDefault();tile.ondrop=e=>{e.stopPropagation();acceptDrop(e,i);};tile.append(button(M.tokens(q)[id],'event-token',()=>setToken(q,r,'remove',i)));
      const controls=el('div','event-tile-controls');const left=button('←','secondary',()=>setToken(q,r,'move',i,i-1));left.disabled=i===0;left.setAttribute('aria-label',`Mover ${M.tokens(q)[id]} a la izquierda`);const right=button('→','secondary',()=>setToken(q,r,'move',i,i+1));right.disabled=i===r.tokens.length-1;right.setAttribute('aria-label',`Mover ${M.tokens(q)[id]} a la derecha`);const remove=button('Quitar','secondary',()=>setToken(q,r,'remove',i));remove.setAttribute('aria-label',`Quitar ${M.tokens(q)[id]}`);controls.append(left,right,remove);tile.append(controls);build.append(tile);});parent.append(build);
    const bank=el('div','word-bank');bank.setAttribute('role','group');bank.setAttribute('aria-label','Banco de piezas desordenadas');
    round.tokenOrders[q.id].forEach(id=>{const tile=button(M.tokens(q)[id],'word-tile',()=>setToken(q,r,'bank',id));tile.disabled=r.tokens.includes(id);tile.draggable=!tile.disabled;tile.ondragstart=e=>{drag={kind:'bank',index:id};e.dataTransfer?.setData('text/plain',String(id));};tile.ondragend=()=>{drag=null;};bank.append(tile);});parent.append(bank,button('Vaciar construcción','secondary',()=>{r.tokens=[];persist();render();}));
  }
  function inputFields(q,r,parent,disabled){
    const line=el('div','events-sentence');line.lang='en';
    q.parts.forEach((part,i)=>{line.append(el('span','',part));if(i<2){const group=el('span','event-field');const label=el('label','',`Espacio ${i+1} · ${q.fields[i].base}`);const input=el('input','lesson-input');input.id=`event-answer-${i}`;input.type='text';input.value=r.values[i];input.autocomplete='off';input.spellcheck=false;input.setAttribute('autocapitalize','none');input.disabled=disabled;label.htmlFor=input.id;input.oninput=()=>{r.values[i]=input.value.slice(0,299);persist();};group.append(label,input);line.append(group);}});parent.append(line);
  }
  const tips={
    'orden de las acciones':'Volvé a los momentos de las escenas. El orden en la frase puede ser distinto del orden en que ocurrieron.',
    'elección del tiempo':'Leé qué pide la consigna. Para destacar lo anterior: had + participio. Para narrar sucesión: Simple Past en ambas.',
    'participio':'Después de had necesitás participio, no el pasado simple ni la base. En los irregulares pueden ser formas distintas o invariables.',
    'regular/irregular':'Compará la base y su modelo. Cambios ortográficos al agregar -ed no convierten al verbo en irregular; una forma invariable puede ser irregular.',
    'forma regular y ortografía':'Revisá la terminación regular y los ajustes de escritura. El participio regular suele coincidir con el pasado.',
    'forma pendiente':'Completá los dos espacios antes de comprobar.',
    'forma verbal u orden de piezas':'Revisá la estructura fija, la posición de had y las formas base, pasado y participio. Las piezas sobrantes no siempre son correctas.'
  };
  function check(q,r){const result=M.evaluate(q,r);r.tries++;if(r.first===null)r.first=result.correct;r.solved=r.solved||result.correct;r.errors=[...new Set([...r.errors,...result.errors])];feedback=result;persist();render();$('events-activity').querySelector('[role="status"]').focus();}
  function finalSubmit(){
    const tasks=M.bank.filter(q=>q.stage===3);if(tasks.some(q=>{const r=M.record(round,q.id);return r.values.some(v=>!M.normalize(v))||!r.family;})){feedback={correct:false,pending:true,errors:[]};render();return;}
    tasks.forEach(q=>{const r=M.record(round,q.id),result=M.evaluate(q,r);r.tries++;r.first=result.correct;r.solved=result.correct;r.errors=result.errors;});round.finalSubmitted=true;round.summary=true;feedback=null;persist();render();$('events-summary').focus();
  }
  function summary(){
    const area=$('events-summary');area.hidden=false;$('events-activity').hidden=true;$('events-rule').hidden=true;area.replaceChildren(el('h2','','Tu recorrido: ¿qué pasó primero?'));const stats=M.stats(round);
    area.append(el('p','',`${stats.complete} de 24 resueltas · ${stats.first} aciertos al primer intento · ${stats.retried} necesitaron reintentar o repasar.`));
    if(!round.finalSubmitted)area.append(el('p','answer-line','Los seis desafíos de la etapa 4 todavía no se corrigieron. Completalos y finalizá para conocer sus resultados.'));
    const pending=el('div');if(stats.pending.length){pending.append(el('h3','','Para seguir practicando'));stats.pending.forEach(q=>{const r=round.records[q.id],row=el('article','question');row.append(el('p','',`${M.stages[q.stage]} · ${q.events[0].text} → ${q.events[1].text}`),el('p','answer-line',q.stage===3&&!round.finalSubmitted?'Aún sin corregir.':r?.errors.length?'Áreas para repasar: '+r.errors.join(' · '):'Pendiente de resolver.'),button('Volver a la actividad','secondary',()=>move(round.order.indexOf(q.id))));pending.append(row);});}else pending.append(el('p','feedback success','¡Resolviste todas! Podés volver o iniciar una ronda nueva.'));area.append(pending);
    if(round.finalSubmitted){area.append(el('h3','','Revisión de los seis desafíos'));M.bank.filter(q=>q.stage===3).forEach(q=>{const r=round.records[q.id],review=el('article','question');review.append(el('h4','',q.events[0].text+' → '+q.events[1].text),el('p',r.solved?'status':'status wrong',r.solved?'Resuelta':'Para practicar'),el('p','answer-line',`Tu construcción: ${q.parts[0]}${r.values[0]}${q.parts[1]}${r.values[1]}${q.parts[2]}`),el('p','answer-line',`Una respuesta correcta: ${q.parts[0]}${q.fields[0].answers[0]}${q.parts[1]}${q.fields[1].answers[0]}${q.parts[2]}`),el('p','answer-line',`Clasificación de ${q.fields[q.classify].base}: elegiste ${r.family}; corresponde ${q.fields[q.classify].family}.`),el('p','explanation',q.why));area.append(review);});}
    area.append(button('Nueva ronda en orden mezclado','primary',()=>{const next=M.fresh();next.order=M.stages.flatMap((_,stage)=>M.shuffle(M.bank.filter(q=>q.stage===stage).map(q=>q.id)));if(next.order.join(',')===round.order.join(',')){[next.order[0],next.order[1]]=[next.order[1],next.order[0]];}data.rounds.push(next);round=next;feedback=null;returnTo=null;persist();render();$('events-activity').focus();}));
    const history=el('details','event-rounds');history.append(el('summary','','Rondas anteriores (se conservan)'));data.rounds.slice(0,-1).reverse().forEach(previous=>{const s=M.stats(previous);history.append(el('p','answer-line',`${new Date(previous.createdAt).toLocaleString('es-AR',{timeZone:'America/Argentina/Buenos_Aires'})}: ${s.complete}/24 resueltas · ${s.first} de primera · ${s.retried} con errores.`));});area.append(history);
  }
  function render(){
    const q=current(),r=M.record(round,q.id),area=$('events-activity');$('events-progress').textContent=`Etapa ${q.stage+1} de 4 · ${M.stats(round).complete} de 24 resueltas`;
    const nav=$('events-stages');nav.replaceChildren();M.stages.forEach((label,stage)=>{const b=button(`${stage+1}. ${label}`,'secondary',()=>move(round.order.findIndex(id=>M.bank.find(q=>q.id===id).stage===stage)));if(stage===q.stage&&!round.summary)b.setAttribute('aria-current','step');nav.append(b);});
    if(round.summary){summary();return;}area.hidden=false;$('events-summary').hidden=true;$('events-rule').hidden=q.stage===3;area.replaceChildren(el('span','eyebrow',`ACTIVIDAD ${round.cursor+1} DE 24 · ${M.stages[q.stage]}`));scene(q,area);area.append(el('p','event-instruction',q.instruction));
    if(q.stage===0){area.append(el('h2','practice-heading','¿Qué ocurrió primero?'));const order=el('div','exercise-options');[1,0].forEach(index=>{const b=button(q.events[index].text,'',()=>{r.order=index;persist();render();});b.setAttribute('aria-pressed',String(r.order===index));order.append(b);});area.append(order);}
    if(q.stage===2)pieces(q,r,area);else if(q.stage!==0||r.order!==null)inputFields(q,r,area,q.stage===3&&round.finalSubmitted);else area.append(el('p','answer-line','Primero elegí cuál acción ocurrió antes. Después aparecerán los dos espacios para construir.'));
    if(q.stage===3){area.append(el('p','answer-line',`Además, clasificá ${q.fields[q.classify].base} en esta oración.`));const choices=el('div','exercise-options');['regular','irregular'].forEach(family=>{const b=button(family,'',()=>{r.family=family;persist();render();});b.disabled=round.finalSubmitted;b.setAttribute('aria-pressed',String(r.family===family));choices.append(b);});area.append(choices,el('p','answer-line',round.finalSubmitted?'Ya finalizaste esta ronda. La revisión está en el balance.':'Tus elecciones quedan guardadas sin corregir hasta finalizar los seis.'));}
    if(feedback){const status=el('div',feedback.correct?'feedback success':'feedback',feedback.pending?'Completá los dos campos y la clasificación de los seis desafíos. No se corrigió ninguna respuesta todavía.':feedback.correct?'¡Bien construido! '+q.why:'Para revisar: '+feedback.errors.join(' · '));status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.tabIndex=-1;area.append(status);if(!feedback.correct&&!feedback.pending){const visual=el('div','event-error-map');feedback.errors.forEach(type=>visual.append(el('p','answer-line',tips[type]||type)));if(q.stage<3)visual.append(el('p','answer-line',q.why));area.append(visual);}}
    const controls=el('div','practice-actions');if(q.stage<3){controls.append(button('Comprobar','primary',()=>check(q,r)));if(feedback&&!feedback.correct)controls.append(button('Reintentar','secondary',()=>{feedback=null;render();area.focus();}));if(r.errors.length){controls.append(button('Practicar un caso equivalente','secondary',()=>{const different=x=>x.id!==q.id&&x.mode===q.mode&&x.fields.every(f=>!q.fields.some(g=>g.base===f.base));const local=M.bank.filter(x=>x.stage===q.stage&&different(x));const candidates=local.length?local:M.bank.filter(x=>x.stage<3&&different(x));const next=candidates.find(x=>!round.records[x.id]?.tries)||candidates[0];returnTo=q.id;move(round.order.indexOf(next.id));}));}}
    if(returnTo&&returnTo!==q.id)controls.append(button('Volver al caso pendiente','secondary',()=>{const id=returnTo;returnTo=null;move(round.order.indexOf(id));}));
    if(round.cursor>0)controls.append(button('Anterior','secondary',()=>move(round.cursor-1)));if(round.cursor<23)controls.append(button('Siguiente →','secondary',()=>move(round.cursor+1)));
    if(q.stage===3&&!round.finalSubmitted)controls.append(button('Finalizar los seis desafíos','primary',finalSubmit));
    controls.append(button('Ver mi balance','secondary',()=>{round.summary=true;feedback=null;persist();render();$('events-summary').focus();}));area.append(controls);
  }
  persist();render();
}
if(typeof document!=='undefined')initFirstEvents();

