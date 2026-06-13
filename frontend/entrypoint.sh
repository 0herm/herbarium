#!/bin/sh
set -e

RECIPES_DIR="${RECIPES_DIR:-/herbarium-recipes}"
REPO_URL="git@github.com:0herm/herbarium-recipes.git"
PULL_INTERVAL="${RECIPES_PULL_INTERVAL:-300}"

mkdir -p ~/.ssh
printf '%s' "$GITHUB_DEPLOY_KEY" | base64 -d > ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519

export GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_ed25519 -o StrictHostKeyChecking=no -o BatchMode=yes"

if [ -d "$RECIPES_DIR/.git" ]; then
    git -C "$RECIPES_DIR" pull --ff-only
else
    git clone --depth=1 "$REPO_URL" "$RECIPES_DIR"
fi

( while true; do sleep "$PULL_INTERVAL" && git -C "$RECIPES_DIR" pull --ff-only || true; done ) &

varnishd -a :3000 -f /etc/varnish/default.vcl -s malloc,1g &
exec bun server.js
