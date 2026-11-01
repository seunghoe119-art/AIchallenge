(()=>{
const input=document.getElementById('typedQuestion'),panel=input.closest('.text-mode'),send=document.getElementById('sendText');
const sentence='20세 여성, 민감부위에 출혈, 배가 아프다.';
input.value='';input.placeholder='여기를 눌러 질문을 입력해 보세요';input.setAttribute('inputmode','none');
const keyboard=document.createElement('div');keyboard.className='demo-keyboard';keyboard.setAttribute('aria-label','한글 키보드 시연');keyboard.hidden=true;
const rows=['ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ','ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ','⇧ ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ ⌫'];
for(const row of rows){const r=document.createElement('div');r.className='key-row';for(const char of row.split(' ')){const k=document.createElement('span');k.className='demo-key';k.textContent=char;r.append(k);}keyboard.append(r);}
const bottom=document.createElement('div');bottom.className='key-row key-bottom';bottom.innerHTML='<span class="demo-key">123</span><span class="demo-key">🌐</span><span class="demo-key space-key">간격</span><button type="button" class="demo-key keyboard-done">완료</button>';keyboard.append(bottom);panel.append(keyboard);
let timer=null,running=false,complete=false;
keyboard.querySelector('.keyboard-done').onclick=()=>{if(!complete)return;keyboard.hidden=true;panel.classList.remove('keyboard-open');input.blur();panel.querySelector('p').textContent='입력이 완료되었습니다. 전송해 주세요.';};
function start(){if(running||complete)return;running=true;panel.classList.add('keyboard-open');keyboard.hidden=false;input.readOnly=true;send.disabled=true;input.value='';const start=performance.now();const keys=keyboard.querySelectorAll('.demo-key');
function frame(now){if(panel.hidden){reset();return;}const progress=Math.min((now-start)/6000,1);const n=Math.floor(progress*sentence.length);input.value=sentence.slice(0,n);keys.forEach(k=>k.classList.remove('pressed'));if(n<sentence.length)keys[(n*7)%keys.length].classList.add('pressed');
if(progress<1)timer=requestAnimationFrame(frame);else{running=false;complete=true;input.readOnly=false;send.disabled=false;keys.forEach(k=>k.classList.remove('pressed'));panel.querySelector('p').textContent='키보드의 완료를 눌러 입력을 마쳐 주세요.';}}
timer=requestAnimationFrame(frame);}
function reset(){cancelAnimationFrame(timer);running=false;complete=false;input.readOnly=false;input.value='';send.disabled=false;keyboard.hidden=true;panel.classList.remove('keyboard-open');panel.querySelector('p').textContent='입력창을 누르면 키보드 시연이 시작됩니다.';}
input.addEventListener('click',()=>{if(complete)reset();start();});
document.addEventListener('demo:text-entry',()=>{reset();start();});input.addEventListener('keydown',e=>{if(!complete&&(e.key==='Enter'||e.key===' ')){e.preventDefault();start();}});
let wasHidden=panel.hidden;new MutationObserver(()=>{const hidden=panel.hidden;if(hidden!==wasHidden){wasHidden=hidden;if(hidden)reset();else if(!running&&!complete)start();}}).observe(panel,{attributes:true,attributeFilter:['hidden']});
panel.querySelector('p').textContent='입력창을 누르면 키보드 시연이 시작됩니다.';
})();