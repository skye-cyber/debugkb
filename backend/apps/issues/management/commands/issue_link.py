from django.core.management.base import BaseCommand
from apps.issues.models import Issue


class Command(BaseCommand):
    help = "Link related issues (bidirectional)"

    def add_arguments(self, parser):
        parser.add_argument("id")
        parser.add_argument("--to", action="append", required=True)
        parser.add_argument("--unlink", action="store_true")

    def handle(self, *args, **opts):
        try:
            issue = Issue.objects.get(pk=opts["id"])
        except Issue.DoesNotExist:
            self.stderr.write(f"Issue {opts['id']} not found")
            return

        for other_id in opts["to"]:
            try:
                other = Issue.objects.get(pk=other_id)
            except Issue.DoesNotExist:
                self.stderr.write(f"Skipping {other_id} (not found)")
                continue

            if opts["unlink"]:
                issue.related_issues.remove(other)
                other.related_issues.remove(issue)
                self.stdout.write(f"Unlinked {issue.id} ↔ {other.id}")
            else:
                issue.related_issues.add(other)
                other.related_issues.add(issue)
                self.stdout.write(f"Linked {issue.id} ↔ {other.id}")
