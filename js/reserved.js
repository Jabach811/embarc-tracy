document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const now = Deals.now();
  let order = null;
  try { order = JSON.parse(localStorage.getItem('embarc.lastOrder') || 'null'); } catch (e) {}
  const s = Cart.summary();
  if (s.rows.length) {
    const late = Deals.afterLastOrder(now);
    const ready = new Date(now.getTime() + 15 * 60000);
    if (late || !Deals.isOpen(now).open) { ready.setDate(ready.getDate() + (now.getHours() >= 9 ? 1 : 0)); ready.setHours(9, 0, 0, 0); }
    order = {
      code: 'TR-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      placed: now.toISOString(), ready: ready.toISOString(),
      rows: s.rows.map(r => ({ id: r.p.id, name: r.p.name, brand: r.p.brand, size: r.p.size, qty: r.qty, price: r.info.online, onlineOnly: r.info.kind === 'onlineOnly' })),
      subtotal: s.subtotal, saved: s.saved, onlineOnly: s.onlineOnly,
    };
    try { localStorage.setItem('embarc.lastOrder', JSON.stringify(order)); } catch (e) {}
    Cart.clear();
  }
  const root = $('#receipt');
  if (!order) { root.innerHTML = `<h1>No order yet.</h1><p>Add something from the menu and reserve it for pickup.</p><a class="btn" href="menu.html">Browse the menu</a>`; return; }
  const ready = new Date(order.ready);
  const sameDay = ready.toDateString() === now.toDateString();
  const time = ready.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  root.innerHTML = `
    <div class="eyebrow">Reserved</div>
    <h1>See you ${sameDay ? 'in about 15 minutes' : 'tomorrow at 9am'}.</h1>
    <p>We're setting it aside now. Head to the counter at Embarc Tracy and give them the code below.</p>
    <div class="ticket">
      <div class="payrow"><span>Pickup code</span><b class="mono">${order.code}</b></div>
      <div class="payrow"><span>Ready ${sameDay ? 'today' : ready.toLocaleDateString([], { weekday: 'long' })}</span><b class="mono">${time}</b></div>
      <ul>${order.rows.map(r => `<li><span>${r.qty} × ${UI.esc(r.name)}<small>${UI.esc(r.brand)}${r.size ? ' · ' + r.size : ''}${r.onlineOnly ? ' · online price' : ''}</small></span><span class="mono">${Deals.fmt(r.price * r.qty)}</span></li>`).join('')}</ul>
      <div class="total"><span>Total at pickup</span><span class="mono">${Deals.fmt(order.subtotal)}</span></div>
      ${order.saved ? `<p class="mini" style="margin:8px 0 0">Passport Club saved you ${Deals.fmt(order.saved)}.</p>` : ''}
    </div>
    ${order.onlineOnly ? `<p class="paybox-note"><b>This order has online-only prices.</b> They're locked in because you reserved. Don't cancel and re-order at the counter, or the regular price applies.</p>` : ''}
    <h3>Bring</h3>
    <ol class="bring">
      <li>Your ID. 21 and over, or 18 with a medical card.</li>
      <li>${Deals.fmt(order.subtotal)} in cash, or a debit card. Debit adds a $5 fee, so ${Deals.fmt(order.subtotal + 5)} by card.</li>
      <li>Your pickup code, or the phone you ordered on.</li>
    </ol>
    <p class="mini">We hold reservations until close, 9pm. Prices include tax. Deals are for Passport Club members, and joining at the counter is free.</p>
    <p><a class="btn btn-ghost" href="index.html#visit">Directions</a> <a class="btn" href="menu.html" style="margin-left:8px">Back to the menu</a></p>`;
});
