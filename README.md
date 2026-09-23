# DebugKB

Personal Debugging Knowledge Base — capture, search, and learn from every solved problem.

## Quick Start

```bash
# Initialize (first time only)
./scripts/init.sh

# Launch backend + frontend together
./scripts/start.sh
```

Then open <http://localhost:5173>

## CLI

```bash
cd backend
source .venv/bin/activate

python manage.py issue create
python manage.py issue list
python manage.py issue search "django 403"
python manage.py issue import path/to/issue.yaml
```

## Documentation

See [`docs/system-concept.md`](docs/system-concept.md) for the full architecture and design.

## Layout

| Path         | Purpose                          |
| ------------ | -------------------------------- |
| `backend/`   | Django + DRF API and CLI         |
| `frontend/`  | React (Vite)                     |
| `scripts/`   | Launcher and utility scripts     |
| `systemd/`   | Service definitions              |
| `docs/`      | Design documentation             |
| `templates/` | Source files copied by `init.sh` |
