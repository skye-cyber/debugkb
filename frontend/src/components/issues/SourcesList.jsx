import { ExternalLink, BookOpen, Code2, MessageSquare, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "../ui/Card";

const ICONS = {
  documentation: BookOpen,
  stackoverflow: MessageSquare,
  github_issue: Code2,
  blog: FileText,
  other: FileText,
};

export default function SourcesList({ sources }) {
  if (!sources?.length) return null;

  return (
    <Card>
      <CardHeader className="flex items-start justify-between">
        <CardTitle>Sources</CardTitle>
        <span className="text-[11px] text-fg-muted">{sources.length}</span>
      </CardHeader>
      <CardBody className="p-0">
        <ul className="divide-y divide-border">
          {sources.map((s) => {
            const Icon = ICONS[s.source_type] ?? FileText;
            return (
              <li key={s.id}>
                <a
                  href={s.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-3 px-1 py-3 hover:bg-muted/40 transition-colors"
                >
                  <Icon className="h-4 w-4 mt-0.5 shrink-0 text-fg-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-fg group-hover:text-primary transition-colors truncate">
                        {s.title}
                      </span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-fg-muted opacity-0 group-hover:opacity-100" />
                    </div>
                    {s.notes && (
                      <p className="text-start mt-0.5 text-xs text-fg-muted">{s.notes}</p>
                    )}
                    {s.url && (
                      <p className="mt-0.5 font-mono text-[10.5px] text-fg-muted truncate">
                        {s.url}
                      </p>
                    )}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
}
