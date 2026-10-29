import { NextResponse } from "next/server";
import snapshot from "@/app/lib/reviewed-learning-summary.json";
import { publicLearningSummary } from "@/app/lib/public-learning-summary";

export async function GET() {
  return NextResponse.json(publicLearningSummary(snapshot), {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}
