# Script para eliminar .git bloqueado (ejecutar como Administrador)
# Click derecho > "Ejecutar con PowerShell" como Administrador

Write-Host "🔧 Solucionando problema de Git bloqueado por OneDrive..." -ForegroundColor Yellow
Write-Host "⚠️  Este script debe ejecutarse como Administrador" -ForegroundColor Red
Write-Host ""

$projectPath = "c:\Users\usuario\OneDrive\Fernando\OneDrive\Documentos\clip-del-anio-nordelta"

# Verificar si se ejecuta como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ Este script requiere permisos de Administrador" -ForegroundColor Red
    Write-Host "Por favor, haz clic derecho en este archivo y selecciona 'Ejecutar con PowerShell' como Administrador" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit
}

Set-Location $projectPath

# Intentar cerrar procesos que puedan estar usando los archivos
Write-Host "🔄 Cerrando procesos de OneDrive..." -ForegroundColor Cyan
Get-Process -Name "OneDrive" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Eliminar .git con fuerza
Write-Host "🗑️  Eliminando carpeta .git..." -ForegroundColor Cyan
if (Test-Path .git) {
    try {
        # Intentar eliminar archivos individualmente primero
        Get-ChildItem -Path .git -Recurse -Force | Remove-Item -Force -ErrorAction SilentlyContinue
        Remove-Item -Path .git -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Carpeta .git eliminada" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  No se pudo eliminar completamente. Intenta manualmente desde el Explorador de Archivos." -ForegroundColor Yellow
        Write-Host "   O pausa OneDrive y vuelve a ejecutar este script." -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  No hay carpeta .git para eliminar" -ForegroundColor Cyan
}

# Esperar un momento
Start-Sleep -Seconds 1

# Inicializar Git
Write-Host "📦 Inicializando Git..." -ForegroundColor Cyan
git init

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Git inicializado correctamente!" -ForegroundColor Green
    
    # Configurar usuario
    Write-Host "`n👤 Configura tu usuario de Git:" -ForegroundColor Cyan
    $userName = Read-Host "Nombre de usuario"
    $userEmail = Read-Host "Email"
    
    git config user.name $userName
    git config user.email $userEmail
    
    # Agregar archivos
    Write-Host "`n📝 Agregando archivos..." -ForegroundColor Cyan
    git add .
    
    # Crear commit
    Write-Host "💾 Creando commit inicial..." -ForegroundColor Cyan
    git commit -m "Initial commit - Tournament voting app ready for deployment"
    
    Write-Host "`n✅ ¡Todo listo!" -ForegroundColor Green
    Write-Host "`n📋 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Crea un repositorio en GitHub"
    Write-Host "2. Ejecuta estos comandos:"
    Write-Host "   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git"
    Write-Host "   git branch -M main"
    Write-Host "   git push -u origin main"
} else {
    Write-Host "❌ Error al inicializar Git" -ForegroundColor Red
    Write-Host "Intenta pausar OneDrive y ejecutar este script de nuevo" -ForegroundColor Yellow
}

Read-Host "`nPresiona Enter para salir"
