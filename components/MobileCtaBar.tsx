"use client";

import { useState, useEffect } from "react";
import { useBTCPrice } from "@/hooks/useMarketData";
import { trackExchangeClick } from "@/lib/analytics";
import { getReferralUrl } from "@/lib/referrals";

export default function MobileCtaBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const { data: btc } = useBTCPrice(60_000);

  const exchanges = [
    { id: "bybit",   name: "Bybit",   bonus: "$30,000", color: "#f7931a" },
    { id: "bitget",  name: "Bitget",  bonus: "$8,000",  color: "#00c6ff" },
    { id: "binance", name: "Binance", bonus: "$600",     color: "#f0b90b" },
  ];

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveIdx((p) => (p + 1) % exchanges.length), 5000);
    return () => clearInterval(t);
  }, []);

  if (dismissed) return null;

  const ex = exchanges[activeIdx];
  const isPositive = btc ? btc.change24h >= 0 : true;
  const btcChangeColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <>
      {/* 모바일 하단 고정 바 */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ transform: visible ? "translateY(0)" : "translateY(100%)", opacity: visible ? 1 : 0 }}
      >
        {btc && (
          <div
            className="flex items-center justify-center gap-2 py-1.5 text-xs"
            style={{ background: "rgba(13,13,20,0.95)", borderTop: "1px solid rgba(30,30,48,0.8)" }}
          >
            <span className="text-white font-bold num">BTC ${btc.price.toLocaleString("en-US")}</span>
            <span style={{ color: btcChangeColor }}>{isPositive ? "+" : ""}{btc.change24h.toFixed(2)}%</span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
          </div>
        )}
        <div style={{ background: "rgba(13,13,20,0.97)", borderTop: "1px solid rgba(247,147,26,0.2)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          <div className="flex items-center px-4 py-3 gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ex.color }}>{ex.name}</span>
                <span className="text-[10px]" style={{ color: "#4a5568" }}>신규 가입</span>
              </div>
              <p className="text-sm font-black text-white leading-tight">
                최대 <span style={{ color: ex.color }}>{ex.bonus}</span> 보너스
                <span className="text-xs font-normal ml-1" style={{ color: "#64748b" }}>+ 수수료 20% 할인</span>
              </p>
            </div>
            <div className="flex flex-col gap-1 items-center">
              {exchanges.map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-300" style={{ width: i === activeIdx ? 6 : 4, height: i === activeIdx ? 6 : 4, background: i === activeIdx ? ex.color : "#2a2a40" }} />
              ))}
            </div>
            <a
              href={getReferralUrl(ex.id, "mobile_cta")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: `linear-gradient(135deg, ${ex.color}, ${ex.color}cc)`, color: "white", minWidth: 88, textAlign: "center" }}
              onClick={() => trackExchangeClick(ex.id, "mobile_cta")}
            >
              지금 가입 →
            </a>
            <button onClick={() => setDismissed(true)} className="flex-shrink-0 p-1 rounded-full" style={{ color: "#4a5568" }} aria-label="닫기">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 데스크탑 플로팅 위젯 */}
      <div
        className="hidden sm:flex fixed bottom-6 right-6 z-50 flex-col gap-2 transition-all duration-300"
        style={{ transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)", opacity: visible ? 1 : 0 }}
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "rgba(13,13,20,0.97)", border: "1px solid rgba(247,147,26,0.25)", minWidth: 220 }}>
          <div className="px-4 py-3">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>신규 가입 혜택</p>
                <p className="text-sm font-bold text-white mt-0.5">거래소 가입 시<br /><span style={{ color: "#f7931a" }}>최대 $30,000</span></p>
              </div>
              <button onClick={() => setDismissed(true)} className="p-1 rounded-full flex-shrink-0" style={{ color: "#4a5568" }} aria-label="닫기">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {exchanges.map((e) => (
                <a
                  key={e.id}
                  href={getReferralUrl(e.id, "floating_widget")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors"
                  style={{ background: `${e.color}10`, border: `1px solid ${e.color}25` }}
                  onMouseEnter={(el) => (el.currentTarget.style.background = `${e.color}1e`)}
                  onMouseLeave={(el) => (el.currentTarget.style.background = `${e.color}10`)}
                  onClick={() => trackExchangeClick(e.id, "floating_widget")}
                >
                  <span className="text-xs font-semibold text-white">{e.name}</span>
                  <span className="text-xs font-bold" style={{ color: e.color }}>+{e.bonus}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
