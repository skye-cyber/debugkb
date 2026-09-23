import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, X, Plus, Trash2, ChevronDown } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { Card, CardHeader, CardTitle, CardBody } from "../components/ui/Card";
import { SEVERITIES, STATUSES } from "../utils/constants";
import { cn } from "../utils/cn";

const EMPTY = {
  title: "",
  description: "",
  status: "unresolved",
  severity: "medium",
  category: "",
  tags: [],
  environment: [],
  investigation_steps: [],
  resolution: {
    root_cause: "",
    fix: "",
    verification: "",
    code_changes: "",
  },
  lessons: [],
  sources: [],
};

export default function IssueFormPage({ mode = "create" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [tagDraft, setTagDraft] = useState("");

  // In edit mode, load the issue (stub)
  useEffect(() => {
    if (mode === "edit" && id) {
      // fetch(`/api/issues/${id}/`).then(...)
      setForm({ ...EMPTY, title: "Loaded title", status: "resolved" });
    }
  }, [mode, id]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const addTag = (e) => {
    e?.preventDefault();
    const t = tagDraft.trim().toLowerCase().replace(/^#/, "");
    if (t && !form.tags.includes(t)) update({ tags: [...form.tags, t] });
    setTagDraft("");
  };

  const removeTag = (t) =>
    update({ tags: form.tags.filter((x) => x !== t) });

  const handleSubmit = (e) => {
    e.preventDefault();
    // POST or PATCH to /api/issues/
    navigate("/issues");
  };

  const showResolution =
    form.status === "resolved" || form.status === "partially_resolved";

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader
        title={mode === "create" ? "New Issue" : `Edit ${id}`}
        description={
          mode === "create"
            ? "Capture a problem as you encounter it. You can enrich it later."
            : "Update this issue as investigation progresses."
        }
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4" />
              {mode === "create" ? "Create" : "Save"}
            </Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basics */}
          <Card>
            <CardHeader>
              <CardTitle>Basics</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="text-start mb-1.5 block text-xs font-medium text-fg">
                  Title <span className="text-sev-critical">*</span>
                </label>
                <Input
                  required
                  value={form.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Short summary of the problem"
                />
              </div>

              <div>
                <label className="text-start mb-1.5 block text-xs font-medium text-fg">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="What were you trying to do? What went wrong?"
                  rows={4}
                  className={cn(
                    "w-full rounded-lg border border-border bg-surface",
                    "px-3 py-2 text-sm text-fg placeholder:text-fg-muted",
                    "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
                    "resize-y transition-colors"
                  )}
                />
              </div>
            </CardBody>
          </Card>

          {/* Investigation steps */}
          <CollapsibleCard
            title="Investigation Steps"
            defaultOpen={form.investigation_steps.length > 0}
            count={form.investigation_steps.length}
          >
            <StepsEditor
              steps={form.investigation_steps}
              onChange={(steps) => update({ investigation_steps: steps })}
            />
          </CollapsibleCard>

          {/* Resolution */}
          <CollapsibleCard
            title="Resolution"
            defaultOpen={showResolution}
            count={undefined}
          >
            <div className="space-y-4">
              <div>
                <label className="text-start mb-1.5 block text-xs font-medium text-fg">
                  Root cause
                </label>
                <textarea
                  rows={2}
                  value={form.resolution.root_cause}
                  onChange={(e) =>
                    update({
                      resolution: { ...form.resolution, root_cause: e.target.value },
                    })
                  }
                  className={textareaClass}
                />
              </div>
              <div>
                <label className="text-start mb-1.5 block text-xs font-medium text-fg">
                  Fix
                </label>
                <textarea
                  rows={2}
                  value={form.resolution.fix}
                  onChange={(e) =>
                    update({
                      resolution: { ...form.resolution, fix: e.target.value },
                    })
                  }
                  className={textareaClass}
                />
              </div>
              <div>
                <label className="text-start mb-1.5 block text-xs font-medium text-fg">
                  Verification
                </label>
                <textarea
                  rows={2}
                  value={form.resolution.verification}
                  onChange={(e) =>
                    update({
                      resolution: {
                        ...form.resolution,
                        verification: e.target.value,
                      },
                    })
                  }
                  className={textareaClass}
                />
              </div>
            </div>
          </CollapsibleCard>

          {/* Lessons */}
          <CollapsibleCard
            title="Lessons Learned"
            count={form.lessons.length}
          >
            <LessonsEditor
              lessons={form.lessons}
              onChange={(lessons) => update({ lessons })}
            />
          </CollapsibleCard>

          {/* Sources */}
          <CollapsibleCard
            title="Sources"
            count={form.sources.length}
          >
            <SourcesEditor
              sources={form.sources}
              onChange={(sources) => update({ sources })}
            />
          </CollapsibleCard>
        </div>

        {/* Right: meta sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="text-start mb-1.5 block text-xs font-medium text-fg">
                  Status
                </label>
                <Select
                  value={form.status}
                  onChange={(e) => update({ status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-start mb-1.5 block text-xs font-medium text-fg">
                  Severity
                </label>
                <Select
                  value={form.severity}
                  onChange={(e) => update({ severity: e.target.value })}
                >
                  {SEVERITIES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-start mb-1.5 block text-xs font-medium text-fg">
                  Category
                </label>
                <Input
                  value={form.category}
                  onChange={(e) => update({ category: e.target.value })}
                  placeholder="e.g. Django, DevOps"
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {form.tags.length === 0 && (
                  <span className="text-xs text-fg-muted">
                    No tags yet.
                  </span>
                )}
                {form.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-fg"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="text-fg-muted hover:text-fg"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag(e)}
                  placeholder="add tag"
                  className="text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment</CardTitle>
            </CardHeader>
            <CardBody>
              <KeyValueEditor
                pairs={form.environment}
                onChange={(environment) => update({ environment })}
                keyPlaceholder="key"
                valuePlaceholder="value"
              />
            </CardBody>
          </Card>
        </aside>
      </div>
    </form>
  );
}

/* ── Form utilities ───────────────────────────────────── */

const textareaClass = cn(
  "w-full rounded-lg border border-border bg-surface",
  "px-3 py-2 text-sm text-fg placeholder:text-fg-muted",
  "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
  "resize-y transition-colors"
);

function CollapsibleCard({ title, children, defaultOpen = false, count }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 sm:p-5 border-b border-border text-left"
      >
        <span className="inline-flex items-center gap-2">
          <CardTitle>{title}</CardTitle>
          {typeof count === "number" && count > 0 && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-fg-muted">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-fg-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <CardBody className="space-y-4">{children}</CardBody>}
    </Card>
  );
}

function StepsEditor({ steps, onChange }) {
  const add = () =>
    onChange([
      ...steps,
      { hypothesis: "", attempt: "", result: "", is_successful: false },
    ]);

  const update = (i, patch) =>
    onChange(steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const remove = (i) => onChange(steps.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-muted/30 p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-fg-muted">
              Step {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-fg-muted hover:text-sev-critical"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <Input
            placeholder="Hypothesis"
            value={s.hypothesis}
            onChange={(e) => update(i, { hypothesis: e.target.value })}
          />
          <Input
            placeholder="Attempt"
            value={s.attempt}
            onChange={(e) => update(i, { attempt: e.target.value })}
          />
          <Input
            placeholder="Result"
            value={s.result}
            onChange={(e) => update(i, { result: e.target.value })}
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-3.5 w-3.5" />
        Add step
      </Button>
    </div>
  );
}

function LessonsEditor({ lessons, onChange }) {
  const add = () => onChange([...lessons, { title: "", description: "", category: "" }]);
  const update = (i, patch) =>
    onChange(lessons.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const remove = (i) => onChange(lessons.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {lessons.map((l, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-muted/30 p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-fg-muted">
              Lesson {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-fg-muted hover:text-sev-critical"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <Input
            placeholder="Lesson title"
            value={l.title}
            onChange={(e) => update(i, { title: e.target.value })}
          />
          <textarea
            rows={2}
            placeholder="What should be remembered?"
            value={l.description}
            onChange={(e) => update(i, { description: e.target.value })}
            className={textareaClass}
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-3.5 w-3.5" />
        Add lesson
      </Button>
    </div>
  );
}

function SourcesEditor({ sources, onChange }) {
  const add = () => onChange([...sources, { title: "", url: "", notes: "" }]);
  const update = (i, patch) =>
    onChange(sources.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const remove = (i) => onChange(sources.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {sources.map((s, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-muted/30 p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-fg-muted">
              Source {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-fg-muted hover:text-sev-critical"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <Input
            placeholder="Title"
            value={s.title}
            onChange={(e) => update(i, { title: e.target.value })}
          />
          <Input
            placeholder="https://…"
            value={s.url}
            onChange={(e) => update(i, { url: e.target.value })}
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-3.5 w-3.5" />
        Add source
      </Button>
    </div>
  );
}

function KeyValueEditor({
  pairs, onChange, keyPlaceholder = "key", valuePlaceholder = "value",
}) {
  const add = () => onChange([...pairs, { key: "", value: "" }]);
  const update = (i, patch) =>
    onChange(pairs.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const remove = (i) => onChange(pairs.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {pairs.map((p, i) => (
        <div key={i} className="flex gap-2">
          <Input
            placeholder={keyPlaceholder}
            value={p.key}
            onChange={(e) => update(i, { key: e.target.value })}
            className="text-xs"
          />
          <Input
            placeholder={valuePlaceholder}
            value={p.value}
            onChange={(e) => update(i, { value: e.target.value })}
            className="text-xs"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(i)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-3.5 w-3.5" />
        Add
      </Button>
    </div>
  );
}
