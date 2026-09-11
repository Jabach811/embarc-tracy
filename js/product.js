document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const now = Deals.now();
  const id = new URLSearchParams(location.search).get('id');
  const p = Data.byId[id];
  const root = $('#pdp');
  if (!p) { root.innerHTML = `<div class="empty" style="grid-column:1/-1"><h2>We couldn't find that one.</h2><p><a class="link" href="menu.html">Back to the menu</a></p></div>`; return; }
  const c = Data.cat(p.category);
  const info = Deals.priceInfo(p, now);
  const sibs = Data.siblings(p).filter(s => s.size && s.size !== p.size || s.id === p.id);
  const late = Deals.afterLastOrder(now);
  document.title = `${p.name} by ${p.brand} · Embarc Tracy`;
  let qty = 1;

  const payRows = () => {
    if (info.kind === 'onlineOnly') return `
      <div class="payrow"><span>Order online, pick up</span><b class="mono">${Deals.fmt(info.online)}</b></div>
      <div class="payrow"><span>Walk in without an order</span><b class="mono">${Deals.fmt(info.walkIn)}</b></div>`;
    if (info.kind === 'today') return `
      <div class="payrow"><span>Online or in store, today</span><b class="mono">${info.full ? `<s>${Deals.fmt(info.full)}</s>` : ''}${Deals.fmt(info.online)}</b></div>`;
    if (info.kind === 'everyday') return `
      <div class="payrow"><span>Online or in store</span><b class="mono">${Deals.fmt(info.online)}</b></div>`;
    return `<div class="payrow"><span>Online or in store</span><b class="mono">${Deals.fmt(info.online)}</b></div>`;
  };

  root.innerHTML = `
    <div class="pdp-img">${p.image ? `<img src="${UI.esc(p.image)}" alt="${UI.esc(p.name)}">` : `<img class="ph" src="assets/icons/icon-${c.icon}.svg" alt="">`}</div>
    <div>
      <div class="crumbs"><a href="menu.html">Menu</a> / <a href="menu.html?cat=${c.key}">${c.label}</a>${p.subtype ? ` / ${UI.esc(p.subtype[0].toUpperCase() + p.subtype.slice(1))}` : ''}</div>
      <div class="brand-line"><a href="menu.html?brand=${encodeURIComponent(p.brand)}" class="link">${UI.esc(p.brand)}</a></div>
      <h1>${UI.esc(p.name)}</h1>
      <p class="facts">${[p.strain, p.thcNum ? p.thcNum + '% THC' : '', p.cbd && p.cbd !== '0%' && p.cbd !== '0.00%' ? UI.esc(p.cbd) + ' CBD' : ''].filter(Boolean).join(' · ')}${p.effects.length ? '<span class="sep"></span>' + p.effects.map(e => `<a href="menu.html?feel=${e}">${Data.feel(e).label}</a>`).join(', ') : ''}</p>
      ${p.effectsInferred && p.effects.length ? `<p class="mini" style="margin-top:-12px">Feel is a guess based on the strain type. Ask a Guide if you want to be sure.</p>` : ''}
      ${sibs.length > 1 ? `<div class="sizes">${sibs.sort((a, b) => a.priceOnline - b.priceOnline).map(s => `<a href="product.html?id=${s.id}" class="${s.id === p.id ? 'on' : ''}">${UI.esc(s.size || s.name)} <span class="mono">${Deals.fmt(Deals.priceInfo(s, now).online)}</span></a>`).join('')}</div>` : (p.size ? `<p class="mini">${UI.esc(p.size)}</p>` : '')}
      <div class="paybox${info.kind === 'onlineOnly' ? ' online' : ''}">
        <h3>What you'll pay</h3>
        ${info.kind === 'onlineOnly' ? `<p class="paybox-note"><b>This deal is online only.</b> Reserve it here and the ${Deals.fmt(info.online)} price is locked in. If you just walk in, it's ${Deals.fmt(info.walkIn)}.</p>` : ''}
        ${payRows()}
        <p class="mini">Prices include tax. Cash has no fee. Debit adds $5 per order.</p>
      </div>
      ${info.reason ? `<p class="reason">${info.reason}</p>` : ''}
      ${info.kind === 'today' && !late ? `<p class="reason">Deal ends tonight at close. Reserve now and the price holds for pickup today.</p>` : ''}
      <div class="buy">
        <span class="stepper"><button id="less" aria-label="Less">−</button><b id="qty">1</b><button id="more" aria-label="More">+</button></span>
        <button class="btn btn-orange" id="add">${late ? 'Add to tomorrow\'s order' : 'Reserve for pickup'}</button>
      </div>
      <p class="mini">${late ? 'Last orders were at 8:45pm. Anything you reserve now is ready when we open at 9am.' : 'Ready in about 15 minutes. No payment online, you pay at pickup.'}</p>
      ${p.description ? `<div class="desc"><h2>About this one</h2><p>${UI.esc(p.description)}</p></div>` : ''}
    </div>`;

  $('#less').onclick = () => { qty = Math.max(1, qty - 1); $('#qty').textContent = qty; };
  $('#more').onclick = () => { qty += 1; $('#qty').textContent = qty; };
  $('#add').onclick = () => {
    const r = Cart.add(p.id, qty);
    if (!r.ok) { Cart.toast(r.reason); return; }
    Cart.open();
  };

  const related = Data.sort(Data.products.filter(x => x.id !== p.id && x.category === p.category && x.image && (x.effects.some(e => p.effects.includes(e)) || x.brand === p.brand)), 'deal', now).slice(0, 12);
  $('#related').innerHTML = UI.grid(related, now);
  $('#related-link').href = `menu.html?cat=${c.key}${p.effects[0] ? '&feel=' + p.effects[0] : ''}`;
});
