/**
 * Simulate network latency so loading skeletons actually render.
 */
export function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Paginate an array the way DRF PageNumberPagination does.
 */
export function paginate(items, page = 1, pageSize = 20) {
  const total = items.length;
  const start = (page - 1) * pageSize;
  const results = items.slice(start, start + pageSize);
  const baseUrl = "http://localhost:8000/api/issues/";
  const hasNext = start + pageSize < total;
  const hasPrev = start > 0;
  return {
    count: total,
    next: hasNext ? `${baseUrl}?page=${page + 1}` : null,
    previous: hasPrev ? `${baseUrl}?page=${page - 1}` : null,
    results,
  };
}

/**
 * Extract filters from the argument object the hooks pass.
 * The hooks pass a single object with a mix of filters and pagination.
 */
export function applyFilters(items, filters) {
  let out = [...items];

  const q = filters?.q?.toLowerCase?.().trim();
  if (q) {
    out = out.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.id.toLowerCase().includes(q) ||
        it.description?.toLowerCase().includes(q) ||
        it.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const severity = asArray(filters?.severity);
  if (severity.length) out = out.filter((it) => severity.includes(it.severity));

  const status = asArray(filters?.status);
  if (status.length) out = out.filter((it) => status.includes(it.status));

  const tags = asArray(filters?.tags);
  if (tags.length) out = out.filter((it) => tags.every((t) => it.tags.includes(t)));

  const category = filters?.category;
  if (category) out = out.filter((it) => it.category === category);

  return out;
}

export function applySort(items, ordering) {
  if (!ordering) return items;
  const dir = ordering.startsWith("-") ? -1 : 1;
  const key = ordering.replace(/^-/, "");
  return [...items].sort((a, b) => {
    const av = key === "knowledge_priority" ? a.knowledge_priority : a[key];
    const bv = key === "knowledge_priority" ? b.knowledge_priority : b[key];
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}

function asArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}
