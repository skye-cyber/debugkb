#!/usr/bin/env bash
#
# DebugKB — Project Initialization Script
# ----------------------------------------
# Bootstraps the complete DebugKB project:
#   - Directory structure
#   - Django backend + DRF
#   - React frontend (Vite)
#   - PostgreSQL database
#   - Environment files
#   - CLI scaffolding
#
# Usage:
#   ./scripts/init.sh              # Full initialization
#   ./scripts/init.sh --skip-db    # Skip database creation
#   ./scripts/init.sh --skip-fe    # Skip frontend setup
#   ./scripts/init.sh --skip-be    # Skip backend setup
#
# Idempotent: safe to re-run.

set -euo pipefail

# ─────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────

PROJECT_NAME="debugkb"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
SCRIPTS_DIR="$PROJECT_DIR/scripts"
DOCS_DIR="$PROJECT_DIR/docs"
SYSTEMD_DIR="$PROJECT_DIR/systemd"
DOCKER_DIR="$PROJECT_DIR/docker"

PYTHON_VERSION="3.14"
NODE_VERSION="20"
DB_NAME="debugkb"
DB_USER="debugkb"
DB_PASSWORD="debugkb_dev_password"
DB_HOST="localhost"
DB_PORT="5432"
BACKEND_PORT="8001"
FRONTEND_PORT="5173"

# ─────────────────────────────────────────────────────────────
# Flags
# ─────────────────────────────────────────────────────────────

SKIP_DB=false
SKIP_BE=false
SKIP_FE=false

for arg in "$@"; do
    case $arg in
        --skip-db) SKIP_DB=true ;;
        --skip-be) SKIP_BE=true ;;
        --skip-fe) SKIP_FE=true ;;
        --help)
            echo "Usage: $0 [--skip-db] [--skip-be] [--skip-fe]"
            exit 0
            ;;
        *)
            echo "Unknown option: $arg"
            exit 1
            ;;
    esac
done

# ─────────────────────────────────────────────────────────────
# Utilities
# ─────────────────────────────────────────────────────────────

log()      { echo -e "\033[1;34m[INFO]\033[0m  $*"; }
success()  { echo -e "\033[1;32m[OK]\033[0m    $*"; }
warn()     { echo -e "\033[1;33m[WARN]\033[0m  $*"; }
error()    { echo -e "\033[1;31m[ERROR]\033[0m $*" >&2; }
section()  {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  $*"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        error "$1 is not installed. Please install it and retry."
        exit 1
    fi
}

confirm() {
    read -r -p "$1 [y/N] " response
    [[ "$response" =~ ^[Yy]$ ]]
}

# ─────────────────────────────────────────────────────────────
# Preflight checks
# ─────────────────────────────────────────────────────────────

section "Preflight Checks"

check_command python3
check_command pip3
check_command node
check_command npm
check_command git

if ! $SKIP_DB; then
    if ! command -v psql &> /dev/null; then
        warn "psql not found. Database setup will be skipped."
        SKIP_DB=true
    fi
fi

PY_VER=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
log "Python version: $PY_VER"
log "Node version:   $(node --version)"
log "Project dir:    $PROJECT_DIR"

success "Preflight checks passed"

# ─────────────────────────────────────────────────────────────
# 1. Directory Structure
# ─────────────────────────────────────────────────────────────

section "Creating Directory Structure"

mkdir -p "$BACKEND_DIR"
mkdir -p "$FRONTEND_DIR"
mkdir -p "$SCRIPTS_DIR"
mkdir -p "$DOCS_DIR"
mkdir -p "$SYSTEMD_DIR"
mkdir -p "$DOCKER_DIR"

success "Top-level directories created"

# ─────────────────────────────────────────────────────────────
# 2. Backend — Django + DRF
# ─────────────────────────────────────────────────────────────

if ! $SKIP_BE; then
    section "Setting Up Backend (Django + DRF)"

    cd "$BACKEND_DIR"

    # Virtual environment
    if [ ! -d ".venv" ]; then
        log "Creating virtual environment..."
        python3 -m venv .venv
        success "Virtual environment created"
    else
        log "Virtual environment already exists"
    fi

    # Activate
    # shellcheck disable=SC1091
    source .venv/bin/activate

    # Upgrade pip
    pip install --upgrade pip setuptools wheel --quiet

    # Requirements files
    mkdir -p requirements

    cat > requirements/base.txt << 'EOF'
# ─── Core ─────────────────────────────────────────────────
Django>=4.2,<5.0
djangorestframework>=3.14
django-cors-headers>=4.3
django-filter>=23.5

# ─── Database ─────────────────────────────────────────────
psycopg[binary]>=3.1

# ─── Config & Env ─────────────────────────────────────────
python-decouple>=3.8
dj-database-url>=2.1

# ─── Templates & Import ───────────────────────────────────
PyYAML>=6.0

# ─── Search ───────────────────────────────────────────────
# PostgreSQL full-text search (built-in)
EOF

    cat > requirements/development.txt << 'EOF'
-r base.txt

# ─── Dev Tools ────────────────────────────────────────────
django-extensions>=3.2
django-debug-toolbar>=4.2
ruff>=0.1
pytest>=7.4
pytest-django>=4.7
factory-boy>=3.3
EOF

    cat > requirements/production.txt << 'EOF'
-r base.txt

# ─── Production ───────────────────────────────────────────
gunicorn>=21.2
whitenoise>=6.6
EOF

    log "Installing base + development dependencies..."
    pip install -r requirements/development.txt --quiet

    # Create Django project
    if [ ! -f "manage.py" ]; then
        log "Creating Django project..."
        django-admin startproject config .
        success "Django project created"
    else
        log "Django project already exists"
    fi

    # Create apps
    mkdir -p apps
    touch apps/__init__.py

    if [ ! -d "apps/issues" ]; then
        log "Creating 'issues' app..."
        python manage.py startapp issues backend/apps/issues
        success "App 'issues' created"
    else
        log "App 'issues' already exists"
    fi

    # Create app subdirectories
    mkdir -p backend/apps/issues/services
    mkdir -p backend/apps/issues/management/commands
    mkdir -p backend/apps/issues/tests

    touch backend/apps/issues/services/__init__.py
    touch backend/apps/issues/management/__init__.py
    touch backend/apps/issues/management/commands/__init__.py
    touch backend/apps/issues/tests/__init__.py

    success "Backend scaffolding complete"
fi

# ─────────────────────────────────────────────────────────────
# 3. Frontend — React + Vite
# ─────────────────────────────────────────────────────────────

if ! $SKIP_FE; then
    section "Setting Up Frontend (React + Vite)"

    cd "$FRONTEND_DIR"

    if [ ! -f "package.json" ]; then
        log "Scaffolding Vite + React project..."
        npm create vite@latest . -- --template react --yes
        success "Vite project scaffolded"

        log "Installing dependencies..."
        npm install --silent

        log "Installing additional packages..."
        npm install --silent \
            react-router-dom \
            axios \
            @tanstack/react-query \
            clsx

        npm install --silent -D \
            eslint \
            prettier \
            @vitejs/plugin-react

        success "Frontend dependencies installed"
    else
        log "Frontend already initialized"
    fi

    # Ensure source subdirectories exist
    mkdir -p src/api
    mkdir -p src/components/layout
    mkdir -p src/components/issues
    mkdir -p src/components/import
    mkdir -p src/components/search
    mkdir -p src/components/skills
    mkdir -p src/components/common
    mkdir -p src/pages
    mkdir -p src/hooks
    mkdir -p src/utils
    mkdir -p src/styles

    success "Frontend structure ready"
fi

# ─────────────────────────────────────────────────────────────
# 4. Database — PostgreSQL
# ─────────────────────────────────────────────────────────────

if ! $SKIP_DB; then
    section "Setting Up PostgreSQL Database"

    # Check if DB already exists
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c '\q' &> /dev/null; then
        log "Database '$DB_NAME' already exists and is accessible"
    else
        log "Attempting to create database '$DB_NAME' and user '$DB_USER'..."

        if confirm "Create PostgreSQL database and user now?"; then
            # Requires superuser access
            sudo -u postgres psql << EOF
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
      CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASSWORD';
   END IF;
END
\$\$;
EOF

            sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
                sudo -u postgres createdb -O "$DB_USER" "$DB_NAME"

            success "Database and user created"
        else
            warn "Skipping database creation. You'll need to configure it manually."
        fi
    fi
fi

# ─────────────────────────────────────────────────────────────
# 5. Environment Files
# ─────────────────────────────────────────────────────────────

section "Writing Environment Files"

# Backend .env
if [ ! -f "$BACKEND_DIR/.env" ]; then
    cat > "$BACKEND_DIR/.env" << EOF
# ─── Django ───────────────────────────────────────────────
DEBUG=True
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(50))')
ALLOWED_HOSTS=localhost,127.0.0.1

# ─── Database ─────────────────────────────────────────────
DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

# ─── CORS ─────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS=http://localhost:$FRONTEND_PORT,http://127.0.0.1:$FRONTEND_PORT

# ─── Ports ────────────────────────────────────────────────
BACKEND_PORT=$BACKEND_PORT
EOF
    success "Created backend/.env"
else
    log "backend/.env already exists"
fi

# Backend .env.example
cat > "$BACKEND_DIR/.env.example" << EOF
DEBUG=True
SECRET_KEY=change-me
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://user:password@localhost:5432/debugkb
CORS_ALLOWED_ORIGINS=http://localhost:5173
BACKEND_PORT=8001
EOF

# Frontend .env
if [ ! -f "$FRONTEND_DIR/.env" ]; then
    cat > "$FRONTEND_DIR/.env" << EOF
VITE_API_URL=http://localhost:$BACKEND_PORT/api
VITE_APP_NAME=DebugKB
EOF
    success "Created frontend/.env"
else
    log "frontend/.env already exists"
fi

cat > "$FRONTEND_DIR/.env.example" << EOF
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=DebugKB
EOF

# ─────────────────────────────────────────────────────────────
# 6. Git Ignore
# ─────────────────────────────────────────────────────────────

section "Writing .gitignore"

cat > "$PROJECT_DIR/.gitignore" << 'EOF'
# ─── Python ───────────────────────────────────────────────
__pycache__/
*.py[cod]
*.egg-info/
.venv/
venv/
env/
.pytest_cache/
.ruff_cache/

# ─── Django ───────────────────────────────────────────────
*.log
db.sqlite3
db.sqlite3-journal
media/
staticfiles/

# ─── Node ─────────────────────────────────────────────────
node_modules/
dist/
build/
.vite/
npm-debug.log*
yarn-error.log*

# ─── Environment ──────────────────────────────────────────
.env
.env.local
.env.*.local

# ─── IDE ──────────────────────────────────────────────────
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# ─── Coverage ─────────────────────────────────────────────
htmlcov/
.coverage
coverage.xml
EOF

success ".gitignore written"

# ─────────────────────────────────────────────────────────────
# 7. Launcher Scripts
# ─────────────────────────────────────────────────────────────

section "Writing Launcher Scripts"

# start.sh
cat > "$SCRIPTS_DIR/start.sh" << 'EOF'
#!/usr/bin/env bash
# DebugKB — Launch backend + frontend together.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

cleanup() {
    echo ""
    echo "Shutting down..."
    [ -n "${BACKEND_PID:-}" ] && kill "$BACKEND_PID" 2>/dev/null || true
    [ -n "${FRONTEND_PID:-}" ] && kill "$FRONTEND_PID" 2>/dev/null || true
    wait 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "Starting backend..."
cd "$BACKEND_DIR"
source .venv/bin/activate
python manage.py runserver "0.0.0.0:${BACKEND_PORT:-8000}" &
BACKEND_PID=$!

echo "Starting frontend..."
cd "$FRONTEND_DIR"
npm run dev -- --host &
FRONTEND_PID=$!

echo ""
echo "  Backend:  http://localhost:${BACKEND_PORT:-8000}"
echo "  Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both."

wait
EOF

chmod +x "$SCRIPTS_DIR/start.sh"

# start-backend.sh
cat > "$SCRIPTS_DIR/start-backend.sh" << 'EOF'
#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR/backend"
source .venv/bin/activate
exec python manage.py runserver "0.0.0.0:${BACKEND_PORT:-8000}"
EOF
chmod +x "$SCRIPTS_DIR/start-backend.sh"

# start-frontend.sh
cat > "$SCRIPTS_DIR/start-frontend.sh" << 'EOF'
#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR/frontend"
exec npm run dev -- --host
EOF
chmod +x "$SCRIPTS_DIR/start-frontend.sh"

# stop.sh
cat > "$SCRIPTS_DIR/stop.sh" << 'EOF'
#!/usr/bin/env bash
# Kill any running DebugKB dev processes.
pkill -f "manage.py runserver" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
echo "Stopped DebugKB processes."
EOF
chmod +x "$SCRIPTS_DIR/stop.sh"

success "Launcher scripts written"

# ─────────────────────────────────────────────────────────────
# 8. Systemd Service
# ─────────────────────────────────────────────────────────────

section "Writing systemd Service Template"

cat > "$SYSTEMD_DIR/debugkb.service" << EOF
[Unit]
Description=DebugKB — Personal Debugging Knowledge Base
After=network.target postgresql.service

[Service]
Type=simple
User=$USER
Group=$(id -gn)
WorkingDirectory=$PROJECT_DIR
ExecStart=$SCRIPTS_DIR/start.sh
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

success "systemd/debugkb.service written (install manually if desired)"
