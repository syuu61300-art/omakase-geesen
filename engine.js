// おまかせゲーセン — shared engine: random rotation, timer, score, medals, sound, particles.
window.MG=(()=>{
const W=720,H=960;
const cv=document.getElementById('cv'),ctx=cv.getContext('2d'),stage=document.getElementById('stage');
const FD='"Dela Gothic One","Hiragino Sans","Yu Gothic",sans-serif',FB='"M PLUS Rounded 1c","Hiragino Maru Gothic ProN","Yu Gothic",sans-serif';
const C={ink:'#120e1d',cream:'#fff3df',coral:'#ff6f59',gold:'#ffc857',teal:'#2ec4b6',sky:'#5b8cff',pink:'#ff7ab6',lilac:'#a98bff',lime:'#9be15d'};
let BS=1;
function fit(){const cs=getComputedStyle(stage);const aw=stage.clientWidth-parseFloat(cs.paddingLeft||0)-parseFloat(cs.paddingRight||0);const ah=stage.clientHeight-parseFloat(cs.paddingTop||0)-parseFloat(cs.paddingBottom||0);const sc=Math.max(.1,Math.min(aw/W,ah/H));cv.style.width=Math.floor(W*sc)+'px';cv.style.height=Math.floor(H*sc)+'px';BS=Math.min(2,Math.max(.6,sc*(window.devicePixelRatio||1)));cv.width=Math.round(W*BS);cv.height=Math.round(H*BS)}
addEventListener('resize',fit);

// ---------- color helpers (hex in) ----------
const hex2=h=>{h=String(h).replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16)||0;return[n>>16&255,n>>8&255,n&255]};
const mix=(a,b,t)=>{const A=hex2(a),B=hex2(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'};
const shade=(a,t)=>t>=0?mix(a,'#ffffff',t):mix(a,'#000000',-t);
const rgba=(a,al)=>{const A=hex2(a);return'rgba('+A[0]+','+A[1]+','+A[2]+','+al+')'};

// ---------- input ----------
let clock=0;
const I={x:W/2,y:H/2,px:W/2,py:H/2,down:false,pressed:false,released:false,sx:0,sy:0,st:0,keys:{},kp:{},trail:[],swipe:null};
// Input: touch events on phones (multi-touch, no scroll/zoom/long-press menu), pointer events for mouse/pen.
// The whole screen is the touch surface, so taps in the letterbox margins still count (clamped to the screen edge).
I.touches=[];I.deferUp=false;
const surf=stage;
const toL=(cx,cy)=>{const r=cv.getBoundingClientRect();return[Math.max(0,Math.min(W,(cx-r.left)*W/(r.width||1))),Math.max(0,Math.min(H,(cy-r.top)*H/(r.height||1)))]};
function pDown(cx,cy){const p=toL(cx,cy);I.x=I.px=p[0];I.y=I.py=p[1];I.down=true;I.pressed=true;I.deferUp=false;I.sx=p[0];I.sy=p[1];I.st=clock;I.trail=[];audioInit()}
function pMove(cx,cy){const p=toL(cx,cy);I.x=p[0];I.y=p[1]}
function pRelease(){I.down=false;I.released=true;const dx=I.x-I.sx,dy=I.y-I.sy;if(Math.hypot(dx,dy)>30)I.swipe={dx,dy,dt:Math.max(.016,clock-I.st)}}
// A quick tap can start and end inside one frame; keep it "held" for that frame and release on the next one.
function pUp(){if(!I.down)return;if(I.pressed){I.deferUp=true;return}pRelease()}
let prim=null;
const syncT=e=>{I.touches=Array.from(e.touches).map(t=>toL(t.clientX,t.clientY))};
surf.addEventListener('touchstart',e=>{e.preventDefault();syncT(e);const t=e.changedTouches[e.changedTouches.length-1];prim=t.identifier;pDown(t.clientX,t.clientY)},{passive:false});
surf.addEventListener('touchmove',e=>{e.preventDefault();syncT(e);for(const t of Array.from(e.changedTouches))if(t.identifier===prim)pMove(t.clientX,t.clientY)},{passive:false});
const tEnd=e=>{e.preventDefault();syncT(e);audioInit();for(const t of Array.from(e.changedTouches)){if(t.identifier!==prim)continue;pMove(t.clientX,t.clientY);if(e.touches.length){const n=e.touches[0];prim=n.identifier;const p=toL(n.clientX,n.clientY);I.x=I.px=p[0];I.y=I.py=p[1]}else{prim=null;pUp()}}};
surf.addEventListener('touchend',tEnd,{passive:false});surf.addEventListener('touchcancel',tEnd,{passive:false});
surf.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;e.preventDefault();try{surf.setPointerCapture(e.pointerId)}catch(_){}cv.focus&&cv.focus();pDown(e.clientX,e.clientY);I.touches=[[I.x,I.y]]});
surf.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;pMove(e.clientX,e.clientY);if(I.down)I.touches=[[I.x,I.y]]});
const ptrUp=e=>{if(e.pointerType==='touch')return;I.touches=[];pUp()};
surf.addEventListener('pointerup',ptrUp);surf.addEventListener('pointercancel',ptrUp);addEventListener('pointerup',ptrUp);
surf.addEventListener('contextmenu',e=>e.preventDefault());surf.addEventListener('dblclick',e=>e.preventDefault());
document.addEventListener('gesturestart',e=>e.preventDefault());
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();I.keys[e.key]=true;if(!e.repeat)I.kp[e.key]=true;audioInit()});
addEventListener('keyup',e=>{I.keys[e.key]=false});
addEventListener('blur',()=>{I.keys={};I.down=false;I.touches=[];prim=null});

// ---------- sound ----------
let AC=null,master=null,nbuf=null,muted=false;
try{muted=localStorage.getItem('mgMute')==='1'}catch(e){}
function audioInit(){if(AC){if(AC.state==='suspended')AC.resume();return}try{AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=.32;master.connect(AC.destination)}catch(e){AC=null}}
function tone(f=440,d=.1,type='sine',v=.3,f2=0,delay=0){if(!AC||muted)return;try{const t=AC.currentTime+delay,o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(1,f2),t+d);gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(gn);gn.connect(master);o.start(t);o.stop(t+d+.03)}catch(e){}}
function noise(d=.15,v=.2,delay=0,hp=1000){if(!AC||muted)return;try{if(!nbuf){nbuf=AC.createBuffer(1,AC.sampleRate*.5|0,AC.sampleRate);const a=nbuf.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}const t=AC.currentTime+delay,s=AC.createBufferSource(),f=AC.createBiquadFilter(),gn=AC.createGain();s.buffer=nbuf;f.type='highpass';f.frequency.value=hp;gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(gn);gn.connect(master);s.start(t);s.stop(t+d+.03)}catch(e){}}
const SFX={hit:()=>tone(660,.09,'square',.12,300),good:()=>{tone(880,.09,'triangle',.25);tone(1320,.14,'triangle',.2,0,.07)},bad:()=>tone(220,.28,'sawtooth',.16,80),coin:()=>{tone(988,.06,'square',.1);tone(1319,.16,'square',.1,0,.06)},jump:()=>tone(320,.14,'triangle',.22,760),boom:()=>{noise(.4,.4,0,200);tone(120,.4,'sine',.4,40)},tick:()=>tone(1400,.035,'square',.07),pop:()=>tone(480,.07,'sine',.3,980),win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.2,'triangle',.22,0,i*.09)),lose:()=>[392,330,262].forEach((f,i)=>tone(f,.24,'triangle',.2,0,i*.12)),swish:()=>noise(.25,.25,0,3000)};
const sfx=n=>{const f=SFX[n];if(f)f()};
function toggleMute(){muted=!muted;try{localStorage.setItem('mgMute',muted?'1':'0')}catch(e){}audioInit();if(!muted)tone(880,.08,'triangle',.2)}

// ---------- fx ----------
let parts=[],floats=[],shakeA=0,flashA=0,flashC='#fff';
function burst(x,y,col='#ffffff',n=16,sp=260,sz=5,grav=500){for(let i=0;i<n;i++){const a=Math.random()*6.2832,s=sp*(.25+Math.random()*.75),l=.45+Math.random()*.5;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:l,max:l,col,sz:sz*(.5+Math.random()),grav})}if(parts.length>700)parts.splice(0,parts.length-700)}
function float(text,x,y,col=C.gold,size=30){floats.push({text,x,y,col,size,life:.9})}

// ---------- draw helpers ----------
function bg(c1,c2){const gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,c1);gr.addColorStop(1,c2);ctx.fillStyle=gr;ctx.fillRect(0,0,W,H)}
function vignette(a=.5){const gr=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.78);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,'+a+')');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H)}
function circle(x,y,r,f){ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,6.2832);ctx.fillStyle=f;ctx.fill()}
function rr(x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,Math.max(0,w),Math.max(0,h),Math.max(0,Math.min(r,w/2,h/2)));else ctx.rect(x,y,w,h)}
function rrf(x,y,w,h,r,f){rr(x,y,w,h,r);ctx.fillStyle=f;ctx.fill()}
function txt(s,x,y,size=32,col=C.cream,align='center',font=FB,weight=800){ctx.font=weight+' '+size+'px '+font;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=col;ctx.fillText(s,x,y)}
function fitTxt(s,x,y,max,size,col=C.cream,font=FD,weight=400){ctx.font=weight+' '+size+'px '+font;const w=ctx.measureText(s).width||1;if(w>max)size=Math.floor(size*max/w);txt(s,x,y,size,col,'center',font,weight)}
const glow=(col,b=20)=>{ctx.shadowColor=col;ctx.shadowBlur=b},noglow=()=>{ctx.shadowBlur=0};
function poly(x,y,r,n,rot=0){ctx.beginPath();for(let i=0;i<n;i++){const a=rot+i*6.2832/n;ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}ctx.closePath()}
function star(x,y,r1,r2,n=5,rot=-Math.PI/2){ctx.beginPath();for(let i=0;i<n*2;i++){const r=i%2?r2:r1,a=rot+i*Math.PI/n;ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}ctx.closePath()}
function segDist(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy;let t=l?((px-x1)*dx+(py-y1)*dy)/l:0;t=t<0?0:t>1?1:t;return Math.hypot(px-x1-dx*t,py-y1-dy*t)}

// ---------- flow ----------
const games=[];let bag=[],cur=null,S=null,phase='title',pt=0,round=0,lastId=null,endMsg='',medalV=0,newBest=false,paused=false,lastTick=0;
const stats={played:0,m:[0,0,0,0],total:0};
let best={};try{best=JSON.parse(localStorage.getItem('mgBest')||'{}')||{}}catch(e){best={}}
const g={W,H,I,C,ctx,FD,FB,time:0,left:0,score:0,
 rnd:(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a),
 ri:(a,b)=>Math.floor(a+Math.random()*(b-a+1)),
 pick:a=>a[Math.floor(Math.random()*a.length)],
 shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t}return a},
 clamp:(v,a,b)=>v<a?a:v>b?b:v,lerp:(a,b,t)=>a+(b-a)*t,dist:(a,b,c,d)=>Math.hypot(c-a,d-b),ease:t=>1-Math.pow(1-Math.min(1,Math.max(0,t)),3),
 segDist,add(n,x,y,col){g.score+=n;if(x!==undefined)float((n>0?'+':'')+n,x,y,col||(n<0?C.coral:C.gold))},
 over(msg){endGame(msg||'ゲームオーバー')},burst,float,shake:a=>{shakeA=Math.max(shakeA,a)},flash:(c,a=.5)=>{flashC=c;flashA=a},
 sfx,tone,noise,bg,vignette,circle,rr,rrf,txt,fitTxt,glow,noglow,poly,star,mix,shade,rgba,
 offscreen:(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c}};
function reg(gm){games.push(gm)}
function nextGame(){if(!games.length)return;
 if(!bag.length){bag=g.shuffle(games.map(x=>x.id));if(bag.length>1&&bag[bag.length-1]===lastId){const t=bag[0];bag[0]=bag[bag.length-1];bag[bag.length-1]=t}}
 const nid=bag.pop();cur=games.find(x=>x.id===nid)||games[0];lastId=cur.id;round++;paused=false;
 g.score=0;g.time=0;g.left=cur.time;parts=[];floats=[];shakeA=0;flashA=0;lastTick=0;
 try{S=cur.init(g)}catch(e){console.error(cur.id,e);S=null}
 phase='intro';pt=0}
function endGame(msg){if(phase!=='play')return;phase='result';pt=0;endMsg=msg;const sc=Math.max(0,Math.round(g.score));g.score=sc;
 medalV=sc>=cur.goal?3:sc>=cur.goal*.5?2:sc>0?1:0;stats.played++;stats.m[medalV]++;stats.total+=sc;
 newBest=sc>(best[cur.id]||0);if(newBest){best[cur.id]=sc;try{localStorage.setItem('mgBest',JSON.stringify(best))}catch(e){}}
 sfx(medalV>=2?'win':'lose')}
function safeDraw(){ctx.save();if(shakeA>.5)ctx.translate((Math.random()-.5)*shakeA,(Math.random()-.5)*shakeA);
 ctx.save();try{if(S)cur.draw(S,g,ctx)}catch(e){console.error(cur.id,e)}ctx.restore();
 ctx.globalCompositeOperation='lighter';for(const p of parts){ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.col;ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,6.2832);ctx.fill()}
 ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
 for(const f of floats){ctx.globalAlpha=Math.min(1,f.life*2);ctx.font='800 '+f.size+'px '+FB;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=6;ctx.strokeStyle='rgba(10,8,20,.75)';ctx.strokeText(f.text,f.x,f.y);ctx.fillStyle=f.col;ctx.fillText(f.text,f.x,f.y)}
 ctx.globalAlpha=1;ctx.restore();
 if(flashA>0){ctx.globalAlpha=Math.min(1,flashA);ctx.fillStyle=flashC;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1}}
function hud(){ctx.fillStyle='rgba(10,8,20,.62)';ctx.fillRect(0,0,W,64);
 rrf(12,14,82,36,18,'rgba(255,243,223,.12)');txt('スキップ',53,32,16,'rgba(255,243,223,.8)');
 txt('No.'+round,108,32,20,C.gold,'left');ctx.font='800 24px '+FB;txt(cur.name,180,32,24,C.cream,'left');
 txt(String(Math.round(g.score)),W-20,30,34,C.cream,'right',FD,400);
 const r=Math.max(0,Math.min(1,g.left/cur.time));ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(0,64,W,6);ctx.fillStyle=g.left<5?C.coral:C.teal;ctx.fillRect(0,64,W*r,6);
 txt(Math.max(0,Math.ceil(g.left))+'秒',W-20,86,17,g.left<5?C.coral:'rgba(255,243,223,.65)','right')}
const deco=Array.from({length:30},(_,i)=>({x:Math.random()*W,y:Math.random()*H,r:14+Math.random()*30,vy:15+Math.random()*35,rot:Math.random()*6,vr:(Math.random()-.5)*1.4,k:i%4,col:[C.coral,C.gold,C.teal,C.sky,C.pink,C.lilac][i%6]}));
function drawTitle(dt){bg('#241a3d','#0c0915');
 for(const d of deco){d.y-=d.vy*dt;d.rot+=d.vr*dt;if(d.y<-60){d.y=H+60;d.x=Math.random()*W}ctx.globalAlpha=.45;ctx.strokeStyle=d.col;ctx.lineWidth=6;
  if(d.k===0){ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,6.2832)}else if(d.k===1)poly(d.x,d.y,d.r,3,d.rot);else if(d.k===2)star(d.x,d.y,d.r,d.r*.45,5,d.rot);else poly(d.x,d.y,d.r,4,d.rot);ctx.stroke()}
 ctx.globalAlpha=1;
 const bob=Math.sin(clock*2)*6;
 txt('おまかせ',W/2+5,300+bob+5,92,C.coral,'center',FD,400);txt('おまかせ',W/2,300+bob,92,C.gold,'center',FD,400);
 txt('ゲーセン',W/2+7,430+bob+7,124,C.coral,'center',FD,400);glow(C.pink,30);txt('ゲーセン',W/2,430+bob,124,C.cream,'center',FD,400);noglow();
 txt('ジャンルの違うミニゲームが ランダムに次々登場',W/2,540,24,'rgba(255,243,223,.85)');
 txt('収録 '+games.length+'本 ／ 目標 200本',W/2,584,22,C.teal);
 const names=games.map(x=>x.name).join('　・　')+'　・　';ctx.font='800 22px '+FB;const tw=ctx.measureText(names).width||1000;const off=-(clock*70)%tw;
 ctx.save();ctx.beginPath();ctx.rect(40,620,W-80,44);ctx.clip();rrf(40,620,W-80,44,22,'rgba(255,255,255,.06)');for(let x=off;x<W;x+=tw)txt(names,40+x,642,22,'rgba(255,200,87,.8)','left');ctx.restore();
 ctx.globalAlpha=.55+.45*Math.sin(clock*4);txt('タップ / スペースでスタート',W/2,760,34,C.cream);ctx.globalAlpha=1;
 if(stats.played)txt('プレイ '+stats.played+'　金 '+stats.m[3]+'　銀 '+stats.m[2]+'　銅 '+stats.m[1],W/2,840,22,'rgba(255,243,223,.7)');
 rrf(W/2-130,878,260,48,24,'rgba(255,255,255,.1)');txt(muted?'音 OFF（タップで切替）':'音 ON（タップで切替）',W/2,902,20,muted?'rgba(255,243,223,.5)':C.teal)}
function drawIntro(){ctx.fillStyle='rgba(8,6,16,.74)';ctx.fillRect(0,0,W,H);
 const e=g.ease(pt/.35),y0=220+(1-e)*60;ctx.globalAlpha=e;
 rrf(60,y0,W-120,480,28,'rgba(24,18,40,.96)');ctx.lineWidth=4;ctx.strokeStyle=cur.color;rr(60,y0,W-120,480,28);ctx.stroke();
 txt('No.'+round,W/2,y0+48,22,C.gold);
 ctx.font='800 22px '+FB;const gw=ctx.measureText(cur.genre).width||80;rrf(W/2-gw/2-20,y0+80,gw+40,44,22,cur.color);txt(cur.genre,W/2,y0+102,22,'#120e1d');
 fitTxt(cur.name,W/2,y0+190,W-200,64,C.cream);
 cur.howto.split('\n').forEach((l,i)=>txt(l,W/2,y0+270+i*42,25,'rgba(255,243,223,.9)'));
 const left=Math.max(0,2.6-pt),n=Math.max(1,Math.ceil(left/(2.6/3)));
 ctx.lineWidth=8;ctx.strokeStyle='rgba(255,255,255,.15)';ctx.beginPath();ctx.arc(W/2,y0+405,36,0,6.2832);ctx.stroke();
 ctx.strokeStyle=cur.color;ctx.beginPath();ctx.arc(W/2,y0+405,36,-Math.PI/2,-Math.PI/2+6.2832*(left/2.6));ctx.stroke();txt(String(n),W/2,y0+407,36,C.cream,'center',FD,400);
 txt('タップでスキップ',W/2,y0+515,18,'rgba(255,243,223,.55)');ctx.globalAlpha=1}
function medal(x,y,m){const P=[['#6b6478','#3a3446'],['#e0965a','#8a4f22'],['#f1f4f9','#8f9bab'],['#ffe28a','#c98d17']][m];
 ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(clock*2)*.06);
 ctx.fillStyle=C.coral;ctx.beginPath();ctx.moveTo(-46,-118);ctx.lineTo(-8,-118);ctx.lineTo(-22,-40);ctx.lineTo(-60,-40);ctx.closePath();ctx.fill();
 ctx.fillStyle=C.sky;ctx.beginPath();ctx.moveTo(46,-118);ctx.lineTo(8,-118);ctx.lineTo(22,-40);ctx.lineTo(60,-40);ctx.closePath();ctx.fill();
 glow(P[0],m===3?40:14);const gr=ctx.createRadialGradient(-22,-22,4,0,0,68);gr.addColorStop(0,'#ffffff');gr.addColorStop(.3,P[0]);gr.addColorStop(1,P[1]);circle(0,0,64,gr);noglow();
 ctx.lineWidth=4;ctx.strokeStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.arc(0,0,50,0,6.2832);ctx.stroke();
 star(0,2,30,13);ctx.fillStyle=P[1];ctx.fill();ctx.restore()}
function drawResult(){const e=g.ease(pt/.4);ctx.fillStyle='rgba(8,6,16,'+(.72*e)+')';ctx.fillRect(0,0,W,H);ctx.globalAlpha=e;
 const y0=200+(1-e)*40;rrf(70,y0,W-140,530,28,'rgba(24,18,40,.96)');ctx.lineWidth=4;ctx.strokeStyle=cur.color;rr(70,y0,W-140,530,28);ctx.stroke();
 fitTxt(endMsg,W/2,y0+60,W-200,42,C.cream);medal(W/2,y0+200,medalV);
 txt(['ざんねん…','銅メダル','銀メダル','金メダル！'][medalV],W/2,y0+305,28,[C.cream,'#e0965a','#dfe6f0',C.gold][medalV]);
 txt(g.score+' 点',W/2,y0+368,56,C.gold,'center',FD,400);
 txt('金メダルは '+cur.goal+'点 ・ 自己ベスト '+(best[cur.id]||0)+'点',W/2,y0+428,20,'rgba(255,243,223,.7)');
 if(newBest&&g.score>0)txt('自己ベスト更新！',W/2,y0+462,24,C.pink);
 ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(140,y0+500,W-280,6);ctx.fillStyle=cur.color;ctx.fillRect(140,y0+500,(W-280)*Math.min(1,pt/AUTO),6);
 ctx.globalAlpha=e*(.6+.4*Math.sin(clock*5));txt(Math.max(1,Math.ceil(AUTO-pt))+'秒後に次のゲーム（タップですぐ）',W/2,y0+570,24,C.cream);ctx.globalAlpha=1}
const AUTO=3;
function drawPause(){ctx.fillStyle='rgba(8,6,16,.7)';ctx.fillRect(0,0,W,H);txt('一時停止中',W/2,H/2-20,56,C.cream,'center',FD,400);txt('タップかキーで再開',W/2,H/2+50,24,'rgba(255,243,223,.75)')}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&phase==='play')paused=true});
let last=0;
function frame(now){try{step(now)}catch(e){console.error(e);if(phase==='play'||phase==='result'){phase='result';pt=AUTO}}finally{I.pressed=I.released=false;I.kp={};I.swipe=null;I.px=I.x;I.py=I.y;if(I.deferUp){I.deferUp=false;pRelease()}requestAnimationFrame(frame)}}
function step(now){const raw=last?Math.min(.25,(now-last)/1000):0;last=now;let dt=Math.min(1/30,raw);clock+=raw;
 const anyKey=Object.keys(I.kp).length>0;
 if(phase!=='play')paused=false;
 if(paused){dt=0;if(I.pressed||anyKey){paused=false;I.pressed=false;I.kp={}}}
 else if(phase==='play'&&(I.kp.p||I.kp.P)){paused=true}
 if(I.down)I.trail.push({x:I.x,y:I.y,t:clock});I.trail=I.trail.filter(p=>clock-p.t<.14);
 ctx.setTransform(BS,0,0,BS,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.shadowBlur=0;
 pt+=dt;
 for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.grav*dt;p.vx*=1-dt*1.5;p.life-=dt}parts=parts.filter(p=>p.life>0);
 for(const f of floats){f.y-=60*dt;f.life-=dt}floats=floats.filter(f=>f.life>0);
 shakeA*=Math.pow(.004,dt);flashA=Math.max(0,flashA-dt*2.2);
 if(phase==='title'){drawTitle(raw);if(I.pressed&&I.y>868&&Math.abs(I.x-W/2)<140)toggleMute();else if(I.pressed||I.kp[' ']||I.kp.Enter)nextGame()}
 else if(phase==='intro'){safeDraw();drawIntro();if(pt>2.6||(pt>.35&&(I.pressed||I.kp[' ']||I.kp.Enter))){if(!S)nextGame();else{phase='play';pt=0;I.pressed=false;I.kp={}}}}
 else if(phase==='play'){
  if(I.pressed&&I.x<100&&I.y<64){I.pressed=false;endGame('スキップ')}
  else if(dt>0){g.time+=dt;g.left=cur.time-g.time;const sec=Math.ceil(g.left);if(sec<=5&&sec>0&&sec!==lastTick){lastTick=sec;sfx('tick')}
   try{cur.update(S,g,dt)}catch(e){console.error(cur.id,e);endGame('エラーのためスキップ')}
   if(phase==='play'&&g.left<=0)endGame(cur.endMsg||'タイムアップ！')}
  safeDraw();hud();if(paused)drawPause()}
 else if(phase==='result'){pt+=dt?0:raw;safeDraw();hud();drawResult();if((pt>.5&&(I.pressed||I.kp[' ']||I.kp.Enter))||pt>=AUTO)nextGame()}}
function start(){fit();requestAnimationFrame(frame)}
return{reg,start,g,games,_state:()=>({phase,round,id:cur&&cur.id})};
})();
