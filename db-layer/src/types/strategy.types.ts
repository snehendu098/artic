export interface CreateStrategyRequest {
  strategy: string;
  creatorWallet: string;
  delegationWallet?: string;
  activate?: boolean;
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
  stateChange: string;
}

export interface UpdateStrategyStateRequest {
  strategyId: string;
  actions: StateChangeAction[];
}

export interface WalletActionData {
  id: string;
  action: string;
  strategy: string;
  stateChange: string;
}
