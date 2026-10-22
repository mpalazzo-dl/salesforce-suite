import type { Metadata } from "next";
import Link from "next/link";
import { groupById } from "@/data/groups";
import { productById } from "@/data/products";
import { layers, surfaces } from "@/data/reference";
import type { GroupId } from "@/data/types";

export const metadata: Metadata = { title: "Platform layers · Salesforce Suite Explorer" };

const apps: GroupId[] = ["crm", "experience", "marketing", "commerce"];

type Band = {
  key: string;
  title: React.ReactNode;
  sub: string;
  arrow: string;
  arrowNote: string;
  tone: string;
};

const ProductLink = ({ id, children }: { id: string; children?: React.ReactNode }) => (
  <Link href={`/?focus=${id}`} className="hover:underline">
    {children ?? productById[id].name}
  </Link>
);

const bands: Band[] = [
  {
    key: "apps",
    title: (
      <div className="flex flex-wrap gap-2">
        {apps.map((g) => (
          <Link
            key={g}
            href={`/?focus=group:${g}`}
            className="rounded-md border-2 bg-white px-2.5 py-1 text-sm font-semibold hover:shadow dark:bg-slate-900"
            style={{ borderColor: groupById[g].color }}
          >
            {groupById[g].name}
          </Link>
        ))}
      </div>
    ),
    sub: "Applications and experiences: portals, storefronts, email, consoles",
    arrow: "delivers",
    arrowNote: "CDA / GraphQL at render or send time",
    tone: "bg-slate-50 dark:bg-slate-900",
  },
  {
    key: "af",
    title: <ProductLink id="agentforce" />,
    sub: "LLM planning loop: authored on core, grounded on Data 360, surfaced in Service, Slack, web and voice",
    arrow: "actions",
    arrowNote: "CMA / MCP read and write",
    tone: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    key: "core-d360",
    title: (
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-md bg-white p-2.5 dark:bg-slate-900">
          <div className="text-sm font-semibold">
            <ProductLink id="platform">Salesforce Platform (core)</ProductLink>
          </div>
          <div className="text-xs text-slate-500">OLTP · sObjects, Flow, Apex, LWC, sharing</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">governs</div>
        </div>
        <div className="rounded-md bg-white p-2.5 dark:bg-slate-900">
          <div className="text-sm font-semibold">
            <ProductLink id="data-360" />
          </div>
          <div className="text-xs text-slate-500">OLAP · Iceberg lake, profiles, vector index</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">decides</div>
        </div>
      </div>
    ),
    sub: "Core runs the transactions; Data 360 holds the analytical and grounding copy",
    arrow: "ingest",
    arrowNote: "copied, not stored: webhook → Ingestion API",
    tone: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    key: "int",
    title: (
      <span className="text-sm font-semibold">
        <ProductLink id="mulesoft" /> · <ProductLink id="informatica" /> · <ProductLink id="heroku" />
      </span>
    ),
    sub: "Pipes, governance and app hosting",
    arrow: "pipe",
    arrowNote: "MuleSoft until a first-party connector ships",
    tone: "bg-teal-50 dark:bg-teal-950/30",
  },
  {
    key: "hf",
    title: (
      <span className="text-sm font-semibold">
        Hyperforce + <ProductLink id="shield" />
      </span>
    ),
    sub: "Public-cloud hosting envelope and the security add-on for core and Data 360",
    arrow: "attests separately",
    arrowNote: "Contentful runs on its own AWS",
    tone: "bg-slate-100 dark:bg-slate-800/60",
  },
];

export default function LayersPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Platform layers</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">
          Six products do the connecting; everything else is an application on top of one of them. The rule across every row:
        </p>
        <p className="mt-3 inline-block rounded-lg bg-yellow-300 px-4 py-2 text-lg font-semibold tracking-tight text-yellow-950">
          Contentful delivers, Data 360 decides, core governs.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr_190px_220px]">
          {bands.map((b, i) => (
            <div key={b.key} className="contents">
              <div className={`rounded-xl border border-slate-200 p-4 dark:border-slate-800 ${b.tone} md:[grid-row:var(--r)]`} style={{ "--r": i + 1 } as React.CSSProperties}>
                {b.title}
                <p className="mt-1.5 text-xs text-slate-500">{b.sub}</p>
              </div>
              <div className="hidden flex-col items-center justify-center text-center md:flex md:[grid-row:var(--r)]" style={{ "--r": i + 1 } as React.CSSProperties}>
                <div className="flex w-full items-center">
                  <span className="text-lg leading-none text-slate-400">◀</span>
                  <span className="h-0.5 flex-1 bg-gradient-to-r from-slate-300 to-yellow-400" />
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">{b.arrow}</div>
                <div className="text-[11px] leading-snug text-slate-500">{b.arrowNote}</div>
              </div>
              <p className="-mt-1 text-xs text-slate-500 md:hidden">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Contentful {b.arrow}:</span> {b.arrowNote}
              </p>
            </div>
          ))}
          <Link
            href="/?focus=contentful"
            className="order-first flex flex-col justify-center rounded-xl border-2 border-yellow-400 bg-yellow-50 p-5 hover:shadow-lg md:order-none md:[grid-column:3] md:[grid-row:1/span_5] dark:bg-yellow-950/30"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-yellow-800 dark:text-yellow-300">Content layer</span>
            <span className="text-2xl font-semibold tracking-tight">Contentful</span>
            <span className="mt-2 text-sm text-slate-700 dark:text-slate-300">System of record for content, on its own footprint. Salesforce products consume it at render time or read a derived copy in Data 360.</span>
            <span className="mt-3 text-xs text-slate-500">Signed June 2026 · close expected fiscal Q3 FY27</span>
          </Link>
        </div>

        <h2 className="mt-10 text-lg font-semibold tracking-tight">What each layer is</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <table className="w-full min-w-[800px] text-[13px]">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              <tr>
                <th className="px-3 py-2">Layer</th>
                <th className="px-3 py-2">What it is</th>
                <th className="px-3 py-2">Workload</th>
                <th className="px-3 py-2">Why it matters for Contentful</th>
              </tr>
            </thead>
            <tbody>
              {layers.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 align-top last:border-0 dark:border-slate-800/70">
                  <td className="px-3 py-2.5 font-semibold">{l.productId ? <ProductLink id={l.productId}>{l.name}</ProductLink> : l.name}</td>
                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">{l.what}</td>
                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">{l.workload}</td>
                  <td className="px-3 py-2.5 text-slate-800 dark:text-slate-200">{l.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 text-lg font-semibold tracking-tight">Where Contentful plugs in</h2>
        <p className="mt-1 text-sm text-slate-500">
          Contentful stays the system of record on its own footprint. Salesforce products either consume CDA/GraphQL at render time or read a derived copy in Data 360.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {surfaces.map((s) => (
            <Link key={s.surface} href={`/?focus=${s.productIds[0]}`} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950">
              <div className="font-semibold">{s.surface}</div>
              <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300">{s.pattern}</p>
              <p className="mt-2 text-xs text-red-700 dark:text-red-300">
                <span className="font-semibold">Overlap: </span>
                {s.overlap}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
