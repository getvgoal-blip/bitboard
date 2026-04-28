"use client";

import { useBTCPrice, useFearGreed } from "@/hooks/useMarketData";

// ── 유틸 ─────────────────────────────────────────────────────────
function formatPrice(price: number) {
  return price.toLocaleString("en-US");
}

// ── 스켈레톤 로딩 컴포넌트 ────────────────────────────────────────
function Skeleton({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        background: "linear-gradient(90deg, #1e1e30 25%, #25253a 50%, #1e1e30 75%)",
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

  // 시장 상태 판단
  const getMarketStatus = () => {
    if (!btc || !fg) return "분석 중";
    if (btc.change24h > 3 && fg.value > 60) return "강한 강세";
    if (btc.change24h > 0) return "강세";
    if (btc.change24h < -3 && fg.value < 40) return "강한 약세";
    return "약세";
  };

  return (
    <section className="relative py-6 sm:py-10 overflow-hidden">
      {/* 배경 글로우 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(247, 147, 26, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* 섹션 레이블 */}
        <div className="flex items-center gap-2 mb-6">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#22c55e" }}
          />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#94a3b8" }}>
            Live Market
          </span>
          {btc && (
            <span className="text-xs" style={{ color: "#4a5568" }}>
              · 60초마다 업데이트
            </span>
          )}
        </div>

        {/* 3-컬럼 히어로 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <BTCPriceCard btc={btc} isLoading={isLoading} isPositive={isPositive} />
          <MarketStatusCard
            marketStatus={getMarketStatus()}
            fearGreed={fg}
            isPositive={isPositive}
          />
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
  const changeColor = isPositive ? "#22c55e" : "#ef4444";
  const changeBg = isPositive ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)";

  return (
    <div
      className="card btc-glow sm:col-span-2 lg:col-span-1 fade-in"
      style={{
        background: "linear-gradient(135deg, #13131f 0%, #1a1a2e 100%)",
        borderColor: "rgba(247, 147, 26, 0.2)",
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
            style={{ background: "linear-gradient(135deg, #f7931a, #e8830a)" }}
          >
            ₿
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "#94a3b8" }}>Bitcoin</p>
            <p className="text-xs font-bold text-white">BTC/USDT</p>
          </div>
        </div>
        {isLoading ? (
          <Skeleton style={{ width: 60, height: 22 }} />
        ) : (
          <span
            className="badge"
            style={{
              background: changeBg,
              color: changeColor,
              border: `1px solid ${changeColor}33`,
            }}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(btc?.change24h ?? 0).toFixed(2)}%
          </span>
        )}
      </div>

      {/* 메인 가격 */}
      <div className="mb-4">
        {isLoading ? (
          <>
            <Skeleton style={{ width: "75%", height: 40, marginBottom: 8 }} />
            <Skeleton style={{ width: "45%", height: 16 }} />
          </>
        ) : (
          <>
            <p
              className="num font-black leading-none"
              style={{ fontSize: "clamp(28px, 5vw, 36px)", color: "white" }}
            >
              ${formatPrice(btc?.price ?? 0)}
            </p>
            <p className="text-sm mt-1" style={{ color: changeColor }}>
              {isPositive ? "+" : ""}${formatPrice(btc?.changeAmount24h ?? 0)}{" "}
              <span style={{ color: "#64748b" }}>24h</span>
            </p>
          </>
        )}
      </div>

      {/* 하단 통계 */}
      <div
        className="grid grid-cols-2 gap-3 pt-4"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <div>
          <p className="text-xs mb-0.5" style={{ color: "#64748b" }}>24h 거래량</p>
          {isLoading ? (
            <Skeleton style={{ width: 70, height: 18 }} />
          ) : (
            <p className="text-sm font-semibold text-white num">${btc?.volume24h}B</p>
          )}
        </div>
        <div>
          <p className="text-xs mb-0.5" style={{ color: "#64748b" }}>시가총액</p>
          {isLoading ? (
            <Skeleton style={{ width: 70, height: 18 }} />
          ) : (
            <p className="text-sm font-semibold text-white num">${btc?.marketCap}T</p>
          )}
        </div>
      </div>

      {/* 24h 고가/저가 */}
      {!isLoading && btc && (
        <div
          className="mt-3 pt-3 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium" style={{ color: "#22c55e" }}>고</span>
            <span className="text-xs font-semibold num text-white">${formatPrice(btc.high24h)}</span>
          </div>
          <div
            className="h-1 flex-1 mx-3 rounded-full overflow-hidden"
            style={{ background: "#1e1e30" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.round(((btc.price - btc.low24h) / (btc.high24h - btc.low24h || 1)) * 100)}%`,
                background: "linear-gradient(90deg, #ef4444, #22c55e)",
              }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold num text-white">${formatPrice(btc.low24h)}</span>
            <span className="text-[10px] font-medium" style={{ color: "#ef4444" }}>저</span>
          </div>
        </div>
      )}

      {/* 미니 바 차트 (장식용) */}
      <div className="flex items-end gap-0.5 mt-4" style={{ height: "28px" }}>
        {[40, 55, 45, 60, 52, 68, 58, 72, 65, 78, 70, 85].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background:
                i === 11
                  ? "#f7931a"
                  : isPositive
                  ? "rgba(34, 197, 94, 0.25)"
                  : "rgba(239, 68, 68, 0.25)",
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
    marketStatus.includes("강세") ? "#22c55e" :
    marketStatus.includes("약세") ? "#ef4444" : "#eab308";

  const getFGColor = (val: number) => {
    if (val <= 20) return "#ef4444";
    if (val <= 40) return "#f97316";
    if (val <= 60) return "#eab308";
    if (val <= 80) return "#84cc16";
    return "#22c55e";
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
    <div className="card fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium mb-0.5" style={{ color: "#94a3b8" }}>
            오늘 시장 상태
          </p>
          <p className="text-lg font-bold" style={{ color: statusColor }}>
            {marketStatus}
          </p>
        </div>
        {/* 공포탐욕 미니 */}
        {fearGreed ? (
          <div
            className="flex flex-col items-center px-3 py-2 rounded-xl"
            style={{ background: "var(--bg-elevated)" }}
          >
            <span className="text-xl font-black num" style={{ color: fgColor }}>
              {fgValue}
            </span>
            <span className="text-[10px] font-semibold" style={{ color: fgColor }}>
              {fearGreed.label}
            </span>
          </div>
        ) : (
          <Skeleton style={{ width: 56, height: 52, borderRadius: 12 }} />
        )}
      </div>

      {/* 공포탐욕 게이지 바 */}
      <div className="mb-4">
        <div
          className="relative h-2 rounded-full overflow-hidden mb-1"
          style={{
            background: "linear-gradient(90deg, #ef4444 0%, #f97316 25%, #eab308 50%, #84cc16 75%, #22c55e 100%)",
          }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-lg transition-all duration-700"
            style={{ left: `calc(${fgValue}% - 6px)`, background: fgColor }}
          />
        </div>
        <div className="flex justify-between text-[10px]" style={{ color: "#64748b" }}>
          <span>공포</span>
          <span>중립</span>
          <span>탐욕</span>
        </div>
      </div>

      {/* 시그널 목록 */}
      <div className="grid grid-cols-2 gap-2">
        {signals.map((sig) => (
          <div
            key={sig.label}
            className="flex items-center justify-between px-2.5 py-2 rounded-lg"
            style={{ background: "var(--bg-elevated)" }}
          >
            <span className="text-xs" style={{ color: "#64748b" }}>{sig.label}</span>
            <span
              className="text-xs font-semibold"
              style={{
                color: sig.pos === true ? "#22c55e" : sig.pos === false ? "#ef4444" : "#94a3b8",
              }}
            >
              {sig.value}
            </span>
          </div>
        ))}
      </div>

      {/* 직전 공포탐욕 비교 */}
      {fearGreed && (
        <div
          className="mt-3 pt-3 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <span className="text-xs" style={{ color: "#64748b" }}>전일 대비</span>
          <span
            className="text-xs font-semibold"
            style={{
              color: fearGreed.value >= fearGreed.previousValue ? "#22c55e" : "#ef4444",
            }}
          >
            {fearGreed.value >= fearGreed.previousValue ? "▲" : "▼"}{" "}
            {Math.abs(fearGreed.value - fearGreed.previousValue)}pt
            <span className="ml-1 text-[10px]" style={{ color: "#4a5568" }}>
              (어제 {fearGreed.previousValue})
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

// ─── 거래소 CTA 카드 ──────────────────────────────────────────────
function ExchangeCTACard() {
  const exchanges = [
    { name: "Binance", bonus: "최대 $600", color: "#f0b90b", emoji: "🟡" },
    { name: "Bitget", bonus: "최대 $8,000", color: "#00c6ff", emoji: "🔵" },
    { name: "Bybit", bonus: "최대 $30,000", color: "#f7931a", emoji: "🟠" },
  ];

  return (
    <div
      className="card fade-in relative overflow-hidden"
      style={{
        animationDelay: "0.2s",
        background: "linear-gradient(135deg, #13131f 0%, #1a1229 100%)",
        borderColor: "rgba(247, 147, 26, 0.15)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(247, 147, 26, 0.15), transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="relative">
        <div className="mb-4">
          <span className="badge badge-orange mb-2">🎁 신규 가입 혜택</span>
          <p className="text-base font-bold text-white mt-2">
            거래소 가입하고<br />
            <span style={{ color: "#f7931a" }}>최대 $30,000</span> 받기
          </p>
          <p className="text-xs mt-1" style={{ color: "#64748b" }}>
            리퍼럴 가입 시 수수료 할인 + 보너스
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {exchanges.map((ex) => (
            <div
              key={ex.name}
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{ex.emoji}</span>
                <span className="text-sm font-semibold text-white">{ex.name}</span>
              </div>
              <span className="text-xs font-bold" style={{ color: ex.color }}>
                {ex.bonus}
              </span>
            </div>
          ))}
        </div>

        <a
          href="#exchange"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all"
          style={{
            background: "linear-gradient(135deg, #f7931a, #e8830a)",
            color: "white",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
        >
          혜택 비교하고 가입하기
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}
