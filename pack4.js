// Pack 4 — games 39-50
(()=>{const reg=MG.reg;const TAU=Math.PI*2;

// 39. 光の反射
const LCo=6,LRo=8,LCS=96;
function lzGen(s,g){for(let tr=0;tr<400;tr++){const m=new Map(),vis=new Set();let r=g.ri(1,LRo-2),c=0,dx=1,dy=0,steps=0,mir=0;const sr=r;
  while(c>=0&&c<LCo&&r>=0&&r<LRo){const k=r*LCo+c;if(vis.has(k)){steps=-1;break}vis.add(k);steps++;
   if(steps>1&&Math.random()<.4){const tl=Math.random()<.5;let nx,ny;if(dx){nx=0;ny=tl?-1:1}else{ny=0;nx=tl?-1:1}m.set(k,(nx===-dy&&ny===-dx)?'/':'\\');mir++;dx=nx;dy=ny}r+=dy;c+=dx}
  if(steps<7||mir<3||(c<0&&r===sr))continue;
  s.sr=sr;s.exit={r,c};s.mir=new Map();for(const[k,o]of m)s.mir.set(k,o);let dec=0;while(dec<3){const k=g.ri(0,LCo*LRo-1);if(!vis.has(k)&&!s.mir.has(k)){s.mir.set(k,g.pick(['/','\\']));dec++}}
  for(const k of s.mir.keys())s.mir.set(k,g.pick(['/','\\']));if(lzTrace(s).ok)for(const k of m.keys()){s.mir.set(k,m.get(k)==='/'?'\\':'/');break}
  s.rot=new Map();for(const k of s.mir.keys())s.rot.set(k,s.mir.get(k)==='/'?-.785:.785);return}
 s.sr=3;s.exit={r:3,c:LCo};s.mir=new Map();s.rot=new Map()}
function lzTrace(s){let r=s.sr,c=0,dx=1,dy=0;const pts=[[-.5,r+.5-0]];pts[0]=[-.6,r];for(let i=0;i<200;i++){if(c<0||c>=LCo||r<0||r>=LRo){pts.push([c,r]);return{pts,ok:r===s.exit.r&&c===s.exit.c,end:[c,r]}}
  const o=s.mir.get(r*LCo+c);if(o){pts.push([c,r]);if(o==='/'){const t=dx;dx=-dy;dy=-t}else{const t=dx;dx=dy;dy=t}}r+=dy;c+=dx}return{pts,ok:false,end:[c,r]}}
reg({id:'laser',name:'ミラーラボ',genre:'光の反射',color:'#ff6f59',time:60,goal:300,
howto:'鏡をタップして向きを変える\nレーザーを光る結晶まで届けよう',
init(g){const s={done:0,n:0};lzGen(s,g);return s},
update(s,g,dt){const{I}=g,ox=(g.W-LCo*LCS)/2,oy=140;for(const[k,o]of s.mir){const tg=o==='/'?-.785:.785;s.rot.set(k,s.rot.get(k)+(tg-s.rot.get(k))*Math.min(1,dt*14))}
 if(s.done>0){s.done-=dt;if(s.done<=0){lzGen(s,g)}return}
 if(I.pressed){const c=Math.floor((I.x-ox)/LCS),r=Math.floor((I.y-oy)/LCS),k=r*LCo+c;if(c>=0&&c<LCo&&r>=0&&r<LRo&&s.mir.has(k)){s.mir.set(k,s.mir.get(k)==='/'?'\\':'/');g.tone(880,.04,'sine',.12);
  if(lzTrace(s).ok){s.n++;g.add(100,g.W/2,g.H/2);g.float('照射成功！',g.W/2,g.H/2-60,'#ffe28a',46);g.sfx('win');const ex=ox+(s.exit.c+.5)*LCS,ey=oy+(s.exit.r+.5)*LCS;g.burst(ex,ey,'#ff9ad5',40,400,5,0);s.done=1.2}}}},
draw(s,g,c){const{W}=g,ox=(W-LCo*LCS)/2,oy=140,t=g.time;g.bg('#0b0f1a','#141a2c');
 for(let r=0;r<LRo;r++)for(let cc=0;cc<LCo;cc++){g.rrf(ox+cc*LCS+3,oy+r*LCS+3,LCS-6,LCS-6,10,(r+cc)%2?'#1a2236':'#1d263c')}
 const sx=ox-30,sy=oy+(s.sr+.5)*LCS;g.rrf(sx-30,sy-26,50,52,10,'#5a6480');g.glow('#ff3b3b',20);g.circle(sx+12,sy,10,'#ff6f59');g.noglow();
 const ex=ox+(s.exit.c+.5)*LCS,ey=oy+(s.exit.r+.5)*LCS;c.save();c.translate(ex,ey);c.rotate(t);g.glow('#ff9ad5',30);g.poly(0,0,24,6,0);c.fillStyle='#ffc6e6';c.fill();g.noglow();c.restore();
 const tr=lzTrace(s),P=tr.pts.map(([x,y])=>[ox+(x+.5)*LCS,oy+(y+.5)*LCS]);P[0]=[sx+12,sy];c.globalCompositeOperation='lighter';c.lineJoin='round';
 for(const[w,col]of[[16,'rgba(255,60,60,.25)'],[6,'rgba(255,90,90,.9)'],[2,'#ffffff']]){c.strokeStyle=col;c.lineWidth=w;c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()}
 const e=P[P.length-1];g.circle(e[0],e[1],10+Math.sin(t*20)*3,'rgba(255,200,200,.6)');c.globalCompositeOperation='source-over';
 for(const[k]of s.mir){const r=Math.floor(k/LCo),cc=k%LCo,x=ox+(cc+.5)*LCS,y=oy+(r+.5)*LCS;g.circle(x,y,30,'rgba(255,255,255,.06)');c.save();c.translate(x,y);c.rotate(s.rot.get(k));const mg=c.createLinearGradient(-36,0,36,0);mg.addColorStop(0,'#8a94b0');mg.addColorStop(.5,'#f4f8ff');mg.addColorStop(1,'#8a94b0');g.glow('#9fe8ff',12);g.rrf(-38,-6,76,12,6,mg);g.noglow();c.restore()}
 g.txt('成功 '+s.n,W/2,110,22,'rgba(255,255,255,.65)')}});

// 40. 陣取り
const PGX=36,PGY=42,PCS=20,POY=100,PCOL=['','#ff6f59','#2ec4b6','#a98bff'];
reg({id:'paint',name:'ぬりぬり陣取り',genre:'陣取り',color:'#ff6f59',time:40,goal:450,endMsg:'塗り合い終了！',
howto:'ドラッグでローラーを動かして色を塗る\n終了時に塗った広さが得点',
init(g){return{cells:new Uint8Array(PGX*PGY),me:{x:g.W/2,y:POY+PGY*PCS/2},bots:[{x:80,y:POY+60,tx:0,ty:0,t:0,id:2},{x:g.W-80,y:POY+PGY*PCS-60,tx:0,ty:0,t:0,id:3}],cnt:[0,0,0,0]}},
update(s,g,dt){const{I,W}=g;const paint=(x,y,id,rad)=>{const cx=Math.floor(x/PCS),cy=Math.floor((y-POY)/PCS);for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){if(dx*dx+dy*dy>rad*rad+1)continue;const X=cx+dx,Y=cy+dy;if(X>=0&&X<PGX&&Y>=0&&Y<PGY)s.cells[Y*PGX+X]=id}};
 const mv=(o,tx,ty,sp)=>{const dx=tx-o.x,dy=ty-o.y,l=Math.hypot(dx,dy),m=Math.min(l,sp*dt);if(l>.5){o.x+=dx/l*m;o.y+=dy/l*m;o.a=Math.atan2(dy,dx)}};
 let tx=s.me.x,ty=s.me.y;if(I.down){tx=I.x;ty=I.y}const k=I.keys;if(k.ArrowLeft)tx-=999;if(k.ArrowRight)tx+=999;if(k.ArrowUp)ty-=999;if(k.ArrowDown)ty+=999;mv(s.me,tx,ty,520);s.me.x=g.clamp(s.me.x,10,W-10);s.me.y=g.clamp(s.me.y,POY+10,POY+PGY*PCS-10);paint(s.me.x,s.me.y,1,3);
 for(const b of s.bots){b.t-=dt;if(b.t<=0){b.t=g.rnd(.6,1.2);let best=null,bd=1e9;for(let i=0;i<14;i++){const X=g.ri(1,PGX-2),Y=g.ri(1,PGY-2);if(s.cells[Y*PGX+X]===b.id)continue;const d=g.dist(b.x,b.y,X*PCS,POY+Y*PCS)+(s.cells[Y*PGX+X]===1?-120:0);if(d<bd){bd=d;best=[X*PCS+10,POY+Y*PCS+10]}}if(best){b.tx=best[0];b.ty=best[1]}}
  mv(b,b.tx,b.ty,300+g.time*3);paint(b.x,b.y,b.id,2)}
 const cnt=[0,0,0,0];for(let i=0;i<s.cells.length;i++)cnt[s.cells[i]]++;s.cnt=cnt;g.score=Math.round(cnt[1]/s.cells.length*1000)},
draw(s,g,c){const{W,H}=g;g.bg('#fbf7ef','#efe6d6');c.strokeStyle='rgba(120,100,70,.08)';c.lineWidth=1;for(let x=0;x<=PGX;x+=2){c.beginPath();c.moveTo(x*PCS,POY);c.lineTo(x*PCS,POY+PGY*PCS);c.stroke()}
 for(let i=0;i<s.cells.length;i++){const v=s.cells[i];if(!v)continue;c.fillStyle=PCOL[v];c.fillRect((i%PGX)*PCS,POY+Math.floor(i/PGX)*PCS,PCS+.5,PCS+.5)}
 const roller=(o,col)=>{c.save();c.translate(o.x,o.y);c.rotate((o.a||0)+Math.PI/2);c.fillStyle='rgba(0,0,0,.2)';g.rr(-34,-8,68,24,10);c.fill();g.rrf(-34,-12,68,24,10,g.shade(col,-.2));g.rrf(-30,-9,60,8,4,'rgba(255,255,255,.4)');c.strokeStyle='#2a2430';c.lineWidth=5;c.beginPath();c.moveTo(0,12);c.lineTo(0,40);c.stroke();g.circle(0,44,8,col);c.restore()};
 for(const b of s.bots)roller(b,PCOL[b.id]);roller(s.me,PCOL[1]);
 const tot=s.cells.length;let x=20;const bw=W-40;g.rrf(20,POY-24,bw,14,7,'rgba(0,0,0,.1)');for(const id of[1,2,3]){const w=bw*s.cnt[id]/tot;c.fillStyle=PCOL[id];c.fillRect(x,POY-24,w,14);x+=w}
 g.txt('あなた '+Math.round(s.cnt[1]/tot*100)+'%',20,H-20,22,'#ff6f59','left');g.txt('CPU '+Math.round(s.cnt[2]/tot*100)+'% / '+Math.round(s.cnt[3]/tot*100)+'%',W-20,H-20,20,'#6a5a8a','right')}});

// 41. 金魚すくい
function gfish(g,W,H){const k=Math.random()<.18?1:Math.random()<.25?2:0;return{x:g.rnd(80,W-80),y:g.rnd(200,H-220),a:g.rnd(TAU),sp:k===1?60:g.rnd(70,110),k,ph:g.rnd(TAU),sz:k===1?26:g.rnd(18,24)}}
reg({id:'kingyo',name:'きんぎょすくい',genre:'金魚すくい',color:'#ff6f59',time:40,goal:220,
howto:'押している間ポイが水に入る\n金魚の下で指を離すとすくえる。長く浸けると破れる',
init(g){return{f:Array.from({length:11},()=>gfish(g,g.W,g.H)),poi:{x:g.W/2,y:g.H/2,dur:1,torn:0,in:false},bowl:[],pois:1,t:0}},
update(s,g,dt){const{W,H,I}=g,p=s.poi;s.t+=dt;
 if(p.torn>0){p.torn-=dt;if(p.torn<=0){p.dur=1;s.pois++;g.float('新しいポイ',W/2,H/2,'#ffffff',32)}}
 const px=p.x,py=p.y;if(I.down||I.x!==I.px){p.x+=(I.x-p.x)*Math.min(1,dt*14);p.y+=(I.y-p.y)*Math.min(1,dt*14)}const spd=g.dist(px,py,p.x,p.y)/Math.max(dt,.001);
 p.in=I.down&&p.torn<=0&&p.y>150;if(p.in){p.dur-=dt*(.22+spd/1600);if(p.dur<=0){p.torn=1.3;g.sfx('bad');g.float('やぶれた！',p.x,p.y-60,'#ff6f59',34);g.burst(p.x,p.y,'#ffffff',16,200,3)}}
 if(I.released&&p.torn<=0&&p.y>150){const got=s.f.filter(f=>g.dist(f.x,f.y,p.x,p.y)<58);if(got.length){p.dur-=got.length*.12;if(p.dur<=0){p.torn=1.3;g.sfx('bad');g.float('重くてやぶれた！',p.x,p.y-60,'#ff6f59',30)}else{for(const f of got){const v=f.k===1?30:f.k===2?20:10;g.add(v,f.x,f.y-30,f.k===1?'#ffffff':'#ffe28a');g.burst(f.x,f.y,'#9fe8ff',12,200,3);s.bowl.push(f.k);Object.assign(f,gfish(g,W,H),{x:g.rnd()<.5?40:W-40})}g.sfx('coin')}}else g.noise(.1,.1,0,1500)}
 for(const f of s.f){f.ph+=dt*8;if(p.in&&g.dist(f.x,f.y,p.x,p.y)<140&&spd>120){const a=Math.atan2(f.y-p.y,f.x-p.x);f.a+=Math.sin(a-f.a)*dt*6}else f.a+=g.rnd(-1,1)*dt*2.5;
  f.x+=Math.cos(f.a)*f.sp*dt;f.y+=Math.sin(f.a)*f.sp*dt;if(f.x<60||f.x>W-60)f.a=Math.PI-f.a;if(f.y<190||f.y>H-200)f.a=-f.a;f.x=g.clamp(f.x,60,W-60);f.y=g.clamp(f.y,190,H-200)}},
draw(s,g,c){const{W,H}=g,p=s.poi,t=s.t;g.bg('#ffe8c8','#ffd2a0');for(let i=0;i<8;i++){g.circle(60+i*90,110,14,i%2?'#ff6f59':'#ffffff');c.strokeStyle='#6b4a2a';c.lineWidth=2;c.beginPath();c.moveTo(i*90+20,96);c.lineTo(i*90+110,96);c.stroke()}
 g.rrf(30,150,W-60,H-310,40,'#4fb8e8');const wg=c.createLinearGradient(0,170,0,H-170);wg.addColorStop(0,'#7fd6ff');wg.addColorStop(1,'#1d7fbf');g.rrf(44,164,W-88,H-338,32,wg);
 c.save();g.rr(44,164,W-88,H-338,32);c.clip();c.globalCompositeOperation='lighter';c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=3;for(let k=0;k<14;k++){c.beginPath();for(let x=44;x<W-44;x+=14){const y=190+k*44+Math.sin(x*.03+t*2+k)*10+Math.sin(x*.07-t*3)*4;x===44?c.moveTo(x,y):c.lineTo(x,y)}c.stroke()}c.globalCompositeOperation='source-over';
 for(const f of s.f){c.save();c.translate(f.x,f.y);c.rotate(f.a);const z=f.sz,col=f.k===1?'#1b1b24':f.k===2?'#ffffff':'#ff5a2a',wv=Math.sin(f.ph)*.5;c.fillStyle='rgba(0,0,40,.15)';c.beginPath();c.ellipse(4,8,z,z*.5,0,0,TAU);c.fill();
  c.fillStyle=f.k===1?'rgba(40,40,60,.75)':'rgba(255,120,80,.7)';c.beginPath();c.moveTo(-z*.7,0);c.quadraticCurveTo(-z*1.6,-z*.9+wv*z,-z*2,-z*.5+wv*z);c.quadraticCurveTo(-z*1.5,0,-z*2,z*.5+wv*z);c.quadraticCurveTo(-z*1.6,z*.9+wv*z,-z*.7,0);c.fill();
  c.fillStyle=col;c.beginPath();c.ellipse(0,0,z,z*.55,0,0,TAU);c.fill();if(f.k===2){g.circle(-z*.2,-z*.1,z*.3,'#ff5a2a');g.circle(z*.4,z*.15,z*.2,'#1b1b24')}
  if(f.k===1){g.circle(z*.6,-z*.45,z*.3,'#2a2a34');g.circle(z*.6,z*.45,z*.3,'#2a2a34')}else{g.circle(z*.6,-z*.25,z*.12,'#1b1220');g.circle(z*.6,z*.25,z*.12,'#1b1220')}c.restore()}
 c.restore();
 const torn=p.torn>0,a=p.in?.85:1;c.globalAlpha=a;c.strokeStyle='#ff7ab6';c.lineWidth=8;c.beginPath();c.moveTo(p.x+50,p.y+20);c.lineTo(p.x+120,p.y+90);c.stroke();g.circle(p.x,p.y,56,'#ff7ab6');
 const wet=1-p.dur;g.circle(p.x,p.y,48,torn?'rgba(255,255,255,.08)':'rgba(255,255,255,'+(.85-wet*.5)+')');if(torn||p.dur<.4){c.strokeStyle='rgba(120,120,140,.7)';c.lineWidth=2;c.beginPath();c.moveTo(p.x-30,p.y-10);c.lineTo(p.x,p.y+6);c.lineTo(p.x+24,p.y-18);c.stroke()}c.globalAlpha=1;
 if(!torn){g.rrf(p.x-40,p.y+66,80,8,4,'rgba(0,0,0,.2)');g.rrf(p.x-40,p.y+66,80*p.dur,8,4,p.dur<.3?'#ff6f59':'#2ec4b6')}
 g.rrf(W/2-140,H-140,280,110,50,'rgba(220,240,255,.55)');s.bowl.slice(-10).forEach((k,i)=>g.circle(W/2-110+i*24,H-86+Math.sin(t*3+i)*6,9,k===1?'#1b1b24':k===2?'#ffffff':'#ff5a2a'));g.txt('すくった '+s.bowl.length+'匹　ポイ '+s.pois+'枚目',W/2,H-16,18,'#6b4a2a')}});

// 42. チキンレース
const BCOL=['#ff6f59','#5b8cff','#ffc857','#9be15d','#ff7ab6','#a98bff'];
function newBalloon(g){return{s:0,lim:g.rnd(.4,1),col:g.pick(BCOL),pop:0}}
reg({id:'balloon',name:'ふうせんチキン',genre:'チキンレース',color:'#ff7ab6',time:40,goal:320,
howto:'押している間ふくらむ。離すと得点\n大きいほど高得点・割れたら0点',
init(g){return{b:newBalloon(g),fly:[],sq:0,pump:0,wait:0}},
update(s,g,dt){const{I,W}=g,b=s.b;for(const f of s.fly){f.y-=f.v*dt;f.x+=Math.sin(f.y*.02)*30*dt}s.fly=s.fly.filter(f=>f.y>-200);
 if(s.wait>0){s.wait-=dt;if(s.wait<=0)s.b=newBalloon(g);return}
 const hold=I.down||I.keys[' '];if(hold){b.s+=dt*(.28+b.s*.25);s.pump+=dt*10;s.sq-=dt;if(s.sq<=0){s.sq=.09;g.tone(300+b.s*900,.05,'sine',.08)}
  if(b.s>b.lim){g.sfx('boom');g.shake(20);g.flash('#ffffff',.4);g.burst(W/2,440,b.col,60,600,7);g.float('パーン！',W/2,420,'#ffffff',60);s.wait=.7}}
 else if(b.s>.05&&(I.released||!hold)){const p=Math.round(120*b.s*b.s);g.add(p,W/2,300,'#ffe28a');g.sfx(p>60?'win':'coin');s.fly.push({x:W/2,y:440,r:30+b.s*220,col:b.col,v:200});s.b=newBalloon(g)}},
draw(s,g,c){const{W,H}=g,b=s.b,t=g.time;for(let i=0;i<12;i++){c.fillStyle=i%2?'#c9283e':'#fff1df';c.fillRect(i*60,0,60,H)}const vg=c.createLinearGradient(0,0,0,H);vg.addColorStop(0,'rgba(30,10,30,.55)');vg.addColorStop(1,'rgba(30,10,30,.15)');c.fillStyle=vg;c.fillRect(0,0,W,H);
 for(const f of s.fly){c.globalAlpha=.6;g.circle(f.x,f.y,f.r*.4,f.col);c.globalAlpha=1}
 const R=30+b.s*230,j=b.s>b.lim-.08&&s.wait<=0?Math.sin(t*60)*3:0,cx=W/2+j,cy=470-R*.45;
 if(s.wait<=0){c.strokeStyle='rgba(60,40,40,.7)';c.lineWidth=2;c.beginPath();c.moveTo(cx,cy+R*1.08);c.quadraticCurveTo(cx+20,cy+R*1.08+60,W/2,760);c.stroke();
  const bg=c.createRadialGradient(cx-R*.35,cy-R*.4,R*.08,cx,cy,R*1.1);bg.addColorStop(0,g.shade(b.col,.55));bg.addColorStop(.6,b.col);bg.addColorStop(1,g.shade(b.col,-.35));c.fillStyle=bg;c.beginPath();c.ellipse(cx,cy,R*.92,R*1.05,0,0,TAU);c.fill();
  c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.ellipse(cx-R*.35,cy-R*.45,R*.16,R*.28,-.5,0,TAU);c.fill();c.fillStyle=g.shade(b.col,-.3);c.beginPath();c.moveTo(cx-10,cy+R*1.05+10);c.lineTo(cx+10,cy+R*1.05+10);c.lineTo(cx,cy+R*1.02);c.fill()}
 const py=760+Math.abs(Math.sin(s.pump))*30;g.rrf(W/2-50,760,100,150,14,'#3a3a48');g.rrf(W/2-44,770,88,130,10,'#5b6178');c.fillStyle='#c8ccd8';c.fillRect(W/2-6,py-90,12,90);g.rrf(W/2-60,py-104,120,22,10,'#ff6f59');
 g.rrf(W-70,200,26,500,13,'rgba(0,0,0,.35)');g.rrf(W-70,200+500*(1-Math.min(1,b.s)),26,500*Math.min(1,b.s),13,g.mix('#9be15d','#ff6f59',Math.min(1,b.s)));g.txt('?',W-57,180,26,'#ffffff','center',g.FD,400);
 g.txt('いま '+Math.round(120*b.s*b.s)+'点',W/2,140,32,'#ffffff','center',g.FD,400)}});

// 43. 倉庫番
const SOKO=[["######","#    #","# $  #","# .@ #","######"],["#######","#  .  #","#  $  #","#  @  #","#  $  #","#  .  #","#######"],["########","#      #","# $  $ #","#  ##  #","# .  . #","#  @   #","########"],["#######","#.    #","# $## #","#  $ .#","#  @  #","#######"],["#######","#     #","# $.$ #","#  @  #","# .   #","#######"]];
function skLoad(s,g){const L=SOKO[s.lv%SOKO.length];s.walls=new Set();s.goals=[];s.boxes=[];s.rows=L.length;s.cols=Math.max(...L.map(r=>r.length));
 L.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==='#')s.walls.add(x+','+y);if(ch==='.'||ch==='*'||ch==='+')s.goals.push({x,y});if(ch==='$'||ch==='*')s.boxes.push({x,y,dx:x,dy:y});if(ch==='@'||ch==='+'){s.px=x;s.py=y}}));
 s.cs=Math.min(96,(g.W-60)/s.cols,600/s.rows);s.ox=(g.W-s.cs*s.cols)/2;s.oy=150+(620-s.cs*s.rows)/2;s.moves=0;s.hist=[];s.done=0;s.dpx=s.px;s.dpy=s.py}
reg({id:'sokoban',name:'にもつ番',genre:'倉庫番',color:'#ff9f43',time:60,goal:300,levels:SOKO,
howto:'スワイプか矢印で動いて荷物を押す\n全部の荷物を光る場所へ運ぼう',
init(g){const s={lv:0};skLoad(s,g);return s},
update(s,g,dt){const{I,W}=g;s.dpx+=(s.px-s.dpx)*Math.min(1,dt*18);s.dpy+=(s.py-s.dpy)*Math.min(1,dt*18);for(const b of s.boxes){b.dx+=(b.x-b.dx)*Math.min(1,dt*18);b.dy+=(b.y-b.dy)*Math.min(1,dt*18)}
 if(s.done>0){s.done-=dt;if(s.done<=0){s.lv++;skLoad(s,g)}return}
 if(I.pressed&&I.y>860){if(I.x<W/2){if(s.hist.length){const h=s.hist.pop();s.px=h.px;s.py=h.py;h.b.forEach((p,i)=>{s.boxes[i].x=p[0];s.boxes[i].y=p[1]});s.moves++;g.tone(300,.05,'sine',.1)}}else{skLoad(s,g);g.tone(250,.08,'sine',.1)}return}
 let dx=0,dy=0;const k=I.kp;if(k.ArrowLeft)dx=-1;else if(k.ArrowRight)dx=1;else if(k.ArrowUp)dy=-1;else if(k.ArrowDown)dy=1;
 else if(I.swipe){if(Math.abs(I.swipe.dx)>Math.abs(I.swipe.dy))dx=Math.sign(I.swipe.dx);else dy=Math.sign(I.swipe.dy)}
 else if(I.released&&g.dist(I.x,I.y,I.sx,I.sy)<30&&I.y<860){const ax=I.x-(s.ox+(s.px+.5)*s.cs),ay=I.y-(s.oy+(s.py+.5)*s.cs);if(Math.max(Math.abs(ax),Math.abs(ay))>s.cs*.4){if(Math.abs(ax)>Math.abs(ay))dx=Math.sign(ax);else dy=Math.sign(ay)}}
 if(!dx&&!dy)return;const nx=s.px+dx,ny=s.py+dy;if(s.walls.has(nx+','+ny))return;const bx=s.boxes.find(b=>b.x===nx&&b.y===ny);
 if(bx){const tx=nx+dx,ty=ny+dy;if(s.walls.has(tx+','+ty)||s.boxes.some(b=>b.x===tx&&b.y===ty))return;s.hist.push({px:s.px,py:s.py,b:s.boxes.map(b=>[b.x,b.y])});bx.x=tx;bx.y=ty;g.tone(180,.06,'square',.1)}else s.hist.push({px:s.px,py:s.py,b:s.boxes.map(b=>[b.x,b.y])});
 s.px=nx;s.py=ny;s.moves++;
 if(s.boxes.every(b=>s.goals.some(q=>q.x===b.x&&q.y===b.y))){const p=Math.max(50,180-s.moves*3);g.add(p,W/2,s.oy-30);g.float('ステージクリア！',W/2,480,'#ffe28a',44);g.sfx('win');s.done=1.2}},
draw(s,g,c){const{W,H}=g,cs=s.cs,ox=s.ox,oy=s.oy;g.bg('#2a1d14','#150e0a');
 for(let y=0;y<s.rows;y++)for(let x=0;x<s.cols;x++){const X=ox+x*cs,Y=oy+y*cs;if(s.walls.has(x+','+y)){g.rrf(X,Y,cs,cs,4,'#8a4a32');c.fillStyle='rgba(0,0,0,.25)';c.fillRect(X,Y+cs/2-1,cs,2);c.fillRect(X+cs/2-1,Y,2,cs/2);c.fillRect(X+cs/4,Y+cs/2,2,cs/2);c.fillStyle='rgba(255,255,255,.12)';c.fillRect(X,Y,cs,3)}else{c.fillStyle=(x+y)%2?'#c8a070':'#bf966a';c.fillRect(X,Y,cs,cs)}}
 for(const q of s.goals){const X=ox+(q.x+.5)*cs,Y=oy+(q.y+.5)*cs;g.glow('#ffe28a',16);c.strokeStyle='#ffe28a';c.lineWidth=4;c.beginPath();c.arc(X,Y,cs*.25,0,TAU);c.stroke();g.noglow()}
 for(const b of s.boxes){const on=s.goals.some(q=>q.x===b.x&&q.y===b.y),X=ox+b.dx*cs,Y=oy+b.dy*cs,m=cs*.08;if(on)g.glow('#ffc857',18);g.rrf(X+m,Y+m,cs-2*m,cs-2*m,6,on?'#ffc857':'#a86a34');g.noglow();c.strokeStyle=on?'#a86a10':'#6b3e18';c.lineWidth=4;c.strokeRect(X+m*2,Y+m*2,cs-4*m,cs-4*m);c.beginPath();c.moveTo(X+m*2,Y+m*2);c.lineTo(X+cs-m*2,Y+cs-m*2);c.moveTo(X+cs-m*2,Y+m*2);c.lineTo(X+m*2,Y+cs-m*2);c.stroke()}
 const PX=ox+(s.dpx+.5)*cs,PY=oy+(s.dpy+.5)*cs;g.circle(PX,PY+cs*.12,cs*.3,'#2e7fd8');g.circle(PX,PY-cs*.15,cs*.22,'#f3d0a8');g.rrf(PX-cs*.24,PY-cs*.4,cs*.48,cs*.14,cs*.06,'#ffc857');g.circle(PX-cs*.07,PY-cs*.15,2.5,'#1b1220');g.circle(PX+cs*.07,PY-cs*.15,2.5,'#1b1220');
 g.txt('ステージ '+(s.lv%SOKO.length+1)+' / '+SOKO.length+'　手数 '+s.moves,W/2,116,22,'rgba(255,255,255,.75)');
 g.rrf(40,870,W/2-60,70,20,'#4a3a2a');g.txt('1手もどす',W/4+10,905,24,'#ffe0b0');g.rrf(W/2+20,870,W/2-60,70,20,'#4a3a2a');g.txt('やり直す',W*3/4-10,905,24,'#ffe0b0')}});

// 44. タワーディフェンス
const TDP=[[80,120],[640,120],[640,330],[80,330],[80,540],[640,540],[640,750],[360,750],[360,900]],PADS=[];for(const y of[225,435,645])for(const x of[200,360,520])PADS.push({x,y});
const tdLen=(()=>{let l=0;for(let i=1;i<TDP.length;i++)l+=Math.hypot(TDP[i][0]-TDP[i-1][0],TDP[i][1]-TDP[i-1][1]);return l})();
function tdPos(d){for(let i=1;i<TDP.length;i++){const[x1,y1]=TDP[i-1],[x2,y2]=TDP[i],l=Math.hypot(x2-x1,y2-y1);if(d<=l)return[x1+(x2-x1)*d/l,y1+(y2-y1)*d/l];d-=l}return TDP[TDP.length-1]}
reg({id:'td',name:'まもれ！おしろ',genre:'タワーディフェンス',color:'#9be15d',time:50,goal:400,endMsg:'お城を守りきった！',
howto:'石の台をタップして砲台を建てる（30コイン）\nもう一度タップで強化。お城を守ろう',
init(){return{coins:70,hp:5,en:[],tw:PADS.map(p=>({...p,lv:0,cd:0,ang:-Math.PI/2})),bul:[],spawn:1.2}},
update(s,g,dt){const{I}=g;
 if(I.pressed){for(const t of s.tw){if(g.dist(I.x,I.y,t.x,t.y)<46){const cost=[30,40,60][t.lv];if(t.lv>=3)g.float('最大レベル',t.x,t.y-50,'#ffffff',22);else if(s.coins>=cost){s.coins-=cost;t.lv++;g.sfx('good');g.burst(t.x,t.y,'#ffe28a',14,200,4)}else{g.float('コイン不足',t.x,t.y-50,'#ff6f59',22);g.tone(200,.1,'sine',.1)}break}}}
 s.spawn-=dt;if(s.spawn<=0){s.spawn=Math.max(.45,1.2-g.time*.015);const hp=3+g.time*.28;s.en.push({d:0,hp,max:hp,sp:g.rnd(65,90)+g.time*.8,ph:g.rnd(TAU)})}
 for(const e of s.en){e.d+=e.sp*dt;if(e.d>=tdLen){e.dead=1;s.hp--;g.shake(12);g.sfx('bad');g.flash('#ff6f59',.3);if(s.hp<=0){g.over('お城が落ちた！');return}}}
 for(const t of s.tw){if(!t.lv)continue;t.cd-=dt;const rng=[0,150,175,200][t.lv];let tg=null,bd=-1;for(const e of s.en){if(e.dead)continue;const[x,y]=tdPos(e.d);if(g.dist(x,y,t.x,t.y)<rng&&e.d>bd){bd=e.d;tg=e}}
  if(tg){const[x,y]=tdPos(tg.d);t.ang=Math.atan2(y-t.y,x-t.x);if(t.cd<=0){t.cd=[0,.55,.4,.28][t.lv];s.bul.push({x:t.x+Math.cos(t.ang)*30,y:t.y+Math.sin(t.ang)*30,tg,dmg:t.lv});g.tone(700,.03,'square',.05)}}}
 for(const b of s.bul){if(b.tg.dead){b.dead=1;continue}const[x,y]=tdPos(b.tg.d),dx=x-b.x,dy=y-b.y,l=Math.hypot(dx,dy);if(l<14){b.dead=1;b.tg.hp-=b.dmg;if(b.tg.hp<=0&&!b.tg.dead){b.tg.dead=1;s.coins+=6;g.add(10,x,y-30);g.burst(x,y,'#9be15d',14,220,4);g.tone(500,.06,'triangle',.12)}}else{b.x+=dx/l*650*dt;b.y+=dy/l*650*dt}}
 s.en=s.en.filter(e=>!e.dead);s.bul=s.bul.filter(b=>!b.dead)},
draw(s,g,c){const{W,H}=g,t=g.time;g.bg('#7cc35a','#4f9a3c');c.fillStyle='rgba(40,90,30,.2)';for(let i=0;i<80;i++){const x=(i*97)%W,y=90+(i*173)%(H-90);c.beginPath();c.moveTo(x,y);c.lineTo(x+4,y-10);c.lineTo(x+8,y);c.fill()}
 c.lineCap='round';c.lineJoin='round';for(const[w,col]of[[64,'#a07a4a'],[52,'#d9b27a']]){c.strokeStyle=col;c.lineWidth=w;c.beginPath();TDP.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke()}
 const cx=360,cy=900;g.rrf(cx-70,cy-50,140,70,6,'#d8d2c6');for(const dx of[-70,50]){g.rrf(cx+dx,cy-90,20,110,4,'#c8c0b0');g.rrf(cx+dx-4,cy-100,28,14,3,'#8a4a32')}g.rrf(cx-18,cy-20,36,40,18,'#5a3a24');c.strokeStyle='#6b4a2a';c.lineWidth=3;c.beginPath();c.moveTo(cx,cy-50);c.lineTo(cx,cy-110);c.stroke();c.fillStyle='#ff6f59';c.beginPath();c.moveTo(cx,cy-110);c.lineTo(cx+30+Math.sin(t*6)*4,cy-100);c.lineTo(cx,cy-90);c.fill();
 for(let i=0;i<5;i++)g.txt('♥',cx-48+i*24,cy+40,20,i<s.hp?'#ff3b5b':'rgba(0,0,0,.25)');
 for(const tw of s.tw){c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(tw.x+3,tw.y+8,42,16,0,0,TAU);c.fill();g.circle(tw.x,tw.y,40,'#9a9aa8');g.circle(tw.x,tw.y,32,'#b8b8c6');
  if(!tw.lv){g.txt('+',tw.x,tw.y+2,34,'rgba(60,60,80,.6)');g.txt('30',tw.x,tw.y+28,14,'rgba(60,60,80,.6)');continue}
  const col=['','#5b8cff','#a98bff','#ffc857'][tw.lv];c.save();c.translate(tw.x,tw.y);c.rotate(tw.ang);g.rrf(0,-8,38,16,6,'#3a3a48');c.restore();g.circle(tw.x,tw.y,22,col);g.circle(tw.x-6,tw.y-6,6,'rgba(255,255,255,.5)');for(let k=0;k<tw.lv;k++){g.star(tw.x-14+k*14,tw.y+44,6,2.5);c.fillStyle='#ffe28a';c.fill()}}
 c.globalCompositeOperation='lighter';for(const b of s.bul)g.circle(b.x,b.y,6,'#fff1a8');c.globalCompositeOperation='source-over';
 for(const e of s.en){const[x,y]=tdPos(e.d),bob=Math.abs(Math.sin(t*8+e.ph))*6,col=e.max>12?'#a98bff':e.max>7?'#ff9f43':'#5fd16a';c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(x,y+14,20,6,0,0,TAU);c.fill();
  c.fillStyle=col;c.beginPath();c.ellipse(x,y-bob,22,18+bob*.4,0,0,TAU);c.fill();g.circle(x-7,y-4-bob,4,'#ffffff');g.circle(x+7,y-4-bob,4,'#ffffff');g.circle(x-7,y-4-bob,2,'#1b1220');g.circle(x+7,y-4-bob,2,'#1b1220');
  g.rrf(x-20,y-36-bob,40,6,3,'rgba(0,0,0,.35)');g.rrf(x-20,y-36-bob,40*Math.max(0,e.hp/e.max),6,3,'#ff3b5b')}
 g.rrf(16,82,160,40,20,'rgba(0,0,0,.35)');g.circle(40,102,12,'#ffc857');g.txt(String(s.coins),60,103,24,'#ffe28a','left',g.FD,400)}});

// 45. ビリヤード
const BX1=80,BX2=640,BY1=150,BY2=870,BR=16,POC=[[BX1,BY1],[BX2,BY1],[BX1,(BY1+BY2)/2],[BX2,(BY1+BY2)/2],[BX1,BY2],[BX2,BY2]],BCL=['#ffd23f','#3a6bd8','#e63946','#7b3fa8','#ff8c2a','#2a9a4a'];
function racks(s){s.balls=[{x:360,y:740,vx:0,vy:0,k:-1}];let i=0;for(let r=0;r<3;r++)for(let c=0;c<=r;c++)s.balls.push({x:360+(c-r/2)*(BR*2+1),y:340-r*(BR*1.8),vx:0,vy:0,k:i++})}
reg({id:'billiards',name:'ナイトビリヤード',genre:'ビリヤード',color:'#2a9a4a',time:60,goal:240,
howto:'画面を引っぱって離すと白球を打つ\n色の球をポケットに落とそう',
init(){const s={aim:false};racks(s);return s},
update(s,g,dt){const{I}=g,cue=s.balls[0];const moving=s.balls.some(b=>Math.hypot(b.vx,b.vy)>6);
 if(!moving){if(cue.out){cue.out=false;cue.x=360;cue.y=740;cue.vx=cue.vy=0}if(I.pressed)s.aim=true;if(s.aim&&I.released){s.aim=false;const vx=(I.sx-I.x)*5,vy=(I.sy-I.y)*5,m=Math.hypot(vx,vy);if(m>50){const k=Math.min(1,1700/m);cue.vx=vx*k;cue.vy=vy*k;g.tone(240,.05,'square',.15)}}}else s.aim=false;
 const sub=4,h=dt/sub;for(let it=0;it<sub;it++){for(const b of s.balls){if(b.out)continue;b.x+=b.vx*h;b.y+=b.vy*h;const f=Math.max(0,1-h*.9);b.vx*=f;b.vy*=f;if(Math.hypot(b.vx,b.vy)<6){b.vx=b.vy=0}
   const nearP=POC.some(([px,py])=>g.dist(b.x,b.y,px,py)<42);if(!nearP){if(b.x<BX1+BR){b.x=BX1+BR;b.vx=Math.abs(b.vx)*.8}if(b.x>BX2-BR){b.x=BX2-BR;b.vx=-Math.abs(b.vx)*.8}if(b.y<BY1+BR){b.y=BY1+BR;b.vy=Math.abs(b.vy)*.8}if(b.y>BY2-BR){b.y=BY2-BR;b.vy=-Math.abs(b.vy)*.8}}
   for(const[px,py]of POC)if(g.dist(b.x,b.y,px,py)<26){b.out=true;b.vx=b.vy=0;if(b.k<0){g.add(-20,360,500);g.sfx('bad')}else{g.add(20,px,py-30,BCL[b.k]);g.sfx('coin');g.burst(px,py,BCL[b.k],16,220,4)}}
   if(!b.out&&(b.x<BX1-30||b.x>BX2+30||b.y<BY1-30||b.y>BY2+30)){b.out=true;b.vx=b.vy=0}}
  for(let i=0;i<s.balls.length;i++)for(let j=i+1;j<s.balls.length;j++){const a=s.balls[i],b=s.balls[j];if(a.out||b.out)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<BR*2&&d>0){const nx=dx/d,ny=dy/d,o=(BR*2-d)/2;a.x-=nx*o;a.y-=ny*o;b.x+=nx*o;b.y+=ny*o;const vr=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(vr<0){a.vx+=vr*nx*.96;a.vy+=vr*ny*.96;b.vx-=vr*nx*.96;b.vy-=vr*ny*.96;if(Math.abs(vr)>120)g.tone(900,.03,'sine',Math.min(.2,Math.abs(vr)/4000))}}}}
 if(s.balls.slice(1).every(b=>b.out)&&!moving){g.add(50,360,480);g.float('全部落とした！',360,480,'#ffe28a',44);g.sfx('win');racks(s)}},
draw(s,g,c){const{W,H,I}=g,cue=s.balls[0];g.bg('#1a0f08','#0a0604');
 const wg=c.createLinearGradient(0,BY1-50,0,BY2+50);wg.addColorStop(0,'#7a4522');wg.addColorStop(1,'#4a2810');g.rrf(BX1-46,BY1-46,BX2-BX1+92,BY2-BY1+92,28,wg);
 for(let i=1;i<4;i++){g.circle(BX1-24,BY1+(BY2-BY1)*i/4,4,'#f3e2c8');g.circle(BX2+24,BY1+(BY2-BY1)*i/4,4,'#f3e2c8')}for(let i=1;i<3;i++){g.circle(BX1+(BX2-BX1)*i/3,BY1-24,4,'#f3e2c8');g.circle(BX1+(BX2-BX1)*i/3,BY2+24,4,'#f3e2c8')}
 const fg=c.createRadialGradient(360,500,60,360,500,520);fg.addColorStop(0,'#2fae5a');fg.addColorStop(1,'#14572c');g.rrf(BX1-14,BY1-14,BX2-BX1+28,BY2-BY1+28,14,fg);
 for(const[px,py]of POC){g.circle(px,py,28,'#0a0a0a');g.circle(px,py,22,'#000000')}
 c.strokeStyle='rgba(255,255,255,.15)';c.lineWidth=2;c.beginPath();c.moveTo(BX1,740);c.lineTo(BX2,740);c.stroke();
 for(const b of s.balls){if(b.out)continue;c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.arc(b.x+3,b.y+5,BR,0,TAU);c.fill();const col=b.k<0?'#f4f1ea':BCL[b.k],bg=c.createRadialGradient(b.x-5,b.y-6,2,b.x,b.y,BR);bg.addColorStop(0,g.shade(col,.6));bg.addColorStop(1,g.shade(col,-.3));g.circle(b.x,b.y,BR,bg);
  if(b.k>=0){g.circle(b.x,b.y,7,'#ffffff');g.txt(String(b.k+1),b.x,b.y+1,10,'#1b1220')}}
 if(s.aim&&I.down&&!cue.out){const vx=I.sx-I.x,vy=I.sy-I.y,m=Math.min(1,Math.hypot(vx,vy)/340),a=Math.atan2(vy,vx);c.strokeStyle='rgba(255,255,255,.5)';c.setLineDash([8,10]);c.lineWidth=2;c.beginPath();c.moveTo(cue.x,cue.y);c.lineTo(cue.x+Math.cos(a)*420,cue.y+Math.sin(a)*420);c.stroke();c.setLineDash([]);
  const back=24+m*90;c.lineCap='round';c.strokeStyle='#d9a86a';c.lineWidth=10;c.beginPath();c.moveTo(cue.x-Math.cos(a)*back,cue.y-Math.sin(a)*back);c.lineTo(cue.x-Math.cos(a)*(back+340),cue.y-Math.sin(a)*(back+340));c.stroke();c.strokeStyle='#f4f1ea';c.lineWidth=10;c.beginPath();c.moveTo(cue.x-Math.cos(a)*back,cue.y-Math.sin(a)*back);c.lineTo(cue.x-Math.cos(a)*(back+14),cue.y-Math.sin(a)*(back+14));c.stroke()}
 g.txt('残り '+s.balls.slice(1).filter(b=>!b.out).length+'球',W/2,H-30,22,'rgba(255,255,255,.7)')}});

// 46. じゃんけん
const HANDS=['✊','✌️','✋'],HN=['グー','チョキ','パー'];
function jkNew(g,t){const r=Math.random();return{cpu:g.ri(0,2),ord:r<.45?0:r<.85?1:2,lim:Math.max(.9,2.2-t*.035),t:0,res:null,rt:0}}
reg({id:'janken',name:'じゃんけん指令',genre:'じゃんけん',color:'#ffc857',time:35,goal:300,
howto:'指令どおりの手をすばやくタップ\n「かて」「まけろ」「あいこ」に注意（1〜3キー可）',
init(g){return{q:jkNew(g,0),streak:0}},
update(s,g,dt){const{I,W}=g,q=s.q;if(q.res!==null){q.rt-=dt;if(q.rt<=0)s.q=jkNew(g,g.time);return}q.t+=dt;
 let pick=-1;if(I.pressed&&I.y>700)pick=g.clamp(Math.floor((I.x-30)/((W-60)/3)),0,2);for(let i=0;i<3;i++)if(I.kp[String(i+1)])pick=i;
 const ans=q.ord===0?(q.cpu+2)%3:q.ord===1?(q.cpu+1)%3:q.cpu;
 if(pick>=0){if(pick===ans){s.streak++;g.add(10+Math.round((q.lim-q.t)*10)+Math.min(10,s.streak),W/2,560);g.sfx('good');q.res=true}else{s.streak=0;g.add(-5,W/2,560);g.sfx('bad');g.shake(8);q.res=false}q.pick=pick;q.rt=.45}
 else if(q.t>q.lim){s.streak=0;g.add(-5,W/2,560);g.sfx('bad');q.res=false;q.pick=-1;q.rt=.45}},
draw(s,g,c){const{W}=g,q=s.q;g.bg('#fff0d6','#ffd6a0');for(let i=0;i<10;i++){c.fillStyle='rgba(255,111,89,.08)';c.beginPath();c.moveTo(W/2,380);c.arc(W/2,380,900,i*TAU/10+g.time*.1,i*TAU/10+TAU/20+g.time*.1);c.fill()}
 const oc=['#e63946','#3a6bd8','#e0a020'][q.ord];g.rrf(110,110,W-220,100,50,oc);g.txt(['かて！','まけろ！','あいこ！'][q.ord],W/2,162,58,'#ffffff','center',g.FD,400);
 c.fillStyle='rgba(120,60,20,.15)';c.beginPath();c.arc(W/2+6,400,150,0,TAU);c.fill();g.circle(W/2,394,150,'#ffffff');c.font='160px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(HANDS[q.cpu],W/2,404);g.txt('CPU：'+HN[q.cpu],W/2,580,26,'#6b4a2a');
 const r=q.res===null?Math.max(0,1-q.t/q.lim):0;g.rrf(80,620,W-160,16,8,'rgba(0,0,0,.12)');g.rrf(80,620,(W-160)*r,16,8,r<.3?'#e63946':'#2ec4b6');
 const bw=(W-60)/3;for(let i=0;i<3;i++){const x=30+i*bw+8,sel=q.pick===i&&q.res!==null,col=sel?(q.res?'#9be15d':'#ff6f59'):'#ffffff';c.fillStyle='rgba(120,60,20,.2)';g.rr(x,716,bw-16,200,30);c.fill();g.rrf(x,708,bw-16,200,30,col);c.font='90px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#000';c.fillText(HANDS[i],x+(bw-16)/2,790);g.txt((i+1)+' '+HN[i],x+(bw-16)/2,876,22,'#6b4a2a')}
 if(q.res!==null)g.txt(q.res?'せいかい！':'ちがう！',W/2,670,34,q.res?'#2a9a4a':'#e63946','center',g.FD,400);if(s.streak>2)g.txt(s.streak+'連続',W-30,250,24,'#e63946','right')}});

// 47. 目押し
const SYM=['7','BAR','bell','cherry','melon','star'],STRIP=[0,3,2,1,4,3,2,5,1,3,2,4];
function drawSym(c,g,k,x,y,z){if(k===0){c.font='400 '+z*1.2+'px '+g.FD;c.textAlign='center';c.textBaseline='middle';c.lineWidth=8;c.strokeStyle='#ffffff';c.strokeText('7',x,y+4);c.fillStyle='#e63946';c.fillText('7',x,y+4)}
 else if(k===1){g.rrf(x-z*.7,y-z*.3,z*1.4,z*.6,8,'#1b1b2a');g.txt('BAR',x,y+2,z*.42,'#ffffff','center',g.FD,400)}
 else if(k===2){c.fillStyle='#ffc857';c.beginPath();c.moveTo(x-z*.5,y+z*.35);c.quadraticCurveTo(x-z*.5,y-z*.6,x,y-z*.6);c.quadraticCurveTo(x+z*.5,y-z*.6,x+z*.5,y+z*.35);c.closePath();c.fill();g.circle(x,y+z*.42,z*.12,'#b8862a');c.fillStyle='rgba(255,255,255,.5)';c.fillRect(x-z*.3,y-z*.3,z*.1,z*.4)}
 else if(k===3){c.strokeStyle='#2a8a3a';c.lineWidth=4;c.beginPath();c.moveTo(x-z*.25,y+z*.1);c.quadraticCurveTo(x,y-z*.6,x+z*.1,y-z*.55);c.moveTo(x+z*.25,y+z*.1);c.quadraticCurveTo(x+z*.1,y-z*.3,x+z*.1,y-z*.55);c.stroke();g.circle(x-z*.25,y+z*.2,z*.25,'#e63946');g.circle(x+z*.25,y+z*.2,z*.25,'#d7263d');g.circle(x-z*.32,y+z*.12,z*.07,'rgba(255,255,255,.6)')}
 else if(k===4){g.circle(x,y,z*.48,'#5fbf4a');c.strokeStyle='#2a6a2a';c.lineWidth=3;for(let i=-2;i<=2;i++){c.beginPath();c.ellipse(x+i*z*.18,y,z*.05,z*.46,0,0,TAU);c.stroke()}}
 else{g.star(x,y,z*.52,z*.22);c.fillStyle='#ffc857';c.fill();c.strokeStyle='#b8862a';c.lineWidth=3;c.stroke()}}
reg({id:'slot',name:'スロット目押し',genre:'目押し',color:'#e63946',time:45,goal:320,
howto:'タップするたびに左のリールから順に止まる\n真ん中のラインに同じ絵柄をそろえよう',
init(){return{pos:[0,4,8],st:[0,0,0],next:0,wait:0,res:'',sp:7}},
update(s,g,dt){const{I,W}=g,n=STRIP.length;
 if(s.wait>0){s.wait-=dt;if(s.wait<=0){s.st=[0,0,0];s.next=0;s.res='';s.sp=Math.min(13,s.sp+.3)}return}
 for(let i=0;i<3;i++){if(s.st[i]===0)s.pos[i]=(s.pos[i]+s.sp*dt)%n;else if(s.st[i]===1){const tg=s.tg[i];const d=((tg-s.pos[i])%n+n)%n;if(d<.02||d>n-.5){s.pos[i]=tg%n;s.st[i]=2;g.tone(300,.05,'square',.12)}else s.pos[i]=(s.pos[i]+Math.min(d,s.sp*1.5*dt))%n}}
 if((I.pressed||I.kp[' '])&&s.next<3){s.tg=s.tg||[0,0,0];s.tg[s.next]=Math.ceil(s.pos[s.next]+.15)%n;s.st[s.next]=1;s.next++}
 if(s.next===3&&s.st.every(v=>v===2)){const k=s.pos.map(p=>STRIP[Math.round(p)%n]);let p=0;
  if(k[0]===k[1]&&k[1]===k[2]){p=k[0]===0?200:[0,80,50,40,50,120][k[0]];s.res=k[0]===0?'ジャックポット！':'そろった！'}else if(k[0]===k[1]||k[1]===k[2]||k[0]===k[2]){p=10;s.res='おしい！'}else if(k.includes(3)){p=5;s.res='チェリー'}else s.res='はずれ';
  if(p){g.add(p,W/2,300,'#ffe28a');g.sfx(p>=40?'win':'coin');if(p>=40)g.burst(W/2,470,'#ffe28a',50,500,5)}else g.tone(200,.1,'sine',.1);s.wait=1}},
draw(s,g,c){const{W,H}=g,n=STRIP.length,t=g.time;g.bg('#3a0a14','#14040a');
 g.rrf(50,150,W-100,700,40,'#b3243a');g.rrf(64,164,W-128,672,30,'#7a1626');
 for(let i=0;i<22;i++){const a=i/22*TAU,x=W/2+Math.cos(a)*320,y=500+Math.sin(a)*360;if(x<60||x>W-60||y<160||y>840)continue;const on=(i+Math.floor(t*8))%2;if(on)g.glow('#ffe28a',12);g.circle(x,y,7,on?'#ffe28a':'#6a3a20');g.noglow()}
 g.txt('LUCKY 7',W/2,230,54,'#ffe28a','center',g.FD,400);
 const rw=170,rh=330,top=310;for(let i=0;i<3;i++){const x=W/2+(i-1)*(rw+12);g.rrf(x-rw/2,top,rw,rh,14,'#ffffff');c.save();g.rr(x-rw/2,top,rw,rh,14);c.clip();
  const p=s.pos[i],base=Math.floor(p),fr=p-base;for(let r=-2;r<=2;r++){const k=STRIP[((base+r)%n+n)%n],y=top+rh/2+(r-fr)*110;drawSym(c,g,k,x,y,80)}
  const sg=c.createLinearGradient(0,top,0,top+rh);sg.addColorStop(0,'rgba(0,0,0,.45)');sg.addColorStop(.25,'rgba(0,0,0,0)');sg.addColorStop(.75,'rgba(0,0,0,0)');sg.addColorStop(1,'rgba(0,0,0,.45)');c.fillStyle=sg;c.fillRect(x-rw/2,top,rw,rh);c.restore();
  if(s.next===i&&s.wait<=0){c.globalAlpha=.6+.4*Math.sin(t*8);g.txt('STOP',x,top+rh+40,26,'#ffe28a','center',g.FD,400);c.globalAlpha=1}}
 c.strokeStyle='rgba(230,57,70,.9)';c.lineWidth=4;c.beginPath();c.moveTo(80,top+rh/2);c.lineTo(W-80,top+rh/2);c.stroke();
 if(s.res)g.txt(s.res,W/2,760,40,'#ffffff','center',g.FD,400);g.txt('7が3つで200点',W/2,900,20,'rgba(255,220,180,.6)')}});

// 48. ジャグリング
function jball(g,x){return{x:x||g.rnd(150,g.W-150),y:-40,vx:0,vy:0,col:g.pick(['#ff6f59','#ffc857','#2ec4b6','#5b8cff','#ff7ab6','#9be15d']),tr:[],resp:0}}
reg({id:'juggle',name:'ジャグリングショー',genre:'ジャグリング',color:'#ff7ab6',time:40,goal:320,
howto:'落ちてくるボールをタップして投げ上げる\nどんどん数が増えていく',
init(g){return{b:[jball(g,260),jball(g,460)],add:8,t:0}},
update(s,g,dt){const{W,H,I}=g;s.t+=dt;s.add-=dt;if(s.add<=0&&s.b.length<6){s.add=8;s.b.push(jball(g));g.float('ボール追加！',W/2,300,'#ffffff',34)}
 if(I.pressed){let best=null,bd=80;for(const b of s.b){if(b.resp>0)continue;const d=g.dist(b.x,b.y,I.x,I.y);if(d<bd){bd=d;best=b}}if(best){best.vy=-780-g.rnd(0,140);best.vx=(W/2-best.x)*.5+g.rnd(-90,90);const inAir=s.b.filter(b=>b.y<H-300&&b.resp<=0).length;g.add(5+inAir*2,best.x,best.y-40);g.tone(500+inAir*80,.07,'triangle',.18);g.burst(best.x,best.y,best.col,10,200,4)}}
 for(const b of s.b){if(b.resp>0){b.resp-=dt;if(b.resp<=0)Object.assign(b,jball(g),{col:b.col});continue}b.vy+=900*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<30){b.x=30;b.vx=Math.abs(b.vx)}if(b.x>W-30){b.x=W-30;b.vx=-Math.abs(b.vx)}
  b.tr.push({x:b.x,y:b.y});if(b.tr.length>8)b.tr.shift();if(b.y>H+40){g.add(-20,b.x,H-80);g.sfx('bad');g.shake(8);b.resp=1;b.tr=[]}}},
draw(s,g,c){const{W,H}=g,t=s.t;for(let i=0;i<14;i++){c.fillStyle=i%2?'#5a1a4a':'#2a0f30';c.beginPath();c.moveTo(W/2,-200);c.lineTo(i*W/7-W/2,H);c.lineTo((i+1)*W/7-W/2,H);c.fill()}
 c.globalCompositeOperation='lighter';const sp=c.createRadialGradient(W/2,H-200,40,W/2,H-200,460);sp.addColorStop(0,'rgba(255,240,200,.3)');sp.addColorStop(1,'rgba(255,240,200,0)');c.fillStyle=sp;c.fillRect(0,0,W,H);c.globalCompositeOperation='source-over';
 c.fillStyle='#3a1a14';c.beginPath();c.ellipse(W/2,H-40,360,70,0,0,TAU);c.fill();c.fillStyle='#6b3a24';c.beginPath();c.ellipse(W/2,H-50,340,56,0,0,TAU);c.fill();
 g.rrf(W/2-40,H-260,80,150,30,'#ff6f59');g.circle(W/2,H-290,34,'#f3d0a8');g.circle(W/2,H-282,8,'#e63946');c.fillStyle='#ffc857';c.beginPath();c.moveTo(W/2-30,H-316);c.lineTo(W/2,H-376);c.lineTo(W/2+30,H-316);c.fill();g.circle(W/2-11,H-296,4,'#1b1220');g.circle(W/2+11,H-296,4,'#1b1220');
 c.strokeStyle='#f3d0a8';c.lineWidth=12;c.lineCap='round';const wv=Math.sin(t*8)*20;c.beginPath();c.moveTo(W/2-36,H-230);c.lineTo(W/2-110,H-200+wv);c.moveTo(W/2+36,H-230);c.lineTo(W/2+110,H-200-wv);c.stroke();
 for(const b of s.b){if(b.resp>0)continue;c.globalCompositeOperation='lighter';b.tr.forEach((p,i)=>g.circle(p.x,p.y,24*i/b.tr.length,g.rgba(b.col,.12)));c.globalCompositeOperation='source-over';const bg=c.createRadialGradient(b.x-8,b.y-8,3,b.x,b.y,28);bg.addColorStop(0,g.shade(b.col,.6));bg.addColorStop(1,g.shade(b.col,-.3));g.circle(b.x,b.y,26,bg);c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=3;c.beginPath();c.arc(b.x,b.y,18,.5,2.2);c.stroke()}
 g.txt('ボール '+s.b.length+'個',W/2,120,24,'rgba(255,255,255,.75)')}});

// 49. オーダー
const TOP=[{n:'サラミ',c:'#c0392b'},{n:'きのこ',c:'#d9c2a0'},{n:'バジル',c:'#3a9a3a'},{n:'オリーブ',c:'#2a2a2a'},{n:'ピーマン',c:'#5fbf4a'},{n:'コーン',c:'#ffd23f'}];
function topping(c,g,k,x,y,z,rot){c.save();c.translate(x,y);c.rotate(rot||0);if(k===0){g.circle(0,0,z,'#c0392b');for(const[a,b]of[[-.4,-.3],[.3,-.1],[0,.4]])g.circle(a*z,b*z,z*.15,'#f4d0b0')}
 else if(k===1){c.fillStyle='#d9c2a0';c.beginPath();c.arc(0,-z*.1,z*.8,Math.PI,0);c.fill();c.fillRect(-z*.25,-z*.1,z*.5,z*.7)}
 else if(k===2){c.fillStyle='#3a9a3a';c.beginPath();c.ellipse(0,0,z*.5,z,0,0,TAU);c.fill();c.strokeStyle='#2a6a2a';c.lineWidth=2;c.beginPath();c.moveTo(0,-z);c.lineTo(0,z);c.stroke()}
 else if(k===3){c.strokeStyle='#2a2a2a';c.lineWidth=z*.4;c.beginPath();c.arc(0,0,z*.6,0,TAU);c.stroke()}
 else if(k===4){c.strokeStyle='#5fbf4a';c.lineWidth=z*.3;c.beginPath();c.arc(0,0,z*.7,.3,Math.PI*1.7);c.stroke()}
 else{for(const[a,b]of[[-.4,0],[.4,0],[0,-.4],[0,.4]])g.circle(a*z,b*z,z*.32,'#ffd23f')}c.restore()}
function newOrder(g,t){const n=Math.min(4,2+Math.floor(t/18)),ks=g.shuffle([0,1,2,3,4,5]).slice(0,n),o={};for(const k of ks)o[k]=g.ri(1,3);return{need:o,pat:9.5-Math.min(3,t/15),max:9.5-Math.min(3,t/15)}}
reg({id:'pizza',name:'ピッツェリア',genre:'オーダー',color:'#ff9f43',time:50,goal:330,
howto:'注文どおりの具を数だけタップしてのせ\n「出す」で提供。間違えたら「やり直し」',
init(g){return{o:newOrder(g,0),pz:[],mood:0,mt:0}},
update(s,g,dt){const{I,W}=g;s.o.pat-=dt;s.mt=Math.max(0,s.mt-dt);if(s.o.pat<=0){g.add(-10,W/2,200);g.sfx('bad');s.mood=-1;s.mt=1;s.o=newOrder(g,g.time);s.pz=[]}
 if(!I.pressed)return;
 for(let k=0;k<6;k++){const x=40+(k%3)*220,y=650+Math.floor(k/3)*100;if(I.x>x&&I.x<x+200&&I.y>y&&I.y<y+86){const a=g.rnd(TAU),r=g.rnd(20,120);s.pz.push({k,x:360+Math.cos(a)*r,y:440+Math.sin(a)*r,rot:g.rnd(TAU),pop:1});g.tone(500+k*60,.05,'triangle',.12);return}}
 if(I.y>860&&I.y<940){if(I.x<W/2){s.pz=[];g.tone(250,.08,'sine',.1)}else{const cnt={};for(const p of s.pz)cnt[p.k]=(cnt[p.k]||0)+1;const ok=Object.keys(s.o.need).every(k=>cnt[k]===s.o.need[k])&&Object.keys(cnt).every(k=>s.o.need[k]);
  if(ok){g.add(30+Math.ceil(s.o.pat)*2,W/2,440);g.sfx('win');g.burst(360,440,'#ffe28a',30,300,5);s.mood=1}else{g.add(-10,W/2,440);g.sfx('bad');g.shake(8);s.mood=-1}s.mt=1;s.o=newOrder(g,g.time);s.pz=[]}}},
draw(s,g,c){const{W}=g;g.bg('#3a2418','#1e120a');c.fillStyle='rgba(255,255,255,.04)';for(let y=0;y<960;y+=40)c.fillRect(0,y,W,2);
 g.rrf(20,84,W-40,160,20,'#fff7ea');let x=40;const ks=Object.keys(s.o.need);g.txt('ご注文',40,108,20,'#6b4a2a','left');for(const k of ks){topping(c,g,+k,x+30,170,22);g.txt('×'+s.o.need[k],x+66,172,30,'#1b1220','left',g.FD,400);x+=130}
 const fx=W-90,fy=164;g.circle(fx,fy,40,'#f3d0a8');const m=s.mt>0?s.mood:0;g.circle(fx-13,fy-8,4,'#1b1220');g.circle(fx+13,fy-8,4,'#1b1220');c.strokeStyle='#1b1220';c.lineWidth=3;c.beginPath();if(m>0)c.arc(fx,fy+6,14,.2,Math.PI-.2);else if(m<0)c.arc(fx,fy+24,12,Math.PI+.3,-.3);else{c.moveTo(fx-10,fy+14);c.lineTo(fx+10,fy+14)}c.stroke();
 const pr=Math.max(0,s.o.pat/s.o.max);g.rrf(40,222,W-80,10,5,'rgba(0,0,0,.12)');g.rrf(40,222,(W-80)*pr,10,5,pr<.3?'#e63946':'#2ec4b6');
 g.circle(360,450,190,'#5a3a24');const dg=c.createRadialGradient(340,430,30,360,450,175);dg.addColorStop(0,'#f6dca8');dg.addColorStop(1,'#d9a45a');g.circle(360,450,175,dg);g.circle(360,450,150,'#d6402a');c.globalAlpha=.85;for(let i=0;i<14;i++){const a=i*2.3,r=40+(i*31)%95;g.circle(360+Math.cos(a)*r,450+Math.sin(a)*r,22,'#ffe7a8')}c.globalAlpha=1;
 for(const p of s.pz){p.pop=Math.max(0,p.pop-.08);topping(c,g,p.k,p.x,p.y,18*(1+p.pop*.4),p.rot)}
 for(let k=0;k<6;k++){const bx=40+(k%3)*220,by=650+Math.floor(k/3)*100;g.rrf(bx,by,200,86,20,'#fff1df');topping(c,g,k,bx+44,by+43,20);g.txt(TOP[k].n,bx+130,by+44,24,'#3a2418')}
 g.rrf(30,862,W/2-45,76,22,'#6b4a2a');g.txt('やり直し',W/4+8,900,28,'#fff1df');g.rrf(W/2+15,862,W/2-45,76,22,'#2a9a4a');g.txt('出す！',W*3/4-8,900,30,'#ffffff','center',g.FD,400)}});

// 50. マインスイーパー
const MC=9,MR=11,MCS2=70,MMINES=14;
function msNew(s){s.cell=Array.from({length:MC*MR},()=>({m:false,o:false,f:false,n:0}));s.first=true;s.over=0;s.win=0}
function msPlant(s,g,ex){const ban=new Set();const er=Math.floor(ex/MC),ec=ex%MC;for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)ban.add((er+dr)*MC+ec+dc);let k=0;while(k<MMINES){const i=g.ri(0,MC*MR-1);if(ban.has(i)||s.cell[i].m)continue;s.cell[i].m=true;k++}
 for(let i=0;i<MC*MR;i++){const r=Math.floor(i/MC),c=i%MC;let n=0;for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){const R=r+dr,C=c+dc;if(R>=0&&R<MR&&C>=0&&C<MC&&s.cell[R*MC+C].m)n++}s.cell[i].n=n}}
function msOpen(s,g,i){const st=[i];let cnt=0;while(st.length){const j=st.pop(),cl=s.cell[j];if(cl.o||cl.f)continue;cl.o=true;cnt++;if(cl.n===0&&!cl.m){const r=Math.floor(j/MC),c=j%MC;for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){const R=r+dr,C=c+dc;if(R>=0&&R<MR&&C>=0&&C<MC)st.push(R*MC+C)}}}return cnt}
reg({id:'mines',name:'マインスイーパー',genre:'マインスイーパー',color:'#5b8cff',time:60,goal:250,
howto:'タップで開く・長押しで旗を立てる\n地雷をよけて全マスを開こう',
init(){const s={mode:0,hold:0,held:false};msNew(s);return s},
update(s,g,dt){const{I,W}=g,ox=(W-MC*MCS2)/2,oy=100;if(s.over>0){s.over-=dt;if(s.over<=0)msNew(s);return}
 const idx=(x,y)=>{const c=Math.floor((x-ox)/MCS2),r=Math.floor((y-oy)/MCS2);return c>=0&&c<MC&&r>=0&&r<MR?r*MC+c:-1};
 if(I.pressed){s.hold=0;s.held=false;if(I.y>890){s.mode=1-s.mode;g.tone(600,.04,'square',.08);s.held=true}}
 if(I.down&&!s.held){s.hold+=dt;if(s.hold>.38&&g.dist(I.x,I.y,I.sx,I.sy)<20){s.held=true;const i=idx(I.sx,I.sy);if(i>=0&&!s.cell[i].o){s.cell[i].f=!s.cell[i].f;g.tone(800,.05,'triangle',.12)}}}
 if(I.released&&!s.held){const i=idx(I.sx,I.sy);if(i<0)return;const cl=s.cell[i];
  if(s.mode===1&&!cl.o){cl.f=!cl.f;g.tone(800,.05,'triangle',.12);return}if(cl.f)return;
  if(s.first){msPlant(s,g,i);s.first=false}
  let targets=[i];if(cl.o&&cl.n>0){const r=Math.floor(i/MC),c=i%MC,nb=[];let fl=0;for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){const R=r+dr,C=c+dc;if(R>=0&&R<MR&&C>=0&&C<MC){const j=R*MC+C;if(s.cell[j].f)fl++;else if(!s.cell[j].o)nb.push(j)}}targets=fl===cl.n?nb:[]}
  for(const j of targets){if(s.cell[j].m){s.cell.forEach(q=>{if(q.m)q.o=true});g.add(-30,W/2,500);g.sfx('boom');g.shake(18);g.burst(ox+(j%MC+.5)*MCS2,oy+(Math.floor(j/MC)+.5)*MCS2,'#ff6f59',40,420,6);s.over=1.4;return}
   const n=msOpen(s,g,j);if(n){g.score+=n;g.tone(500+Math.min(n,20)*30,.05,'sine',.12)}}
  if(s.cell.every(q=>q.m||q.o)){g.add(100,W/2,500);g.float('全部あけた！',W/2,480,'#ffe28a',46);g.sfx('win');s.over=1.2}}},
draw(s,g,c){const{W}=g,ox=(W-MC*MCS2)/2,oy=100,NC=['','#3a6bd8','#2a9a4a','#e63946','#7b3fa8','#b3243a','#2ec4b6','#1b1b2a','#777777'];g.bg('#1c2236','#10141f');
 for(let i=0;i<MC*MR;i++){const cl=s.cell[i],x=ox+(i%MC)*MCS2,y=oy+Math.floor(i/MC)*MCS2;
  if(!cl.o){const gr=c.createLinearGradient(x,y,x+MCS2,y+MCS2);gr.addColorStop(0,'#8fa6d8');gr.addColorStop(1,'#5b73a8');g.rrf(x+2,y+2,MCS2-4,MCS2-4,10,gr);g.rrf(x+6,y+5,MCS2-12,6,3,'rgba(255,255,255,.3)');
   if(cl.f){c.strokeStyle='#1b1b2a';c.lineWidth=4;c.beginPath();c.moveTo(x+30,y+18);c.lineTo(x+30,y+54);c.stroke();c.fillStyle='#ff3b3b';c.beginPath();c.moveTo(x+32,y+18);c.lineTo(x+52,y+28);c.lineTo(x+32,y+38);c.fill()}}
  else{g.rrf(x+2,y+2,MCS2-4,MCS2-4,8,cl.m?'#ff6f59':'#e8ecf5');if(cl.m){g.circle(x+35,y+35,14,'#1b1b2a');c.strokeStyle='#1b1b2a';c.lineWidth=4;for(let k=0;k<4;k++){const a=k*Math.PI/4;c.beginPath();c.moveTo(x+35-Math.cos(a)*22,y+35-Math.sin(a)*22);c.lineTo(x+35+Math.cos(a)*22,y+35+Math.sin(a)*22);c.stroke()}g.circle(x+30,y+30,4,'#ffffff')}
   else if(cl.n)g.txt(String(cl.n),x+35,y+37,34,NC[cl.n],'center',g.FD,400)}}
 const flags=s.cell.filter(q=>q.f).length;g.rrf(80,898,W-160,52,26,s.mode?'#ff6f59':'#2ec4b6');g.txt(s.mode?'いまは 旗モード（タップで切替）':'いまは 掘るモード（タップで切替）',W/2,925,22,'#10141f');g.txt('地雷 '+MMINES+'　旗 '+flags,W/2,86,18,'rgba(255,255,255,.6)')}});
})();
