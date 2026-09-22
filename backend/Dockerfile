# === ЭТАП 1: Установка зависимостей и сборка приложения ===
FROM oven/bun:1.2-alpine AS builder
WORKDIR /usr/local/app

# Копируем package.json
COPY package.json ./
RUN bun install 

# Копируем исходный код и собираем NestJS проект
COPY . .
RUN bun run build

# === ЭТАП 2: Финальный легковесный образ ===
FROM oven/bun:1.2-alpine AS runner
WORKDIR /usr/local/app

ENV NODE_ENV=production

# Копируем node_modules и скомпилированный код из builder
COPY --from=builder /usr/local/app/node_modules ./node_modules
COPY --from=builder /usr/local/app/dist ./dist
COPY --from=builder /usr/local/app/package.json ./package.json

EXPOSE 3000

# Правильный запуск NestJS в среде Bun
CMD ["bun", "dist/main.js"]
