import axios from "axios";
import { API_BASE } from "./endpoints";
import { normalizeError } from "./errors";

const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 15000);

export const client = axios.create({
  baseURL: API_BASE,
  timeout: TIMEOUT,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

/* ── Request interceptor ──────────────────────────────── */
client.interceptors.request.use(
  (config) => {
    // Reserved for auth tokens when needed:
    // const token = localStorage.getItem("debugkb.token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response interceptor ─────────────────────────────── */
client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error))
);

/**
 * Convenience wrappers that unwrap `response.data` and
 * normalize errors in one step.
 */
export const http = {
  get:    (url, config)       => client.get(url, config).then((r) => r.data),
  post:   (url, data, config) => client.post(url, data, config).then((r) => r.data),
  put:    (url, data, config) => client.put(url, data, config).then((r) => r.data),
  patch:  (url, data, config) => client.patch(url, data, config).then((r) => r.data),
  delete: (url, config)       => client.delete(url, config).then((r) => r.data),
};
