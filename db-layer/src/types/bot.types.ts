export interface ActiveSubscriptionData {
  subscriptionId: string;
  strategyId: string;
  strategyCode: string;
  strategyName: string;
  userWallet: string;
  delegationWalletId: string;
  walletActions: WalletActionInfo[];
}

export interface WalletActionInfo {
  id: string;
  action: string;
  stateChange?: string;
  createdAt: Date;
}
