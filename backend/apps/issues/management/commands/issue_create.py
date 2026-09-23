from django.core.management.base import BaseCommand
from apps.issues.serializers import IssueWriteSerializer
from apps.issues.services.scoring import apply_priority_to_issue


class Command(BaseCommand):
    help = "Create a new issue"

    def add_arguments(self, parser):
        parser.add_argument("--title")
        parser.add_argument("--description", default="")
        parser.add_argument("--status", default="unresolved")
        parser.add_argument("--severity", default="medium")
        parser.add_argument("--tags", help="Comma-separated")
        parser.add_argument("--category", default="")

    def handle(self, *args, **opts):
        title = opts["title"] or input("Title: ").strip()
        if not title:
            self.stderr.write("Title is required")
            return

        payload = {
            "title": title,
            "description": opts["description"],
            "status": opts["status"],
            "severity": opts["severity"],
            "category": opts["category"],
            "tags": [t.strip() for t in (opts["tags"] or "").split(",") if t.strip()],
        }

        serializer = IssueWriteSerializer(data=payload)
        if not serializer.is_valid():
            self.stderr.write(str(serializer.errors))
            return

        issue = serializer.save()
        apply_priority_to_issue(issue)
        self.stdout.write(self.style.SUCCESS(f"Created {issue.id} — {issue.title}"))
