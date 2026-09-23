from django.contrib import admin
from .models import (
    Issue, InvestigationStep, Resolution, Lesson, Skill, Source, Tag,
)


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = (
        "id", "title", "status", "severity",
        "knowledge_priority", "created_at",
    )
    list_filter = ("status", "severity", "tags")
    search_fields = ("id", "title", "description")
    filter_horizontal = ("tags", "related_issues")
    readonly_fields = ("knowledge_priority", "created_at", "updated_at")


admin.site.register(InvestigationStep)
admin.site.register(Resolution)
admin.site.register(Lesson)
admin.site.register(Skill)
admin.site.register(Source)
admin.site.register(Tag)
