export type DistributionFrequency = 'weekly' | 'monthly' | 'quarterly';

export type Etf = {
  ticker: string;
  name: string;
  issuer: string;
  currency: 'USD' | 'KRW';
  frequency: DistributionFrequency;
  withholding_tax_rate: number;
};

export type Distribution = {
  declarationDate: string;
  exDate: string;
  payDate: string;
  amount: number;
  source: string;
};

export type DistributionsFile = {
  lastUpdated: string;
  verifiedBy: string;
  distributions: Record<string, Distribution[]>;
};

export type Holding = {
  ticker: string;
  quantity: number;
  addedAt: string;
};
