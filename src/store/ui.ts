"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { edgeKinds } from "@/data/relationships";
import { seedProjects } from "@/data/projects";
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
  userProjects: Project[];

  select: (id: string | null) => void;
  setHops: (h: 1 | 2) => void;
  toggleTag: (t: TagId) => void;
  setTags: (t: TagId[]) => void;
  setTagMode: (m: TagMode) => void;
  setHideNonMatching: (v: boolean) => void;
  toggleKind: (k: EdgeKind) => void;
  setShowInferred: (v: boolean) => void;
  toggleCollapsed: (g: GroupId) => void;
  setCollapsed: (g: GroupId[]) => void;
  openProject: (id: string | null, step?: number) => void;
  setStep: (i: number) => void;
  saveUserProject: (p: Project) => void;
  deleteUserProject: (id: string) => void;
  importUserProjects: (ps: Project[]) => void;
}

export const defaultHiddenKinds = edgeKinds.filter((k) => !k.defaultOn).map((k) => k.id);

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
      userProjects: [],

      select: (id) => set({ selectedId: id, projectId: null, stepIndex: 0 }),
      setHops: (hops) => set({ hops }),
      toggleTag: (t) =>
        set((s) => ({ activeTags: s.activeTags.includes(t) ? s.activeTags.filter((x) => x !== t) : [...s.activeTags, t] })),
      setTags: (activeTags) => set({ activeTags }),
      setTagMode: (tagMode) => set({ tagMode }),
      setHideNonMatching: (hideNonMatching) => set({ hideNonMatching }),
      toggleKind: (k) =>
        set((s) => ({ hiddenKinds: s.hiddenKinds.includes(k) ? s.hiddenKinds.filter((x) => x !== k) : [...s.hiddenKinds, k] })),
      setShowInferred: (showInferred) => set({ showInferred }),
      toggleCollapsed: (g) =>
        set((s) => ({ collapsed: s.collapsed.includes(g) ? s.collapsed.filter((x) => x !== g) : [...s.collapsed, g] })),
      setCollapsed: (collapsed) => set({ collapsed }),
      openProject: (projectId, step = 0) => set({ projectId, stepIndex: step, selectedId: null }),
      setStep: (stepIndex) => set({ stepIndex }),
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
    }),
    {
      name: "sf-suite-explorer",
      version: 1,
      // URL carries the view state; only user projects live in localStorage.
      partialize: (s) => ({ userProjects: s.userProjects }),
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
