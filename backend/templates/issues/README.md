# Issue Templates

Reference templates for DebugKB issue import and export.

## Files

| File | Purpose |
| --- | --- |
| `issue.template.yaml` | Fully annotated YAML schema reference |
| `issue.template.json` | JSON equivalent |
| `issue.minimal.yaml` | Smallest valid template (only `title`) |
| `issue.example.yaml` | Realistic end-to-end example |
| `ai-prompt.md` | Prompt for LLMs to generate importable issues |

## Workflows

### Manual authoring

1. Copy `issue.minimal.yaml` or `issue.template.yaml`.
2. Fill in fields.
3. Validate: 
```shell
python scripts/validate_template.py my-issue.yaml
```
4. Import: 
```shell
python manage.py issue import my-issue.yaml
```

Or paste into the Import page in the web UI.

### AI-assisted authoring

1. Open `ai-prompt.md` and copy its contents into your LLM.
2. Append your raw notes, transcript, or error log.
3. Copy the returned YAML.
4. Validate and import as above.

### Exporting existing issues
```shell
python scripts/export_issue.py ISSUE-2026-001 > exported.yaml
```

Exported files use the same schema, so they can be re-imported
or shared between DebugKB instances.
