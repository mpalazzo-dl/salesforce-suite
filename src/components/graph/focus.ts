import { productById, products } from "@/data/products";
import { relationships } from "@/data/relationships";
import { tagsFor } from "@/data/tags";
import type { EdgeKind, Project, Relationship, TagId } from "@/data/types";
import type { TagMode } from "@/store/ui";

export function visibleRelationships(hiddenKinds: EdgeKind[], showInferred: boolean): Relationship[] {
  return relationships.filter((r) => !hiddenKinds.includes(r.kind) && (showInferred || r.confidence === "index"));
}

export function seedsFor(selectedId: string): string[] {
  if (selectedId.startsWith("group:")) {
    const g = selectedId.slice(6);
    return products.filter((p) => p.group === g).map((p) => p.id);
  }
  return productById[selectedId] ? [selectedId] : [];
}

export interface Focus {
  nodes: Set<string>;
  edges: Set<string>;
  /** Hop distance from the seed set, for styling. */
  distance: Map<string, number>;
  /** The edge or node a project walkthrough step is pointing at. */
  stepEdge?: string;
  stepNodes?: Set<string>;
}

/** Breadth-first neighborhood over the visible edges, treated as undirected. */
export function neighborhood(seeds: string[], edges: Relationship[], hops: number): Focus {
  const distance = new Map(seeds.map((s) => [s, 0]));
  const used = new Set<string>();
  let frontier = seeds;
  for (let d = 1; d <= hops; d++) {
    const next: string[] = [];
    for (const e of edges) {
      for (const [a, b] of [
        [e.from, e.to],
        [e.to, e.from],
      ]) {
        if (frontier.includes(a) && (distance.get(b) ?? Infinity) >= d - 1) {
          used.add(e.id);
          if (!distance.has(b)) {
            distance.set(b, d);
            next.push(b);
          }
        }
      }
    }
    frontier = next;
  }
  return { nodes: new Set(distance.keys()), edges: used, distance };
}

export function projectFocus(project: Project, edges: Relationship[], stepIndex: number): Focus {
  const nodes = new Set(project.products);
  const used = new Set(edges.filter((e) => nodes.has(e.from) && nodes.has(e.to)).map((e) => e.id));
  const step = project.steps[stepIndex];
  const stepNodes = new Set<string>();
  if (step?.edge) {
    const [a, b] = step.edge.split("__");
    stepNodes.add(a).add(b);
    used.add(step.edge);
  }
  if (step?.node) stepNodes.add(step.node);
  return { nodes, edges: used, distance: new Map(), stepEdge: step?.edge, stepNodes };
}

export function matchesTags(productId: string, active: TagId[], mode: TagMode): boolean {
  if (!active.length) return true;
  const t = tagsFor(productById[productId]);
  return mode === "all" ? active.every((x) => t.includes(x)) : active.some((x) => t.includes(x));
}
