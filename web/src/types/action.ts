export interface Action {
  id: string;
  type:
    | "execution"
    | "subscription"
    | "withdrawal"
    | "deposit"
    | "strategy_created";
  description: string;
  note?: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  strategyName?: string;
  delegationWalletName?: string;
  txHash?: string;
}
