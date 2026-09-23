import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search as SearchIcon,
  X,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import IssueRow from "../components/issues/IssueRow";
import IssueFilters from "../components/issues/IssueFilters";
import IssueSortMenu from "../components/issues/IssueSortMenu";
import { useIssues } from "../hooks/useIssues";
// import { cn } from "../utils/cn";

const DEFAULT_FILTERS = { q: "", severity: [], status: [], tags: [] };

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    q: params.get("q") ?? "",
  });
  const [sort, setSort] = useState("-knowledge_priority");
  const [showFilters, setShowFilters] = useState(false);

  // Sync query string when the search term changes
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (filters.q) next.set("q", filters.q);
    else next.delete("q");
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q]);

  const { results, total, isLoading } = useIssues({
    page: 1,
    pageSize: 30,
    filters,
    sort,
  });

  const availableTags = useMemo(
    () =>
      [
        "django",
        "auth",
        "permissions",
        "nginx",
        "uploads",
        "postgres",
        "performance",
        "react",
        "ssr",
        "python",
        "imports",
        "linux",
        "systemd",
        "docker",
        "networking",
      ].sort(),
    [],
  );

  const activeFilterCount =
    (filters.severity?.length ?? 0) +
    (filters.status?.length ?? 0) +
    (filters.tags?.length ?? 0);

  return (
    <>
      <PageHeader
        title="Search"
        description="Find issues by symptom, error message, tag, or root cause."
      />

      {/* Big search box */}
      <div className="relative mb-5">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-muted" />
        <Input
          autoFocus
          placeholder="e.g. django 403, nginx timeout, postgres pool…"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          className="pl-11 pr-11 h-12 text-base"
        />
        {filters.q && (
          <button
            onClick={() => setFilters({ ...filters, q: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-fg-muted hover:text-fg hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilters((v) => !v)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
          </Button>
          <span className="text-xs text-fg-muted">
            {total} result{total === 1 ? "" : "s"}
          </span>
        </div>
        <IssueSortMenu value={sort} onChange={setSort} />
      </div>

      {/* Filters drawer */}
      {showFilters && (
        <Card className="p-4 sm:p-5 mb-5">
          <IssueFilters
            filters={filters}
            onChange={setFilters}
            availableTags={availableTags}
          />
        </Card>
      )}

      {/* Results */}
      {!filters.q && activeFilterCount === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Start typing to search"
          description="Search across titles, tags, root causes, and fixes. Filters help narrow results."
        />
      ) : results.length === 0 && !isLoading ? (
        <EmptyState
          icon={SearchIcon}
          title="No matching issues"
          description="Try fewer keywords or broaden your filters."
          action={
            <Button
              variant="outline"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Reset
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {results.map((issue) => (
              <li key={issue.id}>
                <IssueRow issue={issue} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
