window.Data = (() => {
  const CATS = [
    { key: 'flower', label: 'Flower', color: '#99a038', icon: 'flower', blurb: 'The most iconic form of the plant. Fresh, quality, fairly priced.' },
    { key: 'vapes', label: 'Vapes', color: '#f3ae4b', icon: 'vape', blurb: 'Disposable pens, cartridges, and pods. Convenient, discreet, and potent.' },
    { key: 'prerolls', label: 'Prerolls', color: '#689a9b', icon: 'preroll', blurb: 'Joints, blunts, and infused prerolls. Ready to enjoy, no rolling required.' },
    { key: 'edibles', label: 'Edibles', color: '#ec8097', icon: 'edibles', blurb: 'Gummies, chocolates, and chews. Precise dosing, delicious flavors.' },
    { key: 'concentrates', label: 'Concentrates', color: '#ec6a4e', icon: 'concentrates', blurb: 'Live resin, rosin, sauce, and diamonds. Maximum potency, pure flavor.' },
    { key: 'drinks', label: 'Drinks', color: '#e39aa8', icon: 'drinks', blurb: 'Infused sodas, seltzers, and teas. Refreshing and fast-acting.' },
    { key: 'wellness', label: 'Wellness', color: '#9999f5', icon: 'tinctures', blurb: 'Tinctures, tablets, and balms. Measured doses, gentle effects.' },
    { key: 'gear', label: 'Gear', color: '#8a8a8a', icon: 'pills', blurb: 'Batteries, papers, pipes, and Embarc merch.' },
  ];
  const FEELS = [
    { key: 'relaxing', label: 'Relaxing', hint: 'Unwind after work' },
    { key: 'uplifting', label: 'Uplifting', hint: 'Good mood, good company' },
    { key: 'sleep', label: 'Sleep', hint: 'Out by ten' },
    { key: 'focus', label: 'Focus', hint: 'Clear head, get things done' },
    { key: 'relief', label: 'Relief', hint: 'Ease aches and tension' },
    { key: 'creative', label: 'Creative', hint: 'Music, art, ideas' },
  ];
  const STRAINS = ['Hybrid', 'Indica', 'Sativa', 'CBD'];
  const products = window.PRODUCTS || [];
  const brands = window.BRANDS || [];
  const byId = {};
  for (const p of products) byId[p.id] = p;
  const cat = k => CATS.find(c => c.key === k);
  const feel = k => FEELS.find(f => f.key === k);

  function siblings(p) {
    if (!p.group) return [p];
    return products.filter(x => x.group === p.group && x.brand === p.brand);
  }
  function stateFromURL(u = location.search) {
    const q = new URLSearchParams(u);
    return {
      cat: q.get('cat') || '', feel: q.get('feel') || '', strain: q.get('strain') || '', brand: q.get('brand') || '',
      size: q.get('size') || '', infused: q.get('infused') === '1', min: +q.get('min') || 0, max: +q.get('max') || 0,
      sale: q.get('sale') === '1', deal: q.get('deal') || '', q: q.get('q') || '', sort: q.get('sort') || 'deal',
    };
  }
  function stateToURL(s) {
    const q = new URLSearchParams();
    for (const k of ['cat', 'feel', 'strain', 'brand', 'size', 'q', 'deal']) if (s[k]) q.set(k, s[k]);
    if (s.infused) q.set('infused', '1');
    if (s.sale) q.set('sale', '1');
    if (s.min) q.set('min', s.min);
    if (s.max) q.set('max', s.max);
    if (s.sort && s.sort !== 'deal') q.set('sort', s.sort);
    const str = q.toString();
    return str ? '?' + str : '';
  }
  function matchesQuery(p, q) {
    const t = q.toLowerCase().trim();
    if (!t) return true;
    const hay = [p.name, p.brand, p.category, p.subtype, p.strain, p.effects.join(' '), p.size].join(' ').toLowerCase();
    return t.split(/\s+/).every(w => hay.includes(w));
  }
  function filter(s, date) {
    const t = Deals.today(date);
    return products.filter(p => {
      if (s.cat && p.category !== s.cat) return false;
      if (s.feel && !p.effects.includes(s.feel)) return false;
      if (s.strain && p.strain !== s.strain) return false;
      if (s.brand && p.brand !== s.brand) return false;
      if (s.size && p.size !== s.size) return false;
      if (s.infused && !p.infused) return false;
      if (s.min && p.priceOnline < s.min) return false;
      if (s.max && p.priceOnline > s.max) return false;
      if (s.deal === 'today' && !(Deals.matches(p, t) || (p.dealKind === 'day' && t.day === 'Thursday'))) return false;
      if (s.sale && Deals.priceInfo(p, date).kind === 'none') return false;
      if (s.q && !matchesQuery(p, s.q)) return false;
      return true;
    });
  }
  function sort(list, key, date) {
    const l = list.slice();
    const price = p => Deals.priceInfo(p, date).online;
    if (key === 'priceAsc') l.sort((a, b) => price(a) - price(b));
    else if (key === 'priceDesc') l.sort((a, b) => price(b) - price(a));
    else if (key === 'thc') l.sort((a, b) => b.thcNum - a.thcNum);
    else if (key === 'az') l.sort((a, b) => (a.brand + a.name).localeCompare(b.brand + b.name));
    else l.sort((a, b) => Deals.savings(b, date) - Deals.savings(a, date) || (b.image ? 1 : 0) - (a.image ? 1 : 0) || price(a) - price(b));
    return l;
  }
  function brandsIn(list) {
    const c = {};
    for (const p of list) if (p.brand) c[p.brand] = (c[p.brand] || 0) + 1;
    return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  }
  return { CATS, FEELS, STRAINS, products, brands, byId, cat, feel, siblings, stateFromURL, stateToURL, filter, sort, brandsIn, matchesQuery };
})();
