document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const now = Deals.now();
  const t = Deals.today(now);
  $('#today-line').textContent = `Today that means 30% off ${t.label}.`;
  $('#today-link').href = 'menu.html?' + Deals.menuQuery(t);
  $('#week').innerHTML = Deals.SCHEDULE.map((e, i) => `<div class="${i === now.getDay() ? 'today' : ''}"><b>${e.day}</b><span>${e.short}</span></div>`).join('');

  const box = $('#join');
  function joined() {
    box.className = 'joined';
    box.innerHTML = `<h2>You're in.</h2><p>Member prices show everywhere on this site from now on. Show your phone number at the counter and the same prices apply in store.</p><a class="btn" href="menu.html?${Deals.menuQuery(t)}">Shop today's deal</a> <button class="link" id="leave" style="margin-left:14px">Not me</button>`;
    $('#leave').onclick = () => { UI.set('embarc.member', '0'); location.reload(); };
  }
  $('#join-form').onsubmit = e => {
    e.preventDefault();
    UI.set('embarc.member', '1');
    joined();
  };
  if (UI.isMember()) joined();

  const brands = Data.brandsIn(Data.products.filter(p => p.dealKind === 'everyday'));
  const logo = n => (Data.brands.find(b => b.name === n) || {}).logo;
  $('#brands').innerHTML = brands.map(b => {
    const pct = Data.products.find(p => p.brand === b.name && p.dealKind === 'everyday').dealPct;
    return `<a href="menu.html?brand=${encodeURIComponent(b.name)}&sale=1">${logo(b.name) ? `<img src="${logo(b.name)}" alt="">` : ''}<span>${UI.esc(b.name)}</span><small>${pct}% off every day</small></a>`;
  }).join('');
});
