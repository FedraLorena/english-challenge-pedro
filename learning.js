const PastLearning=(()=>{
  const lessons=PastLessons.lessons;
  const exercises=lessons.flatMap(l=>l.activities);
  const scope=typeof location!=='undefined'?location.pathname.replace(/[^/]*$/,''):'/';
  const key=`english-challenge-unit4:pedro:learning:v1:${scope}`;
  const fresh=()=>({version:1,app:'past-mini-class',owner:'pedro',lesson:0,seen:[],solved:[],orderDone:[],cursor:lessons.map(()=>0)});
  const normalize=value=>String(value).normalize('NFKC').toLowerCase().trim().replace(/[.!?]+$/,'').replace(/\s+/g,' ');
  function check(exercise,answer,stage='answer'){
    if(exercise.type==='order'||(exercise.type==='sequence'&&stage==='order'))return Array.isArray(answer)&&JSON.stringify(answer)===JSON.stringify(exercise.correctOrder);
    if(exercise.type==='fill')return normalize(answer)===normalize(exercise.answer);
    return answer===exercise.correct;
  }
  const complete=(state,index)=>state.seen.includes(index)&&lessons[index].activities.every(e=>state.solved.includes(e.id));
  function unlocked(state){let index=0;while(index<lessons.length-1&&complete(state,index))index++;return index;}
  function load(storage){
    try{
      const raw=(storage||localStorage).getItem(key);if(raw===null)return {state:fresh(),error:null,canSave:true};
      const data=JSON.parse(raw);
      if(!data||data.version!==1||data.app!=='past-mini-class'||data.owner!=='pedro'||!Array.isArray(data.seen)||!Array.isArray(data.solved)||!Array.isArray(data.orderDone)||!Array.isArray(data.cursor))throw new Error('Datos inválidos');
      const state=fresh();state.seen=[...new Set(data.seen.filter(i=>Number.isInteger(i)&&i>=0&&i<lessons.length))];
      const allowed=lessons.filter((l,i)=>state.seen.includes(i)).flatMap(l=>l.activities.map(e=>e.id));
      state.solved=[...new Set(data.solved.filter(id=>allowed.includes(id)))];
      state.orderDone=[...new Set(data.orderDone.filter(id=>allowed.includes(id)&&exercises.some(e=>e.id===id&&e.type==='sequence')))];
      state.cursor=lessons.map((l,i)=>Number.isInteger(data.cursor[i])?Math.max(0,Math.min(data.cursor[i],l.activities.length-1)):0);
      state.lesson=Number.isInteger(data.lesson)?Math.max(0,Math.min(data.lesson,unlocked(state))):0;
      return {state,error:null,canSave:true};
    }catch{return {state:fresh(),error:'No se pudieron recuperar los avances. El almacenamiento puede estar bloqueado o dañado. Podés practicar igual, pero esta sesión no se guardará.',canSave:false};}
  }
  function save(state,storage){try{(storage||localStorage).setItem(key,JSON.stringify(state));return true;}catch{return false;}}
  return {fresh,check,complete,unlocked,load,save};
})();
function initLearning(){
  const lessons=PastLessons.lessons;
  const loaded=PastLearning.load();const state=loaded.state;
  let canSave=loaded.canSave,feedback='',success=false,selected=[],done=false;
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
      b.append(el('small','',`${count}/${lesson.activities.length} resueltos${b.disabled?' · Pendiente':''}`));$('lesson-nav').append(b);
    });
  }
  function openLesson(index){
    if(index>PastLearning.unlocked(state))return;
    state.lesson=index;feedback='';selected=[];
    done=state.solved.includes(lessons[index].activities[state.cursor[index]].id);
    persist();render();$('lesson-content').focus();
  }
  function render(){
    renderNav();
    const lesson=lessons[state.lesson],content=$('lesson-content');content.replaceChildren();
    const card=el('article','question rule-card');card.append(el('span','eyebrow',`LECCIÓN ${state.lesson+1} DE 5`),el('h2','',lesson.title));
    lesson.rule.forEach(text=>card.append(el('p','',text)));
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
      persist();paintPractice();$('practice-area').scrollIntoView({behavior:'smooth'});
    }));content.append(card);paintPractice();
  }
  function result(correct,exercise){
    success=correct;
    if(correct){done=true;if(!state.solved.includes(exercise.id))state.solved.push(exercise.id);feedback='¡Bien razonado! '+exercise.why;persist();renderNav();}
    else feedback='Revisemos la idea: '+exercise.hint+' Podés volver a intentar.';
    paintPractice();const status=$('practice-area').querySelector('[role="status"]');if(status)status.focus();
  }
  function paintPractice(){
    const area=$('practice-area');area.replaceChildren();area.hidden=!state.seen.includes(state.lesson);if(area.hidden)return;
    const lesson=lessons[state.lesson],index=state.cursor[state.lesson],exercise=lesson.activities[index];
    const card=el('article','question');card.append(el('span','eyebrow',`EJERCICIO ${index+1} DE ${lesson.activities.length}`),el('h3','practice-heading',exercise.prompt));
    const needsOrder=exercise.type==='order'||exercise.type==='sequence';
    const hasOrder=state.orderDone.includes(exercise.id);
    if(needsOrder&&!(exercise.type==='sequence'&&hasOrder)){
      card.append(el('p','answer-line','Tocá primero la acción que ocurrió antes y después la que ocurrió después.'));
      const options=el('div','exercise-options');
      exercise.actions.forEach((action,i)=>{const b=button(action,'',()=>{
        selected.push(i);
        if(selected.length===2){
          const correct=PastLearning.check(exercise,selected,'order');selected=[];
          if(exercise.type==='sequence'&&correct){state.orderDone.push(exercise.id);feedback='Orden correcto. Ahora usá esa secuencia para elegir la forma o el significado.';success=true;persist();paintPractice();}
          else result(correct,exercise);
        }else paintPractice();
      });b.disabled=selected.includes(i)||done;options.append(b);});card.append(options);
      if(selected.length){card.append(el('p','step-order','1. '+exercise.actions[selected[0]]));card.append(button('Borrar orden','secondary',()=>{selected=[];paintPractice();}));}
    }else{
      if(exercise.type==='sequence'){
        const list=el('ol','step-order');exercise.correctOrder.forEach(i=>list.append(el('li','',exercise.actions[i])));card.append(list,el('h4','practice-heading',exercise.verbPrompt));
      }
      if(exercise.type==='fill'){
        const form=el('form');const label=el('label','answer-line','Escribí la forma que falta');const input=el('input','lesson-input');input.type='text';input.id='learning-answer';input.autocomplete='off';input.spellcheck=false;input.setAttribute('autocapitalize','none');label.htmlFor=input.id;input.disabled=done;
        const check=el('button','primary','Comprobar');check.type='submit';check.disabled=done;
        form.onsubmit=event=>{event.preventDefault();result(PastLearning.check(exercise,input.value),exercise);};form.append(label,el('br'),input,check);card.append(form);
      }else{
        const options=el('div','exercise-options');exercise.options.forEach((text,i)=>{const b=button(text,'',()=>result(PastLearning.check(exercise,i),exercise));b.disabled=done;options.append(b);});card.append(options);
      }
    }
    const status=el('div',success?'feedback success':'feedback',feedback||(done?'Este ejercicio ya está resuelto. Podés repetirlo para practicar de nuevo.':'Elegí o escribí tu respuesta. La explicación aparece después.'));
    status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.tabIndex=-1;card.append(status);
    const actions=el('div','practice-actions');
    actions.append(button('Repetir este ejercicio','secondary',()=>{done=false;selected=[];feedback='';success=false;state.orderDone=state.orderDone.filter(id=>id!==exercise.id);persist();paintPractice();}));
    if(index>0)actions.append(button('Ejercicio anterior','secondary',()=>move(-1)));
    if(index<lesson.activities.length-1){const next=button('Siguiente ejercicio →','primary',()=>move(1));next.disabled=!done;actions.append(next);}
    else if(state.lesson<lessons.length-1){const next=button('Siguiente lección →','primary',()=>openLesson(state.lesson+1));next.disabled=!PastLearning.complete(state,state.lesson);actions.append(next);}
    else if(PastLearning.complete(state,state.lesson))card.append(el('p','feedback success','¡Completaste las cinco lecciones! Volvé a las que quieras repasar o probá Listening Challenge.'));
    card.append(actions);area.append(card);
  }
  function move(delta){
    const lesson=lessons[state.lesson];state.cursor[state.lesson]=Math.max(0,Math.min(state.cursor[state.lesson]+delta,lesson.activities.length-1));
    selected=[];feedback='';success=false;done=state.solved.includes(lesson.activities[state.cursor[state.lesson]].id);persist();paintPractice();$('practice-area').scrollIntoView({behavior:'smooth'});
  }
  $('print-rules').onclick=()=>window.print();
  done=state.solved.includes(lessons[state.lesson].activities[state.cursor[state.lesson]].id);storageMessage();render();
}
if(typeof document!=='undefined')initLearning();
if(typeof module!=='undefined')module.exports={PastLearning};
