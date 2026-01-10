import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import {
  getEarningsByWallet,
  getEarningsSummary,
  markEarningClaimed,
} from "../db/actions";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { cached, cacheDelete, CacheKeys, TTL } from "../utils/cache";

export const getEarningsHandler = async (c: Context<Env>) => {
  try {
    const wallet = c.req.param("wallet");

    if (!wallet) {
      return c.json({
        success: false,
        message: "wallet param required",
        data: null,
      }, 400);
    }

    const data = await cached(
      c.env.ARTIC,
      CacheKeys.earnings(wallet),
      TTL.EARNINGS,
      async () => {
        const database = db(c.env.HYPERDRIVE.connectionString);
        const earnings = await getEarningsByWallet(database, wallet);
        const summary = await getEarningsSummary(database, wallet);
        return { earnings, summary };
      }
    );

    return c.json({
      success: true,
      message: "Earnings retrieved",
      data,
    }, 200);
  } catch (error) {
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal error",
      data: null,
    }, 500);
  }
};

interface ClaimEarningRequest {
  claimTxHash: string;
}

export const claimEarningHandler = async (c: Context<Env>) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json() as ClaimEarningRequest;

    if (!id) {
      return c.json({
        success: false,
        message: "id param required",
        data: null,
      }, 400);
    }

    if (!body.claimTxHash) {
      return c.json({
        success: false,
        message: "claimTxHash required",
        data: null,
      }, 400);
    }

    const database = db(c.env.HYPERDRIVE.connectionString);
    const earning = await markEarningClaimed(database, id, body.claimTxHash);

    if (!earning) {
      return c.json({
        success: false,
        message: "Earning not found",
        data: null,
      }, 404);
    }

    // Get creator wallet for cache invalidation
    const userResult = await database
      .select({ wallet: users.wallet })
      .from(users)
      .where(eq(users.id, earning.creatorId))
      .limit(1);
    if (userResult.length > 0) {
      await cacheDelete(c.env.ARTIC, [CacheKeys.earnings(userResult[0].wallet)]);
    }

    return c.json({
      success: true,
      message: "Earning marked as claimed",
      data: earning,
    }, 200);
  } catch (error) {
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal error",
      data: null,
    }, 500);
  }
};
