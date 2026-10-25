import { NextResponse, type NextRequest } from "next/server";
import snapshot from "@/app/lib/validationhub-snapshot.json";
import { projectSnapshot } from "@/app/lib/validationhub-telemetry";

export const dynamic = "force-dynamic";

declare global {
  var __latestValidationHubTelemetry: Record<string, unknown> | null | undefined;
}

const SYNC_TOKEN =
  process.env.VALIDATIONHUB_SYNC_TOKEN || "eijex_valhub_live_telemetry_20261025";

export async function GET() {
  const live = globalThis.__latestValidationHubTelemetry;
  const data = live || snapshot;
  return NextResponse.json(projectSnapshot(data), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: NextRequest) {
  try {
    const token =
      req.headers.get("x-telemetry-token") ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token || token !== SYNC_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    // Persist latest telemetry in-memory for this serverless runtime
    globalThis.__latestValidationHubTelemetry = payload;

    return NextResponse.json({
      ok: true,
      receivedAt: new Date().toISOString(),
      stale: false,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process telemetry payload" },
      { status: 500 }
    );
  }
}
