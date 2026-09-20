import { NextResponse } from "next/server";
import { CURRENT_APP_VERSION, FACTORFORGE_ENGINE_VERSIONS } from "@/app/lib/site-stats";

export function GET() {
  return NextResponse.json({
    schema_version: "1.0",
    source_contract: "factorforge/src/factorforge/registry/version_manifest.json",
    synchronization: "release-audited mirror",
    product: { name: "FactorForge", version: CURRENT_APP_VERSION.replace(/^v/, "") },
    components: FACTORFORGE_ENGINE_VERSIONS.map(({ engine, version, status, availability }) => ({
      name: engine,
      version,
      status,
      availability,
    })),
    claim_boundary: "Software versions do not imply biological validation.",
  });
}
