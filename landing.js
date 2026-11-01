(()=>{
const video=document.getElementById('introVideo');let mode='initial',reverseFrame=0,reverseTime=10,last=0;
const upper=()=>Math.min(10,Number.isFinite(video.duration)?video.duration:10);
function reverse(now){if(mode!=='reverse')return;if(!last)last=now;const dt=Math.min((now-last)/1000,.1);last=now;reverseTime=Math.max(5,reverseTime-dt);if(!video.seeking)video.currentTime=reverseTime;if(reverseTime<=5){mode='forward';video.currentTime=5;video.play().catch(()=>{});return;}reverseFrame=requestAnimationFrame(reverse);}
function turnBack(){if(mode==='reverse')return;mode='reverse';video.pause();reverseTime=upper();video.currentTime=reverseTime;last=0;cancelAnimationFrame(reverseFrame);reverseFrame=requestAnimationFrame(reverse);}
function watch(){if(mode!=='reverse'&&video.currentTime>=upper()-.035)turnBack();}
function restart(){cancelAnimationFrame(reverseFrame);mode='initial';video.currentTime=1;video.play().catch(()=>{document.getElementById('restartIntro').classList.add('needs-play');});}
video.addEventListener('loadedmetadata',restart);video.addEventListener('timeupdate',watch);video.addEventListener('ended',turnBack);
function frameWatch(){watch();requestAnimationFrame(frameWatch);}requestAnimationFrame(frameWatch);
document.getElementById('restartIntro').onclick=restart;
document.addEventListener('visibilitychange',()=>{if(document.hidden){video.pause();cancelAnimationFrame(reverseFrame);}else if(mode==='reverse'){last=0;reverseFrame=requestAnimationFrame(reverse);}else video.play().catch(()=>{});});
})();
