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

export interface DelegationWallet {
  id: string;
  userId: string;
  name: string;
  address: string;
  createdAt: string | null;
}

export type WalletLoadingState = "initial" | "balances" | "complete";

export interface ProgressiveWallet {
  id: string;
  name: string;
  address: string;
  loadingState: WalletLoadingState;
  balance?: number;
  balanceUSD?: number;
  assets?: Wallet["assets"];
}
