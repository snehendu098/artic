import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import {
  createPurchase,
  getPurchasesByWallet,
  hasPurchasedStrategy,
  upsertUser,
  getStrategyById,
} from "../db/actions";
import { cached, cacheDelete, CacheKeys, TTL } from "../utils/cache";

interface CreatePurchaseRequest {
  wallet: string;
  strategyId: string;
  priceMnt: string;
  txHash: string;
  blockNumber?: number;
}

export const createPurchaseHandler = async (c: Context<Env>) => {
  try {
    const body = (await c.req.json()) as CreatePurchaseRequest;

    if (!body.wallet || !body.strategyId || !body.priceMnt || !body.txHash) {
      return c.json(
        {
          success: false,
          message: "wallet, strategyId, priceMnt, txHash required",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.HYPERDRIVE.connectionString);
    const user = await upsertUser(database, body.wallet);

    const purchase = await createPurchase(database, {
      strategyId: body.strategyId,
      buyerId: user.id,
      priceMnt: body.priceMnt,
      txHash: body.txHash,
      blockNumber: body.blockNumber,
    });

    // Get strategy creator for cache invalidation
    const strategy = await getStrategyById(database, body.strategyId);
    const creatorWallet = strategy?.creatorWallet;

    // Invalidate caches
    const keysToInvalidate = [
      CacheKeys.purchases(body.wallet),
      CacheKeys.user(body.wallet),
    ];
    if (creatorWallet) {
      keysToInvalidate.push(CacheKeys.earnings(creatorWallet));
    }
    await cacheDelete(c.env.ARTIC, keysToInvalidate);

    return c.json(
      {
        success: true,
        message: "Purchase recorded",
        data: purchase,
      },
      201,
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal error",
        data: null,
      },
      500,
    );
  }
};

export const getPurchasesHandler = async (c: Context<Env>) => {
  try {
    const wallet = c.req.param("wallet");

    if (!wallet) {
      return c.json(
        {
          success: false,
          message: "wallet param required",
          data: null,
        },
        400,
      );
    }

    const purchases = await cached(
      c.env.ARTIC,
      CacheKeys.purchases(wallet),
      TTL.PURCHASES,
      async () => {
        const database = db(c.env.HYPERDRIVE.connectionString);
        return getPurchasesByWallet(database, wallet);
      }
    );

    return c.json(
      {
        success: true,
        message: "Purchases retrieved",
        data: purchases,
      },
      200,
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal error",
        data: null,
      },
      500,
    );
  }
};
