/* Site-wide silent video policy, including dynamically inserted demos. */
(()=>{
  const seen=new WeakSet();
  function silence(video){
    if(seen.has(video))return;
    seen.add(video);
    const enforce=()=>{
      if(!video.muted)video.muted=true;
      if(video.volume!==0)video.volume=0;
      video.defaultMuted=true;
    };
    enforce();
    video.addEventListener('volumechange',enforce);
    video.addEventListener('play',enforce);
    video.addEventListener('loadedmetadata',enforce);
  }
  function scan(root){
    if(root.nodeType!==1&&root.nodeType!==9)return;
    if(root.matches?.('video'))silence(root);
    root.querySelectorAll('video').forEach(silence);
  }
  scan(document);
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(scan)))
    .observe(document.documentElement,{childList:true,subtree:true});
})();
