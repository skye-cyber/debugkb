import Badge from "./Badge";

const map = {
  resolved: { tone: "resolved", label: "Resolved" },
  partially_resolved: { tone: "partial", label: "Partial" },
  workaround: { tone: "workaround", label: "Workaround" },
  unresolved: { tone: "unresolved", label: "Unresolved" },
  investigating: { tone: "medium", label: "Investigating" },
};

export default function StatusBadge({ status }) {
  const cfg = map[status?.toLowerCase()] ?? { tone: "neutral", label: status };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}
