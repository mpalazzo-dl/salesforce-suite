import type { Product, Tag, TagId } from "./types";

export const tags: Tag[] = [
  { id: "on-core", label: "On core", description: "Runs on the Force.com multitenant runtime: sObjects, SOQL, Flow/Apex, sharing rules." },
  { id: "hybrid", label: "Hybrid", description: "Own data store with a deep core sync, or partly on core." },
  { id: "off-core", label: "Off core", description: "Its own platform; integrates via API, connector or Data 360." },
  { id: "hyperforce", label: "Hyperforce", description: "Available on Salesforce's public-cloud infrastructure (verify per tenant)." },
  { id: "lwc", label: "LWC surface", description: "UI extensible with Lightning Web Components, so an LWC can call Contentful's CDA." },
  { id: "headless", label: "Headless / API-first", description: "API- or SDK-first; can run without its own UI." },
  { id: "customer-facing", label: "Customer-facing UI", description: "Ships an end-customer UI: storefront, portal, email, agent." },
  { id: "acquired", label: "Acquired", description: "Came from an acquisition, so usually its own stack." },
  { id: "legacy", label: "Legacy", description: "Being replaced or sunset." },
  { id: "consumption", label: "Consumption-priced", description: "Metered credits per activity." },
  { id: "cf-overlap", label: "Contentful overlap", description: "Has a native content store or feature that overlaps Contentful or Contentful Optimization." },
  { id: "cf-touchpoint", label: "Contentful touchpoint", description: "Contentful fit is medium or better today." },
  { id: "roadmap", label: "Roadmap claims", description: "Some of the Contentful story depends on unshipped features." },
];

export const tagById = Object.fromEntries(tags.map((t) => [t.id, t])) as Record<TagId, Tag>;

/** Manual tags plus tags derived from the index columns. */
export function tagsFor(p: Product): TagId[] {
  const out = new Set<TagId>(p.tags);
  if (p.onCore === "yes") out.add("on-core");
  else if (p.onCore === "hybrid" || p.onCore === "partial") out.add("hybrid");
  else out.add("off-core");
  if (p.hyperforce !== "no") out.add("hyperforce");
  if (p.acquiredYear) out.add("acquired");
  if (p.pricing === "consumption") out.add("consumption");
  if (["self", "direct", "high", "medium"].includes(p.contentfulFit.level)) out.add("cf-touchpoint");
  return tags.map((t) => t.id).filter((id) => out.has(id));
}
