(()=>{
const opener=document.querySelector('.central-image-button'),dialog=document.querySelector('#central-image-dialog');
if(!opener||!dialog)return;
const zoom=dialog.querySelector('.central-zoom'),scroll=dialog.querySelector('.central-dialog-scroll');
let previousOverflow='';
opener.addEventListener('click',()=>{previousOverflow=document.body.style.overflow;dialog.classList.remove('is-zoomed');zoom.setAttribute('aria-pressed','false');zoom.textContent='확대 +';dialog.showModal();document.body.style.overflow='hidden';scroll.scrollTo(0,0)});
dialog.querySelector('.central-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;opener.focus({preventScroll:true})});
zoom.addEventListener('click',()=>{const active=dialog.classList.toggle('is-zoomed');zoom.setAttribute('aria-pressed',String(active));zoom.textContent=active?'화면에 맞춤 −':'확대 +';scroll.scrollTo(0,0)});
})();
