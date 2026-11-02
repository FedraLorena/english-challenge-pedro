function initFinalChallenge(){
  const $=id=>document.querySelector('#'+id),make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const button=(label,cls,action)=>{const b=make('button',cls,label);b.type='button';b.onclick=action;return b;};
  let questions=[],answers=[],finished=false;
  function progress(){const count=answers.filter(a=>a!==null).length;$('final-progress').value=count;$('final-progress-text').textContent=`${count} de 20 respondidas`;}
  function start(){
    const old=questions.map(q=>q.id).join(',');questions=FinalChallenge.prepare();
    // Aun si el azar repite el orden completo, el nuevo intento cambia de orden.
    if(questions.map(q=>q.id).join(',')===old)questions.push(questions.shift());
    answers=Array(20).fill(null);finished=false;
    for(const id of ['final-results','final-review','final-history']){$(id).hidden=true;$(id).replaceChildren();}
    $('final-exam-area').hidden=false;$('final-questions').replaceChildren();$('final-status').textContent='';
    questions.forEach((q,i)=>{
      const field=make('fieldset','question');field.id=`final-q-${i}`;const legend=make('legend');legend.append(make('span','number',`PREGUNTA ${i+1} / 20 · ${FinalChallenge.topics[q.topic]}`),document.createTextNode(q.prompt));field.append(legend);
      const options=make('div','options');q.options.forEach((option,j)=>{const label=make('label','option'),input=make('input');input.type='radio';input.name=`final-q${i}`;input.value=String(j);input.onchange=()=>{if(finished)return;answers[i]=j;progress();};label.append(input,make('span','',option));options.append(label);});field.append(options);$('final-questions').append(field);
    });progress();
  }
  function focusFirst(){const field=$('final-questions').children[answers.findIndex(a=>a===null)];const input=(field||$('final-questions')).querySelector('input');if(input)input.focus();}
  function finish(){
    if(finished)return;finished=true;
    const attempt={version:1,id:typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,createdAt:new Date().toISOString(),questions:JSON.parse(JSON.stringify(questions)),answers:answers.slice()};
    const saved=FinalChallenge.save(attempt);$('final-status').textContent=saved.ok?'Intento guardado en el historial exclusivo del desafío final.':saved.error;display(attempt);
  }
  $('final-form').onsubmit=event=>{event.preventDefault();if(finished)return;const pending=answers.filter(a=>a===null).length;if(pending){$('final-pending-text').textContent=`Quedan ${pending} preguntas sin responder. Si corregís ahora, cuentan como incorrectas.`;$('final-pending').showModal();}else finish();};
  $('final-return').onclick=()=>{$('final-pending').close();focusFirst();};
  $('final-finish-anyway').onclick=()=>{$('final-pending').close();finish();};
  $('final-check-choices').onclick=()=>{const pending=answers.flatMap((a,i)=>a===null?[i+1]:[]);$('final-choices-status').textContent=pending.length?`Falta responder: ${pending.join(', ')}. Podés cambiar cualquier elección antes de corregir.`:'Respondiste las 20 preguntas. Podés recorrerlas y cambiar cualquier elección antes de corregir.';};
  function display(attempt){
    const result=FinalChallenge.grade(attempt);$('final-history').hidden=true;$('final-exam-area').hidden=true;
    const results=$('final-results');results.replaceChildren();
    const card=make('div','result-card');card.append(make('span','eyebrow','DESAFÍO FINAL DE PEDRO'),make('h2','','Tu resultado'),make('p','answer-line',new Date(attempt.createdAt).toLocaleString('es-AR',{timeZone:'America/Argentina/Buenos_Aires'})));
    const score=make('div','score',String(result.score));score.append(make('small','',' / 100'));card.append(score,make('p','',`${result.correct} aciertos · ${result.incorrect} errores · 5 puntos por acierto`));
    const topics=make('div','topic-results');result.byTopic.forEach(t=>{const block=make('div','topic-result');block.append(make('span','',t.name),make('strong','',`${t.correct} / ${t.total}`),make('p','',`${t.correct} aciertos · ${t.incorrect} errores`));topics.append(block);});card.append(topics);
    const errorCounts={};attempt.questions.forEach((q,i)=>{if(attempt.answers[i]!==q.correct)errorCounts[q.errorType]=(errorCounts[q.errorType]||0)+1;});
    card.append(make('p','answer-line',Object.keys(errorCounts).length?'Errores para revisar: '+Object.entries(errorCounts).map(([type,count])=>`${type}: ${count}`).join(' · '):'Sin errores en este intento.'));
    const actions=make('div','result-actions');actions.append(button('Revisar respuestas ↓','primary',()=>{$('final-review').scrollIntoView({behavior:'smooth'});$('final-review').focus();}),button('Repetir con otro orden','secondary',()=>{start();focusFirst();}));
    if(!finished)actions.append(button('Volver a mi examen en curso','secondary',()=>{results.hidden=true;$('final-review').hidden=true;$('final-exam-area').hidden=false;focusFirst();}));card.append(actions);results.append(card);results.hidden=false;
    const review=$('final-review');review.replaceChildren(make('h2','review-title','Revisión pregunta por pregunta'));
    attempt.questions.forEach((q,i)=>{const selected=attempt.answers[i],correct=selected===q.correct;const article=make('article','question review-card');article.append(make('p',correct?'status':'status wrong',`${i+1} / 20 · ${FinalChallenge.topics[q.topic]} · ${correct?'Correcta (+5)':selected===null?'Sin responder (+0)':'Incorrecta (+0)'}`),make('h3','',q.prompt),make('p','answer-line',`Tu respuesta: ${selected===null?'Sin responder':q.options[selected]}`),make('p','answer-line',`Respuesta correcta: ${q.options[q.correct]}`));
      if(!correct)article.append(make('p','answer-line',`${selected===null?'Área pendiente':'Tipo de error'}: ${q.errorType}.`));article.append(make('div','explanation',q.explanation));review.append(article);
    });review.hidden=false;results.focus();results.scrollIntoView({behavior:'smooth'});
  }
  $('final-show-history').onclick=()=>{
    const history=FinalChallenge.read();$('final-status').textContent=history.error||'';const panel=$('final-history');panel.replaceChildren(make('h2','review-title','Historial del desafío final'));
    if(!history.attempts.length)panel.append(make('p','answer-line',history.error?'No se pudo recuperar el historial.':'Todavía no hay intentos finalizados.'));
    history.attempts.forEach(a=>{const result=FinalChallenge.grade(a),row=make('article','question');row.append(make('h3','',`${result.score}/100 · ${new Date(a.createdAt).toLocaleString('es-AR',{timeZone:'America/Argentina/Buenos_Aires'})}`),make('p','answer-line',`${result.correct} aciertos · ${result.incorrect} errores`),button('Revisar este intento','secondary',()=>display(a)));panel.append(row);});
    panel.append(button('Cerrar historial','secondary',()=>{panel.hidden=true;$('final-show-history').focus();}));panel.hidden=false;panel.focus();panel.scrollIntoView({behavior:'smooth'});
  };
  start();
}
if(typeof document!=='undefined')initFinalChallenge();

