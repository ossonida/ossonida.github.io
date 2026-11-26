// Creates a draft game folder: node scripts/new-game.mjs <id> --en "English title" --ko "한국어 제목" [--languages ko,en]
//
// Writes <id>/game.json (draft: true, hidden from the hub until you remove "draft"),
// <id>/reference.json (empty schema-1 skeleton) and <id>/images/.
// If data/upcoming.json already has a coming-soon card with this id, its cover, colours and hub text are reused.
import fs from 'node:fs';
import { loadGameSources } from './lib/catalog.mjs';

const [id, ...rest] = process.argv.slice(2);
const flag = name => { const at = rest.indexOf('--' + name); return at >= 0 ? rest[at + 1] : undefined; };
const fail = message => { console.error(message); process.exit(1); };

if (!id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) fail('Usage: node scripts/new-game.mjs <kebab-case-id> --en "English title" --ko "한국어 제목" [--languages ko,en]');
const en = flag('en'), ko = flag('ko');
if (!en || !ko) fail('Both --en and --ko titles are required.');
if (fs.existsSync(`${id}/game.json`)) fail(`${id}/game.json already exists.`);
const languages = (flag('languages') || 'ko,en').split(',').map(lang => lang.trim()).filter(Boolean);
if (!languages.includes('ko') || !languages.includes('en')) fail('Languages must include ko and en.');

const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2).replace(/\n/g, '\r\n') + '\r\n');
const byLang = fill => Object.fromEntries(languages.map(lang => [lang, fill(lang)]));
const upcoming = JSON.parse(fs.readFileSync('data/upcoming.json', 'utf8')).find(game => game.id === id);
const order = Math.max(0, ...loadGameSources().map(game => game.order)) + 10;

const game = {
  id,
  order,
  draft: true,
  title: en,
  titles: byLang(lang => (lang === 'ko' ? ko : lang === 'en' ? en : en)),
  href: `./${id}/`,
  languages,
  reference: `${id}/reference.json`,
  cover: upcoming?.cover?.startsWith('assets/') ? upcoming.cover : `assets/covers/${id}.webp`,
  bg: upcoming?.bg || 'linear-gradient(135deg, #1f2a36 0%, #4c5f73 48%, #151b24 100%)',
  ...(upcoming?.tagKey ? { tagKey: upcoming.tagKey } : { tag: byLang(() => '') }),
  ...(upcoming?.descKey ? { descKey: upcoming.descKey } : { description: byLang(() => '') }),
  actionKey: 'enterAction',
  statusLabel: 'OPEN',
};

fs.mkdirSync(`${id}/images`, { recursive: true });
write(`${id}/game.json`, game);
if (!fs.existsSync(`${id}/reference.json`)) {
  write(`${id}/reference.json`, {
    schemaVersion: 1,
    id,
    title: en,
    languages,
    description: byLang(() => ''),
    source: { type: 'rulebook', note: byLang(() => '') },
    categories: [],
    items: [],
  });
}
console.log(`Created draft ${id}/ (order ${order}).`);
if (upcoming) console.log(`Reused the coming-soon card from data/upcoming.json; it disappears automatically when the game is published.`);
if (upcoming?.cover && !upcoming.cover.startsWith('assets/')) console.log(`The old cover was a remote URL (${upcoming.cover}); save the box image in a source folder and run scripts/images.mjs with --cover.`);
console.log(`Next: fill ${id}/reference.json, run node scripts/images.mjs ${id} <source-folder> --cover <box image>, then remove "draft" from ${id}/game.json.`);
