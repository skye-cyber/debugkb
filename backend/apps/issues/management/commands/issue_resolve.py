from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.issues.models import Issue, Resolution
from apps.issues.services.scoring import apply_priority_to_issue


class Command(BaseCommand):
    help = "Mark an issue as resolved with root cause, fix, and verification"

    def add_arguments(self, parser):
        parser.add_argument("id")
        parser.add_argument("--root-cause")
        parser.add_argument("--fix")
        parser.add_argument("--verification", default="")
        parser.add_argument("--code-changes", default="")
        parser.add_argument(
            "--confidence",
            default="confirmed",
            choices=["confirmed", "likely", "probable", "uncertain"],
        )

    def handle(self, *args, **opts):
        try:
            issue = Issue.objects.get(pk=opts["id"])
        except Issue.DoesNotExist:
            self.stderr.write(f"Issue {opts['id']} not found")
            return

        root_cause = opts["root_cause"] or input("Root cause: ").strip()
        fix = opts["fix"] or input("Fix: ").strip()
        if not root_cause or not fix:
            self.stderr.write("Root cause and fix are required")
            return

        Resolution.objects.update_or_create(
            issue=issue,
            defaults={
                "root_cause": root_cause,
                "fix": fix,
                "verification": opts["verification"],
                "code_changes": opts["code_changes"],
                "confirmed_at": timezone.now(),
            },
        )
        issue.status = Issue.Status.RESOLVED
        issue.resolution_confidence = opts["confidence"]
        issue.resolved_at = timezone.now()
        issue.save(
            update_fields=["status", "resolution_confidence", "resolved_at"]
        )
        apply_priority_to_issue(issue)

        self.stdout.write(self.style.SUCCESS(f"Resolved {issue.id}"))
