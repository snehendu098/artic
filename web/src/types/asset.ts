export interface Asset {
  id: string;
  symbol: string;
  name: string;
  valueUSD: number;
  wallets: { address: string; amount: string }[];
  change24h: number;
}

export interface OverviewStats {
  totalAmountUSD: number;
  totalAmountChange: number;
  totalStrategies: number;
  strategiesChange: number;
  totalWallets: number;
  walletsChange: number;
  totalSubscribers: number;
  subscribersChange: number;
}
