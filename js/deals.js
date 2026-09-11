window.Deals = (() => {
  const SCHEDULE = [
    { day: 'Sunday', cat: 'vapes', label: 'all vapes', short: 'Vapes' },
    { day: 'Monday', cat: 'edibles', label: 'all edibles', short: 'Edibles' },
    { day: 'Tuesday', cat: 'vapes', label: 'all vapes', short: 'Vapes' },
    { day: 'Wednesday', cat: 'flower', size: '3.5g', label: 'all 3.5g flower', short: '3.5g Flower' },
    { day: 'Thursday', cat: 'concentrates', label: 'all dabs (concentrates)', short: 'Dabs' },
    { day: 'Friday', cat: 'prerolls', infused: true, label: 'all infused prerolls', short: 'Infused Prerolls' },
    { day: 'Saturday', cat: 'all', label: 'everything in the store', short: 'Everything' },
  ];
  const OPEN = 9, CLOSE = 21, LAST_ORDER = 20.75;
  const CANNABIS = new Set(['flower', 'vapes', 'prerolls', 'edibles', 'concentrates', 'drinks', 'wellness']);

  function now() {
    const q = new URLSearchParams(location.search).get('now');
    let s = q;
    try { s = s || localStorage.getItem('embarc.clock'); } catch (e) {}
    if (s) { const d = new Date(s); if (!isNaN(d)) return d; }
    return new Date();
  }
  function today(d = now()) { return SCHEDULE[d.getDay()]; }
  function tomorrow(d = now()) { return SCHEDULE[(d.getDay() + 1) % 7]; }
  function afterLastOrder(d = now()) { return d.getHours() + d.getMinutes() / 60 >= LAST_ORDER; }
  function isOpen(d = now()) {
    const h = d.getHours() + d.getMinutes() / 60;
    if (h < OPEN) return { open: false, text: 'Opens today at 9am' };
    if (h >= CLOSE) return { open: false, text: 'Closed for tonight. Opens at 9am' };
    if (h >= LAST_ORDER) return { open: true, text: 'Open, but last orders were at 8:45pm' };
    return { open: true, text: 'Open now until 9pm' };
  }
  function matches(p, entry) {
    if (!CANNABIS.has(p.category)) return false;
    if (entry.cat === 'all') return true;
    if (p.category !== entry.cat) return false;
    if (entry.size && p.size !== entry.size) return false;
    if (entry.infused && !p.infused) return false;
    return true;
  }
  function menuQuery(entry) {
    if (entry.cat === 'all') return 'deal=today';
    let q = 'cat=' + entry.cat;
    if (entry.size) q += '&size=' + entry.size;
    if (entry.infused) q += '&infused=1';
    return q + '&deal=today';
  }
  const r = n => Math.round(n);
  function priceInfo(p, d = now()) {
    const t = today(d);
    if (p.dealKind === 'onlineOnly') {
      return { kind: 'onlineOnly', pct: p.dealPct, online: r(p.priceOnline), walkIn: r(p.priceWalkIn), mark: 'Online only',
        reason: `${p.dealPct}% off when you order online for pickup. This deal does not apply at the counter.` };
    }
    if (p.dealKind === 'everyday') {
      return { kind: 'everyday', pct: p.dealPct, online: r(p.priceOnline), walkIn: r(p.priceOnline), mark: `${p.dealPct}% off every day`,
        reason: `${p.dealPct}% off ${p.brand} every day for Passport Club members (free to join).` };
    }
    if (p.dealKind === 'day' && t.day === 'Thursday') {
      return { kind: 'today', pct: p.dealPct, online: r(p.priceOnline), walkIn: r(p.priceOnline), mark: `${p.dealPct}% off today`,
        reason: `${p.dealPct}% off ${p.brand} every Thursday for Passport Club members (free to join).` };
    }
    if (matches(p, t)) {
      const v = r(p.priceOnline * 0.7);
      return { kind: 'today', pct: 30, online: v, walkIn: v, mark: '30% off today', full: r(p.priceOnline),
        reason: `${t.day}s are 30% off ${t.label} for Passport Club members (free to join).` };
    }
    return { kind: 'none', pct: 0, online: r(p.priceOnline), walkIn: r(p.priceOnline), mark: '', reason: '' };
  }
  function savings(p, d = now()) {
    const i = priceInfo(p, d);
    if (i.kind === 'today' && i.full) return i.full - i.online;
    if (i.kind === 'everyday' || i.kind === 'onlineOnly') return r(p.priceOnline / (1 - p.dealPct / 100)) - i.online;
    return 0;
  }
  function nextDrop(d = now()) {
    const n = new Date(d); n.setHours(9, 0, 0, 0);
    let add = (5 - d.getDay() + 7) % 7;
    if (add === 0 && d >= n) add = 7;
    n.setDate(n.getDate() + add);
    return n;
  }
  const fmt = n => '$' + Math.round(n);
  return { SCHEDULE, now, today, tomorrow, afterLastOrder, isOpen, matches, menuQuery, priceInfo, savings, nextDrop, fmt };
})();
