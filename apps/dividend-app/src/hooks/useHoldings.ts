import { useCallback, useEffect, useState } from 'react';
import type { Holding } from '../types';

const STORAGE_KEY = 'jaetenic.holdings';

function load(): Holding[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (h): h is Holding =>
        typeof h?.ticker === 'string' &&
        typeof h?.quantity === 'number' &&
        typeof h?.addedAt === 'string',
    );
  } catch {
    return [];
  }
}

export function useHoldings() {
  const [holdings, setHoldings] = useState<Holding[]>(() => load());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
  }, [holdings]);

  const addOrUpdate = useCallback((ticker: string, quantity: number) => {
    setHoldings((prev) => {
      const existing = prev.find((h) => h.ticker === ticker);
      if (existing) {
        return prev.map((h) =>
          h.ticker === ticker ? { ...h, quantity } : h,
        );
      }
      return [
        ...prev,
        { ticker, quantity, addedAt: new Date().toISOString() },
      ];
    });
  }, []);

  const remove = useCallback((ticker: string) => {
    setHoldings((prev) => prev.filter((h) => h.ticker !== ticker));
  }, []);

  return { holdings, addOrUpdate, remove };
}
