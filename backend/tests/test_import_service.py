import pytest
from apps.issues.services.import_service import (
    TemplateError, parse_template, normalize, preview_issue,
    create_issue_from_template,
)


YAML_SAMPLE = """
title: Django admin 403
description: Staff user 403 after login
status: resolved
severity: high
resolution_confidence: confirmed
tags: [django, auth]
"""


def test_parse_yaml():
    data = parse_template(YAML_SAMPLE)
    assert data["title"] == "Django admin 403"


def test_parse_json():
    data = parse_template('{"title": "X"}')
    assert data["title"] == "X"


def test_parse_invalid():
    with pytest.raises(TemplateError):
        parse_template("not: [valid: yaml")


def test_normalize_requires_title():
    with pytest.raises(TemplateError):
        normalize({})


def test_normalize_defaults():
    data = normalize({"title": "X"})
    assert data["status"] == "unresolved"
    assert data["severity"] == "medium"
    assert data["tags"]  # auto-suggested


@pytest.mark.django_db
def test_preview_does_not_persist():
    from apps.issues.models import Issue
    preview_issue(YAML_SAMPLE)
    assert Issue.objects.count() == 0


@pytest.mark.django_db
def test_create_from_template_persists():
    from apps.issues.models import Issue
    issue = create_issue_from_template(YAML_SAMPLE)
    assert Issue.objects.count() == 1
    assert issue.title == "Django admin 403"
    assert issue.knowledge_priority > 0
    assert set(issue.tags.values_list("name", flat=True)) == {"django", "auth"}
