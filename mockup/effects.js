window.playEffectVideo=function(){
document.getElementById('effectsPlayer')?.remove();
const playButton=document.getElementById('playToggle');
if(playButton?.textContent==='일시정지')playButton.click();
const panel=document.createElement('section');panel.id='effectsPlayer';panel.className='opening-film';panel.style.zIndex='30';
const clip=document.createElement('video');clip.className='presentation-video';clip.controls=true;clip.playsInline=true;clip.preload='auto';
const label=document.createElement('div');label.style.cssText='position:absolute;top:16px;left:16px;background:#071525cc;color:white;padding:10px;border-radius:10px';
const close=document.createElement('button');close.className='video-close';close.textContent='답변으로 돌아가기';close.onclick=()=>{clip.pause();panel.remove();document.body.classList.remove('film-playing');};
const next=document.createElement('button');next.className='video-close';next.style.top='65px';next.textContent='두 번째 영상 ▶';
const caption=document.createElement('div');caption.className='effect-caption';caption.innerHTML='<span>경방은 스스로 필요한 장비를 챙기고,</span><span>지휘관은 지시할때 참고 할 수 있습니다</span>';
const style=document.createElement('style');style.textContent='#effectsPlayer.has-caption .presentation-video{height:calc(100% - 108px);display:block}#effectsPlayer .effect-caption{position:absolute;bottom:20px;left:20px;right:20px;text-align:center;color:#f4f8fd;font-family:Pretendard,-apple-system,BlinkMacSystemFont,sans-serif;font-size:clamp(15px,1.6vw,23px);font-weight:550;line-height:1.65;letter-spacing:-.025em;pointer-events:none;text-wrap:balance}#effectsPlayer .effect-caption:before{content:"";display:block;width:32px;height:2px;background:#7da9ca;margin:0 auto 12px;opacity:.7}#effectsPlayer .effect-caption span{display:block}#effectsPlayer .effect-caption[hidden]{display:none!important}@media(max-width:600px){#effectsPlayer .effect-caption{font-size:15px;left:10px;right:10px}}';panel.append(style);
let index=0;const files=['effect-video.mp4','effect-video-2.mp4','effect-video-3.mp4'];
function load(i){index=i;caption.hidden=i!==0;panel.classList.toggle('has-caption',i===0);label.textContent='기대효과 '+(i+1)+' / '+files.length;next.hidden=i===files.length-1;next.textContent=(i===0?'두 번째':'세 번째')+' 영상 ▶';clip.src=files[i];clip.play().catch(()=>{label.textContent+=' · 재생 버튼을 눌러 주세요';});}
next.onclick=()=>load(index+1);clip.onended=()=>{if(index<files.length-1)load(index+1);};
clip.onerror=()=>{label.textContent='영상을 불러오지 못했습니다.';};
panel.append(clip,label,close,next,caption);document.body.append(panel);document.body.classList.add('film-playing');load(0);
};
