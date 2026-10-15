// Pack 8 — games 90-100
(()=>{const reg=MG.reg;const TAU=Math.PI*2;

// 90. 橋かけ
function brNext(s,g){const last=s.pil[s.pil.length-1];const gap=g.rnd(80,300),w=g.rnd(40,130);s.pil.push({x:last.x+last.w+gap,w})}
reg({id:'bridge',name:'のびーる橋',genre:'橋かけ',color:'#ff9f43',time:45,goal:300,
howto:'押している間、棒がのびる\n離すと倒れて橋になる。次の足場にぴったり届かせよう',
init(g){const s={pil:[{x:60,w:120}],i:0,len:0,st:'ready',ang:0,px:150,cam:0,lives:3,fall:0};brNext(s,g);brNext(s,g);return s},
update(s,g,dt){const{I}=g,cur=s.pil[s.i],nx=s.pil[s.i+1],edge=cur.x+cur.w;s.cam+=(cur.x-60-s.cam)*Math.min(1,dt*5);
 if(s.st==='ready'&&(I.down||I.keys[' '])){s.st='grow'}
 if(s.st==='grow'){if(I.down||I.keys[' ']){s.len+=420*dt;if(Math.random()<dt*10)g.tone(300+s.len,.03,'sine',.05)}else{s.st='drop';s.ang=0}}
 if(s.st==='drop'){s.ang=Math.min(Math.PI/2,s.ang+dt*5);if(s.ang>=Math.PI/2){const tip=edge+s.len;s.ok=tip>=nx.x&&tip<=nx.x+nx.w;s.perfect=s.ok&&Math.abs(tip-(nx.x+nx.w/2))<8;s.st='walk';g.tone(200,.06,'square',.1)}}
 if(s.st==='walk'){const tgt=s.ok?nx.x+nx.w-20:edge+s.len+10;s.px=Math.min(tgt,s.px+300*dt);if(s.px>=tgt){if(s.ok){g.add(10+(s.perfect?20:0),s.px-s.cam,600);if(s.perfect)g.float('ど真ん中！',360,420,'#ff6f59',40);g.sfx(s.perfect?'win':'coin');s.i++;s.len=0;s.st='ready';brNext(s,g)}else{s.st='fall';s.fall=0;g.sfx('lose')}}}
 if(s.st==='fall'){s.fall+=dt;if(s.fall>1){s.lives--;if(s.lives<=0){g.over('落ちてしまった！');return}s.len=0;s.px=cur.x+cur.w-20;s.st='ready'}}},
draw(s,g,c){const{W,H}=g,cam=s.cam,GY=640;let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#ff9a76');gr.addColorStop(.5,'#ffd9a0');gr.addColorStop(1,'#ffeccc');c.fillStyle=gr;c.fillRect(0,0,W,H);
 g.glow('#fff1c1',50);g.circle(W*.7,260,70,'#fff4d6');g.noglow();c.fillStyle='rgba(120,70,90,.35)';c.beginPath();c.moveTo(0,GY);for(let x=0;x<=W;x+=20)c.lineTo(x,GY-120-Math.sin((x+cam*.2)*.01)*50);c.lineTo(W,GY);c.fill();
 for(const p of s.pil){const x=p.x-cam;if(x>W||x+p.w<0)continue;const pg=c.createLinearGradient(x,0,x+p.w,0);pg.addColorStop(0,'#2a1a2a');pg.addColorStop(1,'#4a2a3a');c.fillStyle=pg;c.fillRect(x,GY,p.w,H-GY);g.rrf(x+p.w/2-7,GY,14,6,2,'#ff3b3b')}
 const cur=s.pil[s.i],ex=cur.x+cur.w-cam;c.save();c.translate(ex,GY);c.rotate(s.st==='grow'||s.st==='ready'?0:s.st==='fall'?Math.PI/2+Math.min(1,s.fall*2):s.ang);c.fillStyle='#2a1a10';c.fillRect(-3,-s.len,6,s.len);c.restore();
 const fy=s.st==='fall'?GY+s.fall*s.fall*1500:GY;const px=s.px-cam;g.rrf(px-14,fy-44,28,36,10,'#ff6f59');g.circle(px,fy-54,12,'#2a1a2a');c.fillStyle='#ff6f59';c.fillRect(px-14,fy-60,28,6);g.circle(px+4,fy-56,2.5,'#ffffff');c.fillStyle='#2a1a2a';c.fillRect(px-10,fy-8,6,8);c.fillRect(px+4,fy-8,6,8);
 for(let i=0;i<3;i++)g.circle(W-30-i*28,110,9,i<s.lives?'#ff6f59':'rgba(0,0,0,.2)');g.txt((s.i)+'本',W/2,140,40,'#5a2a3a','center',g.FD,400)}});

// 91. 草むしり
function wdSpawn(s,g){let x,y,t=0;do{x=g.rnd(70,650);y=g.rnd(220,880);t++}while(t<30&&s.p.some(p=>g.dist(p.x,p.y,x,y)<70));s.p.push({x,y,weed:Math.random()<.68,age:0,pull:0,col:g.pick(['#ff6f59','#ffc857','#ff7ab6','#a98bff'])})}
reg({id:'weed',name:'草むしり名人',genre:'草むしり',color:'#9be15d',time:35,goal:300,
howto:'雑草を押して上にスワイプして引っこ抜く\n花は抜かないように注意',
init(g){const s={p:[],sp:.3};for(let i=0;i<6;i++)wdSpawn(s,g);return s},
update(s,g,dt){const{I}=g;s.sp-=dt;if(s.sp<=0&&s.p.filter(p=>!p.pull).length<14){s.sp=g.rnd(.35,.7);wdSpawn(s,g)}
 for(const p of s.p){p.age+=dt;if(p.pull)p.pull+=dt;if(p.weed&&!p.pull&&p.age>6&&s.p.length<18){p.age=2;s.p.push({x:g.clamp(p.x+g.rnd(-60,60),70,650),y:g.clamp(p.y+g.rnd(-60,60),220,880),weed:true,age:0,pull:0})}}
 if(I.swipe&&I.swipe.dy<-40){let b=null,bd=60;for(const p of s.p){if(p.pull)continue;const d=g.dist(p.x,p.y-20,I.sx,I.sy);if(d<bd){bd=d;b=p}}if(b){b.pull=.001;if(b.weed){g.add(10,b.x,b.y-60);g.noise(.15,.15,0,900);g.burst(b.x,b.y,'#8a6a3a',10,200,4)}else{g.add(-20,b.x,b.y-60);g.float('お花が…',b.x,b.y-90,'#ff6f59',26);g.sfx('bad')}}}
 s.p=s.p.filter(p=>!p.pull||p.pull<.5)},
draw(s,g,c){const{W,H}=g;g.bg('#c9a46a','#a8834a');c.fillStyle='rgba(90,60,30,.2)';for(let i=0;i<120;i++)c.fillRect((i*97)%W,(i*173)%H,10,4);c.fillStyle='#7cc35a';c.fillRect(0,90,W,90);
 const sorted=s.p.slice().sort((a,b)=>a.y-b.y);for(const p of sorted){const lift=p.pull?p.pull*400:0,x=p.x,y=p.y-lift;c.globalAlpha=p.pull?1-p.pull*2:1;c.fillStyle='rgba(60,40,20,.35)';c.beginPath();c.ellipse(p.x,p.y+4,26,8,0,0,TAU);c.fill();
  if(p.weed){const sc=Math.min(1,.5+p.age*.15);c.fillStyle='#4a8a2a';for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(x+k*6,y);c.quadraticCurveTo(x+k*16,y-30*sc,x+k*22,y-50*sc);c.lineTo(x+k*6+4,y);c.fill()}if(p.pull){c.strokeStyle='#d9c2a0';c.lineWidth=3;c.beginPath();c.moveTo(x,y);c.lineTo(x-6,y+20);c.moveTo(x,y);c.lineTo(x+8,y+18);c.stroke()}}
  else{c.strokeStyle='#3a8a3a';c.lineWidth=5;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-46);c.stroke();c.fillStyle='#4caf50';c.beginPath();c.ellipse(x-12,y-20,12,6,-.5,0,TAU);c.fill();for(let k=0;k<5;k++){const a=k*TAU/5;g.circle(x+Math.cos(a)*12,y-52+Math.sin(a)*12,9,p.col)}g.circle(x,y-52,7,'#ffe28a')}c.globalAlpha=1}
 g.txt('雑草 '+s.p.filter(p=>p.weed&&!p.pull).length+'本',W/2,H-30,22,'#3a2a14')}});

// 92. 物資投下
function camp(g){const w=g.pick([90,130,170]);return{x:g.rnd(60,660-w),w,hit:0}}
reg({id:'airdrop',name:'物資投下作戦',genre:'物資投下',color:'#5b8cff',time:40,goal:300,
howto:'タップで荷物を投下\n飛行機の速さと風を読んで旗の中心に落とそう',
init(g){return{px:-80,dir:1,v:220,cr:[],camps:[camp(g),camp(g)],cd:0,wind:g.rnd(-60,60)}},
update(s,g,dt){const{W,I}=g;s.px+=s.dir*s.v*dt;if(s.px>W+100){s.dir=-1;s.v=g.rnd(180,300);s.wind=g.rnd(-70,70)}if(s.px<-100){s.dir=1;s.v=g.rnd(180,300);s.wind=g.rnd(-70,70)}s.cd-=dt;
 if((I.pressed||I.kp[' '])&&s.cd<=0&&s.px>0&&s.px<W){s.cd=.6;s.cr.push({x:s.px,y:190,vx:s.dir*s.v,vy:0,chute:0});g.tone(400,.08,'triangle',.12,200)}
 for(const cr of s.cr){cr.vy+=600*dt;if(cr.y>400){cr.chute=1;cr.vy=Math.min(cr.vy,160)}cr.vx+=(s.wind-cr.vx)*dt*(cr.chute?1.5:.3);cr.x+=cr.vx*dt;cr.y+=cr.vy*dt;
  if(cr.y>=840&&!cr.land){cr.land=1;let got=false;for(const cp of s.camps){if(cr.x>cp.x&&cr.x<cp.x+cp.w){const d=Math.abs(cr.x-(cp.x+cp.w/2)),p=d<15?50:20;g.add(p,cr.x,800,p>=50?'#ffe28a':'#ffffff');g.sfx(p>=50?'win':'good');g.burst(cr.x,840,'#ffe28a',16,240,4);Object.assign(cp,camp(g));got=true;break}}if(!got){g.tone(150,.12,'sine',.12)}}}
 s.cr=s.cr.filter(cr=>!cr.land||cr.y<860)},
draw(s,g,c){const{W,H}=g;let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#5fb0ff');gr.addColorStop(.85,'#d8f0ff');gr.addColorStop(.86,'#c9a46a');gr.addColorStop(1,'#a8834a');c.fillStyle=gr;c.fillRect(0,0,W,H);
 c.globalAlpha=.8;for(let i=0;i<5;i++){const x=((i*190+g.time*s.wind*.5)%(W+200)+W+200)%(W+200)-100;g.circle(x,300+i*60,40,'#ffffff');g.circle(x+40,310+i*60,30,'#ffffff')}c.globalAlpha=1;
 c.fillStyle='#8aa86a';c.beginPath();c.moveTo(0,826);for(let x=0;x<=W;x+=30)c.lineTo(x,820-Math.sin(x*.02)*10);c.lineTo(W,840);c.lineTo(0,840);c.fill();
 for(const cp of s.camps){g.rrf(cp.x,834,cp.w,16,6,'rgba(255,255,255,.6)');g.rrf(cp.x+cp.w/2-10,834,20,16,4,'#e63946');c.strokeStyle='#3a2a1a';c.lineWidth=3;c.beginPath();c.moveTo(cp.x,834);c.lineTo(cp.x,770);c.moveTo(cp.x+cp.w,834);c.lineTo(cp.x+cp.w,770);c.stroke();c.fillStyle='#ffc857';c.beginPath();c.moveTo(cp.x,770);c.lineTo(cp.x+24,780);c.lineTo(cp.x,790);c.fill();c.beginPath();c.moveTo(cp.x+cp.w,770);c.lineTo(cp.x+cp.w+24,780);c.lineTo(cp.x+cp.w,790);c.fill()}
 for(const cr of s.cr){if(cr.chute){c.fillStyle='#ff6f59';c.beginPath();c.arc(cr.x,cr.y-50,30,Math.PI,0);c.fill();c.strokeStyle='rgba(60,40,40,.6)';c.lineWidth=1.5;c.beginPath();c.moveTo(cr.x-30,cr.y-50);c.lineTo(cr.x,cr.y-12);c.lineTo(cr.x+30,cr.y-50);c.stroke()}g.rrf(cr.x-14,cr.y-12,28,24,4,'#a8743a');c.strokeStyle='#6b4520';c.lineWidth=2;c.strokeRect(cr.x-14,cr.y-12,28,24)}
 c.save();c.translate(s.px,170);c.scale(s.dir,1);g.rrf(-60,-14,120,28,14,'#e8ecf5');c.fillStyle='#c8ccd8';c.beginPath();c.moveTo(-10,0);c.lineTo(-40,-40);c.lineTo(-20,-40);c.lineTo(20,0);c.fill();c.beginPath();c.moveTo(-50,-10);c.lineTo(-66,-34);c.lineTo(-54,-34);c.lineTo(-40,-10);c.fill();c.fillStyle='rgba(91,140,255,.8)';c.fillRect(30,-8,20,10);c.restore();
 g.txt('風 '+(s.wind>0?'→':'←')+' '+Math.round(Math.abs(s.wind)/7),W-30,110,22,'#1b2a4a','right')}});

// 93. スイングバイ
function sbNew(s,g){s.pl=[];for(let i=0;i<g.ri(2,3);i++){let x,y,t=0;do{x=g.rnd(140,580);y=g.rnd(260,680);t++}while(t<40&&s.pl.some(p=>g.dist(p.x,p.y,x,y)<200));s.pl.push({x,y,r:g.rnd(30,50),m:g.rnd(4e6,9e6),col:g.pick(['#ff9f43','#a98bff','#2ec4b6','#ff7ab6'])})}s.goal={x:g.rnd(120,600),y:g.rnd(120,180)};s.reset()}
reg({id:'swingby',name:'スイングバイ',genre:'スイングバイ',color:'#a98bff',time:50,goal:300,
howto:'下のロケットから引っぱって離すと発射\n惑星の重力で曲がる軌道を読んで上の基地へ',
init(g){const s={tries:0};s.reset=()=>{s.p={x:360,y:870,vx:0,vy:0};s.st='aim';s.ft=0;s.trail=[]};sbNew(s,g);return s},
update(s,g,dt){const{W,H,I}=g,p=s.p;if(s.st==='aim'){if(I.released){const vx=(I.sx-I.x)*2.2,vy=(I.sy-I.y)*2.2,m=Math.hypot(vx,vy);if(m>60){const k=Math.min(1,520/m);p.vx=vx*k;p.vy=vy*k;s.st='fly';s.tries++;g.tone(200,.3,'sawtooth',.1,600)}}return}
 if(s.st==='done'){s.ft-=dt;if(s.ft<=0){if(s.win){sbNew(s,g);s.tries=0}else s.reset()}return}
 s.ft+=dt;for(let k=0;k<4;k++){const h=dt/4;for(const pl of s.pl){const dx=pl.x-p.x,dy=pl.y-p.y,d2=dx*dx+dy*dy,d=Math.sqrt(d2);const a=pl.m/Math.max(d2,900);p.vx+=dx/d*a*h;p.vy+=dy/d*a*h;if(d<pl.r){s.st='done';s.win=false;s.ft=1;g.sfx('boom');g.shake(12);g.burst(p.x,p.y,'#ff9f43',30,300,5);return}}p.x+=p.vx*h;p.y+=p.vy*h}
 s.trail.push([p.x,p.y]);if(s.trail.length>140)s.trail.shift();
 if(g.dist(p.x,p.y,s.goal.x,s.goal.y)<40){const pt=Math.max(30,120-(s.tries-1)*30);g.add(pt,s.goal.x,s.goal.y+50);g.float('ドッキング成功！',W/2,480,'#ffe28a',44);g.sfx('win');s.st='done';s.win=true;s.ft=1.2;return}
 if(p.x<-40||p.x>W+40||p.y<60||p.y>H+40||s.ft>7){s.st='done';s.win=false;s.ft=.8;g.float('ロスト…',W/2,480,'#ffffff',36);g.sfx('lose')}},
draw(s,g,c){const{W,H,I}=g,p=s.p;g.bg('#05051a','#120a2a');for(let i=0;i<90;i++)g.circle((i*137)%W,(i*71)%880+80,i%9?1:1.8,'rgba(255,255,255,.7)');
 for(const pl of s.pl){c.globalCompositeOperation='lighter';const gw=c.createRadialGradient(pl.x,pl.y,pl.r,pl.x,pl.y,pl.r*3);gw.addColorStop(0,g.rgba(pl.col,.25));gw.addColorStop(1,g.rgba(pl.col,0));c.fillStyle=gw;c.beginPath();c.arc(pl.x,pl.y,pl.r*3,0,TAU);c.fill();c.globalCompositeOperation='source-over';const pg=c.createRadialGradient(pl.x-pl.r*.4,pl.y-pl.r*.4,4,pl.x,pl.y,pl.r);pg.addColorStop(0,g.shade(pl.col,.4));pg.addColorStop(1,g.shade(pl.col,-.5));g.circle(pl.x,pl.y,pl.r,pg)}
 c.save();c.translate(s.goal.x,s.goal.y);c.rotate(g.time);g.glow('#9be15d',20);c.strokeStyle='#9be15d';c.lineWidth=5;c.beginPath();c.arc(0,0,32,0,TAU);c.stroke();g.rrf(-46,-5,92,10,4,'#c8ccd8');g.noglow();c.restore();
 if(s.trail.length>1){c.strokeStyle='rgba(255,226,138,.6)';c.lineWidth=2;c.beginPath();s.trail.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke()}
 if(s.st==='aim'&&I.down){let vx=(I.sx-I.x)*2.2,vy=(I.sy-I.y)*2.2;const m=Math.hypot(vx,vy),k=Math.min(1,520/Math.max(m,1));vx*=k;vy*=k;let x=p.x,y=p.y;c.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<40;i++){for(const pl of s.pl){const dx=pl.x-x,dy=pl.y-y,d2=dx*dx+dy*dy,d=Math.sqrt(d2),a=pl.m/Math.max(d2,900);vx+=dx/d*a*.02;vy+=dy/d*a*.02}x+=vx*.02;y+=vy*.02;if(i%3===0)g.circle(x,y,2.5,'rgba(255,255,255,.7)')}}
 const a=s.st==='aim'?-Math.PI/2:Math.atan2(p.vy,p.vx);c.save();c.translate(p.x,p.y);c.rotate(a+Math.PI/2);g.rrf(-8,-20,16,36,8,'#e8ecf5');c.fillStyle='#ff6f59';c.beginPath();c.moveTo(-8,-12);c.lineTo(0,-28);c.lineTo(8,-12);c.fill();if(s.st==='fly'){g.glow('#ffb347',14);c.fillStyle='#ffd36b';c.beginPath();c.moveTo(-6,16);c.lineTo(0,30+Math.random()*10);c.lineTo(6,16);c.fill();g.noglow()}c.restore();
 g.txt('挑戦 '+s.tries+'回目',W/2,H-24,20,'rgba(255,255,255,.55)')}});

// 94. 雪だま転がし
function snObj(g,r0){const r=g.rnd(6,Math.max(14,r0*1.6));return{x:g.rnd(30,690),y:g.rnd(130,930),r,k:r>r0*1.1?'rock':g.pick(['star','tree','gift'])}}
reg({id:'snowball',name:'ころころ雪だま',genre:'雪だま転がし',color:'#9fe8ff',time:40,goal:300,
howto:'ドラッグした方へ雪だまを転がす\n自分より小さいものは巻きこんで大きくなる',
init(g){const s={x:360,y:540,r:22,rot:0,ob:[]};for(let i=0;i<26;i++)s.ob.push(snObj(g,22));return s},
update(s,g,dt){const{W,H,I}=g;let tx=s.x,ty=s.y;if(I.down){tx=I.x;ty=I.y}const k=I.keys;if(k.ArrowLeft)tx-=999;if(k.ArrowRight)tx+=999;if(k.ArrowUp)ty-=999;if(k.ArrowDown)ty+=999;
 const dx=tx-s.x,dy=ty-s.y,l=Math.hypot(dx,dy),m=Math.min(l,(260-s.r)*dt);if(l>1){s.x+=dx/l*m;s.y+=dy/l*m;s.rot+=m/s.r;s.r=Math.min(110,s.r+m*.004)}s.x=g.clamp(s.x,s.r,W-s.r);s.y=g.clamp(s.y,90+s.r,H-s.r);
 for(const o of s.ob){const d=g.dist(o.x,o.y,s.x,s.y);if(d<s.r+o.r*.6){if(o.r<s.r*.9){s.r=Math.min(110,s.r+o.r*.12);g.add(Math.ceil(o.r/2),o.x,o.y-20,'#ffffff');g.tone(500+o.r*10,.05,'triangle',.12);g.burst(o.x,o.y,'#ffffff',8,160,3);Object.assign(o,snObj(g,s.r))}else{const nx=(s.x-o.x)/d,ny=(s.y-o.y)/d;s.x=o.x+nx*(s.r+o.r*.6+2);s.y=o.y+ny*(s.r+o.r*.6+2);if(!o.cd||g.time>o.cd){o.cd=g.time+.6;s.r=Math.max(16,s.r*.9);g.sfx('bad');g.shake(6)}}}}},
draw(s,g,c){const{W,H}=g;g.bg('#eef6ff','#d6e8f8');c.fillStyle='rgba(160,190,220,.25)';for(let i=0;i<80;i++)c.beginPath(),c.arc((i*97)%W,(i*233)%H,3,0,TAU),c.fill();
 for(const o of s.ob){c.fillStyle='rgba(80,110,150,.15)';c.beginPath();c.ellipse(o.x+3,o.y+o.r*.8,o.r,o.r*.3,0,0,TAU);c.fill();const can=o.r<s.r*.9;
  if(o.k==='rock'){const gr=c.createRadialGradient(o.x-o.r*.3,o.y-o.r*.3,2,o.x,o.y,o.r);gr.addColorStop(0,'#9a9aa8');gr.addColorStop(1,'#4a4a58');g.circle(o.x,o.y,o.r,gr)}
  else if(o.k==='tree'){c.fillStyle='#2a6a3a';c.beginPath();c.moveTo(o.x,o.y-o.r*1.3);c.lineTo(o.x+o.r,o.y+o.r*.6);c.lineTo(o.x-o.r,o.y+o.r*.6);c.fill();c.fillStyle='#ffffff';c.beginPath();c.moveTo(o.x,o.y-o.r*1.3);c.lineTo(o.x+o.r*.4,o.y-o.r*.5);c.lineTo(o.x-o.r*.4,o.y-o.r*.5);c.fill()}
  else if(o.k==='gift'){g.rrf(o.x-o.r*.8,o.y-o.r*.8,o.r*1.6,o.r*1.6,4,'#ff6f59');c.fillStyle='#ffc857';c.fillRect(o.x-o.r*.15,o.y-o.r*.8,o.r*.3,o.r*1.6)}
  else{g.star(o.x,o.y,o.r,o.r*.45);c.fillStyle='#ffc857';c.fill()}
  if(!can&&o.k!=='rock'){c.strokeStyle='rgba(230,57,70,.5)';c.lineWidth=2;c.beginPath();c.arc(o.x,o.y,o.r+4,0,TAU);c.stroke()}}
 c.fillStyle='rgba(80,110,150,.25)';c.beginPath();c.ellipse(s.x+5,s.y+s.r*.85,s.r,s.r*.3,0,0,TAU);c.fill();const gr=c.createRadialGradient(s.x-s.r*.35,s.y-s.r*.4,s.r*.1,s.x,s.y,s.r);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#bcd4ec');g.circle(s.x,s.y,s.r,gr);
 c.save();c.translate(s.x,s.y);c.rotate(s.rot);c.fillStyle='rgba(140,170,210,.35)';for(let i=0;i<5;i++)g.circle(Math.cos(i*1.3)*s.r*.55,Math.sin(i*1.3)*s.r*.55,s.r*.12,'rgba(140,170,210,.35)');c.restore();
 g.txt('直径 '+Math.round(s.r*2)+'cm',W-24,110,24,'#2a4a6a','right',g.FD,400)}});

// 95. クリッカー
const UPG=[['指を強化','タップ+1',20,'tap'],['オーブン','毎秒+2',30,'oven'],['パン職人','毎秒+12',150,'chef']];
reg({id:'clicker',name:'クッキー工場',genre:'クリッカー',color:'#ff9f43',time:45,goal:400,
howto:'クッキーをタップして焼く\nたまったら下の設備を買ってどんどん増やそう',
init(){return{ck:0,tot:0,tap:1,ps:0,lv:{tap:0,oven:0,chef:0},pop:0,fl:[]}},
update(s,g,dt){const{I,W}=g;s.pop=Math.max(0,s.pop-dt*6);const auto=s.ps*dt;s.ck+=auto;s.tot+=auto;
 if((I.pressed&&g.dist(I.x,I.y,W/2,380)<170)||I.kp[' ']){s.ck+=s.tap;s.tot+=s.tap;s.pop=1;s.fl.push({x:(I.pressed?I.x:W/2)+g.rnd(-20,20),y:(I.pressed?I.y:380)-40,t:0,v:s.tap});g.tone(500+Math.random()*200,.04,'triangle',.08)}
 for(let i=0;i<3;i++){const u=UPG[i],cost=Math.round(u[2]*Math.pow(1.5,s.lv[u[3]])),y=640+i*100;if((I.pressed&&I.y>y&&I.y<y+86&&I.x>40&&I.x<W-40)||I.kp[String(i+1)]){if(s.ck>=cost){s.ck-=cost;s.lv[u[3]]++;if(u[3]==='tap')s.tap++;if(u[3]==='oven')s.ps+=2;if(u[3]==='chef')s.ps+=12;g.sfx('coin')}else g.tone(200,.06,'sine',.08)}}
 for(const f of s.fl)f.t+=dt;s.fl=s.fl.filter(f=>f.t<.8);g.score=Math.floor(s.tot/5)},
draw(s,g,c){const{W}=g;g.bg('#3a2014','#1e100a');c.globalCompositeOperation='lighter';const gl=c.createRadialGradient(W/2,380,40,W/2,380,320);gl.addColorStop(0,'rgba(255,180,90,.25)');gl.addColorStop(1,'rgba(255,180,90,0)');c.fillStyle=gl;c.fillRect(0,0,W,700);c.globalCompositeOperation='source-over';
 g.txt(Math.floor(s.ck)+' 枚',W/2,140,56,'#ffe0b0','center',g.FD,400);g.txt('毎秒 '+s.ps+' 枚　1タップ '+s.tap+' 枚',W/2,192,22,'rgba(255,224,176,.7)');
 const r=150*(1-s.pop*.06);c.save();c.translate(W/2,380);c.rotate(g.time*.1);const cg=c.createRadialGradient(-40,-40,20,0,0,r);cg.addColorStop(0,'#f0c27a');cg.addColorStop(1,'#b8762a');g.circle(0,0,r,cg);for(let i=0;i<9;i++){const a=i*2.3,rr=(i*37)%110;g.circle(Math.cos(a)*rr,Math.sin(a)*rr,14,'#4a2a10')}c.restore();
 for(const f of s.fl){c.globalAlpha=1-f.t/.8;g.txt('+'+f.v,f.x,f.y-f.t*80,28,'#ffffff','center',g.FD,400)}c.globalAlpha=1;
 for(let i=0;i<3;i++){const u=UPG[i],cost=Math.round(u[2]*Math.pow(1.5,s.lv[u[3]])),y=640+i*100,ok=s.ck>=cost;g.rrf(40,y,W-80,86,22,ok?'#ffc857':'#5a3a24');g.txt(u[0]+'（'+s.lv[u[3]]+'）',70,y+30,26,ok?'#3a2014':'#c8a888','left');g.txt(u[1],70,y+62,18,ok?'#5a3a24':'#a8886a','left');g.txt(cost+'枚',W-70,y+44,30,ok?'#3a2014':'#c8a888','right',g.FD,400)}}});

// 96. トレード
reg({id:'trade',name:'デイトレーダー',genre:'トレード',color:'#9be15d',time:45,goal:250,endMsg:'取引終了！',
howto:'安いときに「買う」高いときに「売る」\n最後に持っている株は自動で売られる',
init(){return{p:100,hist:new Array(120).fill(100),drift:0,dt:0,cash:1000,sh:0,tk:0,last:''}},
update(s,g,dt){const{I,W}=g;s.dt-=dt;if(s.dt<=0){s.dt=g.rnd(1.5,3.5);s.drift=g.rnd(-22,22)}s.p=g.clamp(s.p+(s.drift+g.rnd(-60,60))*dt+(100-s.p)*.02*dt,40,200);s.tk+=dt;if(s.tk>.1){s.tk=0;s.hist.push(s.p);s.hist.shift()}
 const buy=(I.pressed&&I.y>800&&I.x<W/2)||I.kp.b||I.kp.ArrowUp,sell=(I.pressed&&I.y>800&&I.x>=W/2)||I.kp.s||I.kp.ArrowDown;
 if(buy){if(s.sh<3&&s.cash>=s.p*10){s.sh++;s.cash-=s.p*10;g.tone(700,.06,'triangle',.12);s.last='買い '+s.p.toFixed(0)}else g.tone(200,.06,'sine',.08)}
 if(sell){if(s.sh>0){s.sh--;s.cash+=s.p*10;g.tone(900,.06,'triangle',.12);s.last='売り '+s.p.toFixed(0)}else g.tone(200,.06,'sine',.08)}
 const val=s.cash+s.sh*s.p*10;g.score=Math.round((val-1000)/10)},
draw(s,g,c){const{W}=g;g.bg('#0a1410','#050a08');const x0=40,y0=200,w=W-80,h=460,mn=Math.min(...s.hist)-10,mx=Math.max(...s.hist)+10,Y=v=>y0+h-(v-mn)/(mx-mn)*h;
 g.rrf(x0-10,y0-20,w+20,h+40,16,'#0f201a');c.strokeStyle='rgba(155,225,93,.08)';c.lineWidth=1;for(let i=0;i<=5;i++){const y=y0+i*h/5;c.beginPath();c.moveTo(x0,y);c.lineTo(x0+w,y);c.stroke();g.txt(String(Math.round(mx-(mx-mn)*i/5)),x0+w-4,y-10,14,'rgba(155,225,93,.45)','right')}
 const up=s.hist[s.hist.length-1]>=s.hist[0],col=up?'#9be15d':'#ff6f59';const ag=c.createLinearGradient(0,y0,0,y0+h);ag.addColorStop(0,g.rgba(col,.3));ag.addColorStop(1,g.rgba(col,0));c.fillStyle=ag;c.beginPath();c.moveTo(x0,y0+h);s.hist.forEach((v,i)=>c.lineTo(x0+i*w/(s.hist.length-1),Y(v)));c.lineTo(x0+w,y0+h);c.fill();
 c.strokeStyle=col;c.lineWidth=3;c.beginPath();s.hist.forEach((v,i)=>i?c.lineTo(x0+i*w/(s.hist.length-1),Y(v)):c.moveTo(x0,Y(v)));c.stroke();g.glow(col,14);g.circle(x0+w,Y(s.p),7,col);g.noglow();
 g.txt(s.p.toFixed(1)+' 円',W/2,130,48,col,'center',g.FD,400);const val=s.cash+s.sh*s.p*10,pf=val-1000;
 g.txt('保有 '+s.sh+'株×10　現金 '+Math.round(s.cash),W/2,700,24,'#ffffff');g.txt('損益 '+(pf>=0?'+':'')+Math.round(pf),W/2,746,32,pf>=0?'#9be15d':'#ff6f59','center',g.FD,400);if(s.last)g.txt(s.last,W/2,180,18,'rgba(255,255,255,.5)');
 g.rrf(40,806,W/2-60,110,26,'#2a9a4a');g.txt('買う',W/4+10,861,44,'#ffffff','center',g.FD,400);g.rrf(W/2+20,806,W/2-60,110,26,'#e63946');g.txt('売る',W*3/4-10,861,44,'#ffffff','center',g.FD,400)}});

// 97. プログラミング
const PGN=6,DV=[[1,0],[0,1],[-1,0],[0,-1]];
function prNew(s,g){for(let t=0;t<100;t++){const w=new Set();for(let i=0;i<g.ri(6,9);i++)w.add(g.ri(0,35));const st=g.ri(0,5)*6,gl=g.ri(0,5)*6+5;w.delete(st);w.delete(gl);const q=[st],seen=new Set([st]);while(q.length){const k=q.shift();const r=Math.floor(k/6),c=k%6;for(const[dx,dy]of DV){const R=r+dy,C=c+dx;if(R<0||R>5||C<0||C>5)continue;const n=R*6+C;if(!w.has(n)&&!seen.has(n)){seen.add(n);q.push(n)}}}
 if(seen.has(gl)){s.walls=w;s.start=st;s.goal=gl;s.cmd=[];s.run=null;return}}}
reg({id:'program',name:'ロボットプログラム',genre:'プログラミング',color:'#2ec4b6',time:60,goal:300,
howto:'命令ボタンで手順を並べて「実行」\nロボットを旗まで動かそう（少ない命令ほど高得点）',
init(g){const s={};prNew(s,g);return s},
update(s,g,dt){const{I,W}=g;if(s.run){s.run.t-=dt;if(s.run.t>0)return;s.run.t=.32;const R=s.run;if(R.i>=s.cmd.length||R.fail){if(R.win){prNew(s,g)}else{s.run=null}return}
  const c0=s.cmd[R.i++];if(c0===0){const[dx,dy]=DV[R.d],r=Math.floor(R.k/6),c=R.k%6,nr=r+dy,nc=c+dx,n=nr*6+nc;if(nr<0||nr>5||nc<0||nc>5||s.walls.has(n)){R.fail=1;R.t=.8;g.sfx('bad');g.shake(8);g.float('ぶつかった！',W/2,700,'#ff6f59',36);return}R.k=n;g.tone(500,.04,'square',.1);if(n===s.goal){const p=Math.max(30,150-s.cmd.length*8);g.add(p,W/2,140);g.float('ゴール！',W/2,700,'#ffe28a',50);g.sfx('win');R.win=1;R.i=s.cmd.length;R.t=1}}else{R.d=(R.d+(c0===1?3:1))%4;g.tone(700,.04,'sine',.1)}
  if(R.i>=s.cmd.length&&!R.win&&!R.fail){R.fail=1;R.t=.8;g.float('とどかなかった…',W/2,700,'#ffffff',32);g.sfx('lose')}return}
 if(!I.pressed)return;const bw=(W-80)/5;if(I.y>800&&I.y<900){const b=Math.floor((I.x-40)/bw);if(b<3&&s.cmd.length<14){s.cmd.push(b);g.tone(600,.03,'square',.08)}if(b===3)s.cmd.pop();if(b===4&&s.cmd.length)s.run={i:0,k:s.start,d:0,t:.2}}},
draw(s,g,c){const{W}=g,cs=86,ox=(W-cs*6)/2,oy=130;g.bg('#14202a','#0a1018');
 for(let k=0;k<36;k++){const x=ox+(k%6)*cs,y=oy+Math.floor(k/6)*cs;g.rrf(x+3,y+3,cs-6,cs-6,10,s.walls.has(k)?'#4a3a5a':'#223040');if(s.walls.has(k)){g.rrf(x+10,y+10,cs-20,cs-20,6,'#6a5a7a')}}
 const gx=ox+(s.goal%6+.5)*cs,gy=oy+(Math.floor(s.goal/6)+.5)*cs;c.strokeStyle='#ffffff';c.lineWidth=4;c.beginPath();c.moveTo(gx-10,gy+26);c.lineTo(gx-10,gy-26);c.stroke();c.fillStyle='#ffc857';c.beginPath();c.moveTo(gx-10,gy-26);c.lineTo(gx+22,gy-16);c.lineTo(gx-10,gy-6);c.fill();
 const R=s.run||{k:s.start,d:0},rx=ox+(R.k%6+.5)*cs,ry=oy+(Math.floor(R.k/6)+.5)*cs;c.save();c.translate(rx,ry);c.rotate(R.d*Math.PI/2);g.glow('#2ec4b6',16);g.rrf(-26,-24,52,48,12,'#2ec4b6');g.noglow();g.rrf(-14,-14,28,16,6,'#0a1018');g.circle(-6,-6,3,'#9fe8ff');g.circle(6,-6,3,'#9fe8ff');c.fillStyle='#ffe28a';c.beginPath();c.moveTo(26,0);c.lineTo(38,-8);c.lineTo(38,8);c.fill();c.restore();
 const lab=['▲前へ','↺左','↻右'];g.rrf(30,664,W-60,110,16,'#1a2a38');s.cmd.forEach((k,i)=>{const x=50+(i%7)*90,y=680+Math.floor(i/7)*46,act=s.run&&s.run.i-1===i;g.rrf(x,y,82,38,10,act?'#ffe28a':['#5b8cff','#ff9f43','#a98bff'][k]);g.txt(lab[k],x+41,y+20,18,'#0a1018')});if(!s.cmd.length)g.txt('命令を並べよう',W/2,718,22,'rgba(255,255,255,.4)');
 const bw=(W-80)/5;['▲前へ','↺左','↻右','けす','実行'].forEach((t,i)=>{g.rrf(40+i*bw+6,806,bw-12,90,20,['#5b8cff','#ff9f43','#a98bff','#5a5a6a','#2a9a4a'][i]);g.txt(t,40+i*bw+bw/2,852,24,'#ffffff')});g.txt('命令 '+s.cmd.length+'個',W/2,105,20,'rgba(255,255,255,.6)')}});

// 98. BMX
reg({id:'bmx',name:'BMXフリップ',genre:'BMXトリック',color:'#ff7ab6',time:45,goal:300,
howto:'ジャンプ中に押し続けると回転\n地面に着く前に水平にもどして着地しよう',
init(){return{st:'ride',t:0,y:0,vy:0,a:0,flips:0,res:'',rt:0,scroll:0}},
update(s,g,dt){const{I}=g;s.scroll+=320*dt;s.rt=Math.max(0,s.rt-dt);
 if(s.st==='ride'){s.t+=dt;if(s.t>1.1){s.st='air';s.vy=-980;s.y=0;s.a=0;s.spin=0;g.tone(300,.15,'triangle',.12,600)}return}
 const hold=I.down||I.keys[' '];if(hold)s.spin=Math.min(9,(s.spin||0)+dt*30);else s.spin=Math.max(0,(s.spin||0)-dt*30);s.a-=s.spin*dt;s.vy+=1500*dt;s.y+=s.vy*dt;
 if(s.y>=0&&s.vy>0){s.y=0;const turns=Math.round(-s.a/TAU),off=Math.abs(-s.a-turns*TAU);if(off<.5){const p=turns*50+(off<.15?20:10);g.add(p,360,480);s.res=turns?(turns+'回転！'+(off<.15?' 完ぺき':'')):'着地';g.sfx(turns?'win':'good');if(turns)g.burst(360,640,'#ff7ab6',24,300,5)}else{g.add(-20,360,480);s.res='転倒…';g.sfx('boom');g.shake(12)}s.rt=1;s.st='ride';s.t=0;s.a=0}},
draw(s,g,c){const{W,H}=g,GY=700;let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#2a1a4a');gr.addColorStop(.7,'#ff7ab6');gr.addColorStop(.71,'#5a4a6a');gr.addColorStop(1,'#3a2a4a');c.fillStyle=gr;c.fillRect(0,0,W,H);
 c.fillStyle='rgba(20,10,40,.6)';for(let i=0;i<10;i++){const x=((i*140-s.scroll*.3)%1400+1400)%1400-100,h=100+(i*53)%160;c.fillRect(x,GY-h,90,h)}
 c.fillStyle='#8a8aa0';c.fillRect(0,GY,W,10);c.fillStyle='rgba(255,255,255,.15)';for(let x=-(s.scroll%60);x<W;x+=60)c.fillRect(x,GY+30,30,4);
 if(s.st==='ride'){const rx=360+(1.1-s.t)*320;c.fillStyle='#c98a4a';c.beginPath();c.moveTo(rx-160,GY);c.quadraticCurveTo(rx-20,GY,rx,GY-110);c.lineTo(rx+10,GY-110);c.lineTo(rx+10,GY);c.fill()}
 const ry=s.st==='ride'?GY:GY+s.y;c.save();c.translate(360,ry-34);c.rotate(s.a);c.strokeStyle='#1b1220';c.lineWidth=5;g.circle(-34,20,20,'rgba(0,0,0,0)');c.beginPath();c.arc(-34,20,20,0,TAU);c.stroke();c.beginPath();c.arc(34,20,20,0,TAU);c.stroke();
 c.strokeStyle='#ff3b6b';c.lineWidth=6;c.beginPath();c.moveTo(-34,20);c.lineTo(-6,0);c.lineTo(24,0);c.lineTo(34,20);c.moveTo(-6,0);c.lineTo(6,20);c.lineTo(-34,20);c.moveTo(24,0);c.lineTo(20,-14);c.stroke();
 c.strokeStyle='#2a3a6a';c.lineWidth=10;c.lineCap='round';c.beginPath();c.moveTo(-4,-6);c.lineTo(4,-46);c.stroke();g.circle(8,-58,13,'#f3d0a8');g.rrf(-6,-74,30,12,6,'#ffc857');c.strokeStyle='#2a3a6a';c.lineWidth=7;c.beginPath();c.moveTo(2,-40);c.lineTo(20,-14);c.stroke();c.restore();
 if(s.rt>0)g.txt(s.res,W/2,360,50,'#ffffff','center',g.FD,400);if(s.st==='air'&&!s.res)g.txt('押して回転！',W/2,300,26,'rgba(255,255,255,.7)')}});

// 99. イライラ棒
function wrNew(s,g){const pts=[[60,g.rnd(300,700)]];let x=60;while(x<660){x+=g.rnd(70,120);pts.push([Math.min(660,x),g.clamp(pts[pts.length-1][1]+g.rnd(-200,200),180,880)])}s.pts=pts;s.hw=Math.max(26,48-s.lv*4);s.rx=pts[0][0];s.ry=pts[0][1];s.cp=0;s.hit=0}
function wrDist(s,x,y,g){let m=1e9,seg=0;for(let i=1;i<s.pts.length;i++){const d=g.segDist(x,y,s.pts[i-1][0],s.pts[i-1][1],s.pts[i][0],s.pts[i][1]);if(d<m){m=d;seg=i}}return[m,seg]}
reg({id:'wire',name:'イライラ棒',genre:'イライラ棒',color:'#ff6f59',time:45,goal:300,
howto:'ドラッグでリングを動かす（指からずらして操作）\n壁に触れずにゴールまで運ぼう',
init(g){const s={lv:0};wrNew(s,g);return s},
update(s,g,dt){const{I}=g;s.hit=Math.max(0,s.hit-dt);if(s.hit>.6)return;let mx=0,my=0;if(I.down){mx=I.x-I.px;my=I.y-I.py}const k=I.keys,sp=220*dt;if(k.ArrowLeft)mx-=sp;if(k.ArrowRight)mx+=sp;if(k.ArrowUp)my-=sp;if(k.ArrowDown)my+=sp;
 const steps=Math.ceil(Math.hypot(mx,my)/4)||1;for(let i=0;i<steps;i++){s.rx+=mx/steps;s.ry+=my/steps;const[d,seg]=wrDist(s,s.rx,s.ry,g);if(d>s.hw-10){g.sfx('bad');g.add(-10,s.rx,s.ry-40);g.flash('#ff3b3b',.25);g.shake(8);s.hit=1;const p=s.pts[s.cp];s.rx=p[0];s.ry=p[1];return}if(seg-1>s.cp){s.cp=seg-1;g.tone(600+s.cp*40,.04,'sine',.08)}}
 const e=s.pts[s.pts.length-1];if(g.dist(s.rx,s.ry,e[0],e[1])<20){g.add(100,e[0],e[1]-50);g.float('ゴール！',360,480,'#ffe28a',50);g.sfx('win');s.lv++;wrNew(s,g)}},
draw(s,g,c){const{W}=g;g.bg('#14101e','#0a0812');c.lineCap='round';c.lineJoin='round';c.strokeStyle='#3a2a4a';c.lineWidth=s.hw*2+16;c.beginPath();s.pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
 c.strokeStyle=s.hit>0?'#ff3b3b':'#1e1a2a';c.lineWidth=s.hw*2;c.stroke();c.globalCompositeOperation='lighter';g.glow('#ff6f59',14);c.strokeStyle='rgba(255,111,89,.6)';c.lineWidth=3;c.setLineDash([8,10]);c.stroke();c.setLineDash([]);g.noglow();c.globalCompositeOperation='source-over';
 for(let i=1;i<s.pts.length-1;i++){if(i<=s.cp)g.circle(s.pts[i][0],s.pts[i][1],5,'#9be15d')}
 const e=s.pts[s.pts.length-1];g.glow('#ffe28a',20);g.circle(e[0],e[1],16,'#ffe28a');g.noglow();g.txt('GOAL',e[0],e[1]-36,18,'#ffe28a');
 c.strokeStyle='#e8ecf5';c.lineWidth=4;c.beginPath();c.arc(s.rx,s.ry,10,0,TAU);c.stroke();c.beginPath();c.moveTo(s.rx,s.ry+10);c.lineTo(s.rx,s.ry+60);c.stroke();g.rrf(s.rx-6,s.ry+60,12,40,6,'#ff6f59');
 g.txt('コース '+(s.lv+1)+'　道はば '+Math.round(s.hw*2),W/2,120,22,'rgba(255,255,255,.65)')}});

// 100. 消火
reg({id:'firefight',name:'しょうぼう隊',genre:'消火',color:'#e63946',time:45,goal:300,
howto:'押している間、指の方向へ放水する\n燃えている窓を消して火事を広げないで',
init(g){const s={win:[],drops:[],sp:1};for(let r=0;r<5;r++)for(let c=0;c<4;c++)s.win.push({x:150+c*140,y:180+r*120,f:0});for(let i=0;i<2;i++)g.pick(s.win).f=40;return s},
update(s,g,dt){const{I}=g,NX=360,NY=880;s.sp-=dt;if(s.sp<=0){s.sp=Math.max(.9,2.4-g.time*.03);const w=g.pick(s.win.filter(w=>!w.f));if(w)w.f=20}
 if(I.down){const a=Math.atan2(I.y-NY,I.x-NX);for(let i=0;i<3;i++){const aa=a+g.rnd(-.04,.04),v=g.rnd(950,1100);s.drops.push({x:NX+Math.cos(a)*60,y:NY+Math.sin(a)*60,vx:Math.cos(aa)*v,vy:Math.sin(aa)*v,t:0})}if(Math.random()<dt*10)g.noise(.08,.04,0,3000)}
 for(const d of s.drops){d.vy+=700*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.t+=dt;for(const w of s.win){if(w.f>0&&Math.abs(d.x-w.x)<52&&Math.abs(d.y-w.y)<44){w.f-=2.2;d.dead=1;if(w.f<=0){w.f=0;g.add(15,w.x,w.y-50);g.tone(800,.06,'triangle',.12);g.burst(w.x,w.y,'#cfe8ff',12,200,4,-200)}break}}}
 s.drops=s.drops.filter(d=>!d.dead&&d.t<1.4&&d.y<980);
 for(const w of s.win){if(w.f<=0)continue;w.f=Math.min(100,w.f+dt*9);if(w.f>=100&&Math.random()<dt*.6){const nb=s.win.filter(o=>!o.f&&Math.abs(o.x-w.x)+Math.abs(o.y-w.y)<170);if(nb.length){g.pick(nb).f=20;g.tone(150,.2,'sawtooth',.08)}}}
 const burning=s.win.filter(w=>w.f>0).length;if(burning>=14){g.sfx('lose');g.over('火事が広がりすぎた！')}},
draw(s,g,c){const{W,H,I}=g,NX=360,NY=880;g.bg('#1a0f2a','#3a1a2a');c.globalCompositeOperation='lighter';const glw=c.createRadialGradient(360,500,50,360,500,500);glw.addColorStop(0,'rgba(255,100,40,'+(.05+s.win.filter(w=>w.f>0).length*.012)+')');glw.addColorStop(1,'rgba(255,100,40,0)');c.fillStyle=glw;c.fillRect(0,0,W,H);c.globalCompositeOperation='source-over';
 g.rrf(70,110,580,680,10,'#8a6a5a');c.fillStyle='#6a4a3a';for(let y=120;y<780;y+=30)c.fillRect(70,y,580,3);
 for(const w of s.win){g.rrf(w.x-50,w.y-42,100,84,6,w.f>0?'#3a1a10':'#5a7a9a');c.fillStyle='rgba(255,255,255,.15)';c.fillRect(w.x-46,w.y-38,40,30);c.strokeStyle='#4a3a30';c.lineWidth=4;c.strokeRect(w.x-50,w.y-42,100,84);
  if(w.f>0){const k=w.f/100,t=g.time;c.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const fx=w.x-30+i*12,fh=(30+k*60)*(.6+.4*Math.sin(t*12+i*1.7));const fg=c.createLinearGradient(fx,w.y+40,fx,w.y+40-fh);fg.addColorStop(0,'rgba(255,200,60,.9)');fg.addColorStop(.5,'rgba(255,90,30,.7)');fg.addColorStop(1,'rgba(255,40,20,0)');c.fillStyle=fg;c.beginPath();c.moveTo(fx-10,w.y+40);c.quadraticCurveTo(fx,w.y+40-fh*1.2,fx+10,w.y+40);c.fill()}c.globalCompositeOperation='source-over';
   g.rrf(w.x-40,w.y+46,80,6,3,'rgba(0,0,0,.4)');g.rrf(w.x-40,w.y+46,80*k,6,3,k>.9?'#ff3b3b':'#ffc857')}}
 c.globalCompositeOperation='lighter';for(const d of s.drops)g.circle(d.x,d.y,5,'rgba(160,210,255,.55)');c.globalCompositeOperation='source-over';
 c.fillStyle='#4a4a58';c.fillRect(0,820,W,140);g.rrf(NX-90,850,180,70,14,'#e63946');g.circle(NX-50,926,18,'#1b1b24');g.circle(NX+50,926,18,'#1b1b24');
 const a=I.down?Math.atan2(I.y-NY,I.x-NX):-Math.PI/2;c.save();c.translate(NX,NY);c.rotate(a);g.rrf(0,-9,70,18,6,'#c8ccd8');c.restore();
 g.txt('燃えている窓 '+s.win.filter(w=>w.f>0).length+' / 14でアウト',W/2,92,20,'#ffd0b0')}});
})();
