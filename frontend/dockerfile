# Builder
FROM oven/bun:alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run lint
RUN bun run build

# Runtime
FROM oven/bun:alpine
WORKDIR /app

RUN apk add --no-cache varnish \
    && addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
COPY --from=builder --chown=app:app /app/public ./public

COPY default.vcl /etc/varnish/default.vcl

RUN chown app:app /etc/varnish
RUN chown app:app /var/lib/varnish
USER app

ENV HOSTNAME=0.0.0.0
ENV PORT=3001
EXPOSE 3000

CMD ["sh", "-c", "varnishd -a :3000 -f /etc/varnish/default.vcl -s malloc,1g & bun server.js"]
