from django.core.management.base import BaseCommand
from apps.issues.models import Issue
from apps.issues.serializers import IssueDetailSerializer
import json


class Command(BaseCommand):
    help = "Show a single issue in full detail"

    def add_arguments(self, parser):
        parser.add_argument("id")
        parser.add_argument("--json", action="store_true")

    def handle(self, *args, **opts):
        try:
            issue = Issue.objects.get(pk=opts["id"])
        except Issue.DoesNotExist:
            self.stderr.write(f"Issue {opts['id']} not found")
            return
        data = IssueDetailSerializer(issue).data
        if opts["json"]:
            self.stdout.write(json.dumps(data, indent=2, default=str))
            return

        self.stdout.write(f"{data['id']}  {data['title']}")
        self.stdout.write(f"Status: {data['status']}  Severity: {data['severity']}")
        self.stdout.write(f"Priority: {data['knowledge_priority']}")
        self.stdout.write(f"Tags: {', '.join(data['tags']) or '—'}")
        if data.get("resolution"):
            self.stdout.write("")
            self.stdout.write("Resolution:")
            self.stdout.write(f"  Root cause: {data['resolution']['root_cause']}")
            self.stdout.write(f"  Fix: {data['resolution']['fix']}")
