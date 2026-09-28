include .env
export

PROJECT_ROOT := $(shell pwd)
export PROJECT_ROOT

# Запуск инфраструктуры (база данных)
env-up:
	@docker compose up -d crm-postgres

# Запуск бэкенда
backend-run:
	@echo "Процесс сборки запущен"
	@docker compose up -d --build crm-backend
	@sleep 3
	@echo "Процесс Запуска"
	@docker compose up -d crm-backend
	@echo "Бакэнд запущен!"

# Запуск сопутствующих сервисов
service-run:	
	@docker compose up -d crm-redis crm-keycloak crm-minio

#frontend-run:
#	@docker compose up -d --build crm-frontend
#	@docker compose up -d crm-frontend

# Главный таргет оркестрации запуска
stack-setup-run:
	@$(MAKE) backend-run
	@$(MAKE) service-run
#	@$(MAKE) frontend-run

# Остановка инфраструктуры
env-down:
	@docker compose down

# 1. Запуск миграций структуры БД (добавлен флаг --yes)
db-migrate:
	@echo "🚀 Запуск миграций структуры базы данных..."
	@docker compose run --rm --entrypoint "" \
		-v "$(PROJECT_ROOT)/backend/migrations:/usr/local/app/migrations" \
		crm-backend npx --yes sequelize-cli db:migrate \
		--migrations-path /usr/local/app/migrations \
		--url "postgres://$(DB_USER):$(DB_PASSWORD)@crm-postgres:5432/$(DB_NAME)"

# 2. Запуск сидеров (исправлен volume, путь и добавлен флаг --yes)
db-seed:
	@echo "🌱 Заполнение базы данных начальными данными/ролями..."
	@docker compose run --rm --entrypoint "" \
		-v "$(PROJECT_ROOT)/backend/seeders:/usr/local/app/seeders" \
		crm-backend npx --yes sequelize-cli db:seed:all \
		--seeders-path /usr/local/app/seeders \
		--url "postgres://$(DB_USER):$(DB_PASSWORD)@crm-postgres:5432/$(DB_NAME)"

# 3. Полная инициализация проекта
db-init: env-up
	@echo "⏳ Ожидание запуска PostgreSQL..."
	@sleep 5
	@$(MAKE) db-migrate
	@$(MAKE) db-seed
	@echo "🎉 База данных успешно инициализирована и наполнена ролями!"

# Полный цикл: инициализация БД и запуск всего стека
app-run:
	@echo "Идет Запуск проекта..."
	@$(MAKE) stack-setup-run
	@echo "Проект Запущен"

app-stop: 
	@echo "Остановка всех сервисов проекта..."
	@docker compose down
