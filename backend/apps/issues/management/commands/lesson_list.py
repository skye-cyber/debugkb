from django.core.management.base import BaseCommand
from apps.issues.models import Lesson


class Command(BaseCommand):
    help = "List lessons"

    def add_arguments(self, parser):
        parser.add_argument("--category")
        parser.add_argument("--limit", type=int, default=50)

    def handle(self, *args, **opts):
        qs = Lesson.objects.select_related("issue").all()
        if opts["category"]:
            qs = qs.filter(category__iexact=opts["category"])
        qs = qs[: opts["limit"]]

        if not qs:
            self.stdout.write("No lessons.")
            return

        for lesson in qs:
            self.stdout.write(f"[{lesson.issue_id}] {lesson.title}")
            self.stdout.write(f"    {lesson.description[:100]}")
