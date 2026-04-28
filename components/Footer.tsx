"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    시장정보: ["BTC 가격", "공포탐욕지수", "ETF 유입/유출", "도미넌스"],
    거래소: ["Binance 가입", "Bitget 가입", "Bybit 가입"],
    정보: ["면책 고지", "개인정보처리방침", "이용약관"],
  };

  return (
    <footer
      className="border-t"
      style={{
        borderColor: "var(--border-color)",
        background: "var(--bg-base)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* 상단: 로고 + 링크 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {/* 브랜드 */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
                style={{ background: "linear-gradient(135deg, #f7931a, #e8830a)" }}
              >
                ₿
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Bit<span style={{ color: "#f7931a" }}>Board</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#4a5568" }}>
              비트코인 시장을 한눈에.
              <br />
              초보자도 5초 안에 시장 상황을
              <br />
              파악할 수 있는 대시보드.
            </p>
            {/* 소셜 링크 */}
            <div className="flex gap-2 mt-4">
              {["트위터", "텔레그램"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                  style={{
                    background: "var(--bg-card)",
                    color: "#64748b",
                    border: "1px solid var(--border-color)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f7931a";
                    e.currentTarget.style.borderColor = "rgba(247,147,26,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#64748b";
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* 링크 섹션 */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#64748b" }}
              >
                {category}
              </p>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs transition-colors"
                      style={{ color: "#4a5568" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#4a5568")}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <div style={{ borderTop: "1px solid var(--border-color)" }} className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* 카피라이트 */}
            <p className="text-xs" style={{ color: "#374151" }}>
              © {currentYear} BitBoard. All rights reserved.
            </p>

            {/* 면책 고지 */}
            <p
              className="text-xs text-center sm:text-right max-w-sm leading-relaxed"
              style={{ color: "#374151" }}
            >
              본 사이트는 투자 권유가 아닙니다. 모든 투자 판단과 책임은 본인에게 있습니다.
              거래소 리퍼럴 링크를 통해 수수료 수익이 발생할 수 있습니다.
            </p>
          </div>

          {/* 데이터 출처 */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
            <span className="text-[10px]" style={{ color: "#2d3748" }}>
              데이터 출처:
            </span>
            {["CoinGecko", "TradingView", "Alternative.me", "SoSo Value", "CoinMarketCap"].map(
              (source) => (
                <span
                  key={source}
                  className="text-[10px]"
                  style={{ color: "#374151" }}
                >
                  {source}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
