# Repository scope

Work only in `ossonida/ossonida.github.io` for site changes. Do not edit or deploy the separate `ossonida/gah` or `ossonida/marrakesh` repositories.

GAH and Marrakesh source files remain in `gah/` and `marrakesh/`. Their public unified-site routes are `/games/gah/` and `/games/marrakesh/`. Run `node scripts/build-site.mjs` and commit the generated `games/` folders after editing the sources. Keep HOME links pointing to the unified hub. Run `node scripts/validate-site.mjs` before publishing.

# Game data

Each game is one folder: `<id>/game.json` (hub card, languages, order, draft flag, optional setup table and its text), `<id>/reference.json` and `<id>/images/`. Coming-soon cards are in `data/upcoming.json`; shared setup UI strings in `data/setup-ui.json`. To add a game, follow `.claude/skills/add-game/SKILL.md` (`scripts/new-game.mjs`, `scripts/images.mjs`).

# Analytics

Every published page must load the shared `assets/analytics.js` in its head. Do not add separate inline GA tags: the shared script applies browser-local visit exclusion before loading GA4 `G-NFEYJ27K5H`. New reference pages inherit it from `scripts/build-site.mjs`. Run `node scripts/validate-analytics.cjs` after changing tracking. Keep search text out of event parameters.
