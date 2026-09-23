import Badge from "./Badge";

const map = {
  critical: { tone: "critical", label: "Critical" },
  high: { tone: "high", label: "High" },
  medium: { tone: "medium", label: "Medium" },
  low: { tone: "low", label: "Low" },
};

export default function SeverityBadge({ severity }) {
  const cfg = map[severity?.toLowerCase()] ?? {
    tone: "neutral",
    label: severity,
  };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}
