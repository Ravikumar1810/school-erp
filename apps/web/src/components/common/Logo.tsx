// apps/web/src/components/common/Logo.tsx

import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { siteConfig } from "@/config/site";

interface LogoProps {
  href?: string;
  showText?: boolean;
}

export function Logo({
  href = "/",
  showText = true,
}: LogoProps): React.JSX.Element {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
        <GraduationCap className="h-6 w-6 text-primary-foreground" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-foreground">
            {siteConfig.name}
          </span>

          <span className="-mt-1 text-xs text-muted-foreground">
            Smart School Management
          </span>
        </div>
      )}
    </Link>
  );
}