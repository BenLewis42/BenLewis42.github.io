export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { title, content, 'g-recaptcha-response': recaptcha } = req.body;

  // Verify reCAPTCHA
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptcha}`);
  if (!recaptchaRes.ok) return res.status(500).send('reCAPTCHA verification request failed');
  const recaptchaData = await recaptchaRes.json();
  if (!recaptchaData.success || recaptchaData.score < 0.5) return res.status(400).send(`reCAPTCHA failed: success=${recaptchaData.success}, score=${recaptchaData.score}`);

  // GitHub details from env
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;

  const date = new Date().toISOString().slice(0, 10);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const filename = `${date}-${slug}.md`;
  const frontMatter = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ndate: ${date} 00:00:00 -0000\n---\n\n`;
  const fileContent = frontMatter + content;
  const fileBase64 = Buffer.from(fileContent).toString('base64');

  // Commit post
  const postRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/_posts/${filename}`, {
    method: 'PUT',
    headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `Add post: ${title}`, content: fileBase64, branch })
  });
  if (!postRes.ok) return res.status(500).send('Failed to create post');

  res.status(200).send('Post submitted and published successfully!');
};