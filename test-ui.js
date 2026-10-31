// Prueba de interacciones con DOM mínimo, sin dependencias ni navegador.
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
class Element {
  constructor(tag='div'){this.tagName=tag;this.children=[];this.events={};this.hidden=false;this.textContent='';}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  addEventListener(name,fn){this.events[name]=fn;}
  focus(){this.focused=true;} scrollIntoView(){}
  setAttribute(name,value){this[name]=value;}
  showModal(){this.open=true;}
  close(){this.open=false;}
  reset(){walk(this).filter(el=>el.tagName==='input').forEach(el=>el.checked=false);}
  querySelector(selector){const name=selector.match(/name="([^"]+)"/);return walk(this).find(el=>el.tagName==='input'&&(!name||el.name===name[1]));}
}
function walk(el){return [el,...el.children.filter(x=>x instanceof Element).flatMap(walk)];}
function content(el){return [el.textContent,...el.children.map(x=>x instanceof Element?content(x):x)].join(' ');}
const ids={};
for(const name of ['exam','questions','progress','progress-text','exam-area','results','review','pending-dialog','pending-description','return-to-exam','finish-anyway']) ids['#'+name]=new Element();
ids['#exam'].append(ids['#questions']);
ids['#results'].hidden=ids['#review'].hidden=true;
const document={querySelector:s=>ids[s],createElement:tag=>new Element(tag),createTextNode:s=>s};
let downloaded;
const context=vm.createContext({document,console,downloadReport:answers=>{downloaded=Array.from(answers);}});
vm.runInContext(fs.readFileSync('questions.js','utf8')+'\n'+fs.readFileSync('app.js','utf8'),context);
assert.equal(walk(ids['#questions']).filter(el=>el.tagName==='input').length,120);
assert.ok(ids['#review'].hidden);
assert.equal(ids['#review'].children.length,0);
const key=vm.runInContext('questions.map(q=>q.correct)',context);
key.forEach((v,i)=>ids['#exam'].events.change({target:{type:'radio',name:'q'+i,value:String(v)}}));
assert.equal(ids['#progress'].value,30);
const submit=()=>ids['#exam'].events.submit({preventDefault(){}});
submit();
assert.ok(ids['#exam-area'].hidden);
assert.equal(ids['#results'].hidden,false);
assert.equal(ids['#review'].hidden,false);
assert.match(content(ids['#results']),/30 correctas/);
assert.match(content(ids['#results']),/0 incorrectas/);
assert.equal(walk(ids['#review']).filter(el=>el.tagName==='article').length,30);
const download=walk(ids['#results']).find(el=>el.textContent==='Descargar informe para mamá');
download.onclick();assert.deepEqual(downloaded,Array.from(key));
const retry=walk(ids['#results']).find(el=>el.textContent==='Volver a intentarlo');
retry.onclick();
assert.equal(ids['#exam-area'].hidden,false);
assert.ok(ids['#results'].hidden&&ids['#review'].hidden);
assert.equal(ids['#review'].children.length,0);
assert.equal(ids['#progress'].value,0);
submit();
assert.ok(ids['#pending-dialog'].open);
assert.match(ids['#pending-description'].textContent,/30 preguntas/);
assert.ok(ids['#review'].hidden);
assert.equal(ids['#exam-area'].hidden,false);
ids['#return-to-exam'].events.click();
assert.equal(ids['#pending-dialog'].open,false);
assert.ok(ids['#exam'].querySelector('input[name="q0"]').focused);
assert.ok(ids['#review'].hidden);
submit();ids['#finish-anyway'].events.click();
assert.match(content(ids['#results']),/0 correctas/);
assert.match(content(ids['#results']),/30 incorrectas/);
assert.match(content(ids['#review']),/Sin responder/);
walk(ids['#results']).find(el=>el.textContent==='Volver a intentarlo').onclick();
key.forEach((v,i)=>{if(i<29)ids['#exam'].events.change({target:{type:'radio',name:'q'+i,value:String(v)}});});
submit();assert.match(ids['#pending-description'].textContent,/Queda 1 pregunta/);
ids['#return-to-exam'].events.click();
assert.equal(ids['#progress'].value,29);
assert.ok(ids['#exam'].querySelector('input[name="q29"]').focused);
ids['#exam'].events.change({target:{type:'radio',name:'q29',value:String(key[29])}});
submit();assert.equal(ids['#pending-dialog'].open,false);
assert.match(content(ids['#results']),/30 correctas/);
console.log('OK: opciones, soluciones ocultas, advertencia (1 y 30 pendientes), ambas acciones, foco, respuestas conservadas, descarga, revisión y reinicio. DOM simulado; sin inspección visual de la web.');
