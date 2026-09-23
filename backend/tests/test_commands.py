import io
from pathlib import Path
import pytest
from django.core.management import call_command
from apps.issues.models import Issue


@pytest.mark.django_db
def test_issue_create_command():
    out = io.StringIO()
    call_command(
        "issue_create",
        "--title", "Command test",
        "--severity", "high",
        "--tags", "a,b",
        stdout=out,
    )
    assert Issue.objects.count() == 1
    issue = Issue.objects.first()
    assert issue.title == "Command test"
    assert issue.severity == "high"
    assert set(issue.tags.values_list("name", flat=True)) == {"a", "b"}


@pytest.mark.django_db
def test_issue_list_command(issue):
    out = io.StringIO()
    call_command("issue_list", stdout=out)
    assert issue.id in out.getvalue()


@pytest.mark.django_db
def test_issue_show_command(issue):
    out = io.StringIO()
    call_command("issue_show", issue.id, stdout=out)
    assert issue.title in out.getvalue()


@pytest.mark.django_db
def test_issue_resolve_command():
    from apps.issues.models import Resolution
    i = Issue.objects.create(title="X")
    call_command(
        "issue_resolve", i.id,
        "--root-cause", "rc",
        "--fix", "the fix",
        "--verification", "ok",
    )
    i.refresh_from_db()
    assert i.status == "resolved"
    assert Resolution.objects.filter(issue=i).exists()


@pytest.mark.django_db
def test_issue_import_command(tmp_path):
    p = tmp_path / "t.yaml"
    p.write_text("title: Imported\nseverity: medium\n")
    call_command("issue_import", str(p))
    assert Issue.objects.filter(title="Imported").exists()


@pytest.mark.django_db
def test_stats_summary_command():
    out = io.StringIO()
    call_command("stats_summary", stdout=out)
    assert "Total issues" in out.getvalue()
