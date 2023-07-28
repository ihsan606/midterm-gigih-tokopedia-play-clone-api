FROM node:alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY src/prisma ./src/prisma/
COPY tsconfig.json ./

RUN npm install


COPY . .

RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/src/index.js" ]