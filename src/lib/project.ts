import type { Project, ProjectStep } from "@/data/types";

/** True when the step spotlights, or runs along an edge touching, any of `ids`. */
export const stepInvolves = (st: ProjectStep, ids: Set<string>) =>
  Boolean((st.node && ids.has(st.node)) || (st.edge && st.edge.split("__").some((id) => ids.has(id))));

/** The project with toggled-off products removed, along with every step that involves them. */
export function trimProject(project: Project, excluded: string[]): Project {
  if (!excluded.length) return project;
  const out = new Set(excluded);
  return {
    ...project,
    products: project.products.filter((id) => !out.has(id)),
    steps: project.steps.filter((st) => !stepInvolves(st, out)),
  };
}
