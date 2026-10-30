"use client";

import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Network, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { groups } from "@/data/groups";
import { productById, products } from "@/data/products";
import { columnGlossary } from "@/data/reference";
import { edgeKindById } from "@/data/relationships";
import { tags, tagsFor } from "@/data/tags";
import type { FitLevel, GroupId, OnCore, Product } from "@/data/types";
import { coreMeta, cx, fitMeta, hyperforceLabel, pricingLabel } from "@/lib/format";
import { searchAll, searchProducts } from "@/lib/search";
import { matchesTags } from "../graph/focus";
import { Connections } from "../panels/DetailDrawer";
import { OverviewMain, PartsList } from "../ProductOverview";
import { overviews } from "@/data/overviews";
import { CoreBadge, FitBadge, GroupBadge, Highlight, Segmented, TagChip } from "../ui";
import { useAllProjects, useUI } from "@/store/ui";

type SortKey = "relevance" | "name" | "group" | "category" | "onCore" | "hyperforce" | "pricing" | "fit";

const coreRank: Record<OnCore, number> = { yes: 0, partial: 1, hybrid: 2, no: 3 };

const sorters: Record<Exclude<SortKey, "relevance">, (p: Product) => string | number> = {
  name: (p) => p.name,
  group: (p) => groups.findIndex((g) => g.id === p.group),
  category: (p) => p.category,
  onCore: (p) => coreRank[p.onCore],
  hyperforce: (p) => ["yes", "partial", "no"].indexOf(p.hyperforce),
  pricing: (p) => p.pricing,
  fit: (p) => fitMeta[p.contentfulFit.level].rank,
};

const selectCls =
  "rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200";

export function CatalogView({ initialQuery = "" }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [group, setGroup] = useState<GroupId | "">("");
  const [fit, setFit] = useState<FitLevel | "">("");
  const [core, setCore] = useState<OnCore | "">("");
  const [view, setView] = useState<"table" | "cards">("table");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "relevance", dir: 1 });
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggleOpen = (id: string) =>
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const { activeTags, tagMode, toggleTag, setTags, setTagMode } = useUI();
  const projects = useAllProjects();
  const inputRef = useRef<HTMLInputElement>(null);

  // The query lives in ?q= so results are linkable.
  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => {
    const url = q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog";
    window.history.replaceState(null, "", url);
  }, [q]);

  const rows = useMemo(() => {
    let hits = searchProducts(q).filter(
      ({ product: p }) =>
        (!group || p.group === group) &&
        (!fit || p.contentfulFit.level === fit) &&
        (!core || p.onCore === core) &&
        matchesTags(p.id, activeTags, tagMode),
    );
    if (sort.key !== "relevance") {
      const f = sorters[sort.key];
      hits = [...hits].sort((a, b) => {
        const x = f(a.product);
        const y = f(b.product);
        return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
      });
    } else if (!q) {
      hits = [...hits].sort((a, b) => (sorters.group(a.product) as number) - (sorters.group(b.product) as number));
    }
    return hits.map((h) => h.product);
  }, [q, group, fit, core, activeTags, tagMode, sort]);

  const other = useMemo(() => (q ? searchAll(q, projects).filter((h) => h.type !== "product") : []), [q, projects]);
  const filtered = Boolean(group || fit || core || activeTags.length);

  const header = (key: SortKey, label: string, className = "") => (
    <th className={cx("px-3 py-2 text-left font-semibold", className)}>
      <button
        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
        onClick={() => setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }))}
      >
        {label}
        {sort.key === key && (sort.dir === 1 ? <ArrowDown size={11} /> : <ArrowUp size={11} />)}
      </button>
    </th>
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Index & Search</h1>
        <p className="mt-1 text-sm text-slate-500">
          Every product in the index, searchable by current or former name, and by platform, data store, pricing or Contentful fit. Click any row for a full overview: what it is, who uses it, how it is used, the named parts you will hear about, and discovery questions. Matches in connections, projects and reference notes appear below the table.
        </p>
      </div>

      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='Try "Demandware", "Iceberg", "LWC", "Ninetailed", "GMV" or "Citi"'
          className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-base shadow-sm outline-none focus:border-slate-500 dark:border-slate-600 dark:bg-slate-900"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select aria-label="Cloud" value={group} onChange={(e) => setGroup(e.target.value as GroupId | "")} className={selectCls}>
          <option value="">All clouds</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <select aria-label="On core" value={core} onChange={(e) => setCore(e.target.value as OnCore | "")} className={selectCls}>
          <option value="">Any platform</option>
          {(Object.keys(coreMeta) as OnCore[]).map((c) => (
            <option key={c} value={c}>
              {coreMeta[c].label}
            </option>
          ))}
        </select>
        <select aria-label="Contentful fit" value={fit} onChange={(e) => setFit(e.target.value as FitLevel | "")} className={selectCls}>
          <option value="">Any Contentful fit</option>
          {(Object.keys(fitMeta) as FitLevel[]).map((f) => (
            <option key={f} value={f}>
              {fitMeta[f].label}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {rows.length} of {products.length} products
          </span>
          {view === "table" && (
            <button
              className="text-xs text-slate-600 hover:underline dark:text-slate-300"
              onClick={() => setOpen(open.size ? new Set() : new Set(rows.map((r) => r.id)))}
            >
              {open.size ? "Collapse all" : "Expand all"}
            </button>
          )}
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: "table", label: "Table" },
              { value: "cards", label: "Cards" },
            ]}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {tags.map((t) => (
          <TagChip key={t.id} id={t.id} size="xs" active={activeTags.includes(t.id)} onClick={() => toggleTag(t.id)} />
        ))}
        {activeTags.length > 1 && (
          <Segmented
            value={tagMode}
            onChange={setTagMode}
            options={[
              { value: "any", label: "Any" },
              { value: "all", label: "All" },
            ]}
          />
        )}
        {filtered && (
          <button
            className="ml-1 text-xs text-slate-500 hover:underline"
            onClick={() => {
              setGroup("");
              setFit("");
              setCore("");
              setTags([]);
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {view === "table" ? (
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <table className="w-full min-w-[1000px] text-[13px]">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              <tr>
                <th className="w-6" />
                {header("name", "Product")}
                {header("category", "Category")}
                {header("onCore", "On core")}
                {header("hyperforce", "Hyperforce")}
                <th className="px-3 py-2 text-left font-semibold">Frontend</th>
                <th className="px-3 py-2 text-left font-semibold">Data store</th>
                {header("pricing", "Pricing")}
                {header("fit", "Contentful fit", "min-w-[260px]")}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <Fragment key={p.id}>
                  <tr
                    onClick={() => toggleOpen(p.id)}
                    className={cx(
                      "cursor-pointer border-b border-slate-100 align-top hover:bg-slate-50 dark:border-slate-800/70 dark:hover:bg-slate-900",
                      p.contentfulFit.level === "self" && "bg-yellow-50/60 dark:bg-yellow-950/20",
                    )}
                  >
                    <td className="py-2.5 pl-3 text-slate-400">{open.has(p.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                    <td className="px-3 py-2.5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        <Highlight text={p.name} query={q} />
                      </div>
                      <GroupBadge id={p.group} />
                      {p.formerNames.length > 0 && (
                        <div className="text-[11px] text-slate-400">
                          ex-<Highlight text={p.formerNames.join(", ")} query={q} />
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                      <Highlight text={p.category} query={q} />
                      <div className="text-[11px] text-slate-400">
                        <Highlight text={p.origin} query={q} />
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <CoreBadge value={p.onCore} note={p.onCoreNote} />
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                      {hyperforceLabel[p.hyperforce]}
                      {p.hyperforceNote && <div className="text-[11px] text-slate-400">{p.hyperforceNote}</div>}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                      <Highlight text={p.frontend} query={q} />
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                      <Highlight text={p.dataStore} query={q} />
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                      {pricingLabel[p.pricing]}
                      <div className="text-[11px] text-slate-400">
                        <Highlight text={p.pricingNote} query={q} />
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <FitBadge level={p.contentfulFit.level} />
                      <div className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-400">
                        <Highlight text={p.contentfulFit.pattern} query={q} />
                      </div>
                    </td>
                  </tr>
                  {open.has(p.id) && (
                    <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/50">
                      <td />
                      <td colSpan={8} className="px-3 py-4">
                        <ProductExpansion p={p} q={q} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No products match. Clear a filter or try a former name.</p>}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p) => (
            <ProductCard key={p.id} p={p} q={q} />
          ))}
          {rows.length === 0 && <p className="col-span-full p-8 text-center text-sm text-slate-500">No products match.</p>}
        </div>
      )}

      {q && other.length > 0 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <ResultList title="Connections" items={other.filter((h) => h.type === "relationship")} q={q} />
          <ResultList title="Projects" items={other.filter((h) => h.type === "project")} q={q} />
          <ResultList title="Reference" items={other.filter((h) => h.type === "reference")} q={q} />
        </div>
      )}

      <details className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
        <summary className="cursor-pointer font-semibold">How to read this index</summary>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Salesforce is one brand over roughly five separate platforms; the columns tell you which platform you are actually on. Platform, origin and data-store values come from working knowledge rather than fetched pages, and Hyperforce status varies by tenant, so verify it in the security questionnaire.
        </p>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {columnGlossary.map((c) => (
            <div key={c.column}>
              <dt className="font-medium">{c.column}</dt>
              <dd className="text-slate-600 dark:text-slate-400">{c.meaning}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}

function ProductExpansion({ p, q }: { p: Product; q: string }) {
  const router = useRouter();
  const showOnMap = (id: string) => {
    useUI.getState().select(id);
    router.push(`/?focus=${id}`);
  };
  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
      <OverviewMain id={p.id} q={q} />
      <div className="space-y-4">
        <div className={cx("rounded-lg border p-3", p.contentfulFit.level === "self" ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950")}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contentful fit</span>
            <FitBadge level={p.contentfulFit.level} />
          </div>
          <p className="text-[13px] text-slate-800 dark:text-slate-200">
            <Highlight text={p.contentfulFit.pattern} query={q} />
          </p>
          {p.contentfulFit.overlap && (
            <p className="mt-1.5 text-xs text-red-700 dark:text-red-300">
              <span className="font-semibold">Overlap to address: </span>
              <Highlight text={p.contentfulFit.overlap} query={q} />
            </p>
          )}
        </div>
        <PartsList id={p.id} q={q} />
        <div className="flex flex-wrap gap-1">
          {tagsFor(p).map((t) => (
            <TagChip key={t} id={t} size="xs" />
          ))}
        </div>
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Talks to</div>
          <Connections id={p.id} onSelect={showOnMap} />
        </div>
        <Link
          href={`/?focus=${p.id}`}
          onClick={() => useUI.getState().select(p.id)}
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-slate-900"
        >
          <Network size={13} /> Show on map
        </Link>
      </div>
    </div>
  );
}

function ProductCard({ p, q }: { p: Product; q: string }) {
  const [full, setFull] = useState(false);
  return (
    <div className={cx("flex flex-col rounded-lg border bg-white p-4 dark:bg-slate-950", p.contentfulFit.level === "self" ? "border-yellow-400" : "border-slate-200 dark:border-slate-800")}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <GroupBadge id={p.group} />
          <h3 className="mt-0.5 font-semibold text-slate-900 dark:text-white">
            <Highlight text={p.name} query={q} />
          </h3>
          {p.formerNames.length > 0 && (
            <div className="text-[11px] text-slate-400">
              ex-<Highlight text={p.formerNames.join(", ")} query={q} />
            </div>
          )}
        </div>
        <FitBadge level={p.contentfulFit.level} />
      </div>
      {full ? (
        <div className="mt-3 space-y-4">
          <OverviewMain id={p.id} q={q} />
          <PartsList id={p.id} q={q} />
        </div>
      ) : (
        <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          <Highlight text={overviews[p.id]?.what ?? p.summary} query={q} />
        </p>
      )}
      <button onClick={() => setFull(!full)} className="mt-1 self-start text-xs font-medium text-sky-700 hover:underline dark:text-sky-400">
        {full ? "Less" : "Full overview"}
      </button>
      <div className="mt-2 rounded-md bg-slate-50 p-2 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <Highlight text={p.contentfulFit.pattern} query={q} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {tagsFor(p).map((t) => (
          <TagChip key={t} id={t} size="xs" />
        ))}
      </div>
      <Link href={`/?focus=${p.id}`} onClick={() => useUI.getState().select(p.id)} className="mt-auto pt-3 text-xs font-medium text-slate-600 hover:underline dark:text-slate-300">
        Show on map →
      </Link>
    </div>
  );
}

function ResultList({ title, items, q }: { title: string; items: ReturnType<typeof searchAll>; q: string }) {
  if (!items.length) return <div />;
  return (
    <div>
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {title} · {items.length}
      </h2>
      <ul className="space-y-2">
        {items.slice(0, 12).map((h) => {
          if (h.type === "relationship") {
            const r = h.rel;
            return (
              <li key={h.id} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                <Link href={`/?focus=${r.from}`} onClick={() => useUI.getState().select(r.from)} className="text-[13px] font-semibold hover:underline">
                  {productById[r.from].shortName} → {productById[r.to].shortName}
                </Link>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="h-2 w-2 rounded-full" style={{ background: edgeKindById[r.kind].color }} />
                  {edgeKindById[r.kind].label} · <Highlight text={r.label} query={q} />
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  <Highlight text={r.description} query={q} />
                </p>
              </li>
            );
          }
          if (h.type === "project") {
            return (
              <li key={h.id} className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900 dark:bg-amber-950/20">
                <Link href={`/?project=${h.id}`} onClick={() => useUI.getState().openProject(h.id)} className="text-[13px] font-semibold hover:underline">
                  <Highlight text={h.project.name} query={q} />
                </Link>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  <Highlight text={h.project.summary} query={q} />
                </p>
              </li>
            );
          }
          if (h.type === "reference") {
            return (
              <li key={h.id} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{h.section}</div>
                <div className="text-[13px] font-semibold">
                  <Highlight text={h.title} query={q} />
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  <Highlight text={h.body} query={q} />
                </p>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}

