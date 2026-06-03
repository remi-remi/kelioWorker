FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
# try omit dev later
RUN npm install # --omit=dev

COPY . .
RUN npm run build
RUN npm i

CMD ["node", "dist/src/main.js"]

