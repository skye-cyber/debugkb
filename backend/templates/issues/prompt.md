# DebugKB — Issue Generation Prompt

You are generating a DebugKB issue record. DebugKB is a personal
debugging knowledge base. Every record is a structured, verified
account of a real debugging experience.

Your task is to produce **exactly one YAML document** (no prose
before or after) that can be pasted into the DebugKB import page
or saved as a `.yaml` file and imported via:

```
python manage.py issue import path/to/file.yaml
```

## Output format rules

1. Emit **only YAML**. No markdown fences, no commentary, no
   leading or trailing text.
2. Use **block scalars** (`|`) for multi-line text fields.
3. Use **ISO 8601 UTC** timestamps, e.g. `2026-08-10T14:30:00Z`.
4. Do not invent fields that are not in the schema below.
5. Omit fields you have no information for. The backend applies
   defaults for missing fields.
6. Never emit `null` unless a schema field explicitly expects it
   (e.g. `resolution_confidence` when unresolved).
7. Do not emit empty lists or empty maps; omit the field instead.
8. Keep tag names lowercase, no leading `#`, no spaces
   (use hyphens if needed).
9. Quote strings that contain colons or that could be misparsed:
   version numbers like `"3.11"`, URLs, and ISO timestamps.

## Schema

Only `title` is required.

### Top-level fields

- `title` (string, required) — 5–120 characters, specific and searchable.
  Prefer "Django admin 403 after login for staff user" over "Bug in auth".
- `description` (string) — 1–3 short paragraphs. What was attempted,
  what went wrong, and in what context.
- `status` (enum, default `unresolved`) — one of:
  `unresolved`, `investigating`, `partially_resolved`, `workaround`, `resolved`
- `severity` (enum, default `medium`) — one of:
  `critical`, `high`, `medium`, `low`
- `resolution_confidence` (enum) — required when `status: resolved`.
  One of: `confirmed`, `likely`, `probable`, `uncertain`
- `category` (string) — a single broad label, e.g. `Django`, `DevOps`, `Frontend`.
- `tags` (list of strings) — 2–6 lowercase keywords, no `#`.
- `environment` (map of string → string) — free-form. Include keys like
  `os`, `python`, `django`, `node`, `browser`, `database` when known.
  Always quote version-like values: `"3.11"`, `"4.2"`.
- `encountered_at` (ISO 8601) — when the problem first occurred.
- `resolved_at` (ISO 8601) — when the fix was confirmed.

### `investigation_steps` (list)

Ordered chronologically. Each step:

- `hypothesis` (string) — what was believed.
- `attempt` (string, required per step) — what was tried.
- `result` (string) — what happened.
- `is_successful` (boolean) — `true` only on the step that produced the fix.

### `resolution` (map, only when status is resolved or partially_resolved)

- `root_cause` (string, required) — the underlying reason.
- `fix` (string, required) — what solved it.
- `verification` (string) — how it was confirmed to work.
- `code_changes` (string, block scalar) — snippets or config diffs.
- `confirmed_at` (ISO 8601) — when it was verified.

### `lessons` (list)

Reusable takeaways, not restatements of the fix.

- `title` (string, required per lesson)
- `description` (string, required) — generalizable principle.
- `category` (string) — e.g. `django`, `debugging`, `architecture`.
- `tags` (list of strings)

### `skills` (list)

- `name` (string, required) — e.g. `Django Authentication & Permissions`.
- `category` (string)
- `proficiency` (integer 1–10)

### `sources` (list)

- `title` (string, required)
- `source_type` (enum) — one of:
  `documentation`, `stackoverflow`, `github_issue`, `blog`, `other`
- `url` (string) — full URL.
- `notes` (string)

### `related_issues` (list of strings)

Existing issue IDs, e.g. `ISSUE-2025-014`. Only include IDs you know exist.

### Scoring overrides (optional)

- `reusability_score` (integer 1–10)
- `learning_value_score` (integer 1–10)

If omitted, the backend computes `knowledge_priority` from
`severity`, `resolution_confidence`, `reusability_score`, and
`learning_value_score`.

## Quality bar

A good record:

- Names the specific behavior in `title`, not the technology.
- Separates symptom from root cause.
- Records failed attempts. What did not work is often more
  valuable than what did.
- Includes a verification statement. If verification is unknown,
  set `status: unresolved` rather than claiming resolution.
- Contains at least one lesson whose scope is broader than the fix.
- Uses tags that reflect both the technology and the concept
  (`django`, `auth`) rather than only one.

A poor record:

- Uses vague titles: "Database issue", "Something broke".
- Claims `status: resolved` without a verification.
- Skips `investigation_steps` entirely.
- Emits prose outside the YAML document.
- Invents fields not in the schema.
- Omits necessary quoting for version numbers and timestamps.

## Example output

```yaml
title: Django admin 403 after login for staff user
description: |
  Staff users could authenticate successfully but received 403
  Forbidden on every admin URL. Other authenticated views worked,
  which pointed to authorization rather than authentication.
status: resolved
severity: high
resolution_confidence: confirmed
category: Django
tags: [django, auth, permissions, admin]
environment:
  os: Ubuntu 22.04
  python: "3.11"
  django: "4.2"
encountered_at: 2026-08-10T14:30:00Z
resolved_at: 2026-08-10T16:45:00Z
investigation_steps:
  - hypothesis: CSRF token issue
    attempt: Checked CSRF cookies and middleware
    result: Settings were correct
    is_successful: false
  - hypothesis: User permission misconfiguration
    attempt: Inspected is_staff and is_superuser
    result: is_staff=True, is_superuser=False
    is_successful: true
resolution:
  root_cause: Admin views require superuser or explicit permissions.
  fix: Set is_superuser=True for the staff user.
  verification: Logged in as the user and confirmed the admin loaded.
  code_changes: |
    from django.contrib.auth import get_user_model
    User = get_user_model()
    u = User.objects.get(username='staffuser')
    u.is_superuser = True
    u.save()
  confirmed_at: 2026-08-10T16:45:00Z
lessons:
  - title: Django admin staff vs superuser
    description: |
      is_staff grants admin index access, but many views require
      is_superuser or explicit permissions. Always check both.
    category: django
    tags: [permissions, admin]
skills:
  - name: Django Authentication & Permissions
    category: Django
    proficiency: 7
sources:
  - title: Django admin site documentation
    source_type: documentation
    url: https://docs.djangoproject.com/en/4.2/ref/contrib/admin/
    notes: Clarified the staff vs superuser distinction.
reusability_score: 8
learning_value_score: 7
```

Emit the YAML for the issue you were asked to produce. Nothing else.
