/* Shared player-count setup tab. Data: data/setup.json. */
(() => {
  const game = document.body.dataset.setupGame;
  const data = window.BGW_SETUP;
  if (!data?.games[game]) return;
  const tabs = document.getElementById('section-tabs') || document.getElementById('filters');
  const search = document.getElementById('global-search') || document.getElementById('search');
  const container = document.querySelector('.layout');
  let selectedTab = 'all';
  let language = document.documentElement.lang;
  const text = key => typeof key === 'object' ? (key[language] || key.en || key.value) : (data.text[key][language] || data.text[key].en);
  // Player-count columns are configurable per game (default 2–4).
  const playerLabel = count => data.text[`p${count}`] ? text(`p${count}`) : text('players').replace('{n}', count);
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
  const config = data.games[game];
  const counts = config.players || [2,3,4];
  // One player count is shown at a time so the table stays two columns wide on phones.
  // The choice is remembered across games as a convenience; storage may be unavailable.
  const storageKey = 'bgwSetupPlayers';
  let selectedCount = (() => {
    try { const saved = Number(window.localStorage?.getItem(storageKey)); if (counts.includes(saved)) return saved; } catch {}
    return counts[0];
  })();
  // Korean text is stored as newline-separated lines; other languages split into sentences.
  const lines = value => (value.includes('\n') ? value.split('\n') : value.split(/(?<=[.。])\s*(?=\S)/)).map(line => line.trim()).filter(Boolean);
  const matches = (node, query) => (node.textContent+' '+(node.dataset.setupGroup || '')).normalize('NFKC').toLowerCase().includes(query);
  function filter() {
    const query = search.value.trim().normalize('NFKC').toLowerCase();
    for (const row of panel.querySelectorAll('tbody tr')) row.hidden = !!query && !matches(row, query);
    for (const group of panel.querySelectorAll('.setup-expansion')) {
      group.hidden = !!query && ![...group.querySelectorAll('tbody tr')].some(row => !row.hidden);
    }
    const common = panel.querySelector('.setup-common');
    const steps = common.querySelectorAll('li');
    for (const step of steps) step.hidden = !!query && !matches(step, query);
    common.hidden = !!query && ![...steps].some(step => !step.hidden);
    const any = [...panel.querySelectorAll('tbody tr')].some(row => !row.hidden) || !common.hidden;
    panel.querySelector('.setup-no-results').hidden = any;
  }
  function render() {
    const heading = make('div', undefined, 'card-header');
    heading.append(make('h2', text('setup')), make('span', text(config.scope || 'scope'), 'count-tag'));
    const picker = make('div', undefined, 'setup-players');
    picker.setAttribute('role', 'group'); picker.setAttribute('aria-label', text('playerCount'));
    picker.append(make('span', text('playerCount'), 'setup-players-label'));
    for (const count of counts) {
      const button = make('button', playerLabel(count));
      button.type = 'button'; button.dataset.players = String(count);
      button.setAttribute('aria-pressed', String(count === selectedCount));
      button.addEventListener('click', () => {
        selectedCount = count;
        try { window.localStorage?.setItem(storageKey, String(count)); } catch {}
        render();
        panel.querySelector(`[data-players="${count}"]`)?.focus();
      });
      picker.append(button);
    }
    const wrap = make('div', undefined, 'table-wrap');
    const table = make('table', undefined, 'setup-table');
    const head = make('thead'), headRow = make('tr');
    for (const label of [text('item'), playerLabel(selectedCount)]) {
      const cell = make('th', label); cell.setAttribute('scope','col'); headRow.append(cell);
    }
    head.append(headRow); const body = make('tbody');
    const column = counts.indexOf(selectedCount) + 1;
    for (const values of config.rows) {
      const row = make('tr');
      const name = make('th', text(values[0])); name.setAttribute('scope','row');
      row.append(name, make('td', text(values[column])));
      body.append(row);
    }
    table.append(head,body); wrap.append(table);
    const common = make('div',undefined,'setup-common');
    const steps = make('ol', undefined, 'setup-steps');
    for (const line of lines(text(config.common))) steps.append(make('li', line));
    common.append(make('h3',text('common')),steps);
    const expansionGroups = (config.expansions || []).map(expansion => {
      const group = make('section', undefined, 'setup-expansion');
      group.dataset.expansion = expansion.id;
      group.append(make('h3', text(expansion.title)), make('p', text(expansion.intro), 'setup-expansion-intro'));
      const moduleTable = make('table', undefined, 'setup-module-table');
      const moduleHead = make('thead'), moduleHeadRow = make('tr');
      for (const key of ['module','quickSetup']) {
        const cell = make('th', text(key)); cell.setAttribute('scope','col'); moduleHeadRow.append(cell);
      }
      moduleHead.append(moduleHeadRow);
      const moduleBody = make('tbody');
      for (const module of expansion.modules) {
        const row = make('tr');
        row.dataset.module = module.id;
        row.dataset.setupGroup = text(expansion.title)+' '+text(expansion.intro);
        const name = make('th', text(module.name)); name.setAttribute('scope','row');
        row.append(name, make('td', text(module.setup)));
        moduleBody.append(row);
      }
      moduleTable.append(moduleHead, moduleBody);
      group.append(moduleTable, make('p', text(expansion.sourceText), 'setup-source'));
      return group;
    });
    const empty = make('p',text('noResults'),'setup-no-results');empty.setAttribute('role','status');
    panel.replaceChildren(heading,picker,wrap,common,...expansionGroups,empty);filter();
  }
  function updateSelection() {
    const setupOnly = selectedTab === 'setup';
    document.body.classList.toggle('setup-mode', setupOnly);
    panel.hidden = selectedTab !== 'all' && !setupOnly;
    for (const button of tabs.querySelectorAll('button')) {
      const key = button.dataset.setupTab ? 'setup' : (button.dataset.show || button.dataset.category);
      const chosen = key === selectedTab;
      button.classList.toggle('is-active', chosen);
      button.setAttribute('aria-pressed', String(chosen));
    }
  }
  function sync(lang) {
    language = lang === 'zh-CN' ? 'zh' : lang;
    let button = tabs.querySelector('[data-setup-tab]');
    if (!button) {
      button = make('button');button.type='button';button.dataset.setupTab='true';
      button.setAttribute('aria-controls','setup-panel');
      tabs.append(button);
    }
    button.textContent=text('setup');
    render();
    updateSelection();
  }
  tabs.addEventListener('click',event => {
    const button=event.target.closest('button');
    if(!button) return;
    selectedTab = button.dataset.setupTab ? 'setup' : (button.dataset.show || button.dataset.category || 'all');
    updateSelection();
  });
  search.addEventListener('input',filter);
  window.BGWSetup={sync};
  sync(language);
})();
