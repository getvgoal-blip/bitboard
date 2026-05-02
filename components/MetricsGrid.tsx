"use client";

import { useFearGreed, useGlobalMarket, useHalving, useDXY, useETF } from "@/hooks/useMarketData";
import type { FearGreedData, GlobalMarketData, HalvingData, DXYData } from "@/lib/types";
import type { ETFData } from "@/app/api/etf/route";

function Sk({ w, h, radius = 8, style }: { w: number | string; h: number; radius?: number; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: w, height: h, borderRadius: radius,
        background: "linear-gradient(90deg, #1c2333 25%, #243047 50%, #1c2333 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

export default function MetricsGrid() {
  const { data: fg, status: fgStatus } = useFearGreed();
  const { data: global, status: globalStatus } = useGlobalMarket();
  const { data: halving, status: halvingStatus } = useHalving();
  const { data: dxy, status: dxyStatus } = useDXY();
  const { data: etf, status: etfStatus } = useETF();

  return (
    <section className="py-8 section-alt" id="시장 지표">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white">핵심 시장 지표</h2>
            <p className="text-xs mt-0.5" style={{ color: "#cbd5e1" }}>BTC 투자 판단에 필요한 6가지 핵심 지표</p>
          </div>
          <span className="text-xs" style={{ color: "#94a3b8" }}>실시간 데이터</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FearGreedCard data={fg} isLoading={fgStatus === "loading"} />
          <ETFCard data={etf} isLoading={etfStatus === "loading"} />
          <DominanceCard data={global} isLoading={globalStatus === "loading"} />
          <AltSeasonCard data={global} isLoading={globalStatus === "loading"} />
          <DXYCard data={dxy} isLoading={dxyStatus === "loading"} />
          <HalvingCard data={halving} isLoading={halvingStatus === "loading"} />
        </div>
      </div>
    </section>
  );
}

function FearGreedCard({ data, isLoading }: { data: FearGreedData | null; isLoading: boolean }) {
  const getFGColor = (val: number) => {
    if (val <= 20) return "#f6465d";
    if (val <= 40) return "#f97316";
    if (val <= 60) return "#eab308";
    if (val <= 80) return "#84cc16";
    return "#0ecb81";
  };
  const val = data?.value ?? 50;
  const color = getFGColor(val);
  const change = data ? data.value - data.previousValue : 0;
  const isUp = change >= 0;
  const radius = 52;
  const cx = 70, cy = 70;
  const endAngle = Math.PI + (val / 100) * Math.PI;
  const x2 = cx + radius * Math.cos(endAngle);
  const y2 = cy + radius * Math.sin(endAngle);
  const largeArc = val > 50 ? 1 : 0;

  return (
    <div className="card fade-in">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-white">공포 &amp; 탐욕 지수</p>
          <p className="text-xs mt-0.5" style={{ color: "#cbd5e1" }}>0 (극공포) ~ 100 (극탐욕)</p>
        </div>
        {isLoading ? <Sk w={60} h={22} /> : (
          <span className="badge" style={{ background: isUp ? "rgba(14,203,129,0.1)" : "rgba(246,70,93,0.1)", color: isUp ? "#0ecb81" : "#f6465d", border: `1px solid ${isUp ? "#0ecb8133" : "#f6465d33"}` }}>
            {isUp ? "+" : ""}{change}
          </span>
        )}
      </div>
      <div className="flex flex-col items-center py-2">
        <div className="relative" style={{ width: 140, height: 82 }}>
          <svg viewBox="0 0 140 82" className="w-full h-full overflow-visible">
            <path d="M 18 70 A 52 52 0 0 1 122 70" fill="none" stroke="#1c2333" strokeWidth="10" strokeLinecap="round" />
            <defs>
              <linearGradient id="fgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f6465d" /><stop offset="33%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#eab308" /><stop offset="67%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#0ecb81" />
              </linearGradient>
            </defs>
            <path d={`M 18 70 A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke="url(#fgGrad)" strokeWidth="10" strokeLinecap="round" />
            <circle cx={x2} cy={y2} r="7" fill={color} stroke="#0b0e17" strokeWidth="2" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            {isLoading ? <Sk w={48} h={36} /> : (
              <>
                <span className="text-3xl font-black num leading-none" style={{ color }}>{val}</span>
                <span className="text-xs font-semibold mt-0.5" style={{ color }}>{data?.label}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: "#94a3b8" }}>
        <span>0 극공포</span><span>50 중립</span><span>100 극탐욕</span>
      </div>
    </div>
  );
}

function ETFCard({ data, isLoading }: { data: ETFData | null; isLoading: boolean }) {
  const bars = data?.weekHistory ?? [];
  const maxVal = bars.length ? Math.max(...bars.map((b) => Math.abs(b.netFlow)), 1) : 1;
  const isPositive = data?.isPositive ?? true;
  const netColor = isPositive ? "#0ecb81" : "#f6465d";
  const isFallback = data?.dataSource === "fallback";

  return (
    <div className="card fade-in" style={{ animationDelay: "0.05s" }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-white">BTC ETF 유입/유출</p>
          <p className="text-xs mt-0.5" style={{ color: "#cbd5e1" }}>미국 현물 BTC ETF 일일 자금 흐름</p>
        </div>
        {isLoading ? <Sk w={60} h={22} /> : (
          <span className="badge" style={{ background: isPositive ? "rgba(14,203,129,0.1)" : "rgba(246,70,93,0.1)", color: netColor, border: `1px solid ${netColor}33` }}>
            {isPositive ? "▲ 유입" : "▼ 유출"}
          </span>
        )}
      </div>
      <div className="mb-4">
        {isLoading ? (<><Sk w="70%" h={32} /><Sk w="50%" h={14} style={{ marginTop: 6 }} /></>) : (
          <>
            <p className="text-2xl font-black num" style={{ color: netColor }}>
              {isPositive ? "+" : ""}{data?.todayNet?.toFixed(1) ?? "—"}M
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
              오늘 순유입 · <span style={{ color: "#cbd5e1" }}>{data?.consecutiveDays}일 연속 {isPositive ? "유입" : "유출"}</span>
            </p>
          </>
        )}
      </div>
      {bars.length > 0 ? (
        <>
          <div className="flex items-end justify-between gap-1 mb-1" style={{ height: 56 }}>
            {bars.map((bar, i) => {
              const h = (Math.abs(bar.netFlow) / maxVal) * 100;
              return (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="w-full rounded-sm" style={{ height: `${Math.max(h, 4)}%`, background: bar.netFlow >= 0 ? "rgba(14,203,129,0.6)" : "rgba(246,70,93,0.6)" }} />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs" style={{ color: "#94a3b8" }}>
            {bars.map((bar, i) => <span key={i} className="text-center flex-1">{bar.dayLabel}</span>)}
          </div>
        </>
      ) : <Sk w="100%" h={56} />}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
        <div>
          <p className="text-xs mb-0.5" style={{ color: "#94a3b8" }}>총 유입</p>
          {isLoading ? <Sk w={70} h={16} /> : <p className="text-sm font-bold" style={{ color: "#0ecb81" }}>+${data?.todayInflow?.toFixed(1) ?? "—"}M</p>}
        </div>
        <div>
          <p className="text-xs mb-0.5" style={{ color: "#94a3b8" }}>총 유출</p>
          {isLoading ? <Sk w={70} h={16} /> : <p className="text-sm font-bold" style={{ color: "#f6465d" }}>-${data?.todayOutflow?.toFixed(1) ?? "—"}M</p>}
        </div>
      </div>
      {isFallback && <p className="text-xs mt-2 text-center" style={{ color: "#64748b" }}>* CoinGlass API 키 설정 시 실시간 데이터 적용</p>}
    </div>
  );
}

function DominanceCard({ data, isLoading }: { data: GlobalMarketData | null; isLoading: boolean }) {
  const btcDom = data?.btcDominance ?? 0;
  const ethDom = 17.2;
  const otherDom = Math.max(0, 100 - btcDom - ethDom);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (btcDom / 100) * circumference;
  const dominanceColor = btcDom > 55 ? "#f7931a" : "#818cf8";
  const segments = [
    { label: "BTC", value: btcDom, color: "#f7931a" },
    { label: "ETH", value: ethDom, color: "#818cf8" },
    { label: "기타", value: parseFloat(otherDom.toFixed(1)), color: "#1c2333" },
  ];

  return (
    <div className="card fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-white">BTC 도미넌스</p>
          <p className="text-xs mt-0.5" style={{ color: "#cbd5e1" }}>전체 코인 시총 대비 BTC 비중</p>
        </div>
        {isLoading ? <Sk w={60} h={22} /> : (
          <span className="badge" style={{ background: btcDom > 55 ? "rgba(247,147,26,0.1)" : "rgba(129,140,248,0.1)", color: dominanceColor, border: `1px solid ${dominanceColor}33` }}>
            {btcDom.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0" style={{ width: 88, height: 88 }}>
          {isLoading ? <Sk w={88} h={88} radius={44} /> : (
            <>
              <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
                <circle cx="44" cy="44" r={radius} fill="none" stroke="#1c2333" strokeWidth="10" />
                <circle cx="44" cy="44" r={radius} fill="none" stroke="#f7931a" strokeWidth="10"
                  strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black num" style={{ color: dominanceColor }}>{btcDom.toFixed(1)}%</span>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                <span className="text-xs" style={{ color: "#94a3b8" }}>{seg.label}</span>
              </div>
              <span className="text-xs font-semibold text-white num">{seg.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 px-3 py-2 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
        <p className="text-xs" style={{ color: "#94a3b8" }}>
          {btcDom > 55 ? "BTC 강세 구간 — 알트보다 BTC 집중 유효" : "도미넌스 하락 — 알트 시즌 전환 가능성"}
        </p>
      </div>
    </div>
  );
}

function AltSeasonCard({ data, isLoading }: { data: GlobalMarketData | null; isLoading: boolean }) {
  const val = data?.altcoinSeasonIndex ?? 0;
  const isBTCSeason = val < 25;
  const isAltSeason = val >= 75;
  const label = isBTCSeason ? "BTC 시즌" : isAltSeason ? "알트 시즌" : "중립";
  const color = isBTCSeason ? "#f7931a" : isAltSeason ? "#818cf8" : "#eab308";
  const zones = [
    { label: "BTC 시즌", range: "0-24", color: "#f7931a", active: isBTCSeason },
    { label: "중립",     range: "25-74", color: "#eab308", active: !isBTCSeason && !isAltSeason },
    { label: "알트 시즌", range: "75+",  color: "#818cf8", active: isAltSeason },
  ];

  return (
    <div className="card fade-in" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-white">알트코인 시즌 지수</p>
          <p className="text-xs mt-0.5" style={{ color: "#cbd5e1" }}>75 이상 = 알트 시즌 / 25 미만 = BTC 시즌</p>
        </div>
        {isLoading ? <Sk w={70} h={22} /> : (
          <span className="badge" style={{ background: `${color}1a`, color, border: `1px solid ${color}33` }}>{label}</span>
        )}
      </div>
      <div className="mb-4">
        {isLoading ? <Sk w={80} h={40} /> : (
          <><p className="text-3xl font-black num" style={{ color }}>{val}</p><p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>/ 100</p></>
        )}
      </div>
      <div className="mb-4">
        <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "#1c2333" }}>
          <div className="absolute left-0 top-0 h-full" style={{ width: "25%", background: "rgba(247,147,26,0.4)" }} />
          <div className="absolute right-0 top-0 h-full" style={{ width: "25%", background: "rgba(129,140,248,0.4)" }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-700"
            style={{ left: `calc(${val}% - 8px)`, background: color }} />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: "#94a3b8" }}>
          <span>BTC 시즌</span><span>중립</span><span>알트 시즌</span>
        </div>
      </div>
      <div className="flex gap-1.5">
        {zones.map((zone) => (
          <div key={zone.label} className="flex-1 px-2 py-1.5 rounded-lg text-center"
            style={{ background: zone.active ? `${zone.color}18` : "var(--bg-elevated)", border: `1px solid ${zone.active ? zone.color + "40" : "transparent"}` }}>
            <p className="text-xs font-semibold" style={{ color: zone.active ? zone.color : "#94a3b8" }}>{zone.label}</p>
            <p className="text-[10px]" style={{ color: zone.active ? zone.color + "aa" : "#64748b" }}>{zone.range}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DXYCard({ data, isLoading }: { data: DXYData | null; isLoading: boolean }) {
  const value = data?.value ?? 0;
  const change = data?.changePercent ?? 0;
  const isDown = change < 0;
  const changeColor = isDown ? "#0ecb81" : "#f6465d";
  const points = data?.weekHistory?.length ? data.weekHistory : [104.32];
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const toY = (v: number) => 40 - ((v - min) / range) * 30;
  const pathD = points.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / Math.max(points.length - 1, 1)) * 120} ${toY(v)}`).join(" ");

  return (
    <div className="card fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-white">DXY 달러 인덱스</p>
          <p className="text-xs mt-0.5" style={{ color: "#cbd5e1" }}>하락 시 BTC에 유리 · 상승 시 불리</p>
        </div>
        {isLoading ? <Sk w={64} h={22} /> : (
          <span className="badge" style={{ background: `${changeColor}1a`, color: changeColor, border: `1px solid ${changeColor}33` }}>
            {change > 0 ? "+" : ""}{change.toFixed(2)}%
          </span>
        )}
      </div>
      <div className="mb-2">
        {isLoading ? <Sk w={100} h={40} /> : (
          <>
            <p className="text-3xl font-black num text-white">{value.toFixed(2)}</p>
            {data && <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>고 {data.high} · 저 {data.low}</p>}
          </>
        )}
      </div>
      <div className="mb-3">
        <svg viewBox="0 0 120 45" className="w-full" style={{ height: 48 }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="dxyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={changeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={changeColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          {points.length > 1 && (
            <>
              <path d={`${pathD} L 120 45 L 0 45 Z`} fill="url(#dxyGrad)" />
              <path d={pathD} fill="none" stroke={changeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}
        </svg>
        <div className="flex justify-between text-xs mt-0.5" style={{ color: "#64748b" }}>
          <span>7일 전</span><span>오늘</span>
        </div>
      </div>
      <div className="px-3 py-2 rounded-lg" style={{ background: "var(--bg-elevated)" }}>
        <p className="text-xs" style={{ color: "#94a3b8" }}>
          BTC 영향: <span style={{ color: isDown ? "#0ecb81" : "#f6465d" }}>{isDown ? "긍정적 — 달러 약세" : "부정적 — 달러 강세"}</span>
        </p>
      </div>
    </div>
  );
}

function HalvingCard({ data, isLoading }: { data: HalvingData | null; isLoading: boolean }) {
  const timeUnits = [
    { label: "일", value: data?.daysLeft ?? 0 },
    { label: "시", value: data?.hoursLeft ?? 0 },
    { label: "분", value: data?.minutesLeft ?? 0 },
  ];

  return (
    <div className="card fade-in" style={{ animationDelay: "0.25s", background: "linear-gradient(135deg, #131722 0%, #1a1229 100%)", borderColor: "rgba(247,147,26,0.15)" }}>
      <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden" style={{ background: "radial-gradient(ellipse at top right, rgba(247,147,26,0.05), transparent 60%)" }} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-white">다음 반감기</p>
            <p className="text-xs mt-0.5" style={{ color: "#cbd5e1" }}>블록 1,050,000 도달 시 (로컬 계산)</p>
          </div>
          <span className="badge badge-orange">2028년 예정</span>
        </div>
        <div className="flex gap-2 mb-4">
          {timeUnits.map((unit) => (
            <div key={unit.label} className="flex-1 flex flex-col items-center py-2 px-1 rounded-xl"
              style={{ background: "rgba(247,147,26,0.08)", border: "1px solid rgba(247,147,26,0.15)" }}>
              {isLoading ? <Sk w={40} h={30} /> : (
                <>
                  <span className="text-2xl font-black num leading-none" style={{ color: "#f7931a" }}>{unit.value}</span>
                  <span className="text-xs font-medium mt-1" style={{ color: "#94a3b8" }}>{unit.label}</span>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "#94a3b8" }}>
            <span>2024.04.19 직전 반감기</span>
            {data && <span className="num" style={{ color: "#f7931a" }}>{data.progressPercent}% 경과</span>}
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1c2333" }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${data?.progressPercent ?? 0}%`, background: "linear-gradient(90deg, #f7931a, #e8830a)" }} />
          </div>
          <div className="flex justify-between text-xs mt-1" style={{ color: "#94a3b8" }}>
            <span>840,000 블록</span>
            {data && <span className="num">현재 ~{data.blockHeight.toLocaleString()}</span>}
          </div>
        </div>
        <div className="px-3 py-2 rounded-lg" style={{ background: "rgba(247,147,26,0.06)" }}>
          <p className="text-xs" style={{ color: "#94a3b8" }}>
            반감기마다 채굴 보상 50% 감소 &rarr; 역사적 강세 패턴
          </p>
        </div>
      </div>
    </div>
  );
}
