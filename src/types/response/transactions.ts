
export interface TransactionBalances {
  expenses: Balances;
  savings: Balances;
  incomes: Balances;
}

export interface Balances {
  total: number;
  uyu: number;
  usd: number;
  eur: number;
}

