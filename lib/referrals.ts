// ── 거래소 리퍼럴 링크 중앙 관리 ──────────────────────────────────
// 이 파일 하나만 수정하면 사이트 전체 링크가 업데이트됩니다.
//
// 리퍼럴 코드 발급 방법:
//   Bybit  → bybit.com > 계정 > 리퍼럴 프로그램
//   Binance → binance.com > 계정 > 리퍼럴
//   Bitget  → bitget.com > 계정 > 리퍼럴

export interface ExchangeConfig {
  id: string;
  name: string;
  nameKo: string;
  tagline: string;
  emoji: string;
  color: string;
  colorDim: string;
  borderColor: string;
  referralCode: string;
  baseUrl: string;
  referralUrl: string;
  bonus: string;
  bonusDetail: string;
  feeDiscount: string;
  volume24h: string;
  users: string;
  badge: string;
  badgeColor: string;
  recommended: boolean;
  features: string[];
  pros: string[];
  utm: {
    source: string;
    medium: string;
    campaign: string;
  };
}

// 리퍼럴 코드를 여기에 입력하세요
const REFERRAL_CODES = {
  bybit: process.env.NEXT_PUBLIC_BYBIT_REF ?? "BITBOARD",
  binance: process.env.NEXT_PUBLIC_BINANCE_REF ?? "BITBOARD",
  bitget: process.env.NEXT_PUBLIC_BITGET_REF ?? "BITBOARD",
};

function buildUrl(base: string, ref: string, utm: ExchangeConfig["utm"]): string {
  const params = new URLSearchParams({
    ref,
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
  });
  return `${base}?${params.toString()}`;
}

export const EXCHANGES: ExchangeConfig[] = [
  {
    id: "binance",
    name: "Binance",
    nameKo: "바이낸스",
    tagline: "세계 1위 거래량",
    emoji: "🟡",
    color: "#f0b90b",
    colorDim: "rgba(240, 185, 11, 0.12)",
    borderColor: "rgba(240, 185, 11, 0.2)",
    referralCode: REFERRAL_CODES.binance,
    baseUrl: "https://accounts.binance.com/register",
    referralUrl: buildUrl(
      "https://accounts.binance.com/register",
      REFERRAL_CODES.binance,
      { source: "bitboard", medium: "referral", campaign: "exchange_compare" }
    ),
    bonus: "$600",
    bonusDetail: "첫 거래 보너스",
    feeDiscount: "20%",
    volume24h: "$76B",
    users: "1억 8천만명",
    badge: "거래량 1위",
    badgeColor: "#f0b90b",
    recommended: false,
    features: [
      "세계 최대 거래 유동성",
      "600+ 코인 거래 지원",
      "선물/현물/옵션 전체",
      "0.1% 기본 현물 수수료",
    ],
    pros: ["가장 넓은 코인 종류", "보안 업계 최고 수준", "P2P 거래 지원"],
    utm: { source: "bitboard", medium: "referral", campaign: "binance_cta" },
  },
  {
    id: "bitget",
    name: "Bitget",
    nameKo: "비트겟",
    tagline: "복사 거래 특화",
    emoji: "🔵",
    color: "#00c6ff",
    colorDim: "rgba(0, 198, 255, 0.12)",
    borderColor: "rgba(0, 198, 255, 0.2)",
    referralCode: REFERRAL_CODES.bitget,
    baseUrl: "https://www.bitget.com/referral/register",
    referralUrl: buildUrl(
      "https://www.bitget.com/referral/register",
      REFERRAL_CODES.bitget,
      { source: "bitboard", medium: "referral", campaign: "exchange_compare" }
    ),
    bonus: "$8,000",
    bonusDetail: "신규 가입 최대 혜택",
    feeDiscount: "20%",
    volume24h: "$8B",
    users: "2천만명",
    badge: "보너스 최대",
    badgeColor: "#00c6ff",
    recommended: false,
    features: [
      "원클릭 복사 거래 1위",
      "100배 레버리지 선물",
      "800+ 코인 지원",
      "0.02% 선물 수수료",
    ],
    pros: ["복사 거래 업계 1위", "가입 보너스 규모 큼", "초보자 친화적 UI"],
    utm: { source: "bitboard", medium: "referral", campaign: "bitget_cta" },
  },
  {
    id: "bybit",
    name: "Bybit",
    nameKo: "바이비트",
    tagline: "초보자 추천 1위",
    emoji: "🟠",
    color: "#f7931a",
    colorDim: "rgba(247, 147, 26, 0.12)",
    borderColor: "rgba(247, 147, 26, 0.3)",
    referralCode: REFERRAL_CODES.bybit,
    baseUrl: "https://www.bybit.com/invite",
    referralUrl: buildUrl(
      "https://www.bybit.com/invite",
      REFERRAL_CODES.bybit,
      { source: "bitboard", medium: "referral", campaign: "exchange_compare" }
    ),
    bonus: "$30,000",
    bonusDetail: "신규 가입 최대 혜택",
    feeDiscount: "20%",
    volume24h: "$18B",
    users: "3천 7백만명",
    badge: "✨ 추천",
    badgeColor: "#f7931a",
    recommended: true,
    features: [
      "가장 직관적인 UI/UX",
      "150배 레버리지 선물",
      "700+ 코인 지원",
      "0.055% 현물 수수료",
    ],
    pros: ["UI 가장 직관적", "한국어 완벽 지원", "출금 처리 빠름"],
    utm: { source: "bitboard", medium: "referral", campaign: "bybit_cta" },
  },
];

export function getExchangeById(id: string): ExchangeConfig | undefined {
  return EXCHANGES.find((e) => e.id === id);
}

export function getRecommendedExchange(): ExchangeConfig {
  return EXCHANGES.find((e) => e.recommended) ?? EXCHANGES[EXCHANGES.length - 1];
}

export function getReferralUrl(
  exchangeId: string,
  placement: "hero" | "metrics" | "compare" | "mobile_cta" | "header" | "footer" | "floating_widget"
): string {
  const ex = getExchangeById(exchangeId);
  if (!ex) return "#";

  const params = new URLSearchParams({
    ref: ex.referralCode,
    utm_source: "bitboard",
    utm_medium: "referral",
    utm_campaign: `${exchangeId}_${placement}`,
  });
  return `${ex.baseUrl}?${params.toString()}`;
}
