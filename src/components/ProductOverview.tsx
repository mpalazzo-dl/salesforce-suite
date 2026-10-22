"use client";

import { HelpCircle } from "lucide-react";
import { productParts } from "@/data/components";
import { overviews } from "@/data/overviews";
import { Highlight } from "./ui";

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{children}</h4>
);

/** What it is, who uses it, how it's used, key concepts and discovery questions. */
export function OverviewMain({ id, q = "" }: { id: string; q?: string }) {
  const o = overviews[id];
  if (!o) return null;
  return (
    <div className="space-y-4">
      <section>
        <Heading>What it is</Heading>
        <p className="text-[13px] leading-relaxed text-slate-800 dark:text-slate-200">
          <Highlight text={o.what} query={q} />
        </p>
      </section>
      <section>
        <Heading>Who uses it</Heading>
        <div className="flex flex-wrap gap-1.5">
          {o.users.map((u) => (
            <span key={u} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Highlight text={u} query={q} />
            </span>
          ))}
        </div>
      </section>
      <section>
        <Heading>How it&apos;s used</Heading>
        <ul className="list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-slate-700 marker:text-slate-400 dark:text-slate-300">
          {o.howUsed.map((h) => (
            <li key={h}>
              <Highlight text={h} query={q} />
            </li>
          ))}
        </ul>
      </section>
      <section>
        <Heading>Key concepts</Heading>
        <div className="flex flex-wrap gap-1">
          {o.keyConcepts.map((k) => (
            <code key={k} className="rounded border border-slate-200 px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <Highlight text={k} query={q} />
            </code>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/60 dark:bg-amber-950/20">
        <Heading>Discovery questions</Heading>
        <ul className="space-y-1">
          {o.discovery.map((d) => (
            <li key={d} className="flex gap-1.5 text-[13px] leading-snug text-slate-800 dark:text-slate-200">
              <HelpCircle size={13} className="mt-0.5 shrink-0 text-amber-600" />
              <Highlight text={d} query={q} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** Named tools inside the product (e.g. Business Manager inside B2C Commerce). */
export function PartsList({ id, q = "" }: { id: string; q?: string }) {
  const parts = productParts[id];
  if (!parts?.length) return null;
  return (
    <section>
      <Heading>Parts you&apos;ll hear about</Heading>
      <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
        {parts.map((p) => (
          <div key={p.name} className="px-3 py-2">
            <dt className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
              <Highlight text={p.name} query={q} />
              {p.aka && (
                <span className="ml-1.5 text-[11px] font-normal text-slate-400">
                  aka <Highlight text={p.aka.join(", ")} query={q} />
                </span>
              )}
            </dt>
            <dd className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <Highlight text={p.what} query={q} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
