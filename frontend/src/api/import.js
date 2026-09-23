import { http } from "./client";
import { ENDPOINTS } from "./endpoints";

export const importApi = {
  /**
   * Send raw template text; returns a normalized preview object.
   * payload: { template: string, format?: "yaml" | "json" }
   */
  preview: (payload) => http.post(ENDPOINTS.importPreview, payload),

  /**
   * Confirm the import; creates the issue.
   * payload: { template: string, overrides?: object }
   */
  confirm: (payload) => http.post(ENDPOINTS.importConfirm, payload),
};
