const assert = require('node:assert/strict');
const {questions,TOPICS,passages,grade}=require('./questions.js');
assert.equal(questions.length,30);
assert.equal(new Set(questions.map(q=>q.prompt)).size,30);
questions.forEach((q,i)=>{
  assert.equal(q.options.length,4,`Pregunta ${i+1}`);
  assert.equal(new Set(q.options).size,4);
  assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4);
  assert.ok(q.explanation && TOPICS[q.topic]);
  if(q.passage) assert.ok(passages[q.passage]);
});
const key=questions.map(q=>q.correct);
assert.equal(grade(key).score,100);
assert.equal(grade(key).correct,30);
assert.equal(grade(Array(30).fill(null)).score,0);
assert.equal(grade(Array(30).fill(null)).incorrect,30);
assert.equal(grade(questions.map(q=>(q.correct+1)%4)).correct,0);
const mixed=key.map((v,i)=>i<15?v:null);
assert.equal(grade(mixed).score,50);
assert.equal(grade(mixed).incorrect,15);
assert.deepEqual(grade(mixed).byTopic.map(t=>t.percent),[100,63,0,0]);
for(let count=0;count<=30;count++){
  const r=grade(key.map((v,i)=>i<count?v:null));
  assert.equal(r.score,Math.round(count/30*100));
  assert.equal(r.correct,count);assert.equal(r.incorrect,30-count);
  assert.equal(r.byTopic.reduce((sum,t)=>sum+t.total,0),30);
}
console.log('OK: 30 preguntas únicas, cuatro opciones por pregunta, clave válida y cálculo verificado para 0 a 30 aciertos.');
