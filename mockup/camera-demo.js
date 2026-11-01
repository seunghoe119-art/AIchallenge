const phone=document.getElementById('phone'),camera=document.getElementById('camera'),voice=document.getElementById('voice'),state=document.getElementById('state');
let timers=[],started=0,auto=true,opened=false,startPoint=null;
function later(fn,ms){timers.push(setTimeout(fn,ms));}function clear(){timers.forEach(clearTimeout);timers=[];}
function step(n){document.querySelectorAll('aside li').forEach((el,i)=>el.classList.toggle('active',i===n-1));}
function openCamera(){if(opened)return;opened=true;clear();phone.classList.add('camera-on');camera.inert=false;camera.setAttribute('aria-hidden','false');voice.inert=true;voice.setAttribute('aria-hidden','true');voice.querySelector('video').pause();step(3);state.textContent='카메라 모드 · 셔터를 눌러 촬영을 시연하세요.';}
function countdown(){if(opened)return;const left=Math.max(0,10-Math.floor((performance.now()-started)/1000));document.getElementById('count').textContent=left;if(left>0)later(countdown,100);else state.textContent='음성 입력 종료 · 왼쪽으로 밀면 카메라가 열립니다.';}
function reset(automatic=true){clear();auto=automatic;opened=false;phone.classList.remove('camera-on');camera.inert=true;camera.setAttribute('aria-hidden','true');voice.inert=false;voice.setAttribute('aria-hidden','false');document.getElementById('gesture').classList.remove('show');document.getElementById('thumb').classList.remove('taken');document.getElementById('captureStatus').textContent='현장을 화면에 담아 주세요';const v=voice.querySelector('video');v.currentTime=0;v.play().catch(()=>{});step(1);started=performance.now();countdown();state.textContent=auto?'잠시 후 손가락 스와이프가 시연됩니다.':'화면을 오른쪽에서 왼쪽으로 밀어 보세요.';if(auto){later(()=>{step(2);document.getElementById('gesture').classList.add('show');},3000);later(openCamera,4250);}}
phone.addEventListener('pointerdown',e=>{if(e.target.closest('button')||opened)return;startPoint={x:e.clientX,y:e.clientY};});
window.addEventListener('pointerup',e=>{if(!startPoint)return;const dx=e.clientX-startPoint.x,dy=e.clientY-startPoint.y;startPoint=null;if(dx < -55 && Math.abs(dx)>Math.abs(dy)*1.3)openCamera();});
window.addEventListener('pointercancel',()=>startPoint=null);
document.getElementById('openCamera').onclick=openCamera;document.getElementById('replay').onclick=()=>reset(true);document.getElementById('manual').onclick=()=>reset(false);document.getElementById('backVoice').onclick=()=>reset(false);
document.getElementById('viewfinder').onclick=e=>{const r=e.currentTarget.getBoundingClientRect(),f=document.getElementById('focus');f.style.animation='none';f.style.left=Math.min(r.width-70,Math.max(0,e.clientX-r.left-34))+'px';f.style.top=Math.min(r.height-70,Math.max(0,e.clientY-r.top-34))+'px';f.style.opacity='1';later(()=>f.style.opacity='0',1400);};
document.getElementById('shutter').onclick=()=>{const f=document.getElementById('flash');f.classList.remove('snap');void f.offsetWidth;f.classList.add('snap');document.getElementById('thumb').classList.add('taken');document.getElementById('captureStatus').textContent='촬영 완료 · 시연 이미지';};
document.getElementById('flip').onclick=()=>{document.getElementById('captureStatus').textContent='후면 카메라 시연 화면입니다';};reset(true);

document.querySelectorAll('aside li').forEach((el,i)=>{
  el.tabIndex=0;el.setAttribute('role','button');el.style.cursor='pointer';
  const jump=()=>{if(i===0)reset(false);if(i===1){reset(false);step(2);document.getElementById('gesture').classList.remove('show');void document.getElementById('gesture').offsetWidth;document.getElementById('gesture').classList.add('show');later(openCamera,1250);}if(i===2){reset(false);openCamera();}};
  el.addEventListener('click',jump);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();jump();}});
});
