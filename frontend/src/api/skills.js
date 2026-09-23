import { http } from "./client";
import { ENDPOINTS } from "./endpoints";

export const skillsApi = {
  list:        ()   => http.get(ENDPOINTS.skills),
  get:         (id) => http.get(ENDPOINTS.skill(id)),
  listIssues:  (id) => http.get(ENDPOINTS.skillIssues(id)),
};
