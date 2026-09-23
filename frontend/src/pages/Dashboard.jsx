import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Bug, CheckCircle2, Clock, GraduationCap, Plus, Upload, ArrowRight, Flame,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/Card";
import SeverityBadge from "../components/ui/SeverityBadge";
import StatusBadge from "../components/ui/StatusBadge";
import TagChip from "../components/ui/TagChip";
import { useStats } from "../hooks/useStats";
import { useIssues } from "../hooks/useIssues";

export default function Dashboard() {
    const { stats, isLoading: statsLoading } = useStats();
    const { results: recent, isLoading: recentLoading } = useIssues({
        pageSize: 4,
        filters: {},
        sort: "-created_at",
    });

    const summary = useMemo(
        () => [
            {
                label: "Total Issues",
                value: stats?.total_issues ?? 0,
                icon: Bug,
                tone: "text-primary",
            },
            {
                label: "Resolved",
                value: stats?.resolved ?? 0,
                icon: CheckCircle2,
                tone: "text-status-resolved",
            },
            {
                label: "Unresolved",
                value: stats?.unresolved ?? 0,
                icon: Clock,
                tone: "text-status-unresolved",
            },
            {
                label: "Skills",
                value: stats?.skills ?? 0,
                icon: GraduationCap,
                tone: "text-accent",
            },
        ],
        [stats]
    );

    return (
        <>
            <PageHeader
                title="Dashboard"
                description="Your debugging knowledge base at a glance."
                actions={
                    <>
                        <Button as={Link} to="/import" variant="outline">
                            <Upload className="h-4 w-4" />
                            Import
                        </Button>
                        <Button as={Link} to="/issues/new">
                            <Plus className="h-4 w-4" />
                            New Issue
                        </Button>
                    </>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {summary.map(({ label, value, icon: Icon, tone }) => (
                    <Card key={label}>
                        <CardBody className="flex items-center gap-4">
                            <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                                <Icon className={`h-5 w-5 ${tone}`} />
                            </div>
                            <div>
                                <div className="text-2xl font-semibold tracking-tight">
                                    {statsLoading ? "—" : value}
                                </div>
                                <div className="text-xs text-fg-muted">{label}</div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent issues */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Recent Issues</CardTitle>
                        <Link
                            to="/issues"
                            className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                        >
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </CardHeader>

                    {recentLoading ? (
                        <ul className="divide-y divide-border">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <li key={i} className="px-4 sm:px-5 py-4 animate-pulse">
                                    <div className="h-3 w-24 rounded bg-muted mb-2" />
                                    <div className="h-4 w-3/4 rounded bg-muted mb-2" />
                                    <div className="h-3 w-1/2 rounded bg-muted" />
                                </li>
                            ))}
                        </ul>
                    ) : recent.length === 0 ? (
                        <CardBody className="text-sm text-fg-muted">
                            No issues yet. Create your first one.
                        </CardBody>
                    ) : (
                        <ul className="divide-y divide-border">
                            {recent.map((issue) => (
                                <li key={issue.id}>
                                    <Link
                                        to={`/issues/${issue.id}`}
                                        className="block px-4 sm:px-5 py-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="font-mono text-[11px] text-fg-muted">
                                                {issue.id}
                                            </span>
                                            <SeverityBadge severity={issue.severity} />
                                            <StatusBadge status={issue.status} />
                                            <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-fg-muted">
                                                <Flame className="h-3 w-3" />
                                                {issue.knowledge_priority}
                                            </span>
                                        </div>
                                        <div className="text-sm font-medium mb-2 line-clamp-1">
                                            {issue.title}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {issue.tags?.map((t) => (
                                                <TagChip key={t} tag={t} />
                                            ))}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                {/* Quick actions + top skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:block space-y-6 sm:space-x-6 sm:space-y-0 md:space-y-6 md:space-x-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-2">
                            <Button
                                as={Link}
                                to="/issues/new"
                                variant="outline"
                                className="w-full justify-start text-xs"
                            >
                                <Plus className="h-4 w-4" /> Log new issue
                            </Button>
                            <Button
                                as={Link}
                                to="/import"
                                variant="outline"
                                className="w-full justify-start text-xs"
                            >
                                <Upload className="h-4 w-4" /> Import{" "}
                                <span className="hidden md:flex">from</span> template
                            </Button>
                            <Button
                                as={Link}
                                to="/search"
                                variant="outline"
                                className="w-full justify-start text-xs"
                            >
                                <Bug className="h-4 w-4" /> Search issues
                            </Button>
                        </CardBody>
                    </Card>


                    <Card>
                        <CardHeader>
                            <CardTitle>Top Skills</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-3">
                            {[
                                { name: "Django Architecture", p: 8 },
                                { name: "Python Debugging", p: 7 },
                                { name: "Linux / Kali", p: 6 },
                            ].map(({ name, p }) => (
                                <div key={name}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="font-medium">{name}</span>
                                        <span className="text-fg-muted">{p}/10</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all"
                                            style={{ width: `${p * 10}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}
