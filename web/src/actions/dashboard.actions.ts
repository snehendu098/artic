"use server";

import { api } from "@/lib/api";
import type {
  Strategy,
  Subscription,
  Subscriber,
  Action,
  DelegationWallet,
  DBAction,
  DBStrategy,
  DBSubscription,
  DBSubscriber,
} from "@/types";

// Transform DB action to frontend Action type
function mapAction(dbAction: DBAction): Action {
  return {
    id: dbAction.id,
    type: dbAction.actionType as Action["type"],
    description: dbAction.description,
    note: dbAction.note ?? undefined,
    timestamp: dbAction.createdAt ?? new Date().toISOString(),
    status: dbAction.status as Action["status"],
    strategyName: dbAction.strategyName ?? undefined,
    delegationWalletName: dbAction.delegationWalletName,
  };
}

// Transform DB strategy to frontend Strategy type
function mapStrategy(dbStrategy: DBStrategy): Strategy {
  return {
    id: dbStrategy.id,
    name: dbStrategy.name,
    description: dbStrategy.description ?? "",
    subscriberCount: dbStrategy.subscriberCount,
    status: dbStrategy.status,
    createdAt: dbStrategy.createdAt ?? new Date().toISOString(),
    protocols: dbStrategy.protocols ?? [],
    isPublic: dbStrategy.isPublic,
    priceMnt: dbStrategy.priceMnt ?? undefined,
  };
}

// Transform DB subscription to frontend Subscription type
function mapSubscription(dbSub: DBSubscription): Subscription {
  return {
    id: dbSub.id,
    strategyId: dbSub.strategyId,
    strategyName: dbSub.strategyName,
    strategyCreator: dbSub.strategyCreator,
    delegationWalletId: dbSub.delegationWalletId,
    delegationWalletName: dbSub.delegationWalletName,
    delegationWalletAddress: dbSub.delegationWalletAddress,
    isActive: dbSub.isActive,
    subscribedAt: dbSub.subscribedAt ?? new Date().toISOString(),
  };
}

// Transform DB subscriber to frontend Subscriber type
function mapSubscriber(dbSub: DBSubscriber): Subscriber {
  return {
    id: dbSub.id,
    username: dbSub.username,
    wallet: dbSub.wallet,
    strategyId: dbSub.strategyId,
    strategyName: dbSub.strategyName,
    subscribedAt: dbSub.subscribedAt ?? new Date().toISOString(),
  };
}

export async function getUserStrategies(wallet: string): Promise<Strategy[]> {
  const data = await api<DBStrategy[]>(`/strategies/mine/${wallet}`);
  return data ? data.map(mapStrategy) : [];
}

export async function getUserSubscriptions(wallet: string): Promise<Subscription[]> {
  const data = await api<DBSubscription[]>(`/subscriptions/${wallet}`);
  return data ? data.map(mapSubscription) : [];
}

export async function getDelegationWallets(wallet: string): Promise<DelegationWallet[]> {
  const data = await api<DelegationWallet[]>(`/delegations/${wallet}`);
  return data ?? [];
}

export async function getWalletActions(wallet: string, limit: number = 10): Promise<Action[]> {
  const data = await api<DBAction[]>(`/actions/${wallet}?limit=${limit}`);
  return data ? data.map(mapAction) : [];
}

export async function getSubscribers(wallet: string): Promise<Subscriber[]> {
  const data = await api<DBSubscriber[]>(`/subscribers/${wallet}`);
  return data ? data.map(mapSubscriber) : [];
}

export interface DashboardData {
  strategies: Strategy[];
  subscriptions: Subscription[];
  delegationWallets: DelegationWallet[];
  actions: Action[];
  subscribers: Subscriber[];
}

export async function getDashboardData(wallet: string): Promise<DashboardData> {
  const [strategies, subscriptions, delegationWallets, actions, subscribers] = await Promise.all([
    getUserStrategies(wallet),
    getUserSubscriptions(wallet),
    getDelegationWallets(wallet),
    getWalletActions(wallet, 10),
    getSubscribers(wallet),
  ]);

  return {
    strategies,
    subscriptions,
    delegationWallets,
    actions,
    subscribers,
  };
}
