#!/usr/bin/env python
"""
Export a DebugKB issue to a YAML or JSON template.

Usage:
    python scripts/export_issue.py ISSUE-2026-001
    python scripts/export_issue.py ISSUE-2026-001 --format json
    python scripts/export_issue.py ISSUE-2026-001 --out issue.yaml
"""
import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

import django
import yaml

# Allow running from repo root
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.issues.models import Issue  # noqa: E402


def serialize_issue(issue: Issue) -> dict:
    data = {
        "title": issue.title,
        "description": issue.description,
    }
    if issue.status:
        data["status"] = issue.status
    if issue.severity:
        data["severity"] = issue.severity
    if issue.resolution_confidence:
        data["resolution_confidence"] = issue.resolution_confidence
    if issue.category:
        data["category"] = issue.category
    if issue.tags.exists():
        data["tags"] = list(issue.tags.values_list("name", flat=True))
    if issue.environment:
        data["environment"] = issue.environment
    if issue.encountered_at:
        data["encountered_at"] = issue.encountered_at.isoformat()
    if issue.resolved_at:
        data["resolved_at"] = issue.resolved_at.isoformat()

    steps = list(issue.investigation_steps.all())
    if steps:
        data["investigation_steps"] = [
            {
                k: v
                for k, v in {
                    "hypothesis": s.hypothesis,
                    "attempt": s.attempt,
                    "result": s.result,
                    "is_successful": s.is_successful,
                }.items()
                if v not in (None, "")
            }
            for s in steps
        ]

    if hasattr(issue, "resolution") and issue.resolution:
        r = issue.resolution
        data["resolution"] = {
            k: v
            for k, v in {
                "root_cause": r.root_cause,
                "fix": r.fix,
                "verification": r.verification,
                "code_changes": r.code_changes,
                "confirmed_at": r.confirmed_at.isoformat() if r.confirmed_at else None,
            }.items()
            if v not in (None, "")
        }

    lessons = list(issue.lessons.all())
    if lessons:
        data["lessons"] = [
            {
                **{
                    "title": l.title,
                    "description": l.description,
                },
                **({"category": l.category} if l.category else {}),
                **(
                    {"tags": list(l.tags.values_list("name", flat=True))}
                    if l.tags.exists()
                    else {}
                ),
            }
            for l in lessons
        ]

    skills = list(issue.skills.all())
    if skills:
        data["skills"] = [
            {
                "name": s.name,
                "category": s.category,
                "proficiency": s.proficiency,
            }
            for s in skills
        ]

    sources = list(issue.sources.all())
    if sources:
        data["sources"] = [
            {
                k: v
                for k, v in {
                    "title": s.title,
                    "source_type": s.source_type,
                    "url": s.url,
                    "notes": s.notes,
                }.items()
                if v not in (None, "")
            }
            for s in sources
        ]

    related = list(issue.related_issues.values_list("id", flat=True))
    if related:
        data["related_issues"] = related

    if issue.reusability_score != 5:
        data["reusability_score"] = issue.reusability_score
    if issue.learning_value_score != 5:
        data["learning_value_score"] = issue.learning_value_score

    return data


def main():
    ap = argparse.ArgumentParser(description="Export a DebugKB issue.")
    ap.add_argument("issue_id")
    ap.add_argument("--format", choices=["yaml", "json"], default="yaml")
    ap.add_argument("--out", help="Write to a file instead of stdout")
    args = ap.parse_args()

    try:
        issue = Issue.objects.get(pk=args.issue_id)
    except Issue.DoesNotExist:
        print(f"Issue {args.issue_id} not found", file=sys.stderr)
        sys.exit(1)

    data = serialize_issue(issue)

    if args.format == "json":
        text = json.dumps(data, indent=2, ensure_ascii=False)
    else:
        text = yaml.safe_dump(
            data, sort_keys=False, allow_unicode=True, default_flow_style=False
        )

    if args.out:
        Path(args.out).write_text(text)
        print(f"Wrote {args.out}")
    else:
        print(text)


if __name__ == "__main__":
    main()
