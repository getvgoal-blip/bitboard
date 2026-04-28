# BitBoard — 설치 및 실행 가이드

## 1. 의존성 설치

```bash
npm install
```

## 2. 개발 서버 실행

```bash
npm run dev
```

→ http://localhost:3000 에서 확인

## 3. 빌드

```bash
npm run build
npm run start
```

## 4. Vercel 배포

```bash
# Vercel CLI 설치 (최초 1회)
npm i -g vercel

# 배포
vercel
```

또는 GitHub 연동 후 자동 배포 설정 가능.

---

## 다음 작업 단계 (2차 개발)

### API 연결 목록
| 지표 | API | 비고 |
|------|-----|------|
| BTC 가격 | CoinGecko API (무료) | /simple/price |
| 공포탐욕지수 | Alternative.me API | 무료 |
| ETF 유입/유출 | SoSo Value API | 유료 플랜 |
| BTC 도미넌스 | CoinGecko API | /global |
| 알트코인 시즌 | CoinMarketCap API | 유료 |
| DXY | Alpha Vantage / Yahoo Finance | 무료 티어 있음 |

### 추천 구현 순서
1. CoinGecko BTC 가격 (무료, 즉시 가능)
2. Alternative.me 공포탐욕 (무료)
3. CoinGecko 도미넌스 (무료)
4. TradingView 위젯 활성화 (이미 코드 준비됨)
5. 나머지 유료 API 순차 연결

### 수익 최적화 포인트
- 거래소 리퍼럴 링크 실제 연결
- UTM 파라미터 추가로 전환 추적
- 방문자 → 가입 전환율 A/B 테스트
- 모바일 푸시 알림 (BTC 가격 급등락 시)
