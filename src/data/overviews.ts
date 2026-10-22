// Plain-language overviews for each product: what it is, who uses it, and how.
// Working knowledge as of late 2026; verify specifics (editions, SKUs) per account.

export interface Overview {
  /** What the product is, in a few sentences. */
  what: string;
  /** Who logs in and uses it. */
  users: string[];
  /** Day-to-day workflows. */
  howUsed: string[];
  /** Vocabulary you'll hear from customers and Salesforce AEs. */
  keyConcepts: string[];
  /** Questions that surface where Contentful fits. */
  discovery: string[];
}

export const overviews: Record<string, Overview> = {
  platform: {
    what: "The application platform underneath every core cloud. A customer's Salesforce \"org\" is one tenant on a shared, metadata-driven runtime. Data lives in standard and custom objects, admins configure behavior with clicks, and developers extend it with code. Sales Cloud, Service Cloud, FSC and the other core apps are packaged objects, pages and automation on top of this same platform, which is why they share data natively.",
    users: ["Salesforce admins", "Platform developers", "Architects", "Business users of custom apps", "Integration teams calling its APIs"],
    howUsed: [
      "Model data with custom objects and fields in Object Manager",
      "Automate processes with Flow (record-triggered, scheduled and screen flows) and Apex for complex logic",
      "Build UI with Lightning App Builder pages and Lightning Web Components (LWC)",
      "Integrate through REST/SOAP/Bulk/GraphQL APIs, Platform Events and Named Credentials for outbound callouts",
      "Control access with profiles, permission sets and sharing rules; ship changes from sandboxes via DevOps Center, the Salesforce CLI or packages",
    ],
    keyConcepts: ["Org", "Sandbox", "sObject", "SOQL", "Apex", "LWC", "Flow", "Governor limits", "Permission set", "Named Credential", "AppExchange"],
    discovery: [
      "Do they have in-house LWC developers or rely on an SI?",
      "What is the policy for callouts to external APIs (Named Credentials, allow-lists)?",
      "How many orgs do they run, and which one would consume content?",
    ],
  },
  "data-360": {
    what: "Salesforce's real-time data platform and CDP (formerly Data Cloud). It ingests data from core, Marketing Cloud, Commerce and external systems, maps it into a common data model, and resolves identities into unified customer profiles. On top of those profiles it computes insights, builds segments and activates them to channels. It also hosts the vector and search indexes that ground Agentforce, and the semantic layer under Tableau Next. Usage is billed in consumption credits.",
    users: ["Data architects", "Marketing ops and segmentation teams", "Analysts", "Admins configuring Agentforce grounding"],
    howUsed: [
      "Connect data streams: core CRM connector, Marketing Cloud and Commerce connectors, cloud storage, or the Ingestion API for custom sources",
      "Map raw Data Lake Objects (DLOs) into Data Model Objects (DMOs) and run identity resolution to create unified profiles",
      "Define calculated and streaming insights such as lifetime value or engagement scores",
      "Build segments and activate them to Marketing Cloud, ad platforms or other targets; trigger Flows from data changes",
      "Create search indexes and retrievers over unstructured content so Agentforce can do RAG; federate zero-copy with Snowflake, Databricks or BigQuery",
    ],
    keyConcepts: ["Data space", "Data stream", "DLO / DMO", "Identity resolution", "Unified individual", "Calculated insight", "Segment", "Activation", "Search index / retriever", "Credits"],
    discovery: [
      "Which sources already stream into Data 360, and who owns the data model?",
      "Is there a credit budget for ingesting content and running grounding queries?",
      "Do they plan to ground agents on web or help content? Where does that content live today?",
    ],
  },
  shield: {
    what: "A paid security and compliance add-on for core, extended to Data 360. It bundles Platform Encryption (at-rest encryption of fields and files with customer-controlled keys), Event Monitoring (detailed logs of logins, API calls and report exports, plus real-time Transaction Security policies), Field Audit Trail (field history kept for up to ten years) and Data Detect (scans for sensitive data). Regulated industries usually buy it.",
    users: ["Security and compliance teams", "Salesforce admins in regulated industries", "Auditors"],
    howUsed: [
      "Encrypt PII and sensitive fields; manage key rotation, BYOK or cache-only keys",
      "Monitor user and API behavior and block risky actions such as mass exports",
      "Retain field change history for audits and investigations",
      "Classify where sensitive data lives across the org",
    ],
    keyConcepts: ["Platform Encryption", "Tenant secret", "BYOK", "Event Monitoring", "Transaction Security Policy", "Field Audit Trail", "Data Detect"],
    discovery: [
      "Will any content copied into Data 360 count as sensitive and need encryption?",
      "Does their security review expect a single attestation for the whole stack, or are they comfortable with Contentful attesting separately?",
    ],
  },
  agentforce: {
    what: "Salesforce's platform for building and running AI agents for employees and customers. An agent is defined by topics (the jobs it handles), natural-language instructions, and actions it can take: Flows, Apex, prompt templates, APIs or MCP tools. The Atlas Reasoning Engine plans which actions to call. The Einstein Trust Layer masks data, grounds responses and enforces zero data retention with the LLM providers. Agents ground on Knowledge, CRM records and Data 360 retrievers.",
    users: ["Admins and agent builders", "Service and sales teams working alongside agents", "Customers on web chat, messaging and voice", "Employees in Slack"],
    howUsed: [
      "Build an agent in Agent Builder (or Agent Script): define topics, instructions and actions",
      "Ground answers on Knowledge, records and Data 360 search indexes",
      "Test conversations in the Testing Center before deploying",
      "Deploy to channels: embedded messaging on websites, Experience Cloud sites, Slack, voice, and the Service Console",
      "Monitor quality and cost with observability dashboards; customer-facing usage is billed in Flex Credits per action",
    ],
    keyConcepts: ["Agent", "Topic", "Action", "Agent Script", "Prompt Builder template", "Atlas Reasoning Engine", "Einstein Trust Layer", "Flex Credits", "Testing Center"],
    discovery: [
      "Which agents are live versus in pilot?",
      "Where do agents get their answers today (Knowledge, PDFs, the website)?",
      "Who owns the accuracy of the content agents answer from, and how does it get approved?",
    ],
  },
  "sales-cloud": {
    what: "Salesforce's original CRM for selling. It tracks accounts, contacts, leads and opportunities through the pipeline, along with activities, forecasts and territories. Most Salesforce customers have it, and it is usually the anchor of their core org.",
    users: ["Account executives", "SDRs and BDRs", "Sales managers", "Revenue operations"],
    howUsed: [
      "Convert leads and work opportunities through sales stages",
      "Log calls, emails and meetings, often captured automatically with Einstein Activity Capture",
      "Forecast by rep, team and territory; review pipeline in dashboards",
      "Run outreach cadences with Sales Engagement; use sales agents for prospecting",
    ],
    keyConcepts: ["Lead", "Account", "Contact", "Opportunity", "Forecast", "Territory", "Sales Engagement"],
    discovery: [
      "Where do reps find collateral and case studies today?",
      "Is any sales content stored in Salesforce Files or CMS?",
    ],
  },
  "service-cloud": {
    what: "Salesforce's customer service platform. Requests arrive from email, web, messaging and phone (Service Cloud Voice) as cases. Omni-Channel routes each case to the right agent, who works it in the Service Console with Knowledge articles, macros and customer history beside it. Self-service help centers run on Experience Cloud, and Agentforce service agents increasingly deflect cases before a human sees them.",
    users: ["Support agents", "Supervisors", "Knowledge managers", "Customers using help centers and chat"],
    howUsed: [
      "Capture cases from every channel and route them with Omni-Channel by skill and capacity",
      "Work cases in the Service Console with Knowledge suggested alongside",
      "Author, review and publish Knowledge articles to agents and to the public help center",
      "Track SLAs with entitlements and milestones; deflect with Agentforce on messaging and voice",
    ],
    keyConcepts: ["Case", "Omni-Channel", "Service Console", "Knowledge article", "Entitlement", "Messaging for In-App and Web", "Service Cloud Voice"],
    discovery: [
      "Is help content authored in Salesforce Knowledge or in a CMS?",
      "Is the same how-to content duplicated across the website, the help center and agent answers?",
      "Who approves changes to help content, and how fast can they ship a fix?",
    ],
  },
  "field-service": {
    what: "Scheduling and dispatch for mobile workforces, built on Service Cloud. Cases turn into work orders and service appointments. An optimization engine schedules technicians by skill, location and SLA. Technicians work from a mobile app that runs offline, with checklists, parts, asset history and signature capture.",
    users: ["Dispatchers", "Field technicians", "Field service managers"],
    howUsed: [
      "Create work orders from cases or maintenance plans",
      "Optimize schedules and adjust them in the dispatcher console's Gantt view",
      "Complete jobs in the mobile app: steps, parts used, photos, customer signature",
      "Track assets, warranties and preventive maintenance",
    ],
    keyConcepts: ["Work order", "Service appointment", "Service territory", "Dispatcher console", "Field Service mobile app", "Maintenance plan"],
    discovery: ["Are repair procedures and manuals managed in a content system that technicians could see in the mobile app?"],
  },
  "revenue-cloud": {
    what: "Salesforce's rebuilt, native quote-to-cash suite on core: product catalog management, configure-price-quote, contracts, order orchestration and billing. It replaces the older CPQ managed package with a new data model and an API-first pricing engine.",
    users: ["Sales reps building quotes", "Deal desk", "Product and pricing operations", "Finance and billing teams"],
    howUsed: [
      "Define products, bundles and attributes in Product Catalog Management",
      "Set up pricing procedures, discounts and approvals",
      "Configure and quote deals, generate quote documents and contracts",
      "Orchestrate orders to fulfillment and invoice through billing",
    ],
    keyConcepts: ["Product Catalog Management", "Pricing procedure", "Quote", "Dynamic Revenue Orchestrator", "Billing"],
    discovery: ["Where do the product descriptions, imagery and specs shown in configurators and quote documents come from?"],
  },
  cpq: {
    what: "The legacy configure-price-quote product, from the 2015 SteelBrick acquisition. It runs on core as a managed package (the SBQQ namespace) with product rules, price rules, quote templates, amendments and renewals. Customers are being steered to Revenue Cloud, and CPQ gets little new investment.",
    users: ["Sales reps", "Deal desk", "Sales ops admins"],
    howUsed: [
      "Configure product bundles with rules in the quote line editor",
      "Apply price rules and discount schedules",
      "Generate PDF quotes from templates",
      "Manage amendments and renewals on contracts",
    ],
    keyConcepts: ["SBQQ", "Product rule", "Price rule", "Quote template", "Amendment / renewal"],
    discovery: ["What is their migration timeline to Revenue Cloud?"],
  },
  "experience-cloud": {
    what: "The way to build branded websites, portals and communities on core that expose Salesforce data and processes to people outside the company: customers, partners, members, citizens. Sites are assembled in Experience Builder from templates (LWR for modern, fast sites; Aura for older ones) and Lightning Web Components. Salesforce CMS workspaces supply content. Visitors are anonymous guests or authenticated external users with Community licenses.",
    users: ["Site builders and admins", "Marketers editing pages", "LWC developers", "Customers, partners and members logging in"],
    howUsed: [
      "Pick a template and lay out pages in Experience Builder; target sections to audiences",
      "Drop in components that show cases, Knowledge, records, forms and Flows",
      "Authenticate customers and partners: self-service help centers, partner portals (PRM), member portals",
      "Publish content from Salesforce CMS workspaces, or from an external CMS through custom LWC",
    ],
    keyConcepts: ["Experience Builder", "LWR vs Aura site", "Guest user", "External user license", "Audience", "CMS workspace", "PRM"],
    discovery: [
      "Which sites are LWR and which are Aura?",
      "Who edits content on these sites today, and what frustrates them about Salesforce CMS?",
      "Is the same content also on the public marketing site?",
    ],
  },
  fsc: {
    what: "Salesforce's industry solution for banking, wealth management and insurance. It extends Sales and Service with a financial data model: financial accounts, holdings, goals, households and relationship groups, insurance policies and claims. It adds compliance features such as Compliant Data Sharing, OmniStudio for guided processes like account opening, and industry-specific Agentforce actions. Client and advisor portals are Experience Cloud sites on the same data.",
    users: ["Financial advisors and relationship managers", "Bankers", "Insurance agents and service reps", "Clients and members using portals"],
    howUsed: [
      "See a 360 view of a client's household, accounts, holdings and goals",
      "Run onboarding and account opening through OmniScripts",
      "Manage referrals, leads and action plans; log client interactions",
      "Serve clients through member and advisor portals with compliant, role-based data sharing",
    ],
    keyConcepts: ["Person account", "Household / relationship group", "Financial account", "Action plan", "Compliant Data Sharing", "OmniStudio", "Interaction summary"],
    discovery: [
      "Do advisors share market insights, product disclosures or educational content with clients? From where?",
      "What is the compliance review workflow for client-facing content?",
      "Are member portals on Experience Cloud LWR?",
    ],
  },
  "industry-clouds": {
    what: "Vertical solutions on core: Health Cloud (patients, care plans, providers), Consumer Goods (retail execution, store visits), Manufacturing (sales agreements, rebates), Public Sector (licensing, permits, benefits), Communications (catalog and orders for telcos), Automotive, Energy & Utilities, and Net Zero (carbon accounting). They share a pattern: an industry data model, OmniStudio for guided interactions, and Experience Cloud portals for the end customer.",
    users: ["Industry-specific roles (care coordinators, caseworkers, field reps)", "Admins and OmniStudio developers", "Patients, citizens and customers using portals"],
    howUsed: [
      "Guide users through multi-step processes with OmniScripts",
      "Show contextual summaries with FlexCards",
      "Call back-end systems with Integration Procedures and Data Mappers",
      "Serve end customers through Experience Cloud portals",
    ],
    keyConcepts: ["OmniStudio", "OmniScript", "FlexCard", "Integration Procedure", "Data Mapper", "Industry data model"],
    discovery: [
      "Which industry cloud are they on?",
      "Do their portals need regulated or localized content, such as care instructions or program eligibility?",
    ],
  },
  "mc-growth": {
    what: "Salesforce's next-generation marketing app, built natively on core and Data 360 rather than on the ExactTarget stack. The Growth edition targets smaller teams and Advanced adds richer journeys and personalization. Marketers plan campaigns, build email, SMS and WhatsApp messages, forms and landing pages, segment audiences in Data 360, and orchestrate sends with Flow, often starting from an Agentforce campaign brief.",
    users: ["Marketers", "Marketing ops admins"],
    howUsed: [
      "Create campaigns manually or with an Agentforce marketing agent that drafts the brief, segment and content",
      "Design emails and landing pages in drag-and-drop builders from content blocks",
      "Segment audiences in Data 360 and manage consent",
      "Orchestrate journeys with Flow and report on engagement inside core",
    ],
    keyConcepts: ["Campaign", "Marketing flow", "Content block", "Data 360 segment", "Consent", "Growth / Advanced edition"],
    discovery: [
      "Are they migrating from MC Engagement to this?",
      "Where are email modules and brand assets authored today?",
    ],
  },
  "mc-engagement": {
    what: "The enterprise marketing platform from the 2013 ExactTarget acquisition, on its own tech stack separate from core. It covers Email Studio, Mobile Studio (SMS and push), Journey Builder for multi-step journeys, Contact Builder with Data Extensions as the data model, Automation Studio for SQL and ETL, Content Builder for assets, and CloudPages for landing pages. Personalization is scripted in AMPscript or SSJS. MC Connect syncs it with core, and it is billed by contacts and messages.",
    users: ["Email and lifecycle marketers", "Marketing ops", "Developers writing AMPscript and SQL"],
    howUsed: [
      "Load or sync audiences into Data Extensions",
      "Build journeys with entry events, decision splits and waits",
      "Design emails in Content Builder with dynamic content blocks",
      "Schedule automations, imports and SQL queries; analyze sends and engagement",
    ],
    keyConcepts: ["Business unit", "Data Extension", "Journey Builder", "Content Builder", "AMPscript", "CloudPages", "Super messages", "MC Connect"],
    discovery: [
      "How are content blocks built and maintained? Are they duplicated across business units?",
      "Do they already call external content with AMPscript HTTPGet?",
      "Do they have plans to move to MC Growth/Advanced?",
    ],
  },
  "account-engagement": {
    what: "B2B marketing automation, formerly Pardot. It captures prospects through forms and landing pages, nurtures them with email programs, scores and grades them, and syncs qualified leads to Sales Cloud. It runs on its own stack with a deep core sync, and its UI is now mostly inside Lightning.",
    users: ["B2B demand-gen marketers", "Marketing ops", "Sales teams receiving MQLs"],
    howUsed: [
      "Capture prospects with forms, landing pages and gated content",
      "Nurture with Engagement Studio programs",
      "Score and grade prospects, then hand MQLs to sales",
      "Report on campaign influence with B2B Marketing Analytics",
    ],
    keyConcepts: ["Prospect", "Engagement Studio", "Score / grade", "Business unit", "Salesforce Connector"],
    discovery: ["Where do gated assets (whitepapers, webinars) and landing-page copy live?"],
  },
  "mc-personalization": {
    what: "Real-time web and app personalization, formerly Evergage and then Interaction Studio. A JavaScript sitemap or mobile SDK captures behavior and builds live profiles. A decisioning engine then chooses what each visitor sees: product recommendations, web campaigns in defined content zones, banners and triggered messages, with A/B testing. It is being folded toward Data 360.",
    users: ["Digital marketers", "Personalization and CRO teams", "E-commerce merchandisers", "Developers implementing the sitemap"],
    howUsed: [
      "Implement the sitemap to capture page views, catalog and events",
      "Define segments and target web campaigns to content zones",
      "Configure recommendation recipes",
      "Run A/B tests and read lift reports",
    ],
    keyConcepts: ["Sitemap", "Content zone", "Web campaign", "Recipe", "Catalog", "Einstein decisions"],
    discovery: [
      "Who owns experimentation, and where do the variants' content live?",
      "Is Contentful Personalization (Ninetailed) being evaluated alongside?",
    ],
  },
  "b2c-commerce": {
    what: "Enterprise direct-to-consumer e-commerce (formerly Demandware) on its own multi-tenant SaaS stack, separate from core. Merchandisers run multi-site, multi-brand storefronts from Business Manager: catalogs, price books, promotions, search tuning and Page Designer layouts. Developers either build on SFRA (the server-rendered, cartridge-based reference architecture) or go headless with Storefront Next over the Shopper APIs (SCAPI). Pricing is a share of GMV.",
    users: ["Merchandisers and e-commerce managers", "Storefront developers and SIs", "Shoppers"],
    howUsed: [
      "Manage catalogs, price books, inventory and promotions in Business Manager",
      "Lay out landing and category pages with Page Designer components",
      "Build storefronts on SFRA cartridges or headless with Storefront Next and SCAPI",
      "Send orders to Order Management; use Einstein recommendations and Agentforce shopper and merchant agents",
    ],
    keyConcepts: ["Business Manager", "Realm / instance", "Site", "Cartridge", "SFRA", "SCAPI / OCAPI", "Page Designer", "Storefront Next"],
    discovery: [
      "Are they on SFRA or headless, and is a move to Storefront Next planned?",
      "Who edits Page Designer content, and how often does engineering get pulled in?",
      "Is editorial content (lookbooks, guides) reused outside the storefront?",
    ],
  },
  "b2b-commerce": {
    what: "Commerce built natively on core. Storefronts are Experience Cloud LWR sites, while products, price books, buyer accounts, carts and orders are core objects shared with Sales and Service. It handles B2B patterns such as account-specific catalogs and pricing, quick order and reorder; a D2C variant serves smaller consumer brands that want to run commerce on core.",
    users: ["B2B buyers", "Merchandisers and commerce admins", "Sales and service reps on the same data"],
    howUsed: [
      "Set up a store in the Commerce app and manage catalogs and entitlements by buyer group",
      "Let buyers log in to reorder, use quick order and see contract pricing",
      "Customize checkout with Flow and Apex",
      "Pass orders to Order Management",
    ],
    keyConcepts: ["WebStore", "Buyer group", "Entitlement policy", "LWR store", "Commerce app", "Checkout flow"],
    discovery: ["Where do product storytelling, spec sheets and documentation come from? Do they use CMS workspaces today?"],
  },
  "order-management": {
    what: "A core app that orchestrates everything after the order is placed. It ingests orders from B2C Commerce, B2B or external channels, routes fulfillment to warehouses and stores, tracks inventory, captures payments, and handles returns and exchanges. Service agents act on orders from the console.",
    users: ["Fulfillment and operations teams", "Service agents handling order issues"],
    howUsed: [
      "Ingest orders into order summaries",
      "Route fulfillment with Flow-based orchestration and inventory availability",
      "Cancel, return or exchange from the Service Console",
    ],
    keyConcepts: ["Order summary", "Fulfillment order", "Omnichannel Inventory", "Return order"],
    discovery: ["Low content relevance; mainly useful to understand the order flow."],
  },
  cimulate: {
    what: "AI-native commerce search and product discovery, acquired in March 2026. It interprets shopper intent and returns relevant products through semantic and conversational search over the product catalog, and it is being built into Agentforce Commerce shopping experiences. It indexes products only, not editorial or help content.",
    users: ["Shoppers", "Merchandisers tuning results", "Developers integrating search"],
    howUsed: [
      "Power storefront search and discovery",
      "Feed product retrieval for shopping agents",
      "Tune relevance and merchandising rules",
    ],
    keyConcepts: ["Semantic search", "Shopper intent", "Catalog index", "Agentforce Commerce"],
    discovery: ["How do shoppers find content such as guides and articles? That is separate from product search."],
  },
  mulesoft: {
    what: "Salesforce's integration platform. Anypoint Platform is for designing, building, running and governing APIs and integrations, using \"API-led connectivity\" (system, process and experience APIs). Integrations run on CloudHub or customer-managed runtimes, Exchange holds reusable connectors and APIs, and API Manager and Flex Gateway enforce policies. Composer gives admins no-code flows. MuleSoft also exposes APIs as agent actions and MCP tools.",
    users: ["Integration developers", "Enterprise architects", "Central IT or a Center for Enablement (C4E)", "Admins using Composer"],
    howUsed: [
      "Build Mule apps in Anypoint Code Builder and deploy them to CloudHub 2.0",
      "Publish and secure APIs with API Manager policies",
      "Reuse connectors and templates from Exchange",
      "Wire SaaS apps together with Composer; expose APIs to Agentforce",
    ],
    keyConcepts: ["API-led connectivity", "Mule app", "CloudHub 2.0", "Anypoint Exchange", "API Manager", "Flex Gateway", "vCore", "Composer"],
    discovery: [
      "Is there a C4E that must approve new integrations?",
      "Do they already move Contentful data anywhere through MuleSoft?",
    ],
  },
  informatica: {
    what: "Informatica Intelligent Data Management Cloud (IDMC), acquired in 2025. It covers data integration and ETL, data quality, master data management (golden customer and product records), a data catalog with lineage, and governance. Salesforce positions it as the governance layer for whatever feeds Data 360. It is priced in Informatica Processing Units (IPUs).",
    users: ["Data engineers", "Data stewards", "Chief data officers and governance teams"],
    howUsed: [
      "Build pipelines that move and transform data between systems",
      "Cleanse, match and merge records into master records",
      "Catalog data assets and trace lineage for compliance",
    ],
    keyConcepts: ["IDMC", "Cloud Data Integration", "MDM", "Data catalog / governance", "IPU", "CLAIRE"],
    discovery: ["Does product MDM feed product content? Are there governance requirements for content metadata?"],
  },
  heroku: {
    what: "Platform-as-a-service for deploying apps in any language with a git push, running on dynos with managed add-ons such as Postgres. Heroku Connect syncs Postgres with core objects, and AppLink exposes Heroku code as actions to Flow, Apex and Agentforce. It is used for custom web apps, APIs and workers that don't belong in the core runtime.",
    users: ["Developers", "Small platform teams"],
    howUsed: [
      "Deploy web apps, APIs and background workers",
      "Host custom frontends, including content-driven sites",
      "Sync data to Salesforce with Heroku Connect; extend agents with AppLink",
    ],
    keyConcepts: ["Dyno", "Buildpack", "Add-on", "Private Space", "Heroku Connect", "AppLink"],
    discovery: ["Where is their headless frontend hosted: Heroku, Vercel, Netlify or something in-house?"],
  },
  contentful: {
    what: "A composable content platform. Teams model structured content as content types, author and localize entries and assets in the web app, assemble pages visually with Studio, and deliver to any channel through the Content Delivery API, GraphQL and the image CDN. Workflows, releases (Launch), Personalization (from Ninetailed), AI Actions, the App Framework and an MCP server sit around that core. After the acquisition it becomes the content layer across Salesforce, while staying the system of record on its own platform.",
    users: ["Content editors and marketers", "Developers", "Content architects", "Localization teams"],
    howUsed: [
      "Model content once as structured types and reuse it everywhere",
      "Author, localize, preview and run approval workflows",
      "Schedule releases and personalize experiences",
      "Deliver to websites, apps, Salesforce surfaces and agents through APIs",
    ],
    keyConcepts: ["Space", "Environment", "Content type", "Entry / asset", "Locale", "CDA / CPA / CMA", "GraphQL", "Studio", "Launch", "Personalization"],
    discovery: [
      "Which Salesforce surface consumes content first: Experience Cloud, Commerce, Marketing or Agentforce?",
      "Is the same content duplicated across Salesforce CMS, Content Builder, Page Designer and Knowledge today?",
    ],
  },
  tableau: {
    what: "Business intelligence and visual analytics. Tableau Desktop, Cloud and Server build interactive dashboards over almost any data source, and Pulse delivers metric digests. Tableau Next is the newer agentic analytics product built on Data 360, with a shared semantic layer and AI agents that answer data questions.",
    users: ["Analysts (Creator licenses)", "Business users (Explorer and Viewer licenses)", "Executives"],
    howUsed: [
      "Connect to data sources and build workbooks",
      "Publish dashboards and subscribe to Pulse metrics",
      "Model semantics on Data 360 with Tableau Next and ask questions in natural language",
    ],
    keyConcepts: ["Workbook", "Data source", "Creator / Explorer / Viewer", "Pulse", "Tableau Semantics", "Tableau Next"],
    discovery: ["Who reports on content performance today, and in what tool?"],
  },
  "crm-analytics": {
    what: "Analytics native to core, formerly Einstein Analytics and Tableau CRM. Recipes prepare Salesforce and external data into datasets, dashboards embed directly in Lightning record pages, and Einstein Discovery adds predictions. It is mainly used for sales and service operations reporting.",
    users: ["Sales and service ops analysts", "Managers viewing embedded dashboards"],
    howUsed: [
      "Prepare data with recipes into datasets",
      "Embed dashboards in Lightning pages and apps",
      "Add predictive models with Einstein Discovery",
    ],
    keyConcepts: ["Dataset", "Recipe", "Lens", "SAQL", "Einstein Discovery"],
    discovery: ["Low content relevance."],
  },
  slack: {
    what: "Salesforce's collaboration platform: channels, DMs, huddles, canvases, lists, Workflow Builder and thousands of app integrations. Slack Connect links channels with outside companies. Salesforce now positions Slack as the employee front door for Agentforce and for working with CRM records in the flow of conversation.",
    users: ["Every employee", "Admins managing Enterprise Grid", "Partners via Slack Connect"],
    howUsed: [
      "Collaborate in channels and huddles; document in canvases",
      "Automate approvals and requests with Workflow Builder and apps",
      "Ask Agentforce agents and Slackbot questions in Slack",
      "Receive notifications and act on approvals from tools such as Contentful",
    ],
    keyConcepts: ["Channel", "Slack Connect", "Workflow Builder", "Canvas", "Agentforce in Slack", "Enterprise Grid"],
    discovery: ["Do editorial reviews and approvals already happen in Slack?"],
  },
  own: {
    what: "Backup and recovery for Salesforce data and metadata, formerly OwnBackup and acquired in 2024. It takes automated backups, compares snapshots to find bad changes, restores records with their relationships, seeds sandboxes with masked data, and archives old records.",
    users: ["Salesforce admins", "IT operations", "Compliance teams"],
    howUsed: [
      "Run automated daily backups",
      "Restore after a bad data load or a deployment mistake",
      "Seed sandboxes with anonymized production data",
      "Archive aged records to meet retention policies",
    ],
    keyConcepts: ["Backup", "Recover", "Sandbox seeding", "Archiver", "Data anonymization"],
    discovery: ["No Contentful fit."],
  },
  quip: {
    what: "Collaborative documents and spreadsheets with built-in chat, acquired in 2016. It was embeddable in Salesforce records as live documents. It has been effectively sunset, and teams are moving to Slack canvases and other tools.",
    users: ["Legacy teams still using Quip docs"],
    howUsed: ["Account plans and meeting notes embedded on records", "Collaborative checklists"],
    keyConcepts: ["Quip document", "Live apps", "Embedded Quip"],
    discovery: ["No Contentful fit."],
  },
};
