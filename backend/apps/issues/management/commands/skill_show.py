from django.core.management.base import BaseCommand
from apps.issues.models import Skill


class Command(BaseCommand):
    help = "Show a skill and its linked issues"

    def add_arguments(self, parser):
        parser.add_argument("name")

    def handle(self, *args, **opts):
        try:
            skill = Skill.objects.get(name__iexact=opts["name"])
        except Skill.DoesNotExist:
            self.stderr.write("Skill not found")
            return

        self.stdout.write(f"{skill.name} ({skill.proficiency}/10)")
        self.stdout.write(f"Category: {skill.category or '—'}")
        self.stdout.write("")
        self.stdout.write("Linked issues:")
        for issue in skill.issues.all()[:20]:
            self.stdout.write(
                f"  {issue.id:<20} {issue.severity:<8} {issue.title[:60]}"
            )
