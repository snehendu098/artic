import { creatorEarnings, strategyPurchases, strategies, users } from "../schema";
import { eq, sum } from "drizzle-orm";

export interface CreatorEarning {
  id: string;
  creatorId: string;
  purchaseId: string;
  amountMnt: string;
  claimed: boolean;
  claimTxHash: string | null;
  createdAt: Date | null;
}

export interface EarningWithDetails {
  id: string;
  strategyName: string;
  buyerWallet: string;
  amountMnt: string;
  claimed: boolean;
  createdAt: Date | null;
}

export const getEarningsByWallet = async (
  database: any,
  userWallet: string
): Promise<EarningWithDetails[]> => {
  const user = await database
    .select()
    .from(users)
    .where(eq(users.wallet, userWallet))
    .limit(1);

  if (!user || user.length === 0) return [];

  const results = await database
    .select({
      id: creatorEarnings.id,
      strategyName: strategies.name,
      buyerWallet: users.wallet,
      amountMnt: creatorEarnings.amountMnt,
      claimed: creatorEarnings.claimed,
      createdAt: creatorEarnings.createdAt,
    })
    .from(creatorEarnings)
    .innerJoin(strategyPurchases, eq(creatorEarnings.purchaseId, strategyPurchases.id))
    .innerJoin(strategies, eq(strategyPurchases.strategyId, strategies.id))
    .innerJoin(users, eq(strategyPurchases.buyerId, users.id))
    .where(eq(creatorEarnings.creatorId, user[0].id));

  return results;
};

export interface EarningsSummary {
  totalEarned: string;
  totalClaimed: string;
  totalUnclaimed: string;
}

export const getEarningsSummary = async (
  database: any,
  userWallet: string
): Promise<EarningsSummary> => {
  const user = await database
    .select()
    .from(users)
    .where(eq(users.wallet, userWallet))
    .limit(1);

  if (!user || user.length === 0) {
    return { totalEarned: "0", totalClaimed: "0", totalUnclaimed: "0" };
  }

  const earnings = await database
    .select()
    .from(creatorEarnings)
    .where(eq(creatorEarnings.creatorId, user[0].id));

  let totalEarned = 0;
  let totalClaimed = 0;

  for (const e of earnings) {
    const amount = parseFloat(e.amountMnt);
    totalEarned += amount;
    if (e.claimed) totalClaimed += amount;
  }

  return {
    totalEarned: totalEarned.toString(),
    totalClaimed: totalClaimed.toString(),
    totalUnclaimed: (totalEarned - totalClaimed).toString(),
  };
};

export const markEarningClaimed = async (
  database: any,
  earningId: string,
  claimTxHash: string
): Promise<CreatorEarning | null> => {
  const result = await database
    .update(creatorEarnings)
    .set({ claimed: true, claimTxHash })
    .where(eq(creatorEarnings.id, earningId))
    .returning();

  return result.length > 0 ? result[0] : null;
};
