const PastLearning=(()=>{
  const lessons=PastLessons.lessons;
  const exercises=lessons.flatMap(l=>l.activities);
  const scope=typeof location!=='undefined'?location.pathname.replace(/[^/]*$/,''):'/';
  const key=`english-challenge-unit4:pedro:learning:v1:${scope}`;
  const fresh=()=>({version:1,app:'past-mini-class',owner:'pedro',lesson:0,seen:[],solved:[],orderDone:[],checks:[],matches:{},blocks:{},cursor:lessons.map(()=>0)});
  const normalize=value=>String(value).normalize('NFKC').toLowerCase().trim().replace(/[.!?]+$/,'').replace(/\s+/g,' ');
  function check(exercise,answer,stage='answer'){
    if(exercise.type==='order'||exercise.type==='blocks'||(exercise.type==='sequence'&&stage==='order'))return Array.isArray(answer)&&JSON.stringify(answer)===JSON.stringify(exercise.correctOrder);
    if(exercise.type==='match')return answer&&Number.isInteger(answer.left)&&answer.left>=0&&answer.left<exercise.pairs.length&&answer.left===answer.right;
    if(exercise.type==='fill')return normalize(answer)===normalize(exercise.answer);
    return answer===exercise.correct;
  }
  const practiceComplete=(state,index)=>state.seen.includes(index)&&lessons[index].activities.every(e=>state.solved.includes(e.id));
  const complete=(state,index)=>practiceComplete(state,index)&&state.checks.includes(index);
  function unlocked(state){
    let index=0;while(index<lessons.length-1&&complete(state,index))index++;
    // Una actualización no vuelve a bloquear las lecciones que ya había abierto Pedro.
    return Math.max(index,...state.seen);
  }
  function load(storage){
    try{
      const raw=(storage||localStorage).getItem(key);if(raw===null)return {state:fresh(),error:null,canSave:true};
      const data=JSON.parse(raw);
      if(!data||data.version!==1||data.app!=='past-mini-class'||data.owner!=='pedro'||!Array.isArray(data.seen)||!Array.isArray(data.solved)||!Array.isArray(data.orderDone)||!Array.isArray(data.cursor))throw new Error('Datos inválidos');
      const state=fresh();state.seen=[...new Set(data.seen.filter(i=>Number.isInteger(i)&&i>=0&&i<lessons.length))];
      const allowed=lessons.filter((l,i)=>state.seen.includes(i)).flatMap(l=>l.activities.map(e=>e.id));
      state.solved=[...new Set(data.solved.filter(id=>allowed.includes(id)))];
      state.orderDone=[...new Set(data.orderDone.filter(id=>allowed.includes(id)&&exercises.some(e=>e.id===id&&e.type==='sequence')))];
      state.checks=[...new Set((Array.isArray(data.checks)?data.checks:[]).filter(i=>Number.isInteger(i)&&state.seen.includes(i)))];
      for(const exercise of exercises.filter(e=>allowed.includes(e.id))){
        if(exercise.type==='match')state.matches[exercise.id]=[...new Set((Array.isArray(data.matches?.[exercise.id])?data.matches[exercise.id]:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<exercise.pairs.length))];
        if(exercise.type==='blocks')state.blocks[exercise.id]=[...new Set((Array.isArray(data.blocks?.[exercise.id])?data.blocks[exercise.id]:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<exercise.tokens.length))].slice(0,exercise.correctOrder.length);
      }
      state.cursor=lessons.map((l,i)=>Number.isInteger(data.cursor[i])?Math.max(0,Math.min(data.cursor[i],l.activities.length-1)):0);
      state.lesson=Number.isInteger(data.lesson)?Math.max(0,Math.min(data.lesson,unlocked(state))):0;
      return {state,error:null,canSave:true};
    }catch{return {state:fresh(),error:'No se pudieron recuperar los avances. El almacenamiento puede estar bloqueado o dañado. Podés practicar igual, pero esta sesión no se guardará.',canSave:false};}
  }
  function save(state,storage){try{(storage||localStorage).setItem(key,JSON.stringify(state));return true;}catch{return false;}}
  return {fresh,check,practiceComplete,complete,unlocked,load,save};
})();
function initLearning(){
  const lessons=PastLessons.lessons;
  const loaded=PastLearning.load();const state=loaded.state;
  let canSave=loaded.canSave,feedback='',success=false,selected=[],done=false,matchSelected=null,replaying=false;
  const checkFeedback={},checkRepeats={};
  const $=id=>document.querySelector('#'+id);
  const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
  const button=(label,cls,fn)=>{const b=el('button',cls,label);b.type='button';b.onclick=fn;return b;};
  const storageMessage=()=>{$('learning-storage').textContent=canSave?'Tu avance se guarda en este navegador. El progreso cuenta ejercicios resueltos al menos una vez.':loaded.error||'No se pudo guardar el avance. Podés seguir practicando; no se conservará al cerrar.';};
  function persist(){if(canSave&&!PastLearning.save(state))canSave=false;storageMessage();}
  function renderNav(){
    $('lesson-nav').replaceChildren();
    lessons.forEach((lesson,i)=>{
      const count=lesson.activities.filter(e=>state.solved.includes(e.id)).length;
      const b=button(`${i+1}. ${lesson.title}`,'',()=>openLesson(i));
      b.disabled=i>PastLearning.unlocked(state);
      if(i===state.lesson)b.setAttribute('aria-current','step');
      b.append(el('small','',`${count}/${lesson.activities.length} resueltos${state.checks.includes(i)?' · ✓ Idea comprendida':b.disabled?' · Pendiente':''}`));$('lesson-nav').append(b);
    });
    const bar=document.querySelector('#lesson-progressbar'),label=document.querySelector('#lesson-progresslabel');
    if(bar&&label){const lesson=lessons[state.lesson],count=lesson.activities.filter(e=>state.solved.includes(e.id)).length;bar.value=count+Number(state.checks.includes(state.lesson));label.textContent=`${count} de ${lesson.activities.length} actividades comprendidas · cierre ${state.checks.includes(state.lesson)?'resuelto':'pendiente'}`;}
  }
  function openLesson(index){
    if(index>PastLearning.unlocked(state))return;
    state.lesson=index;feedback='';selected=[];success=false;matchSelected=null;replaying=false;
    done=state.solved.includes(lessons[index].activities[state.cursor[index]].id);
    persist();render();$('lesson-content').focus();
  }
  function render(){
    renderNav();
    const lesson=lessons[state.lesson],content=$('lesson-content');content.replaceChildren();
    const card=el('article','question rule-card');card.append(el('span','eyebrow',`LECCIÓN ${state.lesson+1} DE 5`),el('h2','',lesson.title));
    lesson.rule.forEach(text=>card.append(el('p','',text)));
    const count=lesson.activities.filter(e=>state.solved.includes(e.id)).length;
    const progress=el('progress');progress.id='lesson-progressbar';progress.max=lesson.activities.length+1;progress.value=count+Number(state.checks.includes(state.lesson));progress.setAttribute('aria-label',`Avance de ${lesson.title}`);
    const progressLabel=el('p','answer-line',`${count} de ${lesson.activities.length} actividades comprendidas · cierre ${state.checks.includes(state.lesson)?'resuelto':'pendiente'}`);progressLabel.id='lesson-progresslabel';card.append(progressLabel,progress);
    const examples=el('div','compare-grid');
    lesson.examples.forEach(([en,es])=>{const item=el('div','compare-card');const english=el('p','',en);english.lang='en';item.append(english,el('p','',es));examples.append(item);});card.append(examples);
    if(lesson.table){
      const wrap=el('div','table-scroll'),table=el('table','verbs');const head=el('thead'),row=el('tr');
      ['Verbo base','Simple Past','Participio'].forEach(t=>{const th=el('th','',t);th.scope='col';row.append(th);});head.append(row);table.append(head);
      const body=el('tbody');lesson.table.forEach(values=>{const row=el('tr');values.forEach(v=>row.append(el('td','',v)));body.append(row);});table.append(body);wrap.append(table);card.append(wrap);
    }
    if(lesson.timeline){const timeline=el('ol','timeline');timeline.setAttribute('aria-label','Orden de acontecimientos');lesson.timeline.forEach(([time,en,es])=>{const li=el('li');li.append(el('strong','',time),el('span','',en),el('span','',es));timeline.append(li);});card.append(timeline);}
    card.append(button('Leí la explicación · practicar','primary',()=>{
      if(!state.seen.includes(state.lesson))state.seen.push(state.lesson);
      persist();render();$('practice-area').scrollIntoView({behavior:'smooth'});
    }));
    if(state.seen.includes(state.lesson))card.append(button('Repetir lección desde el inicio','secondary',()=>{
      state.cursor[state.lesson]=0;replaying=true;done=false;selected=[];matchSelected=null;feedback='';success=false;
      resetDraft(lesson.activities[0]);persist();render();$('practice-area').scrollIntoView({behavior:'smooth'});
    }));
    content.append(card);paintPractice();
  }
  function focusFeedback(){const status=$('practice-area').querySelector('[role="status"]');if(status)status.focus();}
  function result(correct,exercise){
    success=correct;
    if(correct){done=true;if(!state.solved.includes(exercise.id))state.solved.push(exercise.id);feedback='¡Bien razonado! '+exercise.why;persist();renderNav();}
    else feedback='Revisemos la idea: '+exercise.hint+' Podés volver a intentar.';
    paintPractice();focusFeedback();
  }
  function resetDraft(exercise){
    state.orderDone=state.orderDone.filter(id=>id!==exercise.id);
    if(exercise.type==='blocks')state.blocks[exercise.id]=[];
    if(exercise.type==='match')state.matches[exercise.id]=[];
  }
  function drawTimeline(parent,exercise,order){
    const timeline=el('ol','timeline activity-timeline');timeline.setAttribute('aria-label','Tu orden de acciones: antes y después');
    ['1 · Antes','2 · Después'].forEach((label,i)=>{const li=el('li');li.append(el('strong','',label),el('span','',order[i]===undefined?'Tocá una acción para ubicarla.':exercise.actions[order[i]]));timeline.append(li);});parent.append(timeline);
  }
  function paintBlocks(card,exercise){
    const draft=state.blocks[exercise.id]||(state.blocks[exercise.id]=[]);
    const construction=el('ol','sentence-build');construction.setAttribute('aria-label','Tu oración construida');
    (done&&draft.length===0?exercise.correctOrder:draft).forEach(i=>construction.append(el('li','',exercise.tokens[i])));
    if(!draft.length&&!done)construction.append(el('li','','Tu oración va a aparecer acá.'));
    card.append(construction,el('p','answer-line',`${draft.length} de ${exercise.correctOrder.length} bloques elegidos. Tocá los bloques de abajo en el orden de la oración.`));
    const bank=el('div','word-bank');
    exercise.tokens.forEach((word,i)=>{const b=button(word,'word-tile',()=>{draft.push(i);persist();paintPractice();});b.disabled=done||draft.includes(i)||draft.length>=exercise.correctOrder.length;b.setAttribute('aria-pressed',String(draft.includes(i)));bank.append(b);});card.append(bank);
    const controls=el('div','practice-actions');
    const undo=button('Quitar último bloque','secondary',()=>{draft.pop();persist();paintPractice();});undo.disabled=done||draft.length===0;
    const clear=button('Limpiar bloques','secondary',()=>{state.blocks[exercise.id]=[];persist();paintPractice();});clear.disabled=done||draft.length===0;
    const check=button('Comprobar mi oración','primary',()=>result(PastLearning.check(exercise,draft),exercise));check.disabled=done||draft.length!==exercise.correctOrder.length;
    controls.append(undo,clear,check);card.append(controls);
  }
  function paintMatch(card,exercise){
    const matched=state.matches[exercise.id]||(state.matches[exercise.id]=[]);
    card.append(el('p','answer-line',`${matched.length}/${exercise.pairs.length} parejas unidas. ${matchSelected===null?'Elegí primero una oración en inglés.':'Ahora elegí su traducción al español.'}`));
    const board=el('div','match-board'),english=el('div','match-list'),spanish=el('div','match-list');english.append(el('h4','','Inglés'));spanish.append(el('h4','','Español'));
    exercise.pairs.forEach((pair,i)=>{
      const b=button(pair.en+(matched.includes(i)?' ✓':''),'match-tile',()=>{matchSelected=i;feedback='Ahora tocá la traducción que corresponde.';success=false;paintPractice();});b.lang='en';b.disabled=done||matched.includes(i);b.setAttribute('aria-pressed',String(matchSelected===i));english.append(b);
    });
    exercise.pairs.map((_,i)=>(i+1)%exercise.pairs.length).forEach(i=>{
      const pair=exercise.pairs[i];const b=button(pair.es+(matched.includes(i)?' ✓':''),'match-tile',()=>{
        if(matchSelected===null){feedback='Elegí primero una tarjeta en inglés.';success=false;paintPractice();focusFeedback();return;}
        const left=matchSelected;
        if(PastLearning.check(exercise,{left,right:i})){
          matched.push(left);matchSelected=null;persist();
          if(matched.length===exercise.pairs.length){result(true,exercise);return;}
          feedback='¡Pareja encontrada! '+exercise.pairs[left].why;success=true;
        }else{feedback='Revisemos esta pareja: '+exercise.hint+' '+exercise.pairs[left].why+' Podés volver a intentar.';success=false;}
        paintPractice();focusFeedback();
      });b.disabled=done||matched.includes(i);spanish.append(b);
    });board.append(english,spanish);card.append(board);
  }
  function paintCheckpoint(area){
    if(!PastLearning.practiceComplete(state,state.lesson))return;
    const lesson=lessons[state.lesson],check=lesson.checkpoint,index=state.lesson,passed=state.checks.includes(index);
    const card=el('article','question comprehension-check');card.append(el('span','eyebrow','UNA IDEA ANTES DE SEGUIR · SIN NOTA'),el('h3','practice-heading',check.prompt),el('p','activity-intro','Tomate un momento para explicar la idea. Podés probar de nuevo todas las veces que quieras; tus logros no se descuentan.'));
    const options=el('div','exercise-options');check.options.forEach((text,i)=>{
      const b=button(text,'',()=>{
        const correct=PastLearning.check(check,i);
        checkFeedback[index]={success:correct,text:correct?'¡Idea comprendida! '+check.why:'Pensemos otra vez: '+check.hint};
        if(correct){if(!state.checks.includes(index))state.checks.push(index);checkRepeats[index]=false;persist();renderNav();}
        paintPractice();const status=$('practice-area').querySelector('#checkpoint-feedback');if(status)status.focus();
      });b.disabled=passed&&!checkRepeats[index];options.append(b);
    });card.append(options);
    const feedback=checkFeedback[index]||{success:passed,text:passed?'Idea comprendida. '+check.why:'No es una prueba: elegí la explicación que tenga sentido.'};
    const status=el('div',feedback.success?'feedback success':'feedback',feedback.text);status.id='checkpoint-feedback';status.setAttribute('role','status');status.tabIndex=-1;card.append(status);
    if(passed)card.append(button('Volver a pensar esta idea','secondary',()=>{checkRepeats[index]=true;checkFeedback[index]={success:false,text:'Probá de nuevo. Lo que ya comprendiste sigue guardado.'};paintPractice();}));
    if(index<lessons.length-1){const next=button('Siguiente lección →','primary',()=>openLesson(index+1));next.disabled=!PastLearning.complete(state,index);card.append(next);}
    else if(PastLearning.complete(state,index))card.append(el('p','feedback success',lessons.every((_,i)=>PastLearning.complete(state,i))?'¡Completaste las cinco lecciones! Podés repetir cualquiera o volver al refuerzo cuando quieras.':'¡Práctica final completa! Podés volver a las otras lecciones y descubrir sus actividades nuevas.'));
    area.append(card);
  }
  function paintPractice(){
    const area=$('practice-area');area.replaceChildren();area.hidden=!state.seen.includes(state.lesson);if(area.hidden)return;
    const lesson=lessons[state.lesson],index=state.cursor[state.lesson],exercise=lesson.activities[index];
    const kind={choice:'Elegí y razoná',word:'Elegí una palabra',fill:'Completá',order:'Ordená',sequence:'Primero ubicá las acciones',blocks:'Construí con bloques',match:'Uní traducciones'}[exercise.type];
    const card=el('article','question');card.append(el('span','eyebrow',`EJERCICIO ${index+1} DE ${lesson.activities.length} · ${kind}`),el('aside','activity-intro',exercise.intro),el('h3','practice-heading',exercise.prompt));
    const needsOrder=exercise.type==='order'||exercise.type==='sequence';
    const hasOrder=state.orderDone.includes(exercise.id);
    if(needsOrder&&!(exercise.type==='sequence'&&hasOrder)){
      drawTimeline(card,exercise,done?exercise.correctOrder:selected);
      card.append(el('p','answer-line','Tocá primero la acción que ocurrió antes y después la que ocurrió después.'));
      const options=el('div','exercise-options');
      exercise.actions.forEach((action,i)=>{const b=button(action,'',()=>{
        selected.push(i);
        if(selected.length===2){
          const correct=PastLearning.check(exercise,selected,'order');selected=[];
          if(exercise.type==='sequence'&&correct){if(!state.orderDone.includes(exercise.id))state.orderDone.push(exercise.id);feedback='Orden correcto. Ahora usá esa secuencia para elegir la forma o el significado.';success=true;persist();paintPractice();}
          else result(correct,exercise);
        }else paintPractice();
      });b.disabled=selected.includes(i)||done;options.append(b);});card.append(options);
      if(selected.length){card.append(el('p','step-order','1. '+exercise.actions[selected[0]]));card.append(button('Borrar orden','secondary',()=>{selected=[];paintPractice();}));}
    }else{
      if(exercise.type==='sequence'){
        drawTimeline(card,exercise,exercise.correctOrder);card.append(el('h4','practice-heading',exercise.verbPrompt));
      }
      if(exercise.type==='fill'){
        const form=el('form');const label=el('label','answer-line','Escribí la forma que falta');const input=el('input','lesson-input');input.type='text';input.id='learning-answer';input.autocomplete='off';input.spellcheck=false;input.setAttribute('autocapitalize','none');label.htmlFor=input.id;input.disabled=done;
        const check=el('button','primary','Comprobar');check.type='submit';check.disabled=done;
        form.onsubmit=event=>{event.preventDefault();result(PastLearning.check(exercise,input.value),exercise);};form.append(label,el('br'),input,check);card.append(form);
      }else if(exercise.type==='blocks')paintBlocks(card,exercise);
      else if(exercise.type==='match')paintMatch(card,exercise);
      else{
        const options=el('div','exercise-options');exercise.options.forEach((text,i)=>{const b=button(text,'',()=>result(PastLearning.check(exercise,i),exercise));b.disabled=done;options.append(b);});card.append(options);
      }
    }
    const status=el('div',success?'feedback success':'feedback',feedback||(done?'Este ejercicio ya está resuelto. Podés repetirlo para practicar de nuevo.':'Elegí o escribí tu respuesta. La explicación aparece después.'));
    status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.tabIndex=-1;card.append(status);
    const actions=el('div','practice-actions');
    actions.append(button('Repetir este ejercicio','secondary',()=>{done=false;selected=[];matchSelected=null;feedback='';success=false;resetDraft(exercise);persist();paintPractice();}));
    if(index>0)actions.append(button('Ejercicio anterior','secondary',()=>move(-1)));
    if(index<lesson.activities.length-1){const next=button('Siguiente ejercicio →','primary',()=>move(1));next.disabled=!done;actions.append(next);}
    else if(!PastLearning.practiceComplete(state,state.lesson))card.append(el('p','answer-line','Repasá las actividades pendientes para llegar al cierre de esta lección.'));
    card.append(actions);area.append(card);paintCheckpoint(area);
  }
  function move(delta){
    const lesson=lessons[state.lesson];state.cursor[state.lesson]=Math.max(0,Math.min(state.cursor[state.lesson]+delta,lesson.activities.length-1));
    selected=[];matchSelected=null;feedback='';success=false;done=!replaying&&state.solved.includes(lesson.activities[state.cursor[state.lesson]].id);
    if(replaying)resetDraft(lesson.activities[state.cursor[state.lesson]]);
    persist();paintPractice();$('practice-area').scrollIntoView({behavior:'smooth'});
  }
  $('print-rules').onclick=()=>window.print();
  done=state.solved.includes(lessons[state.lesson].activities[state.cursor[state.lesson]].id);storageMessage();render();
}
if(typeof document!=='undefined')initLearning();
if(typeof module!=='undefined')module.exports={PastLearning};
