#!/usr/bin/env bash
# Kill any running DebugKB dev processes.
pkill -f "manage.py runserver" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
echo "Stopped DebugKB processes."
