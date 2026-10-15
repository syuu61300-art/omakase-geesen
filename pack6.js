// Pack 6 — games 64-76
(()=>{const reg=MG.reg;const TAU=Math.PI*2;
const dirFromInput=(g,ox,oy)=>{const I=g.I,k=I.kp;if(k.ArrowLeft||k.a)return[-1,0];if(k.ArrowRight||k.d)return[1,0];if(k.ArrowUp||k.w)return[0,-1];if(k.ArrowDown||k.s)return[0,1];
 if(I.swipe){const{dx,dy}=I.swipe;return Math.abs(dx)>Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)]}
 if(I.released&&g.dist(I.x,I.y,I.sx,I.sy)<30){const ax=I.x-ox,ay=I.y-oy;if(Math.max(Math.abs(ax),Math.abs(ay))<20)return null;return Math.abs(ax)>Math.abs(ay)?[Math.sign(ax),0]:[0,Math.sign(ay)]}return null};

// 64. 道路横断
const FR_=72,FTOP=96,LANES=[{t:'goal'},{t:'river',v:90,len:3},{t:'river',v:-120,len:2},{t:'river',v:70,len:4},{t:'river',v:-100,len:3},{t:'safe'},{t:'road',v:-150},{t:'road',v:110},{t:'road',v:-200},{t:'road',v:140},{t:'road',v:-90},{t:'safe'}];
function frogReset(s){s.c=4.5;s.r=11;s.dc=s.c;s.dr=s.r;s.best=11}
function frogLanes(s,g){s.obj=[];LANES.forEach((L,r)=>{if(L.t==='road'){const n=g.ri(2,3);for(let i=0;i<n;i++)s.obj.push({r,x:i*(800/n)+g.rnd(0,80),w:g.pick([90,90,150]),v:L.v*(1+s.lvl*.12),col:g.pick(['#ff6f59','#5b8cff','#ffc857','#a98bff'])})}
 if(L.t==='river'){const n=3;for(let i=0;i<n;i++)s.obj.push({r,x:i*(860/n),w:L.len*FR_,v:L.v*(1+s.lvl*.1),log:true})}})}
reg({id:'frog',name:'カエルのみちわたり',genre:'道路横断',color:'#9be15d',time:45,goal:300,
howto:'スワイプ・タップした方向へぴょんと進む\n車をよけ、丸太に乗って川をわたろう',
init(g){const s={lvl:0,slots:[false,false,false,false,false],lives:3,dead:0};frogLanes(s,g);frogReset(s);return s},
update(s,g,dt){const{W}=g;for(const o of s.obj){o.x+=o.v*dt;if(o.v>0&&o.x>W+20)o.x-=W+o.w+120;if(o.v<0&&o.x+o.w<-20)o.x+=W+o.w+120}
 s.dc+=(s.c-s.dc)*Math.min(1,dt*20);s.dr+=(s.r-s.dr)*Math.min(1,dt*20);
 if(s.dead>0){s.dead-=dt;if(s.dead<=0){if(s.lives<=0){g.over('カエルがつかれた…');return}frogReset(s)}return}
 const d=dirFromInput(g,s.c*FR_+FR_/2,FTOP+s.r*FR_+FR_/2);if(d){s.c=g.clamp(s.c+d[0],0,9);s.r=g.clamp(s.r+d[1],0,11);g.tone(520,.05,'triangle',.12);if(s.r<s.best){s.best=s.r;g.add(5)}}
 const L=LANES[Math.round(s.r)],fx=s.c*FR_+FR_/2,die=m=>{s.lives--;s.dead=1;g.sfx('bad');g.shake(10);g.burst(fx,FTOP+s.r*FR_+36,'#9be15d',20,260,4);g.float(m,W/2,400,'#ffffff',40)};
 if(L.t==='road'){for(const o of s.obj)if(o.r===s.r&&fx>o.x-20&&fx<o.x+o.w+20){die('ひかれた！');return}}
 if(L.t==='river'){const lg=s.obj.find(o=>o.r===s.r&&fx>o.x+6&&fx<o.x+o.w-6);if(!lg){die('ドボン！');return}s.c+=lg.v*dt/FR_;s.dc=s.c;if(s.c<-.4||s.c>9.4){die('流された！');return}}
 if(L.t==='goal'){const slot=Math.round((fx-72)/144);if(slot>=0&&slot<5&&Math.abs(fx-(72+slot*144))<44&&!s.slots[slot]){s.slots[slot]=true;g.add(50,fx,FTOP+30);g.sfx('win');if(s.slots.every(v=>v)){g.add(100);g.float('ぜんぶゴール！',W/2,480,'#ffe28a',44);s.slots=[false,false,false,false,false];s.lvl++;frogLanes(s,g)}frogReset(s)}else die('ゴールできない！')}},
draw(s,g,c){const{W}=g;LANES.forEach((L,r)=>{const y=FTOP+r*FR_;c.fillStyle=L.t==='road'?'#3a3a48':L.t==='river'?'#2a7fd0':L.t==='goal'?'#2f7a3c':'#8a6aa8';c.fillRect(0,y,W,FR_);
  if(L.t==='road'&&LANES[r+1]&&LANES[r+1].t==='road'){c.fillStyle='rgba(255,255,255,.4)';for(let x=0;x<W;x+=80)c.fillRect(x,y+FR_-3,40,4)}
  if(L.t==='river'){c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=2;for(let x=0;x<W;x+=60){const o=(g.time*30*(r%2?1:-1))%60;c.beginPath();c.arc(x+o,y+36,10,.2,1.4);c.stroke()}}
  if(L.t==='safe'){c.fillStyle='rgba(255,255,255,.08)';for(let x=0;x<W;x+=24)c.fillRect(x,y+((x/24)%2)*36,24,36)}});
 for(let i=0;i<5;i++){const x=72+i*144;g.circle(x,FTOP+36,30,'#3a9a4a');c.fillStyle='#2f7a3c';c.beginPath();c.moveTo(x,FTOP+36);c.arc(x,FTOP+36,30,-.3,.3);c.fill();if(s.slots[i]){g.circle(x,FTOP+36,18,'#9be15d');g.circle(x-7,FTOP+28,5,'#ffffff');g.circle(x+7,FTOP+28,5,'#ffffff')}}
 for(const o of s.obj){const y=FTOP+o.r*FR_;if(o.log){const gr=c.createLinearGradient(0,y+10,0,y+62);gr.addColorStop(0,'#a8743a');gr.addColorStop(1,'#6b4520');g.rrf(o.x,y+10,o.w,52,26,gr);c.strokeStyle='rgba(60,30,10,.4)';c.lineWidth=2;for(let x=o.x+30;x<o.x+o.w-20;x+=40){c.beginPath();c.moveTo(x,y+20);c.lineTo(x+16,y+20);c.stroke()}}
  else{const dir=Math.sign(o.v);g.rrf(o.x,y+12,o.w,48,12,o.col);g.rrf(o.x+o.w*.25,y+18,o.w*.5,36,8,g.shade(o.col,-.3));c.fillStyle='rgba(160,220,255,.6)';c.fillRect(dir>0?o.x+o.w*.62:o.x+o.w*.25,y+20,o.w*.12,32);g.glow('#fff1a8',12);c.fillStyle='#fff1a8';c.fillRect(dir>0?o.x+o.w-6:o.x,y+16,6,10);c.fillRect(dir>0?o.x+o.w-6:o.x,y+46,6,10);g.noglow()}}
 if(s.dead<=0||Math.floor(s.dead*10)%2){const x=s.dc*FR_+FR_/2,y=FTOP+s.dr*FR_+FR_/2;g.circle(x,y+4,26,'#4caf50');g.circle(x,y,24,'#7bd36a');g.circle(x-11,y-14,9,'#ffffff');g.circle(x+11,y-14,9,'#ffffff');g.circle(x-11,y-14,4,'#1b1220');g.circle(x+11,y-14,4,'#1b1220');c.strokeStyle='#2a6a2a';c.lineWidth=2;c.beginPath();c.arc(x,y+2,8,.3,Math.PI-.3);c.stroke()}
 for(let i=0;i<3;i++)g.circle(W-30-i*28,FTOP+FR_*11+36,9,i<s.lives?'#9be15d':'rgba(0,0,0,.3)')}});

// 65. ドット食べ
const PMAP=["###############","#......#......#","#o##.#.#.#.##o#","#.............#","#.##.#####.##.#","#....#...#....#","####.#.#.#.####","#......G......#","#.##.#####.##.#","#....#...#....#","#.##.#.#.#.##.#","#o...........o#","#.##.##.##.##.#","#......P......#","###############"],PCS=46;
function pmReset(s){s.p={c:7,r:13,d:[0,0],want:[0,0],t:0};s.gh=[0,1,2].map(i=>({c:7,r:7,d:[i?1:-1,0],t:0,wait:i*2.5,col:['#ff5a5a','#ff9ad5','#5fd8ff'][i],home:true}))}
function pmLoad(s){s.dots=new Set();s.pow=new Set();PMAP.forEach((row,r)=>[...row].forEach((ch,c)=>{if(ch==='.'||ch==='G'||ch==='P')s.dots.add(r*15+c);if(ch==='o')s.pow.add(r*15+c)}));s.dots.delete(13*15+7);s.dots.delete(7*15+7)}
const pmWall=(c,r)=>r<0||r>=15||c<0||c>=15||PMAP[r][c]==='#';
reg({id:'pac',name:'パクパク迷路',genre:'ドット食べ',color:'#ffc857',time:50,goal:350,
howto:'スワイプか矢印で向きを変えてドットを食べる\nおばけに注意。大きい玉でおばけを食べられる',
init(){const s={fr:0,lives:3,ox:(720-15*PCS)/2,oy:150};pmLoad(s);pmReset(s);return s},
update(s,g,dt){const ox=s.ox,oy=s.oy,p=s.p;s.fr=Math.max(0,s.fr-dt);
 const d=dirFromInput(g,ox+(p.c+.5)*PCS,oy+(p.r+.5)*PCS);if(d)p.want=d;
 const step=(e,sp,choose)=>{if(e.d[0]===0&&e.d[1]===0){choose(e);if(e.d[0]===0&&e.d[1]===0)return}e.t+=sp*dt;while(e.t>=1){e.t-=1;e.c+=e.d[0];e.r+=e.d[1];choose(e);if(e.d[0]===0&&e.d[1]===0){e.t=0;break}}};
 step(p,6.2,e=>{if(!pmWall(e.c+e.want[0],e.r+e.want[1]))e.d=e.want.slice();if(pmWall(e.c+e.d[0],e.r+e.d[1]))e.d=[0,0];const k=e.r*15+e.c;if(s.dots.delete(k)){g.score+=3;if(Math.random()<.3)g.tone(700,.03,'square',.05)}if(s.pow.delete(k)){g.add(10);s.fr=6;g.sfx('good')}});
 for(const gh of s.gh){if(gh.wait>0){gh.wait-=dt;continue}const sp=s.fr>0?3.2:4.6+g.time*.02;
  step(gh,sp,e=>{const opts=[[1,0],[-1,0],[0,1],[0,-1]].filter(o=>!pmWall(e.c+o[0],e.r+o[1])&&!(o[0]===-e.d[0]&&o[1]===-e.d[1]));const use=opts.length?opts:[[-e.d[0],-e.d[1]]];
   if(s.fr>0||Math.random()<.25)e.d=g.pick(use);else{let b=use[0],bd=1e9;for(const o of use){const dd=Math.hypot(e.c+o[0]-p.c,e.r+o[1]-p.r);if(dd<bd){bd=dd;b=o}}e.d=b}});
  const gx=gh.c+gh.d[0]*gh.t,gy=gh.r+gh.d[1]*gh.t,px=p.c+p.d[0]*p.t,py=p.r+p.d[1]*p.t;
  if(Math.hypot(gx-px,gy-py)<.7){if(s.fr>0){g.add(50,ox+(gx+.5)*PCS,oy+gy*PCS);g.sfx('coin');gh.c=7;gh.r=7;gh.t=0;gh.wait=2}else{s.lives--;g.sfx('lose');g.shake(12);g.burst(ox+(px+.5)*PCS,oy+(py+.5)*PCS,'#ffc857',30,300,5);if(s.lives<=0){g.over('つかまった！');return}pmReset(s);return}}}
 if(!s.dots.size&&!s.pow.size){g.add(100,360,480);g.float('ぜんぶ食べた！',360,480,'#ffe28a',44);g.sfx('win');pmLoad(s);pmReset(s)}},
draw(s,g,c){const{W}=g,ox=s.ox,oy=s.oy,t=g.time;g.bg('#05061a','#0a0b26');
 c.strokeStyle='#3a5bff';c.lineWidth=4;g.glow('#3a5bff',10);for(let r=0;r<15;r++)for(let cc=0;cc<15;cc++)if(PMAP[r][cc]==='#'){const x=ox+cc*PCS,y=oy+r*PCS;c.fillStyle='#0d1440';c.fillRect(x+3,y+3,PCS-6,PCS-6);g.rr(x+5,y+5,PCS-10,PCS-10,8);c.stroke()}g.noglow();
 for(const k of s.dots)g.circle(ox+(k%15+.5)*PCS,oy+(Math.floor(k/15)+.5)*PCS,4,'#ffe0b0');for(const k of s.pow){g.glow('#ffffff',16);g.circle(ox+(k%15+.5)*PCS,oy+(Math.floor(k/15)+.5)*PCS,10+Math.sin(t*8)*2,'#ffffff');g.noglow()}
 for(const gh of s.gh){const x=ox+(gh.c+gh.d[0]*gh.t+.5)*PCS,y=oy+(gh.r+gh.d[1]*gh.t+.5)*PCS,col=s.fr>0?(s.fr<1.5&&Math.floor(t*8)%2?'#ffffff':'#3a3aff'):gh.col;
  c.fillStyle=col;c.beginPath();c.arc(x,y-2,19,Math.PI,0);c.lineTo(x+19,y+18);for(let i=0;i<4;i++)c.lineTo(x+19-i*12.6-6.3,y+(i%2?18:10)+Math.sin(t*12)*2);c.lineTo(x-19,y+18);c.closePath();c.fill();
  g.circle(x-7,y-4,6,'#ffffff');g.circle(x+7,y-4,6,'#ffffff');g.circle(x-7+gh.d[0]*2,y-4+gh.d[1]*2,3,'#1b1b4a');g.circle(x+7+gh.d[0]*2,y-4+gh.d[1]*2,3,'#1b1b4a')}
 const p=s.p,x=ox+(p.c+p.d[0]*p.t+.5)*PCS,y=oy+(p.r+p.d[1]*p.t+.5)*PCS,mo=Math.abs(Math.sin(t*14))*.7+.05,a=p.d[0]||p.d[1]?Math.atan2(p.d[1],p.d[0]):0;g.glow('#ffc857',16);c.fillStyle='#ffc857';c.beginPath();c.moveTo(x,y);c.arc(x,y,20,a+mo*.6,a-mo*.6+TAU);c.closePath();c.fill();g.noglow();
 for(let i=0;i<3;i++)g.circle(40+i*34,oy+15*PCS+30,10,i<s.lives?'#ffc857':'rgba(255,255,255,.15)')}});

// 66. カーリング
const HC=[360,230];
reg({id:'curling',name:'ストーンカーリング',genre:'カーリング',color:'#5b8cff',time:50,goal:300,
howto:'上へスワイプしてストーンを投げる\n走っている間ゴシゴシこすると遠くまで滑る',
init(){return{st:[],cur:null,n:0,sweep:0}},
update(s,g,dt){const{I}=g;s.sweep=Math.max(0,s.sweep-dt*2);
 if(!s.cur){if(I.released){const T=I.trail;let vx=0,vy=0;if(T.length>1){const a=T[0],z=T[T.length-1],d=Math.max(.03,z.t-a.t);vx=(z.x-a.x)/d*.12;vy=(z.y-a.y)/d*.55}if(vy<-200){vy=Math.max(vy,-900);s.cur={x:360,y:860,vx,vy,spin:Math.sign(vx)||1};s.n++;g.noise(.3,.12,0,300)}}if(I.kp[' ']){s.cur={x:360,y:860,vx:0,vy:-640,spin:1};s.n++}return}
 const st=s.cur;if(I.down&&g.dist(I.x,I.y,I.px,I.py)>8&&I.y<st.y+60&&I.y>st.y-260){s.sweep=1;if(Math.random()<.2)g.noise(.05,.05,0,4000)}
 const sp=Math.hypot(st.vx,st.vy),dec=(s.sweep>0?70:150)*dt;if(sp>0){const k=Math.max(0,sp-dec)/sp;st.vx*=k;st.vy*=k;st.vx+=st.spin*(s.sweep>0?8:22)*dt*(sp>40?1:0)}st.x+=st.vx*dt;st.y+=st.vy*dt;
 for(const o of s.st){const dx=o.x-st.x,dy=o.y-st.y,d=Math.hypot(dx,dy);if(d<44&&d>0){const nx=dx/d,ny=dy/d,vr=-(st.vx*nx+st.vy*ny);if(vr<0){o.vx=(o.vx||0)-vr*nx*.9;o.vy=(o.vy||0)-vr*ny*.9;st.vx+=vr*nx*.9;st.vy+=vr*ny*.9;g.tone(300,.05,'square',.12)}o.x=st.x+nx*44;o.y=st.y+ny*44}}
 for(const o of s.st){if(!o.vx&&!o.vy)continue;const k=Math.pow(.3,dt);o.vx*=k;o.vy*=k;o.x+=o.vx*dt;o.y+=o.vy*dt;if(Math.hypot(o.vx,o.vy)<5)o.vx=o.vy=0}
 if(sp<4||st.y<60||st.x<60||st.x>660){s.st.push({x:st.x,y:st.y,vx:0,vy:0,col:['#e63946','#ffc857'][s.n%2]});const d=g.dist(st.x,st.y,HC[0],HC[1]);const p=d<30?50:d<60?30:d<95?20:d<130?10:0;if(p){g.add(p,st.x,st.y-40);g.sfx(p>=30?'win':'good')}else g.float('ハウス外',st.x,st.y-40,'#ffffff',26);s.cur=null;
  s.st=s.st.filter(o=>o.y>40&&o.x>40&&o.x<680);if(s.st.length>=6){s.st=[];g.float('新しいエンド',360,480,'#ffffff',36)}}},
draw(s,g,c){const{W,H,I}=g;g.bg('#dfe9f5','#f6faff');c.fillStyle='rgba(120,160,210,.15)';for(let i=0;i<40;i++)c.fillRect((i*97)%W,(i*233)%H,60,2);
 c.strokeStyle='rgba(30,60,120,.2)';c.lineWidth=3;c.beginPath();c.moveTo(80,0);c.lineTo(80,H);c.moveTo(W-80,0);c.lineTo(W-80,H);c.stroke();
 for(const[r,col]of[[130,'#3a6bd8'],[95,'#ffffff'],[60,'#e63946'],[30,'#ffffff']])g.circle(HC[0],HC[1],r,col);g.circle(HC[0],HC[1],8,'#3a6bd8');c.strokeStyle='rgba(30,60,120,.3)';c.beginPath();c.moveTo(80,HC[1]);c.lineTo(W-80,HC[1]);c.stroke();c.fillStyle='#e63946';c.fillRect(80,760,W-160,4);
 const stone=(x,y,col)=>{c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(x+3,y+6,24,20,0,0,TAU);c.fill();const gr=c.createRadialGradient(x-6,y-6,3,x,y,24);gr.addColorStop(0,'#c8ccd8');gr.addColorStop(1,'#6a7088');g.circle(x,y,22,gr);g.circle(x,y,12,col);g.rrf(x-4,y-14,8,20,4,'#1b1b2a')};
 for(const o of s.st)stone(o.x,o.y,o.col);if(s.cur)stone(s.cur.x,s.cur.y,['#e63946','#ffc857'][s.n%2]);else{stone(360,860,['#e63946','#ffc857'][(s.n+1)%2]);c.globalAlpha=.5+.5*Math.sin(g.time*5);g.txt('↑ スワイプで投げる',360,800,24,'#1b2a4a');c.globalAlpha=1}
 if(s.sweep>0&&s.cur){c.save();c.translate(I.x,I.y);c.rotate(Math.sin(g.time*30)*.4);g.rrf(-40,-8,80,16,6,'#ff6f59');c.restore();g.txt('ゴシゴシ！',s.cur.x,s.cur.y-80,24,'#ff6f59')}
 g.txt('投球 '+s.st.length+' / 6',W/2,H-30,22,'#1b2a4a')}});

// 67. なぞり書き
function shapePts(k){const P=[],cx=360,cy=500;if(k===0)for(let i=0;i<=80;i++){const a=i/80*TAU-Math.PI/2;P.push([cx+Math.cos(a)*200,cy+Math.sin(a)*200])}
 else if(k===1)for(let i=0;i<=10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?90:220;P.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}
 else if(k===2)for(let i=0;i<=80;i++){const t=i/80*TAU;P.push([cx+12*Math.pow(Math.sin(t),3)*16,cy-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*14])}
 else if(k===3)P.push([cx-200,cy-200],[cx+200,cy-200],[cx+200,cy+200],[cx-200,cy+200],[cx-200,cy-200]);
 else if(k===4)for(let i=0;i<=90;i++){const a=i/90*TAU*2.5,r=30+i*2;P.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}
 else P.push([cx,cy-220],[cx+220,cy+180],[cx-220,cy+180],[cx,cy-220]);
 const out=[];for(let i=1;i<P.length;i++){const[a,b]=[P[i-1],P[i]],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/8));for(let k2=0;k2<n;k2++)out.push([a[0]+(b[0]-a[0])*k2/n,a[1]+(b[1]-a[1])*k2/n])}out.push(P[P.length-1]);return out}
const SHN=['まる','ほし','ハート','しかく','うずまき','さんかく'];
reg({id:'trace',name:'なぞってアート',genre:'なぞり書き',color:'#ff7ab6',time:45,goal:300,
howto:'光る点からスタートして\nうすい線をなるべく正確になぞろう',
init(g){return{k:g.ri(0,5),pts:shapePts(0),ink:[],st:'draw',rt:0,res:''}},
update(s,g,dt){const{I}=g;if(!s.init){s.pts=shapePts(s.k);s.init=1}if(s.st==='res'){s.rt-=dt;if(s.rt<=0){s.k=(s.k+g.ri(1,5))%6;s.pts=shapePts(s.k);s.ink=[];s.st='draw'}return}
 if(I.pressed)s.ink=[];if(I.down)s.ink.push([I.x,I.y]);
 if(I.released&&s.ink.length>10){let cov=0;for(const p of s.pts)if(s.ink.some(q=>Math.hypot(q[0]-p[0],q[1]-p[1])<28))cov++;cov/=s.pts.length;let err=0;for(const q of s.ink){let m=1e9;for(const p of s.pts){const d=Math.hypot(q[0]-p[0],q[1]-p[1]);if(d<m)m=d}err+=m}err/=s.ink.length;
  const acc=Math.max(0,1-err/40),sc=Math.round(cov*acc*100);g.add(sc,360,420);s.res=sc+'点';s.st='res';s.rt=1.5;g.sfx(sc>=70?'win':sc>=40?'good':'bad');if(sc>=80)g.burst(360,500,'#ffe28a',40,400,5)}},
draw(s,g,c){const{W}=g;g.bg('#fffaf3','#f3e8d8');c.strokeStyle='rgba(120,90,60,.08)';c.lineWidth=1;for(let y=100;y<960;y+=36){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
 g.txt('お題：'+SHN[s.k],W/2,150,36,'#5a3a4a','center',g.FD,400);
 c.strokeStyle='rgba(255,122,182,.28)';c.lineWidth=26;c.lineCap='round';c.lineJoin='round';c.beginPath();s.pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
 c.setLineDash([4,12]);c.strokeStyle='rgba(255,122,182,.8)';c.lineWidth=3;c.stroke();c.setLineDash([]);
 const st=s.pts[0];g.glow('#ff7ab6',20);g.circle(st[0],st[1],14+Math.sin(g.time*6)*3,'#ff7ab6');g.noglow();
 if(s.ink.length>1){c.strokeStyle='#3a2a5a';c.lineWidth=7;c.beginPath();s.ink.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()}
 if(s.st==='res')g.txt(s.res,W/2,860,60,'#ff6f59','center',g.FD,400)}});

// 68. バブルシューター
const BRD=28,BTOP=110,BL=8,BCOLS=['#ff6f59','#ffc857','#2ec4b6','#5b8cff','#a98bff'];
const bOdd=(s,r)=>(r+s.shift)%2===1,bPos=(s,r,c)=>[BL+BRD+c*BRD*2+(bOdd(s,r)?BRD:0),BTOP+BRD+r*48],bCols=(s,r)=>bOdd(s,r)?11:12;
function bNb(s,r,c){const o=bOdd(s,r),L=[[r,c-1],[r,c+1]];for(const rr of[r-1,r+1]){if(o)L.push([rr,c],[rr,c+1]);else L.push([rr,c-1],[rr,c])}return L.filter(([a,b])=>a>=0&&a<s.g.length&&b>=0&&b<bCols(s,a))}
function bRow(s,g){s.shift++;const row=[];s.g.unshift(row);for(let c=0;c<bCols(s,0);c++)row.push(g.ri(0,s.k-1))}
reg({id:'bubble',name:'バブルシューター',genre:'バブルシューター',color:'#2ec4b6',time:60,goal:400,
howto:'ねらう方向をドラッグして離すと発射\n同じ色を3つ以上くっつけると消える',
init(g){const s={g:[],shift:0,k:4,shot:null,cur:g.ri(0,3),nxt:g.ri(0,3),cnt:0,aim:-Math.PI/2};for(let i=0;i<6;i++)bRow(s,g);return s},
update(s,g,dt){const{W,I}=g,SX=360,SY=880;
 if(!s.shot){if(I.down){const a=Math.atan2(Math.min(I.y-SY,-30),I.x-SX);s.aim=g.clamp(a,-Math.PI+.15,-.15)}if(I.keys.ArrowLeft)s.aim=Math.max(-Math.PI+.15,s.aim-dt*1.5);if(I.keys.ArrowRight)s.aim=Math.min(-.15,s.aim+dt*1.5);
  if(I.released||I.kp[' ']){s.shot={x:SX,y:SY,vx:Math.cos(s.aim)*1100,vy:Math.sin(s.aim)*1100,c:s.cur};s.cur=s.nxt;s.nxt=g.ri(0,s.k-1);g.tone(500,.05,'sine',.12)}return}
 const b=s.shot;for(let k=0;k<4;k++){b.x+=b.vx*dt/4;b.y+=b.vy*dt/4;if(b.x<BL+BRD){b.x=BL+BRD;b.vx=Math.abs(b.vx)}if(b.x>W-BL-BRD){b.x=W-BL-BRD;b.vx=-Math.abs(b.vx)}
  let hit=b.y<BTOP+BRD;if(!hit)for(let r=0;r<s.g.length&&!hit;r++)for(let c=0;c<s.g[r].length;c++){if(s.g[r][c]<0||s.g[r][c]===undefined)continue;const[x,y]=bPos(s,r,c);if(Math.hypot(x-b.x,y-b.y)<BRD*1.75){hit=true;break}}
  if(hit){let br=Math.max(0,Math.round((b.y-BTOP-BRD)/48)),best=null,bd=1e9;for(let r=Math.max(0,br-1);r<=br+1;r++){while(s.g.length<=r){const row=[];for(let c=0;c<bCols(s,s.g.length);c++)row.push(-1);s.g.push(row)}for(let c=0;c<bCols(s,r);c++){if(s.g[r][c]>=0)continue;const[x,y]=bPos(s,r,c),d=Math.hypot(x-b.x,y-b.y);if(d<bd){bd=d;best=[r,c]}}}
   if(best){const[r,c]=best;s.g[r][c]=b.c;const grp=[[r,c]],seen=new Set([r+','+c]);for(let i=0;i<grp.length;i++)for(const[a,d]of bNb(s,grp[i][0],grp[i][1]))if(!seen.has(a+','+d)&&s.g[a][d]===b.c){seen.add(a+','+d);grp.push([a,d])}
    if(grp.length>=3){for(const[a,d]of grp){const[x,y]=bPos(s,a,d);g.burst(x,y,BCOLS[s.g[a][d]],6,200,4);s.g[a][d]=-1}g.add(grp.length*10,b.x,b.y);g.sfx('pop');
     const keep=new Set(),st=[];for(let c2=0;c2<s.g[0].length;c2++)if(s.g[0][c2]>=0){keep.add('0,'+c2);st.push([0,c2])}while(st.length){const[a,d]=st.pop();for(const[e,f]of bNb(s,a,d))if(s.g[e][f]>=0&&!keep.has(e+','+f)){keep.add(e+','+f);st.push([e,f])}}
     let fl=0;for(let a=0;a<s.g.length;a++)for(let d=0;d<s.g[a].length;d++)if(s.g[a][d]>=0&&!keep.has(a+','+d)){const[x,y]=bPos(s,a,d);g.burst(x,y,BCOLS[s.g[a][d]],8,260,4);s.g[a][d]=-1;fl++}if(fl){g.add(fl*20,b.x,b.y-40,'#9fe8ff');g.sfx('good')}}
    else g.tone(260,.04,'square',.08)}
   s.shot=null;s.cnt++;while(s.g.length&&s.g[s.g.length-1].every(v=>v<0))s.g.pop();if(s.cnt%6===0){bRow(s,g);if(g.time>25)s.k=5}
   if(!s.g.some(r=>r.some(v=>v>=0))){g.add(100,360,400);g.float('全消し！',360,400,'#ffe28a',50);for(let i=0;i<5;i++)bRow(s,g)}
   if(s.g.length>14&&s.g.slice(14).some(r=>r.some(v=>v>=0))){g.sfx('lose');g.over('バブルが下まで来た！')}return}}},
draw(s,g,c){const{W,H}=g,SX=360,SY=880;g.bg('#0f2a3a','#071620');c.fillStyle='rgba(255,255,255,.05)';c.fillRect(0,BTOP+14*48+BRD,W,3);
 const ball=(x,y,k)=>{const gr=c.createRadialGradient(x-9,y-9,3,x,y,BRD);gr.addColorStop(0,g.shade(BCOLS[k],.6));gr.addColorStop(1,g.shade(BCOLS[k],-.3));g.circle(x,y,BRD-1,gr);c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.ellipse(x-8,y-10,8,5,-.6,0,TAU);c.fill()};
 for(let r=0;r<s.g.length;r++)for(let cc=0;cc<s.g[r].length;cc++)if(s.g[r][cc]>=0){const[x,y]=bPos(s,r,cc);ball(x,y,s.g[r][cc])}
 if(!s.shot){c.setLineDash([6,12]);c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=3;let x=SX,y=SY,vx=Math.cos(s.aim),vy=Math.sin(s.aim);c.beginPath();c.moveTo(x,y);for(let i=0;i<60;i++){x+=vx*12;y+=vy*12;if(x<BL+BRD||x>W-BL-BRD)vx=-vx;if(y<BTOP)break;c.lineTo(x,y)}c.stroke();c.setLineDash([])}
 c.save();c.translate(SX,SY);c.rotate(s.aim+Math.PI/2);g.rrf(-14,-70,28,70,10,'#c8ccd8');c.restore();g.circle(SX,SY+10,46,'#3a4a5a');ball(SX,SY,s.cur);ball(SX+110,SY+30,s.nxt);g.txt('つぎ',SX+110,SY-16,18,'rgba(255,255,255,.6)');
 if(s.shot)ball(s.shot.x,s.shot.y,s.shot.c);g.txt('あと'+(6-s.cnt%6)+'発で段がふえる',W/2,H-24,18,'rgba(255,255,255,.55)')}});

// 69. ビンゴ
function bgCard(s,g){s.card=[];for(let c=0;c<5;c++){const nums=g.shuffle(Array.from({length:15},(_,i)=>c*15+i+1)).slice(0,5);for(let r=0;r<5;r++)(s.card[r]=s.card[r]||[])[c]=nums[r]}s.card[2][2]=0;s.mark=s.card.map(r=>r.map(v=>v===0));s.called=[];s.lines=0;s.pool=g.shuffle(Array.from({length:75},(_,i)=>i+1))}
function bgLines(s){let n=0;const m=s.mark;for(let i=0;i<5;i++){if(m[i].every(v=>v))n++;if(m.every(r=>r[i]))n++}if([0,1,2,3,4].every(i=>m[i][i]))n++;if([0,1,2,3,4].every(i=>m[i][4-i]))n++;return n}
reg({id:'bingo',name:'スピードビンゴ',genre:'ビンゴ',color:'#ff6f59',time:45,goal:300,
howto:'読み上げられた数字がカードにあれば\nすぐにタップしてマーク！ ビンゴで大量得点',
init(g){const s={ct:1};bgCard(s,g);return s},
update(s,g,dt){const{I,W}=g,cs=118,ox=(W-cs*5)/2,oy=370;s.ct-=dt;
 if(s.ct<=0){s.ct=Math.max(1,1.8-g.time*.015);let n;const onCard=s.card.flat().filter((v,i)=>v&&!s.mark[Math.floor(i/5)][i%5]&&!s.called.includes(v));if(onCard.length&&Math.random()<.5)n=g.pick(onCard);else n=s.pool.find(v=>!s.called.includes(v));if(!n){bgCard(s,g);return}s.called.unshift(n);g.tone(880,.06,'triangle',.12)}
 if(I.pressed){const c=Math.floor((I.x-ox)/cs),r=Math.floor((I.y-oy)/cs);if(c>=0&&c<5&&r>=0&&r<5&&!s.mark[r][c]){const v=s.card[r][c];if(s.called.slice(0,3).includes(v)){s.mark[r][c]=true;g.add(5,I.x,I.y-40);g.tone(660,.05,'square',.1);const L=bgLines(s);if(L>s.lines){g.add((L-s.lines)*50,W/2,300);g.float('ビンゴ！',W/2,300,'#ffe28a',60);g.sfx('win');s.lines=L;if(L>=3){bgCard(s,g);g.float('新しいカード',W/2,360,'#ffffff',30)}}}else{g.add(-3,I.x,I.y-40);g.sfx('bad')}}}},
draw(s,g,c){const{W}=g,cs=118,ox=(W-cs*5)/2,oy=370;g.bg('#3a0f1f','#1a0710');
 s.called.slice(0,4).forEach((n,i)=>{const x=W/2-i*130-(i?40:0),r=i?44:70,y=200,col=['#5b8cff','#ff6f59','#ffc857','#2ec4b6','#a98bff'][Math.floor((n-1)/15)];c.globalAlpha=i?.5:1;g.circle(x,y,r,col);g.circle(x,y,r*.7,'#ffffff');g.txt('BINGO'[Math.floor((n-1)/15)]+n,x,y+2,i?24:40,'#1b1220','center',g.FD,400);c.globalAlpha=1});
 g.rrf(ox-16,oy-80,cs*5+32,cs*5+96,24,'#fff3df');for(let i=0;i<5;i++)g.txt('BINGO'[i],ox+i*cs+cs/2,oy-38,44,['#5b8cff','#ff6f59','#ffc857','#2ec4b6','#a98bff'][i],'center',g.FD,400);
 for(let r=0;r<5;r++)for(let cc=0;cc<5;cc++){const x=ox+cc*cs,y=oy+r*cs,v=s.card[r][cc];g.rrf(x+4,y+4,cs-8,cs-8,14,'#f3e2c8');if(v)g.txt(String(v),x+cs/2,y+cs/2+2,44,'#3a2418','center',g.FD,400);else g.txt('FREE',x+cs/2,y+cs/2,22,'#ff6f59');if(s.mark[r][cc]){c.globalAlpha=.75;g.circle(x+cs/2,y+cs/2,cs*.38,'#ff6f59');c.globalAlpha=1}}}});

// 70. 駐車
function pkNew(s,g){s.slot=g.ri(0,5);s.car={x:360,y:830,a:-Math.PI/2,sp:0};s.cones=Array.from({length:g.ri(2,4)},()=>({x:g.rnd(120,600),y:g.rnd(470,680)}));s.st='drive';s.rt=0}
const slotX=i=>100+i*104;
reg({id:'parking',name:'ぴったり駐車',genre:'駐車',color:'#ffc857',time:50,goal:300,
howto:'押した場所に向かって車が進む\n光る枠にまっすぐ止めよう（離すとブレーキ）',
init(g){const s={n:0};pkNew(s,g);return s},
update(s,g,dt){const{I}=g,car=s.car;if(s.st!=='drive'){s.rt-=dt;if(s.rt<=0)pkNew(s,g);return}
 let tgt=null;if(I.down)tgt=[I.x,I.y];if(I.keys.ArrowUp)tgt=[car.x+Math.cos(car.a)*100,car.y+Math.sin(car.a)*100];if(tgt){const d=g.dist(car.x,car.y,tgt[0],tgt[1]);let da=Math.atan2(tgt[1]-car.y,tgt[0]-car.x)-car.a;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;car.a+=g.clamp(da,-2.2*dt*Math.min(1,car.sp/80),2.2*dt*Math.min(1,car.sp/80));car.sp=Math.min(d>30?200:0,car.sp+260*dt)}
 if(I.keys.ArrowLeft)car.a-=2*dt*Math.min(1,car.sp/80);if(I.keys.ArrowRight)car.a+=2*dt*Math.min(1,car.sp/80);
 if(!tgt)car.sp=Math.max(0,car.sp-420*dt);car.x+=Math.cos(car.a)*car.sp*dt;car.y+=Math.sin(car.a)*car.sp*dt;
 const pts=[-26,0,26].map(o=>[car.x+Math.cos(car.a)*o,car.y+Math.sin(car.a)*o]);let crash=false;
 for(const[x,y]of pts){if(x<30||x>690||y<110||y>930)crash=true;for(const cn of s.cones)if(g.dist(x,y,cn.x,cn.y)<30)crash=true;for(let i=0;i<6;i++)if(i!==s.slot&&Math.abs(x-slotX(i))<52&&y<330&&y>150)crash=true}
 if(crash){g.add(-20,car.x,car.y-50);g.sfx('boom');g.shake(12);g.burst(car.x,car.y,'#ffc857',20,260,4);s.st='crash';s.rt=1.2;return}
 if(car.sp<3&&Math.abs(car.x-slotX(s.slot))<26&&car.y>170&&car.y<310){let da=Math.abs(((car.a+Math.PI/2)%Math.PI+Math.PI)%Math.PI);da=Math.min(da,Math.PI-da);if(da<.2){const p=Math.round(60+40*(1-da/.2)-Math.abs(car.x-slotX(s.slot)));g.add(p,car.x,car.y-60);g.float(da<.06?'ど真ん中！':'駐車成功！',360,480,'#ffe28a',44);g.sfx('win');s.n++;s.st='ok';s.rt=1.2}}},
draw(s,g,c){const{W,H}=g,car=s.car;g.bg('#4a4a56','#3a3a44');c.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<120;i++)c.fillRect((i*137)%W,(i*71)%H,3,3);
 c.strokeStyle='#ffffff';c.lineWidth=5;for(let i=0;i<=6;i++){c.beginPath();c.moveTo(slotX(i)-52,150);c.lineTo(slotX(i)-52,330);c.stroke()}c.beginPath();c.moveTo(48,150);c.lineTo(672,150);c.stroke();
 const sx=slotX(s.slot);g.glow('#ffe28a',20);c.strokeStyle='#ffe28a';c.lineWidth=4;c.setLineDash([12,8]);c.strokeRect(sx-40,166,80,150);c.setLineDash([]);g.noglow();g.txt('P',sx,240,48,'rgba(255,226,138,.35)','center',g.FD,400);
 const carD=(x,y,a,col)=>{c.save();c.translate(x,y);c.rotate(a);c.fillStyle='rgba(0,0,0,.3)';g.rr(-38,-20,80,46,12);c.fill();g.rrf(-40,-23,80,46,12,col);g.rrf(-14,-19,34,38,8,g.shade(col,-.3));c.fillStyle='rgba(160,220,255,.55)';c.fillRect(14,-17,8,34);c.fillStyle='#fff1a8';c.fillRect(36,-20,4,10);c.fillRect(36,10,4,10);c.fillStyle='#ff3b3b';c.fillRect(-40,-20,4,10);c.fillRect(-40,10,4,10);c.restore()};
 for(let i=0;i<6;i++)if(i!==s.slot)carD(slotX(i),240,-Math.PI/2,['#5b8cff','#2ec4b6','#a98bff','#ff9f43','#9be15d','#ff7ab6'][i]);
 for(const cn of s.cones){c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(cn.x+3,cn.y+16,20,8,0,0,TAU);c.fill();c.fillStyle='#ff6f00';c.beginPath();c.moveTo(cn.x,cn.y-26);c.lineTo(cn.x+16,cn.y+14);c.lineTo(cn.x-16,cn.y+14);c.fill();c.fillStyle='#ffffff';c.fillRect(cn.x-9,cn.y-6,18,6)}
 carD(car.x,car.y,car.a,'#ff3b6b');if(s.st==='crash')g.txt('ぶつけた！',W/2,560,48,'#ffffff','center',g.FD,400);g.txt('成功 '+s.n+'台',W/2,H-24,22,'rgba(255,255,255,.7)')}});

// 71. ブレーキ
function trNew(s,g){s.x=0;s.v=g.rnd(320,460);s.stop=g.rnd(1700,2500);s.st='run';s.rt=0;s.res=''}
reg({id:'train',name:'ていしゃ名人',genre:'ブレーキ',color:'#5b8cff',time:45,goal:300,
howto:'押している間ブレーキ\n電車の先頭を停止位置にぴったり止めよう',
init(g){const s={n:0};trNew(s,g);return s},
update(s,g,dt){const{I}=g;if(s.st==='res'){s.rt-=dt;if(s.rt<=0)trNew(s,g);return}const br=I.down||I.keys[' ']||I.keys.ArrowDown;s.v=Math.max(0,s.v-(br?240:12)*dt);s.x+=s.v*dt;s.br=br;
 if(br&&Math.random()<dt*8)g.noise(.05,.04,0,5000);
 const err=s.x-s.stop;if(err>160||s.v<=0){let p=0;if(err>160)s.res='オーバーラン！';else if(err<-160)s.res='手前すぎ…';else{p=Math.max(0,Math.round(100-Math.abs(err)*.8));s.res=Math.abs(err)<4?'ぴったり！':(err>0?'+':'')+Math.round(err/4)+'cm'}
  if(p){g.add(p,360,380);g.sfx(p>=80?'win':'good')}else g.sfx('bad');s.st='res';s.rt=1.5;s.n++}},
draw(s,g,c){const{W,H}=g,cam=s.x-420,t=g.time;let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#8fd3ff');gr.addColorStop(.6,'#e0f4ff');gr.addColorStop(.61,'#7a9a6a');gr.addColorStop(1,'#5a7a4a');c.fillStyle=gr;c.fillRect(0,0,W,H);
 for(let i=0;i<8;i++){const x=((i*260-cam*.2)%2080+2080)%2080-200;c.fillStyle='#9ab0c8';c.fillRect(x,380,120,200)}
 const px=s.stop-cam;c.fillStyle='#c8c0b0';c.fillRect(px-700,640,900,40);c.fillStyle='#e8e0d0';c.fillRect(px-700,630,900,14);c.fillStyle='#ffe28a';c.fillRect(px-700,644,900,6);
 c.fillStyle='#5a4a3a';c.fillRect(0,720,W,14);c.fillRect(0,748,W,14);for(let x=-((cam)%60);x<W;x+=60){c.fillStyle='#6b4a2a';c.fillRect(x,712,16,56)}
 c.fillStyle='#3a3a48';c.fillRect(px-3,540,6,100);g.rrf(px-34,500,68,48,8,'#ffffff');g.txt('停',px,525,30,'#e63946','center',g.FD,400);
 for(let k=0;k<3;k++){const x0=420-(k+1)*300-k*10;g.rrf(x0,560,300,150,18,'#e8ecf5');c.fillStyle='#2e7fd8';c.fillRect(x0,640,300,20);for(let w=0;w<4;w++){c.fillStyle='rgba(60,90,130,.8)';c.fillRect(x0+20+w*70,585,52,40)}for(const wx of[40,260]){g.circle(x0+wx,712,16,'#2a2a34')}}
 g.rrf(120,560,300,150,18,'#e8ecf5');c.fillStyle='#2e7fd8';c.fillRect(120,640,300,20);c.fillStyle='rgba(60,90,130,.85)';c.beginPath();c.moveTo(330,580);c.lineTo(400,580);c.lineTo(418,630);c.lineTo(330,630);c.fill();for(let w=0;w<3;w++){c.fillStyle='rgba(60,90,130,.8)';c.fillRect(140+w*62,585,48,40)}g.glow('#fff1a8',14);g.circle(410,690,8,'#fff1a8');g.noglow();for(const wx of[160,380])g.circle(wx,712,16,'#2a2a34');
 if(s.br){g.glow('#ffb347',12);for(const wx of[160,380])g.circle(wx,722,4+Math.random()*4,'#ffd36b');g.noglow()}
 const dist=Math.max(0,s.stop-s.x);g.rrf(40,110,250,110,20,'rgba(0,0,0,.45)');g.txt(Math.round(s.v/4)+' km/h',165,148,34,'#ffffff','center',g.FD,400);g.txt('のこり '+Math.round(dist/4)+' m',165,192,22,'#ffe28a');
 if(s.br)g.txt('ブレーキ中',W-40,140,26,'#ff6f59','right');if(s.st==='res')g.txt(s.res,W/2,330,56,'#1b2a4a','center',g.FD,400)}});

// 72. クライミング
function clHolds(s,g,upto){while(s.top>upto){s.top-=g.rnd(90,140);s.holds.push({x:g.rnd(100,620),y:s.top,col:g.pick(['#ff6f59','#ffc857','#2ec4b6','#a98bff','#9be15d']),crumble:Math.random()<.18&&s.top<600,hp:1})}}
reg({id:'climb',name:'ボルダリング',genre:'クライミング',color:'#a98bff',time:45,goal:300,
howto:'手の届く上のホールドをタップして登る\nスタミナが切れる前にどんどん進もう',
init(g){const s={holds:[{x:360,y:800,col:'#ffc857',crumble:false,hp:1}],top:800,cur:null,px:360,py:800,cam:0,sta:100,best:0,bonus:0};s.cur=s.holds[0];clHolds(s,g,-600);return s},
update(s,g,dt){const{I}=g;s.sta-=dt*(10+g.time*.15);s.px+=(s.cur.x-s.px)*Math.min(1,dt*10);s.py+=(s.cur.y-s.py)*Math.min(1,dt*10);
 if(s.cur.crumble){s.cur.hp-=dt*.9;if(s.cur.hp<=0){g.sfx('bad');s.sta-=30;g.float('くずれた！',360,400,'#ff6f59',36);const below=s.holds.filter(h=>h.y>s.cur.y&&!h.crumble).sort((a,b)=>a.y-b.y)[0];s.cur.dead=1;if(below)s.cur=below}}
 if(I.pressed){const wx=I.x,wy=I.y+s.cam;let best=null,bd=60;for(const h of s.holds){if(h.dead)continue;const d=g.dist(h.x,h.y,wx,wy);if(d<bd){bd=d;best=h}}
  if(best&&best!==s.cur){const reach=g.dist(best.x,best.y,s.cur.x,s.cur.y);if(reach<200){s.cur=best;s.sta=Math.min(100,s.sta+9);g.tone(400+Math.max(0,800-best.y)/8,.05,'triangle',.12);if(best.y<s.cur.y+1)s.bonus+=0}else{g.float('とどかない！',I.x,I.y-40,'#ffffff',26);g.tone(200,.06,'sine',.1)}}}
 s.cam+=(s.py-650-s.cam)*Math.min(1,dt*4);clHolds(s,g,s.cam-200);s.holds=s.holds.filter(h=>h.y<s.cam+1100);s.best=Math.max(s.best,800-s.cur.y);g.score=Math.floor(s.best/10);
 if(s.sta<=0){g.sfx('lose');g.over('スタミナ切れ！')}},
draw(s,g,c){const{W,H}=g,cam=s.cam;g.bg('#d8c8b0','#bfae94');c.fillStyle='rgba(120,90,60,.15)';for(let i=0;i<40;i++){const y=((i*90-cam*.9)%1000+1000)%1000;c.fillRect(0,y,W,3)}
 for(const h of s.holds){if(h.dead)continue;const y=h.y-cam;if(y<-40||y>H+40)continue;const reach=g.dist(h.x,h.y,s.cur.x,s.cur.y)<200&&h!==s.cur;if(reach){c.globalAlpha=.35+.25*Math.sin(g.time*6);g.circle(h.x,y,34,'#ffffff');c.globalAlpha=1}
  c.fillStyle='rgba(0,0,0,.25)';g.poly(h.x+3,y+5,24,7,h.x);c.fill();g.poly(h.x,y,24,7,h.x);c.fillStyle=h.crumble?g.mix(h.col,'#6b4a2a',.5):h.col;c.fill();if(h.crumble){c.strokeStyle='#3a2a1a';c.lineWidth=2;c.beginPath();c.moveTo(h.x-12,y-6);c.lineTo(h.x,y+4);c.lineTo(h.x+10,y-8);c.stroke()}g.circle(h.x-6,y-6,5,'rgba(255,255,255,.45)')}
 const x=s.px,y=s.py-cam;c.strokeStyle='#3a5bd8';c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(x,y+10);c.lineTo(x-14,y+60);c.moveTo(x,y+10);c.lineTo(x+14,y+60);c.stroke();g.rrf(x-20,y+50,40,60,14,'#ff6f59');c.strokeStyle='#f3d0a8';c.lineWidth=10;c.beginPath();c.moveTo(x-16,y+110);c.lineTo(x-24,y+170);c.moveTo(x+16,y+110);c.lineTo(x+24,y+170);c.stroke();g.circle(x,y+36,18,'#f3d0a8');g.rrf(x-18,y+20,36,10,5,'#2a2a34');
 g.rrf(30,100,26,300,13,'rgba(0,0,0,.25)');g.rrf(30,100+300*(1-Math.max(0,s.sta)/100),26,300*Math.max(0,s.sta)/100,13,s.sta<30?'#ff6f59':'#9be15d');g.txt('力',43,420,18,'#3a2a1a');
 g.txt(Math.floor(s.best/10)+'m',W-30,110,30,'#3a2a1a','right',g.FD,400)}});

// 73. スカイダイビング
function sdJump(s,g){s.alt=3000;s.x=360;s.vx=0;s.chute=false;s.rings=[];s.birds=[];s.st='fall';s.rt=0;s.tx=g.rnd(160,560);s.wy=0}
reg({id:'skydive',name:'スカイダイブ',genre:'スカイダイビング',color:'#5b8cff',time:40,goal:300,
howto:'左右に動かして輪をくぐる\nパラシュートは300〜800mで開いて的に着地',
init(g){const s={};sdJump(s,g);return s},
update(s,g,dt){const{W,I}=g;if(s.st==='res'){s.rt-=dt;if(s.rt<=0)sdJump(s,g);return}
 if(I.down&&I.y<860)s.vx+=(I.x-s.x)*dt*6;if(I.keys.ArrowLeft)s.vx-=500*dt;if(I.keys.ArrowRight)s.vx+=500*dt;s.vx*=1-dt*2.5;s.x=g.clamp(s.x+s.vx*dt,40,W-40);
 const fall=s.chute?55:160;s.alt-=fall*dt;s.wy+=fall*dt*2.2;
 if(!s.chute){if(Math.random()<dt*1.1&&s.alt>900)s.rings.push({x:g.rnd(100,620),y:1100});if(Math.random()<dt*.5&&s.alt>900)s.birds.push({x:Math.random()<.5?-40:W+40,y:1100,v:g.rnd(80,160)})}
 for(const r of s.rings){r.y-=fall*dt*2.2;if(!r.got&&Math.abs(r.y-400)<20&&Math.abs(r.x-s.x)<60){r.got=1;g.add(20,r.x,r.y-40);g.sfx('coin');g.burst(r.x,r.y,'#ffe28a',14,220,4)}}
 for(const b of s.birds){b.y-=fall*dt*2.2;b.x+=(b.x<W/2?1:-1)*b.v*dt*0+(b.v*dt*(b.dir||(b.dir=b.x<0?1:-1)));if(!b.hit&&g.dist(b.x,b.y,s.x,400)<44){b.hit=1;g.add(-10,s.x,360);g.sfx('bad');g.shake(8)}}
 s.rings=s.rings.filter(r=>r.y>-60);s.birds=s.birds.filter(b=>b.y>-60);
 if(!s.chute&&(I.kp[' ']||(I.pressed&&I.y>870))){s.chute=true;g.tone(300,.2,'sine',.15,150);const a=s.alt;if(a>800){g.float('早すぎ',W/2,250,'#ffffff',30)}else{const p=Math.round(30+(800-a)/500*70);g.add(p,W/2,250);g.float('ナイス判断！',W/2,300,'#9fe8ff',34)}}
 if(s.alt<=0){s.alt=0;if(!s.chute){g.sfx('boom');g.shake(18);s.res='パラシュートが開かなかった！';g.add(-30,W/2,600)}else{const d=Math.abs(s.x-s.tx),p=d<40?60:d<100?30:d<180?10:0;if(p)g.add(p,s.x,640);s.res=p>=60?'的のど真ん中！':p?'着地成功':'的をはずした';g.sfx(p>=30?'win':'good')}s.st='res';s.rt=1.6}},
draw(s,g,c){const{W,H}=g,a=s.alt,gk=Math.max(0,1-a/900);let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,g.mix('#2a6adf','#8fd3ff',1-a/3000));gr.addColorStop(1,g.mix('#8fd3ff','#dff3ff',1-a/3000));c.fillStyle=gr;c.fillRect(0,0,W,H);
 c.globalAlpha=.85;for(let i=0;i<7;i++){const y=((i*190-s.wy*.6)%1300+1300)%1300-150,x=(i*233)%W;g.circle(x,y,60,'#ffffff');g.circle(x+60,y+10,45,'#ffffff');g.circle(x-55,y+14,40,'#ffffff')}c.globalAlpha=1;
 if(gk>0){const gy=H-gk*360;c.fillStyle='#5fa84a';c.fillRect(0,gy,W,H-gy);c.fillStyle='#4a8a3a';for(let i=0;i<10;i++)c.fillRect(i*80,gy,40,H-gy);const tx=s.tx,ty=gy+gk*140;for(const[r,col]of[[90*gk+10,'#ffffff'],[60*gk+6,'#e63946'],[30*gk+4,'#ffffff']]){c.fillStyle=col;c.beginPath();c.ellipse(tx,ty,r,r*.35,0,0,TAU);c.fill()}}
 for(const r of s.rings){c.strokeStyle=r.got?'rgba(255,255,255,.3)':'#ffc857';c.lineWidth=10;g.glow('#ffc857',r.got?0:14);c.beginPath();c.ellipse(r.x,r.y,60,22,0,0,TAU);c.stroke();g.noglow()}
 for(const b of s.birds){c.strokeStyle='#2a2a34';c.lineWidth=5;const f=Math.sin(g.time*14)*10;c.beginPath();c.moveTo(b.x-24,b.y-f);c.lineTo(b.x,b.y);c.lineTo(b.x+24,b.y-f);c.stroke()}
 const x=s.x,y=s.chute?360:400;if(s.chute){c.fillStyle='#ff6f59';c.beginPath();c.arc(x,y-120,80,Math.PI,0);c.fill();for(let i=0;i<4;i++){c.fillStyle=i%2?'#ffc857':'#ff6f59';c.beginPath();c.moveTo(x,y-120);c.arc(x,y-120,80,Math.PI+i*Math.PI/4,Math.PI+(i+1)*Math.PI/4);c.fill()}c.strokeStyle='rgba(60,40,40,.6)';c.lineWidth=2;c.beginPath();c.moveTo(x-78,y-120);c.lineTo(x,y-10);c.lineTo(x+78,y-120);c.stroke()}
 c.save();c.translate(x,y);c.rotate(s.chute?0:Math.PI/2+s.vx*.001);g.rrf(-14,-30,28,50,12,'#5b8cff');g.circle(0,-40,14,'#f3d0a8');c.strokeStyle='#5b8cff';c.lineWidth=9;c.lineCap='round';c.beginPath();c.moveTo(-12,-22);c.lineTo(-40,-50);c.moveTo(12,-22);c.lineTo(40,-50);c.moveTo(-8,18);c.lineTo(-24,50);c.moveTo(8,18);c.lineTo(24,50);c.stroke();c.restore();
 g.rrf(W-210,96,180,60,20,'rgba(0,0,0,.4)');g.txt(Math.round(a)+' m',W-120,127,30,a<800&&a>300?'#9be15d':a<=300?'#ff6f59':'#ffffff','center',g.FD,400);
 if(!s.chute&&s.st==='fall'){g.rrf(140,876,W-280,64,32,a<800&&a>300?'#9be15d':'#ff6f59');g.txt('パラシュート',W/2,909,28,'#1b1220','center',g.FD,400)}
 if(s.st==='res')g.txt(s.res,W/2,520,40,'#1b2a4a','center',g.FD,400)}});

// 74. カヌー
reg({id:'canoe',name:'激流カヌー',genre:'カヌー',color:'#2ec4b6',time:45,goal:320,
howto:'左半分タップで左こぎ（右へ曲がる）\n右半分タップで右こぎ。岩をよけて門をくぐれ',
init(g){return{x:360,vx:0,sp:200,dist:0,rocks:[],gates:[],pd:0,side:0,slow:0}},
update(s,g,dt){const{W,H,I}=g,cx=y=>360+Math.sin((s.dist+(700-y))*.004)*160,hw=200;
 const pad=sd=>{s.vx+=sd*90;s.sp=Math.min(420,s.sp+40);s.pd=1;s.side=sd;g.noise(.12,.12,0,1200)};
 if(I.pressed)pad(I.x<W/2?1:-1);if(I.kp.ArrowLeft)pad(-1);if(I.kp.ArrowRight)pad(1);
 s.pd=Math.max(0,s.pd-dt*4);s.slow=Math.max(0,s.slow-dt);s.vx*=1-dt*2;s.sp=Math.max(160,s.sp-60*dt);s.x+=s.vx*dt;s.dist+=s.sp*dt;g.score+=s.sp*dt/100;
 const c0=cx(700);if(Math.abs(s.x-c0)>hw-30){s.x=c0+Math.sign(s.x-c0)*(hw-30);s.vx*=-.4;s.sp=160;if(Math.random()<dt*10)g.tone(120,.05,'sawtooth',.08)}
 if(Math.random()<dt*1.4){const y=-60;s.rocks.push({y,x:cx(y)+g.rnd(-hw+50,hw-50),r:g.rnd(24,38)})}if(Math.random()<dt*.5){const y=-60;s.gates.push({y,x:cx(y)+g.rnd(-hw+80,hw-80)})}
 for(const r of s.rocks){r.y+=s.sp*dt;if(!r.hit&&g.dist(r.x,r.y,s.x,700)<r.r+22){r.hit=1;g.add(-20,s.x,640);g.sfx('bad');g.shake(10);s.sp=120;s.vx=-s.vx}}
 for(const gt of s.gates){gt.y+=s.sp*dt;if(!gt.done&&gt.y>690){gt.done=1;if(Math.abs(s.x-gt.x)<60){g.add(15,gt.x,640,'#ffe28a');g.sfx('coin')}}}
 s.rocks=s.rocks.filter(r=>r.y<H+60);s.gates=s.gates.filter(r=>r.y<H+60)},
draw(s,g,c){const{W,H}=g,cx=y=>360+Math.sin((s.dist+(700-y))*.004)*160,hw=200,t=g.time;g.bg('#3a6a3a','#2a5a2a');
 c.fillStyle='#1a4a8a';c.beginPath();for(let y=0;y<=H;y+=20)c.lineTo(cx(y)-hw,y);for(let y=H;y>=0;y-=20)c.lineTo(cx(y)+hw,y);c.fill();
 c.fillStyle='#c9a46a';for(let y=0;y<=H;y+=20){c.fillRect(cx(y)-hw-14,y,14,20);c.fillRect(cx(y)+hw,y,14,20)}
 c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=3;for(let i=0;i<30;i++){const y=((i*70+s.dist*.9)%(H+80))-40,x=cx(y)+((i*53)%(hw*2-60))-hw+30;c.beginPath();c.moveTo(x-14,y);c.quadraticCurveTo(x,y-8,x+14,y);c.stroke()}
 for(let i=0;i<14;i++){const y=((i*90+s.dist*.9)%(H+100))-50;for(const sd of[-1,1]){const x=cx(y)+sd*(hw+70);g.circle(x,y,40,'#2a6a2a');g.circle(x+10,y-10,26,'#3a8a3a')}}
 for(const gt of s.gates){for(const sd of[-1,1]){c.fillStyle=sd<0?'#e63946':'#2e7fd8';c.fillRect(gt.x+sd*60-3,gt.y-50,6,60);c.beginPath();c.moveTo(gt.x+sd*60,gt.y-50);c.lineTo(gt.x+sd*60+(-sd)*24,gt.y-40);c.lineTo(gt.x+sd*60,gt.y-30);c.fill()}}
 for(const r of s.rocks){c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.ellipse(r.x,r.y+r.r*.5,r.r*1.3,r.r*.5,0,0,TAU);c.fill();const gr=c.createRadialGradient(r.x-8,r.y-8,3,r.x,r.y,r.r);gr.addColorStop(0,'#9a9aa8');gr.addColorStop(1,'#4a4a58');g.circle(r.x,r.y,r.r,gr)}
 const x=s.x,y=700;c.save();c.translate(x,y);c.rotate(s.vx*.002);c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.ellipse(0,40,26,50,0,0,TAU);c.fill();c.fillStyle='#ff6f59';c.beginPath();c.ellipse(0,0,22,60,0,0,TAU);c.fill();c.fillStyle='#b8402a';c.beginPath();c.ellipse(0,4,13,36,0,0,TAU);c.fill();g.circle(0,0,12,'#ffc857');
 c.strokeStyle='#6b4a2a';c.lineWidth=6;const pa=s.pd*.8*(s.side||1);c.beginPath();c.moveTo(-50*Math.cos(pa),-10+50*Math.sin(pa));c.lineTo(50*Math.cos(pa),-10-50*Math.sin(pa));c.stroke();c.restore();
 g.txt(Math.floor(s.dist/10)+'m',W-30,110,28,'#ffffff','right',g.FD,400);g.txt('左こぎ',W/4,H-26,20,'rgba(255,255,255,.5)');g.txt('右こぎ',W*3/4,H-26,20,'rgba(255,255,255,.5)')}});

// 75. だるまさんがころんだ
const DPH='だるまさんがころんだ';
function drRound(s,g){s.y=880;s.st='chant';s.ct=0;s.dur=g.rnd(1.4,3.2)*Math.max(.55,1-s.round*.08);s.look=0;s.ln=0}
reg({id:'daruma',name:'だるまさんがころんだ',genre:'だるまさん',color:'#ff6f59',time:45,goal:300,
howto:'押している間だけ前に進む\n鬼がふり向いている間に動くとアウト',
init(g){const s={round:0,caught:0,touch:0};drRound(s,g);return s},
update(s,g,dt){const{I}=g;const mv=(I.down||I.keys[' ']||I.keys.ArrowUp);
 if(s.st==='chant'){s.ct+=dt;if(mv){s.y-=150*dt}const k=Math.min(DPH.length,Math.floor(s.ct/s.dur*DPH.length));if(k>s.ln){s.ln=k;g.tone(500+k*30,.06,'triangle',.08)}if(s.ct>=s.dur){s.st='look';s.look=g.rnd(1.1,2.2);s.grace=.18;g.tone(900,.12,'square',.12)}}
 else if(s.st==='look'){s.grace-=dt;s.look-=dt;if(mv&&s.grace<=0){s.st='out';s.rt=1.3;g.sfx('bad');g.add(-20,360,s.y-80);g.shake(10)}if(s.look<=0){s.st='chant';s.ct=0;s.ln=0;s.dur=g.rnd(1.2,3)*Math.max(.55,1-s.round*.08)}}
 else{s.rt-=dt;if(s.rt<=0){if(s.st==='touch')s.round++;drRound(s,g)}}
 if((s.st==='chant'||s.st==='look')&&s.y<300){s.st='touch';s.rt=1.3;s.touch++;g.add(100,360,260);g.sfx('win');g.burst(360,260,'#ffe28a',30,300,5)}g.score=Math.max(g.score,0)},
draw(s,g,c){const{W,H}=g;g.bg('#9ed2f5','#e0f2ff');c.fillStyle='#c9a46a';c.fillRect(0,320,W,H-320);c.fillStyle='rgba(120,90,60,.12)';for(let i=0;i<50;i++)c.fillRect((i*131)%W,330+(i*71)%600,24,3);
 c.fillStyle='#6b4a2a';c.fillRect(330,120,60,220);g.circle(360,120,110,'#3a8a3a');g.circle(290,160,70,'#4a9a4a');g.circle(440,160,70,'#4a9a4a');
 const look=s.st==='look'||s.st==='out';c.save();c.translate(360,280);g.rrf(-28,0,56,70,16,'#e63946');g.circle(0,-20,28,'#f3d0a8');c.fillStyle='#1b1220';if(look){g.circle(-10,-22,4,'#1b1220');g.circle(10,-22,4,'#1b1220');c.beginPath();c.arc(0,-10,8,0,Math.PI);c.fill()}else{c.beginPath();c.arc(0,-30,26,Math.PI,0);c.fill();c.fillRect(-26,-30,52,18)}c.restore();
 c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=4;c.setLineDash([12,10]);c.beginPath();c.moveTo(80,300);c.lineTo(640,300);c.stroke();c.setLineDash([]);
 const y=s.y,bob=s.st==='chant'&&g.I.down?Math.sin(g.time*14)*4:0;c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(360,y+40,28,8,0,0,TAU);c.fill();g.rrf(336,y-20+bob,48,60,16,'#3a6bd8');g.circle(360,y-40+bob,24,'#f3d0a8');c.fillStyle='#1b1220';c.beginPath();c.arc(360,y-48+bob,24,Math.PI,0);c.fill();
 if(s.st==='chant'||s.st==='look'){const txt=DPH.slice(0,s.ln);g.rrf(60,130,W-120,0,0,'#000');g.txt(txt,W/2,90+0,34,'#3a2418','center',g.FD,400)}
 if(s.st==='look')g.txt('ころんだ！',W/2,400,64,'#e63946','center',g.FD,400);if(s.st==='out')g.txt('みーつけた！',W/2,450,56,'#e63946','center',g.FD,400);if(s.st==='touch')g.txt('タッチ！',W/2,450,64,'#2a9a4a','center',g.FD,400);
 g.txt('タッチ '+s.touch+'回',W/2,H-30,24,'#3a2418')}});

// 76. おにごっこ
function chick(g,gold){return{x:g.rnd(120,600),y:g.rnd(250,800),vx:0,vy:0,gold:!!gold,ph:g.rnd(TAU),tired:0}}
reg({id:'chicks',name:'ひよこおいかけ',genre:'おにごっこ',color:'#ffc857',time:40,goal:320,
howto:'ドラッグした方へ走る\n逃げるひよこを捕まえよう（金色は高得点）',
init(g){return{p:{x:360,y:860},ch:[chick(g),chick(g),chick(g),chick(g,true)],got:0}},
update(s,g,dt){const{W,H,I}=g,p=s.p;let tx=p.x,ty=p.y;if(I.down){tx=I.x;ty=I.y}const k=I.keys;if(k.ArrowLeft)tx-=999;if(k.ArrowRight)tx+=999;if(k.ArrowUp)ty-=999;if(k.ArrowDown)ty+=999;
 const dx=tx-p.x,dy=ty-p.y,l=Math.hypot(dx,dy),m=Math.min(l,330*dt);if(l>1){p.x+=dx/l*m;p.y+=dy/l*m}p.x=g.clamp(p.x,40,W-40);p.y=g.clamp(p.y,130,H-30);
 for(const c0 of s.ch){const d=g.dist(c0.x,c0.y,p.x,p.y);let ax=Math.cos(g.time*2+c0.ph)*80,ay=Math.sin(g.time*1.7+c0.ph)*80;if(d<260){ax+=(c0.x-p.x)/d*1400;ay+=(c0.y-p.y)/d*1400}
  const mg=70;if(c0.x<mg)ax+=600;if(c0.x>W-mg)ax-=600;if(c0.y<130+mg)ay+=600;if(c0.y>H-mg)ay-=600;
  c0.vx=(c0.vx+ax*dt)*(1-dt*3);c0.vy=(c0.vy+ay*dt)*(1-dt*3);const sp=Math.hypot(c0.vx,c0.vy),mx=(c0.gold?320:270)-c0.tired*90;if(sp>mx){c0.vx*=mx/sp;c0.vy*=mx/sp}c0.tired=Math.min(1,c0.tired+dt*(sp>200?.25:-.4));if(c0.tired<0)c0.tired=0;
  c0.x=g.clamp(c0.x+c0.vx*dt,24,W-24);c0.y=g.clamp(c0.y+c0.vy*dt,124,H-24);
  if(d<42){s.got++;g.add(c0.gold?50:20,c0.x,c0.y-30,c0.gold?'#fff1a8':'#ffe28a');g.sfx(c0.gold?'win':'coin');g.burst(c0.x,c0.y,'#ffe28a',16,240,4);Object.assign(c0,chick(g,c0.gold),{x:g.rnd()<.5?60:W-60,y:g.rnd(200,500)})}}},
draw(s,g,c){const{W,H}=g,t=g.time,p=s.p;g.bg('#b8e08a','#8cc46a');c.fillStyle='rgba(60,110,40,.2)';for(let i=0;i<60;i++){const x=(i*97)%W,y=110+(i*173)%(H-110);c.beginPath();c.moveTo(x,y);c.lineTo(x+4,y-12);c.lineTo(x+8,y);c.fill()}
 c.strokeStyle='#8a6440';c.lineWidth=6;c.strokeRect(14,104,W-28,H-118);for(let x=14;x<W;x+=60){g.rrf(x-5,96,10,24,3,'#6b4a2a')}
 for(const c0 of s.ch){const x=c0.x,y=c0.y,hop=Math.abs(Math.sin(t*16+c0.ph))*(Math.hypot(c0.vx,c0.vy)>40?7:1),fx=c0.vx>=0?1:-1;c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(x,y+16,16,5,0,0,TAU);c.fill();
  const col=c0.gold?'#ffd700':'#ffe680';if(c0.gold)g.glow('#ffd700',16);g.circle(x,y-hop,18,col);g.circle(x+fx*10,y-16-hop,12,col);g.noglow();g.circle(x+fx*14,y-19-hop,2.5,'#1b1220');c.fillStyle='#ff9f43';c.beginPath();c.moveTo(x+fx*21,y-16-hop);c.lineTo(x+fx*29,y-13-hop);c.lineTo(x+fx*21,y-10-hop);c.fill();if(c0.tired>.6)g.txt('💦',x-fx*14,y-38,16,'#000')}
 c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(p.x,p.y+26,24,7,0,0,TAU);c.fill();g.rrf(p.x-20,p.y-20,40,46,14,'#3a8a3a');g.circle(p.x,p.y-34,18,'#f3d0a8');c.fillStyle='#e8c060';c.beginPath();c.ellipse(p.x,p.y-46,30,8,0,0,TAU);c.fill();c.fillRect(p.x-14,p.y-62,28,16);g.circle(p.x-6,p.y-34,2.5,'#1b1220');g.circle(p.x+6,p.y-34,2.5,'#1b1220');
 g.txt('つかまえた '+s.got+'羽',W/2,H-36,22,'#2a4a1a')}});
})();
