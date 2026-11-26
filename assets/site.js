/* Shared navigation and language preferences for the BGW site. */
(() => {
  const sharedKey = "referenceLanguage";
  const commonLanguages = ["ko", "en", "de", "fr", "ja", "es"];

  function readPreference(key) {
    if (!key) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function getLanguage(supportedLanguages, legacyKey, fallback = "ko") {
    const requested = new URLSearchParams(window.location.search).get("lang");
    const candidates = [requested, readPreference(sharedKey), readPreference(legacyKey),
      (navigator.language || "").slice(0, 2).toLowerCase(), fallback];
    return candidates.find((language) => supportedLanguages.includes(language)) || supportedLanguages[0];
  }

  function syncLinks(language) {
    document.querySelectorAll("a[data-site-link]").forEach((link) => {
      const supported = link.dataset.siteLanguages?.split(" ") || commonLanguages;
      const url = new URL(link.getAttribute("href"), window.location.href);
      if (url.origin !== window.location.origin) return;
      url.searchParams.set("lang", supported.includes(language) ? language : "en");
      link.href = url.href;
    });
  }

  function setLanguage(language, { legacyKey, updateUrl = false } = {}) {
    for (const key of [sharedKey, legacyKey].filter(Boolean)) {
      try {
        localStorage.setItem(key, language);
      } catch {
        // Navigation still carries the language when storage is unavailable.
      }
    }
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      try {
        window.history.replaceState(window.history.state, "", url);
      } catch {
        // Embedded or local-file contexts can disallow history updates.
      }
    }
    syncLinks(language);
    window.BGWSetup?.sync(language);
  }

  // Tab deep links: the selected game-page tab is kept in the URL hash (#setup, #castles, ...)
  // so a refresh or a shared link reopens it. "All" has no hash. Search text is never put in the URL.
  const tabSelector = "#filters button, #section-tabs button";
  const tabKey = (button) => button.dataset.setupTab ? "setup" : button.dataset.show || button.dataset.category || "all";

  function findTab(key) {
    const tabs = Array.from(document.querySelectorAll(tabSelector));
    // The shared setup tab wins over a page's own "setup" category (Clocktower has only the latter).
    return tabs.find((button) => button.dataset.setupTab && key === "setup") || tabs.find((button) => tabKey(button) === key);
  }

  function openTabFromHash() {
    let key = "";
    try {
      key = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    const button = key && findTab(key);
    if (!button) return;
    button.click();
    button.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }

  function rememberTab(event) {
    const button = event.target.closest?.(tabSelector);
    if (!button) return;
    const key = tabKey(button);
    const url = new URL(window.location.href);
    url.hash = key === "all" ? "" : encodeURIComponent(key);
    if (url.href === window.location.href) return;
    try {
      window.history.replaceState(window.history.state, "", url);
    } catch {
      // Embedded or local-file contexts can disallow history updates.
    }
  }

  if (typeof document.addEventListener === "function") {
    document.addEventListener("DOMContentLoaded", openTabFromHash);
    document.addEventListener("click", rememberTab);
    window.addEventListener?.("hashchange", openTabFromHash);
  }

  window.BGW = Object.freeze({ getLanguage, setLanguage, syncLinks });
})();
