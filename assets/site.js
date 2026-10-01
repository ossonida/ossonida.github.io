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

  window.BGW = Object.freeze({ getLanguage, setLanguage, syncLinks });
})();
