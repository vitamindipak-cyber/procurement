export function parseAmount(value: string): number {
  const n = Number(value.replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function analyzeMinorDeviation(bidAmount: number, deviationAmount: number) {
  if (bidAmount <= 0) return null;
  const percent = (deviationAmount / bidAmount) * 100;
  return {
    bid: bidAmount,
    dev: deviationAmount,
    percent,
    withinLimit: percent <= 15,
  };
}

export function analyzeAdditionalPerformanceSecurity(estimate: number, bid: number) {
  if (estimate <= 0 || bid <= 0) return null;
  const diffPercent = ((estimate - bid) / estimate) * 100;
  const basePerfSec = bid * 0.05;
  const over30 = diffPercent > 30;
  const over15 = diffPercent > 15;
  const fifteenPercentVal = estimate * 0.85;
  const additionalPerfSec =
    over15 && !over30 && bid < fifteenPercentVal ? (fifteenPercentVal - bid) * 0.5 : 0;
  return {
    estimate,
    bid,
    diffPercent,
    over15,
    over30,
    isBelow: diffPercent > 0,
    basePerfSec,
    additionalPerfSec,
    totalPerfSec: basePerfSec + additionalPerfSec,
  };
}

export interface AverageBidInput {
  id: string;
  name: string;
  amountNum: number;
}

export function simulateAverageBidding(estimate: number, bids: AverageBidInput[]) {
  const valid = bids.filter((row) => row.amountNum > 0);
  const cutoff = estimate > 0 ? estimate * 0.7 : 0;
  const disqualified = estimate > 0 ? valid.filter((row) => row.amountNum < cutoff) : [];
  const remaining = estimate > 0 ? valid.filter((row) => row.amountNum >= cutoff) : valid;
  const average = remaining.length
    ? remaining.reduce((sum, row) => sum + row.amountNum, 0) / remaining.length
    : 0;
  const ranked = remaining
    .map((row) => ({ ...row, gap: Math.abs(row.amountNum - average) }))
    .sort((a, b) => a.gap - b.gap);
  const closestGap = ranked[0]?.gap;
  const winners = ranked.filter(
    (row) => closestGap !== undefined && Math.abs(row.gap - closestGap) < 0.005
  );
  return {
    estimate,
    validCount: valid.length,
    cutoff,
    disqualified,
    remaining,
    average,
    ranked,
    winners,
    needsThree: remaining.length < 3,
  };
}
