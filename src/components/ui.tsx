"use client";

import { groupById } from "@/data/groups";
import { tagById } from "@/data/tags";
import type { FitLevel, GroupId, OnCore, TagId } from "@/data/types";
import { coreMeta, cx, fitMeta } from "@/lib/format";

export function Pill({ className, children, title }: { className?: string; children: React.ReactNode; title?: string }) {
  return (
    <span title={title} className={cx("inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium", className)}>
      {children}
    </span>
  );
}

export const FitBadge = ({ level }: { level: FitLevel }) => (
  <Pill className={fitMeta[level].className}>{fitMeta[level].label}</Pill>
);

export const CoreBadge = ({ value, note }: { value: OnCore; note?: string }) => (
  <Pill className={coreMeta[value].className} title={note}>
    {coreMeta[value].label}
  </Pill>
);

export function GroupBadge({ id }: { id: GroupId }) {
  const g = groupById[id];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: g.color }} />
      {g.name}
    </span>
  );
}

export function TagChip({
  id,
  active,
  onClick,
  size = "sm",
}: {
  id: TagId;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "xs";
}) {
  const t = tagById[id];
  const cls = cx(
    "rounded-full border font-medium transition-colors",
    size === "sm" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]",
    active
      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
      : "border-slate-300 bg-white text-slate-700 hover:border-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300",
  );
  if (!onClick) return <span className={cls} title={t.description}>{t.label}</span>;
  return (
    <button type="button" className={cls} title={t.description} onClick={onClick} aria-pressed={active}>
      {t.label}
    </button>
  );
}

export function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{children}</h3>
      {right}
    </div>
  );
}

export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-slate-300 p-0.5 dark:border-slate-600">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={cx(
            "rounded px-2 py-0.5 text-xs font-medium",
            o.value === value
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Highlight({ text, query }: { text: string; query: string }) {
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "ig");
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 ? (
          <mark key={i} className="rounded-sm bg-yellow-200 px-0.5 text-inherit dark:bg-yellow-700/60">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
