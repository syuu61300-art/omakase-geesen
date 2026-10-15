// Pack 2 — games 14-25
(()=>{const reg=MG.reg;const TAU=Math.PI*2;

// 14. 計算
function newQ(g,lv){let a,b,op,ans;const r=Math.random();
 if(lv<2||r<.4){a=g.ri(3,20+lv*8);b=g.ri(2,15+lv*6);if(Math.random()<.5){op='+';ans=a+b}else{if(b>a){const t=a;a=b;b=t}op='−';ans=a-b}}
 else if(r<.8){a=g.ri(2,9+lv);b=g.ri(2,9);op='×';ans=a*b}else{b=g.ri(2,9);ans=g.ri(2,9+lv);a=b*ans;op='÷'}
 const ch=new Set([ans]);while(ch.size<4){const d=g.ri(-10,10);if(d&&ans+d>=0)ch.add(ans+d)}return{text:a+' '+op+' '+b,ans,ch:g.shuffle([...ch]),wrong:-1,wt:0}}
const BC=['#ff6f59','#ffc857','#2ec4b6','#5b8cff'];
reg({id:'math',name:'あんざんラッシュ',genre:'計算',color:'#9be15d',time:40,goal:240,
howto:'正しい答えのボタンをタップ\n連続正解でボーナス（1〜4キー可）',
init(g){return{q:newQ(g,0),streak:0,ok:0,pop:0}},
update(s,g,dt){const{W,I}=g;s.pop=Math.max(0,s.pop-dt*4);s.q.wt=Math.max(0,s.q.wt-dt);let pick=-1;
 if(I.pressed)for(let i=0;i<4;i++){const x=60+(i%2)*310,y=540+Math.floor(i/2)*190;if(I.x>x&&I.x<x+290&&I.y>y&&I.y<y+170)pick=i}
 for(let i=0;i<4;i++)if(I.kp[String(i+1)])pick=i;
 if(pick>=0){if(s.q.ch[pick]===s.q.ans){s.streak++;s.ok++;g.add(10+Math.min(20,s.streak*2),W/2,330);g.sfx('good');g.burst(60+(pick%2)*310+145,540+Math.floor(pick/2)*190+85,BC[pick],18,300,5);s.q=newQ(g,Math.floor(s.ok/4));s.pop=1}
  else{s.streak=0;g.add(-5,W/2,330);g.sfx('bad');g.shake(10);s.q.wrong=pick;s.q.wt=.4}}},
draw(s,g,c){const{W,H}=g;g.bg('#24463c','#14281f');c.fillStyle='rgba(255,255,255,.03)';for(let i=0;i<200;i++)c.fillRect((i*137)%W,(i*311)%H,3,2);
 c.strokeStyle='#8a6440';c.lineWidth=16;c.strokeRect(30,110,W-60,360);
 const sc=1+s.pop*.15;c.save();c.translate(W/2,270);c.scale(sc,sc);g.fitTxt(s.q.text+' = ?',0,0,W-120,92,'#f4f1e8');c.restore();
 if(s.streak>1)g.txt('🔥 '+s.streak+'連続',W/2,420,28,'#ffc857');
 for(let i=0;i<4;i++){const x=60+(i%2)*310,y=540+Math.floor(i/2)*190,sh=s.q.wrong===i?Math.sin(g.time*60)*8*s.q.wt:0;
  g.rrf(x+sh,y+10,290,170,26,g.shade(BC[i],-.4));g.rrf(x+sh,y,290,170,26,BC[i]);g.rrf(x+sh+14,y+12,262,20,10,'rgba(255,255,255,.25)');
  g.txt(String(s.q.ch[i]),x+145+sh,y+88,64,'#1b1220','center',g.FD,400);g.txt(String(i+1),x+26+sh,y+146,18,'rgba(27,18,32,.5)')}}});

// 15. スネーク
const SC=18,SR=22,CS=36;
function food(s,g){let p;do{p={x:g.ri(0,SC-1),y:g.ri(0,SR-1)}}while(s.body.some(b=>b.x===p.x&&b.y===p.y));return p}
reg({id:'snake',name:'にょろにょろ',genre:'スネーク',color:'#2ec4b6',time:50,goal:220,
howto:'スワイプか矢印キーで向きを変える\n頭の上下左右をタップしても曲がれる',
init(g){const s={body:[{x:6,y:11},{x:5,y:11},{x:4,y:11}],dir:{x:1,y:0},q:[],step:0,iv:.14,gold:null,gt:0};s.prev=s.body.map(b=>({...b}));s.food=food(s,g);return s},
update(s,g,dt){const{I}=g,ox=(g.W-SC*CS)/2,oy=120;const last=s.q.length?s.q[s.q.length-1]:s.dir;
 const push=(x,y)=>{if(s.q.length<3&&!(x===-last.x&&y===-last.y)&&!(x===last.x&&y===last.y))s.q.push({x,y})};
 const kp=I.kp;if(kp.ArrowLeft||kp.a)push(-1,0);if(kp.ArrowRight||kp.d)push(1,0);if(kp.ArrowUp||kp.w)push(0,-1);if(kp.ArrowDown||kp.s)push(0,1);
 if(I.swipe){const{dx,dy}=I.swipe;if(Math.abs(dx)>Math.abs(dy))push(Math.sign(dx),0);else push(0,Math.sign(dy))}
 else if(I.released&&g.dist(I.x,I.y,I.sx,I.sy)<30){const h=s.body[0],hx=ox+(h.x+.5)*CS,hy=oy+(h.y+.5)*CS;if(last.x)push(0,I.y<hy?-1:1);else push(I.x<hx?-1:1,0)}
 if(s.gold){s.gt-=dt;if(s.gt<=0)s.gold=null}
 s.step+=dt;if(s.step<s.iv)return;s.step=0;if(s.q.length)s.dir=s.q.shift();
 s.prev=s.body.map(b=>({...b}));const h=s.body[0],n={x:h.x+s.dir.x,y:h.y+s.dir.y};
 if(n.x<0||n.y<0||n.x>=SC||n.y>=SR||s.body.slice(0,-1).some(b=>b.x===n.x&&b.y===n.y)){g.sfx('boom');g.shake(14);g.burst(ox+(h.x+.5)*CS,oy+(h.y+.5)*CS,'#2ec4b6',30,340,5);g.over('ぶつかった！');return}
 s.body.unshift(n);s.prev.unshift({...h});
 if(n.x===s.food.x&&n.y===s.food.y){g.add(10,ox+(n.x+.5)*CS,oy+n.y*CS);g.sfx('coin');g.burst(ox+(n.x+.5)*CS,oy+(n.y+.5)*CS,'#ff6f59',14,240,4);s.food=food(s,g);s.iv=Math.max(.07,s.iv-.004);if(!s.gold&&Math.random()<.3){s.gold=food(s,g);s.gt=5}}
 else if(s.gold&&n.x===s.gold.x&&n.y===s.gold.y){g.add(30,ox+(n.x+.5)*CS,oy+n.y*CS,'#ffe28a');g.sfx('good');g.burst(ox+(n.x+.5)*CS,oy+(n.y+.5)*CS,'#ffe28a',24,300,5);s.gold=null;s.body.push({...s.body[s.body.length-1]});s.prev.push({...s.prev[s.prev.length-1]})}
 else{s.body.pop();s.prev.pop()}},
draw(s,g,c){const{W}=g,ox=(W-SC*CS)/2,oy=120,k=Math.min(1,s.step/s.iv);g.bg('#0f1a14','#09110c');
 for(let y=0;y<SR;y++)for(let x=0;x<SC;x++){c.fillStyle=(x+y)%2?'#16291f':'#13241b';c.fillRect(ox+x*CS,oy+y*CS,CS,CS)}
 c.strokeStyle='#2ec4b6';c.lineWidth=3;c.strokeRect(ox-2,oy-2,SC*CS+4,SR*CS+4);
 const pulse=1+Math.sin(g.time*6)*.08;g.glow('#ff6f59',18);g.circle(ox+(s.food.x+.5)*CS,oy+(s.food.y+.5)*CS,13*pulse,'#ff4d5e');g.noglow();c.fillStyle='#4caf50';c.beginPath();c.ellipse(ox+(s.food.x+.5)*CS+4,oy+s.food.y*CS+6,6,3,-.6,0,TAU);c.fill();
 if(s.gold){c.globalAlpha=s.gt<1.5?.5+.5*Math.sin(g.time*20):1;g.glow('#ffe28a',22);g.star(ox+(s.gold.x+.5)*CS,oy+(s.gold.y+.5)*CS,16*pulse,7);c.fillStyle='#ffe28a';c.fill();g.noglow();c.globalAlpha=1}
 const n=s.body.length;for(let i=n-1;i>=0;i--){const a=s.prev[i]||s.body[i],b=s.body[i],x=ox+(a.x+(b.x-a.x)*k+.5)*CS,y=oy+(a.y+(b.y-a.y)*k+.5)*CS;g.circle(x,y,CS*.46-i*.15,g.mix('#2ec4b6','#9be15d',i/Math.max(1,n-1)))}
 const a=s.prev[0]||s.body[0],b=s.body[0],hx=ox+(a.x+(b.x-a.x)*k+.5)*CS,hy=oy+(a.y+(b.y-a.y)*k+.5)*CS,d=s.dir,px=-d.y,py=d.x;
 for(const sd of[-1,1]){g.circle(hx+d.x*6+px*8*sd,hy+d.y*6+py*8*sd,6,'#ffffff');g.circle(hx+d.x*8+px*8*sd,hy+d.y*8+py*8*sd,3,'#0f1a14')}
 g.txt('長さ '+n,W/2,oy+SR*CS+30,22,'rgba(255,255,255,.6)')}});

// 16. 数字タッチ
function genNums(s,g){s.nums=[];let tries=0;while(s.nums.length<s.n&&tries++<3000){const x=g.rnd(80,g.W-80),y=g.rnd(170,g.H-70);if(s.nums.every(o=>g.dist(o.x,o.y,x,y)>104))s.nums.push({v:s.nums.length+1,x,y,done:false,pop:0,h:g.ri(0,359),wob:g.rnd(TAU)})}s.n=s.nums.length;s.next=1}
reg({id:'numbers',name:'かずタッチ',genre:'数字さがし',color:'#ffc857',time:40,goal:300,
howto:'1から順番に数字をタップ\n全部押せたら次のステージへ',
init(g){const s={set:1,n:12,wrong:null};genNums(s,g);return s},
update(s,g,dt){const{I}=g;for(const o of s.nums)o.pop=Math.max(0,o.pop-dt*3);if(s.wrong){s.wrong.t-=dt;if(s.wrong.t<=0)s.wrong=null}
 if(I.pressed)for(const o of s.nums){if(o.done||g.dist(o.x,o.y,I.x,I.y)>50)continue;
  if(o.v===s.next){o.done=true;o.pop=1;s.next++;g.add(4+s.set,o.x,o.y-50);g.tone(400+o.v*40,.1,'triangle',.2);g.burst(o.x,o.y,'hsl('+o.h+',80%,60%)',12,220,4);
   if(s.next>s.n){g.add(40*s.set,g.W/2,g.H/2);g.float('ステージ '+s.set+' クリア！',g.W/2,g.H/2-60,'#120e1d',40);g.sfx('win');s.set++;s.n=Math.min(25,s.n+3);genNums(s,g)}}
  else{g.add(-3,o.x,o.y-50);g.sfx('bad');g.shake(8);s.wrong={o,t:.35}}break}},
draw(s,g,c){const{W,H}=g;g.bg('#fff6e6','#ffe3c2');c.fillStyle='rgba(160,110,60,.12)';for(let y=110;y<H;y+=32)for(let x=16;x<W;x+=32){c.beginPath();c.arc(x,y,2,0,TAU);c.fill()}
 g.txt('つぎは',W/2-40,118,22,'#7a5a3a','right');g.txt(String(Math.min(s.next,s.n)),W/2-24,118,44,'#ff6f59','left',g.FD,400);g.txt('ステージ '+s.set,W-30,118,20,'#7a5a3a','right');
 for(const o of s.nums){const r=46+o.pop*14,x=o.x+(s.wrong&&s.wrong.o===o?Math.sin(g.time*60)*6:0),y=o.y+Math.sin(g.time*2+o.wob)*3;
  if(o.done){c.globalAlpha=.35;c.strokeStyle='hsl('+o.h+',60%,55%)';c.lineWidth=3;c.beginPath();c.arc(x,y,r-8,0,TAU);c.stroke();c.globalAlpha=1;continue}
  c.fillStyle='rgba(120,70,30,.18)';c.beginPath();c.arc(x+4,y+6,r,0,TAU);c.fill();g.circle(x,y,r,'hsl('+o.h+',85%,72%)');g.circle(x,y,r-7,'hsl('+o.h+',90%,82%)');
  g.txt(String(o.v),x,y+2,40,'#2a1a10','center',g.FD,400)}}});

// 17. マッチ3
const MN=7,MCS=88,GC=['#ff4d6d','#ff9f43','#ffd23f','#3ddc84','#4d9dff','#b46bff'];
function gemShape(c,g,t,x,y,r){const col=GC[t],gr=c.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r*1.1);gr.addColorStop(0,g.shade(col,.6));gr.addColorStop(.5,col);gr.addColorStop(1,g.shade(col,-.45));c.fillStyle=gr;
 if(t===0)g.poly(x,y,r,6,Math.PI/6);else if(t===1){c.beginPath();c.arc(x,y,r*.92,0,TAU)}else if(t===2)g.star(x,y,r*1.05,r*.55,5);else if(t===3)g.poly(x,y,r*1.05,4,0);else if(t===4)g.poly(x,y+r*.15,r*1.1,3,-Math.PI/2);else g.poly(x,y,r*.95,8,Math.PI/8);
 c.fill();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;c.stroke();c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(x-r*.25,y-r*.35,r*.28,r*.13,-.5,0,TAU);c.fill()}
function m3board(g){const b=[];for(let r=0;r<MN;r++){b.push([]);for(let c=0;c<MN;c++){let t;do{t=g.ri(0,5)}while((c>1&&b[r][c-1].t===t&&b[r][c-2].t===t)||(r>1&&b[r-1][c].t===t&&b[r-2][c].t===t));b[r].push({t,x:c,y:r-MN-2})}}return b}
function m3find(b){const m=new Set();for(let r=0;r<MN;r++)for(let c=0;c<MN-2;c++){const t=b[r][c].t;if(b[r][c+1].t===t&&b[r][c+2].t===t){m.add(r*MN+c);m.add(r*MN+c+1);m.add(r*MN+c+2)}}
 for(let c=0;c<MN;c++)for(let r=0;r<MN-2;r++){const t=b[r][c].t;if(b[r+1][c].t===t&&b[r+2][c].t===t){m.add(r*MN+c);m.add((r+1)*MN+c);m.add((r+2)*MN+c)}}return m}
function m3swap(b,a,c){const t=b[a.r][a.c];b[a.r][a.c]=b[c.r][c.c];b[c.r][c.c]=t}
function m3hasMove(b){for(let r=0;r<MN;r++)for(let c=0;c<MN;c++)for(const[dr,dc]of[[0,1],[1,0]]){const r2=r+dr,c2=c+dc;if(r2>=MN||c2>=MN)continue;m3swap(b,{r,c},{r:r2,c:c2});const ok=m3find(b).size>0;m3swap(b,{r,c},{r:r2,c:c2});if(ok)return true}return false}
reg({id:'match3',name:'ジュエルスワップ',genre:'マッチ3',color:'#b46bff',time:60,goal:900,
howto:'となりの宝石とスワイプで入れ替え\n3つ以上そろえて消そう',
init(g){return{b:m3board(g),sel:null,pend:null,chain:0}},
update(s,g,dt){const{I}=g,ox=(g.W-MN*MCS)/2,oy=230;let settled=true;
 for(let r=0;r<MN;r++)for(let c=0;c<MN;c++){const p=s.b[r][c];p.x+=(c-p.x)*Math.min(1,dt*14);const dy=r-p.y;p.y+=Math.sign(dy)*Math.min(Math.abs(dy),dt*14);if(Math.abs(p.x-c)>.02||Math.abs(p.y-r)>.02)settled=false;else{p.x=c;p.y=r}}
 if(!settled)return;
 if(s.pend){const m=m3find(s.b);if(!m.size){if(s.pend.revert){m3swap(s.b,s.pend.a,s.pend.c);g.tone(220,.12,'triangle',.12)}s.pend=null;s.chain=0;if(!m3hasMove(s.b)){s.b=m3board(g);g.float('シャッフル！',g.W/2,g.H/2,'#ffffff',40)}return}
  s.chain++;const pts=m.size*10*s.chain;let sx=0,sy=0;for(const i of m){const r=Math.floor(i/MN),c=i%MN;sx+=c;sy+=r;g.burst(ox+(c+.5)*MCS,oy+(r+.5)*MCS,GC[s.b[r][c].t],8,240,4);s.b[r][c]=null}
  g.add(pts,ox+(sx/m.size+.5)*MCS,oy+(sy/m.size)*MCS,'#ffffff');if(s.chain>1)g.float(s.chain+'連鎖！',g.W/2,190,'#ffe28a',40);g.tone(500+s.chain*120,.12,'triangle',.22);
  for(let c=0;c<MN;c++){let w=MN-1;for(let r=MN-1;r>=0;r--)if(s.b[r][c]){const p=s.b[r][c];s.b[r][c]=null;s.b[w][c]=p;w--}let k=1;for(let r=w;r>=0;r--){s.b[r][c]={t:g.ri(0,5),x:c,y:-k};k++}}
  s.pend={revert:false};return}
 const cell=(x,y)=>{const c=Math.floor((x-ox)/MCS),r=Math.floor((y-oy)/MCS);return c>=0&&c<MN&&r>=0&&r<MN?{r,c}:null};
 const trySwap=(a,c)=>{if(Math.abs(a.r-c.r)+Math.abs(a.c-c.c)!==1)return false;m3swap(s.b,a,c);s.pend={revert:true,a,c};s.sel=null;g.sfx('pop');return true};
 if(I.pressed){const p=cell(I.x,I.y);if(p&&s.sel&&trySwap(s.sel,p))return;s.sel=p;s.dragged=false}
 if(I.down&&s.sel&&!s.dragged){const dx=I.x-I.sx,dy=I.y-I.sy;if(Math.hypot(dx,dy)>36){s.dragged=true;const t=Math.abs(dx)>Math.abs(dy)?{r:s.sel.r,c:s.sel.c+Math.sign(dx)}:{r:s.sel.r+Math.sign(dy),c:s.sel.c};if(t.r>=0&&t.r<MN&&t.c>=0&&t.c<MN)trySwap(s.sel,t)}}},
draw(s,g,c){const{W,H}=g,ox=(W-MN*MCS)/2,oy=230;g.bg('#2a1036','#0f0716');
 c.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const gr=c.createRadialGradient((i*170+g.time*20)%W,150+i*160,10,(i*170+g.time*20)%W,150+i*160,200);gr.addColorStop(0,g.rgba(GC[i],.12));gr.addColorStop(1,g.rgba(GC[i],0));c.fillStyle=gr;c.fillRect(0,0,W,H)}c.globalCompositeOperation='source-over';
 g.rrf(ox-14,oy-14,MN*MCS+28,MN*MCS+28,22,'rgba(255,255,255,.08)');
 for(let r=0;r<MN;r++)for(let cc=0;cc<MN;cc++){c.fillStyle=(r+cc)%2?'rgba(0,0,0,.25)':'rgba(0,0,0,.12)';c.fillRect(ox+cc*MCS,oy+r*MCS,MCS,MCS)}
 c.save();c.beginPath();c.rect(ox,oy,MN*MCS,MN*MCS);c.clip();
 for(let r=0;r<MN;r++)for(let cc=0;cc<MN;cc++){const p=s.b[r][cc];if(!p)continue;const x=ox+(p.x+.5)*MCS,y=oy+(p.y+.5)*MCS,sel=s.sel&&s.sel.r===r&&s.sel.c===cc;if(sel){g.glow('#ffffff',20)}gemShape(c,g,p.t,x,y,(sel?34:30)+(sel?Math.sin(g.time*10)*2:0));g.noglow()}
 c.restore();g.txt('タップで選んで となりをタップでも入れ替えOK',W/2,oy+MN*MCS+50,20,'rgba(255,255,255,.55)')}});

// 18. レース
const SEG=200,RW=2000,CAMH=1000,DEPTH=.84,DD=110,PZ=CAMH*DEPTH;
function project(p,cx,cy,cz,W,H){const x=-cx,y=-cy,z=p.z-cz,sc=DEPTH/z;p.cz=z;p.sx=W/2+sc*x*W/2;p.sy=H/2-sc*y*H/2;p.sw=sc*RW*W/2;p.sc=sc}
function drawCar(c,g,x,y,w,col){const h=w*.5;c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(x,y,w*.55,h*.15,0,0,TAU);c.fill();
 g.rrf(x-w/2,y-h,w,h*.8,w*.08,col);g.rrf(x-w*.35,y-h*1.35,w*.7,h*.5,w*.1,g.shade(col,-.35));c.fillStyle='rgba(160,220,255,.5)';c.fillRect(x-w*.28,y-h*1.25,w*.56,h*.3);
 g.glow('#ff2a2a',w*.2);c.fillStyle='#ff3b3b';c.fillRect(x-w*.45,y-h*.65,w*.18,h*.16);c.fillRect(x+w*.27,y-h*.65,w*.18,h*.16);g.noglow();c.fillStyle='#111';c.fillRect(x-w*.48,y-h*.22,w*.16,h*.24);c.fillRect(x+w*.32,y-h*.22,w*.16,h*.24)}
reg({id:'race',name:'ミッドナイトラン',genre:'レース',color:'#ff7ab6',time:45,goal:560,
howto:'画面の左右を押してハンドル（←→キー可）\n他の車を追い越して距離をかせごう',
init(g){const segs=[];let i=0;while(segs.length<600){const len=g.ri(30,70),cv=g.pick([0,0,-2,2,-4,4,-6,6]);for(let k=0;k<len&&segs.length<600;k++){const e=k<len/4?k/(len/4):k>len*3/4?(len-k)/(len/4):1;segs.push({i:segs.length,curve:cv*e,p1:{z:segs.length*SEG},p2:{z:(segs.length+1)*SEG}})}}
 const L=segs.length*SEG,cols=['#5b8cff','#2ec4b6','#ffc857','#a98bff','#9be15d','#ff9f43'];
 return{segs,L,pos:0,x:0,sp:0,max:12000,sky:0,cars:Array.from({length:16},(_,k)=>({z:1500+k*L/17,off:g.pick([-.6,-.2,.2,.6]),sp:g.rnd(3000,6000),col:g.pick(cols)})),bump:0}},
update(s,g,dt){const{W,I}=g,k=I.keys,pct=s.sp/s.max,seg=s.segs[Math.floor((s.pos+PZ)/SEG)%s.segs.length];
 s.sp=Math.min(s.max,s.sp+4200*dt);let steer=0;if(k.ArrowLeft||k.a)steer=-1;if(k.ArrowRight||k.d)steer=1;if(I.down)steer=g.clamp((I.x-W/2)/(W/4),-1,1);
 s.steer=steer;s.x+=steer*dt*2.4*pct;s.x-=dt*2*pct*seg.curve*.3*pct;s.sky+=seg.curve*pct*dt*.02;
 if(Math.abs(s.x)>1){s.sp=Math.max(2500,s.sp-9000*dt);g.shake(3)}s.x=g.clamp(s.x,-2.2,2.2);
 s.pos=(s.pos+s.sp*dt)%s.L;g.score+=s.sp*dt/1100;s.bump=Math.max(0,s.bump-dt);
 for(const c of s.cars){c.z=(c.z+c.sp*dt)%s.L;let rel=((c.z-s.pos-PZ)%s.L+s.L)%s.L;if(rel>s.L/2)rel-=s.L;
  if(c.prev!==undefined&&c.prev>0&&rel<=0&&rel>-2000){g.add(20,W/2,g.H-260,'#ffe28a');g.tone(880,.08,'triangle',.15)}c.prev=rel;
  if(rel>-60&&rel<160&&Math.abs(c.off-s.x)<.32&&s.bump<=0){s.sp=c.sp*.5;s.bump=.8;g.shake(14);g.sfx('bad');g.add(-20,W/2,g.H-300);g.burst(W/2,g.H-160,'#ffc857',20,300,4)}}},
draw(s,g,c){const{W,H}=g;let gr=c.createLinearGradient(0,0,0,H/2);gr.addColorStop(0,'#0b0f2e');gr.addColorStop(.7,'#3b1d5c');gr.addColorStop(1,'#ff6f8a');c.fillStyle=gr;c.fillRect(0,0,W,H/2+2);
 for(let i=0;i<50;i++)g.circle((i*131+s.sky*400)%W,(i*67)%(H*.35),1.3,'rgba(255,255,255,.7)');g.glow('#fff1c1',40);g.circle(((W*.75-s.sky*600)%W+W)%W,130,40,'#fff6dc');g.noglow();
 const hills=(off,amp,col,f,base)=>{c.fillStyle=col;c.beginPath();c.moveTo(0,H/2);for(let x=0;x<=W;x+=12){const u=x*f+off;c.lineTo(x,base-amp*Math.abs(Math.sin(u)*.7+Math.sin(u*2.7)*.3))}c.lineTo(W,H/2);c.fill()};
 hills(s.sky*2,110,'#2a1640',.008,H/2);hills(s.sky*4,60,'#1a0e2a',.015,H/2);
 c.fillStyle='#0b1a12';c.fillRect(0,H/2,W,H/2);
 const N=s.segs.length,bi=Math.floor(s.pos/SEG)%N,base=s.segs[bi],bp=(s.pos%SEG)/SEG;let x=0,dx=-(base.curve*bp),maxy=H;const vis=[];
 for(let n=0;n<DD;n++){const sg=s.segs[(bi+n)%N],lp=sg.i<bi?s.L:0;project(sg.p1,s.x*RW-x,CAMH,s.pos-lp,W,H);project(sg.p2,s.x*RW-x-dx,CAMH,s.pos-lp,W,H);x+=dx;dx+=sg.curve;sg.clip=maxy;vis.push(sg);
  if(sg.p1.cz<=DEPTH||sg.p2.sy>=maxy||sg.p2.sy>=sg.p1.sy)continue;const p1=sg.p1,p2=sg.p2,alt=Math.floor(sg.i/3)%2;
  c.fillStyle=alt?'#10301f':'#0d2719';c.fillRect(0,p2.sy,W,p1.sy-p2.sy+1);
  const quad=(x1,y1,w1,x2,y2,w2,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x1-w1,y1);c.lineTo(x2-w2,y2);c.lineTo(x2+w2,y2);c.lineTo(x1+w1,y1);c.closePath();c.fill()};
  quad(p1.sx,p1.sy,p1.sw*1.15,p2.sx,p2.sy,p2.sw*1.15,alt?'#ff6f59':'#fff3df');quad(p1.sx,p1.sy,p1.sw,p2.sx,p2.sy,p2.sw,alt?'#2c2a3a':'#272533');
  if(alt){const l1=p1.sw/40,l2=p2.sw/40;for(const f of[-1/3,1/3])quad(p1.sx+p1.sw*f*2,p1.sy,l1,p2.sx+p2.sw*f*2,p2.sy,l2,'#ffc857')}
  maxy=p2.sy}
 for(let n=vis.length-1;n>0;n--){const sg=vis[n];for(const car of s.cars){if(Math.floor(car.z/SEG)%N!==sg.i)continue;if(sg.p1.cz<=DEPTH)continue;const cx=sg.p1.sx+sg.p1.sc*car.off*RW*W/2,cy=sg.p1.sy,cw=sg.p1.sw*.5;if(cy>sg.clip+cw||cw<2)continue;drawCar(c,g,cx,cy,cw,car.col)}}
 c.save();c.translate(W/2,H-110);c.rotate((s.steer||0)*.05);drawCar(c,g,0,0,220,'#ff3b6b');c.restore();
 if(s.sp>9000){c.strokeStyle='rgba(255,255,255,.15)';c.lineWidth=2;for(let i=0;i<10;i++){const a=i*.63+g.time*7,r1=300+(g.time*900+i*90)%300;c.beginPath();c.moveTo(W/2+Math.cos(a)*r1,H/2+Math.sin(a)*r1*.6);c.lineTo(W/2+Math.cos(a)*(r1+60),H/2+Math.sin(a)*(r1+60)*.6);c.stroke()}}
 g.txt(Math.round(s.sp/40)+' km/h',W-24,H-30,30,'#ffffff','right',g.FD,400);g.vignette(.5)}});

// 19. 対戦
reg({id:'hockey',name:'ネオンホッケー',genre:'対戦',color:'#5b8cff',time:45,goal:200,
howto:'ドラッグで自分のマレットを動かす\nパックを上のゴールへ打ちこもう',
init(g){const{W,H}=g;return{p:{x:W/2,y:H/2,vx:0,vy:-200,r:26},me:{x:W/2,y:H-170,vx:0,vy:0,r:44},ai:{x:W/2,y:210,vx:0,vy:0,r:44},sc:[0,0],trail:[],wait:0}},
update(s,g,dt){const{W,H,I}=g,T=100,B=H-40,L=40,R=W-40,GW=110,p=s.p,me=s.me,ai=s.ai;
 if(s.wait>0){s.wait-=dt;if(s.wait<=0){p.x=W/2;p.y=H/2;p.vx=g.rnd(-120,120);p.vy=s.serve*260}}
 const ox=me.x,oy=me.y;let tx=me.x,ty=me.y;if(I.down||I.x!==I.px||I.y!==I.py){tx=I.x;ty=I.y}const kk=I.keys;if(kk.ArrowLeft)tx-=700*dt;if(kk.ArrowRight)tx+=700*dt;if(kk.ArrowUp)ty-=700*dt;if(kk.ArrowDown)ty+=700*dt;
 me.x=g.clamp(tx,L+me.r,R-me.r);me.y=g.clamp(ty,H/2+me.r,B-me.r);me.vx=(me.x-ox)/Math.max(dt,.001);me.vy=(me.y-oy)/Math.max(dt,.001);
 const spd=520+g.time*7;let ax,ay;if(p.y<H/2+40&&s.wait<=0){ax=p.x;ay=p.y-30}else{ax=W/2+(p.x-W/2)*.45;ay=190}
 const ddx=ax-ai.x,ddy=ay-ai.y,dl=Math.hypot(ddx,ddy),mv=Math.min(dl,spd*dt);const aox=ai.x,aoy=ai.y;if(dl>0){ai.x+=ddx/dl*mv;ai.y+=ddy/dl*mv}ai.x=g.clamp(ai.x,L+ai.r,R-ai.r);ai.y=g.clamp(ai.y,T+ai.r,H/2-ai.r);ai.vx=(ai.x-aox)/Math.max(dt,.001);ai.vy=(ai.y-aoy)/Math.max(dt,.001);
 if(s.wait>0)return;
 p.x+=p.vx*dt;p.y+=p.vy*dt;const f=Math.pow(.6,dt);p.vx*=f;p.vy*=f;
 for(const m of[me,ai]){const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);if(d<p.r+m.r&&d>0){const nx=dx/d,ny=dy/d;p.x=m.x+nx*(p.r+m.r);p.y=m.y+ny*(p.r+m.r);const rvx=p.vx-m.vx,rvy=p.vy-m.vy,vn=rvx*nx+rvy*ny;if(vn<0){p.vx-=1.9*vn*nx;p.vy-=1.9*vn*ny}const sp=Math.hypot(p.vx,p.vy);if(sp>1700){p.vx*=1700/sp;p.vy*=1700/sp}g.tone(320,.05,'square',.12);g.burst(p.x-nx*p.r,p.y-ny*p.r,'#9fe8ff',6,200,3,0)}}
 if(p.x<L+p.r){p.x=L+p.r;p.vx=Math.abs(p.vx)}if(p.x>R-p.r){p.x=R-p.r;p.vx=-Math.abs(p.vx)}
 const inGoal=Math.abs(p.x-W/2)<GW;
 if(p.y<T+p.r){if(inGoal&&p.y<T-p.r){s.sc[0]++;g.add(100,W/2,T+60);g.float('ゴール！',W/2,H/2,'#ffe28a',56);g.sfx('win');g.burst(W/2,T,'#ffe28a',40,400,5,0);s.wait=1;s.serve=-1}else if(!inGoal){p.y=T+p.r;p.vy=Math.abs(p.vy)}}
 if(p.y>B-p.r){if(inGoal&&p.y>B+p.r){s.sc[1]++;g.add(-50,W/2,B-60);g.sfx('lose');g.shake(12);s.wait=1;s.serve=1}else if(!inGoal){p.y=B-p.r;p.vy=-Math.abs(p.vy)}}
 s.trail.push({x:p.x,y:p.y});if(s.trail.length>12)s.trail.shift()},
draw(s,g,c){const{W,H}=g,T=100,B=H-40,L=40,R=W-40,GW=110;g.bg('#06101f','#0b1d3a');
 const gr=c.createRadialGradient(W/2,H/2,40,W/2,H/2,600);gr.addColorStop(0,'rgba(91,140,255,.22)');gr.addColorStop(1,'rgba(91,140,255,0)');c.fillStyle=gr;c.fillRect(L,T,R-L,B-T);
 c.globalCompositeOperation='lighter';g.glow('#5b8cff',18);c.strokeStyle='#5b8cff';c.lineWidth=5;g.rr(L,T,R-L,B-T,30);c.stroke();
 c.strokeStyle='rgba(255,122,182,.7)';c.lineWidth=3;c.beginPath();c.moveTo(L,H/2);c.lineTo(R,H/2);c.stroke();c.beginPath();c.arc(W/2,H/2,90,0,TAU);c.stroke();
 g.glow('#ffc857',24);c.strokeStyle='#ffc857';c.lineWidth=10;c.beginPath();c.moveTo(W/2-GW,T);c.lineTo(W/2+GW,T);c.moveTo(W/2-GW,B);c.lineTo(W/2+GW,B);c.stroke();
 c.strokeStyle='rgba(255,200,87,.4)';c.lineWidth=3;c.beginPath();c.arc(W/2,T,140,0,Math.PI);c.stroke();c.beginPath();c.arc(W/2,B,140,Math.PI,TAU);c.stroke();g.noglow();
 s.trail.forEach((t,i)=>g.circle(t.x,t.y,s.p.r*(i/s.trail.length),'rgba(159,232,255,'+(i/s.trail.length*.25)+')'));c.globalCompositeOperation='source-over';
 const mal=(m,col)=>{c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.arc(m.x+4,m.y+8,m.r,0,TAU);c.fill();g.glow(col,26);const gr2=c.createRadialGradient(m.x-12,m.y-12,4,m.x,m.y,m.r);gr2.addColorStop(0,g.shade(col,.5));gr2.addColorStop(1,g.shade(col,-.3));g.circle(m.x,m.y,m.r,gr2);g.noglow();g.circle(m.x,m.y,m.r*.45,g.shade(col,-.2));g.circle(m.x-5,m.y-5,m.r*.18,'rgba(255,255,255,.6)')};
 mal(s.ai,'#a98bff');mal(s.me,'#ff6f59');
 if(s.wait<=0){g.glow('#ffc857',16);g.circle(s.p.x,s.p.y,s.p.r,'#1a1a24');g.noglow();c.strokeStyle='#ffc857';c.lineWidth=4;c.beginPath();c.arc(s.p.x,s.p.y,s.p.r-4,0,TAU);c.stroke()}
 g.txt('CPU '+s.sc[1],W/2,H/2-40,26,'rgba(169,139,255,.8)');g.txt('あなた '+s.sc[0],W/2,H/2+42,26,'rgba(255,111,89,.9)')}});

// 20. バランス
reg({id:'balance',name:'ピエロのお皿まわし',genre:'バランス',color:'#ff6f59',time:30,goal:420,endMsg:'お見事！ 最後まで支えた',
howto:'台車を左右に動かして\n長い棒が倒れないように支えよう',
init(g){return{cx:g.W/2,tx:g.W/2,v:0,th:g.rnd(-.06,.06),w:0,wind:0,wt:2,spin:0}},
update(s,g,dt){const{W,I}=g,L=300;if(I.down)s.tx=I.x;if(I.keys.ArrowLeft)s.tx-=650*dt;if(I.keys.ArrowRight)s.tx+=650*dt;s.tx=g.clamp(s.tx,80,W-80);
 const nv=g.clamp((s.tx-s.cx)*9,-1500,1500),a=g.clamp((nv-s.v)/Math.max(dt,.001),-7000,7000);s.v=nv;s.cx+=s.v*dt;if(s.cx<80||s.cx>W-80){s.cx=g.clamp(s.cx,80,W-80);s.v=0}
 s.wt-=dt;if(s.wt<=0){s.wt=g.rnd(1.5,3.5);s.wind=g.rnd(-1,1)*(1+g.time/25)}
 const acc=(980*Math.sin(s.th)-a*Math.cos(s.th))/L+s.wind;s.w+=acc*dt;s.w*=1-dt*.3;s.th+=s.w*dt;s.spin+=dt*12;
 g.score+=10*dt*(Math.abs(s.th)<.15?2:1);
 if(Math.abs(s.th)>1.25){g.sfx('boom');g.shake(16);g.over('ポールが倒れた！')}},
draw(s,g,c){const{W,H}=g,L=300,py=H-230,tx=s.cx+Math.sin(s.th)*L,ty=py-Math.cos(s.th)*L;g.bg('#2b0d1f','#120610');
 for(const side of[0,1]){for(let i=0;i<6;i++){const x=side?W-30-i*26:i*26,gr=c.createLinearGradient(x,0,x+26,0);gr.addColorStop(0,'#5a0f1f');gr.addColorStop(.5,'#b3243a');gr.addColorStop(1,'#5a0f1f');c.fillStyle=gr;c.fillRect(x,80,30,H)}}
 c.globalCompositeOperation='lighter';const sg=c.createLinearGradient(0,80,0,H-160);sg.addColorStop(0,'rgba(255,240,200,.25)');sg.addColorStop(1,'rgba(255,240,200,.04)');c.fillStyle=sg;c.beginPath();c.moveTo(W/2-40,80);c.lineTo(W/2+40,80);c.lineTo(s.cx+200,H-150);c.lineTo(s.cx-200,H-150);c.fill();c.globalCompositeOperation='source-over';
 c.fillStyle='#4a2a14';c.fillRect(0,H-160,W,160);c.fillStyle='#6b4026';c.fillRect(0,H-160,W,14);c.fillStyle='rgba(255,240,200,.15)';c.beginPath();c.ellipse(s.cx,H-150,170,22,0,0,TAU);c.fill();
 if(Math.abs(s.wind)>.3){c.globalAlpha=.6;g.txt(s.wind>0?'風 →':'← 風',W/2,140,30,'#9fe8ff');c.globalAlpha=1}
 const dang=Math.min(1,Math.abs(s.th)/1.25);c.lineWidth=10;c.strokeStyle='rgba(255,255,255,.12)';c.beginPath();c.arc(W/2,250,60,Math.PI*1.1,Math.PI*1.9);c.stroke();c.strokeStyle=g.mix('#9be15d','#ff6f59',dang);c.beginPath();c.arc(W/2,250,60,Math.PI*1.5-.0001,Math.PI*1.5+s.th*.32,s.th<0);c.stroke();
 c.lineCap='round';c.lineWidth=12;c.strokeStyle='#fff3df';c.beginPath();c.moveTo(s.cx,py);c.lineTo(tx,ty);c.stroke();c.strokeStyle='#ff6f59';c.setLineDash([22,22]);c.beginPath();c.moveTo(s.cx,py);c.lineTo(tx,ty);c.stroke();c.setLineDash([]);
 c.save();c.translate(tx,ty);c.rotate(s.th);g.glow('#ffc857',20);c.fillStyle='#ffc857';c.beginPath();c.ellipse(0,-6,60*Math.abs(Math.cos(s.spin))+18,10,0,0,TAU);c.fill();g.noglow();c.fillStyle='#fff3df';c.beginPath();c.ellipse(0,-8,30*Math.abs(Math.cos(s.spin))+8,4,0,0,TAU);c.fill();c.restore();
 g.rrf(s.cx-70,py,140,46,14,'#5b8cff');g.rrf(s.cx-70,py,140,12,6,'#8fb0ff');
 for(const wx of[-44,44]){const x=s.cx+wx,y=py+58;g.circle(x,y,22,'#1d1730');c.strokeStyle='#ffc857';c.lineWidth=3;for(let k=0;k<3;k++){const a=s.cx/22+k*2.09;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*18,y+Math.sin(a)*18);c.stroke()}}}});

// 21. ブロック崩し
function bricksFor(g,lv){const out=[],rows=Math.min(8,5+lv),cols=9,bw=70,bh=28,gap=6,ox=(g.W-(cols*bw+(cols-1)*gap))/2,cols2=['#ff6f59','#ffc857','#9be15d','#2ec4b6','#5b8cff','#a98bff','#ff7ab6','#ff9f43'];
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){if(lv%2&&(r+c)%5===0)continue;out.push({x:ox+c*(bw+gap),y:150+r*(bh+gap),w:bw,h:bh,hp:r<lv?2:1,col:cols2[r%8]})}return out}
reg({id:'breakout',name:'ブロックくずし',genre:'ブロック崩し',color:'#2ec4b6',time:50,goal:450,
howto:'ドラッグかマウスでバーを動かし\nボールを跳ね返してブロックを壊そう',
init(g){return{px:g.W/2,lv:0,br:bricksFor(g,0),b:{x:g.W/2,y:0,vx:0,vy:0,stuck:true},hold:.7,trail:[]}},
update(s,g,dt){const{W,H,I}=g,PW=130,PY=H-90,b=s.b,R=11;
 if(I.down||I.x!==I.px)s.px=I.x;if(I.keys.ArrowLeft)s.px-=700*dt;if(I.keys.ArrowRight)s.px+=700*dt;s.px=g.clamp(s.px,PW/2,W-PW/2);
 if(b.stuck){b.x=s.px;b.y=PY-R-2;s.hold-=dt;if(s.hold<=0||I.pressed||I.kp[' ']){b.stuck=false;const a=-Math.PI/2+g.rnd(-.4,.4),sp=520+s.lv*40;b.vx=Math.cos(a)*sp;b.vy=Math.sin(a)*sp}return}
 for(let k=0;k<3;k++){b.x+=b.vx*dt/3;b.y+=b.vy*dt/3;
  if(b.x<R){b.x=R;b.vx=Math.abs(b.vx)}if(b.x>W-R){b.x=W-R;b.vx=-Math.abs(b.vx)}if(b.y<90+R){b.y=90+R;b.vy=Math.abs(b.vy)}
  if(b.vy>0&&b.y+R>=PY&&b.y<PY+16&&Math.abs(b.x-s.px)<PW/2+R){const h=(b.x-s.px)/(PW/2),sp=Math.hypot(b.vx,b.vy);b.vx=sp*Math.sin(h*1.05);b.vy=-Math.abs(sp*Math.cos(h*1.05));b.y=PY-R;g.tone(440,.05,'square',.1)}
  for(const br of s.br){if(br.dead)continue;const cx=g.clamp(b.x,br.x,br.x+br.w),cy=g.clamp(b.y,br.y,br.y+br.h),dx=b.x-cx,dy=b.y-cy;if(dx*dx+dy*dy<=R*R){if(Math.abs(dx)>Math.abs(dy))b.vx*=-1;else b.vy*=-1;br.hp--;
   if(br.hp<=0){br.dead=1;g.add(10,br.x+br.w/2,br.y);g.burst(br.x+br.w/2,br.y+br.h/2,br.col,14,260,4);g.tone(600+Math.random()*300,.06,'triangle',.15)}else g.tone(300,.05,'square',.1);
   const sp=Math.hypot(b.vx,b.vy);if(sp<900){b.vx*=1.012;b.vy*=1.012}break}}}
 s.trail.push({x:b.x,y:b.y});if(s.trail.length>10)s.trail.shift();
 if(b.y>H+20){g.add(-30,s.px,PY-40);g.sfx('bad');g.shake(8);b.stuck=true;s.hold=.8}
 if(s.br.every(x=>x.dead)){g.add(100,W/2,H/2);g.float('ステージクリア！',W/2,H/2-60,'#ffffff',44);g.sfx('win');s.lv++;s.br=bricksFor(g,s.lv);b.stuck=true;s.hold=1}},
draw(s,g,c){const{W,H}=g,PY=H-90,PW=130;g.bg('#14213d','#0a1226');
 c.strokeStyle='rgba(46,196,182,.07)';c.lineWidth=1.5;for(let y=100;y<H+30;y+=26)for(let x=(y/26%2)*22;x<W+44;x+=44)for(let k=1;k<=3;k++){c.beginPath();c.arc(x,y,k*7,Math.PI,0);c.stroke()}
 for(const br of s.br){if(br.dead)continue;const gr=c.createLinearGradient(0,br.y,0,br.y+br.h);gr.addColorStop(0,g.shade(br.col,.35));gr.addColorStop(1,g.shade(br.col,-.2));g.rrf(br.x,br.y,br.w,br.h,6,gr);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(br.x+5,br.y+4,br.w-10,4);if(br.hp>1){c.strokeStyle='rgba(10,18,38,.8)';c.lineWidth=3;g.rr(br.x+5,br.y+5,br.w-10,br.h-10,4);c.stroke()}}
 c.globalCompositeOperation='lighter';s.trail.forEach((t,i)=>g.circle(t.x,t.y,11*i/s.trail.length,'rgba(255,200,87,'+(i/s.trail.length*.3)+')'));c.globalCompositeOperation='source-over';
 g.glow('#ffc857',20);g.circle(s.b.x,s.b.y,11,'#fff3df');g.noglow();
 g.glow('#2ec4b6',20);const gr=c.createLinearGradient(0,PY,0,PY+16);gr.addColorStop(0,'#7ff0e5');gr.addColorStop(1,'#1a9e93');g.rrf(s.px-PW/2,PY,PW,16,8,gr);g.noglow();
 g.txt('ステージ '+(s.lv+1),W/2,112,18,'rgba(255,255,255,.5)')}});

// 22. 数字合体 (2048)
const N4=4,TS=126,TG=14;
function t48spawn(s,g){const free=[];for(let r=0;r<N4;r++)for(let c=0;c<N4;c++)if(!s.grid[r][c])free.push({r,c});if(!free.length)return;const p=g.pick(free),t={id:s.nid++,v:Math.random()<.9?2:4,r:p.r,c:p.c,x:p.c,y:p.r,sc:0,pop:0};s.grid[p.r][p.c]=t;s.tiles.push(t)}
function t48new(s,g){s.grid=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]].map(r=>r.map(()=>null));s.tiles=[];t48spawn(s,g);t48spawn(s,g)}
function t48canMove(s){for(let r=0;r<N4;r++)for(let c=0;c<N4;c++){const t=s.grid[r][c];if(!t)return true;if(c<N4-1&&s.grid[r][c+1]&&s.grid[r][c+1].v===t.v)return true;if(r<N4-1&&s.grid[r+1][c]&&s.grid[r+1][c].v===t.v)return true}return false}
reg({id:'merge',name:'がったい2048',genre:'数字合体',color:'#ff9f43',time:60,goal:700,
howto:'スワイプか矢印キーで全タイルを動かす\n同じ数字がぶつかると合体',
init(g){const s={nid:1,best:2};t48new(s,g);return s},
update(s,g,dt){const{I}=g;for(const t of s.tiles){t.x+=(t.c-t.x)*Math.min(1,dt*20);t.y+=(t.r-t.y)*Math.min(1,dt*20);t.sc=Math.min(1,t.sc+dt*6);t.pop=Math.max(0,t.pop-dt*5)}
 s.tiles=s.tiles.filter(t=>!t.dead||Math.abs(t.x-t.c)+Math.abs(t.y-t.r)>.05);
 let dir=-1;const k=I.kp;if(k.ArrowLeft||k.a)dir=0;if(k.ArrowRight||k.d)dir=1;if(k.ArrowUp||k.w)dir=2;if(k.ArrowDown||k.s)dir=3;
 if(I.swipe){const{dx,dy}=I.swipe;dir=Math.abs(dx)>Math.abs(dy)?(dx<0?0:1):(dy<0?2:3)}
 if(dir<0)return;const vec=[[0,-1],[0,1],[-1,0],[1,0]][dir],ord=[0,1,2,3],rev=[3,2,1,0];let moved=false,gain=0;
 for(const t of s.tiles)t.merged=false;
 const rs=dir===3?rev:ord,cs=dir===1?rev:ord;
 for(const r of rs)for(const c of cs){const t=s.grid[r][c];if(!t)continue;let nr=r,nc=c,merged=false;
  while(true){const rr=nr+vec[0],cc=nc+vec[1];if(rr<0||rr>=N4||cc<0||cc>=N4)break;const o=s.grid[rr][cc];if(!o){nr=rr;nc=cc;continue}
   if(o.v===t.v&&!o.merged){o.v*=2;o.merged=true;o.pop=1;gain+=o.v;s.grid[r][c]=null;t.r=rr;t.c=cc;t.dead=true;merged=true;moved=true;if(o.v>s.best)s.best=o.v}break}
  if(!merged&&(nr!==r||nc!==c)){s.grid[r][c]=null;s.grid[nr][nc]=t;t.r=nr;t.c=nc;moved=true}}
 if(moved){t48spawn(s,g);if(gain){g.add(gain,g.W/2,230);g.tone(300+Math.log2(gain)*60,.08,'triangle',.18)}else g.tone(200,.04,'sine',.08);
  if(!t48canMove(s)){g.float('盤面リセット',g.W/2,g.H/2,'#ffffff',40);g.sfx('bad');t48new(s,g)}}},
draw(s,g,c){const{W}=g,size=N4*TS+(N4+1)*TG,ox=(W-size)/2,oy=280;g.bg('#0e2f3a','#071820');
 g.txt('最大',W/2-80,190,22,'rgba(255,255,255,.6)','right');g.txt(String(s.best),W/2-66,190,44,'#ffc857','left',g.FD,400);
 g.rrf(ox,oy,size,size,20,'#123f4c');for(let r=0;r<N4;r++)for(let cc=0;cc<N4;cc++)g.rrf(ox+TG+cc*(TS+TG),oy+TG+r*(TS+TG),TS,TS,14,'rgba(255,255,255,.06)');
 const sorted=s.tiles.slice().sort((a,b)=>(a.dead?0:1)-(b.dead?0:1));
 for(const t of sorted){const lg=Math.log2(t.v),h=(lg*31+10)%360,x=ox+TG+t.x*(TS+TG)+TS/2,y=oy+TG+t.y*(TS+TG)+TS/2,sc=g.ease(t.sc)*(1+t.pop*.12);c.save();c.translate(x,y);c.scale(sc,sc);
  if(lg>=7)g.glow('hsl('+h+',90%,60%)',26);const gr=c.createLinearGradient(0,-TS/2,0,TS/2);gr.addColorStop(0,'hsl('+h+',80%,68%)');gr.addColorStop(1,'hsl('+h+',70%,50%)');g.rrf(-TS/2,-TS/2,TS,TS,14,gr);g.noglow();
  g.rrf(-TS/2+8,-TS/2+6,TS-16,10,5,'rgba(255,255,255,.25)');g.fitTxt(String(t.v),0,3,TS-20,t.v<100?56:t.v<1000?46:36,lg<3?'#1b2a30':'#ffffff','"Dela Gothic One",sans-serif',400);c.restore()}}});

// 23. ジャンプアクション
function plat(g,y,h){const r=Math.random(),k=h<800?0:r<.6?0:r<.78?1:r<.9?2:3;return{x:g.rnd(20,g.W-140),y,w:120,k,dir:Math.random()<.5?1:-1,broken:false,vy:0,star:Math.random()<.18}}
reg({id:'jump',name:'そらのぼり',genre:'ジャンプアクション',color:'#5b8cff',time:45,goal:600,
howto:'左右に動かして足場をのりついで\nどこまでも高く登ろう',
init(g){const{W,H}=g,pl=[{x:W/2-60,y:H-120,w:120,k:0,dir:1,broken:false,vy:0,star:false}];let y=H-120;while(y>-200){y-=g.rnd(90,140);pl.push(plat(g,y,0))}
 return{x:W/2,y:H-160,vx:0,vy:-1000,cam:0,top:y,pl,best:0,bonus:0,face:1,sq:1,start:H-160}},
update(s,g,dt){const{W,H,I}=g;let tx=null;if(I.down)tx=I.x;if(I.keys.ArrowLeft)s.vx=-480;else if(I.keys.ArrowRight)s.vx=480;else if(tx!==null)s.vx=g.clamp((tx-s.x)*6,-560,560);else s.vx*=1-dt*6;
 if(s.vx)s.face=Math.sign(s.vx);s.x+=s.vx*dt;if(s.x<-20)s.x+=W+40;if(s.x>W+20)s.x-=W+40;
 const prevB=s.y;s.vy+=1800*dt;s.y+=s.vy*dt;s.sq+=(1-s.sq)*Math.min(1,dt*10);
 for(const p of s.pl){if(p.k===1){p.x+=p.dir*140*dt;if(p.x<10||p.x>W-p.w-10)p.dir*=-1}if(p.broken){p.vy+=1500*dt;p.y+=p.vy*dt;continue}
  if(s.vy>0&&prevB<=p.y&&s.y>=p.y&&s.x>p.x-14&&s.x<p.x+p.w+14){if(p.k===2){p.broken=true;g.tone(160,.12,'sawtooth',.12);g.burst(s.x,p.y,'#a0683c',10,200,4);continue}
   s.y=p.y;s.vy=p.k===3?-1600:-1050;s.sq=.7;g.sfx(p.k===3?'good':'jump');if(p.k===3)g.burst(s.x,p.y,'#9be15d',14,260,4)}
  if(p.star&&g.dist(s.x,s.y-30,p.x+p.w/2,p.y-40)<40){p.star=false;s.bonus+=20;g.add(0);g.float('+20',p.x+p.w/2,p.y-60-s.cam,'#ffe28a');g.sfx('coin');g.burst(p.x+p.w/2,p.y-40-s.cam,'#ffe28a',14,240,4)}}
 s.cam=Math.min(s.cam,s.y-H*.45);
 while(s.top>s.cam-200){s.top-=g.rnd(95,150)+Math.min(50,-s.cam/200);s.pl.push(plat(g,s.top,-s.cam))}
 s.pl=s.pl.filter(p=>p.y-s.cam<H+150);s.best=Math.max(s.best,s.start-s.y);g.score=Math.floor(s.best/10)+s.bonus;
 if(s.y-s.cam>H+60){g.sfx('lose');g.over('落っこちた！')}},
draw(s,g,c){const{W,H}=g,t=Math.min(1,s.best/9000),cam=s.cam;g.bg(g.mix('#7ec8ff','#0b0a2a',t),g.mix('#dff3ff','#2a1d5c',t));
 if(t>.25){c.globalAlpha=Math.min(1,(t-.25)*2);for(let i=0;i<60;i++)g.circle((i*131)%W,((i*211-cam*.05)%H+H)%H,1.5,'#ffffff');c.globalAlpha=1}
 c.globalAlpha=.75*(1-t);for(let i=0;i<6;i++){const y=((i*260-cam*.3)%(H+200)+H+200)%(H+200)-100,x=(i*173)%W;g.circle(x,y,40,'#ffffff');g.circle(x+40,y+8,30,'#ffffff');g.circle(x-38,y+10,26,'#ffffff')}c.globalAlpha=1;
 for(const p of s.pl){const y=p.y-cam;if(y<-40||y>H+40)continue;const col=['#6fd16a','#5b8cff','#a0683c','#ff7ab6'][p.k];c.fillStyle='rgba(0,0,0,.18)';g.rr(p.x+4,y+6,p.w,18,9);c.fill();const gr=c.createLinearGradient(0,y,0,y+18);gr.addColorStop(0,g.shade(col,.3));gr.addColorStop(1,g.shade(col,-.2));g.rrf(p.x,y,p.w,18,9,gr);
  if(p.k===2){c.strokeStyle='#4a2a14';c.lineWidth=2;c.beginPath();c.moveTo(p.x+40,y);c.lineTo(p.x+50,y+10);c.lineTo(p.x+44,y+18);c.moveTo(p.x+80,y);c.lineTo(p.x+72,y+12);c.stroke()}
  if(p.k===3){c.strokeStyle='#ffffff';c.lineWidth=3;c.beginPath();for(let i=0;i<4;i++){c.moveTo(p.x+p.w/2-14,y-4-i*5);c.lineTo(p.x+p.w/2+14,y-6-i*5)}c.stroke()}
  if(p.star){g.glow('#ffe28a',16);g.star(p.x+p.w/2,y-40+Math.sin(g.time*4+p.x)*4,16,7);c.fillStyle='#ffe28a';c.fill();g.noglow()}}
 const x=s.x,y=s.y-cam;c.save();c.translate(x,y);c.scale(s.face/s.sq,s.sq);
 g.glow('#ffc857',14);const gr=c.createRadialGradient(-8,-36,4,0,-28,30);gr.addColorStop(0,'#fff1c1');gr.addColorStop(1,'#ff9f43');c.fillStyle=gr;c.beginPath();c.ellipse(0,-28,28,28,0,0,TAU);c.fill();g.noglow();
 c.fillStyle='#ff9f43';c.beginPath();c.moveTo(-20,-48);c.lineTo(-14,-66);c.lineTo(-6,-52);c.fill();c.beginPath();c.moveTo(6,-52);c.lineTo(14,-66);c.lineTo(20,-48);c.fill();
 g.circle(8,-32,5,'#1b1220');g.circle(18,-32,5,'#1b1220');g.circle(9,-34,1.8,'#ffffff');g.circle(19,-34,1.8,'#ffffff');g.circle(14,-22,4,'#ff6f59');c.restore();
 g.txt(Math.floor(s.best/10)+'m',W-24,110,28,t>.5?'#ffffff':'#1b2a4a','right',g.FD,400)}});

// 24. 誘導
function flock(s,g){s.sheep=[];const n=4+s.wave;for(let i=0;i<n;i++)s.sheep.push({x:g.rnd(150,g.W-100),y:g.rnd(520,g.H-120),vx:0,vy:0,in:false,ph:g.rnd(TAU)})}
reg({id:'sheep',name:'ひつじ追い',genre:'誘導',color:'#9be15d',time:50,goal:330,
howto:'犬を動かしてひつじを追いこみ\n左上の柵の中に入れよう',
init(g){const s={wave:1,dog:{x:g.W/2,y:g.H-120},pen:{x:40,y:110,w:250,h:230,gx1:110,gx2:230},fl:Array.from({length:40},()=>({x:g.rnd(g.W),y:g.rnd(100,g.H),c:g.pick(['#ffffff','#ffe28a','#ff9ad5'])})),done:0};flock(s,g);return s},
update(s,g,dt){const{W,H,I}=g,d=s.dog,P=s.pen;
 if(I.down||I.x!==I.px){const dx=I.x-d.x,dy=I.y-d.y,l=Math.hypot(dx,dy),m=Math.min(l,720*dt);if(l>1){d.x+=dx/l*m;d.y+=dy/l*m}}
 const k=I.keys;if(k.ArrowLeft)d.x-=420*dt;if(k.ArrowRight)d.x+=420*dt;if(k.ArrowUp)d.y-=420*dt;if(k.ArrowDown)d.y+=420*dt;d.x=g.clamp(d.x,20,W-20);d.y=g.clamp(d.y,100,H-20);
 const out=s.sheep.filter(q=>!q.in);let cx=0,cy=0;for(const q of out){cx+=q.x;cy+=q.y}if(out.length){cx/=out.length;cy/=out.length}
 const walls=[[P.x,P.y,P.x+P.w,P.y],[P.x,P.y,P.x,P.y+P.h],[P.x+P.w,P.y,P.x+P.w,P.y+P.h],[P.x,P.y+P.h,P.gx1,P.y+P.h],[P.gx2,P.y+P.h,P.x+P.w,P.y+P.h]];
 for(const q of s.sheep){let ax=0,ay=0;
  if(!q.in){const dd=g.dist(q.x,q.y,d.x,d.y);if(dd<230&&dd>0){const f=(1-dd/230)*1300;ax+=(q.x-d.x)/dd*f;ay+=(q.y-d.y)/dd*f}ax+=(cx-q.x)*.6;ay+=(cy-q.y)*.6}
  for(const o of s.sheep){if(o===q)continue;const dd=g.dist(q.x,q.y,o.x,o.y);if(dd<44&&dd>0){ax+=(q.x-o.x)/dd*500;ay+=(q.y-o.y)/dd*500}}
  ax+=Math.cos(g.time+q.ph)*40;ay+=Math.sin(g.time*1.3+q.ph)*40;
  q.vx=(q.vx+ax*dt)*(1-dt*2.5);q.vy=(q.vy+ay*dt)*(1-dt*2.5);const sp=Math.hypot(q.vx,q.vy),mx=q.in?50:270;if(sp>mx){q.vx*=mx/sp;q.vy*=mx/sp}
  q.x+=q.vx*dt;q.y+=q.vy*dt;
  for(const w of walls){const cxp=g.clamp(q.x,Math.min(w[0],w[2]),Math.max(w[0],w[2])),cyp=g.clamp(q.y,Math.min(w[1],w[3]),Math.max(w[1],w[3])),dx=q.x-cxp,dy=q.y-cyp,dd=Math.hypot(dx,dy);if(dd<20&&dd>0){q.x=cxp+dx/dd*20;q.y=cyp+dy/dd*20}}
  q.x=g.clamp(q.x,24,W-24);q.y=g.clamp(q.y,104,H-24);
  if(!q.in&&q.x>P.x+18&&q.x<P.x+P.w-18&&q.y>P.y+18&&q.y<P.y+P.h-18){q.in=true;g.add(30,q.x,q.y-30);g.float('メェ〜',q.x,q.y-60,'#ffffff',22);g.sfx('coin')}}
 if(s.sheep.every(q=>q.in)){s.done+=dt;if(s.done>.8){g.add(50,W/2,H/2);g.float('全員集合！',W/2,H/2-50,'#ffffff',44);g.sfx('win');s.wave++;s.done=0;flock(s,g)}}},
draw(s,g,c){const{W,H}=g,P=s.pen,t=g.time;g.bg('#a6dc74','#5aa34a');
 for(const f of s.fl){g.circle(f.x,f.y,3,f.c);g.circle(f.x,f.y,1.3,'#ffc857')}c.fillStyle='rgba(40,90,30,.25)';for(let i=0;i<60;i++){const x=(i*113)%W,y=110+(i*197)%(H-110);c.beginPath();c.moveTo(x,y);c.lineTo(x+5,y-12);c.lineTo(x+10,y);c.fill()}
 c.fillStyle='rgba(232,200,120,.55)';c.fillRect(P.x,P.y,P.w,P.h);
 c.strokeStyle='#6b4a2a';c.lineWidth=7;const rails=[[P.x,P.y,P.x+P.w,P.y],[P.x,P.y,P.x,P.y+P.h],[P.x+P.w,P.y,P.x+P.w,P.y+P.h],[P.x,P.y+P.h,P.gx1,P.y+P.h],[P.gx2,P.y+P.h,P.x+P.w,P.y+P.h]];
 for(const[a,b,cc,d]of rails){for(const o of[-6,6]){c.beginPath();c.moveTo(a,b+o);c.lineTo(cc,d+o);c.stroke()}const len=Math.hypot(cc-a,d-b),n=Math.max(1,Math.round(len/50));for(let i=0;i<=n;i++)g.rrf(a+(cc-a)*i/n-6,b+(d-b)*i/n-14,12,28,3,'#8a6440')}
 c.globalAlpha=.4+.3*Math.sin(t*4);g.txt('↑ 入口',(P.gx1+P.gx2)/2,P.y+P.h+34,20,'#ffffff');c.globalAlpha=1;
 const sorted=s.sheep.slice().sort((a,b)=>a.y-b.y);
 for(const q of sorted){const bob=Math.abs(Math.sin(t*8+q.ph))*(Math.hypot(q.vx,q.vy)>40?4:1),x=q.x,y=q.y-bob,fx=q.vx>=0?1:-1;
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(q.x,q.y+16,22,7,0,0,TAU);c.fill();c.fillStyle='#2a2430';c.fillRect(x-12,y+6,5,12);c.fillRect(x+7,y+6,5,12);
  for(const[ox,oy,r]of[[-12,0,14],[0,-6,16],[12,0,14],[0,6,15],[-4,-2,14]])g.circle(x+ox,y+oy,r,'#ffffff');g.circle(x-4,y-8,8,'rgba(255,255,255,.9)');
  c.fillStyle='#2a2430';c.beginPath();c.ellipse(x+fx*20,y-4,9,11,0,0,TAU);c.fill();g.circle(x+fx*23,y-7,2,'#ffffff')}
 const d=s.dog;c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(d.x,d.y+20,24,7,0,0,TAU);c.fill();c.fillStyle='#8a5a3c';c.beginPath();c.ellipse(d.x,d.y,24,18,0,0,TAU);c.fill();
 g.circle(d.x,d.y-20,16,'#8a5a3c');g.circle(d.x,d.y-14,9,'#f3e2c8');c.fillStyle='#5a3a24';c.beginPath();c.ellipse(d.x-15,d.y-26,6,12,-.4,0,TAU);c.fill();c.beginPath();c.ellipse(d.x+15,d.y-26,6,12,.4,0,TAU);c.fill();
 g.circle(d.x-6,d.y-23,3,'#1b1220');g.circle(d.x+6,d.y-23,3,'#1b1220');g.circle(d.x,d.y-15,3.5,'#1b1220');c.fillStyle='#ff7ab6';c.beginPath();c.ellipse(d.x+3,d.y-8,3,5+Math.sin(t*10),0,0,TAU);c.fill();
 g.txt('柵の中 '+s.sheep.filter(q=>q.in).length+' / '+s.sheep.length,W-24,110,22,'#ffffff','right')}});

// 25. キャッチ
reg({id:'stars',name:'ながれ星キャッチ',genre:'キャッチ',color:'#a98bff',time:35,goal:380,
howto:'かごを左右に動かして星を受けとめる\n燃える隕石はよけよう',
init(g){return{bx:g.W/2,items:[],spawn:.3,combo:0,glow:0,bg:Array.from({length:80},()=>({x:g.rnd(g.W),y:g.rnd(g.H*.75),r:g.rnd(.6,1.8),p:g.rnd(TAU)}))}},
update(s,g,dt){const{W,H,I}=g,BY=H-150;if(I.down||I.x!==I.px)s.bx+=(I.x-s.bx)*Math.min(1,dt*12);if(I.keys.ArrowLeft)s.bx-=650*dt;if(I.keys.ArrowRight)s.bx+=650*dt;s.bx=g.clamp(s.bx,70,W-70);s.glow=Math.max(0,s.glow-dt*2);
 s.spawn-=dt;if(s.spawn<=0){s.spawn=g.rnd(.25,.55)*(1-Math.min(.45,g.time/60));const r=Math.random(),k=r<.68?0:r<.8?1:2;s.items.push({x:g.rnd(40,W-40),y:-30,vy:g.rnd(220,320)+g.time*8,vx:k===2?g.rnd(-60,60):0,k,rot:0})}
 for(const it of s.items){it.y+=it.vy*dt;it.x+=it.vx*dt;it.rot+=dt*(it.k===2?2:4);
  if(!it.done&&it.y>BY-20&&it.y<BY+20&&Math.abs(it.x-s.bx)<78){it.done=1;if(it.k===2){g.add(-20,it.x,BY-40);g.sfx('boom');g.shake(14);g.burst(it.x,BY,'#ff9f43',26,340,5);s.combo=0}
   else{s.combo++;const p=(it.k?30:10)+Math.min(20,s.combo);g.add(p,it.x,BY-50,it.k?'#ff9ad5':'#ffe28a');g.tone(700+Math.min(12,s.combo)*60,.08,'triangle',.18);g.burst(it.x,BY-10,it.k?'#ff9ad5':'#ffe28a',14,240,4);s.glow=1}}
  if(!it.done&&it.y>H+30){it.done=1;if(it.k!==2)s.combo=0}}
 s.items=s.items.filter(it=>!it.done)},
draw(s,g,c){const{W,H}=g,t=g.time,BY=H-150;g.bg('#050a1f','#1b2350');
 for(const b of s.bg)g.circle(b.x,b.y,b.r,'rgba(255,255,255,'+(.4+.6*Math.abs(Math.sin(t*1.5+b.p)))+')');
 c.globalCompositeOperation='lighter';for(let k=0;k<3;k++){const col=['#2ec4b6','#9be15d','#a98bff'][k];c.beginPath();for(let x=0;x<=W;x+=12){const y=220+k*50+Math.sin(x*.008+t*.6+k)*60+Math.sin(x*.02+t+k*2)*20;x?c.lineTo(x,y):c.moveTo(x,y)}for(let x=W;x>=0;x-=12){const y=220+k*50+Math.sin(x*.008+t*.6+k)*60+Math.sin(x*.02+t+k*2)*20+140;c.lineTo(x,y)}c.closePath();const gr=c.createLinearGradient(0,150,0,450);gr.addColorStop(0,g.rgba(col,0));gr.addColorStop(.5,g.rgba(col,.16));gr.addColorStop(1,g.rgba(col,0));c.fillStyle=gr;c.fill()}c.globalCompositeOperation='source-over';
 c.fillStyle='#0a1030';c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=20)c.lineTo(x,H-90-Math.sin(x*.01)*30-Math.sin(x*.03)*10);c.lineTo(W,H);c.fill();c.fillStyle='rgba(220,235,255,.6)';c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=20)c.lineTo(x,H-80-Math.sin(x*.01)*30-Math.sin(x*.03)*10);c.lineTo(W,H-70);c.lineTo(W,H);c.fill();
 for(const it of s.items){if(it.k===2){c.globalCompositeOperation='lighter';const gr=c.createLinearGradient(it.x,it.y-90,it.x,it.y);gr.addColorStop(0,'rgba(255,111,89,0)');gr.addColorStop(1,'rgba(255,159,67,.8)');c.fillStyle=gr;c.beginPath();c.moveTo(it.x-16,it.y);c.lineTo(it.x-it.vx*.3,it.y-100);c.lineTo(it.x+16,it.y);c.fill();c.globalCompositeOperation='source-over';
   const gr2=c.createRadialGradient(it.x-6,it.y-6,3,it.x,it.y,22);gr2.addColorStop(0,'#9a8a88');gr2.addColorStop(1,'#3a302e');g.circle(it.x,it.y,22,gr2);g.circle(it.x+6,it.y-4,5,'#2a2220');g.circle(it.x-8,it.y+6,4,'#2a2220')}
  else{const col=it.k?'#ff9ad5':'#ffe28a',r=it.k?26:18;c.globalCompositeOperation='lighter';c.strokeStyle=g.rgba(col,.35);c.lineWidth=r*.6;c.lineCap='round';c.beginPath();c.moveTo(it.x,it.y-r*2.5);c.lineTo(it.x,it.y);c.stroke();c.globalCompositeOperation='source-over';g.glow(col,24);g.star(it.x,it.y,r,r*.45,5,it.rot);c.fillStyle=col;c.fill();g.noglow();g.star(it.x,it.y,r*.45,r*.2,5,it.rot);c.fillStyle='#ffffff';c.fill()}}
 const x=s.bx;if(s.glow>0){c.globalCompositeOperation='lighter';g.circle(x,BY,90*s.glow+30,'rgba(255,226,138,'+(.2*s.glow)+')');c.globalCompositeOperation='source-over'}
 const gr=c.createLinearGradient(0,BY-10,0,BY+50);gr.addColorStop(0,'#c98a4a');gr.addColorStop(1,'#6b4022');c.fillStyle=gr;c.beginPath();c.moveTo(x-78,BY-10);c.lineTo(x+78,BY-10);c.lineTo(x+58,BY+50);c.lineTo(x-58,BY+50);c.closePath();c.fill();
 c.strokeStyle='rgba(60,30,10,.5)';c.lineWidth=2;for(let i=1;i<4;i++){c.beginPath();c.moveTo(x-78+i*5,BY-10+i*15);c.lineTo(x+78-i*5,BY-10+i*15);c.stroke()}g.rrf(x-84,BY-16,168,12,6,'#e0a96a');
 if(s.combo>2)g.txt(s.combo+' コンボ',x,BY+80,22,'#ffe28a')}});
})();
