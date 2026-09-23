from pathlib import Path
from django.core.management.base import BaseCommand
from apps.issues.services.import_service import (
    TemplateError, create_issue_from_template,
)


class Command(BaseCommand):
    help = "Import an issue from a YAML/JSON template"

    def add_arguments(self, parser):
        parser.add_argument("path", help="Path to template file or '-' for stdin")

    def handle(self, *args, **opts):
        path = opts["path"]
        if path == "-":
            text = self.stdin.read()
        else:
            text = Path(path).read_text()

        try:
            issue = create_issue_from_template(text)
        except TemplateError as e:
            self.stderr.write(str(e.detail))
            return

        self.stdout.write(self.style.SUCCESS(f"Imported {issue.id} — {issue.title}"))
