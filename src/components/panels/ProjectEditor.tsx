"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { groups } from "@/data/groups";
import { productById, products } from "@/data/products";
import { relationships } from "@/data/relationships";
import type { Project } from "@/data/types";
import { cx } from "@/lib/format";
import { useUI } from "@/store/ui";

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "project";

/** Walkthrough steps are generated from the mapped relationships between the chosen products. */
function stepsFor(ids: string[]) {
  return relationships
    .filter((r) => r.kind !== "runs-on" && ids.includes(r.from) && ids.includes(r.to))
    .map((r) => ({
      edge: r.id,
      title: `${productById[r.from].shortName} → ${productById[r.to].shortName}`,
      body: r.description,
    }));
}

export function ProjectEditor({ initial, onClose }: { initial: Partial<Project>; onClose: () => void }) {
  const { saveUserProject, openProject } = useUI();
  const [name, setName] = useState(initial.name ?? "");
  const [customers, setCustomers] = useState(initial.customers ?? "");
  const [summary, setSummary] = useState(initial.summary ?? "");
  const [picked, setPicked] = useState<string[]>(initial.products ?? []);
  const [talk, setTalk] = useState((initial.talkTrack ?? []).join("\n"));

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const steps = stepsFor(picked);

  const save = () => {
    const id = initial.id ?? `${slug(name)}-${Date.now().toString(36).slice(-4)}`;
    saveUserProject({
      id,
      name: name.trim(),
      customers: customers.trim() || undefined,
      summary: summary.trim(),
      products: picked,
      steps,
      talkTrack: talk.split("\n").map((t) => t.trim()).filter(Boolean),
    });
    openProject(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-label="Project editor"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-slate-200 px-5 py-3 dark:border-slate-800">
          <h2 className="text-base font-semibold">{initial.id ? "Edit project" : "New project"}</h2>
          <button aria-label="Close" onClick={onClose} className="ml-auto rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Name</span>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Acme FSC + Agentforce" className="mt-1 w-full rounded-md border border-slate-300 bg-transparent px-2.5 py-1.5 dark:border-slate-600" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Accounts (optional)</span>
              <input value={customers} onChange={(e) => setCustomers(e.target.value)} placeholder="Acme Bank" className="mt-1 w-full rounded-md border border-slate-300 bg-transparent px-2.5 py-1.5 dark:border-slate-600" />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Summary</span>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className="mt-1 w-full rounded-md border border-slate-300 bg-transparent px-2.5 py-1.5 dark:border-slate-600" />
          </label>
          <div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Products in this landscape ({picked.length})</span>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {groups.map((g) => (
                <div key={g.id}>
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    <span className="h-2 w-2 rounded-sm" style={{ background: g.color }} />
                    {g.name}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {products
                      .filter((p) => p.group === g.id)
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggle(p.id)}
                          className={cx(
                            "rounded border px-1.5 py-0.5 text-[11px]",
                            picked.includes(p.id)
                              ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                              : "border-slate-300 text-slate-600 hover:border-slate-500 dark:border-slate-600 dark:text-slate-300",
                          )}
                        >
                          {p.shortName}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-500">
            {steps.length
              ? `${steps.length} walkthrough steps will be generated from the mapped connections between these products.`
              : "Pick connected products to generate a walkthrough."}
          </p>
          <label className="block">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Talk track (one point per line)</span>
            <textarea value={talk} onChange={(e) => setTalk(e.target.value)} rows={3} className="mt-1 w-full rounded-md border border-slate-300 bg-transparent px-2.5 py-1.5 dark:border-slate-600" />
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3 dark:border-slate-800">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!name.trim() || picked.length === 0}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-slate-900"
          >
            Save project
          </button>
        </div>
      </div>
    </div>
  );
}
