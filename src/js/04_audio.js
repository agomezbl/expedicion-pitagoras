/* =========================================================
   AUDIO: MÚSICA GENERATIVA Y EFECTOS (Web Audio)
   ========================================================= */
const AU={ctx:null,cur:null,want:null};
const mtof=m=>440*Math.pow(2,(m-69)/12);
function audioInit(){
  if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return;}
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const ctx=new C();AU.ctx=ctx;
    AU.master=ctx.createGain();AU.master.gain.value=S.audio.muted?0:1;
    const comp=ctx.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=4;
    AU.master.connect(comp).connect(ctx.destination);
    AU.rev=ctx.createConvolver();AU.rev.buffer=impulse(ctx,2.6,2.4);AU.rev.connect(AU.master);
    AU.music=ctx.createGain();AU.music.gain.value=S.audio.music;
    AU.duck=ctx.createGain();AU.duck.gain.value=1;
    AU.music.connect(AU.duck);AU.duck.connect(AU.master);
    const ms=ctx.createGain();ms.gain.value=.38;AU.duck.connect(ms).connect(AU.rev);
    AU.sfx=ctx.createGain();AU.sfx.gain.value=S.audio.sfx;AU.sfx.connect(AU.master);
    const ss=ctx.createGain();ss.gain.value=.18;AU.sfx.connect(ss).connect(AU.rev);
    AU.noise=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const nd=AU.noise.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
    AU.timer=setInterval(musicTick,40);
    if(AU.want){const w=AU.want;AU.want=null;musicPlay(w);}
  }catch(e){AU.ctx=null;}
}
function impulse(ctx,dur,decay){const r=ctx.sampleRate,len=Math.floor(r*dur),b=ctx.createBuffer(2,len,r);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,decay);}return b;}
function applyVolumes(){if(!AU.ctx)return;const t=AU.ctx.currentTime;AU.music.gain.setTargetAtTime(S.audio.music,t,.05);AU.sfx.gain.setTargetAtTime(S.audio.sfx,t,.05);AU.master.gain.setTargetAtTime(S.audio.muted?0:1,t,.05);}
function duck(on){if(!AU.ctx)return;AU.duck.gain.setTargetAtTime(on?.3:1,AU.ctx.currentTime,.15);}
/* instrumentos */
function osc(type,f,t){const o=AU.ctx.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);return o;}
function gainEnv(t,a,peak,hold,rel){const g=AU.ctx.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(peak,0.0002),t+a);g.gain.setValueAtTime(Math.max(peak,0.0002),t+a+hold);g.gain.exponentialRampToValueAtTime(0.0001,t+a+hold+rel);return g;}
function noiseSrc(t,dur){const s=AU.ctx.createBufferSource();s.buffer=AU.noise;s.start(t,Math.random()*1.5);s.stop(t+dur);return s;}
function filt(type,f,q=1){const b=AU.ctx.createBiquadFilter();b.type=type;b.frequency.value=f;b.Q.value=q;return b;}
function iPad(out,t,midis,dur,vel){const f=filt('lowpass',500,.6);f.frequency.setValueAtTime(420,t);f.frequency.linearRampToValueAtTime(1100,t+dur*.45);f.frequency.linearRampToValueAtTime(520,t+dur);const g=gainEnv(t,dur*.3,vel,dur*.45,dur*.5);f.connect(g).connect(out);midis.forEach(m=>{[-7,7].forEach(det=>{const o=osc('sawtooth',mtof(m),t);o.detune.value=det;o.connect(f);o.start(t);o.stop(t+dur*1.3+.2);});});}
function iBell(out,t,m,dur=1.2,vel=.1){const c=osc('sine',mtof(m),t),md=osc('sine',mtof(m)*3.5,t),mg=AU.ctx.createGain();mg.gain.setValueAtTime(mtof(m)*1.6,t);mg.gain.exponentialRampToValueAtTime(1,t+dur*.6);md.connect(mg).connect(c.frequency);const g=gainEnv(t,.004,vel,0,dur);c.connect(g).connect(out);c.start(t);md.start(t);c.stop(t+dur+.05);md.stop(t+dur+.05);}
function iPluck(out,t,m,dur=.7,vel=.09){const o=osc('triangle',mtof(m),t),o2=osc('sawtooth',mtof(m),t),f=filt('lowpass',3200,.8);f.frequency.setValueAtTime(3200,t);f.frequency.exponentialRampToValueAtTime(380,t+dur);const g=gainEnv(t,.003,vel,0,dur),g2=AU.ctx.createGain();g2.gain.value=.25;o.connect(f);o2.connect(g2).connect(f);f.connect(g).connect(out);o.start(t);o2.start(t);o.stop(t+dur+.05);o2.stop(t+dur+.05);}
function iBass(out,t,m,dur,vel=.16){const o=osc('sine',mtof(m),t),o2=osc('triangle',mtof(m),t),f=filt('lowpass',380),g=gainEnv(t,.01,vel,dur*.6,dur*.4),g2=AU.ctx.createGain();g2.gain.value=.4;o.connect(f);o2.connect(g2).connect(f);f.connect(g).connect(out);o.start(t);o2.start(t);o.stop(t+dur+.1);o2.stop(t+dur+.1);}
function iKick(out,t,vel=.5){const o=osc('sine',130,t);o.frequency.exponentialRampToValueAtTime(42,t+.16);const g=gainEnv(t,.002,vel,0,.32);o.connect(g).connect(out);o.start(t);o.stop(t+.4);}
function iTom(out,t,m=45,vel=.28){const o=osc('sine',mtof(m)*1.8,t);o.frequency.exponentialRampToValueAtTime(mtof(m),t+.12);const g=gainEnv(t,.002,vel,0,.3);o.connect(g).connect(out);o.start(t);o.stop(t+.35);const n=noiseSrc(t,.05),nf=filt('bandpass',1800,1.2),ng=gainEnv(t,.001,vel*.25,0,.04);n.connect(nf).connect(ng).connect(out);}
function iShaker(out,t,vel=.035){const n=noiseSrc(t,.08),f=filt('highpass',6500,.7),g=gainEnv(t,.004,vel,0,.06);n.connect(f).connect(g).connect(out);}
function iWood(out,t,vel=.07,fr=1300){const o=osc('sine',fr,t),g=gainEnv(t,.001,vel,0,.05);o.connect(g).connect(out);o.start(t);o.stop(t+.08);}
function iDrip(out,t,vel=.07){const o=osc('sine',1500,t);o.frequency.exponentialRampToValueAtTime(520,t+.09);const g=gainEnv(t,.002,vel,0,.12);o.connect(g).connect(out);o.start(t);o.stop(t+.16);}
function iBrass(out,t,m,dur,vel=.08){const o=osc('sawtooth',mtof(m),t),f=filt('lowpass',600,1.2);f.frequency.setValueAtTime(500,t);f.frequency.linearRampToValueAtTime(2400,t+.08);f.frequency.linearRampToValueAtTime(900,t+dur);const g=gainEnv(t,.03,vel,dur*.6,dur*.4);o.connect(f).connect(g).connect(out);o.start(t);o.stop(t+dur+.1);}
function iWhoosh(out,t,dur=.4,vel=.12,f0=300,f1=2400){const n=noiseSrc(t,dur+.05),f=filt('bandpass',f0,1.4);f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=gainEnv(t,dur*.4,vel,0,dur*.6);n.connect(f).connect(g).connect(out);}
function iRumble(out,t,dur=1.6,vel=.25){const n=noiseSrc(t,dur+.1),f=filt('lowpass',140,1);f.frequency.setValueAtTime(120,t);f.frequency.linearRampToValueAtTime(420,t+dur);const g=gainEnv(t,.2,vel,dur*.5,dur*.4);n.connect(f).connect(g).connect(out);}
/* pistas musicales */
const SC={hijaz:[0,1,4,5,7,8,10],aeol:[0,2,3,5,7,8,10],dor:[0,2,3,5,7,9,10],phry:[0,1,3,5,7,8,10]};
const TRACKS={
  title:{wind:true,bpm:66,root:50,scale:SC.hijaz,prog:[0,0,5,4],pad:.03,bass:'whole',arp:{inst:'bell',pat:[0,-1,-1,2,-1,-1,4,-1,-1,-1,7,-1,-1,4,-1,-1],prob:.8}},
  map:{wind:true,bpm:72,root:50,scale:SC.hijaz,prog:[0,3,5,4],pad:.028,bass:'whole',arp:{inst:'bell',pat:[0,-1,4,-1,-1,2,-1,-1,7,-1,-1,4,-1,2,-1,-1],prob:.55},drums:{tom:'x.......x.....x.'}},
  c1:{bpm:76,root:53,scale:SC.dor,prog:[0,3,0,4],pad:.026,bass:'half',arp:{inst:'pluck',pat:[0,-1,2,-1,4,-1,7,-1,4,-1,2,-1,4,-1,-1,-1],prob:.7}},
  c2:{bpm:112,root:52,scale:SC.hijaz,prog:[0,0,5,4],pad:.022,bass:'eighth',arp:{inst:'pluck',pat:[0,-1,4,-1,2,-1,4,-1,0,-1,4,-1,7,-1,4,-1],prob:1},drums:{kick:'x...x...x...x...',tom:'....x.......x.x.',shaker:'..x...x...x...x.'},hot:{shaker:'xxxxxxxxxxxxxxxx',tom:'x.x.x.x.x.x.x.xx'}},
  c3:{wind:true,bpm:60,root:45,scale:SC.aeol,prog:[0,5,3,4],pad:.03,drone:true,bass:'whole',arp:{inst:'bell',pat:[0,-1,-1,-1,-1,-1,4,-1,-1,-1,-1,-1,2,-1,-1,-1],prob:.45},drip:true},
  c4:{bpm:80,root:53,scale:SC.dor,prog:[0,3,6,4],pad:.024,bass:'half',arp:{inst:'pluck',pat:[0,2,4,7,9,7,4,2,0,2,4,7,4,2,-1,-1],prob:.6}},
  c5:{wind:true,bpm:96,root:57,scale:SC.phry,prog:[0,1,0,1],pad:.028,bass:'quarter',tick:'x.x.x.x.x.x.x.x.',arp:{inst:'bell',pat:[0,-1,-1,1,-1,-1,0,-1,-1,-1,1,-1,-1,-1,-1,-1],prob:.6},hot:{shaker:'x.xxx.xxx.xxx.xx',kick:'x...x...x...x...'}},
  c6:{bpm:124,root:50,scale:SC.hijaz,prog:[0,1,0,5],pad:.024,bass:'eighth',drums:{kick:'x..x..x.x..x..x.',tom:'..x...x...x.x.xx',shaker:'x.x.x.x.x.x.x.x.'},arp:{inst:'pluck',pat:[0,-1,1,-1,4,-1,1,-1,0,-1,-1,4,-1,5,4,1],prob:.9}},
  calm:{bpm:74,root:55,scale:SC.dor,prog:[0,3,4,0],pad:.024,bass:'half',arp:{inst:'bell',pat:[0,-1,-1,4,-1,-1,2,-1,-1,7,-1,-1,4,-1,-1,-1],prob:.5}},
  survival:{bpm:118,root:52,scale:SC.aeol,prog:[0,5,3,4],pad:.02,bass:'eighth',drums:{kick:'x...x...x...x...',shaker:'..x...x...x...x.',tom:'.......x.......x'},arp:{inst:'pluck',pat:[0,-1,2,-1,4,-1,2,-1,0,-1,2,-1,4,-1,7,-1],prob:.8},hot:{shaker:'xxxxxxxxxxxxxxxx'}},
  c7:{bpm:70,root:52,scale:SC.aeol,prog:[0,5,3,6],pad:.026,bass:'half',drip:true,arp:{inst:'bell',pat:[0,-1,2,-1,4,-1,-1,7,-1,4,-1,2,-1,-1,-1,-1],prob:.6}},
  c8:{bpm:84,root:50,scale:SC.dor,prog:[0,4,3,4],pad:.026,bass:'quarter',drums:{tom:'x.......x...x...'},tick:'x...x...x...x...',arp:{inst:'pluck',pat:[0,-1,4,-1,7,-1,4,-1,2,-1,4,-1,0,-1,-1,-1],prob:.7}},
  c9:{wind:true,bpm:62,root:55,scale:SC.dor,prog:[0,3,5,4],pad:.03,bass:'whole',arp:{inst:'bell',pat:[0,-1,-1,4,-1,-1,7,-1,-1,9,-1,-1,7,-1,4,-1],prob:.65}},
  c10:{bpm:92,root:45,scale:SC.phry,prog:[0,1,5,1],pad:.024,drone:true,bass:'quarter',drums:{kick:'x.......x.......',tom:'......x.......x.'},arp:{inst:'pluck',pat:[0,-1,1,-1,4,-1,-1,1,0,-1,-1,4,-1,5,-1,-1],prob:.75}},
  talk:{wind:true,bpm:60,root:50,scale:SC.dor,prog:[0,3,4,0],pad:.022,bass:'whole',arp:{inst:'bell',pat:[0,-1,-1,-1,4,-1,-1,-1,2,-1,-1,-1,7,-1,-1,-1],prob:.4}},
  codex:{wind:true,bpm:64,root:52,scale:SC.dor,prog:[0,3,5,4],pad:.026,bass:'whole',arp:{inst:'pluck',pat:[0,-1,-1,2,-1,-1,4,-1,7,-1,-1,4,-1,-1,2,-1],prob:.55}},
};
function musicPlay(name){
  if(!AU.ctx){AU.want=name;return;}
  if(AU.cur&&AU.cur.name===name)return;
  const ctx=AU.ctx,now=ctx.currentTime;
  if(AU.cur){const old=AU.cur;old.dead=true;old.g.gain.cancelScheduledValues(now);old.g.gain.setValueAtTime(old.g.gain.value,now);old.g.gain.linearRampToValueAtTime(0.0001,now+1.2);setTimeout(()=>{try{(old.drone||[]).forEach(o=>o.stop());old.g.disconnect();}catch(e){}},1700);}
  const def=TRACKS[name];if(!def){AU.cur=null;return;}
  const g=ctx.createGain();g.gain.setValueAtTime(0.0001,now);g.gain.linearRampToValueAtTime(1,now+1.6);g.connect(AU.music);
  const t={name,def,g,step:0,next:now+.15,hot:false,rand:seeded(name.length*977+7)};
  if(def.drone){const f=filt('lowpass',300,2),lfo=osc('sine',.08,now),lg=ctx.createGain();lg.gain.value=160;lfo.connect(lg).connect(f.frequency);const dg=ctx.createGain();dg.gain.value=.05;f.connect(dg).connect(g);t.drone=[lfo];[def.root-12,def.root-5].forEach(m=>{const o=osc('triangle',mtof(m),now);o.connect(f);o.start(now);t.drone.push(o);});lfo.start(now);}
  if(def.wind){const src=ctx.createBufferSource();src.buffer=AU.noise;src.loop=true;const bp=filt('bandpass',600,.9),lfo=osc('sine',.06,now),lg=ctx.createGain();lg.gain.value=320;lfo.connect(lg).connect(bp.frequency);const wg=ctx.createGain();wg.gain.value=.05;src.connect(bp).connect(wg).connect(g);src.start(now);lfo.start(now);t.drone=(t.drone||[]).concat([src,lfo]);}
  AU.cur=t;
}
function musicTick(){
  const t=AU.cur,ctx=AU.ctx;if(!t||!ctx)return;
  if(S.audio.muted||S.audio.music<=0.001||document.hidden){t.next=ctx.currentTime+.1;return;}
  if(t.next<ctx.currentTime-.05)t.next=ctx.currentTime+.05;
  const spb=60/t.def.bpm/4;
  while(t.next<ctx.currentTime+.3){schedStep(t,t.step,t.next,spb);t.step++;t.next+=spb;}
}
function schedStep(t,step,time,spb){
  const d=t.def,bar=Math.floor(step/16),s=step%16,deg=d.prog[bar%d.prog.length],n=d.scale.length;
  const tone=(dg,oct)=>{const di=((dg%n)+n)%n;return d.root+d.scale[di]+12*(Math.floor(dg/n)+oct);};
  const out=t.g;
  if(d.pad&&s===0&&bar%2===0)iPad(out,time,[tone(deg,0),tone(deg+2,0),tone(deg+4,0)],spb*32,d.pad);
  const bl={whole:16,half:8,quarter:4,eighth:2}[d.bass];
  if(bl&&s%bl===0)iBass(out,time,tone(deg,-1),spb*bl*.9,bl===2?.11:.14);
  if(d.arp){const v=d.arp.pat[s];if(v>=0&&t.rand()<d.arp.prob){const m=tone(deg+v,1);if(d.arp.inst==='bell')iBell(out,time,m+12,1.4,.07);else iPluck(out,time,m,.6,.07);}}
  const drums=Object.assign({},d.drums||{},t.hot&&d.hot?d.hot:{});
  if(drums.kick&&drums.kick[s]==='x')iKick(out,time,.42);
  if(drums.tom&&drums.tom[s]==='x')iTom(out,time,43+(s%3)*3,.2);
  if(drums.shaker&&drums.shaker[s]==='x')iShaker(out,time,.03);
  if(d.tick&&d.tick[s]==='x')iWood(out,time,s%8===0?.07:.04,s%8===0?1500:1100);
  if(d.drip&&s%4===0&&t.rand()<.14)iDrip(out,time+t.rand()*spb*2,.05);
}
function setHot(on){if(AU.cur)AU.cur.hot=!!on;}
/* efectos */
function sfx(kind,arg){
  if(kind==='hover'&&!AU.ctx)return;
  audioInit();if(!AU.ctx||S.audio.muted||S.audio.sfx<=0)return;
  try{
    const t=AU.ctx.currentTime+.01,o=AU.sfx;
    switch(kind){
      case 'ok':iBell(o,t,76,.9,.16);iBell(o,t+.09,83,1.1,.15);break;
      case 'coin':iBell(o,t,91,.35,.06);break;
      case 'bad':iTom(o,t,38,.4);{const a=osc('triangle',mtof(50),t),b=osc('triangle',mtof(51),t),g=gainEnv(t,.005,.08,.12,.2);a.connect(g);b.connect(g);g.connect(o);a.start(t);b.start(t);a.stop(t+.4);b.stop(t+.4);}break;
      case 'tick':iWood(o,t,.05,1500);break;
      case 'clock':iWood(o,t,.09,1800);break;
      case 'rope':iWhoosh(o,t,.3,.14,400,2600);{const p=osc('sawtooth',196,t),f=filt('lowpass',2400,4);f.frequency.exponentialRampToValueAtTime(300,t+.9);p.frequency.exponentialRampToValueAtTime(110,t+.9);const g=gainEnv(t+.2,.003,.12,0,.9);p.connect(f).connect(g).connect(o);p.start(t+.2);p.stop(t+1.2);}break;
      case 'steps':for(let i=0;i<5;i++)iWood(o,t+.35+i*.2,.035,320+(i%2)*60);break;
      case 'stone':iRumble(o,t,.5,.22);iTom(o,t,33,.3);break;
      case 'seal':iRumble(o,t,.4,.18);iBell(o,t+.15,72,1.2,.1);iBell(o,t+.25,79,1.4,.08);break;
      case 'door':iRumble(o,t,2.2,.32);iTom(o,t,31,.4);[60,67,72,76].forEach((m,i)=>iBell(o,t+1.2+i*.12,m+12,1.8,.07));break;
      case 'hit':iKick(o,t,.7);{const n=noiseSrc(t,.15),f=filt('highpass',2200,.8),g=gainEnv(t,.002,.25,0,.12);n.connect(f).connect(g).connect(o);}iTom(o,t+.04,36,.3);break;
      case 'growl':{const a=osc('sawtooth',58,t),f=filt('lowpass',260,3),g=gainEnv(t,.08,.22,.3,.4);a.frequency.linearRampToValueAtTime(44,t+.7);a.connect(f).connect(g).connect(o);a.start(t);a.stop(t+.9);}iTom(o,t+.1,30,.4);break;
      case 'relic':[84,88,91,96].forEach((m,i)=>iBell(o,t+i*.08,m,1.4,.08));iWhoosh(o,t,.6,.05,3000,9000);break;
      case 'rank':[[60,.18],[64,.18],[67,.18],[72,.5]].forEach(([m,d],i)=>iBrass(o,t+i*.16,m,d,.09));iKick(o,t+.48,.4);break;
      case 'win':[72,76,79,84,88].forEach((m,i)=>iBell(o,t+i*.1,m,1.6,.09));break;
      case 'lose':[64,60,57,52].forEach((m,i)=>iPluck(o,t+i*.18,m,.8,.09));break;
      case 'whoosh':iWhoosh(o,t,.45,.12,250,3000);break;
      case 'buzz':[0,.14].forEach(dt=>{const a=osc('square',520,t+dt),g=gainEnv(t+dt,.005,.05,.08,.03);a.connect(g).connect(o);a.start(t+dt);a.stop(t+dt+.15);});break;
      case 'click':iWood(o,t,.035,900);break;
      case 'hover':if(arg>=0)iBell(o,t,[74,76,79,81,83,86][arg]||79,.7,.03);else iWood(o,t,.014,2300);break;
      case 'cineClose':iWhoosh(o,t,.75,.11,2600,160);iRumble(o,t+.1,1,.16);iKick(o,t+.62,.32);break;
      case 'cineSoft':iWhoosh(o,t,.45,.07,1800,250);break;
      case 'cineOpen':iWhoosh(o,t,.9,.06,220,3200);iBell(o,t+.3,88,1.6,.025);break;
      case 'boom':iTom(o,t,26,.55);iRumble(o,t,1.8,.26);iBell(o,t+.02,57,3,.05);iBell(o,t+.02,64,3,.03);break;
      case 'reveal':iRumble(o,t,1.4,.2);iWhoosh(o,t,1.2,.06,800,6000);[72,76,79,83].forEach((m,i)=>iBell(o,t+.5+i*.14,m,1.8,.06));break;
      case 'page':iWhoosh(o,t,.35,.05,1200,5000);iWood(o,t+.1,.02,700);break;
      case 'star':iBell(o,t,[79,83,88][arg]||84,1.3,.12);break;
      case 'type':iWood(o,t,.012,2600+Math.random()*600);break;
      case 'choice':iBell(o,t,79,.6,.06);iBell(o,t+.07,86,.8,.05);break;
      case 'enter':iWhoosh(o,t,.6,.08,200,1200);iTom(o,t+.1,40,.18);break;
    }
  }catch(e){}
}

