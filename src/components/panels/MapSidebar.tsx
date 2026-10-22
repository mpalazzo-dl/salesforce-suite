"use client";

import { Download, FolderPlus, Play, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import { groups } from "@/data/groups";
import { edgeKinds } from "@/data/relationships";
import { tags } from "@/data/tags";
import type { Project } from "@/data/types";
import { cx } from "@/lib/format";
import { useAllProjects, useUI } from "@/store/ui";
import { SectionTitle, Segmented, TagChip } from "../ui";

export function MapSidebar({ onNewProject }: { onNewProject: () => void }) {
  const s = useUI();
  const projects = useAllProjects();
  const fileRef = useRef<HTMLInputElement>(null);

  const exportProjects = () => {
    const blob = new Blob([JSON.stringify(s.userProjects, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "salesforce-suite-projects.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importProjects = async (f: File) => {
    try {
      const parsed = JSON.parse(await f.text()) as Project[];
      if (Array.isArray(parsed)) s.importUserProjects(parsed.filter((p) => p?.id && p?.name && Array.isArray(p.products)));
    } catch {
      // Ignore malformed files; nothing is overwritten.
    }
  };

  return (
    <aside className="flex h-full w-full flex-col gap-5 overflow-y-auto p-4 text-sm">
      <section>
        <SectionTitle>Focus</SectionTitle>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => s.select(s.selectedId === "contentful" ? null : "contentful")}
            className={cx(
              "rounded-md border px-2.5 py-1 text-xs font-semibold",
              s.selectedId === "contentful"
                ? "border-yellow-500 bg-yellow-300 text-yellow-950"
                : "border-yellow-400 bg-yellow-50 text-yellow-900 hover:bg-yellow-100 dark:bg-yellow-950/40 dark:text-yellow-200",
            )}
          >
            Contentful paths
          </button>
          <Segmented
            value={s.hops}
            onChange={s.setHops}
            options={[
              { value: 1, label: "1 hop" },
              { value: 2, label: "2 hops" },
            ]}
          />
        </div>
        <div className="mt-2 flex gap-2 text-xs">
          <button className="text-slate-600 underline-offset-2 hover:underline dark:text-slate-300" onClick={() => s.setCollapsed(groups.map((g) => g.id))}>
            Collapse all clouds
          </button>
          <span className="text-slate-300">·</span>
          <button className="text-slate-600 underline-offset-2 hover:underline dark:text-slate-300" onClick={() => s.setCollapsed([])}>
            Expand all
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-slate-500">
          Click a product to light up what it touches. Click a cloud title to focus the whole cloud; double-click or use the chevron to collapse it.
        </p>
      </section>

      <section>
        <SectionTitle
          right={
            <Segmented
              value={s.tagMode}
              onChange={s.setTagMode}
              options={[
                { value: "any", label: "Any" },
                { value: "all", label: "All" },
              ]}
            />
          }
        >
          Tags
        </SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <TagChip key={t.id} id={t.id} size="xs" active={s.activeTags.includes(t.id)} onClick={() => s.toggleTag(t.id)} />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={s.hideNonMatching} onChange={(e) => s.setHideNonMatching(e.target.checked)} />
            Hide non-matching
          </label>
          {s.activeTags.length > 0 && (
            <button className="text-slate-500 hover:underline" onClick={() => s.setTags([])}>
              Clear
            </button>
          )}
        </div>
      </section>

      <section>
        <SectionTitle>Connections</SectionTitle>
        <ul className="space-y-1">
          {edgeKinds.map((k) => {
            const on = !s.hiddenKinds.includes(k.id);
            return (
              <li key={k.id}>
                <button onClick={() => s.toggleKind(k.id)} className={cx("flex w-full items-center gap-2 text-left text-xs", !on && "opacity-40")}>
                  <span className="h-0.5 w-5 shrink-0 rounded" style={{ background: k.color, height: 3 }} />
                  <span className="text-slate-700 dark:text-slate-300">{k.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <label className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={s.showInferred} onChange={(e) => s.setShowInferred(e.target.checked)} />
          Show inferred links <span className="text-slate-400">(dashed: not in the index)</span>
        </label>
      </section>

      <section>
        <SectionTitle
          right={
            <div className="flex items-center gap-1 text-slate-500">
              <button title="Import projects (JSON)" className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => fileRef.current?.click()}>
                <Upload size={14} />
              </button>
              <button
                title="Export your projects (JSON)"
                disabled={!s.userProjects.length}
                className="rounded p-1 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                onClick={exportProjects}
              >
                <Download size={14} />
              </button>
              <button title="New project" className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onNewProject}>
                <FolderPlus size={14} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importProjects(f);
                  e.target.value = "";
                }}
              />
            </div>
          }
        >
          Projects
        </SectionTitle>
        <ul className="space-y-1">
          {projects.map((p) => (
            <li key={p.id} className="group flex items-center gap-1">
              <button
                onClick={() => s.openProject(s.projectId === p.id ? null : p.id)}
                className={cx(
                  "flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs",
                  s.projectId === p.id
                    ? "bg-amber-100 font-semibold text-amber-950 dark:bg-amber-900/50 dark:text-amber-100"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                <Play size={12} className="shrink-0 opacity-60" />
                <span className="flex-1">{p.name}</span>
                {p.userCreated && <span className="rounded bg-slate-200 px-1 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">mine</span>}
              </button>
              {p.userCreated && (
                <button
                  title="Delete project"
                  className="rounded p-1 text-slate-400 opacity-0 hover:text-red-600 group-hover:opacity-100"
                  onClick={() => s.deleteUserProject(p.id)}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
