import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: ReactNode;
  className?: string;
}

export function SectionBadge({
  children,
  className,
}: SectionBadgeProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}