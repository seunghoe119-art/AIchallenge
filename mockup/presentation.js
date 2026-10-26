(()=>{
const original={record,recognize,transcript,loading,answer};
let t=0,playing=true,stage=-1,last=performance.now(),media=null;
const cuts=[0,5.8,10.8,20.8,22.1,27.1,28.9];
const names=['시작 영상','로고 인트로','10초 녹음','음성 인식','문장 확인 · 5초','자료 확인','답변'];
const opening=document.createElement('div');opening.className='opening-film';opening.hidden=true;document.body.append(opening);
const bar=document.createElement('div');bar.className='playback-bar';bar.innerHTML='<button id="playToggle">일시정지</button><output id="playTime"></output><input aria-label="전체 재생 위치" id="playSeek" type="range" min="0" max="28.9" step="0.05"><div class="timeline-chapters">'+names.map((n,i)=>'<button data-time="'+cuts[i]+'">'+cuts[i]+'초 · '+n+'</button>').join('')+'</div>';document.body.append(bar);
const stopJobs=()=>{jobs.forEach(clearTimeout);jobs=[]};
function video(src,parent){media=document.createElement('video');media.src=src;media.muted=true;media.playsInline=true;media.className='presentation-video';parent.append(media);}
function render(force=false){let s=cuts.findLastIndex(x=>t>=x);if(force||s!==stage){stage=s;document.body.classList.toggle('voice-active',s===2||s===3);stopJobs();opening.hidden=true;opening.replaceChildren();document.body.classList.remove('film-playing');document.querySelector('.logo-presentation')?.remove();media?.pause();media=null;
if(s<2){reset();$('content').innerHTML='';if(s===0){document.body.classList.add('film-playing');opening.hidden=false;video('launch-intro.mp4',opening);}else{const layer=document.createElement('div');layer.className='logo-presentation';$('scene').append(layer);video('intro-v2.mp4',layer);}}
else{[null,null,original.record,original.recognize,original.transcript,original.loading,original.answer][s]();stopJobs();media=document.querySelector('.mic-bg-video');if(s===4){$('question').addEventListener('focus',()=>{playing=false;});$('question').addEventListener('input',()=>{question=$('question').value;});}}
document.querySelectorAll('.step-control').forEach((b,i)=>b.classList.toggle('active',i===Math.max(0,s-1)));
if(media){media.currentTime=t-cuts[s];media.preload='auto';if(playing)media.play().catch(()=>{});}
}
if(stage===2&&$('seconds'))$('seconds').textContent=Math.max(0,Math.ceil(20.8-t));
if(stage===4&&$('sendStatus'))$('sendStatus').textContent=playing?Math.ceil(27.1-t)+'초 후 자동 전송됩니다':'일시정지 · 수정 후 재생';
$('playToggle').textContent=playing?'일시정지':'재생';$('playTime').textContent=t.toFixed(1)+' / 28.9초';$('playSeek').value=t;
}
function seek(value){t=Math.max(0,Math.min(28.9,value));render(true);}
$('playToggle').onclick=()=>{playing=!playing;if(playing&&t>=28.9)seek(0);if(media){if(playing)media.play().catch(()=>{});else media.pause();}render();};
$('playSeek').oninput=e=>seek(Number(e.target.value));
bar.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>seek(Number(b.dataset.time)));
window.intro=()=>{playing=true;seek(0);};window.runDemoStep=n=>{playing=true;seek([0,10.8,20.8,22.1,27.1,28.9][n-1]);};
window.resume=()=>{question=$('question').value.trim()||question;$('question').blur();$('done').hidden=true;t=22.1;playing=true;};
window.recognize=()=>seek(20.8);window.record=()=>{playing=true;seek(10.8);};
const oldCancel=cancel;window.cancel=()=>{playing=false;oldCancel();stopJobs();};
function tick(now){requestAnimationFrame(tick);const dt=Math.min((now-last)/1000,.1);last=now;if(playing){t=Math.min(28.9,t+dt);if(t===28.9)playing=false;}if(media&&!playing)media.pause();render();}
seek(0);requestAnimationFrame(tick);
})();
