import {
  Bug,
  CheckCircle2,
  Clock,
  GraduationCap,
  TrendingUp,
  Flame,
  Hash,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/Card";

const SUMMARY = [
  { label: "Total Issues", value: 47, icon: Bug, tone: "text-primary" },
  {
    label: "Resolved",
    value: 35,
    icon: CheckCircle2,
    tone: "text-status-resolved",
  },
  {
    label: "Unresolved",
    value: 8,
    icon: Clock,
    tone: "text-status-unresolved",
  },
  { label: "Skills", value: 12, icon: GraduationCap, tone: "text-accent" },
];

const SEVERITY_DIST = [
  { label: "Critical", value: 4, tone: "bg-sev-critical" },
  { label: "High", value: 11, tone: "bg-sev-high" },
  { label: "Medium", value: 22, tone: "bg-sev-medium" },
  { label: "Low", value: 10, tone: "bg-sev-low" },
];

const STATUS_DIST = [
  { label: "Resolved", value: 35, tone: "bg-status-resolved" },
  { label: "Partial", value: 4, tone: "bg-status-partial" },
  { label: "Workaround", value: 3, tone: "bg-status-workaround" },
  { label: "Unresolved", value: 5, tone: "bg-status-unresolved" },
];

const TOP_TAGS = [
  { name: "django", count: 14 },
  { name: "python", count: 11 },
  { name: "auth", count: 9 },
  { name: "postgres", count: 8 },
  { name: "permissions", count: 7 },
];

const MONTHLY = [
  { m: "Mar", n: 3 },
  { m: "Apr", n: 5 },
  { m: "May", n: 4 },
  { m: "Jun", n: 7 },
  { m: "Jul", n: 6 },
  { m: "Aug", n: 9 },
  { m: "Sep", n: 8 },
  { m: "Oct", n: 5 },
];

export default function StatsPage() {
  return (
    <>
      <PageHeader
        title="Stats"
        description="Trends, distribution, and growth across your knowledge base."
      />

      {/* Summary tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {SUMMARY.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label}>
            <CardBody className="flex items-center gap-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                <Icon className={`h-5 w-5 ${tone}`} />
              </div>
              <div>
                <div className="text-2xl font-semibold tracking-tight">
                  {value}
                </div>
                <div className="text-xs text-fg-muted">{label}</div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Severity distribution */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-fg-muted" />
            <CardTitle>Severity Distribution</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            <StackedBar data={SEVERITY_DIST} />
            <LegendList data={SEVERITY_DIST} />
          </CardBody>
        </Card>

        {/* Status distribution */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-fg-muted" />
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            <StackedBar data={STATUS_DIST} />
            <LegendList data={STATUS_DIST} />
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly trend */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-fg-muted" />
            <CardTitle>Issues Resolved (Last 8 Months)</CardTitle>
          </CardHeader>
          <CardBody>
            <BarChart data={MONTHLY} />
          </CardBody>
        </Card>

        {/* Top tags */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-fg-muted" />
            <CardTitle>Top Tags</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {TOP_TAGS.map((t) => (
              <div key={t.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-fg-muted">#{t.name}</span>
                  <span className="text-fg-muted">{t.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(t.count / TOP_TAGS[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

/* ── Small chart primitives ───────────────────────────── */

function StackedBar({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex h-3 rounded-full overflow-hidden bg-muted">
      {data.map((d) => (
        <div
          key={d.label}
          className={d.tone}
          style={{ width: `${(d.value / total) * 100}%` }}
          title={`${d.label}: ${d.value}`}
        />
      ))}
    </div>
  );
}

function LegendList({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ul className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs">
      {data.map((d) => (
        <li key={d.label} className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-sm ${d.tone}`} />
          <span className="flex-1 text-fg">{d.label}</span>
          <span className="text-fg-muted">
            {d.value} ({Math.round((d.value / total) * 100)}%)
          </span>
        </li>
      ))}
    </ul>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.n));
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d) => (
        <div key={d.m} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex-1 w-full flex items-end">
            <div
              className="w-full rounded-t bg-primary/80 hover:bg-primary transition-colors"
              style={{ height: `${(d.n / max) * 100}%` }}
              title={`${d.m}: ${d.n}`}
            />
          </div>
          <span className="text-[10px] text-fg-muted">{d.m}</span>
        </div>
      ))}
    </div>
  );
}
