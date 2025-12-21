import { strategySchema, walletActions, delegationWallets, subscriptionWallets, strategySubscriptions } from "../schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface WalletActionRecord {
  id: string;
  action: string;
  strategy: string;
  userWallet: string;
  delegationWalletId: string;
  subscriptionId: string;
  stateChange?: string;
  createdAt?: Date;
}

export interface RecentWalletAction {
  id: string;
  action: string;
  stateChange?: string;
  userWallet: string;
  createdAt: Date;
  strategyName?: string;
}

export const validateStrategyExists = async (
  database: any,
  strategyId: string,
): Promise<void> => {
  const strategy = await database
    .select()
    .from(strategySchema)
    .where(eq(strategySchema.id, strategyId))
    .limit(1);

  if (!strategy || strategy.length === 0) {
    throw new Error("Strategy not found");
  }
};

export const validateSubscriptionHasDelegation = async (
  database: any,
  subscriptionId: string,
): Promise<void> => {
  const delegation = await database
    .select()
    .from(subscriptionWallets)
    .where(eq(subscriptionWallets.subscriptionId, subscriptionId))
    .limit(1);

  if (!delegation || delegation.length === 0) {
    throw new Error("Subscription does not have an associated delegation wallet");
  }
};

export const createWalletActions = async (
  database: any,
  strategyId: string,
  userWallet: string,
  delegationWalletId: string,
  subscriptionId: string,
  actions: Array<{ action: string; stateChange?: string }>,
): Promise<WalletActionRecord[]> => {
  const createdActions: WalletActionRecord[] = [];

  for (const action of actions) {
    const actionId = randomUUID();

    await database.insert(walletActions).values({
      id: actionId,
      action: action.action,
      strategy: strategyId,
      userWallet: userWallet,
      delegationWalletId: delegationWalletId,
      subscriptionId: subscriptionId,
      stateChange: action.stateChange,
    });

    createdActions.push({
      id: actionId,
      action: action.action,
      strategy: strategyId,
      userWallet: userWallet,
      delegationWalletId: delegationWalletId,
      subscriptionId: subscriptionId,
      stateChange: action.stateChange,
    });
  }

  return createdActions;
};

export const getRecentWalletActions = async (
  database: any,
  userWallet: string,
  limit: number = 3,
): Promise<RecentWalletAction[]> => {
  const actions = await database
    .select({
      id: walletActions.id,
      action: walletActions.action,
      stateChange: walletActions.stateChange,
      userWallet: walletActions.userWallet,
      createdAt: walletActions.createdAt,
      strategyName: strategySchema.name,
    })
    .from(walletActions)
    .leftJoin(strategySchema, eq(walletActions.strategy, strategySchema.id))
    .where(eq(walletActions.userWallet, userWallet))
    .orderBy(desc(walletActions.createdAt))
    .limit(limit);

  return actions;
};
