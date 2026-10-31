const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const crypto=require('node:crypto');
// El banco completo se conserva byte por byte, incluidas respuestas y explicaciones.
assert.equal(crypto.createHash('sha256').update(fs.readFileSync('questions.js')).digest('hex'),'f9d4b69b963e086cf788997bbde8e43c08df731888a2d2b26661c525ef575520');
let created,clicked=false,revoked=false;
const anchor={click(){clicked=true;},remove(){}};
const context=vm.createContext({console,Date,Uint8Array,Blob,
  document:{createElement:()=>anchor,body:{append(){}}},
  URL:{createObjectURL(blob){created=blob;return 'blob:test';},revokeObjectURL(){revoked=true;}},
  setTimeout(fn){fn();}
});
vm.runInContext(fs.readFileSync('questions.js','utf8')+'\n'+fs.readFileSync('report.js','utf8'),context);
fs.mkdirSync('tmp/pdfs',{recursive:true});
for(const mode of ['perfect','blank','mixed']){
  const bytes=vm.runInContext(`buildReportPdf(questions.map((q,i)=>${mode==='perfect'?'q.correct':mode==='blank'?'null':'i%3===0?q.correct:i%3===1?(q.correct+1)%4:null'}),new Date('2026-10-31T15:00:00Z'))`,context);
  const text=Buffer.from(bytes).toString('ascii');
  assert.ok(text.startsWith('%PDF-1.4'));
  assert.match(text,/%%EOF/);
  // Valida offsets de objetos, tabla xref y todos los streams ASCII.
  const xref=Number(text.match(/startxref\n(\d+)/)[1]);assert.equal(text.slice(xref,xref+4),'xref');
  for(const match of text.matchAll(/(\d{10}) 00000 n /g))assert.match(text.slice(Number(match[1])),/^\d+ 0 obj/);
  for(const match of text.matchAll(/\/Length (\d+) >>\nstream\n([\s\S]*?)endstream/g))assert.equal(Number(match[1]),match[2].length);
  assert.ok(text.includes(mode==='perfect'?'NOTA: 100 / 100':mode==='blank'?'NOTA: 0 / 100':'NOTA: 33 / 100'));
  const expected=mode==='perfect'?0:mode==='blank'?30:20;
  assert.equal([...text.matchAll(/\(Pregunta \d+ - /g)].length,expected);
  fs.writeFileSync(`tmp/pdfs/report-${mode}.pdf`,bytes);
}
vm.runInContext('downloadReport(questions.map(q=>q.correct))',context);
assert.equal(created.type,'application/pdf');assert.ok(clicked&&revoked);
assert.match(anchor.download,/\.pdf$/);
console.log('OK: banco intacto, PDF perfecto/en blanco/mixto, detalle de errores, offsets, streams y descarga local.');
