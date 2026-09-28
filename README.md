# CRM IT School Backend

Репозиторий содержит бэкенд-часть CRM-системы для ИТ-школы, построенную на базе **NestJS**. В качестве инфраструктуры используются PostgreSQL, Keycloak, Redis и MinIO.

---

## 🛠 Требования

Для локального запуска проекта вам понадобятся:
* **Docker** и **Docker Compose**
* **Make** (утилита для запуска команд из Makefile)

---

## 🚀 Быстрый старт

### 1. Настройка окружения
Создайте файл `.env` в корневом каталоге проекта и скопируйте в него следующие конфигурационные переменные:

```env
# Database Settings
DB_HOST=crm-postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=crm_it_school

# Keycloak Settings
KEYCLOAK_URL=http://crm-keycloak:8080
KEYCLOAK_REALM=my-crm-realm
KEYCLOAK_CLIENT_ID=nestjs-backend

# Redis Settings
REDIS_HOST=crm-redis
REDIS_PORT=6379

# MinIO Settings
MINIO_ENDPOINT=crm-minio
MINIO_PORT=9000
MINIO_BUCKET=backend
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# App / Dev Settings
APP_PORT=3000
HOST_PORT=3000
APP_DOMAIN=localhost
```

> 💡 *Примечание:* Из оригинальных настроек `REDIS_HOST`, `MINIO_ENDPOINT` и `KEYCLOAK_URL` при необходимости убирается протокол `http://` в зависимости от того, как Docker-контейнеры общаются внутри сети.

### 2. Инициализация базы данных
Перед первым запуском приложения необходимо поднять инфраструктуру и накатить миграции. Выполните команду:

```bash
make db-init
```

### 3. Запуск приложения
После успешной инициализации базы данных запустите проект следующей командой:

```bash
make app-run
```

После этого приложение будет доступно по адресу: **http://localhost:3000**

---

## 📂 Доступ к сервисам (Локально)

Если контейнеры проброшены на ваш хост, вы можете получить доступ к панелям управления:
* **NestJS API:** `http://localhost:3000`
* **Keycloak:** `http://localhost:8080`
* **MinIO Console:** `http://localhost:9000` (или порт консоли, указанный в docker-compose)
