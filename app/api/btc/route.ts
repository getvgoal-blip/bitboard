import { NextResponse } from "next/server";
import type { BTCPriceData } from "@/lib/types";

// CoinGecko 무료 API — 분당 30회 한도
const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false";

export const revalidate = 60; // 60초 캐시

export async function GET() {
  try {
    const res = await fetch(COINGECKO_URL, {
      headers: {
        Accept: "application/json",
        "x-cg-demo-api-key": process.env.COINGECKO_API_KEY ?? "",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`CoinGecko error: ${res.status}`);
    }

    const raw = await res.json();
    const md = raw.market_data;

    const price: number = md.current_price.usd;
    const change24h: number = md.price_change_percentage_24h ?? 0;

    const data: BTCPriceData = {
      price,
      change24h: parseFloat(change24h.toFixed(2)),
      changeAmount24h: parseFloat((md.price_change_24h ?? 0).toFixed(0)),
      volume24h: parseFloat(((md.total_volume?.usd ?? 0) / 1e9).toFixed(2)), // in Billions
      marketCap: parseFloat(((md.market_cap?.usd ?? 0) / 1e12).toFixed(3)), // in Trillions
      high24h: md.high_24h?.usd ?? price,
      low24h: md.low_24h?.usd ?? price,
      lastUpdated: raw.last_updated ?? new Date().toISOString(),
    };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (err) {
    console.error("[/api/btc]", err);
    return NextResponse.json(
      { error: "Failed to fetch BTC price" },
      { status: 502 }
    );
  }
}
