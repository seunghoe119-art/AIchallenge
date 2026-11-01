const phone=document.getElementById('phone'),camera=document.getElementById('camera'),voice=document.getElementById('voice'),state=document.getElementById('state');
let timers=[],started=0,auto=true,opened=false,startPoint=null;
function later(fn,ms){timers.push(setTimeout(fn,ms));}function clear(){timers.forEach(clearTimeout);timers=[];}
function step(n){document.querySelectorAll('aside li').forEach((el,i)=>el.classList.toggle('active',i===n-1));}
function openCamera(){if(opened)return;opened=true;clear();phone.classList.add('camera-on');camera.inert=false;camera.setAttribute('aria-hidden','false');voice.inert=true;voice.setAttribute('aria-hidden','true');voice.querySelector('video').pause();step(3);startCaptureTimer();state.textContent='카메라 모드 · 셔터를 눌러 촬영을 시연하세요.';}
function countdown(){if(opened)return;const left=Math.max(0,10-Math.floor((performance.now()-started)/1000));document.getElementById('count').textContent=left;if(left>0)later(countdown,100);else state.textContent='음성 입력 종료 · 왼쪽으로 밀면 카메라가 열립니다.';}
function reset(automatic=true){clear();auto=automatic;opened=false;phone.classList.remove('camera-on');camera.inert=true;camera.setAttribute('aria-hidden','true');voice.inert=false;voice.setAttribute('aria-hidden','false');document.getElementById('gesture').classList.remove('show');captured=false;document.getElementById('thumb').classList.remove('taken');document.getElementById('captureStatus').textContent='현장을 화면에 담아 주세요';const v=voice.querySelector('video');v.currentTime=0;v.play().catch(()=>{});step(1);started=performance.now();countdown();state.textContent=auto?'잠시 후 손가락 스와이프가 시연됩니다.':'화면을 오른쪽에서 왼쪽으로 밀어 보세요.';if(auto){later(()=>{step(2);document.getElementById('gesture').classList.add('show');},3000);later(openCamera,4250);}}
phone.addEventListener('pointerdown',e=>{if(e.target.closest('button')||opened)return;startPoint={x:e.clientX,y:e.clientY};});
window.addEventListener('pointerup',e=>{if(!startPoint)return;const dx=e.clientX-startPoint.x,dy=e.clientY-startPoint.y;startPoint=null;if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.3){if(dx>0)openCamera();else openText();}});
window.addEventListener('pointercancel',()=>startPoint=null);
document.getElementById('openCamera').onclick=openCamera;document.getElementById('replay').onclick=()=>reset(true);document.getElementById('manual').onclick=()=>reset(false);document.getElementById('backVoice').onclick=()=>reset(false);
document.getElementById('viewfinder').onclick=e=>{const r=e.currentTarget.getBoundingClientRect(),f=document.getElementById('focus');f.style.animation='none';f.style.left=Math.min(r.width-70,Math.max(0,e.clientX-r.left-34))+'px';f.style.top=Math.min(r.height-70,Math.max(0,e.clientY-r.top-34))+'px';f.style.opacity='1';later(()=>f.style.opacity='0',1400);};
document.getElementById('shutter').onclick=capturePhoto;document.getElementById('flip').onclick=()=>{document.getElementById('captureStatus').textContent='후면 카메라 시연 화면입니다';};

document.querySelectorAll('aside li').forEach((el,i)=>{
  el.tabIndex=0;el.setAttribute('role','button');el.style.cursor='pointer';
  const jump=()=>{if(i===0)reset(false);if(i===1){reset(false);step(2);document.getElementById('gesture').classList.remove('show');void document.getElementById('gesture').offsetWidth;document.getElementById('gesture').classList.add('show');later(openCamera,1250);}if(i===2){reset(false);openCamera();}};
  el.addEventListener('click',jump);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();jump();}});
});

let captured=false;
function startCaptureTimer(){const end=performance.now()+7000;function update(){if(captured||!opened)return;const n=Math.max(0,Math.ceil((end-performance.now())/1000));document.getElementById('captureStatus').textContent=n+'초 후 자동 촬영';state.textContent='카메라 실행 · '+n+'초 후 촬영하고 전술 답변으로 이동합니다.';if(n===0)capturePhoto();else later(update,100);}update();}
function capturePhoto(){if(captured||!opened)return;captured=true;clear();const f=document.getElementById('flash');f.classList.remove('snap');void f.offsetWidth;f.classList.add('snap');document.getElementById('thumb').classList.add('taken');document.getElementById('captureStatus').textContent='촬영 완료 · 전술 답변을 불러옵니다';state.textContent='촬영 완료 · 전술 답변으로 이동합니다.';later(()=>location.href='index.html?scene=camera-answer',1000);}
reset(true);
const textPanel=document.createElement('section');textPanel.className='screen text-mode';textPanel.hidden=true;textPanel.innerHTML='<button id="textBack">‹ 음성으로</button><small>TEXT INPUT</small><h2>질문을 입력해 주세요</h2><textarea id="typedQuestion" placeholder="현장 상황과 궁금한 내용을 입력하세요" aria-label="직접 질문 입력"></textarea><p>입력을 마친 뒤 전송해 주세요.</p><button id="sendText">질문 전송</button>';phone.append(textPanel);
function openText(){clear();opened=true;camera.inert=true;camera.setAttribute('aria-hidden','true');voice.inert=true;voice.querySelector('video').pause();document.getElementById('gesture').classList.remove('show');textPanel.hidden=false;step(4);state.textContent='텍스트 입력 · 시간 제한 없이 입력하세요.';document.getElementById('typedQuestion').focus();}
const originalReset=reset;reset=function(a=true){textPanel.hidden=true;originalReset(a);};
document.getElementById('textBack').onclick=()=>reset(false);
document.getElementById('sendText').onclick=()=>{const value=document.getElementById('typedQuestion').value.trim();if(!value){document.getElementById('typedQuestion').focus();return;}sessionStorage.setItem('tacticalTypedQuestion',value);location.href='index.html?scene=text-answer';};
const textStep=document.createElement('li');textStep.tabIndex=0;textStep.setAttribute('role','button');textStep.innerHTML='<b>04 · 왼쪽으로 밀어 텍스트 입력</b><p>카운트다운 없이 직접 작성하고 전송합니다.</p>';textStep.onclick=openText;textStep.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openText();}};document.querySelector('aside ol').append(textStep);
const textButton=document.createElement('button');textButton.textContent='← 텍스트 입력';textButton.onclick=openText;document.querySelector('.voice-bottom').append(textButton);
