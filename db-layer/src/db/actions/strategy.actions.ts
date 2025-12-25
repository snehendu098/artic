import { strategies, subscriptions, users, delegationWallets, walletActions, strategyPurchases } from "../schema";
import { eq, count, and, sql } from "drizzle-orm";
import { validateDelegationOwnership } from "./delegation.actions";

export interface Strategy {
  id: string;
  creatorId: string;
  name: string;
  strategyCode: string;
  isPublic: boolean;
  priceMnt: string | null;
  subscriberCount: number;
  protocols: string[] | null;
  status: "draft" | "active" | "paused";
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CreateStrategyParams {
  creatorId: string;
  name: string;
  strategyCode: string;
  isPublic?: boolean;
  priceMnt?: string;
  protocols?: string[];
  status?: "draft" | "active" | "paused";
  delegationWalletId?: string;
}

export const createStrategy = async (
  database: any,
  params: CreateStrategyParams
): Promise<Strategy> => {
  const inserted = await database
    .insert(strategies)
    .values({
      creatorId: params.creatorId,
      name: params.name,
      strategyCode: params.strategyCode,
      isPublic: params.isPublic ?? false,
      priceMnt: params.priceMnt,
      protocols: params.protocols,
      status: params.status ?? "draft",
    })
    .returning();

  const strategy = inserted[0];

  // Auto-subscribe creator if status is active
  if (params.status === "active" && params.delegationWalletId) {
    await validateDelegationOwnership(database, params.delegationWalletId, params.creatorId);

    await database.insert(subscriptions).values({
      strategyId: strategy.id,
      userId: params.creatorId,
      delegationWalletId: params.delegationWalletId,
      isActive: true,
    });

    // Update subscriber count
    await database
      .update(strategies)
      .set({ subscriberCount: 1 })
      .where(eq(strategies.id, strategy.id));
  }

  return strategy;
};

export const getStrategiesByCreator = async (
  database: any,
  userWallet: string
): Promise<Strategy[]> => {
  const user = await database
    .select()
    .from(users)
    .where(eq(users.wallet, userWallet))
    .limit(1);

  if (!user || user.length === 0) return [];

  return database
    .select()
    .from(strategies)
    .where(eq(strategies.creatorId, user[0].id));
};

export const getPublicStrategies = async (
  database: any
): Promise<(Strategy & { creatorWallet: string; creatorUsername: string | null })[]> => {
  const results = await database
    .select({
      id: strategies.id,
      creatorId: strategies.creatorId,
      name: strategies.name,
      strategyCode: strategies.strategyCode,
      isPublic: strategies.isPublic,
      priceMnt: strategies.priceMnt,
      subscriberCount: strategies.subscriberCount,
      protocols: strategies.protocols,
      status: strategies.status,
      createdAt: strategies.createdAt,
      updatedAt: strategies.updatedAt,
      creatorWallet: users.wallet,
      creatorUsername: users.username,
    })
    .from(strategies)
    .innerJoin(users, eq(strategies.creatorId, users.id))
    .where(eq(strategies.isPublic, true));

  return results;
};

export const getStrategyById = async (
  database: any,
  strategyId: string
): Promise<Strategy | null> => {
  const result = await database
    .select()
    .from(strategies)
    .where(eq(strategies.id, strategyId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
};

export interface StrategyDetailResponse {
  strategy: Strategy & { creatorWallet: string; creatorUsername: string | null };
  isOwned: boolean;
  isCreator: boolean;
  isPurchased: boolean;
  subscription: {
    id: string;
    isActive: boolean;
    delegationWalletId: string;
    delegationWalletName: string;
    delegationWalletAddress: string;
  } | null;
  subscribers: Array<{ username: string | null; wallet: string; subscribedAt: Date | null }>;
  recentActions: Array<{
    id: string;
    actionType: string;
    description: string;
    note: string | null;
    status: string;
    createdAt: Date | null;
  }>;
}

export const getStrategyDetails = async (
  database: any,
  strategyId: string,
  userWallet?: string
): Promise<StrategyDetailResponse | null> => {
  // Get strategy with creator info
  const strategyResult = await database
    .select({
      id: strategies.id,
      creatorId: strategies.creatorId,
      name: strategies.name,
      strategyCode: strategies.strategyCode,
      isPublic: strategies.isPublic,
      priceMnt: strategies.priceMnt,
      subscriberCount: strategies.subscriberCount,
      protocols: strategies.protocols,
      status: strategies.status,
      createdAt: strategies.createdAt,
      updatedAt: strategies.updatedAt,
      creatorWallet: users.wallet,
      creatorUsername: users.username,
    })
    .from(strategies)
    .innerJoin(users, eq(strategies.creatorId, users.id))
    .where(eq(strategies.id, strategyId))
    .limit(1);

  if (!strategyResult || strategyResult.length === 0) return null;

  const strategy = strategyResult[0];
  let isOwned = false;
  let isCreator = false;
  let isPurchased = false;
  let subscription = null;

  if (userWallet) {
    const user = await database
      .select()
      .from(users)
      .where(eq(users.wallet, userWallet))
      .limit(1);

    if (user && user.length > 0) {
      isCreator = strategy.creatorId === user[0].id;

      // Check subscription
      const sub = await database
        .select({
          id: subscriptions.id,
          isActive: subscriptions.isActive,
          delegationWalletId: subscriptions.delegationWalletId,
          delegationWalletName: delegationWallets.name,
          delegationWalletAddress: delegationWallets.address,
        })
        .from(subscriptions)
        .innerJoin(delegationWallets, eq(subscriptions.delegationWalletId, delegationWallets.id))
        .where(
          and(
            eq(subscriptions.strategyId, strategyId),
            eq(subscriptions.userId, user[0].id)
          )
        )
        .limit(1);

      if (sub && sub.length > 0) {
        isOwned = true;
        subscription = sub[0];
      }

      // Check if user purchased the strategy (for non-creators)
      if (!isCreator) {
        const purchase = await database
          .select()
          .from(strategyPurchases)
          .where(
            and(
              eq(strategyPurchases.strategyId, strategyId),
              eq(strategyPurchases.buyerId, user[0].id)
            )
          )
          .limit(1);
        isPurchased = purchase.length > 0;
      }
    }
  }

  // Get subscribers
  const subscriberResults = await database
    .select({
      username: users.username,
      wallet: users.wallet,
      subscribedAt: subscriptions.subscribedAt,
    })
    .from(subscriptions)
    .innerJoin(users, eq(subscriptions.userId, users.id))
    .where(eq(subscriptions.strategyId, strategyId));

  // Get recent actions for this strategy's subscriptions
  const actionResults = await database
    .select({
      id: walletActions.id,
      actionType: walletActions.actionType,
      description: walletActions.description,
      note: walletActions.note,
      status: walletActions.status,
      createdAt: walletActions.createdAt,
    })
    .from(walletActions)
    .innerJoin(subscriptions, eq(walletActions.subscriptionId, subscriptions.id))
    .where(eq(subscriptions.strategyId, strategyId))
    .limit(5);

  return {
    strategy,
    isOwned,
    isCreator,
    isPurchased,
    subscription,
    subscribers: subscriberResults,
    recentActions: actionResults,
  };
};

export const updateStrategy = async (
  database: any,
  strategyId: string,
  updates: Partial<{
    name: string;
    isPublic: boolean;
    priceMnt: string;
    protocols: string[];
    status: "draft" | "active" | "paused";
  }>
): Promise<Strategy | null> => {
  const result = await database
    .update(strategies)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(strategies.id, strategyId))
    .returning();

  return result.length > 0 ? result[0] : null;
};

export const incrementSubscriberCount = async (
  database: any,
  strategyId: string
): Promise<void> => {
  await database
    .update(strategies)
    .set({ subscriberCount: sql`${strategies.subscriberCount} + 1` })
    .where(eq(strategies.id, strategyId));
};

export const decrementSubscriberCount = async (
  database: any,
  strategyId: string
): Promise<void> => {
  await database
    .update(strategies)
    .set({ subscriberCount: sql`GREATEST(${strategies.subscriberCount} - 1, 0)` })
    .where(eq(strategies.id, strategyId));
};

export const activateStrategy = async (
  database: any,
  strategyId: string,
  userId: string,
  delegationWalletId: string
): Promise<Strategy | null> => {
  // Validate delegation wallet ownership
  await validateDelegationOwnership(database, delegationWalletId, userId);

  // Update strategy status to active
  const result = await database
    .update(strategies)
    .set({ status: "active", updatedAt: new Date() })
    .where(eq(strategies.id, strategyId))
    .returning();

  if (result.length === 0) return null;

  // Create subscription for creator
  await database.insert(subscriptions).values({
    strategyId,
    userId,
    delegationWalletId,
    isActive: true,
  });

  // Increment subscriber count
  await incrementSubscriberCount(database, strategyId);

  return result[0];
};

export const publishStrategy = async (
  database: any,
  strategyId: string,
  priceMnt?: string
): Promise<Strategy | null> => {
  const result = await database
    .update(strategies)
    .set({
      isPublic: true,
      status: "active",
      priceMnt: priceMnt ?? null,
      updatedAt: new Date(),
    })
    .where(eq(strategies.id, strategyId))
    .returning();

  return result.length > 0 ? result[0] : null;
};
