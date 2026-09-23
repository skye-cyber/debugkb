import django_filters
from .models import Issue


class IssueFilter(django_filters.FilterSet):
    severity = django_filters.AllValuesMultipleFilter(field_name="severity")
    status = django_filters.AllValuesMultipleFilter(field_name="status")
    tag = django_filters.CharFilter(field_name="tags__name", lookup_expr="iexact")
    category = django_filters.CharFilter(field_name="category", lookup_expr="iexact")

    class Meta:
        model = Issue
        fields = ["severity", "status", "category", "tag"]
