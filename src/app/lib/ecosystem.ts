export type ProductStatus = "Available" | "Public code";

export type Product = {
  id: "factorforge" | "mcp" | "agentos" | "validationhub";
  name: string;
  tag: string;
  status: ProductStatus;
  description: string;
  code: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  accent: "teal" | "slate" | "cyan" | "violet";
};

export const publicLinks = {
  eijexGitHub: "https://github.com/eijex",
  factorforgeApp: "https://factorforge.eijex.com",
  factorforgeGitHub: "https://github.com/eijex/factorforge-cds",
  factorforgeDocs: "https://eijex.github.io/factorforge-cds/",
  mcpService: "https://mcp.eijex.com",
  mcpGitHub: "https://github.com/eijex/eijex-mcp",
  agentosGitHub: "https://github.com/eijex/eijex-agentOps",
  agentosSecurity: "https://github.com/eijex/eijex-agentOps/security",
  validationhubGitHub: "https://github.com/eijex/eijex-validationHub",
  validationhubSecurity: "https://github.com/eijex/eijex-validationHub/security",
} as const;

export const products: readonly Product[] = [
  {
    id: "factorforge",
    name: "FactorForge",
    tag: "CDS Design Review",
    status: "Available",
    description:
      "Pre-synthesis sequence review for plant CDS workflows, with reproducible candidates, deterministic checks, and citable review artifacts.",
    code: "pip install factorforge-cds",
    primary: { label: "Learn more", href: "/factorforge" },
    secondary: { label: "GitHub", href: publicLinks.factorforgeGitHub },
    accent: "teal",
  },
  {
    id: "mcp",
    name: "Eijex MCP",
    tag: "Public Tool Access",
    status: "Available",
    description:
      "MCP-compatible access to public FactorForge capabilities with explicit tool and data boundaries.",
    code: "mcp.eijex.com",
    primary: { label: "Connect ↗", href: publicLinks.mcpService },
    secondary: { label: "GitHub", href: publicLinks.mcpGitHub },
    accent: "slate",
  },
  {
    id: "agentos",
    name: "AgentOS",
    tag: "Workflow Control Plane",
    status: "Public code",
    description:
      "Human-supervised orchestration for policy checks, approval gates, audit trails, and evidence-safe public projection.",
    code: "Human approval at public boundaries",
    primary: { label: "Learn more", href: "/agentos" },
    secondary: { label: "GitHub", href: publicLinks.agentosGitHub },
    accent: "cyan",
  },
  {
    id: "validationhub",
    name: "ValidationHub",
    tag: "Evidence Registry",
    status: "Public code",
    description:
      "Schema-driven infrastructure for reviewing and curating validation evidence while permissioned records remain outside public repositories.",
    code: "Open schemas · Permissioned evidence",
    primary: { label: "Learn more", href: "/validationhub" },
    secondary: { label: "GitHub", href: publicLinks.validationhubGitHub },
    accent: "violet",
  },
] as const;

export const implementationStatus = [
  {
    label: "Available / public code",
    tone: "emerald",
    items: [
      "FactorForge package, web UI, CLI, and documentation",
      "Eijex MCP public access surface",
      "AgentOS workflow-integrity code and synthetic fixtures",
      "ValidationHub schemas and registry code",
    ],
  },
  {
    label: "Research checkpoint",
    tone: "amber",
    items: [
      "Captured GCP PostgreSQL 16 research instance",
      "Separate tested FactorForge SQLite metadata path",
      "Byte-pinned candidate-asset manifest registration",
    ],
  },
  {
    label: "Next evidence gates",
    tone: "slate",
    items: [
      "Ordered migrations and schema-version policy",
      "PostgreSQL, SQLite, and specification reconciliation",
      "Access, restore, state-isolation, and leakage tests",
      "Public or synthetic end-to-end lineage fixture",
    ],
  },
] as const;

export const researchTracks = [
  {
    label: "Computational case study",
    title: "Paper 1 — Reproducible CDS design",
    description:
      "A frozen N. benthamiana computational study and reproducibility package. It makes no expression, yield, or wet-lab claim.",
    status: "Computational scope frozen",
  },
  {
    label: "Planning scaffold",
    title: "Paper 2 — Evidence infrastructure",
    description:
      "A research plan for traceable design-to-evidence infrastructure, now recording a partial database implementation checkpoint.",
    status: "Evidence gate not yet complete",
  },
] as const;

export const publicDataBoundary =
  "Code, public schemas, documentation, and synthetic fixtures are open. Raw sequences, partner documents, personal information, and permissioned experimental evidence are governed separately and are not published in the software repositories.";
