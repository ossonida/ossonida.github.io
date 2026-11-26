// Loads the site catalog and setup data from per-game folders.
//
// Each published or drafted game owns one folder with a `game.json`:
//   <id>/game.json        hub card, languages, optional setup table (with its own text)
//   <id>/reference.json   reference entries (when the game uses the shared reference page)
//   <id>/images/          reference images
// Coming-soon cards without a page live in data/upcoming.json.
// Shared setup UI strings live in data/setup-ui.json.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
// Fields that only steer the build; they never reach the published catalog.
const BUILD_ONLY = ['order', 'draft', 'setup'];

export function loadGameSources(root = '.') {
  const games = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.') || ['games', 'assets', 'data', 'scripts', 'img', 'node_modules', 'tmp'].includes(entry.name)) continue;
    const file = path.join(root, entry.name, 'game.json');
    if (!fs.existsSync(file)) continue;
    const game = readJson(file);
    assert.equal(game.id, entry.name, `${file}: id must match its folder name`);
    assert.ok(Number.isFinite(game.order), `${file}: needs a numeric "order"`);
    games.push(game);
  }
  return games.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

// A game leaving draft must be complete: every language has its title and hub text,
// the cover is a local file, and its reference has entries.
function checkPublishable(game, root) {
  const where = `${game.id}/game.json`;
  assert.ok(game.languages?.includes('ko') && game.languages.includes('en'), `${where}: languages must include ko and en`);
  for (const lang of game.languages) {
    assert.ok(game.titles?.[lang]?.trim(), `${where}: missing titles.${lang}`);
    if (!game.tagKey) assert.ok(game.tag?.[lang]?.trim(), `${where}: missing tag.${lang}`);
    if (!game.descKey) assert.ok(game.description?.[lang]?.trim(), `${where}: missing description.${lang}`);
  }
  assert.ok(game.href, `${where}: missing href`);
  if (game.cover && !/^https?:/.test(game.cover)) assert.ok(fs.existsSync(path.join(root, game.cover)), `${where}: cover ${game.cover} not found`);
  if (game.reference) {
    const reference = readJson(path.join(root, game.reference));
    assert.ok(reference.items?.length, `${game.reference}: no items yet`);
  }
}

// Published catalog: open games by `order`, then coming-soon cards. Drafts are left out.
export function loadCatalog(root = '.') {
  const open = loadGameSources(root).filter(game => !game.draft);
  for (const game of open) checkPublishable(game, root);
  const openIds = new Set(open.map(game => game.id));
  // A coming-soon card is dropped automatically once its game has a published page.
  const upcoming = readJson(path.join(root, 'data/upcoming.json')).filter(game => !openIds.has(game.id));
  const catalog = [
    ...open.map(game => {
      const entry = Object.fromEntries(Object.entries(game).filter(([key]) => !BUILD_ONLY.includes(key)));
      if (game.setup) entry.setup = true;
      return entry;
    }),
    ...upcoming,
  ];
  assert.equal(new Set(catalog.map(game => game.id)).size, catalog.length, 'Duplicate game ID');
  return catalog;
}

// Setup data in the shape assets/setup.js reads: { text: {key: {lang}}, games: {id: config} }.
// A game's setup text keys must be unique across the site.
export function loadSetup(root = '.') {
  const text = { ...readJson(path.join(root, 'data/setup-ui.json')) };
  const games = {};
  for (const game of loadGameSources(root).filter(game => !game.draft && game.setup && typeof game.setup === 'object')) {
    const { text: own = {}, ...config } = game.setup;
    for (const [key, value] of Object.entries(own)) {
      assert.ok(!(key in text), `${game.id}: setup text key "${key}" is already used`);
      text[key] = value;
    }
    games[game.id] = config;
  }
  return { text, games };
}
