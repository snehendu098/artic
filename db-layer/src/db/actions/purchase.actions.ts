import { strategyPurchases, strategies, users, creatorEarnings } from "../schema";
import { eq } from "drizzle-orm";

export interface StrategyPurchase {
  id: string;
  strategyId: string;
  buyerId: string;
  priceMnt: string;
  txHash: string;
  blockNumber: number | null;
  purchasedAt: Date | null;
}

export interface CreatePurchaseParams {
  strategyId: string;
  buyerId: string;
  priceMnt: string;
  txHash: string;
  blockNumber?: number;
}

export const createPurchase = async (
  database: any,
  params: CreatePurchaseParams
): Promise<StrategyPurchase> => {
  // Get strategy to find creator
  const strategy = await database
    .select()
    .from(strategies)
    .where(eq(strategies.id, params.strategyId))
    .limit(1);

  if (!strategy || strategy.length === 0) {
    throw new Error("Strategy not found");
  }

  // Create purchase record
  const inserted = await database
    .insert(strategyPurchases)
    .values({
      strategyId: params.strategyId,
      buyerId: params.buyerId,
      priceMnt: params.priceMnt,
      txHash: params.txHash,
      blockNumber: params.blockNumber,
    })
    .returning();

  const purchase = inserted[0];

  // Create creator earnings (95% of sale)
  const creatorAmount = (parseFloat(params.priceMnt) * 0.95).toString();
  await database.insert(creatorEarnings).values({
    creatorId: strategy[0].creatorId,
    purchaseId: purchase.id,
    amountMnt: creatorAmount,
  });

  return purchase;
};

export interface PurchaseWithDetails {
  id: string;
  strategyId: string;
  strategyName: string;
  priceMnt: string;
  txHash: string;
  purchasedAt: Date | null;
}

export const getPurchasesByWallet = async (
  database: any,
  userWallet: string
): Promise<PurchaseWithDetails[]> => {
  const user = await database
    .select()
    .from(users)
    .where(eq(users.wallet, userWallet))
    .limit(1);

  if (!user || user.length === 0) return [];

  const results = await database
    .select({
      id: strategyPurchases.id,
      strategyId: strategyPurchases.strategyId,
      strategyName: strategies.name,
      priceMnt: strategyPurchases.priceMnt,
      txHash: strategyPurchases.txHash,
      purchasedAt: strategyPurchases.purchasedAt,
    })
    .from(strategyPurchases)
    .innerJoin(strategies, eq(strategyPurchases.strategyId, strategies.id))
    .where(eq(strategyPurchases.buyerId, user[0].id));

  return results;
};

export const hasPurchasedStrategy = async (
  database: any,
  userWallet: string,
  strategyId: string
): Promise<boolean> => {
  const user = await database
    .select()
    .from(users)
    .where(eq(users.wallet, userWallet))
    .limit(1);

  if (!user || user.length === 0) return false;

  const purchase = await database
    .select()
    .from(strategyPurchases)
    .where(eq(strategyPurchases.buyerId, user[0].id))
    .where(eq(strategyPurchases.strategyId, strategyId))
    .limit(1);

  return purchase.length > 0;
};
