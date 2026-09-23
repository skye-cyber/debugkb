export const SEVERITIES = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const STATUSES = [
  { value: "unresolved", label: "Unresolved" },
  { value: "investigating", label: "Investigating" },
  { value: "partially_resolved", label: "Partial" },
  { value: "workaround", label: "Workaround" },
  { value: "resolved", label: "Resolved" },
];

export const SORT_OPTIONS = [
  { value: "-knowledge_priority", label: "Priority" },
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "-severity", label: "Severity" },
  { value: "title", label: "Title" },
];
