import pytest
from rest_framework.test import APIClient
from apps.issues.models import Issue


@pytest.fixture
def api():
    return APIClient()


@pytest.mark.django_db
def test_list_issues_pagination(api, issue):
    r = api.get("/api/issues/")
    assert r.status_code == 200
    body = r.json()
    assert set(body.keys()) >= {"count", "next", "previous", "results"}
    assert body["count"] == 1
    assert body["results"][0]["id"] == issue.id


@pytest.mark.django_db
def test_filter_by_severity(api):
    Issue.objects.create(title="A", severity=Issue.Severity.HIGH)
    Issue.objects.create(title="B", severity=Issue.Severity.LOW)
    r = api.get("/api/issues/?severity=high")
    assert r.status_code == 200
    assert r.json()["count"] == 1


@pytest.mark.django_db
def test_create_issue_via_api(api):
    payload = {
        "title": "Django admin 403",
        "status": "resolved",
        "severity": "high",
        "resolution_confidence": "confirmed",
        "tags": ["django", "auth"],
        "investigation_steps": [
            {"step_order": 1, "attempt": "checked", "is_successful": False},
            {"step_order": 2, "attempt": "fixed", "is_successful": True},
        ],
        "resolution": {
            "root_cause": "perms",
            "fix": "set is_superuser",
            "verification": "works",
        },
    }
    r = api.post("/api/issues/", payload, format="json")
    assert r.status_code == 201, r.content
    body = r.json()
    assert body["title"] == "Django admin 403"
    assert set(body["tags"]) == {"django", "auth"}

    detail = api.get(f"/api/issues/{body['id']}/").json()
    assert len(detail["investigation_steps"]) == 2
    assert detail["resolution"]["root_cause"] == "perms"


@pytest.mark.django_db
def test_create_issue_requires_title(api):
    r = api.post("/api/issues/", {"description": "x"}, format="json")
    assert r.status_code == 400
    assert "title" in r.json()


@pytest.mark.django_db
def test_import_preview_and_confirm(api):
    template = (
        "title: Test import\n"
        "severity: high\n"
        "tags: [a, b]\n"
    )
    r = api.post("/api/import/preview/", {"template": template}, format="json")
    assert r.status_code == 200
    assert r.json()["title"] == "Test import"

    r = api.post("/api/import/confirm/", {"template": template}, format="json")
    assert r.status_code == 201
    assert r.json()["title"] == "Test import"
    assert Issue.objects.count() == 1


@pytest.mark.django_db
def test_search_endpoint(api, issue):
    r = api.get("/api/search/?q=django")
    assert r.status_code == 200
    assert r.json()["count"] >= 1


@pytest.mark.django_db
def test_stats_summary(api, issue):
    r = api.get("/api/stats/summary/")
    assert r.status_code == 200
    body = r.json()
    assert "total_issues" in body
    assert "severity_distribution" in body
    assert "status_distribution" in body


@pytest.mark.django_db
def test_tags_endpoint(api, issue):
    issue.tags.create(name="django")
    r = api.get("/api/tags/")
    assert r.status_code == 200
    assert any(t["name"] == "django" for t in r.json())
