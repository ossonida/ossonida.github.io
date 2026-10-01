/* Shared player-count setup tab. Data: data/setup.json. */
(() => {
  const game = document.body.dataset.setupGame;
  const data = window.BGW_SETUP;
  if (!data?.games[game]) return;
  const tabs = document.getElementById('section-tabs') || document.getElementById('filters');
  const search = document.getElementById('global-search') || document.getElementById('search');
  const container = document.querySelector('.layout');
  let active = false;
  let language = document.documentElement.lang;
  const text = key => typeof key === 'object' ? key.value : (data.text[key][language] || data.text[key].en);
  const make = (tag, value, className) => {
    const node = document.createElement(tag);
    if (value !== undefined) node.textContent = value;
    if (className) node.className = className;
    return node;
  };
  const panel = make('section', undefined, 'card setup-panel');
  panel.id = 'setup-panel'; panel.hidden = true;
  const top = container.querySelector('.page-top');
  top.after(panel);
  function filter() {
    const query = search.value.trim().normalize('NFKC').toLowerCase();
    for (const row of panel.querySelectorAll('tbody tr')) row.hidden = !!query && !row.textContent.normalize('NFKC').toLowerCase().includes(query);
    const common = panel.querySelector('.setup-common');
    common.hidden = !!query && !common.textContent.normalize('NFKC').toLowerCase().includes(query);
    const any = [...panel.querySelectorAll('tbody tr')].some(row => !row.hidden) || !common.hidden;
    panel.querySelector('.setup-no-results').hidden = any;
  }
  function render() {
    const config = data.games[game];
    const heading = make('div', undefined, 'card-header');
    heading.append(make('h2', text('setup')), make('span', text('scope'), 'count-tag'));
    const wrap = make('div', undefined, 'table-wrap');
    const table = make('table', undefined, 'setup-table');
    const head = make('thead'), headRow = make('tr');
    for (const key of ['item','p2','p3','p4']) {
      const cell = make('th', text(key)); cell.setAttribute('scope','col'); headRow.append(cell);
    }
    head.append(headRow); const body = make('tbody');
    for (const values of config.rows) {
      const row = make('tr');
      values.forEach((value,index) => {const cell=make(index ? 'td':'th',text(value));if(!index)cell.setAttribute('scope','row');row.append(cell);});
      body.append(row);
    }
    table.append(head,body); wrap.append(table);
    const common = make('div',undefined,'setup-common');
    common.append(make('h3',text('common')),make('p',text(config.common)));
    const empty = make('p',text('noResults'),'setup-no-results');empty.setAttribute('role','status');
    panel.replaceChildren(heading,wrap,common,empty);filter();
  }
  function sync(lang) {
    language = lang === 'zh-CN' ? 'zh' : lang;
    let button = tabs.querySelector('[data-setup-tab]');
    if (!button) {
      button = make('button');button.type='button';button.dataset.setupTab='true';
      button.setAttribute('aria-controls','setup-panel');
      button.addEventListener('click',() => {
        active=true;document.body.classList.add('setup-mode');panel.hidden=false;
        sync(language);
      });
      tabs.append(button);
    }
    button.textContent=text('setup');button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));
    if(active) for(const other of tabs.querySelectorAll('button')) if(other!==button){other.classList.remove('is-active');other.setAttribute('aria-pressed','false');}
    render();
  }
  tabs.addEventListener('click',event => {
    const button=event.target.closest('button');
    if(!button || button.dataset.setupTab) return;
    active=false;document.body.classList.remove('setup-mode');panel.hidden=true;
    const setup=tabs.querySelector('[data-setup-tab]');setup.classList.remove('is-active');setup.setAttribute('aria-pressed','false');
  });
  search.addEventListener('input',filter);
  window.BGWSetup={sync};
  sync(language);
})();
