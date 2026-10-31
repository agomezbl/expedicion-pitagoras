// Prueba de la app instalable: manifiesto, service worker, descarga de voces y juego sin conexión.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=process.argv[2]||path.join(__dirname,'..');const CHR=/chrono/.test(ROOT);const T={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.mp3':'audio/mpeg'};
const srv=http.createServer((q,r)=>{let f=decodeURIComponent(q.url.split('?')[0]);if(f.endsWith('/'))f+='index.html';f=path.join(ROOT,f);fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});r.end(d);});}).listen(8766);
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 if(CHR)await p.addInitScript(()=>{if(!localStorage.getItem('chrono-ohm-v1'))localStorage.setItem('chrono-ohm-v1',JSON.stringify({name:'Nil',introSeen:true,settings:{lang:'es',narr:false,music:false,sfx:false}}))});
 if(!CHR)await p.addInitScript(()=>{if(!localStorage.getItem('expedicion-pitagoras-v1'))localStorage.setItem('expedicion-pitagoras-v1',JSON.stringify({lang:'es',audio:{muted:true}}))});
 await p.goto('http://localhost:8766/');await p.waitForFunction(()=>navigator.serviceWorker&&navigator.serviceWorker.controller,null,{timeout:15000}).catch(()=>{});
 const man=await p.evaluate(async()=>{const r=await fetch('manifest.webmanifest');return r.ok?(await r.json()).name:null;});
 const sw=await p.evaluate(()=>!!navigator.serviceWorker.controller);
 if(CHR){await p.click('#btnStart');await p.waitForTimeout(2500);}
 const t0=Date.now();await p.evaluate(()=>new Promise(res=>{(document.querySelector('[data-act="settings"]')||document.querySelector('#btnSettings')).click();setTimeout(()=>{(document.querySelector('[data-act="offGet"]')||document.querySelector('#offGet')).click();const iv=setInterval(()=>{if(document.querySelector('#offBox .mk-ok,#offBox .off-ok')){clearInterval(iv);res();}},300);},1500);}));
 const dl=Math.round((Date.now()-t0)/1000);
 await ctx.setOffline(true);await p.reload();await p.waitForTimeout(1500);await p.screenshot({path:'/tmp/claude-0/-home-claude/696a25bd-debd-5ac8-9a48-ce202486a912/scratchpad/offline.png'});
 const off=await p.evaluate(async()=>{const ok=!!document.querySelector('#view .title')||!!(document.body.innerText||'').match(/chrono/i);const j=await (await fetch('audio/manifest.json')).json();const r=await fetch(`audio/es/${j.es[5]}.mp3`);return {ok,mp3:r.ok&&(await r.arrayBuffer()).byteLength>1000,man:!!j.es.length};});
 console.log(JSON.stringify({manifiesto:man,serviceWorker:sw,descargaVoces_s:dl,sinConexion:off,errores:errs}));
 console.log(man&&sw&&off.ok&&off.mp3&&off.man&&!errs.length?'TODO OK':'HAY FALLOS');await b.close();srv.close();})();
