/* PDF A4 sin dependencias: fuentes estándar, texto WinAnsi y descarga local.
   Las líneas se miden con Courier (0,6 em) para conservar márgenes al imprimir. */
function buildReportPdf(answers, date=new Date()) {
  const result=grade(answers);
  const pages=[];
  let lines=[], y=778;
  const pdfText=text=>{
    const extra={'’':146,'‘':145,'“':147,'”':148,'–':150,'—':151,'→':62};
    return Array.from(String(text)).map(char=>{
      let code=extra[char]??char.charCodeAt(0);
      if(code>255) code=63;
      if(code<32||code>126||'()\\'.includes(String.fromCharCode(code))) return '\\'+code.toString(8).padStart(3,'0');
      return String.fromCharCode(code);
    }).join('');
  };
  function draw(text,size=10,bold=false,color='0.13 0.16 0.28'){
    lines.push(`BT /${bold?'F2':'F1'} ${size} Tf ${color} rg 1 0 0 1 48 ${y} Tm (${pdfText(text)}) Tj ET`);
  }
  function newPage(){
    if(lines.length) pages.push(lines);
    lines=[];y=798;draw('ENGLISH CHALLENGE - UNIT 4',11,true,'0.39 0.28 0.86');y=771;
  }
  function wrap(text){
    const output=[];let line='';
    for(const word of String(text).split(/\s+/)){
      if(line.length+word.length+1>82){output.push(line);line='';}
      line+=(line?' ':'')+word;
    }
    if(line) output.push(line);
    return output;
  }
  function block(text,{bold=false,size=10,gap=7}={}){
    const wrapped=wrap(text);
    const height=wrapped.length*15+gap;
    if(y-height<55) newPage();
    for(const line of wrapped){if(y<70)newPage();draw(line,size,bold);y-=15;}
    y-=gap;
  }
  newPage();
  block('Informe para mamá',{bold:true,size:16,gap:13});
  block('Estudiante: Pedro | 4.º año de secundaria');
  block('Fecha: '+date.toLocaleString('es-AR',{timeZone:'America/Argentina/Buenos_Aires'}));
  block(`NOTA: ${result.score} / 100`,{bold:true,size:14,gap:13});
  block(`Aciertos: ${result.correct} | Errores: ${result.incorrect} | Total: ${questions.length}`);
  block(`Sin responder: ${answers.filter(a=>a===null).length} (incluidas en errores).`);
  block('PORCENTAJE DE ACIERTOS POR TEMA',{bold:true});
  result.byTopic.forEach(t=>block(`${t.name}: ${t.percent}% (${t.correct} de ${t.total})`));
  block('Nota y porcentajes redondeados al entero más cercano. Todas las preguntas valen lo mismo.');
  const wrong=questions.map((q,i)=>({q,i})).filter(({q,i})=>answers[i]!==q.correct);
  block('PREGUNTAS INCORRECTAS Y SIN RESPONDER',{bold:true,gap:12});
  if(!wrong.length) block('¡Todas las respuestas son correctas! No hay errores para revisar.');
  wrong.forEach(({q,i})=>{
    // Mantiene cada pregunta con sus respuestas y explicación en la misma página.
    const texts=[`Pregunta ${i+1} - ${TOPICS[q.topic]}`,q.prompt];
    if(q.passage) texts.push('Texto de lectura: '+passages[q.passage]);
    texts.push('Tu respuesta: '+(answers[i]===null?'Sin responder':'ABCD'[answers[i]]+'. '+q.options[answers[i]]),
      'Respuesta correcta: '+'ABCD'[q.correct]+'. '+q.options[q.correct],
      'Explicación: '+q.explanation);
    const height=texts.reduce((total,text)=>total+wrap(text).length*15+7,0)+10;
    if(y-height<55) newPage();
    block(`Pregunta ${i+1} - ${TOPICS[q.topic]}`,{bold:true});
    block(q.prompt);
    if(q.passage) block('Texto de lectura: '+passages[q.passage]);
    block('Tu respuesta: '+(answers[i]===null?'Sin responder':'ABCD'[answers[i]]+'. '+q.options[answers[i]]));
    block('Respuesta correcta: '+'ABCD'[q.correct]+'. '+q.options[q.correct]);
    block('Explicación: '+q.explanation,{gap:17});
  });
  pages.push(lines);
  const objects=[null,'<< /Type /Catalog /Pages 2 0 R >>','',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>'];
  const kids=[];
  pages.forEach((commands,i)=>{
    const pageId=objects.length, streamId=pageId+1;kids.push(`${pageId} 0 R`);
    const stream=commands.join('\n')+`\nBT /F1 9 Tf 0.4 0.4 0.4 rg 1 0 0 1 48 30 Tm (English Challenge | Pedro | Página ${i+1} de ${pages.length}) Tj ET\n`;
    // El pie también se codifica: todos los objetos son ASCII para offsets exactos.
    const asciiStream=stream.replace('Página','P\\341gina');
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamId} 0 R >>`);
    objects.push(`<< /Length ${asciiStream.length} >>\nstream\n${asciiStream}endstream`);
  });
  objects[2]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`;
  let pdf='%PDF-1.4\n';const offsets=[0];
  for(let i=1;i<objects.length;i++){offsets[i]=pdf.length;pdf+=`${i} 0 obj\n${objects[i]}\nendobj\n`;}
  const xref=pdf.length;
  pdf+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for(let i=1;i<objects.length;i++) pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
  pdf+=`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Uint8Array.from(pdf,char=>char.charCodeAt(0));
}
function downloadReport(answers){
  const blob=new Blob([buildReportPdf(answers)],{type:'application/pdf'});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');
  anchor.href=url;anchor.download='English-Challenge-Unit-4-informe-Pedro.pdf';
  document.body.append(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
if(typeof module!=='undefined') module.exports={buildReportPdf};
