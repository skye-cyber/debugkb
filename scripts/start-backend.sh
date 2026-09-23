#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR/backend"
source ~/pyenv/bin/activate
exec python manage.py runserver "0.0.0.0:${BACKEND_PORT:-8000}"
