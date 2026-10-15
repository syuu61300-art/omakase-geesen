// Pack 7 — games 77-89
(()=>{const reg=MG.reg;const TAU=Math.PI*2;

// 77. 連鎖爆発
function chRound(s,g){const n=18+s.lv*5;s.b=Array.from({length:n},()=>({x:g.rnd(60,660),y:g.rnd(140,900),vx:g.rnd(-90,90),vy:g.rnd(-90,90),col:g.pick(['#ff6f59','#ffc857','#2ec4b6','#5b8cff','#ff7ab6','#a98bff']),ex:0}));s.used=false;s.popped=0;s.need=Math.ceil(n*.45);s.wait=0}
reg({id:'chain',name:'れんさ花火',genre:'連鎖爆発',color:'#ff7ab6',time:40,goal:320,
howto:'1回だけタップして花火を爆発させる\n巻き込んだ玉も爆発して連鎖する',
init(g){const s={lv:0};chRound(s,g);return s},
update(s,g,dt){const{W,H,I}=g;if(s.wait>0){s.wait-=dt;if(s.wait<=0)chRound(s,g);return}
 if(I.pressed&&!s.used){s.used=true;s.b.push({x:I.x,y:I.y,vx:0,vy:0,col:'#ffffff',ex:.001,me:1});g.sfx('pop')}
 let active=false;for(const b of s.b){if(b.ex>0){b.ex+=dt;if(b.ex<1.4)active=true}else{b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<20||b.x>W-20)b.vx*=-1;if(b.y<110||b.y>H-20)b.vy*=-1}}
 for(const e of s.b){if(e.ex<=0||e.ex>1.4)continue;const r=e.ex<.3?e.ex/.3*64:e.ex<1.1?64:64*(1-(e.ex-1.1)/.3);for(const b of s.b){if(b.ex>0)continue;if(g.dist(b.x,b.y,e.x,e.y)<r+12){b.ex=.001;s.popped++;g.add(5+Math.min(20,s.popped),b.x,b.y-30,b.col);g.tone(400+Math.min(s.popped,30)*30,.08,'triangle',.12)}}}
 if(s.used&&!active){if(s.popped>=s.need){g.add(50,W/2,H/2);g.float('ステージクリア！',W/2,H/2-60,'#ffe28a',44);g.sfx('win');s.lv++}else{g.float('目標まであと'+(s.need-s.popped)+'個',W/2,H/2,'#ffffff',36);g.sfx('lose')}s.wait=1.3}},
draw(s,g,c){const{W}=g;g.bg('#06061a','#140a2a');for(let i=0;i<60;i++)g.circle((i*137)%W,(i*71)%860+100,1.2,'rgba(255,255,255,.5)');
 c.globalCompositeOperation='lighter';for(const b of s.b){if(b.ex>0){if(b.ex>1.4)continue;const r=b.ex<.3?b.ex/.3*64:b.ex<1.1?64:64*(1-(b.ex-1.1)/.3);const gr=c.createRadialGradient(b.x,b.y,2,b.x,b.y,Math.max(3,r));gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(.4,g.rgba(b.col,.5));gr.addColorStop(1,g.rgba(b.col,0));c.fillStyle=gr;c.beginPath();c.arc(b.x,b.y,Math.max(3,r),0,TAU);c.fill();
  for(let k=0;k<10;k++){const a=k*TAU/10+b.x,rr=r*1.1;g.circle(b.x+Math.cos(a)*rr,b.y+Math.sin(a)*rr,2.5,b.col)}}else{g.circle(b.x,b.y,16,g.rgba(b.col,.3));g.circle(b.x,b.y,9,b.col)}}c.globalCompositeOperation='source-over';
 g.txt('目標 '+s.need+'個　いま '+s.popped+'個',W/2,110,24,'#ffffff');if(!s.used)g.txt('どこか1か所をタップ！',W/2,900,26,'rgba(255,255,255,.7)')}});

// 78. おせわ
function pot(g){return{w:g.rnd(55,75),grow:0,bug:0,bugT:g.rnd(4,9),rate:g.rnd(7,12),dry:0,col:g.pick(['#ff6f59','#ffc857','#ff7ab6','#a98bff','#5b8cff'])}}
reg({id:'garden',name:'おはなのおせわ',genre:'おせわ',color:'#9be15d',time:45,goal:300,
howto:'鉢をタップして水やり（あげすぎ注意）\n虫が来たらタップで追いはらう',
init(g){return{p:[pot(g),pot(g),pot(g),pot(g)],can:null}},
update(s,g,dt){const{I}=g;s.p.forEach((p,i)=>{const x=180+(i%2)*360,y=360+Math.floor(i/2)*380;p.w-=p.rate*dt;p.bugT-=dt;if(p.bugT<=0&&!p.bug){p.bug=1;g.tone(900,.08,'sawtooth',.06)}
  const good=p.w>35&&p.w<85&&!p.bug;if(good)p.grow+=dt*9;if(p.bug)p.grow=Math.max(0,p.grow-dt*4);
  if(p.w<=0){p.dry+=dt;p.w=0;if(p.dry>2){g.add(-20,x,y-120);g.float('かれた…',x,y-80,'#ff6f59',28);g.sfx('bad');s.p[i]=pot(g)}}else p.dry=0;
  if(p.w>110){g.add(-15,x,y-120);g.float('根ぐされ…',x,y-80,'#ff6f59',28);g.sfx('bad');s.p[i]=pot(g)}
  if(p.grow>=100){g.add(50,x,y-160,'#ffe28a');g.float('さいた！',x,y-120,'#ffffff',32);g.sfx('win');g.burst(x,y-140,p.col,30,300,5);s.p[i]=pot(g)}
  if(I.pressed&&Math.abs(I.x-x)<150&&I.y>y-260&&I.y<y+110){if(p.bug&&g.dist(I.x,I.y,x+50,y-150)<70){p.bug=0;p.bugT=g.rnd(4,9);g.add(5,x+50,y-180);g.sfx('pop')}else{p.w+=22;s.can={x,y:y-200,t:.5};g.noise(.25,.1,0,2500)}}});if(s.can){s.can.t-=dt;if(s.can.t<=0)s.can=null}},
draw(s,g,c){const{W,H}=g,t=g.time;g.bg('#cfeaff','#f3fbe8');c.fillStyle='#8cc46a';c.fillRect(0,H-120,W,120);
 s.p.forEach((p,i)=>{const x=180+(i%2)*360,y=360+Math.floor(i/2)*380,h=40+p.grow*1.4,wilt=p.w<25?(25-p.w)/25:0;
  c.save();c.translate(x,y-10);c.rotate(Math.sin(t*1.5+i)*.03+wilt*.5);c.strokeStyle='#3a8a3a';c.lineWidth=8;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(10,-h/2,0,-h);c.stroke();c.fillStyle='#4caf50';c.beginPath();c.ellipse(-18,-h*.4,20,9,-.5,0,TAU);c.fill();c.beginPath();c.ellipse(18,-h*.6,20,9,.5,0,TAU);c.fill();
  if(p.grow>60){const r=8+(p.grow-60)*.5;for(let k=0;k<6;k++){const a=k*TAU/6+t*.2;g.circle(Math.cos(a)*r,-h+Math.sin(a)*r,r*.7,p.col)}g.circle(0,-h,r*.6,'#ffe28a')}else g.circle(0,-h,8,'#7bc950');c.restore();
  c.fillStyle='#c0603a';c.beginPath();c.moveTo(x-70,y-14);c.lineTo(x+70,y-14);c.lineTo(x+52,y+90);c.lineTo(x-52,y+90);c.fill();c.fillStyle='#d8754a';c.fillRect(x-78,y-24,156,22);c.fillStyle='#5a3a24';c.fillRect(x-66,y-24,132,8);
  g.rrf(x-60,y+100,120,14,7,'rgba(0,0,0,.15)');g.rrf(x-60,y+100,120*g.clamp(p.w,0,110)/110,14,7,p.w>85?'#ff6f59':p.w<35?'#ffc857':'#5b8cff');c.fillStyle='rgba(0,0,0,.3)';c.fillRect(x-60+120*35/110,y+98,2,18);c.fillRect(x-60+120*85/110,y+98,2,18);
  g.rrf(x-60,y+120,120,8,4,'rgba(0,0,0,.1)');g.rrf(x-60,y+120,120*p.grow/100,8,4,'#9be15d');
  if(p.bug){const bx=x+50+Math.sin(t*8)*10,by=y-150+Math.cos(t*6)*8;g.circle(bx,by,12,'#2a2a34');c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.ellipse(bx-8,by-10,8,5,-.5,0,TAU);c.fill();c.beginPath();c.ellipse(bx+8,by-10,8,5,.5,0,TAU);c.fill()}});
 if(s.can){c.save();c.translate(s.can.x+40,s.can.y);c.rotate(-.5);g.rrf(-30,-20,60,40,8,'#5b8cff');c.fillRect(30,-10,30,8);c.restore();for(let k=0;k<6;k++)g.circle(s.can.x+10+k*4,s.can.y+40+((t*400+k*30)%120),3,'#9fe8ff')}
 g.txt('青ゲージの線と線の間をキープ',W/2,H-60,22,'#2a4a1a')}});

// 79. 交通整理
const TBX=[300,420],TBY=[420,540],TL=[{d:[0,1],x:330,y0:60},{d:[0,-1],x:390,y0:960},{d:[-1,0],y:450,x0:780},{d:[1,0],y:510,x0:-60}];
reg({id:'traffic',name:'こうさてん整理',genre:'交通整理',color:'#ffc857',time:45,goal:300,
howto:'交差点をタップすると信号が切りかわる\n車同士がぶつからないように流そう',
init(){return{ns:true,cars:[],sp:.8,horn:0}},
update(s,g,dt){const{I}=g;if(I.pressed||I.kp[' ']){s.ns=!s.ns;g.tone(700,.05,'square',.1)}
 s.sp-=dt;if(s.sp<=0){s.sp=g.rnd(.5,1.1)*Math.max(.55,1-g.time/90);const l=g.ri(0,3),L=TL[l];s.cars.push({l,x:L.x!==undefined?L.x:L.x0,y:L.y!==undefined?L.y:L.y0,v:g.rnd(150,210),col:g.pick(['#ff6f59','#5b8cff','#2ec4b6','#a98bff','#ff9f43']),wait:0})}
 const inBox=c0=>c0.x>TBX[0]-20&&c0.x<TBX[1]+20&&c0.y>TBY[0]-20&&c0.y<TBY[1]+20;
 for(const c0 of s.cars){const L=TL[c0.l],green=(c0.l<2)===s.ns;const along=L.d[0]?c0.x*L.d[0]:c0.y*L.d[1],stopAt=L.d[0]?(L.d[0]>0?TBX[0]-30:-(TBX[1]+30)):(L.d[1]>0?TBY[0]-30:-(TBY[1]+30));
  let go=true;if(!green&&along<stopAt&&along>stopAt-30)go=false;
  for(const o of s.cars){if(o===c0||o.l!==c0.l)continue;const oa=L.d[0]?o.x*L.d[0]:o.y*L.d[1];if(oa>along&&oa-along<62)go=false}
  if(go){c0.x+=L.d[0]*c0.v*dt;c0.y+=L.d[1]*c0.v*dt;c0.wait=0}else c0.wait+=dt;
  if(!c0.passed&&along>(L.d[0]?(L.d[0]>0?TBX[1]+20:-(TBX[0]-20)):(L.d[1]>0?TBY[1]+20:-(TBY[0]-20)))){c0.passed=1;g.add(5);}}
 for(let i=0;i<s.cars.length;i++)for(let j=i+1;j<s.cars.length;j++){const a=s.cars[i],b=s.cars[j];if((a.l<2)!==(b.l<2)&&inBox(a)&&inBox(b)&&g.dist(a.x,a.y,b.x,b.y)<46&&!a.dead&&!b.dead){a.dead=b.dead=1;g.add(-50,(a.x+b.x)/2,(a.y+b.y)/2-40);g.sfx('boom');g.shake(16);g.burst((a.x+b.x)/2,(a.y+b.y)/2,'#ffc857',30,340,5)}}
 const waiting=s.cars.filter(c0=>c0.wait>4).length;s.horn-=dt;if(waiting&&s.horn<=0){s.horn=1;g.add(-2*waiting);g.tone(400,.15,'square',.08)}
 s.cars=s.cars.filter(c0=>!c0.dead&&c0.x>-100&&c0.x<820&&c0.y>-100&&c0.y<1060)},
draw(s,g,c){const{W,H}=g;g.bg('#6fa85a','#5a944a');c.fillStyle='#3a3a48';c.fillRect(TBX[0],0,TBX[1]-TBX[0],H);c.fillRect(0,TBY[0],W,TBY[1]-TBY[0]);
 c.fillStyle='rgba(255,255,255,.6)';for(let y=0;y<H;y+=40)if(y<TBY[0]-30||y>TBY[1]+20)c.fillRect(358,y,4,20);for(let x=0;x<W;x+=40)if(x<TBX[0]-30||x>TBX[1]+20)c.fillRect(x,478,20,4);
 c.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<6;i++){c.fillRect(TBX[0]+6+i*20,TBY[0]-26,10,20);c.fillRect(TBX[0]+6+i*20,TBY[1]+6,10,20);c.fillRect(TBX[0]-26,TBY[0]+6+i*20,20,10);c.fillRect(TBX[1]+6,TBY[0]+6+i*20,20,10)}
 for(let i=0;i<8;i++){const x=(i%4)*190+20,y=i<4?140:780;if(x>TBX[0]-120&&x<TBX[1])continue;g.rrf(x,y,120,100,8,'#e8d8c0');g.rrf(x,y-20,120,24,6,'#c0603a')}
 for(const c0 of s.cars){const L=TL[c0.l],a=Math.atan2(L.d[1],L.d[0]);c.save();c.translate(c0.x,c0.y);c.rotate(a);c.fillStyle='rgba(0,0,0,.3)';g.rr(-26,-14,56,32,8);c.fill();g.rrf(-28,-16,56,32,8,c0.col);g.rrf(-6,-13,20,26,5,g.shade(c0.col,-.3));c.fillStyle='#fff1a8';c.fillRect(24,-14,4,8);c.fillRect(24,6,4,8);c.restore();if(c0.wait>4)g.txt('💢',c0.x,c0.y-30,20,'#000')}
 const lt=(x,y,on)=>{g.rrf(x-18,y-44,36,88,10,'#1b1b24');g.glow(on?'#3ddc84':'#ff3b3b',16);g.circle(x,y+(on?20:-20),12,on?'#3ddc84':'#ff3b3b');g.noglow();g.circle(x,y+(on?-20:20),12,'#3a3a44')};
 lt(TBX[1]+60,TBY[0]-90,s.ns);lt(TBX[0]-60,TBY[1]+90,s.ns);lt(TBX[0]-60,TBY[0]-90,!s.ns);lt(TBX[1]+60,TBY[1]+90,!s.ns);
 g.txt(s.ns?'たて：青':'よこ：青',W/2,TBY[1]+170,24,'#ffffff')}});

// 80. 航空管制
function plane(g){const side=g.ri(0,3),W=720,H=960;const p=[[g.rnd(100,620),90],[W+30,g.rnd(200,800)],[g.rnd(100,620),H+30],[-30,g.rnd(200,800)]][side];const a=Math.atan2(560-p[1],360-p[0])+g.rnd(-.5,.5);return{x:p[0],y:p[1],a,v:g.rnd(45,65),path:[],col:g.pick(['#ff6f59','#ffc857','#5b8cff','#ff7ab6'])}}
reg({id:'atc',name:'そらのかんせい塔',genre:'航空管制',color:'#9fe8ff',time:50,goal:300,
howto:'飛行機からなぞって飛ぶ道をかく\n空港の円に着陸させよう。ぶつかると終了',
init(g){return{pl:[plane(g)],sp:3,drag:null}},
update(s,g,dt){const{W,H,I}=g,AP=[360,560];s.sp-=dt;if(s.sp<=0){s.sp=Math.max(2.2,5-g.time*.06);s.pl.push(plane(g))}
 if(I.pressed){let b=null,bd=60;for(const p of s.pl){const d=g.dist(p.x,p.y,I.x,I.y);if(d<bd){bd=d;b=p}}if(b){s.drag=b;b.path=[]}}
 if(I.down&&s.drag){const P=s.drag.path,l=P[P.length-1];if(!l||g.dist(l[0],l[1],I.x,I.y)>14)P.push([I.x,I.y])}if(I.released)s.drag=null;
 for(const p of s.pl){if(p.path.length){const[tx,ty]=p.path[0];if(g.dist(p.x,p.y,tx,ty)<10)p.path.shift();else{let da=Math.atan2(ty-p.y,tx-p.x)-p.a;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;p.a+=g.clamp(da,-3*dt,3*dt)}}
  p.x+=Math.cos(p.a)*p.v*dt;p.y+=Math.sin(p.a)*p.v*dt;if((p.x<20&&Math.cos(p.a)<0)||(p.x>W-20&&Math.cos(p.a)>0))p.a=Math.PI-p.a;if((p.y<90&&Math.sin(p.a)<0)||(p.y>H-20&&Math.sin(p.a)>0))p.a=-p.a;
  if(g.dist(p.x,p.y,AP[0],AP[1])<44){p.done=1;g.add(20,p.x,p.y-30);g.sfx('coin');g.burst(p.x,p.y,'#9fe8ff',14,200,3)}}
 for(let i=0;i<s.pl.length;i++)for(let j=i+1;j<s.pl.length;j++){const a=s.pl[i],b=s.pl[j];if(g.dist(a.x,a.y,b.x,b.y)<34){g.sfx('boom');g.shake(16);g.burst((a.x+b.x)/2,(a.y+b.y)/2,'#ff6f59',40,400,5);g.over('空中衝突！');return}}
 s.pl=s.pl.filter(p=>!p.done)},
draw(s,g,c){const{W,H}=g,AP=[360,560];g.bg('#0b2a3a','#062030');c.strokeStyle='rgba(159,232,255,.08)';c.lineWidth=1;for(let r=100;r<800;r+=100){c.beginPath();c.arc(AP[0],AP[1],r,0,TAU);c.stroke()}c.save();c.translate(AP[0],AP[1]);c.rotate(g.time);const sw=c.createLinearGradient(0,0,500,0);sw.addColorStop(0,'rgba(159,232,255,.25)');sw.addColorStop(1,'rgba(159,232,255,0)');c.fillStyle=sw;c.beginPath();c.moveTo(0,0);c.arc(0,0,800,-.25,0);c.fill();c.restore();
 g.glow('#9fe8ff',20);c.strokeStyle='#9fe8ff';c.lineWidth=4;c.beginPath();c.arc(AP[0],AP[1],44,0,TAU);c.stroke();g.noglow();g.rrf(AP[0]-60,AP[1]-8,120,16,4,'#5a6070');c.fillStyle='#ffffff';for(let i=0;i<5;i++)c.fillRect(AP[0]-50+i*22,AP[1]-2,12,4);
 for(const p of s.pl){if(p.path.length){c.strokeStyle=g.rgba(p.col,.5);c.lineWidth=3;c.setLineDash([6,8]);c.beginPath();c.moveTo(p.x,p.y);for(const q of p.path)c.lineTo(q[0],q[1]);c.stroke();c.setLineDash([])}
  for(const o of s.pl)if(o!==p&&g.dist(o.x,o.y,p.x,p.y)<90){c.strokeStyle='rgba(255,60,60,.8)';c.lineWidth=3;c.beginPath();c.arc(p.x,p.y,30,0,TAU);c.stroke()}
  c.save();c.translate(p.x,p.y);c.rotate(p.a);g.glow(p.col,12);c.fillStyle=p.col;c.beginPath();c.moveTo(22,0);c.lineTo(-14,-5);c.lineTo(-16,0);c.lineTo(-14,5);c.closePath();c.fill();c.beginPath();c.moveTo(4,0);c.lineTo(-6,-18);c.lineTo(-10,-18);c.lineTo(-6,0);c.lineTo(-10,18);c.lineTo(-6,18);c.closePath();c.fill();c.beginPath();c.moveTo(-12,0);c.lineTo(-18,-8);c.lineTo(-20,-8);c.lineTo(-18,0);c.lineTo(-20,8);c.lineTo(-18,8);c.closePath();c.fill();g.noglow();c.restore()}}});

// 81. 分別
const ITEMS=[['新聞紙',0],['バナナの皮',0],['紙くず',0],['りんごの芯',0],['空き缶',1],['ガラスびん',1],['スプレー缶',1],['ペットボトル',2],['レジ袋',2],['プラ容器',2]];
const BINS=[['もえる','#ff6f59'],['かん・びん','#5b8cff'],['プラ','#ffc857']];
function itDraw(c,g,n,x,y){if(n==='新聞紙'){g.rrf(x-40,y-30,80,60,4,'#e8e4dc');c.fillStyle='#9a9aa8';for(let i=0;i<4;i++)c.fillRect(x-32,y-20+i*12,64,4)}else if(n==='バナナの皮'){c.strokeStyle='#ffd23f';c.lineWidth=16;c.lineCap='round';c.beginPath();c.arc(x,y-30,40,.6,2.5);c.stroke()}else if(n==='紙くず'){g.poly(x,y,34,7,1);c.fillStyle='#f4f1ea';c.fill();c.strokeStyle='#c8c0b0';c.stroke()}else if(n==='りんごの芯'){g.rrf(x-12,y-30,24,60,10,'#f6e7c6');g.circle(x,y-32,14,'#d7263d');g.circle(x,y+32,14,'#d7263d')}
 else if(n==='空き缶'){g.rrf(x-24,y-40,48,80,8,'#c8ccd8');c.fillStyle='#e63946';c.fillRect(x-24,y-14,48,26)}else if(n==='ガラスびん'){g.rrf(x-22,y-14,44,56,10,'rgba(120,200,160,.8)');g.rrf(x-9,y-46,18,36,4,'rgba(120,200,160,.8)')}else if(n==='スプレー缶'){g.rrf(x-20,y-34,40,76,8,'#5b8cff');g.rrf(x-10,y-46,20,14,4,'#ffffff')}
 else if(n==='ペットボトル'){g.rrf(x-20,y-20,40,64,12,'rgba(170,220,255,.8)');g.rrf(x-9,y-44,18,26,4,'rgba(170,220,255,.8)');g.rrf(x-10,y-50,20,10,3,'#2e7fd8')}else if(n==='レジ袋'){c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.moveTo(x-36,y-20);c.lineTo(x+36,y-20);c.lineTo(x+30,y+40);c.lineTo(x-30,y+40);c.fill();c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=6;c.beginPath();c.arc(x-16,y-26,12,Math.PI,0);c.arc(x+16,y-26,12,Math.PI,0);c.stroke()}else{g.rrf(x-36,y-20,72,44,8,'rgba(255,240,200,.85)');c.strokeStyle='#c8a060';c.lineWidth=2;c.strokeRect(x-30,y-14,60,32)}}
function srNew(s,g){const it=g.pick(ITEMS);s.it=it;s.x=360;s.y=440;s.t=0;s.lim=Math.max(1.4,3.2-g.time*.05);s.fly=null}
reg({id:'sort',name:'ゴミ分別マスター',genre:'分別',color:'#2ec4b6',time:40,goal:300,
howto:'ゴミをスワイプして正しい箱へ\n←もえる　↓かん・びん　→プラ',
init(g){const s={streak:0};srNew(s,g);return s},
update(s,g,dt){const{I}=g;if(s.fly){s.fly.t+=dt;if(s.fly.t>.25)srNew(s,g);return}s.t+=dt;let b=-1;
 if(I.swipe){const{dx,dy}=I.swipe;b=Math.abs(dx)>Math.abs(dy)?(dx<0?0:2):(dy>0?1:-1)}if(I.kp.ArrowLeft)b=0;if(I.kp.ArrowDown)b=1;if(I.kp.ArrowRight)b=2;
 if(b>=0){const ok=b===s.it[1];if(ok){s.streak++;g.add(10+Math.min(15,s.streak),360,380);g.sfx('good')}else{s.streak=0;g.add(-10,360,380);g.float('正解は「'+BINS[s.it[1]][0]+'」',360,330,'#ff6f59',30);g.sfx('bad');g.shake(6)}s.fly={b,t:0};return}
 if(s.t>s.lim){s.streak=0;g.add(-5,360,380);g.float('時間切れ',360,330,'#ffffff',28);g.sfx('bad');srNew(s,g)}},
draw(s,g,c){const{W,H}=g;g.bg('#e8f4ee','#cfe6d8');const bp=[[110,620],[360,820],[610,620]];
 BINS.forEach(([n,col],i)=>{const[x,y]=bp[i];g.rrf(x-90,y-60,180,150,18,g.shade(col,-.2));g.rrf(x-100,y-74,200,30,10,col);g.txt(n,x,y+20,28,'#ffffff','center',g.FD,400);g.txt(['←','↓','→'][i],x,y+64,26,'rgba(255,255,255,.8)')});
 let x=s.x,y=s.y;if(s.fly){const[tx,ty]=bp[s.fly.b],k=s.fly.t/.25;x=g.lerp(360,tx,k);y=g.lerp(440,ty-40,k)}c.save();c.translate(x,y);if(s.fly)c.scale(1-s.fly.t*2,1-s.fly.t*2);c.translate(-x,-y);g.circle(x,y,90,'rgba(255,255,255,.7)');itDraw(c,g,s.it[0],x,y);c.restore();
 if(!s.fly){g.txt(s.it[0],W/2,300,36,'#1b3a2a','center',g.FD,400);const r=Math.max(0,1-s.t/s.lim);g.rrf(160,240,W-320,12,6,'rgba(0,0,0,.1)');g.rrf(160,240,(W-320)*r,12,6,r<.3?'#ff6f59':'#2ec4b6')}
 if(s.streak>2)g.txt(s.streak+'連続！',W/2,160,26,'#2a9a6a')}});

// 82. ヒット＆ブロー
function hbNew(s,g){s.sec=g.shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,3);s.hist=[];s.inp=[];s.done=0}
reg({id:'hitblow',name:'ヒット＆ブロー',genre:'数当て推理',color:'#5b8cff',time:60,goal:250,
howto:'ちがう3つの数字のひみつの並びを当てる\nヒット＝場所も数も正解、ブロー＝数だけ正解',
init(g){const s={};hbNew(s,g);return s},
update(s,g,dt){const{I,W}=g;if(s.done>0){s.done-=dt;if(s.done<=0)hbNew(s,g);return}let k=-1;
 if(I.pressed&&I.y>660){const c=Math.floor((I.x-40)/((W-80)/6)),r=Math.floor((I.y-660)/96);if(c>=0&&c<6&&r>=0&&r<2){const i=r*6+c;k=i<10?i:i===10?'del':'ok'}}
 for(let d=0;d<=9;d++)if(I.kp[String(d)])k=d;if(I.kp.Backspace)k='del';if(I.kp.Enter)k='ok';
 if(k==='del'){s.inp.pop();return}if(k==='ok'&&s.inp.length===3){const h=s.inp.filter((v,i)=>s.sec[i]===v).length,b=s.inp.filter((v,i)=>s.sec[i]!==v&&s.sec.includes(v)).length;s.hist.unshift({n:s.inp.slice(),h,b});s.inp=[];g.tone(400+h*200,.08,'triangle',.15);
  if(h===3){const p=Math.max(30,170-s.hist.length*15);g.add(p,W/2,300);g.float('正解！',W/2,360,'#ffe28a',56);g.sfx('win');s.done=1.5}return}
 if(typeof k==='number'&&s.inp.length<3&&!s.inp.includes(k)){s.inp.push(k);g.tone(600,.03,'square',.08)}},
draw(s,g,c){const{W}=g;g.bg('#141a30','#0a0e1c');
 for(let i=0;i<3;i++){const x=W/2+(i-1)*130;g.rrf(x-55,120,110,130,18,s.done>0?'#ffe28a':'#232a48');g.txt(s.done>0?String(s.sec[i]):i<s.inp.length?String(s.inp[i]):'?',x,188,72,s.done>0?'#1b1220':i<s.inp.length?'#ffffff':'rgba(255,255,255,.25)','center',g.FD,400)}
 s.hist.slice(0,6).forEach((h,i)=>{const y=300+i*58;c.globalAlpha=1-i*.12;g.rrf(120,y-24,W-240,48,24,'rgba(255,255,255,.06)');g.txt(h.n.join(' '),220,y+2,30,'#ffffff','center',g.FD,400);g.txt(h.h+' ヒット',400,y+2,26,'#ff6f59');g.txt(h.b+' ブロー',540,y+2,26,'#5bc0ff');c.globalAlpha=1});
 const bw=(W-80)/6;for(let i=0;i<12;i++){const x=40+(i%6)*bw+6,y=660+Math.floor(i/6)*96,lab=i<10?String(i):i===10?'消す':'決定',used=i<10&&s.inp.includes(i);g.rrf(x,y,bw-12,84,18,i===11?(s.inp.length===3?'#ff6f59':'#5a3a40'):used?'#2a3050':'#3a4a80');g.txt(lab,x+(bw-12)/2,y+44,i<10?40:24,used?'rgba(255,255,255,.3)':'#ffffff','center',i<10?g.FD:g.FB,i<10?400:800)}}});

// 83. ハノイの塔
function hnNew(s){s.p=[[],[],[]];for(let i=s.n;i>=1;i--)s.p[0].push(i);s.sel=-1;s.moves=0;s.done=0}
reg({id:'hanoi',name:'ハノイの塔',genre:'ハノイの塔',color:'#ff9f43',time:60,goal:250,
howto:'棒をタップして一番上の円盤を選び\n別の棒をタップで移動。右端に全部運ぼう',
init(){const s={n:3};hnNew(s);return s},
update(s,g,dt){const{I,W}=g;if(s.done>0){s.done-=dt;if(s.done<=0){s.n=Math.min(5,s.n+1);hnNew(s)}return}let k=-1;if(I.pressed&&I.y>300)k=g.clamp(Math.floor(I.x/(W/3)),0,2);for(let i=0;i<3;i++)if(I.kp[String(i+1)])k=i;if(k<0)return;
 if(s.sel<0){if(s.p[k].length){s.sel=k;g.tone(600,.04,'triangle',.1)}}else{const a=s.p[s.sel],b=s.p[k],d=a[a.length-1];if(k!==s.sel&&(!b.length||b[b.length-1]>d)){b.push(a.pop());s.moves++;g.tone(400+d*80,.06,'triangle',.15);if(s.p[2].length===s.n){const min=Math.pow(2,s.n)-1,p=40*s.n+Math.max(0,60-(s.moves-min)*8);g.add(p,W/2,300);g.float(s.moves===min?'最短クリア！':'クリア！',W/2,360,'#ffe28a',50);g.sfx('win');s.done=1.4}}else if(k!==s.sel){g.sfx('bad');g.shake(5)}s.sel=-1}},
draw(s,g,c){const{W,H}=g;g.bg('#2a1d3a','#140e20');c.fillStyle='#6b4a2a';c.fillRect(40,820,W-80,30);
 for(let i=0;i<3;i++){const x=W/6+i*W/3;g.rrf(x-8,420,16,400,8,'#a0784a');if(s.sel===i){g.glow('#ffe28a',20);c.strokeStyle='#ffe28a';c.lineWidth=3;g.rr(x-110,400,220,440,20);c.stroke();g.noglow()}
  s.p[i].forEach((d,j)=>{const w=60+d*36,y=790-j*44-(s.sel===i&&j===s.p[i].length-1?60:0);const col='hsl('+(d*55)%360+',75%,60%)';g.rrf(x-w/2,y,w,38,19,col);g.rrf(x-w/2+10,y+5,w-20,8,4,'rgba(255,255,255,.35)')})}
 g.txt('手数 '+s.moves+'　最短 '+(Math.pow(2,s.n)-1),W/2,180,28,'#ffffff');g.txt('ゴール →',W*5/6,880,22,'#ffe28a')}});

// 84. ペグソリティア
const PG=[];for(let r=0;r<5;r++)for(let c=0;c<=r;c++)PG.push([r,c]);const pgI=(r,c)=>r*(r+1)/2+c,PGD=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,-1]];
function pgMoves(s){const m=[];PG.forEach(([r,c],i)=>{if(!s.h[i])return;for(const[dr,dc]of PGD){const r2=r+2*dr,c2=c+2*dc;if(r2<0||r2>4||c2<0||c2>r2)continue;if(s.h[pgI(r+dr,c+dc)]&&!s.h[pgI(r2,c2)])m.push([i,pgI(r+dr,c+dc),pgI(r2,c2)])}});return m}
function pgNew(s,g){s.h=PG.map(()=>true);s.h[g.pick([0,3,5,4,12])]=false;s.sel=-1;s.done=0}
reg({id:'peg',name:'ペグジャンプ',genre:'ペグソリティア',color:'#ffc857',time:60,goal:250,
howto:'ペグを選び、となりのペグを飛びこえて空き穴へ\n飛ばれたペグは消える。最後の1本を目指そう',
init(g){const s={};pgNew(s,g);return s},
update(s,g,dt){const{I}=g;if(s.done>0){s.done-=dt;if(s.done<=0)pgNew(s,g);return}if(!I.pressed)return;const pos=([r,c])=>[360+(c-r/2)*120,250+r*110];let hit=-1;PG.forEach((p,i)=>{const[x,y]=pos(p);if(g.dist(x,y,I.x,I.y)<50)hit=i});if(hit<0)return;
 if(s.h[hit]){s.sel=hit;g.tone(600,.04,'sine',.1);return}if(s.sel>=0){const mv=pgMoves(s).find(m=>m[0]===s.sel&&m[2]===hit);if(mv){s.h[mv[0]]=false;s.h[mv[1]]=false;s.h[mv[2]]=true;g.add(10,pos(PG[mv[1]])[0],pos(PG[mv[1]])[1]-40);g.sfx('pop');g.burst(pos(PG[mv[1]])[0],pos(PG[mv[1]])[1],'#ffc857',10,200,4);s.sel=-1;
  if(!pgMoves(s).length){const left=s.h.filter(v=>v).length;const p=left===1?100:left===2?40:left===3?15:0;if(p)g.add(p,360,700);g.float('のこり '+left+'本',360,780,left===1?'#ffe28a':'#ffffff',44);g.sfx(left<=2?'win':'lose');s.done=1.6}}else g.sfx('bad')}},
draw(s,g,c){const{W}=g;g.bg('#3a2414','#1e120a');const pos=([r,c])=>[360+(c-r/2)*120,250+r*110];c.fillStyle='#8a5a2a';c.beginPath();c.moveTo(360,150);c.lineTo(640,760);c.lineTo(80,760);c.closePath();c.fill();c.strokeStyle='#5a3a1a';c.lineWidth=8;c.stroke();
 const mv=s.sel>=0?pgMoves(s).filter(m=>m[0]===s.sel).map(m=>m[2]):[];PG.forEach((p,i)=>{const[x,y]=pos(p);g.circle(x,y,30,'#4a2a10');if(mv.includes(i)){g.glow('#9be15d',16);c.strokeStyle='#9be15d';c.lineWidth=4;c.beginPath();c.arc(x,y,34,0,TAU);c.stroke();g.noglow()}
  if(s.h[i]){const sel=s.sel===i,gr=c.createRadialGradient(x-8,y-14,3,x,y-6,26);gr.addColorStop(0,'#ffe9a8');gr.addColorStop(1,sel?'#ff6f59':'#d9a43a');g.circle(x,y+4,22,'rgba(0,0,0,.3)');g.circle(x,y-6-(sel?8:0),24,gr)}});
 g.txt('のこり '+s.h.filter(v=>v).length+'本',W/2,850,28,'#ffe0b0')}});

// 85. リバーシ
const RN=6;
function rvFlips(b,r,c,p){if(b[r][c])return[];const out=[];for(const[dr,dc]of[[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]){const L=[];let R=r+dr,C=c+dc;while(R>=0&&R<RN&&C>=0&&C<RN&&b[R][C]===-p){L.push([R,C]);R+=dr;C+=dc}if(L.length&&R>=0&&R<RN&&C>=0&&C<RN&&b[R][C]===p)out.push(...L)}return out}
function rvNew(s){s.b=Array.from({length:RN},()=>new Array(RN).fill(0));s.b[2][2]=s.b[3][3]=-1;s.b[2][3]=s.b[3][2]=1;s.turn=1;s.cpuT=0;s.done=0;s.fl=Array.from({length:RN},()=>new Array(RN).fill(0))}
function rvValid(s,p){const m=[];for(let r=0;r<RN;r++)for(let c=0;c<RN;c++){const f=rvFlips(s.b,r,c,p);if(f.length)m.push([r,c,f])}return m}
reg({id:'reversi',name:'ミニリバーシ',genre:'リバーシ',color:'#2a9a4a',time:60,goal:200,
howto:'黒があなた。白をはさんで裏返そう\n6×6の盤でCPUと対戦',
init(){const s={};rvNew(s);return s},
update(s,g,dt){const{I,W}=g,cs=100,ox=(W-cs*RN)/2,oy=230;for(const row of s.fl)for(let i=0;i<RN;i++)row[i]=Math.max(0,row[i]-dt*4);
 if(s.done>0){s.done-=dt;if(s.done<=0)rvNew(s);return}
 const place=(r,c,f,p)=>{s.b[r][c]=p;for(const[R,C]of f){s.b[R][C]=p;s.fl[R][C]=1}g.tone(p>0?500:300,.06,'triangle',.15)};
 const end=()=>{let me=0,cp=0;for(const row of s.b)for(const v of row){if(v>0)me++;if(v<0)cp++}if(me>cp){g.add(100+(me-cp)*5,W/2,200);g.float('勝ち！ '+me+'対'+cp,W/2,860,'#ffe28a',44);g.sfx('win')}else{g.float((me===cp?'引き分け ':'負け ')+me+'対'+cp,W/2,860,'#ffffff',40);g.sfx('lose')}s.done=2};
 if(s.turn===1){const vm=rvValid(s,1);if(!vm.length){if(!rvValid(s,-1).length)return end();s.turn=-1;s.cpuT=.6;return}
  if(I.pressed){const c=Math.floor((I.x-ox)/cs),r=Math.floor((I.y-oy)/cs);const m=vm.find(x=>x[0]===r&&x[1]===c);if(m){place(r,c,m[2],1);g.add(m[2].length*3,I.x,I.y-40);s.turn=-1;s.cpuT=.6}}}
 else{s.cpuT-=dt;if(s.cpuT>0)return;const vm=rvValid(s,-1);if(!vm.length){if(!rvValid(s,1).length)return end();s.turn=1;return}
  const sc=m=>{const[r,c,f]=m,corner=(r===0||r===RN-1)&&(c===0||c===RN-1),x=(r===1||r===RN-2)&&(c===1||c===RN-2);return f.length+(corner?20:0)-(x?8:0)+Math.random()};vm.sort((a,b)=>sc(b)-sc(a));const[r,c,f]=vm[0];place(r,c,f,-1);s.turn=1}},
draw(s,g,c){const{W}=g,cs=100,ox=(W-cs*RN)/2,oy=230;g.bg('#1a2a1a','#0c160c');g.rrf(ox-16,oy-16,cs*RN+32,cs*RN+32,18,'#6b4a2a');g.rrf(ox,oy,cs*RN,cs*RN,4,'#1f8a4a');
 c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=2;for(let i=0;i<=RN;i++){c.beginPath();c.moveTo(ox+i*cs,oy);c.lineTo(ox+i*cs,oy+cs*RN);c.moveTo(ox,oy+i*cs);c.lineTo(ox+cs*RN,oy+i*cs);c.stroke()}
 const vm=s.turn===1&&!s.done?rvValid(s,1):[];for(const[r,cc]of vm)g.circle(ox+(cc+.5)*cs,oy+(r+.5)*cs,10,'rgba(255,255,255,.3)');
 let me=0,cp=0;for(let r=0;r<RN;r++)for(let cc=0;cc<RN;cc++){const v=s.b[r][cc];if(!v)continue;v>0?me++:cp++;const x=ox+(cc+.5)*cs,y=oy+(r+.5)*cs,sx=Math.abs(Math.cos(s.fl[r][cc]*Math.PI))||.05;c.save();c.translate(x,y);c.scale(sx,1);c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.arc(3,5,40,0,TAU);c.fill();const gr=c.createRadialGradient(-12,-14,4,0,0,42);gr.addColorStop(0,v>0?'#5a5a64':'#ffffff');gr.addColorStop(1,v>0?'#0c0c12':'#c8ccd8');g.circle(0,0,40,gr);c.restore()}
 g.circle(170,150,22,'#14141a');g.txt('あなた '+me,200,150,28,'#ffffff','left');g.circle(W-260,150,22,'#f4f4f8');g.txt('CPU '+cp,W-230,150,28,'#ffffff','left');if(s.turn<0&&!s.done)g.txt('CPUが考え中…',W/2,880,24,'rgba(255,255,255,.6)')}});

// 86. けん玉
const KCUP=[[-46,-40,10,'大皿'],[46,-40,20,'小皿'],[0,-118,50,'とめけん']];
reg({id:'kendama',name:'けん玉チャレンジ',genre:'けん玉',color:'#ff6f59',time:40,goal:300,
howto:'上にはじいて玉を打ち上げる\n左右に動かして皿やけん先で受け止めよう',
init(){return{kx:360,ky:760,b:{x:360,y:880,vx:0,vy:0},st:'hang',ct:0,cup:-1,ang:0,av:0}},
update(s,g,dt){const{W,I}=g,L=210,b=s.b;if(I.down)s.kx+=g.clamp(I.x-s.kx,-900*dt,900*dt);if(I.keys.ArrowLeft)s.kx-=500*dt;if(I.keys.ArrowRight)s.kx+=500*dt;s.kx=g.clamp(s.kx,120,W-120);const ax=s.kx,ay=s.ky;
 if(s.st==='caught'){s.ct-=dt;const cp=KCUP[s.cup];b.x=ax+cp[0];b.y=ay+cp[1]-24;if(s.ct<=0){s.st='hang';s.ang=0;s.av=0}return}
 if(s.st==='hang'){s.av+=(-9*Math.sin(s.ang)-(s.kx-(s.pkx||s.kx))*.8)*dt;s.av*=1-dt*.8;s.ang+=s.av*dt;s.pkx=s.kx;b.x=ax+Math.sin(s.ang)*L*.6;b.y=ay+Math.cos(s.ang)*L*.6;
  if((I.swipe&&I.swipe.dy<-60)||I.kp[' ']||I.kp.ArrowUp){const sp=I.swipe?Math.min(1500,Math.max(900,-I.swipe.dy/I.swipe.dt*.5)):1150;b.vx=(I.swipe?I.swipe.dx*.4:0);b.vy=-sp;s.st='fly';g.tone(400,.08,'triangle',.15,800)}return}
 const py=b.y;b.vy+=1500*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=1-dt*.5;const dx=b.x-ax,dy=b.y-ay,d=Math.hypot(dx,dy);if(d>L){b.x=ax+dx/d*L;b.y=ay+dy/d*L;const nx=dx/d,ny=dy/d,vn=b.vx*nx+b.vy*ny;if(vn>0){b.vx-=vn*nx;b.vy-=vn*ny}}
 if(b.vy>0)for(let i=0;i<3;i++){const cp=KCUP[i],cx=ax+cp[0],cy=ay+cp[1];if(Math.abs(b.x-cx)<(i===2?14:26)&&py<=cy-24&&b.y>=cy-24){s.st='caught';s.cup=i;s.ct=.7;g.add(cp[2],cx,cy-60);g.float(cp[3]+'！',cx,cy-100,'#ffe28a',30);g.sfx(i===2?'win':'good');g.burst(cx,cy-24,'#ffe28a',i===2?30:14,260,4);return}}
 if(b.vy>0&&b.y>ay+L*.55&&Math.abs(b.x-ax)<L*.4){s.st='hang';s.ang=Math.atan2(b.x-ax,b.y-ay);s.av=b.vx/200;g.tone(180,.06,'sine',.08)}},
draw(s,g,c){const{W,H}=g,b=s.b,ax=s.kx,ay=s.ky;g.bg('#f6efe2','#e8dcc6');c.fillStyle='rgba(160,120,80,.12)';for(let i=0;i<12;i++)c.fillRect(0,100+i*80,W,2);
 c.strokeStyle='rgba(60,40,30,.6)';c.lineWidth=2;c.beginPath();c.moveTo(ax,ay-30);c.quadraticCurveTo((ax+b.x)/2,Math.max(ay,b.y)+20,b.x,b.y);c.stroke();
 g.rrf(ax-12,ay-20,24,200,10,'#c98a4a');g.rrf(ax-62,ay-52,124,30,14,'#d9a05a');c.fillStyle='#a8743a';c.beginPath();c.moveTo(ax-62,ay-52);c.quadraticCurveTo(ax-46,ay-70,ax-30,ay-52);c.fill();c.beginPath();c.moveTo(ax+30,ay-52);c.quadraticCurveTo(ax+46,ay-64,ax+62,ay-52);c.fill();c.fillStyle='#c98a4a';c.beginPath();c.moveTo(ax-10,ay-52);c.lineTo(ax,ay-130);c.lineTo(ax+10,ay-52);c.fill();
 const gr=c.createRadialGradient(b.x-8,b.y-10,4,b.x,b.y,26);gr.addColorStop(0,'#ff8a70');gr.addColorStop(1,'#b8302a');g.circle(b.x,b.y,24,gr);c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.ellipse(b.x-8,b.y-10,7,4,-.5,0,TAU);c.fill();c.strokeStyle='#ffffff';c.lineWidth=3;c.beginPath();c.arc(b.x,b.y,16,1,2.4);c.stroke();
 if(s.st==='hang'){c.globalAlpha=.5+.5*Math.sin(g.time*5);g.txt('↑ 上にはじく',W/2,280,30,'#5a3a24');c.globalAlpha=1}KCUP.forEach((k,i)=>g.txt(k[3]+' '+k[2],140+i*220,170,20,'#5a3a24'))}});

// 87. ベーゴマ
function bgNew(s,g){s.me={x:360,y:700,vx:0,vy:0,spin:0,col:'#ff6f59',out:0};s.cpu={x:360,y:330,vx:g.rnd(-200,200),vy:g.rnd(80,200),spin:100,col:'#5b8cff',out:0};s.st='aim';s.rt=0}
reg({id:'beigoma',name:'ベーゴマバトル',genre:'コマ対戦',color:'#5b8cff',time:45,goal:300,
howto:'下からスワイプしてコマを投げこむ\n相手をはじき出すか回り勝ちをねらおう',
init(g){const s={wins:0};bgNew(s,g);return s},
update(s,g,dt){const{I}=g,C0=[360,520],R=280;if(s.st==='res'){s.rt-=dt;if(s.rt<=0)bgNew(s,g);return}
 if(s.st==='aim'){s.cpu.ang=(s.cpu.ang||0)+dt*20;if(I.swipe&&I.swipe.dy<-40){const k=.5/Math.max(.08,I.swipe.dt);s.me.vx=g.clamp(I.swipe.dx*k,-700,700);s.me.vy=g.clamp(I.swipe.dy*k,-900,-200);s.me.spin=Math.min(100,60+Math.hypot(s.me.vx,s.me.vy)/20);s.st='fight';g.noise(.2,.15,0,1500)}return}
 for(const t of[s.me,s.cpu]){const dx=t.x-C0[0],dy=t.y-C0[1],d=Math.hypot(dx,dy);t.vx-=dx*1.6*dt;t.vy-=dy*1.6*dt;const f=Math.pow(.6,dt);t.vx*=f;t.vy*=f;t.x+=t.vx*dt;t.y+=t.vy*dt;t.spin-=dt*(6+Math.hypot(t.vx,t.vy)/120);t.ang=(t.ang||0)+t.spin*dt*.3;if(d>R)t.out=1}
 if(s.cpu.spin>0&&s.me.spin>0){const a=s.me,b=s.cpu,dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<64&&d>0){const nx=dx/d,ny=dy/d,vr=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny,o=(64-d)/2;a.x-=nx*o;a.y-=ny*o;b.x+=nx*o;b.y+=ny*o;const kick=Math.max(Math.abs(vr),180)*(1+(a.spin-b.spin)/150);b.vx+=nx*kick*.9;b.vy+=ny*kick*.9;a.vx-=nx*kick*.6*(b.spin/a.spin);a.vy-=ny*kick*.6*(b.spin/a.spin);a.spin-=4;b.spin-=6;g.tone(900,.04,'square',.12);g.burst(a.x+nx*32,a.y+ny*32,'#ffe28a',8,240,3,0)}}
 const lose=s.me.out||s.me.spin<=0,win=s.cpu.out||s.cpu.spin<=0;if(win&&!lose){s.wins++;g.add(100,360,300);s.res='勝ち！';g.sfx('win')}else if(lose){s.res=win?'相打ち':'負け…';g.sfx(win?'good':'lose');if(win)g.add(30,360,300)}if(win||lose){s.st='res';s.rt=1.6}},
draw(s,g,c){const{W,H}=g,C0=[360,520],R=280;g.bg('#2a1a10','#140a06');const gr=c.createRadialGradient(C0[0],C0[1],20,C0[0],C0[1],R+30);gr.addColorStop(0,'#5a6a7a');gr.addColorStop(.85,'#3a4654');gr.addColorStop(1,'#1a2028');g.circle(C0[0],C0[1],R+30,'#8a6440');g.circle(C0[0],C0[1],R,gr);c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=2;for(let r=60;r<R;r+=60){c.beginPath();c.arc(C0[0],C0[1],r,0,TAU);c.stroke()}
 const top=(t)=>{if(t.out)return;c.save();c.translate(t.x,t.y);c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(4,8,34,14,0,0,TAU);c.fill();c.rotate(t.ang||0);g.poly(0,0,32,6,0);const tg=c.createRadialGradient(-8,-8,3,0,0,34);tg.addColorStop(0,g.shade(t.col,.5));tg.addColorStop(1,g.shade(t.col,-.35));c.fillStyle=tg;c.fill();c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=3;c.beginPath();c.moveTo(-24,0);c.lineTo(24,0);c.moveTo(0,-24);c.lineTo(0,24);c.stroke();g.circle(0,0,8,'#d8dce8');c.restore();
  g.rrf(t.x-34,t.y+40,68,8,4,'rgba(0,0,0,.4)');g.rrf(t.x-34,t.y+40,68*Math.max(0,t.spin)/100,8,4,t.col)};
 top(s.cpu);if(s.st!=='aim')top(s.me);else{c.globalAlpha=.6+.4*Math.sin(g.time*5);g.txt('↑ 下からスワイプして投げる',W/2,880,28,'#ffe0b0');c.globalAlpha=1}
 if(s.st==='res')g.txt(s.res,W/2,140,56,'#ffe28a','center',g.FD,400);g.txt('勝ち '+s.wins,W/2,H-30,22,'#ffe0b0')}});

// 88. 宝さがし
function tsNew(s,g){s.t=[];while(s.t.length<3){const i=g.ri(0,63);if(!s.t.includes(i))s.t.push(i)}s.dug=new Map();s.left=16;s.found=0;s.done=0}
reg({id:'treasure',name:'たからさがし',genre:'宝さがし',color:'#ffc857',time:45,goal:300,
howto:'砂浜をタップしてほる。数字は一番近い宝までの距離\n少ない回数で3つの宝を見つけよう',
init(g){const s={};tsNew(s,g);return s},
update(s,g,dt){const{I,W}=g,cs=80,ox=(W-cs*8)/2,oy=220;if(s.done>0){s.done-=dt;if(s.done<=0)tsNew(s,g);return}if(!I.pressed)return;const c=Math.floor((I.x-ox)/cs),r=Math.floor((I.y-oy)/cs);if(c<0||c>7||r<0||r>7)return;const i=r*8+c;if(s.dug.has(i))return;
 s.left--;if(s.t.includes(i)){s.dug.set(i,-1);s.found++;g.add(50+s.left*3,ox+(c+.5)*cs,oy+r*cs);g.sfx('win');g.burst(ox+(c+.5)*cs,oy+(r+.5)*cs,'#ffe28a',30,300,5);if(s.found===3){g.add(50,W/2,200);g.float('ぜんぶ見つけた！',W/2,560,'#ffe28a',44);s.done=1.4;return}}
 else{let m=99;for(const t of s.t){if(s.dug.get(t)===-1)continue;m=Math.min(m,Math.abs(t%8-c)+Math.abs(Math.floor(t/8)-r))}s.dug.set(i,m);g.noise(.12,.15,0,800)}
 if(s.left<=0&&s.found<3){g.float('ほる回数切れ…',W/2,560,'#ffffff',40);g.sfx('lose');for(const t of s.t)if(!s.dug.has(t))s.dug.set(t,-2);s.done=1.6}},
draw(s,g,c){const{W}=g,cs=80,ox=(W-cs*8)/2,oy=220;g.bg('#7fd6ff','#f2dca8');c.fillStyle='#2aa0d0';c.fillRect(0,90,W,90);c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=3;c.beginPath();for(let x=0;x<=W;x+=20)c.lineTo(x,180+Math.sin(x*.05+g.time*2)*5);c.stroke();
 for(let i=0;i<64;i++){const x=ox+(i%8)*cs,y=oy+Math.floor(i/8)*cs,d=s.dug.get(i);if(d===undefined){c.fillStyle=(i+Math.floor(i/8))%2?'#ecd29a':'#e6c88c';c.fillRect(x,y,cs,cs);c.fillStyle='rgba(160,120,60,.25)';c.fillRect(x+20,y+30,6,3);c.fillRect(x+50,y+54,8,3);continue}
  c.fillStyle='#b8925a';c.fillRect(x,y,cs,cs);c.fillStyle='#8a6a3a';c.beginPath();c.ellipse(x+cs/2,y+cs/2,30,22,0,0,TAU);c.fill();
  if(d<0){g.rrf(x+14,y+22,52,38,6,d===-1?'#c98a2a':'#7a5a2a');g.rrf(x+14,y+16,52,14,6,d===-1?'#e0a94a':'#8a6a3a');if(d===-1){g.glow('#ffe28a',16);g.star(x+cs/2,y+40,10,4);c.fillStyle='#fff1a8';c.fill();g.noglow()}}
  else{const col=d<=1?'#ff3b3b':d<=2?'#ff9f43':d<=4?'#ffc857':'#5b8cff';g.txt(String(d),x+cs/2,y+cs/2+2,40,col,'center',g.FD,400)}}
 c.strokeStyle='rgba(120,90,50,.3)';c.lineWidth=1;c.strokeRect(ox,oy,cs*8,cs*8);
 g.txt('のこり '+s.left+'回　宝 '+s.found+' / 3',W/2,910,26,'#5a3a1a')}});

// 89. 潜水
function dvItems(s,g){s.items=Array.from({length:10},()=>{const y=g.rnd(420,900);return{x:g.rnd(60,660),y,v:y>750?40:y>600?20:10,k:y>750?2:y>600?1:0}})}
reg({id:'dive',name:'しんかいダイバー',genre:'潜水',color:'#2ec4b6',time:50,goal:300,
howto:'ドラッグした方へ泳ぐ。酸素は水面で回復\n拾った宝は水面にもどると得点になる',
init(g){const s={x:360,y:150,o2:100,bag:0,bagN:0,sh:[{x:100,y:560,d:1},{x:600,y:780,d:-1}],t:0};dvItems(s,g);return s},
update(s,g,dt){const{W,H,I}=g;s.t+=dt;let tx=s.x,ty=s.y;if(I.down){tx=I.x;ty=I.y}const k=I.keys;if(k.ArrowLeft)tx-=999;if(k.ArrowRight)tx+=999;if(k.ArrowUp)ty-=999;if(k.ArrowDown)ty+=999;
 const dx=tx-s.x,dy=ty-s.y,l=Math.hypot(dx,dy),m=Math.min(l,260*dt);if(l>1){s.x+=dx/l*m;s.y+=dy/l*m;s.face=dx>=0?1:-1}s.x=g.clamp(s.x,30,W-30);s.y=g.clamp(s.y,150,H-40);
 const under=s.y>200;if(under)s.o2-=dt*(7+s.bagN*1.2);else{s.o2=Math.min(100,s.o2+dt*60);if(s.bag){g.add(s.bag,s.x,s.y-40,'#ffe28a');g.sfx('win');s.bag=0;s.bagN=0}}
 for(const it of s.items)if(!it.got&&g.dist(it.x,it.y,s.x,s.y)<40){it.got=1;s.bag+=it.v;s.bagN++;g.tone(700+it.k*200,.06,'triangle',.15);g.burst(it.x,it.y,'#9fe8ff',10,200,3,-100)}
 if(s.items.every(i=>i.got))dvItems(s,g);
 for(const sh of s.sh){sh.x+=sh.d*(110+g.time*1.5)*dt;if(sh.x<-60||sh.x>W+60){sh.d*=-1;sh.y=g.rnd(450,880)}if(g.dist(sh.x,sh.y,s.x,s.y)<50&&s.bag>0){g.float('宝を落とした！',s.x,s.y-50,'#ff6f59',30);g.sfx('bad');g.shake(10);s.bag=0;s.bagN=0}}
 if(s.o2<=0){g.float('酸素切れ！',W/2,400,'#ff6f59',44);g.sfx('lose');s.bag=0;s.bagN=0;s.x=360;s.y=150;s.o2=100;g.add(-20)}},
draw(s,g,c){const{W,H}=g,t=s.t;let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#bfeaff');gr.addColorStop(.2,'#5fc8e8');gr.addColorStop(.21,'#1a8ab0');gr.addColorStop(.6,'#0a4a6e');gr.addColorStop(1,'#031a2e');c.fillStyle=gr;c.fillRect(0,0,W,H);
 c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.moveTo(0,200);for(let x=0;x<=W;x+=20)c.lineTo(x,196+Math.sin(x*.04+t*2)*5);c.lineTo(W,206);c.lineTo(0,206);c.fill();
 c.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const x0=80+i*150+Math.sin(t*.5+i)*20;c.fillStyle='rgba(180,240,255,.05)';c.beginPath();c.moveTo(x0-20,200);c.lineTo(x0+20,200);c.lineTo(x0+110,H);c.lineTo(x0+30,H);c.fill()}c.globalCompositeOperation='source-over';
 c.fillStyle='#2a2a20';c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=30)c.lineTo(x,H-30-Math.sin(x*.02)*14);c.lineTo(W,H);c.fill();
 for(const it of s.items){if(it.got)continue;if(it.k===2){g.rrf(it.x-20,it.y-14,40,28,6,'#a8743a');g.glow('#ffe28a',16);g.circle(it.x,it.y-12,6,'#ffe28a');g.noglow()}else if(it.k===1){c.fillStyle='#ff9ad5';c.beginPath();c.moveTo(it.x-18,it.y+8);c.quadraticCurveTo(it.x,it.y-28,it.x+18,it.y+8);c.fill();g.glow('#ffffff',12);g.circle(it.x,it.y-2,6,'#ffffff');g.noglow()}else{g.circle(it.x,it.y,9,'#ffc857')}}
 for(const sh of s.sh){c.save();c.translate(sh.x,sh.y);c.scale(sh.d,1);c.fillStyle='#5a6a7a';c.beginPath();c.ellipse(0,0,60,20,0,0,TAU);c.fill();c.beginPath();c.moveTo(-50,0);c.lineTo(-80,-22);c.lineTo(-76,22);c.fill();c.beginPath();c.moveTo(0,-16);c.lineTo(-12,-44);c.lineTo(16,-16);c.fill();g.circle(36,-4,3,'#ffffff');c.strokeStyle='#ffffff';c.lineWidth=2;c.beginPath();c.moveTo(30,8);c.lineTo(52,6);c.stroke();c.restore()}
 c.save();c.translate(s.x,s.y);c.scale(s.face||1,1);g.rrf(-30,-12,50,24,12,'#ff6f59');g.circle(26,-2,14,'#f3d0a8');g.rrf(18,-10,20,12,4,'rgba(160,220,255,.8)');g.rrf(-24,-22,30,12,6,'#ffc857');c.fillStyle='#2a2a34';c.beginPath();c.moveTo(-30,-6);c.lineTo(-56,-16+Math.sin(t*10)*8);c.lineTo(-56,8+Math.sin(t*10)*8);c.fill();c.restore();
 if(s.y>200&&Math.random()<.2)g.burst(s.x+20,s.y-14,'#bfeaff',1,40,3,-120);
 g.rrf(24,100,200,16,8,'rgba(0,0,0,.3)');g.rrf(24,100,200*s.o2/100,16,8,s.o2<30?'#ff6f59':'#9fe8ff');g.txt('酸素',24,130,18,'#ffffff','left');g.txt('もっている宝 '+s.bag+'点',W-24,110,22,'#ffe28a','right')}});
})();
