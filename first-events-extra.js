(()=>{
 const bank=AmpliacionPrimero, $=id=>document.querySelector('#'+id);
 const el=(tag,cls,t)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(t!==undefined)n.textContent=t;return n;};
 const btn=(label,cls,fn)=>{const b=el('button',cls,label);b.type='button';b.onclick=fn;return b;};
 const norm=FirstEvents.normalize;
 const key='english-challenge-unit4:pedro:first-events-extra:v1:'+location.pathname.replace(/[^/]*$/,'');
 const fresh=()=>({cursor:0,answers:bank.map(()=>['','','']),done:false});
 let state=fresh(),past=[],canSave=true,notice='';
 function valid(r){return r&&Number.isInteger(r.cursor)&&r.cursor>=0&&r.cursor<10&&typeof r.done==='boolean'&&Array.isArray(r.answers)&&r.answers.length===10&&r.answers.every(a=>Array.isArray(a)&&a.length===3&&a.every(x=>typeof x==='string'&&x.length<=200)&&['','regular','irregular'].includes(a[2]));}
 try{const raw=localStorage.getItem(key);if(raw!==null){const d=JSON.parse(raw);if(!valid(d.state)||!Array.isArray(d.past)||!d.past.every(r=>valid(r)&&r.done))throw Error();state=d.state;past=d.past;}}catch{canSave=false;}
 function save(){if(canSave)try{localStorage.setItem(key,JSON.stringify({state,past}));}catch{canSave=false;}$('extra-storage').textContent=canSave?'Esta tanda se guarda por separado.':'No se pudo guardar o recuperar esta tanda. Podés continuar en esta página.';}
 function grade(q,a){return q[3].map((f,i)=>norm(a[i]).replace(/^had already /,'had ')===f[1]).concat(a[2]===q[5]);}
 function go(i){state.cursor=i;notice='';save();render();$('extra-area').focus();}
 function review(area,r,title){
   const results=bank.map((q,i)=>grade(q,r.answers[i]));
   area.append(el('h2','',title+' · '+results.filter(x=>x.every(Boolean)).length+' de 10 completos'));
   bank.forEach((q,i)=>{
     const [,events,parts,forms,which,family,,why]=q,a=r.answers[i],ok=results[i],card=el('article','question');
     card.append(el('h3','',(i+25)+'. '+events.map(e=>e[1]).join(' → ')));
     forms.forEach(([base,answer],j)=>{const rule=answer.startsWith('had ')?'Se pide had + participio para destacar lo anterior.':'Este espacio pide Simple Past, sin had.';card.append(el('p','answer-line',base+': '+a[j]+' · '+(ok[j]?'correcto':'correspondía '+answer+'. '+rule)));});
     card.append(el('p','answer-line',forms[which][0]+': '+a[2]+' · '+(ok[2]?'correcto':'correspondía '+family+'.')),el('p','explanation',parts[0]+forms[0][1]+parts[1]+forms[1][1]+parts[2]+' '+why));area.append(card);
   });
 }
 function render(){
   const area=$('extra-area'),nav=$('extra-nav');area.replaceChildren();nav.replaceChildren();
   if(state.done){
     review(area,state,'Resultado de la tanda');
     area.append(btn('Repetir la tanda','primary',()=>{past.push(state);state=fresh();go(0);}));
     if(past.length){const d=el('details');d.append(el('summary','','Tandas anteriores'));past.forEach((r,i)=>{const section=el('section');review(section,r,'Tanda '+(i+1));d.append(section);});area.append(d);}return;
   }
   bank.forEach((_,i)=>{const b=btn(String(i+25),'secondary',()=>go(i));if(i===state.cursor)b.setAttribute('aria-current','step');nav.append(b);});
   const [,events,parts,forms,which,,perfect]=bank[state.cursor],a=state.answers[state.cursor];
   area.append(el('h2','','Actividad '+(25+state.cursor)+' de 34'));
   const line=el('ol','events-timeline');
   events.forEach(([time,label,icon],i)=>{const li=el('li',i?'event-later':'event-earlier'),art=el('div','event-art');art.innerHTML=FirstEventArt.svg(icon);li.append(el('span','event-sequence',i?'2 · DESPUÉS':'1 · PRIMERO'),el('strong','event-time',time),art,el('span','event-label',label));line.append(li);});area.append(line);
   area.append(el('p','event-instruction',perfect?'Destacá la acción anterior en Past Perfect. Escribí la otra en Simple Past.':'Contá las dos acciones sucesivas en Simple Past.'));
   const sentence=el('div','events-sentence');
   parts.forEach((part,i)=>{sentence.append(el('span','',part));if(i<2){const group=el('span','event-field'),label=el('label','',forms[i][0]),input=el('input','lesson-input');input.type='text';input.id='extra-answer-'+i;label.htmlFor=input.id;input.value=a[i];input.maxLength=200;input.autocomplete='off';input.spellcheck=false;input.oninput=()=>{a[i]=input.value;save();};group.append(label,input);sentence.append(group);}});area.append(sentence);
   const label=el('label','','Clasificá '+forms[which][0]+': '),select=el('select','lesson-input');select.id='extra-family';label.htmlFor=select.id;
   [['','Elegí una clasificación'],['regular','Regular'],['irregular','Irregular']].forEach(([value,name])=>{const option=el('option','',name);option.value=value;select.append(option);});select.value=a[2];select.onchange=()=>{a[2]=select.value;save();};area.append(label,select);
   const status=el('p','answer-line',notice);status.setAttribute('role','status');status.tabIndex=-1;area.append(status);
   const controls=el('div','practice-actions');if(state.cursor)controls.append(btn('Anterior','secondary',()=>go(state.cursor-1)));if(state.cursor<9)controls.append(btn('Siguiente →','secondary',()=>go(state.cursor+1)));
   controls.append(btn('Finalizar los diez desafíos','primary',()=>{const missing=state.answers.findIndex(row=>row.some(v=>!norm(v)));if(missing>=0){notice='Falta completar la actividad '+(25+missing)+'. Todavía no se corrigió ninguna respuesta.';status.textContent=notice;status.focus();return;}state.done=true;save();render();area.focus();}));area.append(controls);
 }
 save();render();
})();
