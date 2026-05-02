"use client";

import { useEffect, useRef, useState } from "react";
import { useBTCPrice, useFearGreed } from "@/hooks/useMarketData";

function formatPrice(price: number) {
  return price.toLocaleString("en-US");
}

function Skeleton({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        background: "linear-gradient(90deg, #1c2333 25%, #243047 50%, #1c2333 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

export default function Hero() {
  const { data: btc, status: btcStatus } = useBTCPrice(60_000);
  const { data: fg } = useFearGreed();

  const isLoading = btcStatus === "loading";
  const isPositive = btc ? btc.change24h >= 0 : true;

  const getMarketStatus = () => {
    if (!btc || !fg) return "분석 중";
    if (btc.change24h > 3 && fg.value > 60) return "강한 강세";
    if (btc.change24h > 0) return "강세";
    if (btc.change24h < -3 && fg.value < 40) return "강한 약세";
    return "약세";
  };

  return (
    <section className="relative py-6 sm:py-10 overflow-hidden">
      {/* 배경 글로우 — 블루 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% 0%, rgba(0, 199, 255, 0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0ecb81" }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#94a3b8" }}>
            Live Market
          </span>
          {btc && (
            <span className="text-xs" style={{ color: "#4a5568" }}>· 60초마다 업데이트</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <BTCPriceCard btc={btc} isLoading={isLoading} isPositive={isPositive} />
          <MarketStatusCard marketStatus={getMarketStatus()} fearGreed={fg} isPositive={isPositive} />
          <ExchangeCTACard />
        </div>
      </div>
    </section>
  );
}

// ─── BTC 가격 카드 ────────────────────────────────────────────────
function BTCPriceCard({
  btc,
  isLoading,
  isPositive,
}: {
  btc: ReturnType<typeof useBTCPrice>["data"];
  isLoading: boolean;
  isPositive: boolean;
}) {
  const changeColor = isPositive ? "#0ecb81" : "#f6465d";
  const changeBg = isPositive ? "rgba(14, 203, 129, 0.1)" : "rgba(246, 70, 93, 0.1)";

  const prevPriceRef = useRef<number | null>(null);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (!btc) return;
    if (prevPriceRef.current !== null && prevPriceRef.current !== btc.price) {
      setFlash(btc.price > prevPriceRef.current ? "up" : "down");
      const t = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(t);
    }
    prevPriceRef.current = btc.price;
  }, [btc?.price]);

  const flashStyle: React.CSSProperties =
    flash === "up"
      ? { textShadow: "0 0 30px rgba(14,203,129,0.8)", color: "#0ecb81", transition: "color 0.15s, text-shadow 0.15s" }
      : flash === "down"
      ? { textShadow: "0 0 30px rgba(246,70,93,0.8)", color: "#f6465d", transition: "color 0.15s, text-shadow 0.15s" }
      : { color: "white", transition: "color 0.4s, text-shadow 0.4s" };

  return (
    <div
      className="card btc-glow sm:col-span-2 lg:col-span-1 fade-in"
      style={{
        background: "linear-gradient(135deg, #131722 0%, #1a1a2e 100%)",
        borderColor: "rgba(247, 147, 26, 0.2)",
        boxShadow: "0 0 40px rgba(247,147,26,0.06), 0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-base font-black"
            style={{ background: "linear-gradient(135deg, #f7931a, #e8830a)", boxShadow: "0 4px 12px rgba(247,147,26,0.4)" }}
          >
            ₿
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "#94a3b8" }}>Bitcoin</p>
            <p className="text-sm font-bold text-white">BTC/USDT</p>
          </div>
        </div>
        {isLoading ? (
          <Skeleton style={{ width: 60, height: 24 }} />
        ) : (
          <span
            className="badge"
            style={{ background: changeBg, color: changeColor, border: `1px solid ${changeColor}33`, fontSize: 13 }}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(btc?.change24h ?? 0).toFixed(2)}%
          </span>
        )}
      </div>

      {/* 메인 가격 */}
      <div className="mb-5">
        {isLoading ? (
          <>
            <Skeleton style={{ width: "80%", height: 56, marginBottom: 10 }} />
            <Skeleton style={{ width: "45%", height: 18 }} />
          </>
        ) : (
          <>
            <p
              className="num font-black leading-none"
              style={{ fontSize: "clamp(44px, 6vw, 64px)", ...flashStyle }}
            >
              ${formatPrice(btc?.price ?? 0)}
            </p>
            <p className="text-sm mt-2 font-medium" style={{ color: changeColor }}>
              {isPositive ? "+" : ""}${formatPrice(btc?.changeAmount24h ?? 0)}{" "}
              <span className="text-xs" style={{ color: "#64748b" }}>24h</span>
            </p>
          </>
        )}
      </div>

      {/* 하단 통계 */}
      <div className="grid grid-cols-2 gap-3 pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div>
          <p className="text-xs mb-1" style={{ color: "#64748b" }}>24h 거래량</p>
          {isLoading ? <Skeleton style={{ width: 70, height: 20 }} /> : (
            <p className="text-base font-bold text-white num">${btc?.volume24h}B</p>
          )}
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: "#64748b" }}>시가총액</p>
          {isLoading ? <Skeleton style={{ width: 70, height: 20 }} /> : (
            <p className="text-base font-bold text-white num">${btc?.marketCap}T</p>
          )}
        </div>
      </div>

      {/* 24h 고가/저가 */}
      {!isLoading && btc && (
        <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold" style={{ color: "#0ecb81" }}>고</span>
            <span className="text-sm font-bold num text-white">${formatPrice(btc.high24h)}</span>
          </div>
          <div className="h-1.5 flex-1 mx-3 rounded-full overflow-hidden" style={{ background: "#1c2333" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.round(((btc.price - btc.low24h) / (btc.high24h - btc.low24h || 1)) * 100)}%`,
                background: "linear-gradient(90deg, #f6465d, #0ecb81)",
              }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold num text-white">${formatPrice(btc.low24h)}</span>
            <span className="text-[11px] font-semibold" style={{ color: "#f6465d" }}>저</span>
          </div>
        </div>
      )}

      {/* 미니 바 차트 */}
      <div className="flex items-end gap-0.5 mt-4" style={{ height: "32px" }}>
        {[40, 55, 45, 60, 52, 68, 58, 72, 65, 78, 70, 85].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background:
                i === 11 ? "#f7931a" : isPositive ? "rgba(14, 203, 129, 0.3)" : "rgba(246, 70, 93, 0.3)",
              transition: "height 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── 시장 상태 카드 ───────────────────────────────────────────────
function MarketStatusCard({
  marketStatus,
  fearGreed,
  isPositive,
}: {
  marketStatus: string;
  fearGreed: ReturnType<typeof useFearGreed>["data"];
  isPositive: boolean;
}) {
  const statusColor =
    marketStatus.includes("강세") ? "#0ecb81" :
    marketStatus.includes("약세") ? "#f6465d" : "#eab308";

  const getFGColor = (val: number) => {
    if (val <= 20) return "#f6465d";
    if (val <= 40) return "#f97316";
    if (val <= 60) return "#eab308";
    if (val <= 80) return "#84cc16";
    return "#0ecb81";
  };

  const fgValue = fearGreed?.value ?? 50;
  const fgColor = getFGColor(fgValue);

  const signals = [
    { label: "추세", value: isPositive ? "상승" : "하락", pos: isPositive },
    { label: "심리", value: fearGreed?.label ?? "—", pos: fgValue >= 50 },
    { label: "변동성", value: "보통", pos: null },
    { label: "모멘텀", value: isPositive ? "강함" : "약함", pos: isPositive },
  ];

  return (
    <div
      className="card fade-in"
      style={{
        animationDelay: "0.1s",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: "#94a3b8" }}>오늘 시장 상태</p>
          <p className="text-2xl font-black" style={{ color: statusColor }}>{marketStatus}</p>
        </div>
        {fearGreed ? (
          <div
            className="flex flex-col items-center px-4 py-3 rounded-xl"
            style={{ background: "var(--bg-elevated)", border: `1px solid ${fgColor}22` }}
          >
            <span className="text-2xl font-black num" style={{ color: fgColor }}>{fgValue}</span>
            <span className="text-[11px] font-semibold mt-0.5" style={{ color: fgColor }}>{fearGreed.label}</span>
          </div>
        ) : (
          <Skeleton style={{ width: 64, height: 60, borderRadius: 12 }} />
        )}
      </div>

      {/* 공포탐욕 게이지 */}
      <div className="mb-4">
        <div
          className="relative h-2.5 rounded-full overflow-hidden mb-1.5"
          style={{ background: "linear-gradient(90deg, #f6465d 0%, #f97316 25%, #eab308 50%, #84cc16 75%, #0ecb81 100%)" }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg transition-all duration-700"
            style={{ left: `calc(${fgValue}% - 7px)`, background: fgColor }}
          />
        </div>
        <div className="flex justify-between text-[11px]" style={{ color: "#64748b" }}>
          <span>공포</span><span>중립</span><span>탐욕</span>
        </div>
      </div>

      {/* 시그널 */}
      <div className="grid grid-cols-2 gap-2">
        {signals.map((sig) => (
          <div
            key={sig.label}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg"
            style={{ background: "var(--bg-elevated)" }}
          >
            <span className="text-xs" style={{ color: "#64748b" }}>{sig.label}</span>
            <span
              className="text-xs font-bold"
              style={{ color: sig.pos === true ? "#0ecb81" : sig.pos === false ? "#f6465d" : "#94a3b8" }}
            >
              {sig.value}
            </span>
          </div>
        ))}
      </div>

      {fearGreed && (
        <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border-color)" }}>
          <span className="text-xs" style={{ color: "#64748b" }}>전일 대비</span>
          <span className="text-sm font-bold" style={{ color: fearGreed.value >= fearGreed.previousValue ? "#0ecb81" : "#f6465d" }}>
            {fearGreed.value >= fearGreed.previousValue ? "▲" : "▼"}{" "}
            {Math.abs(fearGreed.value - fearGreed.previousValue)}pt
            <span className="ml-1 text-xs" style={{ color: "#4a5568" }}>(어제 {fearGreed.previousValue})</span>
          </span>
        </div>
      )}
    </div>
  );
}

// ─── 거래소 CTA 카드 ──────────────────────────────────────────────
function ExchangeCTACard() {
  const exchanges = [
    { name: "Binance", bonus: "최대 $600",    color: "#f0b90b", emoji: "🟡" },
    { name: "Bitget",  bonus: "최대 $8,000",  color: "#00c7ff", emoji: "🔵" },
    { name: "Bybit",   bonus: "최대 $30,000", color: "#f7931a", emoji: "🟠" },
  ];

  return (
    <div
      className="card fade-in relative overflow-hidden"
      style={{
        animationDelay: "0.2s",
        background: "linear-gradient(135deg, #131722 0%, #111d2e 100%)",
        borderColor: "rgba(0, 199, 255, 0.18)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 199, 255, 0.12), transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div className="relative">
        <div className="mb-5">
          <span className="badge badge-blue mb-3">🎁 신규 가입 혜택</span>
          <p className="text-lg font-black text-white mt-2 leading-snug">
            거래소 가입하고<br />
            <span style={{ color: "#00c7ff" }}>최대 $30,000</span> 받기
          </p>
          <p className="text-xs mt-1.5" style={{ color: "#64748b" }}>
            리퍼럴 가입 시 수수료 할인 + 보너스
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {exchanges.map((ex) => (
            <div
              key={ex.name}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{ex.emoji}</span>
                <span className="text-sm font-semibold text-white">{ex.name}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: ex.color }}>{ex.bonus}</span>
            </div>
          ))}
        </div>

        <a
          href="#exchange"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold transition-all"
          style={{
            background: "linear-gradient(135deg, #1a6fff, #00c7ff)",
            color: "white",
            fontSize: 15,
            boxShadow: "0 4px 20px rgba(0, 199, 255, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 28px rgba(0, 199, 255, 0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 199, 255, 0.3)";
          }}
        >
          혜택 비교하고 가입하기
          <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}
