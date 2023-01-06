FROM node:16.19

WORKDIR /Api

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]