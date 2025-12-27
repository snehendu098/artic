import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import { createWalletAction, getActionsByWallet } from "../db/actions";

interface CreateActionRequest {
  subscriptionId?: string;
  delegationWalletId: string;
  actionType:
    | "execution"
    | "deposit"
    | "withdrawal"
    | "subscription"
    | "strategy_created";
  description: string;
  note?: string;
  status?: "pending" | "completed" | "failed";
}

export const createActionHandler = async (c: Context<Env>) => {
  try {
    const body = (await c.req.json()) as CreateActionRequest;

    if (!body.delegationWalletId || !body.actionType || !body.description) {
      return c.json(
        {
          success: false,
          message: "delegationWalletId, actionType, description required",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const action = await createWalletAction(database, body);

    return c.json(
      {
        success: true,
        message: "Action created",
        data: action,
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

export const getActionsHandler = async (c: Context<Env>) => {
  try {
    const wallet = c.req.param("wallet");
    const limit = parseInt(c.req.query("limit") || "20");

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

    const database = db(c.env.DATABASE_URL);
    const actions = await getActionsByWallet(database, wallet, limit);

    return c.json(
      {
        success: true,
        message: "Actions retrieved",
        data: actions,
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
