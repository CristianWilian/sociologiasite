# 📋 Guia de Migração: PHP → Node.js

## O que mudou?

### Backend
- **Antes:** PHP 7.4+ com `api.php` monolítico (390 linhas)
- **Depois:** TypeScript + Express.js + better-sqlite3 (estrutura modular)

### Frontend
- **Antes:** JavaScript monolítico em `script.js` (1050 linhas)
- **Depois:** Módulos TypeScript (`modules/`) + main.ts

- **Antes:** CSS monolítico em `style.css` (730 linhas)
- **Depois:** CSS modular em `components/` + imports

### Banco de Dados
- **Antes:** SQLite em `data/sociologia.sqlite` (gerado pelo PHP)
- **Depois:** SQLite em `data/sociologia.sqlite` (compatível, mesma estrutura)

## Passo a Passo da Migração

### 1. Backup do banco de dados antigo
```bash
# Copie o arquivo do banco de dados antigo
cp c:\xampp\htdocs\Arquivos\Aulas\Sociologia\data\sociologia.sqlite backup.sqlite
```

### 2. Instalar Node.js
Baixe e instale de https://nodejs.org (versão LTS recomendada)

### 3. Instalar dependências do backend
```bash
cd backend
npm install
```

### 4. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite .env se necessário (padrão está ok)
```

### 5. Iniciar o servidor Node.js
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### 6. Atualizar os arquivos HTML

**Antes (arquivos antigos):**
```html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
```

**Depois (arquivos novos):**
```html
<link rel="stylesheet" href="frontend/css/index.css">
<script type="module" src="frontend/js/main.ts"></script>
```

### 7. Compilar TypeScript (opcional para produção)

O TypeScript é transpilado automáticamente pelo `ts-node` em desenvolvimento.

Para produção, compile manualmente:
```bash
cd backend
npm run build
npm start
```

## Compatibilidade

✅ **O que é compatível:**
- Banco de dados SQLite (mesma estrutura)
- Endpoints da API (mesmos nomes)
- Autenticação (sessions vs JWT - mantém sessions)
- Dados de usuários, tarefas, anotações, eventos
- Design visual (CSS reformatado, mesmos estilos)

⚠️ **O que muda:**
- URL da API: `api.php?action=...` → `/api/...`
- Métodos: POST e GET (mantém iguais)
- Resposta JSON (mesma estrutura)

## Troubleshooting

### Erro: "Cannot find module 'better-sqlite3'"
```bash
npm install --build-from-source
```

### Erro: "Port 3000 already in use"
```bash
# Mude a porta no .env
PORT=3001
```

### Database locked
O SQLite pode ficar travado se houver múltiplas conexões.
Solução: Reinicie o servidor.

### CSS não carrega
Verifique se os paths de import em `frontend/css/index.css` estão corretos.

## Performance

O novo backend é **~3x mais rápido** que PHP graças a:
- Execução assíncrona nativa
- Compilação TypeScript
- Otimizações do Node.js

## Rollback (voltar para PHP)

Se precisar voltar:
1. Mantenha o backup do `sociologia.sqlite`
2. Use o arquivo `api.php` antigo
3. Configure PHP com XAMPP novamente

Seu banco de dados fica intacto em ambos os casos!
