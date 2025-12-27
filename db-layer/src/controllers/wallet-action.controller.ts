import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import {
  getRecentWalletActions,
  RecentWalletAction,
} from "../db/actions/wallet-action.actions";

export const fetchRecentWalletActions = async (c: Context<Env>) => {
  try {
    const userWallet = c.req.param("userWallet");

    // Validate input
    if (!userWallet || typeof userWallet !== "string") {
      return c.json(
        {
          success: false,
          message: "userWallet parameter is required and must be a string",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const actions = await getRecentWalletActions(database, userWallet, 3);

    return c.json(
      {
        success: true,
        message: "Recent wallet actions retrieved successfully",
        data: actions,
      },
      200,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return c.json(
      {
        success: false,
        message: errorMessage,
        data: null,
      },
      500,
    );
  }
};
