import { useMemo } from "react";

const MOCK = {
  id: "ISSUE-2026-001",
  title: "Django admin 403 after login for staff user",
  description:
    "After deploying the app, staff users could log in successfully but received a 403 Forbidden error when accessing any admin panel URL.",
  status: "resolved",
  severity: "high",
  resolution_confidence: "confirmed",
  category: "Django",
  reusability_score: 8,
  learning_value_score: 7,
  knowledge_priority: 7.85,
  environment: {
    os: "Ubuntu 22.04",
    python: "3.11",
    django: "4.2",
    database: "PostgreSQL 15",
  },
  tags: ["django", "auth", "permissions", "admin"],
  encountered_at: "2026-08-10T14:30:00Z",
  resolved_at: "2026-08-10T16:45:00Z",
  created_at: "2026-08-10T16:50:00Z",
  updated_at: "2026-08-10T16:50:00Z",

  investigation_steps: [
    {
      step_order: 1,
      hypothesis: "CSRF token issue",
      attempt: "Checked CSRF cookies and middleware settings",
      result: "CSRF settings were correct — not the cause",
      is_successful: false,
    },
    {
      step_order: 2,
      hypothesis: "Session authentication failing",
      attempt: "Tested with a simple login-required view",
      result: "Session auth worked, so issue was admin-specific",
      is_successful: false,
    },
    {
      step_order: 3,
      hypothesis: "Admin permission check misconfigured",
      attempt: "Inspected is_staff and is_superuser flags",
      result: "User had is_staff=True but is_superuser=False",
      is_successful: true,
    },
  ],

  resolution: {
    root_cause:
      "The staff user lacked is_superuser, which the admin panel requires for full access. Some admin views require superuser status even for staff users, causing the 403.",
    fix: "Set is_superuser=True for the user, or grant the necessary permissions via a group.",
    verification:
      "Logged in as the user and confirmed the admin panel loads correctly.",
    code_changes: `from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.get(username='staffuser')
u.is_superuser = True
u.save()`,
    confirmed_at: "2026-08-10T16:45:00Z",
  },

  lessons: [
    {
      id: 1,
      title: "Django admin staff vs superuser permissions",
      description:
        "is_staff grants access to the admin index, but many admin views require is_superuser or specific permissions. Always check both flags.",
      category: "django",
      tags: ["permissions", "admin"],
    },
    {
      id: 2,
      title: "Always verify permissions before blaming auth",
      description:
        "When a user is authenticated but gets 403, the issue is authorization, not authentication. Separate these concerns early.",
      category: "debugging",
      tags: ["auth"],
    },
  ],

  skills: [
    { id: 1, name: "Django Authentication & Permissions", category: "Django", proficiency: 7 },
  ],

  sources: [
    {
      id: 1,
      title: "Django admin site documentation",
      source_type: "documentation",
      url: "https://docs.djangoproject.com/en/4.2/ref/contrib/admin/",
      notes: "Clarified the difference between staff and superuser.",
    },
    {
      id: 2,
      title: "Stack Overflow: 403 admin after login",
      source_type: "stackoverflow",
      url: "https://stackoverflow.com/q/example",
      notes: "",
    },
  ],

  related_issues: [
    {
      id: "ISSUE-2025-032",
      title: "Nginx 403 Forbidden on static files",
      severity: "medium",
      status: "resolved",
    },
    {
      id: "ISSUE-2025-014",
      title: "Session not persisting behind reverse proxy",
      severity: "high",
      status: "resolved",
    },
  ],
};

export function useIssue(id) {
  return useMemo(() => {
    // Later: useQuery(["issue", id], () => api.get(`/issues/${id}`))
    return { issue: MOCK, isLoading: false, error: null };
  }, [id]);
}
