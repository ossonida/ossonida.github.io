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
const data=JSON.parse(fs.readFileSync('clocktower/reference.json','utf8'));
let saved;
document={documentElement:{},getElementById:get,createElement:t=>new Element(t),createDocumentFragment:()=>new Element('fragment'),addEventListener(){}};
get('lang-menu').hidden=true;
get('lang-switch').append(get('lang-button'),get('lang-menu'));
const context=vm.createContext({window:{BGW_REFERENCE:data},document,BGW:{getLanguage:()=> 'ko',setLanguage:lang=>{saved=lang;}}});
vm.runInContext(fs.readFileSync('assets/reference.js','utf8'),context);
const walk=(node,tag)=>[...(node.tag===tag?[node]:[]),...node.children.flatMap(n=>walk(n,tag))];
const rows=()=>walk(get('results'),'tbody').flatMap(n=>n.children);
assert.equal(rows().length,185);
assert.equal(get('results').children.length,8);
assert.equal(new Set(data.items.map(i=>i.id)).size,185);
const counts={tb:22,bmr:25,snv:25,traveller:15,flow:4,night:7,setup:15,carousel:72,xenophobia:27};
for(const lang of data.languages){
 get('lang-menu').children.find(b=>b.dataset.lang===lang).events.click();
 assert.equal(saved,lang);assert.equal(document.title,`BGW : ${data.titles[lang]}`);
 assert.equal(get('page-title').textContent,data.titles[lang]);
 for(const [index,cat] of data.categories.entries()){
  get('filters').children[index+1].events.click();assert.equal(rows().length,counts[cat.id]);
  assert.ok(rows().every(row=>row.children.at(-1).textContent?.trim()));
 }
 get('filters').children[0].events.click();
 get('search').value='Imp';get('search').events.input();assert.ok(rows().some(row=>row.id==='imp'));
 get('search').value='zz_missing_clocktower_zz';get('search').events.input();assert.equal(rows().length,0);assert.equal(get('empty').hidden,false);
 get('search').value='';get('search').events.input();assert.equal(rows().length,185);
 walk(rows()[0],'button')[0].events.click();assert.equal(get('image-dialog').open,true);
 get('modal-close').events.click();assert.equal(get('image-dialog').open,false);
 for(const item of data.items){assert.ok(item.name[lang]?.trim());assert.ok(item.text[lang]?.trim());}
}
const customScripts=JSON.parse(fs.readFileSync('clocktower/custom-scripts.json','utf8'));
const xenophobia=data.categories.find(category=>category.id==='xenophobia');
assert.deepEqual(xenophobia.items,customScripts[0].roles);
assert.equal(xenophobia.description.ko,'커스텀 시트 · Evil Steve · v1.0.0');
assert.equal(new Set(xenophobia.items).size,27);
assert.ok(xenophobia.items.every(id=>data.items.some(item=>item.id===id)));
const xenophobiaTeams=xenophobia.items.map(id=>data.items.find(item=>item.id===id)).reduce((counts,item)=>({...counts,[item.team]:(counts[item.team]||0)+1}),{});
assert.deepEqual(xenophobiaTeams,{townsfolk:13,outsider:6,minion:4,demon:1,traveller:3});
const characters=data.items.filter(item=>item.team);
assert.equal(characters.length,159);
for(const item of characters)assert.ok(fs.statSync('clocktower/'+item.image).size>0);
for(let n=5;n<=15;n++){
 const item=data.items.find(item=>item.id===`setup-${n}`);
 const counts=item.text.en.match(/\d+/g).map(Number);
 assert.equal(counts.reduce((a,b)=>a+b,0),n);assert.equal(counts.at(-1),1);
}
for(const item of data.items.filter(item=>item.category==='night'&&item.id!=='night-note')){
 const names=item.text.en.split(' → ');assert.equal(new Set(names).size,names.length);
 for(const name of names)assert.ok(['Minion information','Demon information'].includes(name)||characters.some(c=>c.name.en===name&&c.team!=='traveller'));
}
console.log('PASS: Clocktower 159 characters, 185 entries, six languages, nine tabs, Xenophobia sheet, setup counts, search and image dialog.');
