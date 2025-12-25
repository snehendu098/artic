export interface Subscription {
  id: string;
  strategyId: string;
  strategyName: string;
  strategyCreator: string;
  delegationWalletId: string;
  delegationWalletName: string;
  delegationWalletAddress: string;
  isActive: boolean;
  subscribedAt: string;
}

export interface Subscriber {
  id: string;
  username: string | null;
  wallet: string;
  strategyId: string;
  strategyName: string;
  subscribedAt: string;
  avatar?: string;
}
