# Git Initialization and Deployment Setup Script
# Run this script after pausing OneDrive sync

Write-Host "🚀 Initializing Git and preparing for deployment..." -ForegroundColor Cyan

# Step 1: Remove any existing .git directory
Write-Host "`n📁 Cleaning up existing Git repository..." -ForegroundColor Yellow
if (Test-Path .git) {
    Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Step 2: Initialize Git
Write-Host "`n🔧 Initializing Git repository..." -ForegroundColor Yellow
git init

# Step 3: Configure Git (you may want to customize these)
Write-Host "`n⚙️  Configuring Git..." -ForegroundColor Yellow
$gitName = Read-Host "Enter your Git name (or press Enter to skip)"
$gitEmail = Read-Host "Enter your Git email (or press Enter to skip)"

if ($gitName) {
    git config user.name $gitName
}
if ($gitEmail) {
    git config user.email $gitEmail
}

# Step 4: Add all files
Write-Host "`n📦 Staging all files..." -ForegroundColor Yellow
git add .

# Step 5: Create initial commit
Write-Host "`n💾 Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit - Tournament voting app ready for deployment"

# Step 6: Create main branch (if not already)
Write-Host "`n🌿 Setting up main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host "`n✅ Git initialized successfully!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a repository on GitHub: https://github.com/new" -ForegroundColor White
Write-Host "2. Run these commands to connect and push:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host "`n3. Then follow the deployment guide in DEPLOYMENT.md" -ForegroundColor White
