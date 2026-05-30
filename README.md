# WorkLog — журнал работ

Веб-приложение для учёта выполненных работ.

| Слой | Технологии |
|------|------------|
| Frontend | React 19, TypeScript, Vite |
| Backend | NestJS 11, TypeORM |
| БД | PostgreSQL 16 |
| Запуск | Docker Compose |

---

## Запуск (Docker)

Все команды выполняются **из корня проекта** (`WorkLog/`).

### Первый запуск (с тестовыми данными)

**PowerShell:**

```powershell
copy .env.example .env
docker compose up -d --build
docker compose --profile seed run --rm seed
```

**cmd / Git Bash:**

```bash
cp .env.example .env
docker compose up -d --build
docker compose --profile seed run --rm seed
```

Откройте в браузере: **http://localhost:3001**

API: **http://localhost:3000**

---

### Обычный запуск (без сидирования)

```bash
copy .env.example .env
docker compose up -d --build
```

(В Git Bash вместо `copy` используйте `cp`.)

---

### Остановка

```bash
docker compose down
```

Удалить контейнеры и данные БД:

```bash
docker compose down -v
```

---

### Повторное сидирование

Сидирование выполняется только если справочник видов работ **пустой**. Чтобы заполнить БД заново:

```bash
docker compose down -v
docker compose up -d --build
docker compose --profile seed run --rm seed
```

---

### Скрипт-обёртка (необязательно)

**PowerShell** — то же самое, что команды выше:

```powershell
.\scripts\docker-up.ps1 -Seed
```

Без тестовых данных:

```powershell
.\scripts\docker-up.ps1
```

---

## Сервисы

| Сервис | URL / порт |
|--------|------------|
| Frontend | http://localhost:3001 |
| API | http://localhost:3000 |
| PostgreSQL | localhost:5433 |

---

## Переменные `.env`

Файл `.env` лежит в **корне проекта** (скопируйте из `.env.example`).

| Переменная | Значение по умолчанию |
|------------|------------------------|
| `POSTRGES_USER` | пользователь PostgreSQL |
| `POSTGRES_PASSWORD` | пароль |
| `POSTGRES_DATABASE` | имя базы |
| `POSTGRES_HOST_PORT` | `5433` (доступ с хоста) |
| `API_PORT` | `3000` |
| `FRONT_PORT` | `3001` |

В Docker для API хост БД задаётся автоматически (`postgres:5432`).

---

## Структура проекта

```
WorkLog/
├── Front/           # React SPA
├── api/             # NestJS REST API
├── scripts/         # seed-db.mjs, docker-up
├── docker-compose.yml
├── .env.example
└── .env
```

---

## API (кратко)

| Метод | Путь |
|-------|------|
| GET | `/log?count=&page=&order=&dateFrom=&dateTo=` |
| POST, PUT, DELETE | `/log`, `/log/:id` |
| GET | `/work-type`, `/work-type/search?title=` |
| POST, PUT, DELETE | `/work-type`, `/work-type/:id` |

`GET /log` возвращает `[массив записей, общее количество]`.

---

## Локальная разработка (без полного Docker)

Только БД в Docker, API и Front — через npm:

```bash
docker compose up -d postgres
```

```bash
cd api
npm install
npm run start:dev
```

```bash
cd Front
npm install
npm run dev
```

В `.env` для локального API: `POSTRGES_HOST=localhost`, `POSTGRES_PORT=5433`.

---

## Валидация

В полях **ФИО** и **наименование работ** допускаются буквы, пробелы и знаки препинания `.,'-«»()—`. ФИО — не короче 5 символов.
