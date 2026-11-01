class EnglishAudio{
  constructor(synth=typeof speechSynthesis!=='undefined'?speechSynthesis:null,Utterance=typeof SpeechSynthesisUtterance!=='undefined'?SpeechSynthesisUtterance:null,timers={set:setTimeout,clear:clearTimeout}){
    this.synth=synth;this.Utterance=Utterance;this.timers=timers;this.active=null;
  }
  voices(){try{return this.synth&&this.Utterance?this.synth.getVoices().filter(v=>/^en(?:[-_]|$)/i.test(v.lang)).sort((a,b)=>Number(b.localService)-Number(a.localService)):[];}catch{return [];}}
  cancel(){const token=this.active;if(!token)return;token.active=false;this.active=null;this.timers.clear(token.startTimer);this.timers.clear(token.endTimer);try{this.synth.cancel();}catch{}token.onCancel?.(token.started);}
  play(segments,{rate=1,voiceURI,onDone,onFail,onStarted,onCancel}={}){
    this.cancel();const voices=this.voices();
    if(!voices.length){onFail?.('No hay una voz en inglés disponible. Comprobá las voces o instalá una desde los ajustes de idioma del dispositivo.');return false;}
    const token={active:true,started:false,onCancel,utterances:[],ended:0};this.active=token;
    const finish=(error)=>{
      if(!token.active)return;token.active=false;this.active=null;
      this.timers.clear(token.startTimer);this.timers.clear(token.endTimer);
      if(error){try{this.synth.cancel();}catch{}onFail?.(error);}else onDone?.();
    };
    token.startTimer=this.timers.set(()=>finish('La voz no comenzó a reproducirse. Revisá el volumen, la voz elegida y el permiso de reproducción. El intento de audio no consume cupo.'),10000);
    token.endTimer=this.timers.set(()=>finish('La reproducción no terminó correctamente. Podés volver a intentar; no se evaluará como un error de inglés.'),120000);
    const primary=voices.find(v=>v.voiceURI===voiceURI)||voices[0];
    const secondary=voices.find(v=>v.localService===primary.localService&&v.voiceURI!==primary.voiceURI)||primary;
    try{
      segments.forEach((segment,i)=>{
        const utterance=new this.Utterance(segment.speaker?`${segment.speaker} says: ${segment.en}`:segment.en);
        utterance.voice=i%2===0?primary:secondary;utterance.lang=utterance.voice.lang;utterance.rate=rate;utterance.pitch=1;
        utterance.onstart=()=>{if(token.active&&!token.started){token.started=true;this.timers.clear(token.startTimer);onStarted?.();}};
        utterance.onend=()=>{if(token.active&&++token.ended===segments.length)finish();};
        utterance.onerror=event=>finish(`La voz falló (${event.error||'error de audio'}). Revisá las voces o la salida de sonido y volvé a intentar. No consume cupo ni cuenta como respuesta incorrecta.`);
        token.utterances.push(utterance);
      });
      token.utterances.forEach(utterance=>this.synth.speak(utterance));
      return true;
    }catch{finish('El navegador no pudo reproducir esta voz. Probá otra voz en inglés. No consume cupo ni cuenta como un error.');return false;}
  }
}
const ListeningCore=(()=>{
  const count=ListeningActivities.length;
  const fresh=mode=>({mode,active:0,counts:Array(count).fill(0),heard:Array(count).fill(false),answers:Array(count).fill(null),issues:Array(count).fill(false),submitted:false});
  const canPlay=(state,i)=>!state.submitted&&(state.mode!=='exam'||state.counts[i]<2);
  function reserve(state,i){if(!canPlay(state,i))return false;state.counts[i]++;return true;}
  function fail(state,i,refund=true){if(refund)state.counts[i]=Math.max(0,state.counts[i]-1);if(!state.heard[i])state.issues[i]=true;}
  function heard(state,i){state.heard[i]=true;state.issues[i]=false;}
  function answer(state,i,value){if(state.submitted||!state.heard[i]||state.issues[i]||!Number.isInteger(value)||value<0||value>3||(state.mode==='exam'&&state.answers[i]!==null))return false;state.answers[i]=value;return true;}
  function summary(state){
    let correct=0,incorrect=0,notEvaluated=0;
    ListeningActivities.forEach((activity,i)=>{if(!state.heard[i]||state.issues[i])notEvaluated++;else if(state.answers[i]===activity.correct)correct++;else incorrect++;});
    return {correct,incorrect,notEvaluated,score:notEvaluated?null:Math.round(correct/count*100)};
  }
  function valid(state){return state&&state.mode==='exam'&&Number.isInteger(state.active)&&state.active>=0&&state.active<count&&typeof state.submitted==='boolean'&&
    ['counts','heard','answers','issues'].every(key=>Array.isArray(state[key])&&state[key].length===count)&&state.counts.every(n=>Number.isInteger(n)&&n>=0&&n<=2)&&
    state.heard.every(v=>typeof v==='boolean')&&state.issues.every(v=>typeof v==='boolean')&&state.answers.every(v=>v===null||(Number.isInteger(v)&&v>=0&&v<4));}
  return {fresh,canPlay,reserve,fail,heard,answer,summary,valid};
})();
function initListening(){
  const $=id=>document.querySelector('#'+id);
  const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
  const button=(text,cls,fn)=>{const node=el('button',cls,text);node.type='button';node.onclick=fn;return node;};
  const scope=location.pathname.replace(/[^/]*$/,'');
  const practiceKey=`english-challenge-unit4:pedro:listening-practice:v1:${scope}`;
  const examKey=`english-challenge-unit4:pedro:listening-exam:v1:${scope}`;
  const player=new EnglishAudio();
  let practice=ListeningCore.fresh('practice'),exam=ListeningCore.fresh('exam'),state=practice,solved=[],busy=false,audioMessage='',selectedVoice='',rate=1,storageError=false,practiceWritable=true,examWritable=true;
  try{const raw=localStorage.getItem(practiceKey);if(raw){const data=JSON.parse(raw);if(data.app!=='listening-practice'||data.owner!=='pedro'||data.version!==1||!Array.isArray(data.solved))throw new Error();solved=data.solved.filter(id=>ListeningActivities.some(a=>a.id===id));if(Number.isInteger(data.active)&&data.active>=0&&data.active<15)practice.active=data.active;}}catch{storageError=true;practiceWritable=false;}
  try{const raw=sessionStorage.getItem(examKey);if(raw){const data=JSON.parse(raw);if(data.app!=='listening-exam'||data.owner!=='pedro'||data.version!==1||!ListeningCore.valid(data.exam))throw new Error();exam=data.exam;if(data.mode==='exam')state=exam;}}catch{storageError=true;examWritable=false;}
  function save(){
    if(practiceWritable)try{localStorage.setItem(practiceKey,JSON.stringify({app:'listening-practice',owner:'pedro',version:1,solved,active:practice.active}));}catch{storageError=true;practiceWritable=false;}
    if(examWritable)try{sessionStorage.setItem(examKey,JSON.stringify({app:'listening-exam',owner:'pedro',version:1,mode:state.mode,exam}));}catch{storageError=true;examWritable=false;}
    $('listening-storage').textContent=storageError?'El almacenamiento no está disponible: podés escuchar y practicar, pero el progreso o el cupo pueden no conservarse al recargar.':'Práctica guardada localmente. El cupo del modo evaluación se conserva al navegar y recargar esta pestaña.';
  }
  function refreshVoices(){
    const voices=player.voices();$('english-voice').replaceChildren();
    if(!voices.length){$('english-voice').append(el('option','','Sin voz en inglés disponible'));selectedVoice='';$('voice-status').textContent='No se encontró una voz en inglés. En Android, iPhone o computadora revisá las voces instaladas en los ajustes de idioma/voz y tocá Comprobar voces. Si el navegador no ofrece síntesis, probá otro navegador compatible. No respondas adivinando por un problema de audio.';}
    else{
      if(!voices.some(v=>v.voiceURI===selectedVoice))selectedVoice=voices[0].voiceURI;
      voices.forEach(voice=>{const option=el('option','',`${voice.name} · ${voice.lang}${voice.localService?' · local':' · puede requerir conexión'}`);option.value=voice.voiceURI;$('english-voice').append(option);});$('english-voice').value=selectedVoice;
      $('voice-status').textContent='Voz en inglés disponible. Probá Escuchar con el volumen activado; detectar la voz no garantiza que la salida de sonido funcione. En diálogos se anuncian los nombres de quienes hablan.';
    }
    renderActivity();
  }
  function navigate(index){player.cancel();busy=false;state.active=index;audioMessage='';save();render();$('listening-activity').focus();}
  function setMode(mode){player.cancel();busy=false;state=mode==='exam'?exam:practice;audioMessage='';save();render();}
  function play(){
    const i=state.active,playingState=state;
    if(busy||!player.voices().length||!ListeningCore.reserve(playingState,i))return;
    busy=true;audioMessage='Preparando audio…';save();renderActivity();
    player.play(ListeningActivities[i].segments,{voiceURI:selectedVoice,rate:state.mode==='exam'?1:rate,
      onStarted:()=>{audioMessage='Reproduciendo. Escuchá hasta el final.';renderActivity();},
      onDone:()=>{busy=false;ListeningCore.heard(playingState,i);audioMessage='Reproducción terminada. Si pudiste escuchar, elegí una respuesta.';save();renderActivity();},
      onFail:message=>{busy=false;ListeningCore.fail(playingState,i);audioMessage=message;save();renderActivity();},
      onCancel:started=>{busy=false;ListeningCore.fail(playingState,i,!started);save();}
    });
  }
  function showDetails(parent,activity,index,answer){
    const box=el('div','explanation');box.append(el('h4','','Transcripción'));
    const transcript=el('p','transcript',activity.segments.map(s=>(s.speaker?s.speaker+': ':'')+s.en).join('\n'));transcript.lang='en';
    box.append(transcript,el('h4','','Traducción'),el('p','transcript',activity.translation),el('p','answer-line',`Tu respuesta: ${answer===null?'Sin responder':activity.options[answer]}`),el('p','answer-line','Respuesta correcta: '+activity.options[activity.correct]),el('p','answer-line',activity.why));parent.append(box);
  }
  function choose(value){
    const i=state.active;if(busy||!ListeningCore.answer(state,i,value))return;
    if(state.mode==='practice'&&value===ListeningActivities[i].correct&&!solved.includes(ListeningActivities[i].id))solved.push(ListeningActivities[i].id);
    save();render();
  }
  function renderActivity(){
    const area=$('listening-activity');area.replaceChildren();
    const i=state.active,activity=ListeningActivities[i];
    const card=el('article','question');card.append(el('span','eyebrow',`${i+1} / 15 · ${activity.group}`),el('h2','',activity.title));
    const controls=el('div','practice-actions');
    const listen=button('▶ Escuchar','primary',play),repeat=button('↻ Repetir','secondary',play);
    listen.disabled=busy||!player.voices().length||!ListeningCore.canPlay(state,i);
    repeat.disabled=listen.disabled||state.counts[i]===0;
    controls.append(listen,repeat);card.append(controls);
    card.append(el('p','answer-line',state.mode==='exam'?`Reproducciones usadas: ${state.counts[i]} / 2. Cambiar de actividad interrumpe el audio y consume cupo si ya había comenzado.`:'Podés escuchar todas las veces que quieras.'));
    const status=el('p','audio-status',audioMessage||(!player.voices().length?'Audio no disponible. Comprobá las voces antes de responder.':'Escuchá el audio completo antes de elegir.'));status.setAttribute('role','status');status.setAttribute('aria-live','polite');card.append(status);
    const issue=button('No pude escuchar este audio','secondary',()=>{
      player.cancel();busy=false;state.issues[i]=true;state.heard[i]=false;state.answers[i]=null;audioMessage='Problema de audio registrado. Esta actividad no contará como un error de inglés. Podés probar de nuevo si queda cupo o comenzar otro intento.';save();render();
    });issue.disabled=state.submitted;card.append(issue,el('h3','practice-heading',activity.prompt));
    const options=el('div','exercise-options');
    activity.options.forEach((text,value)=>{const b=button(text,'',()=>choose(value));b.disabled=busy||!state.heard[i]||state.issues[i]||state.submitted||(state.mode==='exam'&&state.answers[i]!==null);options.append(b);});card.append(options);
    if(state.answers[i]!==null){
      if(state.mode==='practice'){
        card.append(el('p',state.answers[i]===activity.correct?'feedback success':'feedback',state.answers[i]===activity.correct?'¡Bien! Eso es lo que cuenta el audio.':'Revisemos lo que escuchaste. Podés volver a intentar.'));
        showDetails(card,activity,i,state.answers[i]);
        card.append(button('Reintentar sin ver el texto','secondary',()=>{state.answers[i]=null;audioMessage='Volvé a escuchar si lo necesitás y elegí otra vez.';save();render();}));
      }else if(!state.submitted)card.append(el('p','feedback','Respuesta guardada. La transcripción y la explicación aparecerán al finalizar.'));
    }
    if(state.mode==='exam'&&state.submitted)showDetails(card,activity,i,state.answers[i]);
    const actions=el('div','practice-actions');
    if(i>0)actions.append(button('← Actividad anterior','secondary',()=>navigate(i-1)));
    if(i<14)actions.append(button('Siguiente actividad →','primary',()=>navigate(i+1)));
    if(state.mode==='exam'&&!state.submitted){const finish=button('Finalizar listening','secondary',()=>{player.cancel();busy=false;state.submitted=true;save();render();$('listening-results').focus();$('listening-results').scrollIntoView({behavior:'smooth'});});finish.disabled=busy;actions.append(finish);}
    card.append(actions);area.append(card);
  }
  function render(){
    $('mode-description').textContent=state.mode==='exam'?'Modo evaluación: hasta dos reproducciones por audio, a velocidad normal. Una respuesta por actividad. Sin transcripción ni explicaciones hasta finalizar. Los fallos de audio no consumen cupo.':'Modo aprendizaje: escuchá y repetí sin límite. Después de responder vas a ver la transcripción, su traducción y la explicación. Podés reintentar.';
    $('listening-practice').className=state.mode==='practice'?'primary mode-active':'secondary';$('listening-exam').className=state.mode==='exam'?'primary mode-active':'secondary';
    $('speech-rate').disabled=state.mode==='exam';$('speech-rate').value=String(state.mode==='exam'?1:rate);
    $('listening-nav').replaceChildren();ListeningActivities.forEach((activity,i)=>{const b=button(String(i+1),'secondary',()=>navigate(i));b.setAttribute('aria-label',`Actividad ${i+1}: ${activity.title}`);if(i===state.active)b.setAttribute('aria-current','step');$('listening-nav').append(b);});
    $('listening-progress').textContent=state.mode==='practice'?`${solved.length} de 15 actividades resueltas al menos una vez.`:`${state.answers.filter(a=>a!==null).length} de 15 respuestas guardadas.`;
    const results=$('listening-results');results.replaceChildren();results.hidden=!(state.mode==='exam'&&state.submitted);
    if(!results.hidden){
      const summary=ListeningCore.summary(state);const card=el('article','question');card.append(el('h2','','Resultado de listening'));
      card.append(el('p','listening-score',summary.score===null?'Evaluación incompleta por audio':`${summary.score} / 100`));
      card.append(el('p','answer-line',`${summary.correct} correctas · ${summary.incorrect} incorrectas · ${summary.notEvaluated} no evaluadas por audio no verificado o fallido.`));
      card.append(el('p','answer-line',summary.score===null?'No calculamos una nota global porque faltan audios verificados. Las actividades sin audio no se cuentan como errores. Revisá cada actividad desde sus botones numerados.':'Podés revisar las transcripciones y explicaciones desde cada actividad. Las preguntas escuchadas sin respuesta cuentan como incorrectas.'));
      card.append(button('Nuevo intento de listening','primary',()=>{player.cancel();exam=ListeningCore.fresh('exam');state=exam;audioMessage='';save();render();}));
      results.append(card);
    }
    renderActivity();
  }
  $('listening-practice').onclick=()=>setMode('practice');$('listening-exam').onclick=()=>setMode('exam');
  $('refresh-voices').onclick=refreshVoices;$('english-voice').onchange=()=>{selectedVoice=$('english-voice').value;};
  $('speech-rate').onchange=()=>{if(state.mode==='practice')rate=Number($('speech-rate').value)===0.78?0.78:1;};
  if(player.synth?.addEventListener)player.synth.addEventListener('voiceschanged',refreshVoices);
  if(typeof window!=='undefined')window.addEventListener('pagehide',()=>player.cancel());
  save();render();refreshVoices();
}
if(typeof document!=='undefined')initListening();
if(typeof module!=='undefined')module.exports={EnglishAudio,ListeningCore};
