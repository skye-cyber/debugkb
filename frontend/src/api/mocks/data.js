const SEVERITIES = ["critical", "high", "medium", "low"];
const STATUSES = ["resolved", "unresolved", "partially_resolved", "workaround", "investigating"];

const TAGS_POOL = [
  ["django", "auth", "permissions"],
  ["nginx", "uploads"],
  ["postgres", "performance"],
  ["react", "ssr"],
  ["python", "imports"],
  ["linux", "systemd"],
  ["docker", "networking"],
  ["javascript", "async"],
];

const TITLES = [
  "Django admin 403 after login for staff user",
  "Nginx timeout on large file uploads",
  "PostgreSQL connection pool exhausted under load",
  "React hydration mismatch in SSR",
  "Circular import in Django models",
  "Systemd service fails after reboot",
  "Docker container cannot reach host network",
  "Unhandled promise rejection in async pipeline",
];

export const MOCK_ISSUES = Array.from({ length: 47 }).map((_, i) => {
  const severity = SEVERITIES[i % SEVERITIES.length];
  const status = STATUSES[i % STATUSES.length];
  const tags = TAGS_POOL[i % TAGS_POOL.length];
  const created = new Date(Date.now() - i * 86_400_000).toISOString();

  return {
    id: `ISSUE-2026-${String(i + 1).padStart(3, "0")}`,
    title: `${TITLES[i % TITLES.length]} (${i + 1})`,
    description:
      "Placeholder description — this is mock data for the smoke test.",
    status,
    severity,
    resolution_confidence: status === "resolved" ? "confirmed" : null,
    category: "General",
    reusability_score: 5,
    learning_value_score: 5,
    knowledge_priority: +(3 + Math.random() * 7).toFixed(2),
    tags,
    environment: {
      os: "Ubuntu 22.04",
      python: "3.11",
      django: "4.2",
    },
    encountered_at: created,
    resolved_at: status === "resolved" ? created : null,
    created_at: created,
    updated_at: created,

    investigation_steps:
      status === "resolved"
        ? [
            {
              step_order: 1,
              hypothesis: "Initial hypothesis",
              attempt: "Tried approach A",
              result: "Did not work",
              is_successful: false,
            },
            {
              step_order: 2,
              hypothesis: "Second hypothesis",
              attempt: "Tried approach B",
              result: "This fixed it",
              is_successful: true,
            },
          ]
        : [],

    resolution:
      status === "resolved"
        ? {
            root_cause: "Mock root cause for ISSUE-" + (i + 1),
            fix: "Mock fix description.",
            verification: "Mock verification — confirmed working.",
            code_changes: "# mock code\nprint('hello')\n",
            confirmed_at: created,
          }
        : null,

    lessons:
      status === "resolved"
        ? [
            {
              id: i + 1,
              title: "Mock lesson",
              description: "Mock lesson description.",
              category: "general",
              tags: [],
            },
          ]
        : [],

    skills: [],
    sources: [],
    related_issues: [],
  };
});

export const MOCK_TAGS = TAGS_POOL.flat().reduce((acc, name) => {
  const existing = acc.find((t) => t.name === name);
  if (existing) existing.count += 1;
  else acc.push({ id: acc.length + 1, name, count: 1, description: "" });
  return acc;
}, []);

export const MOCK_SKILLS = [
  { id: 1, name: "Django Architecture", category: "Django",  proficiency: 8, issues: 12 },
  { id: 2, name: "Python Debugging",    category: "Python",  proficiency: 7, issues: 9  },
  { id: 3, name: "Linux / Kali",        category: "Linux",   proficiency: 6, issues: 7  },
  { id: 4, name: "PostgreSQL",          category: "Database",proficiency: 6, issues: 5  },
  { id: 5, name: "Docker Networking",   category: "DevOps",  proficiency: 5, issues: 4  },
];

export const MOCK_STATS = {
  total_issues: MOCK_ISSUES.length,
  resolved:     MOCK_ISSUES.filter((i) => i.status === "resolved").length,
  unresolved:   MOCK_ISSUES.filter((i) => i.status === "unresolved").length,
  skills:       MOCK_SKILLS.length,
  severity_distribution: [
    { label: "Critical", value: 4 },
    { label: "High",     value: 11 },
    { label: "Medium",   value: 22 },
    { label: "Low",      value: 10 },
  ],
  status_distribution: [
    { label: "Resolved",   value: 35 },
    { label: "Partial",    value: 4 },
    { label: "Workaround", value: 3 },
    { label: "Unresolved", value: 5 },
  ],
  monthly: [
    { m: "Mar", n: 3 }, { m: "Apr", n: 5 }, { m: "May", n: 4 },
    { m: "Jun", n: 7 }, { m: "Jul", n: 6 }, { m: "Aug", n: 9 },
    { m: "Sep", n: 8 }, { m: "Oct", n: 5 },
  ],
};
