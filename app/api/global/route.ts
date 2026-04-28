import { NextResponse } from "next/server";
import type { GlobalMarketData } from "@/lib/types";

// CoinGecko /global — BTC 도미넌스, 전체 시총
const COINGECKO_GLOBAL_URL = "https://api.coingecko.com/api/v3/global";

export const revalidate = 60;

export async function GET() {
  try {
    const res = await fetch(COINGECKO_GLOBAL_URL, {
      headers: {
        Accept: "application/json",
        "x-cg-demo-api-key": process.env.COINGECKO_API_KEY ?? "",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`CoinGecko global error: ${res.status}`);
    }

    const raw = await res.json();
    const d = raw.data;

    // BTC 도미넌스
    const btcDominance = parseFloat(
      (d.market_cap_percentage?.btc ?? 0).toFixed(2)
    );
    // 전체 시총 전날 대비 변화: dominance change 근사치 (직전값 없어서 0 처리)
    const dominanceChange = 0; // 상세 이력은 유료 API 필요

    // 알트코인 시즌 지수: 무료 API에서 직접 제공 안 함 → 근사 계산
    // BTC 도미넌스가 낮을수록 알트 시즌에 가깝다고 판단
    const altcoinSeasonIndex = Math.round(Math.max(0, Math.min(100, (60 - btcDominance) * 3 + 30)));

    const data: GlobalMarketData = {
      btcDominance,
      dominanceChange,
      totalMarketCap: parseFloat(
        ((d.total_market_cap?.usd ?? 0) / 1e12).toFixed(3)
      ),
      totalVolume24h: parseFloat(
        ((d.total_volume?.usd ?? 0) / 1e9).toFixed(2)
      ),
      altcoinSeasonIndex,
    };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (err) {
    console.error("[/api/global]", err);
    return NextResponse.json(
      { error: "Failed to fetch global market data" },
      { status: 502 }
    );
  }
}
