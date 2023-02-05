FROM node:18.12.1-alpine3.17 as dev

WORKDIR /app
COPY package*.json .
COPY prisma ./prisma/

RUN apk update \
    && apk add openssl1.1-compat

RUN npm install
COPY . .
EXPOSE 4000
ENTRYPOINT [ "npm", "start" ]
