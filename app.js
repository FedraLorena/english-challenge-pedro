const form = document.querySelector('#exam');
const container = document.querySelector('#questions');
let answers = Array(questions.length).fill(null);
let finished = false;
const letters = ['A','B','C','D'];
function make(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
function addPassage(parent, key) {
  const block = make('div','passage'); block.lang='en';
  block.append(make('h3','',key === 'lab' ? 'READING · THE SCIENCE CLUB' : 'READING · A BETTER LAMP'),make('div','',passages[key]));
  parent.append(block);
}
function renderExam() {
  container.replaceChildren();
  questions.forEach((q,i)=>{
    if(i===0 || q.topic!==questions[i-1].topic){
      const title=make('h2','topic-heading');
      title.append(make('span','',String(q.topic+1).padStart(2,'0')),document.createTextNode(TOPICS[q.topic]),make('small','',`${questions.filter(x=>x.topic===q.topic).length} preguntas`));
      container.append(title);
    }
    const field=make('fieldset','question');
    const legend=make('legend'); legend.append(make('span','number',`PREGUNTA ${i+1} / 30`),document.createTextNode(q.prompt));
    field.append(legend);
    if(q.passage) addPassage(field,q.passage);
    const options=make('div','options');
    q.options.forEach((option,j)=>{
      const label=make('label','option'); const input=make('input');
      input.type='radio'; input.name=`q${i}`; input.value=j;
      label.append(input,make('span','',`${letters[j]}. ${option}`)); options.append(label);
    });
    field.append(options); container.append(field);
  });
}
form.addEventListener('change',event=>{
  if(finished || event.target.type!=='radio') return;
  const i=Number(event.target.name.slice(1)); answers[i]=Number(event.target.value);
  updateProgress();
});
function updateProgress(){
  const count=answers.filter(a=>a!==null).length;
  document.querySelector('#progress').value=count;
  document.querySelector('#progress-text').textContent=`${count} de 30 respondidas`;
}
form.addEventListener('submit',event=>{
  event.preventDefault(); if(finished) return;
  const pending=answers.filter(a=>a===null).length;
  if(pending){
    document.querySelector('#pending-description').textContent=`${pending===1?'Queda 1 pregunta sin responder.':`Quedan ${pending} preguntas sin responder.`} Si finalizás ahora, se contarán como incorrectas.`;
    document.querySelector('#pending-dialog').showModal();
    return;
  }
  finishExam();
});
document.querySelector('#return-to-exam').addEventListener('click',()=>{
  document.querySelector('#pending-dialog').close();
  const firstPending=answers.findIndex(a=>a===null);
  if(firstPending!==-1) form.querySelector(`input[name="q${firstPending}"]`).focus();
});
document.querySelector('#finish-anyway').addEventListener('click',()=>{
  document.querySelector('#pending-dialog').close();
  finishExam();
});
function finishExam(){
  if(finished) return; finished=true;
  const result=grade(answers);
  document.querySelector('#exam-area').hidden=true;
  const results=document.querySelector('#results'); results.replaceChildren();
  const card=make('div','result-card');
  card.append(make('span','eyebrow','DESAFÍO COMPLETADO'),make('h2','',result.score>=70 ? '¡Buen trabajo, Pedro!' : '¡Seguí practicando, Pedro!'));
  const score=make('div','score',String(result.score)); score.append(make('small','',' / 100')); card.append(score);
  const stats=make('div','stats');
  stats.append(make('span','',`✓ ${result.correct} correctas`),make('span','',`✕ ${result.incorrect} incorrectas`),make('span','',`${answers.filter(a=>a===null).length} sin responder (incluidas en incorrectas)`)); card.append(stats);
  const topics=make('div','topic-results');
  result.byTopic.forEach(t=>{const block=make('div','topic-result');block.append(make('span','',t.name),make('strong','',`${t.percent}%`),make('p','',`${t.correct} de ${t.total} correctas`));topics.append(block);});card.append(topics);
  card.append(make('p','answer-line','Nota redondeada al entero más cercano. Todas las preguntas tienen el mismo valor.'));
  const actions=make('div','result-actions'); const reviewButton=make('button','primary','Revisar respuestas ↓'); reviewButton.type='button'; reviewButton.onclick=()=>document.querySelector('#review').scrollIntoView({behavior:'smooth'});
  const retry=make('button','secondary','Volver a intentarlo');retry.type='button';retry.onclick=reset;
  const download=make('button','secondary','Descargar informe para mamá');download.type='button';
  const reportStatus=make('p','answer-line');reportStatus.setAttribute('role','status');
  download.onclick=()=>{
    if(!finished) return;
    try{
      downloadReport(answers);
      reportStatus.textContent='Informe generado. Buscalo en las descargas del navegador.';
    }catch(error){
      reportStatus.textContent='No se pudo descargar el informe. Volvé a intentarlo desde Chrome, Edge o Firefox.';
      console.error(error);
    }
  };
  actions.append(reviewButton,download,retry);card.append(actions,reportStatus);results.append(card);
  renderReview();results.hidden=false;results.focus();results.scrollIntoView({behavior:'smooth'});
}
function renderReview(){
  const review=document.querySelector('#review');review.replaceChildren(make('h2','review-title','Tu examen, paso a paso'));
  questions.forEach((q,i)=>{
    const correct=answers[i]===q.correct;
    const card=make('article','question review-card');
    card.append(make('div',correct?'status':'status wrong',`${i+1} / 30 · ${TOPICS[q.topic]} · ${correct?'Correcta':answers[i]===null?'Sin responder':'Incorrecta'}`),make('h3','',q.prompt));
    if(q.passage) addPassage(card,q.passage);
    card.append(make('p','answer-line',`Tu respuesta: ${answers[i]===null?'Sin responder':letters[answers[i]]+'. '+q.options[answers[i]]}`),make('p','answer-line',`Respuesta correcta: ${letters[q.correct]}. ${q.options[q.correct]}`),make('div','explanation',q.explanation));
    review.append(card);
  });review.hidden=false;
}
function reset(){
  finished=false;answers=Array(questions.length).fill(null);form.reset();updateProgress();
  for(const id of ['results','review']){const el=document.querySelector('#'+id);el.hidden=true;el.replaceChildren();}
  document.querySelector('#exam-area').hidden=false;
  const first=form.querySelector('input');first.focus({preventScroll:true});document.querySelector('#exam-area').scrollIntoView({behavior:'smooth'});
}
renderExam();
