import { delay } from "./helpers";

export async function mockImportPreview({ template }) {
  await delay(400);
  const trimmed = String(template ?? "").trim();
  const isJson = trimmed.startsWith("{");

  let data = {};
  if (isJson) {
    try {
      data = JSON.parse(trimmed);
    } catch (e) {
      const err = new Error("Invalid JSON: " + e.message);
      err.status = 400;
      err.details = { template: [err.message] };
      throw err;
    }
  } else {
    // Very small YAML-ish parse for the sample template only.
    for (const line of trimmed.split("\n")) {
      const m = line.match(/^([a-zA-Z_]+):\s*(.+)$/);
      if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    const tagsMatch = trimmed.match(/tags:\s*\[([^\]]+)\]/);
    if (tagsMatch) {
      data.tags = tagsMatch[1].split(",").map((s) => s.trim());
    }
  }

  if (!data.title) {
    const err = new Error("Validation failed");
    err.status = 400;
    err.details = { title: ["Title is required"] };
    throw err;
  }

  return {
    id: "ISSUE-PREVIEW-001",
    title: data.title,
    description: data.description ?? "",
    severity: (data.severity ?? "medium").toLowerCase(),
    status: (data.status ?? "unresolved").toLowerCase(),
    tags: data.tags ?? ["imported"],
    environment: data.environment ?? {},
    resolution: data.resolution ?? null,
  };
}

export async function mockImportConfirm({ template }) {
  const preview = await mockImportPreview({ template });
  await delay(300);
  return {
    ...preview,
    id: `ISSUE-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
    created_at: new Date().toISOString(),
  };
}
