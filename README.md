# BenLewis42.github.io

This repository now contains a minimal blog with an in-site admin that can publish posts and upload media directly to this repository using the GitHub API.

Quick start
- Edit `config.json` and set `owner` and `repo` to your GitHub account and repository name.
- Open `admin.html` in the browser. Provide:
	- your GitHub owner and repository
	- the branch to commit to (usually `main`)
	- a GitHub Personal Access Token (PAT) with `repo` permissions (for public repo, `public_repo` is sufficient)

Publishing posts
- In `admin.html` fill the post title, date (defaults to today), slug (optional), content (Markdown), and choose images to upload. Click `Publish to GitHub`.
- The admin will upload images to `images/` and create a Markdown file under `_posts/YYYY-MM-DD-slug.md` with YAML front matter.

Home feed
- `index.html` uses `config.json` and the GitHub API to list and link posts from `_posts/`.

Security
- The PAT is required to commit files to the repository. Keep it private. The admin page does not store the token permanently (except if you store it in browser autofill). Use a token with minimal scopes.

If you want me to enable automatic cleanup (delete `posts/`, `images/`, `Gifs/`) here, confirm and I will proceed.