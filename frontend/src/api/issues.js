import { http } from "./client";
import { ENDPOINTS } from "./endpoints";

/**
 * Serialize filters into query params.
 * Arrays become repeated keys: ?severity=high&severity=critical
 */
function toParams({ q, severity, status, tags, category, ordering, page, page_size } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (ordering) params.set("ordering", ordering);
  if (page) params.set("page", String(page));
  if (page_size) params.set("page_size", String(page_size));
  for (const s of severity ?? []) params.append("severity", s);
  for (const s of status ?? []) params.append("status", s);
  for (const t of tags ?? []) params.append("tag", t);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const issuesApi = {
  list:   (filters) => http.get(`${ENDPOINTS.issues}${toParams(filters)}`),
  get:    (id)      => http.get(ENDPOINTS.issue(id)),
  create: (data)    => http.post(ENDPOINTS.issues, data),
  update: (id, data) => http.put(ENDPOINTS.issue(id), data),
  patch:  (id, data) => http.patch(ENDPOINTS.issue(id), data),
  remove: (id)      => http.delete(ENDPOINTS.issue(id)),
};
