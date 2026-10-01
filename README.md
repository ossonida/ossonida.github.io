# ossonida.github.io

## Naming

- Gate site title: `BoardGame Wiki - BGW`
- Individual game site titles: `BGW : {Game Title}`. Example: `BGW : Marrakech`

## SEO

- Main search phrases: `보드게임 위키`, `보드게임 레퍼런스`, `BoardGame Wiki`, `Board Game Reference`, `Brettspiel Wiki`, `Brettspiel Referenz`, `référence jeux de société`, `ボードゲームウィキ`, `ボードゲームリファレンス`, `referencia juegos de mesa`, `BGW`
- Keep supported language URLs discoverable with `?lang=ko`, `?lang=en`, `?lang=de`, `?lang=fr`, `?lang=ja`, and `?lang=es`.
- Keep crawl files published at `/robots.txt` and `/sitemap.xml`.
- When a prepared game gets a real page, add its URL to `sitemap.xml`.
- Register `https://ossonida.github.io/sitemap.xml` in Google Search Console and Bing Webmaster Tools after deployment.

## Unified game sites

- Hub: `/` (`index.html`)
- Grand Austria Hotel: `/gah/` (`gah/index.html`)
- Marrakesh: `/marrakesh/` (`marrakesh/index.html`)

Both game repositories were imported as ordinary files from their main branches.
`integration-sources.json` records the exact source commits. Original Git histories
remain in the original repositories; this import does not merge their histories.
Edit game content in this repository going forward.

Navigation uses relative paths and preserves the selected language with `?lang=`.
`assets/site.js` shares language preferences and supports the old game-specific keys.
Marrakesh supports Chinese; its home link falls back to English because the hub
has no Chinese translation. Existing public game URLs remain unchanged.

Run `node scripts/validate-site.mjs` from the repository root to check scripts,
local assets (including filename case), sitemap entries and language navigation.

### Publishing

Publish this repository using GitHub Pages: main branch, repository root.
The `.nojekyll` file keeps the site static. After this unified site is deployed,
an administrator should disable the old game repositories' separate Pages
publishing and verify that both game URLs serve the unified repository.
Keep the old repositories for their history; do not delete them.

## Adding a reference game

The hub catalog lives in `data/games.json`. Hub styles and behavior are in
`assets/hub.css` and `assets/hub.js`. Existing GAH and Marrakesh pages keep their
specialized layouts; new games use `assets/reference.css` and `assets/reference.js`.

1. Create `<game-id>/reference.json`, following `burgundy/reference.json` (schemaVersion 1).
2. Add stable item IDs, categories, translated names/text, source page numbers, and
   optional images under `<game-id>/images/`. Do not duplicate repeated PDF copies.
3. Add a catalog entry with `id`, `title`, `href`, `languages`, `reference`, `cover`,
   `bg`, `tagKey`, `descKey`, `actionKey` and `statusLabel`. Add the hub tag/description
   translations to `assets/hub.js`.
4. Run `node scripts/build-site.mjs`, then `node scripts/validate-site.mjs` and
   `node scripts/validate-reference.mjs`.

The build generates the catalog script, reference data script, game HTML, hub
noscript links, and sitemap. Commit generated files too: GitHub Pages serves this
repository as static files. No package install or server-side runtime is required.
Use a local HTTP server for preview.

### Burgundy source decisions

`Small_Castles_of_Burgundy_Anniversary_Aid.pdf` has two pages, each with left/right
copies of the same aid. The left copies provide 49 unique reference entries.
Monastery tiles 16–23 and 29 stay grouped because the source presents one shared
effect. Tiles 27/28, Crane and Geese have no image in this aid and remain text-only.
Korean, English, German, French, Japanese and Spanish descriptions are available. English descriptions
are lightly condensed except the individually extracted monastery text.
`burgundy/source-crops.json` records page/rectangle coordinates for 37 image crops.
The PDF is not copied into the published site. This is the supplied anniversary aid,
not a claim to cover every later edition or expansion.

### Shared layout and Burgundy languages

All three game references load `assets/reference-layout.css` for the header,
category tabs, search field and table appearance. Existing game-specific tables
and functionality are retained. Burgundy uses the same section/table layout,
flag language menu and image dialog, driven by `assets/reference.js`.

Burgundy supports Korean, English, German, French, Japanese and Spanish for all
51 entries, category labels and controls. Marrakesh additionally retains Chinese.
Update every supported language in `burgundy/reference.json` when changing rules.
Run the build and both validation scripts after changes.
