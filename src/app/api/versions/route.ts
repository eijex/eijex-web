import { NextResponse } from "next/server";
import { CURRENT_APP_VERSION, FACTORFORGE_ENGINE_VERSIONS, FACTORFORGE_DESIGN_WORKFLOWS } from "@/app/lib/site-stats";

export function GET() {
  return NextResponse.json({
    deployment_revision: "job397-2026-10-12",
    schema_version: "1.0",
    source_contract: "factorforge/src/factorforge/registry/version_manifest.json",
    synchronization: "component mirror with separately tracked local workflows",
    product: { name: "FactorForge", version: CURRENT_APP_VERSION.replace(/^v/, "") },
    components: FACTORFORGE_ENGINE_VERSIONS.map(({ engine, version, status, availability }) => ({
      name: engine,
      version,
      status,
      availability,
    })),
    design_workflows: FACTORFORGE_DESIGN_WORKFLOWS,
    workflow_source: "Job 397 scientific web integration; separately tracked from package release",
    claim_boundary: "Software versions do not imply biological validation.",
  });
}
