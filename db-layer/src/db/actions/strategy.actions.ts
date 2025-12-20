import { strategySchema, strategySubscriptions } from "../schema";
import { eq, count } from "drizzle-orm";

export interface CreateStrategyResult {
  strategyId: string;
  strategy: string;
  creatorWallet: string;
  delegationWallet: string | null;
  isActive: boolean;
}

export interface Strategy {
  id: string;
  strategy: string;
  creatorWallet: string | null;
  delegationWallet: string | null;
  isActive: boolean;
  createdAt: string | null;
}

export const createStrategy = async (
  database: any,
  strategyId: string,
  strategy: string,
  creatorWallet: string,
  delegationWallet: string | null,
  isActive: boolean
): Promise<CreateStrategyResult> => {
  await database.insert(strategySchema).values({
    id: strategyId,
    strategy,
    creatorWallet,
    delegationWallet,
    isActive,
  });

  return {
    strategyId,
    strategy,
    creatorWallet,
    delegationWallet,
    isActive,
  };
};

export const getStrategiesByCreator = async (
  database: any,
  creatorWallet: string
): Promise<Strategy[]> => {
  const strategies = await database
    .select()
    .from(strategySchema)
    .where(eq(strategySchema.creatorWallet, creatorWallet));

  return strategies;
};

export interface StrategyInfo {
  strategyId: string;
  subscriberCount: number;
  isActiveForUser: boolean;
  isCreator: boolean;
}

export const getStrategiesForUser = async (
  database: any,
  userWallet: string
): Promise<StrategyInfo[]> => {
  // Query 1: Get strategies created by the user
  const createdStrategies = await database
    .select({
      id: strategySchema.id,
      isActive: strategySchema.isActive,
    })
    .from(strategySchema)
    .where(eq(strategySchema.creatorWallet, userWallet));

  // Query 2: Get strategies subscribed by the user
  const subscribedStrategies = await database
    .select({
      strategyId: strategySubscriptions.strategyId,
      isActive: strategySubscriptions.isActive,
    })
    .from(strategySubscriptions)
    .where(eq(strategySubscriptions.userWallet, userWallet));

  // Query 3: Get subscriber counts for all strategies
  const subscriberCounts = await database
    .select({
      strategyId: strategySubscriptions.strategyId,
      count: count(strategySubscriptions.id),
    })
    .from(strategySubscriptions)
    .groupBy(strategySubscriptions.strategyId);

  // Build a map of subscriber counts
  const countMap = new Map(
    subscriberCounts.map((item: any) => [item.strategyId, item.count])
  );

  // Combine created and subscribed strategies
  const results: StrategyInfo[] = [];

  // Add created strategies
  for (const strategy of createdStrategies) {
    results.push({
      strategyId: strategy.id,
      subscriberCount: countMap.get(strategy.id) || 0,
      isActiveForUser: strategy.isActive,
      isCreator: true,
    });
  }

  // Add subscribed strategies (avoid duplicates if user is also creator)
  for (const subscription of subscribedStrategies) {
    if (!createdStrategies.some((s: any) => s.id === subscription.strategyId)) {
      results.push({
        strategyId: subscription.strategyId,
        subscriberCount: countMap.get(subscription.strategyId) || 0,
        isActiveForUser: subscription.isActive,
        isCreator: false,
      });
    }
  }

  return results;
};
