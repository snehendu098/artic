import { strategySchema, walletActions } from "../schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface WalletActionRecord {
  id: string;
  action: string;
  strategy: string;
  stateChange: string;
}

export const validateStrategyExists = async (
  database: any,
  strategyId: string
): Promise<void> => {
  const strategy = await database
    .select()
    .from(strategySchema)
    .where(eq(strategySchema.id, strategyId))
    .limit(1);

  if (!strategy || strategy.length === 0) {
    throw new Error("Strategy not found");
  }

  if (!strategy[0].delegationWallet) {
    throw new Error("Strategy does not have an associated delegation wallet");
  }
};

export const createWalletActions = async (
  database: any,
  strategyId: string,
  actions: Array<{ action: string; stateChange: string }>
): Promise<WalletActionRecord[]> => {
  const createdActions: WalletActionRecord[] = [];

  for (const action of actions) {
    const actionId = randomUUID();

    await database.insert(walletActions).values({
      id: actionId,
      action: action.action,
      strategy: strategyId,
      stateChange: action.stateChange,
    });

    createdActions.push({
      id: actionId,
      action: action.action,
      strategy: strategyId,
      stateChange: action.stateChange,
    });
  }

  return createdActions;
};
