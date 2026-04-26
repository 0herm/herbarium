FROM oven/bun:alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY --chown=app:app . .

USER app

CMD ["bun", "run", "start"]
