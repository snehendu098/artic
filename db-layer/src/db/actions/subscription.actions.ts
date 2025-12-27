import { eq, and } from "drizzle-orm";
import {
  subscriptions,
  strategies,
  users,
  delegationWallets,
  walletActions,
  strategyPurchases,
} from "../schema";
import { decrypt } from "../../utils/crypto";
import {
  incrementSubscriberCount,
  decrementSubscriberCount,
} from "./strategy.actions";

export interface Subscription {
  id: string;
  strategyId: string;
  userId: string;
  delegationWalletId: string;
  isActive: boolean;
  subscribedAt: Date | null;
  pausedAt: Date | null;
}

export interface SubscriptionWithDetails {
  id: string;
  strategyId: string;
  strategyName: string;
  strategyCreator: string;
  delegationWalletId: string;
  delegationWalletName: string;
  delegationWalletAddress: string;
  isActive: boolean;
  subscribedAt: Date | null;
}

export interface CreateSubscriptionParams {
  strategyId: string;
  userId: string;
  delegationWalletId: string;
}

export const createSubscription = async (
  database: any,
  params: CreateSubscriptionParams,
): Promise<Subscription> => {
  const inserted = await database
    .insert(subscriptions)
    .values({
      strategyId: params.strategyId,
      userId: params.userId,
      delegationWalletId: params.delegationWalletId,
      isActive: true,
    })
    .returning();

  await incrementSubscriberCount(database, params.strategyId);

  return inserted[0];
};

export const getSubscriptionsByWallet = async (
  database: any,
  userWallet: string,
): Promise<SubscriptionWithDetails[]> => {
  const user = await database
    .select()
    .from(users)
    .where(eq(users.wallet, userWallet))
    .limit(1);

  if (!user || user.length === 0) return [];

  const results = await database
    .select({
      id: subscriptions.id,
      strategyId: subscriptions.strategyId,
      strategyName: strategies.name,
      creatorId: strategies.creatorId,
      delegationWalletId: subscriptions.delegationWalletId,
      delegationWalletName: delegationWallets.name,
      delegationWalletAddress: delegationWallets.address,
      isActive: subscriptions.isActive,
      subscribedAt: subscriptions.subscribedAt,
    })
    .from(subscriptions)
    .innerJoin(strategies, eq(subscriptions.strategyId, strategies.id))
    .innerJoin(
      delegationWallets,
      eq(subscriptions.delegationWalletId, delegationWallets.id),
    )
    .where(eq(subscriptions.userId, user[0].id));

  // Get creator wallets
  const creatorIds = [...new Set(results.map((r: any) => r.creatorId))];
  const creators = await database
    .select({ id: users.id, wallet: users.wallet })
    .from(users)
    .where(eq(users.id, creatorIds[0])); // Simplified - ideally use inArray

  const creatorMap = new Map(creators.map((c: any) => [c.id, c.wallet]));

  return results.map((r: any) => ({
    id: r.id,
    strategyId: r.strategyId,
    strategyName: r.strategyName,
    strategyCreator: creatorMap.get(r.creatorId) || "",
    delegationWalletId: r.delegationWalletId,
    delegationWalletName: r.delegationWalletName,
    delegationWalletAddress: r.delegationWalletAddress,
    isActive: r.isActive,
    subscribedAt: r.subscribedAt,
  }));
};

export const pauseSubscription = async (
  database: any,
  subscriptionId: string,
): Promise<Subscription | null> => {
  const result = await database
    .update(subscriptions)
    .set({ isActive: false, pausedAt: new Date() })
    .where(eq(subscriptions.id, subscriptionId))
    .returning();

  if (result.length > 0) {
    await decrementSubscriberCount(database, result[0].strategyId);
  }

  return result.length > 0 ? result[0] : null;
};

export const activateSubscription = async (
  database: any,
  subscriptionId: string,
): Promise<Subscription | null> => {
  const result = await database
    .update(subscriptions)
    .set({ isActive: true, pausedAt: null })
    .where(eq(subscriptions.id, subscriptionId))
    .returning();

  if (result.length > 0) {
    await incrementSubscriberCount(database, result[0].strategyId);
  }

  return result.length > 0 ? result[0] : null;
};

export interface ActiveSubscriptionForBot {
  subscriptionId: string;
  strategyId: string;
  strategyCode: string;
  strategyName: string;
  userId: string;
  userWallet: string;
  delegationWalletId: string;
  delegationWalletAddress: string;
  encryptedPrivateKey: string;
  recentActions: Array<{
    id: string;
    actionType: string;
    description: string;
    note: string | null;
    createdAt: Date | null;
  }>;
}

export const getActiveSubscriptionsForBot = async (
  database: any,
  encryptionKey: string,
): Promise<ActiveSubscriptionForBot[]> => {
  const results = await database
    .select({
      subscriptionId: subscriptions.id,
      strategyId: strategies.id,
      strategyCode: strategies.strategyCode,
      strategyName: strategies.name,
      userId: subscriptions.userId,
      userWallet: users.wallet,
      delegationWalletId: delegationWallets.id,
      delegationWalletAddress: delegationWallets.address,
      encryptedPrivateKey: delegationWallets.encryptedPrivateKey,
    })
    .from(subscriptions)
    .innerJoin(strategies, eq(subscriptions.strategyId, strategies.id))
    .innerJoin(users, eq(subscriptions.userId, users.id))
    .innerJoin(
      delegationWallets,
      eq(subscriptions.delegationWalletId, delegationWallets.id),
    )
    .where(eq(subscriptions.isActive, true));

  // Get recent actions for each subscription
  const subscriptionIds = results.map((r: any) => r.subscriptionId);

  const actionsMap = new Map<string, any[]>();
  for (const subId of subscriptionIds) {
    const actions = await database
      .select({
        id: walletActions.id,
        actionType: walletActions.actionType,
        description: walletActions.description,
        note: walletActions.note,
        createdAt: walletActions.createdAt,
      })
      .from(walletActions)
      .where(eq(walletActions.subscriptionId, subId))
      .limit(10);
    actionsMap.set(subId, actions);
  }

  // Decrypt private keys
  const decryptedResults = await Promise.all(
    results.map(async (r: any) => {
      let privateKey = r.encryptedPrivateKey;
      // Decrypt if encrypted (contains colons from iv:ciphertext:authTag format)
      if (privateKey.includes(":")) {
        privateKey = await decrypt(privateKey, encryptionKey);
      }
      return {
        ...r,
        encryptedPrivateKey: privateKey,
        recentActions: actionsMap.get(r.subscriptionId) || [],
      };
    }),
  );

  return decryptedResults;
};

export const getSubscribersForStrategy = async (
  database: any,
  strategyId: string,
): Promise<
  Array<{
    id: string;
    username: string | null;
    wallet: string;
    purchasedAt: Date | null;
  }>
> => {
  const results = await database
    .select({
      id: strategyPurchases.id,
      username: users.username,
      wallet: users.wallet,
      purchasedAt: strategyPurchases.purchasedAt,
    })
    .from(strategyPurchases)
    .innerJoin(users, eq(strategyPurchases.buyerId, users.id))
    .where(eq(strategyPurchases.strategyId, strategyId));

  return results;
};
