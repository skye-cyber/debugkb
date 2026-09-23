import { useMemo, useState } from "react";
import { Hash, Search, X } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Input from "../components/ui/Input";
import { Card, CardBody } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { cn } from "../utils/cn";
import { useTags } from "../hooks/useTags";

const TAGS = [
    { name: "django", count: 14 },
    { name: "auth", count: 9 },
    { name: "permissions", count: 7 },
    { name: "nginx", count: 6 },
    { name: "uploads", count: 3 },
    { name: "postgres", count: 8 },
    { name: "performance", count: 5 },
    { name: "react", count: 6 },
    { name: "ssr", count: 2 },
    { name: "python", count: 11 },
    { name: "imports", count: 4 },
    { name: "linux", count: 7 },
    { name: "systemd", count: 4 },
    { name: "docker", count: 5 },
    { name: "networking", count: 3 },
    { name: "javascript", count: 6 },
    { name: "async", count: 4 },
];

export default function TagsPage() {
    const { tags, isLoading } = useTags();
    const [q, setQ] = useState("");

    const filtered = useMemo(
        () =>
            tags.filter((t) => t.name.toLowerCase().includes(q.toLowerCase())).sort(
                (a, b) => b.count - a.count,
            ),
        [q],
    );

    const max = useMemo(() => Math.max(...tags.map((t) => t.count)), []);
    //     const max = useMemo(
    //         () => Math.max(1, ...(tags ?? []).map((t) => t.count)),
    //         [tags]
    //     );
    return (
        <>
            <PageHeader
                title="Tags"
                description="Browse all tags. Font size scales with usage."
            />

            <div className="relative mb-6 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
                <Input
                    placeholder="Filter tags…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-9 pr-9"
                />
                {q && (
                    <button
                        onClick={() => setQ("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-fg-muted hover:text-fg hover:bg-muted"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    icon={Hash}
                    title="No tags match"
                    description="Try a different keyword."
                />
            ) : (
                <Card>
                    <CardBody>
                        <div className="flex flex-wrap gap-2">
                            {filtered.map((t) => {
                                const scale = t.count / max;
                                const sizeClass =
                                    scale > 0.8
                                        ? "text-base"
                                        : scale > 0.5
                                            ? "text-sm"
                                            : "text-xs";
                                return (
                                    <button
                                        key={t.name}
                                        className={cn(
                                            "inline-flex items-center gap-1 rounded-lg border border-border",
                                            "bg-surface hover:border-primary/40 hover:bg-primary/5",
                                            "px-3 py-1.5 transition-colors",
                                            sizeClass,
                                        )}
                                    >
                                        <Hash
                                            className={cn(
                                                "shrink-0 opacity-60",
                                                sizeClass === "text-base" ? "h-4 w-4" : "h-3.5 w-3.5",
                                            )}
                                        />
                                        <span className="font-mono">{t.name}</span>
                                        <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] text-fg-muted">
                                            {t.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </CardBody>
                </Card>
            )}
        </>
    );
}
