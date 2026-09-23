import { useState } from "react";
import { cn } from "../../utils/cn";

export default function Tooltip({ content, children, side = "top" }) {
  const [show, setShow] = useState(false);
  const pos = {
    top: "bottom-full mb-1.5 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-1.5 left-1/2 -translate-x-1/2",
    right: "left-full ml-1.5 top-1/2 -translate-y-1/2",
    left: "right-full mr-1.5 top-1/2 -translate-y-1/2",
  }[side];

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-md",
            "bg-fg text-bg px-2 py-1 text-[11px] font-medium",
            "shadow-soft pointer-events-none animate-in",
            pos,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
