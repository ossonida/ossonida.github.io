(() => {
  "use strict";
  const data = window.BGW_REFERENCE;
  const labels = {
    ko: ["이름, 번호 또는 효과 검색", "전체", "개 항목", "검색 결과가 없습니다.", "이미지 확대", "닫기", "이미지", "번호", "이름", "내용", "레퍼런스로 이동"],
    en: ["Search names, numbers or effects", "All", "entries", "No matching references.", "Enlarge image", "Close", "Image", "Number", "Name", "Effect", "Skip to references"],
    de: ["Name, Nummer oder Effekt suchen", "Alle", "Einträge", "Keine Treffer.", "Bild vergrößern", "Schließen", "Bild", "Nummer", "Name", "Effekt", "Zu den Referenzen"],
    fr: ["Rechercher nom, numéro ou effet", "Tout", "entrées", "Aucun résultat.", "Agrandir l’image", "Fermer", "Image", "Numéro", "Nom", "Effet", "Aller aux références"],
    ja: ["名前・番号・効果を検索", "すべて", "件", "該当する項目はありません。", "画像を拡大", "閉じる", "画像", "番号", "名前", "効果", "リファレンスへ"],
    es: ["Buscar nombre, número o efecto", "Todo", "entradas", "Sin resultados.", "Ampliar imagen", "Cerrar", "Imagen", "Número", "Nombre", "Efecto", "Ir a las referencias"]
  };
  const meta = {ko:["KR","kr","한국어"],en:["EN","us","English"],de:["DE","de","Deutsch"],fr:["FR","fr","Français"],ja:["JP","jp","日本語"],es:["ES","es","Español"]};
  const get = id => document.getElementById(id);
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  let language = BGW.getLanguage(data.languages);
  let category = "all";
  const pick = value => typeof value === "string" ? value : value[language] || value.en;
  const search = get("search"), filters = get("filters"), results = get("results"), modal = get("image-dialog");
  const menu = get("lang-menu"), langButton = get("lang-button"), langSwitch = get("lang-switch");
  const languageButtons = [];
  function closeMenu(restore = false) {
    menu.hidden = true; langButton.setAttribute("aria-expanded", "false");
    if (restore) langButton.focus();
  }
  function openMenu() {
    menu.hidden = false; langButton.setAttribute("aria-expanded", "true");
    languageButtons.find(button => button.dataset.lang === language)?.focus();
  }
  for (const lang of data.languages) {
    const button = el("button"); button.type = "button"; button.dataset.lang = lang;
    button.setAttribute("role", "option"); button.setAttribute("aria-label", meta[lang][2]);
    const icon = el("img", undefined, "lang-icon"); icon.src = `../img/flag-${meta[lang][1]}.svg`; icon.alt = "";
    button.append(icon, el("span", meta[lang][0], "lang-code"));
    button.addEventListener("click", () => { language = lang; applyLanguage(true); closeMenu(true); });
    languageButtons.push(button); menu.append(button);
  }
  langButton.addEventListener("click", () => menu.hidden ? openMenu() : closeMenu());
  langSwitch.addEventListener("keydown", event => {
    if (event.key === "Escape") { closeMenu(true); return; }
    if (!["ArrowDown","ArrowUp","Home","End"].includes(event.key)) return;
    event.preventDefault();
    if (menu.hidden) { openMenu(); return; }
    const index = languageButtons.indexOf(document.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? languageButtons.length-1
      : (index + (event.key === "ArrowDown" ? 1 : -1) + languageButtons.length) % languageButtons.length;
    languageButtons[next].focus();
  });
  langSwitch.addEventListener("focusout", event => { if (!langSwitch.contains(event.relatedTarget)) closeMenu(); });
  document.addEventListener("click", event => { if (!langSwitch.contains(event.target)) closeMenu(); });
  function renderResults() {
    const copy = labels[language];
    const query = search.value.trim().normalize("NFKC").toLowerCase();
    const filtered = data.items.filter(item => {
      const text = [item.number || "", ...Object.values(item.name), ...Object.values(item.text)].join(" ").normalize("NFKC").toLowerCase();
      return (category === "all" || item.category === category) && (!query || text.includes(query));
    });
    const fragment = document.createDocumentFragment();
    for (const section of data.categories) {
      const items = filtered.filter(item => item.category === section.id);
      if (!items.length) continue;
      const card = el("section", undefined, "card"); card.dataset.section = section.id;
      const heading = el("div", undefined, "card-header");
      heading.append(el("h2", pick(section.name)), el("span", `${items.length} ${copy[2]}`, "count-tag"));
      const wrap = el("div", undefined, "table-wrap");
      const allItems = data.items.filter(item => item.category === section.id);
      const withImage = allItems.some(item => item.image), withNumber = allItems.some(item => item.number);
      const table = el("table", undefined, `reference-table${withImage ? "" : " text-only"}`);
      const columns = [...(withImage ? [[copy[6],"image-col"]] : []), ...(withNumber ? [[copy[7],"number-col"]] : []), [copy[8],"name-col"], [copy[9],"text-col"]];
      const colgroup = el("colgroup"), thead = el("thead"), tr = el("tr");
      for (const [title, cls] of columns) {
        colgroup.append(el("col", undefined, cls));
        const th = el("th", title); th.setAttribute("scope", "col"); tr.append(th);
      }
      thead.append(tr); const tbody = el("tbody");
      for (const item of items) {
        const row = el("tr"); row.id = item.id;
        if (withImage) {
          const cell = el("td");
          if (item.image) {
            const button = el("button", undefined, "image-zoom"); button.type = "button";
            button.setAttribute("aria-label", `${pick(item.name)} · ${copy[4]}`);
            const image = el("img", undefined, "ref-img"); image.src = item.image; image.alt = pick(item.name); image.loading = "lazy"; image.decoding = "async";
            button.append(image);
            button.addEventListener("click", () => {
              get("modal-title").textContent = [item.number, pick(item.name)].filter(Boolean).join(" · ");
              get("modal-image").src = item.image; get("modal-image").alt = pick(item.name);
              get("modal-text").textContent = pick(item.text); modal.showModal();
            });
            cell.append(button);
          } else cell.textContent = "—";
          row.append(cell);
        }
        if (withNumber) row.append(el("td", item.number || "—"));
        row.append(el("td", pick(item.name)), el("td", pick(item.text)));
        tbody.append(row);
      }
      table.append(colgroup, thead, tbody); wrap.append(table); card.append(heading, wrap); fragment.append(card);
    }
    results.replaceChildren(fragment);
    get("count").textContent = `${filtered.length} / ${data.items.length} ${copy[2]}`;
    get("empty").hidden = filtered.length !== 0;
  }
  function applyLanguage(updateUrl = false) {
    const copy = labels[language];
    document.documentElement.lang = language;
    document.title = `BGW : ${data.title}`;
    get("page-title").textContent = data.title;
    get("lang-icon").src = `../img/flag-${meta[language][1]}.svg`;
    get("lang-code").textContent = meta[language][0];
    langButton.setAttribute("aria-label", meta[language][2]);
    languageButtons.forEach(button => button.setAttribute("aria-selected", String(button.dataset.lang === language)));
    get("skip").textContent = copy[10]; get("empty").textContent = copy[3]; get("modal-close").textContent = copy[5];
    search.placeholder = copy[0]; search.setAttribute("aria-label", copy[0]);
    const entries = [{id:"all", name:copy[1]}, ...data.categories];
    filters.replaceChildren(...entries.map(entry => {
      const button = el("button", pick(entry.name)); button.type = "button";
      button.setAttribute("aria-pressed", String(category === entry.id));
      button.addEventListener("click", () => {
        category = entry.id;
        for (const other of filters.children) other.setAttribute("aria-pressed", String(other === button));
        renderResults();
      });
      return button;
    }));
    BGW.setLanguage(language, {updateUrl}); renderResults();
  }
  search.addEventListener("input", renderResults);
  get("modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", event => {
    if (event.target !== modal) return;
    const box = modal.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) modal.close();
  });
  applyLanguage();
})();
