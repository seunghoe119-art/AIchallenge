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
const notice=document.createElement('p');notice.className='effect-notice';notice.textContent='※ AI 생성 영상으로, 면체 착용 중 말하는 모습이 부자연스러울 수 있습니다.';notice.hidden=true;
const style=document.createElement('style');style.textContent='#effectsPlayer .effect-notice{position:absolute;top:76px;left:22px;right:22px;margin:0;text-align:center;color:#b6c4d2;font:400 clamp(11px,1.15vw,15px)/1.6 Pretendard,sans-serif;pointer-events:none;text-wrap:balance}#effectsPlayer .effect-notice[hidden]{display:none!important}#effectsPlayer.has-caption .presentation-video{height:calc(100% - 108px);display:block}#effectsPlayer .effect-caption{position:absolute;bottom:20px;left:20px;right:20px;text-align:center;color:#f4f8fd;font-family:Pretendard,-apple-system,BlinkMacSystemFont,sans-serif;font-size:clamp(15px,1.6vw,23px);font-weight:550;line-height:1.65;letter-spacing:-.025em;pointer-events:none;text-wrap:balance}#effectsPlayer .effect-caption:before{content:"";display:block;width:32px;height:2px;background:#7da9ca;margin:0 auto 12px;opacity:.7}#effectsPlayer .effect-caption span{display:block}#effectsPlayer .effect-caption[hidden]{display:none!important}@media(max-width:600px){#effectsPlayer .effect-caption{font-size:15px;left:10px;right:10px}}';panel.append(style);
let index=0;const files=['effect-video.mp4','effect-video-2.mp4','effect-video-3.mp4'];
function updateCaption(){
caption.hidden=false;notice.hidden=index!==2;panel.classList.add('has-caption');
if(index===0)caption.innerHTML='<span>경방은 스스로 필요한 장비를 챙기고,</span><span>지휘관은 지시할때 참고 할 수 있습니다</span>';
else if(index===1)caption.innerHTML=clip.currentTime<5?'<span>청라센터 근무 당시, 1년 차 2경방이었던 저는</span><span>내근 10년을 마친 1경방 대원과 키즈카페 건물에 출동했습니다.</span>':'<span>막상 올라가니 연기가 가득해,</span><span>더 이상 앞으로 나아갈 수 없었습니다.</span>';
else if(index===2)caption.innerHTML='<span>그때, 현장에서 바로 물어볼 수 있는 전술 AI가 있었다면…</span><span>다음 행동을 판단하는 데 도움을 받을 수 있지 않았을까요?</span>';
}
clip.addEventListener('timeupdate',updateCaption);clip.addEventListener('seeking',updateCaption);
function load(i){index=i;label.textContent='기대효과 '+(i+1)+' / '+files.length;next.hidden=i===files.length-1;next.textContent=(i===0?'두 번째':'세 번째')+' 영상 ▶';clip.src=files[i];updateCaption();clip.play().catch(()=>{label.textContent+=' · 재생 버튼을 눌러 주세요';});}
next.onclick=()=>load(index+1);clip.onended=()=>{if(index<files.length-1)load(index+1);};
clip.onerror=()=>{label.textContent='영상을 불러오지 못했습니다.';};
panel.append(clip,label,close,next,notice,caption);document.body.append(panel);document.body.classList.add('film-playing');load(0);
};
