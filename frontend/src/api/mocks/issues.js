import { MOCK_ISSUES } from "./data";
import { delay, paginate, applyFilters, applySort } from "./helpers";

export async function mockListIssues(filters = {}) {
  await delay();
  let rows = applyFilters(MOCK_ISSUES, filters);
  rows = applySort(rows, filters.ordering);
  return paginate(rows, filters.page ?? 1, filters.page_size ?? 20);
}

export async function mockGetIssue(id) {
  await delay();
  const issue = MOCK_ISSUES.find((i) => i.id === id);
  if (!issue) {
    const err = new Error("Not found");
    err.status = 404;
    throw err;
  }
  return issue;
}

export async function mockCreateIssue(data) {
  await delay();
  return {
    ...data,
    id: `ISSUE-2026-${String(MOCK_ISSUES.length + 1).padStart(3, "0")}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function mockUpdateIssue(id, data) {
  await delay();
  const existing = MOCK_ISSUES.find((i) => i.id === id) ?? {};
  return { ...existing, ...data, id, updated_at: new Date().toISOString() };
}

export async function mockDeleteIssue(id) {
  await delay();
  return null;
}
