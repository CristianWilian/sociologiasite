#!/bin/bash

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd "$(dirname "$0")/../../backend" || exit 1
npm install

# Criar arquivo .env
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
fi

# Voltar para raiz
cd "$(dirname "$0")/../.." || exit 1

echo "✅ Configuração concluída!"
echo ""
echo "Para iniciar o servidor:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "O servidor rodará em http://localhost:3000"
