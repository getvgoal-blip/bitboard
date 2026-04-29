"use client";

import { EXCHANGES, getReferralUrl } from "@/lib/referrals";
import type { ExchangeConfig } from "@/lib/referrals";
import { trackExchangeClick } from "@/lib/analytics";

const COMPARE_ROWS = [
  { label: "ê°ì ë³´ëì¤", key: "bonus" },
  { label: "ììë£ í ì¸", key: "feeDiscount", suffix: " í ì¸" },
  { label: "24h ê±°ëë", key: "volume24h" },
  { label: "ê°ìì ì", key: "users" },
];

export default function ExchangeComparison() {
  return (
    <section className="py-10 pb-20" id="exchange" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ì¹ì í¤ë */}
        <div className="text-center mb-8">
          <span className="badge badge-orange mb-3">ð ë¦¬í¼ë´ íí</span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            ê±°ëì ê°ì íí ë¹êµ
          </h2>
          <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "#94a3b8" }}>
            ë¦¬í¼ë´ ë§í¬ë¡ ê°ìíë©´ ììë£ í ì¸ + ë³´ëì¤ë¥¼ ëìì ë°ì ì ìì´ì.
          </p>
        </div>

        {/* ê±°ëì ì¹´ë ê·¸ë¦¬ë */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {EXCHANGES.map((ex, idx) => (
            <ExchangeCard key={ex.id} exchange={ex} delay={idx * 0.05} />
          ))}
        </div>

        {/* ë¹êµ íì´ë¸ */}
        <CompareTable />

        {/* FAQ ìì­ */}
        <FAQSection />

        {/* ë©´ì± ê³ ì§ */}
        <p className="text-center text-xs mt-6" style={{ color: "#374151" }}>
          * ì ííì ë¦¬í¼ë´ ë§í¬ ê°ì ê¸°ì¤ì´ë©°, ê±°ëì ì ì±ì ë°ë¼ ë³ê²½ë  ì ììµëë¤.
          í¬ìë ë³¸ì¸ ì±ì íì ì ì¤íê² ê²°ì íì¸ì.
        </p>
      </div>
    </section>
  );
}

// âââ ê°ë³ ê±°ëì ì¹´ë âââââââââââââââââââââââââââââââââââââââââââââ
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

      {/* í¤ë */}
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

      {/* ë³´ëì¤ íì´ë¼ì´í¸ */}
      <div
        className="px-4 py-3 rounded-xl mb-4"
        style={{ background: ex.colorDim, border: `1px solid ${ex.borderColor}` }}
      >
        <p className="text-xs mb-0.5" style={{ color: "#94a3b8" }}>{ex.bonusDetail}</p>
        <p className="text-2xl font-black num" style={{ color: ex.color }}>{ex.bonus}</p>
        <p className="text-xs mt-1" style={{ color: "#64748b" }}>
          + ììë£ {ex.feeDiscount} í ì¸
        </p>
      </div>

      {/* ê¸°ë¥ ëª©ë¡ */}
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

      {/* ì¥ì  */}
      <div
        className="flex flex-col gap-1 mb-4 pt-3"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        {ex.pros.map((p) => (
          <div key={p} className="flex items-start gap-1.5">
            <span className="text-xs mt-0.5" style={{ color: "#22c55e" }}>â</span>
            <span className="text-xs" style={{ color: "#64748b" }}>{p}</span>
          </div>
        ))}
      </div>

      {/* CTA ë²í¼ */}
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
        {ex.name} ê°ìíê¸°
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}

// âââ ë¹êµ íì´ë¸ ââââââââââââââââââââââââââââââââââââââââââââââââââ
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
        <div>í­ëª©</div>
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

      {/* ê°ì ë²í¼ í */}
      <div
        className="grid gap-2 px-4 py-3"
        style={{
          gridTemplateColumns: `1fr repeat(${EXCHANGES.length}, 1fr)`,
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center text-xs font-medium" style={{ color: "#64748b" }}>
          ë°ë¡ ê°ì
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
              ê°ì
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// âââ FAQ ì¹ì ââââââââââââââââââââââââââââââââââââââââââââââââââââ
function FAQSection() {
  const faqs = [
    {
      q: "ë¦¬í¼ë´ ë§í¬ë¡ ê°ìíë©´ ë­ê° ë¤ë¥¸ê°ì?",
      a: "ì¼ë° ê°ì ëë¹ ììë£ í ì¸ + ì¶ê° ë³´ëì¤ë¥¼ ë°ì ì ììµëë¤. ëì¼í ê±°ëìì´ì§ë§ ë ì ë¦¬í ì¡°ê±´ì¼ë¡ ììí  ì ìì´ì.",
    },
    {
      q: "ì´ë¤ ê±°ëìë¥¼ ë¨¼ì  ê°ìí´ì¼ íëì?",
      a: "ì²ìì´ë¼ë©´ UIê° ì§ê´ì ì¸ Bybitì ì¶ì²í©ëë¤. ë³´ëì¤ë ìµë $30,000ì¼ë¡ ê°ì¥ í¬ê³ , íêµ­ì´ ì§ìë ì°ìí©ëë¤.",
    },
    {
      q: "ì¬ë¬ ê±°ëìì ëìì ê°ìí´ë ëëì?",
      a: "ë¤, ê° ê±°ëìë§ë¤ ëë¦½ì ì¼ë¡ ê°ì ííì ë°ì ì ììµëë¤. ë¶ì° ë³´ê´ ê´ì ììë ì¬ë¬ ê±°ëìë¥¼ íì©íë ê²ì´ ìì í©ëë¤.",
    },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold text-white mb-3">ìì£¼ ë¬»ë ì§ë¬¸</h3>
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
