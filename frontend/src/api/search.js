import { http } from "./client";
import { ENDPOINTS } from "./endpoints";

export const searchApi = {
  query: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.ordering) params.set("ordering", filters.ordering);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.page_size) params.set("page_size", String(filters.page_size));
    for (const s of filters.severity ?? []) params.append("severity", s);
    for (const s of filters.status ?? []) params.append("status", s);
    for (const t of filters.tags ?? []) params.append("tag", t);
    const qs = params.toString();
    return http.get(`${ENDPOINTS.search}${qs ? `?${qs}` : ""}`);
  },
};
