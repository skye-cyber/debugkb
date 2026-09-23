import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Upload,
    FileText,
    Check,
    X,
    AlertTriangle,
    Sparkles,
    Hash,
    Info,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardBody } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import SeverityBadge from "../components/ui/SeverityBadge";
import StatusBadge from "../components/ui/StatusBadge";
import TagChip from "../components/ui/TagChip";
import { useImportPreview, useImportConfirm } from "../hooks/useImport";

const SAMPLE = `title: Django admin 403 after login for staff user
description: |
  Staff user could log in but got 403 when accessing admin.
status: Resolved
severity: High
resolution_confidence: Confirmed
tags: [django, auth, permissions]
environment:
  os: Ubuntu 22.04
  python: "3.11"
  django: "4.2"
resolution:
  root_cause: Admin views require superuser or specific permissions.
  fix: Set is_superuser=True for the staff user.
  verification: User confirmed it worked.
`;

export default function ImportPage() {
    const [text, setText] = useState("");
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState([]);
    const fileRef = useRef(null);
    const navigate = useNavigate();
    const previewMutation = useImportPreview();
    const confirmMutation = useImportConfirm();

    const format = useMemo(
        () => (text.trim().startsWith("{") ? "JSON" : "YAML"),
        [text],
    );

    const handlePreview = () => {
        setErrors([]);
        previewMutation.mutate(
            { template: text },
            {
                onSuccess: (data) => setPreview(data),
                onError: (err) => {
                    setPreview(null);
                    setErrors(err.fieldErrors.length ? err.fieldErrors.map((e) => `${e.field}: ${e.message}`) : [err.message]);
                },
            }
        );
    };

    const handleConfirm = () => {
        confirmMutation.mutate(
            { template: text },
            {
                onSuccess: (created) => navigate(`/issues/${created.id}`),
                onError: (err) => setErrors([err.message]),
            }
        );
    };

    const handleFile = async (file) => {
        const content = await file.text();
        setText(content);
        setPreview(null);
        setErrors([]);
    };

    return (
        <>
            <PageHeader
                title="Import Issue"
                description="Paste a YAML or JSON template to create an issue automatically."
                actions={
                    <>
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".yaml,.yml,.json,.txt"
                            className="hidden"
                            onChange={(e) =>
                                e.target.files?.[0] && handleFile(e.target.files[0])
                            }
                        />
                        <Button variant="outline" onClick={() => fileRef.current?.click()}>
                            <Upload className="h-4 w-4" />
                            Choose File
                        </Button>
                    </>
                }
            />

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input */}
                <Card className="flex flex-col overflow-hidden">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="inline-flex items-center gap-2">
                            <FileText className="h-4 w-4 text-fg-muted" />
                            Template
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {text && <Badge tone="primary">{format}</Badge>}
                            {text && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setText("");
                                        setPreview(null);
                                        setErrors([]);
                                    }}
                                >
                                    <X className="h-3.5 w-3.5" /> Clear
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardBody className="p-0 flex-1">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste your YAML or JSON here…"
                            spellCheck={false}
                            className="w-full h-96 lg:h-full min-h-[400px] resize-none bg-transparent font-mono text-xs text-fg placeholder:text-fg-muted p-4 focus:outline-none"
                        />
                    </CardBody>

                    <div className="border-t border-border p-3 flex items-center justify-between gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setText(SAMPLE)}>
                            <Sparkles className="h-3.5 w-3.5" />
                            Load sample
                        </Button>
                        <Button onClick={handlePreview} disabled={!text.trim()}>
                            <Sparkles className="h-4 w-4" />
                            Preview
                        </Button>
                    </div>
                </Card>

                {/* Preview */}
                <Card className="flex flex-col overflow-hidden">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="inline-flex items-center gap-2">
                            <Check className="h-4 w-4 text-fg-muted" />
                            Preview
                        </CardTitle>
                        {preview && <Badge tone="resolved">Ready</Badge>}
                    </CardHeader>

                    <CardBody className="flex-1">
                        {errors.length > 0 && (
                            <div className="mb-4 rounded-lg border border-sev-critical/30 bg-sev-critical/5 p-3">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 text-sev-critical shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-sev-critical">
                                            Cannot import
                                        </p>
                                        <ul className="mt-1 text-xs text-sev-critical/90 list-disc list-inside">
                                            {errors.map((e, i) => (
                                                <li key={i}>{e}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!preview && errors.length === 0 && (
                            <div className="h-full grid place-items-center py-12 text-center">
                                <div>
                                    <Info className="mx-auto h-8 w-8 text-fg-muted" />
                                    <p className="mt-3 text-sm font-medium">Nothing to preview</p>
                                    <p className="mt-1 text-xs text-fg-muted">
                                        Paste a template and click Preview.
                                    </p>
                                </div>
                            </div>
                        )}

                        {preview && <PreviewCard issue={preview} />}
                    </CardBody>

                    {preview && (
                        <div className="border-t border-border p-3 flex items-center justify-end gap-2">
                            <Button variant="ghost" onClick={() => setPreview(null)}>
                                Cancel
                            </Button>
                            <Button onClick={handleConfirm}>
                                <Check className="h-4 w-4" />
                                Confirm import
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}

/* ── Preview renderer ─────────────────────────────────── */

function PreviewCard({ issue }) {
    return (
        <div className="space-y-4">
            <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-[11px] text-fg-muted">
                        {issue.id}
                    </span>
                    <SeverityBadge severity={issue.severity} />
                    <StatusBadge status={issue.status} />
                </div>
                <h3 className="text-sm font-semibold">{issue.title}</h3>
                {issue.description && (
                    <p className="mt-1 text-xs text-fg-muted">{issue.description}</p>
                )}
            </div>

            {issue.tags?.length > 0 && (
                <div>
                    <h4 className="mb-1.5 text-[11px] uppercase tracking-wide text-fg-muted">
                        Tags
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {issue.tags.map((t) => (
                            <TagChip key={t} tag={t} />
                        ))}
                    </div>
                </div>
            )}

            {issue.environment && Object.keys(issue.environment).length > 0 && (
                <div>
                    <h4 className="mb-1.5 text-[11px] uppercase tracking-wide text-fg-muted">
                        Environment
                    </h4>
                    <div className="rounded-lg border border-border bg-muted/40 p-3">
                        <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-xs">
                            {Object.entries(issue.environment).map(([k, v]) => (
                                <div key={k} className="contents">
                                    <dt className="font-mono text-fg-muted">{k}</dt>
                                    <dd className="font-mono">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            )}

            {issue.resolution && (
                <div>
                    <h4 className="mb-1.5 text-[11px] uppercase tracking-wide text-fg-muted">
                        Resolution
                    </h4>
                    <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-2 text-xs">
                        {issue.resolution.root_cause && (
                            <div>
                                <span className="font-semibold text-fg">Root cause: </span>
                                <span className="text-fg-muted">
                                    {issue.resolution.root_cause}
                                </span>
                            </div>
                        )}
                        {issue.resolution.fix && (
                            <div>
                                <span className="font-semibold text-fg">Fix: </span>
                                <span className="text-fg-muted">{issue.resolution.fix}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Placeholder parsing (backend will replace this) ──── */

function simulateParse(text) {
    const isJson = text.trim().startsWith("{");
    let data;
    if (isJson) data = JSON.parse(text);
    else {
        // naive YAML parse for the sample only
        data = {};
        for (const line of text.split("\n")) {
            const m = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
            if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, "");
        }
        if (text.includes("tags:")) {
            const tags = text.match(/tags:\s*\[([^\]]+)\]/);
            if (tags) data.tags = tags[1].split(",").map((s) => s.trim());
        }
    }
    return {
        id: "ISSUE-PREVIEW-001",
        title: data.title,
        description: data.description,
        severity: (data.severity || "medium").toLowerCase(),
        status: (data.status || "unresolved").toLowerCase(),
        tags: data.tags || ["imported"],
        environment: data.environment || {},
        resolution: data.resolution,
    };
}
