const phone=document.getElementById('phone'),camera=document.getElementById('camera'),voice=document.getElementById('voice'),state=document.getElementById('state');
let timers=[],started=0,auto=true,opened=false,startPoint=null;
function later(fn,ms){timers.push(setTimeout(fn,ms));}function clear(){timers.forEach(clearTimeout);timers=[];}
function step(n){document.querySelectorAll('aside li').forEach((el,i)=>el.classList.toggle('active',i===n-1));}
function openCamera(){if(opened)return;opened=true;clear();phone.classList.add('camera-on');camera.inert=false;camera.setAttribute('aria-hidden','false');voice.inert=true;voice.setAttribute('aria-hidden','true');voice.querySelector('video').pause();step(3);startCaptureTimer();state.textContent='카메라 모드 · 셔터를 눌러 촬영을 시연하세요.';}
function countdown(){if(opened)return;const left=Math.max(0,10-Math.floor((performance.now()-started)/1000));document.getElementById('count').textContent=left;if(left>0)later(countdown,100);else state.textContent='음성 입력 종료 · 왼쪽은 카메라, 오른쪽은 텍스트 입력';}
function reset(automatic=true){clear();auto=automatic;opened=false;phone.classList.remove('camera-on');camera.inert=true;camera.setAttribute('aria-hidden','true');voice.inert=false;voice.setAttribute('aria-hidden','false');document.getElementById('gesture').classList.remove('show','swipe-left');captured=false;document.getElementById('thumb').classList.remove('taken');document.getElementById('captureStatus').textContent='현장을 화면에 담아 주세요';const v=voice.querySelector('video');v.currentTime=0;v.play().catch(()=>{});step(1);started=performance.now();countdown();state.textContent=auto?'잠시 후 손가락 스와이프가 시연됩니다.':'왼쪽은 카메라 · 오른쪽은 텍스트 입력';if(auto){later(()=>{step(2);document.getElementById('gesture').classList.add('show');},3000);later(openCamera,4250);}}
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
function startCaptureTimer(){const end=performance.now()+7000;function update(){if(captured||!opened)return;const n=Math.max(0,Math.ceil((end-performance.now())/1000));document.getElementById('captureStatus').textContent=n+'초 후 자동 촬영';state.textContent='카메라 실행 · '+n+'초 후 촬영하고 이 화면에서 전술 답변을 표시합니다.';if(n===0)capturePhoto();else later(update,100);}update();}
function capturePhoto(){if(captured||!opened)return;captured=true;clear();const f=document.getElementById('flash');f.classList.remove('snap');void f.offsetWidth;f.classList.add('snap');document.getElementById('thumb').classList.add('taken');document.getElementById('captureStatus').textContent='촬영 완료 · 전술 답변을 불러옵니다';state.textContent='촬영 완료 · 전술 답변으로 이동합니다.';later(()=>showInlineAnswer('photo'),1000);}
const textPanel=document.createElement('section');textPanel.className='screen text-mode';textPanel.hidden=true;textPanel.innerHTML='<div class="text-brand">소방전술AI</div><button id="textBack">‹ 음성으로</button><textarea id="typedQuestion" placeholder="현장 상황과 궁금한 내용을 입력하세요" aria-label="직접 질문 입력">20세 여성, 민감부위에 출혈, 배가 아프다.</textarea><p>입력을 마친 뒤 전송해 주세요.</p><button id="sendText">질문 전송</button>';phone.append(textPanel);
function openText(){hideAnswer();clear();opened=true;camera.inert=true;camera.setAttribute('aria-hidden','true');voice.inert=true;voice.querySelector('video').pause();document.getElementById('gesture').classList.remove('show');phone.classList.add("text-on");textPanel.hidden=false;requestAnimationFrame(()=>textPanel.classList.add("entered"));step(4);state.textContent='텍스트 입력 · 시간 제한 없이 입력하세요.';document.getElementById('typedQuestion').focus();}
const originalReset=reset;reset=function(a=true){hideAnswer();phone.classList.remove("text-on");textPanel.classList.remove("entered");textPanel.hidden=true;originalReset(a);};
document.getElementById('textBack').onclick=()=>reset(false);
document.getElementById('sendText').onclick=()=>{const value=document.getElementById('typedQuestion').value.trim();if(!value){document.getElementById('typedQuestion').focus();return;}showInlineAnswer('text',value);};
const textStep=document.createElement('li');textStep.tabIndex=0;textStep.setAttribute('role','button');textStep.innerHTML='<b>04 · 오른쪽으로 밀어 텍스트 입력</b><p>카운트다운 없이 직접 작성하고 전송합니다.</p>';textStep.onclick=playTextSwipe;textStep.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();playTextSwipe();}};document.querySelector('aside ol').append(textStep);
const textButton=document.createElement('button');textButton.textContent='텍스트 입력 →';textButton.onclick=openText;document.querySelector('.voice-bottom').append(textButton);

const answerPanel=document.createElement('section');answerPanel.className='screen inline-answer';answerPanel.hidden=true;phone.append(answerPanel);
let answerOrigin='photo';
function hideAnswer(){document.getElementById("continueFlow").hidden=true;answerPanel.hidden=true;phone.classList.remove('answer-on');}
function showInlineAnswer(origin,value){
 clear();phone.classList.remove('text-on');opened=true;answerOrigin=origin;camera.inert=true;voice.inert=true;textPanel.hidden=true;voice.querySelector('video').pause();document.getElementById('gesture').classList.remove('show');
 answerPanel.innerHTML='<header class="answer-header"><button id="answerBack" aria-label="입력 화면으로 돌아가기">‹</button><b>AI 전술 답변</b></header>'+window.cameraAnswerMarkup+'<div class="source-preview" hidden><button aria-label="출처 닫기">×</button><b></b><p>전술 자료 · 시연용 문서</p><p>현재 문서는 화면 시연용 예시입니다.</p></div>';
 const bubble=answerPanel.querySelector('.bubble');bubble.removeAttribute('id');bubble.textContent=value||'11층 건물 키즈카페, 연기가 많이 나고 있다. 어디에서 연기가 나고 있는지 모르겠다.';
 const preset=document.createElement('span');preset.className='preset-context';preset.textContent=' 나는 청라센터 1경방 · 행동요령 · 무전 예시 · 챙겨야 할 장비 (사전설정)';bubble.append(preset);
 if(origin==='photo'){const photo=document.createElement('div');photo.className='captured-preview';photo.append(document.querySelector('.room').cloneNode(true));const caption=document.createElement('small');caption.textContent='촬영한 현장 사진';photo.append(caption);bubble.before(photo);}
 answerPanel.hidden=false;phone.classList.add('answer-on');answerPanel.querySelector('.answer').scrollTop=0;
 document.getElementById('answerBack').onclick=()=>{if(answerOrigin==='text'){openText();}else{reset(false);openCamera();}};
 const popup=answerPanel.querySelector('.source-preview');popup.querySelector('button').onclick=()=>popup.hidden=true;
 answerPanel.querySelectorAll('[data-source]').forEach(b=>b.onclick=()=>{popup.querySelector('b').textContent='출처 미리보기 ['+b.dataset.source+']';popup.hidden=false;});
 const next=document.createElement('button');next.className='continue-demo';next.textContent=origin==='photo'?'다음 · 오른쪽 스와이프 텍스트 입력 →':'처음부터 다시 시연';next.onclick=origin==='photo'?playTextSwipe:()=>reset(true);answerPanel.querySelector('.answer').append(next);const sideNext=document.getElementById('continueFlow');sideNext.hidden=false;sideNext.textContent=next.textContent;sideNext.onclick=next.onclick;step(5);state.textContent=(origin==='photo'?'사진 촬영':'텍스트 전송')+' 완료 · 같은 화면에서 전술 답변을 확인하세요.';
}
const answerStep=document.createElement('li');answerStep.tabIndex=0;answerStep.setAttribute('role','button');answerStep.innerHTML='<b>05 · AI 전술 답변</b><p>사진 또는 입력한 질문에서 답변이 이어집니다.</p>';answerStep.onclick=()=>showInlineAnswer(answerOrigin,document.getElementById('typedQuestion').value.trim()||undefined);answerStep.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();answerStep.click();}};document.querySelector('aside ol').append(answerStep);
const flowButton=document.createElement('button');flowButton.id='continueFlow';flowButton.hidden=true;document.querySelector('aside ol').after(flowButton);reset(true);

function playTextSwipe(){reset(false);clear();step(4);const g=document.getElementById("gesture");g.classList.add("swipe-left");void g.offsetWidth;g.classList.add("show");state.textContent="오른쪽으로 스와이프 · 텍스트 입력으로 전환합니다.";later(openText,1250);}
