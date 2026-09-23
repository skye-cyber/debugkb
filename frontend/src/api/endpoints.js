const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export const ENDPOINTS = {
  // Issues
  issues:              `${BASE}/issues/`,
  issue:         (id) => `${BASE}/issues/${id}/`,

  // Search
  search:              `${BASE}/search/`,

  // Import
  importPreview:       `${BASE}/import/preview/`,
  importConfirm:       `${BASE}/import/confirm/`,

  // Tags
  tags:                `${BASE}/tags/`,
  tag:           (id) => `${BASE}/tags/${id}/`,

  // Skills
  skills:              `${BASE}/skills/`,
  skill:         (id) => `${BASE}/skills/${id}/`,
  skillIssues:   (id) => `${BASE}/skills/${id}/issues/`,

  // Lessons
  lessons:             `${BASE}/lessons/`,
  lesson:        (id) => `${BASE}/lessons/${id}/`,

  // Stats
  statsSummary:        `${BASE}/stats/summary/`,
};

export const API_BASE = BASE;
