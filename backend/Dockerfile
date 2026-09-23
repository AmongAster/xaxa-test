# === ЭТАП 1: Установка зависимостей и сборка приложения ===
FROM node:20-alpine AS builder
WORKDIR /usr/local/app

# Копируем файлы зависимостей
COPY package*.json ./
RUN npm ci

# Копируем исходный код и собираем NestJS проект
COPY . .
RUN npm run build

# Удаляем devDependencies и оставляем только production-зависимости
RUN npm prune --production

# === ЭТАП 2: Финальный легковесный образ ===
FROM node:20-alpine AS runner
WORKDIR /usr/local/app

ENV NODE_ENV=production

# Копируем node_modules и скомпилированный код из builder
COPY --from=builder /usr/local/app/node_modules ./node_modules
COPY --from=builder /usr/local/app/dist ./dist
COPY --from=builder /usr/local/app/package.json ./package.json

EXPOSE 3000

# Запуск NestJS приложения с помощью Node.js
CMD ["node", "dist/main.js"]
