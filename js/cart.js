window.Cart = (() => {
  const KEY = 'embarc.cart';
  const GIFTS = [[35, 'keychain'], [50, 'stash bag'], [75, 'hat']];
  const LIMIT_FLOWER_G = 28, LIMIT_CONC_G = 8;
  let items = [];
  try { items = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} render(); };

  const grams = p => { const m = /^([\d.]+)g$/.exec(p.size || ''); return m ? +m[1] : 0; };
  function totals(extra) {
    let flower = 0, conc = 0;
    const all = extra ? items.concat([extra]) : items;
    for (const it of all) {
      const p = Data.byId[it.id]; if (!p) continue;
      const g = grams(p) * it.qty;
      if (p.category === 'flower' || p.category === 'prerolls') flower += g;
      if (p.category === 'concentrates' || p.category === 'vapes') conc += g;
    }
    return { flower, conc };
  }
  function add(id, qty = 1) {
    const p = Data.byId[id]; if (!p) return { ok: false, reason: 'Product not found.' };
    const t = totals({ id, qty });
    if (t.flower > LIMIT_FLOWER_G) return { ok: false, reason: `That would put your order over the 1 oz (28g) daily limit for flower and prerolls.` };
    if (t.conc > LIMIT_CONC_G) return { ok: false, reason: `That would put your order over the 8g daily limit for concentrates and vapes.` };
    const ex = items.find(i => i.id === id);
    if (ex) ex.qty += qty; else items.push({ id, qty });
    save();
    return { ok: true };
  }
  function setQty(id, qty) {
    const it = items.find(i => i.id === id); if (!it) return;
    if (qty <= 0) { items = items.filter(i => i.id !== id); save(); return; }
    const diff = qty - it.qty;
    if (diff > 0) { const r = add(id, diff); if (!r.ok) { toast(r.reason); } return; }
    it.qty = qty; save();
  }
  const remove = id => { items = items.filter(i => i.id !== id); save(); };
  const clear = () => { items = []; save(); };
  const count = () => items.reduce((a, i) => a + i.qty, 0);
  function summary() {
    let subtotal = 0, saved = 0, onlineOnly = false;
    const rows = items.map(it => {
      const p = Data.byId[it.id]; const info = Deals.priceInfo(p);
      subtotal += info.online * it.qty; saved += Deals.savings(p) * it.qty;
      if (info.kind === 'onlineOnly') onlineOnly = true;
      return { p, qty: it.qty, info };
    });
    return { rows, subtotal, saved, onlineOnly };
  }
  function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3200);
  }
  function open() { document.body.classList.add('cart-open'); render(); }
  function close() { document.body.classList.remove('cart-open'); }
  function render() {
    for (const el of document.querySelectorAll('[data-cart-count]')) { const c = count(); el.textContent = c; el.hidden = !c; }
    const box = document.getElementById('cart-body'); if (!box) return;
    const s = summary();
    if (!s.rows.length) {
      box.innerHTML = `<div class="cart-empty"><p>Nothing here yet.</p><a class="btn" href="menu.html?${Deals.menuQuery(Deals.today())}">See today's deal</a><a class="btn btn-ghost" href="menu.html">Browse the menu</a></div>`;
      return;
    }
    const next = GIFTS.find(([amt]) => s.subtotal < amt);
    const pct = Math.min(100, s.subtotal / 75 * 100);
    box.innerHTML = `
      <ul class="cart-list">${s.rows.map(({ p, qty, info }) => `
        <li class="cart-row">
          <a href="product.html?id=${p.id}" class="cart-thumb">${p.image ? `<img src="${p.image}" alt="">` : ''}</a>
          <div class="cart-info">
            <div class="mini">${UI.esc(p.brand)}</div>
            <a href="product.html?id=${p.id}" class="cart-name">${UI.esc(p.name)}</a>
            <div class="mini">${UI.esc(p.size)}${info.kind === 'onlineOnly' ? ' · Online only' : ''}</div>
            <div class="cart-controls">
              <span class="stepper"><button data-qty="${p.id}" data-d="-1" aria-label="Less">−</button><b>${qty}</b><button data-qty="${p.id}" data-d="1" aria-label="More">+</button></span>
              <button class="link" data-remove="${p.id}">Remove</button>
            </div>
          </div>
          <div class="cart-price mono">${Deals.fmt(info.online * qty)}</div>
        </li>`).join('')}
      </ul>
      ${s.saved ? `<p class="cart-saved">Passport Club saves you ${Deals.fmt(s.saved)} on this order.</p>` : ''}
      <div class="gift">
        <div class="gift-bar"><i style="width:${pct}%"></i>${GIFTS.map(([amt, g]) => `<span class="gift-mark${s.subtotal >= amt ? ' hit' : ''}" style="left:${amt / 75 * 100}%" title="${g}"></span>`).join('')}</div>
        <div class="gift-labels">${GIFTS.map(([amt, g]) => `<span>$${amt} ${g}</span>`).join('')}</div>
        <p class="mini">${next ? `Add ${Deals.fmt(next[0] - s.subtotal)} more for a free ${next[1]}.` : 'You get the free hat. Nice.'}</p>
      </div>
      <div class="paybox">
        ${s.onlineOnly ? `<p class="paybox-note">Some of these are online-only prices. Reserve here first, then pick up. Walking in without an order means the regular price.</p>` : ''}
        <div class="payrow"><span>Subtotal</span><b class="mono">${Deals.fmt(s.subtotal)}</b></div>
        <p class="mini">Prices include tax. Paying by debit adds a $5 fee. Cash has no fee.</p>
      </div>
      <a class="btn btn-block" href="reserved.html" id="reserve-btn">Reserve for pickup</a>
      <p class="mini center">Ready in 15 minutes at Tracy. Bring your ID.</p>`;
  }
  document.addEventListener('click', e => {
    const q = e.target.closest('[data-qty]');
    if (q) { const it = items.find(i => i.id === q.dataset.qty); if (it) setQty(it.id, it.qty + +q.dataset.d); return; }
    const r = e.target.closest('[data-remove]');
    if (r) { remove(r.dataset.remove); return; }
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); open(); return; }
    if (e.target.closest('[data-cart-close]') || e.target.classList.contains('scrim')) { close(); return; }
  });
  return { items: () => items, add, setQty, remove, clear, count, summary, open, close, render, toast, GIFTS };
})();
