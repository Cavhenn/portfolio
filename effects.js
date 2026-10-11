document.addEventListener('DOMContentLoaded',function(){
'use strict';
var d=document,W=window;
var reduce=W.matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=W.matchMedia('(hover: hover) and (pointer: fine)');

function spot(el){
  el.classList.add('spot');
  el.addEventListener('pointermove',function(e){
    if(!fine.matches||e.pointerType!=='mouse')return;
    var r=el.getBoundingClientRect();
    el.style.setProperty('--mx',(e.clientX-r.left)+'px');
    el.style.setProperty('--my',(e.clientY-r.top)+'px');
  });
}
d.querySelectorAll('.proj__btn,.packet:not(.packet--end)').forEach(spot);

if(reduce||!('IntersectionObserver' in W))return;
var glyphs='01ABCDEF#%&<>/*+=';
function scramble(el){
  if(el.dataset.scrambled)return;
  el.dataset.scrambled='1';
  var html=el.innerHTML,text=el.textContent,len=text.length,start=null,dur=700;
  el.style.minWidth=el.offsetWidth+'px';
  function frame(t){
    if(start===null)start=t;
    var p=Math.min(1,(t-start)/dur),done=Math.floor(p*len),out='';
    for(var i=0;i<len;i++){
      var c=text[i];
      out+=(i<done||c===' '||c==='·'||c==='.'||c===',')?c:glyphs[(Math.random()*glyphs.length)|0];
    }
    el.textContent=out;
    if(p<1)requestAnimationFrame(frame);else{el.innerHTML=html;el.style.minWidth=''}
  }
  requestAnimationFrame(frame);
}
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){scramble(e.target);io.unobserve(e.target)}});
},{rootMargin:'0px 0px -12% 0px'});
d.querySelectorAll('.hop-head p,.hero__top>.mono:first-child').forEach(function(el){io.observe(el)});
});
