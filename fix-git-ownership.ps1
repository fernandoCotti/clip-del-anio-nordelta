# Run this as Administrator to fix Git ownership
# Right-click PowerShell > Run as Administrator, then run: .\fix-git-ownership.ps1

$projectPath = "C:\Projects\clip-del-anio-nordelta"
$gitPath = Join-Path $projectPath ".git"
$username = $env:USERNAME

Write-Host "🔧 Fixing Git ownership..." -ForegroundColor Cyan

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Set-Location $projectPath

# Take ownership
Write-Host "`n👤 Taking ownership of .git directory..." -ForegroundColor Yellow
takeown /F $gitPath /R /D Y 2>&1 | Out-Null

# Grant full control to current user
Write-Host "🔐 Granting permissions..." -ForegroundColor Yellow
icacls $gitPath /reset /T /C /L 2>&1 | Out-Null
icacls $gitPath /grant "${username}:(F)" /T /C /L 2>&1 | Out-Null

Write-Host "`n✅ Ownership fixed! You can now use Git normally." -ForegroundColor Green
Write-Host "`nTry running: git status" -ForegroundColor Cyan
