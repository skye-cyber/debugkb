from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField
from django.db import models
from django.utils import timezone


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Issue(models.Model):
    class Status(models.TextChoices):
        UNRESOLVED = "unresolved", "Unresolved"
        INVESTIGATING = "investigating", "Investigating"
        PARTIALLY_RESOLVED = "partially_resolved", "Partially Resolved"
        WORKAROUND = "workaround", "Workaround"
        RESOLVED = "resolved", "Resolved"

    class Severity(models.TextChoices):
        CRITICAL = "critical", "Critical"
        HIGH = "high", "High"
        MEDIUM = "medium", "Medium"
        LOW = "low", "Low"

    class ResolutionConfidence(models.TextChoices):
        CONFIRMED = "confirmed", "Confirmed"
        LIKELY = "likely", "Likely"
        PROBABLE = "probable", "Probable"
        UNCERTAIN = "uncertain", "Uncertain"

    id = models.CharField(max_length=32, primary_key=True, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")

    status = models.CharField(
        max_length=32, choices=Status.choices, default=Status.UNRESOLVED
    )
    severity = models.CharField(
        max_length=32, choices=Severity.choices, default=Severity.MEDIUM
    )
    resolution_confidence = models.CharField(
        max_length=32, choices=ResolutionConfidence.choices, blank=True, null=True
    )
    category = models.CharField(max_length=100, blank=True, default="")

    reusability_score = models.PositiveSmallIntegerField(default=5)
    learning_value_score = models.PositiveSmallIntegerField(default=5)
    knowledge_priority = models.FloatField(default=0.0)

    environment = models.JSONField(default=dict, blank=True)

    encountered_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    tags = models.ManyToManyField(Tag, related_name="issues", blank=True)
    related_issues = models.ManyToManyField(
        "self",
        symmetrical=False,
        related_name="related_to",
        blank=True,
    )

    search_vector = SearchVectorField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            GinIndex(fields=["search_vector"]),
            models.Index(fields=["status", "severity"]),
            models.Index(fields=["-created_at"]),
            models.Index(fields=["-knowledge_priority"]),
        ]

    def __str__(self):
        return f"{self.id} — {self.title}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self._generate_id()
        super().save(*args, **kwargs)

    @classmethod
    def _generate_id(cls):
        year = timezone.now().year
        prefix = f"ISSUE-{year}-"
        last = (
            cls.objects.filter(id__startswith=prefix)
            .order_by("-id")
            .values_list("id", flat=True)
            .first()
        )
        if last:
            try:
                number = int(last.split("-")[-1]) + 1
            except ValueError:
                number = 1
        else:
            number = 1
        return f"{prefix}{number:03d}"


class InvestigationStep(models.Model):
    issue = models.ForeignKey(
        Issue, on_delete=models.CASCADE, related_name="investigation_steps"
    )
    step_order = models.PositiveIntegerField(default=1)
    hypothesis = models.TextField(blank=True, default="")
    attempt = models.TextField()
    result = models.TextField(blank=True, default="")
    is_successful = models.BooleanField(default=False)
    notes = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["step_order"]
        constraints = [
            models.UniqueConstraint(
                fields=["issue", "step_order"], name="uniq_issue_step_order"
            )
        ]

    def __str__(self):
        return f"Step {self.step_order} of {self.issue_id}"


class Resolution(models.Model):
    issue = models.OneToOneField(
        Issue, on_delete=models.CASCADE, related_name="resolution"
    )
    root_cause = models.TextField()
    fix = models.TextField()
    verification = models.TextField(blank=True, default="")
    code_changes = models.TextField(blank=True, default="")
    confirmed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Resolution for {self.issue_id}"


class Lesson(models.Model):
    issue = models.ForeignKey(
        Issue, on_delete=models.CASCADE, related_name="lessons"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100, blank=True, default="")
    tags = models.ManyToManyField(Tag, related_name="lessons", blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title


class Skill(models.Model):
    name = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=100, blank=True, default="")
    proficiency = models.PositiveSmallIntegerField(default=1)
    first_learned_at = models.DateTimeField(null=True, blank=True)
    last_updated_at = models.DateTimeField(null=True, blank=True)
    issues = models.ManyToManyField(Issue, related_name="skills", blank=True)
    lessons = models.ManyToManyField(Lesson, related_name="skills", blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.proficiency}/10)"


class Source(models.Model):
    class SourceType(models.TextChoices):
        DOCUMENTATION = "documentation", "Documentation"
        STACKOVERFLOW = "stackoverflow", "Stack Overflow"
        GITHUB_ISSUE = "github_issue", "GitHub Issue"
        BLOG = "blog", "Blog Post"
        OTHER = "other", "Other"

    issue = models.ForeignKey(
        Issue, on_delete=models.CASCADE, related_name="sources"
    )
    title = models.CharField(max_length=255)
    source_type = models.CharField(
        max_length=32, choices=SourceType.choices, default=SourceType.OTHER
    )
    url = models.URLField(blank=True, default="")
    notes = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title
