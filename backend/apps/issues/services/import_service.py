import json
from datetime import datetime
from django.utils import timezone
import yaml
from rest_framework import serializers
from apps.issues.models import Issue, InvestigationStep, Resolution, Lesson, Source
from apps.issues.serializers import IssueWriteSerializer
from .scoring import calculate_priority
from .tag_service import get_or_create_tag, suggest_tags


class TemplateError(serializers.ValidationError):
    pass


def detect_format(text):
    return "json" if text.strip().startswith("{") else "yaml"


def parse_template(text):
    fmt = detect_format(text)
    try:
        if fmt == "json":
            data = json.loads(text)
        else:
            data = yaml.safe_load(text)
    except Exception as e:
        raise TemplateError({"template": [f"Parse error ({fmt}): {e}"]})
    if not isinstance(data, dict):
        raise TemplateError({"template": ["Template must be a mapping/object"]})
    return data


def normalize(data):
    """Apply defaults, coerce enums, prepare for IssueWriteSerializer."""
    if not data.get("title"):
        raise TemplateError({"title": ["Title is required"]})

    def lower(v):
        return str(v).lower() if v is not None else None

    out = {
        "title": data["title"],
        "description": data.get("description", ""),
        "status": lower(data.get("status")) or Issue.Status.UNRESOLVED.value,
        "severity": lower(data.get("severity")) or Issue.Severity.MEDIUM.value,
        "resolution_confidence": lower(data.get("resolution_confidence")),
        "category": data.get("category", ""),
        "reusability_score": int(data.get("reusability_score", 5)),
        "learning_value_score": int(data.get("learning_value_score", 5)),
        "environment": data.get("environment") or {},
        "encountered_at": _parse_dt(data.get("encountered_at")),
        "resolved_at": _parse_dt(data.get("resolved_at")),
        "tags": [str(t).lower() for t in (data.get("tags") or [])],
        "investigation_steps": data.get("investigation_steps") or [],
        "resolution": data.get("resolution"),
        "lessons": data.get("lessons") or [],
        "sources": data.get("sources") or [],
        "related_issues": data.get("related_issues") or [],
    }
    if not out["tags"]:
        out["tags"] = suggest_tags(out["title"] + " " + out["description"])
    return out


def _parse_dt(v):
    if not v:
        return None
    if isinstance(v, datetime):
        return v
    try:
        return datetime.fromisoformat(str(v).replace("Z", "+00:00"))
    except Exception:
        return None


def preview_issue(text):
    data = normalize(parse_template(text))
    priority = calculate_priority(
        data["severity"], data["reusability_score"],
        data["learning_value_score"], data["resolution_confidence"],
    )
    return {
        "id": "ISSUE-PREVIEW-001",
        "title": data["title"],
        "description": data["description"],
        "status": data["status"],
        "severity": data["severity"],
        "resolution_confidence": data["resolution_confidence"],
        "category": data["category"],
        "knowledge_priority": priority,
        "tags": data["tags"],
        "environment": data["environment"],
        "investigation_steps": data["investigation_steps"],
        "resolution": data["resolution"],
        "lessons": data["lessons"],
        "sources": data["sources"],
        "related_issues": data["related_issues"],
    }


def create_issue_from_template(text):
    data = normalize(parse_template(text))
    serializer = IssueWriteSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    issue = serializer.save()
    _link_skills(issue, data)
    issue.knowledge_priority = calculate_priority(
        issue.severity, issue.reusability_score,
        issue.learning_value_score, issue.resolution_confidence,
    )
    issue.save(update_fields=["knowledge_priority"])
    return issue


def _link_skills(issue, data):
    for skill_data in data.get("skills", []) or []:
        name = skill_data.get("name")
        if not name:
            continue
        from apps.issues.models import Skill
        skill, _ = Skill.objects.get_or_create(
            name=name,
            defaults={
                "category": skill_data.get("category", ""),
                "proficiency": skill_data.get("proficiency", 5),
            },
        )
        skill.issues.add(issue)
