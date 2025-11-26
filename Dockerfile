FROM node:22.17.1-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD ["node", "dist/server.js"]