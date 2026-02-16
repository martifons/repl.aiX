@echo off
chcp 65001 >nul
echo.
echo === Subir proyecto a GitHub ===
echo.
set /p REPO_URL="Pega la URL de tu repo (ej: https://github.com/tu-usuario/replaix.git): "
if "%REPO_URL%"=="" (
  echo No has puesto la URL. Vuelve a ejecutar subir-a-github.bat
  pause
  exit /b 1
)

cd /d "%~dp0"

echo.
echo Paso 1: Inicializando Git...
git init
if errorlevel 1 (
  echo ERROR: Git no esta instalado o no esta en el PATH.
  echo Instala Git desde https://git-scm.com/download/win
  pause
  exit /b 1
)

echo.
echo Paso 2: Anadiendo archivos...
git add .

echo.
echo Paso 3: Primer commit...
git commit -m "Primer subida del proyecto"
if errorlevel 1 echo (Si dice "nothing to commit", no pasa nada.)

echo.
echo Paso 4: Conectando con GitHub...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo Paso 5: Subiendo a main...
git branch -M main
git push -u origin main

echo.
if errorlevel 1 (
  echo Si ha pedido Password: en GitHub no se usa la contrasena.
  echo Usa un Token: GitHub - Settings - Developer settings - Personal access tokens - Generate.
  echo Marca "repo" y cuando pida Password PEGA EL TOKEN.
) else (
  echo Listo. Tu codigo esta en GitHub.
)
echo.
pause
