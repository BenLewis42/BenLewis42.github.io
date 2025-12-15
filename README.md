# BenLewis42.github.io

This repository contains a private blog with auto-approval for user-submitted posts.

## How It Works
- **Home Page** (`index.html`): Displays a feed of posts from `_posts/`.
- **Submit Page** (`submit.html`): Users can submit posts with title, content, and images. Posts are auto-published after reCAPTCHA verification.

## Setup
1. Deploy to Vercel and set environment variables:
   - `GITHUB_OWNER`: BenLewis42
   - `GITHUB_REPO`: BenLewis42.github.io
   - `GITHUB_BRANCH`: main
   - `GITHUB_TOKEN`: Your GitHub PAT with `repo` permissions
   - `RECAPTCHA_SECRET_KEY`: Your reCAPTCHA secret key
2. Update `config.json` with your details.
3. Users visit `submit.html` to post.

## Security
- Private site: Only authorized users can access.
- reCAPTCHA prevents spam.
- PAT is stored securely in Vercel env vars.