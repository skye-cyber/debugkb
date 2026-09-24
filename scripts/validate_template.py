#!/usr/bin/env python
"""
Validate a DebugKB issue template without importing it.

Usage:
    python scripts/validate_template.py path/to/issue.yaml
    cat issue.yaml | python scripts/validate_template.py -
"""
import argparse
import json
import sys
from pathlib import Path

import yaml


ALLOWED_STATUSES = {
    "unresolved", "investigating", "partially_resolved",
    "workaround", "resolved",
}
ALLOWED_SEVERITIES = {"critical", "high", "medium", "low"}
ALLOWED_CONFIDENCE = {"confirmed", "likely", "probable", "uncertain"}
ALLOWED_SOURCE_TYPES = {
    "documentation", "stackoverflow", "github_issue", "blog", "other",
}


def parse(text: str):
    text = text.strip()
    if text.startswith("{"):
        return json.loads(text)
    return yaml.safe_load(text)


def validate(data) -> list[str]:
    errors = []

    if not isinstance(data, dict):
        return ["Template must be a YAML/JSON mapping"]

    title = data.get("title")
    if not title or not isinstance(title, str):
        errors.append("`title` is required and must be a string")
    elif len(title) > 200:
        errors.append("`title` should be under 200 characters")

    if "status" in data and data["status"] not in ALLOWED_STATUSES:
        errors.append(
            f"`status` must be one of {sorted(ALLOWED_STATUSES)} "
            f"(got {data['status']!r})"
        )

    if "severity" in data and data["severity"] not in ALLOWED_SEVERITIES:
        errors.append(
            f"`severity` must be one of {sorted(ALLOWED_SEVERITIES)} "
            f"(got {data['severity']!r})"
        )

    conf = data.get("resolution_confidence")
    if conf and conf not in ALLOWED_CONFIDENCE:
        errors.append(
            f"`resolution_confidence` must be one of "
            f"{sorted(ALLOWED_CONFIDENCE)} (got {conf!r})"
        )

    if data.get("status") == "resolved" and not conf:
        errors.append(
            "`resolution_confidence` is required when status is `resolved`"
        )

    tags = data.get("tags", [])
    if tags and not isinstance(tags, list):
        errors.append("`tags` must be a list of strings")
    elif isinstance(tags, list):
        for t in tags:
            if not isinstance(t, str):
                errors.append(f"Tag {t!r} must be a string")
            elif t != t.lower() or t.startswith("#") or " " in t:
                errors.append(
                    f"Tag {t!r} must be lowercase, without '#', "
                    f"and without spaces"
                )

    env = data.get("environment", {})
    if env and not isinstance(env, dict):
        errors.append("`environment` must be a map of key → value")

    steps = data.get("investigation_steps", [])
    if steps and not isinstance(steps, list):
        errors.append("`investigation_steps` must be a list")
    elif isinstance(steps, list):
        for i, step in enumerate(steps, start=1):
            if not isinstance(step, dict):
                errors.append(f"Step {i} must be a mapping")
                continue
            if not step.get("attempt"):
                errors.append(f"Step {i} is missing `attempt`")

    resolution = data.get("resolution")
    if resolution is not None:
        if not isinstance(resolution, dict):
            errors.append("`resolution` must be a mapping")
        else:
            if not resolution.get("root_cause"):
                errors.append("`resolution.root_cause` is required")
            if not resolution.get("fix"):
                errors.append("`resolution.fix` is required")

    lessons = data.get("lessons", [])
    if lessons and not isinstance(lessons, list):
        errors.append("`lessons` must be a list")
    elif isinstance(lessons, list):
        for i, lesson in enumerate(lessons, start=1):
            if not isinstance(lesson, dict):
                errors.append(f"Lesson {i} must be a mapping")
                continue
            if not lesson.get("title"):
                errors.append(f"Lesson {i} is missing `title`")
            if not lesson.get("description"):
                errors.append(f"Lesson {i} is missing `description`")

    sources = data.get("sources", [])
    if sources and not isinstance(sources, list):
        errors.append("`sources` must be a list")
    elif isinstance(sources, list):
        for i, src in enumerate(sources, start=1):
            if not isinstance(src, dict):
                errors.append(f"Source {i} must be a mapping")
                continue
            if not src.get("title"):
                errors.append(f"Source {i} is missing `title`")
            st = src.get("source_type")
            if st and st not in ALLOWED_SOURCE_TYPES:
                errors.append(
                    f"Source {i} has invalid `source_type` {st!r}"
                )

    for key in ("reusability_score", "learning_value_score"):
        v = data.get(key)
        if v is not None:
            if not isinstance(v, int) or not (1 <= v <= 10):
                errors.append(f"`{key}` must be an integer between 1 and 10")

    return errors


def main():
    ap = argparse.ArgumentParser(description="Validate a DebugKB template.")
    ap.add_argument("path", help="Path to file, or '-' for stdin")
    args = ap.parse_args()

    text = sys.stdin.read() if args.path == "-" else Path(args.path).read_text()

    try:
        data = parse(text)
    except Exception as e:
        print(f"Parse error: {e}", file=sys.stderr)
        sys.exit(2)

    errors = validate(data)
    if errors:
        print("Validation failed:", file=sys.stderr)
        for e in errors:
            print(f"  ✗ {e}", file=sys.stderr)
        sys.exit(1)

    print("✓ Template is valid")


if __name__ == "__main__":
    main()
