---
name: add-game
description: Add a new board game reference (and optional quick-setup table) to the BGW site from a rulebook link, PDF or photos. Use when the user asks to add, create or start a reference page for a game, or to turn a coming-soon card into a real page.
---

# Add a game to BGW

One game = one folder. Everything about a game lives in `<id>/`:

| File | What it holds |
| --- | --- |
| `<id>/game.json` | Hub card (titles, tag, description, cover, colour), languages, `order`, `draft`, optional `setup` table with its own text |
| `<id>/reference.json` | Reference entries (schemaVersion 1) |
| `<id>/images/` | Reference images (WebP, made by `scripts/images.mjs`) |

`scripts/build-site.mjs` turns these into the page, hub card, setup data, sitemap and service worker.
Coming-soon cards without a page are in `data/upcoming.json`; a card there disappears on its own once a game with the same id is published.
Shared setup UI strings are in `data/setup-ui.json`. Node on this machine: `"/c/Program Files/nodejs/node.exe"`.

## Inputs to collect

- Game name (English and Korean) and a kebab-case id. Reuse the id from `data/upcoming.json` if the game is listed there.
- Source: rulebook URL, PDF or photos. Never write rules from memory; every entry must come from the source.
- Box image for the cover.
- Languages: default `ko,en`. Add more only when the user asks.

## Steps

1. **Scaffold**: `node scripts/new-game.mjs <id> --en "<English>" --ko "<한국어>" [--languages ko,en]`.
   This creates a draft. Drafts are skipped by the build, so the live site is unaffected until step 6.
2. **Read the source.** For an image-only PDF (no text layer), serve it locally and page through it in Chrome; the Read tool needs `pdftoppm`, which is not installed. Download files into a new, empty scratchpad folder.
3. **Write `reference.json`** (see `burgundy/reference.json` or `teotihuacan/reference.json`):
   - `categories`: `{ "id", "name": {lang}, "description"?: {lang} }` — a few task-oriented groups (e.g. actions, tiles, scoring, end of game).
   - `items`: `{ "id", "category", "name": {lang}, "text": {lang}, "number"?, "image"?, "source"?: { "page" } }`.
   - Stable kebab-case ids; one entry per distinct rule or component; no duplicates.
   - Write Korean first, then English, then any other language. Every item needs every language.
   - Keep `source.note` honest: say where the content came from and that the original rulebook wins.
4. **Setup table (optional)**: add `setup` to `game.json` (examples: `burgundy/game.json`, `teotihuacan/game.json`):
   - `players`: player counts, e.g. `[2,3,4]`.
   - `rows`: each row is `[labelKey, cellPerPlayerCount...]`. A cell is a text key or `{ "value": "1 / 2" }`.
   - `common`: text key for steps that apply to every count, **one step per line** (`\n`) in every language, with the same number of steps in each language (the validator checks this).
   - `scope`, `source`, and optional `expansions` groups (see `marrakesh/game.json`).
   - `text`: every key used above, `{ "ko": ..., "en": ... }`. Prefix keys with a short game-specific prefix; keys must be unique across the site.
   - A game with its own setup category instead of the shared table (like Clocktower) uses `"setup": true`.
5. **Images**: put raw images and the box image in a scratchpad folder, then run
   `node scripts/images.mjs <id> <folder> --cover <box file>` in the background and open `http://127.0.0.1:8766/` in Chrome.
   It writes `<id>/images/*.webp` and `assets/covers/<id>.webp`, removing a flat light background from the cover.
   Check the previews: a white box face must not turn transparent. Reference images from items as `images/<name>.webp`.
6. **Hub card and publish**: in `game.json`, fill `tag` and `description` for every language (or keep `tagKey`/`descKey` from a coming-soon card), then delete `"draft": true`.
   The build refuses to publish a game with a missing title, tag, description, cover file or reference entries.
7. **Build and validate**:
   ```
   node scripts/build-site.mjs
   node scripts/validate-site.mjs && node scripts/validate-analytics.cjs && node scripts/validate-reference.mjs && node scripts/validate-setup.mjs && node scripts/validate-clocktower.mjs
   ```
8. **Look at it**: serve the repo locally and check the hub card, the reference page in each language, and the setup tab (desktop and 390px wide).
9. **Ship**: commit on a branch (include generated files), fast-forward merge to `main`, push, and confirm the live page within a few minutes (pages cache for up to 10 minutes).

## Report back

Tell the user what was added (categories, entry count, setup coverage) and list anything left out or uncertain in the source.
