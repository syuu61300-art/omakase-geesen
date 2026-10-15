// Pack 5 — games 51-63
(()=>{const reg=MG.reg;const TAU=Math.PI*2;

// 51. バッティング
reg({id:'batting',name:'ホームラン競争',genre:'バッティング',color:'#ff6f59',time:40,goal:330,
howto:'ボールが手元のベースに来た瞬間にタップ\nぴったりならホームラン',
init(){return{st:'wait',wt:1.2,t:0,dur:.8,curve:0,swing:0,res:'',rt:0,hit:null,hr:0}},
update(s,g,dt){const{I,W}=g;s.swing=Math.max(0,s.swing-dt*3.5);if(s.hit){s.hit.t+=dt;if(s.hit.t>1.6)s.hit=null}s.rt=Math.max(0,s.rt-dt);
 if(s.st==='wait'){s.wt-=dt;if(s.wt<=0){s.st='pitch';s.t=0;s.dur=g.rnd(.6,1.05)-Math.min(.2,g.time/160);s.curve=Math.random()<.4?g.rnd(-70,70):0;g.tone(220,.05,'square',.1)}}
 else{s.t+=dt;if(s.t/s.dur>1.18){s.res='ストライク';s.rt=1;s.st='wait';s.wt=1;g.tone(160,.15,'sawtooth',.1)}}
 if((I.pressed||I.kp[' '])&&s.swing<=0){s.swing=1;g.noise(.12,.15,0,3000);
  if(s.st==='pitch'){const d=s.t-s.dur,ad=Math.abs(d);let p=0;
   if(ad<.035){p=50;s.res='ホームラン！';s.hr++;g.sfx('win');g.noise(.6,.2,0,400);s.hit={t:0,ang:-Math.PI/2+d*6,hr:true};g.shake(8)}
   else if(ad<.08){p=20;s.res=d<0?'レフト前ヒット':'ライト前ヒット';g.sfx('good');s.hit={t:0,ang:-Math.PI/2+(d<0?-.55:.55),hr:false}}
   else if(ad<.13){p=3;s.res='ファウル';g.tone(300,.08,'square',.1);s.hit={t:0,ang:-Math.PI/2+(d<0?-1.35:1.35),hr:false}}
   else{s.res='からぶり';g.sfx('bad')}
   if(p)g.add(p,W/2,700);s.rt=1.1;s.st='wait';s.wt=1.3}}},
draw(s,g,c){const{W,H}=g,t=g.time;let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#081028');gr.addColorStop(.32,'#1b2a5a');gr.addColorStop(.33,'#1f7a3c');gr.addColorStop(1,'#185f2f');c.fillStyle=gr;c.fillRect(0,0,W,H);
 for(const x of[90,W-90]){g.glow('#fff8d0',40);c.fillStyle='#fff8d0';c.fillRect(x-30,100,60,20);g.noglow()}
 c.fillStyle='#10142a';c.beginPath();c.moveTo(0,320);c.lineTo(0,180);for(let x=0;x<=W;x+=30)c.lineTo(x,200+Math.sin(x*.05)*6);c.lineTo(W,320);c.fill();for(let i=0;i<160;i++){c.fillStyle=['#ff6f59','#ffc857','#ffffff','#5b8cff'][i%4];c.globalAlpha=.4;c.fillRect((i*47)%W,215+(i*13)%70,3,3)}c.globalAlpha=1;
 c.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<8;i++)c.fillRect(0,320+i*80,W,40);
 c.fillStyle='#b8834a';c.beginPath();c.moveTo(360,330);c.lineTo(640,600);c.lineTo(360,900);c.lineTo(80,600);c.closePath();c.fill();c.fillStyle='#1f7a3c';c.beginPath();c.moveTo(360,390);c.lineTo(560,600);c.lineTo(360,800);c.lineTo(160,600);c.closePath();c.fill();
 c.fillStyle='#c8955a';c.beginPath();c.ellipse(360,250,46,16,0,0,TAU);c.fill();
 const pk=s.st==='pitch'?Math.min(1,s.t/.2):0;g.rrf(348,190-pk*6,24,46,10,'#e8e8f0');g.circle(360,182,11,'#f3d0a8');c.strokeStyle='#e8e8f0';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(370,200);c.lineTo(386,190-pk*30);c.stroke();
 c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;c.strokeRect(310,700,100,110);c.fillStyle='#ffffff';c.beginPath();c.moveTo(330,830);c.lineTo(390,830);c.lineTo(390,845);c.lineTo(360,862);c.lineTo(330,845);c.fill();
 if(s.st==='pitch'){const k=Math.min(1.18,s.t/s.dur),y=240+k*(830-240),x=360+s.curve*Math.sin(Math.min(1,k)*Math.PI),r=5+k*15;c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x,y+r+6,r,r*.3,0,0,TAU);c.fill();g.circle(x,y,r,'#f4f4f4');c.strokeStyle='#e63946';c.lineWidth=1.5;c.beginPath();c.arc(x-r*.6,y,r*.7,-.8,.8);c.stroke();c.beginPath();c.arc(x+r*.6,y,r*.7,Math.PI-.8,Math.PI+.8);c.stroke()}
 if(s.hit){const k=s.hit.t,sp=s.hit.hr?1100:700,x=360+Math.cos(s.hit.ang)*sp*k,y=830+Math.sin(s.hit.ang)*sp*k-(s.hit.hr?0:Math.sin(Math.min(1,k)*Math.PI)*120),r=Math.max(2,18-k*14);g.glow('#ffffff',14);g.circle(x,y,r,'#ffffff');g.noglow();if(s.hit.hr&&k>.7&&k<1.5){for(let i=0;i<10;i++){const a=i*TAU/10;g.circle(x+Math.cos(a)*(k-.7)*160,y+Math.sin(a)*(k-.7)*160,4,['#ffc857','#ff7ab6','#9fe8ff'][i%3])}}}
 const ang=g.lerp(.9,-2.6,s.swing>0?g.ease(1-s.swing):0);c.save();c.translate(250,840);c.rotate(s.swing>0?ang:-2.2+Math.sin(t*2)*.05);c.lineCap='round';c.strokeStyle='#c98a4a';c.lineWidth=14;c.beginPath();c.moveTo(0,0);c.lineTo(150,0);c.stroke();c.strokeStyle='#e0a96a';c.lineWidth=20;c.beginPath();c.moveTo(90,0);c.lineTo(150,0);c.stroke();c.restore();
 if(s.rt>0)g.txt(s.res,W/2,520,s.res==='ホームラン！'?64:44,s.res==='ホームラン！'?'#ffe28a':'#ffffff','center',g.FD,400);g.txt('ホームラン '+s.hr+'本',W/2,920,22,'rgba(255,255,255,.8)')}});

// 52. すいかわり
function sNew(s,g){s.px=360;s.py=820;s.wx=g.rnd(120,600);s.wy=g.rnd(260,620);s.st='walk';s.hint=[];s.ht=0}
function hintOf(s,g){const dx=s.wx-s.px,dy=s.wy-s.py,d=Math.hypot(dx,dy);if(d<40)return'そこだ！ わって！';const pre=d>260?'もっと':d<110?'ちょっと':'';if(Math.abs(dx)>Math.abs(dy))return pre+(dx<0?'左！':'右！');return pre+(dy<0?'前！':'うしろ！')}
reg({id:'suika',name:'すいかわり',genre:'すいかわり',color:'#9be15d',time:45,goal:300,
howto:'目かくし中！ 押した方向へ少しずつ歩く\n友だちの声をたよりに「わる！」をタップ',
init(g){const s={rt:0,res:''};sNew(s,g);return s},
update(s,g,dt){const{W,H,I}=g;if(s.st==='reveal'){s.rt-=dt;if(s.rt<=0)sNew(s,g);return}
 let mx=0,my=0;if(I.down&&I.y<850){const dx=I.x-W/2,dy=I.y-H/2,l=Math.hypot(dx,dy);if(l>20){mx=dx/l;my=dy/l}}const k=I.keys;if(k.ArrowLeft)mx=-1;if(k.ArrowRight)mx=1;if(k.ArrowUp)my=-1;if(k.ArrowDown)my=1;
 s.px=g.clamp(s.px+mx*150*dt,60,W-60);s.py=g.clamp(s.py+my*150*dt,200,880);
 s.ht-=dt;if(s.ht<=0){s.ht=.9;s.hint.unshift({t:hintOf(s,g),x:g.pick([90,630,140,580]),y:g.rnd(160,760),a:1});if(s.hint.length>3)s.hint.pop();g.tone(600+Math.random()*300,.05,'triangle',.08)}for(const h of s.hint)h.a-=dt*.5;
 if((I.pressed&&I.y>860)||I.kp[' ']||I.kp.Enter){const d=g.dist(s.px,s.py,s.wx,s.wy);let p=0;if(d<38){p=100;s.res='まっぷたつ！'}else if(d<75){p=50;s.res='ヒビが入った！'}else if(d<120){p=15;s.res='かすった'}else s.res='すかっ…';
  if(p){g.add(p,s.wx,s.wy-60);g.sfx(p>=50?'win':'good');g.burst(s.wx,s.wy,'#ff4d5e',p/2,360,5)}else g.sfx('bad');g.shake(10);s.st='reveal';s.rt=1.8}},
draw(s,g,c){const{W,H}=g;
 if(s.st==='reveal'){let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#6fd0ff');gr.addColorStop(.18,'#bfeaff');gr.addColorStop(.19,'#2aa0d0');gr.addColorStop(.26,'#7fd6e8');gr.addColorStop(.27,'#f2dca8');gr.addColorStop(1,'#e2c080');c.fillStyle=gr;c.fillRect(0,0,W,H);
  const hit=s.res!=='すかっ…';c.save();c.translate(s.wx,s.wy);const R=48;if(hit&&s.res==='まっぷたつ！'){for(const sd of[-1,1]){c.save();c.translate(sd*18,0);c.rotate(sd*.3);c.fillStyle='#2f8f3c';c.beginPath();c.arc(0,0,R,sd<0?Math.PI/2:-Math.PI/2,sd<0?Math.PI*1.5:Math.PI/2);c.fill();c.fillStyle='#ff4d5e';c.beginPath();c.arc(0,0,R*.85,sd<0?Math.PI/2:-Math.PI/2,sd<0?Math.PI*1.5:Math.PI/2);c.fill();c.restore()}}
  else{g.circle(0,0,R,'#2f8f3c');c.strokeStyle='#1b5a24';c.lineWidth=5;for(let i=-2;i<=2;i++){c.beginPath();c.ellipse(i*14,0,5,R*.9,0,0,TAU);c.stroke()}if(hit){c.strokeStyle='#ff4d5e';c.lineWidth=3;c.beginPath();c.moveTo(-20,-30);c.lineTo(0,0);c.lineTo(-8,26);c.stroke()}}c.restore();
  c.strokeStyle='#8a5a2a';c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(s.px,s.py+40);c.lineTo(s.px+10,s.py-50);c.stroke();g.circle(s.px,s.py+60,26,'#ff6f59');g.txt(s.res,W/2,H*.45,52,'#1b1220','center',g.FD,400);return}
 g.bg('#1a1418','#0a0608');const t=g.time;c.globalAlpha=.25;for(let i=0;i<6;i++){c.strokeStyle='#5a3a4a';c.lineWidth=40;c.beginPath();c.moveTo(-40,140+i*30+Math.sin(t+i)*6);c.lineTo(W+40,150+i*30+Math.sin(t*1.3+i)*6);c.stroke()}c.globalAlpha=1;
 const vg=c.createRadialGradient(W/2,H/2,40,W/2,H/2,520);vg.addColorStop(0,'rgba(255,200,150,.1)');vg.addColorStop(1,'rgba(0,0,0,.6)');c.fillStyle=vg;c.fillRect(0,0,W,H);
 for(const h of s.hint){if(h.a<=0)continue;c.globalAlpha=Math.min(1,h.a);c.font='800 32px '+g.FB;const w=c.measureText(h.t).width||200;const x=g.clamp(h.x,w/2+30,W-w/2-30);g.rrf(x-w/2-20,h.y-30,w+40,60,30,'#fff3df');g.txt(h.t,x,h.y,32,'#1b1220');c.globalAlpha=1}
 g.circle(W/2,H/2,70,'rgba(255,255,255,.06)');c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=3;c.beginPath();c.arc(W/2,H/2,70,0,TAU);c.stroke();g.txt('押した方向へ歩く',W/2,H/2+100,18,'rgba(255,255,255,.4)');
 g.rrf(140,870,W-280,70,35,'#ff6f59');g.txt('わる！',W/2,906,34,'#ffffff','center',g.FD,400)}});

// 53. 連打
reg({id:'sumo',name:'つっぱり相撲',genre:'連打',color:'#ff9f43',time:30,goal:340,
howto:'とにかく連打して相手を押し出せ！\n土俵の外まで押せば勝ち',
init(){return{p:0,st:'fight',rt:0,wins:0,round:0,hitT:0,res:''}},
update(s,g,dt){const{I}=g;s.hitT=Math.max(0,s.hitT-dt*6);if(s.st==='res'){s.rt-=dt;if(s.rt<=0){s.st='fight';s.p=0;s.round++}return}
 const f=(1+s.round*.18+Math.sin(g.time*2.3)*.45)*.28;s.p-=f*dt;
 if(I.pressed||I.kp[' ']||I.kp.Enter){s.p+=.055;g.score+=1;s.hitT=1;g.tone(140+Math.random()*40,.05,'square',.12)}
 if(s.p>=1){s.wins++;g.add(100,360,300);s.res='押し出し！';s.st='res';s.rt=1.2;g.sfx('win');g.burst(360+160,560,'#ffe28a',30,340,5)}
 else if(s.p<=-1){s.res='押し出された…';s.st='res';s.rt=1.2;g.sfx('lose');g.shake(10)}},
draw(s,g,c){const{W,H}=g;g.bg('#3a1a10','#1a0a06');c.fillStyle='#5a2a14';c.fillRect(0,0,W,140);c.fillStyle='#8a1a2a';for(let i=0;i<4;i++){c.beginPath();c.moveTo(i*200-20,140);c.quadraticCurveTo(i*200+80,220,i*200+180,140);c.fill()}
 c.fillStyle='#c9a46a';c.beginPath();c.ellipse(W/2,640,330,120,0,0,TAU);c.fill();c.fillStyle='#e0c690';c.beginPath();c.ellipse(W/2,630,300,105,0,0,TAU);c.fill();c.strokeStyle='#8a6a3a';c.lineWidth=8;c.beginPath();c.ellipse(W/2,630,260,88,0,0,TAU);c.stroke();
 const off=s.p*150,bump=s.hitT*10,mx=W/2+off;
 const wr=(x,dir,col,mw)=>{c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x,660,80,18,0,0,TAU);c.fill();c.save();c.translate(x,520);c.scale(dir,1);const bg=c.createRadialGradient(-20,-30,10,0,0,100);bg.addColorStop(0,'#ffd8b0');bg.addColorStop(1,'#d9946a');c.fillStyle=bg;c.beginPath();c.ellipse(0,20,78,96,0,0,TAU);c.fill();g.rrf(-74,60,148,40,14,mw);g.circle(10,-92,34,'#f3c09a');c.fillStyle='#1b1220';c.beginPath();c.ellipse(-4,-124,26,12,0,0,TAU);c.fill();g.circle(-14,-128,10,'#1b1220');g.circle(24,-94,4,'#1b1220');
  c.strokeStyle='#d9946a';c.lineWidth=26;c.lineCap='round';c.beginPath();c.moveTo(40,-10);c.lineTo(100+(dir>0?bump:0),-30);c.stroke();g.circle(104+(dir>0?bump:0),-30,16,'#f3c09a');c.beginPath();c.moveTo(-40,90);c.lineTo(-50,140);c.moveTo(30,90);c.lineTo(40,140);c.stroke();c.restore()};
 wr(mx-110,1,'#3a5bd8','#3a5bd8');wr(mx+110,-1,'#e63946','#e63946');
 if(s.hitT>.5){g.txt('ドスコイ！',mx,330,40,'#ffffff','center',g.FD,400)}
 g.rrf(80,820,W-160,30,15,'rgba(0,0,0,.4)');const m=(s.p+1)/2;g.rrf(80,820,(W-160)*m,30,15,'#3a8dde');c.fillStyle='#ffffff';c.fillRect(W/2-2,812,4,46);
 if(s.st==='res')g.txt(s.res,W/2,250,56,s.res==='押し出し！'?'#ffe28a':'#ffffff','center',g.FD,400);g.txt('勝ち '+s.wins,W/2,900,24,'#ffe0b0')}});

// 54. 早撃ち
reg({id:'quickdraw',name:'荒野の早撃ち',genre:'早撃ち',color:'#ff9f43',time:35,goal:300,
howto:'「撃て！」が出た瞬間にタップ\n早すぎるとフライング',
init(g){return{st:'ready',wt:g.rnd(1.6,3.4),t:0,res:'',rt:0,cpu:g.rnd(.32,.48),wins:0,shot:0,flash:0}},
update(s,g,dt){const{I}=g;s.flash=Math.max(0,s.flash-dt*4);const tap=I.pressed||I.kp[' '];
 if(s.st==='res'){s.rt-=dt;if(s.rt<=0){s.st='ready';s.wt=g.rnd(1.4,3.6);s.cpu=g.rnd(.26,.42)}return}
 if(s.st==='ready'){s.wt-=dt;if(tap){s.res='フライング！';g.add(-20,360,400);g.sfx('bad');s.st='res';s.rt=1.2;return}if(s.wt<=0){s.st='draw';s.t=0;g.tone(1200,.12,'square',.15)}return}
 s.t+=dt;if(tap){s.flash=1;g.noise(.2,.4,0,800);if(s.t<s.cpu){const p=Math.round(Math.max(15,130-s.t*220));g.add(p,360,400);s.res=s.t.toFixed(3)+'秒！';s.wins++;s.shot=1;g.burst(600,560,'#ffe28a',20,300,4)}else{s.res='おそい…('+s.t.toFixed(2)+'秒)';s.shot=-1;g.sfx('bad')}s.st='res';s.rt=1.4;return}
 if(s.t>s.cpu+.08){s.res='撃たれた！';s.shot=-1;s.flash=1;g.noise(.2,.4,0,800);g.flash('#ff3b3b',.4);s.st='res';s.rt=1.4}},
draw(s,g,c){const{W,H}=g;let gr=c.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#3a1a4a');gr.addColorStop(.4,'#ff6f59');gr.addColorStop(.62,'#ffc857');gr.addColorStop(.63,'#c9944e');gr.addColorStop(1,'#7a4a22');c.fillStyle=gr;c.fillRect(0,0,W,H);
 g.glow('#ffe28a',50);g.circle(W/2,560,90,'#ffe7a8');g.noglow();c.fillStyle='#c9944e';c.fillRect(0,600,W,360);
 c.fillStyle='#2a1a10';for(const[x,h]of[[60,140],[650,110]]){c.fillRect(x-8,600-h,16,h);c.fillRect(x-30,600-h*.7,12,h*.3);c.fillRect(x-30,600-h*.7,30,10);c.fillRect(x+18,600-h*.55,12,h*.25);c.fillRect(x+8,600-h*.55,22,10)}
 const cow=(x,dir,down)=>{c.save();c.translate(x,700);c.scale(dir,1);if(down)c.rotate(-1.2*Math.min(1,down));c.fillStyle='#1a0f0a';c.fillRect(-20,-140,40,90);c.fillRect(-22,-50,16,60);c.fillRect(6,-50,16,60);g.circle(0,-160,20,'#1a0f0a');c.beginPath();c.ellipse(0,-170,46,8,0,0,TAU);c.fill();c.fillRect(-18,-200,36,30);
  const arm=s.st==='draw'||s.st==='res'?-.1:1.2;c.save();c.translate(16,-120);c.rotate(arm);c.fillRect(0,-6,60,12);c.fillRect(54,-12,26,10);c.restore();c.restore()};
 cow(170,1,s.shot<0?1:0);cow(550,-1,s.shot>0?1:0);
 if(s.flash>0){g.glow('#ffffff',40);g.circle(s.shot>0?250:470,580,30*s.flash,'#fff6c0');g.noglow()}
 if(s.st==='ready')g.txt('まて…',W/2,300,60,'rgba(255,255,255,.85)','center',g.FD,400);
 if(s.st==='draw'){g.glow('#ff3b3b',30);g.txt('撃て！',W/2,300,110,'#ffffff','center',g.FD,400);g.noglow()}
 if(s.st==='res')g.txt(s.res,W/2,300,50,'#ffffff','center',g.FD,400);g.txt('勝ち '+s.wins,W/2,900,24,'#ffffff')}});

// 55. 言葉パズル
const WORDS=[['さくらんぼ','くだもの'],['ひまわり','はな'],['かぶとむし','むし'],['おにぎり','たべもの'],['ゆきだるま','ふゆ'],['たんぽぽ','はな'],['ぺんぎん','どうぶつ'],['すいか','くだもの'],['はなび','なつ'],['にんじん','やさい'],['くじら','うみ'],['ひこうき','のりもの'],['たいよう','そら'],['かみなり','てんき'],['つみき','おもちゃ'],['ぶどう','くだもの'],['きりん','どうぶつ'],['ふうせん','おもちゃ'],['えんぴつ','ぶんぼうぐ'],['かたつむり','いきもの'],['とうもろこし','やさい'],['おまつり','なつ'],['あさがお','はな'],['こいのぼり','ぎょうじ'],['ゆうやけ','そら'],['たこやき','たべもの'],['ほたる','むし'],['ふじさん','やま'],['でんしゃ','のりもの'],['らくだ','どうぶつ']];
function wNew(s,g){const[w,cat]=g.pick(WORDS.filter(x=>x[0]!==s.word));s.word=w;s.cat=cat;let L;do{L=g.shuffle([...w])}while(L.join('')===w);s.tiles=L.map((ch,i)=>({ch,used:false,sh:0,i}));s.next=0;s.ans=[];s.wt=0}
function tilePos(s,i,W){const n=s.tiles.length,cols=Math.min(n,5),row=Math.floor(i/cols),inRow=Math.min(cols,n-row*cols),col=i%cols,sz=112;return[W/2+(col-(inRow-1)/2)*(sz+14),650+row*(sz+16)]}
reg({id:'anagram',name:'ことばならべ',genre:'言葉パズル',color:'#a98bff',time:50,goal:260,
howto:'バラバラの文字を正しい順にタップ\nヒントのジャンルから言葉を当てよう',
init(g){const s={done:0,n:0};wNew(s,g);return s},
update(s,g,dt){const{I,W}=g;s.wt+=dt;for(const t of s.tiles)t.sh=Math.max(0,t.sh-dt*3);if(s.done>0){s.done-=dt;if(s.done<=0)wNew(s,g);return}
 if(!I.pressed)return;for(const t of s.tiles){if(t.used)continue;const[x,y]=tilePos(s,t.i,W);if(Math.abs(I.x-x)<56&&Math.abs(I.y-y)<56){if(t.ch===s.word[s.next]){t.used=true;s.ans.push(t.ch);s.next++;g.tone(500+s.next*80,.07,'triangle',.18);
   if(s.next===s.word.length){s.n++;g.add(10+s.word.length*5,W/2,380);g.sfx('win');g.burst(W/2,400,'#c9a8ff',30,320,5);s.done=1}}else{t.sh=1;g.add(-2,x,y-60);g.sfx('bad')}break}}},
draw(s,g,c){const{W}=g;g.bg('#2a1a4a','#140a26');for(let i=0;i<30;i++)g.circle((i*131)%W,(i*197)%900+80,2,'rgba(201,168,255,.3)');
 g.rrf(W/2-120,130,240,56,28,'#a98bff');g.txt('ヒント：'+s.cat,W/2,158,24,'#1b1220');
 const n=s.word.length,sz=100;for(let i=0;i<n;i++){const x=W/2+(i-(n-1)/2)*(sz+10),y=380;g.rrf(x-sz/2,y-sz/2,sz,sz,18,i<s.ans.length?'#fff3df':'rgba(255,255,255,.08)');if(i<s.ans.length)g.txt(s.ans[i],x,y+4,56,'#2a1a4a','center',g.FD,400);else{c.strokeStyle='rgba(255,255,255,.25)';c.setLineDash([8,8]);c.lineWidth=3;g.rr(x-sz/2,y-sz/2,sz,sz,18);c.stroke();c.setLineDash([])}}
 const hint=s.wt>8;for(const t of s.tiles){if(t.used)continue;const[x0,y]=tilePos(s,t.i,W),x=x0+Math.sin(t.sh*30)*10*t.sh;c.fillStyle='rgba(0,0,0,.3)';g.rr(x-52,y-46,104,104,20);c.fill();const isNext=hint&&t.ch===s.word[s.next];if(isNext)g.glow('#ffe28a',24);const gr=c.createLinearGradient(0,y-56,0,y+56);gr.addColorStop(0,'#ffe28a');gr.addColorStop(1,'#ffb347');g.rrf(x-52,y-56,104,104,20,gr);g.noglow();g.txt(t.ch,x,y-2,58,'#3a1a10','center',g.FD,400)}
 g.txt('できた言葉 '+s.n,W/2,900,22,'rgba(255,255,255,.6)')}});

// 56. クイズ
const QZ=[['日本でいちばん高い山は？','富士山','北岳','槍ヶ岳','浅間山'],['うるう年でない1年は何日？','365日','360日','364日','366日'],['水がこおる温度は？（1気圧）','0℃','4℃','-10℃','10℃'],['太陽系でいちばん大きい惑星は？','木星','土星','地球','海王星'],['1ダースはいくつ？','12','10','6','24'],['三角形の内角の和は？','180度','360度','90度','270度'],['日本の首都は？','東京','大阪','京都','名古屋'],['光の三原色に入らないのは？','黄','赤','緑','青'],['タコの足は何本？','8本','6本','10本','12本'],['地球にいちばん近い恒星は？','太陽','月','北極星','シリウス'],['ひな祭りは何月何日？','3月3日','5月5日','7月7日','1月1日'],['1時間は何秒？','3600秒','600秒','1200秒','6000秒'],['植物が光で栄養をつくるはたらきは？','光合成','呼吸','蒸散','発酵'],['1kmは何m？','1000m','100m','10000m','10m'],['南極にくらす鳥は？','ペンギン','フラミンゴ','ダチョウ','クジャク'],['オリンピックの輪はいくつ？','5つ','4つ','6つ','7つ'],['将棋の盤は何マス四方？','9×9','8×8','10×10','19×19'],['日本の国鳥は？','キジ','ツル','スズメ','ハト'],['大人の骨の数はおよそ？','206本','106本','306本','50本'],['酸素の元素記号は？','O','S','C','N'],['円周率はおよそ？','3.14','2.71','1.41','3.41'],['日本でいちばん長い川は？','信濃川','利根川','石狩川','最上川'],['世界でいちばん広い海は？','太平洋','大西洋','インド洋','北極海'],['漢字「森」に「木」はいくつ？','3つ','2つ','4つ','5つ'],['1週間は何時間？','168時間','144時間','124時間','186時間'],['ドレミの「ミ」の次は？','ファ','ソ','レ','ラ'],['春の行事はどれ？','お花見','お月見','七夕','大みそか'],['クモの足は何本？','8本','6本','10本','4本'],['1年でいちばん昼が長い日は？','夏至','冬至','春分','秋分'],['虫めがねで使うレンズは？','凸レンズ','凹レンズ','平面鏡','プリズム']];
function qNew(s,g){const q=g.pick(QZ.filter(x=>x!==s.q0));s.q0=q;s.text=q[0];s.ans=q[1];s.ch=g.shuffle(q.slice(1));s.pick=-1;s.ft=0}
reg({id:'quiz',name:'ひらめきクイズ',genre:'雑学クイズ',color:'#5b8cff',time:45,goal:200,
howto:'4つの答えから正しいものをタップ\n（1〜4キーでも答えられる）',
init(g){const s={streak:0};qNew(s,g);return s},
update(s,g,dt){const{I,W}=g;if(s.ft>0){s.ft-=dt;if(s.ft<=0)qNew(s,g);return}let p=-1;
 if(I.pressed)for(let i=0;i<4;i++){const y=470+i*112;if(I.y>y&&I.y<y+96&&I.x>60&&I.x<W-60)p=i}for(let i=0;i<4;i++)if(I.kp[String(i+1)])p=i;
 if(p<0)return;s.pick=p;s.ft=.9;if(s.ch[p]===s.ans){s.streak++;g.add(20+Math.min(10,s.streak*2),W/2,420);g.sfx('good')}else{s.streak=0;g.add(-5,W/2,420);g.sfx('bad');g.shake(6)}},
draw(s,g,c){const{W}=g;g.bg('#0f1d3a','#08101f');c.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const gr=c.createRadialGradient(i*150,200+(i%2)*400,10,i*150,200+(i%2)*400,260);gr.addColorStop(0,'rgba(91,140,255,.12)');gr.addColorStop(1,'rgba(91,140,255,0)');c.fillStyle=gr;c.fillRect(0,0,W,960)}c.globalCompositeOperation='source-over';
 g.rrf(40,130,W-80,280,30,'#fff3df');g.rrf(W/2-40,110,80,44,22,'#5b8cff');g.txt('Q',W/2,133,26,'#ffffff','center',g.FD,400);
 const words=s.text;c.font='800 38px '+g.FB;if((c.measureText(words).width||0)>W-140){const h=Math.ceil(words.length/2);g.txt(words.slice(0,h),W/2,250,36,'#1b1220');g.txt(words.slice(h),W/2,300,36,'#1b1220')}else g.txt(words,W/2,270,38,'#1b1220');
 const cols=['#ff6f59','#ffc857','#2ec4b6','#a98bff'];for(let i=0;i<4;i++){const y=470+i*112;let col=cols[i];if(s.ft>0){if(s.ch[i]===s.ans)col='#9be15d';else if(i===s.pick)col='#555566'}g.rrf(64,y+6,W-128,96,24,g.shade(col,-.4));g.rrf(64,y,W-128,96,24,col);g.circle(112,y+48,26,'rgba(255,255,255,.35)');g.txt(String(i+1),112,y+50,26,'#1b1220','center',g.FD,400);g.fitTxt(s.ch[i],W/2+30,y+50,W-260,34,'#1b1220',g.FB,800)}
 if(s.ft>0)g.txt(s.ch[s.pick]===s.ans?'せいかい！':'ざんねん…',W/2,925,30,s.ch[s.pick]===s.ans?'#9be15d':'#ff6f59','center',g.FD,400)}});

// 57. タイム感覚
reg({id:'timestop',name:'ぴったりストップ',genre:'タイム感覚',color:'#2ec4b6',time:50,goal:230,
howto:'タップでスタート、目標の秒数でもう一度タップ\n途中から時計が見えなくなる',
init(g){return{st:'idle',target:g.pick([3,5,7]),t:0,res:'',rt:0,d:0}},
update(s,g,dt){const{I}=g;const tap=I.pressed||I.kp[' '];if(s.st==='res'){s.rt-=dt;if(s.rt<=0){s.st='idle';s.target=g.pick([3,4,5,6,7,8])}return}
 if(s.st==='idle'){if(tap){s.st='run';s.t=0;g.tone(800,.06,'square',.12)}return}
 s.t+=dt;if(tap||s.t>s.target+3){s.d=s.t-s.target;const p=tap?Math.max(0,Math.round(60-Math.abs(s.d)*130)):0;if(p)g.add(p,360,400,p>=50?'#ffe28a':'#ffffff');s.res=tap?(Math.abs(s.d)<.05?'ぴったり！':(s.d>0?'+':'')+s.d.toFixed(2)+'秒'):'おそすぎ…';g.sfx(p>=45?'win':p>0?'good':'bad');s.st='res';s.rt=1.6}},
draw(s,g,c){const{W}=g;g.bg('#0e2a2e','#071618');const cx=W/2,cy=470,R=220;
 c.fillStyle='#c8ccd8';g.rr(cx-30,cy-R-60,60,40,10);c.fill();g.circle(cx,cy,R+22,'#c8ccd8');g.circle(cx,cy,R+10,'#2a3040');g.circle(cx,cy,R,'#fff7ea');
 for(let i=0;i<60;i++){const a=i/60*TAU-Math.PI/2,l=i%5?10:22;c.strokeStyle='#2a3040';c.lineWidth=i%5?2:5;c.beginPath();c.moveTo(cx+Math.cos(a)*(R-8),cy+Math.sin(a)*(R-8));c.lineTo(cx+Math.cos(a)*(R-8-l),cy+Math.sin(a)*(R-8-l));c.stroke()}
 const ta=s.target/10*TAU-Math.PI/2;c.strokeStyle='#ff6f59';c.lineWidth=12;c.beginPath();c.arc(cx,cy,R-40,ta-.04,ta+.04);c.stroke();
 const hid=s.st==='run'&&s.t>1.5,a=(s.st==='idle'?0:s.st==='res'?s.target+s.d:s.t)/10*TAU-Math.PI/2;
 if(!hid){c.strokeStyle='#1b1220';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*(R-30),cy+Math.sin(a)*(R-30));c.stroke()}
 if(hid){const fg=c.createRadialGradient(cx,cy,10,cx,cy,R);fg.addColorStop(0,'rgba(46,196,182,.95)');fg.addColorStop(1,'rgba(20,90,90,.95)');g.circle(cx,cy,R,fg);g.txt('？',cx,cy,160,'#ffffff','center',g.FD,400)}
 g.circle(cx,cy,12,'#ff6f59');g.txt('目標 '+s.target+'秒',W/2,170,44,'#ffe28a','center',g.FD,400);
 if(s.st==='idle')g.txt('タップでスタート',W/2,800,34,'#ffffff');if(s.st==='run')g.txt('ここだと思ったらタップ！',W/2,800,30,'rgba(255,255,255,.8)');if(s.st==='res')g.txt(s.res,W/2,810,52,'#ffffff','center',g.FD,400)}});

// 58. ひと筆書き
function osGen(s,g){const n=s.n;for(let tr=0;tr<300;tr++){const vis=new Array(n*n).fill(false),path=[g.ri(0,n*n-1)];vis[path[0]]=true;
 const nb=i=>{const r=Math.floor(i/n),c=i%n,o=[];if(r>0)o.push(i-n);if(r<n-1)o.push(i+n);if(c>0)o.push(i-1);if(c<n-1)o.push(i+1);return o};
 while(true){const cur=path[path.length-1],opts=nb(cur).filter(j=>!vis[j]);if(!opts.length)break;opts.sort((a,b)=>nb(a).filter(j=>!vis[j]).length-nb(b).filter(j=>!vis[j]).length+(Math.random()-.5)*1.5);const nx=opts[0];vis[nx]=true;path.push(nx)}
 if(path.length>=n*n*.8){s.block=vis.map(v=>!v);s.start=path[0];s.total=path.length;s.path=[path[0]];return}}}
reg({id:'onestroke',name:'ひとふでロード',genre:'ひと筆書き',color:'#ffc857',time:60,goal:300,
howto:'光るマスから指をはなさずになぞって\n岩以外の全マスを1回ずつ通ろう',
init(g){const s={n:5,done:0,lv:0};osGen(s,g);return s},
update(s,g,dt){const{I,W}=g,n=s.n,cs=Math.min(110,600/n),ox=(W-cs*n)/2,oy=200;if(s.done>0){s.done-=dt;if(s.done<=0){s.lv++;s.n=Math.min(7,5+Math.floor(s.lv/2));osGen(s,g)}return}
 const cell=(x,y)=>{const c=Math.floor((x-ox)/cs),r=Math.floor((y-oy)/cs);return c>=0&&c<n&&r>=0&&r<n?r*n+c:-1};
 if(I.pressed){const k=cell(I.x,I.y),ix=s.path.indexOf(k);if(ix>=0)s.path.length=ix+1}
 if(I.down){const k=cell(I.x,I.y);if(k<0||s.block[k])return;const h=s.path[s.path.length-1];if(k===h)return;if(s.path.length>1&&k===s.path[s.path.length-2]){s.path.pop();return}
  const adj=(Math.abs(k-h)===n)||(Math.abs(k-h)===1&&Math.floor(k/n)===Math.floor(h/n));if(adj&&!s.path.includes(k)){s.path.push(k);g.tone(400+s.path.length*15,.04,'sine',.1);
   if(s.path.length===s.total){g.add(60+n*10,W/2,oy-30);g.float('ひと筆クリア！',W/2,g.H/2,'#ffe28a',46);g.sfx('win');s.done=1.1}}}},
draw(s,g,c){const{W}=g,n=s.n,cs=Math.min(110,600/n),ox=(W-cs*n)/2,oy=200;g.bg('#1a2a1a','#0c160c');
 for(let i=0;i<n*n;i++){const x=ox+(i%n)*cs,y=oy+Math.floor(i/n)*cs;if(s.block[i]){g.rrf(x+4,y+4,cs-8,cs-8,14,'#3a3a40');g.circle(x+cs*.45,y+cs*.45,cs*.28,'#5a5a64');g.circle(x+cs*.4,y+cs*.38,cs*.1,'#7a7a86')}else g.rrf(x+4,y+4,cs-8,cs-8,14,s.path.includes(i)?'#2a4a2a':'#e8e0c8')}
 const P=s.path.map(i=>[ox+(i%n+.5)*cs,oy+(Math.floor(i/n)+.5)*cs]);c.lineCap='round';c.lineJoin='round';
 for(let i=1;i<P.length;i++){c.strokeStyle='hsl('+(40+i*6)%360+',85%,60%)';c.lineWidth=cs*.32;c.beginPath();c.moveTo(P[i-1][0],P[i-1][1]);c.lineTo(P[i][0],P[i][1]);c.stroke()}
 const st=P[0];g.glow('#ffe28a',20);g.circle(st[0],st[1],cs*.22,'#ffe28a');g.noglow();const hd=P[P.length-1];g.circle(hd[0],hd[1],cs*.18,'#ffffff');
 g.txt('のこり '+(s.total-s.path.length)+'マス',W/2,150,26,'#ffe0b0')}});

// 59. カラーフラッド
const FC=['#ff6f59','#ffc857','#2ec4b6','#5b8cff','#a98bff','#9be15d'];
function flNew(s,g){s.n=10;s.k=5;s.grid=Array.from({length:100},()=>g.ri(0,s.k-1));s.moves=0;s.lim=19}
function flFill(s,col){const n=s.n,old=s.grid[0];if(old===col)return false;const st=[0],seen=new Set([0]);while(st.length){const i=st.pop();s.grid[i]=col;const r=Math.floor(i/n),c=i%n;for(const j of[r>0?i-n:-1,r<n-1?i+n:-1,c>0?i-1:-1,c<n-1?i+1:-1])if(j>=0&&!seen.has(j)&&s.grid[j]===old){seen.add(j);st.push(j)}}return true}
reg({id:'flood',name:'いろぬり大作戦',genre:'カラーフラッド',color:'#5b8cff',time:60,goal:280,
howto:'下の色ボタンで左上から色をぬり広げる\n決まった手数で全部を1色にしよう',
init(g){const s={done:0};flNew(s,g);return s},
update(s,g,dt){const{I,W}=g;if(s.done>0){s.done-=dt;if(s.done<=0)flNew(s,g);return}let p=-1;
 if(I.pressed&&I.y>800&&I.y<900)p=Math.floor((I.x-60)/((W-120)/s.k));if(I.pressed&&I.y>=150&&I.y<770){const cs=60,ox=(W-600)/2,c=Math.floor((I.x-ox)/cs),r=Math.floor((I.y-170)/cs);if(c>=0&&c<10&&r>=0&&r<10)p=s.grid[r*10+c]}
 for(let i=0;i<s.k;i++)if(I.kp[String(i+1)])p=i;if(p<0||p>=s.k)return;
 if(flFill(s,p)){s.moves++;g.tone(300+p*80,.06,'triangle',.15);if(s.grid.every(v=>v===s.grid[0])){g.add(100+(s.lim-s.moves)*10,W/2,400);g.float('ぬりきった！',W/2,470,'#ffffff',46);g.sfx('win');s.done=1.2}else if(s.moves>=s.lim){g.float('手数切れ…',W/2,470,'#ff6f59',44);g.sfx('lose');s.done=1.2}}},
draw(s,g,c){const{W}=g,cs=60,ox=(W-600)/2,oy=170;g.bg('#181a26','#0c0d14');g.rrf(ox-10,oy-10,620,620,18,'#2a2d40');
 for(let i=0;i<100;i++){const x=ox+(i%10)*cs,y=oy+Math.floor(i/10)*cs;c.fillStyle=FC[s.grid[i]];c.fillRect(x,y,cs+.5,cs+.5)}c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=3;c.strokeRect(ox+2,oy+2,cs-4,cs-4);
 g.txt('手数 '+s.moves+' / '+s.lim,W/2,126,28,s.lim-s.moves<4?'#ff6f59':'#ffffff','center',g.FD,400);
 const bw=(W-120)/s.k;for(let i=0;i<s.k;i++){const x=60+i*bw+8;g.rrf(x,808,bw-16,84,24,g.shade(FC[i],-.35));g.rrf(x,800,bw-16,84,24,FC[i]);g.rrf(x+12,808,bw-40,12,6,'rgba(255,255,255,.35)')}}});

// 60. 数独
function sdNew(s,g){let b=[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];const pm=g.shuffle([1,2,3,4]);b=b.map(r=>r.map(v=>pm[v-1]));if(Math.random()<.5)b=[b[1],b[0],b[2],b[3]];if(Math.random()<.5)b=[b[2],b[3],b[0],b[1]];if(Math.random()<.5)b=b.map(r=>[r[1],r[0],r[2],r[3]]);if(Math.random()<.5)b=b[0].map((_,i)=>b.map(r=>r[i]));
 s.sol=b;s.grid=b.map(r=>r.slice());s.fixed=b.map(r=>r.map(()=>true));let k=0,rm=Math.min(11,8+s.lv);while(k<rm){const r=g.ri(0,3),c=g.ri(0,3);if(s.grid[r][c]){s.grid[r][c]=0;s.fixed[r][c]=false;k++}}s.sel=null}
function sdBad(s,r,c){const v=s.grid[r][c];if(!v)return false;for(let i=0;i<4;i++){if(i!==c&&s.grid[r][i]===v)return true;if(i!==r&&s.grid[i][c]===v)return true}const br=r-r%2,bc=c-c%2;for(let i=br;i<br+2;i++)for(let j=bc;j<bc+2;j++)if((i!==r||j!==c)&&s.grid[i][j]===v)return true;return false}
reg({id:'sudoku',name:'ミニ数独',genre:'数独',color:'#a98bff',time:60,goal:250,
howto:'マスを選んで1〜4を入れる\nたて・よこ・2×2に同じ数字が入らないように',
init(g){const s={lv:0,done:0};sdNew(s,g);return s},
update(s,g,dt){const{I,W}=g,cs=140,ox=(W-cs*4)/2,oy=170;if(s.done>0){s.done-=dt;if(s.done<=0){s.lv++;sdNew(s,g)}return}
 if(I.pressed){const c=Math.floor((I.x-ox)/cs),r=Math.floor((I.y-oy)/cs);if(c>=0&&c<4&&r>=0&&r<4&&!s.fixed[r][c]){s.sel=[r,c];g.tone(700,.03,'sine',.08)}}
 let v=-1;if(I.pressed&&I.y>770&&I.y<880){v=Math.floor((I.x-40)/((W-80)/5))+1;if(v===5)v=0}for(let i=1;i<=4;i++)if(I.kp[String(i)])v=i;if(I.kp.Backspace||I.kp['0'])v=0;
 if(v>=0&&v<=4&&s.sel){const[r,c]=s.sel;s.grid[r][c]=v;g.tone(400+v*100,.05,'triangle',.12);
  if(s.grid.every(row=>row.every(x=>x))&&!s.grid.some((row,r2)=>row.some((_,c2)=>sdBad(s,r2,c2)))){g.add(100,W/2,140);g.float('完成！',W/2,480,'#ffe28a',56);g.sfx('win');s.done=1.2;s.sel=null}}},
draw(s,g,c){const{W}=g,cs=140,ox=(W-cs*4)/2,oy=170;g.bg('#f3efe6','#e2dccd');g.rrf(ox-14,oy-14,cs*4+28,cs*4+28,20,'#3a2a5a');
 for(let r=0;r<4;r++)for(let cc=0;cc<4;cc++){const x=ox+cc*cs,y=oy+r*cs,sel=s.sel&&s.sel[0]===r&&s.sel[1]===cc,bad=sdBad(s,r,cc);c.fillStyle=sel?'#ffe28a':((Math.floor(r/2)+Math.floor(cc/2))%2?'#fffaf0':'#f1e9ff');c.fillRect(x+2,y+2,cs-4,cs-4);
  const v=s.grid[r][cc];if(v)g.txt(String(v),x+cs/2,y+cs/2+4,72,bad?'#e63946':s.fixed[r][cc]?'#2a1a4a':'#5b8cff','center',g.FD,400)}
 c.strokeStyle='#3a2a5a';c.lineWidth=8;c.beginPath();c.moveTo(ox+cs*2,oy);c.lineTo(ox+cs*2,oy+cs*4);c.moveTo(ox,oy+cs*2);c.lineTo(ox+cs*4,oy+cs*2);c.stroke();
 const bw=(W-80)/5;for(let i=0;i<5;i++){const x=40+i*bw+8;g.rrf(x,778,bw-16,96,22,i<4?'#a98bff':'#c8c0d8');g.txt(i<4?String(i+1):'消す',x+(bw-16)/2,828,i<4?50:28,'#1b1220','center',i<4?g.FD:g.FB,i<4?400:800)}}});

// 61. ピクロス
function pcClues(line){const o=[];let k=0;for(const v of line){if(v)k++;else if(k){o.push(k);k=0}}if(k)o.push(k);return o.length?o:[0]}
function pcNew(s,g){const n=5;let sol;do{sol=Array.from({length:n*n},()=>Math.random()<.56?1:0)}while(sol.filter(v=>v).length<10);s.n=n;s.sol=sol;s.cur=new Array(n*n).fill(0);
 s.rc=[];s.cc=[];for(let r=0;r<n;r++)s.rc.push(pcClues(sol.slice(r*n,r*n+n)));for(let c=0;c<n;c++)s.cc.push(pcClues(sol.filter((_,i)=>i%n===c)));s.done=0}
reg({id:'picross',name:'お絵かきロジック',genre:'ピクロス',color:'#ff7ab6',time:60,goal:250,
howto:'数字は各列でぬる連続マスの数\nタップでぬって絵を完成させよう',
init(g){const s={};pcNew(s,g);return s},
update(s,g,dt){const{I,W}=g,n=s.n,cs=96,ox=W-40-cs*n,oy=330;if(s.done>0){s.done-=dt;if(s.done<=0)pcNew(s,g);return}
 if(I.pressed){s.paint=null;}
 if(I.down){const c=Math.floor((I.x-ox)/cs),r=Math.floor((I.y-oy)/cs);if(c>=0&&c<n&&r>=0&&r<n){const i=r*n+c;if(s.paint===null){s.paint=s.cur[i]?0:1}if(s.cur[i]!==s.paint){s.cur[i]=s.paint;g.tone(s.paint?600:350,.03,'sine',.08)}
  let ok=true;for(let rr=0;rr<n&&ok;rr++)if(pcClues(s.cur.slice(rr*n,rr*n+n)).join()!==s.rc[rr].join())ok=false;for(let cc=0;cc<n&&ok;cc++)if(pcClues(s.cur.filter((_,k)=>k%n===cc)).join()!==s.cc[cc].join())ok=false;
  if(ok){g.add(100,W/2,250);g.float('完成！',W/2,250,'#ff7ab6',50);g.sfx('win');s.done=1.4}}}},
draw(s,g,c){const{W}=g,n=s.n,cs=96,ox=W-40-cs*n,oy=330;g.bg('#fff4f8','#ffe0ec');
 for(let cc=0;cc<n;cc++){const cl=s.cc[cc],ok=pcClues(s.cur.filter((_,k)=>k%n===cc)).join()===cl.join();g.rrf(ox+cc*cs+6,110,cs-12,212,14,ok?'#ffd0e4':'#ffffff');cl.forEach((v,k)=>g.txt(String(v),ox+cc*cs+cs/2,300-(cl.length-1-k)*40,32,'#5a2a4a','center',g.FD,400))}
 for(let r=0;r<n;r++){const cl=s.rc[r],ok=pcClues(s.cur.slice(r*n,r*n+n)).join()===cl.join();g.rrf(30,oy+r*cs+6,ox-42,cs-12,14,ok?'#ffd0e4':'#ffffff');g.txt(cl.join('  '),ox-30,oy+r*cs+cs/2+2,32,'#5a2a4a','right',g.FD,400)}
 for(let i=0;i<n*n;i++){const x=ox+(i%n)*cs,y=oy+Math.floor(i/n)*cs;g.rrf(x+3,y+3,cs-6,cs-6,10,s.cur[i]?(s.done>0?'hsl('+(i*15)%360+',80%,60%)':'#5a2a4a'):'#ffffff')}
 c.strokeStyle='rgba(90,42,74,.25)';c.lineWidth=2;c.strokeRect(ox,oy,cs*n,cs*n)}});

// 62. メダルゲーム
const PX1=120,PX2=600,FY=840;
reg({id:'pusher',name:'コインプッシャー',genre:'メダルゲーム',color:'#ffc857',time:45,goal:220,
howto:'上の方をタップしてメダルを落とす\n押し出されて手前に落ちたら獲得',
init(g){const co=[];for(let i=0;i<46;i++)co.push({x:g.rnd(PX1+24,PX2-24),y:g.rnd(470,820),gold:Math.random()<.06});return{co,stock:20,py:340,t:0,drop:[]}},
update(s,g,dt){const{I}=g;s.t+=dt;const py=380+Math.sin(s.t*1.6)*70,dpy=py-s.py;s.py=py;
 if(I.pressed&&I.y<330&&I.x>PX1&&I.x<PX2){if(s.stock>0){s.stock--;s.drop.push({x:g.clamp(I.x,PX1+24,PX2-24),y:110,vy:0,gold:Math.random()<.05});g.tone(900,.04,'square',.08)}else g.float('メダルがない！',360,250,'#ff6f59',30)}
 for(const d of s.drop){d.vy+=1500*dt;d.y+=d.vy*dt;if(d.y>py+26){d.y=py+26;s.co.push({x:d.x,y:d.y,gold:d.gold});d.dead=1}}s.drop=s.drop.filter(d=>!d.dead);
 const R=22;for(const c0 of s.co){if(c0.y<py+R)c0.y+=Math.max(0,dpy)+ (py+R-c0.y)*.5}
 for(let it=0;it<3;it++)for(let i=0;i<s.co.length;i++)for(let j=i+1;j<s.co.length;j++){const a=s.co[i],b=s.co[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<R*2&&d>0){const o=(R*2-d)/2,nx=dx/d,ny=dy/d;const fa=a.y<b.y?.3:.7;a.x-=nx*o;b.x+=nx*o;a.y-=ny*o*(fa*2);b.y+=ny*o*((1-fa)*2)}}
 for(const c0 of s.co){c0.x=g.clamp(c0.x,PX1+R,PX2-R);if(c0.y<py+R)c0.y=py+R;if(c0.y>FY){c0.dead=1;const v=c0.gold?5:1;s.stock+=v;g.add(c0.gold?50:10,c0.x,FY-20,c0.gold?'#fff1a8':'#ffc857');g.tone(1200,.05,'square',.08);g.burst(c0.x,FY+10,'#ffe28a',6,180,3)}}
 s.co=s.co.filter(c0=>!c0.dead)},
draw(s,g,c){const{W,H}=g;g.bg('#2a0f3a','#12061c');g.rrf(80,90,W-160,H-110,30,'#5a2a6a');
 const fg=c.createLinearGradient(0,s.py,0,FY);fg.addColorStop(0,'#b8bcc8');fg.addColorStop(1,'#e8ecf5');c.fillStyle=fg;c.fillRect(PX1,s.py,PX2-PX1,FY-s.py);
 c.globalCompositeOperation='lighter';g.glow('#ffe28a',20);c.fillStyle='rgba(255,226,138,.6)';c.fillRect(PX1,FY,PX2-PX1,6);c.globalCompositeOperation='source-over';g.noglow();
 c.fillStyle='#3a1a4a';c.fillRect(PX1,FY+6,PX2-PX1,90);g.txt('GET',W/2,FY+50,40,'rgba(255,226,138,.7)','center',g.FD,400);
 const pg=c.createLinearGradient(0,s.py-250,0,s.py);pg.addColorStop(0,'#6a7088');pg.addColorStop(1,'#c8ccd8');c.fillStyle=pg;c.fillRect(PX1,s.py-260,PX2-PX1,260);c.fillStyle='rgba(255,255,255,.4)';c.fillRect(PX1,s.py-6,PX2-PX1,6);
 const coin=(x,y,gold)=>{c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.arc(x+2,y+4,22,0,TAU);c.fill();const cg=c.createRadialGradient(x-6,y-6,2,x,y,22);cg.addColorStop(0,gold?'#fff6c8':'#ffe9a8');cg.addColorStop(1,gold?'#e0a010':'#b8862a');g.circle(x,y,22,cg);c.strokeStyle=gold?'#fff1a8':'#d9a43a';c.lineWidth=3;c.beginPath();c.arc(x,y,15,0,TAU);c.stroke();if(gold){g.star(x,y,9,4);c.fillStyle='#ffffff';c.fill()}};
 for(const c0 of s.co)coin(c0.x,c0.y,c0.gold);for(const d of s.drop)coin(d.x,d.y,d.gold);
 c.fillStyle='rgba(255,255,255,.08)';c.fillRect(PX1,90,PX2-PX1,240);g.txt('ここをタップして投入',W/2,200,24,'rgba(255,255,255,.55)');
 g.rrf(W/2-110,96,220,48,24,'rgba(0,0,0,.45)');g.circle(W/2-70,120,14,'#ffc857');g.txt('× '+s.stock,W/2+10,121,26,'#ffe28a','center',g.FD,400)}});

// 63. パイプ
const PN=6,PM=7,DIRS=[[0,-1,1],[1,0,2],[0,1,4],[-1,0,8]];const OPP={1:4,2:8,4:1,8:2};
const rotBits=b=>((b<<1)|(b>>3))&15;
function ppNew(s,g){for(let tr=0;tr<200;tr++){const sr=g.ri(1,PM-2),grid=new Array(PN*PM).fill(0),vis=new Set();let c=0,r=sr,inD=8,ok=false;
  while(true){const k=r*PN+c;if(vis.has(k))break;vis.add(k);let opts=[];if(c===PN-1&&Math.random()<.6)opts=[2];else{for(const[dx,dy,b]of DIRS){if(b===inD)continue;const nc=c+dx,nr=r+dy;if(nc<0||nr<0||nr>=PM||(nc>=PN&&b!==2))continue;if(nc<PN&&vis.has(nr*PN+nc))continue;opts.push(b)}}
   if(!opts.length)break;const out=opts.includes(2)&&Math.random()<.3?2:g.pick(opts);grid[k]=inD|out;const d=DIRS.find(x=>x[2]===out);c+=d[0];r+=d[1];inD=OPP[out];if(c>=PN){ok=vis.size>=7;s.er=r;break}}
  if(!ok)continue;s.sr=sr;s.path=vis;for(let i=0;i<grid.length;i++)if(!grid[i])grid[i]=g.pick([5,10,3,6,12,9]);s.grid=grid.map(b=>{let x=b;for(let k=g.ri(0,3);k>0;k--)x=rotBits(x);return x});s.ang=s.grid.map(()=>0);if(ppFlow(s).ok){s.grid[[...vis][0]]=rotBits(s.grid[[...vis][0]])}return}}
function ppFlow(s){const wet=new Set();let c=0,r=s.sr,inD=8;for(let i=0;i<60;i++){if(c<0||r<0||r>=PM)return{wet,ok:false};if(c>=PN)return{wet,ok:r===s.er};const k=r*PN+c,b=s.grid[k];if(!(b&inD)||wet.has(k))return{wet,ok:false};wet.add(k);const out=b&~inD;if(![1,2,4,8].includes(out))return{wet,ok:false};const d=DIRS.find(x=>x[2]===out);c+=d[0];r+=d[1];inD=OPP[out]}return{wet,ok:false}}
reg({id:'pipes',name:'すいどうパイプ',genre:'パイプつなぎ',color:'#5b8cff',time:60,goal:300,
howto:'パイプをタップして90度ずつ回す\n左の蛇口から右の噴水まで水を通そう',
init(g){const s={done:0,n:0};ppNew(s,g);return s},
update(s,g,dt){const{I,W}=g,cs=96,ox=(W-cs*PN)/2,oy=180;for(let i=0;i<s.ang.length;i++)s.ang[i]*=Math.pow(.0005,dt);
 if(s.done>0){s.done-=dt;if(s.done<=0)ppNew(s,g);return}
 if(I.pressed){const c=Math.floor((I.x-ox)/cs),r=Math.floor((I.y-oy)/cs);if(c>=0&&c<PN&&r>=0&&r<PM){const k=r*PN+c;s.grid[k]=rotBits(s.grid[k]);s.ang[k]=-Math.PI/2;g.tone(500,.04,'square',.08);
  if(ppFlow(s).ok){s.n++;g.add(100,W/2,oy-40);g.float('水が通った！',W/2,g.H/2,'#9fe8ff',46);g.sfx('win');s.done=1.4}}}},
draw(s,g,c){const{W}=g,cs=96,ox=(W-cs*PN)/2,oy=180;g.bg('#2a3a2a','#141e14');g.rrf(ox-14,oy-14,cs*PN+28,cs*PM+28,18,'#4a3a2a');
 const fl=ppFlow(s);for(let i=0;i<PN*PM;i++){const x=ox+(i%PN)*cs,y=oy+Math.floor(i/PN)*cs,b=s.grid[i],wet=fl.wet.has(i);g.rrf(x+3,y+3,cs-6,cs-6,10,'#6b8a5a');
  c.save();c.translate(x+cs/2,y+cs/2);c.rotate(s.ang[i]);c.lineCap='round';for(const[w,col]of[[34,'#5a6070'],[26,wet?'#3a9adf':'#b8bcc8'],[8,wet?'#bfeaff':'#dfe3ee']]){c.strokeStyle=col;c.lineWidth=w;for(const[dx,dy,bit]of DIRS)if(b&bit){c.beginPath();c.moveTo(0,0);c.lineTo(dx*cs/2,dy*cs/2);c.stroke()}}g.circle(0,0,15,wet?'#3a9adf':'#9aa0b0');c.restore()}
 const sy=oy+(s.sr+.5)*cs,ey=oy+(s.er+.5)*cs;g.rrf(ox-70,sy-26,64,52,10,'#c8ccd8');g.rrf(ox-56,sy-50,20,30,6,'#ff6f59');
 c.save();c.translate(ox+cs*PN+40,ey);g.rrf(-24,-30,48,60,10,'#c8ccd8');if(s.done>0){for(let i=0;i<14;i++){const a=-Math.PI/2+(i-7)*.12,k=(g.time*2+i*.1)%1;g.circle(Math.cos(a)*k*120,-30+Math.sin(a)*k*140+k*k*120,5,'#9fe8ff')}}c.restore();
 g.txt('つないだ数 '+s.n,W/2,130,24,'rgba(255,255,255,.75)')}});
})();
