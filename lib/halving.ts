import type { HalvingData } from "./types";

// ── 반감기 로컬 계산 (API 불필요) ─────────────────────────────────
// 비트코인 반감기는 210,000블록마다 발생 (약 4년 주기)
// 2024년 4월 19일 4차 반감기 완료 (블록 840,000)

const LAST_HALVING_DATE = new Date("2024-04-19T22:09:00Z");
const LAST_HALVING_BLOCK = 840_000;
const BLOCKS_PER_HALVING = 210_000;
const NEXT_HALVING_BLOCK = LAST_HALVING_BLOCK + BLOCKS_PER_HALVING; // 1,050,000

// 평균 블록 시간: 10분 (600초)
const AVG_BLOCK_TIME_MS = 10 * 60 * 1000;

export function calculateHalving(): HalvingData {
  const now = new Date();
  const msSinceLastHalving = now.getTime() - LAST_HALVING_DATE.getTime();

  // 현재 추정 블록 높이
  const blocksSinceLastHalving = Math.floor(msSinceLastHalving / AVG_BLOCK_TIME_MS);
  const currentEstimatedBlock = LAST_HALVING_BLOCK + blocksSinceLastHalving;

  // 다음 반감기까지 남은 블록
  const blocksLeft = NEXT_HALVING_BLOCK - currentEstimatedBlock;

  // 남은 시간 계산
  const msLeft = Math.max(0, blocksLeft * AVG_BLOCK_TIME_MS);
  const totalMinutesLeft = Math.floor(msLeft / (1000 * 60));
  const daysLeft = Math.floor(totalMinutesLeft / (60 * 24));
  const hoursLeft = Math.floor((totalMinutesLeft % (60 * 24)) / 60);
  const minutesLeft = totalMinutesLeft % 60;

  // 다음 반감기 예상 날짜
  const nextHalvingDate = new Date(now.getTime() + msLeft);

  // 진행률 (이번 4년 사이클에서 몇 % 경과했는지)
  const cycleMs = BLOCKS_PER_HALVING * AVG_BLOCK_TIME_MS;
  const progressPercent = Math.min(
    100,
    Math.round((msSinceLastHalving / cycleMs) * 100)
  );

  return {
    lastHalvingDate: LAST_HALVING_DATE.toISOString().split("T")[0],
    nextHalvingDate: nextHalvingDate.toISOString().split("T")[0],
    daysLeft,
    hoursLeft,
    minutesLeft,
    progressPercent,
    blockHeight: currentEstimatedBlock,
    nextHalvingBlock: NEXT_HALVING_BLOCK,
  };
}
