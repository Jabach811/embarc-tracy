document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const now = Deals.now();
  const t = Deals.today(now);
  const tm = Deals.tomorrow(now);
  const late = Deals.afterLastOrder(now);
  const d = late ? tm : t;

  $('#deal-card').innerHTML = `
    <div>
      <div class="eyebrow">${late ? `Tomorrow, ${tm.day}` : `Today, ${t.day}`}</div>
      <h2>30% off ${d.label}.</h2>
      <p class="mini">Passport Club members only. Free to join. ${late ? 'Last orders were at 8:45pm, so this one is for tomorrow.' : 'Ends at close tonight.'}</p>
    </div>
    <a class="btn" href="menu.html?${Deals.menuQuery(d)}">Shop ${late ? "tomorrow's" : "today's"} deal</a>`;
  const inDeal = Data.products.filter(p => Deals.matches(p, d) && p.image);
  $('#today-rail').innerHTML = UI.grid(inDeal.filter(p => p.dealKind === 'none').concat(inDeal.filter(p => p.dealKind !== 'none')).slice(0, 12), now);
  $('#today-link').href = 'menu.html?' + Deals.menuQuery(d);

  $('#week').innerHTML = Deals.SCHEDULE.map((e, i) => `<div class="${i === now.getDay() ? 'today' : ''}"><b>${e.day}</b><span>${e.short}</span></div>`).join('');

  const online = Data.sort(Data.products.filter(p => p.dealKind === 'onlineOnly'), 'deal', now);
  $('#online-rail').innerHTML = UI.grid(online, now);
  $('#online-count').textContent = online.length;

  const everyday = Data.sort(Data.products.filter(p => p.dealKind === 'everyday' && p.image), 'deal', now);
  $('#everyday-rail').innerHTML = UI.grid(everyday.slice(0, 16), now);

  const drop = Deals.nextDrop(now);
  const isFriday = now.getDay() === 5 && Deals.isOpen(now).open;
  function tick() {
    const n = Deals.now();
    const ms = drop - n;
    if (isFriday) { $('#countdown').textContent = 'Available now, while they last'; return; }
    const days = Math.floor(ms / 86400000), h = Math.floor(ms % 86400000 / 3600000), m = Math.floor(ms % 3600000 / 60000);
    $('#countdown').textContent = `${days ? days + 'd ' : ''}${h}h ${m}m until Friday 9am`;
  }
  tick(); setInterval(tick, 30000);
});
