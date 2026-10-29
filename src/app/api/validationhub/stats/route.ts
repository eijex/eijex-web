import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual, createHash } from "node:crypto";
import { projectSnapshot, validatePush } from "@/app/lib/validationhub-telemetry";
export const dynamic = "force-dynamic";
declare global {
  var __latestValidationHubTelemetry: Record<string, unknown> | null | undefined;
}
export async function GET() {
  const pushed = globalThis.__latestValidationHubTelemetry;
  return NextResponse.json(projectSnapshot(pushed || null, new Date(), pushed ? "VOLATILE_PUSH" : "BUNDLED_SNAPSHOT"), { headers: { "Cache-Control": "no-store" } });
}
export async function POST(req: NextRequest) {
  const expected = process.env.VALIDATIONHUB_SYNC_TOKEN;
  if (!expected?.trim()) return NextResponse.json({ error: "Telemetry ingestion is not configured" }, { status: 503 });
  const header = req.headers.get("x-telemetry-token");
  const authorization = req.headers.get("authorization");
  const bearer = authorization?.match(/^Bearer ([^\s]+)$/)?.[1];
  const supplied = header || bearer;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!supplied || (header && authorization && header !== bearer) || !timingSafeEqual(digest(supplied), digest(expected))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Bound bytes while streaming; Content-Length alone is not trustworthy.
  const reader = req.body?.getReader();
  if (!reader) return NextResponse.json({ error: "Missing body" }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); return NextResponse.json({ error: "Payload too large" }, { status: 413 }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const payload = validatePush(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)));
    globalThis.__latestValidationHubTelemetry = payload;
    return NextResponse.json({ ok: true, storage: "PROCESS_MEMORY_ONLY", remotePersistenceVerified: false, receivedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "Invalid telemetry payload" }, { status: 400 });
  } finally { reader.releaseLock(); }
}
