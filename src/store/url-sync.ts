"use client";

import { useEffect } from "react";
import { groups } from "@/data/groups";
import { edgeKinds } from "@/data/relationships";
import { tags } from "@/data/tags";
import type { EdgeKind, GroupId, TagId } from "@/data/types";
import { defaultHiddenKinds, useUI, type UIState } from "./ui";

const tagIds = new Set<string>(tags.map((t) => t.id));
const groupIds = new Set<string>(groups.map((g) => g.id));
const kindIds = new Set<string>(edgeKinds.map((k) => k.id));

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

function readUrl(): Partial<UIState> | null {
  const q = new URLSearchParams(window.location.search);
  if ([...q.keys()].length === 0) return null;
  return {
    selectedId: q.get("focus"),
    hops: q.get("hops") === "2" ? 2 : 1,
    activeTags: list(q.get("tags")).filter((t) => tagIds.has(t)) as TagId[],
    tagMode: q.get("mode") === "all" ? "all" : "any",
    hideNonMatching: q.get("hide") === "1",
    hiddenKinds: q.has("edges-off")
      ? (list(q.get("edges-off")).filter((k) => kindIds.has(k)) as EdgeKind[])
      : defaultHiddenKinds,
    showInferred: q.get("inferred") !== "0",
    collapsed: list(q.get("collapsed")).filter((g) => groupIds.has(g)) as GroupId[],
    projectId: q.get("project"),
    stepIndex: Number(q.get("step") ?? 0) || 0,
  };
}

export function toQuery(s: UIState): string {
  const q = new URLSearchParams();
  if (s.projectId) {
    q.set("project", s.projectId);
    if (s.stepIndex) q.set("step", String(s.stepIndex));
  } else if (s.selectedId) q.set("focus", s.selectedId);
  if (s.hops === 2) q.set("hops", "2");
  if (s.activeTags.length) q.set("tags", s.activeTags.join(","));
  if (s.tagMode === "all") q.set("mode", "all");
  if (s.hideNonMatching) q.set("hide", "1");
  if (!sameSet(s.hiddenKinds, defaultHiddenKinds)) q.set("edges-off", s.hiddenKinds.join(","));
  if (!s.showInferred) q.set("inferred", "0");
  if (s.collapsed.length) q.set("collapsed", s.collapsed.join(","));
  return q.toString().replaceAll("%2C", ",");
}

/** Two-way sync between the map's view state and the URL, so any view is shareable. */
export function useUrlSync() {
  useEffect(() => {
    const initial = readUrl();
    if (initial) useUI.setState(initial);
    const write = (s: UIState) => {
      const qs = toQuery(s);
      const next = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
      if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", next);
    };
    write(useUI.getState());
    return useUI.subscribe(write);
  }, []);
}
