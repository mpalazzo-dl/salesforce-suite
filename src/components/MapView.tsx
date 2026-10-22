"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { SlidersHorizontal, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { relationships } from "@/data/relationships";
import type { Project } from "@/data/types";
import { cx } from "@/lib/format";
import { useUrlSync } from "@/store/url-sync";
import { findProject, useUI } from "@/store/ui";
import { neighborhood, seedsFor } from "./graph/focus";
import { DetailDrawer } from "./panels/DetailDrawer";
import { MapSidebar } from "./panels/MapSidebar";
import { ProjectEditor } from "./panels/ProjectEditor";
import { ProjectPanel } from "./panels/ProjectPanel";

// React Flow resolves the system color mode in the browser, so render it client-only.
const SuiteGraph = dynamic(() => import("./graph/SuiteGraph").then((m) => m.SuiteGraph), { ssr: false });

export function MapView() {
  useUrlSync();
  const { selectedId, projectId, hops, userProjects } = useUI();
  const [editor, setEditor] = useState<Partial<Project> | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const panelOpen = Boolean(selectedId || projectId);

  const saveFocus = () => {
    if (!selectedId) return;
    const { nodes } = neighborhood(seedsFor(selectedId), relationships.filter((r) => r.kind !== "runs-on"), hops);
    setEditor({ products: [...nodes] });
  };

  return (
    <div className="relative flex min-h-0 flex-1">
      <div
        className={cx(
          "absolute inset-y-0 left-0 z-20 w-72 shrink-0 border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0",
          filtersOpen ? "translate-x-0 shadow-xl" : "-translate-x-full",
        )}
      >
        <button aria-label="Close filters" className="absolute right-2 top-2 rounded p-1 text-slate-500 lg:hidden" onClick={() => setFiltersOpen(false)}>
          <X size={16} />
        </button>
        <MapSidebar onNewProject={() => setEditor({})} />
      </div>

      <div className="relative min-w-0 flex-1">
        <button
          onClick={() => setFiltersOpen(true)}
          className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-sm lg:hidden dark:border-slate-700 dark:bg-slate-900"
        >
          <SlidersHorizontal size={14} /> Filters & projects
        </button>
        <ReactFlowProvider>
          <SuiteGraph />
        </ReactFlowProvider>
      </div>

      {panelOpen && (
        <div className="absolute inset-y-0 right-0 z-20 w-full max-w-[400px] border-l border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 xl:static xl:shadow-none">
          {projectId ? (
            <ProjectPanel onEdit={(id) => setEditor(findProject(id, userProjects) ?? null)} />
          ) : (
            <DetailDrawer onSaveFocus={saveFocus} />
          )}
        </div>
      )}

      {editor && <ProjectEditor initial={editor} onClose={() => setEditor(null)} />}
    </div>
  );
}
