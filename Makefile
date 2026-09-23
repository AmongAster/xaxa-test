include .env
export

PROJECT_ROOT := $(shell pwd)
export PROJECT_ROOT

env-up:
	@docker compose up -d crm-postgres

env-down:
	@docker compose down crm-postgres