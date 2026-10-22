import type { EdgeKind, Relationship } from "./types";

export const edgeKinds: { id: EdgeKind; label: string; color: string; defaultOn: boolean }[] = [
  { id: "consumes-content", label: "Consumes Contentful content", color: "#d4a700", defaultOn: true },
  { id: "agent-action", label: "Agent action / MCP", color: "#7f56d9", defaultOn: true },
  { id: "ingest", label: "Ingests into Data 360", color: "#0176d3", defaultOn: true },
  { id: "grounding", label: "Grounds / decides on", color: "#9b6dff", defaultOn: true },
  { id: "data-sync", label: "Data sync / connector", color: "#0b827c", defaultOn: true },
  { id: "pipe", label: "Integration pipe", color: "#14b8a6", defaultOn: true },
  { id: "surfaces-in", label: "Surfaces in", color: "#e3066a", defaultOn: true },
  { id: "overlap", label: "Overlaps / competes", color: "#dc2626", defaultOn: true },
  { id: "secures", label: "Secures", color: "#64748b", defaultOn: true },
  { id: "related", label: "Related / successor", color: "#94a3b8", defaultOn: true },
  { id: "runs-on", label: "Runs on core", color: "#cbd5e1", defaultOn: false },
];

export const edgeKindById = Object.fromEntries(edgeKinds.map((k) => [k.id, k])) as Record<
  EdgeKind,
  (typeof edgeKinds)[number]
>;

type R = Omit<Relationship, "id" | "confidence" | "status"> &
  Partial<Pick<Relationship, "confidence" | "status">>;

const runsOn = (from: string, description: string): R => ({
  from,
  to: "platform",
  kind: "runs-on",
  label: "on core",
  description,
});

const raw: R[] = [
  // ── Runs on core ────────────────────────────────────────────────
  runsOn("sales-cloud", "Sales Cloud objects are core sObjects; shares tables with Service and FSC."),
  runsOn("service-cloud", "Service Cloud runs on core; Knowledge and cases are sObjects."),
  runsOn("field-service", "Field Service extends Service Cloud on core."),
  runsOn("revenue-cloud", "Revenue Cloud is a native core rebuild."),
  runsOn("cpq", "CPQ is a managed package installed in the core org."),
  runsOn("experience-cloud", "Experience sites run on core and expose core data to external users."),
  runsOn("fsc", "FSC extends the core data model."),
  runsOn("industry-clouds", "Industry clouds extend core with OmniStudio."),
  runsOn("mc-growth", "MC Growth/Advanced is built on core plus Data 360."),
  runsOn("b2b-commerce", "B2B/D2C Commerce stores catalog, carts and orders in core."),
  runsOn("order-management", "Order Management runs on core."),
  runsOn("crm-analytics", "CRM Analytics builds datasets from core data."),
  {
    from: "agentforce",
    to: "platform",
    kind: "runs-on",
    label: "authored on core",
    description: "Agents, topics and actions are configured as core metadata; Flow and Apex back the actions. Model serving runs separately.",
  },

  // ── Contentful delivery ─────────────────────────────────────────
  {
    from: "experience-cloud",
    to: "contentful",
    kind: "consumes-content",
    label: "LWC → CDA",
    description:
      "LWC components call CDA/GraphQL and render Contentful entries in Experience sites; Experience Builder drop-ins. Salesforce CMS is the internal overlap Contentful supersedes.",
  },
  {
    from: "fsc",
    to: "contentful",
    kind: "consumes-content",
    label: "portal content",
    description: "Member and advisor portals (via Experience Cloud) pull Contentful content. Relevant to Citi and Foresters.",
  },
  {
    from: "industry-clouds",
    to: "contentful",
    kind: "consumes-content",
    label: "portal content",
    description: "Same pattern as FSC: industry portals render Contentful content through LWC.",
  },
  {
    from: "service-cloud",
    to: "contentful",
    kind: "consumes-content",
    label: "help content",
    description: "Knowledge and help-center content from Contentful, surfaced through Experience Cloud or a custom LWC in the Service Console.",
  },
  {
    from: "b2c-commerce",
    to: "contentful",
    kind: "consumes-content",
    label: "CDA at render",
    description:
      "Page Designer components or a headless Storefront Next storefront call CDA at render time. There is no shared data model. Page Designer content assets are the internal overlap.",
  },
  {
    from: "b2b-commerce",
    to: "contentful",
    kind: "consumes-content",
    label: "LWC → CDA",
    description: "LWC components on core call CDA. Experience Cloud CMS is the internal overlap.",
  },
  {
    from: "mc-engagement",
    to: "contentful",
    kind: "consumes-content",
    label: "send-time fetch",
    description: "Content Builder blocks or AMPscript HTTPGet pull Contentful at send time. No shared model; Content Builder is a competing content store.",
  },
  {
    from: "mc-growth",
    to: "contentful",
    kind: "consumes-content",
    label: "content blocks",
    description: "Content blocks and landing pages on core can pull Contentful. Native content builders overlap.",
  },
  {
    from: "platform",
    to: "contentful",
    kind: "consumes-content",
    label: "CDA / GraphQL",
    description: "Custom apps, Flow, Apex and LWC consume CDA/GraphQL. The MCP/App SDK surface sits here.",
  },
  {
    from: "heroku",
    to: "contentful",
    kind: "consumes-content",
    label: "hosts apps",
    description: "Heroku hosts Contentful-driven apps and syncs to core via Heroku Connect.",
  },
  {
    from: "revenue-cloud",
    to: "contentful",
    kind: "consumes-content",
    label: "product content",
    description: "Product content for configurators. Low fit.",
  },
  {
    from: "sales-cloud",
    to: "contentful",
    kind: "consumes-content",
    label: "enablement",
    description: "Sales enablement content only. Low fit.",
  },

  // ── Agentforce ───────────────────────────────────────────────────
  {
    from: "agentforce",
    to: "contentful",
    kind: "agent-action",
    label: "CMA / MCP",
    description: "Agent actions read and write entries through the CMA or Contentful's MCP server. Claims about Agentforce content assembly are roadmap until shipped.",
  },
  {
    from: "agentforce",
    to: "data-360",
    kind: "grounding",
    label: "RAG grounding",
    description: "The Atlas reasoning loop grounds on Data 360: the vector index over ingested content plus unified profiles.",
  },
  {
    from: "agentforce",
    to: "slack",
    kind: "surfaces-in",
    label: "front door",
    description: "Slack is the primary employee surface for Agentforce.",
  },
  {
    from: "agentforce",
    to: "service-cloud",
    kind: "surfaces-in",
    label: "service agents",
    description: "Service agents and employee assist run inside Service Cloud and on web and voice channels.",
  },
  {
    from: "cimulate",
    to: "agentforce",
    kind: "related",
    label: "Agentforce Commerce",
    description: "Cimulate search is being integrated into Agentforce Commerce.",
  },

  // ── Data 360 ─────────────────────────────────────────────────────
  {
    from: "contentful",
    to: "data-360",
    kind: "ingest",
    label: "webhook → Ingestion API",
    description:
      "Today: a webhook calls the Ingestion API (streaming) per content type, plus an unstructured stream for RAG, or the sitemap connector. A first-party connector is cited as 3-6 months after close. The content is copied, not stored: Data 360 decides and never delivers.",
  },
  {
    from: "platform",
    to: "data-360",
    kind: "data-sync",
    label: "CRM connector",
    description: "Core CRM objects stream into Data 360 DLOs and are mapped to DMOs for identity resolution and segmentation.",
    confidence: "inferred",
  },
  {
    from: "mc-growth",
    to: "data-360",
    kind: "grounding",
    label: "segments",
    description: "Segments and audiences come from Data 360; Data 360 credits are bundled in the edition.",
  },
  {
    from: "mc-personalization",
    to: "data-360",
    kind: "data-sync",
    label: "folding in",
    description: "The Evergage event store is being folded toward Data 360.",
  },
  {
    from: "tableau",
    to: "data-360",
    kind: "grounding",
    label: "Tableau Next",
    description: "Tableau Next runs on Data 360, so content-performance dashboards can sit over Data 360.",
  },
  {
    from: "informatica",
    to: "data-360",
    kind: "pipe",
    label: "governance / MDM",
    description: "Informatica governs sources that feed Data 360. It is the reference model AEs cite: the source stays separate and Data 360 reads it.",
  },
  {
    from: "b2c-commerce",
    to: "data-360",
    kind: "data-sync",
    label: "commerce connector",
    description: "B2C orders, products and shopper events flow into Data 360 for unified profiles.",
    confidence: "inferred",
  },
  {
    from: "mc-engagement",
    to: "data-360",
    kind: "data-sync",
    label: "engagement data",
    description: "Engagement data and Data Extensions sync with Data 360 for segmentation and activation.",
    confidence: "inferred",
  },

  // ── Integration ──────────────────────────────────────────────────
  {
    from: "mulesoft",
    to: "contentful",
    kind: "pipe",
    label: "pipe",
    description: "MuleSoft is the sanctioned pipe that moves Contentful into Data 360 or core until a first-party connector exists; it also provides MCP connectivity.",
  },
  {
    from: "mulesoft",
    to: "data-360",
    kind: "pipe",
    label: "pipe",
    description: "MuleSoft flows load Data 360 via the Ingestion API.",
  },
  {
    from: "mulesoft",
    to: "platform",
    kind: "pipe",
    label: "core APIs",
    description: "MuleSoft connects external systems to core APIs.",
    confidence: "inferred",
  },
  {
    from: "heroku",
    to: "platform",
    kind: "data-sync",
    label: "Heroku Connect",
    description: "Heroku Connect syncs Heroku Postgres with core objects.",
  },
  {
    from: "mc-engagement",
    to: "platform",
    kind: "data-sync",
    label: "MC Connect",
    description: "MC Connect syncs contacts and data between the ExactTarget stack and core. The integration is hybrid, not shared tables.",
  },
  {
    from: "account-engagement",
    to: "platform",
    kind: "data-sync",
    label: "core sync",
    description: "Account Engagement keeps its own stack, synced to core.",
  },

  // ── Commerce ─────────────────────────────────────────────────────
  {
    from: "cimulate",
    to: "b2c-commerce",
    kind: "surfaces-in",
    label: "storefront search",
    description: "Cimulate's search/discovery UI runs in the storefront over its own product-catalog index. It does not search Contentful content.",
  },
  {
    from: "b2c-commerce",
    to: "order-management",
    kind: "data-sync",
    label: "orders",
    description: "B2C orders flow to Order Management on core for fulfillment.",
    confidence: "inferred",
  },
  {
    from: "b2b-commerce",
    to: "experience-cloud",
    kind: "related",
    label: "built on sites",
    description: "B2B/D2C storefronts are Experience Cloud sites, which is why Experience Cloud CMS overlaps here too.",
  },
  {
    from: "b2b-commerce",
    to: "order-management",
    kind: "data-sync",
    label: "orders",
    description: "Core-based storefront orders flow into Order Management.",
    confidence: "inferred",
  },

  // ── Marketing / personalization ─────────────────────────────────
  {
    from: "mc-personalization",
    to: "contentful",
    kind: "overlap",
    label: "decides variants · vs Ninetailed",
    description: "Can decide which Contentful variant to render. It is a direct competitor to Ninetailed / EXO.",
  },
  {
    from: "mc-personalization",
    to: "b2c-commerce",
    kind: "surfaces-in",
    label: "storefront SDK",
    description: "The web SDK personalizes storefront experiences and recommendations.",
    confidence: "inferred",
  },

  // ── Security / misc ─────────────────────────────────────────────
  {
    from: "shield",
    to: "data-360",
    kind: "secures",
    label: "encrypts copy",
    description: "Shield covers the copy of content in Data 360, never Contentful's store. Expect two attestations in a security review.",
  },
  {
    from: "shield",
    to: "platform",
    kind: "secures",
    label: "encrypts core",
    description: "Platform Encryption, Event Monitoring, Field Audit Trail and Data Detect on core.",
  },
  {
    from: "contentful",
    to: "slack",
    kind: "surfaces-in",
    label: "notifications",
    description: "Contentful notifications and approvals through the Slack app.",
  },
  {
    from: "cpq",
    to: "revenue-cloud",
    kind: "related",
    label: "succeeded by",
    description: "Legacy CPQ customers are being moved to the Revenue Cloud rebuild.",
    confidence: "inferred",
  },
  {
    from: "field-service",
    to: "service-cloud",
    kind: "related",
    label: "extends",
    description: "Field Service is licensed on top of Service Cloud.",
    confidence: "inferred",
  },
  {
    from: "fsc",
    to: "experience-cloud",
    kind: "related",
    label: "portals via",
    description: "FSC member and advisor portals are Experience Cloud sites.",
  },
  {
    from: "own",
    to: "platform",
    kind: "secures",
    label: "backup",
    description: "Own backs up and restores core data.",
  },
];

export const relationships: Relationship[] = raw.map((r) => ({
  confidence: "index",
  status: "shipped",
  ...r,
  id: `${r.from}__${r.to}`,
}));

export const relationshipById = Object.fromEntries(relationships.map((r) => [r.id, r])) as Record<
  string,
  Relationship
>;
