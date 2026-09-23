from django.core.management.base import BaseCommand
from apps.issues.models import Issue


class Command(BaseCommand):
    help = "Delete an issue"

    def add_arguments(self, parser):
        parser.add_argument("id")

    def handle(self, *args, **opts):
        try:
            issue = Issue.objects.get(pk=opts["id"])
        except Issue.DoesNotExist:
            self.stderr.write("Not found")
            return
        issue.delete()
        self.stdout.write(self.style.SUCCESS(f"Deleted {opts['id']}"))
