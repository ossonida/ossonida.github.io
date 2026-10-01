import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=process.cwd(), origin='https://ossonida.github.io';
const read=p=>fs.readFileSync(p,'utf8');
const catalog=JSON.parse(read('data/games.json'));
const referenceGames=catalog.filter(g=>g.reference);
const pages=['index.html',...catalog.filter(g=>g.href).map(g=>g.id+'/index.html')];
let count=0;
function check(value,base){
 if(!value||value.includes('${'))return;
 const u=new URL(value.replaceAll('&amp;','&'),base);
 if(u.origin!==origin)return;
 let target=path.join(root,decodeURIComponent(u.pathname));
 if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');
 let dir=root;
 for(const part of path.relative(root,target).split(path.sep)){
  assert.ok(fs.readdirSync(dir).includes(part),`Missing or wrong case: ${target}`);dir=path.join(dir,part);
 }
 count++;
}
for(const file of pages){
 const html=read(file), base=new URL(file,origin+'/');
 for(const [tag] of html.matchAll(/<(?:a|img|script|link)\b[^>]*>/gi)){
  for(const [,value] of tag.matchAll(/(?:href|src)="([^"]+)"/g))check(value,base);
 }
 for(const [,attrs,code] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
  if(attrs.includes('application/ld+json'))JSON.parse(code);else new vm.Script(code,{filename:file});
 }
 for(const [,value] of html.matchAll(/["']((?:\.\.?\/|img\/)[^"'<>\s]+)["']/g))check(value,base);
 assert.ok(html.includes('assets/site.js'));
 for(const [,src] of html.matchAll(/<script[^>]+src="([^"]+)"/g)){if(!src.startsWith('http'))new vm.Script(read(path.join(path.dirname(file),src)),{filename:src});}
}
const data=vm.createContext({window:{}});
for(const file of ['marrakesh/reference-data.js','marrakesh/reference-translations.js'])vm.runInContext(read(file),data);
for(const rows of Object.values(data.window.referenceData))for(const item of rows)if(item.image)check(item.image,origin+'/marrakesh/');
const urls=[...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const expectedUrls=7+catalog.filter(g=>g.href).reduce((n,g)=>n+1+g.languages.length,0);
assert.equal(urls.length,expectedUrls);assert.equal(new Set(urls).size,expectedUrls);urls.forEach(u=>check(u,origin));
for(const game of referenceGames){const d=JSON.parse(read(game.reference));assert.equal(new Set(d.items.map(i=>i.id)).size,d.items.length);for(const item of d.items){if(item.image)check(item.image,origin+'/'+game.id+'/');}}
const hubContext=vm.createContext({window:{}});vm.runInContext(read('assets/games.js'),hubContext);assert.equal(JSON.stringify(hubContext.window.BGW_GAMES),JSON.stringify(catalog));
for(const game of catalog.filter(g=>g.href)){check(game.href,origin+'/');if(game.cover)check(game.cover,origin+'/');}
const langs=['ko','en','de','fr','ja','es'];
function env(href,links=[],prefs={},blocked=false){
 const location=new URL(href),store=new Map(Object.entries(prefs));
 const window={location,history:{state:{},replaceState(s,t,u){location.href=String(u);}}};
 const c=vm.createContext({window,URL,URLSearchParams,navigator:{language:'en-US'},document:{querySelectorAll:()=>links},localStorage:{getItem(k){if(blocked)throw Error();return store.get(k);},setItem(k,v){if(blocked)throw Error();store.set(k,v);}}});
 vm.runInContext(read('assets/site.js'),c);return {api:window.BGW,location,store};
}
const link=href=>({href,dataset:{},getAttribute(){return this.href;}});
assert.equal(env(origin+'/?lang=ja',[],{referenceLanguage:'de'}).api.getLanguage(langs),'ja');
assert.equal(env(origin+'/',[],{'gah-lang':'de'}).api.getLanguage(langs,'gah-lang'),'de');
assert.equal(env(origin+'/',[],{referenceLanguage:'fr','gah-lang':'de'}).api.getLanguage(langs,'gah-lang'),'fr');
for(const prefix of ['/','/preview/'])for(const lang of langs)for(const game of ['gah','marrakesh']){
 const entry=link('./'+game+'/'),hub=env(origin+prefix+'?keep=1#top',[entry],{},true);
 hub.api.setLanguage(lang,{updateUrl:true});
 assert.equal(hub.location.searchParams.get('keep'),'1');assert.equal(hub.location.hash,'#top');
 assert.equal(entry.href,origin+prefix+game+'/?lang='+lang);
 const home=link('../'),page=env(entry.href,[home],{},true);
 assert.equal(page.api.getLanguage(langs),lang);page.api.setLanguage(lang);
 assert.equal(home.href,origin+prefix+'?lang='+lang);
}
const home=link('../'),zh=env(origin+'/marrakesh/?lang=zh',[home]);
assert.equal(zh.api.getLanguage([...langs,'zh']),'zh');zh.api.setLanguage('zh');assert.equal(home.href,origin+'/?lang=en');
console.log(`PASS: ${pages.length} pages, JavaScript/JSON syntax, ${count} local references (including dynamic images), ${urls.length} sitemap URLs, language round trips and blocked storage.`);
