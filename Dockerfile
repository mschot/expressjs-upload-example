FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8335

CMD ["node", "--watch", "src/index.js"]
