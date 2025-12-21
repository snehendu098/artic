import { eq } from "drizzle-orm";
import { strategySubscriptions, strategySchema, walletActions, subscriptionWallets } from "../schema";
import { ActiveSubscriptionData, WalletActionInfo } from "../../types/bot.types";

export const getActiveSubscriptionsForBot = async (
  database: any
): Promise<ActiveSubscriptionData[]> => {
  const results = await database
    .select({
      subscriptionId: strategySubscriptions.id,
      strategyId: strategySchema.id,
      strategyCode: strategySchema.strategy,
      strategyName: strategySchema.name,
      userWallet: strategySubscriptions.userWallet,
      delegationWalletId: subscriptionWallets.delegationWalletId,
      actionId: walletActions.id,
      action: walletActions.action,
      stateChange: walletActions.stateChange,
      createdAt: walletActions.createdAt,
    })
    .from(strategySubscriptions)
    .innerJoin(
      strategySchema,
      eq(strategySubscriptions.strategyId, strategySchema.id)
    )
    .innerJoin(
      subscriptionWallets,
      eq(strategySubscriptions.id, subscriptionWallets.subscriptionId)
    )
    .leftJoin(
      walletActions,
      eq(strategySubscriptions.id, walletActions.subscriptionId)
    )
    .where(eq(strategySubscriptions.isActive, true));

  const grouped = new Map<string, ActiveSubscriptionData>();

  for (const row of results) {
    const key = `${row.subscriptionId}-${row.delegationWalletId}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        subscriptionId: row.subscriptionId,
        strategyId: row.strategyId,
        strategyCode: row.strategyCode,
        strategyName: row.strategyName,
        userWallet: row.userWallet,
        delegationWalletId: row.delegationWalletId,
        walletActions: [],
      });
    }

    // Only add wallet action if it exists (from LEFT JOIN)
    if (row.actionId) {
      grouped.get(key)!.walletActions.push({
        id: row.actionId,
        action: row.action,
        stateChange: row.stateChange,
        createdAt: row.createdAt,
      });
    }
  }

  return Array.from(grouped.values());
};
