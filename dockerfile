FROM oven/bun:alpine AS css
WORKDIR /app
COPY static/input.css static/input.css
COPY templates templates
RUN bun add tailwindcss @tailwindcss/cli && bunx @tailwindcss/cli -i static/input.css -o static/style.css --minify

FROM rust:alpine AS builder
RUN apk add --no-cache musl-dev && USER=root cargo new --bin herbarium
WORKDIR /herbarium
COPY Cargo.toml Cargo.lock ./
RUN cargo build --release && rm src/*.rs
COPY src src
COPY templates templates
RUN rm target/release/deps/herbarium* && cargo build --release

FROM alpine
RUN apk add --no-cache git openssh-client \
    && addgroup -S app && adduser -S app -G app \
    && mkdir -p /herbarium-recipes
WORKDIR /app
COPY --from=builder /herbarium/target/release/herbarium herbarium
COPY --from=css /app/static/style.css static/style.css
COPY static static
COPY --chmod=755 entrypoint.sh entrypoint.sh
RUN chown -R app:app /app /herbarium-recipes
USER app
ENV RECIPES_DIR=/herbarium-recipes STATIC_DIR=/app/static PORT=3001
EXPOSE 3001
ENTRYPOINT ["/app/entrypoint.sh"]
