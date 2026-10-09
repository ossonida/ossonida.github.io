/* Shared GA4 tracking and browser-local owner exclusion. */
(() => {
  'use strict';
  const id = 'G-NFEYJ27K5H', key = 'bgwAnalyticsExcluded';
  const params = new URLSearchParams(window.location.search);
  let excluded = false;
  try {
    if (params.get('analytics') === 'off') localStorage.setItem(key, '1');
    if (params.get('analytics') === 'on') localStorage.removeItem(key);
    excluded = localStorage.getItem(key) === '1';
  } catch { excluded = params.get('analytics') === 'off'; }
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
