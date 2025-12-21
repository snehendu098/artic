export interface CreateStrategyRequest {
  name: string;
  strategy: string;
  creatorWallet: string;
  delegationWallet?: string;
  isActive?: boolean;
  isPublic?: boolean;
}

export interface CreateStrategyData {
  strategyId: string;
  strategy: string;
  creatorWallet: string;
  delegationWallet: string | null;
  isActive: boolean;
}

export interface StateChangeAction {
  action: string;
  emoji?: string;
  stateChange?: string;
}

export interface UpdateStrategyStateRequest {
  strategyId: string;
  userWallet: string;
  delegationWalletId: string;
  subscriptionId: string;
  actions: StateChangeAction[];
}

export interface WalletActionData {
  id: string;
  action: string;
  emoji?: string;
  strategy: string;
  subscriptionId: string;
  stateChange?: string;
}
