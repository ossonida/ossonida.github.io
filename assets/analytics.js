/* Shared GA4 tracking and browser-local owner exclusion. */
(() => {
  'use strict';
  const id = 'G-NFEYJ27K5H', key = 'bgwAnalyticsExcluded';
  const params = new URLSearchParams(window.location.search);
  let excluded = false, stored = true;
  try {
    if (params.get('analytics') === 'off') localStorage.setItem(key, '1');
    if (params.get('analytics') === 'on') localStorage.removeItem(key);
    excluded = localStorage.getItem(key) === '1';
  } catch { stored = false; excluded = params.get('analytics') === 'off'; }
  window['ga-disable-' + id] = excluded;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (!excluded) {
    window.gtag('js', new Date());
    window.gtag('config', id);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
  }
  const game = () => document.body.dataset.setupGame || window.location.pathname.split('/').filter(Boolean).filter(p => p !== 'games')[0] || 'home';
  const track = (name, extra = {}) => {
    if (!excluded) window.gtag('event', name, { game_id: game(), language: document.documentElement.lang, transport_type: 'beacon', ...extra });
  };
  const tabKey = button => button.dataset.setupTab ? 'setup' : button.dataset.show || button.dataset.category || 'all';
  function ready() {
    const footer = document.querySelector('footer') || document.body;
    const settings = document.createElement('div');
    settings.className = 'analytics-settings';
    const button = document.createElement('button');
    button.type = 'button';
    const status = document.createElement('span');
    status.setAttribute('role', 'status');
    function label() {
      const ko = document.documentElement.lang.startsWith('ko');
      button.textContent = ko ? (excluded ? '내 방문 집계 켜기' : '내 방문 집계 제외') : (excluded ? 'Count my visits' : 'Exclude my visits');
      button.setAttribute('aria-pressed', String(excluded));
      status.textContent = ko ? (excluded ? '이 브라우저의 방문 집계 제외 중' : '이 브라우저의 방문 집계 중') : (excluded ? 'Visits excluded in this browser' : 'Visits counted in this browser');
      if (!stored) status.textContent += ko ? ' · 저장 불가: 현재 페이지에만 적용' : ' · Cannot save: this page only';
    }
    button.addEventListener('click', () => {
      const next = !excluded;
      try {
        if (next) localStorage.setItem(key, '1'); else localStorage.removeItem(key);
        const url = new URL(window.location.href);
        url.searchParams.set('analytics', next ? 'off' : 'on');
        window.location.replace(url.href);
      } catch { stored = false; excluded = next; window['ga-disable-' + id] = next; label(); }
    });
    settings.append(button, status); footer.append(settings); label();
    new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    document.addEventListener('click', event => {
      const button = event.target.closest('#section-tabs button, #filters button');
      if (button) track('reference_tab_click', { tab_id: tabKey(button) });
      const link = event.target.closest('a.score-counter-link');
      if (link) track('score_counter_click', { link_url: link.href });
    });
    let timer, lastQuery = '';
    document.addEventListener('input', event => {
      if (!['global-search', 'search'].includes(event.target.id)) return;
      clearTimeout(timer);
      const input = event.target;
      timer = setTimeout(() => {
        const query = input.value.trim();
        if (!query) { lastQuery = ''; return; }
        if (query === lastQuery) return;
        lastQuery = query;
        const nodes = document.querySelectorAll('[data-section] tbody tr, .setup-panel tbody tr, .setup-common p');
        const any = [...nodes].some(node => !node.hidden && node.getClientRects().length > 0);
        if (!any) {
          const selected = document.querySelector('#section-tabs button.is-active, #filters button.is-active');
          track('search_no_results', { tab_id: selected ? tabKey(selected) : 'all', result_count: 0 });
        }
      }, 1200);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
