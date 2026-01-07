import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import {
  createWalletAction,
  createWalletActions,
  getActionsByWallet,
  getDelegationById,
} from "../db/actions";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { cached, cacheDelete, CacheKeys, TTL } from "../utils/cache";

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
  txHash?: string;
  blockNumber?: string;
  status?: "pending" | "completed" | "failed";
  createdAt?: string;
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

    // Get user wallet for cache invalidation
    const delegation = await getDelegationById(database, body.delegationWalletId);
    if (delegation) {
      const userResult = await database
        .select({ wallet: users.wallet })
        .from(users)
        .where(eq(users.id, delegation.userId))
        .limit(1);
      if (userResult.length > 0) {
        await cacheDelete(c.env.ARTIC, [CacheKeys.actions(userResult[0].wallet)]);
      }
    }

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
        400
      );
    }

    const actions = await cached(
      c.env.ARTIC,
      CacheKeys.actions(wallet, limit),
      TTL.ACTIONS,
      async () => {
        const database = db(c.env.DATABASE_URL);
        return getActionsByWallet(database, wallet, limit);
      }
    );

    return c.json(
      {
        success: true,
        message: "Actions retrieved",
        data: actions,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal error",
        data: null,
      },
      500
    );
  }
};

export const createBatchActionsHandler = async (c: Context<Env>) => {
  try {
    const { actions } = (await c.req.json()) as {
      actions: CreateActionRequest[];
    };

    if (!actions?.length) {
      return c.json(
        {
          success: false,
          message: "actions array required",
          data: null,
        },
        400
      );
    }

    const database = db(c.env.DATABASE_URL);
    const results = await createWalletActions(database, actions);

    // Get unique delegation wallet IDs and invalidate caches
    const delegationIds = [...new Set(actions.map((a) => a.delegationWalletId))];
    const walletsToInvalidate = new Set<string>();

    for (const delegationId of delegationIds) {
      const delegation = await getDelegationById(database, delegationId);
      if (delegation) {
        const userResult = await database
          .select({ wallet: users.wallet })
          .from(users)
          .where(eq(users.id, delegation.userId))
          .limit(1);
        if (userResult.length > 0) {
          walletsToInvalidate.add(userResult[0].wallet);
        }
      }
    }

    if (walletsToInvalidate.size > 0) {
      const keysToInvalidate = Array.from(walletsToInvalidate).map((w) =>
        CacheKeys.actions(w)
      );
      await cacheDelete(c.env.ARTIC, keysToInvalidate);
    }

    return c.json(
      {
        success: true,
        message: `${results.length} action(s) created`,
        data: results,
      },
      201
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal error",
        data: null,
      },
      500
    );
  }
};
