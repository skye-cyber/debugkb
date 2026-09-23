from django.core.management.base import BaseCommand
from apps.issues.services.search import search_issues


class Command(BaseCommand):
    help = "Search issues"

    def add_arguments(self, parser):
        parser.add_argument("query")
        parser.add_argument("--severity", action="append", default=[])
        parser.add_argument("--status", action="append", default=[])
        parser.add_argument("--tag", action="append", default=[])
        parser.add_argument("--limit", type=int, default=20)

    def handle(self, *args, **opts):
        qs = search_issues(
            q=opts["query"],
            severity=opts["severity"],
            status=opts["status"],
            tags=opts["tag"],
        )[: opts["limit"]]

        if not qs:
            self.stdout.write("No matches.")
            return

        for i in qs:
            self.stdout.write(
                f"{i.id:<20} {i.severity:<8} {i.status:<12} "
                f"{i.knowledge_priority:<6} {i.title[:60]}"
            )
