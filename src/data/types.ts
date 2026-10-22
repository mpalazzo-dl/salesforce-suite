export type OnCore = "yes" | "no" | "hybrid" | "partial";
export type Hyperforce = "yes" | "no" | "partial";
export type Pricing = "seat" | "volume" | "consumption" | "quota" | "org-fee" | "add-on" | "bundled" | "mixed";
export type FitLevel = "self" | "direct" | "high" | "medium" | "low" | "none";

export type GroupId =
  | "crm"
  | "experience"
  | "marketing"
  | "commerce"
  | "ai"
  | "platform"
  | "integration"
  | "contentful"
  | "analytics"
  | "collab";

export interface Group {
  id: GroupId;
  name: string;
  blurb: string;
  /** Tailwind-independent accent color, used in the graph and badges. */
  color: string;
  /** Number of product columns inside the group box. */
  cols: number;
}

export interface Product {
  id: string;
  name: string;
  shortName: string;
  formerNames: string[];
  group: GroupId;
  category: string;
  origin: string;
  acquiredYear?: number;
  onCore: OnCore;
  onCoreNote?: string;
  hyperforce: Hyperforce;
  hyperforceNote?: string;
  frontend: string;
  dataStore: string;
  pricing: Pricing;
  pricingNote: string;
  contentfulFit: {
    level: FitLevel;
    pattern: string;
    overlap?: string;
  };
  /** Manual tags; derived tags are added in tags.ts. */
  tags: TagId[];
  summary: string;
}

export type TagId =
  | "on-core"
  | "hybrid"
  | "off-core"
  | "hyperforce"
  | "lwc"
  | "headless"
  | "customer-facing"
  | "acquired"
  | "legacy"
  | "consumption"
  | "cf-overlap"
  | "cf-touchpoint"
  | "roadmap";

export interface Tag {
  id: TagId;
  label: string;
  description: string;
}

export type EdgeKind =
  | "runs-on"
  | "data-sync"
  | "ingest"
  | "consumes-content"
  | "agent-action"
  | "grounding"
  | "pipe"
  | "secures"
  | "surfaces-in"
  | "overlap"
  | "related";

export interface Relationship {
  id: string;
  from: string;
  to: string;
  kind: EdgeKind;
  /** Short label drawn on the edge. */
  label: string;
  /** What role this connection plays, shown in the detail drawer. */
  description: string;
  /** "index" = stated in the product index; "inferred" = working knowledge. */
  confidence: "index" | "inferred";
  status: "shipped" | "roadmap";
}

export interface ProjectStep {
  /** Relationship id to emphasize, or a product id to spotlight. */
  edge?: string;
  node?: string;
  title: string;
  body: string;
}

export interface Project {
  id: string;
  name: string;
  customers?: string;
  summary: string;
  products: string[];
  steps: ProjectStep[];
  talkTrack: string[];
  userCreated?: boolean;
}
