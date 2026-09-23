from django.core.management.base import BaseCommand
from apps.issues.models import Issue
from apps.issues.serializers import IssueWriteSerializer


class Command(BaseCommand):
    help = "Edit an existing issue"

    def add_arguments(self, parser):
        parser.add_argument("id")
        parser.add_argument("--title")
        parser.add_argument("--description")
        parser.add_argument("--status")
        parser.add_argument("--severity")
        parser.add_argument("--category")

    def handle(self, *args, **opts):
        try:
            issue = Issue.objects.get(pk=opts["id"])
        except Issue.DoesNotExist:
            self.stderr.write(f"Issue {opts['id']} not found")
            return

        payload = {}
        for field in ("title", "description", "status", "severity", "category"):
            if opts.get(field) is not None:
                payload[field] = opts[field]

        if not payload:
            self.stdout.write("No changes provided.")
            return

        serializer = IssueWriteSerializer(issue, data=payload, partial=True)
        if not serializer.is_valid():
            self.stderr.write(str(serializer.errors))
            return

        serializer.save()
        self.stdout.write(
            self.style.SUCCESS(f"Updated {issue.id} — {issue.title}")
        )
