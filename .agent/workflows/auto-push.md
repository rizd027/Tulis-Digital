---
description: Automatically commit and push changes to GitHub
---
// turbo-all
1. Check if there are any uncommitted changes
   ```powershell
   git status --porcelain
   ```
2. If there are changes, add them
   ```powershell
   git add .
   ```
3. Commit the changes with a descriptive message
   ```powershell
   git commit -m "chore: auto-push updates"
   ```
4. Push to the main branch
   ```powershell
   git push origin main
   ```
