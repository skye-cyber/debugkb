import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Upload, Search, X } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import IssueRow from "../components/issues/IssueRow";
import IssueFilters from "../components/issues/IssueFilters";
import IssueSortMenu from "../components/issues/IssueSortMenu";
import IssueListSkeleton from "../components/issues/IssueListSkeleton";
import { useIssues } from "../hooks/useIssues";
import { cn } from "../utils/cn";

const PAGE_SIZE = 20;

const DEFAULT_FILTERS = {
  q: "",
  severity: [],
  status: [],
  tags: [],
};

export default function IssuesListPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("-knowledge_priority");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Reset page when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  const { results, total, isLoading } = useIssues({
    page,
    pageSize: PAGE_SIZE,
    filters,
    sort,
  });

  // Derive available tags from mock data (later from an API call)
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
        "javascript",
        "async",
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
        title="Issues"
        description={`${total} issue${total === 1 ? "" : "s"} in the knowledge base`}
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

      {/* Search + sort toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <Input
            placeholder="Search by title, ID, or tag…"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="pl-9 pr-9"
          />
          {filters.q && (
            <button
              onClick={() => setFilters({ ...filters, q: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-fg-muted hover:text-fg hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setFiltersOpen((v) => !v)}
            className="lg:hidden"
          >
            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
          </Button>
          <IssueSortMenu value={sort} onChange={setSort} />
        </div>
      </div>

      {/* Layout: sidebar + list */}
      <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-6">
        {/* Filters sidebar */}
        <IssueFilters
          filters={filters}
          onChange={setFilters}
          availableTags={availableTags}
          className={cn("lg:block", filtersOpen ? "block" : "hidden")}
        />

        {/* Results */}
        <Card className="overflow-hidden">
          {isLoading ? (
            <IssueListSkeleton />
          ) : results.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No issues match your filters"
              description="Try adjusting the search query or clearing filters."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters(DEFAULT_FILTERS);
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <ul className="divide-y divide-border">
                {results.map((issue) => (
                  <li key={issue.id}>
                    <IssueRow issue={issue} />
                  </li>
                ))}
              </ul>

              <div className="border-t border-border px-4 sm:px-5 py-3">
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
