export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// DB Layer response types
export interface DBAction {
  id: string;
  actionType: string;
  description: string;
  note: string | null;
  status: string;
  createdAt: string | null;
  strategyName: string | null;
  delegationWalletName: string;
}

export interface DBStrategy {
  id: string;
  creatorId: string;
  name: string;
  strategyCode: string;
  isPublic: boolean;
  priceMnt: string | null;
  subscriberCount: number;
  protocols: string[] | null;
  status: "draft" | "active" | "paused";
  createdAt: string | null;
  updatedAt: string | null;
}

export interface DBSubscription {
  id: string;
  strategyId: string;
  strategyName: string;
  strategyCreator: string;
  delegationWalletId: string;
  delegationWalletName: string;
  delegationWalletAddress: string;
  isActive: boolean;
  subscribedAt: string | null;
}

export interface DBSubscriber {
  id: string;
  username: string | null;
  wallet: string;
  strategyId: string;
  strategyName: string;
  subscribedAt: string | null;
}
