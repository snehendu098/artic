export interface IDashboard {
  overview: {
    total: number;
    strategies: number;
    wallets: number;
    subscribers: number;
  };
  wallets: { title: string; address: string; createdAt: Date }[];
  assets: {
    name: string;
    symbol: string;
    distribution: { address: string; amount: number }[];
    usdValue: string;
  }[];
  strategies: {
    name: string;
    strategy: string;
    id: string;
    brought: boolean;
    createdAt: Date;
  }[];
  subscriptions: {
    name: string;
    strategy: string;
    wallet: string;
    subscribedAt: Date;
  }[];
  actions: { wallet: string; action: string; triggeredAt: Date }[];
  subscribers: { wallet: string; amount: string; subscribedAt: Date }[];
}

// Dashboard data types
export interface Wallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  balanceUSD: number;
  assets: {
    id: string;
    symbol: string;
    name: string;
    value: number;
    valueUSD: number;
    change24h: number;
  }[];
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  apy: number;
  tvl: number;
  subscriberCount: number;
  monthlyRevenue: number;
  status: "active" | "paused" | "draft";
  createdAt: string;
  protocols: string[];
}

export interface Subscription {
  id: string;
  strategyName: string;
  strategyCreator: string;
  amountInvested: number;
  currentValue: number;
  apy: number;
  subscribedAt: string;
  walletId: string;
}

export interface Subscriber {
  id: string;
  username: string;
  strategyId: string;
  strategyName: string;
  amountInvested: number;
  subscribedAt: string;
  avatar?: string;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  valueUSD: number;
  wallets: { address: string; amount: string }[];
  change24h: number;
}

export interface Action {
  id: string;
  type:
    | "execution"
    | "subscription"
    | "withdrawal"
    | "deposit"
    | "strategy_created";
  description: string;
  amount?: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
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
