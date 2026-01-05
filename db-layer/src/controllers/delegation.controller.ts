import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import { getDelegationsByWallet } from "../db/actions";
import { cached, CacheKeys, TTL } from "../utils/cache";

export const getDelegationsHandler = async (c: Context<Env>) => {
  try {
    const wallet = c.req.param("wallet");

    if (!wallet) {
      return c.json({
        success: false,
        message: "wallet param required",
        data: null,
      }, 400);
    }

    const delegations = await cached(
      c.env.ARTIC,
      CacheKeys.delegations(wallet),
      TTL.DELEGATIONS,
      async () => {
        const database = db(c.env.DATABASE_URL);
        return getDelegationsByWallet(database, wallet);
      }
    );

    return c.json({
      success: true,
      message: "Delegations retrieved",
      data: delegations,
    }, 200);
  } catch (error) {
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal error",
      data: null,
    }, 500);
  }
};
