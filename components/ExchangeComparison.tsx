"use client";

import { EXCHANGES, getReferralUrl } from "@/lib/referrals";
import type { ExchangeConfig } from "@/lib/referrals";
import { trackExchangeClick } from "@/lib/analytics";

const COMPARE_ROWS = [
  { label: "가입 보너스", key: "bonus" },
  { label: "수수료 할인", key: "feeDiscount", suffix: " 할인" },
  { label: "24h 거래량", key: "volume24h" },
  { label: "가입자 수", key: "users" },
];

export default function ExchangeComparison() {
  return (
    <section className="py-10 pb-20" id="exchange" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="badge badge-orange mb-3">🎁 리퍼럴 혜택</span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            거래소 가입 혜택 비교
          </h2>
          <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "#94a3b8" }}>
            리퍼럴 링크로 가입하면 수수료 할인 + 보너스를 동시에 받을 수 있어요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {EXCHANGES.map((ex, idx) => (
            <ExchangeCard key={ex.id} exchange={ex} delay={idx * 0.05} />
          ))}
        </div>

        <CompareTable />
        <FAQSection />

        <p className="text-center text-xs mt-6" style={{ color: "#374151" }}>
          * 위 혜택은 리퍼럴 링크 가입 기준이며, 거래소 정책에 따라 변경될 수 있습니다.
          투자는 본인 책임 하에 신중하게 결정하세요.
        </p>
      </div>
    </section>
  );
}

function ExchangeCard({ exchange: ex, delay }: { exchange: ExchangeConfig; delay: number }) {
  const url = getReferralUrl(ex.id, "compare");

  return (
    <div
      className="card fade-in relative flex flex-col"
      style={{
        animationDelay: `${delay}s`,
        borderColor: ex.recommended ? ex.borderColor : "var(--border-color)",
        background: ex.recommended
          ? "linear-gradient(135deg, #13131f 0%, #1a1a2e 100%)"
          : "var(--bg-card)",
      }}
    >
      {ex.recommended && (
        <div
          className="absolute -top-px left-4 right-4 h-0.5 rounded-b"
          style={{ background: `linear-gradient(90deg, transparent, ${ex.color}, transparent)` }}
        />
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: ex.colorDim, border: `1px solid ${ex.borderColor}` }}
          >
            {ex.emoji}
          </div>
          <div>
            <p className="font-bold text-white leading-none">{ex.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{ex.tagline}</p>
          </div>
        </div>
        <span
          className="badge text-[10px]"
          style={{
            background: `${ex.badgeColor}1a`,
            color: ex.badgeColor,
            border: `1px solid ${ex.badgeColor}33`,
          }}
        >
          {ex.badge}
        </span>
      </div>

      <div
        className="px-4 py-3 rounded-xl mb-4"
        style={{ background: ex.colorDim, border: `1px solid ${ex.borderColor}` }}
      >
        <p className="text-xs mb-0.5" style={{ color: "#94a3b8" }}>{ex.bonusDetail}</p>
        <p className="text-2xl font-black num" style={{ color: ex.color }}>{ex.bonus}</p>
        <p className="text-xs mt-1" style={{ color: "#64748b" }}>
          + 수수료 {ex.feeDiscount} 할인
        </p>
      </div>

      <div className="flex flex-col gap-1.5 mb-4 flex-1">
        {ex.features.map((f) => (
          <div key={f} className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
              <path d="M2 6l3 3 5-5" stroke={ex.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs" style={{ color: "#94a3b8" }}>{f}</span>
          </div>
        ))}
      </div>

      <div
        className="flex flex-col gap-1 mb-4 pt-3"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        {ex.pros.map((p) => (
          <div key={p} className="flex items-start gap-1.5">
            <span className="text-xs mt-0.5" style={{ color: "#22c55e" }}>✓</span>
            <span className="text-xs" style={{ color: "#64748b" }}>{p}</span>
          </div>
        ))}
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all mt-auto"
        style={{
          background: ex.recommended
            ? `linear-gradient(135deg, ${ex.color}, ${ex.color}cc)`
            : ex.colorDim,
          color: ex.recommended ? "white" : ex.color,
          border: `1px solid ${ex.borderColor}`,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
        onClick={() => trackExchangeClick(ex.id, "compare_card")}
      >
        {ex.name} 가입하기
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}

function CompareTable() {
  return (
    <div
      className="rounded-2xl overflow-hidden mb-8"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
    >
      <div
        className="grid text-xs font-semibold px-4 py-3"
        style={{
          gridTemplateColumns: `1fr repeat(${EXCHANGES.length}, 1fr)`,
          background: "var(--bg-elevated)",
          borderBottom: "1px solid var(--border-color)",
          color: "#64748b",
        }}
      >
        <div>항목</div>
        {EXCHANGES.map((ex) => (
          <div key={ex.id} className="text-center" style={{ color: ex.color }}>
            {ex.emoji} {ex.name}
          </div>
        ))}
      </div>

      {COMPARE_ROWS.map((row, i) => (
        <div
          key={row.label}
          className="grid text-xs px-4 py-3 transition-colors"
          style={{
            gridTemplateColumns: `1fr repeat(${EXCHANGES.length}, 1fr)`,
            borderBottom: i < COMPARE_ROWS.length - 1 ? "1px solid var(--border-color)" : "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div className="font-medium" style={{ color: "#94a3b8" }}>{row.label}</div>
          {EXCHANGES.map((ex) => {
            const val = ex[row.key as keyof ExchangeConfig] as string;
            const isBonus = row.key === "bonus";
            return (
              <div key={ex.id} className="text-center font-semibold">
                <span style={{ color: isBonus ? ex.color : "#e2e8f0" }}>
                  {row.suffix ? `${val}${row.suffix}` : val}
                </span>
              </div>
            );
          })}
        </div>
      ))}

      <div
        className="grid gap-2 px-4 py-3"
        style={{
          gridTemplateColumns: `1fr repeat(${EXCHANGES.length}, 1fr)`,
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center text-xs font-medium" style={{ color: "#64748b" }}>
          바로 가입
        </div>
        {EXCHANGES.map((ex) => (
          <div key={ex.id} className="flex justify-center">
            <a
              href={getReferralUrl(ex.id, "compare")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: ex.recommended
                  ? `linear-gradient(135deg, ${ex.color}, ${ex.color}cc)`
                  : ex.colorDim,
                color: ex.recommended ? "white" : ex.color,
                border: `1px solid ${ex.borderColor}`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
              onClick={() => trackExchangeClick(ex.id, "compare_table")}
            >
              가입
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "리퍼럴 링크로 가입하면 뭐가 다른가요?",
      a: "일반 가입 대비 수수료 할인 + 추가 보너스를 받을 수 있습니다. 동일한 거래소이지만 더 유리한 조건으로 시작할 수 있어요.",
    },
    {
      q: "어떤 거래소를 먼저 가입해야 하나요?",
      a: "처음이라면 UI가 직관적인 Bybit을 추천합니다. 보너스도 최대 $30,000으로 가장 크고, 한국어 지원도 우수합니다.",
    },
    {
      q: "여러 거래소에 동시에 가입해도 되나요?",
      a: "네, 각 거래소마다 독립적으로 가입 혜택을 받을 수 있습니다. 분산 보관 관점에서도 여러 거래소를 활용하는 것이 안전합니다.",
    },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold text-white mb-3">자주 묻는 질문</h3>
      <div className="flex flex-col gap-2">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="px-4 py-3 rounded-xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
          >
            <p className="text-sm font-semibold text-white mb-1">{faq.q}</p>
            <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
