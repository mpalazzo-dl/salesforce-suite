import type { Group, GroupId } from "./types";

export const groups: Group[] = [
  { id: "crm", name: "CRM Apps", blurb: "Sales, Service and quote-to-cash on core.", color: "#0176d3", cols: 2 },
  { id: "experience", name: "Experience & Industry", blurb: "Portals, sites and industry data models on core.", color: "#3ba755", cols: 2 },
  { id: "marketing", name: "Marketing", blurb: "One brand, four stacks: core rebuild, ExactTarget, Pardot, Evergage.", color: "#e3066a", cols: 2 },
  { id: "commerce", name: "Commerce", blurb: "Demandware (off core) and CloudCraze/organic (on core).", color: "#ff5d2d", cols: 2 },
  { id: "ai", name: "Agentforce 360", blurb: "The AI platform: agents authored on core, grounded on Data 360.", color: "#7f56d9", cols: 1 },
  { id: "platform", name: "Platform & Data", blurb: "Core runtime, the Data 360 lakehouse and the Shield controls.", color: "#032d60", cols: 3 },
  { id: "integration", name: "Integration & Data Mgmt", blurb: "Pipes, governance and app hosting.", color: "#0b827c", cols: 2 },
  { id: "contentful", name: "Content Layer", blurb: "Contentful, the system of record for content, and Optimization, on their own footprint.", color: "#ffda00", cols: 1 },
  { id: "analytics", name: "Analytics", blurb: "BI over core and Data 360.", color: "#5867e8", cols: 2 },
  { id: "collab", name: "Collaboration & Other", blurb: "Slack as the agent front door; backup and docs.", color: "#4a154b", cols: 3 },
];

export const groupById = Object.fromEntries(groups.map((g) => [g.id, g])) as Record<GroupId, Group>;

/** Rows of the suite map, top to bottom: experiences on top, platform in the middle, supporting below. */
export const groupRows: GroupId[][] = [
  ["crm", "experience", "marketing", "commerce"],
  ["ai", "platform", "integration", "contentful"],
  ["analytics", "collab"],
];
