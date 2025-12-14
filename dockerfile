# Node image with Alpine Linux
FROM node:23-alpine

RUN apk add varnish postgresql-client

WORKDIR /app

COPY default.vcl /etc/varnish/default.vcl

COPY package*.json ./

COPY entrypoint.sh ./entrypoint.sh

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["/bin/sh", "/app/entrypoint.sh"]