import { Context } from "hono";
import { Env, ApiResponse } from "../types";
import db from "../db";
import { getDelegationsByWallet } from "../db/actions";

export const getDelegationsHandler = async (c: Context<Env>) => {
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
    const delegations = await getDelegationsByWallet(database, wallet);

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
    } as ApiResponse, 500);
  }
};
