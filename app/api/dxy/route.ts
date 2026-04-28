import { NextResponse } from "next/server";

// Yahoo Finance 비공식 API — API 키 불필요
// DX-Y.NYB = USD Index (DXY)
const YAHOO_URL =
  "https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB?interval=1d&range=8d";

export const revalidate = 300; // 5분 캐시 (DXY는 실시간 틱 불필요)

export interface DXYData {
  value: number;
  change: number;
  changePercent: number;
  previousClose: number;
  high: number;
  low: number;
  weekHistory: number[]; // 최근 7일 종가
  lastUpdated: string;
}

export async function GET() {
  try {
    const res = await fetch(YAHOO_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://finance.yahoo.com/",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Yahoo Finance error: ${res.status}`);
    }

    const raw = await res.json();
    const result = raw?.chart?.result?.[0];

    if (!result) {
      throw new Error("No Yahoo Finance data");
    }

    const meta = result.meta;
    const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];

    // 유효한 종가만 필터링
    const validCloses = closes
      .filter((v): v is number => v !== null && !isNaN(v))
      .slice(-7);

    const currentPrice: number = meta.regularMarketPrice ?? meta.previousClose ?? 0;
    const prevClose: number = meta.previousClose ?? currentPrice;
    const change = parseFloat((currentPrice - prevClose).toFixed(3));
    const changePercent = parseFloat(((change / prevClose) * 100).toFixed(2));

    const data: DXYData = {
      value: parseFloat(currentPrice.toFixed(2)),
      change,
      changePercent,
      previousClose: parseFloat(prevClose.toFixed(2)),
      high: parseFloat((meta.regularMarketDayHigh ?? currentPrice).toFixed(2)),
      low: parseFloat((meta.regularMarketDayLow ?? currentPrice).toFixed(2)),
      weekHistory: validCloses.map((v) => parseFloat(v.toFixed(2))),
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("[/api/dxy]", err);

    // Fallback: 최근 실제 값에 근사한 폴백 데이터
    const fallback: DXYData = {
      value: 104.32,
      change: -0.18,
      changePercent: -0.17,
      previousClose: 104.5,
      high: 104.65,
      low: 104.12,
      weekHistory: [105.8, 105.2, 104.9, 105.1, 104.7, 104.5, 104.32],
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(fallback, {
      headers: {
        "Cache-Control": "public, s-maxage=60",
        "X-Data-Source": "fallback",
      },
    });
  }
}
