const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.argv[2];

const rings = (cx, cy, stroke, n=7) => Array.from({length:n},(_,i)=>`<circle cx="${cx}" cy="${cy}" r="${(i+1)*55}" fill="none" stroke="${stroke}" stroke-opacity="${(0.5-i*0.06).toFixed(2)}" stroke-width="${(i+1)%3===0?3:1.5}"/>`).join('');

// D1 — AgeTech: videochamada em família, saúde digital e teleassistência
const svgAgetech = `<svg viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
<rect width="960" height="600" fill="#2a2620"/>
${rings(690,300,'#d4a62a')}
<circle cx="690" cy="300" r="14" fill="#d4a62a"/>
<!-- mulher -->
<path d="M150 620 Q150 440 330 430 Q510 440 510 620Z" fill="#b8860b"/>
<path d="M290 440 Q330 500 370 440 L370 420 L290 420Z" fill="#faf7f0"/>
<rect x="304" y="372" width="52" height="64" rx="20" fill="#e9b996"/>
<circle cx="330" cy="322" r="80" fill="#e9b996"/>
<path d="M246 334 Q236 226 330 222 Q424 226 414 334 Q398 276 330 270 Q262 276 246 334Z" fill="#e8e8e8"/>
<circle cx="330" cy="214" r="34" fill="#e8e8e8"/>
<circle cx="302" cy="328" r="21" fill="none" stroke="#2b2b2b" stroke-width="4"/><circle cx="358" cy="328" r="21" fill="none" stroke="#2b2b2b" stroke-width="4"/><path d="M323 328h14" stroke="#2b2b2b" stroke-width="4"/>
<circle cx="302" cy="328" r="5" fill="#2b2b2b"/><circle cx="358" cy="328" r="5" fill="#2b2b2b"/>
<path d="M303 360 Q330 384 357 360" stroke="#8a4b3a" stroke-width="5" fill="none" stroke-linecap="round"/>
<circle cx="250" cy="352" r="7" fill="#d4a62a"/><circle cx="410" cy="352" r="7" fill="#d4a62a"/>
<!-- tablet -->
<g transform="rotate(-5 530 390)">
<rect x="400" y="290" width="270" height="200" rx="20" fill="#1c1a17" stroke="#d4a62a" stroke-width="4"/>
<rect x="414" y="304" width="242" height="172" rx="10" fill="#faf7f0"/>
<rect x="424" y="314" width="144" height="152" rx="8" fill="#f3e9d2"/>
<circle cx="496" cy="372" r="30" fill="#e9b996"/><path d="M496 342 Q462 346 462 372 Q470 352 496 352 Q522 352 530 372 Q530 346 496 342Z" fill="#8b6a4f"/>
<path d="M440 466 Q440 410 496 408 Q552 410 552 466Z" fill="#8a6508"/>
<rect x="578" y="314" width="68" height="72" rx="8" fill="#d4a62a"/><circle cx="612" cy="344" r="16" fill="#e9b996"/><path d="M584 386 Q584 362 612 362 Q640 362 640 386Z" fill="#2b2b2b"/>
<rect x="578" y="394" width="68" height="72" rx="8" fill="#e6dcc6"/><circle cx="612" cy="424" r="16" fill="#d9a77f"/><path d="M584 466 Q584 442 612 442 Q640 442 640 466Z" fill="#b8860b"/>
</g>
<path d="M455 560 L418 488" stroke="#b8860b" stroke-width="46" stroke-linecap="round"/>
<circle cx="412" cy="480" r="23" fill="#e9b996"/>
<!-- wifi -->
<g fill="none" stroke="#d4a62a" stroke-width="7" stroke-linecap="round"><path d="M700 232 Q730 200 764 232"/><path d="M684 214 Q730 166 780 214" opacity=".7"/><path d="M668 196 Q730 132 796 196" opacity=".4"/></g>
<circle cx="732" cy="248" r="8" fill="#d4a62a"/>
<!-- saúde -->
<rect x="640" y="96" width="228" height="80" rx="40" fill="#faf7f0"/>
<path d="M684 126 c0-12 16-18 22-6 c6-12 22-6 22 6 c0 16-22 28-22 28 c0 0-22-12-22-28z" fill="#c62828"/>
<polyline points="736,136 752,136 760,116 772,152 782,130 790,136 806,136" fill="none" stroke="#b8860b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<text x="814" y="146" font-family="Inter" font-weight="700" font-size="22" fill="#2b2b2b">72</text>
<!-- teleassistência -->
<circle cx="800" cy="440" r="58" fill="#d4a62a"/>
<path d="M800 402 L836 416 L836 446 Q836 474 800 490 Q764 474 764 446 L764 416Z" fill="#1c1a17"/>
<path d="M784 446 L796 458 L820 430" fill="none" stroke="#d4a62a" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// D2 — cidade Senior-Friendly
const buildings = [
  [30,300,130,'#f5e6c4','#b5603a'],[170,250,120,'#fff3e0','#a4502d'],[300,320,110,'#e6dcc6','#b5603a'],
  [420,230,130,'#f5e6c4','#8a6508'],[560,290,120,'#fff3e0','#b5603a'],[690,240,110,'#e6dcc6','#a4502d'],[810,310,130,'#f5e6c4','#b5603a'],
].map(([x,y,w,f,r])=>{
  const h=500-y; let win='';
  for(let wy=y+34; wy<470-40; wy+=56) for(let wx=x+16; wx<x+w-30; wx+=38) win+=`<rect x="${wx}" y="${wy}" width="20" height="30" rx="4" fill="#8a6508" opacity=".75"/>`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/><path d="M${x-8} ${y} L${x+w/2} ${y-44} L${x+w+8} ${y}Z" fill="${r}"/><rect x="${x}" y="${y+h-26}" width="${w}" height="26" fill="#d4a62a" opacity=".35"/>${win}`;
}).join('');

const svgCidade = `<svg viewBox="0 0 960 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
<rect width="960" height="600" fill="#f3e9d2"/>
${rings(800,140,'#b8860b',6)}
<circle cx="800" cy="140" r="64" fill="#d4a62a"/>
${buildings}
<rect y="500" width="960" height="100" fill="#4a4033"/><rect y="500" width="960" height="10" fill="#d4a62a"/>
<g stroke="#faf7f0" stroke-width="6" stroke-dasharray="40 30" opacity=".6"><line x1="0" y1="560" x2="960" y2="560"/></g>
<!-- banco -->
<rect x="70" y="440" width="170" height="14" rx="5" fill="#8a6508"/><rect x="76" y="404" width="158" height="12" rx="5" fill="#8a6508"/><rect x="90" y="454" width="10" height="46" fill="#2b2b2b"/><rect x="210" y="454" width="10" height="46" fill="#2b2b2b"/>
<!-- homem 65+ -->
<rect x="410" y="400" width="26" height="100" rx="8" fill="#2b2b2b"/><rect x="450" y="400" width="26" height="100" rx="8" fill="#2b2b2b"/>
<rect x="404" y="488" width="38" height="14" rx="7" fill="#1c1a17"/><rect x="448" y="488" width="38" height="14" rx="7" fill="#1c1a17"/>
<path d="M392 420 Q392 310 443 306 Q494 310 494 420Z" fill="#faf7f0"/>
<path d="M392 420 Q392 330 418 316 L418 420Z M494 420 Q494 330 468 316 L468 420Z" fill="#b8860b"/>
<rect x="426" y="270" width="34" height="42" rx="14" fill="#d9a77f"/>
<circle cx="443" cy="250" r="44" fill="#d9a77f"/>
<path d="M399 252 Q396 200 443 198 Q490 200 487 252 Q474 222 443 222 Q412 222 399 252Z" fill="#d0d0d0"/>
<path d="M405 262 Q410 306 443 306 Q476 306 481 262 Q470 286 443 286 Q416 286 405 262Z" fill="#d0d0d0"/>
<circle cx="427" cy="250" r="4.5" fill="#2b2b2b"/><circle cx="459" cy="250" r="4.5" fill="#2b2b2b"/>
<path d="M426 266 Q443 282 460 266" stroke="#8a4b3a" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M488 332 L500 416" stroke="#faf7f0" stroke-width="28" stroke-linecap="round"/><circle cx="501" cy="428" r="14" fill="#d9a77f"/>
<rect x="488" y="406" width="26" height="14" rx="5" fill="#1c1a17" stroke="#d4a62a" stroke-width="3"/>
<circle cx="501" cy="413" r="22" fill="none" stroke="#d4a62a" stroke-width="3" opacity=".7"/>
<!-- mulher mais nova -->
<rect x="580" y="410" width="22" height="90" rx="8" fill="#2b2b2b"/><rect x="614" y="410" width="22" height="90" rx="8" fill="#2b2b2b"/>
<rect x="574" y="490" width="34" height="12" rx="6" fill="#8a6508"/><rect x="610" y="490" width="34" height="12" rx="6" fill="#8a6508"/>
<path d="M556 430 Q556 318 608 312 Q660 318 660 430Z" fill="#8a6508"/>
<path d="M564 336 L556 418" stroke="#8a6508" stroke-width="26" stroke-linecap="round"/><circle cx="556" cy="430" r="13" fill="#e9b996"/>
<rect x="592" y="276" width="32" height="40" rx="12" fill="#e9b996"/>
<circle cx="608" cy="258" r="42" fill="#e9b996"/>
<path d="M564 262 Q560 204 608 202 Q656 204 652 262 Q648 226 608 226 Q574 226 564 262Z" fill="#5a3825"/>
<path d="M564 262 Q556 330 576 350 Q570 300 574 262Z M652 262 Q660 330 640 350 Q646 300 642 262Z" fill="#5a3825"/>
<circle cx="592" cy="258" r="4.5" fill="#2b2b2b"/><circle cx="624" cy="258" r="4.5" fill="#2b2b2b"/>
<path d="M590 273 Q608 289 626 273" stroke="#8a4b3a" stroke-width="5" fill="none" stroke-linecap="round"/>
<!-- selos -->
<g><rect x="60" y="96" width="270" height="70" rx="35" fill="#1c1a17"/><circle cx="100" cy="131" r="20" fill="#d4a62a"/><path d="M90 131 L98 139 L112 122" fill="none" stroke="#1c1a17" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><text x="130" y="140" font-family="Inter" font-weight="700" font-size="25" fill="#faf7f0">Senior-Friendly</text></g>
<g><path d="M780 330 a42 42 0 1 1 84 0 c0 30-42 66-42 66 s-42-36-42-66z" fill="#c62828"/><circle cx="822" cy="330" r="16" fill="#faf7f0"/></g>
</svg>`;

const items = [
  { id:'D1-agetech-ilustracao', theme:'cream', svg:svgAgetech, tag:'AgeTech', head:'A distância deixou de ser um <em>problema</em>.',
    sub:'Videochamadas, teleassistência e saúde digital: a tecnologia que aproxima gerações.', cta:'Descubra a AgeTech' },
  { id:'D2-senior-friendly-ilustracao', theme:'dark', svg:svgCidade, tag:'Senior-Friendly', head:'Uma cidade boa para os 50+ é boa para <em>todos</em>.',
    sub:'Certificação Senior-Friendly para municípios, comércio e turismo.', cta:'Peça o diagnóstico' },
];
const T = { dark:{bg:'#1c1a17',bg2:'#2a2620',ink:'#faf7f0',muted:'#cfc6b2',gold:'#d4a62a',btn:'#1c1a17'}, cream:{bg:'#faf7f0',bg2:'#f3e9d2',ink:'#2b2b2b',muted:'#5e574b',gold:'#b8860b',btn:'#ffffff'} };

const page = (c, fmt) => {
  const t=T[c.theme], tall=fmt==='9x16', H=tall?1920:1080;
  const padTop=tall?250:56, padBot=tall?340:56, cardH=tall?700:560, hs=tall?70:54, ss=tall?34:27, gap=tall?34:20;
  return `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:${H}px}
body{background:radial-gradient(120% 80% at 85% 10%,${t.bg2} 0%,${t.bg} 60%);color:${t.ink};font-family:Inter,sans-serif;font-variant-numeric:lining-nums;overflow:hidden}
.f{position:absolute;inset:0;padding:${padTop}px 60px ${padBot}px;display:flex;flex-direction:column;gap:${gap}px}
.top{display:flex;justify-content:space-between;align-items:center}
.logo{display:flex;align-items:center;gap:12px;font-family:'Playfair Display',serif;font-weight:700;font-size:${tall?44:36}px}.logo b{color:${t.gold}}
.tag{font-size:${tall?22:18}px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:${t.gold};border:2px solid ${t.gold};padding:9px 18px;border-radius:999px}
.card{height:${cardH}px;border-radius:32px;overflow:hidden;flex:none;box-shadow:0 14px 40px rgba(0,0,0,.22)}.card svg{width:100%;height:100%;display:block}
h1{font-family:'Playfair Display',serif;font-weight:700;font-size:${hs}px;line-height:1.1;letter-spacing:-.5px}h1 em{font-style:italic;color:${t.gold};font-weight:600}
.sub{font-size:${ss}px;line-height:1.35;color:${t.muted}}
.btn{margin-top:auto;align-self:flex-start;background:${t.gold};color:${t.btn};font-weight:700;font-size:${tall?36:29}px;padding:${tall?26:20}px ${tall?46:38}px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.18)}
</style></head><body><div class="f">
<div class="top"><div class="logo"><svg width="${tall?52:44}" height="${tall?52:44}" viewBox="-25 -25 50 50"><circle r="22" fill="none" stroke="${t.gold}" stroke-width="3"/><circle r="14" fill="none" stroke="${t.gold}" stroke-width="2"/><circle r="6" fill="${t.gold}"/></svg><span>Gold<b>Ageing</b></span></div><div class="tag">${c.tag}</div></div>
<div class="card">${c.svg}</div><h1>${c.head}</h1><p class="sub">${c.sub}</p><div class="btn">${c.cta} →</div>
</div></body></html>`;
};

(async()=>{
  const b = await chromium.launch();
  for (const c of items) for (const fmt of ['1x1','9x16']) {
    const p = await b.newPage({viewport:{width:1080,height:fmt==='1x1'?1080:1920}});
    const h = page(c,fmt); fs.writeFileSync(`${OUT}/html/${c.id}_${fmt}.html`,h);
    await p.setContent(h,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
    await p.screenshot({path:`${OUT}/${c.id}_${fmt}.png`}); await p.close();
  }
  await b.close();
})();
