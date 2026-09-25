include .env
export

PROJECT_ROOT := $(shell pwd)
export PROJECT_ROOT

# Запуск инфраструктуры (база данных)
env-up:
	@docker compose up -d crm-postgres

# Остановка инфраструктуры
env-down:
	@docker compose down crm-postgres

# 1. Запуск миграций структуры БД с пробросом папки migrations
db-migrate:
	@echo "🚀 Запуск миграций структуры базы данных..."
	@docker compose run --rm --entrypoint "" \
		-v "$(PROJECT_ROOT)/backend/migrations:/usr/local/app/migrations" \
		crm-backend npx sequelize-cli db:migrate \
		--migrations-path /usr/local/app/migrations \
		--url "postgres://$(DB_USER):$(DB_PASSWORD)@crm-postgres:5432/$(DB_NAME)"

# 2. Запуск сидеров (наполнение ролями) с пробросом папки seeders
db-seed:
	@echo "🌱 Заполнение базы данных начальными ролями..."
	@docker compose run --rm --entrypoint "" \
		-v "$(PROJECT_ROOT)/backend/seeders:/usr/local/app/seeders" \
		crm-backend npx sequelize-cli db:seed:all \
		--seeders-path /usr/local/app/seeders \
		--url "postgres://$(DB_USER):$(DB_PASSWORD)@crm-postgres:5432/$(DB_NAME)"

# 3. Полная инициализация проекта одной командой (Поднять базу + Накатить структуру + Наполнить данными)
db-init: env-up
	@echo "⏳ Ожидание запуска PostgreSQL..."
	@sleep 3
	@make db-migrate
	@make db-seed
	@echo "🎉 База данных успешно инициализирована и наполнена ролями!"
