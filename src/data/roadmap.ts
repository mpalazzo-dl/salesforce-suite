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
  /** Seed project ids this item strengthens. */
  projects?: string[];
  /** The next committed step among planned items. */
  nextUp?: boolean;
  /** Set when the item comes from secondhand or unconfirmed sources. */
  unconfirmed?: boolean;
  /** Marketplace listings and docs. */
  links?: { label: string; href: string }[];
}

const mp = (slug: string) => `https://www.contentful.com/marketplace/${slug}/`;
const help = (slug: string) => `https://www.contentful.com/help/apps/salesforce-ecosystem/${slug}/`;

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
    projects: ["sfcc-headless"],
    what: "The Salesforce Commerce Cloud app in the Contentful Marketplace adds a picker to Short Text fields so editors can reference SFCC products, variants, categories, customer groups, promotions, campaigns, coupons and stores. Contentful stores the Commerce Cloud ID; the storefront loads current data from SFCC at render time. The November 2026 update added richer product previews, locale-aware names and the new resource types.",
    impact: [
      "Editors build product-led content, such as campaign pages, lookbooks and buying guides, without copying product data by hand.",
      "SFCC stays the source of truth for products and pricing; Contentful stores the reference and the storytelling around it.",
      "Promotions, campaigns and coupons can now be referenced directly, so promo content stays tied to the real SFCC promotion.",
    ],
    links: [
      { label: "Marketplace", href: mp("salesforce-commerce-cloud") },
      { label: "Docs", href: help("salesforce-commerce-cloud-connector") },
    ],
  },
  {
    id: "mc-next-sync",
    title: "Marketing Cloud Next Content Sync",
    status: "ga",
    timing: "Released Nov 16, 2026",
    products: ["contentful", "mc-growth"],
    projects: ["omnichannel-marketing"],
    what: "Syncs any Contentful content type into a Marketing Cloud Next Marketing Object: one content type to one Marketing Object, field to field. Admins can generate the Marketing Object straight from a content type, and editors can push a single entry from the entry sidebar. One way only: edits made in Marketing Cloud Next are overwritten on the next publish or backfill.",
    impact: [
      "Governed Contentful content becomes native Marketing Cloud Next data for emails and journeys, with no middleware.",
      "Reference, media and Rich Text fields don't sync yet, so model flat marketing fields (headline, CTA, image URL) for this use.",
    ],
    links: [
      { label: "Marketplace", href: mp("salesforce-marketing-cloud-next") },
      { label: "Docs", href: help("salesforce-marketing-cloud-next") },
    ],
  },
  {
    id: "mc-engagement-sync",
    title: "Marketing Cloud Engagement Content Sync",
    status: "ga",
    timing: "Released Nov 16, 2026",
    products: ["contentful", "mc-engagement"],
    projects: ["omnichannel-marketing"],
    what: "Syncs Contentful content types into Marketing Cloud Engagement Data Extensions and keeps the rows current on every publish. Unpublishing marks rows inactive so withdrawn content drops out of campaigns. One way, with Contentful as the source of truth. Set up in about 15 minutes with an Installed Package client ID and secret.",
    impact: [
      "Replaces the content block and AMPscript HTTPGet workarounds: emails read Contentful content from a Data Extension like any other data.",
      "Very large content types (thousands of entries) can time out during a backfill.",
    ],
    links: [
      { label: "Marketplace", href: mp("salesforce-marketing-cloud-engagement-sync") },
      { label: "Docs", href: help("salesforce-marketing-cloud-engagement-content-sync") },
    ],
  },
  {
    id: "mc-form-selector",
    title: "Marketing Cloud Form Selector",
    status: "ga",
    timing: "Released Nov 16, 2026",
    products: ["contentful", "mc-growth"],
    projects: ["omnichannel-marketing"],
    what: "Lets editors search published Marketing Cloud Next (Growth or Advanced) forms and attach them to Contentful entries through a JSON field. It stores the form's identifiers, such as contentKey, but doesn't render the form: the front end needs display code. One Salesforce org per space and environment; sandboxes aren't supported yet.",
    impact: [
      "Lead capture on Contentful-built pages feeds Marketing Cloud Next directly, without hand-pasting embed codes.",
      "Some docs say Growth and others say Next; Growth is the former name, so either edition works.",
    ],
    links: [
      { label: "Marketplace", href: mp("salesforce-marketing-cloud-form-selector") },
      { label: "Docs", href: help("marketing-cloud-form-selector") },
    ],
  },
  {
    id: "asset-selector-sfcms",
    title: "Contentful Asset Selector in Salesforce",
    status: "ga",
    timing: "Released Nov 16, 2026",
    products: ["contentful", "experience-cloud"],
    projects: ["fsc-portal", "knowledge-base"],
    what: "Brings the Contentful media library into Salesforce CMS. Authors open the image selector in a CMS workspace and pick Contentful assets from the External tab. Assets are referenced, not copied. Admins connect spaces and enable them per workspace, with Admin and User permission sets on the Salesforce side.",
    impact: [
      "One source of truth for brand media across Contentful and Experience Cloud sites, with no download and re-upload.",
      "A replaced file in Contentful must be selected again in Salesforce CMS.",
    ],
    links: [
      { label: "Marketplace", href: mp("contentful-asset-selector-in-salesforce") },
      { label: "Docs", href: help("contentful-asset-selector-in-salesforce") },
    ],
  },
  {
    id: "optimization-crm",
    title: "CRM plugin for Contentful Optimization",
    status: "ga",
    products: ["optimization", "platform"],
    projects: ["sfcc-headless", "omnichannel-marketing"],
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
    projects: ["fsc-portal", "knowledge-base"],
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
    projects: ["omnichannel-marketing"],
    what: "Pull Contentful entries straight into Marketing Cloud email building, so marketers assemble emails from governed content.",
    impact: [
      "The Content Sync apps (GA Nov 2026) already move content into Marketing Objects and Data Extensions; this item is the in-builder authoring experience on top.",
      "Strengthens the Content-Led Demand Gen story: author once, send everywhere.",
    ],
  },
  {
    id: "d360-connector",
    title: "First-party Data 360 connector",
    status: "planned",
    timing: "Cited as 3-6 months after the acquisition close",
    products: ["contentful", "data-360"],
    projects: ["knowledge-base", "fsc-portal", "omnichannel-marketing"],
    what: "A native connector that streams Contentful entries into Data 360 for segmentation and agent grounding.",
    impact: [
      "Replaces the webhook-to-Ingestion-API or MuleSoft pipe used today.",
      "Simplifies Agentforce grounding in the Knowledge Base use case.",
    ],
    unconfirmed: true,
  },
];
