from django.core.management.base import BaseCommand
from apps.issues.models import Issue


class Command(BaseCommand):
    help = "List issues"

    def add_arguments(self, parser):
        parser.add_argument("--status")
        parser.add_argument("--severity")
        parser.add_argument("--limit", type=int, default=20)

    def handle(self, *args, **opts):
        qs = Issue.objects.all()
        if opts["status"]:
            qs = qs.filter(status=opts["status"])
        if opts["severity"]:
            qs = qs.filter(severity=opts["severity"])
        qs = qs[: opts["limit"]]

        if not qs:
            self.stdout.write("No issues found.")
            return

        self.stdout.write(
            f"{'ID':<20} {'SEV':<8} {'STATUS':<12} {'PRIO':<6} TITLE"
        )
        for i in qs:
            self.stdout.write(
                f"{i.id:<20} {i.severity:<8} {i.status:<12} "
                f"{i.knowledge_priority:<6} {i.title[:50]}"
            )
