// Pack 3 — games 26-38
(()=>{const reg=MG.reg;const TAU=Math.PI*2;

// 26. ボウリング
const LX=210,LW=300;
function rackPins(s){s.pins=[];[[0],[-.5,.5],[-1,0,1],[-1.5,-.5,.5,1.5]].forEach((r,i)=>r.forEach(o=>s.pins.push({x:360+o*48,y:300-i*42,ox:360+o*48,oy:300-i*42,vx:0,vy:0,down:false,gone:false})))}
function resetBall(s,g){s.b={x:360,y:g.H-140,vx:0,vy:0,r:24,gut:false,roll:0};s.state='aim'}
reg({id:'bowling',name:'ストライク横丁',genre:'ボウリング',color:'#a98bff',time:50,goal:320,
howto:'ボールを左右に動かして\n上へスワイプして投げる',
init(g){const s={throwN:1,frame:1};rackPins(s);resetBall(s,g);return s},
update(s,g,dt){const{H,I}=g,b=s.b;
 if(s.state==='aim'){if(I.down)b.x=g.clamp(I.x,LX+b.r,LX+LW-b.r);if(I.keys.ArrowLeft)b.x-=300*dt;if(I.keys.ArrowRight)b.x+=300*dt;b.x=g.clamp(b.x,LX+b.r,LX+LW-b.r);
  let vx=0,vy=0;const T=I.trail;if(I.released&&T.length>1){const a=T[0],z=T[T.length-1],d=Math.max(.03,z.t-a.t);vx=(z.x-a.x)/d*.35;vy=(z.y-a.y)/d*.7}
  if(I.kp[' ']||I.kp.ArrowUp){vx=0;vy=-1100}
  if(vy<-300){const m=Math.hypot(vx,vy);if(m>1500){vx*=1500/m;vy*=1500/m}b.vx=vx;b.vy=Math.min(vy,-600);s.state='roll';g.sfx('jump')}return}
 if(s.state==='roll'){b.x+=b.vx*dt;b.y+=b.vy*dt;b.roll+=dt*Math.abs(b.vy)/24;
  if(!b.gut&&(b.x<LX+b.r-8||b.x>LX+LW-b.r+8)){b.gut=true;b.vx=0;b.x=b.x<360?LX-22:LX+LW+22;g.tone(120,.3,'sawtooth',.1)}
  if(b.y<110){s.state='settle';s.st=1.3}}
 if(s.state==='settle'){s.st-=dt;if(s.st<=0){const n=s.pins.filter(p=>p.down&&!p.gone).length,all=s.pins.every(p=>p.down);g.add(n*10,360,380);
  if(all&&s.throwN===1){g.add(50);g.float('ストライク！',360,520,'#ffe28a',56);g.sfx('win');g.burst(360,240,'#ffe28a',40,400,5)}else if(all){g.add(25);g.float('スペア！',360,520,'#9fe8ff',50);g.sfx('good')}
  if(s.throwN===1&&!all){s.throwN=2;for(const p of s.pins)if(p.down)p.gone=true}else{s.throwN=1;s.frame++;rackPins(s)}resetBall(s,g)}}
 const sub=3;for(let k=0;k<sub;k++){const h=dt/sub;
  for(const p of s.pins){if(p.gone)continue;p.x+=p.vx*h;p.y+=p.vy*h;const f=Math.pow(.25,h);p.vx*=f;p.vy*=f;if(!p.down&&g.dist(p.x,p.y,p.ox,p.oy)>6){p.down=true;g.tone(500+Math.random()*300,.05,'square',.08)}}
  if(s.state==='roll'&&!b.gut)for(const p of s.pins){if(p.gone)continue;const dx=p.x-b.x,dy=p.y-b.y,d=Math.hypot(dx,dy);if(d<b.r+13&&d>0){const nx=dx/d,ny=dy/d,vr=(p.vx-b.vx)*nx+(p.vy-b.vy)*ny;if(vr<0){const J=-(1.8)*vr/(1/5+1);p.vx+=J*nx;p.vy+=J*ny;b.vx-=J*nx/5;b.vy-=J*ny/5}p.x=b.x+nx*(b.r+13)}}
  for(let i=0;i<s.pins.length;i++)for(let j=i+1;j<s.pins.length;j++){const a=s.pins[i],c=s.pins[j];if(a.gone||c.gone)continue;const dx=c.x-a.x,dy=c.y-a.y,d=Math.hypot(dx,dy);if(d<26&&d>0){const nx=dx/d,ny=dy/d,vr=(c.vx-a.vx)*nx+(c.vy-a.vy)*ny;const o=(26-d)/2;a.x-=nx*o;a.y-=ny*o;c.x+=nx*o;c.y+=ny*o;if(vr<0){const J=-.9*vr;a.vx-=J*nx;a.vy-=J*ny;c.vx+=J*nx;c.vy+=J*ny}}}}},
draw(s,g,c){const{W,H}=g,b=s.b;g.bg('#1b1430','#0c0918');
 c.fillStyle='#2b2140';c.fillRect(LX-48,90,LW+96,H-90);c.fillStyle='#120e1d';c.fillRect(LX-40,90,36,H-90);c.fillRect(LX+LW+4,90,36,H-90);
 const gr=c.createLinearGradient(LX,0,LX+LW,0);gr.addColorStop(0,'#c89a5e');gr.addColorStop(.5,'#ebc68e');gr.addColorStop(1,'#c89a5e');c.fillStyle=gr;c.fillRect(LX,90,LW,H-90);
 c.strokeStyle='rgba(120,70,30,.18)';c.lineWidth=1;for(let x=LX;x<LX+LW;x+=15){c.beginPath();c.moveTo(x,90);c.lineTo(x,H);c.stroke()}
 c.globalCompositeOperation='lighter';const lg=c.createLinearGradient(0,90,0,H);lg.addColorStop(0,'rgba(255,255,255,.25)');lg.addColorStop(.4,'rgba(255,255,255,0)');c.fillStyle=lg;c.fillRect(LX,90,LW,H-90);c.globalCompositeOperation='source-over';
 c.fillStyle='#7a3b1a';for(let i=0;i<7;i++){const x=LX+30+i*40,y=620-Math.abs(i-3)*14;c.beginPath();c.moveTo(x,y-14);c.lineTo(x-8,y+6);c.lineTo(x+8,y+6);c.fill()}
 for(const p of s.pins){if(p.gone)continue;if(p.down){c.save();c.globalAlpha=.7;c.translate(p.x,p.y);c.rotate(Math.atan2(p.vy,p.vx)+1.2);c.fillStyle='#f4f1ea';c.beginPath();c.ellipse(0,0,10,24,0,0,TAU);c.fill();c.fillStyle='#e63946';c.fillRect(-10,-8,20,5);c.restore();continue}
  c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.arc(p.x+3,p.y+4,14,0,TAU);c.fill();const pg=c.createRadialGradient(p.x-4,p.y-4,2,p.x,p.y,14);pg.addColorStop(0,'#ffffff');pg.addColorStop(1,'#d8d2c6');g.circle(p.x,p.y,13,pg);c.strokeStyle='#e63946';c.lineWidth=3;c.beginPath();c.arc(p.x,p.y,7,0,TAU);c.stroke()}
 c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.arc(b.x+4,b.y+6,b.r,0,TAU);c.fill();const bg=c.createRadialGradient(b.x-8,b.y-8,3,b.x,b.y,b.r);bg.addColorStop(0,'#c9a8ff');bg.addColorStop(1,'#3a1d6e');g.circle(b.x,b.y,b.r,bg);
 const hy=Math.sin(b.roll)*10;for(const[ox,oy]of[[-6,-6],[6,-6],[0,6]]){if(Math.cos(b.roll)>-.2)g.circle(b.x+ox,b.y+oy+hy*.4,3.5,'#1b0d33')}
 if(s.state==='aim'){c.globalAlpha=.5+.5*Math.sin(g.time*5);g.txt('↑ スワイプで投げる',360,b.y-60,22,'#ffffff');c.globalAlpha=1}
 g.txt('フレーム '+s.frame+'　'+s.throwN+'投目',W/2,114,20,'rgba(255,255,255,.8)');g.txt('倒した '+s.pins.filter(p=>p.down).length+'本',W/2,H-40,22,'#ffe28a')}});

// 27. アーチェリー
reg({id:'archery',name:'風よみアーチェリー',genre:'アーチェリー',color:'#ffc857',time:40,goal:450,
howto:'押して狙い、長く押すほど強く引ける\n離して発射。風に注意',
init(g){return{tx:360,ty:380,tr:150,p:0,hold:false,ax:360,ay:380,wind:g.rnd(-1,1),arrows:[],fly:null,shots:0,t:0}},
update(s,g,dt){const{W,I}=g;s.t+=dt;if(s.shots>=4){s.tx=360+Math.sin(s.t*.8)*150}
 if(s.fly){s.fly.t+=dt;if(s.fly.t>=.35){const f=s.fly,d=g.dist(f.x,f.y,s.tx,s.ty),ring=10-Math.floor(d/(s.tr/10));s.arrows.push({dx:f.x-s.tx,dy:f.y-s.ty});if(s.arrows.length>12)s.arrows.shift();
   if(ring>=1){const p=ring*5;g.add(p,f.x,f.y-40,ring>=9?'#ffe28a':'#ffffff');g.sfx(ring>=9?'good':'hit');if(ring===10)g.float('ど真ん中！',W/2,250,'#ffe28a',46);g.burst(f.x,f.y,'#ffe28a',ring*2,200,3)}else{g.float('はずれ',f.x,f.y-40,'#ff6f59',28);g.sfx('bad')}
   s.fly=null;s.shots++;s.wind=g.rnd(-1,1)*(1+s.shots*.08)}return}
 if(I.pressed){s.hold=true;s.p=0}
 if(s.hold){s.p=Math.min(1.3,s.p+dt*1.1);s.ax=I.x;s.ay=I.y-150;if(I.released||!I.down){s.hold=false;const sw=swayOf(s),x=s.ax+sw[0]+s.wind*45,y=s.ay+sw[1]+(1-Math.min(1,s.p))*90;s.fly={x,y,t:0};g.noise(.15,.2,0,2500)}}},
draw(s,g,c){const{W,H}=g;let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#8fd3ff');gr.addColorStop(.55,'#d6f0ff');gr.addColorStop(.56,'#7fbf5a');gr.addColorStop(1,'#3f7d3a');c.fillStyle=gr;c.fillRect(0,0,W,H);
 c.fillStyle='#6aa86a';c.beginPath();c.moveTo(0,530);for(let x=0;x<=W;x+=20)c.lineTo(x,500-Math.sin(x*.01)*40-Math.sin(x*.03)*10);c.lineTo(W,540);c.fill();
 c.strokeStyle='#6b4a2a';c.lineWidth=12;c.beginPath();c.moveTo(s.tx-80,s.ty+120);c.lineTo(s.tx-40,s.ty);c.moveTo(s.tx+80,s.ty+120);c.lineTo(s.tx+40,s.ty);c.stroke();
 const rc=['#ffffff','#ffffff','#222222','#222222','#3a8dde','#3a8dde','#e63946','#e63946','#ffd23f','#ffd23f'];for(let i=0;i<10;i++){g.circle(s.tx,s.ty,s.tr*(1-i/10),rc[i]);c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1;c.beginPath();c.arc(s.tx,s.ty,s.tr*(1-i/10),0,TAU);c.stroke()}
 for(const a of s.arrows){const x=s.tx+a.dx,y=s.ty+a.dy;g.circle(x,y,4,'#5a3a1a');c.strokeStyle='#6b4a2a';c.lineWidth=3;c.beginPath();c.moveTo(x,y);c.lineTo(x+10,y+22);c.stroke();c.fillStyle='#ff6f59';c.beginPath();c.moveTo(x+8,y+18);c.lineTo(x+18,y+26);c.lineTo(x+10,y+30);c.fill()}
 const fx=40+Math.sin(g.time*6)*3;c.strokeStyle='#ffffff';c.lineWidth=4;c.beginPath();c.moveTo(fx,560);c.lineTo(fx,440);c.stroke();c.fillStyle='#ff6f59';c.beginPath();c.moveTo(fx,440);c.lineTo(fx+s.wind*70,450+Math.sin(g.time*8)*4);c.lineTo(fx,470);c.fill();g.txt('風 '+(s.wind>0?'→':'←')+' '+Math.abs(s.wind*10).toFixed(0),fx+10,590,20,'#ffffff','left');
 if(s.fly){const k=s.fly.t/.35,x=g.lerp(W/2,s.fly.x,k),y=g.lerp(H-120,s.fly.y,k);c.strokeStyle='#6b4a2a';c.lineWidth=6*(1-k)+2;c.beginPath();c.moveTo(x,y);c.lineTo(x+(W/2-s.fly.x)*.12*(1-k),y+80*(1-k)+10);c.stroke()}
 if(s.hold){const sw=swayOf(s),x=s.ax+sw[0],y=s.ay+sw[1],full=s.p>=1;c.strokeStyle=full?'#ff6f59':'#ffffff';c.lineWidth=3;c.beginPath();c.arc(x,y,26,0,TAU);c.moveTo(x-40,y);c.lineTo(x+40,y);c.moveTo(x,y-40);c.lineTo(x,y+40);c.stroke()}
 const pull=s.hold?Math.min(1,s.p):0;c.strokeStyle='#5a3a1a';c.lineWidth=10;c.beginPath();c.arc(W/2,H-60,150,Math.PI*1.15,Math.PI*1.85);c.stroke();c.strokeStyle='#f4f1ea';c.lineWidth=2;const lx=W/2+Math.cos(Math.PI*1.15)*150,ly=H-60+Math.sin(Math.PI*1.15)*150,rx=W/2+Math.cos(Math.PI*1.85)*150;c.beginPath();c.moveTo(lx,ly);c.lineTo(W/2,ly+30+pull*60);c.lineTo(rx,ly);c.stroke();
 g.rrf(W/2-100,H-30,200,12,6,'rgba(0,0,0,.3)');g.rrf(W/2-100,H-30,200*Math.min(1,pull),12,6,pull>=1?'#ff6f59':'#ffc857')}});
function swayOf(s){const A=16*(1-Math.min(1,s.p)*.6)+(s.p>1.15?24:0);return[Math.sin(s.t*1.7)*A+Math.sin(s.t*3.1)*A*.4,Math.cos(s.t*1.3)*A*.8]}

// 28. 色彩感覚
function oddGen(s,g){s.n=Math.min(8,3+Math.floor(s.lv/2));s.d=Math.max(5,36-s.lv*2.4);s.h=g.ri(0,359);s.odd=g.ri(0,s.n*s.n-1);s.sat=g.ri(55,80);s.lit=g.ri(45,60);s.flip=g.rnd()<.5}
reg({id:'odd',name:'ひとつだけ違う色',genre:'色彩感覚',color:'#ff7ab6',time:40,goal:300,
howto:'1枚だけ色が違うタイルをさがして\nタップしよう',
init(g){const s={lv:0,hint:0,pop:0};oddGen(s,g);return s},
update(s,g,dt){const{I,W}=g,size=600,ox=(W-size)/2,oy=220;s.hint=Math.max(0,s.hint-dt);s.pop=Math.max(0,s.pop-dt*3);
 if(I.pressed){const ts=size/s.n,c=Math.floor((I.x-ox)/ts),r=Math.floor((I.y-oy)/ts);if(c<0||r<0||c>=s.n||r>=s.n)return;
  if(r*s.n+c===s.odd){g.add(10+s.lv,I.x,I.y-40);g.sfx('good');g.burst(I.x,I.y,'hsl('+s.h+',80%,65%)',16,260,4);s.lv++;oddGen(s,g);s.pop=1}else{g.add(-5,I.x,I.y-40);g.sfx('bad');g.shake(8);s.hint=.4}}},
draw(s,g,c){const{W}=g,size=600,ox=(W-size)/2,oy=220,ts=size/s.n,gap=Math.max(4,ts*.08);g.bg('#f7f1ff','#e6dcf5');
 g.txt('レベル '+(s.lv+1),W/2,150,36,'#3a2a5a','center',g.FD,400);
 const base='hsl('+s.h+','+s.sat+'%,'+s.lit+'%)',oddc='hsl('+s.h+','+s.sat+'%,'+(s.lit+(s.flip?s.d/2.4:-s.d/2.4))+'%)';const sc=1+s.pop*.03;
 c.save();c.translate(W/2,oy+size/2);c.scale(sc,sc);c.translate(-W/2,-(oy+size/2));
 for(let r=0;r<s.n;r++)for(let cc=0;cc<s.n;cc++){const i=r*s.n+cc,x=ox+cc*ts+gap/2,y=oy+r*ts+gap/2;c.fillStyle='rgba(60,40,90,.12)';g.rr(x+2,y+4,ts-gap,ts-gap,ts*.18);c.fill();g.rrf(x,y,ts-gap,ts-gap,ts*.18,i===s.odd?oddc:base);g.rrf(x+ts*.1,y+ts*.08,ts*.4,ts*.08,ts*.04,'rgba(255,255,255,.25)');
  if(i===s.odd&&s.hint>0){c.strokeStyle='#ffffff';c.lineWidth=4;g.rr(x,y,ts-gap,ts-gap,ts*.18);c.stroke()}}
 c.restore()}});

// 29. スイング
function anchors(s,g,upto){while(s.lastAx<upto){s.lastAx+=g.rnd(250,340);s.an.push({x:s.lastAx,y:g.rnd(170,330)});if(Math.random()<.5)s.ban.push({x:s.lastAx+g.rnd(60,160),y:g.rnd(380,620),got:false})}}
reg({id:'swing',name:'ジャングルスイング',genre:'スイング',color:'#9be15d',time:40,goal:400,
howto:'タップでロープを離す・もう一度タップで\n近くのリングをつかむ。落ちないように',
init(g){const s={an:[{x:300,y:250}],ban:[],lastAx:300,att:null,L:230,th:-1.1,om:0,px:0,py:0,vx:0,vy:0,best:0,bonus:0,cam:0,grace:0};s.att=s.an[0];anchors(s,g,2000);s.px=300+Math.sin(s.th)*230;s.py=250+Math.cos(s.th)*230;return s},
update(s,g,dt){const{W,H,I}=g,G=1500;const tap=I.pressed||I.kp[' '];
 if(s.att){s.om+=-(G/s.L)*Math.sin(s.th)*dt;s.om*=1-dt*.03;s.th+=s.om*dt;s.px=s.att.x+s.L*Math.sin(s.th);s.py=s.att.y+s.L*Math.cos(s.th);s.vx=s.L*s.om*Math.cos(s.th);s.vy=-s.L*s.om*Math.sin(s.th);
  if(tap){s.att=null;s.vx*=1.15;s.vy*=1.15;g.sfx('jump')}}
 else{s.vy+=G*dt;s.px+=s.vx*dt;s.py+=s.vy*dt;
  if(tap){let best=null,bd=380;for(const a of s.an){const d=g.dist(a.x,a.y,s.px,s.py);if(a.x>s.px-60&&d<bd&&a.y<s.py){bd=d;best=a}}
   if(best){s.att=best;s.L=g.clamp(bd,120,360);s.th=Math.atan2(s.px-best.x,s.py-best.y);s.om=(s.vx*Math.cos(s.th)-s.vy*Math.sin(s.th))/s.L;g.tone(500,.06,'triangle',.15)}else g.tone(200,.08,'sine',.1)}}
 for(const b of s.ban)if(!b.got&&g.dist(b.x,b.y,s.px,s.py)<44){b.got=true;s.bonus+=20;g.float('+20',b.x-s.cam,b.y-30,'#ffe28a');g.sfx('coin')}
 s.cam+=(s.px-260-s.cam)*Math.min(1,dt*4);anchors(s,g,s.cam+W+400);s.an=s.an.filter(a=>a.x>s.cam-400||a===s.att);s.ban=s.ban.filter(b=>b.x>s.cam-100);
 s.best=Math.max(s.best,s.px-300);g.score=Math.floor(s.best/10)+s.bonus;
 if(s.py>H+60){g.sfx('lose');g.burst(s.px-s.cam,H-40,'#9fe8ff',30,300,5);g.over('川に落ちた！')}},
draw(s,g,c){const{W,H}=g,cam=s.cam,t=g.time;let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#ff9a5a');gr.addColorStop(.5,'#3a8a7a');gr.addColorStop(1,'#123a34');c.fillStyle=gr;c.fillRect(0,0,W,H);
 g.glow('#ffd36b',50);g.circle(W*.25,200,70,'#ffe0a0');g.noglow();
 for(let L=0;L<3;L++){const k=.2+L*.25,col=['#2a6a5a','#1d5045','#123a32'][L];c.fillStyle=col;for(let i=-1;i<8;i++){const x=((i*170-cam*k)%1190+1190)%1190-120,h=260+((i*53)%5)*40+L*60;c.fillRect(x+40,H-h,20,h);c.beginPath();c.arc(x+50,H-h,70+L*10,0,TAU);c.fill()}}
 c.fillStyle='#1a5a7a';c.fillRect(0,H-80,W,80);c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=2;for(let x=0;x<W;x+=40){c.beginPath();c.moveTo(x+((t*30)%40),H-60);c.lineTo(x+20+((t*30)%40),H-60);c.stroke()}
 for(const a of s.an){const x=a.x-cam;if(x<-40||x>W+40)continue;c.strokeStyle='#3d6b2a';c.lineWidth=5;c.beginPath();c.moveTo(x,0);c.lineTo(x,a.y-16);c.stroke();g.glow('#ffc857',a===s.att?20:8);c.strokeStyle='#c9944e';c.lineWidth=7;c.beginPath();c.arc(x,a.y,16,0,TAU);c.stroke();g.noglow()}
 for(const b of s.ban){if(b.got)continue;const x=b.x-cam;c.save();c.translate(x,b.y+Math.sin(t*3+b.x)*6);c.rotate(.5);c.strokeStyle='#ffd23f';c.lineWidth=10;c.lineCap='round';c.beginPath();c.arc(0,0,16,.3,2.4);c.stroke();c.restore()}
 const px=s.px-cam,py=s.py;if(s.att){c.strokeStyle='#8a6a3a';c.lineWidth=4;c.beginPath();c.moveTo(s.att.x-cam,s.att.y);c.lineTo(px,py);c.stroke()}
 const ang=s.att?-s.th:Math.atan2(s.vy,s.vx)*.3;c.save();c.translate(px,py);c.rotate(ang);g.circle(0,0,24,'#8a5a3c');g.circle(0,4,15,'#f3d9b1');g.circle(-6,-2,3,'#1b1220');g.circle(6,-2,3,'#1b1220');g.circle(-22,-6,8,'#8a5a3c');g.circle(22,-6,8,'#8a5a3c');c.strokeStyle='#1b1220';c.lineWidth=2;c.beginPath();c.arc(0,6,5,.2,Math.PI-.2);c.stroke();c.restore();
 g.txt(Math.floor(s.best/10)+'m',W-24,110,28,'#ffffff','right',g.FD,400)}});

// 30. ピンボール
const PW=[[40,190,120,100],[120,100,600,100],[600,100,680,190],[40,190,40,700],[680,190,680,700],[40,700,240,836,10],[680,700,480,836,10],[600,190,600,620]];
const BMP=[{x:250,y:320,r:36},{x:440,y:300,r:36},{x:345,y:450,r:40}];
function flipSeg(f){const a=f.side<0?f.a:Math.PI-f.a;return[f.x,f.y,f.x+Math.cos(a)*110,f.y+Math.sin(a)*110]}
reg({id:'pinball',name:'ネオンピンボール',genre:'ピンボール',color:'#ff7ab6',time:50,goal:500,
howto:'画面の左半分で左・右半分で右フリッパー\n両手で同時押しもOK（←→キー可）',
init(g){return{b:{x:640,y:600,vx:0,vy:-1300},fl:[{x:240,y:836,side:-1,a:.5,pa:.5,w:0},{x:480,y:836,side:1,a:.5,pa:.5,w:0}],hit:[0,0,0],stars:[{x:180,y:180,on:false},{x:300,y:160,on:false},{x:420,y:160,on:false},{x:540,y:180,on:false}],wait:0,lane:true}},
update(s,g,dt){const{W,H,I}=g,b=s.b,R=13;const T=I.down?(I.touches&&I.touches.length?I.touches:[[I.x,I.y]]):[];const L=I.keys.ArrowLeft||I.keys.z||T.some(t=>t[0]<W/2),Rr=I.keys.ArrowRight||I.keys.m||T.some(t=>t[0]>=W/2);
 for(const f of s.fl){const on=f.side<0?L:Rr;f.pa=f.a;const tgt=on?-.45:.5;f.a+=Math.sign(tgt-f.a)*Math.min(Math.abs(tgt-f.a),(on?16:9)*dt);f.w=(f.a-f.pa)/Math.max(dt,.001)*(f.side<0?1:-1);if(on&&f.pa>=.49&&f.a<.49)g.tone(180,.05,'square',.1)}
 for(let i=0;i<3;i++)s.hit[i]=Math.max(0,s.hit[i]-dt*4);
 if(s.wait>0){s.wait-=dt;if(s.wait<=0){b.x=640;b.y=640;b.vx=0;b.vy=-1350}return}
 const sub=6,h=dt/sub;for(let k=0;k<sub;k++){b.vy+=1300*h;b.x+=b.vx*h;b.y+=b.vy*h;
  const col=(x1,y1,x2,y2,e,thick,sv)=>{const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy,t=g.clamp(((b.x-x1)*dx+(b.y-y1)*dy)/l,0,1),cx=x1+dx*t,cy=y1+dy*t,ex=b.x-cx,ey=b.y-cy,d=Math.hypot(ex,ey);if(d<R+thick&&d>0){const nx=ex/d,ny=ey/d;b.x=cx+nx*(R+thick);b.y=cy+ny*(R+thick);let svx=0,svy=0;if(sv){svx=sv(cx,cy)[0];svy=sv(cx,cy)[1]}const vn=(b.vx-svx)*nx+(b.vy-svy)*ny;if(vn<0){b.vx-=(1+e)*vn*nx;b.vy-=(1+e)*vn*ny}return true}return false};
  for(const w of PW){if(w[0]===600&&w[2]===600&&!s.lane)continue;col(w[0],w[1],w[2],w[3],.5,w[4]||0)}
  for(const f of s.fl){const sg=flipSeg(f),om=f.w*(f.side<0?1:-1);col(sg[0],sg[1],sg[2],sg[3],.3,10,(cx,cy)=>[-om*(cy-f.y),om*(cx-f.x)])}
  BMP.forEach((m,i)=>{const dx=b.x-m.x,dy=b.y-m.y,d=Math.hypot(dx,dy);if(d<m.r+R&&d>0){const nx=dx/d,ny=dy/d;b.x=m.x+nx*(m.r+R);b.y=m.y+ny*(m.r+R);const sp=Math.max(700,Math.hypot(b.vx,b.vy));b.vx=nx*sp;b.vy=ny*sp;if(s.hit[i]<.5){s.hit[i]=1;g.add(10,m.x,m.y-50,'#ff9ad5');g.tone(700+i*150,.08,'square',.12);g.burst(b.x,b.y,'#ff9ad5',8,220,3,0)}}});
  for(const st of s.stars)if(!st.on&&g.dist(b.x,b.y,st.x,st.y)<R+16){st.on=true;g.add(25,st.x,st.y-30,'#ffe28a');g.sfx('coin');if(s.stars.every(q=>q.on)){g.add(100,W/2,250);g.float('オールスター！',W/2,560,'#ffe28a',44);g.sfx('win');s.stars.forEach(q=>q.on=false)}}
  const sp=Math.hypot(b.vx,b.vy);if(sp>1900){b.vx*=1900/sp;b.vy*=1900/sp}}
 if(b.x<600&&b.y<620)s.lane=true;if(b.x>600&&b.y>620)s.lane=false;
 if(Math.hypot(b.vx,b.vy)<40)s.still=(s.still||0)+dt;else s.still=0;
 if(s.still>1.2){s.still=0;b.vy=-950;b.vx=b.x<W/2?g.rnd(150,350):-g.rnd(150,350);b.y-=6;g.shake(10);g.float('台をゆらした！',W/2,560,'#9fe8ff',34);g.tone(160,.15,'sawtooth',.12)}
 if(b.y>H+30){g.add(-20,W/2,H-120);g.sfx('lose');s.wait=.9;s.lane=false}},
draw(s,g,c){const{W,H}=g,b=s.b;g.bg('#1a0a2e','#0a0418');
 c.fillStyle='rgba(255,122,182,.05)';for(let y=100;y<H;y+=40)for(let x=60;x<680;x+=40)if((x+y)%80===0)c.fillRect(x,y,20,20);
 c.globalCompositeOperation='lighter';g.glow('#5b8cff',16);c.strokeStyle='#7aa2ff';c.lineWidth=6;c.lineCap='round';for(const w of PW){c.beginPath();c.moveTo(w[0],w[1]);c.lineTo(w[2],w[3]);c.stroke()}
 BMP.forEach((m,i)=>{g.glow('#ff7ab6',20+s.hit[i]*30);g.circle(m.x,m.y,m.r,s.hit[i]>0?'#ff9ad5':'rgba(255,122,182,.35)');c.strokeStyle='#ff7ab6';c.lineWidth=5;c.beginPath();c.arc(m.x,m.y,m.r,0,TAU);c.stroke();g.circle(m.x,m.y,m.r*.4,'#ffd6ea')});
 for(const st of s.stars){g.glow('#ffc857',st.on?24:6);g.star(st.x,st.y,16,7);c.fillStyle=st.on?'#ffe28a':'rgba(255,200,87,.35)';c.fill()}
 c.globalCompositeOperation='source-over';g.noglow();
 for(const f of s.fl){const sg=flipSeg(f);c.lineCap='round';c.strokeStyle='#8a5a1a';c.lineWidth=24;c.beginPath();c.moveTo(sg[0],sg[1]+3);c.lineTo(sg[2],sg[3]+3);c.stroke();c.strokeStyle='#ffc857';c.lineWidth=20;c.beginPath();c.moveTo(sg[0],sg[1]);c.lineTo(sg[2],sg[3]);c.stroke();g.circle(sg[0],sg[1],8,'#fff3df')}
 if(s.wait<=0){g.glow('#ffffff',14);const gr=c.createRadialGradient(b.x-4,b.y-4,2,b.x,b.y,13);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#8a92a8');g.circle(b.x,b.y,13,gr);g.noglow()}
 g.txt('左',W/4,H-30,22,'rgba(255,255,255,.3)');g.txt('右',W*3/4,H-30,22,'rgba(255,255,255,.3)')}});

// 31. クレーン
const PRZ=[['#ff9ad5',10],['#8fe0ff',10],['#ffd36b',20],['#9be15d',15],['#c9a8ff',30]];
function prize(g){const k=g.ri(0,4);return{x:g.rnd(220,620),y:860-34,r:g.rnd(30,40),col:PRZ[k][0],val:PRZ[k][1],vy:0,ear:Math.random()<.5,held:false}}
reg({id:'crane',name:'ゆめのクレーン',genre:'クレーンゲーム',color:'#ff9ad5',time:45,goal:90,
howto:'押しながら左右に動かしてねらう\n指を離すとアームが下りる',
init(g){return{cx:360,cy:160,st:'move',open:1,caught:null,pr:Array.from({length:8},()=>prize(g)),t:0}},
update(s,g,dt){const{I}=g;s.t+=dt;
 for(const p of s.pr){if(p.held)continue;p.vy+=1400*dt;p.y+=p.vy*dt;if(p.y>860-p.r){p.y=860-p.r;p.vy=0}}
 if(s.st==='move'){if(I.down)s.cx+=g.clamp(I.x-s.cx,-420*dt,420*dt);if(I.keys.ArrowLeft)s.cx-=380*dt;if(I.keys.ArrowRight)s.cx+=380*dt;s.cx=g.clamp(s.cx,200,640);if(I.released||I.kp[' ']){s.st='drop';g.tone(300,.1,'square',.1)}}
 else if(s.st==='drop'){s.cy+=380*dt;let stop=800;for(const p of s.pr)if(Math.abs(p.x-s.cx)<p.r)stop=Math.min(stop,p.y-p.r-24);if(s.cy>=stop){s.cy=stop;s.st='grab';s.gt=.45}}
 else if(s.st==='grab'){s.open=Math.max(0,s.open-dt*2.5);s.gt-=dt;if(s.gt<=0){let best=null,bd=1e9;for(const p of s.pr){const d=Math.abs(p.x-s.cx);if(d<p.r*.75&&Math.abs(p.y-p.r-s.cy)<50&&d<bd){bd=d;best=p}}
  if(best&&Math.random()<(bd<best.r*.35?.9:.5)){s.caught=best;best.held=true;g.tone(600,.08,'triangle',.15)}s.st='rise'}}
 else if(s.st==='rise'){s.cy-=280*dt;if(s.caught&&s.cy<500&&Math.random()<dt*.25){s.caught.held=false;s.caught=null;s.open=.6;g.sfx('bad')}if(s.cy<=160){s.cy=160;s.st='carry'}}
 else if(s.st==='carry'){s.cx-=320*dt;if(s.cx<=115){s.cx=115;s.st='release';s.rt=.5}}
 else if(s.st==='release'){s.open=Math.min(1,s.open+dt*3);s.rt-=dt;if(s.caught&&s.open>.5){const p=s.caught;g.add(p.val,115,600,p.col);g.float('ゲット！',360,420,'#ffffff',46);g.sfx('win');g.burst(115,760,p.col,30,320,5);s.pr.splice(s.pr.indexOf(p),1);s.pr.push(prize(g));s.caught=null}if(s.rt<=0){s.st='back'}}
 else if(s.st==='back'){s.open=1;s.cx+=320*dt;if(s.cx>=360){s.cx=360;s.st='move'}}
 if(s.caught){s.caught.x=s.cx;s.caught.y=s.cy+24+s.caught.r}},
draw(s,g,c){const{W,H}=g,t=s.t;g.bg('#2a0f3a','#12061c');
 g.rrf(40,90,W-80,H-110,30,'#ff7ab6');g.rrf(56,106,W-112,H-142,20,'#1b0f2e');
 for(let i=0;i<26;i++){const per=2*(W-80+H-110),d=i/26*per;let x,y;if(d<W-80){x=40+d;y=92}else if(d<W-80+H-110){x=W-42;y=90+(d-(W-80))}else if(d<2*(W-80)+H-110){x=W-40-(d-(W-80+H-110));y=H-22}else{x=42;y=H-20-(d-2*(W-80)-(H-110))}
  const on=(i+Math.floor(t*6))%3===0;if(on)g.glow('#ffe28a',12);g.circle(x,y,6,on?'#ffe28a':'#7a3a5a');g.noglow()}
 const gr=c.createLinearGradient(0,120,0,880);gr.addColorStop(0,'#2a1a4a');gr.addColorStop(1,'#432a6a');c.fillStyle=gr;c.fillRect(64,120,W-128,760);
 c.fillStyle='#14091f';c.fillRect(64,700,110,180);c.fillStyle='#ffc857';c.fillRect(64,690,110,10);g.txt('GET',119,790,28,'#ffc857','center',g.FD,400);
 for(const p of s.pr){c.save();c.translate(p.x,p.y);const pg=c.createRadialGradient(-p.r*.3,-p.r*.3,4,0,0,p.r);pg.addColorStop(0,g.shade(p.col,.4));pg.addColorStop(1,g.shade(p.col,-.25));
  if(p.ear){c.fillStyle=g.shade(p.col,-.1);c.beginPath();c.ellipse(-p.r*.55,-p.r*.8,p.r*.25,p.r*.45,-.3,0,TAU);c.fill();c.beginPath();c.ellipse(p.r*.55,-p.r*.8,p.r*.25,p.r*.45,.3,0,TAU);c.fill()}else{g.circle(-p.r*.65,-p.r*.65,p.r*.3,g.shade(p.col,-.1));g.circle(p.r*.65,-p.r*.65,p.r*.3,g.shade(p.col,-.1))}
  g.circle(0,0,p.r,pg);g.circle(-p.r*.3,-p.r*.05,p.r*.1,'#2a1a2a');g.circle(p.r*.3,-p.r*.05,p.r*.1,'#2a1a2a');g.circle(-p.r*.5,p.r*.2,p.r*.12,'rgba(255,120,150,.5)');g.circle(p.r*.5,p.r*.2,p.r*.12,'rgba(255,120,150,.5)');c.strokeStyle='#2a1a2a';c.lineWidth=2;c.beginPath();c.arc(0,p.r*.1,p.r*.15,.3,Math.PI-.3);c.stroke();
  if(p.val>=30){g.star(0,-p.r*1.05,10,4);c.fillStyle='#ffe28a';c.fill()}c.restore()}
 c.fillStyle='#8a8fa8';c.fillRect(64,130,W-128,12);g.rrf(s.cx-30,124,60,26,6,'#c8ccd8');c.strokeStyle='#c8ccd8';c.lineWidth=3;c.beginPath();c.moveTo(s.cx,150);c.lineTo(s.cx,s.cy);c.stroke();
 g.rrf(s.cx-22,s.cy-10,44,24,8,'#dfe3ee');const op=.25+s.open*.55;c.strokeStyle='#dfe3ee';c.lineWidth=7;c.lineCap='round';for(const sd of[-1,0,1]){const a=Math.PI/2+sd*op;c.beginPath();c.moveTo(s.cx+sd*14,s.cy+10);c.lineTo(s.cx+sd*14+Math.cos(a)*40,s.cy+10+Math.sin(a)*40);c.lineTo(s.cx+sd*14+Math.cos(a)*40-sd*12,s.cy+10+Math.sin(a)*40+12);c.stroke()}
 c.fillStyle='rgba(255,255,255,.06)';c.beginPath();c.moveTo(64,120);c.lineTo(260,120);c.lineTo(64,500);c.fill();
 if(s.st==='move'){c.globalAlpha=.5+.5*Math.sin(t*5);g.txt('離すとキャッチ！',W/2,H-60,22,'#ffffff');c.globalAlpha=1}}});

// 32. 焼き加減
const PANS=[[190,430],[530,430],[360,720]];
function batter(g){return{side:0,a:0,b:0,rate:g.rnd(.17,.3),flip:0,qa:0,smoke:0}}
function cookQ(v){return v>1?-10:v>=.62&&v<=.75?15:v>=.5&&v<=.85?8:2}
function cakeCol(g,v){return v<.4?g.mix('#f6e7c6','#f0c27a',v/.4):v<.7?g.mix('#f0c27a','#d98b32',(v-.4)/.3):v<1?g.mix('#d98b32','#7a4012',(v-.7)/.3):g.mix('#7a4012','#1e120a',Math.min(1,(v-1)/.4))}
reg({id:'pancake',name:'パンケーキ工房',genre:'焼き加減',color:'#ffc857',time:45,goal:330,
howto:'焼き色がきつね色になったらタップで裏返す\nもう一度きつね色でタップして完成',
init(g){return{p:PANS.map(()=>batter(g))}},
update(s,g,dt){const{I}=g;s.p.forEach((p,i)=>{const[x,y]=PANS[i];p.flip=Math.max(0,p.flip-dt*3);p.smoke=Math.max(0,p.smoke-dt);
  if(p.side===0)p.a+=p.rate*dt;else p.b+=p.rate*dt;const cur=p.side?p.b:p.a;
  if(cur>1.35){g.add(-10,x,y-120);g.float('こげた…',x,y-80,'#ff6f59',28);g.sfx('bad');g.burst(x,y,'#555555',20,200,6,-200);s.p[i]=batter(g);return}
  if(cur>1&&Math.random()<dt*8)g.burst(x+g.rnd(-50,50),y-20,'#777777',1,60,6,-150);
  const tap=(I.pressed&&g.dist(I.x,I.y,x,y)<130)||I.kp[String(i+1)];if(!tap)return;
  if(p.side===0){p.qa=cookQ(p.a);p.side=1;p.flip=1;g.sfx('pop');g.float(p.qa>=15?'いい色！':p.qa<0?'こげ…':'',x,y-90,'#ffffff',26)}
  else{const q=p.qa+cookQ(p.b);g.add(q,x,y-120,q>=25?'#ffe28a':q<0?'#ff6f59':'#ffffff');if(q>=30){g.float('パーフェクト！',x,y-160,'#ffe28a',30);g.sfx('win')}else g.sfx(q>0?'good':'bad');g.burst(x,y,'#ffd36b',16,240,4);s.p[i]=batter(g)}})},
draw(s,g,c){const{W,H}=g;g.bg('#f3e5d0','#e2cfb2');c.strokeStyle='rgba(150,110,70,.18)';c.lineWidth=2;for(let x=0;x<W;x+=60){c.beginPath();c.moveTo(x,80);c.lineTo(x,H);c.stroke()}for(let y=80;y<H;y+=60){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
 g.rrf(30,300,W-60,600,30,'#2b2b33');g.rrf(40,310,W-80,580,24,'#3a3a44');
 s.p.forEach((p,i)=>{const[x,y]=PANS[i],cur=p.side?p.b:p.a;
  c.globalCompositeOperation='lighter';const fg=c.createRadialGradient(x,y,60,x,y,140);fg.addColorStop(0,'rgba(255,90,40,0)');fg.addColorStop(1,'rgba(255,90,40,'+(.18+Math.sin(g.time*9+i)*.05)+')');c.fillStyle=fg;c.beginPath();c.arc(x,y,140,0,TAU);c.fill();c.globalCompositeOperation='source-over';
  c.strokeStyle='#1a1a1e';c.lineWidth=18;c.lineCap='round';c.beginPath();c.moveTo(x+100,y+60);c.lineTo(x+170,y+110);c.stroke();g.circle(x,y,118,'#18181c');g.circle(x,y,104,'#26262c');
  const sy=Math.max(.05,Math.abs(Math.cos(p.flip*Math.PI)));c.save();c.translate(x,y);c.scale(1,sy);const top=p.side?g.mix('#f6e7c6','#f6e7c6',0):'#f6e7c6';
  const topCol=p.side?cakeCol(g,p.a):cakeCol(g,Math.min(.25,p.a*.3));const pg=c.createRadialGradient(-20,-20,10,0,0,86);pg.addColorStop(0,topCol);pg.addColorStop(1,p.side?cakeCol(g,p.a+.15):'#e9d2a4');g.circle(0,0,84,pg);
  if(!p.side){c.fillStyle='rgba(180,140,80,.5)';const n=Math.floor(p.a*14);for(let k=0;k<n;k++){const a=k*2.4,r=20+(k*37)%55;c.beginPath();c.arc(Math.cos(a)*r,Math.sin(a)*r,3,0,TAU);c.fill()}}c.restore();
  c.lineWidth=10;c.strokeStyle='rgba(255,255,255,.15)';c.beginPath();c.arc(x,y,128,0,TAU);c.stroke();
  c.strokeStyle='rgba(255,200,87,.6)';c.beginPath();c.arc(x,y,128,-Math.PI/2+TAU*.62/1.35,-Math.PI/2+TAU*.75/1.35);c.stroke();
  c.strokeStyle=cur>1?'#ff6f59':cur>=.62&&cur<=.75?'#ffe28a':'#9fe8ff';c.lineWidth=6;c.beginPath();c.arc(x,y,128,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,cur/1.35));c.stroke();
  g.txt(p.side?'うら':'おもて',x,y+150,18,'rgba(255,255,255,.65)')});
 g.txt('外側の金色ゾーンでタップ',W/2,250,24,'#6b4a2a')}});

// 33. ライツアウト
function loGen(s,g){s.n=5;s.on=new Array(25).fill(false);const k=3+Math.min(6,s.lv);const used=new Set();while(used.size<k)used.add(g.ri(0,24));for(const i of used)loTog(s,i);if(s.on.every(v=>!v))loTog(s,12);s.moves=0}
function loTog(s,i){const r=Math.floor(i/5),c=i%5;for(const[dr,dc]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const rr=r+dr,cc=c+dc;if(rr>=0&&rr<5&&cc>=0&&cc<5)s.on[rr*5+cc]=!s.on[rr*5+cc]}}
reg({id:'lights',name:'ちょうちん消し',genre:'ライツアウト',color:'#ff9f43',time:60,goal:300,
howto:'タップするとそのマスと上下左右が反転\n全部のあかりを消そう',
init(g){const s={lv:0,done:0,fx:new Array(25).fill(0)};loGen(s,g);return s},
update(s,g,dt){const{I,W}=g,cs=118,ox=(W-cs*5)/2,oy=260;for(let i=0;i<25;i++)s.fx[i]+=((s.on[i]?1:0)-s.fx[i])*Math.min(1,dt*10);
 if(s.done>0){s.done-=dt;if(s.done<=0){s.lv++;loGen(s,g)}return}
 if(I.pressed){const c=Math.floor((I.x-ox)/cs),r=Math.floor((I.y-oy)/cs);if(c>=0&&c<5&&r>=0&&r<5){loTog(s,r*5+c);s.moves++;g.tone(s.on[r*5+c]?660:440,.06,'triangle',.15);
  if(s.on.every(v=>!v)){g.add(80+Math.max(0,60-s.moves*4),W/2,oy-40);g.float('ぜんぶ消えた！',W/2,g.H/2,'#ffe28a',44);g.sfx('win');s.done=1}}}},
draw(s,g,c){const{W,H}=g,cs=118,ox=(W-cs*5)/2,oy=260;g.bg('#0a0f2a','#1a1030');for(let i=0;i<40;i++)g.circle((i*149)%W,(i*83)%240+90,1.3,'rgba(255,255,255,.6)');
 c.strokeStyle='#3a2a1a';c.lineWidth=3;for(let r=0;r<5;r++){c.beginPath();c.moveTo(ox-20,oy+r*cs+18);c.quadraticCurveTo(W/2,oy+r*cs+40,ox+cs*5+20,oy+r*cs+18);c.stroke()}
 for(let i=0;i<25;i++){const r=Math.floor(i/5),cc=i%5,x=ox+cc*cs+cs/2,y=oy+r*cs+cs/2+Math.sin(g.time*1.5+i)*3,f=s.fx[i];
  if(f>.05){c.globalCompositeOperation='lighter';const gg=c.createRadialGradient(x,y,10,x,y,90);gg.addColorStop(0,'rgba(255,160,60,'+.45*f+')');gg.addColorStop(1,'rgba(255,160,60,0)');c.fillStyle=gg;c.beginPath();c.arc(x,y,90,0,TAU);c.fill();c.globalCompositeOperation='source-over'}
  c.fillStyle='#2a1a10';c.fillRect(x-18,y-46,36,8);c.fillRect(x-18,y+38,36,8);
  const lg=c.createRadialGradient(x-10,y-10,5,x,y,44);lg.addColorStop(0,g.mix('#3a2440','#fff1c1',f));lg.addColorStop(1,g.mix('#24162a','#e2553b',f));c.fillStyle=lg;c.beginPath();c.ellipse(x,y,36,40,0,0,TAU);c.fill();
  c.strokeStyle='rgba(60,20,10,.45)';c.lineWidth=1.5;for(let k=-3;k<=3;k++){c.beginPath();c.ellipse(x,y,Math.abs(k)*11,40,0,0,TAU);c.stroke()}
  if(f>.5){c.globalAlpha=f;g.txt('灯',x,y+2,24,'#7a1a10','center',g.FD,400);c.globalAlpha=1}}
 g.txt('のこり '+s.on.filter(v=>v).length+'　手数 '+s.moves,W/2,190,26,'#ffe0b0')}});

// 34. サッカー
const GL=150,GR=570,GT=200,GB=420;
reg({id:'pk',name:'PKチャレンジ',genre:'サッカー',color:'#2ec4b6',time:45,goal:300,
howto:'ボールからゴールに向かってスワイプ\nキーパーのいない場所をねらおう',
init(g){return{st:'aim',t:0,tx:0,ty:0,kx:360,kgx:360,res:'',rt:0,goals:0,shots:0,keepColor:g.pick(['#ffc857','#ff6f59','#a98bff'])}},
update(s,g,dt){const{W,H,I}=g;
 if(s.st==='aim'){s.kx+=(360+Math.sin(g.time*2)*40-s.kx)*Math.min(1,dt*3);if(I.swipe&&I.swipe.dy<-50){s.tx=g.clamp(360+I.swipe.dx*1.25,40,W-40);s.ty=g.clamp(H-170+I.swipe.dy*1.1,110,GB);s.st='shot';s.t=0;s.shots++;g.noise(.15,.3,0,800);
   const right=Math.random()<.45;s.kgx=right?g.clamp(s.tx,GL+60,GR-60):g.rnd(GL+60,GR-60)}return}
 if(s.st==='shot'){s.t+=dt;s.kx+=(s.kgx-s.kx)*Math.min(1,dt*(s.t>.08?6:0));if(s.t>=.55){s.st='res';s.rt=1.1;
   const inGoal=s.tx>GL+12&&s.tx<GR-12&&s.ty>GT+12;const saved=inGoal&&Math.abs(s.tx-s.kx)<85&&s.ty>GT+30;
   if(!inGoal){s.res=(Math.abs(s.tx-GL)<20||Math.abs(s.tx-GR)<20||Math.abs(s.ty-GT)<20)?'ポスト！':'枠外…';g.sfx('bad')}
   else if(saved){s.res='セーブされた！';g.sfx('bad');g.shake(6)}
   else{const corner=Math.abs(s.tx-360)>150||s.ty<GT+70;const p=corner?50:30;g.add(p,s.tx,s.ty-40);s.res=corner?'スーパーゴール！':'ゴール！';s.goals++;g.sfx('win');g.burst(s.tx,s.ty,'#ffffff',30,320,4);g.noise(.8,.15,0,500)}}return}
 if(s.st==='res'){s.rt-=dt;if(s.rt<=0){s.st='aim';s.kx=360}}},
draw(s,g,c){const{W,H,I}=g;g.bg('#071526','#0e2a3a');
 for(const x of[60,W-60]){g.glow('#ffffff',40);g.circle(x,110,18,'#ffffff');g.noglow();c.globalCompositeOperation='lighter';const lg=c.createRadialGradient(x,110,10,x,110,300);lg.addColorStop(0,'rgba(255,255,230,.2)');lg.addColorStop(1,'rgba(255,255,230,0)');c.fillStyle=lg;c.fillRect(0,80,W,400);c.globalCompositeOperation='source-over'}
 for(let i=0;i<260;i++){c.fillStyle=['#ff6f59','#ffc857','#5b8cff','#ffffff','#2ec4b6'][i%5];c.globalAlpha=.5;c.fillRect((i*53)%W,130+(i*29)%70+Math.sin(g.time*6+i)*2,4,4)}c.globalAlpha=1;
 c.fillStyle='#1d6a3a';c.beginPath();c.moveTo(0,GB);c.lineTo(W,GB);c.lineTo(W,H);c.lineTo(0,H);c.fill();
 for(let i=0;i<8;i++){c.fillStyle=i%2?'rgba(255,255,255,.04)':'rgba(0,0,0,.05)';const y1=GB+i*(H-GB)/8,y2=y1+(H-GB)/8;c.fillRect(0,y1,W,y2-y1)}
 c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=3;c.beginPath();c.moveTo(60,GB+60);c.lineTo(W-60,GB+60);c.stroke();g.circle(360,H-170,6,'rgba(255,255,255,.7)');
 c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=1;for(let x=GL;x<=GR;x+=18){c.beginPath();c.moveTo(x,GT);c.lineTo(x+20,GB-20);c.stroke()}for(let y=GT;y<=GB;y+=18){c.beginPath();c.moveTo(GL,y);c.lineTo(GR,y);c.stroke()}
 c.strokeStyle='#ffffff';c.lineWidth=12;c.lineCap='square';c.beginPath();c.moveTo(GL,GB);c.lineTo(GL,GT);c.lineTo(GR,GT);c.lineTo(GR,GB);c.stroke();
 const dive=s.st!=='aim'?g.clamp((s.kgx-360)/200,-1,1):0,kx=s.kx,ky=GB-80;c.save();c.translate(kx,ky);c.rotate(dive*.9*Math.min(1,s.st==='aim'?0:s.t*3));
 g.rrf(-26,-50,52,90,18,s.keepColor);g.circle(0,-68,20,'#f3d0a8');c.strokeStyle=s.keepColor;c.lineWidth=14;c.lineCap='round';c.beginPath();c.moveTo(-22,-40);c.lineTo(-62,-80);c.moveTo(22,-40);c.lineTo(62,-80);c.stroke();g.circle(-64,-84,12,'#ffffff');g.circle(64,-84,12,'#ffffff');c.strokeStyle='#1b1b2a';c.lineWidth=12;c.beginPath();c.moveTo(-12,38);c.lineTo(-20,80);c.moveTo(12,38);c.lineTo(20,80);c.stroke();c.restore();
 let bx=360,by=H-170,br=34;if(s.st==='shot'||s.st==='res'){const k=s.st==='res'?1:g.ease(s.t/.55);bx=g.lerp(360,s.tx,k);by=g.lerp(H-170,s.ty,k)-Math.sin(Math.PI*k)*50;br=g.lerp(34,15,k)}
 c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(bx,by+br*.9,br,br*.3,0,0,TAU);c.fill();g.circle(bx,by,br,'#f4f4f4');c.fillStyle='#1b1b2a';g.poly(bx,by,br*.38,5,g.time*(s.st==='shot'?10:0));c.fill();for(let k=0;k<5;k++){const a=k*TAU/5+g.time*(s.st==='shot'?10:0);g.poly(bx+Math.cos(a)*br*.85,by+Math.sin(a)*br*.85,br*.22,5,a);c.fill()}
 if(s.st==='aim'&&I.down){c.strokeStyle='rgba(255,255,255,.5)';c.setLineDash([10,10]);c.lineWidth=4;c.beginPath();c.moveTo(I.sx,I.sy);c.lineTo(I.x,I.y);c.stroke();c.setLineDash([])}
 if(s.st==='res')g.txt(s.res,W/2,H/2+40,52,s.res.includes('ゴール')?'#ffe28a':'#ffffff','center',g.FD,400);
 g.txt('ゴール '+s.goals+' / '+s.shots,W/2,H-40,22,'rgba(255,255,255,.75)')}});

// 35. 着陸
function terrain(s,g){const{W}=g,pts=[];for(let x=0;x<=W;x+=40)pts.push({x,y:g.rnd(700,860)});s.pads=[];const used=[];for(const m of[2,1]){let i;do{i=g.ri(1,pts.length-5)}while(used.some(u=>Math.abs(u-i)<5));used.push(i);const w=m===2?2:3,y=g.rnd(720,840);for(let k=i;k<=i+w;k++)pts[k].y=y;s.pads.push({x1:pts[i].x,x2:pts[i+w].x,y,m})}s.pts=pts;s.craters=Array.from({length:8},()=>({x:g.rnd(W),y:g.rnd(880,940),r:g.rnd(8,22)}))}
function groundY(s,x){const p=s.pts;for(let i=0;i<p.length-1;i++)if(x>=p[i].x&&x<=p[i+1].x){const t=(x-p[i].x)/(p[i+1].x-p[i].x);return p[i].y+(p[i+1].y-p[i].y)*t}return 900}
function newShip(s,g){s.sh={x:g.rnd(150,570),y:150,vx:g.rnd(-60,60),vy:0,a:0,fuel:100,thr:false};s.wait=0}
reg({id:'lander',name:'ムーンランディング',genre:'着陸',color:'#9fe8ff',time:45,goal:300,
howto:'押している間ジェット噴射。指の左右で傾く\n光る台にそっと着陸しよう',
init(g){const s={};terrain(s,g);newShip(s,g);return s},
update(s,g,dt){const{W,I}=g,sh=s.sh;if(s.wait>0){s.wait-=dt;if(s.wait<=0){if(s.land)terrain(s,g);newShip(s,g)}return}
 let tgt=sh.a;if(I.down)tgt=g.clamp((I.x-sh.x)/200,-1,1)*.8;if(I.keys.ArrowLeft)tgt=sh.a-2.5*dt;if(I.keys.ArrowRight)tgt=sh.a+2.5*dt;sh.a+=g.clamp(tgt-sh.a,-3*dt,3*dt);
 sh.thr=(I.down||I.keys.ArrowUp||I.keys[' '])&&sh.fuel>0;if(sh.thr){sh.vx+=Math.sin(sh.a)*380*dt;sh.vy-=Math.cos(sh.a)*380*dt;sh.fuel=Math.max(0,sh.fuel-14*dt);if(Math.random()<dt*20)g.burst(sh.x-Math.sin(sh.a)*26,sh.y+Math.cos(sh.a)*26,'#ffb347',2,120,3,200)}
 sh.vy+=160*dt;sh.x+=sh.vx*dt;sh.y+=sh.vy*dt;if(sh.x<20){sh.x=20;sh.vx=Math.abs(sh.vx)*.5}if(sh.x>W-20){sh.x=W-20;sh.vx=-Math.abs(sh.vx)*.5}if(sh.y<100){sh.y=100;sh.vy=Math.max(0,sh.vy)}
 const gy=groundY(s,sh.x);if(sh.y+22>=gy){const pad=s.pads.find(p=>sh.x-14>=p.x1&&sh.x+14<=p.x2);
  if(pad&&sh.vy<75&&Math.abs(sh.vx)<50&&Math.abs(sh.a)<.3){const p=50*pad.m+Math.round(sh.fuel*.5);g.add(p,sh.x,sh.y-60);g.float('着陸成功！',W/2,420,'#9fe8ff',46);g.sfx('win');sh.y=gy-22;s.land=true}
  else{g.float('クラッシュ！',W/2,420,'#ff6f59',46);g.sfx('boom');g.shake(18);g.burst(sh.x,sh.y,'#ffb347',50,420,6);s.land=false;sh.dead=true}s.wait=1.3}},
draw(s,g,c){const{W,H}=g,sh=s.sh;g.bg('#020208','#0c0c22');for(let i=0;i<90;i++)g.circle((i*137)%W,(i*71)%700+80,i%7?1:1.8,'rgba(255,255,255,.75)');
 const eg=c.createRadialGradient(W-150,190,10,W-140,200,60);eg.addColorStop(0,'#7fc6ff');eg.addColorStop(1,'#1d4f9a');g.circle(W-140,200,60,eg);c.fillStyle='rgba(120,200,120,.75)';c.beginPath();c.ellipse(W-160,190,20,28,.4,0,TAU);c.fill();c.beginPath();c.ellipse(W-120,220,16,12,0,0,TAU);c.fill();
 const tg=c.createLinearGradient(0,700,0,H);tg.addColorStop(0,'#9a9aa8');tg.addColorStop(1,'#4a4a58');c.fillStyle=tg;c.beginPath();c.moveTo(0,H);for(const p of s.pts)c.lineTo(p.x,p.y);c.lineTo(W,H);c.fill();
 for(const cr of s.craters){c.fillStyle='rgba(40,40,52,.5)';c.beginPath();c.ellipse(cr.x,cr.y,cr.r,cr.r*.4,0,0,TAU);c.fill()}
 for(const p of s.pads){g.glow('#9be15d',18);c.strokeStyle='#9be15d';c.lineWidth=6;c.beginPath();c.moveTo(p.x1,p.y);c.lineTo(p.x2,p.y);c.stroke();g.noglow();g.txt('×'+p.m,(p.x1+p.x2)/2,p.y+24,20,'#9be15d')}
 if(!sh.dead){c.save();c.translate(sh.x,sh.y);c.rotate(sh.a);if(sh.thr){c.globalCompositeOperation='lighter';const fl=30+Math.random()*20,fg=c.createLinearGradient(0,18,0,18+fl);fg.addColorStop(0,'rgba(255,240,180,.95)');fg.addColorStop(1,'rgba(255,111,89,0)');c.fillStyle=fg;c.beginPath();c.moveTo(-9,18);c.lineTo(0,18+fl);c.lineTo(9,18);c.fill();c.globalCompositeOperation='source-over'}
  c.strokeStyle='#c8ccd8';c.lineWidth=3;c.beginPath();c.moveTo(-14,8);c.lineTo(-24,22);c.moveTo(14,8);c.lineTo(24,22);c.moveTo(-30,22);c.lineTo(-18,22);c.moveTo(18,22);c.lineTo(30,22);c.stroke();
  const fgd=c.createLinearGradient(-18,0,18,0);fgd.addColorStop(0,'#b8862a');fgd.addColorStop(.5,'#ffd36b');fgd.addColorStop(1,'#b8862a');g.rrf(-18,-4,36,18,4,fgd);g.rrf(-13,-24,26,22,10,'#dfe3ee');g.circle(0,-14,6,'#5b8cff');c.restore()}
 const okV=sh.vy<75,okH=Math.abs(sh.vx)<50;g.rrf(24,100,180,12,6,'rgba(255,255,255,.15)');g.rrf(24,100,180*sh.fuel/100,12,6,sh.fuel<25?'#ff6f59':'#ffc857');g.txt('燃料',24,128,18,'#ffffff','left');
 g.txt('落下 '+Math.round(sh.vy),24,156,18,okV?'#9be15d':'#ff6f59','left');g.txt('横 '+Math.round(sh.vx),24,180,18,okH?'#9be15d':'#ff6f59','left')}});

// 36. 羽ばたき
reg({id:'flap',name:'たけやぶパタパタ',genre:'羽ばたき',color:'#9be15d',time:40,goal:250,
howto:'タップで羽ばたいて上昇\n竹のすき間をくぐり抜けよう',
init(g){return{y:g.H/2,vy:0,pipes:[],spawn:.8,flap:0,dist:0}},
update(s,g,dt){const{W,H,I}=g;s.dist+=240*dt;if(I.pressed||I.kp[' ']||I.kp.ArrowUp){s.vy=-520;s.flap=1;g.tone(520,.06,'triangle',.15,800)}s.flap=Math.max(0,s.flap-dt*4);
 s.vy+=1500*dt;s.y+=s.vy*dt;s.spawn-=dt;if(s.spawn<=0){s.spawn=1.45;const gap=Math.max(180,240-g.time*1.5);s.pipes.push({x:W+40,gy:g.rnd(220,H-200-gap),gap,passed:false})}
 for(const p of s.pipes){p.x-=240*dt;if(!p.passed&&p.x+70<200){p.passed=true;g.add(10,200,s.y-50);g.sfx('coin')}if(200+22>p.x&&200-22<p.x+70&&(s.y-20<p.gy||s.y+20>p.gy+p.gap)){g.sfx('boom');g.shake(12);g.burst(200,s.y,'#ff6f59',24,300,4);g.over('竹にぶつかった！');return}}
 s.pipes=s.pipes.filter(p=>p.x>-100);if(s.y>H-70||s.y<90){g.sfx('boom');g.over('落ちてしまった！')}},
draw(s,g,c){const{W,H}=g;g.bg('#d8f0d0','#8fc48a');
 for(let L=0;L<2;L++){c.fillStyle=L?'rgba(70,120,60,.35)':'rgba(120,170,110,.3)';for(let i=0;i<14;i++){const x=((i*90-s.dist*(.2+L*.3))%1260+1260)%1260-60;c.fillRect(x,80,10+L*6,H)}}
 for(const p of s.pipes){for(const[y1,y2]of[[80,p.gy],[p.gy+p.gap,H-60]]){const gr=c.createLinearGradient(p.x,0,p.x+70,0);gr.addColorStop(0,'#3a8a3a');gr.addColorStop(.4,'#8fd16a');gr.addColorStop(1,'#2a6a2a');c.fillStyle=gr;c.fillRect(p.x,y1,70,y2-y1);c.fillStyle='rgba(30,70,30,.6)';for(let y=y1+40;y<y2;y+=80)c.fillRect(p.x-3,y,76,6)}
  c.fillStyle='#c9e8a0';c.beginPath();c.ellipse(p.x+35,p.gy,35,9,0,0,TAU);c.fill();c.beginPath();c.ellipse(p.x+35,p.gy+p.gap,35,9,0,0,TAU);c.fill()}
 c.fillStyle='#4a7a3a';c.fillRect(0,H-60,W,60);c.fillStyle='#6a9a4a';for(let x=-((s.dist)%30);x<W;x+=30){c.beginPath();c.moveTo(x,H-60);c.lineTo(x+15,H-72);c.lineTo(x+30,H-60);c.fill()}
 c.save();c.translate(200,s.y);c.rotate(g.clamp(s.vy/900,-.5,.8));g.circle(0,0,22,'#ff6f59');g.circle(6,-6,7,'#ffffff');g.circle(8,-6,3.5,'#1b1220');c.fillStyle='#ffc857';c.beginPath();c.moveTo(18,0);c.lineTo(32,4);c.lineTo(18,8);c.fill();
 c.fillStyle='#ff9a85';c.beginPath();c.ellipse(-8,4,14,8,s.flap?-.8:.4,0,TAU);c.fill();c.restore()}});

// 37. カード予想
const SUITS=['♠','♥','♦','♣'],RK=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
function newDeck(g){const d=[];for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push({r,s});return g.shuffle(d)}
function card(c,g,cd,x,y,w,h,face){c.fillStyle='rgba(0,0,0,.3)';g.rr(x-w/2+5,y-h/2+8,w,h,16);c.fill();
 if(!face){g.rrf(x-w/2,y-h/2,w,h,16,'#fff7ea');g.rrf(x-w/2+10,y-h/2+10,w-20,h-20,10,'#ff6f59');c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;for(let i=-6;i<=6;i++){c.beginPath();c.moveTo(x+i*24-60,y-h/2+10);c.lineTo(x+i*24+60,y+h/2-10);c.stroke()}return}
 g.rrf(x-w/2,y-h/2,w,h,16,'#fff7ea');const red=cd.s===1||cd.s===2,col=red?'#d7263d':'#1b1b2a';g.txt(RK[cd.r-1],x-w/2+30,y-h/2+36,w*.16,col,'center',g.FD,400);g.txt(SUITS[cd.s],x-w/2+30,y-h/2+76,w*.14,col);g.txt(SUITS[cd.s],x,y+10,w*.5,col);g.txt(RK[cd.r-1],x+w/2-30,y+h/2-36,w*.16,col,'center',g.FD,400)}
reg({id:'highlow',name:'ハイ＆ロー',genre:'カード予想',color:'#ff6f59',time:45,goal:300,
howto:'次のカードが今より大きいか小さいか\nHIGHかLOWをタップ（上下スワイプ可）',
init(g){const d=newDeck(g);return{deck:d,cur:d.pop(),nxt:null,fl:0,st:'guess',streak:0,res:'',hist:[]}},
update(s,g,dt){const{W,I}=g;if(s.deck.length<2)s.deck=newDeck(g);
 if(s.st==='flip'){s.fl+=dt/.35;if(s.fl>=1){s.fl=1;s.st='show';s.wait=.6;const d=s.nxt.r-s.cur.r;
  if(d===0){s.res='引き分け';g.tone(400,.1,'sine',.15)}else if((d>0)===(s.guess>0)){s.streak++;const p=Math.round(10*Math.min(4,1+s.streak*.5));g.add(p,W/2+150,300);s.res='あたり！';g.sfx('good')}else{s.streak=0;g.add(-10,W/2+150,300);s.res='はずれ';g.sfx('bad');g.shake(6)}}return}
 if(s.st==='show'){s.wait-=dt;if(s.wait<=0){s.hist.push(s.cur);if(s.hist.length>7)s.hist.shift();s.cur=s.nxt;s.nxt=null;s.st='guess';s.res=''}return}
 let gu=0;if(I.pressed){if(I.y>620&&I.y<760)gu=1;else if(I.y>780&&I.y<920)gu=-1}if(I.swipe&&Math.abs(I.swipe.dy)>Math.abs(I.swipe.dx))gu=I.swipe.dy<0?1:-1;if(I.kp.ArrowUp)gu=1;if(I.kp.ArrowDown)gu=-1;
 if(gu){s.guess=gu;s.nxt=s.deck.pop();s.st='flip';s.fl=0;g.sfx('tick')}},
draw(s,g,c){const{W}=g;g.bg('#0f3d2e','#062018');const fg=c.createRadialGradient(W/2,400,40,W/2,400,520);fg.addColorStop(0,'rgba(255,255,255,.08)');fg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=fg;c.fillRect(0,0,W,960);
 s.hist.forEach((h,i)=>card(c,g,h,70+i*58,140,50,72,true));
 card(c,g,s.cur,W/2-150,380,220,310,true);
 const sx=s.nxt?Math.abs(Math.cos(s.fl*Math.PI)):1;c.save();c.translate(W/2+150,380);c.scale(Math.max(.02,sx),1);card(c,g,s.nxt||s.cur,0,0,220,310,s.nxt&&s.fl>.5);c.restore();
 if(s.res)g.txt(s.res,W/2,580,40,s.res==='あたり！'?'#ffe28a':'#ffffff','center',g.FD,400);
 g.rrf(80,630,W-160,120,28,'#ff6f59');g.txt('HIGH ↑',W/2,690,48,'#1b1220','center',g.FD,400);g.rrf(80,790,W-160,120,28,'#5b8cff');g.txt('LOW ↓',W/2,850,48,'#1b1220','center',g.FD,400);
 if(s.streak>1)g.txt(s.streak+'連続！ ×'+Math.min(4,1+s.streak*.5),W/2,600-0,22,'#ffe28a')}});

// 38. 落ち物パズル
const TC=10,TR=20,TCELL=34,SH={I:[[1,1,1,1]],O:[[1,1],[1,1]],T:[[0,1,0],[1,1,1]],S:[[0,1,1],[1,1,0]],Z:[[1,1,0],[0,1,1]],J:[[1,0,0],[1,1,1]],L:[[0,0,1],[1,1,1]]},TCOL={I:'#2ec4b6',O:'#ffc857',T:'#a98bff',S:'#9be15d',Z:'#ff6f59',J:'#5b8cff',L:'#ff9f43'};
const rotM=m=>m[0].map((_,i)=>m.map(r=>r[i]).reverse());
function tfits(s,m,x,y){for(let r=0;r<m.length;r++)for(let c=0;c<m[r].length;c++)if(m[r][c]){const X=x+c,Y=y+r;if(X<0||X>=TC||Y>=TR)return false;if(Y>=0&&s.grid[Y][X])return false}return true}
function tspawn(s,g){const k=s.next||g.pick(Object.keys(SH));s.next=g.pick(Object.keys(SH));s.pc={k,m:SH[k],x:Math.floor((TC-SH[k][0].length)/2),y:-1};if(!tfits(s,s.pc.m,s.pc.x,s.pc.y)){g.sfx('boom');g.over('積み上がった！')}}
function tlock(s,g){const p=s.pc,ox=(g.W-TC*TCELL)/2-60,oy=140;for(let r=0;r<p.m.length;r++)for(let c=0;c<p.m[r].length;c++)if(p.m[r][c]&&p.y+r>=0)s.grid[p.y+r][p.x+c]=TCOL[p.k];
 let n=0;for(let r=TR-1;r>=0;r--){if(s.grid[r].every(v=>v)){for(let c=0;c<TC;c++)g.burst(ox+(c+.5)*TCELL,oy+(r+.5)*TCELL,s.grid[r][c],3,200,3);s.grid.splice(r,1);s.grid.unshift(new Array(TC).fill(null));n++;r++}}
 if(n){const p2=[0,10,30,60,100][n];s.lines+=n;g.add(p2,g.W/2-60,oy+200);if(n>=3)g.float(n===4?'よんだん消し！':'さんだん消し！',g.W/2-60,oy+260,'#ffe28a',38);g.sfx(n>=3?'win':'good')}else g.tone(200,.04,'square',.08);tspawn(s,g)}
reg({id:'tetro',name:'つみつみブロック',genre:'落ち物パズル',color:'#5b8cff',time:60,goal:150,
howto:'左右ドラッグで移動・タップで回転\n下スワイプで一気に落とす（矢印・スペース可）',
init(g){const s={grid:Array.from({length:TR},()=>new Array(TC).fill(null)),t:0,lines:0};tspawn(s,g);return s},
update(s,g,dt){const{I}=g,p=s.pc;if(!p)return;const mv=dx=>{if(tfits(s,p.m,p.x+dx,p.y)){p.x+=dx;return true}return false};
 const rot=()=>{const m=rotM(p.m);for(const k of[0,-1,1,-2,2])if(tfits(s,m,p.x+k,p.y)){p.m=m;p.x+=k;g.tone(600,.03,'square',.06);return}};
 const hard=()=>{while(tfits(s,p.m,p.x,p.y+1))p.y++;g.shake(4);tlock(s,g)};
 if(I.pressed){s.base=p.x;s.moved=false}
 if(I.down&&s.base!==undefined){const want=s.base+Math.round((I.x-I.sx)/TCELL);if(want!==p.x){s.moved=true;while(p.x<want&&mv(1));while(p.x>want&&mv(-1));}}
 if(I.released){if(I.swipe&&I.swipe.dy>120&&Math.abs(I.swipe.dy)>Math.abs(I.swipe.dx)){hard();return}if(!s.moved&&g.dist(I.x,I.y,I.sx,I.sy)<20)rot();s.base=undefined}
 const kp=I.kp;if(kp.ArrowLeft)mv(-1);if(kp.ArrowRight)mv(1);if(kp.ArrowUp)rot();if(kp[' ']){hard();return}
 const iv=Math.max(.1,.65-s.lines*.03)*(I.keys.ArrowDown?.15:1);s.t+=dt;if(s.t>=iv){s.t=0;if(tfits(s,p.m,p.x,p.y+1))p.y++;else tlock(s,g)}},
draw(s,g,c){const{W}=g,ox=(W-TC*TCELL)/2-60,oy=140;g.bg('#0d1030','#060818');
 g.rrf(ox-10,oy-10,TC*TCELL+20,TR*TCELL+20,14,'#1d2250');c.fillStyle='#0a0d26';c.fillRect(ox,oy,TC*TCELL,TR*TCELL);c.strokeStyle='rgba(255,255,255,.04)';for(let x=0;x<=TC;x++){c.beginPath();c.moveTo(ox+x*TCELL,oy);c.lineTo(ox+x*TCELL,oy+TR*TCELL);c.stroke()}
 const blk=(x,y,col,a=1)=>{c.globalAlpha=a;c.fillStyle=col;c.fillRect(x+1,y+1,TCELL-2,TCELL-2);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x+1,y+1,TCELL-2,5);c.fillRect(x+1,y+1,5,TCELL-2);c.fillStyle='rgba(0,0,0,.3)';c.fillRect(x+1,y+TCELL-6,TCELL-2,5);c.fillRect(x+TCELL-6,y+1,5,TCELL-2);c.globalAlpha=1};
 for(let r=0;r<TR;r++)for(let cc=0;cc<TC;cc++)if(s.grid[r][cc])blk(ox+cc*TCELL,oy+r*TCELL,s.grid[r][cc]);
 const p=s.pc;if(p){let gy=p.y;while(tfits(s,p.m,p.x,gy+1))gy++;for(let r=0;r<p.m.length;r++)for(let cc=0;cc<p.m[r].length;cc++)if(p.m[r][cc]){if(gy+r>=0){c.strokeStyle=g.rgba(TCOL[p.k],.6);c.lineWidth=2;c.strokeRect(ox+(p.x+cc)*TCELL+3,oy+(gy+r)*TCELL+3,TCELL-6,TCELL-6)}if(p.y+r>=0){g.glow(TCOL[p.k],12);blk(ox+(p.x+cc)*TCELL,oy+(p.y+r)*TCELL,TCOL[p.k]);g.noglow()}}}
 const nx=ox+TC*TCELL+40;g.txt('つぎ',nx+60,oy+10,22,'rgba(255,255,255,.7)');g.rrf(nx,oy+30,120,100,14,'#1d2250');if(s.next){const m=SH[s.next],z=22;for(let r=0;r<m.length;r++)for(let cc=0;cc<m[r].length;cc++)if(m[r][cc]){const x=nx+60-m[0].length*z/2+cc*z,y=oy+80-m.length*z/2+r*z;c.fillStyle=TCOL[s.next];c.fillRect(x+1,y+1,z-2,z-2);c.fillStyle='rgba(255,255,255,.3)';c.fillRect(x+1,y+1,z-2,4)}}
 g.txt('ライン',nx+60,oy+180,22,'rgba(255,255,255,.7)');g.txt(String(s.lines),nx+60,oy+222,44,'#ffc857','center',g.FD,400)}});
})();
