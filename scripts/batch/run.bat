@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo 🚀 Iniciando Plataforma de Sociologia
echo ========================================
echo.

cd /d "%~dp0..\..\backend"

echo 📦 Verificando dependências...
if not exist node_modules (
    echo Instalando dependências...
    call npm install
)

echo.
echo ✅ Iniciando servidor...
echo.
echo 🌐 Acesse: http://localhost:3000
echo 📖 Documentação: ..\..\docs\README.md
echo.

call npm run dev

pause
