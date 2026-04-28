import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bitboard.kr";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d0d14",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "BitBoard — 비트코인 시장 한눈에 보기",
    template: "%s | BitBoard",
  },
  description:
    "BTC 실시간 가격, 공포탐욕지수, ETF 유입/유출, 도미넌스, 알트코인 시즌 지수, DXY, 반감기 카운트다운을 한 화면에서 확인하세요. 거래소 가입 혜택 비교까지.",
  keywords: [
    "비트코인", "BTC", "코인", "가상화폐", "공포탐욕지수",
    "ETF", "거래소", "바이비트", "바이낸스", "비트겟",
    "도미넌스", "반감기", "DXY", "알트코인",
  ],
  authors: [{ name: "BitBoard" }],
  creator: "BitBoard",
  publisher: "BitBoard",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "BitBoard",
    title: "BitBoard — 비트코인 시장 한눈에 보기",
    description: "초보자도 5초 안에 시장 상황 파악. BTC 핵심 지표 + 거래소 혜택 비교",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "BitBoard — 비트코인 대시보드",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BitBoard — 비트코인 시장 한눈에 보기",
    description: "초보자도 5초 안에 시장 상황 파악. BTC 핵심 지표 + 거래소 혜택 비교",
    images: [`${BASE_URL}/og-image.png`],
  },
  alternates: { canonical: BASE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BitBoard",
  description: "비트코인 시장 지표를 한눈에 볼 수 있는 대시보드.",
  url: BASE_URL,
  applicationCategory: "FinanceApplication",
  inLanguage: "ko-KR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" style={{ background: "var(--bg-base)" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
