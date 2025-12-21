import { strategySchema, strategySubscriptions, subscriptionWallets, delegationWallets, walletActions } from "../schema";
import { eq, count } from "drizzle-orm";
import { randomUUID } from "crypto";
import { validateDelegationWalletOwnership } from "./delegation.actions";
import { privateKeyToAccount } from "viem/accounts";

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
  name: string,
  strategy: string,
  creatorWallet: string,
  delegationWallet: string | null,
  isActive: boolean,
  isPublic: boolean = false
): Promise<CreateStrategyResult> => {
  await database.insert(strategySchema).values({
    id: strategyId,
    name,
    strategy,
    creatorWallet,
    isActive,
    isPublic,
  });

  // Auto-subscribe the creator if the strategy is active
  if (isActive) {
    // Validate delegation wallet if provided
    if (delegationWallet) {
      await validateDelegationWalletOwnership(database, delegationWallet, creatorWallet);
    } else {
      throw new Error("delegationWallet is required when isActive is true");
    }

    const subscriptionId = randomUUID();

    // Create subscription
    await database.insert(strategySubscriptions).values({
      id: subscriptionId,
      strategyId: strategyId,
      userWallet: creatorWallet,
      isActive: true,
    });

    // Link delegation wallet to subscription
    await database.insert(subscriptionWallets).values({
      id: randomUUID(),
      subscriptionId: subscriptionId,
      delegationWalletId: delegationWallet,
    });
  }

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
  name: string;
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
      name: strategySchema.name,
      isActive: strategySchema.isActive,
    })
    .from(strategySchema)
    .where(eq(strategySchema.creatorWallet, userWallet));

  // Query 2: Get strategies subscribed by the user with their names
  const subscribedStrategiesWithNames = await database
    .select({
      subscriptionId: strategySubscriptions.id,
      strategyId: strategySubscriptions.strategyId,
      isActive: strategySubscriptions.isActive,
      strategyName: strategySchema.name,
    })
    .from(strategySubscriptions)
    .innerJoin(
      strategySchema,
      eq(strategySubscriptions.strategyId, strategySchema.id)
    )
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
      name: strategy.name,
      subscriberCount: countMap.get(strategy.id) || 0,
      isActiveForUser: strategy.isActive,
      isCreator: true,
    });
  }

  // Add subscribed strategies (avoid duplicates if user is also creator)
  for (const subscription of subscribedStrategiesWithNames) {
    if (!createdStrategies.some((s: any) => s.id === subscription.strategyId)) {
      results.push({
        strategyId: subscription.strategyId,
        name: subscription.strategyName,
        subscriberCount: countMap.get(subscription.strategyId) || 0,
        isActiveForUser: subscription.isActive,
        isCreator: false,
      });
    }
  }

  return results;
};

export interface StrategyDetailResponse {
  strategy: {
    id: string;
    name: string;
    strategy: string;
    creatorWallet: string | null;
    isActive: boolean;
    createdAt: string | null;
    subscriberCount: number;
  };
  isActiveForUser: boolean;
  delegationWallet: string | null;
  walletActions: Array<{
    id: string;
    action: string;
    emoji?: string;
    stateChange?: string;
    userWallet: string;
    createdAt: Date | null;
  }>;
  subscribers: Array<{ userWallet: string }>;
}

export const getStrategyDetailsById = async (
  database: any,
  strategyId: string,
  userWallet?: string
): Promise<StrategyDetailResponse | null> => {
  // Query 1: Get strategy details
  const strategy = await database
    .select()
    .from(strategySchema)
    .where(eq(strategySchema.id, strategyId))
    .limit(1);

  if (!strategy || strategy.length === 0) {
    return null;
  }

  const strategyData = strategy[0];

  // Query 2: Get subscriber count
  const subscriberCountResult = await database
    .select({
      count: count(strategySubscriptions.id),
    })
    .from(strategySubscriptions)
    .where(eq(strategySubscriptions.strategyId, strategyId));

  const subscriberCount = subscriberCountResult[0]?.count || 0;

  // Query 3: Check if user is subscribed
  let isActiveForUser = false;
  let delegationWallet: string | null = null;

  if (userWallet) {
    const subscription = await database
      .select()
      .from(strategySubscriptions)
      .where(
        eq(strategySubscriptions.strategyId, strategyId)
      )
      .where(eq(strategySubscriptions.userWallet, userWallet))
      .limit(1);

    if (subscription && subscription.length > 0) {
      isActiveForUser = subscription[0].isActive;

      // Get delegation wallet for this subscription
      const delegationRecord = await database
        .select({
          delegationWalletId: subscriptionWallets.delegationWalletId,
        })
        .from(subscriptionWallets)
        .where(eq(subscriptionWallets.subscriptionId, subscription[0].id))
        .limit(1);

      if (delegationRecord && delegationRecord.length > 0) {
        const delegationWalletRecord = await database
          .select()
          .from(delegationWallets)
          .where(eq(delegationWallets.id, delegationRecord[0].delegationWalletId))
          .limit(1);

        if (delegationWalletRecord && delegationWalletRecord.length > 0) {
          const account = privateKeyToAccount(
            delegationWalletRecord[0].delegationWalletPk as `0x${string}`
          );
          delegationWallet = account.address;
        }
      }
    }
  }

  // Query 4: Get wallet actions for this strategy
  const actions = await database
    .select()
    .from(walletActions)
    .where(eq(walletActions.strategy, strategyId));

  // Query 5: Get all subscribers
  const subscribers = await database
    .select({
      userWallet: strategySubscriptions.userWallet,
    })
    .from(strategySubscriptions)
    .where(eq(strategySubscriptions.strategyId, strategyId));

  return {
    strategy: {
      id: strategyData.id,
      name: strategyData.name,
      strategy: strategyData.strategy,
      creatorWallet: strategyData.creatorWallet,
      isActive: strategyData.isActive,
      createdAt: strategyData.createdAt,
      subscriberCount,
    },
    isActiveForUser,
    delegationWallet,
    walletActions: actions.map((action: any) => ({
      id: action.id,
      action: action.action,
      emoji: action.emoji,
      stateChange: action.stateChange,
      userWallet: action.userWallet,
      createdAt: action.createdAt,
    })),
    subscribers: subscribers.map((sub: any) => ({
      userWallet: sub.userWallet,
    })),
  };
};
