"use client";

import { Command } from "cmdk";
import { BookOpen, Boxes, FolderOpen, Layers, Link2, Network, Search, Table2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { groupById } from "@/data/groups";
import { productById, products } from "@/data/products";
import { searchAll } from "@/lib/search";
import { useAllProjects, useUI } from "@/store/ui";

const pages = [
  { href: "/", label: "Suite Map", icon: Network },
  { href: "/catalog", label: "Index & Search", icon: Table2 },
  { href: "/layers", label: "Platform layers", icon: Layers },
  { href: "/reference", label: "Naming decoder & acquisitions", icon: BookOpen },
];

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return [open, setOpen] as const;
}

const itemCls =
  "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-slate-700 data-[selected=true]:bg-slate-100 dark:text-slate-200 dark:data-[selected=true]:bg-slate-800";
const groupCls =
  "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-slate-400";

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const projects = useAllProjects();
  const hits = useMemo(() => searchAll(q, projects).slice(0, 30), [q, projects]);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    if (pathname !== "/" || !href.startsWith("/?")) router.push(href);
  };
  const focusProduct = (id: string) => {
    useUI.getState().select(id);
    go(`/?focus=${id}`);
  };
  const openProject = (id: string) => {
    useUI.getState().openProject(id);
    go(`/?project=${id}`);
  };

  const byType = (t: string) => hits.filter((h) => h.type === t);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      shouldFilter={false}
      label="Search the Salesforce suite"
      overlayClassName="fixed inset-0 z-50 bg-black/40"
      contentClassName="fixed left-1/2 top-[12vh] z-50 w-[min(640px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-center gap-2 border-b border-slate-200 px-3 dark:border-slate-700">
        <Search size={16} className="text-slate-400" />
        <Command.Input
          value={q}
          onValueChange={setQ}
          placeholder="Search products, old names, connections, projects…"
          className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
        <kbd className="rounded border border-slate-200 px-1.5 text-[10px] text-slate-400 dark:border-slate-700">esc</kbd>
      </div>
      <Command.List className="max-h-[60vh] overflow-y-auto p-1.5">
        <Command.Empty className="px-3 py-6 text-center text-sm text-slate-500">No matches. Try an old name like “Data Cloud” or “Demandware”.</Command.Empty>

        {!q && (
          <>
            <Command.Group heading="Go to" className={groupCls}>
              {pages.map((p) => (
                <Command.Item key={p.href} value={`page ${p.href}`} onSelect={() => go(p.href)} className={itemCls}>
                  <p.icon size={15} className="text-slate-400" />
                  {p.label}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Products" className={groupCls}>
              {products.map((p) => (
                <Command.Item key={p.id} value={`product ${p.id}`} onSelect={() => focusProduct(p.id)} className={itemCls}>
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: groupById[p.group].color }} />
                  {p.name}
                  {p.formerNames[0] && <span className="text-xs text-slate-400">ex-{p.formerNames[0]}</span>}
                </Command.Item>
              ))}
            </Command.Group>
          </>
        )}

        {byType("product").length > 0 && (
          <Command.Group heading="Products" className={groupCls}>
            {byType("product").map((h) =>
              h.type === "product" ? (
                <Command.Item key={h.id} value={`product ${h.id}`} onSelect={() => focusProduct(h.id)} className={itemCls}>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: groupById[h.product.group].color }} />
                  <span>{h.product.name}</span>
                  {h.product.formerNames.length > 0 && <span className="truncate text-xs text-slate-400">aka {h.product.formerNames.join(", ")}</span>}
                </Command.Item>
              ) : null,
            )}
          </Command.Group>
        )}
        {byType("project").length > 0 && (
          <Command.Group heading="Projects" className={groupCls}>
            {byType("project").map((h) =>
              h.type === "project" ? (
                <Command.Item key={h.id} value={`project ${h.id}`} onSelect={() => openProject(h.id)} className={itemCls}>
                  <FolderOpen size={15} className="text-amber-500" />
                  {h.project.name}
                </Command.Item>
              ) : null,
            )}
          </Command.Group>
        )}
        {byType("relationship").length > 0 && (
          <Command.Group heading="Connections" className={groupCls}>
            {byType("relationship")
              .slice(0, 8)
              .map((h) =>
                h.type === "relationship" ? (
                  <Command.Item key={h.id} value={`rel ${h.id}`} onSelect={() => focusProduct(h.rel.from)} className={itemCls}>
                    <Link2 size={15} className="shrink-0 text-slate-400" />
                    <span className="truncate">
                      {productById[h.rel.from].shortName} → {productById[h.rel.to].shortName}
                      <span className="ml-1.5 text-xs text-slate-400">{h.rel.label}</span>
                    </span>
                  </Command.Item>
                ) : null,
              )}
          </Command.Group>
        )}
        {byType("reference").length > 0 && (
          <Command.Group heading="Reference" className={groupCls}>
            {byType("reference")
              .slice(0, 6)
              .map((h) =>
                h.type === "reference" ? (
                  <Command.Item
                    key={h.id}
                    value={`ref ${h.id}`}
                    onSelect={() => (h.productId ? focusProduct(h.productId) : go("/reference"))}
                    className={itemCls}
                  >
                    <Boxes size={15} className="shrink-0 text-slate-400" />
                    <span className="truncate">{h.title}</span>
                    <span className="ml-auto shrink-0 text-[11px] text-slate-400">{h.section}</span>
                  </Command.Item>
                ) : null,
              )}
          </Command.Group>
        )}
        {q && (
          <Command.Item value="see-all" onSelect={() => go(`/catalog?q=${encodeURIComponent(q)}`)} className={itemCls}>
            <Table2 size={15} className="text-slate-400" />
            See all results for “{q}” in Index & Search
          </Command.Item>
        )}
      </Command.List>
    </Command.Dialog>
  );
}
