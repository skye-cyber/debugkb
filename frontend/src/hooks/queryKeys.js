// Query Key Factory
// Centralized keys — invalidations stay consistent.

export const qk = {
  issues: {
    all:      ["issues"],
    list:     (filters) => ["issues", "list", filters],
    detail:   (id)      => ["issues", "detail", id],
  },
  search: {
    all:      ["search"],
    query:    (filters) => ["search", filters],
  },
  tags: {
    all:      ["tags"],
  },
  skills: {
    all:      ["skills"],
    detail:   (id)      => ["skills", "detail", id],
    issues:   (id)      => ["skills", "issues", id],
  },
  stats: {
    summary:  ["stats", "summary"],
  },
  import: {
    preview:  (hash) => ["import", "preview", hash],
  },
};
