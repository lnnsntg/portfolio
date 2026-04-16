#!/bin/bash
set -e

APP_DIR="/var/www/portfolio"

echo "→ Pulling changes..."
cd $APP_DIR
git pull origin main

# Backend: sync solo si cambió algo relevante
if git diff HEAD@{1} HEAD --name-only | grep -qE "pyproject.toml|uv.lock"; then
    echo "→ Syncing Python deps..."
    cd $APP_DIR/backend
    uv sync --frozen
else
    echo "→ Skipping uv sync (no changes)"
fi

# Frontend: build solo si cambió algo relevante
if  git diff HEAD@{1} HEAD --name-only | grep -q "^frontend/"; then
    echo "→ Building frontend..."
    cd $APP_DIR/frontend
    npm ci
    npm run build
else
    echo "→ Skipping frontend build (no changes)"
fi

echo "→ Reloading backend..."
systemctl reload portfolio-backend

echo "✓ Deploy OK $(date)"
