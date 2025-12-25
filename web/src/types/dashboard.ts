/** @deprecated Legacy dashboard structure */
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
  subscribers: { wallet: string; subscribedAt: Date }[];
}
