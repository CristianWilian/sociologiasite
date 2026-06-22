# 📁 Estrutura do Projeto Refatorado

## Nova Organização

```
Sociologia/
├── backend/                    # 🔧 Backend Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/       # Camada de requisições HTTP
│   │   ├── services/          # Lógica de negócio
│   │   ├── models/            # Tipos e interfaces
│   │   ├── routes/            # Definição de rotas
│   │   ├── middleware/        # Auth middleware
│   │   ├── models/database.ts # Configuração do SQLite
│   │   ├── app.ts
│   │   └── server.ts
│   ├── data/                  # Banco de dados
│   │   └── sociologia.sqlite
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                  # 🎨 Frontend HTML/CSS/JS
│   ├── js/
│   │   ├── modules/
│   │   │   ├── api.ts         # Requisições HTTP
│   │   │   ├── auth.ts        # Login/registro
│   │   │   ├── tasks.ts       # CRUD de tarefas
│   │   │   ├── notes.ts       # CRUD de anotações
│   │   │   ├── events.ts      # CRUD de eventos
│   │   │   ├── calendar.ts    # Lógica calendário
│   │   │   └── utils.ts       # Utilitários
│   │   └── main.ts            # Bootstrap app
│   │
│   ├── css/
│   │   ├── components/
│   │   │   ├── themes.css     # Cores e variáveis
│   │   │   ├── base.css       # Estilos globais
│   │   │   ├── navbar.css
│   │   │   ├── cards.css
│   │   │   ├── buttons.css
│   │   │   ├── forms.css
│   │   │   ├── filters.css
│   │   │   ├── calendar.css
│   │   │   ├── auth.css
│   │   │   └── animations.css
│   │   └── index.css          # Import principal
│   │
│   ├── index.html             # Home/hub
│   ├── login.html             # Autenticação
│   ├── caderno.html           # Anotações
│   ├── importantes.html       # Tarefas
│   ├── calendario.html        # Calendário
│   └── package.json
│
├── data/                      # Banco compartilhado
│   └── sociologia.sqlite
│
├── README.md                  # Documentação principal
├── MIGRATION.md               # Guia de migração
├── PROJECT_STRUCTURE.md       # Este arquivo
├── .gitignore
└── setup.sh                   # Script de setup
```

## Arquivos Antigos (mantidos como referência)

```
Sociologia/ (raiz)
├── api.php          ❌ Removido (migrado para backend/)
├── script.js        ❌ Removido (refatorado em modules/)
├── style.css        ❌ Removido (separado em components/)
├── *.html           ✅ Mantidos e atualizados para novos paths
```

## Mapeamento de Funcionalidades

| Funcionalidade | Antes | Depois |
|---|---|---|
| **Autenticação** | `api.php` + `script.js` | `authService.ts` + `authController.ts` |
| **Tarefas** | `api.php` + `script.js` | `tasksService.ts` + `tasksController.ts` |
| **Anotações** | `api.php` + `script.js` | `notesService.ts` + `notesController.ts` |
| **Eventos** | `api.php` + `script.js` | `eventsService.ts` + `eventsController.ts` |
| **Calendário** | `script.js` | `modules/calendar.ts` |
| **Exportação** | `script.js` | `modules/utils.ts` |
| **Filtros** | CSS + `script.js` | `components/filters.css` + `modules/tasks.ts` |
| **Validação** | PHP | TypeScript types |

## Dependências

### Backend
```json
{
  "express": "^4.18.2",
  "express-session": "^1.17.3",
  "better-sqlite3": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3"
}
```

### Frontend
```json
{
  "typescript": "^5.0.0"
}
```

## URL dos Endpoints

### Antes (PHP)
```
POST/GET api.php?action=auth_register
POST/GET api.php?action=auth_login
POST/GET api.php?action=tasks_add
```

### Depois (Express)
```
POST /api/auth_register
POST /api/auth_login
POST /api/tasks_add
```

## Como Iniciar

1. **Backend:**
```bash
cd backend
npm install
npm run dev
```

2. **Frontend:**
Acesse `http://localhost:3000` no navegador

## Estrutura do Banco de Dados

```sql
-- Tabela de usuários
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de anotações
CREATE TABLE notes (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de tarefas
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  is_important INTEGER DEFAULT 1,
  is_done INTEGER DEFAULT 0,
  due_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de eventos
CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  detail TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Próximos Passos

- [ ] Compilar TypeScript para produção: `npm run build`
- [ ] Configurar HTTPS
- [ ] Adicionar testes (Jest)
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Deploy em servidor (Vercel, Railway, Heroku)
- [ ] Monitoramento e logs

## Suporte

Para dúvidas sobre a refatoração, consulte:
- `README.md` - Documentação principal
- `MIGRATION.md` - Guia de migração
- Comentários no código dos arquivos `.ts`
