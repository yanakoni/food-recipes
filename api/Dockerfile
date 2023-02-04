FROM node:19-buster-slim as dev

WORKDIR /app
COPY package*.json .

RUN npm install
COPY . .
EXPOSE 4000
ENTRYPOINT [ "node", "index.js" ]
