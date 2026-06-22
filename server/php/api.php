<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

function respond(bool $success, $data = null, string $error = '', int $status = 200): void
{
    http_response_code($status);
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'error' => $error,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function readJson(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function hasColumn(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->query("PRAGMA table_info($table)");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($columns as $item) {
        if (($item['name'] ?? '') === $column) {
            return true;
        }
    }

    return false;
}

function addColumnIfMissing(PDO $pdo, string $table, string $column, string $definition): void
{
    if (!hasColumn($pdo, $table, $column)) {
        $pdo->exec("ALTER TABLE $table ADD COLUMN $column $definition");
    }
}

function seedDefaultTasks(PDO $pdo, int $userId): void
{
    $countStmt = $pdo->prepare('SELECT COUNT(*) FROM tasks WHERE user_id = :user_id');
    $countStmt->execute([':user_id' => $userId]);
    $count = (int) $countStmt->fetchColumn();

    if ($count > 0) {
        return;
    }

    $seed = $pdo->prepare('INSERT INTO tasks (user_id, title, is_important, due_date) VALUES (:user_id, :title, :is_important, :due_date)');
    $seed->execute([':user_id' => $userId, ':title' => 'Revisar teoria de Emile Durkheim', ':is_important' => 1, ':due_date' => null]);
    $seed->execute([':user_id' => $userId, ':title' => 'Entregar trabalho sobre desigualdade social', ':is_important' => 1, ':due_date' => null]);
    $seed->execute([':user_id' => $userId, ':title' => 'Estudar para prova bimestral de Sociologia', ':is_important' => 1, ':due_date' => null]);
    $seed->execute([':user_id' => $userId, ':title' => 'Atualizar mapa mental da unidade', ':is_important' => 0, ':due_date' => null]);
}

function getDb(): PDO
{
    $dataDir = __DIR__ . DIRECTORY_SEPARATOR . 'data';
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0777, true);
    }

    $dbPath = $dataDir . DIRECTORY_SEPARATOR . 'sociologia.sqlite';
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec('CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        is_important INTEGER NOT NULL DEFAULT 1,
        is_done INTEGER NOT NULL DEFAULT 0,
        due_date TEXT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        event_type TEXT NOT NULL,
        event_date TEXT NOT NULL,
        detail TEXT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )');

    addColumnIfMissing($pdo, 'notes', 'user_id', 'INTEGER NOT NULL DEFAULT 1');
    addColumnIfMissing($pdo, 'tasks', 'user_id', 'INTEGER NOT NULL DEFAULT 1');
    addColumnIfMissing($pdo, 'events', 'user_id', 'INTEGER NOT NULL DEFAULT 1');

    return $pdo;
}

function currentUserId(): int
{
    return (int) ($_SESSION['user_id'] ?? 0);
}

function requireUserId(): int
{
    $userId = currentUserId();
    if ($userId <= 0) {
        respond(false, null, 'Voce precisa estar logado.', 401);
    }

    return $userId;
}

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($action === '') {
    respond(false, null, 'Acao nao informada.', 400);
}

try {
    $db = getDb();

    if ($action === 'auth_register' && $method === 'POST') {
        $payload = readJson();
        $username = strtolower(trim((string) ($payload['username'] ?? '')));
        $password = (string) ($payload['password'] ?? '');

        if (strlen($username) < 3 || strlen($password) < 4) {
            respond(false, null, 'Usuario minimo 3 caracteres e senha minima 4 caracteres.', 422);
        }

        $check = $db->prepare('SELECT id FROM users WHERE username = :username');
        $check->execute([':username' => $username]);
        if ($check->fetch(PDO::FETCH_ASSOC)) {
            respond(false, null, 'Usuario ja existe.', 409);
        }

        $insert = $db->prepare('INSERT INTO users (username, password_hash) VALUES (:username, :password_hash)');
        $insert->execute([
            ':username' => $username,
            ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
        ]);

        $userId = (int) $db->lastInsertId();
        $_SESSION['user_id'] = $userId;
        $_SESSION['username'] = $username;

        seedDefaultTasks($db, $userId);

        respond(true, ['user_id' => $userId, 'username' => $username]);
    }

    if ($action === 'auth_login' && $method === 'POST') {
        $payload = readJson();
        $username = strtolower(trim((string) ($payload['username'] ?? '')));
        $password = (string) ($payload['password'] ?? '');

        $stmt = $db->prepare('SELECT id, username, password_hash FROM users WHERE username = :username');
        $stmt->execute([':username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, (string) $user['password_hash'])) {
            respond(false, null, 'Usuario ou senha invalidos.', 401);
        }

        $_SESSION['user_id'] = (int) $user['id'];
        $_SESSION['username'] = (string) $user['username'];

        seedDefaultTasks($db, (int) $user['id']);

        respond(true, ['user_id' => (int) $user['id'], 'username' => (string) $user['username']]);
    }

    if ($action === 'auth_status' && $method === 'GET') {
        $logged = currentUserId() > 0;
        respond(true, [
            'logged_in' => $logged,
            'user_id' => $logged ? currentUserId() : null,
            'username' => $logged ? (string) ($_SESSION['username'] ?? '') : null,
        ]);
    }

    if ($action === 'auth_logout' && $method === 'POST') {
        session_unset();
        session_destroy();
        respond(true, ['logged_out' => true]);
    }

    $userId = requireUserId();

    if ($action === 'tasks_list' && $method === 'GET') {
        $stmt = $db->prepare('SELECT id, title, is_important, is_done, due_date, created_at FROM tasks WHERE user_id = :user_id ORDER BY COALESCE(due_date, "9999-12-31") ASC, id DESC');
        $stmt->execute([':user_id' => $userId]);
        respond(true, $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if ($action === 'tasks_add' && $method === 'POST') {
        $payload = readJson();
        $title = trim((string) ($payload['title'] ?? ''));
        $isImportant = !empty($payload['is_important']) ? 1 : 0;
        $dueDate = trim((string) ($payload['due_date'] ?? ''));
        $dueDate = $dueDate !== '' ? $dueDate : null;

        if ($title === '') {
            respond(false, null, 'Titulo da atividade e obrigatorio.', 422);
        }

        $stmt = $db->prepare('INSERT INTO tasks (user_id, title, is_important, due_date) VALUES (:user_id, :title, :is_important, :due_date)');
        $stmt->execute([
            ':user_id' => $userId,
            ':title' => $title,
            ':is_important' => $isImportant,
            ':due_date' => $dueDate,
        ]);

        respond(true, ['id' => (int) $db->lastInsertId()]);
    }

    if ($action === 'tasks_toggle' && $method === 'POST') {
        $payload = readJson();
        $id = (int) ($payload['id'] ?? 0);
        $isDone = !empty($payload['is_done']) ? 1 : 0;

        if ($id <= 0) {
            respond(false, null, 'ID invalido.', 422);
        }

        $stmt = $db->prepare('UPDATE tasks SET is_done = :is_done WHERE id = :id AND user_id = :user_id');
        $stmt->execute([':is_done' => $isDone, ':id' => $id, ':user_id' => $userId]);
        respond(true, ['updated' => $stmt->rowCount() > 0]);
    }

    if ($action === 'tasks_delete' && $method === 'POST') {
        $payload = readJson();
        $id = (int) ($payload['id'] ?? 0);

        if ($id <= 0) {
            respond(false, null, 'ID invalido.', 422);
        }

        $stmt = $db->prepare('DELETE FROM tasks WHERE id = :id AND user_id = :user_id');
        $stmt->execute([':id' => $id, ':user_id' => $userId]);
        respond(true, ['deleted' => $stmt->rowCount() > 0]);
    }

    if ($action === 'notes_list' && $method === 'GET') {
        $stmt = $db->prepare('SELECT id, content, created_at FROM notes WHERE user_id = :user_id ORDER BY created_at DESC, id DESC');
        $stmt->execute([':user_id' => $userId]);
        respond(true, $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if ($action === 'notes_add' && $method === 'POST') {
        $payload = readJson();
        $content = trim((string) ($payload['content'] ?? ''));

        if ($content === '') {
            respond(false, null, 'Conteudo da anotacao e obrigatorio.', 422);
        }

        $stmt = $db->prepare('INSERT INTO notes (user_id, content) VALUES (:user_id, :content)');
        $stmt->execute([':user_id' => $userId, ':content' => $content]);
        respond(true, ['id' => (int) $db->lastInsertId()]);
    }

    if ($action === 'notes_delete' && $method === 'POST') {
        $payload = readJson();
        $id = (int) ($payload['id'] ?? 0);

        if ($id <= 0) {
            respond(false, null, 'ID invalido.', 422);
        }

        $stmt = $db->prepare('DELETE FROM notes WHERE id = :id AND user_id = :user_id');
        $stmt->execute([':id' => $id, ':user_id' => $userId]);
        respond(true, ['deleted' => $stmt->rowCount() > 0]);
    }

    if ($action === 'notes_clear' && $method === 'POST') {
        $stmt = $db->prepare('DELETE FROM notes WHERE user_id = :user_id');
        $stmt->execute([':user_id' => $userId]);
        respond(true, ['cleared' => true]);
    }

    if ($action === 'events_list' && $method === 'GET') {
        $stmt = $db->prepare('SELECT id, title, event_type, event_date, detail, created_at FROM events WHERE user_id = :user_id ORDER BY event_date ASC, id DESC');
        $stmt->execute([':user_id' => $userId]);
        respond(true, $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    if ($action === 'events_add' && $method === 'POST') {
        $payload = readJson();
        $title = trim((string) ($payload['title'] ?? ''));
        $type = trim((string) ($payload['event_type'] ?? 'Evento'));
        $date = trim((string) ($payload['event_date'] ?? ''));
        $detail = trim((string) ($payload['detail'] ?? ''));

        if ($title === '' || $date === '') {
            respond(false, null, 'Titulo e data do evento sao obrigatorios.', 422);
        }

        $stmt = $db->prepare('INSERT INTO events (user_id, title, event_type, event_date, detail) VALUES (:user_id, :title, :event_type, :event_date, :detail)');
        $stmt->execute([
            ':user_id' => $userId,
            ':title' => $title,
            ':event_type' => $type !== '' ? $type : 'Evento',
            ':event_date' => $date,
            ':detail' => $detail,
        ]);

        respond(true, ['id' => (int) $db->lastInsertId()]);
    }

    if ($action === 'events_delete' && $method === 'POST') {
        $payload = readJson();
        $id = (int) ($payload['id'] ?? 0);

        if ($id <= 0) {
            respond(false, null, 'ID invalido.', 422);
        }

        $stmt = $db->prepare('DELETE FROM events WHERE id = :id AND user_id = :user_id');
        $stmt->execute([':id' => $id, ':user_id' => $userId]);
        respond(true, ['deleted' => $stmt->rowCount() > 0]);
    }

    if ($action === 'events_clear' && $method === 'POST') {
        $stmt = $db->prepare('DELETE FROM events WHERE user_id = :user_id');
        $stmt->execute([':user_id' => $userId]);
        respond(true, ['cleared' => true]);
    }

    respond(false, null, 'Endpoint nao encontrado.', 404);
} catch (Throwable $error) {
    respond(false, null, 'Erro interno: ' . $error->getMessage(), 500);
}
