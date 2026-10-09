// Criativos Meta GoldAgeing — sistema visual oficial (ver goldageing/goldageing-config.html)
// Paleta: --gold #b8860b · --gold-dark #8a6508 · --gold-light #f5e6c4 · --bg #faf7f0 · --text #2b2b2b · --muted #666 · --border #e6dcc6
// Cabeçalho: gradiente 135° gold → gold-dark com texto branco · cartões brancos, borda #e6dcc6, raio 12px · tipografia sans-serif (Roboto)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2];
const { svgAgetech, svgCidade } = require('./ilustracoes-svg.js');

const P = { gold:'#b8860b', goldDark:'#8a6508', goldLight:'#f5e6c4', bg:'#faf7f0', text:'#2b2b2b', muted:'#666666', border:'#e6dcc6' };
const GRAD = `linear-gradient(135deg, ${P.gold}, ${P.goldDark})`;
const photo = 'data:image/png;base64,' + fs.readFileSync(`${OUT}/img/foto-recorte.png`).toString('base64');

// Ilustrações recoloridas para a paleta oficial
const swap = (s, pairs) => pairs.reduce((a, [f, t]) => a.split(f).join(t), s);
const illAge = swap(svgAgetech, [['#2a2620', P.goldLight], ['#d4a62a', P.gold], ['#1c1a17', P.text], ['#f3e9d2', P.bg]]);
const illCity = swap(svgCidade, [['#f5e6c4', '#ffffff'], ['#f3e9d2', P.goldLight], ['#d4a62a', P.gold], ['#1c1a17', P.text],
  ['#4a4033', P.goldDark], ['#b5603a', P.gold], ['#a4502d', P.goldDark], ['#c62828', P.goldDark]]);

const items = [
  { id:'A1-clientes-empresas', theme:'gold', tag:'Certificação Senior-Friendly', badge:'Silver Economy',
    head:'O cliente <em>50+</em> não é um nicho. É o seu maior mercado.',
    stat:'5,7 biliões €', cap:'valor estimado da Silver Economy na UE em 2025', src:'Fonte: Comissão Europeia (2018)', cta:'Peça o diagnóstico' },
  { id:'A2-clientes-municipios', theme:'gold', tag:'Para municípios', badge:'Território & Envelhecimento',
    head:'Quem não prepara o território para <em>envelhecer</em>, perde-o.',
    stat:'182', cap:'pessoas com 65+ anos por cada 100 jovens em Portugal', src:'Fonte: INE, Censos 2021', cta:'Prepare o seu município' },
  { id:'B1-seguidores-manifesto', theme:'cream', tag:'Envelhecimento Ativo', badge:'Manifesto GoldAgeing',
    head:'Os anos não nos tiram valor. Dão-nos <em>mestria</em>.',
    sub:'Envelhecer é a maior oportunidade económica e social do século XXI. Siga a GoldAgeing e descubra porquê.', cta:'Siga a GoldAgeing' },
  { id:'B2-seguidores-dado', theme:'cream', tag:'Longevidade', badge:'O país mudou',
    head:'Portugal envelhece. Vamos tratá-lo como <em>oportunidade</em>.',
    stat:'1 em cada 4', cap:'portugueses tem 65 ou mais anos (23,4%).', src:'Fonte: INE, Censos 2021', statFirst:true, cta:'Siga e partilhe' },
  { id:'C1-agetech', theme:'gold', dots:true, tag:'AgeTech', badge:'Tecnologia com propósito',
    head:'Tecnologia que devolve <em>autonomia</em>.',
    sub:'Teleassistência, saúde digital e casas inteligentes para viver com independência e segurança. Escolhemos, financiamos e implementamos consigo.', cta:'Descubra a AgeTech' },
  { id:'D1-agetech-ilustracao', theme:'cream', kind:'illustration', svg:illAge, tag:'AgeTech',
    head:'A distância deixou de ser um <em>problema</em>.',
    sub:'Videochamadas, teleassistência e saúde digital: a tecnologia que aproxima gerações.', cta:'Descubra a AgeTech' },
  { id:'D2-senior-friendly-ilustracao', theme:'gold', kind:'illustration', svg:illCity, tag:'Senior-Friendly',
    head:'Uma cidade boa para os 50+ é boa para <em>todos</em>.',
    sub:'Certificação Senior-Friendly para municípios, comércio e turismo.', cta:'Peça o diagnóstico' },
  { id:'E1-foto-clientes', theme:'cream', kind:'photo', mirror:false, tag:'Silver Economy', badge:'Consultoria GoldAgeing',
    head:'A geração 50+ não é o futuro. É o <em>presente</em> da economia.',
    sub:'Diagnóstico, estratégia e Certificação Senior-Friendly para municípios e empresas.', cta:'Peça o diagnóstico' },
  { id:'E2-foto-seguidores', theme:'cream', kind:'photo', mirror:true, tag:'Envelhecimento Ativo', badge:'Comunidade GoldAgeing',
    head:'Aos 50+, a melhor fase <em>começa agora</em>.',
    sub:'Ideias, dados e histórias de envelhecimento ativo. Todas as semanas, na GoldAgeing.', cta:'Siga a GoldAgeing' },
];

const page = (c, fmt) => {
  const tall = fmt === '9x16', H = tall ? 1920 : 1080, gold = c.theme === 'gold';
  const px = tall ? 72 : 64;
  const bandH = tall ? 370 : 150;
  const top = bandH + (tall ? 44 : 38), bottom = tall ? 340 : 56;
  const hs = c.kind === 'photo' ? (tall ? 74 : 50) : c.kind === 'illustration' ? (tall ? 70 : 52) : c.stat ? (tall ? 76 : 56) : (tall ? 92 : 68);
  const ss = tall ? 36 : 28, bs = tall ? 24 : 19, cs = tall ? 38 : 30;
  const col = gold ? '#ffffff' : P.text;
  const em = gold ? P.goldLight : P.gold;
  const subCol = gold ? 'rgba(255,255,255,.94)' : P.muted;

  const badge = c.badge ? `<div class="badge">${c.badge}</div>` : '';
  const h1 = `<h1>${c.head}</h1>`;
  const sub = c.sub ? `<p class="sub">${c.sub}</p>` : '';
  const stat = c.stat ? `<div class="stat"><div class="num">${c.stat}</div><div class="cap">${c.cap}</div></div>` : '';
  const cta = `<div class="cta">${c.cta} →</div>`;
  const src = c.src ? `<div class="src">${c.src}</div>` : '';

  let content;
  if (c.kind === 'illustration') {
    const cardH = tall ? 640 : 410;
    content = `<div class="main" style="gap:${tall ? 40 : 30}px"><div class="card" style="height:${cardH}px">${c.svg}</div>${h1}${sub}</div><div class="bottom">${cta}</div>`;
  } else if (c.kind === 'photo' && tall) {
    content = `<div class="main">${badge}${h1}${sub}<div class="card phototall"><div class="halo"></div><img src="${photo}" style="position:absolute;left:50%;transform:translateX(-50%);-webkit-mask-image:linear-gradient(to bottom,#000 74%,transparent 100%),linear-gradient(to right,transparent 0,#000 14%,#000 86%,transparent 100%);-webkit-mask-composite:source-in;mask-composite:intersect;top:-274px;width:614px;height:1092px"></div></div><div class="bottom">${cta}</div>`;
  } else if (c.kind === 'photo') {
    content = `<div class="two ${c.mirror ? 'rev' : ''}"><div class="col"><div class="main">${badge}${h1}${sub}</div><div class="bottom">${cta}</div></div>
      <div class="card photosq"><div class="halo"></div><img src="${photo}" style="position:absolute;left:50%;transform:translateX(-50%);bottom:0;width:522px;height:929px"></div></div>`;
  } else {
    content = `<div class="main">${badge}${c.statFirst ? stat + h1 : h1 + stat}${sub}</div><div class="bottom">${cta}${src}</div>`;
  }

  const deco = gold
    ? `<div style="position:absolute;right:-300px;bottom:${tall ? 300 : -260}px;width:760px;height:760px;border-radius:50%;background:rgba(255,255,255,.07)"></div>`
    : `<div style="position:absolute;right:-320px;bottom:${tall ? 200 : -300}px;width:800px;height:800px;border-radius:50%;background:${P.goldLight};opacity:.6"></div>`;
  const dots = c.dots ? `<div style="position:absolute;inset:0;background:radial-gradient(circle, rgba(255,255,255,.22) 2px, transparent 2.5px) 0 0/44px 44px"></div>` : '';

  return `<!doctype html><html lang="pt-PT"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:${H}px}
body{font-family:Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:${col};background:${gold ? GRAD : P.bg};position:relative;overflow:hidden}
.band{position:absolute;left:0;top:0;width:100%;height:${bandH}px;background:${gold ? 'transparent' : GRAD};${gold ? 'border-bottom:1.5px solid rgba(255,255,255,.35);' : ''}}
.head{position:absolute;left:${px}px;right:${px}px;top:${tall ? 250 : 0}px;height:${tall ? 120 : 150}px;display:flex;align-items:center;justify-content:space-between;color:#fff}
.logo{font-size:${tall ? 50 : 42}px;letter-spacing:-.5px;font-weight:500}.logo b{font-weight:900}
.tag{font-size:${tall ? 22 : 18}px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;border:1.5px solid rgba(255,255,255,.7);background:rgba(255,255,255,.16);padding:${tall ? 10 : 8}px ${tall ? 20 : 17}px;border-radius:999px}
.content{position:absolute;left:${px}px;right:${px}px;top:${top}px;bottom:${bottom}px;display:flex;flex-direction:column;gap:${tall ? 30 : 22}px}
.main{flex:1;display:flex;flex-direction:column;justify-content:center;gap:${tall ? 30 : 22}px;min-height:0}
.badge{align-self:flex-start;font-size:${bs}px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;padding:${tall ? 10 : 8}px ${tall ? 20 : 16}px;border-radius:999px;${gold ? 'background:rgba(255,255,255,.18);border:1.5px solid rgba(255,255,255,.6);color:#fff' : `background:${P.goldLight};border:1px solid ${P.border};color:${P.goldDark}`}}
h1{font-weight:900;font-size:${hs}px;line-height:1.08;letter-spacing:-${tall ? 1.5 : 1}px}h1 em{font-style:normal;color:${em}}
.sub{font-size:${ss}px;line-height:1.42;color:${subCol};font-weight:400}
.stat{background:#fff;border:1px solid ${P.border};border-left:10px solid ${gold ? P.goldDark : P.gold};border-radius:12px;padding:${tall ? 28 : 20}px ${tall ? 38 : 30}px;box-shadow:0 4px 20px rgba(0,0,0,.08);align-self:flex-start;max-width:100%}
.num{font-weight:900;color:${P.goldDark};font-size:${c.stat && c.stat.length > 8 ? (tall ? 118 : 84) : (tall ? 200 : 140)}px;line-height:1;letter-spacing:-2px}
.cap{font-size:${tall ? 32 : 26}px;line-height:1.35;color:${P.text};margin-top:10px;font-weight:500;max-width:760px}
.card{background:#fff;border:1px solid ${P.border};border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1);flex:none}
.card svg{width:100%;height:100%;display:block}
.phototall{position:relative;height:540px;background:${P.goldLight}}.photosq{position:relative;background:${P.goldLight};width:430px;flex:none}
.halo{position:absolute;inset:0;background:radial-gradient(60% 55% at 50% 38%, #fff 0%, rgba(255,255,255,0) 100%)}
.two{display:flex;gap:40px;height:100%}.two.rev{flex-direction:row-reverse}.col{flex:1;display:flex;flex-direction:column;min-width:0}
.bottom{display:flex;justify-content:space-between;align-items:flex-end;gap:24px}
.cta{font-weight:700;font-size:${cs}px;padding:${tall ? 28 : 21}px ${tall ? 50 : 38}px;border-radius:12px;${gold ? `background:#fff;color:${P.goldDark};box-shadow:0 6px 20px rgba(0,0,0,.18)` : `background:${GRAD};color:#fff;box-shadow:0 6px 20px rgba(138,101,8,.35)`}}
.src{font-size:${tall ? 22 : 18}px;color:${gold ? 'rgba(255,255,255,.88)' : P.muted};text-align:right;max-width:340px;line-height:1.35}
</style></head><body>${deco}${dots}${gold ? '' : ''}<div class="band"></div>
<div class="head"><div class="logo">Gold<b>Ageing</b></div><div class="tag">${c.tag}</div></div>
<div class="content">${content}</div></body></html>`;
};

(async () => {
  const b = await chromium.launch();
  fs.mkdirSync(`${OUT}/html/fontes`, { recursive: true });
  for (const c of items) for (const fmt of ['1x1', '9x16']) {
    const p = await b.newPage({ viewport: { width: 1080, height: fmt === '1x1' ? 1080 : 1920 } });
    const h = page(c, fmt);
    fs.writeFileSync(`${OUT}/html/fontes/${c.id}_${fmt}.html`, h.replace(photo, 'img/foto-recorte.png'));
    await p.setContent(h, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `${OUT}/${c.id}_${fmt}.png` });
    await p.close();
  }
  await b.close();
})();
