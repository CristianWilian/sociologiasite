import { getAuthStatus, getCurrentUser, setCurrentUser, logoutUser } from './modules/auth';
import { loadTasks, getTasksCache, getFilteredTasks, getTasksSummary, addTask, toggleTask, deleteTask } from './modules/tasks';
import { loadNotes, getNotesCache, searchNotes, addNote, deleteNote, clearAllNotes } from './modules/notes';
import { loadEvents, getEventsCache, addEvent, deleteEvent, clearAllEvents } from './modules/events';
import { generateCalendarMonth, getMonthName, getDayName } from './modules/calendar';
import { exportAsCsv, openPdfWindow } from './modules/utils';

// ============= DOM Elements =============
const topNav = document.getElementById('topNav');
const scrollProgress = document.getElementById('scrollProgress');
const currentUserBadge = document.getElementById('currentUserBadge');
const logoutBtn = document.getElementById('logoutBtn');

const tasksList = document.getElementById('tasksList');
const taskForm = document.getElementById('taskForm');
const taskFilters = document.getElementById('taskFilters');
const summaryTotal = document.getElementById('summaryTotal');
const summaryPending = document.getElementById('summaryPending');
const summaryUrgent = document.getElementById('summaryUrgent');
const exportTasksCsvBtn = document.getElementById('exportTasksCsvBtn');
const exportTasksPdfBtn = document.getElementById('exportTasksPdfBtn');

const noteInput = document.getElementById('noteInput') as HTMLTextAreaElement;
const noteSearch = document.getElementById('noteSearch') as HTMLInputElement;
const saveNoteBtn = document.getElementById('saveNoteBtn');
const clearNotesBtn = document.getElementById('clearNotesBtn');
const notesList = document.getElementById('notesList');
const exportNotesCsvBtn = document.getElementById('exportNotesCsvBtn');
const exportNotesPdfBtn = document.getElementById('exportNotesPdfBtn');

const eventForm = document.getElementById('eventForm');
const clearEventsBtn = document.getElementById('clearEventsBtn');
const eventsList = document.getElementById('eventsList');
const eventAlert = document.getElementById('eventAlert');
const exportEventsCsvBtn = document.getElementById('exportEventsCsvBtn');
const exportEventsPdfBtn = document.getElementById('exportEventsPdfBtn');

const calendarGrid = document.getElementById('calendarGrid');
const calendarMonthLabel = document.getElementById('calendarMonthLabel');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const calendarEventsList = document.getElementById('calendarEventsList');

const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const registerForm = document.getElementById('registerForm') as HTMLFormElement;
const authMessage = document.getElementById('authMessage');

// ============= State =============
let taskFilterMode: 'all' | 'pending' | 'done' = 'all';
let calendarDate = new Date();

// ============= Helper Functions =============
function isLoginPage(): boolean {
  return window.location.pathname.endsWith('/login.html');
}

function redirectToPage(page: string): void {
  window.location.href = `/${page}`;
}

// ============= Rendering Functions =============
function renderTasks(): void {
  if (!tasksList) return;

  const tasks = getFilteredTasks(taskFilterMode);
  tasksList.innerHTML = tasks
    .map(
      (task) => `
    <div class="task-item ${task.is_done ? 'done' : ''} ${task.is_important ? 'important' : ''}">
      <input type="checkbox" ${task.is_done ? 'checked' : ''} onchange="window.app.toggleTask(${task.id})">
      <span>${task.title}</span>
      <button onclick="window.app.deleteTask(${task.id})" class="delete-btn">×</button>
    </div>
  `
    )
    .join('');

  updateTaskSummary();
}

function renderNotes(): void {
  if (!notesList) return;

  const notes = getNotesCache();
  notesList.innerHTML = notes
    .map(
      (note) => `
    <div class="note-item">
      <p>${note.content}</p>
      <button onclick="window.app.deleteNote(${note.id})" class="delete-btn">Deletar</button>
    </div>
  `
    )
    .join('');
}

function renderEvents(): void {
  if (!eventsList) return;

  const events = getEventsCache();
  eventsList.innerHTML = events
    .map(
      (event) => `
    <div class="event-item">
      <strong>${event.title}</strong> - ${event.event_date}
      <p>${event.detail || ''}</p>
      <button onclick="window.app.deleteEvent(${event.id})" class="delete-btn">Deletar</button>
    </div>
  `
    )
    .join('');
}

function renderCalendar(): void {
  if (!calendarGrid || !calendarMonthLabel) return;

  const calendar = generateCalendarMonth(calendarDate.getFullYear(), calendarDate.getMonth());

  calendarMonthLabel.textContent = `${getMonthName(calendar.month)} ${calendar.year}`;

  calendarGrid.innerHTML = '';

  // Weekday headers
  const weekdayRow = document.createElement('div');
  weekdayRow.className = 'weekday-header';
  for (let i = 0; i < 7; i++) {
    const day = document.createElement('div');
    day.textContent = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][i];
    weekdayRow.appendChild(day);
  }
  calendarGrid.appendChild(weekdayRow);

  // Calendar days
  calendar.weeks.forEach((week) => {
    const weekRow = document.createElement('div');
    weekRow.className = 'calendar-week';

    week.forEach((day) => {
      const dayEl = document.createElement('div');
      dayEl.className = `calendar-day ${day.isCurrentMonth ? '' : 'other-month'} ${day.events.length ? 'has-events' : ''}`;
      dayEl.innerHTML = `
        <div class="day-number">${day.dayOfMonth}</div>
        ${day.events.map((e) => `<div class="event-chip">${e.title}</div>`).join('')}
      `;
      weekRow.appendChild(dayEl);
    });

    calendarGrid.appendChild(weekRow);
  });
}

function updateTaskSummary(): void {
  const summary = getTasksSummary();
  if (summaryTotal) summaryTotal.textContent = String(summary.total);
  if (summaryPending) summaryPending.textContent = String(summary.pending);
  if (summaryUrgent) summaryUrgent.textContent = String(summary.urgent);
}

// ============= Event Listeners =============
async function initTaskForm(): Promise<void> {
  if (!taskForm) return;

  taskForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const titleInput = (taskForm.querySelector('input[type="text"]') as HTMLInputElement).value;
    if (!titleInput) return;

    try {
      await addTask(titleInput);
      renderTasks();
      (taskForm.querySelector('input[type="text"]') as HTMLInputElement).value = '';
    } catch (error) {
      alert(`Erro ao adicionar tarefa: ${error}`);
    }
  });
}

async function initTaskFilters(): Promise<void> {
  if (!taskFilters) return;

  taskFilters.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.dataset.filter) {
      taskFilterMode = target.dataset.filter as 'all' | 'pending' | 'done';
      document.querySelectorAll('[data-filter]').forEach((btn) => btn.classList.remove('active'));
      target.classList.add('active');
      renderTasks();
    }
  });
}

async function initNotesFeature(): Promise<void> {
  if (saveNoteBtn) {
    saveNoteBtn.addEventListener('click', async () => {
      const content = noteInput?.value;
      if (!content) return;

      try {
        await addNote(content);
        if (noteInput) noteInput.value = '';
        renderNotes();
      } catch (error) {
        alert(`Erro ao salvar anotação: ${error}`);
      }
    });
  }

  if (clearNotesBtn) {
    clearNotesBtn.addEventListener('click', async () => {
      if (confirm('Tem certeza que deseja apagar todas as anotações?')) {
        try {
          await clearAllNotes();
          renderNotes();
        } catch (error) {
          alert(`Erro ao limpar anotações: ${error}`);
        }
      }
    });
  }

  if (noteSearch) {
    noteSearch.addEventListener('input', () => {
      const query = noteSearch.value;
      if (!notesList) return;

      if (!query) {
        renderNotes();
      } else {
        const results = searchNotes(query);
        notesList.innerHTML = results
          .map(
            (note) => `
        <div class="note-item">
          <p>${note.content}</p>
          <button onclick="window.app.deleteNote(${note.id})" class="delete-btn">Deletar</button>
        </div>
      `
          )
          .join('');
      }
    });
  }
}

async function initEventsFeature(): Promise<void> {
  if (eventForm) {
    eventForm.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      const titleInput = (eventForm.querySelector('input[name="eventTitle"]') as HTMLInputElement).value;
      const dateInput = (eventForm.querySelector('input[name="eventDate"]') as HTMLInputElement).value;
      if (!titleInput || !dateInput) return;

      try {
        await addEvent(titleInput, dateInput);
        renderEvents();
        renderCalendar();
        (eventForm.querySelector('input[name="eventTitle"]') as HTMLInputElement).value = '';
        (eventForm.querySelector('input[name="eventDate"]') as HTMLInputElement).value = '';
      } catch (error) {
        alert(`Erro ao adicionar evento: ${error}`);
      }
    });
  }

  if (clearEventsBtn) {
    clearEventsBtn.addEventListener('click', async () => {
      if (confirm('Tem certeza que deseja apagar todos os eventos?')) {
        try {
          await clearAllEvents();
          renderEvents();
          renderCalendar();
        } catch (error) {
          alert(`Erro ao limpar eventos: ${error}`);
        }
      }
    });
  }
}

function initCalendar(): void {
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      calendarDate.setMonth(calendarDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      calendarDate.setMonth(calendarDate.getMonth() + 1);
      renderCalendar();
    });
  }
}

// ============= Export Functions =============
function initExports(): void {
  if (exportTasksCsvBtn) {
    exportTasksCsvBtn.addEventListener('click', () => {
      const tasks = getTasksCache();
      const headers = ['Título', 'Importante', 'Concluído', 'Data de Vencimento'];
      const rows = tasks.map((t) => [
        t.title,
        t.is_important ? 'Sim' : 'Não',
        t.is_done ? 'Sim' : 'Não',
        t.due_date || '-',
      ]);
      exportAsCsv('tarefas', headers, rows);
    });
  }

  if (exportTasksPdfBtn) {
    exportTasksPdfBtn.addEventListener('click', () => {
      const tasks = getTasksCache();
      const headers = ['Título', 'Importante', 'Concluído', 'Data de Vencimento'];
      const rows = tasks.map((t) => [
        t.title,
        t.is_important ? 'Sim' : 'Não',
        t.is_done ? 'Sim' : 'Não',
        t.due_date || '-',
      ]);
      openPdfWindow('Relatório de Tarefas', headers, rows);
    });
  }

  if (exportNotesCsvBtn) {
    exportNotesCsvBtn.addEventListener('click', () => {
      const notes = getNotesCache();
      const headers = ['Conteúdo', 'Data de Criação'];
      const rows = notes.map((n) => [n.content.substring(0, 100), n.created_at]);
      exportAsCsv('anotacoes', headers, rows);
    });
  }

  if (exportNotesPdfBtn) {
    exportNotesPdfBtn.addEventListener('click', () => {
      const notes = getNotesCache();
      const headers = ['Conteúdo', 'Data de Criação'];
      const rows = notes.map((n) => [n.content.substring(0, 100), n.created_at]);
      openPdfWindow('Relatório de Anotações', headers, rows);
    });
  }

  if (exportEventsCsvBtn) {
    exportEventsCsvBtn.addEventListener('click', () => {
      const events = getEventsCache();
      const headers = ['Título', 'Tipo', 'Data', 'Detalhes'];
      const rows = events.map((e) => [e.title, e.event_type, e.event_date, e.detail || '-']);
      exportAsCsv('eventos', headers, rows);
    });
  }

  if (exportEventsPdfBtn) {
    exportEventsPdfBtn.addEventListener('click', () => {
      const events = getEventsCache();
      const headers = ['Título', 'Tipo', 'Data', 'Detalhes'];
      const rows = events.map((e) => [e.title, e.event_type, e.event_date, e.detail || '-']);
      openPdfWindow('Relatório de Eventos', headers, rows);
    });
  }
}

// ============= Auth Functions =============
async function ensureAuth(): Promise<void> {
  const status = await getAuthStatus();

  if (status.logged_in) {
    setCurrentUser({ user_id: status.user_id!, username: status.username! });

    if (isLoginPage()) {
      redirectToPage('index.html');
    }
  } else {
    if (!isLoginPage()) {
      redirectToPage('login.html');
    }
  }
}

function initAuthForms(): void {
  if (loginForm) {
    loginForm.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      const username = (loginForm.querySelector('input[name="username"]') as HTMLInputElement).value;
      const password = (loginForm.querySelector('input[name="password"]') as HTMLInputElement).value;

      try {
        const { loginUser } = await import('./modules/auth');
        const user = await loginUser(username, password);
        setCurrentUser(user);
        if (authMessage) authMessage.textContent = 'Login realizado com sucesso!';
        setTimeout(() => redirectToPage('index.html'), 1000);
      } catch (error) {
        if (authMessage) authMessage.textContent = `Erro: ${error}`;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      const username = (registerForm.querySelector('input[name="username"]') as HTMLInputElement).value;
      const password = (registerForm.querySelector('input[name="password"]') as HTMLInputElement).value;

      try {
        const { registerUser } = await import('./modules/auth');
        const user = await registerUser(username, password);
        setCurrentUser(user);
        if (authMessage) authMessage.textContent = 'Cadastro realizado com sucesso!';
        setTimeout(() => redirectToPage('index.html'), 1000);
      } catch (error) {
        if (authMessage) authMessage.textContent = `Erro: ${error}`;
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await logoutUser();
        redirectToPage('login.html');
      } catch (error) {
        alert(`Erro ao fazer logout: ${error}`);
      }
    });
  }

  updateUserBadge();
}

function updateUserBadge(): void {
  const user = getCurrentUser();
  if (currentUserBadge && user) {
    currentUserBadge.textContent = user.username;
  }
}

// ============= Scroll Progress Bar =============
function initScrollProgress(): void {
  window.addEventListener('scroll', () => {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = scrolled + '%';
  });
}

// ============= Boot Sequence =============
async function boot(): Promise<void> {
  await ensureAuth();

  if (!isLoginPage()) {
    await Promise.all([loadTasks(), loadNotes(), loadEvents()]);

    renderTasks();
    renderNotes();
    renderEvents();
    renderCalendar();

    await Promise.all([
      initTaskForm(),
      initTaskFilters(),
      initNotesFeature(),
      initEventsFeature(),
    ]);

    initCalendar();
    initExports();
  }

  initAuthForms();
  initScrollProgress();
}

// ============= Global API Exposure =============
(window as any).app = {
  toggleTask,
  deleteTask,
  deleteNote,
  deleteEvent,
  renderTasks,
  renderNotes,
  renderEvents,
};

// Boot the application
boot().catch((error) => console.error('Erro ao inicializar aplicação:', error));
