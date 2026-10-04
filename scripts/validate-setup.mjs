import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const data=JSON.parse(fs.readFileSync('data/setup.json','utf8'));
class Element {
 constructor(tag='div'){this.tag=tag;this.children=[];this.dataset={};this.events={};this.attrs={};this.value='';this.hidden=false;this.className='';this.content='';this.classList={toggle:(c,on)=>{const s=new Set(this.className.split(' '));on?s.add(c):s.delete(c);this.className=[...s].join(' ');},add:c=>this.classList.toggle(c,true),remove:c=>this.classList.toggle(c,false)};}
 set textContent(v){this.content=v;this.children=[];}
 get textContent(){return this.content+this.children.map(n=>n.textContent).join(' ');}
 append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}
 replaceChildren(...nodes){this.children=[];this.content='';this.append(...nodes);}
 after(n){this.parent.append(n);}
 setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(k,v){this.events[k]=v;}
 closest(tag){return this.tag===tag?this:this.parent?.closest(tag);}
 querySelectorAll(s){const all=this.children.flatMap(n=>[n,...n.querySelectorAll('*')]);return all.filter(n=>s==='*'||(s==='tbody tr'?n.tag==='tr'&&n.parent.tag==='tbody':s==='[data-setup-tab]'?n.dataset.setupTab:s.startsWith('.')?n.className.split(' ').includes(s.slice(1)):n.tag===s));}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
 click(){this.events.click?.({target:this});this.parent?.events.click?.({target:this});}
}
for(const [game,config] of Object.entries(data.games)){
 for(const row of config.rows){assert.equal(row.length,4);for(const cell of row)if(typeof cell==='string')assert.ok(data.text[cell]);}
 const body=new Element('body');body.dataset.setupGame=game;
 const layout=new Element(),top=new Element(),tabs=new Element(),search=new Element('input'),native=new Element('button');top.className='page-top';layout.append(top);native.dataset.show='all';const category=new Element('button');category.dataset.show='category';tabs.append(native,category);
 const document={body,documentElement:{lang:'ko'},getElementById:id=>id==='section-tabs'?tabs:id==='global-search'?search:null,querySelector:()=>layout,createElement:t=>new Element(t)};
 const window={BGW_SETUP:data};vm.runInNewContext(fs.readFileSync('assets/setup.js','utf8'),{document,window});
 const panel=layout.querySelector('.setup-panel');assert.equal(panel.hidden,false);assert.equal(native.attrs['aria-pressed'],'true');
 tabs.querySelector('[data-setup-tab]').click();assert.equal(panel.hidden,false);assert.equal(native.attrs['aria-pressed'],'false');assert.equal(tabs.querySelector('[data-setup-tab]').attrs['aria-pressed'],'true');assert.equal(panel.querySelectorAll('tbody tr').length,config.rows.length+(config.expansions || []).reduce((sum,group)=>sum+group.modules.length,0));
 for(const lang of ['ko','en','de','fr','ja','es',...(game==='marrakesh'?['zh']:[])]){
  for(const values of Object.values(data.text))assert.ok(values[lang]?.trim());
  window.BGWSetup.sync(lang);assert.equal(tabs.querySelector('[data-setup-tab]').textContent,data.text.setup[lang]);assert.ok(!panel.textContent.includes('undefined'));
 }
 if(config.expansions?.length){
  window.BGWSetup.sync('en');
  const group=panel.querySelector('.setup-expansion');
  assert.ok(group);assert.equal(group.querySelectorAll('tbody tr').length,6);
  assert.ok(panel.textContent.includes(data.text[config.scope].en));
  search.value='Assemble the three-part racecourse';search.events.input();
  assert.equal(group.hidden,false);
  assert.equal(panel.querySelectorAll('tbody tr').filter(row=>!row.hidden).length,1);
  assert.equal(panel.querySelectorAll('tbody tr').find(row=>!row.hidden).dataset.module,'camels');
  search.value='';search.events.input();
 }
 const expansionTwo=panel.querySelectorAll('.setup-expansion').find(group=>group.dataset.expansion==='expansion-2');
 if(expansionTwo){
  window.BGWSetup.sync('en');
  assert.equal(expansionTwo.querySelectorAll('tbody tr').length,6);
  search.value='Shuffle tiles 7';search.events.input();
  assert.equal(expansionTwo.hidden,false);
  const visible=panel.querySelectorAll('tbody tr').filter(row=>!row.hidden);
  assert.equal(visible.length,1);assert.equal(visible[0].dataset.module,'alms');
  search.value='Reveal only the top gift';search.events.input();
  const gifts=panel.querySelectorAll('tbody tr').filter(row=>!row.hidden);
  assert.equal(gifts.length,1);assert.equal(gifts[0].dataset.module,'gifts');
  search.value='';search.events.input();
 }
 search.value='zz_no_matching_setup_zz';search.events.input();assert.equal(panel.querySelector('.setup-no-results').hidden,false);
 search.value='';search.events.input();assert.equal(panel.querySelector('.setup-no-results').hidden,true);
 category.click();assert.equal(panel.hidden,true);assert.ok(!body.className.includes('setup-mode'));assert.equal(category.attrs['aria-pressed'],'true');
 assert.equal(tabs.querySelector('[data-setup-tab]').attrs['aria-pressed'],'false');
 native.click();assert.equal(panel.hidden,false);assert.equal(native.attrs['aria-pressed'],'true');assert.equal(category.attrs['aria-pressed'],'false');
 assert.equal(tabs.querySelectorAll('button').filter(button=>button.attrs['aria-pressed']==='true').length,1);
 tabs.querySelector('[data-setup-tab]').click();
 tabs.replaceChildren(native);window.BGWSetup.sync('en');window.BGWSetup.sync('en');assert.equal(tabs.querySelectorAll('[data-setup-tab]').length,1);assert.equal(tabs.querySelector('[data-setup-tab]').attrs['aria-pressed'],'true');
 native.click();assert.equal(panel.hidden,false);assert.ok(!body.className.includes('setup-mode'));
 const genericAll=new Element('button');genericAll.dataset.category='all';
 const genericCategory=new Element('button');genericCategory.dataset.category='tiles';
 tabs.replaceChildren(genericAll,genericCategory);window.BGWSetup.sync('en');
 genericCategory.click();assert.equal(panel.hidden,true);assert.equal(genericCategory.attrs['aria-pressed'],'true');
 window.BGWSetup.sync('de');assert.equal(genericCategory.attrs['aria-pressed'],'true');
 tabs.querySelector('[data-setup-tab]').click();window.BGWSetup.sync('fr');
 assert.equal(genericCategory.attrs['aria-pressed'],'false');
 assert.equal(tabs.querySelectorAll('button').filter(button=>button.attrs['aria-pressed']==='true').length,1);
 genericAll.click();assert.equal(panel.hidden,false);assert.ok(!body.className.includes('setup-mode'));
 const html=fs.readFileSync(`${game}/index.html`,'utf8');assert.ok(html.includes(`data-setup-game="${game}"`));assert.ok(html.includes('../assets/setup.js'));
}
console.log('PASS: setup tables for three games, translations, tab switching, search, and tab regeneration.');
