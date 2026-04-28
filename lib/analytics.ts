"use client";

// ── 이벤트 트래킹 유틸 ───────────────────────────────────────────
// Vercel Analytics + 향후 Google Analytics 확장 가능 구조

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    va?: (...args: unknown[]) => void;
  }
}

export type ExchangeName = "bybit" | "binance" | "bitget";
export type Placement =
  | "hero_cta"
  | "compare_card"
  | "compare_table"
  | "mobile_cta"
  | "header"
  | "footer"
  | "floating_widget";

// 거래소 링크 클릭 추적
export function trackExchangeClick(exchange: string, placement: Placement | string) {
  const eventName = "exchange_click";
  const props = {
    exchange,
    placement,
    timestamp: new Date().toISOString(),
  };

  // Vercel Analytics (va 함수가 있을 때)
  if (typeof window !== "undefined" && window.va) {
    window.va("event", { name: eventName, ...props });
  }

  // Google Analytics 4 (gtag가 있을 때)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      exchange_name: exchange,
      placement,
      event_category: "referral",
      event_label: `${exchange}_${placement}`,
    });
  }

  // 개발 환경 콘솔 로그
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${eventName}`, props);
  }
}

// 페이지뷰 추적 (필요 시 사용)
export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID ?? "", {
      page_path: url,
    });
  }
}

// 지표 카드 조회 추적 (어떤 정보를 많이 보는지)
export function trackMetricView(metric: string) {
  if (typeof window !== "undefined" && window.va) {
    window.va("event", { name: "metric_view", metric });
  }
}
