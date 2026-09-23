import { CheckCircle2, Target, Wrench, ShieldCheck, Code2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "../ui/Card";
import { cn } from "../../utils/cn";

export default function ResolutionBlock({ resolution }) {
  if (!resolution) return null;

  return (
    <Card className="border-status-resolved/30">
      <CardHeader className="flex items-center gap-2 bg-status-resolved/5">
        <CheckCircle2 className="h-4 w-4 text-status-resolved" />
        <CardTitle>Resolution</CardTitle>
      </CardHeader>
      <CardBody className="space-y-5">
        {resolution.root_cause && (
          <Section
            icon={Target}
            label="Root cause"
            value={resolution.root_cause}
          />
        )}
        {resolution.fix && (
          <Section icon={Wrench} label="Fix" value={resolution.fix} />
        )}
        {resolution.verification && (
          <Section
            icon={ShieldCheck}
            label="Verification"
            value={resolution.verification}
          />
        )}
        {resolution.code_changes && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-fg">
              <Code2 className="h-3.5 w-3.5 text-fg-muted" />
              Code changes
            </div>
            <CodeBlock code={resolution.code_changes} />
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function Section({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-fg">
        <Icon className="h-3.5 w-3.5 text-fg-muted" />
        {label}
      </div>
      <p className="text-sm text-fg-muted whitespace-pre-line leading-relaxed">
        {value}
      </p>
    </div>
  );
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="relative group">
      <pre
        className={cn(
          "overflow-x-auto rounded-lg border border-border bg-muted/40",
          "p-3 text-[11.5px] font-mono text-fg leading-relaxed"
        )}
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className={cn(
          "absolute top-2 right-2 inline-flex items-center gap-1 rounded-md",
          "border border-border bg-surface px-2 py-1 text-[10px] text-fg-muted",
          "opacity-0 group-hover:opacity-100 transition-opacity hover:text-fg"
        )}
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-status-resolved" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" /> Copy
          </>
        )}
      </button>
    </div>
  );
}
