@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo 📚 Plataforma de Sociologia - Setup
echo ========================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Por favor instale a partir de https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detectado
node --version

echo.
echo 📦 Instalando dependências do backend...
cd /d "%~dp0..\..\backend"
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências
        pause
        exit /b 1
    )
)
echo ✅ Dependências instaladas

echo.
echo 📝 Verificando arquivo .env...
if not exist .env (
    echo Criando arquivo .env...
    copy .env.example .env
    echo ✅ Arquivo .env criado
) else (
    echo ✅ Arquivo .env já existe
)

cd /d "%~dp0..\.."

echo.
echo ========================================
echo ✅ Setup concluído com sucesso!
echo ========================================
echo.
echo 🚀 Para iniciar o servidor:
echo.
echo    cd backend
echo    npm run dev
echo.
echo 🌐 O servidor estará em: http://localhost:3000
echo.
pause
