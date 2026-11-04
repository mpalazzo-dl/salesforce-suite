"use client";

import Link from "next/link";
import { useState } from "react";
import { productById } from "@/data/products";
import { roadmap, roadmapStatuses, type RoadmapItem, type RoadmapStatus } from "@/data/roadmap";
import { cx } from "@/lib/format";
import { Segmented } from "./ui";

const tone: Record<RoadmapStatus, { dot: string; pill: string }> = {
  planned: { dot: "bg-slate-400", pill: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  "in-progress": { dot: "bg-sky-500", pill: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300" },
  ga: { dot: "bg-emerald-500", pill: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
};

const roadmapProducts = [...new Set(roadmap.flatMap((r) => r.products))];

function Card({ r, showStatus }: { r: RoadmapItem; showStatus?: boolean }) {
  const status = roadmapStatuses.find((s) => s.id === r.status)!;
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-center gap-1.5">
        {showStatus && <span className={cx("rounded px-1.5 py-0.5 text-[10px] font-semibold", tone[r.status].pill)}>{status.label}</span>}
        {r.nextUp && (
          <span className="rounded bg-yellow-300 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-950">Next up</span>
        )}
        {r.unconfirmed && (
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800">unconfirmed</span>
        )}
      </div>
      <h3 className="mt-1.5 text-[15px] font-semibold leading-snug">{r.title}</h3>
      {r.timing && <p className="mt-0.5 text-xs font-medium text-slate-500">{r.timing}</p>}
      <p className="mt-2 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{r.what}</p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        {r.impact.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-1">
        {r.products.map((id) => (
          <Link
            key={id}
            href={`/?focus=${id}`}
            className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          >
            {productById[id]?.shortName ?? id}
          </Link>
        ))}
      </div>
    </article>
  );
}

export function RoadmapBoard() {
  const [status, setStatus] = useState<RoadmapStatus | "all">("all");
  const [product, setProduct] = useState<string | null>(null);

  const items = roadmap
    .filter((r) => !product || r.products.includes(product))
    // Next-up items lead their lane.
    .sort((a, b) => Number(!!b.nextUp) - Number(!!a.nextUp));
  const count = (s: RoadmapStatus) => items.filter((r) => r.status === s).length;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: `All ${items.length}` },
            ...roadmapStatuses.map((s) => ({ value: s.id, label: `${s.label} ${count(s.id)}` })),
          ]}
        />
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-xs text-slate-500">Product</span>
          {roadmapProducts.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setProduct(product === id ? null : id)}
              aria-pressed={product === id}
              className={cx(
                "rounded-full border px-2 py-0.5 text-[11px]",
                product === id
                  ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                  : "border-slate-300 text-slate-600 hover:border-slate-500 dark:border-slate-600 dark:text-slate-300",
              )}
            >
              {productById[id]?.shortName ?? id}
            </button>
          ))}
        </div>
      </div>

      {status === "all" ? (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {roadmapStatuses.map((s) => {
            const lane = items.filter((r) => r.status === s.id);
            return (
              <section key={s.id} className="flex flex-col gap-3 rounded-xl bg-slate-100/70 p-3 dark:bg-slate-900/60">
                <div className="px-1">
                  <h2 className="flex items-center gap-2 text-sm font-semibold">
                    <span className={cx("h-2.5 w-2.5 rounded-full", tone[s.id].dot)} />
                    {s.label}
                    <span className="text-xs font-normal text-slate-400">{lane.length}</span>
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">{s.blurb}</p>
                </div>
                {lane.map((r) => (
                  <Card key={r.id} r={r} />
                ))}
                {!lane.length && <p className="rounded-lg border border-dashed border-slate-300 p-4 text-xs text-slate-400 dark:border-slate-700">Nothing here yet.</p>}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-xs text-slate-500">{roadmapStatuses.find((s) => s.id === status)!.blurb}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items
              .filter((r) => r.status === status)
              .map((r) => (
                <Card key={r.id} r={r} showStatus />
              ))}
          </div>
          {!count(status) && <p className="mt-3 text-sm text-slate-400">Nothing matches these filters.</p>}
        </div>
      )}
    </div>
  );
}
