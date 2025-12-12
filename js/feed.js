async function loadConfig(){
  try{ const r = await fetch('config.json'); return await r.json(); }catch(e){ return null; }
}

function parseFrontMatter(raw){
  const m = raw.match(/^---[\s\S]*?---/);
  if(!m) return { title: null, date: null };
  const yaml = m[0].replace(/---/g,'').trim();
  const obj = {}; yaml.split('\n').forEach(line=>{ const i=line.indexOf(':'); if(i>0){ const k=line.slice(0,i).trim(); const v=line.slice(i+1).trim().replace(/^"|"$/g,''); obj[k]=v; }});
  return { title: obj.title||null, date: obj.date||null };
}

async function renderFeed(){
  const cfg = await loadConfig();
  if(!cfg){ document.getElementById('posts').innerText='No config.json found.'; return; }
  const api = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/_posts?ref=${cfg.branch}`;
  const listRes = await fetch(api);
  if(!listRes.ok){ document.getElementById('posts').innerText='Unable to list posts: ' + listRes.status; return; }
  const files = await listRes.json();
  files.sort((a,b)=> (a.name<b.name)?1:-1);
  const container = document.getElementById('posts'); container.innerHTML='';
  for(const f of files){
    if(!f.name.match(/\.md$/)) continue;
    const rawUrl = `https://raw.githubusercontent.com/${cfg.owner}/${cfg.repo}/${cfg.branch}/_posts/${f.name}`;
    const r = await fetch(rawUrl); const text = await r.text(); const fm = parseFrontMatter(text);
    const title = fm.title || f.name; const date = fm.date || f.name.slice(0,10);
    const li = document.createElement('li'); const a = document.createElement('a'); a.href = rawUrl; a.innerText = title; a.target='_blank';
    li.appendChild(a); li.appendChild(document.createTextNode(' — ' + date)); container.appendChild(li);
  }
}

document.addEventListener('DOMContentLoaded', ()=>{ if(document.getElementById('posts')) renderFeed(); });
