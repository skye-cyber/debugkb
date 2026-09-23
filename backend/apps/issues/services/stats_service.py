from collections import Counter
from datetime import timedelta
from django.db.models import Count
from django.utils import timezone
from apps.issues.models import Issue, Skill, Tag


def build_summary():
    total = Issue.objects.count()
    resolved = Issue.objects.filter(status=Issue.Status.RESOLVED).count()
    unresolved = Issue.objects.filter(status=Issue.Status.UNRESOLVED).count()

    severity_counts = Counter(
        Issue.objects.values_list("severity", flat=True)
    )
    status_counts = Counter(
        Issue.objects.values_list("status", flat=True)
    )

    severity_labels = {
        "critical": "Critical", "high": "High",
        "medium": "Medium", "low": "Low",
    }
    status_labels = {
        "resolved": "Resolved", "partially_resolved": "Partial",
        "workaround": "Workaround", "unresolved": "Unresolved",
        "investigating": "Investigating",
    }

    severity_dist = [
        {"label": severity_labels[k], "value": v}
        for k, v in severity_counts.items() if k in severity_labels
    ]
    status_dist = [
        {"label": status_labels[k], "value": v}
        for k, v in status_counts.items() if k in status_labels
    ]

    # Monthly resolved counts (last 8 months)
    now = timezone.now()
    monthly = []
    for i in range(7, -1, -1):
        d = (now.replace(day=1) - timedelta(days=i * 30)).replace(day=1)
        next_month = (d.replace(day=28) + timedelta(days=4)).replace(day=1)
        count = Issue.objects.filter(
            status=Issue.Status.RESOLVED,
            resolved_at__gte=d,
            resolved_at__lt=next_month,
        ).count()
        monthly.append({"m": d.strftime("%b"), "n": count})

    top_tags = list(
        Tag.objects.annotate(count=Count("issues"))
        .order_by("-count")
        .values("name", "count")[:10]
    )

    return {
        "total_issues": total,
        "resolved": resolved,
        "unresolved": unresolved,
        "skills": Skill.objects.count(),
        "severity_distribution": severity_dist,
        "status_distribution": status_dist,
        "monthly": monthly,
        "top_tags": top_tags,
    }
