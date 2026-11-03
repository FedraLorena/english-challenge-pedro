function initPrecisionTraining(){
  const T=PrecisionTraining,$=id=>document.querySelector('#'+id),el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const button=(label,cls,action)=>{const b=el('button',cls,label);b.type='button';b.onclick=action;return b;};
  const loaded=T.load();let state=loaded.state,canSave=loaded.canSave,mode=null,feedback='',success=false;
  function persist(){if(canSave&&!T.save(state))canSave=false;$('precision-storage').textContent=canSave?'Tu entrenamiento se guarda por separado en este navegador.':'No se pudo recuperar o guardar este entrenamiento. Podés practicar; los datos anteriores no se sobrescriben.';}
  function move(index){state.cursor=index;state.summary=false;mode=null;feedback='';success=false;persist();render();$('precision-activity').focus();}
  function comparison(parent,verbs){const figure=el('figure','precision-comparison');figure.append(el('figcaption','','Compará las formas: BASE → PASADO → PARTICIPIO'));verbs.forEach(values=>{const row=el('div','precision-forms');values.forEach((v,i)=>{const cell=el('div');cell.append(el('small','',['BASE','PASADO','PARTICIPIO'][i]),el('strong','',v));cell.lang='en';row.append(cell);if(i<2){const arrow=el('span','precision-arrow','→');arrow.setAttribute('aria-hidden','true');row.append(arrow);}});figure.append(row);});if(verbs.some(v=>v[0]==='go')){const contrast=el('div','precision-contrast');['I went → fui · Simple Past','I had gone → había ido · Past Perfect','I had went → forma incorrecta: had necesita gone'].forEach(text=>contrast.append(el('p','answer-line',text)));figure.append(contrast);}parent.append(figure);}
  function summary(){
    $('precision-summary').hidden=false;$('precision-activity').hidden=true;const area=$('precision-summary');area.replaceChildren(el('h2','','Tu entrenamiento, paso a paso'));const stats=T.stats(state),seen=T.bank.filter(q=>state.records[q.id]?.tries>0).length;
    area.append(el('p','',`${seen} de 20 actividades intentadas.`),el('p','',`${stats.first} correctas a la primera · ${stats.retried} necesitaron reintentar.`),el('p','answer-line','Una actividad queda para repasar si está pendiente, necesitó tres o más intentos iniciales o hubo errores en su aplicación nueva.'));
    if(!stats.pending.length)area.append(el('p','feedback success','Resolviste las veinte y sus aplicaciones necesarias. Podés repetir con el orden mezclado.'));
    else{area.append(el('h3','','Para seguir practicando'));stats.pending.forEach(q=>{const r=state.records[q.id],row=el('article','question');row.append(el('p','',`${T.groups[q.group]} · ${q.prompt}`),el('p','answer-line',!T.complete(r)?'Pendiente de resolver o de completar la aplicación.':'Resuelta con varios intentos: conviene volver a probarla.'),button('Volver a esta actividad','secondary',()=>move(state.order.indexOf(q.id))));area.append(row);});}
    const actions=el('div','practice-actions');actions.append(button('Repetir con orden mezclado','primary',()=>{const old=state.order.join(',');state=T.fresh(true);if(state.order.join(',')===old)state.order.push(state.order.shift());mode=null;feedback='';success=false;persist();render();$('precision-activity').focus();}));area.append(actions);
  }
  function render(){
    const solved=T.bank.filter(q=>T.complete(state.records[q.id])).length;$('precision-progress').textContent=`${solved} de 20 completadas · sin reloj`;
    const nav=$('precision-nav');nav.replaceChildren();state.order.forEach((id,i)=>{const q=T.bank.find(q=>q.id===id),b=button(`${i+1}${T.complete(state.records[id])?' ✓':''}`,'secondary',()=>move(i));b.setAttribute('aria-label',`Actividad ${i+1}: ${T.groups[q.group]}`);if(i===state.cursor&&!state.summary)b.setAttribute('aria-current','step');nav.append(b);});
    if(state.summary){summary();return;}$('precision-summary').hidden=true;
    const area=$('precision-activity');area.hidden=false;area.replaceChildren();const q=T.bank.find(q=>q.id===state.order[state.cursor]),r=T.record(state,q.id);
    const isApp=mode===null?r.solved&&r.tries>1&&!r.appSolved:mode==='application';const exercise=isApp?q.application:q,done=isApp?r.appSolved:r.solved,attempts=isApp?r.appTries:r.tries;
    area.append(el('span','eyebrow',`ACTIVIDAD ${state.cursor+1} DE 20 · ${T.groups[q.group]}`),el('p','answer-line',isApp?'Aplicación nueva dentro de esta actividad.':'Elegí una opción. Podés volver a cualquier actividad.'),el('h2','practice-heading',exercise.prompt));
    if(!isApp&&q.timeline){const line=el('ol','precision-time');q.timeline.forEach(([time,label])=>{const li=el('li');li.append(el('strong','',time),el('span','',label));line.append(li);});area.append(line);}
    const options=el('div','exercise-options');state.options[q.id][isApp?1:0].forEach(index=>{const b=button(exercise.options[index],'',()=>{
      if(isApp)r.appTries++;else r.tries++;
      success=index===exercise.correct;
      if(success){if(isApp)r.appSolved=true;else r.solved=true;feedback='¡Bien razonado! '+exercise.why;}else feedback='Revisemos tu elección: '+exercise.why+' Compará las tres formas y probá otra vez.';
      mode=isApp?'application':'initial';persist();render();area.querySelector('[role="status"]').focus();
    });b.disabled=done;options.append(b);});area.append(options);
    if(feedback){const status=el('div',success?'feedback success':'feedback',feedback);status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.tabIndex=-1;area.append(status);}
    if(attempts>0&&(!done||attempts>1))comparison(area,exercise.verbs||q.verbs);
    const controls=el('div','practice-actions');
    if(!done&&attempts>0)controls.append(button('Reintentar esta consigna','secondary',()=>{feedback='';success=false;render();area.querySelector('button').focus();}));
    const hadError=r.tries>1||r.tries===1&&!r.solved;
    if(!isApp&&hadError)controls.append(button(r.appSolved?'Revisar la aplicación nueva':'Aplicar con otro ejemplo','primary',()=>{mode='application';feedback='';success=false;render();area.focus();}));
    if(isApp)controls.append(button('Volver a la consigna inicial','secondary',()=>{mode='initial';feedback='';success=false;render();area.focus();}));
    if(T.complete(r)&&state.cursor<19)controls.append(button('Siguiente actividad →','primary',()=>move(state.cursor+1)));
    if(!T.complete(r)&&state.cursor<19)controls.append(button('Dejar para repasar y seguir','secondary',()=>{r.skipped=true;move(state.cursor+1);}));
    if(state.cursor>0)controls.append(button('Anterior','secondary',()=>move(state.cursor-1)));
    controls.append(button('Ver mi balance','secondary',()=>{state.summary=true;persist();render();$('precision-summary').focus();}));area.append(controls);
  }
  persist();render();
}
if(typeof document!=='undefined')initPrecisionTraining();
