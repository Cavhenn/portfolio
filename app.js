document.addEventListener('DOMContentLoaded',function(){
'use strict';
var d=document,root=d.documentElement,W=window;
var reduce=W.matchMedia('(prefers-reduced-motion: reduce)').matches;
var fineMQ=W.matchMedia('(hover: hover) and (pointer: fine)'),fine=fineMQ.matches;
var G=W.gsap,ST=W.ScrollTrigger,hasG=!!(G&&ST);
var pin=!root.classList.contains('no-pin');
var $=function(s,c){return (c||d).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var later=function(f){if(W.requestIdleCallback)W.requestIdleCallback(f,{timeout:2000});else setTimeout(f,200)};
root.classList.add('app');
if(reduce)root.classList.add('reduce');
if(!hasG)root.classList.add('no-motion');
var store={get:function(k,s){try{return (s?sessionStorage:localStorage).getItem(k)}catch(e){return null}},set:function(k,v,s){try{(s?sessionStorage:localStorage).setItem(k,v)}catch(e){}}};

var HOPS=[
  {n:'00',ms:0,label:'origin'},
  {n:'01',ms:3,label:'about'},
  {n:'02',ms:18,label:'work'},
  {n:'03',ms:41,label:'services'},
  {n:'04',ms:64,label:'stack'},
  {n:'05',ms:92,label:'cavhen'}
];

var PROJECTS=[
  {idx:'02.1',title:'MLBB Tournament Hub',img:'assets/mlbb-login.webp',fit:'contain',thumb:'assets/mlbb-sm.webp',alt:'The Tournament Hub log-in page: a split screen with the headline Welcome to the Land of Dawn on the left and the log-in form on the right.',type:'Web app',stack:'PHP, MySQL, XAMPP',status:'In development. Class launch, October 2026.',problem:'Mobile Legends tournaments lived in group chats and scattered spreadsheets.',built:'A PHP and MySQL app to register teams, schedule matches and record results, with full create, read, update and delete for every record.',result:'Teams, matches and scores in one place instead of five chats.',shots:[
    {src:'assets/mlbb-dashboard.webp',w:1491,h:722,wide:1,alt:'Tournament Hub dashboard with the next match, totals for teams, players, tournaments and matches played, latest results and quick actions.',cap:'The admin dashboard.'},
    {src:'assets/mlbb-teams.webp',w:1526,h:716,alt:'Teams page with a register-a-team form and a table of registered teams.',cap:'Registering a team.'},
    {src:'assets/mlbb-matches.webp',w:1486,h:698,alt:'Matches page with a form to schedule a match between two teams and a table for results.',cap:'Scheduling matches and recording results.'},
    {src:'assets/mlbb-schema.webp',w:983,h:681,wide:1,alt:'phpMyAdmin designer view of the database: users, teams, players, tournaments, matches and audit_logs tables linked by foreign keys.',cap:'The MySQL schema: six tables linked by foreign keys.'}
  ]},
  {idx:'02.2',title:'NetAcad School Network',img:'assets/netacad-topology.webp',fit:'contain',thumb:'assets/netacad-shot-sm.webp',alt:'Cisco Packet Tracer topology of the finished school network: a router, a main switch, three department switches with their PCs and servers, and a wireless access point.',type:'Network design',stack:'Cisco Packet Tracer, DNS, FTP, SMTP/POP3, WPA2',status:'Completed. Cisco NetAcad final project, 2026.',problem:'Three school departments needed shared files, email, a website and student Wi-Fi on one network.',built:'A 192.168.10.0/24 network with a router, four switches, DNS, web, FTP and email servers, WPA2 Wi-Fi, CCTV and a backup server.',result:'7 of 7 service tests passed.',detail:[['Layout','A hierarchical star. One Cisco 2911 router, a main 2960 switch, and one switch per department. If one department switch fails, the others keep working.'],['IP plan','Static addresses grouped by role: .1 to .9 for core gear, the .10s for Admin, .20s for Faculty, .30s for IT, .40s for printers, .50s for student Wi-Fi.'],['How I tested it','From real client devices, not only ping: an FTP upload, an email from a teacher to the principal, DNS lookups, the school site in a browser, Wi-Fi from a student laptop.'],['What broke','Six things, each fixed by reading the error closely. Packet Tracer rejects mailboxes ending in .local, so mail goes to @school.com while the server stays mail.school.local.'],['Next time','A separate VLAN for each department, the student Wi-Fi and the camera.']],shots:[
    {src:'assets/netacad-topology.webp',w:1522,h:518,wide:1,alt:'Cisco Packet Tracer topology: a 2911 router above a main 2960 switch, which links to Admin, Faculty and IT switches with their PCs, printers and two servers, plus a wireless access point for student laptops and a CCTV webcam.',cap:'The finished topology, with every department labelled.'},
    {src:'assets/netacad-website.webp',w:1514,h:702,wide:1,alt:'The school portal web page at www.school.local, opened in a teacher PC browser.',cap:'The school website, served from the main server.'},
    {src:'assets/netacad-ping.webp',w:521,h:622,alt:'Command prompt on the Principal PC pinging the router and servers. Every test shows 4 sent, 4 received, 0% loss.',cap:'Ping tests: 0% packet loss.'},
    {src:'assets/netacad-dns.webp',w:522,h:646,alt:'nslookup on a teacher PC resolving www, ftp and mail .school.local to 192.168.10.2.',cap:'DNS resolving every school.local name.'},
    {src:'assets/netacad-ftp.webp',w:525,h:812,alt:'FTP session on a teacher PC uploading report.txt to ftp.school.local and listing the server files.',cap:'FTP upload to the file server.'},
    {src:'assets/netacad-email.webp',w:522,h:266,alt:'Principal PC mail client showing a Monthly Report email from teacher1@school.com.',cap:'Email from a teacher, received by the principal.'}
  ]}
];

var cssVar=function(n){return getComputedStyle(root).getPropertyValue(n).trim()};
var isDark=function(){var t=root.getAttribute('data-theme');if(t)return t==='dark';return W.matchMedia('(prefers-color-scheme: dark)').matches};
var themeBtn=$('#theme-toggle');
var portraitSrc=$('#portrait-src');
function syncTheme(){
  var dk=isDark();
  themeBtn.setAttribute('aria-pressed',String(dk));
  if(portraitSrc)portraitSrc.media=dk?'all':'not all';
  d.dispatchEvent(new CustomEvent('cvh:theme'));
}
syncTheme();
W.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(!root.getAttribute('data-theme'))syncTheme()});
themeBtn.addEventListener('click',function(e){
  var next=isDark()?'light':'dark';
  var apply=function(){root.setAttribute('data-theme',next);store.set('cvh-theme',next);syncTheme()};
  if(d.startViewTransition&&!reduce){
    var r=themeBtn.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
    var rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    d.startViewTransition(apply).ready.then(function(){
      root.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+rad+'px at '+x+'px '+y+'px)']},{duration:700,easing:'cubic-bezier(.16,1,.3,1)',pseudoElement:'::view-transition-new(root)'});
    }).catch(function(){});
  }else apply();
});

if(hasG)G.registerPlugin(ST);

function splitText(el){
  if(el.dataset.splitDone)return;
  var text=el.textContent.replace(/\s+/g,' ').trim();
  el.textContent='';
  var sr=d.createElement('span');sr.className='sr-only';sr.textContent=text;el.appendChild(sr);
  text.split(' ').forEach(function(w,i,a){
    var line=d.createElement('span');line.className='split-line';line.style.display='inline-block';line.setAttribute('aria-hidden','true');
    var inner=d.createElement('span');inner.textContent=w;line.appendChild(inner);el.appendChild(line);
    if(i<a.length-1)el.appendChild(d.createTextNode(' '));
  });
  el.dataset.splitDone='1';
}
if(hasG&&!reduce){
  $$('[data-split]').forEach(function(el){
    splitText(el);
    var words=$$('.split-line>span',el);
    G.from(words,{yPercent:115,rotate:3,duration:1.05,ease:'expo.out',stagger:.045,scrollTrigger:{trigger:el,start:'top 88%',once:true}});
  });
}

var bootEl=$('.boot');
function heroIntro(){
  if(!hasG||reduce)return;
  var words=$$('.hero__lede .split-line>span');
  G.from('.name--top span',{yPercent:-110,duration:1.2,ease:'expo.out',stagger:.05});
  G.from('.name--bot span',{yPercent:110,duration:1.2,ease:'expo.out',stagger:.05});
  if(words.length)G.fromTo(words,{y:0,yPercent:62,opacity:.35},{yPercent:0,opacity:1,duration:1,ease:'expo.out',stagger:.05,delay:.15});
  G.from('.hero__top .btn, .hero__top .mono',{opacity:0,y:12,duration:.8,ease:'expo.out',delay:.35,stagger:.08});
}
function runBoot(){
  if(!root.classList.contains('booting')){heroIntro();return}
  store.set('cvh-boot','1');
  var lines=$$('.boot__log p'),nameEl=$('.boot__name'),done=false,timers=[];
  var finish=function(){
    if(done)return;done=true;timers.forEach(clearTimeout);
    d.removeEventListener('keydown',finish);bootEl.removeEventListener('click',finish);
    var a=bootEl.animate([{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 100% 0)'}],{duration:reduce?1:450,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'});
    a.onfinish=function(){root.classList.remove('booting')};
    setTimeout(heroIntro,150);
  };
  lines.forEach(function(p,i){timers.push(setTimeout(function(){p.classList.add('is-on')},i*110))});
  timers.push(setTimeout(function(){nameEl.animate([{opacity:0,transform:'translateY(30%)'},{opacity:1,transform:'none'}],{duration:400,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'})},520));
  timers.push(setTimeout(finish,1050));
  d.addEventListener('keydown',finish);bootEl.addEventListener('click',finish);
}
runBoot();

function fitName(){
  var h=$('.hero__name'),n=$('.name--top');if(!h||!n)return;
  var cur=parseFloat(getComputedStyle(h).fontSize)||100;
  // Measure the stage, not the name: the nowrap name keeps its old width, so it could never shrink after a narrowing resize.
  var st=$('.hero__stage'),sc=getComputedStyle(st);
  var ls=n.children,w=(ls[ls.length-1].offsetLeft+ls[ls.length-1].offsetWidth-ls[0].offsetLeft)||1,avail=st.clientWidth-parseFloat(sc.paddingLeft)-parseFloat(sc.paddingRight);
  var stageH=st.clientHeight;
  var size=Math.min(cur*avail/w*.995,stageH*.62/0.78);
  if(Math.abs(size-cur)>.5)h.style.fontSize=size+'px';
  var frag=$('.hero__frag');if(frag)frag.style.bottom=(size*0.78*0.5+parseFloat(sc.paddingBottom))+'px';
}
if(d.fonts&&d.fonts.ready)d.fonts.ready.then(function(){fitName();if(hasG)ST.refresh()});else fitName();
// On touch screens, refit only when the width changes: the address bar showing or hiding is a height-only resize.
var fitW=innerWidth;
W.addEventListener('resize',function(){if(!pin&&innerWidth===fitW)return;fitW=innerWidth;fitName()});

if(hasG&&!reduce&&pin){
  var tops=$$('.name--top span'),bots=$$('.name--bot span');
  var tl=G.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom bottom',scrub:.6}});
  tops.forEach(function(s,i){var o=i-2.5;tl.to(s,{xPercent:o*14,yPercent:-38-((i*37)%5)*9,rotate:o*-2.2,ease:'power2.inOut',duration:.5},0).to(s,{xPercent:0,yPercent:0,rotate:0,ease:'power2.inOut',duration:.5},.5)});
  bots.forEach(function(s,i){var o=i-2.5;tl.to(s,{xPercent:o*-10,yPercent:32+((i*53)%5)*8,rotate:o*1.6,ease:'power2.inOut',duration:.5},0).to(s,{xPercent:0,yPercent:0,rotate:0,ease:'power2.inOut',duration:.5},.5)});
  tl.to('.hero__frag',{opacity:1,duration:.15},.3).to('.hero__frag',{opacity:0,duration:.15},.62);
  tl.to('.hero__top',{y:-60,opacity:0,ease:'none',duration:.4},0);
}
if(hasG&&!reduce){
  G.to('#progress',{scaleX:1,ease:'none',scrollTrigger:{trigger:d.body,start:'top top',end:'bottom bottom',scrub:.3}});
}

var head=$('#head');
new IntersectionObserver(function(es){es.forEach(function(e){head.classList.toggle('is-solid',!e.isIntersecting)})},{rootMargin:'-80px 0px 0px 0px'}).observe($('.hero__lede'));

var ticks=$$('#ticks i'),nowEl=$('#now'),navLinks=$$('.nav a'),current=0;
function setHop(i){
  current=i;
  ticks.forEach(function(t,k){t.classList.toggle('is-now',k===i);t.classList.toggle('is-past',k<i)});
  var h=HOPS[i];nowEl.textContent='hop '+h.n+' · '+h.ms+'ms · '+h.label;
  navLinks.forEach(function(a){a.setAttribute('aria-current',String(a.getAttribute('href')==='#'+$$('[data-hop]')[i].id))});
}
var hopIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setHop(+e.target.dataset.hop)})},{rootMargin:'-45% 0px -54% 0px'});
$$('[data-hop]').forEach(function(s){hopIO.observe(s)});
setHop(0);
if(!reduce){
  setInterval(function(){
    if(d.hidden)return;
    $$('[data-ms]').forEach(function(el){var b=+el.dataset.ms;if(!b)return;el.textContent=Math.max(1,b+Math.round(Math.random()*4-1))+'ms'});
    var h=HOPS[current];if(h.ms)nowEl.textContent='hop '+h.n+' · '+Math.max(1,h.ms+Math.round(Math.random()*4-1))+'ms · '+h.label;
  },1400);
}

// Scroll with no smoothing. html has scroll-behavior:smooth, and older Safari rejects behavior:'instant', so switch the CSS off for the jump.
// Reading the computed style makes the browser apply the change before f() scrolls; without it Chrome still scrolls smoothly.
function jump(f){var sb=root.style.scrollBehavior;root.style.scrollBehavior='auto';void getComputedStyle(root).scrollBehavior;f();root.style.scrollBehavior=sb}
var wipe=$('#wipe'),wipeTo=$('#wipe-to');
function goTo(id,focus,plain){
  var t=d.getElementById(id);if(!t)return;
  var land=function(instant){
    if(instant)jump(function(){if(id==='top')W.scrollTo(0,0);else t.scrollIntoView()});
    else if(id==='top')W.scrollTo({top:0,behavior:reduce?'auto':'smooth'});else t.scrollIntoView({behavior:reduce?'auto':'smooth'});
    if(focus&&id!=='top')t.focus({preventScroll:true});
    if(hasG)ST.update();
  };
  if(plain||reduce||!wipe.animate){land(false);return}
  wipeTo.textContent='#'+id;
  var a=wipe.animate([{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:200,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'});
  a.onfinish=function(){land(true);wipe.animate([{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 100% 0)'}],{duration:260,delay:40,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'})};
}
var menu=$('#menu');
d.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href^="#"]');
  if(!a)return;var id=a.getAttribute('href').slice(1);if(!id||!d.getElementById(id))return;
  e.preventDefault();
  if(menu.open)menu.close();
  if(caseEl.open)closeCase(true);
  // No wipe for the skip link or keyboard activation (detail 0): those users want to get there, not watch a transition.
  goTo(id,true,a.classList.contains('skip')||e.detail===0);
  if(history.replaceState)try{history.replaceState(null,'','#'+id)}catch(err){}
});
$('#menu-open').addEventListener('click',function(){menu.showModal();root.style.overflow='hidden'});
$('#menu-close').addEventListener('click',function(){menu.close()});
menu.addEventListener('close',function(){root.style.overflow=''});

var tz='Asia/Manila',clockT=$('#clock-time'),clockN=$('#clock-note');
function tick(){
  var now=new Date();
  var fmt=new Intl.DateTimeFormat('en-US',{timeZone:tz,hour:'numeric',minute:'2-digit'}).format(now);
  var hr=+new Intl.DateTimeFormat('en-US',{timeZone:tz,hour:'numeric',hourCycle:'h23'}).format(now);
  clockT.textContent=fmt;
  clockT.setAttribute('datetime',new Intl.DateTimeFormat('en-CA',{timeZone:tz,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now));
  clockN.textContent=(hr>=22||hr<7)?'Asia/Manila. Messages sent now get a reply in the morning.':'Asia/Manila. Good time to send a message.';
}
tick();setInterval(tick,15000);

var cursor=$('#cursor'),tag=$('#cursor-tag');
var motion=!reduce&&hasG,useCursor=false;
var mx=-100,my=-100;
// fine can change after load (a tablet gains a mouse, a laptop switches to touch), so the cursor and magnetic effects follow it.
function setFine(v){fine=v;useCursor=fine&&motion;root.classList.toggle('has-cursor',useCursor&&!caseEl.open);if(!useCursor)cursor.classList.add('is-hidden')}
var isMouse=function(e){return e.pointerType==='mouse'};
if(motion){
  // The dot tracks the mouse exactly; only the ring and tag trail behind.
  var qdx=G.quickSetter('.cursor__dot','x','px'),qdy=G.quickSetter('.cursor__dot','y','px');
  var qrx=G.quickTo('.cursor__ring','x',{duration:.35,ease:'power3'}),qry=G.quickTo('.cursor__ring','y',{duration:.35,ease:'power3'});
  var qtx=G.quickTo('.cursor__tag','x',{duration:.25,ease:'power3'}),qty=G.quickTo('.cursor__tag','y',{duration:.25,ease:'power3'});
  W.addEventListener('pointermove',function(e){if(!useCursor||!isMouse(e))return;mx=e.clientX;my=e.clientY;qdx(mx);qdy(my);qrx(mx);qry(my);qtx(mx);qty(my);cursor.classList.remove('is-hidden')},{passive:true});
  d.addEventListener('pointerleave',function(){cursor.classList.add('is-hidden')});
  d.addEventListener('pointerover',function(e){
    if(!useCursor)return;
    var t=e.target;
    cursor.classList.toggle('is-link',!!(t.closest&&t.closest('a,button,.gnode')));
    cursor.classList.toggle('is-hidden',!!(t.closest&&t.closest('input')));
  });
  $$('[data-magnetic]').forEach(function(el){
    var qx=G.quickTo(el,'x',{duration:.5,ease:'elastic.out(1,.4)'}),qy=G.quickTo(el,'y',{duration:.5,ease:'elastic.out(1,.4)'});
    el.addEventListener('pointermove',function(e){if(!fine||!isMouse(e))return;var r=el.getBoundingClientRect();qx((e.clientX-r.left-r.width/2)*.35);qy((e.clientY-r.top-r.height/2)*.45)});
    el.addEventListener('pointerleave',function(){qx(0);qy(0)});
  });
  $$('[data-magnetic-card]').forEach(function(el){
    var qx=G.quickTo(el,'x',{duration:.6,ease:'power3'}),qy=G.quickTo(el,'y',{duration:.6,ease:'power3'}),qr=G.quickTo(el,'rotation',{duration:.6,ease:'power3'});
    el.addEventListener('pointermove',function(e){if(!fine||!isMouse(e))return;var r=el.getBoundingClientRect(),nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;qx(nx*22);qy(ny*18);qr(nx*1.4)});
    el.addEventListener('pointerleave',function(){qx(0);qy(0);qr(0)});
  });
}

var preview=$('#preview'),pimg=$('img',preview);
var pqx=hasG?G.quickTo(preview,'x',{duration:.55,ease:'power3'}):null,pqy=hasG?G.quickTo(preview,'y',{duration:.55,ease:'power3'}):null;
$$('.proj__btn').forEach(function(b){
  var i=+b.dataset.project,node=$('.proj__node',b);
  var ping=function(){node.classList.remove('is-ping');void node.offsetWidth;node.classList.add('is-ping')};
  b.addEventListener('pointerenter',function(e){
    ping();
    if(!fine||!pqx||!isMouse(e))return;
    pimg.src=PROJECTS[i].thumb||PROJECTS[i].img.replace('.webp','-sm.webp');
    preview.classList.add('is-on');
    if(useCursor){tag.textContent='ping 10.0.2.'+(i+1)+' · '+(14+i*3)+'ms';cursor.classList.add('is-tag')}
  });
  b.addEventListener('pointermove',function(e){if(pqx){var pw=preview.offsetWidth;pqx(Math.min(e.clientX+28,innerWidth-pw-16));pqy(e.clientY-preview.offsetHeight/2)}});
  b.addEventListener('pointerleave',function(){preview.classList.remove('is-on');cursor.classList.remove('is-tag')});
  b.addEventListener('focus',ping);
  b.addEventListener('click',function(e){openCase(i,e)});
});

var caseEl=$('#case'),caseIdx=0,closing=false;
function fillCase(i){
  var p=PROJECTS[i];caseIdx=i;
  $('#case-idx').textContent=p.idx+' · connected in '+(14+i*3)+'ms';
  $('#case-conn').textContent='connected · 10.0.2.'+(i+1);
  $('#case-title').textContent=p.title;
  var img=$('#case-img');img.src=p.img;img.alt=p.alt;img.style.objectFit=p.fit||'';img.style.aspectRatio=p.fit?'auto':'';
  $('#case-type').textContent=p.type;$('#case-stack').textContent=p.stack;$('#case-status').textContent=p.status;
  $('#case-problem').textContent=p.problem;$('#case-built').textContent=p.built;$('#case-result').textContent=p.result;
  var body=$('.case__body');$$('.case__extra',body).forEach(function(n){n.remove()});
  (p.detail||[]).forEach(function(x){var dv=d.createElement('div'),h=d.createElement('h3'),pp=d.createElement('p');dv.className='case__extra';h.textContent=x[0];pp.textContent=x[1];dv.appendChild(h);dv.appendChild(pp);body.appendChild(dv)});
  // Real screenshots, when a project has them, go between the write-up and the buttons.
  $$('.case__shots',caseEl).forEach(function(n){n.remove()});
  if(p.shots){
    var sh=d.createElement('div');sh.className='case__shots';
    var hd=d.createElement('h3');hd.className='mono muted';hd.textContent='Screenshots';sh.appendChild(hd);
    p.shots.forEach(function(s){
      var f=d.createElement('figure');if(s.wide)f.className='is-wide';var im=d.createElement('img'),c=d.createElement('figcaption');
      im.src=s.src;im.alt=s.alt;im.width=s.w;im.height=s.h;im.loading='lazy';im.decoding='async';
      // Each shot links to the full-size file so phone visitors can zoom into the small labels.
      var a=d.createElement('a');a.href=s.src;a.target='_blank';a.rel='noopener';a.className='case__shot';a.appendChild(im);
      var nt=d.createElement('span');nt.className='sr-only';nt.textContent=' (opens full size in a new tab)';a.appendChild(nt);
      c.className='mono muted';c.textContent=s.cap+' Tap or click to open full size.';f.appendChild(a);f.appendChild(c);sh.appendChild(f);
    });
    $('.case__actions',caseEl).before(sh);
  }
  var lk=$('#case-link');lk.href=p.link?p.link[0]:'https://github.com/Cavhenn';$('#case-link-label').textContent=p.link?p.link[1]:'My GitHub';
  caseEl.scrollTop=0;
}
function openCase(i,e){
  fillCase(i);
  var x=e&&e.clientX?e.clientX:innerWidth/2,y=e&&e.clientY?e.clientY:innerHeight/2;
  caseEl.dataset.x=x;caseEl.dataset.y=y;
  preview.classList.remove('is-on');
  caseEl.showModal();
  root.classList.remove('has-cursor');
  root.style.overflow='hidden';
  if(!reduce&&caseEl.animate){
    var rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    caseEl.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+rad+'px at '+x+'px '+y+'px)']},{duration:800,easing:'cubic-bezier(.76,0,.24,1)'});
    if(hasG)G.from(['#case-title','.case__fig','.case__meta div','.case__body > div'],{y:40,opacity:0,duration:.9,ease:'expo.out',stagger:.06,delay:.3});
  }
  $('#case-close').focus();
}
function closeCase(fast){
  if(closing||!caseEl.open)return;
  var done=function(){caseEl.close()};
  if(fast||reduce||!caseEl.animate){done();return}
  closing=true;
  var x=+caseEl.dataset.x||innerWidth/2,y=+caseEl.dataset.y||innerHeight/2,rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  var out=caseEl.animate({clipPath:['circle('+rad+'px at '+x+'px '+y+'px)','circle(0px at '+x+'px '+y+'px)']},{duration:600,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'});
  out.onfinish=function(){done();out.cancel()};
}
$('#case-close').addEventListener('click',function(){closeCase()});
setFine(fine);
fineMQ.addEventListener('change',function(e){setFine(e.matches)});
caseEl.addEventListener('cancel',function(e){e.preventDefault();closeCase()});
caseEl.addEventListener('close',function(){closing=false;root.style.overflow='';if(useCursor)root.classList.add('has-cursor')});
$('#case-next').addEventListener('click',function(){
  var n=(caseIdx+1)%PROJECTS.length;
  if(reduce||!hasG){fillCase(n);return}
  G.to('.case__in',{opacity:0,y:-20,duration:.25,ease:'power2.in',onComplete:function(){fillCase(n);G.fromTo('.case__in',{opacity:0,y:30},{opacity:1,y:0,duration:.6,ease:'expo.out'})}});
});

var svc=$('#services'),track=$('#track'),panMQ=W.matchMedia('(min-width: 900px)');
if(hasG&&!reduce&&panMQ.matches){
  svc.classList.add('is-pan');$('.services__viewport').removeAttribute('tabindex');
  var dist=function(){return Math.max(0,track.scrollWidth-innerWidth)};
  var setH=function(){svc.style.height=(innerHeight+dist())+'px'};
  setH();ST.addEventListener('refreshInit',setH);
  var pan=G.to(track,{x:function(){return -dist()},ease:'none',scrollTrigger:{trigger:svc,start:'top top',end:'bottom bottom',scrub:.8,invalidateOnRefresh:true}});
  track.addEventListener('focusin',function(e){
    var card=e.target.closest('.packet');if(!card)return;
    var st=pan.scrollTrigger,p=Math.min(1,Math.max(0,(card.offsetLeft-innerWidth*.2)/Math.max(1,dist())));
    var y=st.start+(st.end-st.start)*p;
    jump(function(){W.scrollTo(0,y)});
  });
}

later(function graph(){
  var box=$('#graph');if(!box)return;
  var svg=$('svg',box);
  var N=[['cavhen',1],['HTML'],['CSS'],['JavaScript'],['PHP'],['MySQL'],['Java'],['C++'],['Figma'],['IntelliJ'],['VS Code'],['Git']];
  var E=[[0,1],[1,2],[1,3],[3,4],[4,5],[0,6],[6,7],[6,9],[0,8],[8,2],[0,11],[11,10],[10,3],[7,10],[0,3]];
  var nodes=N.map(function(n,i){
    var b=d.createElement('button');b.type='button';b.className='gnode'+(n[1]?' gnode--root':'');b.textContent=n[0];
    b.setAttribute('aria-label',n[0]+(i?', connected to '+E.filter(function(e){return e[0]===i||e[1]===i}).map(function(e){return N[e[0]===i?e[1]:e[0]][0]}).join(', '):', the center. Connected to everything.'));
    box.appendChild(b);return {el:b,x:0,y:0,vx:0,vy:0,fx:null,fy:null};
  });
  var lines=E.map(function(){var l=d.createElementNS('http://www.w3.org/2000/svg','line');svg.appendChild(l);return l});
  var bw=0,bh=0,alpha=1,running=false,visible=false;
  function layout(){
    var r=box.getBoundingClientRect();var ow=bw,oh=bh;bw=r.width;bh=r.height;
    nodes.forEach(function(n){n.w=n.el.offsetWidth;n.h=n.el.offsetHeight});
    nodes.forEach(function(n,i){
      if(!ow){var a=i/nodes.length*Math.PI*2;n.x=bw/2+Math.cos(a)*bw*.3*(i?1:0)+(i%3)*8;n.y=bh/2+Math.sin(a)*bh*.3*(i?1:0)}
      else{n.x*=bw/ow;n.y*=bh/oh}
    });
  }
  function step(){
    var L=Math.min(bw,bh)*.26,cx=bw/2,cy=bh/2,R=2600*Math.max(1,Math.min(4,bw/520)),gx=bw>bh*1.3?.0016:.004;
    for(var i=0;i<nodes.length;i++){var a=nodes[i];
      for(var j=i+1;j<nodes.length;j++){var b=nodes[j],dx=b.x-a.x,dy=b.y-a.y,dd=dx*dx+dy*dy+.01,f=R/dd;var dl=Math.sqrt(dd);dx/=dl;dy/=dl;a.vx-=dx*f;a.vy-=dy*f;b.vx+=dx*f;b.vy+=dy*f}
    }
    E.forEach(function(e){var a=nodes[e[0]],b=nodes[e[1]],dx=b.x-a.x,dy=b.y-a.y,dl=Math.sqrt(dx*dx+dy*dy)||1,f=(dl-L)*.02;dx/=dl;dy/=dl;a.vx+=dx*f;a.vy+=dy*f;b.vx-=dx*f;b.vy-=dy*f});
    nodes.forEach(function(n,i){
      n.vx+=(cx-n.x)*(i?gx:.03);n.vy+=(cy-n.y)*(i?.004:.03);
      if(n.fx!==null){n.x=n.fx;n.y=n.fy;n.vx=n.vy=0;return}
      n.vx*=.82;n.vy*=.82;n.x+=n.vx*alpha;n.y+=n.vy*alpha;
      var hw=n.w/2+6,hh=n.h/2+6;
      n.x=Math.max(hw,Math.min(bw-hw,n.x));n.y=Math.max(hh,Math.min(bh-hh,n.y));
    });
    alpha=Math.max(0,alpha*.992);
  }
  function draw(){
    nodes.forEach(function(n){n.el.style.transform='translate('+(n.x-n.w/2)+'px,'+(n.y-n.h/2)+'px)'});
    E.forEach(function(e,k){var a=nodes[e[0]],b=nodes[e[1]],l=lines[k];l.setAttribute('x1',a.x);l.setAttribute('y1',a.y);l.setAttribute('x2',b.x);l.setAttribute('y2',b.y)});
  }
  function loop(){if(!visible||alpha<.02){running=false;return}step();draw();requestAnimationFrame(loop)}
  function heat(v){alpha=Math.max(alpha,v||.6);if(reduce){for(var k=0;k<160;k++)step();draw();return}if(!running&&visible){running=true;requestAnimationFrame(loop)}}
  layout();
  for(var k=0;k<(reduce?400:60);k++)step();draw();
  new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible)heat(.5)}).observe(box);
  W.addEventListener('resize',function(){layout();heat(.3)});
  function hot(i,on){nodes[i].el.classList.toggle('is-hot',on);E.forEach(function(e,k){if(e[0]===i||e[1]===i){lines[k].classList.toggle('is-hot',on);nodes[e[0]===i?e[1]:e[0]].el.classList.toggle('is-hot',on)}})}
  nodes.forEach(function(n,i){
    var el=n.el,drag=false,ox=0,oy=0;
    el.addEventListener('pointerenter',function(){hot(i,true)});
    el.addEventListener('pointerleave',function(){if(!drag)hot(i,false)});
    el.addEventListener('focus',function(){hot(i,true)});
    el.addEventListener('blur',function(){hot(i,false)});
    el.addEventListener('pointerdown',function(e){drag=true;el.setPointerCapture(e.pointerId);var r=box.getBoundingClientRect();ox=e.clientX-r.left-n.x;oy=e.clientY-r.top-n.y;n.fx=n.x;n.fy=n.y;hot(i,true);heat(1)});
    el.addEventListener('pointermove',function(e){if(!drag)return;var r=box.getBoundingClientRect();n.fx=e.clientX-r.left-ox;n.fy=e.clientY-r.top-oy;if(reduce){n.x=n.fx;n.y=n.fy;draw()}heat(.8)});
    var end=function(){if(!drag)return;drag=false;n.fx=n.fy=null;hot(i,false);heat(.6)};
    el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
    el.addEventListener('keydown',function(e){
      var m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!m)return;
      e.preventDefault();var s=e.shiftKey?60:24;n.x+=m[0]*s;n.y+=m[1]*s;n.vx=n.vy=0;draw();heat(.5);
    });
  });
});

$('#copy').addEventListener('click',function(){
  var addr='hubkeyvhen@gmail.com',st=$('#copy-status');
  var fallback=function(){var r=d.createRange();r.selectNodeContents($('#email'));var s=getSelection();s.removeAllRanges();s.addRange(r);st.textContent='Selected. Press Ctrl+C to copy.'};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(addr).then(function(){st.textContent='Copied.'},fallback);else fallback();
  setTimeout(function(){st.textContent=''},4000);
});

later(function term(){
  var log=$('#term-log'),form=$('#term-form'),input=$('#term-input'),busy=false,hist=[],hi=0;
  var out=function(t,c){var p=d.createElement('p');if(c)p.className=c;p.textContent=t;log.appendChild(p);log.scrollTop=log.scrollHeight};
  var seq=function(lines,gap,cb){var i=0;busy=true;(function next(){if(i>=lines.length){busy=false;if(cb)cb();return}var l=lines[i++];out(l[0],l[1]);setTimeout(next,reduce?0:gap)})()};
  var C={
    help:function(){seq([['help             list commands'],['ping cavhen      check if I am reachable'],['traceroute       the route you just scrolled'],['whoami           who you are, who I am'],['email            show my email address'],['github           link to my GitHub'],['resume           download my résumé (PDF)'],['clear            clear the screen']],40)},
    ping:function(a){
      if(a&&a!=='cavhen'&&a!=='cavhen.dev'){out('ping: '+a+': host is not on this network. Try ping cavhen.','t-dim');return}
      var r=[['PING cavhen (10.0.5.1) from Cagayan de Oro: 56 data bytes']];
      for(var k=0;k<4;k++)r.push(['64 bytes from 10.0.5.1: icmp_seq='+k+' ttl=64 time='+(88+Math.round(Math.random()*8))+' ms']);
      r.push(['--- cavhen ping statistics ---','t-dim'],['4 packets sent, 4 received, 0% packet loss','t-dim'],['']);
      r.push(['reply from cavhen: Got your ping. I\'m taking new web and network work. Email hubkeyvhen@gmail.com and I\'ll reply within 24 hours on weekdays.','t-in']);
      seq(r,380);
    },
    traceroute:function(){seq(HOPS.map(function(h,i){return [' '+i+'  '+(i?'10.0.'+i+'.1':'192.168.1.1')+'  '+h.ms+' ms  '+h.label]}).concat([['destination reached.','t-in']]),160)},
    whoami:function(){out('visitor. I\'m Cavhen, a web developer and network specialist in Cagayan de Oro.')},
    email:function(){out('hubkeyvhen@gmail.com','t-in')},
    github:function(){out('https://github.com/Cavhenn','t-in')},
    resume:function(){out('Downloading Cavhen-Bulawin-Resume.pdf','t-in');var a=d.createElement('a');a.href='assets/Cavhen-Bulawin-Resume.pdf';a.download='';d.body.appendChild(a);a.click();a.remove()},
    clear:function(){log.textContent=''},
    sudo:function(){out('Permission denied. Nice try.','t-dim')},
    ls:function(){out('about  work  services  stack  contact')},
    hello:function(){out('Hi. Type ping cavhen.')}
  };
  C.hi=C.hello;C.contact=C.email;C.tracert=C.traceroute;
  form.addEventListener('submit',function(e){
    e.preventDefault();if(busy)return;
    var raw=input.value.trim();input.value='';if(!raw)return;
    hist.push(raw);hi=hist.length;
    out('visitor@net:~$ '+raw,'t-dim');
    var parts=raw.toLowerCase().split(/\s+/),cmd=parts[0],arg=parts[1];
    if(C[cmd])C[cmd](arg);else out('command not found: '+cmd+'. Type help to see what works.','t-dim');
  });
  input.addEventListener('keydown',function(e){
    if(e.key==='ArrowUp'&&hist.length){e.preventDefault();hi=Math.max(0,hi-1);input.value=hist[hi]}
    else if(e.key==='ArrowDown'&&hist.length){e.preventDefault();hi=Math.min(hist.length,hi+1);input.value=hist[hi]||''}
  });
});

(function net(){
  var cv=$('#net');if(!cv)return;
  var mobile=W.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  var gl=null,ctx=null;
  if(!mobile){try{gl=cv.getContext('webgl',{premultipliedAlpha:true,antialias:true,alpha:true,powerPreference:'low-power'})}catch(e){gl=null}}
  if(!gl)ctx=cv.getContext('2d');
  var dpr=Math.min(W.devicePixelRatio||1,gl?1.75:1.5);
  var Wd=0,Hd=0,nodes=[],edges=[],adj=[],origin=0,dest=0,target=-1,path=[],pathSet={},onPath={},cum=[],plen=0;
  var ptr={x:-1e4,y:-1e4,inside:false},on=0,col={},visible=true,raf=0,t0=performance.now();
  function hex(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c}).join('');var n=parseInt(h,16);return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]}
  function colors(){col.ink=hex(cssVar('--ink')||'#353A3F');col.paper=hex(cssVar('--paper')||'#F2F1EC');col.sig=hex(cssVar('--signal')||'#1A6BFF');col.route=hex(cssVar('--route')||'#1A6BFF');col.dark=isDark()?1:0}
  function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
  function nearest(x,y){var b=0,bd=1e12;nodes.forEach(function(n,i){var dd=(n.x-x)*(n.x-x)+(n.y-y)*(n.y-y);if(dd<bd){bd=dd;b=i}});return b}
  function route(a,b){var prev=new Array(nodes.length).fill(-1),q=[a],seen={};seen[a]=1;while(q.length){var u=q.shift();if(u===b)break;adj[u].forEach(function(v){if(!seen[v]){seen[v]=1;prev[v]=u;q.push(v)}})}var p=[b];while(p[0]!==a&&prev[p[0]]>=0)p.unshift(prev[p[0]]);return p[0]===a?p:[a]}
  function setTarget(i){
    if(i===target)return;target=i;path=route(origin,i);pathSet={};onPath={};path.forEach(function(k){onPath[k]=1});
    for(var k=0;k<path.length-1;k++){var a=path[k],b=path[k+1];pathSet[Math.min(a,b)+'-'+Math.max(a,b)]=1}
  }
  function build(){
    var r=cv.getBoundingClientRect();Wd=r.width;Hd=r.height;cv.width=Math.round(Wd*dpr);cv.height=Math.round(Hd*dpr);
    if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);
    var R=rng(1558),step=mobile?92:128,cols=Math.max(4,Math.round(Wd/step)),rows=Math.max(4,Math.round(Hd/(step*.82)));
    nodes=[];
    for(var y=0;y<rows;y++)for(var x=0;x<cols;x++){if(R()<.2)continue;var nx=(x+.5)/cols*Wd+(R()-.5)*Wd/cols*.75,ny=(y+.5)/rows*Hd+(R()-.5)*Hd/rows*.75;nodes.push({bx:nx,by:ny,x:nx,y:ny,ph:R()*6.283,lit:0})}
    var set={};edges=[];adj=nodes.map(function(){return []});
    nodes.forEach(function(n,i){
      var ds=nodes.map(function(m,j){return [j,(m.bx-n.bx)*(m.bx-n.bx)+(m.by-n.by)*(m.by-n.by)]}).sort(function(a,b){return a[1]-b[1]});
      for(var k=1;k<=3&&k<ds.length;k++){var j=ds[k][0],key=Math.min(i,j)+'-'+Math.max(i,j);if(!set[key]){set[key]=1;edges.push([Math.min(i,j),Math.max(i,j)]);adj[i].push(j);adj[j].push(i)}}
    });
    origin=nearest(Wd*.05,Hd*.92);dest=nearest(Wd*.94,Hd*.24);target=-1;setTarget(dest);
  }
  var prog={},buf={},F=null;
  function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
  function pg(vs,fs){var p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p}
  if(gl){
    try{
      prog.field=pg('attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}',
        'precision mediump float;uniform vec2 r;uniform vec2 m;uniform float t;uniform float on;uniform vec3 ink;uniform vec3 sig;uniform float dk;'+
        'void main(){vec2 uv=vec2(gl_FragCoord.x,r.y-gl_FragCoord.y);float dd=distance(uv,m)/r.y;'+
        'float glow=exp(-dd*dd*16.)*on;float s=sin(dd*64.-t*2.6);float ring=smoothstep(.93,1.,s)*exp(-dd*4.5)*on;'+
        'float a1=glow*mix(.16,.22,dk);float a2=ring*mix(.09,.12,dk);float a=a1+a2-a1*a2;'+
        'vec3 c=mix(sig,mix(ink,sig,dk),a2/(a1+a2+.0001));gl_FragColor=vec4(c,a);}');
      prog.line=pg('attribute vec2 p;attribute vec4 c;uniform vec2 r;varying vec4 v;void main(){vec2 z=p/r*2.-1.;gl_Position=vec4(z.x,-z.y,0.,1.);v=c;}',
        'precision mediump float;varying vec4 v;void main(){gl_FragColor=v;}');
      prog.pt=pg('attribute vec2 p;attribute float s;attribute vec4 f;attribute vec4 k;uniform vec2 r;uniform float d;varying vec4 vf;varying vec4 vk;varying float vs;varying float vw;'+
        'void main(){vec2 z=p/r*2.-1.;gl_Position=vec4(z.x,-z.y,0.,1.);gl_PointSize=s*d;vs=s*d;vw=3.*d/(s*d);vf=f;vk=k;}',
        'precision mediump float;varying vec4 vf;varying vec4 vk;varying float vs;varying float vw;'+
        'void main(){vec2 q=gl_PointCoord*2.-1.;float rr=length(q);float px=2./vs;float rw=vw;'+
        'float outer=1.-smoothstep(1.-px,1.,rr);float inner=1.-smoothstep(1.-rw-px,1.-rw,rr);vec4 c=mix(vk,vf,inner);c.a*=outer;if(c.a<.01)discard;gl_FragColor=c;}');
      buf.tri=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf.tri);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
      buf.line=gl.createBuffer();buf.pt=gl.createBuffer();
      gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    }catch(err){gl=null;var fresh=cv.cloneNode(false);cv.parentNode.replaceChild(fresh,cv);cv=fresh;ctx=cv.getContext('2d');dpr=Math.min(W.devicePixelRatio||1,1.5)}
  }
  // Look up shader locations once, and reuse vertex arrays between frames, so the loop allocates nothing.
  var A={},U={},LV=new Float32Array(0),PV=new Float32Array(0),li=0,pi=0;
  if(gl){
    A.fp=gl.getAttribLocation(prog.field,'p');
    ['r','m','t','on','ink','sig','dk'].forEach(function(n){U[n]=gl.getUniformLocation(prog.field,n)});
    A.lp=gl.getAttribLocation(prog.line,'p');A.lc=gl.getAttribLocation(prog.line,'c');U.lr=gl.getUniformLocation(prog.line,'r');
    A.pp=gl.getAttribLocation(prog.pt,'p');A.ps=gl.getAttribLocation(prog.pt,'s');A.pf=gl.getAttribLocation(prog.pt,'f');A.pk=gl.getAttribLocation(prog.pt,'k');
    U.pr=gl.getUniformLocation(prog.pt,'r');U.pd=gl.getUniformLocation(prog.pt,'d');
  }
  function sizeBufs(){var nl=edges.length*36,np=(nodes.length+3)*11;if(LV.length<nl)LV=new Float32Array(nl);if(PV.length<np)PV=new Float32Array(np)}
  function vtx(x,y,r,g,b,a){LV[li++]=x;LV[li++]=y;LV[li++]=r;LV[li++]=g;LV[li++]=b;LV[li++]=a}
  function seg(x1,y1,x2,y2,w,r,g,b,a){var dx=x2-x1,dy=y2-y1,l=Math.sqrt(dx*dx+dy*dy)||1,nx=-dy/l*w/2,ny=dx/l*w/2;
    vtx(x1+nx,y1+ny,r,g,b,a);vtx(x1-nx,y1-ny,r,g,b,a);vtx(x2+nx,y2+ny,r,g,b,a);
    vtx(x2+nx,y2+ny,r,g,b,a);vtx(x1-nx,y1-ny,r,g,b,a);vtx(x2-nx,y2-ny,r,g,b,a)}
  function pt(x,y,s,f0,f1,f2,f3,k0,k1,k2,k3){PV[pi++]=x;PV[pi++]=y;PV[pi++]=s;PV[pi++]=f0;PV[pi++]=f1;PV[pi++]=f2;PV[pi++]=f3;PV[pi++]=k0;PV[pi++]=k1;PV[pi++]=k2;PV[pi++]=k3}
  function pathPoint(f){
    if(path.length<2)return null;var target=f*plen,k=0;while(k<cum.length-1&&cum[k+1]<target)k++;
    var a=nodes[path[k]],b=nodes[path[Math.min(k+1,path.length-1)]],segL=(cum[k+1]-cum[k])||1,u=(target-cum[k])/segL;return [a.x+(b.x-a.x)*u,a.y+(b.y-a.y)*u]}
  function update(t){
    if(ptr.inside){var nn=nearest(ptr.x,ptr.y);setTarget(nn);if(useCursor){var tt=(path.length-1)+' hops · '+(3+(path.length-1)*11)+'ms';if(tag.textContent!==tt)tag.textContent=tt}}else setTarget(dest);
    on+=((ptr.inside?1:0)-on)*.06;
    nodes.forEach(function(n){
      var dx=ptr.x-n.bx,dy=ptr.y-n.by,dd=Math.sqrt(dx*dx+dy*dy),lt=ptr.inside?Math.max(0,1-dd/190):0;
      n.lit+=(lt-n.lit)*.12;
      var drift=reduce?0:1;
      n.x=n.bx+Math.sin(t*.00045+n.ph)*7*drift+dx*.07*n.lit;
      n.y=n.by+Math.cos(t*.0004+n.ph*1.3)*6*drift+dy*.07*n.lit;
    });
    cum=[0];plen=0;for(var k=0;k<path.length-1;k++){var a=nodes[path[k]],b=nodes[path[k+1]];plen+=Math.hypot(b.x-a.x,b.y-a.y);cum.push(plen)}
  }
  function render(t){
    var ink=col.ink,sig=col.sig,rt=col.route,paper=col.paper;
    var pulses=[];if(path.length>1){for(var q=0;q<3;q++){var f=((t*.00022)+q/3)%1;var pp=pathPoint(f);if(pp)pulses.push(pp)}}
    if(gl){
      gl.viewport(0,0,cv.width,cv.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      if(on>.01){
        gl.useProgram(prog.field);gl.bindBuffer(gl.ARRAY_BUFFER,buf.tri);gl.enableVertexAttribArray(A.fp);gl.vertexAttribPointer(A.fp,2,gl.FLOAT,false,0,0);
        gl.uniform2f(U.r,cv.width,cv.height);gl.uniform2f(U.m,ptr.x*dpr,ptr.y*dpr);gl.uniform1f(U.t,t*.001);gl.uniform1f(U.on,on);
        gl.uniform3fv(U.ink,ink);gl.uniform3fv(U.sig,sig);gl.uniform1f(U.dk,col.dark);
        gl.drawArrays(gl.TRIANGLES,0,3);gl.disableVertexAttribArray(A.fp);
      }
      sizeBufs();li=0;
      for(var ei=0;ei<edges.length;ei++){var e=edges[ei],a=nodes[e[0]],b=nodes[e[1]],lit=Math.max(a.lit,b.lit);
        if(pathSet[e[0]+'-'+e[1]])seg(a.x,a.y,b.x,b.y,2.2,rt[0],rt[1],rt[2],.95);
        else seg(a.x,a.y,b.x,b.y,1+lit*.8,ink[0],ink[1],ink[2],.13+lit*.5)}
      gl.useProgram(prog.line);gl.bindBuffer(gl.ARRAY_BUFFER,buf.line);gl.bufferData(gl.ARRAY_BUFFER,LV.subarray(0,li),gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(A.lp);gl.enableVertexAttribArray(A.lc);
      gl.vertexAttribPointer(A.lp,2,gl.FLOAT,false,24,0);gl.vertexAttribPointer(A.lc,4,gl.FLOAT,false,24,8);
      gl.uniform2f(U.lr,Wd,Hd);gl.drawArrays(gl.TRIANGLES,0,li/6);
      gl.disableVertexAttribArray(A.lp);gl.disableVertexAttribArray(A.lc);
      pi=0;
      for(var ni=0;ni<nodes.length;ni++){
        var n=nodes[ni],isT=ni===target,isO=ni===origin,isP=onPath[ni],nl=n.lit;
        var sz=isT?20:isO?14:isP?13:9+nl*5,fc=isT||isO?ink:(isP||nl>.35)?sig:paper;
        pt(n.x,n.y,sz,fc[0],fc[1],fc[2],1,ink[0],ink[1],ink[2],isP||isT||nl>.2?1:.55);
      }
      for(var q2=0;q2<pulses.length;q2++)pt(pulses[q2][0],pulses[q2][1],8,sig[0],sig[1],sig[2],1,ink[0],ink[1],ink[2],1);
      gl.useProgram(prog.pt);gl.bindBuffer(gl.ARRAY_BUFFER,buf.pt);gl.bufferData(gl.ARRAY_BUFFER,PV.subarray(0,pi),gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(A.pp);gl.enableVertexAttribArray(A.ps);gl.enableVertexAttribArray(A.pf);gl.enableVertexAttribArray(A.pk);
      gl.vertexAttribPointer(A.pp,2,gl.FLOAT,false,44,0);gl.vertexAttribPointer(A.ps,1,gl.FLOAT,false,44,8);gl.vertexAttribPointer(A.pf,4,gl.FLOAT,false,44,12);gl.vertexAttribPointer(A.pk,4,gl.FLOAT,false,44,28);
      gl.uniform2f(U.pr,Wd,Hd);gl.uniform1f(U.pd,dpr);
      gl.drawArrays(gl.POINTS,0,pi/11);
      gl.disableVertexAttribArray(A.pp);gl.disableVertexAttribArray(A.ps);gl.disableVertexAttribArray(A.pf);gl.disableVertexAttribArray(A.pk);
    }else{
      var rgba=function(c,a){return 'rgba('+Math.round(c[0]*255)+','+Math.round(c[1]*255)+','+Math.round(c[2]*255)+','+a+')'};
      ctx.clearRect(0,0,Wd,Hd);
      edges.forEach(function(e){var a=nodes[e[0]],b=nodes[e[1]],key=e[0]+'-'+e[1];ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        if(pathSet[key]){ctx.strokeStyle=rgba(rt,.95);ctx.lineWidth=2}else{ctx.strokeStyle=rgba(ink,.14);ctx.lineWidth=1}ctx.stroke()});
      nodes.forEach(function(n,i){var isT=i===target,isO=i===origin,r=isT?9:isO?6.5:onPath[i]?6:4;ctx.beginPath();ctx.arc(n.x,n.y,r,0,6.283);
        ctx.fillStyle=isT||isO?rgba(ink,1):onPath[i]?rgba(sig,1):rgba(paper,1);ctx.fill();ctx.lineWidth=1.25;ctx.strokeStyle=rgba(ink,onPath[i]||isT?1:.5);ctx.stroke()});
      pulses.forEach(function(p){ctx.beginPath();ctx.arc(p[0],p[1],3.5,0,6.283);ctx.fillStyle=rgba(sig,1);ctx.fill();ctx.strokeStyle=rgba(ink,1);ctx.stroke()});
    }
  }
  // Full frame rate while the pointer is on the map; the idle drift only needs 30 fps.
  var last=0;
  function frame(now){raf=0;if(!visible||d.hidden)return;
    if(!ptr.inside&&on<.01&&now-last<32&&!reduce){raf=requestAnimationFrame(frame);return}
    last=now;var t=now-t0;update(t);render(t);if(!reduce)raf=requestAnimationFrame(frame)}
  function kick(){if(!raf)raf=requestAnimationFrame(frame)}
  colors();build();
  d.addEventListener('cvh:theme',function(){colors();kick()});
  // Rebuild only when the canvas size really changed; phones fire resize when the address bar moves.
  var rto;W.addEventListener('resize',function(){clearTimeout(rto);rto=setTimeout(function(){var r=cv.getBoundingClientRect();if(Math.abs(r.width-Wd)<1&&Math.abs(r.height-Hd)<1)return;build();kick()},150)});
  new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible)kick()}).observe(cv);
  d.addEventListener('visibilitychange',kick);
  var stage=$('.hero__stage');
  stage.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var r=cv.getBoundingClientRect();ptr.x=e.clientX-r.left;ptr.y=e.clientY-r.top;ptr.inside=true;if(useCursor)cursor.classList.add('is-tag');kick()},{passive:true});
  stage.addEventListener('pointerleave',function(){ptr.inside=false;cursor.classList.remove('is-tag');kick()});
  stage.addEventListener('pointerover',function(e){if(e.target.closest('a'))cursor.classList.remove('is-tag')});
  kick();
})();

if(hasG){W.addEventListener('load',function(){ST.refresh()});ST.config({ignoreMobileResize:true})}
});
