import { Link } from "react-router-dom";
import { Flame, ArrowUpRight } from "lucide-react";
import SeverityBadge from "../ui/SeverityBadge";
import StatusBadge from "../ui/StatusBadge";
import TagChip from "../ui/TagChip";

export default function IssueRow({ issue }) {
  return (
    <Link
      to={`/issues/${issue.id}`}
      className="group block px-4 sm:px-5 py-4 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          {/* Meta line */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] text-fg-muted">
              {issue.id}
            </span>
            <SeverityBadge severity={issue.severity} />
            <StatusBadge status={issue.status} />
            <span
              className="inline-flex items-center gap-1 text-[11px] text-fg-muted"
              title="Knowledge priority"
            >
              <Flame className="h-3 w-3" />
              {issue.priority}
            </span>
          </div>

          {/* Title */}
          <h3 className="flex items-start text-sm font-medium text-fg group-hover:text-primary transition-colors line-clamp-1">
            {issue.title}
          </h3>

          {/* Root cause preview */}
          {issue.root_cause && (
            <p className="mt-1 text-xs text-fg-muted line-clamp-1">
              {issue.root_cause}
            </p>
          )}

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {issue.tags.slice(0, 5).map((t) => (
              <TagChip key={t} tag={t} />
            ))}
            {issue.tags.length > 5 && (
              <span className="text-[11px] text-fg-muted">
                +{issue.tags.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Hover arrow */}
        <ArrowUpRight className="h-4 w-4 shrink-0 text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}
