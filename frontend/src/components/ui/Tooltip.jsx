import { useMemo } from "react";

const MOCK = Array.from({ length: 47 }).map((_, i) => {
  const severities = ["critical", "high", "medium", "low"];
  const statuses = [
    "resolved",
    "unresolved",
    "partially_resolved",
    "workaround",
    "investigating",
  ];
  const tagsPool = [
    ["django", "auth", "permissions"],
    ["nginx", "uploads"],
    ["postgres", "performance"],
    ["react", "ssr"],
    ["python", "imports"],
    ["linux", "systemd"],
    ["docker", "networking"],
    ["javascript", "async"],
  ];
  const tagSets = tagsPool[i % tagsPool.length];
  const severity = severities[i % severities.length];
  const status = statuses[i % statuses.length];

  return {
    id: `ISSUE-2026-${String(i + 1).padStart(3, "0")}`,
    title:
      [
        "Django admin 403 after login for staff user",
        "Nginx timeout on large file uploads",
        "PostgreSQL connection pool exhausted under load",
        "React hydration mismatch in SSR",
        "Circular import in Django models",
        "Systemd service fails after reboot",
        "Docker container cannot reach host network",
        "Unhandled promise rejection in async pipeline",
      ][i % 8] + ` (${i + 1})`,
    severity,
    status,
    resolution_confidence: status === "resolved" ? "confirmed" : null,
    priority: +(3 + Math.random() * 7).toFixed(2),
    tags: tagSets,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    updated_at: new Date(Date.now() - i * 43200000).toISOString(),
    root_cause:
      "The user lacked appropriate permissions required by the view layer.",
  };
});

export function useIssues({
  page = 1,
  pageSize = 20,
  filters = {},
  sort = "-knowledge_priority",
}) {
  return useMemo(() => {
    let rows = [...MOCK];

    // Filters
    if (filters.q) {
      const q = filters.q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.tags.some((t) => t.includes(q)),
      );
    }
    if (filters.severity?.length) {
      rows = rows.filter((r) => filters.severity.includes(r.severity));
    }
    if (filters.status?.length) {
      rows = rows.filter((r) => filters.status.includes(r.status));
    }
    if (filters.tags?.length) {
      rows = rows.filter((r) => filters.tags.every((t) => r.tags.includes(t)));
    }

    // Sort
    const dir = sort.startsWith("-") ? -1 : 1;
    const key = sort.replace(/^-/, "");
    rows.sort((a, b) => {
      const av = key === "knowledge_priority" ? a.priority : a[key];
      const bv = key === "knowledge_priority" ? b.priority : b[key];
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });

    const total = rows.length;
    const start = (page - 1) * pageSize;
    const results = rows.slice(start, start + pageSize);

    return { results, total, page, pageSize, isLoading: false };
  }, [page, pageSize, filters, sort]);
}
