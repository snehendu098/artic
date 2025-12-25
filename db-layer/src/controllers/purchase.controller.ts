import { Context } from "hono";
import { Env, ApiResponse } from "../types";
import db from "../db";
import {
  createPurchase,
  getPurchasesByWallet,
  hasPurchasedStrategy,
  upsertUser,
} from "../db/actions";

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
        } as ApiResponse,
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const user = await upsertUser(database, body.wallet);

    const purchase = await createPurchase(database, {
      strategyId: body.strategyId,
      buyerId: user.id,
      priceMnt: body.priceMnt,
      txHash: body.txHash,
      blockNumber: body.blockNumber,
    });

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
      } as ApiResponse,
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
        } as ApiResponse,
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const purchases = await getPurchasesByWallet(database, wallet);

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
      } as ApiResponse,
      500,
    );
  }
};
