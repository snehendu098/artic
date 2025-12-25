"use server";

import type { DBMarketplaceStrategy, DBPurchase } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export interface MarketplaceStrategy {
  id: string;
  name: string;
  isPublic: boolean;
  priceMnt: string | null;
  subscriberCount: number;
  protocols: string[];
  status: "draft" | "active" | "paused";
  createdAt: string;
  creatorWallet: string;
  creatorUsername: string | null;
}

export interface Purchase {
  id: string;
  strategyId: string;
  strategyName: string;
  priceMnt: string;
  txHash: string;
  purchasedAt: string;
}

function mapMarketplaceStrategy(db: DBMarketplaceStrategy): MarketplaceStrategy {
  return {
    id: db.id,
    name: db.name,
    isPublic: db.isPublic,
    priceMnt: db.priceMnt,
    subscriberCount: db.subscriberCount,
    protocols: db.protocols ?? [],
    status: db.status,
    createdAt: db.createdAt ?? new Date().toISOString(),
    creatorWallet: db.creatorWallet,
    creatorUsername: db.creatorUsername,
  };
}

function mapPurchase(db: DBPurchase): Purchase {
  return {
    id: db.id,
    strategyId: db.strategyId,
    strategyName: db.strategyName,
    priceMnt: db.priceMnt,
    txHash: db.txHash,
    purchasedAt: db.purchasedAt ?? new Date().toISOString(),
  };
}

export async function getMarketplaceStrategies(): Promise<MarketplaceStrategy[]> {
  try {
    const res = await fetch(`${API_URL}/strategies`, {
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (!json.success || !json.data) return [];
    return json.data.map(mapMarketplaceStrategy);
  } catch (error) {
    console.error("Failed to fetch marketplace strategies:", error);
    return [];
  }
}

export async function getUserPurchases(wallet: string): Promise<Purchase[]> {
  try {
    const res = await fetch(`${API_URL}/purchases/${wallet}`, {
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    if (!json.success || !json.data) return [];
    return json.data.map(mapPurchase);
  } catch (error) {
    console.error("Failed to fetch user purchases:", error);
    return [];
  }
}

export interface CreatePurchaseResult {
  success: boolean;
  message: string;
  data: Purchase | null;
}

export async function createPurchase(
  wallet: string,
  strategyId: string,
  priceMnt: string,
  txHash: string,
): Promise<CreatePurchaseResult> {
  try {
    const res = await fetch(`${API_URL}/purchases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, strategyId, priceMnt, txHash }),
    });
    const json = await res.json();
    return {
      success: json.success,
      message: json.message,
      data: json.data ? mapPurchase(json.data) : null,
    };
  } catch (error) {
    console.error("Failed to create purchase:", error);
    return { success: false, message: "Failed to create purchase", data: null };
  }
}
