// Reference sections from the product index: naming reset, acquisitions, layers, plug-in surfaces.

export const namingNote =
  'Names reset in September 2026: the October 2025 "Agentforce Sales / Agentforce Service" prefixes were dropped and the Cloud names returned, Headless 360 became the Salesforce Platform again, and only Agentforce 360 (the AI platform) and Data 360 (ex-Data Cloud) kept their new names. Expect decks and customers to mix both vocabularies.';

export const naming: { old: string; current: string; productId: string; note?: string }[] = [
  { old: "Agentforce Sales", current: "Sales Cloud", productId: "sales-cloud", note: "Oct 2025 prefix dropped Sept 2026" },
  { old: "Agentforce Service", current: "Service Cloud", productId: "service-cloud", note: "Oct 2025 prefix dropped Sept 2026" },
  { old: "Headless 360", current: "Salesforce Platform", productId: "platform", note: "Renamed back Sept 2026" },
  { old: "Data Cloud", current: "Data 360", productId: "data-360", note: "Kept new name" },
  { old: "Einstein Copilot", current: "Agentforce 360", productId: "agentforce", note: "Kept new name" },
  { old: "Demandware / SFCC", current: "B2C Commerce Cloud", productId: "b2c-commerce" },
  { old: "ExactTarget", current: "Marketing Cloud Engagement", productId: "mc-engagement" },
  { old: "Pardot", current: "Account Engagement", productId: "account-engagement" },
  { old: "Evergage / Interaction Studio", current: "Marketing Cloud Personalization", productId: "mc-personalization" },
  { old: "Ninetailed / Contentful Personalization", current: "Contentful Optimization", productId: "optimization" },
  { old: "SteelBrick", current: "Salesforce CPQ (legacy)", productId: "cpq" },
  { old: "CloudCraze", current: "B2B / D2C Commerce", productId: "b2b-commerce" },
  { old: "Community Cloud", current: "Experience Cloud", productId: "experience-cloud" },
  { old: "Tableau CRM / Einstein Analytics", current: "CRM Analytics", productId: "crm-analytics" },
  { old: "Vlocity", current: "Industry Clouds (OmniStudio)", productId: "industry-clouds" },
];

export const acquisitions: { date: string; year: number; company: string; foldsInto: string; status: string; productId?: string }[] = [
  { date: "June 2026 (signed)", year: 2026.5, company: "Contentful", foldsInto: "Content layer across Customer 360, Agentforce, Salesforce Platform", status: "Close expected fiscal Q3 FY27 (Aug-Oct 2026); AEs cite a first-party Data 360 connector 3-6 months after close", productId: "contentful" },
  { date: "March 2026 (closed)", year: 2026.2, company: "Cimulate", foldsInto: "Commerce Cloud search and discovery", status: "Integrating into Agentforce Commerce", productId: "cimulate" },
  { date: "2025", year: 2025, company: "Informatica", foldsInto: "Data 360 governance, MDM, catalog", status: "Closed; coexisting platform", productId: "informatica" },
  { date: "2025", year: 2025, company: "Convergence AI, Qualified, Momentum, Regrello", foldsInto: "Agentforce (agents, pipeline, workflow)", status: "Closed", productId: "agentforce" },
  { date: "2024", year: 2024, company: "Own", foldsInto: "Backup and recovery", status: "Closed", productId: "own" },
  { date: "2021", year: 2021, company: "Slack", foldsInto: "Collaboration; Agentforce front door", status: "Own platform", productId: "slack" },
  { date: "2020", year: 2020, company: "Vlocity / Evergage", foldsInto: "Industry Clouds (OmniStudio) / MC Personalization", status: "Integrated", productId: "industry-clouds" },
  { date: "2019", year: 2019, company: "Tableau / ClickSoftware", foldsInto: "Analytics / Field Service", status: "Integrated", productId: "tableau" },
  { date: "2018", year: 2018, company: "MuleSoft / CloudCraze", foldsInto: "Integration / B2B Commerce", status: "Integrated", productId: "mulesoft" },
  { date: "2016", year: 2016, company: "Demandware / Quip", foldsInto: "B2C Commerce / Docs", status: "Integrated", productId: "b2c-commerce" },
  { date: "2015", year: 2015, company: "SteelBrick", foldsInto: "CPQ", status: "Legacy", productId: "cpq" },
  { date: "2013", year: 2013, company: "ExactTarget (incl. Pardot)", foldsInto: "MC Engagement / Account Engagement", status: "Own stack", productId: "mc-engagement" },
  { date: "2010", year: 2010, company: "Heroku", foldsInto: "PaaS", status: "Own AWS", productId: "heroku" },
];

export const layers: { id: string; name: string; productId?: string; what: string; workload: string; why: string }[] = [
  { id: "core", name: "Salesforce Platform (core)", productId: "platform", what: "Metadata-driven multitenant runtime: sObjects, Apex, Flow, LWC, sharing model, governor limits", workload: "OLTP: read one, edit one, fire automation", why: "Where Experience Cloud, FSC, Service agents and core-based commerce consume content" },
  { id: "d360", name: "Data 360", productId: "data-360", what: "Iceberg lakehouse on Hyperforce with a distributed SQL engine, plus CDP semantics: DLO/DMO model, identity resolution, segments, calculated insights, real-time profile store, vector/search index", workload: "OLAP: scan billions of rows; batch and streaming ingest; zero-copy to Snowflake/Databricks/BigQuery", why: "Holds a derived copy of content for segmentation and grounding; not a delivery API (latency, cost, no draft/published states, flat tables)" },
  { id: "af", name: "Agentforce 360", productId: "agentforce", what: "Agent Builder, Agent Script, Prompt Builder, Voice, Observability; Atlas Reasoning Engine; Einstein Trust Layer", workload: "LLM planning loop grounded on core + Data 360", why: "Agents call Contentful via actions/MCP; RAG reads the Data 360 copy" },
  { id: "mule", name: "MuleSoft", productId: "mulesoft", what: "Anypoint iPaaS and API gateway; connector library; Composer for clicks-not-code", workload: "Integration flows, API management", why: "The sanctioned pipe for Contentful to Data 360 or core before a first-party connector exists" },
  { id: "infa", name: "Informatica", productId: "informatica", what: "IDMC: MDM, data quality, catalog, lineage", workload: "Governance over sources feeding Data 360", why: "Reference model the AE cited: the source stays separate and Data 360 reads it" },
  { id: "hf", name: "Hyperforce + Shield", productId: "shield", what: "Public-cloud hosting layer (residency, compliance envelope) and the security add-on (Platform Encryption, Event Monitoring, Field Audit Trail, Data Detect)", workload: "Infra and controls", why: "Shield covers core and Data 360 data only; Contentful keeps its own compliance program" },
];

export const surfaces: { surface: string; productIds: string[]; pattern: string; overlap: string }[] = [
  { surface: "Experience Cloud / FSC portals", productIds: ["experience-cloud", "fsc"], pattern: "LWC components call CDA; Experience Builder drop-ins", overlap: "Salesforce CMS (the product Contentful effectively replaces)" },
  { surface: "B2C Commerce (Demandware)", productIds: ["b2c-commerce"], pattern: "Page Designer components or a Storefront Next headless storefront call CDA; no shared data model", overlap: "Page Designer content assets; Cimulate for product search only" },
  { surface: "B2B / D2C Commerce", productIds: ["b2b-commerce"], pattern: "LWC on core calls CDA", overlap: "Experience Cloud CMS" },
  { surface: "Marketing Cloud Engagement", productIds: ["mc-engagement"], pattern: "Content Builder blocks or AMPscript HTTPGet at send time", overlap: "Content Builder as a content store" },
  { surface: "Marketing Cloud Growth / Advanced", productIds: ["mc-growth"], pattern: "Content blocks on core; segments from Data 360", overlap: "Native content builders" },
  { surface: "Marketing Cloud Personalization", productIds: ["mc-personalization"], pattern: "Decides which Contentful variant to render", overlap: "Contentful Optimization / EXO" },
  { surface: "Agentforce", productIds: ["agentforce"], pattern: "Actions over CMA/MCP; grounding via Data 360 ingest (Ingestion API or sitemap connector today; first-party connector on roadmap)", overlap: "Agentforce content assembly claims are roadmap until shipped" },
  { surface: "Data 360", productIds: ["data-360"], pattern: "Webhook to Ingestion API (streaming) per content type; unstructured stream for RAG; MuleSoft as the pipe", overlap: 'None; confirm "copied, not stored" in every conversation' },
  { surface: "Shield / security", productIds: ["shield"], pattern: "Shield covers the Data 360 copy; Contentful attests separately", overlap: "Two attestations in any security review" },
];

export const columnGlossary: { column: string; meaning: string }[] = [
  { column: "On core", meaning: 'Runs on the Force.com multitenant runtime: data is sObjects, queryable with SOQL, automatable with Flow/Apex, governed by sharing rules. "Hybrid" = own data store with a deep core sync.' },
  { column: "Hyperforce", meaning: "Hosted on Salesforce's public-cloud infrastructure layer (AWS/Azure/GCP, region-selectable). Orthogonal to core: a product can be on Hyperforce without being on core, and some core orgs are still in first-party data centers." },
  { column: "Frontend", meaning: "Ships an end-user or customer-facing UI (storefront, portal, app), not just an admin console or API." },
  { column: "Data store", meaning: "Where the product's primary data lives. Two products on core share tables; anything else integrates via API, connector or Data 360." },
  { column: "Pricing", meaning: "Seat = per user/month. Volume = tied to a business metric (GMV, contacts, messages). Consumption = metered credits per activity. Quota = capped, not billed." },
  { column: "Contentful fit", meaning: "How Contentful plugs in today, independent of the post-close roadmap." },
];
