"use client";

import { ArrowLeft, ArrowRight, FolderPlus, X } from "lucide-react";
import Link from "next/link";
import { groupById } from "@/data/groups";
import { productById, products } from "@/data/products";
import { edgeKindById, relationships } from "@/data/relationships";
import { tagsFor } from "@/data/tags";
import type { GroupId, Product } from "@/data/types";
import { hyperforceLabel, pricingLabel } from "@/lib/format";
import { useAllProjects, useUI } from "@/store/ui";
import { OverviewMain, PartsList } from "../ProductOverview";
import { CoreBadge, FitBadge, GroupBadge, Pill, SectionTitle, TagChip } from "../ui";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-[13px] text-slate-800 dark:text-slate-200">{children}</dd>
    </div>
  );
}

export function Connections({ id, onSelect }: { id: string; onSelect?: (id: string) => void }) {
  const storeSelect = useUI((s) => s.select);
  const select = onSelect ?? storeSelect;
  const rels = relationships.filter((r) => r.from === id || r.to === id);
  if (!rels.length) return <p className="text-xs text-slate-500">No mapped connections.</p>;
  return (
    <ul className="space-y-2.5">
      {rels.map((r) => {
        const outgoing = r.from === id;
        const other = productById[outgoing ? r.to : r.from];
        const kind = edgeKindById[r.kind];
        return (
          <li key={r.id} className="rounded-lg border border-slate-200 p-2.5 dark:border-slate-700">
            <div className="flex items-center gap-1.5">
              {outgoing ? <ArrowRight size={12} className="text-slate-400" /> : <ArrowLeft size={12} className="text-slate-400" />}
              <button className="text-[13px] font-semibold text-slate-900 hover:underline dark:text-slate-100" onClick={() => select(other.id)}>
                {other.name}
              </button>
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-slate-500">
                <span className="h-2 w-2 rounded-full" style={{ background: kind.color }} />
                {kind.label}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{r.description}</p>
            <div className="mt-1 flex gap-1">
              <Pill className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{r.label}</Pill>
              {r.confidence === "inferred" && <Pill className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">inferred</Pill>}
              {r.status === "roadmap" && <Pill className="bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300">roadmap</Pill>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ProductDetail({ p }: { p: Product }) {
  const projects = useAllProjects().filter((x) => x.products.includes(p.id));
  const openProject = useUI((s) => s.openProject);
  return (
    <div className="space-y-5">
      <div>
        <GroupBadge id={p.group} />
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">{p.name}</h2>
        {p.formerNames.length > 0 && <p className="text-xs text-slate-500">Also known as {p.formerNames.join(", ")}</p>}
        <p className="mt-2 text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">{p.summary}</p>
      </div>

      <div className={`rounded-lg border p-3 ${p.contentfulFit.level === "self" ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30" : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50"}`}>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contentful fit</span>
          <FitBadge level={p.contentfulFit.level} />
        </div>
        <p className="text-[13px] leading-relaxed text-slate-800 dark:text-slate-200">{p.contentfulFit.pattern}</p>
        {p.contentfulFit.overlap && (
          <p className="mt-2 text-xs text-red-700 dark:text-red-300">
            <span className="font-semibold">Overlap to address: </span>
            {p.contentfulFit.overlap}
          </p>
        )}
      </div>

      <details open className="group">
        <summary className="mb-3 cursor-pointer text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Overview</summary>
        <div className="space-y-4">
          <OverviewMain id={p.id} />
          <PartsList id={p.id} />
        </div>
      </details>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Field label="Category">{p.category}</Field>
        <Field label="Origin">{p.origin}</Field>
        <Field label="On core">
          <CoreBadge value={p.onCore} />
          {p.onCoreNote && <div className="mt-0.5 text-[11px] text-slate-500">{p.onCoreNote}</div>}
        </Field>
        <Field label="Hyperforce">
          {hyperforceLabel[p.hyperforce]}
          {p.hyperforceNote && <span className="text-[11px] text-slate-500"> · {p.hyperforceNote}</span>}
        </Field>
        <Field label="Frontend">{p.frontend}</Field>
        <Field label="Data store">{p.dataStore}</Field>
        <Field label="Pricing">
          {pricingLabel[p.pricing]}
          <div className="text-[11px] text-slate-500">{p.pricingNote}</div>
        </Field>
      </dl>

      <div>
        <SectionTitle>Tags</SectionTitle>
        <div className="flex flex-wrap gap-1">
          {tagsFor(p).map((t) => (
            <TagChip key={t} id={t} size="xs" />
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Talks to</SectionTitle>
        <Connections id={p.id} />
      </div>

      {projects.length > 0 && (
        <div>
          <SectionTitle>In projects</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {projects.map((x) => (
              <button key={x.id} onClick={() => openProject(x.id)} className="rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-900 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-200">
                {x.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <Link href={`/catalog?q=${encodeURIComponent(p.shortName)}`} className="inline-block text-xs text-slate-500 hover:underline">
        Open in Index & Search →
      </Link>
    </div>
  );
}

function GroupDetail({ id }: { id: GroupId }) {
  const g = groupById[id];
  const select = useUI((s) => s.select);
  return (
    <div className="space-y-4">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: g.color === "#ffda00" ? "#a38a00" : g.color }}>
          Cloud
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">{g.name}</h2>
        <p className="mt-1 text-[13px] text-slate-600 dark:text-slate-300">{g.blurb}</p>
      </div>
      <ul className="space-y-1.5">
        {products
          .filter((p) => p.group === id)
          .map((p) => (
            <li key={p.id}>
              <button onClick={() => select(p.id)} className="flex w-full items-center gap-2 rounded-md border border-slate-200 p-2 text-left hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                <span className="flex-1 text-[13px] font-medium">{p.name}</span>
                <CoreBadge value={p.onCore} />
                <FitBadge level={p.contentfulFit.level} />
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}

export function DetailDrawer({ onSaveFocus }: { onSaveFocus: () => void }) {
  const selectedId = useUI((s) => s.selectedId);
  const select = useUI((s) => s.select);
  if (!selectedId) return null;
  const isGroup = selectedId.startsWith("group:");
  const p = productById[selectedId];
  if (!isGroup && !p) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end gap-1 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <button onClick={onSaveFocus} className="mr-auto inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" title="Save this neighborhood as a project">
          <FolderPlus size={13} /> Save as project
        </button>
        <button aria-label="Close" onClick={() => select(null)} className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{isGroup ? <GroupDetail id={selectedId.slice(6) as GroupId} /> : <ProductDetail p={p} />}</div>
    </div>
  );
}
