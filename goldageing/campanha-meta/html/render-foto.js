const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.argv[2];
const photo = 'data:image/jpeg;base64,' + fs.readFileSync(`${OUT}/img/foto-campanha.jpg`).toString('base64');
const G = '#d4a62a';

const items = [
  { id:'E1-foto-clientes', tag:'Silver Economy', eyebrow:'Consultoria GoldAgeing', mirror:false,
    head:'A geração 50+ não é o futuro. É o <em>presente</em> da economia.',
    sub:'Diagnóstico, estratégia e Certificação Senior-Friendly para municípios e empresas.', cta:'Peça o diagnóstico' },
  { id:'E2-foto-seguidores', tag:'Envelhecimento Ativo', eyebrow:'Comunidade GoldAgeing', mirror:true,
    head:'Aos 50+, a melhor fase <em>começa agora</em>.',
    sub:'Ideias, dados e histórias de envelhecimento ativo. Todas as semanas, na GoldAgeing.', cta:'Siga a GoldAgeing' },
];

const rings = (cx,cy,n=9) => Array.from({length:n},(_,i)=>`<circle cx="${cx}" cy="${cy}" r="${(i+1)*70}" fill="none" stroke="${G}" stroke-opacity="${(0.5-i*0.04).toFixed(2)}" stroke-width="${(i+1)%3===0?3:1.5}"/>`).join('');

const page = (c, fmt) => {
  const tall = fmt==='9x16', H = tall?1920:1080;
  let layout;
  if (tall) {
    // foto ancorada em baixo (1080×1920) deslocada 300px; topo preto livre para o texto
    layout = `
    <svg style="position:absolute;left:0;top:0" width="1080" height="${H}">${rings(540,1170)}</svg>
    <img src="${photo}" style="position:absolute;left:0;top:300px;width:1080px;height:1920px;mix-blend-mode:screen">
    <div style="position:absolute;left:0;top:300px;width:1080px;height:260px;background:linear-gradient(#000,transparent)"></div>
    <div style="position:absolute;left:0;bottom:0;width:1080px;height:520px;background:linear-gradient(transparent,rgba(0,0,0,.85))"></div>
    <div class="top" style="top:250px;left:70px;right:70px">${header(c,true)}</div>
    <div style="position:absolute;left:70px;right:70px;top:385px">${text(c,76,34)}</div>
    <div style="position:absolute;left:70px;bottom:340px">${btn(c,36)}</div>`;
  } else {
    const photoLeft = c.mirror, px = photoLeft?0:472;
    layout = `
    <svg style="position:absolute;left:${photoLeft?-100:430}px;top:200px" width="900" height="900">${rings(450,450,7)}</svg>
    <img src="${photo}" style="position:absolute;left:${px}px;top:0;width:608px;height:1080px;mix-blend-mode:screen">
    <div style="position:absolute;top:0;${photoLeft?'left:0':'left:472px'};width:608px;height:150px;background:linear-gradient(#000,transparent)"></div>
    <div style="position:absolute;top:0;${photoLeft?'left:488px':'left:472px'};width:120px;height:1080px;background:linear-gradient(${photoLeft?'to right':'to left'},transparent,#000)"></div>
    <div class="top" style="top:56px;left:60px;right:60px">${header(c,false)}</div>
    <div style="position:absolute;${photoLeft?'left:560px;right:60px':'left:60px;width:470px'};top:200px">${text(c,52,27)}</div>
    <div style="position:absolute;${photoLeft?'left:560px':'left:60px'};bottom:60px">${btn(c,29)}</div>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:${H}px}
body{background:#000;color:#faf7f0;font-family:Inter,sans-serif;position:relative;overflow:hidden;font-variant-numeric:lining-nums}
.top{position:absolute;display:flex;justify-content:space-between;align-items:center;z-index:5}
.logo{display:flex;align-items:center;gap:12px;font-family:'Playfair Display',serif;font-weight:700}.logo b{color:${G}}
.tag{font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:${G};border:2px solid ${G};border-radius:999px;background:rgba(0,0,0,.35)}
.eyebrow{font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#cfc6b2;display:flex;align-items:center;gap:14px}
h1{font-family:'Playfair Display',serif;font-weight:700;line-height:1.1;letter-spacing:-.5px}h1 em{font-style:italic;color:${G};font-weight:600}
.sub{color:#e6dcc6;line-height:1.4}
.btn{background:${G};color:#1c1a17;font-weight:700;border-radius:999px;display:inline-block;box-shadow:0 10px 30px rgba(0,0,0,.4)}
</style></head><body>${layout}</body></html>`;
};
const header = (c,t) => `<div class="logo" style="font-size:${t?44:36}px"><svg width="${t?52:44}" height="${t?52:44}" viewBox="-25 -25 50 50"><circle r="22" fill="none" stroke="${G}" stroke-width="3"/><circle r="14" fill="none" stroke="${G}" stroke-width="2"/><circle r="6" fill="${G}"/></svg><span>Gold<b>Ageing</b></span></div><div class="tag" style="font-size:${t?22:18}px;padding:9px 18px">${c.tag}</div>`;
const text = (c,hs,ss) => `<div class="eyebrow" style="font-size:${ss-6}px;margin-bottom:${ss}px">${c.eyebrow}</div><h1 style="font-size:${hs}px">${c.head}</h1><p class="sub" style="font-size:${ss}px;margin-top:${ss}px">${c.sub}</p>`;
const btn = (c,fs) => `<div class="btn" style="font-size:${fs}px;padding:${fs*0.75}px ${fs*1.3}px">${c.cta} →</div>`;

(async()=>{
  const b = await chromium.launch();
  for (const c of items) for (const fmt of ['1x1','9x16']) {
    const p = await b.newPage({viewport:{width:1080,height:fmt==='1x1'?1080:1920}});
    await p.setContent(page(c,fmt),{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
    await p.screenshot({path:`${OUT}/${c.id}_${fmt}.png`}); await p.close();
  }
  await b.close();
})();
