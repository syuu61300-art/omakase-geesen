// Pack 1 — games 1-13
(()=>{const reg=MG.reg;const TAU=Math.PI*2;

// 1. シューティング
reg({id:'shooter',name:'スターストライカー',genre:'シューティング',color:'#5b8cff',time:40,goal:600,
howto:'ドラッグで機体を動かす\n弾は自動で発射される',
init(g){const{W,H}=g;return{x:W/2,y:H-170,tx:W/2,ty:H-170,bul:[],en:[],eb:[],fire:0,spawn:.6,hp:3,inv:0,stars:Array.from({length:110},()=>({x:g.rnd(W),y:g.rnd(H),z:g.rnd(.15,1)}))}},
update(s,g,dt){const{W,H,I}=g,k=I.keys,sp=620*dt;
 if(I.down){s.tx=I.x;s.ty=I.y-100}
 if(k.ArrowLeft||k.a)s.tx-=sp;if(k.ArrowRight||k.d)s.tx+=sp;if(k.ArrowUp||k.w)s.ty-=sp;if(k.ArrowDown||k.s)s.ty+=sp;
 s.tx=g.clamp(s.tx,30,W-30);s.ty=g.clamp(s.ty,140,H-50);const f=Math.min(1,dt*14);s.x+=(s.tx-s.x)*f;s.y+=(s.ty-s.y)*f;
 for(const st of s.stars){st.y+=st.z*260*dt;if(st.y>H){st.y-=H;st.x=g.rnd(W)}}
 s.fire-=dt;if(s.fire<=0){s.fire=.1;s.bul.push({x:s.x-13,y:s.y-26},{x:s.x+13,y:s.y-26})}
 for(const b of s.bul)b.y-=1100*dt;
 const d=Math.min(1,g.time/35);s.spawn-=dt;
 if(s.spawn<=0){s.spawn=g.rnd(.45,.85)*(1-d*.5);const r=Math.random();
  if(r<.5){const n=g.ri(3,5),bx=g.rnd(140,W-140);for(let i=0;i<n;i++)s.en.push({k:0,bx,x:bx,y:-40-i*60,r:22,hp:1,vy:170+d*80,ph:i*.6,t:0,col:'#ff7ab6',pts:10,fl:0})}
  else if(r<.8)s.en.push({k:1,x:g.rnd(80,W-80),y:-50,r:36,hp:5,vy:80+d*40,t:0,cd:1,col:'#ffc857',pts:40,fl:0});
  else{const x=g.rnd(60,W-60),a=Math.atan2(s.y+50,s.x-x);s.en.push({k:2,x,y:-30,r:18,hp:1,vx:Math.cos(a)*320,vy:Math.sin(a)*320+100,t:0,col:'#2ec4b6',pts:15,fl:0})}}
 for(const e of s.en){e.t+=dt;e.fl-=dt;
  if(e.k===0){e.y+=e.vy*dt;e.x=e.bx+Math.sin(e.t*3+e.ph)*90}
  else if(e.k===1){e.y+=e.vy*dt;e.cd-=dt;if(e.cd<=0&&e.y>40){e.cd=1.3-d*.4;const a=Math.atan2(s.y-e.y,s.x-e.x);for(let i=-1;i<=1;i++)s.eb.push({x:e.x,y:e.y+20,vx:Math.cos(a+i*.25)*300,vy:Math.sin(a+i*.25)*300})}}
  else{e.x+=e.vx*dt;e.y+=e.vy*dt}}
 for(const b of s.eb){b.x+=b.vx*dt;b.y+=b.vy*dt}
 for(const b of s.bul){if(b.dead)continue;for(const e of s.en){if(e.dead)continue;if(Math.abs(b.x-e.x)<e.r+6&&Math.abs(b.y-e.y)<e.r+10){b.dead=1;e.hp--;e.fl=.06;if(e.hp<=0){e.dead=1;g.add(e.pts,e.x,e.y-20,e.col);g.burst(e.x,e.y,e.col,22,320,5,0);g.sfx('hit');if(e.k===1)g.shake(8)}break}}}
 s.inv-=dt;
 if(s.inv<=0){let hit=false;for(const b of s.eb)if(!b.dead&&g.dist(b.x,b.y,s.x,s.y)<18){b.dead=1;hit=true}
  for(const e of s.en)if(!e.dead&&g.dist(e.x,e.y,s.x,s.y)<e.r+16){e.dead=1;hit=true;g.burst(e.x,e.y,e.col,16,260,5,0)}
  if(hit){s.hp--;s.inv=1.3;g.shake(16);g.flash('#ff6f59',.45);g.sfx('bad');g.burst(s.x,s.y,'#ff6f59',30,360,5,0);if(s.hp<=0){g.sfx('boom');g.over('撃墜された…')}}}
 s.bul=s.bul.filter(b=>!b.dead&&b.y>-30);s.eb=s.eb.filter(b=>!b.dead&&b.y<H+30&&b.y>-40&&b.x>-30&&b.x<W+30);s.en=s.en.filter(e=>!e.dead&&e.y<H+60&&e.x>-80&&e.x<W+80)},
draw(s,g,c){const{W,H}=g;g.bg('#060a1c','#1a1040');
 let gr=c.createRadialGradient(W*.25,H*.3,10,W*.25,H*.3,360);gr.addColorStop(0,'rgba(255,122,182,.28)');gr.addColorStop(1,'rgba(255,122,182,0)');c.fillStyle=gr;c.fillRect(0,0,W,H);
 gr=c.createRadialGradient(W*.8,H*.72,10,W*.8,H*.72,420);gr.addColorStop(0,'rgba(91,140,255,.25)');gr.addColorStop(1,'rgba(91,140,255,0)');c.fillStyle=gr;c.fillRect(0,0,W,H);
 for(const st of s.stars){c.fillStyle='rgba(255,255,255,'+st.z+')';c.fillRect(st.x,st.y,st.z*2.5,st.z*8)}
 c.globalCompositeOperation='lighter';g.glow('#8fe3ff',14);c.fillStyle='#bff1ff';for(const b of s.bul){g.rr(b.x-3,b.y-12,6,24,3);c.fill()}
 c.fillStyle='#ff7ab6';g.glow('#ff7ab6',16);for(const b of s.eb){c.beginPath();c.arc(b.x,b.y,7,0,TAU);c.fill()}
 c.fillStyle='#ffffff';for(const b of s.eb){c.beginPath();c.arc(b.x,b.y,3,0,TAU);c.fill()}
 c.globalCompositeOperation='source-over';
 for(const e of s.en){g.glow(e.col,22);c.fillStyle=e.fl>0?'#ffffff':e.col;
  if(e.k===0){g.poly(e.x,e.y,e.r,6,e.t*2);c.fill();g.noglow();c.fillStyle='rgba(10,10,30,.55)';g.poly(e.x,e.y,e.r*.45,6,-e.t*2);c.fill()}
  else if(e.k===1){g.poly(e.x,e.y,e.r,8,e.t);c.fill();g.noglow();c.fillStyle='#3a2a10';c.beginPath();c.arc(e.x,e.y,e.r*.5,0,TAU);c.fill();c.fillStyle='#ff6f59';c.beginPath();c.arc(e.x,e.y,e.r*.25,0,TAU);c.fill()}
  else{c.beginPath();c.moveTo(e.x,e.y+e.r*1.4);c.lineTo(e.x-e.r,e.y-e.r);c.lineTo(e.x+e.r,e.y-e.r);c.closePath();c.fill()}}
 g.noglow();
 if(!(s.inv>0&&Math.floor(g.time*16)%2)){const x=s.x,y=s.y,fl=14+Math.random()*12;
  c.globalCompositeOperation='lighter';gr=c.createLinearGradient(0,y+14,0,y+16+fl*2);gr.addColorStop(0,'rgba(255,200,87,.95)');gr.addColorStop(1,'rgba(255,111,89,0)');c.fillStyle=gr;c.beginPath();c.moveTo(x-10,y+16);c.lineTo(x,y+16+fl*2);c.lineTo(x+10,y+16);c.fill();c.globalCompositeOperation='source-over';
  g.glow('#5b8cff',20);gr=c.createLinearGradient(x-32,0,x+32,0);gr.addColorStop(0,'#3d64d8');gr.addColorStop(.5,'#eef4ff');gr.addColorStop(1,'#3d64d8');c.fillStyle=gr;
  c.beginPath();c.moveTo(x,y-36);c.lineTo(x+10,y-8);c.lineTo(x+32,y+14);c.lineTo(x+10,y+12);c.lineTo(x,y+20);c.lineTo(x-10,y+12);c.lineTo(x-32,y+14);c.lineTo(x-10,y-8);c.closePath();c.fill();g.noglow();
  c.fillStyle='#ff7ab6';c.beginPath();c.ellipse(x,y-6,5,10,0,0,TAU);c.fill()}
 for(let i=0;i<3;i++){c.globalAlpha=i<s.hp?1:.2;g.txt('♥',36+i*36,H-34,30,'#ff6f59')}c.globalAlpha=1}});

// 2. スワイプ斬り
const FR=[{r:44,c1:'#2f8f3c',c2:'#ff4d5e',seed:'#1b1b1b',stripe:1},{r:32,c1:'#ff9a1f',c2:'#ffc46b'},{r:30,c1:'#d7263d',c2:'#fff1d6',seed:'#6b3b1b'},{r:28,c1:'#7a5230',c2:'#8fd14f',seed:'#222222'},{r:34,c1:'#ffd23f',c2:'#fff3a8'},{r:30,c1:'#6b2fa0',c2:'#d8c2ff',seed:'#3a1d5c'}];
function fruit(c,g,f,r){c.beginPath();c.arc(0,0,r,0,TAU);const gr=c.createRadialGradient(-r*.35,-r*.35,r*.1,0,0,r);gr.addColorStop(0,g.shade(f.c1,.35));gr.addColorStop(1,g.shade(f.c1,-.35));c.fillStyle=gr;c.fill();
 if(f.stripe){c.save();c.clip();c.strokeStyle=g.shade(f.c1,-.45);c.lineWidth=5;for(let i=-2;i<=2;i++){c.beginPath();c.ellipse(i*r*.32,0,r*.12,r*.95,0,0,TAU);c.stroke()}c.restore()}
 c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(-r*.35,-r*.42,r*.25,r*.14,-.6,0,TAU);c.fill();
 c.fillStyle='#4caf50';c.beginPath();c.ellipse(r*.15,-r-4,11,5,-.5,0,TAU);c.fill()}
function halfF(c,g,f,r,sd){const a0=sd<0?Math.PI:0;c.fillStyle=g.shade(f.c1,-.15);c.beginPath();c.arc(0,0,r,a0,a0+Math.PI);c.closePath();c.fill();c.fillStyle=f.c2;c.beginPath();c.arc(0,0,r*.84,a0,a0+Math.PI);c.closePath();c.fill();
 if(f.seed){c.fillStyle=f.seed;for(let i=0;i<5;i++){const a=a0+.4+i*.58;c.beginPath();c.ellipse(Math.cos(a)*r*.5,Math.sin(a)*r*.5,2.5,4.5,a,0,TAU);c.fill()}}}
reg({id:'slice',name:'フルーツ一閃',genre:'スワイプ斬り',color:'#ff6f59',time:35,goal:350,
howto:'画面をなぞって果物を斬る\n爆弾は斬らないこと',
init(){return{items:[],halves:[],splats:[],spawn:.5,combo:0,ct:0}},
update(s,g,dt){const{W,H,I}=g;
 s.spawn-=dt;if(s.spawn<=0){s.spawn=g.rnd(.55,1.1)-Math.min(.3,g.time/100);const n=g.ri(1,g.time>15?3:2);
  for(let i=0;i<n;i++){const bomb=Math.random()<.15,f=g.pick(FR);s.items.push({x:g.rnd(120,W-120),y:H+50,vx:g.rnd(-130,130),vy:-g.rnd(860,1040),r:bomb?34:f.r,rot:0,vr:g.rnd(-3,3),f,bomb})}}
 for(const it of s.items){it.vy+=900*dt;it.x+=it.vx*dt;it.y+=it.vy*dt;it.rot+=it.vr*dt}
 for(const h of s.halves){h.vy+=1100*dt;h.x+=h.vx*dt;h.y+=h.vy*dt;h.rot+=h.vr*dt}
 for(const p of s.splats)p.life-=dt;
 s.ct-=dt;if(s.ct<=0)s.combo=0;
 if(I.down&&g.dist(I.px,I.py,I.x,I.y)>5){for(const it of s.items){if(it.dead)continue;if(g.segDist(it.x,it.y,I.px,I.py,I.x,I.y)<it.r+4){it.dead=1;
  if(it.bomb){g.add(-50,it.x,it.y,'#ff6f59');g.shake(20);g.flash('#ffffff',.6);g.sfx('boom');g.burst(it.x,it.y,'#ffc857',40,520,6,0);s.combo=0}
  else{s.combo++;s.ct=.35;const pts=10+(s.combo>1?s.combo*5:0);g.add(pts,it.x,it.y-34,it.f.c2);if(s.combo>2)g.float(s.combo+'連斬！',W/2,200,'#ffffff',40);g.sfx('pop');g.burst(it.x,it.y,it.f.c2,18,300,5);
   const a=Math.atan2(I.y-I.py,I.x-I.px);for(const sd of[-1,1])s.halves.push({x:it.x,y:it.y,vx:it.vx*.5+Math.cos(a+sd*1.57)*140,vy:Math.min(0,it.vy*.3)+Math.sin(a+sd*1.57)*140,rot:a,vr:sd*4,f:it.f,r:it.r,sd});
   s.splats.push({x:it.x,y:it.y,r:it.r*1.5,c:it.f.c2,life:2.5})}}}}
 s.items=s.items.filter(it=>!it.dead&&it.y<H+120);s.halves=s.halves.filter(h=>h.y<H+120);s.splats=s.splats.filter(p=>p.life>0)},
draw(s,g,c){const{W,H}=g;g.bg('#4a2c1c','#1f120b');
 for(let y=0;y<H;y+=130){c.fillStyle='rgba(0,0,0,.22)';c.fillRect(0,y,W,4);c.fillStyle='rgba(255,220,180,.05)';c.fillRect(0,y+4,W,3)}
 for(const p of s.splats){c.globalAlpha=Math.min(1,p.life)*.35;g.circle(p.x,p.y,p.r,p.c);g.circle(p.x+p.r*.8,p.y+p.r*.3,p.r*.3,p.c)}c.globalAlpha=1;
 for(const h of s.halves){c.save();c.translate(h.x,h.y);c.rotate(h.rot);halfF(c,g,h.f,h.r,h.sd);c.restore()}
 for(const it of s.items){c.save();c.translate(it.x,it.y);c.rotate(it.rot);
  if(it.bomb){const gr=c.createRadialGradient(-10,-10,4,0,0,it.r);gr.addColorStop(0,'#5a5a6a');gr.addColorStop(1,'#111118');c.fillStyle=gr;c.beginPath();c.arc(0,0,it.r,0,TAU);c.fill();
   c.strokeStyle='#c9a46a';c.lineWidth=4;c.beginPath();c.moveTo(0,-it.r);c.quadraticCurveTo(10,-it.r-14,4,-it.r-22);c.stroke();
   g.glow('#ffc857',24);g.circle(4,-it.r-24,5+Math.random()*4,'#ffe28a');g.noglow();g.txt('✕',0,2,26,'#ff6f59')}
  else fruit(c,g,it.f,it.r);c.restore()}
 const T=g.I.trail;if(T.length>1){c.lineCap='round';c.globalCompositeOperation='lighter';g.glow('#9fe8ff',16);for(let i=1;i<T.length;i++){c.strokeStyle='rgba(255,255,255,'+(i/T.length)+')';c.lineWidth=2+i/T.length*12;c.beginPath();c.moveTo(T[i-1].x,T[i-1].y);c.lineTo(T[i].x,T[i].y);c.stroke()}}
 g.noglow();c.globalCompositeOperation='source-over';g.vignette(.45)}});

// 3. リズム
const LC=['#ff6f59','#ffc857','#2ec4b6','#5b8cff'],PENTA=[523,587,659,784];
reg({id:'rhythm',name:'ビートレーン',genre:'リズム',color:'#ff7ab6',time:40,goal:900,
howto:'ノーツが光る線に重なった瞬間に\nそのレーンをタップ（D F J K キーも可）',
init(g){const bpm=124,beat=60/bpm,notes=[];let t=2.2;while(t<39){const lane=g.ri(0,3);notes.push({t,lane});if(t>10&&Math.random()<.22)notes.push({t,lane:(lane+g.ri(1,3))%4});t+=beat*(t>6&&Math.random()<.3?.5:1)*(Math.random()<.15?2:1)}
 return{beat,notes,lastBeat:-1,lastHalf:-1,combo:0,judge:'',jc:'#fff',jt:0,press:[0,0,0,0],speed:540}},
update(s,g,dt){const{W,H,I}=g,T=g.time,JY=H-190;
 const bi=Math.floor(T/s.beat);if(bi!==s.lastBeat){s.lastBeat=bi;g.tone(150,.2,'sine',.5,45);if(bi%2===1)g.noise(.12,.18,0,1500)}
 const hi=Math.floor(T/(s.beat/2));if(hi!==s.lastHalf){s.lastHalf=hi;if(hi%2===1)g.noise(.04,.07,0,7000)}
 const hits=[];if(I.pressed)hits.push(g.clamp(Math.floor(I.x/(W/4)),0,3));
 const km={d:0,f:1,j:2,k:3,D:0,F:1,J:2,K:3};for(const k in I.kp)if(k in km)hits.push(km[k]);
 for(const ln of hits){s.press[ln]=.18;let bn=null,bd=.16;for(const n of s.notes){if(n.hit||n.miss||n.lane!==ln)continue;const d=Math.abs(n.t-T);if(d<bd){bd=d;bn=n}}
  if(bn){bn.hit=1;s.combo++;const mul=1+Math.min(1,s.combo/30);const x=ln*W/4+W/8;
   if(bd<.055){g.add(Math.round(30*mul));s.judge='PERFECT';s.jc='#ffc857';g.burst(x,JY,LC[ln],22,340,5,0)}else{g.add(Math.round(15*mul));s.judge='GOOD';s.jc='#2ec4b6';g.burst(x,JY,LC[ln],10,220,4,0)}
   s.jt=.5;g.tone(PENTA[ln]*(s.combo%8>3?2:1),.15,'triangle',.18)}}
 for(const n of s.notes)if(!n.hit&&!n.miss&&T-n.t>.16){n.miss=1;s.combo=0;s.judge='MISS';s.jc='#ff6f59';s.jt=.5}
 for(let i=0;i<4;i++)s.press[i]=Math.max(0,s.press[i]-dt);s.jt-=dt},
draw(s,g,c){const{W,H}=g,T=g.time,JY=H-190,lw=W/4,p=1-((T/s.beat)%1);g.bg('#1a0b2e','#30103f');
 for(let r=0;r<5;r++){c.strokeStyle='rgba(255,122,182,'+(.12+p*.12)*(1-r/5)+')';c.lineWidth=3;c.beginPath();c.arc(W/2,180,60+r*70+p*20,0,TAU);c.stroke()}
 for(let i=0;i<4;i++){const gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,g.rgba(LC[i],.10+s.press[i]*1.8));c.fillStyle=gr;c.fillRect(i*lw+4,0,lw-8,H);c.fillStyle='rgba(255,255,255,.06)';c.fillRect(i*lw,0,2,H)}
 c.globalCompositeOperation='lighter';g.glow('#ff7ab6',20+p*20);c.fillStyle='rgba(255,255,255,'+(.6+p*.4)+')';c.fillRect(0,JY-3,W,6);
 for(const n of s.notes){if(n.hit)continue;const y=JY-(n.t-T)*s.speed;if(y<-40||y>H+40)continue;const x=n.lane*lw+lw/2;c.globalAlpha=n.miss?.25:1;g.glow(LC[n.lane],18);g.rrf(x-64,y-16,128,32,16,LC[n.lane]);g.rrf(x-50,y-8,100,8,4,'rgba(255,255,255,.7)')}
 c.globalAlpha=1;g.noglow();c.globalCompositeOperation='source-over';
 for(let i=0;i<4;i++){g.circle(i*lw+lw/2,JY,26+s.press[i]*60,g.rgba(LC[i],.25+s.press[i]*2));g.txt('DFJK'[i],i*lw+lw/2,JY+70,22,'rgba(255,255,255,.35)')}
 if(s.combo>2){c.globalAlpha=.2;g.txt(String(s.combo),W/2,H*.42,160,'#ffffff','center',g.FD,400);c.globalAlpha=1;g.txt('COMBO',W/2,H*.42+100,28,'rgba(255,255,255,.5)')}
 if(s.jt>0){c.globalAlpha=Math.min(1,s.jt*3);g.txt(s.judge,W/2,JY-120-(.5-s.jt)*40,48,s.jc,'center',g.FD,400);c.globalAlpha=1}}});

// 4. 積み上げ
const BH=46;
function nb(s,g){const t=s.bl[s.bl.length-1];s.dir*=-1;s.cur={x:s.dir>0?-t.w:g.W,w:t.w,k:t.k+1,h:(t.h+14)%360}}
function blk(c,x,y,w,h){const d=16;c.fillStyle='hsl('+h+',70%,64%)';c.beginPath();c.moveTo(x,y);c.lineTo(x+d,y-d);c.lineTo(x+w+d,y-d);c.lineTo(x+w,y);c.closePath();c.fill();
 c.fillStyle='hsl('+h+',62%,50%)';c.fillRect(x,y,w,BH);c.fillStyle='hsl('+h+',58%,34%)';c.beginPath();c.moveTo(x+w,y);c.lineTo(x+w+d,y-d);c.lineTo(x+w+d,y-d+BH);c.lineTo(x+w,y+BH);c.closePath();c.fill();
 c.fillStyle='rgba(255,255,255,.2)';c.fillRect(x,y,w,4)}
reg({id:'stack',name:'そらまでタワー',genre:'積み上げ',color:'#ffc857',time:45,goal:300,
howto:'タップで動くブロックを落とす\nはみ出た部分は切り落とされる',
init(g){const W=g.W,s={bl:[{x:W/2-140,w:280,k:0,h:20}],cur:null,dir:1,sp:300,cam:0,deb:[],clouds:Array.from({length:7},()=>({x:g.rnd(W),y:g.rnd(-1600,700),w:g.rnd(90,190)}))};nb(s,g);return s},
update(s,g,dt){const{W,H,I}=g,yOf=k=>H-140-k*BH+s.cam;
 const c=s.cur;if(c){c.x+=s.dir*s.sp*dt;if(s.dir<0&&c.x<-40)s.dir=1;if(s.dir>0&&c.x+c.w>W+40)s.dir=-1;
  if(I.pressed||I.kp[' ']){const t=s.bl[s.bl.length-1],L=Math.max(c.x,t.x),R=Math.min(c.x+c.w,t.x+t.w),ov=R-L;
   if(ov<=0){s.deb.push({x:c.x,w:c.w,k:c.k,h:c.h,dy:0,vy:0,rot:0,vr:s.dir*1.5});s.cur=null;g.sfx('boom');g.shake(12);g.over('タワーが崩れた！');return}
   if(Math.abs(c.x-t.x)<8){c.x=t.x;c.w=t.w;g.add(20,c.x+c.w/2,yOf(c.k)-40);g.float('ピッタリ！',W/2,240,'#ffffff',38);g.sfx('good');g.burst(c.x+c.w/2,yOf(c.k),'#ffe28a',26,300,5)}
   else{if(c.x<t.x)s.deb.push({x:c.x,w:t.x-c.x,k:c.k,h:c.h,dy:0,vy:0,rot:0,vr:-1.5});if(c.x+c.w>t.x+t.w)s.deb.push({x:t.x+t.w,w:c.x+c.w-t.x-t.w,k:c.k,h:c.h,dy:0,vy:0,rot:0,vr:1.5});c.x=L;c.w=ov;g.add(10,c.x+c.w/2,yOf(c.k)-40);g.sfx('pop')}
   s.bl.push(c);s.sp=Math.min(720,s.sp+14);nb(s,g)}}
 for(const d of s.deb){d.vy+=1600*dt;d.dy+=d.vy*dt;d.rot+=d.vr*dt}s.deb=s.deb.filter(d=>d.dy<H+200);
 const tg=Math.max(0,(s.bl.length-7)*BH);s.cam+=(tg-s.cam)*Math.min(1,dt*5)},
draw(s,g,c){const{W,H}=g,yOf=k=>H-140-k*BH+s.cam,t=Math.min(1,s.bl.length/40);g.bg(g.mix('#ffb38a','#1d1846',t),g.mix('#ffe8bf','#5b4a8a',t));
 if(t>.3){c.globalAlpha=(t-.3)*1.4;for(let i=0;i<40;i++)g.circle((i*137)%W,(i*251+s.cam*.1)%H,1.6,'#ffffff');c.globalAlpha=1}
 for(const cl of s.clouds){const y=cl.y+s.cam*.5;if(y<-80||y>H+80)continue;c.globalAlpha=.7;g.circle(cl.x,y,cl.w*.3,'#ffffff');g.circle(cl.x+cl.w*.3,y+6,cl.w*.24,'#ffffff');g.circle(cl.x-cl.w*.3,y+8,cl.w*.2,'#ffffff');c.globalAlpha=1}
 const gy=yOf(0)+BH;if(gy<H){c.fillStyle='#3c6e47';c.fillRect(0,gy,W,H-gy);c.fillStyle='#2c5236';c.fillRect(0,gy,W,10)}
 for(const b of s.bl){const y=yOf(b.k);if(y>-BH&&y<H+BH)blk(c,b.x,y,b.w,b.h)}
 for(const d of s.deb){c.save();c.translate(d.x+d.w/2,yOf(d.k)+d.dy+BH/2);c.rotate(d.rot);blk(c,-d.w/2,-BH/2,d.w,d.h);c.restore()}
 if(s.cur){g.glow('#ffffff',18);blk(c,s.cur.x,yOf(s.cur.k),s.cur.w,s.cur.h);g.noglow()}
 c.globalAlpha=.85;g.txt((s.bl.length-1)+'F',W/2,140,64,'#ffffff','center',g.FD,400);c.globalAlpha=1}});

// 5. 記憶
function sym(c,g,id,x,y,r){const cols=['#ff6f59','#ffc857','#5b8cff','#ff7ab6','#2ec4b6','#a98bff','#f2a33a','#7bc950'];c.fillStyle=cols[id];
 if(id===0){c.beginPath();c.arc(x,y,r,0,TAU);c.fill()}else if(id===1){g.poly(x,y+r*.15,r*1.1,3,-Math.PI/2);c.fill()}else if(id===2){g.star(x,y,r*1.1,r*.5);c.fill()}
 else if(id===3){c.beginPath();c.moveTo(x,y+r*.9);c.bezierCurveTo(x-r*1.6,y-r*.1,x-r*.6,y-r*1.2,x,y-r*.4);c.bezierCurveTo(x+r*.6,y-r*1.2,x+r*1.6,y-r*.1,x,y+r*.9);c.fill()}
 else if(id===4){g.poly(x,y,r*1.1,4,0);c.fill()}else if(id===5){g.poly(x,y,r,6,0);c.fill()}
 else if(id===6){c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.fillStyle='#fff7ea';c.beginPath();c.arc(x+r*.45,y-r*.3,r*.85,0,TAU);c.fill()}
 else{c.fillRect(x-r*.3,y-r,r*.6,r*2);c.fillRect(x-r,y-r*.3,r*2,r*.6)}}
function deal(g){const ids=g.shuffle([0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7]);return ids.map((id,i)=>({id,r:Math.floor(i/4),c:i%4,f:0,up:false,done:false}))}
reg({id:'memory',name:'ペアめくり',genre:'記憶',color:'#2ec4b6',time:50,goal:260,
howto:'カードを2枚めくって\n同じ絵柄をそろえよう',
init(g){return{cards:deal(g),open:[],lock:0,redeal:0}},
update(s,g,dt){const{I}=g,cw=140,ch=150,gap=18,ox=(g.W-(cw*4+gap*3))/2,oy=210;
 for(const cd of s.cards)cd.f+=((cd.up||cd.done?1:0)-cd.f)*Math.min(1,dt*12);
 if(s.redeal>0){s.redeal-=dt;if(s.redeal<=0){s.cards=deal(g);s.open=[]}return}
 if(s.lock>0){s.lock-=dt;if(s.lock<=0){for(const cd of s.open)cd.up=false;s.open=[]}return}
 if(I.pressed&&s.open.length<2){for(const cd of s.cards){const x=ox+cd.c*(cw+gap),y=oy+cd.r*(ch+gap);if(!cd.up&&!cd.done&&I.x>x&&I.x<x+cw&&I.y>y&&I.y<y+ch){cd.up=true;s.open.push(cd);g.sfx('tick');break}}
  if(s.open.length===2){const[a,b]=s.open;if(a.id===b.id){a.done=b.done=true;s.open=[];g.add(25,ox+b.c*(cw+gap)+cw/2,oy+b.r*(ch+gap));g.sfx('good');for(const q of[a,b])g.burst(ox+q.c*(cw+gap)+cw/2,oy+q.r*(ch+gap)+ch/2,'#ffc857',14,240,4);
    if(s.cards.every(q=>q.done)){g.add(50);g.float('ボード完成！',g.W/2,g.H/2,'#ffffff',46);g.sfx('win');s.redeal=.9}}
   else{s.lock=.7;g.tone(260,.15,'triangle',.15)}}}},
draw(s,g,c){const{W,H}=g,cw=140,ch=150,gap=18,ox=(W-(cw*4+gap*3))/2,oy=210;g.bg('#0f3a3a','#0a1f22');
 c.fillStyle='rgba(255,255,255,.04)';for(let y=90;y<H;y+=28)for(let x=(y/28%2)*14;x<W;x+=28){c.beginPath();c.arc(x,y,2,0,TAU);c.fill()}
 g.txt('そろえたペア '+s.cards.filter(q=>q.done).length/2+' / 8',W/2,150,26,'rgba(255,243,223,.8)');
 for(const cd of s.cards){const x=ox+cd.c*(cw+gap)+cw/2,y=oy+cd.r*(ch+gap)+ch/2,sx=Math.abs(Math.cos(cd.f*Math.PI));c.save();c.translate(x,y);c.scale(Math.max(.02,sx),1);
  c.fillStyle='rgba(0,0,0,.3)';g.rr(-cw/2+4,-ch/2+8,cw,ch,16);c.fill();
  if(cd.f<.5){const gr=c.createLinearGradient(0,-ch/2,0,ch/2);gr.addColorStop(0,'#2ec4b6');gr.addColorStop(1,'#16807a');g.rrf(-cw/2,-ch/2,cw,ch,16,gr);c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=2;for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(i*24-30,-ch/2+12);c.lineTo(i*24+30,ch/2-12);c.stroke()}g.rr(-cw/2+8,-ch/2+8,cw-16,ch-16,12);c.strokeStyle='rgba(255,243,223,.6)';c.lineWidth=3;c.stroke()}
  else{if(cd.done)g.glow('#ffc857',24);g.rrf(-cw/2,-ch/2,cw,ch,16,'#fff7ea');g.noglow();sym(c,g,cd.id,0,0,36);if(cd.done){c.strokeStyle='#ffc857';c.lineWidth=5;g.rr(-cw/2+3,-ch/2+3,cw-6,ch-6,14);c.stroke()}}
  c.restore()}}});

// 6. 釣り
const SY=170;
function nf(g,init){const r=Math.random(),tier=r<.5?0:r<.85?1:2,dir=Math.random()<.5?1:-1;
 return{x:init?g.rnd(60,g.W-60):(dir>0?-60:g.W+60),y:[g.rnd(SY+80,420),g.rnd(440,660),g.rnd(690,g.H-80)][tier],dir,sp:g.rnd(50,100)*(1+tier*.5),sz:[22,30,40][tier],col:[['#ffd36b','#ff8f3a'],['#8fe0ff','#2f7fd8'],['#ff9ad5','#9a35d0']][tier],pts:[10,25,60][tier],ph:g.rnd(TAU)}}
reg({id:'fish',name:'しんかい釣り堀',genre:'釣り',color:'#2ec4b6',time:45,goal:400,
howto:'押している間 糸がのびる・離すと巻き上げ\n左右に動かして狙う。クラゲに注意',
init(g){const{W,H}=g;return{bx:W/2,depth:0,hk:null,cool:0,t:0,fish:Array.from({length:9},()=>nf(g,true)),jel:Array.from({length:3},(_,i)=>({bx:150+i*210,by:g.rnd(380,H-180),ph:g.rnd(TAU),x:0,y:0})),bub:[],weed:Array.from({length:9},(_,i)=>({x:40+i*82+g.rnd(-20,20),h:g.rnd(80,170)}))}},
update(s,g,dt){const{W,H,I}=g;s.t+=dt;s.cool-=dt;
 if(I.down)s.bx+=(g.clamp(I.x-60,60,W-130)-s.bx)*Math.min(1,dt*6);if(I.keys.ArrowLeft)s.bx-=300*dt;if(I.keys.ArrowRight)s.bx+=300*dt;s.bx=g.clamp(s.bx,60,W-130);
 const lower=(I.down||I.keys[' ']||I.keys.ArrowDown)&&s.cool<=0;
 s.depth+=lower?(s.hk?200:430)*dt:-(s.hk?320:620)*dt;s.depth=g.clamp(s.depth,0,H-SY-50);
 const hx=s.bx+60,hy=SY+s.depth;
 for(const f of s.fish){if(f===s.hk)continue;f.x+=f.dir*f.sp*dt;f.y+=Math.sin(s.t*2+f.ph)*12*dt;if(f.x<-90||f.x>W+90)Object.assign(f,nf(g,false))}
 if(s.hk){s.hk.x=hx;s.hk.y=hy+s.hk.sz*.7;if(s.depth<=0){g.add(s.hk.pts,hx,SY-40,s.hk.col[0]);g.sfx('coin');g.burst(hx,SY,'#bfefff',20,300,4);Object.assign(s.hk,nf(g,false));s.hk=null}}
 else if(s.depth>20){for(const f of s.fish)if(g.dist(f.x,f.y,hx,hy)<f.sz){s.hk=f;g.sfx('pop');break}}
 for(const j of s.jel){j.x=j.bx+Math.sin(s.t*.6+j.ph)*80;j.y=j.by+Math.sin(s.t*1.3+j.ph)*30;
  if(s.depth>20&&s.cool<=0&&g.dist(j.x,j.y,hx,hy)<42){s.cool=1.2;g.flash('#bfa8ff',.35);g.shake(8);g.sfx('bad');g.add(-10,hx,hy);if(s.hk){s.hk.dir*=-1;s.hk=null}}}
 if(Math.random()<dt*6)s.bub.push({x:g.rnd(W),y:H,r:g.rnd(2,6),v:g.rnd(40,90)});for(const b of s.bub){b.y-=b.v*dt;b.x+=Math.sin(b.y*.05)*.4}s.bub=s.bub.filter(b=>b.y>SY)},
draw(s,g,c){const{W,H}=g,t=s.t,hx=s.bx+60,hy=SY+s.depth;
 let gr=c.createLinearGradient(0,0,0,SY);gr.addColorStop(0,'#ff9a76');gr.addColorStop(1,'#ffd9a0');c.fillStyle=gr;c.fillRect(0,0,W,SY);g.glow('#fff1c1',40);g.circle(W*.78,110,38,'#fff4d6');g.noglow();
 gr=c.createLinearGradient(0,SY,0,H);gr.addColorStop(0,'#1aa3b8');gr.addColorStop(.45,'#0a4b6e');gr.addColorStop(1,'#020c1c');c.fillStyle=gr;c.fillRect(0,SY,W,H-SY);
 c.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const x0=60+i*125+Math.sin(t*.5+i)*30;c.fillStyle='rgba(180,240,255,.05)';c.beginPath();c.moveTo(x0-20,SY);c.lineTo(x0+22,SY);c.lineTo(x0+130,H);c.lineTo(x0+40,H);c.closePath();c.fill()}c.globalCompositeOperation='source-over';
 c.strokeStyle='#1e6b3a';c.lineWidth=10;c.lineCap='round';for(const w of s.weed){c.beginPath();c.moveTo(w.x,H);c.quadraticCurveTo(w.x+Math.sin(t*1.5+w.x)*30,H-w.h*.5,w.x+Math.sin(t*1.2+w.x)*24,H-w.h);c.stroke()}
 for(const b of s.bub){c.strokeStyle='rgba(200,240,255,.45)';c.lineWidth=1.5;c.beginPath();c.arc(b.x,b.y,b.r,0,TAU);c.stroke()}
 for(const j of s.jel){c.globalCompositeOperation='lighter';g.glow('#ff9ad5',24);gr=c.createRadialGradient(j.x,j.y-10,4,j.x,j.y,36);gr.addColorStop(0,'rgba(255,200,240,.9)');gr.addColorStop(1,'rgba(200,120,255,.25)');c.fillStyle=gr;c.beginPath();c.arc(j.x,j.y,34,Math.PI,0);c.closePath();c.fill();g.noglow();
  c.strokeStyle='rgba(255,170,230,.55)';c.lineWidth=3;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(j.x+i*12,j.y);for(let k=1;k<6;k++)c.lineTo(j.x+i*12+Math.sin(t*3+k+i)*6,j.y+k*12);c.stroke()}c.globalCompositeOperation='source-over'}
 for(const f of s.fish){c.save();c.translate(f.x,f.y);if(f===s.hk)c.rotate(-1.3);c.scale(f.dir,1);const z=f.sz,wg=Math.sin(t*8+f.ph)*z*.25;
  c.fillStyle=f.col[1];c.beginPath();c.moveTo(-z*.9,0);c.lineTo(-z*1.7,-z*.55+wg);c.lineTo(-z*1.7,z*.55+wg);c.closePath();c.fill();
  gr=c.createLinearGradient(0,-z*.6,0,z*.6);gr.addColorStop(0,f.col[0]);gr.addColorStop(1,f.col[1]);c.fillStyle=gr;c.beginPath();c.ellipse(0,0,z*1.15,z*.62,0,0,TAU);c.fill();
  c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(z*.1,-z*.25,z*.6,z*.14,0,0,TAU);c.fill();g.circle(z*.6,-z*.15,z*.16,'#ffffff');g.circle(z*.64,-z*.15,z*.08,'#101820');c.restore()}
 c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=1.5;c.beginPath();c.moveTo(s.bx+60,SY-90);c.lineTo(hx,hy);c.stroke();
 c.strokeStyle=s.cool>0?'#ff9ad5':'#d8e2ea';c.lineWidth=4;c.beginPath();c.arc(hx-6,hy+6,9,0,Math.PI);c.lineTo(hx+3,hy-6);c.stroke();
 if(s.cool>0){c.strokeStyle='#fff6a8';c.lineWidth=3;for(let i=0;i<5;i++){const a=i*1.25+t*10;c.beginPath();c.moveTo(hx+Math.cos(a)*14,hy+Math.sin(a)*14);c.lineTo(hx+Math.cos(a)*30,hy+Math.sin(a)*30);c.stroke()}}
 c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.moveTo(0,SY);for(let x=0;x<=W;x+=20)c.lineTo(x,SY+Math.sin(x*.04+t*2)*4);c.lineTo(W,SY+10);c.lineTo(0,SY+10);c.fill();
 const bx=s.bx,by=SY+Math.sin(t*2)*3;c.fillStyle='#8a4b2a';c.beginPath();c.moveTo(bx-70,by-12);c.lineTo(bx+70,by-12);c.quadraticCurveTo(bx+60,by+20,bx+30,by+20);c.lineTo(bx-30,by+20);c.quadraticCurveTo(bx-60,by+20,bx-70,by-12);c.fill();c.fillStyle='#b5683c';c.fillRect(bx-70,by-16,140,7);
 g.circle(bx-10,by-40,14,'#ffc857');c.fillStyle='#ff6f59';c.fillRect(bx-22,by-28,24,18);c.strokeStyle='#4a2a14';c.lineWidth=5;c.beginPath();c.moveTo(bx,by-22);c.lineTo(bx+60,by-92+SY-by);c.stroke();
 g.txt(Math.round(s.depth/4)+'m',hx+24,hy,18,'rgba(255,255,255,.75)','left')}});

// 7. ラン
reg({id:'runner',name:'ゆうやけダッシュ',genre:'ランアクション',color:'#ff9f43',time:40,goal:450,
howto:'タップでジャンプ（空中でもう1回）\n障害物をよけて走り続けよう',
init(g){return{y:0,vy:0,jumps:0,x:180,sp:430,obs:[],coins:[],spawn:1.2,dist:0,sq:1,bld:Array.from({length:24},()=>({w:g.rnd(50,110),h:g.rnd(80,260)}))}},
update(s,g,dt){const{W,H,I}=g,GY=H-220;s.sp+=9*dt;s.dist+=s.sp*dt;g.score+=s.sp*dt/80;
 if((I.pressed||I.kp[' ']||I.kp.ArrowUp)&&s.jumps<2){s.vy=s.jumps?-820:-920;s.jumps++;g.sfx('jump');s.sq=.7;g.burst(s.x,GY+s.y,'#ffe0b0',8,150,3)}
 s.vy+=2600*dt;s.y+=s.vy*dt;if(s.y>=0){if(s.vy>300)s.sq=1.25;s.y=0;s.vy=0;s.jumps=0}s.sq+=(1-s.sq)*Math.min(1,dt*10);
 s.spawn-=dt;if(s.spawn<=0){s.spawn=g.rnd(.75,1.45)*(430/s.sp)+.2;const r=Math.random();
  if(r<.35)s.obs.push({x:W+40,w:56,h:56,y:0,k:0});else if(r<.55)s.obs.push({x:W+40,w:44,h:110,y:0,k:1});else if(r<.75)s.obs.push({x:W+40,w:130,h:50,y:0,k:2});else s.obs.push({x:W+40,w:62,h:38,y:g.pick([-30,-150]),k:3});
  if(Math.random()<.6){const bx=W+260;for(let i=0;i<5;i++)s.coins.push({x:bx+i*46,y:-80-Math.sin(i/4*Math.PI)*120})}}
 for(const o of s.obs)o.x-=s.sp*dt;for(const c of s.coins)c.x-=s.sp*dt;
 const py=GY+s.y,L=s.x-20,R=s.x+20,T=py-50,B=py-2;
 for(const o of s.obs){const ob=GY+o.y,ot=ob-o.h;if(R>o.x+4&&L<o.x+o.w-4&&B>ot+4&&T<ob){g.burst(s.x,py-28,'#ff6f59',30,360,5);g.shake(14);g.sfx('boom');g.over('つまずいた！');return}}
 for(const c of s.coins)if(!c.got&&Math.abs(c.x-s.x)<34&&Math.abs(GY+c.y-(py-28))<44){c.got=1;g.add(10,c.x,GY+c.y-20);g.sfx('coin')}
 s.obs=s.obs.filter(o=>o.x>-200);s.coins=s.coins.filter(c=>c.x>-50&&!c.got)},
draw(s,g,c){const{W,H}=g,GY=H-220,t=g.time;let gr=c.createLinearGradient(0,0,0,GY);gr.addColorStop(0,'#2d1b4e');gr.addColorStop(.55,'#ff6f59');gr.addColorStop(1,'#ffc857');c.fillStyle=gr;c.fillRect(0,0,W,GY);
 g.glow('#ffd36b',60);g.circle(W*.7,GY-230,90,'#ffe7a8');g.noglow();
 const ridge=(off,base,amp,col,f)=>{c.fillStyle=col;c.beginPath();c.moveTo(0,GY);for(let x=0;x<=W;x+=16){const u=(x+off)*f;c.lineTo(x,base-amp*(Math.sin(u)*.6+Math.sin(u*2.3+1)*.3+Math.sin(u*5.1)*.1))}c.lineTo(W,GY);c.closePath();c.fill()};
 ridge(s.dist*.08,GY-200,70,'#8a3a5a',.006);ridge(s.dist*.16,GY-120,50,'#5a2448',.01);
 let tw=0;for(const b of s.bld)tw+=b.w+12;let x=-((s.dist*.35)%tw);
 for(let rep=0;rep<3&&x<W;rep++)for(const b of s.bld){if(x>W)break;if(x+b.w>0){c.fillStyle='#3a1838';c.fillRect(x,GY-b.h,b.w,b.h);c.fillStyle='rgba(255,200,87,.55)';for(let wy=GY-b.h+14;wy<GY-14;wy+=26)for(let wx=x+10;wx<x+b.w-12;wx+=20)if(((wx*7+wy*13)|0)%5<2)c.fillRect(wx,wy,8,12)}x+=b.w+12}
 c.fillStyle='#241030';c.fillRect(0,GY,W,H-GY);c.fillStyle='#ff6f59';c.fillRect(0,GY,W,4);c.fillStyle='rgba(255,255,255,.07)';for(let i=0;i<10;i++){const xx=((i*120-s.dist)%1200+1200)%1200-100;c.fillRect(xx,GY+40,60,6)}
 for(const cn of s.coins){const sx=Math.abs(Math.cos(t*6+cn.x*.02));c.save();c.translate(cn.x,GY+cn.y);c.scale(Math.max(.15,sx),1);g.glow('#ffc857',16);g.circle(0,0,14,'#ffc857');g.noglow();g.circle(0,0,8,'#ffe9a8');c.restore()}
 for(const o of s.obs){const ob=GY+o.y;if(o.k===3){c.fillStyle='#1b0d24';const fl=Math.sin(t*14)*14;c.beginPath();c.moveTo(o.x,ob-o.h/2-fl);c.lineTo(o.x+o.w/2,ob-o.h/2);c.lineTo(o.x+o.w,ob-o.h/2-fl);c.lineTo(o.x+o.w/2,ob-o.h/2+10);c.closePath();c.fill();g.circle(o.x+o.w/2+10,ob-o.h/2-2,4,'#ffc857')}
  else{gr=c.createLinearGradient(0,ob-o.h,0,ob);gr.addColorStop(0,'#a98bff');gr.addColorStop(1,'#5b3fa8');g.rrf(o.x,ob-o.h,o.w,o.h,8,gr);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(o.x+6,ob-o.h+6,o.w-12,5)}}
 const py=GY+s.y,w=44/s.sq*1,h=52*s.sq;c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(s.x,GY+4,26,7,0,0,TAU);c.fill();
 const lp=Math.sin(s.dist*.05)*12;c.strokeStyle='#120e1d';c.lineWidth=7;c.lineCap='round';if(s.y===0){c.beginPath();c.moveTo(s.x-8,py-8);c.lineTo(s.x-8+lp,py);c.moveTo(s.x+8,py-8);c.lineTo(s.x+8-lp,py);c.stroke()}
 g.glow('#ff6f59',16);g.rrf(s.x-w/2,py-h-6,w,h,14,'#ff6f59');g.noglow();g.rrf(s.x-w/2+6,py-h,w-12,10,5,'rgba(255,255,255,.3)');g.circle(s.x+10,py-h+16,6,'#ffffff');g.circle(s.x+12,py-h+16,3,'#120e1d')}});

// 8. 反射神経
const HX=[160,360,560],HY=[420,620,820];
reg({id:'whack',name:'もぐらパニック',genre:'反射神経',color:'#9be15d',time:30,goal:320,
howto:'出てきたもぐらをタップ！\n金色は高得点・ばくだんは減点',
init(){const m=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++)m.push({x:HX[c],y:HY[r],up:0,st:'down',t:0,kind:0});return{m,spawn:.4,ham:null}},
update(s,g,dt){const{I}=g;s.spawn-=dt;
 if(s.spawn<=0){s.spawn=g.rnd(.3,.7)*(1-Math.min(.5,g.time/60));const free=s.m.filter(m=>m.st==='down');if(free.length){const m=g.pick(free),r=Math.random();m.st='rise';m.kind=r<.12?1:r<.27?2:0;m.t=g.rnd(.55,1.05)*(1-Math.min(.4,g.time/60))}}
 for(const m of s.m){if(m.st==='rise'){m.up+=dt*7;if(m.up>=1){m.up=1;m.st='up'}}else if(m.st==='up'){m.t-=dt;if(m.t<=0)m.st='fall'}else if(m.st==='fall'){m.up-=dt*5;if(m.up<=0){m.up=0;m.st='down'}}else if(m.st==='hit'){m.t-=dt;if(m.t<0)m.up-=dt*4;if(m.up<=0){m.up=0;m.st='down'}}}
 if(I.pressed){s.ham={x:I.x,y:I.y,t:.18};let hit=false;
  for(const m of s.m){if((m.st==='rise'||m.st==='up')&&m.up>.35&&Math.abs(I.x-m.x)<72&&I.y>m.y-150*m.up-20&&I.y<m.y+30){hit=true;m.st='hit';m.t=.3;
   if(m.kind===2){g.add(-30,m.x,m.y-140,'#ff6f59');g.shake(14);g.sfx('boom');g.burst(m.x,m.y-80,'#ffc857',30,380,5)}
   else{const p=m.kind===1?50:10;g.add(p,m.x,m.y-140,m.kind===1?'#ffe28a':'#ffffff');g.sfx(m.kind===1?'coin':'hit');g.burst(m.x,m.y-90,m.kind===1?'#ffe28a':'#ffffff',16,280,5);g.shake(4)}break}}
  if(!hit)g.burst(I.x,I.y,'#c9a36a',6,120,3)}
 if(s.ham){s.ham.t-=dt;if(s.ham.t<=0)s.ham=null}},
draw(s,g,c){const{W,H}=g;g.bg('#8fd16a','#3f8f3a');
 c.fillStyle='rgba(30,80,30,.25)';for(let i=0;i<70;i++){const x=(i*97)%W,y=110+(i*173)%(H-120);c.beginPath();c.moveTo(x,y);c.lineTo(x+4,y-14);c.lineTo(x+8,y);c.fill()}
 for(const m of s.m){c.fillStyle='#2b1a10';c.beginPath();c.ellipse(m.x,m.y,78,26,0,0,TAU);c.fill();
  c.save();c.beginPath();c.rect(m.x-90,m.y-220,180,220);c.clip();const by=m.y+40-150*m.up,col=m.kind===1?'#f2c14e':'#8a5a3c';
  const gr=c.createLinearGradient(m.x-55,0,m.x+55,0);gr.addColorStop(0,g.shade(col,-.2));gr.addColorStop(.5,g.shade(col,.15));gr.addColorStop(1,g.shade(col,-.25));c.fillStyle=gr;c.beginPath();c.ellipse(m.x,by+40,55,80,0,0,TAU);c.fill();
  c.fillStyle=g.shade(col,.45);c.beginPath();c.ellipse(m.x,by+30,30,24,0,0,TAU);c.fill();
  if(m.st==='hit'){c.strokeStyle='#2b1a10';c.lineWidth=4;for(const ex of[-18,18]){c.beginPath();c.moveTo(m.x+ex-7,by-7);c.lineTo(m.x+ex+7,by+7);c.moveTo(m.x+ex+7,by-7);c.lineTo(m.x+ex-7,by+7);c.stroke()}}
  else{g.circle(m.x-18,by,7,'#1a0f08');g.circle(m.x+18,by,7,'#1a0f08');g.circle(m.x-16,by-2,2.5,'#ffffff');g.circle(m.x+20,by-2,2.5,'#ffffff')}
  g.circle(m.x,by+18,9,'#ff7ab6');c.fillStyle='#ffffff';c.fillRect(m.x-6,by+30,5,8);c.fillRect(m.x+1,by+30,5,8);
  if(m.kind===2){g.circle(m.x+40,by+50,24,'#1a1a22');c.strokeStyle='#c9a46a';c.lineWidth=3;c.beginPath();c.moveTo(m.x+48,by+28);c.lineTo(m.x+56,by+16);c.stroke();g.glow('#ffc857',16);g.circle(m.x+57,by+14,5,'#ffe28a');g.noglow()}
  if(m.kind===1){g.glow('#fff1a8',10);g.star(m.x-40,by-30,10,4);c.fillStyle='#ffffff';c.fill();g.noglow()}
  if(m.st==='hit'){g.star(m.x,by-60,20,8,5,g.time*6);c.fillStyle='#ffe28a';c.fill()}
  c.restore();c.fillStyle='#6b4a2a';c.beginPath();c.ellipse(m.x,m.y+6,82,24,0,0,Math.PI);c.fill();c.fillStyle='#8a6440';c.beginPath();c.ellipse(m.x,m.y+2,82,14,0,0,Math.PI);c.fill()}
 if(s.ham){c.save();c.translate(s.ham.x+40,s.ham.y-30);c.rotate(-.9+(1-s.ham.t/.18)*.9);c.fillStyle='#a0683c';c.fillRect(-6,0,12,90);g.rrf(-40,-26,80,40,8,'#ff6f59');c.restore()}}});

// 9. 迷路
function newMaze(s,g,cols,rows){const cell=[];for(let i=0;i<cols*rows;i++)cell.push({n:1,e:1,s:1,w:1,v:0});const st=[0];cell[0].v=1;
 while(st.length){const i=st[st.length-1],x=i%cols,y=Math.floor(i/cols),nb=[];if(y>0&&!cell[i-cols].v)nb.push(['n',i-cols,'s']);if(x<cols-1&&!cell[i+1].v)nb.push(['e',i+1,'w']);if(y<rows-1&&!cell[i+cols].v)nb.push(['s',i+cols,'n']);if(x>0&&!cell[i-1].v)nb.push(['w',i-1,'e']);
  if(!nb.length){st.pop();continue}const[d,j,od]=g.pick(nb);cell[i][d]=0;cell[j][od]=0;cell[j].v=1;st.push(j)}
 s.cols=cols;s.rows=rows;s.cell=cell;s.cs=Math.min((g.W-60)/cols,(g.H-180)/rows);s.ox=(g.W-s.cs*cols)/2;s.oy=120+((g.H-150)-s.cs*rows)/2;s.cx=0;s.cy=0;s.px=0;s.py=0;
 s.gems=[];while(s.gems.length<4){const i=g.ri(1,cols*rows-2);if(!s.gems.includes(i))s.gems.push(i)}}
reg({id:'maze',name:'やみの迷宮',genre:'迷路',color:'#a98bff',time:50,goal:320,
howto:'行きたい方向を押しっぱなし（矢印キー可）\n光るゲートを目指そう',
init(g){const s={lv:0,cd:0};newMaze(s,g,7,9);return s},
update(s,g,dt){const{I}=g,k=I.keys;s.px+=(s.cx-s.px)*Math.min(1,dt*16);s.py+=(s.cy-s.py)*Math.min(1,dt*16);s.cd-=dt;
 let dx=0,dy=0;if(k.ArrowLeft||k.a)dx=-1;else if(k.ArrowRight||k.d)dx=1;else if(k.ArrowUp||k.w)dy=-1;else if(k.ArrowDown||k.s)dy=1;
 else if(I.down){const sx=s.ox+(s.px+.5)*s.cs,sy=s.oy+(s.py+.5)*s.cs,ax=I.x-sx,ay=I.y-sy;if(Math.max(Math.abs(ax),Math.abs(ay))>s.cs*.4){if(Math.abs(ax)>Math.abs(ay))dx=Math.sign(ax);else dy=Math.sign(ay)}}
 if((dx||dy)&&s.cd<=0){const c=s.cell[s.cy*s.cols+s.cx],wall=dx>0?c.e:dx<0?c.w:dy>0?c.s:c.n;if(!wall){s.cx+=dx;s.cy+=dy;s.cd=.1;g.tone(700+s.cy*20,.03,'sine',.06)}}
 const i=s.cy*s.cols+s.cx,gi=s.gems.indexOf(i);if(gi>=0){s.gems.splice(gi,1);g.add(10,s.ox+(s.cx+.5)*s.cs,s.oy+s.cy*s.cs);g.sfx('coin')}
 if(s.cx===s.cols-1&&s.cy===s.rows-1){g.add(100+s.lv*20,g.W/2,g.H/2);g.sfx('win');g.burst(s.ox+(s.cx+.5)*s.cs,s.oy+(s.cy+.5)*s.cs,'#2ec4b6',40,400,5,0);s.lv++;newMaze(s,g,Math.min(12,7+s.lv),Math.min(15,9+s.lv))}},
draw(s,g,c){const{W,H}=g,cs=s.cs,ox=s.ox,oy=s.oy,t=g.time;g.bg('#0b0a1a','#140f2a');
 c.strokeStyle='rgba(169,139,255,.08)';c.lineWidth=1;for(let x=0;x<=s.cols;x++){c.beginPath();c.moveTo(ox+x*cs,oy);c.lineTo(ox+x*cs,oy+s.rows*cs);c.stroke()}
 const ex=ox+(s.cols-.5)*cs,ey=oy+(s.rows-.5)*cs;c.globalCompositeOperation='lighter';g.glow('#2ec4b6',30);c.strokeStyle='#2ec4b6';c.lineWidth=5;c.beginPath();c.arc(ex,ey,cs*.32+Math.sin(t*4)*3,0,TAU);c.stroke();c.beginPath();c.arc(ex,ey,cs*.16,t*3,t*3+4);c.stroke();
 g.glow('#ffc857',16);c.fillStyle='#ffc857';for(const i of s.gems){g.poly(ox+(i%s.cols+.5)*cs,oy+(Math.floor(i/s.cols)+.5)*cs,cs*.18,4,t);c.fill()}
 g.glow('#a98bff',14);c.strokeStyle='#c7b5ff';c.lineWidth=4;c.lineCap='round';c.beginPath();
 for(let y=0;y<s.rows;y++)for(let x=0;x<s.cols;x++){const cl=s.cell[y*s.cols+x],X=ox+x*cs,Y=oy+y*cs;if(cl.n){c.moveTo(X,Y);c.lineTo(X+cs,Y)}if(cl.w){c.moveTo(X,Y);c.lineTo(X,Y+cs)}if(x===s.cols-1&&cl.e){c.moveTo(X+cs,Y);c.lineTo(X+cs,Y+cs)}if(y===s.rows-1&&cl.s){c.moveTo(X,Y+cs);c.lineTo(X+cs,Y+cs)}}
 c.stroke();const px=ox+(s.px+.5)*cs,py=oy+(s.py+.5)*cs;g.glow('#fff1c1',30);g.circle(px,py,cs*.26,'#fff1c1');g.noglow();c.globalCompositeOperation='source-over';
 const gr=c.createRadialGradient(px,py,40,px,py,250);gr.addColorStop(0,'rgba(5,4,14,0)');gr.addColorStop(1,'rgba(5,4,14,.93)');c.fillStyle=gr;c.fillRect(0,80,W,H-80);
 g.txt('迷宮 '+(s.lv+1),W/2,104,20,'rgba(255,243,223,.6)')}});

// 10. ゴルフ
function course(s,g){const{W,H}=g;s.b={x:W/2,y:H-150,vx:0,vy:0};s.hole={x:g.rnd(150,W-150),y:g.rnd(190,300)};s.walls=[];let tries=0;
 while(s.walls.length<g.ri(2,4)&&tries++<50){const w=g.rnd(140,300),h=g.rnd(26,40),x=g.rnd(60,W-60-w),y=g.rnd(380,700);if(s.walls.some(o=>!(x+w<o.x-20||x>o.x+o.w+20||y+h<o.y-60||y>o.y+o.h+60)))continue;s.walls.push({x,y,w,h})}
 if(Math.random()<.6)s.walls.push({x:s.hole.x-90,y:s.hole.y+70,w:180,h:26});s.strokes=0;s.sink=0;s.aim=false}
reg({id:'golf',name:'パターゴルフ',genre:'ゴルフ',color:'#7bc950',time:60,goal:320,
howto:'画面を引っぱって離すと打つ\n少ない打数でカップイン',
init(g){const s={holeN:1};course(s,g);return s},
update(s,g,dt){const{W,H,I}=g,b=s.b,R=13;
 if(s.sink>0){s.sink-=dt;b.x+=(s.hole.x-b.x)*dt*10;b.y+=(s.hole.y-b.y)*dt*10;if(s.sink<=0){s.holeN++;course(s,g)}return}
 const spd=Math.hypot(b.vx,b.vy);
 if(spd<8){b.vx=b.vy=0;if(I.pressed)s.aim=true;if(s.aim&&I.released){s.aim=false;const vx=(I.sx-I.x)*4.2,vy=(I.sy-I.y)*4.2,m=Math.hypot(vx,vy);if(m>40){const k=Math.min(1,1400/m);b.vx=vx*k;b.vy=vy*k;s.strokes++;g.sfx('pop')}}}
 else s.aim=false;
 b.x+=b.vx*dt;b.y+=b.vy*dt;const f=Math.max(0,1-dt*1.1);b.vx*=f;b.vy*=f;
 if(b.x<40+R){b.x=40+R;b.vx=Math.abs(b.vx)*.8}if(b.x>W-40-R){b.x=W-40-R;b.vx=-Math.abs(b.vx)*.8}if(b.y<100+R){b.y=100+R;b.vy=Math.abs(b.vy)*.8}if(b.y>H-40-R){b.y=H-40-R;b.vy=-Math.abs(b.vy)*.8}
 for(const w of s.walls){const cx=g.clamp(b.x,w.x,w.x+w.w),cy=g.clamp(b.y,w.y,w.y+w.h),dx=b.x-cx,dy=b.y-cy,d=Math.hypot(dx,dy);if(d<R&&d>0){const nx=dx/d,ny=dy/d;b.x=cx+nx*R;b.y=cy+ny*R;const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.8*vn*nx;b.vy-=1.8*vn*ny;g.tone(300,.05,'square',.08)}}}
 const dh=g.dist(b.x,b.y,s.hole.x,s.hole.y);if(dh<20&&spd<760){const p=Math.max(20,130-30*(s.strokes-1));g.add(p,s.hole.x,s.hole.y-40);g.float(s.strokes===1?'ホールインワン！':s.strokes+'打でカップイン',W/2,H/2,'#ffffff',40);g.sfx('win');g.burst(s.hole.x,s.hole.y,'#ffe28a',30,300,5);s.sink=.9;b.vx=b.vy=0}},
draw(s,g,c){const{W,H,I}=g,b=s.b,t=g.time;g.bg('#2f7d3c','#235f2e');
 for(let y=100;y<H;y+=60){c.fillStyle='rgba(255,255,255,'+((y/60)%2?.04:0)+')';c.fillRect(40,y,W-80,60)}
 c.strokeStyle='#6b4a2a';c.lineWidth=14;g.rr(33,93,W-66,H-126,14);c.stroke();c.strokeStyle='#8a6440';c.lineWidth=4;g.rr(40,100,W-80,H-140,10);c.stroke();
 for(const w of s.walls){g.rrf(w.x+6,w.y+8,w.w,w.h,8,'rgba(0,0,0,.3)');const gr=c.createLinearGradient(0,w.y,0,w.y+w.h);gr.addColorStop(0,'#c49162');gr.addColorStop(1,'#7a5230');g.rrf(w.x,w.y,w.w,w.h,8,gr);c.fillStyle='rgba(255,255,255,.2)';c.fillRect(w.x+6,w.y+4,w.w-12,4)}
 const h=s.hole;c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(h.x,h.y+3,26,15,0,0,TAU);c.fill();c.fillStyle='#0d1a10';c.beginPath();c.ellipse(h.x,h.y,22,13,0,0,TAU);c.fill();
 c.strokeStyle='#e8e8e8';c.lineWidth=4;c.beginPath();c.moveTo(h.x,h.y);c.lineTo(h.x,h.y-90);c.stroke();c.fillStyle='#ff6f59';c.beginPath();c.moveTo(h.x,h.y-90);for(let i=0;i<=10;i++)c.lineTo(h.x+i*5,h.y-90+Math.sin(t*5+i*.6)*4+i*1.2);c.lineTo(h.x,h.y-62);c.closePath();c.fill();
 if(s.aim&&I.down){const vx=I.sx-I.x,vy=I.sy-I.y,m=Math.min(1,Math.hypot(vx,vy)/330),a=Math.atan2(vy,vx);c.fillStyle='rgba(255,255,255,.85)';for(let i=1;i<=8;i++){const d=i*18*(.5+m*2);g.circle(b.x+Math.cos(a)*d,b.y+Math.sin(a)*d,5-i*.4,'rgba(255,255,255,.85)')}
  c.lineWidth=10;c.strokeStyle=g.mix('#7bc950','#ff6f59',m);c.beginPath();c.arc(b.x,b.y,34,-Math.PI/2,-Math.PI/2+TAU*m);c.stroke()}
 const sc=s.sink>0?Math.max(.2,s.sink/.9):1;c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(b.x+4,b.y+6,13*sc,8*sc,0,0,TAU);c.fill();
 const gr=c.createRadialGradient(b.x-4,b.y-4,2,b.x,b.y,13);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#c9d2d8');g.circle(b.x,b.y,13*sc,gr);
 g.txt('ホール '+s.holeN+'　打数 '+s.strokes,W/2,H-16,20,'rgba(255,255,255,.75)')}});

// 11. バスケ
function rackBall(s,g){s.b={x:g.rnd(120,300),y:g.H-150,vx:0,vy:0,rot:0};s.state='ready';s.ft=0;s.rim=false;s.scored=false}
reg({id:'hoop',name:'フリックダンク',genre:'バスケ',color:'#ff9f43',time:40,goal:300,
howto:'ボールを上にはじいて投げる\nゴールを通過すれば得点',
init(g){const s={rx:520,ry:360,streak:0,made:0,net:0,t:0};rackBall(s,g);return s},
update(s,g,dt){const{W,H,I}=g,b=s.b,R=28,G=H-120;s.t+=dt;s.net=Math.max(0,s.net-dt*3);
 if(s.made>=3){s.rx=520+Math.sin(s.t*.9)*70;s.ry=360+Math.sin(s.t*1.3)*40}
 const F={x:s.rx-48,y:s.ry},Bk={x:s.rx+48,y:s.ry},bx=s.rx+60;
 if(s.state==='ready'){b.y=G-R;if(I.swipe&&I.swipe.dy<-40){const k=.55/Math.max(.08,I.swipe.dt);let vx=I.swipe.dx*k,vy=I.swipe.dy*k;const m=Math.hypot(vx,vy);if(m>2100){vx*=2100/m;vy*=2100/m}b.vx=vx;b.vy=vy;s.state='fly';g.sfx('jump')}return}
 s.ft+=dt;const px=b.x,py=b.y;b.vy+=1600*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.rot+=b.vx*dt/R;
 for(const P of[F,Bk]){const d=g.dist(b.x,b.y,P.x,P.y);if(d<R+6&&d>0){const nx=(b.x-P.x)/d,ny=(b.y-P.y)/d;b.x=P.x+nx*(R+6);b.y=P.y+ny*(R+6);const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.6*vn*nx;b.vy-=1.6*vn*ny;s.rim=true;g.tone(190,.08,'square',.12)}}}
 if(b.x+R>bx&&px+R<=bx+12&&b.y>s.ry-170&&b.y<s.ry+20){b.x=bx-R;b.vx=-Math.abs(b.vx)*.6;s.rim=true;g.tone(140,.08,'square',.1)}
 if(!s.scored&&py<s.ry&&b.y>=s.ry&&b.x>F.x+6&&b.x<Bk.x-6&&b.vy>0){s.scored=true;s.made++;s.streak++;s.net=1;const p=(s.rim?20:30)+(s.streak>1?s.streak*5:0);g.add(p,s.rx,s.ry-60);g.float(s.rim?'ナイスシュート！':'スウィッシュ！',W/2,220,'#ffffff',40);g.sfx(s.rim?'good':'swish');g.burst(s.rx,s.ry+30,'#ffc857',24,300,5)}
 if(b.y>G-R){b.y=G-R;b.vy*=-.55;b.vx*=.8;if(Math.abs(b.vy)<60)b.vy=0}if(b.x<R){b.x=R;b.vx=Math.abs(b.vx)*.7}if(b.x>W-R){b.x=W-R;b.vx=-Math.abs(b.vx)*.7}
 if(s.ft>3.2||(s.scored&&s.ft>1.6)||(b.vy===0&&Math.abs(b.vx)<30&&s.ft>.6)){if(!s.scored)s.streak=0;rackBall(s,g)}},
draw(s,g,c){const{W,H,I}=g,b=s.b,G=H-120,R=28;g.bg('#2a1c3f','#13101f');
 c.globalCompositeOperation='lighter';for(const x of[160,560]){const gr=c.createLinearGradient(x,0,x,G);gr.addColorStop(0,'rgba(255,230,180,.16)');gr.addColorStop(1,'rgba(255,230,180,0)');c.fillStyle=gr;c.beginPath();c.moveTo(x-20,0);c.lineTo(x+20,0);c.lineTo(x+170,G);c.lineTo(x-170,G);c.fill()}c.globalCompositeOperation='source-over';
 let gr=c.createLinearGradient(0,G,0,H);gr.addColorStop(0,'#d99a5a');gr.addColorStop(1,'#8a5a2e');c.fillStyle=gr;c.fillRect(0,G,W,H-G);c.strokeStyle='rgba(0,0,0,.15)';c.lineWidth=2;for(let x=0;x<W;x+=60){c.beginPath();c.moveTo(x,G);c.lineTo(x-30,H);c.stroke()}
 const rx=s.rx,ry=s.ry,bx=rx+60;c.fillStyle='#555a66';c.fillRect(bx+14,ry-150,10,G-ry+150);
 c.fillStyle='rgba(220,235,255,.25)';c.fillRect(bx,ry-170,14,190);c.strokeStyle='#ffffff';c.lineWidth=3;c.strokeRect(bx,ry-170,14,190);
 c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=2;const sw=Math.sin(s.net*12)*s.net*10;for(let i=0;i<=6;i++){const x0=rx-48+i*16;c.beginPath();c.moveTo(x0,ry);c.lineTo(rx-26+i*8.7+sw,ry+70);c.stroke()}for(let k=1;k<=3;k++){c.beginPath();c.moveTo(rx-48+k*7,ry+k*22);c.lineTo(rx+48-k*7,ry+k*22);c.stroke()}
 c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(b.x,G+6,R*(1-Math.min(.6,(G-b.y)/800)),8,0,0,TAU);c.fill();
 gr=c.createRadialGradient(b.x-9,b.y-9,4,b.x,b.y,R);gr.addColorStop(0,'#ffb46b');gr.addColorStop(1,'#d2611c');g.circle(b.x,b.y,R,gr);
 c.save();c.translate(b.x,b.y);c.rotate(b.rot);c.strokeStyle='#5a2a0c';c.lineWidth=2.5;c.beginPath();c.moveTo(-R,0);c.lineTo(R,0);c.moveTo(0,-R);c.lineTo(0,R);c.stroke();c.beginPath();c.arc(-R*1.1,0,R*.8,-1,1);c.stroke();c.beginPath();c.arc(R*1.1,0,R*.8,Math.PI-1,Math.PI+1);c.stroke();c.restore();
 c.strokeStyle='#ff6f59';c.lineWidth=7;c.beginPath();c.moveTo(rx-48,ry);c.lineTo(bx,ry);c.stroke();g.circle(rx-48,ry,5,'#ff8a70');
 if(s.state==='ready'){if(I.down){c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=4;c.setLineDash([8,8]);c.beginPath();c.moveTo(I.sx,I.sy);c.lineTo(I.x,I.y);c.stroke();c.setLineDash([])}else{c.globalAlpha=.5+.5*Math.sin(g.time*5);g.txt('↑ はじく',b.x,b.y-60,24,'#ffffff');c.globalAlpha=1}}
 g.txt('連続 '+s.streak,W/2,110,22,'rgba(255,255,255,.6)')}});

// 12. 弾幕回避
reg({id:'dodge',name:'弾幕サバイバー',genre:'弾幕回避',color:'#ff7ab6',time:30,goal:380,
howto:'ドラッグで自機を動かして弾をよける\nかすめるとボーナス（指の位置からずらして操作可）',
init(g){return{x:g.W/2,y:g.H-200,b:[],t:0,fire:0,ang:0,bx:g.W/2,by:230}},
update(s,g,dt){const{W,H,I}=g,k=I.keys;s.t+=dt;g.score+=10*dt;
 if(I.down){s.x+=(I.x-I.px)*1.25;s.y+=(I.y-I.py)*1.25}const sp=380*dt;if(k.ArrowLeft)s.x-=sp;if(k.ArrowRight)s.x+=sp;if(k.ArrowUp)s.y-=sp;if(k.ArrowDown)s.y+=sp;s.x=g.clamp(s.x,14,W-14);s.y=g.clamp(s.y,90,H-14);
 s.bx=W/2+Math.sin(s.t*.7)*180;s.by=230+Math.sin(s.t*1.1)*30;const pat=Math.floor(s.t/6)%5,d=1+s.t/30;s.fire-=dt;
 const shoot=(a,v,r,col)=>s.b.push({x:s.bx,y:s.by,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r,col});
 if(s.fire<=0){if(pat===0){s.fire=.06/d;s.ang+=.33;for(let i=0;i<2;i++)shoot(s.ang+i*Math.PI,200*d,7,'#ff7ab6')}
  else if(pat===1){s.fire=.75/d;const o=g.rnd(TAU);for(let i=0;i<22;i++)shoot(o+i*TAU/22,170*d,8,'#5b8cff')}
  else if(pat===2){s.fire=.42/d;const a=Math.atan2(s.y-s.by,s.x-s.bx);for(let i=-2;i<=2;i++)shoot(a+i*.17,280*d,7,'#ffc857')}
  else if(pat===3){s.fire=.05/d;s.b.push({x:g.rnd(W),y:80,vx:0,vy:g.rnd(180,320)*d,r:6,col:'#2ec4b6'})}
  else{s.fire=.5/d;s.ang+=.4;for(let i=0;i<14;i++){shoot(s.ang+i*TAU/14,140*d,9,'#a98bff');shoot(-s.ang+i*TAU/14+.2,210*d,6,'#ff6f59')}}}
 for(const b of s.b){b.x+=b.vx*dt;b.y+=b.vy*dt;const dd=g.dist(b.x,b.y,s.x,s.y);if(dd<b.r+4){g.burst(s.x,s.y,'#ffffff',40,420,5,0);g.shake(16);g.sfx('boom');g.over('被弾！');return}
  if(dd<b.r+24&&!b.gz){b.gz=1;g.score+=3;g.burst(s.x,s.y,'#ffffff',3,120,2,0);g.tone(1800,.03,'sine',.05)}}
 s.b=s.b.filter(b=>b.x>-30&&b.x<W+30&&b.y>40&&b.y<H+30)},
draw(s,g,c){const{W,H}=g;g.bg('#060816','#1a0830');
 c.save();c.translate(W/2,H/2);c.rotate(s.t*.05);c.strokeStyle='rgba(169,139,255,.08)';c.lineWidth=1.5;for(let r=80;r<700;r+=80){g.poly(0,0,r,6,0);c.stroke()}c.restore();
 c.save();c.translate(s.bx,s.by);c.globalCompositeOperation='lighter';g.glow('#ff7ab6',30);for(let i=0;i<3;i++){c.strokeStyle=['#ff7ab6','#a98bff','#ffc857'][i];c.lineWidth=3;g.star(0,0,70-i*16,30-i*6,8+i*2,s.t*(i%2?-1:1)*(1+i*.5));c.stroke()}g.circle(0,0,18,'#ffffff');c.restore();
 c.globalCompositeOperation='lighter';for(const b of s.b){g.circle(b.x,b.y,b.r*2,g.rgba(b.col,.25));g.circle(b.x,b.y,b.r,b.col);g.circle(b.x,b.y,b.r*.45,'#ffffff')}c.globalCompositeOperation='source-over';
 g.glow('#9fe8ff',24);c.strokeStyle='#9fe8ff';c.lineWidth=3;c.beginPath();c.arc(s.x,s.y,16,0,TAU);c.stroke();c.fillStyle='#ffffff';c.beginPath();c.moveTo(s.x,s.y-14);c.lineTo(s.x+9,s.y+10);c.lineTo(s.x-9,s.y+10);c.closePath();c.fill();g.noglow();g.circle(s.x,s.y,4,'#ff6f59')}});

// 13. スライドパズル
function paint(g,hue){const cv=g.offscreen(540,540),c=cv.getContext('2d'),h2=(hue+40)%360;let gr=c.createLinearGradient(0,0,0,540);gr.addColorStop(0,'hsl('+hue+',70%,30%)');gr.addColorStop(.6,'hsl('+h2+',85%,62%)');gr.addColorStop(1,'hsl('+((hue+70)%360)+',90%,75%)');c.fillStyle=gr;c.fillRect(0,0,540,540);
 c.fillStyle='hsl('+((hue+60)%360)+',100%,88%)';c.beginPath();c.arc(380,250,70,0,TAU);c.fill();
 for(let L=0;L<3;L++){c.fillStyle='hsl('+((hue+200+L*15)%360)+',40%,'+(30-L*8)+'%)';c.beginPath();c.moveTo(0,540);for(let x=0;x<=540;x+=10)c.lineTo(x,300+L*60-Math.abs(Math.sin(x*.012*(L+1)+L*2))*(120-L*20));c.lineTo(540,540);c.fill()}
 c.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<20;i++){c.beginPath();c.arc((i*97)%540,(i*53)%160+20,1.5,0,TAU);c.fill()}return cv}
function newPuz(s,g){s.art=paint(g,g.ri(0,359));s.a=[0,1,2,3,4,5,6,7,8];let bl=8,prev=-1;for(let k=0;k<140;k++){const r=Math.floor(bl/3),cc=bl%3,opts=[];if(r>0)opts.push(bl-3);if(r<2)opts.push(bl+3);if(cc>0)opts.push(bl-1);if(cc<2)opts.push(bl+1);const o=g.pick(opts.filter(x=>x!==prev));prev=bl;s.a[bl]=s.a[o];s.a[o]=8;bl=o}
 if(s.a.every((v,i)=>v===i)){s.a[7]=8;s.a[8]=7}s.pos=s.a.map((v,i)=>({x:i%3,y:Math.floor(i/3)}));s.moves=0;s.done=0}
reg({id:'slide',name:'けしきパズル',genre:'スライドパズル',color:'#5b8cff',time:60,goal:250,
howto:'空きマスのとなりのピースをタップして動かし\n絵を完成させよう',
init(g){const s={n:0};newPuz(s,g);return s},
update(s,g,dt){const{I}=g,ts=180,ox=(g.W-540)/2,oy=260;
 for(let i=0;i<9;i++){const p=s.pos[i];p.x+=((i%3)-p.x)*Math.min(1,dt*18);p.y+=(Math.floor(i/3)-p.y)*Math.min(1,dt*18)}
 if(s.done>0){s.done-=dt;if(s.done<=0)newPuz(s,g);return}
 const bl=s.a.indexOf(8);let tgt=-1;
 if(I.pressed){const cx=Math.floor((I.x-ox)/ts),cy=Math.floor((I.y-oy)/ts);if(cx>=0&&cx<3&&cy>=0&&cy<3)tgt=cy*3+cx}
 const kp=I.kp;if(kp.ArrowLeft&&bl%3<2)tgt=bl+1;if(kp.ArrowRight&&bl%3>0)tgt=bl-1;if(kp.ArrowUp&&bl<6)tgt=bl+3;if(kp.ArrowDown&&bl>2)tgt=bl-3;
 if(tgt>=0){const d=Math.abs(tgt-bl);if((d===1&&Math.floor(tgt/3)===Math.floor(bl/3))||d===3){s.a[bl]=s.a[tgt];s.a[tgt]=8;const pp=s.pos[bl];s.pos[bl]=s.pos[tgt];s.pos[tgt]=pp;s.moves++;g.sfx('tick');
  if(s.a.every((v,i)=>v===i)){const p=100+Math.max(0,100-s.moves*2);g.add(p,g.W/2,oy-40);g.float('完成！',g.W/2,g.H/2,'#ffffff',60);g.sfx('win');g.burst(g.W/2,oy+270,'#ffe28a',50,500,6);s.done=1.4;s.n++}}}},
draw(s,g,c){const{W,H}=g,ts=180,ox=(W-540)/2,oy=260;g.bg('#1b1f3b','#0d0f20');
 g.txt('手数 '+s.moves,W/2-120,190,26,'rgba(255,243,223,.8)');g.txt('完成 '+s.n,W/2+120,190,26,'#ffc857');
 g.rrf(ox-22,oy-22,584,584,22,'#6b4a2a');g.rrf(ox-12,oy-12,564,564,14,'#2a1d12');
 for(let i=0;i<9;i++){const v=s.a[i];if(v===8&&s.done<=0)continue;const p=s.pos[i],x=ox+p.x*ts,y=oy+p.y*ts,sx=(v%3)*ts,sy=Math.floor(v/3)*ts;c.save();g.rr(x+3,y+3,ts-6,ts-6,12);c.clip();c.drawImage(s.art,sx,sy,ts,ts,x,y,ts,ts);c.restore();
  if(s.done<=0){c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;g.rr(x+3,y+3,ts-6,ts-6,12);c.stroke();g.circle(x+28,y+28,16,'rgba(0,0,0,.45)');g.txt(String(v+1),x+28,y+29,18,'#ffffff')}}
 c.drawImage(s.art,W-150,96,110,110);c.strokeStyle='rgba(255,255,255,.5)';c.strokeRect(W-150,96,110,110);g.txt('お手本',W-95,224,16,'rgba(255,255,255,.6)')}});
})();
