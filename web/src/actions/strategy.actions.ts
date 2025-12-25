"use server";

import type {
  Strategy,
  Subscriber,
  Action,
  DBStrategy,
  DBSubscriber,
  DBAction,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

// Transform DB types to frontend types
function mapStrategy(db: DBStrategy): Strategy {
  return {
    id: db.id,
    name: db.name,
    strategyCode: db.strategyCode,
    subscriberCount: db.subscriberCount,
    status: db.status,
    createdAt: db.createdAt ?? new Date().toISOString(),
    protocols: db.protocols ?? [],
    isPublic: db.isPublic,
    priceMnt: db.priceMnt ?? undefined,
  };
}

function mapSubscriber(db: DBSubscriber): Subscriber {
  return {
    id: db.id,
    username: db.username,
    wallet: db.wallet,
    strategyId: db.strategyId,
    strategyName: db.strategyName,
    subscribedAt: db.subscribedAt ?? new Date().toISOString(),
  };
}

function mapAction(db: DBAction): Action {
  return {
    id: db.id,
    type: db.actionType as Action["type"],
    description: db.description,
    note: db.note ?? undefined,
    timestamp: db.createdAt ?? new Date().toISOString(),
    status: db.status as Action["status"],
    strategyName: db.strategyName ?? undefined,
    delegationWalletName: db.delegationWalletName,
  };
}

export interface CreateStrategyPayload {
  name: string;
  strategyCode: string;
  protocols: string[];
  status: "draft" | "active";
  isPublic: boolean;
  priceMnt: string | null;
  delegationWalletId: string | null;
}

export interface CreateStrategyResult {
  success: boolean;
  message: string;
  data: Strategy | null;
}

export async function createStrategy(
  wallet: string,
  payload: CreateStrategyPayload,
): Promise<CreateStrategyResult> {
  try {
    const res = await fetch(`${API_URL}/strategies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet,
        name: payload.name,
        strategyCode: payload.strategyCode,
        protocols: payload.protocols,
        status: payload.status,
        isPublic: payload.isPublic,
        priceMnt: payload.priceMnt,
        delegationWalletId: payload.delegationWalletId,
      }),
    });
    const json = await res.json();
    return {
      success: json.success,
      message: json.message,
      data: json.data ? mapStrategy(json.data) : null,
    };
  } catch (error) {
    console.error("Failed to create strategy:", error);
    return { success: false, message: "Failed to create strategy", data: null };
  }
}

export interface StrategyDetailsResponse {
  strategy: Strategy & { creatorWallet: string; creatorUsername?: string };
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
  subscribers: Subscriber[];
  recentActions: Action[];
}

// API response types specific to getStrategyDetails
interface APISubscriber {
  username: string | null;
  wallet: string;
  subscribedAt: string | null;
}

interface APIAction {
  id: string;
  actionType: string;
  description: string;
  note: string | null;
  status: string;
  createdAt: string | null;
}

interface DBStrategyDetailResponse {
  strategy: DBStrategy & {
    creatorWallet: string;
    creatorUsername: string | null;
  };
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
  subscribers: APISubscriber[];
  recentActions: APIAction[];
}

export async function getStrategyDetails(
  id: string,
  userWallet?: string,
): Promise<StrategyDetailsResponse | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (userWallet) {
      headers["X-User-Wallet"] = userWallet;
    }

    const res = await fetch(`${API_URL}/strategies/${id}`, { headers });
    const json = await res.json();

    if (!json.success || !json.data) return null;

    const data = json.data as DBStrategyDetailResponse;
    const baseStrategy = mapStrategy(data.strategy as DBStrategy);

    console.log(baseStrategy);

    // Map API subscribers to frontend Subscriber type
    const mappedSubscribers: Subscriber[] = data.subscribers.map((s, idx) => ({
      id: `subscriber-${idx}`,
      username: s.username ?? null,
      wallet: s.wallet,
      strategyId: id,
      strategyName: data.strategy.name,
      subscribedAt: s.subscribedAt ?? new Date().toISOString(),
    }));

    // Map API actions to frontend Action type
    const mappedActions: Action[] = data.recentActions.map((a) => ({
      id: a.id,
      type: a.actionType as Action["type"],
      description: a.description,
      note: a.note ?? undefined,
      timestamp: a.createdAt ?? new Date().toISOString(),
      status: a.status as Action["status"],
      strategyName: data.strategy.name,
      delegationWalletName: data.subscription?.delegationWalletName ?? "",
    }));

    return {
      strategy: {
        ...baseStrategy,
        creatorWallet: data.strategy.creatorWallet,
        creatorUsername: data.strategy.creatorUsername ?? undefined,
      },
      isOwned: data.isOwned,
      isCreator: data.isCreator,
      isPurchased: data.isPurchased,
      subscription: data.subscription,
      subscribers: mappedSubscribers,
      recentActions: mappedActions,
    };
  } catch (error) {
    console.error("Failed to get strategy details:", error);
    return null;
  }
}

export interface ActionResult {
  success: boolean;
  message: string;
}

export async function activateStrategy(
  strategyId: string,
  wallet: string,
  delegationWalletId: string,
): Promise<ActionResult> {
  try {
    const res = await fetch(`${API_URL}/strategies/${strategyId}/activate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, delegationWalletId }),
    });
    const json = await res.json();
    return { success: json.success, message: json.message };
  } catch (error) {
    console.error("Failed to activate strategy:", error);
    return { success: false, message: "Failed to activate strategy" };
  }
}

export async function publishStrategy(
  strategyId: string,
  wallet: string,
  priceMnt?: string,
): Promise<ActionResult> {
  try {
    const res = await fetch(`${API_URL}/strategies/${strategyId}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, priceMnt }),
    });
    const json = await res.json();
    return { success: json.success, message: json.message };
  } catch (error) {
    console.error("Failed to publish strategy:", error);
    return { success: false, message: "Failed to publish strategy" };
  }
}
