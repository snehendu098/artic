export interface Strategy {
  id: string;
  name: string;
  strategyCode?: string;
  subscriberCount: number;
  status: "active" | "paused" | "draft";
  createdAt: string;
  protocols: string[];
  isPublic?: boolean;
  priceMnt?: string;
  creatorWallet?: string;
  creatorUsername?: string;
}

export interface StrategyPurchase {
  id: string;
  strategyId: string;
  strategyName: string;
  priceMnt: string;
  txHash: string;
  purchasedAt: string;
}
