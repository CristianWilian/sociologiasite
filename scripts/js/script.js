const API_URL = '../server/php/api.php';

const topNav = document.getElementById('topNav');
const scrollProgress = document.getElementById('scrollProgress');
const checkImportantBtn = document.getElementById('checkImportantBtn');
const importantCount = document.getElementById('importantCount');
const importantStatus = document.getElementById('importantStatus');
const revealItems = document.querySelectorAll('.reveal');
const heroContent = document.querySelector('.hero-content');
const currentUserBadge = document.getElementById('currentUserBadge');
const logoutBtn = document.getElementById('logoutBtn');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authMessage = document.getElementById('authMessage');
const switchLoginBtn = document.getElementById('switchLoginBtn');
const switchRegisterBtn = document.getElementById('switchRegisterBtn');
const loginFormPanel = document.getElementById('loginFormPanel');
const registerFormPanel = document.getElementById('registerFormPanel');
const authVisual = document.getElementById('authVisual');
const authVisualParticles = document.getElementById('authVisualParticles');

const tasksList = document.getElementById('tasksList');
const taskForm = document.getElementById('taskForm');
const taskFilters = document.getElementById('taskFilters');
const summaryTotal = document.getElementById('summaryTotal');
const summaryPending = document.getElementById('summaryPending');
const summaryUrgent = document.getElementById('summaryUrgent');
const exportTasksCsvBtn = document.getElementById('exportTasksCsvBtn');
const exportTasksPdfBtn = document.getElementById('exportTasksPdfBtn');

const noteInput = document.getElementById('noteInput');
const noteSearch = document.getElementById('noteSearch');
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

let taskFilterMode = 'all';
let tasksCache = [];
let notesCache = [];
let eventsCache = [];
let currentUser = null;
let calendarDate = new Date();

async function apiRequest(action, { method = 'GET', payload = null } = {}) {
    const options = {
        method,
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
        },
    };

    if (payload !== null) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(payload);
    }

    const response = await fetch(`${API_URL}?action=${encodeURIComponent(action)}`, options);
    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.error || 'Falha na comunicacao com o servidor.');
    }

    return result.data;
}

function isLoginPage() {
    return window.location.pathname.endsWith('/login.html') || window.location.pathname.endsWith('login.html');
}

async function ensureAuth() {
    try {
        const status = await apiRequest('auth_status');
        if (status.logged_in) {
            currentUser = status;
            if (currentUserBadge) {
                currentUserBadge.textContent = status.username;
            }

            if (isLoginPage()) {
                window.location.href = 'index.html';
                return false;
            }

            return true;
        }

        if (!isLoginPage()) {
            window.location.href = 'login.html';
            return false;
        }

        if (currentUserBadge) {
            currentUserBadge.textContent = 'Visitante';
        }

        return false;
    } catch {
        if (!isLoginPage()) {
            window.location.href = 'login.html';
            return false;
        }

        return false;
    }
}

function createFloatingParticles(amount = 20) {
    for (let index = 0; index < amount; index += 1) {
        const particle = document.createElement('span');
        particle.className = 'floating-particle';

        const size = Math.random() * 11 + 6;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.bottom = `${Math.random() * 110 - 20}vh`;
        particle.style.background = Math.random() > 0.5 ? 'rgba(212, 163, 115, 0.45)' : 'rgba(47, 93, 80, 0.36)';
        particle.style.animationDuration = `${Math.random() * 11 + 14}s`;
        particle.style.animationDelay = `${Math.random() * 8}s`;

        document.body.appendChild(particle);
    }
}

function updateScrollProgress() {
    if (!scrollProgress) {
        return;
    }

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
}

function markActiveNavLink() {
    const links = document.querySelectorAll('.nav-links a');
    if (links.length === 0) {
        return;
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const target = href.split('#')[0] || 'index.html';
        link.classList.toggle('active', target === currentPage);
    });
}

function initRevealObserver() {
    if (revealItems.length === 0) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        },
        { threshold: 0.15 }
    );

    revealItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.07}s`;
        observer.observe(item);
    });
}

function initHeroParallax() {
    if (!heroContent) {
        return;
    }

    document.addEventListener('mousemove', (event) => {
        const xCenter = window.innerWidth / 2;
        const yCenter = window.innerHeight / 2;
        const xOffset = (event.clientX - xCenter) / xCenter;
        const yOffset = (event.clientY - yCenter) / yCenter;
        heroContent.style.transform = `rotateY(${xOffset * 2.7}deg) rotateX(${yOffset * -2}deg)`;
    });

    document.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
}

function initNavbarBehavior() {
    if (!topNav) {
        return;
    }

    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        topNav.style.transform = currentY > lastY && currentY > 120 ? 'translateY(-105%)' : 'translateY(0)';
        lastY = currentY;
    });
}

function daysUntil(dateString) {
    if (!dateString) {
        return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return Math.ceil((date.getTime() - today.getTime()) / 86400000);
}

function formatDate(dateString) {
    if (!dateString) {
        return 'Sem data';
    }

    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString('pt-BR');
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function downloadFile(fileName, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function exportAsCsv(fileName, headers, rows) {
    const csvRows = [headers.join(';')];
    rows.forEach((row) => {
        const line = row.map((value) => {
            const text = String(value ?? '').replaceAll('"', '""');
            return `"${text}"`;
        });
        csvRows.push(line.join(';'));
    });

    downloadFile(fileName, csvRows.join('\n'), 'text/csv;charset=utf-8');
}

function openPdfWindow(title, columns, rows) {
    const tableHeader = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join('');
    const tableRows = rows
        .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
        .join('');

    const html = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<style>
body { font-family: Arial, sans-serif; margin: 24px; color: #222; }
h1 { margin-top: 0; }
table { width: 100%; border-collapse: collapse; margin-top: 12px; }
th, td { border: 1px solid #999; padding: 8px; text-align: left; font-size: 12px; }
th { background: #f0f0f0; }
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
<table>
<thead><tr>${tableHeader}</tr></thead>
<tbody>${tableRows}</tbody>
</table>
<script>window.onload = () => window.print();</script>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) {
        alert('Nao foi possivel abrir a janela para gerar PDF.');
        return;
    }

    win.document.open();
    win.document.write(html);
    win.document.close();
}

function updateBadgeAndStatus() {
    const pendingImportant = tasksCache.filter((task) => Number(task.is_important) === 1 && Number(task.is_done) === 0).length;

    if (importantCount) {
        importantCount.textContent = String(pendingImportant);
        importantCount.classList.remove('pulse');
        void importantCount.offsetWidth;
        importantCount.classList.add('pulse');
    }

    if (!importantStatus) {
        return;
    }

    if (pendingImportant > 0) {
        importantStatus.textContent = `Voce tem ${pendingImportant} atividade(s) importante(s) pendente(s).`;
        importantStatus.classList.remove('ok');
        importantStatus.classList.add('warning');
    } else {
        importantStatus.textContent = 'Excelente: nenhuma atividade importante pendente.';
        importantStatus.classList.remove('warning');
        importantStatus.classList.add('ok');
    }
}

function updateTaskSummary() {
    if (!summaryTotal || !summaryPending || !summaryUrgent) {
        return;
    }

    const total = tasksCache.length;
    const pending = tasksCache.filter((task) => Number(task.is_done) === 0).length;
    const urgent = tasksCache.filter((task) => {
        if (Number(task.is_done) === 1) {
            return false;
        }

        const days = daysUntil(task.due_date);
        return days !== null && days >= 0 && days <= 7;
    }).length;

    summaryTotal.textContent = String(total);
    summaryPending.textContent = String(pending);
    summaryUrgent.textContent = String(urgent);
}

function filteredTasks() {
    if (taskFilterMode === 'pending') {
        return tasksCache.filter((task) => Number(task.is_done) === 0);
    }

    if (taskFilterMode === 'done') {
        return tasksCache.filter((task) => Number(task.is_done) === 1);
    }

    return tasksCache;
}

function renderTasks() {
    if (!tasksList) {
        return;
    }

    tasksList.innerHTML = '';

    const list = filteredTasks();
    if (list.length === 0) {
        const empty = document.createElement('li');
        empty.textContent = 'Nenhuma atividade encontrada para esse filtro.';
        tasksList.appendChild(empty);
        return;
    }

    list.forEach((task) => {
        const li = document.createElement('li');
        li.classList.toggle('important', Number(task.is_important) === 1);
        li.classList.toggle('done', Number(task.is_done) === 1);

        const topLine = document.createElement('div');
        topLine.className = 'task-row';

        const left = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = Number(task.is_done) === 1;
        checkbox.addEventListener('change', async () => {
            try {
                await apiRequest('tasks_toggle', {
                    method: 'POST',
                    payload: {
                        id: Number(task.id),
                        is_done: checkbox.checked,
                    },
                });
                await loadTasks();
            } catch (error) {
                alert(error.message);
                checkbox.checked = !checkbox.checked;
            }
        });

        const title = document.createElement('span');
        title.textContent = task.title;

        left.appendChild(checkbox);
        left.appendChild(title);

        const right = document.createElement('div');
        right.className = 'task-meta';

        const due = document.createElement('small');
        const remainingDays = daysUntil(task.due_date);
        if (task.due_date) {
            due.textContent = `Prazo: ${formatDate(task.due_date)}`;
            if (remainingDays !== null && remainingDays >= 0 && remainingDays <= 7 && Number(task.is_done) === 0) {
                due.className = 'due-urgent';
            }
        } else {
            due.textContent = 'Sem prazo';
        }

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'icon-btn';
        removeBtn.textContent = 'Excluir';
        removeBtn.addEventListener('click', async () => {
            try {
                await apiRequest('tasks_delete', {
                    method: 'POST',
                    payload: { id: Number(task.id) },
                });
                await loadTasks();
            } catch (error) {
                alert(error.message);
            }
        });

        right.appendChild(due);
        right.appendChild(removeBtn);

        topLine.appendChild(left);
        topLine.appendChild(right);

        li.appendChild(topLine);
        tasksList.appendChild(li);
    });
}

async function loadTasks() {
    try {
        tasksCache = await apiRequest('tasks_list');
        updateBadgeAndStatus();
        updateTaskSummary();
        renderTasks();
    } catch (error) {
        if (importantStatus) {
            importantStatus.textContent = `Erro ao carregar atividades: ${error.message}`;
            importantStatus.classList.add('warning');
        }
    }
}

function initTaskFilters() {
    if (!taskFilters) {
        return;
    }

    taskFilters.addEventListener('click', (event) => {
        const button = event.target.closest('[data-task-filter]');
        if (!button) {
            return;
        }

        taskFilterMode = button.dataset.taskFilter;
        taskFilters.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        renderTasks();
    });
}

function initTaskForm() {
    if (!taskForm) {
        return;
    }

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const titleInput = document.getElementById('taskTitle');
        const dueInput = document.getElementById('taskDueDate');
        const importantInput = document.getElementById('taskImportant');

        const title = titleInput.value.trim();
        if (!title) {
            titleInput.focus();
            return;
        }

        try {
            await apiRequest('tasks_add', {
                method: 'POST',
                payload: {
                    title,
                    due_date: dueInput.value || null,
                    is_important: importantInput.checked,
                },
            });

            taskForm.reset();
            importantInput.checked = true;
            await loadTasks();
        } catch (error) {
            alert(error.message);
        }
    });
}

function renderNotes(list = notesCache) {
    if (!notesList) {
        return;
    }

    notesList.innerHTML = '';

    if (list.length === 0) {
        const empty = document.createElement('li');
        empty.textContent = 'Nenhuma anotacao registrada ainda.';
        notesList.appendChild(empty);
        return;
    }

    list.forEach((note) => {
        const li = document.createElement('li');

        const text = document.createElement('p');
        text.textContent = note.content;

        const meta = document.createElement('div');
        meta.className = 'note-meta';

        const date = document.createElement('small');
        date.textContent = `Criada em ${new Date(note.created_at).toLocaleString('pt-BR')}`;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'icon-btn';
        removeBtn.textContent = 'Excluir';
        removeBtn.addEventListener('click', async () => {
            try {
                await apiRequest('notes_delete', {
                    method: 'POST',
                    payload: { id: Number(note.id) },
                });
                await loadNotes();
            } catch (error) {
                alert(error.message);
            }
        });

        meta.appendChild(date);
        meta.appendChild(removeBtn);

        li.appendChild(text);
        li.appendChild(meta);
        notesList.appendChild(li);
    });
}

async function loadNotes() {
    if (!notesList) {
        return;
    }

    try {
        notesCache = await apiRequest('notes_list');
        applyNoteSearch();
    } catch (error) {
        notesList.innerHTML = `<li>Erro ao carregar anotacoes: ${error.message}</li>`;
    }
}

function applyNoteSearch() {
    if (!noteSearch || noteSearch.value.trim() === '') {
        renderNotes(notesCache);
        return;
    }

    const query = noteSearch.value.trim().toLowerCase();
    const filtered = notesCache.filter((note) => note.content.toLowerCase().includes(query));
    renderNotes(filtered);
}

function initNotesFeature() {
    if (saveNoteBtn && noteInput) {
        saveNoteBtn.addEventListener('click', async () => {
            const content = noteInput.value.trim();
            if (!content) {
                noteInput.focus();
                return;
            }

            try {
                await apiRequest('notes_add', {
                    method: 'POST',
                    payload: { content },
                });
                noteInput.value = '';
                await loadNotes();
            } catch (error) {
                alert(error.message);
            }
        });

        noteInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                saveNoteBtn.click();
            }
        });
    }

    if (clearNotesBtn) {
        clearNotesBtn.addEventListener('click', async () => {
            try {
                await apiRequest('notes_clear', { method: 'POST' });
                await loadNotes();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (noteSearch) {
        noteSearch.addEventListener('input', applyNoteSearch);
    }
}

function renderEvents() {
    if (!eventsList) {
        return;
    }

    eventsList.innerHTML = '';

    if (eventsCache.length === 0) {
        const empty = document.createElement('li');
        empty.textContent = 'Nenhum evento importante registrado ainda.';
        eventsList.appendChild(empty);
    } else {
        eventsCache.forEach((eventItem) => {
            const li = document.createElement('li');

            const title = document.createElement('h3');
            title.textContent = `${eventItem.event_type}: ${eventItem.title}`;

            const date = document.createElement('p');
            date.textContent = `Data: ${formatDate(eventItem.event_date)}`;

            const details = document.createElement('small');
            details.textContent = eventItem.detail || 'Sem detalhes adicionais.';

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'icon-btn';
            removeBtn.textContent = 'Excluir';
            removeBtn.addEventListener('click', async () => {
                try {
                    await apiRequest('events_delete', {
                        method: 'POST',
                        payload: { id: Number(eventItem.id) },
                    });
                    await loadEvents();
                } catch (error) {
                    alert(error.message);
                }
            });

            li.appendChild(title);
            li.appendChild(date);
            li.appendChild(details);
            li.appendChild(removeBtn);
            eventsList.appendChild(li);
        });
    }

    if (!eventAlert) {
        return;
    }

    const urgentCount = eventsCache.filter((eventItem) => {
        const days = daysUntil(eventItem.event_date);
        return days !== null && days >= 0 && days <= 7;
    }).length;

    if (urgentCount > 0) {
        eventAlert.textContent = `Atencao: ${urgentCount} evento(s) importante(s) nos proximos 7 dias.`;
        eventAlert.classList.add('warning');
        eventAlert.classList.remove('ok');
    } else {
        eventAlert.textContent = 'Sem eventos urgentes para os proximos 7 dias.';
        eventAlert.classList.add('ok');
        eventAlert.classList.remove('warning');
    }
}

async function loadEvents() {
    try {
        eventsCache = await apiRequest('events_list');
        renderEvents();
        renderCalendar();
    } catch (error) {
        if (eventsList) {
            eventsList.innerHTML = `<li>Erro ao carregar eventos: ${error.message}</li>`;
        }
        if (calendarEventsList) {
            calendarEventsList.innerHTML = `<li>Erro ao carregar calendario: ${error.message}</li>`;
        }
    }
}

function initEventsFeature() {
    if (eventForm) {
        eventForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const title = document.getElementById('eventTitle').value.trim();
            const eventDate = document.getElementById('eventDate').value;
            const eventType = document.getElementById('eventType').value;
            const detail = document.getElementById('eventDetail').value.trim();

            if (!title || !eventDate) {
                return;
            }

            try {
                await apiRequest('events_add', {
                    method: 'POST',
                    payload: {
                        title,
                        event_date: eventDate,
                        event_type: eventType,
                        detail,
                    },
                });
                eventForm.reset();
                await loadEvents();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (clearEventsBtn) {
        clearEventsBtn.addEventListener('click', async () => {
            try {
                await apiRequest('events_clear', { method: 'POST' });
                await loadEvents();
            } catch (error) {
                alert(error.message);
            }
        });
    }
}

function renderCalendar() {
    if (!calendarGrid || !calendarMonthLabel) {
        return;
    }

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarMonthLabel.textContent = firstDay.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
    });

    calendarGrid.innerHTML = '';

    for (let i = 0; i < firstWeekday; i += 1) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day muted';
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const dateIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = eventsCache.filter((eventItem) => eventItem.event_date === dateIso);

        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        if (dayEvents.length > 0) {
            cell.classList.add('has-event');
        }

        const dayNumber = document.createElement('strong');
        dayNumber.textContent = String(day);
        cell.appendChild(dayNumber);

        dayEvents.slice(0, 2).forEach((eventItem) => {
            const marker = document.createElement('span');
            marker.className = 'calendar-event-chip';
            marker.textContent = eventItem.event_type;
            cell.appendChild(marker);
        });

        if (dayEvents.length > 2) {
            const more = document.createElement('small');
            more.textContent = `+${dayEvents.length - 2}`;
            cell.appendChild(more);
        }

        calendarGrid.appendChild(cell);
    }

    if (calendarEventsList) {
        const monthEvents = eventsCache.filter((eventItem) => {
            const date = new Date(`${eventItem.event_date}T00:00:00`);
            return date.getFullYear() === year && date.getMonth() === month;
        });

        calendarEventsList.innerHTML = '';
        if (monthEvents.length === 0) {
            const empty = document.createElement('li');
            empty.textContent = 'Sem eventos cadastrados neste mes.';
            calendarEventsList.appendChild(empty);
        } else {
            monthEvents.forEach((eventItem) => {
                const li = document.createElement('li');
                const title = document.createElement('h3');
                title.textContent = `${eventItem.event_type}: ${eventItem.title}`;
                const detail = document.createElement('p');
                detail.textContent = `${formatDate(eventItem.event_date)} - ${eventItem.detail || 'Sem detalhes.'}`;
                li.appendChild(title);
                li.appendChild(detail);
                calendarEventsList.appendChild(li);
            });
        }
    }
}

function initCalendar() {
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
            renderCalendar();
        });
    }
}

function initExports() {
    if (exportTasksCsvBtn) {
        exportTasksCsvBtn.addEventListener('click', () => {
            const rows = tasksCache.map((task) => [
                task.title,
                Number(task.is_important) ? 'Sim' : 'Nao',
                Number(task.is_done) ? 'Concluida' : 'Pendente',
                formatDate(task.due_date),
            ]);
            exportAsCsv('atividades.csv', ['Titulo', 'Importante', 'Status', 'Prazo'], rows);
        });
    }

    if (exportTasksPdfBtn) {
        exportTasksPdfBtn.addEventListener('click', () => {
            const rows = tasksCache.map((task) => [
                task.title,
                Number(task.is_important) ? 'Sim' : 'Nao',
                Number(task.is_done) ? 'Concluida' : 'Pendente',
                formatDate(task.due_date),
            ]);
            openPdfWindow('Relatorio de Atividades', ['Titulo', 'Importante', 'Status', 'Prazo'], rows);
        });
    }

    if (exportNotesCsvBtn) {
        exportNotesCsvBtn.addEventListener('click', () => {
            const rows = notesCache.map((note) => [note.content, new Date(note.created_at).toLocaleString('pt-BR')]);
            exportAsCsv('anotacoes.csv', ['Conteudo', 'Criada em'], rows);
        });
    }

    if (exportNotesPdfBtn) {
        exportNotesPdfBtn.addEventListener('click', () => {
            const rows = notesCache.map((note) => [note.content, new Date(note.created_at).toLocaleString('pt-BR')]);
            openPdfWindow('Relatorio de Anotacoes', ['Conteudo', 'Criada em'], rows);
        });
    }

    if (exportEventsCsvBtn) {
        exportEventsCsvBtn.addEventListener('click', () => {
            const rows = eventsCache.map((eventItem) => [
                eventItem.event_type,
                eventItem.title,
                formatDate(eventItem.event_date),
                eventItem.detail || '',
            ]);
            exportAsCsv('eventos.csv', ['Tipo', 'Titulo', 'Data', 'Detalhes'], rows);
        });
    }

    if (exportEventsPdfBtn) {
        exportEventsPdfBtn.addEventListener('click', () => {
            const rows = eventsCache.map((eventItem) => [
                eventItem.event_type,
                eventItem.title,
                formatDate(eventItem.event_date),
                eventItem.detail || '',
            ]);
            openPdfWindow('Relatorio de Eventos', ['Tipo', 'Titulo', 'Data', 'Detalhes'], rows);
        });
    }
}

function initAuthForms() {
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            try {
                const data = await apiRequest('auth_login', {
                    method: 'POST',
                    payload: { username, password },
                });

                if (authMessage) {
                    authMessage.textContent = `Bem-vindo(a), ${data.username}. Redirecionando...`;
                    authMessage.classList.remove('warning');
                    authMessage.classList.add('ok');
                }

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 450);
            } catch (error) {
                if (authMessage) {
                    authMessage.textContent = error.message;
                    authMessage.classList.remove('ok');
                    authMessage.classList.add('warning');
                }
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('registerUsername').value.trim();
            const password = document.getElementById('registerPassword').value;

            try {
                const data = await apiRequest('auth_register', {
                    method: 'POST',
                    payload: { username, password },
                });

                if (authMessage) {
                    authMessage.textContent = `Conta criada para ${data.username}. Redirecionando...`;
                    authMessage.classList.remove('warning');
                    authMessage.classList.add('ok');
                }

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 450);
            } catch (error) {
                if (authMessage) {
                    authMessage.textContent = error.message;
                    authMessage.classList.remove('ok');
                    authMessage.classList.add('warning');
                }
            }
        });
    }
}

function setAuthMode(mode) {
    if (!switchLoginBtn || !switchRegisterBtn || !loginFormPanel || !registerFormPanel) {
        return;
    }

    const isLoginMode = mode === 'login';

    switchLoginBtn.classList.toggle('active', isLoginMode);
    switchRegisterBtn.classList.toggle('active', !isLoginMode);

    switchLoginBtn.setAttribute('aria-selected', String(isLoginMode));
    switchRegisterBtn.setAttribute('aria-selected', String(!isLoginMode));

    loginFormPanel.classList.toggle('active', isLoginMode);
    registerFormPanel.classList.toggle('active', !isLoginMode);

    loginFormPanel.hidden = !isLoginMode;
    registerFormPanel.hidden = isLoginMode;

    if (authMessage) {
        authMessage.classList.remove('ok', 'warning');
        authMessage.textContent = isLoginMode
            ? 'Faca login para continuar.'
            : 'Crie sua conta para comecar a usar a plataforma.';
    }
}

function initAuthSwitch() {
    if (!switchLoginBtn || !switchRegisterBtn) {
        return;
    }

    switchLoginBtn.addEventListener('click', () => {
        setAuthMode('login');
    });

    switchRegisterBtn.addEventListener('click', () => {
        setAuthMode('register');
    });
}

function initAuthVisualEffects() {
    if (!authVisual || !authVisualParticles) {
        return;
    }

    const particleCount = 24;

    for (let i = 0; i < particleCount; i += 1) {
        const light = document.createElement('span');
        light.className = Math.random() > 0.55 ? 'auth-light alt' : 'auth-light';
        light.style.left = `${Math.random() * 100}%`;
        light.style.bottom = `${Math.random() * 50 - 15}%`;
        light.style.animationDuration = `${11 + Math.random() * 15}s`;
        light.style.animationDelay = `${Math.random() * 9}s`;
        light.style.opacity = `${0.35 + Math.random() * 0.5}`;
        authVisualParticles.appendChild(light);
    }

    const image = authVisual.querySelector('.auth-visual-image');
    if (!image) {
        return;
    }

    authVisual.addEventListener('mousemove', (event) => {
        const rect = authVisual.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        image.style.transform = `scale(1.08) translate(${relX * 14}px, ${relY * 10}px)`;
    });

    authVisual.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1.06) translate(0, 0)';
    });
}

function initLogout() {
    if (!logoutBtn) {
        return;
    }

    logoutBtn.addEventListener('click', async () => {
        try {
            await apiRequest('auth_logout', { method: 'POST' });
            window.location.href = 'login.html';
        } catch (error) {
            alert(error.message);
        }
    });
}

function initImportantButton() {
    if (!checkImportantBtn) {
        return;
    }

    checkImportantBtn.addEventListener('click', () => {
        const activitiesSection = document.getElementById('atividades');
        if (activitiesSection) {
            activitiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        window.location.href = 'importantes.html';
    });
}

async function boot() {
    createFloatingParticles();
    initRevealObserver();
    initHeroParallax();
    initNavbarBehavior();
    initImportantButton();
    initTaskFilters();
    initTaskForm();
    initNotesFeature();
    initEventsFeature();
    initExports();
    initAuthForms();
    initAuthSwitch();
    initAuthVisualEffects();
    initLogout();
    initCalendar();
    updateScrollProgress();
    markActiveNavLink();

    if (isLoginPage()) {
        setAuthMode('login');
    }

    window.addEventListener('scroll', updateScrollProgress);

    const logged = await ensureAuth();
    if (!logged && !isLoginPage()) {
        return;
    }

    if (!isLoginPage()) {
        await Promise.all([loadTasks(), loadNotes(), loadEvents()]);
    }
}

boot();
