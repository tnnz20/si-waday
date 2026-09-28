.DEFAULT_GOAL := help
.PHONY: help install dev build start lint lint-fix typecheck format format-check compose-up compose-down db-generate db-migrate db-push db-studio

ENGINE ?= $(if $(engine),$(engine),podman)

help:
	@echo "Application:"
	@echo "  dev             Start React Router dev server"
	@echo "  install         Install dependencies"
	@echo "  build           Build production application"
	@echo "  start           Start production server"
	@echo "  lint            Run ESLint"
	@echo "  lint-fix        Fix ESLint issues"
	@echo "  typecheck       Run TypeScript check"
	@echo "  format          Format files with Prettier"
	@echo "  format-check    Check formatting with Prettier"
	@echo ""
	@echo "Database & Containers:"
	@echo "  compose-up      Start compose services (pass engine=docker, default: podman)"
	@echo "  compose-down    Stop compose services (pass engine=docker, default: podman)"
	@echo "  db-generate     Generate Drizzle migrations"
	@echo "  db-migrate      Run Drizzle migrations (pass ssh=true for SSH tunnel)"
	@echo "  db-push         Push Drizzle schema to database"
	@echo "  db-studio       Launch Drizzle Studio"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

lint-fix:
	npm run lint:fix

typecheck:
	npm run typecheck

format:
	npm run format

format-check:
	npm run format:check

compose-up:
	$(ENGINE) compose up -d

compose-down:
	$(ENGINE) compose down

db-generate:
	npm run db:generate

db-migrate:
	npm run db:migrate $(if $(filter true,$(ssh)),-- --ssh)

db-push:
	npm run db:push

db-studio:
	npm run db:studio
