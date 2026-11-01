(()=>{
const video=document.getElementById('introVideo');let returning=false;
const end=()=>Math.min(10,Number.isFinite(video.duration)?video.duration:10);
function restart(){returning=false;video.currentTime=1;video.play().catch(()=>{});}
function loop(){if(returning)return;returning=true;video.currentTime=5;video.play().catch(()=>{});}
function watch(){if(video.currentTime>=end()-.035)loop();else if(video.currentTime<end()-.1)returning=false;}
video.addEventListener('loadedmetadata',restart);video.addEventListener('timeupdate',watch);video.addEventListener('ended',loop);
function tick(){watch();requestAnimationFrame(tick);}requestAnimationFrame(tick);
document.getElementById('restartIntro').onclick=restart;
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else video.play().catch(()=>{});});
})();
