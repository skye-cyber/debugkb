import { Link } from "react-router-dom";
import {
  ArrowLeft, Pencil, Trash2, Flame, Calendar, CheckCircle2,
} from "lucide-react";
import Button from "../ui/Button";
import SeverityBadge from "../ui/SeverityBadge";
import StatusBadge from "../ui/StatusBadge";
import TagChip from "../ui/TagChip";
import { formatDate, formatRelative, daysBetween } from "../../utils/format";

export default function IssueHeader({ issue, onDelete }) {
  const duration = daysBetween(issue.encountered_at, issue.resolved_at);

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link
          to="/issues"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted hover:text-fg transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All issues
        </Link>
      </div>

      {/* Meta strip */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-mono text-xs text-fg-muted">{issue.id}</span>
        <SeverityBadge severity={issue.severity} />
        <StatusBadge status={issue.status} />
        {issue.resolution_confidence === "confirmed" && (
          <span className="inline-flex items-center gap-1 text-[11px] text-status-resolved">
            <CheckCircle2 className="h-3 w-3" />
            Confirmed
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-[11px] text-fg-muted">
          <Flame className="h-3 w-3" />
          Priority {issue.knowledge_priority}
        </span>
      </div>

      {/* Title + actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight">
            {issue.title}
          </h1>
          {issue.description && (
            <p className="mt-2 text-sm text-fg-muted max-w-3xl">
              {issue.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            as={Link}
            to={`/issues/${issue.id}/edit`}
            variant="outline"
            size="sm"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label="Delete issue"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tags */}
      {issue.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {issue.tags.map((t) => <TagChip key={t} tag={t} />)}
        </div>
      )}

      {/* Timing strip */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-fg-muted">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          Encountered {formatDate(issue.encountered_at)}
          <span className="opacity-60">({formatRelative(issue.encountered_at)})</span>
        </span>
        {issue.resolved_at && (
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-status-resolved" />
            Resolved {formatDate(issue.resolved_at)}
            {duration && <span className="opacity-60">· {duration}</span>}
          </span>
        )}
      </div>
    </div>
  );
}
