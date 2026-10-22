import type { FitLevel, Hyperforce, OnCore, Pricing } from "@/data/types";

export const fitMeta: Record<FitLevel, { label: string; className: string; rank: number }> = {
  self: { label: "Content layer", className: "bg-yellow-300 text-yellow-950 dark:bg-yellow-400", rank: 0 },
  direct: { label: "Direct overlap", className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200", rank: 1 },
  high: { label: "High fit", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200", rank: 2 },
  medium: { label: "Medium fit", className: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200", rank: 3 },
  low: { label: "Low fit", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", rank: 4 },
  none: { label: "No fit", className: "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500", rank: 5 },
};

export const coreMeta: Record<OnCore, { label: string; short: string; className: string }> = {
  yes: { label: "On core", short: "Core", className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200" },
  hybrid: { label: "Hybrid", short: "Hybrid", className: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200" },
  partial: { label: "Partly on core", short: "Partial", className: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200" },
  no: { label: "Off core", short: "Off core", className: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200" },
};

export const hyperforceLabel: Record<Hyperforce, string> = { yes: "Yes", partial: "Partial", no: "No" };

export const pricingLabel: Record<Pricing, string> = {
  seat: "Seat",
  volume: "Volume",
  consumption: "Consumption",
  quota: "Quota",
  "org-fee": "Org fee",
  "add-on": "Add-on",
  bundled: "Bundled",
  mixed: "Mixed",
};

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
