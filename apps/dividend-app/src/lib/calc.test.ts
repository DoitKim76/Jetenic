import { describe, expect, it } from 'vitest';
import { nextWeekForHolding, nextWeekTotal } from './calc';
import type { Distribution, Holding } from '../types';

const dist = (amount: number, exDate = '2026-05-08'): Distribution => ({
  declarationDate: '2026-05-07',
  exDate,
  payDate: '2026-05-13',
  amount,
  source: 'test',
});

describe('nextWeekForHolding', () => {
  it('returns latest declared distribution × quantity', () => {
    const holding: Holding = { ticker: 'TSLY', quantity: 100, addedAt: '2026-01-01' };
    const distributions = { TSLY: [dist(0.2034)] };
    expect(nextWeekForHolding(holding, distributions)).toBeCloseTo(20.34, 4);
  });

  it('picks the most recent by declarationDate when multiple exist', () => {
    const holding: Holding = { ticker: 'TSLY', quantity: 50, addedAt: '2026-01-01' };
    const older = { ...dist(0.10), declarationDate: '2026-04-30' };
    const newer = { ...dist(0.25), declarationDate: '2026-05-07' };
    expect(nextWeekForHolding(holding, { TSLY: [older, newer] })).toBeCloseTo(12.5, 4);
    // Order should not matter
    expect(nextWeekForHolding(holding, { TSLY: [newer, older] })).toBeCloseTo(12.5, 4);
  });

  it('returns 0 when ticker has no distributions', () => {
    const holding: Holding = { ticker: 'UNKNOWN', quantity: 100, addedAt: '2026-01-01' };
    expect(nextWeekForHolding(holding, {})).toBe(0);
    expect(nextWeekForHolding(holding, { UNKNOWN: [] })).toBe(0);
  });
});

describe('nextWeekTotal', () => {
  it('sums next-week dividends across all holdings', () => {
    const holdings: Holding[] = [
      { ticker: 'TSLY', quantity: 100, addedAt: '2026-01-01' },
      { ticker: 'QDTE', quantity: 200, addedAt: '2026-02-01' },
    ];
    const distributions = {
      TSLY: [dist(0.20)],
      QDTE: [dist(0.10)],
    };
    expect(nextWeekTotal(holdings, distributions)).toBeCloseTo(40.0, 4);
  });

  it('returns 0 for empty holdings', () => {
    expect(nextWeekTotal([], {})).toBe(0);
  });
});
