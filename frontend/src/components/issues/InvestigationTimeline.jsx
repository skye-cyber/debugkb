import { Check, X, Lightbulb, Wrench, ClipboardCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "../ui/Card";
import { cn } from "../../utils/cn";

export default function InvestigationTimeline({ steps }) {
  if (!steps?.length) return null;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Investigation</CardTitle>
        <span className="text-[11px] text-fg-muted">
          {steps.length} step{steps.length === 1 ? "" : "s"}
        </span>
      </CardHeader>
      <CardBody className="pt-2">
        <ol className="relative">
          {/* Vertical rail */}
          <span
            className="absolute left-[15px] top-2 bottom-2 w-px bg-border"
            aria-hidden="true"
          />

          {steps.map((s, i) => {
            const ok = s.is_successful;
            return (
              <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Node */}
                <div
                  className={cn(
                    "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2",
                    ok
                      ? "bg-status-resolved/15 border-status-resolved text-status-resolved"
                      : "bg-surface border-border text-fg-muted"
                  )}
                >
                  {ok ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <X className="h-4 w-4" strokeWidth={3} />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono text-fg-muted">
                      Step {s.step_order ?? i + 1}
                    </span>
                    {ok && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-status-resolved">
                        Solution
                      </span>
                    )}
                  </div>

                  {s.hypothesis && (
                    <Row icon={Lightbulb} label="Hypothesis" value={s.hypothesis} />
                  )}
                  <Row icon={Wrench} label="Attempt" value={s.attempt} />
                  {s.result && (
                    <Row
                      icon={ClipboardCheck}
                      label="Result"
                      value={s.result}
                      muted={!ok}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardBody>
    </Card>
  );
}

function Row({ icon: Icon, label, value, muted }) {
  return (
    <div className="flex gap-2.5 mb-1.5 last:mb-0">
      <Icon
        className={cn(
          "h-3.5 w-3.5 mt-0.5 shrink-0",
          muted ? "text-fg-muted/60" : "text-fg-muted"
        )}
      />
      <div className="min-w-0 text-xs">
        <span className="font-semibold text-fg">{label}: </span>
        <span className={muted ? "text-fg-muted" : "text-fg"}>{value}</span>
      </div>
    </div>
  );
}
