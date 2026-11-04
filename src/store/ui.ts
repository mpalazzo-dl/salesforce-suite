"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { edgeKinds } from "@/data/relationships";
import { seedProjects } from "@/data/projects";
import { trimProject } from "@/lib/project";
import type { EdgeKind, GroupId, Project, TagId } from "@/data/types";

export type TagMode = "any" | "all";

export interface UIState {
  /** A product id, or `group:<id>` for a whole cloud. */
  selectedId: string | null;
  hops: 1 | 2;
  activeTags: TagId[];
  tagMode: TagMode;
  hideNonMatching: boolean;
  hiddenKinds: EdgeKind[];
  showInferred: boolean;
  collapsed: GroupId[];
  projectId: string | null;
  stepIndex: number;
  /** Products toggled out of the open project's stack. */
  excludedProducts: string[];
  userProjects: Project[];
  /** Desktop only: the explorer's left sidebar is hidden. */
  sidebarCollapsed: boolean;

  select: (id: string | null) => void;
  setHops: (h: 1 | 2) => void;
  toggleTag: (t: TagId) => void;
  setTags: (t: TagId[]) => void;
  setTagMode: (m: TagMode) => void;
  setHideNonMatching: (v: boolean) => void;
  toggleKind: (k: EdgeKind) => void;
  setHiddenKinds: (k: EdgeKind[]) => void;
  setShowInferred: (v: boolean) => void;
  toggleCollapsed: (g: GroupId) => void;
  setCollapsed: (g: GroupId[]) => void;
  openProject: (id: string | null, step?: number) => void;
  setStep: (i: number) => void;
  toggleExcluded: (id: string) => void;
  saveUserProject: (p: Project) => void;
  deleteUserProject: (id: string) => void;
  importUserProjects: (ps: Project[]) => void;
  setSidebarCollapsed: (v: boolean) => void;
}

export const defaultHiddenKinds = edgeKinds.map((k) => k.id);
/** Kinds a focus or project traces when every connection is switched off. */
export const focusHiddenKinds = edgeKinds.filter((k) => !k.inFocus).map((k) => k.id);

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      selectedId: null,
      hops: 1,
      activeTags: [],
      tagMode: "any",
      hideNonMatching: false,
      hiddenKinds: defaultHiddenKinds,
      showInferred: true,
      collapsed: [],
      projectId: null,
      stepIndex: 0,
      excludedProducts: [],
      userProjects: [],
      sidebarCollapsed: false,

      select: (id) => set({ selectedId: id, projectId: null, stepIndex: 0, excludedProducts: [] }),
      setHops: (hops) => set({ hops }),
      toggleTag: (t) =>
        set((s) => ({ activeTags: s.activeTags.includes(t) ? s.activeTags.filter((x) => x !== t) : [...s.activeTags, t] })),
      setTags: (activeTags) => set({ activeTags }),
      setTagMode: (tagMode) => set({ tagMode }),
      setHideNonMatching: (hideNonMatching) => set({ hideNonMatching }),
      toggleKind: (k) =>
        set((s) => ({ hiddenKinds: s.hiddenKinds.includes(k) ? s.hiddenKinds.filter((x) => x !== k) : [...s.hiddenKinds, k] })),
      setHiddenKinds: (hiddenKinds) => set({ hiddenKinds }),
      setShowInferred: (showInferred) => set({ showInferred }),
      toggleCollapsed: (g) =>
        set((s) => ({ collapsed: s.collapsed.includes(g) ? s.collapsed.filter((x) => x !== g) : [...s.collapsed, g] })),
      setCollapsed: (collapsed) => set({ collapsed }),
      openProject: (projectId, step = 0) => set({ projectId, stepIndex: step, selectedId: null, excludedProducts: [] }),
      setStep: (stepIndex) => set({ stepIndex }),
      toggleExcluded: (id) =>
        set((s) => {
          const project = findProject(s.projectId, s.userProjects);
          if (!project) return {};
          const excludedProducts = s.excludedProducts.includes(id)
            ? s.excludedProducts.filter((x) => x !== id)
            : [...s.excludedProducts, id];
          // Stay on the current step if it survives the toggle.
          const current = trimProject(project, s.excludedProducts).steps[s.stepIndex];
          const stepIndex = Math.max(0, trimProject(project, excludedProducts).steps.indexOf(current));
          return { excludedProducts, stepIndex };
        }),
      saveUserProject: (p) =>
        set((s) => ({ userProjects: [...s.userProjects.filter((x) => x.id !== p.id), { ...p, userCreated: true }] })),
      deleteUserProject: (id) =>
        set((s) => ({
          userProjects: s.userProjects.filter((x) => x.id !== id),
          projectId: s.projectId === id ? null : s.projectId,
        })),
      importUserProjects: (ps) =>
        set((s) => {
          const ids = new Set(ps.map((p) => p.id));
          return { userProjects: [...s.userProjects.filter((x) => !ids.has(x.id)), ...ps.map((p) => ({ ...p, userCreated: true }))] };
        }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    {
      name: "sf-suite-explorer",
      version: 1,
      // URL carries the view state; only user projects and the sidebar preference live in localStorage.
      partialize: (s) => ({ userProjects: s.userProjects, sidebarCollapsed: s.sidebarCollapsed }),
      // Rehydrated after mount (AppHeader) so server and first client render match.
      skipHydration: true,
    },
  ),
);

export function useAllProjects(): Project[] {
  const user = useUI((s) => s.userProjects);
  return [...seedProjects, ...user];
}

export function findProject(id: string | null, user: Project[]): Project | undefined {
  if (!id) return undefined;
  return seedProjects.find((p) => p.id === id) ?? user.find((p) => p.id === id);
}

/** The open project as the map shows it, minus toggled-off products. */
export function useActiveProject(): Project | undefined {
  const { projectId, userProjects, excludedProducts } = useUI();
  const project = findProject(projectId, userProjects);
  return useMemo(() => project && trimProject(project, excludedProducts), [project, excludedProducts]);
}
