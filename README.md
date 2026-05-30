# WorkLog — журнал работ

Веб-приложение для учёта выполненных работ.

| Слой     | Технологии                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite                                                                                                                                                |
| Backend  | NestJS 11 (Преркрасно для API как в вопросе реализации и расширения, так и масштабирования), TypeORM (Можно было бы писать голые SQL запросы, но в такой задаче - зачем?) |
| БД       | PostgreSQL 16 (Преркасная реляционная СУБД, как раз под задачу)                                                                                                           |
| Запуск   | Docker Compose                                                                                                                                                            |

---

## Запуск (Docker)

Все команды выполняются **из корня проекта** (`WorkLog/`).

### Запуск

**PowerShell:**

```powershell
copy .env.example .env
docker compose up -d --build
```

**cmd / Git Bash:**

```bash
cp .env.example .env
docker compose up -d --build
```

Откройте в браузере: **http://localhost:3001**

API: **http://localhost:3000**

---

### Добавление тестовых записей (Сидирование)

```bash
docker compose --profile seed run --rm seed
```

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

## Сервисы

| Сервис     | URL / порт            |
| ---------- | --------------------- |
| Frontend   | http://localhost:3001 |
| API        | http://localhost:3000 |
| PostgreSQL | localhost:5433        |

---

## Переменные `.env`

Файл `.env` лежит в **корне проекта** (скопируйте из `.env.example`).

| Переменная           | Значение по умолчанию   |
| -------------------- | ----------------------- |
| `POSTRGES_USER`      | пользователь PostgreSQL |
| `POSTGRES_PASSWORD`  | пароль                  |
| `POSTGRES_DATABASE`  | имя базы                |
| `POSTGRES_HOST_PORT` | `5433` (доступ с хоста) |
| `API_PORT`           | `3000`                  |
| `FRONT_PORT`         | `3001`                  |

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

| Метод             | Путь                                         |
| ----------------- | -------------------------------------------- |
| GET               | `/log?count=&page=&order=&dateFrom=&dateTo=` |
| POST, PUT, DELETE | `/log`, `/log/:id`                           |
| GET               | `/work-type`, `/work-type/search?title=`     |
| POST, PUT, DELETE | `/work-type`, `/work-type/:id`               |

`GET /log` возвращает `[массив записей, общее количество]`.
