import type { Distribution, Holding } from '../types';

export type DistributionsByTicker = Record<string, Distribution[]>;

function latest(distributions: Distribution[]): Distribution | null {
  if (distributions.length === 0) return null;
  return distributions.reduce((a, b) =>
    a.declarationDate >= b.declarationDate ? a : b,
  );
}

export function nextWeekForHolding(
  holding: Holding,
  byTicker: DistributionsByTicker,
): number {
  const list = byTicker[holding.ticker];
  if (!list) return 0;
  const d = latest(list);
  if (!d) return 0;
  return d.amount * holding.quantity;
}

export function nextWeekTotal(
  holdings: Holding[],
  byTicker: DistributionsByTicker,
): number {
  return holdings.reduce((sum, h) => sum + nextWeekForHolding(h, byTicker), 0);
}
