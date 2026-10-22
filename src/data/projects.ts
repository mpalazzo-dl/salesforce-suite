import type { Project } from "./types";

export const seedProjects: Project[] = [
  {
    id: "fsc-portal",
    name: "FSC member / advisor portal",
    customers: "Citi, Foresters",
    summary:
      "A financial-services customer runs FSC and wants a member or advisor portal on Experience Cloud with marketing-grade content, plus an agent that answers from the same content.",
    products: ["fsc", "experience-cloud", "platform", "contentful", "data-360", "agentforce", "shield"],
    steps: [
      { edge: "fsc__experience-cloud", title: "Portal is an Experience site", body: "FSC portals are Experience Cloud sites on core, so they share FSC's data model and sharing rules." },
      { edge: "experience-cloud__contentful", title: "LWC calls CDA", body: "LWC components render Contentful entries. This replaces Salesforce CMS as the content store." },
      { edge: "fsc__contentful", title: "Personalized by core data", body: "The LWC passes FSC context (segment, product holdings) into the CDA query; core governs who sees what." },
      { edge: "contentful__data-360", title: "Copy into Data 360", body: "A webhook sends entries to the Ingestion API for segmentation and grounding. The content is copied, not stored." },
      { edge: "agentforce__data-360", title: "Agent grounds on it", body: "The service agent answers member questions over the Data 360 vector index." },
      { edge: "shield__data-360", title: "Security review", body: "Shield attests to the Data 360 copy; Contentful attests to its own store. That is two attestations." },
    ],
    talkTrack: [
      "Contentful delivers, Data 360 decides, core governs.",
      "Salesforce CMS is what Contentful supersedes in Experience Cloud.",
      "Nothing moves out of Contentful. Data 360 holds a derived copy for decisioning.",
    ],
  },
  {
    id: "sfcc-headless",
    name: "SFCC headless storefront",
    summary:
      "A B2C Commerce (Demandware) brand going headless with Storefront Next wants editorial content and merchandising outside Page Designer.",
    products: ["b2c-commerce", "contentful", "cimulate", "mc-personalization", "order-management", "data-360"],
    steps: [
      { node: "b2c-commerce", title: "SFCC is off core", body: "It has its own stack (realms/PODs) with OCAPI/SCAPI. There is no shared data model with core or Contentful." },
      { edge: "b2c-commerce__contentful", title: "CDA at render time", body: "Storefront Next (or Page Designer components) calls CDA/GraphQL at render time. Products come from SCAPI and content from Contentful." },
      { edge: "cimulate__b2c-commerce", title: "Search is catalog-only", body: "Cimulate indexes the product catalog. Contentful content still needs its own search (e.g. Algolia)." },
      { edge: "mc-personalization__b2c-commerce", title: "Personalization", body: "MC Personalization may already be in the storefront. It can decide on Contentful variants, which makes it the Ninetailed competitor." },
      { edge: "b2c-commerce__order-management", title: "Orders to core", body: "Orders flow to OMS on core. Low content relevance." },
      { edge: "b2c-commerce__data-360", title: "Profiles in Data 360", body: "Shopper data unifies in Data 360, where content metadata can join it for segmentation." },
    ],
    talkTrack: [
      "Page Designer content assets are the overlap; Contentful is the content layer across every channel, not just the storefront.",
      "Expect MC Personalization vs Ninetailed; position on the content-native authoring experience.",
    ],
  },
  {
    id: "agentforce-grounding",
    name: "Agentforce grounded on Contentful",
    summary: "A service org wants Agentforce to answer from governed, published content and to draft new entries.",
    products: ["contentful", "mulesoft", "data-360", "agentforce", "service-cloud", "slack", "shield"],
    steps: [
      { edge: "contentful__data-360", title: "Ingest published content", body: "Webhook → Ingestion API per content type, plus an unstructured stream for RAG. A first-party connector is cited as 3-6 months after close." },
      { edge: "mulesoft__contentful", title: "Or pipe via MuleSoft", body: "MuleSoft is the sanctioned pipe when the customer wants iPaaS governance in the path." },
      { edge: "agentforce__data-360", title: "Ground the agent", body: "Atlas retrieves from the Data 360 vector index." },
      { edge: "agentforce__contentful", title: "Write back through CMA/MCP", body: "Agent actions read and write entries. Content assembly claims are roadmap until shipped." },
      { edge: "agentforce__service-cloud", title: "Serve in Service", body: "Service agents and employee assist answer in the console and on web/voice." },
      { edge: "agentforce__slack", title: "Front door in Slack", body: "Employees reach the agent in Slack." },
    ],
    talkTrack: [
      "RAG reads the Data 360 copy; writes go to Contentful, the system of record.",
      "Separate what ships today from what is on the roadmap in every agent conversation.",
    ],
  },
  {
    id: "mc-email",
    name: "Marketing Cloud email content",
    summary: "Marketing teams want email modules authored once in Contentful and used in MC Engagement journeys and MC Growth.",
    products: ["mc-engagement", "mc-growth", "contentful", "platform", "data-360"],
    steps: [
      { edge: "mc-engagement__contentful", title: "Send-time fetch", body: "Content Builder blocks or AMPscript HTTPGet pull Contentful at send time. There is no shared model." },
      { edge: "mc-engagement__platform", title: "Hybrid via MC Connect", body: "Engagement is the ExactTarget stack synced to core, not shared tables." },
      { edge: "mc-growth__contentful", title: "Core-native marketing", body: "MC Growth content blocks and landing pages can pull Contentful." },
      { edge: "mc-growth__data-360", title: "Segments from Data 360", body: "Audiences come from Data 360 and can use content metadata." },
    ],
    talkTrack: ["Content Builder is a content store too; position Contentful as one source for every channel."],
  },
  {
    id: "b2b-core",
    name: "B2B Commerce on core",
    summary: "A manufacturer on B2B Commerce wants rich product storytelling and documentation in its Lightning storefront.",
    products: ["b2b-commerce", "experience-cloud", "platform", "contentful", "order-management", "industry-clouds"],
    steps: [
      { edge: "b2b-commerce__experience-cloud", title: "Storefront is a site", body: "B2B/D2C storefronts are Experience Cloud sites on core." },
      { edge: "b2b-commerce__contentful", title: "LWC → CDA", body: "A native-ish pattern: LWC components call CDA in the storefront." },
      { edge: "b2b-commerce__order-management", title: "Orders", body: "Orders run through OMS on core." },
    ],
    talkTrack: ["Experience Cloud CMS is the overlap; Contentful adds modeling, workflow and omnichannel reuse."],
  },
  {
    id: "security-review",
    name: "Security & compliance review",
    summary: "InfoSec asks where content lives and who attests to what.",
    products: ["contentful", "data-360", "shield", "platform"],
    steps: [
      { node: "contentful", title: "System of record", body: "Contentful runs on its own AWS footprint with its own compliance program. It is not on Hyperforce." },
      { edge: "contentful__data-360", title: "Derived copy", body: "Data 360 holds a derived copy for segmentation and grounding." },
      { edge: "shield__data-360", title: "Shield covers the copy", body: "Shield encrypts and monitors the Data 360 copy only." },
    ],
    talkTrack: ["Two attestations in any security review.", "Treat Hyperforce status as per tenant; verify it in the questionnaire."],
  },
];
