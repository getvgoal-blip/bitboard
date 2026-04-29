"use client";

import { useEffect, useRef, useState } from "react";

export default function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "BINANCE:BTCUSDT",
      interval: "D",
      timezone: "Asia/Seoul",
      theme: "dark",
      style: "1",
      locale: "kr",
      backgroundColor: "#13131f",
      gridColor: "rgba(30, 30, 48, 0.8)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    const observer = new MutationObserver(() => {
      if (containerRef.current?.querySelector("iframe")) {
        setChartLoaded(true);
        observer.disconnect();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
      containerRef.current.appendChild(script);
    }

    return () => {
      observer.disconnect();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <section className="py-6" id="차트">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">실시간 BTC 차트</h2>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
              TradingView 데이터 제공 · BINANCE:BTCUSDT
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#22c55e" }}
            />
            <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>
              Live
            </span>
          </div>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            height: "460px",
            background: "#13131f",
            border: "1px solid var(--border-color)",
          }}
        >
          {!chartLoaded && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
              style={{ background: "#13131f" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black"
                style={{ background: "linear-gradient(135deg, #f7931a, #e8830a)" }}
              >
                ₿
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">차트 로딩 중...</p>
                <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                  TradingView 위젯을 불러오고 있습니다
                </p>
              </div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: "#f7931a",
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div
            className="tradingview-widget-container w-full h-full"
            ref={containerRef}
          />
        </div>

        <p className="text-xs mt-2 text-center" style={{ color: "#4a5568" }}>
          차트에서 1D · 1W · 1M · 3M 등 타임프레임을 직접 선택할 수 있습니다
        </p>
      </div>
    </section>
  );
}
