import re
from apps.issues.models import Tag

STOPWORDS = {
    "the", "a", "an", "and", "or", "in", "on", "of", "for", "with",
    "to", "from", "by", "is", "are", "was", "were", "be", "been",
    "when", "after", "before", "during", "not", "no", "error", "issue",
}


def get_or_create_tag(name):
    name = str(name).strip().lower().lstrip("#")
    if not name:
        return None
    tag, _ = Tag.objects.get_or_create(name=name)
    return tag


def suggest_tags(text, limit=6):
    """Very lightweight keyword suggestion — improve later."""
    words = re.findall(r"[a-zA-Z][a-zA-Z0-9_\-]{2,}", (text or "").lower())
    seen = []
    for w in words:
        if w in STOPWORDS:
            continue
        if w not in seen:
            seen.append(w)
        if len(seen) >= limit:
            break
    return seen
