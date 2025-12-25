import { Context } from "hono";
import { Env, ApiResponse } from "../types";
import db from "../db";
import {
  getEarningsByWallet,
  getEarningsSummary,
  markEarningClaimed,
} from "../db/actions";

export const getEarningsHandler = async (c: Context<Env>) => {
  try {
    const wallet = c.req.param("wallet");

    if (!wallet) {
      return c.json({
        success: false,
        message: "wallet param required",
        data: null,
      } as ApiResponse, 400);
    }

    const database = db(c.env.DATABASE_URL);
    const earnings = await getEarningsByWallet(database, wallet);
    const summary = await getEarningsSummary(database, wallet);

    return c.json({
      success: true,
      message: "Earnings retrieved",
      data: { earnings, summary },
    } as ApiResponse, 200);
  } catch (error) {
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal error",
      data: null,
    } as ApiResponse, 500);
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
      } as ApiResponse, 400);
    }

    if (!body.claimTxHash) {
      return c.json({
        success: false,
        message: "claimTxHash required",
        data: null,
      } as ApiResponse, 400);
    }

    const database = db(c.env.DATABASE_URL);
    const earning = await markEarningClaimed(database, id, body.claimTxHash);

    if (!earning) {
      return c.json({
        success: false,
        message: "Earning not found",
        data: null,
      } as ApiResponse, 404);
    }

    return c.json({
      success: true,
      message: "Earning marked as claimed",
      data: earning,
    } as ApiResponse, 200);
  } catch (error) {
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal error",
      data: null,
    } as ApiResponse, 500);
  }
};
