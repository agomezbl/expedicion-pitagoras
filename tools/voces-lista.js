// Saca del juego todas las frases grabables (por idioma y personaje) → voz/lineas.json
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>localStorage.setItem('expedicion-pitagoras-v1',JSON.stringify({voice:{on:false},audio:{muted:true}})));
 await p.goto('file://'+path.join(__dirname,'..','dist','test.html'));await p.waitForTimeout(300);
 const out={};for(const l of ['fr','es']){out[l]=await p.evaluate(l=>{window.__P.setLang(l);return window.__P.voiceLines()},l)}
 fs.writeFileSync(path.join(__dirname,'..','voz','lineas.json'),JSON.stringify(out));
 for(const l in out){const w={};out[l].forEach(x=>w[x.who]=(w[x.who]||0)+1);console.log(l,out[l].length,'frases',JSON.stringify(w),'caracteres',out[l].reduce((a,x)=>a+x.say.length,0))}
 console.log('errores',errs);await b.close()})();
