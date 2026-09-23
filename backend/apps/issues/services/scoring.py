SEVERITY_MAP = {
    "critical": 10,
    "high": 8,
    "medium": 5,
    "low": 2,
}
CONFIDENCE_MAP = {
    "confirmed": 10,
    "likely": 8,
    "probable": 6,
    "uncertain": 3,
}


def calculate_priority(severity, reusability, learning_value, confidence):
    s = SEVERITY_MAP.get(severity, 5)
    r = int(reusability or 5)
    lv = int(learning_value or 5)
    c = CONFIDENCE_MAP.get(confidence, 5)
    priority = s * 0.25 + r * 0.35 + lv * 0.25 + c * 0.15
    return round(priority, 2)


def apply_priority_to_issue(issue, save=True):
    issue.knowledge_priority = calculate_priority(
        issue.severity,
        issue.reusability_score,
        issue.learning_value_score,
        issue.resolution_confidence,
    )
    if save:
        issue.save(update_fields=["knowledge_priority"])
    return issue.knowledge_priority
