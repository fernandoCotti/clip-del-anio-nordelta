# Script para inicializar Git correctamente
# Ejecuta este script en PowerShell: .\setup-git.ps1

Write-Host "🚀 Inicializando Git..." -ForegroundColor Green

# Cambiar al directorio del proyecto
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

# Eliminar .git si existe (puede estar corrupto)
if (Test-Path .git) {
    Write-Host "⚠️  Eliminando carpeta .git existente..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .git
}

# Inicializar Git
Write-Host "📦 Inicializando repositorio Git..." -ForegroundColor Cyan
git init

# Configurar usuario (cambia estos valores)
Write-Host "`n👤 Configura tu usuario de Git:" -ForegroundColor Cyan
$userName = Read-Host "Nombre de usuario"
$userEmail = Read-Host "Email"

git config user.name $userName
git config user.email $userEmail

# Agregar archivos
Write-Host "`n📝 Agregando archivos..." -ForegroundColor Cyan
git add .

# Crear commit inicial
Write-Host "💾 Creando commit inicial..." -ForegroundColor Cyan
git commit -m "Initial commit - Tournament voting app ready for deployment"

Write-Host "`n✅ Git inicializado correctamente!" -ForegroundColor Green
Write-Host "`n📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Crea un repositorio en GitHub"
Write-Host "2. Ejecuta estos comandos (reemplaza TU_USUARIO y TU_REPOSITORIO):"
Write-Host "   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
