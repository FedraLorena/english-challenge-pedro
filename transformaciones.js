const Transformaciones=(()=>{
  const bank=[
    ['see','ver','saw','seen','Tres formas distintas. El pasado y el participio no se intercambian.','Yesterday I ___ a shooting star.','sp'],
    ['go','ir','went','gone','El pasado cambia por completo; el participio tiene otra forma.','When the rain started, I ___ home.','pp'],
    ['write','escribir','wrote','written','Cambia la vocal en el pasado y el participio tiene su propia terminación.','Yesterday I ___ a note for my friend.','sp'],
    ['eat','comer','ate','eaten','El pasado cambia la vocal y el participio termina en -en.','When practice began, we ___ our snack.','pp'],
    ['take','tomar','took','taken','El pasado cambia la vocal; el participio termina en -en.','Last Saturday I ___ a photo of the moon.','sp'],
    ['grow','crecer','grew','grown','El pasado cambia la vocal; el participio termina en -n.','When we moved the plants, they ___ several centimetres.','pp'],
    ['buy','comprar','bought','bought','Verbo irregular: el pasado y el participio coinciden.','Yesterday I ___ a guitar pick.','sp'],
    ['make','hacer','made','made','Verbo irregular: el pasado y el participio coinciden.','When the guests arrived, we ___ the sandwiches.','pp'],
    ['put','poner','put','put','Verbo irregular invariable: las tres formas coinciden.','Yesterday I ___ my keys in my bag.','sp'],
    ['study','estudiar','studied','studied','Verbo regular: consonante + y cambia a i antes de -ed.','When the quiz began, I ___ the vocabulary.','pp'],
    ['stop','detenerse','stopped','stopped','Verbo regular: duplica la p antes de -ed.','Yesterday the bus ___ outside my house.','sp'],
    ['finish','terminar','finished','finished','Verbo regular: suma -ed; pasado y participio coinciden.','When my friend called, I ___ the poster.','pp']
  ];
  const normalize=value=>String(value).trim().toLowerCase().replace(/[.!?,;:]+$/,'').trim().replace(/\s+/g,' ');
  const key='english-challenge-unit4:pedro:transformaciones:v1:'+location.pathname.replace(/[^/]*$/,'');
  const fresh=()=>({index:0,records:{},queue:bank.map(v=>v[0]),summary:false});
  let state=fresh(),canSave=true,feedback=null;
  try{
    const raw=localStorage.getItem(key);
    if(raw!==null){
      const data=JSON.parse(raw),ids=bank.map(v=>v[0]);
      if(!data||!Array.isArray(data.queue)||!data.queue.length||!data.queue.every(id=>ids.includes(id))||!Number.isInteger(data.index)||data.index<0||data.index>=data.queue.length||!data.records||!Object.entries(data.records).every(([id,r])=>ids.includes(id)&&Array.isArray(r?.first)&&r.first.length===2&&r.first.every(v=>[null,true,false].includes(v))&&Array.isArray(r.solved)&&r.solved.length===2&&r.solved.every(v=>typeof v==='boolean')&&typeof r.used==='boolean'&&typeof r.useError==='boolean'&&Array.isArray(r.current)&&r.current.length===2&&r.current.every(v=>typeof v==='boolean')&&typeof r.applied==='boolean'))throw Error();
      state=data;
    }
  }catch{canSave=false;}
  const $=id=>document.querySelector('#'+id);
  const el=(tag,cls,value)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n;};
  const button=(label,cls,fn)=>{const b=el('button',cls,label);b.type='button';b.onclick=fn;return b;};
  const record=id=>state.records[id]||(state.records[id]={first:[null,null],solved:[false,false],used:false,useError:false,current:[false,false],applied:false});
  const difficult=()=>bank.filter(([id])=>state.records[id]?.first.includes(false)||state.records[id]?.useError).map(v=>v[0]);
  function save(){
    if(canSave)try{localStorage.setItem(key,JSON.stringify(state));}catch{canSave=false;}
    $('transform-status').textContent=canSave?'El avance se guarda por separado en este navegador.':'No se pudo recuperar o guardar el avance. Podés seguir practicando.';
  }
  function table(verbs){
    const wrap=el('div','table-scroll'),t=el('table','verbs'),caption=el('caption','','Patrones de los verbos ya practicados'),head=el('thead'),row=el('tr');
    ['Base','Simple Past','Participio','Patrón'].forEach(name=>{const cell=el('th','',name);cell.scope='col';row.append(cell);});head.append(row);t.append(caption,head);
    const body=el('tbody');
    verbs.forEach(([base,,past,part,pattern])=>{const line=el('tr');[base,past,part,pattern].forEach((v,i)=>{const cell=el('td','',v);if(i<3)cell.lang='en';line.append(cell);});body.append(line);});t.append(body);wrap.append(t);return wrap;
  }
  function navigate(index){state.index=index;feedback=null;save();render();$('transform-area').focus();}
  function render(){
    const area=$('transform-area');area.replaceChildren();
    if(state.summary){
      area.append(el('h2','','Lo que recordaste'));
      const results=el('ul');
      bank.forEach(([id])=>{
        const r=state.records[id];
        if(!r||r.first.every(v=>v===null))return;
        const label=v=>v===null?'sin intentar':v?'a la primera':'necesitó repetir';
        results.append(el('li','',id+' · Simple Past: '+label(r.first[0])+' · Participio: '+label(r.first[1])+(r.useError?' · Aplicación: necesitó repetir':'')+'.'));
      });area.append(results);
      const retry=difficult();
      if(retry.length)area.append(button('Repasar solo los verbos que me costaron','primary',()=>restart(retry)));
      area.append(button('Practicar los 12 verbos','secondary',()=>restart(bank.map(v=>v[0]))));return;
    }
    const v=bank.find(x=>x[0]===state.queue[state.index]),[id,es,past,part,pattern,sentence,tense]=v,r=record(id);
    const heading=el('h2','');const english=el('span','',id);english.lang='en';heading.append(english,document.createTextNode(' · '+es));
    area.append(el('span','eyebrow','VERBO '+(state.index+1)+' DE '+state.queue.length),heading);
    const applying=r.current.every(Boolean),form=el('form'),fields=[];
    const labels=applying?[tense==='pp'?'Past Perfect · escribí la forma completa con had':'Simple Past · escribí la forma del verbo']:['Simple Past','Participio'];
    if(applying){const prompt=el('p','practice-heading',sentence);prompt.lang='en';form.append(prompt);}
    labels.forEach((label,i)=>{
      const group=el('div'),input=el('input','lesson-input');input.id='transform-answer-'+i;input.type='text';input.autocomplete='off';input.spellcheck=false;input.setAttribute('autocapitalize','none');
      const l=el('label','',label);l.htmlFor=input.id;group.append(l,el('br'),input);form.append(group);fields.push(input);
    });
    const submit=el('button','primary','Comprobar');submit.type='submit';form.append(submit);
    form.onsubmit=e=>{
      e.preventDefault();
      if(fields.some(f=>!normalize(f.value))){showFeedback('Completá todos los campos de esta consigna.',false);return;}
      if(applying){
        const answer=tense==='pp'?'had '+part:past;
        const ok=normalize(fields[0].value).replace(/^had already /,'had ')===answer;
        r.useError=r.useError||!ok;r.used=r.used||ok;r.applied=ok;
        feedback={text:ok?'¡Bien! Usaste el verbo en el tiempo pedido.':(tense==='pp'?'Para destacar lo que ya había pasado, usá had + participio.':'La consigna pide una acción terminada en Simple Past, sin had.')+' Probá otra vez.',ok};
      }else{
        const answers=[past,part],ok=fields.map((f,i)=>normalize(f.value)===answers[i]);
        ok.forEach((value,i)=>{if(r.first[i]===null)r.first[i]=value;r.solved[i]=r.solved[i]||value;r.current[i]=value;});
        feedback={text:labels.map((label,i)=>label+': '+(ok[i]?'correcto':'para revisar')).join(' · ')+(ok.every(Boolean)?'. Ahora usá el verbo en una oración.':'. '+pattern+' '+id+' → '+past+' → '+part+'.'),ok:ok.every(Boolean)};
      }
      save();render();$('transform-feedback').focus();
    };
    if(!r.applied)area.append(form);
    if(feedback)showFeedback(feedback.text,feedback.ok);
    if(r.applied){
      const next=state.index===state.queue.length-1;
      area.append(button(next?'Ver mi balance':'Siguiente verbo →','primary',()=>{if(next){state.summary=true;feedback=null;save();render();area.focus();}else navigate(state.index+1);}));
    }
    if(state.index>0)area.append(button('Verbo anterior','secondary',()=>navigate(state.index-1)));
    if(!r.applied||state.index<state.queue.length-1)area.append(button('Ver mi balance','secondary',()=>{state.summary=true;feedback=null;save();render();area.focus();}));
    const shown=bank.filter(([base])=>state.records[base]?.first.some(x=>x!==null)&&(base!==id||r.current.every(Boolean)||feedback!==null));
    if(shown.length)area.append(table(shown));
  }
  function showFeedback(value,ok){
    let status=$('transform-feedback');
    if(!status){status=el('p');status.id='transform-feedback';status.tabIndex=-1;status.setAttribute('role','status');$('transform-area').append(status);}
    status.className=ok?'feedback success':'feedback';status.textContent=value;
  }
  function restart(queue){
    state.queue=queue;state.index=0;state.summary=false;
    queue.forEach(id=>{const r=record(id);r.current=[false,false];r.applied=false;});
    feedback=null;save();render();$('transform-area').focus();
  }
  save();render();
})();
