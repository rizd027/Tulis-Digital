# Auto-push script for Tulis Izin Digital
# Usage: .\auto-push.ps1 "Your commit message"

param (
    [string]$Message = "fix: update and improvements"
)

Write-Host "🚀 Starting auto-push process..." -ForegroundColor Cyan

# Check for changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ No changes to push." -ForegroundColor Green
    exit
}

Write-Host "📦 Adding changes..." -ForegroundColor Yellow
git add .

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $Message

Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✨ Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push. Please check your internet connection or git credentials." -ForegroundColor Red
}
