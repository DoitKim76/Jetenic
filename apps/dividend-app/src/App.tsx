import { useState, type FormEvent } from 'react';
import { useAppData } from './hooks/useDistributions';
import { useHoldings } from './hooks/useHoldings';
import { nextWeekForHolding, nextWeekTotal } from './lib/calc';

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatLastUpdated(iso: string): string {
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Seoul',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function App() {
  const data = useAppData();
  const { holdings, addOrUpdate, remove } = useHoldings();
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');

  if (data.status === 'loading') {
    return (
      <div className="container">
        <h1>재테닉 배당 관리</h1>
        <p className="subtitle">데이터를 불러오는 중…</p>
      </div>
    );
  }

  if (data.status === 'error') {
    return (
      <div className="container">
        <h1>재테닉 배당 관리</h1>
        <div className="error">데이터 로드 실패: {data.message}</div>
      </div>
    );
  }

  const { etfs, distributions } = data.data;
  const byTicker = distributions.distributions;

  const total = nextWeekTotal(holdings, byTicker);

  const tickerOptions = etfs.filter(
    (etf) => !holdings.some((h) => h.ticker === etf.ticker),
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!ticker || !Number.isFinite(qty) || qty <= 0) return;
    addOrUpdate(ticker, qty);
    setTicker('');
    setQuantity('');
  };

  return (
    <div className="container">
      <h1>재테닉 배당 관리</h1>
      <p className="subtitle">
        주배당 ETF 보유 수량을 입력하면 이번 주 예상 배당을 자동 계산합니다.
      </p>

      <SummaryCards
        total={total}
        lastUpdated={distributions.lastUpdated}
        verifiedBy={distributions.verifiedBy}
      />

      <form className="form" onSubmit={handleSubmit}>
        <select
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          aria-label="종목"
        >
          <option value="">종목 선택…</option>
          {tickerOptions.map((etf) => (
            <option key={etf.ticker} value={etf.ticker}>
              {etf.ticker} — {etf.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          placeholder="보유 수량"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          aria-label="보유 수량"
        />
        <button type="submit" disabled={!ticker || !quantity}>
          + 추가
        </button>
      </form>

      <Holdings
        holdings={holdings}
        byTicker={byTicker}
        onRemove={remove}
      />

      <p className="footer">
        ⚠ 본 앱은 투자 자문이 아닙니다. 학습/참고용으로만 사용하세요.
        <br />
        모든 데이터는 브라우저에만 저장되며 서버로 전송되지 않습니다.
      </p>
    </div>
  );
}

type SummaryProps = {
  total: number;
  lastUpdated: string;
  verifiedBy: string;
};

function SummaryCards({ total, lastUpdated, verifiedBy }: SummaryProps) {
  return (
    <div className="summary">
      <div className="summary-card">
        <div className="label">이번 주 예상 배당 (세전, USD)</div>
        <div className="value">{usd.format(total)}</div>
        <div className="meta">
          마지막 갱신: {formatLastUpdated(lastUpdated)} · 검수: {verifiedBy}
        </div>
      </div>
    </div>
  );
}

type HoldingsProps = {
  holdings: ReturnType<typeof useHoldings>['holdings'];
  byTicker: Record<
    string,
    Parameters<typeof nextWeekForHolding>[1][string]
  >;
  onRemove: (ticker: string) => void;
};

function Holdings({ holdings, byTicker, onRemove }: HoldingsProps) {
  if (holdings.length === 0) {
    return (
      <div className="holdings">
        <div className="empty">아직 보유 종목이 없습니다. 위에서 추가하세요.</div>
      </div>
    );
  }

  return (
    <div className="holdings">
      <table>
        <thead>
          <tr>
            <th>티커</th>
            <th className="num">수량</th>
            <th className="num">이번 주 배당</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => {
            const next = nextWeekForHolding(h, byTicker);
            return (
              <tr key={h.ticker}>
                <td>{h.ticker}</td>
                <td className="num">{h.quantity.toLocaleString()}</td>
                <td className="num">{usd.format(next)}</td>
                <td>
                  <button
                    className="delete"
                    onClick={() => onRemove(h.ticker)}
                    aria-label={`${h.ticker} 삭제`}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
