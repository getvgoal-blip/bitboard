import { NextResponse } from "next/server";
import type { FearGreedData } from "@/lib/types";

// Alternative.me Fear & Greed Index — 완전 무료, API 키 불필요
const FNG_URL = "https://api.alternative.me/fng/?limit=2&format=json";

const LABELS: Record<string, string> = {
  "Extreme Fear": "극도의 공포",
  Fear: "공포",
  Neutral: "중립",
  Greed: "탐욕",
  "Extreme Greed": "극도의 탐욕",
};

export const revalidate = 3600; // 1시간 캐시 (하루 1회 업데이트)

export async function GET() {
  try {
    const res = await fetch(FNG_URL, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Alternative.me error: ${res.status}`);
    }

    const raw = await res.json();
    const today = raw.data?.[0];
    const yesterday = raw.data?.[1];

    if (!today) {
      throw new Error("No fear & greed data");
    }

    const data: FearGreedData = {
      value: parseInt(today.value, 10),
      label: LABELS[today.value_classification] ?? today.value_classification,
      previousValue: yesterday ? parseInt(yesterday.value, 10) : 0,
      previousLabel: yesterday
        ? (LABELS[yesterday.value_classification] ?? yesterday.value_classification)
        : "",
      lastUpdated: new Date(
        parseInt(today.timestamp, 10) * 1000
      ).toISOString(),
    };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("[/api/fear-greed]", err);
    return NextResponse.json(
      { error: "Failed to fetch fear & greed index" },
      { status: 502 }
    );
  }
}
