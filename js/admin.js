async function apiPutFile(owner, repo, path, contentBase64, message, branch, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  const body = { message, content: contentBase64, branch };
  const res = await fetch(url, { method: 'PUT', headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res.json();
}

function setStatus(msg, isError=false){
  const s = document.getElementById('status'); s.innerText = msg; s.style.color = isError? 'crimson':'#080';
}

document.getElementById('saveDraft').addEventListener('click', ()=>{
  const draft = { title: title.value, date: date.value, slug: slug.value, content: content.value };
  localStorage.setItem('blog_draft', JSON.stringify(draft)); setStatus('Draft saved locally.');
});

document.getElementById('publish').addEventListener('click', async ()=>{
  const cfg = await (await fetch('config.json')).json();
  const owner = cfg.owner;
  const repo = cfg.repo;
  const branch = cfg.branch || 'main';
  const token = document.getElementById('token').value.trim();
  if(!token){ setStatus('Token is required.', true); return; }

  const titleVal = document.getElementById('title').value.trim();
  const dateVal = document.getElementById('date').value || new Date().toISOString().slice(0,10);
  const slugVal = document.getElementById('slug').value.trim() || titleVal.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const contentVal = document.getElementById('content').value || '';
  const imagesInput = document.getElementById('images');

  setStatus('Uploading images (if any)...');
  // Upload images sequentially
  for (const f of imagesInput.files){
    const path = `images/${f.name}`;
    const arr = await f.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arr)));
    const msg = `Add image ${f.name}`;
    await apiPutFile(owner, repo, path, base64, msg, branch, token);
  }

  setStatus('Publishing post...');
  const filename = `${dateVal}-${slugVal}.md`;
  const frontMatter = `---\ntitle: "${titleVal.replace(/"/g,'\"')}"\ndate: ${dateVal} 00:00:00 -0000\n---\n\n`;
  const fileContent = frontMatter + contentVal + '\n';
  const fileBase64 = btoa(unescape(encodeURIComponent(fileContent)));
  const postPath = `_posts/${filename}`;
  const result = await apiPutFile(owner, repo, postPath, fileBase64, `Add post ${titleVal}`, branch, token);
  if(result && result.commit){ setStatus('Post published successfully.'); }
  else setStatus('Error publishing post. See console.', true);
});
