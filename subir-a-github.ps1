# Script para subir el proyecto a GitHub
# 1. Instala Git desde https://git-scm.com/download/win si aun no lo tienes
# 2. Abre PowerShell o la terminal de Cursor EN ESTA CARPETA y ejecuta: .\subir-a-github.ps1
# 3. Cuando pida la URL del repo, pega la tuya (ej: https://github.com/tu-usuario/replaix.git)

$repoUrl = Read-Host "Pega la URL de tu repositorio de GitHub (ej: https://github.com/tu-usuario/replaix.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "No has puesto la URL. Vuelve a ejecutar el script y pega la URL." -ForegroundColor Red
    exit 1
}

$projectPath = $PSScriptRoot
Set-Location $projectPath

Write-Host "`n--- Paso 1: Inicializando Git ---" -ForegroundColor Cyan
git init
if ($LASTEXITCODE -ne 0) { Write-Host "Error en git init. ¿Tienes Git instalado?" -ForegroundColor Red; exit 1 }

Write-Host "`n--- Paso 2: Configurando nombre y email (solo si es la primera vez) ---" -ForegroundColor Cyan
$name = git config --global user.name 2>$null
$email = git config --global user.email 2>$null
if (-not $name) { git config user.name "Replaix" }
if (-not $email) { git config user.email "replaix@localhost" }

Write-Host "`n--- Paso 3: Anadiendo todos los archivos ---" -ForegroundColor Cyan
git add .

Write-Host "`n--- Paso 4: Creando el primer commit ---" -ForegroundColor Cyan
git commit -m "Primer subida del proyecto"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Si dice 'nothing to commit', ya estaba todo subido. Continuando..." -ForegroundColor Yellow
}

Write-Host "`n--- Paso 5: Conectando con GitHub ---" -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin $repoUrl

Write-Host "`n--- Paso 6: Rama main y subida ---" -ForegroundColor Cyan
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nListo. Tu codigo esta en GitHub." -ForegroundColor Green
} else {
    Write-Host "`nEl 'push' puede haber pedido usuario/contraseña." -ForegroundColor Yellow
    Write-Host "En GitHub ya no se usa la contraseña: hay que usar un Token." -ForegroundColor Yellow
    Write-Host "Ve a GitHub -> Settings -> Developer settings -> Personal access tokens -> Generate new token." -ForegroundColor Yellow
    Write-Host "Marca 'repo' y genera. Cuando la terminal pida Password, PEGA EL TOKEN (no se vera nada)." -ForegroundColor Yellow
}
