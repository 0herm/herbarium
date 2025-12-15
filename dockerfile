# Node image with Alpine Linux
FROM node:23-alpine

RUN apk add varnish postgresql18-client --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY default.vcl /etc/varnish/default.vcl

COPY entrypoint.sh ./entrypoint.sh

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["/bin/sh", "/app/entrypoint.sh"]