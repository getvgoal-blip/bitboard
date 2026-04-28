import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TradingViewChart from "@/components/TradingViewChart";
import MetricsGrid from "@/components/MetricsGrid";
import ExchangeComparison from "@/components/ExchangeComparison";
import Footer from "@/components/Footer";
import MobileCtaBar from "@/components/MobileCtaBar";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* 상단 고정 헤더 (실시간 BTC 가격 티커 포함) */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main>
        <Hero />
        <TradingViewChart />
        <MetricsGrid />
        <ExchangeComparison />
      </main>

      {/* 푸터 */}
      <Footer />

      {/* 모바일 하단 고정 CTA + 데스크탑 플로팅 위젯 */}
      <MobileCtaBar />
    </div>
  );
}
