import { ArrowDownUp } from "lucide-react";
import Select from "../ui/Select";
import { SORT_OPTIONS } from "../../utils/constants";

export default function IssueSortMenu({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-2">
      <ArrowDownUp className="h-4 w-4 text-fg-muted" />
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-36"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
