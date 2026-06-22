# 📚 Plataforma de Estudos de Sociologia

Uma aplicação web modular e responsiva para gerenciamento de estudos, tarefas, anotações e calendário de eventos de Sociologia.

## 🏗️ Arquitetura

### Backend (Node.js + TypeScript)
```
backend/
├── src/
│   ├── controllers/     # Lógica de requisições HTTP
│   ├── services/        # Regra de negócio
│   ├── models/          # Tipos e interfaces TypeScript
│   ├── routes/          # Definição de rotas Express
│   ├── middleware/      # Autenticação e autorização
│   ├── app.ts          # Configuração Express
│   └── server.ts       # Entrada da aplicação
├── package.json
└── tsconfig.json
```

**Endpoints da API:**
- `POST /api/auth_register` - Registrar novo usuário
- `POST /api/auth_login` - Fazer login
- `GET /api/auth_status` - Verificar status de autenticação
- `POST /api/auth_logout` - Fazer logout
- `GET /api/tasks_list` - Listar tarefas
- `POST /api/tasks_add` - Adicionar tarefa
- `POST /api/tasks_toggle` - Marcar/desmarcar tarefa
- `POST /api/tasks_delete` - Deletar tarefa
- `GET /api/notes_list` - Listar anotações
- `POST /api/notes_add` - Adicionar anotação
- `POST /api/notes_delete` - Deletar anotação
- `POST /api/notes_clear` - Deletar todas anotações
- `GET /api/events_list` - Listar eventos
- `POST /api/events_add` - Adicionar evento
- `POST /api/events_delete` - Deletar evento
- `POST /api/events_clear` - Deletar todos eventos

### Frontend (Vanilla JS + CSS Modular)
```
frontend/
├── js/
│   ├── modules/
│   │   ├── api.ts       # Comunicação HTTP
│   │   ├── auth.ts      # Autenticação
│   │   ├── tasks.ts     # Gerenciamento de tarefas
│   │   ├── notes.ts     # Gerenciamento de anotações
│   │   ├── events.ts    # Gerenciamento de eventos
│   │   ├── calendar.ts  # Lógica do calendário
│   │   └── utils.ts     # Utilitários (export, etc)
│   └── main.ts          # Integração e bootstrap
├── css/
│   ├── components/
│   │   ├── themes.css       # Variáveis de cores
│   │   ├── base.css         # Estilos globais
│   │   ├── navbar.css       # Navegação
│   │   ├── cards.css        # Cartões e layouts
│   │   ├── buttons.css      # Botões
│   │   ├── forms.css        # Formulários
│   │   ├── filters.css      # Filtros
│   │   ├── calendar.css     # Calendário
│   │   ├── auth.css         # Autenticação
│   │   └── animations.css   # Animações
│   └── index.css            # Arquivo principal (imports)
├── *.html               # Páginas HTML
└── package.json
```

**Estrutura de Pages:**
- `index.html` - Página inicial (hub)
- `login.html` - Autenticação
- `caderno.html` - Gerenciamento de anotações
- `importantes.html` - Gerenciamento de tarefas e eventos
- `calendario.html` - Visualização de calendário

### Banco de Dados (SQLite)
```
data/
└── sociologia.sqlite
    ├── users
    ├── notes
    ├── tasks
    └── events
```

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Backend

1. Instale as dependências:
```bash
cd backend
npm install
```

2. Crie o arquivo `.env`:
```bash
cp .env.example .env
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O backend rodará em `http://localhost:3000`

### Frontend

O frontend está na pasta `frontend/` e é servido como arquivos estáticos pelo Express.

Para desenvolvimento local com hot reload:

```bash\
cd frontend
npm install
npm run dev
```

Ou abra `http://localhost:3000` depois que o backend estiver rodando.

## 📦 Build para Produção

### Backend
```bash
cd backend
npm install --production
npm run build
npm start
```

### Frontend
Já está pronto para produção! Basta copiar a pasta `frontend` para o servidor.

## 🎨 Design

**Paleta de Cores:**
- Primário: `#2f5d50` (verde floresta)
- Auxiliar: `#d4a373` (ouro)
- Contraste: `#d1495b` (vermelho suave)
- Madeira: `#3b2416`, `#7a4f2a`, `#b7854f`

**Fonts:**
- Títulos: Cinzel (serif)
- Corpo: Nunito (sans-serif)

**Responsividade:**
- Mobile-first approach
- Grid CSS para layouts complexos
- Flexbox para componentes

## 🔐 Autenticação

- Senhas hasheadas com bcryptjs
- Sessions server-side com express-session
- Cookies HTTP-only
- Per-user data isolation via user_id foreign key

## 📄 Licença

MIT
