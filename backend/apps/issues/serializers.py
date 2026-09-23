from rest_framework import serializers
from .models import (
    Issue, InvestigationStep, Resolution, Lesson, Skill, Source, Tag,
)


# ─── Tags ─────────────────────────────────────────────────────────

class TagSerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(source="issues.count", read_only=True)

    class Meta:
        model = Tag
        fields = ["id", "name", "description", "count"]


class TagNameField(serializers.RelatedField):
    """Accepts a list of tag *names* and creates tags on the fly."""

    def to_internal_value(self, data):
        name = str(data).strip().lower().lstrip("#")
        if not name:
            raise serializers.ValidationError("Tag name cannot be blank")
        tag, _ = Tag.objects.get_or_create(name=name)
        return tag

    def to_representation(self, value):
        return value.name


# ─── Nested children ──────────────────────────────────────────────

class InvestigationStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestigationStep
        fields = [
            "id", "step_order", "hypothesis", "attempt",
            "result", "is_successful", "notes",
        ]
        read_only_fields = ["id"]


class ResolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resolution
        fields = [
            "id", "root_cause", "fix", "verification",
            "code_changes", "confirmed_at",
        ]
        read_only_fields = ["id"]


class LessonSerializer(serializers.ModelSerializer):
    tags = TagNameField(many=True, required=False, read_only=True)

    # Writable
    # tags = serializers.SlugRelatedField(
    #     many=True,
    #     queryset=Tag.objects.all(),
    #     slug_field="name",
    #     required=False,
    # )
    class Meta:
        model = Lesson
        fields = ["id", "title", "description", "category", "tags"]
        read_only_fields = ["id"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["tags"] = list(instance.tags.values_list("name", flat=True))
        return data


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ["id", "title", "source_type", "url", "notes"]
        read_only_fields = ["id"]


class SkillSerializer(serializers.ModelSerializer):
    issues = serializers.IntegerField(source="issues.count", read_only=True)

    class Meta:
        model = Skill
        fields = [
            "id", "name", "category", "proficiency",
            "first_learned_at", "last_updated_at", "issues",
        ]
        read_only_fields = ["id"]


# ─── Issue readers ────────────────────────────────────────────────

class IssueListSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Issue
        fields = [
            "id", "title", "description", "status", "severity",
            "resolution_confidence", "category",
            "knowledge_priority", "reusability_score", "learning_value_score",
            "tags", "encountered_at", "resolved_at",
            "created_at", "updated_at",
        ]

    def get_tags(self, obj):
        return list(obj.tags.values_list("name", flat=True))


class IssueDetailSerializer(IssueListSerializer):
    investigation_steps = InvestigationStepSerializer(many=True, read_only=True)
    resolution = ResolutionSerializer(read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    sources = SourceSerializer(many=True, read_only=True)
    related_issues = serializers.SerializerMethodField()
    environment = serializers.JSONField()

    class Meta(IssueListSerializer.Meta):
        fields = IssueListSerializer.Meta.fields + [
            "environment",
            "investigation_steps",
            "resolution",
            "lessons",
            "skills",
            "sources",
            "related_issues",
        ]

    def get_related_issues(self, obj):
        return [
            {
                "id": r.id,
                "title": r.title,
                "severity": r.severity,
                "status": r.status,
            }
            for r in obj.related_issues.all()
        ]


# ─── Issue writer ─────────────────────────────────────────────────

class IssueWriteSerializer(serializers.ModelSerializer):
    tags = TagNameField(many=True, required=False, read_only=True)
    related_issues = serializers.SlugRelatedField(
        many=True, slug_field="id", queryset=Issue.objects.all(), required=False
    )
    investigation_steps = InvestigationStepSerializer(many=True, required=False)
    resolution = ResolutionSerializer(required=False, allow_null=True)
    lessons = LessonSerializer(many=True, required=False)
    sources = SourceSerializer(many=True, required=False)

    class Meta:
        model = Issue
        fields = [
            "id", "title", "description", "status", "severity",
            "resolution_confidence", "category",
            "reusability_score", "learning_value_score",
            "environment",
            "encountered_at", "resolved_at",
            "tags", "related_issues",
            "investigation_steps", "resolution", "lessons", "sources",
        ]
        read_only_fields = ["id"]

    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        related = validated_data.pop("related_issues", [])
        steps = validated_data.pop("investigation_steps", [])
        resolution = validated_data.pop("resolution", None)
        lessons = validated_data.pop("lessons", [])
        sources = validated_data.pop("sources", [])

        issue = Issue.objects.create(**validated_data)
        issue.tags.set(tags)
        issue.related_issues.set(related)

        self._save_steps(issue, steps)
        self._save_resolution(issue, resolution)
        self._save_lessons(issue, lessons)
        self._save_sources(issue, sources)

        issue.refresh_from_db()
        return issue

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        related = validated_data.pop("related_issues", None)
        steps = validated_data.pop("investigation_steps", None)
        resolution = validated_data.pop("resolution", None)
        lessons = validated_data.pop("lessons", None)
        sources = validated_data.pop("sources", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        if tags is not None:
            instance.tags.set(tags)
        if related is not None:
            instance.related_issues.set(related)
        if steps is not None:
            instance.investigation_steps.all().delete()
            self._save_steps(instance, steps)
        if resolution is not None:
            Resolution.objects.update_or_create(
                issue=instance,
                defaults={
                    "root_cause": resolution.get("root_cause", ""),
                    "fix": resolution.get("fix", ""),
                    "verification": resolution.get("verification", ""),
                    "code_changes": resolution.get("code_changes", ""),
                    "confirmed_at": resolution.get("confirmed_at"),
                },
            )
        if lessons is not None:
            instance.lessons.all().delete()
            self._save_lessons(instance, lessons)
        if sources is not None:
            instance.sources.all().delete()
            self._save_sources(instance, sources)

        instance.refresh_from_db()
        return instance

    # helpers

    def _save_steps(self, issue, steps):
        for i, step in enumerate(steps, start=1):
            step.pop("id", None)
            InvestigationStep.objects.create(
                issue=issue,
                step_order=step.get("step_order") or i,
                **{k: v for k, v in step.items() if k != "step_order"},
            )

    def _save_resolution(self, issue, resolution):
        if not resolution:
            return
        resolution.pop("id", None)
        Resolution.objects.update_or_create(issue=issue, defaults=resolution)

    def _save_lessons(self, issue, lessons):
        for lesson in lessons:
            lesson.pop("id", None)
            tags = lesson.pop("tags", [])
            obj = Lesson.objects.create(issue=issue, **lesson)
            obj.tags.set(tags)

    def _save_sources(self, issue, sources):
        for source in sources:
            source.pop("id", None)
            Source.objects.create(issue=issue, **source)
