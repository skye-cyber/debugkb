import { GraduationCap, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardBody } from "../ui/Card";
import TagChip from "../ui/TagChip";

export default function LessonsList({ lessons }) {
  if (!lessons?.length) return null;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-fg-muted" />
          <CardTitle>Lessons Learned</CardTitle>
        </div>
        <span className="text-[11px] text-fg-muted">{lessons.length}</span>
      </CardHeader>
      <CardBody className="space-y-4">
        {lessons.map((l) => (
          <div
            key={l.id}
            className="rounded-lg border border-border bg-muted/30 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent/10 text-accent">
                <GraduationCap className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold leading-snug">
                  {l.title}
                </h4>
                <p className="mt-1 text-xs text-fg-muted leading-relaxed">
                  {l.description}
                </p>
                {(l.category || l.tags?.length > 0) && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {l.category && (
                      <span className="text-[10px] uppercase tracking-wide text-fg-muted">
                        {l.category}
                      </span>
                    )}
                    {l.tags?.map((t) => <TagChip key={t} tag={t} />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
