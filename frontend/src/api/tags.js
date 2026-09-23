import { http } from "./client";
import { ENDPOINTS } from "./endpoints";

export const tagsApi = {
  list:   ()        => http.get(ENDPOINTS.tags),
  create: (data)    => http.post(ENDPOINTS.tags, data),
  remove: (id)      => http.delete(ENDPOINTS.tag(id)),
};
