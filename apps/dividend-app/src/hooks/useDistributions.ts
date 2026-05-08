import { useEffect, useState } from 'react';
import type { DistributionsFile, Etf } from '../types';

type AppData = {
  etfs: Etf[];
  distributions: DistributionsFile;
};

type State =
  | { status: 'loading' }
  | { status: 'ready'; data: AppData }
  | { status: 'error'; message: string };

export function useAppData() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/data/etfs.json').then((r) => {
        if (!r.ok) throw new Error(`etfs.json ${r.status}`);
        return r.json() as Promise<Etf[]>;
      }),
      fetch('/data/distributions.json').then((r) => {
        if (!r.ok) throw new Error(`distributions.json ${r.status}`);
        return r.json() as Promise<DistributionsFile>;
      }),
    ])
      .then(([etfs, distributions]) => {
        if (cancelled) return;
        setState({ status: 'ready', data: { etfs, distributions } });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : String(err),
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
