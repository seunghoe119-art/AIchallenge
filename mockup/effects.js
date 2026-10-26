window.playEffectVideo=function(){
document.getElementById('effectsPlayer')?.remove();
const playButton=document.getElementById('playToggle');
if(playButton?.textContent==='일시정지')playButton.click();
const panel=document.createElement('section');panel.id='effectsPlayer';panel.className='opening-film';panel.style.zIndex='30';
const clip=document.createElement('video');clip.className='presentation-video';clip.controls=true;clip.playsInline=true;clip.preload='auto';
const label=document.createElement('div');label.style.cssText='position:absolute;top:16px;left:16px;background:#071525cc;color:white;padding:10px;border-radius:10px';
const close=document.createElement('button');close.className='video-close';close.textContent='답변으로 돌아가기';close.onclick=()=>{clip.pause();panel.remove();document.body.classList.remove('film-playing');};
const next=document.createElement('button');next.className='video-close';next.style.top='65px';next.textContent='두 번째 영상 ▶';
let index=0;const files=['effect-video.mp4','effect-video-2.mp4','effect-video-3.mp4'];
function load(i){index=i;label.textContent='기대효과 '+(i+1)+' / '+files.length;next.hidden=i===files.length-1;next.textContent=(i===0?'두 번째':'세 번째')+' 영상 ▶';clip.src=files[i];clip.play().catch(()=>{label.textContent+=' · 재생 버튼을 눌러 주세요';});}
next.onclick=()=>load(index+1);clip.onended=()=>{if(index<files.length-1)load(index+1);};
clip.onerror=()=>{label.textContent='영상을 불러오지 못했습니다.';};
panel.append(clip,label,close,next);document.body.append(panel);document.body.classList.add('film-playing');load(0);
};
