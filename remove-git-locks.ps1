# Run as Administrator to remove Git lock files
# Right-click PowerShell > Run as Administrator, then: .\remove-git-locks.ps1

$projectPath = "C:\Projects\clip-del-anio-nordelta"
$gitPath = Join-Path $projectPath ".git"

Write-Host "🔓 Removing Git lock files..." -ForegroundColor Cyan

Set-Location $projectPath

# Remove all lock files
$lockFiles = @(
    ".git\index.lock",
    ".git\HEAD.lock",
    ".git\config.lock"
)

foreach ($lockFile in $lockFiles) {
    $fullPath = Join-Path $projectPath $lockFile
    if (Test-Path $fullPath) {
        Write-Host "Removing $lockFile..." -ForegroundColor Yellow
        Remove-Item $fullPath -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 500
    }
}

# Also try to remove any other lock files
Get-ChildItem $gitPath -Filter *.lock -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "`n✅ Lock files removed!" -ForegroundColor Green
Write-Host "`nNow you can run:" -ForegroundColor Cyan
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'Initial commit'" -ForegroundColor White
