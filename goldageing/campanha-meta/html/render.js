const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.argv[2];

const themes = {
  dark:  { bg:'#1c1a17', bg2:'#2a2620', ink:'#faf7f0', muted:'#cfc6b2', gold:'#d4a62a', gold2:'#b8860b', btnInk:'#1c1a17', ring:'rgba(212,166,42,' },
  cream: { bg:'#faf7f0', bg2:'#f3e9d2', ink:'#2b2b2b', muted:'#5e574b', gold:'#b8860b', gold2:'#8a6508', btnInk:'#ffffff', ring:'rgba(184,134,11,' },
};

const creatives = [
  { id:'A1-clientes-empresas', theme:'dark', tag:'Certificação Senior-Friendly', eyebrow:'Silver Economy',
    head:'O cliente <em>50+</em> já é o seu maior mercado.<br>A sua empresa está preparada?',
    stat:'5,7 biliões €', cap:'valor estimado da Silver Economy na UE em 2025', src:'Fonte: Comissão Europeia (2018)',
    cta:'Peça o seu diagnóstico' },
  { id:'A2-clientes-municipios', theme:'dark', tag:'Para municípios', eyebrow:'Território & Envelhecimento',
    head:'Territórios <em>amigos das pessoas 50+</em> atraem pessoas, emprego e investimento.',
    stat:'182', cap:'pessoas com 65+ anos por cada 100 jovens em Portugal', src:'Fonte: INE, Censos 2021',
    cta:'Agende uma reunião' },
  { id:'B1-seguidores-manifesto', theme:'cream', tag:'Envelhecimento Ativo', eyebrow:'Manifesto GoldAgeing',
    head:'Envelhecer é acumular <em>experiência</em>.<br>Não é perder valor.',
    sub:'Ideias, dados e boas práticas para viver mais e melhor — todas as semanas.',
    cta:'Siga a GoldAgeing' },
  { id:'B2-seguidores-dado', theme:'cream', tag:'Longevidade', eyebrow:'Sabia que quase…',
    stat:'1 em cada 4', cap:'portugueses tem 65 ou mais anos (23,4%).', src:'Fonte: INE, Censos 2021',
    head:'Está na hora de mudar a forma como falamos de <em>envelhecimento</em>.',
    cta:'Junte-se à conversa' },
];

function rings(t, n=9) {
  let s=''; for (let i=1;i<=n;i++){ s+=`<circle cx="0" cy="0" r="${i*60}" fill="none" stroke="${t.ring}${(0.55-i*0.05).toFixed(2)})" stroke-width="${i%3===0?3:1.5}"/>`; }
  return s;
}

function html(c, fmt) {
  const t = themes[c.theme], W=1080, H= fmt==='1x1'?1080:1920, tall = fmt!=='1x1';
  const padX = 84, padTop = tall?280:76, padBot = tall?360:76; // 9:16 respeita zonas seguras de Stories/Reels
  const statFirst = c.id.startsWith('B2');
  const headSize = tall ? (c.stat? 72:96) : (c.stat? 58:80);
  const statSize = tall ? (c.stat && c.stat.length>8? 150:220) : (c.stat && c.stat.length>8? 110:150);
  const statBlock = c.stat ? `<div class="stat"><div class="num">${c.stat}</div><div class="cap">${c.cap}</div></div>` : '';
  const headBlock = `<h1>${c.head}</h1>${c.sub?`<p class="sub">${c.sub}</p>`:''}`;
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px}
body{font-variant-numeric:lining-nums;background:radial-gradient(120% 80% at 85% 10%, ${t.bg2} 0%, ${t.bg} 60%);color:${t.ink};font-family:Inter,sans-serif;position:relative;overflow:hidden}
.deco{position:absolute;right:-${tall?220:260}px;${tall?'top:120px':'top:-260px'};opacity:1}
.deco2{position:absolute;left:-200px;bottom:-200px}
.frame{position:absolute;inset:0;padding:${padTop}px ${padX}px ${padBot}px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center}
.logo{display:flex;align-items:center;gap:14px;font-family:'Playfair Display',serif;font-weight:700;font-size:${tall?44:38}px;letter-spacing:.3px}
.logo b{color:${t.gold}}
.tag{font-size:${tall?22:19}px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:${t.gold};border:2px solid ${t.gold};padding:10px 18px;border-radius:999px}
.main{flex:1;display:flex;flex-direction:column;justify-content:center;gap:${tall?56:34}px}
.eyebrow{font-size:${tall?26:22}px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:${t.muted};display:flex;align-items:center;gap:16px}
.eyebrow:before{content:'';width:56px;height:3px;background:${t.gold}}
h1{font-variant-numeric:lining-nums;font-family:'Playfair Display',serif;font-weight:700;font-size:${headSize}px;line-height:1.12;letter-spacing:-.5px;max-width:${tall?900:860}px}
h1 em{font-style:italic;color:${t.gold};font-weight:600}
.sub{font-size:${tall?36:30}px;line-height:1.4;color:${t.muted};max-width:820px}
.stat{border-left:6px solid ${t.gold};padding-left:28px}
.num{font-variant-numeric:lining-nums;font-family:'Playfair Display',serif;font-weight:700;font-size:${statSize}px;line-height:1;color:${t.gold}}
.cap{font-size:${tall?34:28}px;line-height:1.35;color:${t.ink};margin-top:14px;max-width:760px;font-weight:500}
.bottom{display:flex;justify-content:space-between;align-items:flex-end;gap:24px}
.btn{background:${t.gold};color:${t.btnInk};font-weight:700;font-size:${tall?36:30}px;padding:${tall?28:22}px ${tall?48:40}px;border-radius:999px;display:inline-flex;align-items:center;gap:14px;box-shadow:0 10px 30px rgba(0,0,0,.18)}
.src{font-size:${tall?20:17}px;color:${t.muted};text-align:right;max-width:340px;line-height:1.35}
</style></head><body>
<svg class="deco" width="${tall?760:820}" height="${tall?760:820}" viewBox="-560 -560 1120 1120">${rings(t)}<circle cx="0" cy="0" r="22" fill="${t.gold}"/></svg>
<svg class="deco2" width="520" height="520" viewBox="-260 -260 520 520">${rings(t,4)}</svg>
<div class="frame">
  <div class="top">
    <div class="logo"><svg width="${tall?54:46}" height="${tall?54:46}" viewBox="-25 -25 50 50"><circle r="22" fill="none" stroke="${t.gold}" stroke-width="3"/><circle r="14" fill="none" stroke="${t.gold}" stroke-width="2"/><circle r="6" fill="${t.gold}"/></svg><span>Gold<b>Ageing</b></span></div>
    <div class="tag">${c.tag}</div>
  </div>
  <div class="main">
    <div class="eyebrow">${c.eyebrow}</div>
    ${statFirst ? statBlock + headBlock : headBlock + statBlock}
  </div>
  <div class="bottom">
    <div class="btn">${c.cta} <span>→</span></div>
    ${c.src?`<div class="src">${c.src}</div>`:''}
  </div>
</div></body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  for (const c of creatives) for (const fmt of ['1x1','9x16']) {
    const H = fmt==='1x1'?1080:1920;
    const page = await browser.newPage({ viewport:{width:1080,height:H} });
    const h = html(c, fmt);
    fs.writeFileSync(`${OUT}/html/${c.id}_${fmt}.html`, h);
    await page.setContent(h, { waitUntil:'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path:`${OUT}/${c.id}_${fmt}.png` });
    await page.close();
  }
  await browser.close();
})();
