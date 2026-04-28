import { NextResponse } from "next/server";
import { calculateHalving } from "@/lib/halving";

// 반감기는 로컬 계산 — 외부 API 불필요
export const dynamic = "force-dynamic"; // 매 요청마다 실시간 계산

export async function GET() {
  try {
    const data = calculateHalving();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (err) {
    console.error("[/api/halving]", err);
    return NextResponse.json(
      { error: "Failed to calculate halving" },
      { status: 500 }
    );
  }
}
