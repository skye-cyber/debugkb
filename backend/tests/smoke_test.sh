# Create
curl -s -X POST http://localhost:8001/api/issues/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Django admin 403 after login",
    "description": "Staff user could log in but got 403",
    "status": "resolved",
    "severity": "high",
    "resolution_confidence": "confirmed",
    "tags": ["django", "auth", "permissions"],
    "investigation_steps": [
      {"step_order": 1, "hypothesis": "CSRF", "attempt": "Checked", "result": "Fine", "is_successful": false},
      {"step_order": 2, "hypothesis": "Perms", "attempt": "Checked flags", "result": "is_superuser=False", "is_successful": true}
    ],
    "resolution": {
      "root_cause": "Admin views require superuser",
      "fix": "Set is_superuser=True",
      "verification": "Confirmed working"
    }
  }' | jq

# List
curl -s "http://localhost:8001/api/issues/?severity=high&status=resolved" | jq

# Detail
curl -s http://localhost:8001/api/issues/ISSUE-2026-001/ | jq

# Search
curl -s "http://localhost:8001/api/search/?q=django+403" | jq

# Import preview
curl -s -X POST http://localhost:8001/api/import/preview/ \
  -H "Content-Type: application/json" \
  -d '{"template": "title: Test import\nseverity: high\ntags: [x,y]"}' | jq

# Import confirm
curl -s -X POST http://localhost:8001/api/import/confirm/ \
  -H "Content-Type: application/json" \
  -d '{"template": "title: Test import\nseverity: high"}' | jq

# Tags
curl -s http://localhost:8001/api/tags/ | jq

# Skills
curl -s http://localhost:8001/api/skills/ | jq

# Stats
curl -s http://localhost:8001/api/stats/summary/ | jq
