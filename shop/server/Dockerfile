# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код
COPY . .

# Собираем TypeScript
RUN npm run build

# Открываем порт
EXPOSE 5000

# Запускаем сервер
CMD ["npm", "start"]