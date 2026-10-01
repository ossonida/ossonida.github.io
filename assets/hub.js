const SITE_TITLE = "BoardGame Wiki - BGW";
    const GAME_SITE_TITLE_PREFIX = "BGW : ";
    // Individual game sites should use titles like `${GAME_SITE_TITLE_PREFIX}Marrakech`.

    const games = window.BGW_GAMES;

    const translations = {
      ko: {
        documentTitle: SITE_TITLE,
        heroTitle: SITE_TITLE,
        heroIntro: "플레이 중 자주 확인하는 카드, 타일 정보를 빠르게 찾아가는 레퍼런스 허브입니다.",
        gameListLabel: "BoardGame Wiki - BGW 목록",
        gahTag: "카드 / 타일",
        gahDesc: "그랜드 오스트리아 호텔 카드와 설명을 빠르게 확인합니다.",
        enterAction: "입장",
        marrakechTag: "타일",
        marrakechDesc: "마라케시 타일 설명을 빠르게 확인합니다.",
        burgundyTag: "타일 / 주사위",
        burgundyDesc: "버건디의 성 행동, 건물, 수도원 타일과 점수 규칙을 확인합니다.",
        civolutionTag: "카드 / 기술",
        civolutionDesc: "시볼루션 참조 자료를 준비 중입니다.",
        arkhamTag: "카드 / 캠페인",
        arkhamDesc: "아컴호러 카드게임 참조 자료를 준비 중입니다.",
        spiritIslandTag: "카드 / 정령",
        spiritIslandDesc: "스피릿 아일랜드 참조 자료를 준비 중입니다.",
        duneTag: "덱빌딩 / 배치",
        duneDesc: "듄 임페리움과 업라이징 참조 자료를 준비 중입니다.",
        teotihuacanTag: "일꾼 / 자원",
        teotihuacanDesc: "테오티우아칸 참조 자료를 준비 중입니다.",
        gaiaProjectTag: "우주 / 테라포밍",
        gaiaProjectDesc: "가이아 프로젝트 참조 자료를 준비 중입니다.",
        feastForOdinTag: "일꾼 / 퍼즐",
        feastForOdinDesc: "오딘을 위하여 참조 자료를 준비 중입니다.",
        comingSoonAction: "준비중"
      },
      en: {
        documentTitle: SITE_TITLE,
        heroTitle: SITE_TITLE,
        heroIntro: "A quick reference hub for checking cards and tiles during play.",
        gameListLabel: "BoardGame Wiki - BGW list",
        gahTag: "Cards / Tiles",
        gahDesc: "Quickly check Grand Austria Hotel cards and descriptions.",
        enterAction: "Enter",
        marrakechTag: "Tiles",
        marrakechDesc: "Quickly check Marrakech tile descriptions.",
        burgundyTag: "Tiles / Dice",
        burgundyDesc: "Reference for actions, buildings, monastery tiles and scoring in The Castles of Burgundy.",
        civolutionTag: "Cards / Tech",
        civolutionDesc: "Civolution reference materials are being prepared.",
        arkhamTag: "Cards / Campaigns",
        arkhamDesc: "Arkham Horror: The Card Game reference materials are being prepared.",
        spiritIslandTag: "Cards / Spirits",
        spiritIslandDesc: "Spirit Island reference materials are being prepared.",
        duneTag: "Deck-building / Placement",
        duneDesc: "Dune: Imperium and Uprising reference materials are being prepared.",
        teotihuacanTag: "Workers / Resources",
        teotihuacanDesc: "Teotihuacan: City of Gods reference materials are being prepared.",
        gaiaProjectTag: "Space / Terraforming",
        gaiaProjectDesc: "Gaia Project reference materials are being prepared.",
        feastForOdinTag: "Workers / Puzzle",
        feastForOdinDesc: "A Feast for Odin reference materials are being prepared.",
        comingSoonAction: "Coming soon"
      },
      de: {
        documentTitle: SITE_TITLE,
        heroTitle: SITE_TITLE,
        heroIntro: "Ein schneller Referenz-Hub für Karten und Plättchen während des Spiels.",
        gameListLabel: "BoardGame Wiki - BGW-Liste",
        gahTag: "Karten / Plättchen",
        gahDesc: "Karten und Beschreibungen zu Grand Austria Hotel schnell nachschlagen.",
        enterAction: "Öffnen",
        marrakechTag: "Plättchen",
        marrakechDesc: "Marrakech-Plättchenbeschreibungen schnell nachschlagen.",
        burgundyTag: "Plättchen / Würfel",
        burgundyDesc: "Aktionen, Gebäude, Klöster und Wertung in The Castles of Burgundy.",
        civolutionTag: "Karten / Technik",
        civolutionDesc: "Civolution-Referenzmaterialien sind in Vorbereitung.",
        arkhamTag: "Karten / Kampagnen",
        arkhamDesc: "Referenzmaterialien zu Arkham Horror: The Card Game sind in Vorbereitung.",
        spiritIslandTag: "Karten / Geister",
        spiritIslandDesc: "Referenzmaterialien zu Spirit Island sind in Vorbereitung.",
        duneTag: "Deckbau / Platzierung",
        duneDesc: "Referenzmaterialien zu Dune: Imperium und Uprising sind in Vorbereitung.",
        teotihuacanTag: "Arbeiter / Ressourcen",
        teotihuacanDesc: "Referenzmaterialien zu Teotihuacan: City of Gods sind in Vorbereitung.",
        gaiaProjectTag: "Weltraum / Terraforming",
        gaiaProjectDesc: "Referenzmaterialien zu Gaia Project sind in Vorbereitung.",
        feastForOdinTag: "Arbeiter / Puzzle",
        feastForOdinDesc: "Referenzmaterialien zu A Feast for Odin sind in Vorbereitung.",
        comingSoonAction: "In Vorbereitung"
      },
      fr: {
        documentTitle: SITE_TITLE,
        heroTitle: SITE_TITLE,
        heroIntro: "Un hub de référence rapide pour consulter cartes et tuiles pendant la partie.",
        gameListLabel: "Liste BoardGame Wiki - BGW",
        gahTag: "Cartes / Tuiles",
        gahDesc: "Consultez rapidement les cartes et descriptions de Grand Austria Hotel.",
        enterAction: "Entrer",
        marrakechTag: "Tuiles",
        marrakechDesc: "Consultez rapidement les descriptions des tuiles de Marrakech.",
        burgundyTag: "Tuiles / Dés",
        burgundyDesc: "Actions, bâtiments, monastères et décompte de The Castles of Burgundy.",
        civolutionTag: "Cartes / Tech",
        civolutionDesc: "Les références de Civolution sont en préparation.",
        arkhamTag: "Cartes / Campagnes",
        arkhamDesc: "Les références de Arkham Horror: The Card Game sont en préparation.",
        spiritIslandTag: "Cartes / Esprits",
        spiritIslandDesc: "Les références de Spirit Island sont en préparation.",
        duneTag: "Deck-building / Placement",
        duneDesc: "Les références de Dune: Imperium et Uprising sont en préparation.",
        teotihuacanTag: "Ouvriers / Ressources",
        teotihuacanDesc: "Les références de Teotihuacan: City of Gods sont en préparation.",
        gaiaProjectTag: "Espace / Terraformation",
        gaiaProjectDesc: "Les références de Gaia Project sont en préparation.",
        feastForOdinTag: "Ouvriers / Puzzle",
        feastForOdinDesc: "Les références de A Feast for Odin sont en préparation.",
        comingSoonAction: "Bientôt"
      },
      ja: {
        documentTitle: SITE_TITLE,
        heroTitle: SITE_TITLE,
        heroIntro: "プレイ中によく確認するカードとタイル情報へすばやく移動するためのリファレンスハブです。",
        gameListLabel: "BoardGame Wiki - BGW 一覧",
        gahTag: "カード / タイル",
        gahDesc: "グランドオーストリアホテルのカードと説明をすばやく確認します。",
        enterAction: "入場",
        marrakechTag: "タイル",
        marrakechDesc: "マラケシュのタイル説明をすばやく確認できます。",
        burgundyTag: "タイル / ダイス",
        burgundyDesc: "ブルゴーニュの城のアクション、建物、修道院、得点のリファレンス。",
        civolutionTag: "カード / 技術",
        civolutionDesc: "シボリューションの参照資料を準備中です。",
        arkhamTag: "カード / キャンペーン",
        arkhamDesc: "アーカムホラー: ザ・カードゲームの参照資料を準備中です。",
        spiritIslandTag: "カード / 精霊",
        spiritIslandDesc: "スピリット・アイランドの参照資料を準備中です。",
        duneTag: "デッキ構築 / 配置",
        duneDesc: "デューン: インペリウムとアップライジングの参照資料を準備中です。",
        teotihuacanTag: "ワーカー / 資源",
        teotihuacanDesc: "テオティワカン: シティ・オブ・ゴッズの参照資料を準備中です。",
        gaiaProjectTag: "宇宙 / テラフォーミング",
        gaiaProjectDesc: "ガイアプロジェクトの参照資料を準備中です。",
        feastForOdinTag: "ワーカー / パズル",
        feastForOdinDesc: "オーディンの祝祭の参照資料を準備中です。",
        comingSoonAction: "準備中"
      },
      es: {
        documentTitle: SITE_TITLE,
        heroTitle: SITE_TITLE,
        heroIntro: "Un centro de referencia rápido para consultar cartas y losetas durante la partida.",
        gameListLabel: "Lista de BoardGame Wiki - BGW",
        gahTag: "Cartas / Losetas",
        gahDesc: "Consulta rápidamente las cartas y descripciones de Grand Austria Hotel.",
        enterAction: "Entrar",
        marrakechTag: "Losetas",
        marrakechDesc: "Consulta rápidamente las descripciones de las losetas de Marrakech.",
        burgundyTag: "Losetas / Dados",
        burgundyDesc: "Acciones, edificios, monasterios y puntuación de The Castles of Burgundy.",
        civolutionTag: "Cartas / Tecnología",
        civolutionDesc: "Los materiales de referencia de Civolution están en preparación.",
        arkhamTag: "Cartas / Campañas",
        arkhamDesc: "Los materiales de referencia de Arkham Horror: The Card Game están en preparación.",
        spiritIslandTag: "Cartas / Espíritus",
        spiritIslandDesc: "Los materiales de referencia de Spirit Island están en preparación.",
        duneTag: "Construcción / Colocación",
        duneDesc: "Los materiales de referencia de Dune: Imperium y Uprising están en preparación.",
        teotihuacanTag: "Trabajadores / Recursos",
        teotihuacanDesc: "Los materiales de referencia de Teotihuacan: City of Gods están en preparación.",
        gaiaProjectTag: "Espacio / Terraformación",
        gaiaProjectDesc: "Los materiales de referencia de Gaia Project están en preparación.",
        feastForOdinTag: "Trabajadores / Puzzle",
        feastForOdinDesc: "Los materiales de referencia de A Feast for Odin están en preparación.",
        comingSoonAction: "Próximamente"
      }
    };

    const languageMeta = {
      en: { code: "EN", icon: "img/flag-us.svg" },
      ko: { code: "KR", icon: "img/flag-kr.svg" },
      de: { code: "DE", icon: "img/flag-de.svg" },
      fr: { code: "FR", icon: "img/flag-fr.svg" },
      ja: { code: "JP", icon: "img/flag-jp.svg" },
      es: { code: "ES", icon: "img/flag-es.svg" }
    };

    const supportedLanguages = Object.keys(translations);
    const langSwitch = document.getElementById("lang-switch");
    const langButton = document.getElementById("lang-button");
    const languageButtons = document.querySelectorAll(".lang-menu [data-lang]");
    const currentLangIcon = document.querySelector("[data-current-lang-icon]");
    const currentLangCode = document.querySelector("[data-current-lang-code]");
    const gameGrid = document.getElementById("game-grid");

    function appendTranslatedText(element, key) {
      element.dataset.i18n = key;
      return element;
    }

    function renderGameBanners() {
      const fragment = document.createDocumentFragment();

      games.forEach((game) => {
        const isDisabled = !game.href;
        const banner = document.createElement("a");
        banner.className = `game-banner${isDisabled ? " is-disabled" : ""}`;
        banner.style.setProperty("--game-bg", game.bg);

        if (game.href) {
          banner.href = game.href;
          banner.dataset.siteLink = "";
          banner.dataset.siteLanguages = game.languages.join(" ");
        } else {
          banner.setAttribute("aria-disabled", "true");
          banner.tabIndex = -1;
        }

        const cover = document.createElement("div");
        cover.className = "cover";
        cover.setAttribute("aria-hidden", "true");
        const coverImage = document.createElement("img");
        coverImage.alt = "";
        coverImage.loading = "lazy";
        coverImage.decoding = "async";
        coverImage.addEventListener("error", () => {
          coverImage.remove();
          cover.classList.add("is-unavailable");
        }, { once: true });
        coverImage.src = game.cover;
        cover.append(coverImage);

        const info = document.createElement("div");
        info.className = "game-info";

        const meta = document.createElement("div");
        meta.className = "game-meta";

        const status = document.createElement("span");
        status.className = `tag${game.statusLabel ? " is-live" : ""}`;
        if (game.statusLabel) {
          status.textContent = game.statusLabel;
        } else {
          appendTranslatedText(status, "comingSoonAction");
        }

        const tag = appendTranslatedText(document.createElement("span"), game.tagKey);
        tag.className = "tag";
        meta.append(status, tag);

        const title = document.createElement("h2");
        title.className = "game-title";
        title.textContent = game.title;

        const desc = appendTranslatedText(document.createElement("p"), game.descKey);
        desc.className = "game-desc";

        info.append(meta, title, desc);

        const action = document.createElement("div");
        action.className = "game-action";
        action.setAttribute("aria-hidden", "true");
        const actionLabel = appendTranslatedText(document.createElement("span"), game.actionKey || "comingSoonAction");
        action.append(actionLabel);

        banner.append(cover, info, action);
        fragment.append(banner);
      });

      gameGrid.replaceChildren(fragment);
    }

    function setLanguageMenuOpen(isOpen, restoreFocus = false) {
      langSwitch.classList.toggle("is-open", isOpen);
      langButton.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        const selected = Array.from(languageButtons).find((button) => button.getAttribute("aria-selected") === "true");
        languageButtons.forEach((button) => { button.tabIndex = button === selected ? 0 : -1; });
        (selected || languageButtons[0]).focus();
      } else if (restoreFocus) {
        langButton.focus();
      }
    }

    function getInitialLanguage() {
      return BGW.getLanguage(supportedLanguages);
    }

    function applyLanguage(language, updateUrl = false) {
      if (!supportedLanguages.includes(language)) language = "ko";
      const copy = translations[language] || translations.ko;
      const meta = languageMeta[language] || languageMeta.ko;
      document.documentElement.lang = language;
      document.title = copy.documentTitle;
      BGW.setLanguage(language, { updateUrl });

      document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = copy[element.dataset.i18n];
      });

      document.querySelectorAll("[data-i18n-html]").forEach((element) => {
        element.innerHTML = copy[element.dataset.i18nHtml];
      });

      document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
        element.setAttribute("aria-label", copy[element.dataset.i18nAriaLabel]);
      });

      languageButtons.forEach((button) => {
        button.setAttribute("aria-selected", String(button.dataset.lang === language));
        button.tabIndex = button.dataset.lang === language ? 0 : -1;
      });

      currentLangIcon.src = meta.icon;
      currentLangCode.textContent = meta.code;
      setLanguageMenuOpen(false);
    }

    langButton.addEventListener("click", () => {
      setLanguageMenuOpen(!langSwitch.classList.contains("is-open"));
    });

    languageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyLanguage(button.dataset.lang, true);
        langButton.focus();
      });
    });

    document.addEventListener("click", (event) => {
      if (!langSwitch.contains(event.target)) setLanguageMenuOpen(false);
    });

    langSwitch.addEventListener("keydown", (event) => {
      const buttons = Array.from(languageButtons);
      const index = buttons.indexOf(document.activeElement);
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        if (!langSwitch.classList.contains("is-open")) {
          setLanguageMenuOpen(true);
          return;
        }
        const nextIndex = event.key === "Home" ? 0
          : event.key === "End" ? buttons.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
        buttons.forEach((button, position) => { button.tabIndex = position === nextIndex ? 0 : -1; });
        buttons[nextIndex].focus();
      } else if (event.key === "Escape" && langSwitch.classList.contains("is-open")) {
        event.preventDefault();
        setLanguageMenuOpen(false, true);
      }
    });

    langSwitch.addEventListener("focusout", (event) => {
      if (!langSwitch.contains(event.relatedTarget)) setLanguageMenuOpen(false);
    });

    renderGameBanners();
    applyLanguage(getInitialLanguage());
