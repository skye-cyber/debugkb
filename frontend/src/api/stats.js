import { http } from "./client";
import { ENDPOINTS } from "./endpoints";

export const statsApi = {
  summary: () => http.get(ENDPOINTS.statsSummary),
};
