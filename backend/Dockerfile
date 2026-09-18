# === ЭТАП 1: Сборка приложения ===
FROM node:22.21-alpine AS builder
WORKDIR /usr/local/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# === ЭТАП 2: Установка только production-зависимостей ===
FROM node:22.21-alpine AS dependencies
WORKDIR /usr/local/app

COPY package*.json ./
# Установка БЕЗ devDependencies
RUN npm ci --only=production 

# === ЭТАП 3: Финальный легковесный образ ===
FROM node:22.21-alpine AS runner
WORKDIR /usr/local/app

ENV NODE_ENV=production

# Копируем только результаты сборки и production-зависимости
COPY --from=dependencies /usr/local/app/node_modules ./node_modules
COPY --from=builder /usr/local/app/dist ./dist
COPY --from=builder /usr/local/app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main"]
