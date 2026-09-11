document.addEventListener('DOMContentLoaded', () => {
  const now = Deals.now();
  const t = Deals.today(now);
  const open = Deals.isOpen(now);
  const $ = s => document.querySelector(s);

  $('#status').textContent = open.text;
  $('#status').classList.toggle('closed', !open.open);

  const todayList = Data.sort(Data.products.filter(p => Deals.priceInfo(p, now).kind === 'today' && p.image), 'deal', now);
  const late = Deals.afterLastOrder(now);
  const tm = Deals.tomorrow(now);
  $('#hero-deal').innerHTML = late
    ? `<div class="eyebrow">Last orders were at 8:45pm</div><h2>Tomorrow: 30% off ${tm.label}.</h2><p class="mini">Passport Club members only. Free to join at the counter or online.</p><a class="btn" href="menu.html?${Deals.menuQuery(tm)}">Browse tomorrow's deal</a>`
    : `<div class="eyebrow">Today, ${t.day}</div><h2>30% off ${t.label}.</h2><p class="mini">For Passport Club members. Free to join, takes a minute.</p><a class="btn" href="menu.html?${Deals.menuQuery(t)}">Shop today's deal</a><p class="mini">${todayList.length} items qualify. Order online, pick up in 15 minutes.</p>`;

  $('#today-rail').innerHTML = UI.grid(todayList.slice(0, 12), now);
  $('#today-link').href = 'menu.html?' + Deals.menuQuery(t);
  $('#today-title').textContent = late ? `Tomorrow's deal, ${tm.short}` : `Today's deal, ${t.short}`;
  if (late) { const tmList = Data.products.filter(p => Deals.matches(p, tm) && p.image); $('#today-rail').innerHTML = UI.grid(tmList.filter(p => p.dealKind === 'none').concat(tmList.filter(p => p.dealKind !== 'none')).slice(0, 12), now); }

  $('#feels').innerHTML = Data.FEELS.map(f => `<a class="feel" href="menu.html?feel=${f.key}">${f.label}</a>`).join('');
  $('#cats').innerHTML = Data.CATS.map(c => `<a class="cat" href="menu.html?cat=${c.key}" style="background:${c.color}"><img src="assets/icons/icon-${c.icon}.svg" alt=""><span>${c.label}<small>${Data.products.filter(p => p.category === c.key).length} items</small></span></a>`).join('');

  const online = Data.sort(Data.products.filter(p => p.dealKind === 'onlineOnly'), 'deal', now);
  $('#online-rail').innerHTML = UI.grid(online.slice(0, 12), now);

  const under = Data.sort(Data.products.filter(p => Deals.priceInfo(p, now).online <= 20 && p.image && p.category !== 'gear' && p.dealKind !== 'onlineOnly'), 'deal', now);
  $('#under-rail').innerHTML = UI.grid(under.slice(0, 12), now);

  $('#week').innerHTML = Deals.SCHEDULE.map((d, i) => `<div class="${i === now.getDay() ? 'today' : ''}"><b>${d.day.slice(0, 3)}</b><span>${d.short}</span></div>`).join('');
});
