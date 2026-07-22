

export const colors = {
  background: "#0B1120",
  surface: "#111827",
  card: "#1F2937",

  primary: "#10B981",
  primaryHover: "#34D399",

  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",

  border: "#334155",

  text: {
    primary: "#FFFFFF",
    secondary: "#CBD5E1",
    muted: "#94A3B8",
  },

  chart: {
    emerald: "#10B981",
    blue: "#3B82F6",
    yellow: "#F59E0B",
    red: "#EF4444",
    purple: "#8B5CF6",
  },
} as const;

export type Colors = typeof colors;