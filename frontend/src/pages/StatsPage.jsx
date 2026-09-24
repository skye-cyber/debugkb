import { useMemo } from "react";
import {
    Bug, CheckCircle2, Clock, GraduationCap, TrendingUp, Flame, Hash,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/Card";
import { useStats } from "../hooks/useStats";

const TONE_MAP = {
    Critical: "bg-sev-critical",
    High: "bg-sev-high",
    Medium: "bg-sev-medium",
    Low: "bg-sev-low",
    Resolved: "bg-status-resolved",
    Partial: "bg-status-partial",
    Workaround: "bg-status-workaround",
    Unresolved: "bg-status-unresolved",
};

export default function StatsPage() {
    const { stats, isLoading } = useStats();

    const summary = useMemo(
        () => [
            { label: "Total Issues", value: stats?.total_issues ?? 0, icon: Bug, tone: "text-primary" },
            { label: "Resolved", value: stats?.resolved ?? 0, icon: CheckCircle2, tone: "text-status-resolved" },
            { label: "Unresolved", value: stats?.unresolved ?? 0, icon: Clock, tone: "text-status-unresolved" },
            { label: "Skills", value: stats?.skills ?? 0, icon: GraduationCap, tone: "text-accent" },
        ],
        [stats]
    );

    const severityDist = stats?.severity_distribution?.map((d) => ({
        ...d,
        tone: TONE_MAP[d.label] ?? "bg-muted",
    })) ?? [];

    const statusDist = stats?.status_distribution?.map((d) => ({
        ...d,
        tone: TONE_MAP[d.label] ?? "bg-muted",
    })) ?? [];

    const monthly = stats?.monthly ?? [];

    // (keep TOP_TAGS hard-coded for now — backend will provide it later)

    return (
        <>
            <PageHeader
                title="Stats"
                description="Trends, distribution, and growth across your knowledge base."
            />

            {/* Summary tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {summary.map(({ label, value, icon: Icon, tone }) => (
                    <Card key={label}>
                        <CardBody className="flex items-center gap-4">
                            <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                                <Icon className={`h-5 w-5 ${tone}`} />
                            </div>
                            <div>
                                <div className="text-2xl font-semibold tracking-tight">
                                    {isLoading ? "—" : value}
                                </div>
                                <div className="text-xs text-fg-muted">{label}</div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-fg-muted" />
                        <CardTitle>Severity Distribution</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        <StackedBar data={severityDist} />
                        <LegendList data={severityDist} />
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-fg-muted" />
                        <CardTitle>Status Distribution</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        <StackedBar data={statusDist} />
                        <LegendList data={statusDist} />
                    </CardBody>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-fg-muted" />
                        <CardTitle>Issues Resolved (Last 8 Months)</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <BarChart data={monthly} />
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-fg-muted" />
                        <CardTitle>Top Tags</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        {[
                            { name: "django", count: 14 },
                            { name: "python", count: 11 },
                            { name: "auth", count: 9 },
                            { name: "postgres", count: 8 },
                            { name: "permissions", count: 7 },
                        ].map((t) => (
                            <div key={t.name}>
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="font-mono text-fg-muted">#{t.name}</span>
                                    <span className="text-fg-muted">{t.count}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${(t.count / 14) * 100}%` }}
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
