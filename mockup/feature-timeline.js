(()=>{
const manual=document.getElementById('manual');manual?.remove();clear();document.body.classList.add("feature-controlled");
const original={reset,openCamera,openText,capturePhoto};const review=document.querySelector('.dispatch-review'),desk=document.querySelector('.dispatch-desk'),gesture=document.getElementById('gesture');
const total=16,cuts=[0,3,4.25,11.25,11.8,14.75,16];let time=0,playing=true,stage=-1,last=performance.now(),outside=false;
const bar=document.createElement('nav');bar.className='feature-playback';bar.setAttribute('aria-label','기능 시연 재생 제어');bar.innerHTML='<div class="feature-transport"><button id="featurePlay">일시정지</button><span id="featureTime"></span><input id="featureSeek" aria-label="기능 시연 전체 재생 위치" type="range" min="0" max="16" step="0.01" value="0"></div><div class="feature-chapters"></div>';document.body.append(bar);
const play=document.getElementById('featurePlay'),seek=document.getElementById('featureSeek');const names=['음성 입력','왼쪽 스와이프','지령서 촬영 · 7초','촬영','촬영 결과 확인','오른쪽 스와이프','텍스트 입력'];cuts.forEach((t,i)=>{const b=document.createElement('button');b.textContent=t+'초 · '+names[i];b.onclick=()=>jump(t);bar.querySelector('.feature-chapters').append(b);});
const descriptions=['마이크와 10초 음성 카운트다운을 표시합니다.','손가락이 왼쪽으로 이동하며 카메라로 전환합니다.','지령서를 7초 동안 정렬하고 촬영을 준비합니다.','정위치에서 촬영 플래시를 표시합니다.','검정 처리된 지령서와 다시 촬영·전송 버튼을 표시합니다.','음성 화면에서 반대로 오른쪽으로 스와이프합니다.','제한 시간 없이 질문을 직접 입력합니다.'];
const sideList=document.querySelector('aside ol');sideList.replaceChildren();names.forEach((name,i)=>{const li=document.createElement('li');li.tabIndex=0;li.setAttribute('role','button');li.innerHTML='<b>'+String(i+1).padStart(2,'0')+' · '+name+'</b><p>'+descriptions[i]+'</p><small>'+cuts[i]+'초</small>';sideList.append(li);});
function stopLegacy(){clear();}
function render(force=false){const s=cuts.findLastIndex(x=>time>=x);if(s!==stage||force){stage=s;outside=false;original.reset(false);stopLegacy();document.getElementById("flash").classList.remove("snap");review.hidden=true;gesture.classList.remove('show','swipe-left');
if(s===1||s===5){step(s===1?2:4);gesture.classList.toggle('swipe-left',s===5);void gesture.offsetWidth;gesture.classList.add('show');}
if(s===2||s===3){original.openCamera();stopLegacy();if(s===3){desk.classList.remove('aligning');document.getElementById('flash').classList.add('snap');document.getElementById('captureStatus').textContent='촬영 완료 · 지정 영역 검정 처리';document.querySelector('.dispatch-guides').classList.add('aligned');}step(3);}
if(s===4){opened=true;captured=true;phone.classList.add('review-on');review.hidden=false;camera.inert=true;voice.inert=true;step(5);}
if(s===6){textPanel.getAnimations().forEach(a=>a.cancel());textPanel.style.setProperty('transition','none','important');textPanel.style.setProperty('transform','translateX(0)','important');original.openText();textPanel.classList.add('entered');stopLegacy();}
}
const voiceVisible=s===0||s===1||s===5,cameraVisible=s===2||s===3;voice.hidden=!voiceVisible;voice.inert=!voiceVisible;camera.hidden=!cameraVisible;camera.inert=!cameraVisible;review.hidden=s!==4;textPanel.hidden=s!==6;answerPanel.hidden=true;
phone.classList.toggle('camera-on',cameraVisible);phone.classList.toggle('text-on',s===6);phone.classList.toggle('review-on',s===4);phone.classList.remove('answer-on');document.querySelectorAll('aside li').forEach((b,i)=>{b.classList.toggle('active',i===s);b.setAttribute('aria-current',i===s?'step':'false');});
if(s===0||s===1||s===5)document.getElementById('count').textContent=Math.max(0,10-Math.floor(s===5?time-14.75:time));
if(s===2){const n=Math.max(0,Math.ceil(11.25-time));document.getElementById('captureStatus').textContent=n+'초 후 자동 촬영';document.getElementById('alignStatus').textContent=n<=1?'정위치 · 촬영 준비 완료':'지령서를 안내선 안에 맞춰 주세요';document.querySelector('.dispatch-guides').classList.toggle('aligned',n<=1);}
phone.getAnimations({subtree:true}).forEach(a=>{if(a.effect?.target===desk){a.pause();a.currentTime=Math.max(0,(time-4.25)*1000);}else if(a.effect?.target===gesture){a.pause();a.currentTime=playing?Math.max(0,(time-cuts[s])*1000):Math.max(650,(time-cuts[s])*1000);}else{playing?a.play():a.pause();}});
const video=voice.querySelector('video');if((s<2||s===5)&&playing)video.play().catch(()=>{});else video.pause();
play.textContent=playing?'일시정지':'재생';document.getElementById('featureTime').textContent=time.toFixed(1)+' / '+total.toFixed(1)+'초';seek.value=time;bar.querySelectorAll('.feature-chapters button').forEach((b,i)=>{b.classList.toggle('active',i===s);});state.textContent=names[s]+(s===4?' · 전송 전 확인':s===6?' · 시간 제한 없이 직접 입력':'');}
function jump(t){time=Math.max(0,Math.min(total,t));outside=false;render(true);last=performance.now();}
play.onclick=()=>{if(outside||time===total)jump(0);playing=!playing;last=performance.now();render();};seek.oninput=e=>jump(Number(e.target.value));
document.getElementById('replay').onclick=()=>{playing=true;jump(0);};
document.querySelectorAll('aside li').forEach((b,i)=>{b.onclick=()=>{playing=false;jump(cuts[i]);};b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();b.click();}};});
document.getElementById('retakeDispatch').onclick=document.getElementById('reviewBack').onclick=()=>{playing=true;jump(4.25);};document.getElementById('shutter').onclick=()=>{playing=true;jump(11.25);};document.getElementById('openCamera').onclick=()=>{playing=true;jump(4.25);};document.querySelector('.voice-bottom button:last-child').onclick=()=>{playing=false;jump(16);};document.getElementById('textBack').onclick=()=>{playing=true;jump(0);};
window.openText=()=>{playing=false;jump(16);};window.openCamera=()=>{playing=true;jump(4.25);};
const oldSend=document.getElementById('sendText').onclick;document.getElementById('sendText').onclick=()=>{if(!document.getElementById('typedQuestion').value.trim())return;playing=false;outside=true;oldSend();play.textContent='재생';};
document.getElementById('typedQuestion').addEventListener('focus',()=>{playing=false;play.textContent='재생';});
function tick(now){const dt=Math.min((now-last)/1000,.1);last=now;if(!outside){if(playing){time=Math.min(total,time+dt);if(time===total)playing=false;}render();}requestAnimationFrame(tick);}jump(0);requestAnimationFrame(tick);
})();
