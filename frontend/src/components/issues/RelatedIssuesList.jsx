import { Link } from "react-router-dom";
import { ArrowUpRight, Link2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "../ui/Card";
import SeverityBadge from "../ui/SeverityBadge";
import StatusBadge from "../ui/StatusBadge";

export default function RelatedIssuesList({ issues }) {
  if (!issues?.length) return null;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-fg-muted" />
        <CardTitle>Related</CardTitle>
      </CardHeader>
      <CardBody className="p-0">
        <ul className="divide-y divide-border">
          {issues.map((r) => (
            <li key={r.id}>
              <Link
                to={`/issues/${r.id}`}
                className="group flex items-center gap-3 px-1 py-3 hover:bg-muted/40 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-[10.5px] text-fg-muted">
                      {r.id}
                    </span>
                    <SeverityBadge severity={r.severity} />
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs font-medium text-fg group-hover:text-primary transition-colors truncate">
                    {r.title}
                  </p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
