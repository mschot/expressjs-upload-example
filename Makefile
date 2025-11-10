.PHONY: help up down build restart logs test lint test-watch test-coverage clean

# Default target - start containers
.DEFAULT_GOAL := up

up:
	docker compose up -d

down:
	docker compose down

build: 
	docker compose down -v && docker compose up --build -d

restart:
	docker compose restart

logs:
	docker compose logs -f app

test:
	docker exec test-app npm test

lint:
	docker exec test-app npm run lint

test-watch:
	docker exec -it test-app npm run test:watch

test-coverage:
	docker exec test-app npm run test:coverage

clean:
	docker compose down -v

help:
	@echo "Available targets:"
	@echo "  make (or make up)    - Start containers (builds on first run)"
	@echo "  make down            - Stop containers"
	@echo "  make build           - Rebuild containers"
	@echo "  make restart         - Restart containers"
	@echo "  make logs            - View application logs"
	@echo "  make test            - Run tests inside container"
	@echo "  make lint            - Run linter inside container"
	@echo "  make test-watch      - Run tests in watch mode"
	@echo "  make test-coverage   - Run tests with coverage"
	@echo "  make clean           - Stop containers and remove volumes"
