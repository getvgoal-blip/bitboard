// ── 시장 데이터 타입 정의 ─────────────────────────────────────────

export interface BTCPriceData {
  price: number;
  change24h: number;
  changeAmount24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  lastUpdated: string;
}

export interface GlobalMarketData {
  btcDominance: number;
  dominanceChange: number;
  totalMarketCap: number;
  totalVolume24h: number;
  altcoinSeasonIndex: number | null;
}

export interface FearGreedData {
  value: number;
  label: string;
  previousValue: number;
  previousLabel: string;
  lastUpdated: string;
}

export interface HalvingData {
  lastHalvingDate: string;
  nextHalvingDate: string;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  progressPercent: number;
  blockHeight: number;
  nextHalvingBlock: number;
}

export interface DXYData {
  value: number;
  change: number;
  changePercent: number;
  previousClose: number;
  high: number;
  low: number;
  weekHistory: number[];
  lastUpdated: string;
}

export type DataStatus = "idle" | "loading" | "success" | "error";
