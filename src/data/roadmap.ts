// Contentful ↔ Salesforce integration roadmap as heard from Product. Not the definitive roadmap; subject to change.

export type RoadmapStatus = "planned" | "in-progress" | "ga";

export interface RoadmapItem {
  id: string;
  title: string;
  status: RoadmapStatus;
  /** Free-text timing, e.g. "3-6 months". */
  timing?: string;
  products: string[];
  what: string;
  /** What it changes in a deal or an architecture conversation. */
  impact: string[];
  /** The next committed step among planned items. */
  nextUp?: boolean;
  /** Set when the item comes from secondhand or unconfirmed sources. */
  unconfirmed?: boolean;
}

export const roadmapAsOf = "November 2026";

/** Board lanes, left to right. */
export const roadmapStatuses: { id: RoadmapStatus; label: string; blurb: string }[] = [
  { id: "planned", label: "Planned", blurb: "On Product's list but not in build yet. \"Next up\" marks the next committed step." },
  { id: "in-progress", label: "In progress", blurb: "In build, with a target window." },
  { id: "ga", label: "GA", blurb: "Generally available: customers can install and use it today." },
];

export const roadmap: RoadmapItem[] = [
  {
    id: "b2c-connector",
    title: "B2C Commerce connector",
    status: "ga",
    products: ["contentful", "b2c-commerce"],
    what: "A B2C Commerce Cloud connector, available in the Contentful Marketplace, that brings Contentful content into the storefront.",
    impact: [
      "SFCC brands can start without custom integration work.",
      "Pairs with Storefront Next for headless builds or Page Designer for existing storefronts.",
    ],
  },
  {
    id: "optimization-crm",
    title: "CRM plugin for Contentful Optimization",
    status: "ga",
    products: ["optimization", "platform"],
    what: "A plugin that brings Salesforce CRM data into Contentful Optimization as audience attributes for personalization and experiments.",
    impact: [
      "Personalize on what Sales and Service know: lifecycle stage, account attributes, loyalty tier.",
      "Answers the \"why not MC Personalization\" question with a native CRM link.",
    ],
  },
  {
    id: "hyperforce",
    title: "Contentful on Hyperforce",
    status: "planned",
    nextUp: true,
    timing: "Next action; no date shared",
    products: ["contentful", "optimization"],
    what: "Moving Contentful off its own AWS footprint onto Hyperforce, Salesforce's public-cloud infrastructure.",
    impact: [
      "Security reviews get simpler: one infrastructure and trust program instead of two attestations.",
      "Opens Hyperforce data-residency regions to Contentful customers.",
      "Until it ships, treat Contentful as off-Hyperforce in every questionnaire.",
    ],
  },
  {
    id: "mc-email",
    title: "Marketing Cloud email builder integration",
    status: "in-progress",
    timing: "3-6 months (about Feb-May 2027)",
    products: ["contentful", "mc-growth"],
    what: "Pull Contentful entries straight into Marketing Cloud email building, so marketers assemble emails from governed content.",
    impact: [
      "Replaces today's workaround of content blocks or AMPscript HTTPGet fetching Contentful at send time.",
      "Strengthens the Content-Led Demand Gen story: author once, send everywhere.",
    ],
  },
  {
    id: "d360-connector",
    title: "First-party Data 360 connector",
    status: "planned",
    timing: "Cited as 3-6 months after the acquisition close",
    products: ["contentful", "data-360"],
    what: "A native connector that streams Contentful entries into Data 360 for segmentation and agent grounding.",
    impact: [
      "Replaces the webhook-to-Ingestion-API or MuleSoft pipe used today.",
      "Simplifies Agentforce grounding in the Knowledge Base use case.",
    ],
    unconfirmed: true,
  },
];
