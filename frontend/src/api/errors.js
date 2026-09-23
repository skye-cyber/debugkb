export class ApiError extends Error {
  constructor(message, { status, code, details, url } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;   // field-level errors from DRF
    this.url = url;
  }

  get isValidation() {
    return this.status === 400;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isAuth() {
    return this.status === 401 || this.status === 403;
  }

  get isServer() {
    return this.status >= 500;
  }

  get isNetwork() {
    return this.status == null;
  }

  /**
   * Flatten DRF field errors into a list of { field, message }.
   */
  get fieldErrors() {
    if (!this.details || typeof this.details !== "object") return [];
    const out = [];
    for (const [field, value] of Object.entries(this.details)) {
      if (Array.isArray(value)) {
        for (const msg of value) out.push({ field, message: String(msg) });
      } else if (typeof value === "string") {
        out.push({ field, message: value });
      } else if (value && typeof value === "object") {
        out.push({ field, message: JSON.stringify(value) });
      }
    }
    return out;
  }
}

export function normalizeError(err) {
  // Axios error
  if (err?.isAxiosError) {
    const { response, request, config, message } = err;

    if (response) {
      const data = response.data ?? {};
      const detail =
        data.detail ||
        data.message ||
        (typeof data === "string" ? data : null);

      return new ApiError(
        detail || `Request failed (${response.status})`,
        {
          status: response.status,
          code: data.code,
          details: data,
          url: config?.url,
        }
      );
    }

    if (request) {
      return new ApiError("No response from server. Is the backend running?", {
        status: null,
        url: config?.url,
      });
    }

    return new ApiError(message || "Request setup failed", {
      status: null,
      url: config?.url,
    });
  }

  // Already normalized or unknown
  if (err instanceof ApiError) return err;
  return new ApiError(err?.message ?? "Unknown error");
}
