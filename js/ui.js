window.UI = (() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const page = location.pathname.split('/').pop() || 'index.html';
  const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const isMember = () => get('embarc.member') === '1';

  function chrome() {
    const nav = [['menu.html', 'Menu'], ['deals.html', 'Deals'], ['passport.html', 'Passport Club'], ['index.html#visit', 'Visit']];
    const link = ([href, label]) => `<a href="${href}"${href.split('#')[0] === page && !href.includes('#') ? ' aria-current="page"' : ''}>${label}</a>`;
    const header = `
      <header class="site-header">
        <div class="wrap header-row">
          <a class="logo" href="index.html"><img src="assets/logo-embarc.webp" alt="Embarc" width="168" height="26"><span class="logo-store">Tracy</span></a>
          <nav class="top-nav">${nav.map(link).join('')}</nav>
          <form class="search" action="menu.html" role="search"><input type="search" name="q" placeholder="Search the menu" aria-label="Search the menu" value="${esc(new URLSearchParams(location.search).get('q') || '')}"></form>
          <button class="cart-btn" data-cart-open aria-label="Cart"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2l2.5 11h11L21 7H6.5"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg><span class="badge" data-cart-count hidden>0</span></button>
        </div>
      </header>`;
    const bottom = `<nav class="bottom-nav">${nav.map(link).join('')}</nav>`;
    const footer = `
      <footer class="site-footer">
        <div class="wrap">
          <div class="foot-row">
            <div><img src="assets/logo-embarc.webp" alt="Embarc" width="110"><p class="mini">2706 Pavilion Pkwy #110, Tracy, CA 95304<br>(209) 278-0420 · tracy@goembarc.com<br>Open daily 9am to 9pm. Last order 8:45pm.</p></div>
            <div class="foot-links"><a href="menu.html">Menu</a><a href="deals.html">Deals</a><a href="passport.html">Passport Club</a><a href="index.html#visit">Visit</a></div>
          </div>
          <p class="mini legal">License C10-0001397-LIC. For adults 21 and over, or 18 and over with a medical card. WARNING: Products sold here can expose you to chemicals including marijuana smoke, which is known to the State of California to cause cancer and birth defects. Concept redesign for portfolio purposes. Not affiliated with Embarc.</p>
        </div>
      </footer>`;
    const drawer = `
      <div class="scrim"></div>
      <aside class="cart-drawer" aria-label="Your pickup order">
        <div class="cart-head"><h2>Your order</h2><button class="icon-btn" data-cart-close aria-label="Close">✕</button></div>
        <div id="cart-body"></div>
      </aside>`;
    const gate = get('embarc.age') === '1' ? '' : `
      <div class="gate" id="gate">
        <div class="gate-box">
          <img src="assets/logo-embarc.webp" alt="Embarc" width="150">
          <h1>You need to be 21 to come in.</h1>
          <p>Or 18 with a medical card. We'll ask once.</p>
          <button class="btn btn-block" id="gate-yes">I'm 21 or older</button>
          <a class="link" href="https://www.google.com/search?q=cannabis+laws+california">I'm not</a>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('afterbegin', header);
    document.body.insertAdjacentHTML('beforeend', bottom + footer + drawer + gate);
    const g = document.getElementById('gate-yes');
    if (g) { document.body.classList.add('gated'); g.onclick = () => { set('embarc.age', '1'); document.getElementById('gate').remove(); document.body.classList.remove('gated'); }; }
  }

  function card(p, date) {
    const info = Deals.priceInfo(p, date);
    const c = Data.cat(p.category);
    return `
      <a class="card" href="product.html?id=${p.id}">
        <div class="card-img">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy">` : `<img src="assets/icons/icon-${c.icon}.svg" alt="" class="ph">`}</div>
        <div class="card-body">
          <div class="mini">${esc(p.brand)}</div>
          <div class="card-name">${esc(p.name)}</div>
          <div class="mini">${[p.size, p.strain, p.thcNum ? p.thcNum + '% THC' : ''].filter(Boolean).join(' · ')}</div>
          <div class="card-foot"><span class="mono price">${Deals.fmt(info.online)}</span>${info.mark ? `<span class="deal-mark">${info.mark}</span>` : ''}</div>
        </div>
      </a>`;
  }
  function grid(list, date) { return list.map(p => card(p, date)).join(''); }

  document.addEventListener('DOMContentLoaded', () => { chrome(); Cart.render(); });
  return { esc, card, grid, isMember, get, set, page };
})();
