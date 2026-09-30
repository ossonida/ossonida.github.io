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
