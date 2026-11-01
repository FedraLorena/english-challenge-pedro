/* Historial exclusivo de esta aplicación y de Pedro. No enumera ni lee otras
   claves del navegador. Cada registro conserva el examen realmente presentado. */
const AttemptHistory=(()=>{
  const APP='english-challenge-unit4';
  const OWNER='pedro';
  const scope=typeof location!=='undefined'?location.pathname.replace(/[^/]*$/,''):'/';
  const KEY=`${APP}:${OWNER}:history:v1:${scope}`;
  const evaluations={
    original:{id:'original',title:'English Challenge – Unit 4',reportTitle:'ENGLISH CHALLENGE - UNIT 4',reportFilename:'English-Challenge-Unit-4-informe-Pedro.pdf'},
    refuerzo:{id:'refuerzo',title:'Unit 4 — Refuerzo de Pedro',reportTitle:'UNIT 4 - REFUERZO DE PEDRO',reportFilename:'Unit-4-Refuerzo-de-Pedro-informe.pdf'}
  };
  const copy=value=>JSON.parse(JSON.stringify(value));
  function grade(attempt){
    const byTopic=attempt.topics.map((name,topic)=>{
      const items=attempt.questions.map((q,i)=>({q,i})).filter(({q})=>q.topic===topic);
      const correct=items.filter(({q,i})=>attempt.answers[i]===q.correct).length;
      return {name,total:items.length,correct,percent:items.length?Math.round(correct/items.length*100):0};
    });
    const correct=byTopic.reduce((sum,t)=>sum+t.correct,0);
    return {correct,incorrect:attempt.questions.length-correct,score:Math.round(correct/attempt.questions.length*100),byTopic};
  }
  function capture({evaluationId,questions,topics,passages,passageTitles={},answers,createdAt=new Date().toISOString()}){
    const attempt=copy({version:1,owner:OWNER,
      id:typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt,evaluation:evaluations[evaluationId],questions,topics,passages,passageTitles,answers});
    attempt.result=grade(attempt);
    return attempt;
  }
  const text=value=>typeof value==='string'&&value.length>0&&value.length<=12000;
  function valid(attempt){
    if(!attempt||attempt.version!==1||attempt.owner!==OWNER||!text(attempt.id)||!text(attempt.createdAt)||!Number.isFinite(Date.parse(attempt.createdAt)))return false;
    if(!attempt.evaluation||!Object.hasOwn(evaluations,attempt.evaluation.id))return false;
    if(!Array.isArray(attempt.topics)||attempt.topics.length!==4||!attempt.topics.every(text))return false;
    if(!Array.isArray(attempt.questions)||attempt.questions.length!==30||!Array.isArray(attempt.answers)||attempt.answers.length!==30)return false;
    if(!attempt.answers.every(a=>a===null||(Number.isInteger(a)&&a>=0&&a<4)))return false;
    if(!attempt.passages||typeof attempt.passages!=='object'||Array.isArray(attempt.passages))return false;
    if(!attempt.passageTitles||typeof attempt.passageTitles!=='object'||Array.isArray(attempt.passageTitles))return false;
    return attempt.questions.every(q=>q&&text(q.prompt)&&text(q.explanation)&&Number.isInteger(q.topic)&&q.topic>=0&&q.topic<4&&
      Array.isArray(q.options)&&q.options.length===4&&q.options.every(text)&&Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4&&
      (!q.passage||(Object.hasOwn(attempt.passages,q.passage)&&text(attempt.passages[q.passage]))));
  }
  function clean(attempt){
    // Lista explícita: no propaga metadatos ajenos o nombres de otros usuarios.
    const snapshot={version:1,owner:OWNER,id:attempt.id,createdAt:attempt.createdAt,
      evaluation:copy(evaluations[attempt.evaluation.id]),topics:attempt.topics.slice(),answers:attempt.answers.slice(),
      questions:attempt.questions.map(q=>({prompt:q.prompt,options:q.options.slice(),correct:q.correct,topic:q.topic,
        explanation:q.explanation,...(q.passage?{passage:q.passage}:{})})),passages:{},passageTitles:{}};
    for(const q of snapshot.questions)if(q.passage){
      snapshot.passages[q.passage]=attempt.passages[q.passage];
      if(text(attempt.passageTitles[q.passage]))snapshot.passageTitles[q.passage]=attempt.passageTitles[q.passage];
    }
    snapshot.result=grade(snapshot);
    return snapshot;
  }
  function read(storage){
    try{
      const target=storage||localStorage;
      const raw=target.getItem(KEY);
      if(raw===null)return {attempts:[],error:null};
      const data=JSON.parse(raw);
      if(!data||data.app!==APP||data.owner!==OWNER||data.version!==1||!Array.isArray(data.attempts))throw new Error('Formato inválido');
      const attempts=data.attempts.filter(valid).map(clean).sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt));
      return {attempts,error:null};
    }catch{
      return {attempts:[],error:'No se pudo leer el historial local. El navegador puede tener bloqueado el almacenamiento o los datos pueden estar dañados.'};
    }
  }
  function save(attempt,storage){
    try{
      if(!valid(attempt))throw new Error('Intento inválido');
      const target=storage||localStorage;
      const previous=read(target);
      if(previous.error)return {ok:false,error:previous.error+' Este intento no quedó guardado; descargá el PDF antes de salir.'};
      const attempts=[clean(attempt),...previous.attempts.filter(a=>a.id!==attempt.id)];
      target.setItem(KEY,JSON.stringify({app:APP,owner:OWNER,version:1,attempts}));
      return {ok:true,error:null};
    }catch{
      return {ok:false,error:'No se pudo guardar este intento en el navegador (almacenamiento bloqueado o sin espacio). Descargá el PDF antes de salir.'};
    }
  }
  return {capture,grade,read,save};
})();
if(typeof module!=='undefined')module.exports={AttemptHistory};
