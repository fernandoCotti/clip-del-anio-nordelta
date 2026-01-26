# Run this script as Administrator to fix Git lock issues
# Right-click PowerShell and select "Run as Administrator", then run this script

Write-Host "🔧 Fixing Git repository lock issues (Admin mode required)..." -ForegroundColor Cyan

$projectPath = "C:\Projects\clip-del-anio-nordelta"
$gitPath = Join-Path $projectPath ".git"

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "`nPlease:" -ForegroundColor Yellow
    Write-Host "1. Right-click PowerShell" -ForegroundColor White
    Write-Host "2. Select 'Run as Administrator'" -ForegroundColor White
    Write-Host "3. Navigate to: $projectPath" -ForegroundColor White
    Write-Host "4. Run: .\fix-git-admin-required.ps1" -ForegroundColor White
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green

# Change to project directory
Set-Location $projectPath

# Stop any processes that might be locking files
Write-Host "`n🛑 Stopping processes that might lock files..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.Path -like "*git*" -or $_.Path -like "*OneDrive*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Remove lock files
Write-Host "`n🔓 Removing lock files..." -ForegroundColor Yellow
if (Test-Path "$gitPath\config.lock") {
    Remove-Item "$gitPath\config.lock" -Force -ErrorAction SilentlyContinue
}
if (Test-Path "$gitPath\index.lock") {
    Remove-Item "$gitPath\index.lock" -Force -ErrorAction SilentlyContinue
}

# Take ownership of .git directory
Write-Host "`n👤 Taking ownership of .git directory..." -ForegroundColor Yellow
takeown /F $gitPath /R /D Y 2>&1 | Out-Null
icacls $gitPath /reset /T /C /L 2>&1 | Out-Null
icacls $gitPath /grant "${env:USERNAME}:(F)" /T /C /L 2>&1 | Out-Null

Start-Sleep -Seconds 1

# Remove .git directory
Write-Host "`n🗑️  Removing .git directory..." -ForegroundColor Yellow
if (Test-Path $gitPath) {
    Remove-Item -Path $gitPath -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Initialize fresh Git repository
Write-Host "`n🔧 Initializing fresh Git repository..." -ForegroundColor Yellow
git init

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Git initialized successfully!" -ForegroundColor Green
    Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Configure Git (if needed):" -ForegroundColor White
    Write-Host "   git config user.name 'Your Name'" -ForegroundColor Gray
    Write-Host "   git config user.email 'your-email@example.com'" -ForegroundColor Gray
    Write-Host "`n2. Add and commit files:" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Gray
    Write-Host "   git branch -M main" -ForegroundColor Gray
} else {
    Write-Host "`n❌ Git initialization failed. You may need to restart your computer." -ForegroundColor Red
}
