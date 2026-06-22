# 🚀 Quick Start - 5 Minutos para Rodar

## Opção 1: Automático (Recomendado para Windows)

```batch
# 1. Abra o terminal/PowerShell e navegue até a pasta do projeto
cd c:\xampp\htdocs\Arquivos\Aulas\Sociologia

# 2. Execute o script de setup
setup.bat

# 3. Depois execute
run.bat

# 4. Abra o navegador em http://localhost:3000
```

## Opção 2: Manual (Todos os SOs)

```bash
# 1. Instale dependências
cd backend
npm install

# 2. Copie o arquivo de ambiente (Windows)
copy .env.example .env
# Ou (Linux/Mac)
cp .env.example .env

# 3. Inicie o servidor
npm run dev

# 4. Em outro terminal, veja os logs:
# Você verá: 🚀 Servidor rodando em http://localhost:3000

# 5. Acesse no navegador
# http://localhost:3000
```

## Estrutura para Entender

```
📊 Como funciona:

┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR                                 │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  index.html, login.html, caderno.html, etc          │   │
│  │  Importa: frontend/css/index.css + frontend/js/main │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬──────────────────────────────────┘
                          │ HTTP Requests/Responses
                          ▼
        ┌─────────────────────────────────────┐
        │      EXPRESS.JS BACKEND             │
        │      (Port 3000)                    │
        │                                     │
        │  /api/auth_login                    │
        │  /api/tasks_list                    │
        │  /api/notes_add                     │
        │  /api/events_delete                 │
        │  ... (28 endpoints)                 │
        └──────────────┬──────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────┐
        │      SQLite Database                │
        │      data/sociologia.sqlite         │
        │                                     │
        │  • users                            │
        │  • tasks                            │
        │  • notes                            │
        │  • events                           │
        └─────────────────────────────────────┘
```

## Testando a Autenticação

```javascript
// 1. Registrar novo usuário
POST http://localhost:3000/api/auth_register
{
  "username": "teste",
  "password": "senha123"
}

// 2. Fazer login
POST http://localhost:3000/api/auth_login
{
  "username": "teste",
  "password": "senha123"
}

// 3. Verificar status
GET http://localhost:3000/api/auth_status

// 4. Adicionar tarefa
POST http://localhost:3000/api/tasks_add
{
  "title": "Estudar Durkheim",
  "is_important": true
}

// 5. Listar tarefas
GET http://localhost:3000/api/tasks_list
```

## Problemas Comuns

### ❌ "Port 3000 already in use"
```bash
# Mude para outra porta no .env
PORT=3001

# Ou mate o processo (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### ❌ "Cannot find module 'better-sqlite3'"
```bash
npm install --build-from-source
# Ou reinstale
rm -rf node_modules package-lock.json
npm install
```

### ❌ CSS não carrega
- Confirme que está acessando `http://localhost:3000` (não `localhost/` ou porta diferente)
- Verifique se `frontend/css/index.css` existe
- Abra DevTools (F12) e veja a aba Network para erros

### ❌ API retorna erro 401
- Faça login primeiro
- Verifique se cookies estão habilitados
- Limpe cache do navegador

## Estrutura de Pastas

```
Sociologia/
├── backend/              ← Servidor Node.js + Express
│   ├── src/
│   │   ├── controllers/  ← Lógica HTTP
│   │   ├── services/     ← Regras de negócio
│   │   ├── models/       ← Tipos TypeScript
│   │   └── ...
│   └── package.json
│
├── frontend/             ← HTML, CSS, JS
│   ├── js/modules/       ← Módulos (8 arquivos)
│   ├── css/components/   ← CSS modular (10 arquivos)
│   ├── *.html            ← Páginas
│   └── package.json
│
├── data/
│   └── sociologia.sqlite ← Banco de dados (auto-criado)
│
└── README.md, MIGRATION.md, PROJECT_STRUCTURE.md, etc
```

## Comandos Úteis

```bash
# Iniciar desenvolvimento
cd backend && npm run dev

# Compilar para produção
cd backend && npm run build

# Iniciar produção
cd backend && npm start

# Ver versão do Node
node --version

# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

## Modificando o Código

### Adicionar novo endpoint
1. Crie função em `backend/src/services/`
2. Crie handler em `backend/src/controllers/`
3. Adicione rota em `backend/src/routes/index.ts`

### Modificar frontend
1. Edite `frontend/js/modules/*.ts`
2. Ou edite `frontend/css/components/*.css`
3. O servidor auto-recarrega

### Adicionar validação
Use TypeScript interfaces em `backend/src/models/`

## Próximo Passo

**Após rodar pela primeira vez:**
1. Verifique se conseguiu fazer login
2. Teste criar uma tarefa
3. Teste adicionar uma anotação
4. Teste exportar em CSV
5. Se tudo funcionar ✅ - Leia `README.md` para mais detalhes!

## Suporte

- 📖 Documentação: `README.md`
- 🔄 Migração: `MIGRATION.md`
- 📁 Estrutura: `PROJECT_STRUCTURE.md`
- 📋 Arquivos: `FILES_CREATED.md`

---

**Pronto? Execute `npm run dev` e boa sorte! 🚀**
