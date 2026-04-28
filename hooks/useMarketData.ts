"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  BTCPriceData,
  GlobalMarketData,
  FearGreedData,
  HalvingData,
  DXYData,
  DataStatus,
} from "@/lib/types";
import type { ETFData } from "@/app/api/etf/route";

// ── 공통 fetch 유틸 ────────────────────────────────────────────────
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json as T;
}

// ── 개별 훅 팩토리 ────────────────────────────────────────────────
function usePollingData<T>(url: string, refreshMs: number) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<DataStatus>("loading");

  const load = useCallback(async () => {
    try {
      const d = await fetchJSON<T>(url);
      setData(d);
      setStatus("success");
    } catch (e) {
      console.error(`[${url}]`, e);
      setStatus((prev) => (prev === "success" ? "success" : "error")); // 이미 데이터 있으면 유지
    }
  }, [url]);

  useEffect(() => {
    load();
    const t = setInterval(load, refreshMs);
    return () => clearInterval(t);
  }, [load, refreshMs]);

  return { data, status };
}

// ── 공개 훅 ────────────────────────────────────────────────────────
export function useBTCPrice(refreshMs = 60_000) {
  return usePollingData<BTCPriceData>("/api/btc", refreshMs);
}

export function useGlobalMarket(refreshMs = 60_000) {
  return usePollingData<GlobalMarketData>("/api/global", refreshMs);
}

export function useFearGreed(refreshMs = 3_600_000) {
  return usePollingData<FearGreedData>("/api/fear-greed", refreshMs);
}

export function useHalving(refreshMs = 60_000) {
  return usePollingData<HalvingData>("/api/halving", refreshMs);
}

export function useDXY(refreshMs = 300_000) {
  return usePollingData<DXYData>("/api/dxy", refreshMs);
}

export function useETF(refreshMs = 3_600_000) {
  return usePollingData<ETFData>("/api/etf", refreshMs);
}

// ── 통합 훅 ────────────────────────────────────────────────────────
export function useAllMarketData() {
  const btc = useBTCPrice(60_000);
  const global = useGlobalMarket(60_000);
  const fearGreed = useFearGreed(3_600_000);
  const halving = useHalving(60_000);
  const dxy = useDXY(300_000);

  const isLoading =
    btc.status === "loading" ||
    global.status === "loading" ||
    fearGreed.status === "loading";

  const hasError =
    btc.status === "error" &&
    global.status === "error";

  return {
    btc: btc.data,
    global: global.data,
    fearGreed: fearGreed.data,
    halving: halving.data,
    dxy: dxy.data,
    isLoading,
    hasError,
  };
}
