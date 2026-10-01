import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
let document;
class Element {
 constructor(tag='div'){this.tag=tag;this.children=[];this.dataset={};this.events={};this.attrs={};this.value='';this.textContent='';this.hidden=false;}
 append(...nodes){for(const node of nodes)this.children.push(...(node.tag==='fragment'?node.children:[node]));}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(k,v){this.events[k]=v;}
 showModal(){this.open=true;}
 close(){this.open=false;}
 focus(){document.activeElement=this;}
 contains(node){return node===this||this.children.some(c=>c.contains(node));}
}
const ids=new Map();
const get=id=>{if(!ids.has(id))ids.set(id,new Element());return ids.get(id);};
const data=JSON.parse(fs.readFileSync('burgundy/reference.json','utf8'));
let saved;
document={documentElement:{},getElementById:get,createElement:t=>new Element(t),createDocumentFragment:()=>new Element('fragment'),addEventListener(){}};
get('lang-menu').hidden=true;
get('lang-switch').append(get('lang-button'),get('lang-menu'));
const context=vm.createContext({window:{BGW_REFERENCE:data},document,BGW:{getLanguage:()=> 'ko',setLanguage:lang=>{saved=lang;}}});
vm.runInContext(fs.readFileSync('assets/reference.js','utf8'),context);
const walk=(node,tag)=>[...(node.tag===tag?[node]:[]),...node.children.flatMap(n=>walk(n,tag))];
const rows=()=>walk(get('results'),'tbody').flatMap(n=>n.children);
assert.equal(rows().length,51);
assert.equal(get('results').children.length,7);
assert.equal(saved,'ko');
assert.equal(get('lang-menu').children.length,6);
get('lang-button').events.click();assert.equal(get('lang-menu').hidden,false);
assert.equal(document.activeElement.dataset.lang,'ko');
get('lang-switch').events.keydown({key:'ArrowDown',preventDefault(){}});
assert.equal(document.activeElement.dataset.lang,'en');
get('lang-switch').events.keydown({key:'Escape'});assert.equal(get('lang-menu').hidden,true);
assert.equal(document.activeElement,get('lang-button'));
get('filters').children[5].events.click();assert.equal(rows().length,21);
get('search').value='일꾼';get('search').events.input();assert.ok(rows().length>0&&rows().length<21);
get('search').value='no_such_reference';get('search').events.input();assert.equal(rows().length,0);assert.equal(get('empty').hidden,false);
get('search').value='';get('search').events.input();
for(const lang of data.languages){
 const button=get('lang-menu').children.find(b=>b.dataset.lang===lang);
 button.events.click();assert.equal(saved,lang);assert.equal(document.documentElement.lang,lang);
 assert.equal(rows().length,21);assert.equal(get('lang-menu').hidden,true);
 assert.equal(rows()[0].children.at(-1).textContent,data.items.find(i=>i.id==='monastery-1').text[lang]);
 walk(rows()[0],'button')[0].events.click();assert.equal(get('image-dialog').open,true);
 assert.equal(get('modal-text').textContent,data.items.find(i=>i.id==='monastery-1').text[lang]);
 get('modal-close').events.click();assert.equal(get('image-dialog').open,false);
 for(const item of data.items){assert.ok(item.name[lang]?.trim());assert.ok(item.text[lang]?.trim());}
 for(const category of data.categories)assert.ok(category.name[lang]?.trim());
}
get('filters').children[4].events.click();
assert.equal(rows().length,8);
assert.equal(rows()[0].children.length,3,'Buildings must not have fabricated numbers');
assert.equal(new Set(data.items.map(i=>i.id)).size,51);
for(const file of ['gah/index.html','marrakesh/index.html','burgundy/index.html'])assert.ok(fs.readFileSync(file,'utf8').includes('../assets/reference-layout.css'));
console.log('PASS: unified table layout, 51 entries in six languages, filters, search, keyboard language menu and image dialog.');
