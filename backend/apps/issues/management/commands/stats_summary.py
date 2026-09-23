import json
from django.core.management.base import BaseCommand
from apps.issues.services.stats_service import build_summary


class Command(BaseCommand):
    help = "Show dashboard stats"

    def add_arguments(self, parser):
        parser.add_argument("--json", action="store_true")

    def handle(self, *args, **opts):
        summary = build_summary()
        if opts["json"]:
            self.stdout.write(json.dumps(summary, indent=2))
            return
        self.stdout.write(f"Total issues: {summary['total_issues']}")
        self.stdout.write(f"Resolved:     {summary['resolved']}")
        self.stdout.write(f"Unresolved:   {summary['unresolved']}")
        self.stdout.write(f"Skills:       {summary['skills']}")
