"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { productById } from "@/data/products";
import { seedProjects } from "@/data/projects";
import { roadmap, roadmapStatuses, type RoadmapItem, type RoadmapStatus } from "@/data/roadmap";
import { cx } from "@/lib/format";
import { useUI } from "@/store/ui";
import { Segmented } from "./ui";

const tone: Record<RoadmapStatus, { dot: string; pill: string }> = {
  planned: { dot: "bg-slate-400", pill: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  "in-progress": { dot: "bg-sky-500", pill: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300" },
  ga: { dot: "bg-emerald-500", pill: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
};

const roadmapProducts = [...new Set(roadmap.flatMap((r) => r.products))];
// In the seed projects' own order.
const roadmapProjects = seedProjects.map((p) => p.id).filter((id) => roadmap.some((r) => r.projects?.includes(id)));

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
      {!!r.projects?.length && (
        <div className="mt-3 flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Projects</span>
          {r.projects.map((id) => (
            <Link
              key={id}
              href={`/?project=${id}`}
              onClick={() => useUI.getState().openProject(id)}
              title="Open this project's walkthrough on the map"
              className="flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
            >
              <Play size={9} className="opacity-70" />
              {seedProjects.find((p) => p.id === id)?.name ?? id}
            </Link>
          ))}
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; count: number }[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          "h-8 min-w-44 rounded-md border bg-white px-2 text-xs dark:bg-slate-950",
          value
            ? "border-slate-900 font-medium text-slate-900 dark:border-white dark:text-white"
            : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300",
        )}
      >
        <option value="">All {label.toLowerCase()}s</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={!o.count && o.value !== value}>
            {o.label} ({o.count})
          </option>
        ))}
      </select>
    </label>
  );
}

export function RoadmapBoard() {
  const [status, setStatus] = useState<RoadmapStatus | "all">("all");
  const [product, setProduct] = useState("");
  const [project, setProject] = useState("");

  const byProduct = (r: RoadmapItem) => !product || r.products.includes(product);
  const byProject = (r: RoadmapItem) => !project || !!r.projects?.includes(project);
  const byStatus = (r: RoadmapItem) => status === "all" || r.status === status;
  // Next-up items lead their lane.
  const items = roadmap.filter((r) => byProduct(r) && byProject(r)).sort((a, b) => Number(!!b.nextUp) - Number(!!a.nextUp));
  const count = (s: RoadmapStatus) => items.filter((r) => r.status === s).length;
  const shown = items.filter(byStatus).length;
  const active = status !== "all" || !!product || !!project;

  // Each dropdown counts what it would show given the other filters.
  const projectOptions = roadmapProjects.map((id) => ({
    value: id,
    label: seedProjects.find((p) => p.id === id)?.name ?? id,
    count: roadmap.filter((r) => byProduct(r) && byStatus(r) && r.projects?.includes(id)).length,
  }));
  const productOptions = roadmapProducts.map((id) => ({
    value: id,
    label: productById[id]?.name ?? id,
    count: roadmap.filter((r) => byProject(r) && byStatus(r) && r.products.includes(id)).length,
  }));

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Stage</span>
          <Segmented
            className="h-8"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: `All · ${items.length}` },
              ...roadmapStatuses.map((s) => ({ value: s.id, label: `${s.label} · ${count(s.id)}` })),
            ]}
          />
        </div>
        <FilterSelect label="Project" value={project} onChange={setProject} options={projectOptions} />
        <FilterSelect label="Product" value={product} onChange={setProduct} options={productOptions} />
        <div className="ml-auto flex items-center gap-3 self-center text-xs text-slate-500">
          <span>
            Showing {shown} of {roadmap.length}
          </span>
          {active && (
            <button
              type="button"
              onClick={() => {
                setStatus("all");
                setProduct("");
                setProject("");
              }}
              className="rounded-md px-2 py-1 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Clear filters
            </button>
          )}
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
