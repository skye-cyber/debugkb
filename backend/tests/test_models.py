import pytest
from apps.issues.models import Issue


@pytest.mark.django_db
def test_id_generation_sequential():
    a = Issue.objects.create(title="A")
    b = Issue.objects.create(title="B")
    assert a.id.startswith("ISSUE-")
    assert a.id != b.id
    # b should be the next number after a
    assert int(b.id.split("-")[-1]) == int(a.id.split("-")[-1]) + 1


@pytest.mark.django_db
def test_default_status_and_severity():
    issue = Issue.objects.create(title="X")
    assert issue.status == Issue.Status.UNRESOLVED
    assert issue.severity == Issue.Severity.MEDIUM


@pytest.mark.django_db
def test_str_representation(issue):
    assert str(issue).startswith(issue.id)
