from django.core.management.base import BaseCommand
from apps.issues.models import Issue
from apps.issues.services.tag_service import get_or_create_tag


class Command(BaseCommand):
    help = "Add or remove tags on an issue"

    def add_arguments(self, parser):
        parser.add_argument("id")
        parser.add_argument("--add", action="append", default=[])
        parser.add_argument("--remove", action="append", default=[])
        parser.add_argument("--list", action="store_true")

    def handle(self, *args, **opts):
        try:
            issue = Issue.objects.get(pk=opts["id"])
        except Issue.DoesNotExist:
            self.stderr.write(f"Issue {opts['id']} not found")
            return

        if opts["list"]:
            self.stdout.write(", ".join(issue.tags.values_list("name", flat=True)))
            return

        for name in opts["add"]:
            tag = get_or_create_tag(name)
            if tag:
                issue.tags.add(tag)

        for name in opts["remove"]:
            issue.tags.remove(name.lower())

        names = ", ".join(issue.tags.values_list("name", flat=True))
        self.stdout.write(self.style.SUCCESS(f"Tags on {issue.id}: {names}"))
