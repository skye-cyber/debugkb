import pytest
from apps.issues.models import Issue


@pytest.fixture
def issue(db):
    return Issue.objects.create(
        title="Django admin 403",
        description="Staff user 403 after login",
        status=Issue.Status.RESOLVED,
        severity=Issue.Severity.HIGH,
        resolution_confidence=Issue.ResolutionConfidence.CONFIRMED,
    )
