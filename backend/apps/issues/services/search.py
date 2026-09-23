from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.db.models import Q
from apps.issues.models import Issue


def search_issues(*, q=None, severity=None, status=None, tags=None,
                  category=None, ordering=None):
    qs = Issue.objects.all().prefetch_related("tags")

    if q:
        vector = SearchVector("title", weight="A") + SearchVector(
            "description", weight="B"
        )
        query = SearchQuery(q)
        qs = qs.annotate(rank=SearchRank(vector, query)).filter(
            Q(search_vector=query) | Q(rank__gte=0.05)
        )

    if severity:
        qs = qs.filter(severity__in=severity)
    if status:
        qs = qs.filter(status__in=status)
    if category:
        qs = qs.filter(category__iexact=category)
    if tags:
        for t in tags:
            qs = qs.filter(tags__name=t)
        qs = qs.distinct()

    ordering = ordering or "-knowledge_priority"
    if "rank" in locals() and ordering in (None, "", "relevance"):
        qs = qs.order_by("-rank")
    else:
        qs = qs.order_by(ordering)

    return qs
