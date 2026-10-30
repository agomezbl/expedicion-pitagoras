// Comprueba que las voces grabadas se cargan y suenan servidas por http (como en GitHub Pages).
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=process.argv[2];
const srv=http.createServer((q,r)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/\/$/,'/index.html'));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':f.endsWith('.mp3')?'audio/mpeg':f.endsWith('.json')?'application/json':'text/html'});r.end(d);});}).listen(8765);
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const out={};
 for(const l of ['fr','es']){const p=await b.newPage();const got=[];p.on('request',q=>{if(q.url().endsWith('.mp3'))got.push(q.url().split('/').slice(-2).join('/'));});
  await p.addInitScript(l=>localStorage.setItem('expedicion-pitagoras-v1',JSON.stringify({lang:l,audio:{muted:true}})),l);
  await p.goto('http://localhost:8765/');await p.waitForTimeout(800);
  const r=await p.evaluate(async()=>{const P=window.__P;const ok=!!P.SP.man;const ls=P.voiceLines();const miss=ls.filter(x=>!P.SP.man[P.L].has(x.key)).length;
    P.playScene('c7');await new Promise(r=>setTimeout(r,1500));return {ok,n:ls.length,miss};});
  out[l]={...r,mp3:got.slice(0,3)};await p.close();}
 console.log(JSON.stringify(out,null,1));await b.close();srv.close();})();
