# Cleanup script to delete posts, images, GIFs and Jekyll files.
# Run this script from the repository root in PowerShell if you want to perform deletions.

Write-Host "This script will permanently delete files in the following locations:" -ForegroundColor Yellow
Write-Host "  posts\  images\  Gifs\  _posts\  _layouts\  _config.yml  home.html" -ForegroundColor Yellow
Write-Host "Press Ctrl+C now to abort, or press Enter to continue..."
Read-Host

$pathsToRemove = @(
  "posts",
  "images",
  "Gifs",
  "_posts",
  "_layouts",
  "_config.yml",
  "home.html"
)

foreach ($p in $pathsToRemove) {
  if (Test-Path $p) {
    Write-Host "Removing: $p" -ForegroundColor Cyan
    Remove-Item -Path $p -Recurse -Force -ErrorAction SilentlyContinue
  } else {
    Write-Host "Not found: $p" -ForegroundColor DarkGray
  }
}

Write-Host "Cleanup complete. Review working directory and commit changes if desired." -ForegroundColor Green
