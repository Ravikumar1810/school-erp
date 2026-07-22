import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export function GradientText({
  children,
  className,
}: GradientTextProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}