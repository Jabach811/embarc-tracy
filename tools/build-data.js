// Reads research/menu/*.json and writes data/products.json + data/brands.json for the site.
// Run: node tools/build-data.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const raw = JSON.parse(fs.readFileSync(path.join(root, 'research/menu/products.json'), 'utf8'));
const brandsRaw = JSON.parse(fs.readFileSync(path.join(root, 'research/menu/brands.json'), 'utf8')).brands;

const CATEGORY = {
  CARTRIDGE: 'vapes', PREROLL: 'prerolls', FLOWER: 'flower', EDIBLE: 'edibles',
  EXTRACT: 'concentrates', BEVERAGE: 'drinks', PILL: 'wellness', TINCTURE: 'wellness',
  TOPICAL: 'wellness', MERCH: 'gear', PLANT: 'gear',
};

const KEEP_UPPER = new Set(['THC', 'CBD', 'CBN', 'CBG', 'THCV', 'OG', 'XL', 'AIO', 'USB', 'RSO', 'PBR', 'LA', 'SFV', 'GMO', 'AK', 'GG4', 'MAC', 'GSC', 'NYC', 'CA', 'CBC', 'CBDA', 'THCA', 'CBDV']);
const SMALL = new Set(['and', 'or', 'of', 'the', 'x', 'with', 'in', 'a']);

const EFFECT_WORDS = {
  relaxing: /relax|calm|mellow|unwind|chill|soothing|laid-back|tranquil/i,
  sleep: /sleep|sedat|bedtime|nighttime|night-time|insomnia|wind down|rest(ful|ing)|cbn/i,
  uplifting: /uplift|energ|happy|euphor|mood|daytime|social|cheer|bright/i,
  focus: /focus|clear-headed|productiv|alert|motivat|concentrat/i,
  creative: /creativ|inspir|imaginat/i,
  relief: /relief|pain|sore|inflamm|stress|anxi|recover|ache|tension|discomfort/i,
};
const STRAIN_EFFECTS = {
  INDICA: ['relaxing', 'sleep'],
  SATIVA: ['uplifting', 'focus', 'creative'],
  HYBRID: ['relaxing', 'uplifting'],
  CBD: ['relief'],
};

const SUBTYPES = [
  ['live rosin', /live rosin/i], ['live resin', /live resin/i], ['diamonds', /diamond/i], ['badder', /badder|batter/i],
  ['sauce', /sauce/i], ['hash', /hash/i], ['sugar', /sugar/i],
  ['pod', /\bpod\b/i], ['disposable', /disposable|\baio\b|all-in-one|all in one|ready to use/i], ['cartridge', /cart(ridge)?\b/i], ['battery', /batter(y|ies)/i],
  ['gummy', /gumm/i], ['chocolate', /chocolate/i], ['mint', /\bmints?\b/i], ['cookie', /cookie/i], ['chew', /chew/i],
  ['infused', /infused/i], ['smalls', /smalls/i], ['pre-ground', /pre-?ground|shake/i], ['blunt', /blunt/i],
  ['seltzer', /seltzer/i], ['soda', /soda/i], ['lemonade', /lemonade/i], ['tea', /\btea\b/i], ['shot', /\bshot/i], ['juice', /juice/i],
  ['tablet', /tablet/i], ['capsule', /capsule/i], ['tincture', /tincture|dropper/i], ['balm', /balm/i], ['cream', /cream/i],
  ['shirt', /shirt|tee\b/i], ['hoodie', /hoodie|sweat/i], ['hat', /\bhat\b|beanie|cap\b/i], ['papers', /paper|cones?\b|wraps?\b/i], ['pipe', /pipe|bong|rig\b/i], ['clone', /clone|plant/i],
];

function titleCase(s) {
  return s.toLowerCase().split(/\s+/).filter(Boolean).map((w, i) => {
    const up = w.toUpperCase();
    if (KEEP_UPPER.has(up)) return up;
    if (/^\d+:\d+/.test(w)) return up;
    if (w.includes(':')) return w.split(':').map(t => KEEP_UPPER.has(t.toUpperCase()) ? t.toUpperCase() : t).join(':');
    if (i > 0 && SMALL.has(w)) return w;
    return w.replace(/(^|[-/])([a-z])/g, (m, p, c) => p + c.toUpperCase());
  }).join(' ');
}

function normSize(s) {
  if (!s) return '';
  let t = s.toUpperCase().replace(/\s+/g, '');
  t = t.replace(/^([\d.]+)G$/, '$1g').replace(/^([\d.]+)MG$/, '$1mg').replace(/^([\d.]+)ML$/, '$1ml')
    .replace(/^([\d.]+)OZ$/, '$1oz').replace(/^([\d.]+)FLOZ$/, '$1 fl oz').replace(/^([\d.]+)(PK|PACK)$/, '$1 pack');
  if (t === 'ONESIZE') return '';
  return t;
}

function cleanName(rawName, brand) {
  rawName = rawName.replace(/^\(E\)\s*/i, '');
  let n = rawName.replace(/\s+/g, ' ').trim();
  let size = '';
  const br = n.match(/\[([^\]]+)\]/);
  if (br) size = br[1];
  n = n.replace(/\s*\[[^\]]*\]\s*/g, ' ');
  // strip trailing " - 1 G", " - 100 MG", " - ONE SIZE", " - 10 PACK", possibly repeated
  n = n.replace(/(\s*-\s*(\d[\d.]*\s?(G|MG|ML|OZ|FL ?OZ|PACK|PK)|ONE SIZE|\d+\s?PACK))+\s*$/i, '');
  n = n.replace(/^\(E\)\s*/i, '');
  if (brand) {
    const b = brand.replace(/[^A-Z0-9 ]/gi, '').trim();
    const re = new RegExp('^' + b.replace(/\s+/g, '\\s*') + '\\s*[-:]?\\s*', 'i');
    n = n.replace(re, '');
    const re2 = new RegExp('^' + brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[-:]?\\s*', 'i');
    n = n.replace(re2, '');
  }
  n = n.replace(/\b(\d+)PK\b/gi, '$1 pack').replace(/\b(\d+)FLOZ\b/gi, '$1 fl oz');
  let name;
  if (br) {
    const [type, variant] = rawName.split(/\[[^\]]*\]/).map(s => s.replace(/(\s*-\s*(\d[\d.]*\s?(G|MG|ML|OZ|FL ?OZ|PACK|PK)|ONE SIZE))+\s*$/i, '').trim());
    let t = type.replace(/\b(\d+)PK\b/gi, '$1 pack').replace(/\b(\d+)FLOZ\b/gi, '$1 fl oz');
    if (brand) t = t.replace(new RegExp('^' + brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[-:]?\\s*', 'i'), '');
    name = variant ? `${titleCase(variant)} ${titleCase(t)}` : titleCase(t);
  } else {
    name = titleCase(n);
  }
  name = name.replace(/\s+-\s*$/, '').replace(/\s{2,}/g, ' ').trim();
  return { name, size };
}

function sentenceCase(s) {
  if (!s) return '';
  s = s.replace(/\s+/g, ' ').trim();
  if (s === s.toUpperCase() && s.length > 20) s = s.toLowerCase().replace(/(^|\.\s+)([a-z])/g, (m, p, c) => p + c.toUpperCase());
  return s;
}

function effectsFor(p) {
  const text = `${p.description || ''} ${p.name}`;
  const found = Object.keys(EFFECT_WORDS).filter(k => EFFECT_WORDS[k].test(text));
  if (found.length) return { effects: found, inferred: false };
  const byStrain = STRAIN_EFFECTS[p.type] || [];
  return { effects: byStrain, inferred: true };
}

function dealFor(label) {
  const l = (label || '').replace(/�| /g, ' ').replace(/\s+/g, ' ').trim();
  if (!l) return { kind: 'none', pct: 0, text: '' };
  const m = l.match(/(\d+)\s*%/);
  const pct = m ? +m[1] : 30;
  if (/^SUPER VALUE MENU/i.test(l)) return { kind: 'onlineOnly', pct, text: `${pct}% off, online orders only` };
  if (/DAILY DEALS/i.test(l)) {
    const day = (l.match(/^(MON|TUES|WEDNES|THURS|FRI|SATUR|SUN)DAY/i) || [])[0] || '';
    return { kind: 'day', pct, day: day ? day[0] + day.slice(1).toLowerCase() : '', text: `${pct}% off ${day ? 'every ' + day[0] + day.slice(1).toLowerCase() : 'today'}` };
  }
  if (/VALUE MENU/i.test(l)) return { kind: 'everyday', pct, text: `${pct}% off every day` };
  return { kind: 'everyday', pct, text: `${pct}% off every day` };
}

const brandLogo = {};
for (const b of brandsRaw) brandLogo[b.name] = b.image || '';

const out = raw.map(p => {
  const { name, size: bracketSize } = cleanName(p.name, p.brand);
  const size = normSize(bracketSize || p.size);
  const category = CATEGORY[p.category] || 'gear';
  const deal = dealFor(p.discount);
  const priceOnline = +p.price;
  const priceWalkIn = deal.kind === 'onlineOnly' ? +(priceOnline / (1 - deal.pct / 100)).toFixed(2) : priceOnline;
  const { effects, inferred } = effectsFor(p);
  const sub = SUBTYPES.find(([, re]) => re.test(p.name));
  const thc = parseFloat(p.thc) || 0;
  return {
    id: p.id,
    brand: titleCase(p.brand || ''),
    brandLogo: brandLogo[p.brand] || '',
    name,
    size,
    category,
    subtype: sub ? sub[0] : '',
    strain: p.type ? p.type[0] + p.type.slice(1).toLowerCase() : '',
    thc: p.thc || '',
    thcNum: thc,
    cbd: p.cbd || '',
    effects,
    effectsInferred: inferred,
    infused: /infused/i.test(p.name),
    priceOnline,
    priceWalkIn,
    dealKind: deal.kind,
    dealPct: deal.pct,
    dealText: deal.text,
    dealDay: deal.day || '',
    group: p.group || '',
    image: p.image || '',
    description: sentenceCase(p.description),
    slug: p.slug,
  };
});

fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data/products.json'), JSON.stringify(out));
fs.writeFileSync(path.join(root, 'data/brands.json'), JSON.stringify(brandsRaw.map(b => ({ name: titleCase(b.name), raw: b.name, slug: b.slug, logo: b.image || '', count: b.productCount }))));

const cats = {};
for (const p of out) cats[p.category] = (cats[p.category] || 0) + 1;
console.log('products', out.length, cats);
console.log('inferred effects', out.filter(p => p.effectsInferred).length);
console.log('deals', out.reduce((a, p) => (a[p.dealKind] = (a[p.dealKind] || 0) + 1, a), {}));
fs.writeFileSync(path.join(root, 'data/products.js'), 'window.PRODUCTS=' + JSON.stringify(out) + ';');
fs.writeFileSync(path.join(root, 'data/brands.js'), 'window.BRANDS=' + fs.readFileSync(path.join(root, 'data/brands.json'), 'utf8') + ';');
