"use client";

import { useState, useEffect, useRef } from "react";
import { useBTCPrice } from "@/hooks/useMarketData";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: btc } = useBTCPrice(60_000);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef<number | null>(null);

  useEffect(() => {
    if (!btc) return;
    if (prevPrice.current !== null && prevPrice.current !== btc.price) {
      setFlash(btc.price > prevPrice.current ? "up" : "down");
      const t = setTimeout(() => setFlash(null), 800);
      prevPrice.current = btc.price;
      return () => clearTimeout(t);
    }
    prevPrice.current = btc.price;
  }, [btc?.price]);

  const isPositive = btc ? btc.change24h >= 0 : true;
  const changeColor = isPositive ? "#0ecb81" : "#f6465d";
  const flashBg =
    flash === "up" ? "rgba(14,203,129,0.12)" :
    flash === "down" ? "rgba(246,70,93,0.12)" : "transparent";

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(11, 14, 23, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(28, 35, 51, 0.9)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* 로고 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, #1a6fff, #00c7ff)" }}
            >
              B
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Bit<span style={{ color: "#00c7ff" }}>Board</span>
            </span>
            <span
              className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: "rgba(0,199,255,0.1)", color: "#00c7ff", border: "1px solid rgba(0,199,255,0.2)" }}
            >
              Beta
            </span>
          </div>

          {/* BTC 가격 티커 */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors duration-500"
            style={{ background: flashBg || "var(--bg-card)", border: "1px solid var(--border-color)" }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #f7931a, #e8830a)" }}
            >
              B
            </div>
            {btc ? (
              <div className="flex items-center gap-2">
                <span className="font-black text-white num text-sm sm:text-base">
                  ${btc.price.toLocaleString("en-US")}
                </span>
                <span className="text-xs font-semibold num hidden sm:inline" style={{ color: changeColor }}>
                  {isPositive ? "+" : ""}{btc.change24h.toFixed(2)}%
                </span>
                <span className="text-xs hidden md:inline num" style={{ color: changeColor }}>
                  {isPositive ? "+" : ""}${Math.abs(btc.changeAmount24h).toLocaleString()}
                </span>
              </div>
            ) : (
              <div
                className="h-4 w-24 rounded"
                style={{
                  background: "linear-gradient(90deg, #1c2333 25%, #243047 50%, #1c2333 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            )}
            <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#0ecb81" }} />
          </div>

          {/* 오른쪽 액션 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <nav className="hidden lg:flex items-center gap-5 mr-2">
              {[
                { label: "시장 지표", href: "#시장 지표" },
                { label: "차트", href: "#차트" },
                { label: "거래소", href: "#exchange" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium transition-colors"
                  style={{ color: "#94a3b8" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f1f5f9")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <a
              href="#exchange"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "linear-gradient(135deg, #1a6fff, #00c7ff)", color: "white" }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              <span className="hidden md:inline">거래소 혜택 보기</span>
              <span className="md:hidden">혜택 보기</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <button
              className="lg:hidden p-1.5 rounded-lg"
              style={{ color: "#94a3b8" }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="메뉴"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 */}
        {menuOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t" style={{ borderColor: "var(--border-color)" }}>
            <nav className="flex flex-col gap-1">
              {[
                { label: "시장 지표", href: "#시장 지표" },
                { label: "BTC 차트", href: "#차트" },
                { label: "거래소 비교", href: "#exchange" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-2 py-2.5 rounded-lg text-sm font-medium"
                  style={{ color: "#94a3b8" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#exchange"
                className="mt-2 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #1a6fff, #00c7ff)", color: "white" }}
                onClick={() => setMenuOpen(false)}
              >
                거래소 가입 혜택 보기 →
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
