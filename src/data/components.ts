// Named tools inside a product that customers often mention as if they were products.

export interface ProductPart {
  name: string;
  what: string;
  /** Other names for this part, so search finds it. */
  aka?: string[];
}

export const productParts: Record<string, ProductPart[]> = {
  platform: [
    { name: "Lightning Experience", what: "The standard web UI for every core app: record pages, list views, home pages and the utility bar." },
    { name: "Lightning App Builder", what: "Drag-and-drop editor for record, home and app pages, built from standard and custom components." },
    { name: "Lightning Web Components (LWC)", what: "Salesforce's standards-based JavaScript component model. It is how custom UI is built on core, and how a component would call Contentful's CDA.", aka: ["LWC"] },
    { name: "Flow Builder", what: "Visual automation tool for record-triggered, scheduled, screen and orchestration flows. It has largely replaced Process Builder and Workflow Rules.", aka: ["Flow"] },
    { name: "Apex", what: "Salesforce's server-side, Java-like language for triggers, classes and callouts, subject to governor limits." },
    { name: "Setup / Object Manager", what: "The admin area for configuring objects, fields, security, users and integrations." },
    { name: "DevOps Center / Salesforce CLI", what: "Tools for moving metadata between sandboxes and production with source control.", aka: ["SFDX", "sf CLI"] },
    { name: "AppExchange", what: "Salesforce's marketplace for managed packages and partner apps installed into orgs." },
  ],
  "data-360": [
    { name: "Data Streams", what: "The connectors that bring data in: core CRM, Marketing Cloud, Commerce, cloud storage, and the Ingestion API for custom sources such as Contentful webhooks." },
    { name: "Ingestion API", what: "Streaming and bulk API for pushing data from any external system into Data 360." },
    { name: "Data Model / Identity Resolution", what: "Mapping of raw DLOs to standard DMOs, plus rulesets that merge records into unified profiles." },
    { name: "Segmentation & Activation", what: "Audience builder and the targets segments are sent to, such as Marketing Cloud and ad platforms." },
    { name: "Calculated / Streaming Insights", what: "SQL-defined metrics computed over profiles in batch or in real time." },
    { name: "Search Index & Retrievers", what: "Vector and hybrid indexes over unstructured content that Agentforce uses for RAG grounding.", aka: ["Vector database"] },
    { name: "Zero Copy", what: "Federation with Snowflake, Databricks, BigQuery and Redshift without moving data.", aka: ["BYOL", "Data federation"] },
  ],
  shield: [
    { name: "Platform Encryption", what: "Encryption at rest for fields, files and Data 360 data, with customer-controlled keys (BYOK or cache-only)." },
    { name: "Event Monitoring", what: "Detailed event logs plus real-time Transaction Security policies." },
    { name: "Field Audit Trail", what: "Field history retained for up to ten years." },
    { name: "Data Detect", what: "Scans data to find and classify sensitive information." },
  ],
  agentforce: [
    { name: "Agent Builder", what: "Where admins define an agent's topics, instructions and actions, and test it conversationally." },
    { name: "Agent Script", what: "A scripting layer that mixes deterministic steps with LLM reasoning for more predictable agents." },
    { name: "Prompt Builder", what: "Tool for building grounded prompt templates that agents and Flows call." },
    { name: "Testing Center", what: "Batch-tests agent utterances before deployment." },
    { name: "Atlas Reasoning Engine", what: "The planner that decides which topic and actions to run for each request." },
    { name: "Einstein Trust Layer", what: "Data masking, toxicity checks, audit trail and zero data retention with LLM providers." },
    { name: "Agentforce Voice", what: "Voice-channel agents for contact centers." },
  ],
  "sales-cloud": [
    { name: "Einstein Activity Capture", what: "Syncs email and calendar activity to Salesforce records automatically." },
    { name: "Sales Engagement", what: "Cadences and work queues for SDR outreach (formerly High Velocity Sales).", aka: ["High Velocity Sales"] },
    { name: "Collaborative Forecasts", what: "Forecasting by rep, team, product and territory." },
    { name: "Enablement", what: "In-app sales programs and content for onboarding and coaching reps." },
  ],
  "service-cloud": [
    { name: "Service Console", what: "The tabbed agent workspace with case, customer history and Knowledge side by side." },
    { name: "Omni-Channel", what: "Routing engine that assigns work by skill, capacity and priority." },
    { name: "Salesforce Knowledge", what: "The built-in article base used by agents, help centers and Agentforce. It is the main place Contentful overlaps in service.", aka: ["Knowledge"] },
    { name: "Service Cloud Voice", what: "Telephony integrated into the console, usually through Amazon Connect." },
    { name: "Messaging for In-App and Web", what: "Chat and messaging channels, also used to deploy Agentforce on websites.", aka: ["Embedded Messaging", "Live Agent"] },
  ],
  "field-service": [
    { name: "Dispatcher Console", what: "The scheduling Gantt chart and map dispatchers work from." },
    { name: "Field Service Mobile", what: "The offline-capable technician app." },
    { name: "Scheduling Optimization", what: "Engine that builds schedules from skills, travel time and SLAs." },
  ],
  "revenue-cloud": [
    { name: "Product Catalog Management", what: "Defines products, bundles, attributes and classifications." },
    { name: "Salesforce Pricing", what: "API-first pricing procedures and price waterfalls." },
    { name: "Dynamic Revenue Orchestrator", what: "Orchestrates orders through fulfillment steps.", aka: ["DRO"] },
    { name: "Billing", what: "Invoicing, payments and revenue schedules." },
  ],
  cpq: [
    { name: "Quote Line Editor", what: "The grid where reps configure bundles and discounts." },
    { name: "Quote Templates", what: "PDF quote document generation." },
    { name: "Salesforce Billing", what: "The legacy billing add-on that pairs with CPQ." },
  ],
  "experience-cloud": [
    { name: "Experience Builder", what: "The drag-and-drop site editor for pages, themes, navigation and audiences." },
    { name: "LWR sites", what: "Lightning Web Runtime templates: the modern, fast, LWC-only site framework. It is the best target for Contentful-driven components.", aka: ["Build Your Own (LWR)"] },
    { name: "Aura sites", what: "The older site templates such as Customer Service and Partner Central; more flexible but slower." },
    { name: "Salesforce CMS / CMS Workspaces", what: "Salesforce's built-in content tool for sites. It is what Contentful supersedes.", aka: ["Enhanced CMS", "Digital Experiences app"] },
    { name: "PRM", what: "Partner Relationship Management: partner portals with deal registration and lead distribution." },
  ],
  fsc: [
    { name: "Household / Relationship Center", what: "Visualizes household and relationship-group structures." },
    { name: "Action Plans", what: "Templated task lists for onboarding and service processes." },
    { name: "Compliant Data Sharing", what: "Fine-grained, compliance-driven record sharing for advisors and bankers." },
    { name: "OmniStudio", what: "The guided-process toolkit (OmniScripts and FlexCards) used for account opening and servicing." },
  ],
  "industry-clouds": [
    { name: "OmniStudio", what: "Toolkit shared across industry clouds: OmniScripts for guided flows, FlexCards for summaries, Integration Procedures and Data Mappers for back-end calls.", aka: ["Vlocity"] },
    { name: "OmniScripts", what: "Multi-step guided UIs such as enrollments, applications and claims." },
    { name: "FlexCards", what: "Contextual summary cards that pull data from several sources." },
    { name: "Health Cloud / Public Sector / Communications / Manufacturing / Consumer Goods", what: "The individual industry clouds, each with its own data model on core." },
  ],
  "mc-growth": [
    { name: "Campaign Brief / Agentforce Marketing", what: "Agent-assisted campaign creation, from brief to segment to content." },
    { name: "Email & Landing Page Builders", what: "Drag-and-drop builders that assemble content blocks." },
    { name: "Marketing Flows", what: "Flow-based journey orchestration on core." },
  ],
  "mc-engagement": [
    { name: "Email Studio", what: "Building, testing and sending email." },
    { name: "Journey Builder", what: "Visual multi-step, multi-channel journey canvas." },
    { name: "Content Builder", what: "Asset library for emails, content blocks and images. It is a content store that overlaps Contentful." },
    { name: "Contact Builder / Data Extensions", what: "The data model: tables of subscribers and attributes." },
    { name: "Automation Studio", what: "Scheduled imports, SQL queries and file transfers." },
    { name: "CloudPages", what: "Landing pages and microsites hosted in MC Engagement." },
    { name: "Mobile Studio", what: "SMS (MobileConnect) and push (MobilePush).", aka: ["MobileConnect", "MobilePush"] },
    { name: "AMPscript / SSJS", what: "Scripting languages for personalization; HTTPGet can pull Contentful content at send time." },
  ],
  "account-engagement": [
    { name: "Engagement Studio", what: "Nurture program builder." },
    { name: "Forms & Landing Pages", what: "Lead capture assets." },
    { name: "B2B Marketing Analytics", what: "CRM Analytics-based campaign reporting." },
  ],
  "mc-personalization": [
    { name: "Sitemap", what: "JavaScript configuration that captures behavior and catalog data on the website." },
    { name: "Web Campaigns", what: "Targeted experiences rendered into content zones." },
    { name: "Recipes", what: "Recommendation strategies (Einstein Recipes)." },
  ],
  "b2c-commerce": [
    { name: "Business Manager", what: "The back-office console that comes with B2C Commerce, not a separate product. Merchandisers manage catalogs, price books, inventory, promotions, campaigns, search and Page Designer pages; admins configure sites, locales and code versions.", aka: ["BM"] },
    { name: "Page Designer", what: "Visual page builder inside Business Manager that assembles developer-built components. It overlaps with Contentful for editorial pages." },
    { name: "SFRA", what: "Storefront Reference Architecture: the server-rendered, cartridge-based storefront template.", aka: ["SiteGenesis (predecessor)"] },
    { name: "Storefront Next", what: "The current headless storefront stack on SCAPI, succeeding PWA Kit and Managed Runtime.", aka: ["PWA Kit (predecessor)", "Composable Storefront"] },
    { name: "SCAPI / OCAPI", what: "Shopper and admin APIs; SCAPI is the modern API family used by headless builds." },
    { name: "Cartridges", what: "Packaged code modules that make up a storefront and its integrations, including the Contentful integration." },
    { name: "Einstein Recommendations", what: "Product recommendations and predictive sort." },
  ],
  "b2b-commerce": [
    { name: "Commerce App", what: "The core console for setting up stores, catalogs, buyer groups and pricing." },
    { name: "LWR Store", what: "The storefront, built as an Experience Cloud LWR site." },
    { name: "Checkout Flows", what: "Flow-based, customizable checkout." },
  ],
  "order-management": [
    { name: "Order Summary", what: "The central record for an order's lifecycle." },
    { name: "Omnichannel Inventory", what: "Real-time inventory availability across locations." },
  ],
  cimulate: [{ name: "Commerce search / discovery", what: "Semantic product search embedded in storefronts and shopping agents." }],
  mulesoft: [
    { name: "Anypoint Platform", what: "The umbrella for API design, build, deploy and manage." },
    { name: "Anypoint Code Builder", what: "IDE for building Mule apps." },
    { name: "CloudHub 2.0", what: "Managed runtime for deployed integrations." },
    { name: "Anypoint Exchange", what: "Catalog of connectors, APIs and templates." },
    { name: "API Manager / Flex Gateway", what: "API policies, security and gateways." },
    { name: "MuleSoft Composer", what: "No-code integration flows for admins." },
  ],
  informatica: [
    { name: "Cloud Data Integration", what: "ETL and ELT pipelines." },
    { name: "MDM", what: "Golden records for customers, products and suppliers." },
    { name: "Data Governance & Catalog", what: "Catalog, lineage and policy management." },
  ],
  heroku: [
    { name: "Heroku Connect", what: "Bidirectional sync between Heroku Postgres and core objects." },
    { name: "AppLink", what: "Exposes Heroku apps as actions to Flow, Apex and Agentforce." },
    { name: "Private Spaces", what: "Network-isolated runtime environments." },
  ],
  contentful: [
    { name: "Web app", what: "The editor workspace for modeling, authoring, localizing and publishing." },
    { name: "Studio / Experiences", what: "Visual page assembly with developer-registered components." },
    { name: "Content Delivery API / GraphQL", what: "Read APIs and CDN for published content; the Preview API serves drafts.", aka: ["CDA", "CPA"] },
    { name: "Content Management API", what: "Write API used by integrations and agents.", aka: ["CMA"] },
    { name: "Launch / Workflows", what: "Releases and approval workflows." },
    { name: "App Framework / Marketplace", what: "Extensions inside the editor, including Salesforce-related apps." },
    { name: "MCP server", what: "Lets AI agents read and write content." },
  ],
  optimization: [
    { name: "Audiences", what: "Visitor segments that decide who sees which variant." },
    { name: "Experiences", what: "Personalized variants of Contentful entries." },
    { name: "Experiments", what: "A/B tests over content variants." },
    { name: "SDKs", what: "Pick and render the chosen variant in the frontend." },
  ],
  tableau: [
    { name: "Tableau Cloud / Server / Desktop", what: "Hosted, self-hosted and authoring editions." },
    { name: "Tableau Pulse", what: "AI-generated metric digests." },
    { name: "Tableau Next", what: "Agentic analytics on Data 360 with a semantic layer." },
  ],
  "crm-analytics": [{ name: "Data Prep Recipes", what: "Build datasets from core and external data." }],
  slack: [
    { name: "Workflow Builder", what: "No-code automations and approvals in Slack." },
    { name: "Canvases", what: "Docs inside channels." },
    { name: "Slack Connect", what: "Shared channels with external organizations." },
  ],
  own: [
    { name: "Recover", what: "Automated backup and restore." },
    { name: "Accelerate", what: "Sandbox seeding with masked data." },
    { name: "Archiver", what: "Archive aged records." },
  ],
  quip: [{ name: "Quip Docs", what: "Live documents embedded in Salesforce records." }],
};
