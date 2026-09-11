document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const now = Deals.now();
  const t = Deals.today(now);
  let state = Data.stateFromURL();
  let shown = 0;
  const PAGE = 24;
  let list = [];

  function set(patch) {
    state = { ...state, ...patch };
    history.replaceState(null, '', 'menu.html' + Data.stateToURL(state));
    render();
  }
  const chip = (on, label, patch, cls = '') => `<button class="chip ${cls}${on ? ' on' : ''}" data-patch='${JSON.stringify(patch)}'>${UI.esc(label)}</button>`;

  function renderFilters() {
    const pool = Data.filter({ ...state, brand: '' }, now);
    const brands = Data.brandsIn(pool);
    $('#filters').innerHTML = `
      <div class="filters-head"><h2>Filter</h2><button class="icon-btn" id="filters-close" aria-label="Close">✕</button></div>
      <h3>Search</h3>
      <input type="search" id="q-input" placeholder="Search the menu" value="${UI.esc(state.q)}">
      <h3>Deals</h3>
      <div class="chips chips-deal">
        ${chip(state.deal === 'today', `Today's 30% off (${t.short})`, { deal: state.deal === 'today' ? '' : 'today' }, 'chip-deal')}
        ${chip(state.sale, 'Everything on sale', { sale: !state.sale }, 'chip-deal')}
      </div>
      <h3>What kind</h3>
      <div class="chips">${Data.CATS.map(c => chip(state.cat === c.key, c.label, { cat: state.cat === c.key ? '' : c.key, size: '', infused: false })).join('')}</div>
      <h3>How you want to feel</h3>
      <div class="chips">${Data.FEELS.map(f => chip(state.feel === f.key, f.label, { feel: state.feel === f.key ? '' : f.key })).join('')}</div>
      <h3>Strain</h3>
      <div class="chips">${Data.STRAINS.map(s => chip(state.strain === s, s, { strain: state.strain === s ? '' : s })).join('')}</div>
      <h3>Price</h3>
      <div class="chips">
        ${chip(state.max === 20, 'Under $20', { min: 0, max: state.max === 20 ? 0 : 20 })}
        ${chip(state.max === 40 && state.min === 20, '$20 to $40', state.max === 40 ? { min: 0, max: 0 } : { min: 20, max: 40 })}
        ${chip(state.min === 40 && !state.max, '$40 and up', state.min === 40 && !state.max ? { min: 0 } : { min: 40, max: 0 })}
      </div>
      <h3>Brand</h3>
      <select id="brand-select"><option value="">All brands (${brands.length})</option>${brands.map(b => `<option value="${UI.esc(b.name)}"${state.brand === b.name ? ' selected' : ''}>${UI.esc(b.name)} (${b.count})</option>`).join('')}</select>
      <p class="mini" style="margin-top:24px"><button class="link" id="clear-all">Clear all filters</button></p>
      <button class="btn btn-block filter-toggle" id="filters-done" style="margin-top:16px">Show <span id="filter-count"></span> items</button>`;
    $('#q-input').onchange = e => set({ q: e.target.value });
    $('#brand-select').onchange = e => set({ brand: e.target.value });
    $('#clear-all').onclick = () => set({ cat: '', feel: '', strain: '', brand: '', size: '', infused: false, min: 0, max: 0, sale: false, deal: '', q: '' });
    $('#filters-done').onclick = $('#filters-close').onclick = () => document.body.classList.remove('filters-open');
  }

  function title() {
    if (state.q) return `Results for "${state.q}"`;
    const parts = [];
    if (state.deal === 'today') parts.push("Today's 30% off");
    if (state.feel) parts.push(Data.feel(state.feel).label);
    if (state.size) parts.push(state.size);
    if (state.infused) parts.push('Infused');
    parts.push(state.cat ? Data.cat(state.cat).label : (parts.length ? '' : 'Full menu'));
    if (state.brand) parts.push('by ' + state.brand);
    return parts.filter(Boolean).join(' ');
  }

  function banner() {
    const b = $('#menu-banner');
    if (state.deal === 'today') {
      b.className = 'menu-banner';
      b.innerHTML = `<div><b>${t.day}: 30% off ${t.label}.</b> Prices below already include it. Passport Club members only, and it's free to join.</div><a href="passport.html">About the club</a>`;
      b.hidden = false;
    } else if (list.length && list.every(p => p.dealKind === 'onlineOnly')) {
      b.className = 'menu-banner online';
      b.innerHTML = `<div><b>These prices are for online orders only.</b> Reserve here, then pick up. At the counter you'd pay the regular price.</div><a href="deals.html#online">How online deals work</a>`;
      b.hidden = false;
    } else if (state.cat && Deals.matches({ category: state.cat, size: t.size || '', infused: true }, t) && !state.size && !state.infused && state.deal !== 'today' && (t.size || t.infused)) {
      b.className = 'menu-banner';
      b.innerHTML = `<div><b>Today ${t.label} are 30% off.</b> Items marked "30% off today" below already show the deal price.</div><a href="menu.html?${Deals.menuQuery(t)}">Just the deal</a>`;
      b.hidden = false;
    } else b.hidden = true;
  }

  function catrow() {
    $('#catrow').innerHTML = chip(state.deal === 'today', `30% off today · ${t.short}`, { deal: state.deal === 'today' ? '' : 'today' }, 'cat-deal') +
      Data.CATS.map(c => `<button class="cat-pick${state.cat === c.key ? ' on' : ''}" data-patch='${JSON.stringify({ cat: state.cat === c.key ? '' : c.key, size: '', infused: false })}'><i><img src="assets/icons/icon-${c.icon}.svg" alt=""></i>${c.label}</button>`).join('');
  }
  function activeChips() {
    const out = [];
    if (state.q) out.push(chip(true, `"${state.q}"`, { q: '' }));
    if (state.deal === 'today') out.push(chip(true, "Today's 30% off", { deal: '' }));
    if (state.sale) out.push(chip(true, 'On sale', { sale: false }));
    if (state.cat) out.push(chip(true, Data.cat(state.cat).label, { cat: '', size: '', infused: false }));
    if (state.size) out.push(chip(true, state.size, { size: '' }));
    if (state.infused) out.push(chip(true, 'Infused', { infused: false }));
    if (state.feel) out.push(chip(true, Data.feel(state.feel).label, { feel: '' }));
    if (state.strain) out.push(chip(true, state.strain, { strain: '' }));
    if (state.min || state.max) out.push(chip(true, state.max ? (state.min ? `$${state.min} to $${state.max}` : `Under $${state.max}`) : `$${state.min} and up`, { min: 0, max: 0 }));
    if (state.brand) out.push(chip(true, state.brand, { brand: '' }));
    $('#active').innerHTML = out.join('');
    $('#filter-n').textContent = out.length;
    $('#filter-n').hidden = !out.length;
  }

  function render() {
    list = Data.sort(Data.filter(state, now), state.sort, now);
    shown = 0;
    $('#menu-title').textContent = title();
    $('#count').textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;
    $('#sort').value = state.sort;
    $('#sort-m').value = state.sort;
    $('#sort-label').textContent = $('#sort-m').selectedOptions[0].textContent;
    catrow();
    renderFilters();
    $('#filter-count').textContent = list.length;
    activeChips();
    banner();
    $('#grid').innerHTML = '';
    more();
    document.title = title() + ' · Embarc Tracy';
  }
  function more() {
    const next = list.slice(shown, shown + PAGE);
    shown += next.length;
    $('#grid').insertAdjacentHTML('beforeend', UI.grid(next, now));
    $('#empty').hidden = !!list.length;
    $('#sentinel').hidden = shown >= list.length;
    if (!list.length) {
      const alt = Data.sort(Data.filter({ ...state, cat: '', strain: '', brand: '', size: '', infused: false, min: 0, max: 0, q: '', deal: '', sale: false }, now), 'deal', now);
      $('#empty').innerHTML = `<h2>Nothing matches all of that.</h2><p>Try taking off a filter, or start from ${state.feel ? '<a class="link" href="menu.html?feel=' + state.feel + '">everything ' + Data.feel(state.feel).label.toLowerCase() + '</a>' : '<a class="link" href="menu.html">the full menu</a>'}.</p>`;
    }
  }
  new IntersectionObserver(es => { if (es[0].isIntersecting && shown < list.length) more(); }, { rootMargin: '600px' }).observe($('#sentinel'));

  document.addEventListener('click', e => {
    const c = e.target.closest('[data-patch]');
    if (c) set(JSON.parse(c.dataset.patch));
  });
  $('#sort').onchange = $('#sort-m').onchange = e => set({ sort: e.target.value });
  $('#filter-open-m').onclick = () => document.body.classList.add('filters-open');
  $('#filter-open').onclick = () => document.body.classList.add('filters-open');
  render();
});
