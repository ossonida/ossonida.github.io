// Converts raw images for a game without installing anything: the browser does the encoding.
//
//   node scripts/images.mjs <id> <source-folder> [--cover <file-in-source>] [--max 1200]
//
// Starts a local page at http://127.0.0.1:8766/ that, once opened in a browser:
//   - converts every .jpg/.jpeg/.png/.webp in <source-folder> to <id>/images/<name>.webp (longest side <= --max)
//   - turns --cover into assets/covers/<id>.webp: the plain light background is made transparent and trimmed,
//     so the box art sits on the hub card colour (skipped automatically when the corners are not a flat light colour)
// The page shows every result on a dark background for a visual check, then the server exits.
// Raw inputs stay outside the repository; only the converted files are written into it.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const [id, source, ...rest] = process.argv.slice(2);
const flag = name => { const at = rest.indexOf('--' + name); return at >= 0 ? rest[at + 1] : undefined; };
const fail = message => { console.error(message); process.exit(1); };
if (!id || !source) fail('Usage: node scripts/images.mjs <id> <source-folder> [--cover <file>] [--max 1200]');
if (!fs.existsSync(`${id}/game.json`)) fail(`${id}/game.json not found; run scripts/new-game.mjs first.`);
if (!fs.statSync(source, { throwIfNoEntry: false })?.isDirectory()) fail(`Source folder not found: ${source}`);
const cover = flag('cover');
const max = Number(flag('max') || 1200);
const files = fs.readdirSync(source).filter(name => /\.(jpe?g|png|webp)$/i.test(name) && name !== cover);
if (cover && !fs.existsSync(path.join(source, cover))) fail(`Cover not found: ${path.join(source, cover)}`);
if (!files.length && !cover) fail('No .jpg, .png or .webp files in the source folder.');

const slug = name => path.basename(name, path.extname(name)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const jobs = [
  ...files.map(name => ({ name, out: `${id}/images/${slug(name)}.webp`, max, cutout: false })),
  ...(cover ? [{ name: cover, out: `assets/covers/${id}.webp`, max: 900, cutout: true }] : []),
];

const page = `<!doctype html><meta charset="utf-8"><title>BGW images: ${id}</title>
<style>body{margin:0;padding:20px;background:#111622;color:#e8e8e8;font:14px system-ui}figure{display:inline-block;margin:8px;padding:10px;background:#5a2d16;border-radius:10px;vertical-align:top}img{max-width:280px;max-height:280px;display:block}figcaption{margin-top:6px;font-size:12px}</style>
<h1>${id}: <span id="status">processing…</span></h1><div id="out"></div>
<script>
const jobs=${JSON.stringify(jobs)};
async function convert(job){
  const img=new Image();img.src='/src/'+encodeURIComponent(job.name);await img.decode();
  const s=Math.min(1,job.max/Math.max(img.width,img.height)),w=Math.round(img.width*s),h=Math.round(img.height*s);
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(img,0,0,w,h);
  let note='';
  if(job.cutout){
    const d=x.getImageData(0,0,w,h),p=d.data;
    const corner=[[0,0],[w-1,0],[0,h-1],[w-1,h-1]].map(([i,j])=>{const k=(j*w+i)*4;return[p[k],p[k+1],p[k+2]]});
    const bg=[0,1,2].map(ch=>Math.round(corner.reduce((a,v)=>a+v[ch],0)/4));
    const flat=corner.every(v=>v.every((n,ch)=>Math.abs(n-bg[ch])<=6))&&bg.every(n=>n>=220);
    if(flat){
      // Flood-fill the background from the edges with a tight tolerance, so white box faces survive.
      const dist=k=>Math.max(Math.abs(p[k]-bg[0]),Math.abs(p[k+1]-bg[1]),Math.abs(p[k+2]-bg[2]));
      const T=5,F=12,seen=new Uint8Array(w*h),q=[];
      for(let i=0;i<w;i++)q.push(i,(h-1)*w+i);for(let j=0;j<h;j++)q.push(j*w,j*w+w-1);
      while(q.length){const n=q.pop();if(seen[n])continue;seen[n]=1;const k=n*4;if(dist(k)>T)continue;p[k+3]=0;
        const i=n%w,j=(n-i)/w;if(i>0)q.push(n-1);if(i<w-1)q.push(n+1);if(j>0)q.push(n-w);if(j<h-1)q.push(n+w);}
      for(let n=0;n<w*h;n++){const k=n*4;if(!p[k+3])continue;const i=n%w,j=(n-i)/w;
        const nb=[i>0&&n-1,i<w-1&&n+1,j>0&&n-w,j<h-1&&n+w].filter(v=>v!==false);
        if(nb.some(m=>p[m*4+3]===0)&&dist(k)<F)p[k+3]=Math.round(255*dist(k)/F);}
      x.putImageData(d,0,0);
      let x0=w,y0=h,x1=0,y1=0;for(let n=0;n<w*h;n++)if(p[n*4+3]>8){const i=n%w,j=(n-i)/w;if(i<x0)x0=i;if(i>x1)x1=i;if(j<y0)y0=j;if(j>y1)y1=j;}
      const t=document.createElement('canvas');t.width=x1-x0+1;t.height=y1-y0+1;t.getContext('2d').drawImage(c,-x0,-y0);
      note='background removed';return finish(job,t,note);
    }
    note='background kept (not a flat light colour)';
  }
  return finish(job,c,note);
}
async function finish(job,canvas,note){
  const blob=await new Promise(r=>canvas.toBlob(r,'image/webp',0.86));
  const res=await fetch('/save?out='+encodeURIComponent(job.out),{method:'POST',body:blob});
  if(!res.ok)throw new Error(await res.text());
  const f=document.createElement('figure');f.innerHTML='<img><figcaption></figcaption>';
  f.querySelector('img').src=URL.createObjectURL(blob);
  f.querySelector('figcaption').textContent=job.out+' · '+canvas.width+'×'+canvas.height+' · '+Math.round(blob.size/1024)+' KB'+(note?' · '+note:'');
  document.getElementById('out').append(f);
  return {out:job.out,width:canvas.width,height:canvas.height,kb:Math.round(blob.size/1024),note};
}
(async()=>{const results=[],errors=[];
  for(const job of jobs){try{results.push(await convert(job))}catch(e){errors.push(job.name+': '+e.message)}}
  document.getElementById('status').textContent=errors.length?errors.length+' failed':'done ('+results.length+')';
  await fetch('/done',{method:'POST',body:JSON.stringify({results,errors})});
})();
</script>`;

const allowed = new Set(jobs.map(job => job.out));
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (req.method === 'GET' && url.pathname === '/') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(page); }
  if (req.method === 'GET' && url.pathname.startsWith('/src/')) {
    const name = decodeURIComponent(url.pathname.slice(5));
    if (!jobs.some(job => job.name === name)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'cache-control': 'no-store' }); return res.end(fs.readFileSync(path.join(source, name)));
  }
  const body = () => new Promise(resolve => { const chunks = []; req.on('data', c => chunks.push(c)); req.on('end', () => resolve(Buffer.concat(chunks))); });
  if (req.method === 'POST' && url.pathname === '/save') {
    const out = url.searchParams.get('out');
    if (!allowed.has(out)) { res.writeHead(400); return res.end('unexpected output path'); }
    return body().then(data => { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, data); res.end('ok'); });
  }
  if (req.method === 'POST' && url.pathname === '/done') {
    return body().then(data => {
      const { results, errors } = JSON.parse(data);
      for (const r of results) console.log(`wrote ${r.out} (${r.width}x${r.height}, ${r.kb} KB)${r.note ? ' - ' + r.note : ''}`);
      for (const e of errors) console.error('failed ' + e);
      res.end('ok');
      // Leave the page open a moment for the visual check, then stop.
      setTimeout(() => { server.close(); process.exit(errors.length ? 1 : 0); }, 30000);
      console.log('Done. The page stays viewable for 30 seconds.');
    });
  }
  res.writeHead(404); res.end();
});
server.listen(8766, '127.0.0.1', () => console.log(`Open http://127.0.0.1:8766/ in a browser to convert ${jobs.length} image(s) for ${id}.`));
