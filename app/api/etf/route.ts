import { NextResponse } from "next/server";

// ── ETF 유입/유출 데이터 ──────────────────────────────────────────
// 1차 시도: CoinGlass 공개 API (API 키 불필요 엔드포인트)
// 2차 시도: CoinGlass 인증 API (COINGLASS_API_KEY 필요)
// 폴백: 정적 샘플 데이터

export interface ETFDayData {
  date: string;         // "YYYY-MM-DD"
  dayLabel: string;     // "월", "화", ...
  netFlow: number;      // 순유입 (백만 달러, 양수=유입, 음수=유출)
  inflow: number;
  outflow: number;
}

export interface ETFData {
  todayNet: number;
  todayInflow: number;
  todayOutflow: number;
  isPositive: boolean;
  consecutiveDays: number;   // 연속 유입/유출 일수
  weekHistory: ETFDayData[];
  totalAUM: number;           // 전체 BTC ETF AUM (억 달러)
  dataSource: "coinglass" | "fallback";
  lastUpdated: string;
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

async function fetchCoinGlassPublic(): Promise<ETFData | null> {
  // CoinGlass 공개 엔드포인트 시도
  try {
    const res = await fetch(
      "https://open-api.coinglass.com/public/v2/indicator/bitcoin_etf_flow_history",
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;

    const raw = await res.json();
    const list = raw?.data?.slice?.(-7) ?? [];
    if (!list.length) return null;

    const history: ETFDayData[] = list.map((d: { date?: string; netFlow?: number; inflow?: number; outflow?: number }) => {
      const dt = new Date(d.date ?? "");
      return {
        date: d.date ?? "",
        dayLabel: DAY_LABELS[dt.getDay()],
        netFlow: d.netFlow ?? 0,
        inflow: d.inflow ?? 0,
        outflow: d.outflow ?? 0,
      };
    });

    const today = history[history.length - 1];
    const isPositive = today.netFlow >= 0;

    // 연속 일수 계산
    let consecutive = 1;
    for (let i = history.length - 2; i >= 0; i--) {
      if (isPositive === (history[i].netFlow >= 0)) consecutive++;
      else break;
    }

    return {
      todayNet: today.netFlow,
      todayInflow: today.inflow,
      todayOutflow: today.outflow,
      isPositive,
      consecutiveDays: consecutive,
      weekHistory: history,
      totalAUM: 0,
      dataSource: "coinglass",
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function fetchCoinGlassAuth(): Promise<ETFData | null> {
  const apiKey = process.env.COINGLASS_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      "https://open-api.coinglass.com/api/pro/v3/bitcoin/etf/flow-history?range=7",
      {
        headers: {
          "coinglassSecret": apiKey,
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;

    const raw = await res.json();
    const list = raw?.data?.slice?.(-7) ?? [];
    if (!list.length) return null;

    const history: ETFDayData[] = list.map((d: { date?: string; netFlow?: number; inflow?: number; outflow?: number }) => {
      const dt = new Date(d.date ?? "");
      return {
        date: d.date ?? "",
        dayLabel: DAY_LABELS[dt.getDay()],
        netFlow: parseFloat(((d.netFlow ?? 0) / 1e6).toFixed(1)),
        inflow: parseFloat(((d.inflow ?? 0) / 1e6).toFixed(1)),
        outflow: parseFloat(((d.outflow ?? 0) / 1e6).toFixed(1)),
      };
    });

    const today = history[history.length - 1];
    const isPositive = today.netFlow >= 0;
    let consecutive = 1;
    for (let i = history.length - 2; i >= 0; i--) {
      if (isPositive === (history[i].netFlow >= 0)) consecutive++;
      else break;
    }

    return {
      todayNet: today.netFlow,
      todayInflow: today.inflow,
      todayOutflow: today.outflow,
      isPositive,
      consecutiveDays: consecutive,
      weekHistory: history,
      totalAUM: raw.data?.totalAUM ?? 0,
      dataSource: "coinglass",
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function getFallbackData(): ETFData {
  const today = new Date();
  const history: ETFDayData[] = [-4, -3, -2, -1, 0].map((dOffset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + dOffset);
    const samples = [128.3, -45.2, 203.1, 87.6, 312.4];
    const idx = dOffset + 4;
    return {
      date: d.toISOString().split("T")[0],
      dayLabel: DAY_LABELS[d.getDay()],
      netFlow: samples[idx] ?? 0,
      inflow: Math.max(0, samples[idx] ?? 0),
      outflow: Math.max(0, -(samples[idx] ?? 0)),
    };
  });

  return {
    todayNet: 312.4,
    todayInflow: 312.4,
    todayOutflow: 58.2,
    isPositive: true,
    consecutiveDays: 5,
    weekHistory: history,
    totalAUM: 1_089,
    dataSource: "fallback",
    lastUpdated: new Date().toISOString(),
  };
}

export const revalidate = 3600;

export async function GET() {
  // 우선순위: 공개 API → 인증 API → 폴백
  const data =
    (await fetchCoinGlassPublic()) ??
    (await fetchCoinGlassAuth()) ??
    getFallbackData();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      "X-Data-Source": data.dataSource,
    },
  });
}
