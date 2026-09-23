from django.core.management.base import BaseCommand
from apps.issues.models import Skill


class Command(BaseCommand):
    help = "List skills"

    def add_arguments(self, parser):
        parser.add_argument("--category")

    def handle(self, *args, **opts):
        qs = Skill.objects.all()
        if opts["category"]:
            qs = qs.filter(category__iexact=opts["category"])
        if not qs:
            self.stdout.write("No skills.")
            return
        self.stdout.write(f"{'NAME':<35} {'CATEGORY':<15} {'PROF':<5} ISSUES")
        for s in qs:
            self.stdout.write(
                f"{s.name:<35} {s.category:<15} {s.proficiency:<5} "
                f"{s.issues.count()}"
            )
