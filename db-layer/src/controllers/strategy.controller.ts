import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import {
  createStrategy,
  getStrategiesByCreator,
  getPublicStrategies,
  getStrategyById,
  getStrategyDetails,
  updateStrategy,
  getUserByWallet,
  activateStrategy,
  publishStrategy,
  editStrategy,
} from "../db/actions";
import { cached, cacheDelete, CacheKeys, TTL } from "../utils/cache";

interface CreateStrategyRequest {
  wallet: string;
  name: string;
  strategyCode: string;
  isPublic?: boolean;
  priceMnt?: string;
  protocols?: string[];
  status?: "draft" | "active" | "paused";
  delegationWalletId?: string;
}

export const createStrategyHandler = async (c: Context<Env>) => {
  try {
    const body = (await c.req.json()) as CreateStrategyRequest;

    if (!body.wallet) {
      return c.json(
        {
          success: false,
          message: "wallet required",
          data: null,
        },
        400,
      );
    }

    if (!body.name) {
      return c.json(
        {
          success: false,
          message: "name required",
          data: null,
        },
        400,
      );
    }

    if (!body.strategyCode) {
      return c.json(
        {
          success: false,
          message: "strategyCode required",
          data: null,
        },
        400,
      );
    }

    if (body.status === "active" && !body.delegationWalletId) {
      return c.json(
        {
          success: false,
          message: "delegationWalletId required when status is active",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.HYPERDRIVE.connectionString);

    // Get user
    const user = await getUserByWallet(database, body.wallet);
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        404,
      );
    }

    const strategy = await createStrategy(database, {
      creatorId: user.id,
      name: body.name,
      strategyCode: body.strategyCode,
      isPublic: body.isPublic,
      priceMnt: body.priceMnt,
      protocols: body.protocols,
      status: body.status,
      delegationWalletId: body.delegationWalletId,
    });

    // Invalidate caches
    await cacheDelete(c.env.ARTIC, [
      CacheKeys.myStrategies(body.wallet),
      CacheKeys.marketplace(),
      CacheKeys.subscriptions(body.wallet),
      CacheKeys.botActive(),
    ]);

    return c.json(
      {
        success: true,
        message: "Strategy created",
        data: strategy,
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

export const getMyStrategies = async (c: Context<Env>) => {
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

    const strategies = await cached(
      c.env.ARTIC,
      CacheKeys.myStrategies(wallet),
      TTL.MY_STRATEGIES,
      async () => {
        const database = db(c.env.HYPERDRIVE.connectionString);
        return getStrategiesByCreator(database, wallet);
      }
    );

    return c.json(
      {
        success: true,
        message: "Strategies retrieved",
        data: strategies,
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

export const getMarketplaceStrategies = async (c: Context<Env>) => {
  try {
    const strategies = await cached(
      c.env.ARTIC,
      CacheKeys.marketplace(),
      TTL.MARKETPLACE,
      async () => {
        const database = db(c.env.HYPERDRIVE.connectionString);
        return getPublicStrategies(database);
      }
    );

    return c.json(
      {
        success: true,
        message: "Marketplace strategies retrieved",
        data: strategies,
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

export const getStrategyDetailsHandler = async (c: Context<Env>) => {
  try {
    const id = c.req.param("id");
    const userWallet = c.req.header("X-User-Wallet");

    if (!id) {
      return c.json(
        {
          success: false,
          message: "id param required",
          data: null,
        },
        400,
      );
    }

    // No caching - response is user-specific (isCreator, isOwned, isPurchased, subscription)
    const database = db(c.env.HYPERDRIVE.connectionString);
    const details = await getStrategyDetails(database, id, userWallet);

    if (!details) {
      return c.json(
        {
          success: false,
          message: "Strategy not found",
          data: null,
        },
        404,
      );
    }

    return c.json(
      {
        success: true,
        message: "Strategy details retrieved",
        data: details,
      },
      200,
    );
  } catch (error) {
    console.log(error);

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

export const updateStrategyHandler = async (c: Context<Env>) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    if (!id) {
      return c.json(
        {
          success: false,
          message: "id param required",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.HYPERDRIVE.connectionString);
    const strategy = await updateStrategy(database, id, body);

    if (!strategy) {
      return c.json(
        {
          success: false,
          message: "Strategy not found",
          data: null,
        },
        404,
      );
    }

    // Invalidate caches
    await cacheDelete(c.env.ARTIC, [CacheKeys.marketplace()]);

    return c.json(
      {
        success: true,
        message: "Strategy updated",
        data: strategy,
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

export const activateStrategyHandler = async (c: Context<Env>) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json() as { wallet: string; delegationWalletId: string };

    if (!id) {
      return c.json(
        { success: false, message: "id param required", data: null },
        400,
      );
    }

    if (!body.wallet) {
      return c.json(
        { success: false, message: "wallet required", data: null },
        400,
      );
    }

    if (!body.delegationWalletId) {
      return c.json(
        { success: false, message: "delegationWalletId required", data: null },
        400,
      );
    }

    const database = db(c.env.HYPERDRIVE.connectionString);

    const user = await getUserByWallet(database, body.wallet);
    if (!user) {
      return c.json(
        { success: false, message: "User not found", data: null },
        404,
      );
    }

    const strategy = await activateStrategy(database, id, user.id, body.delegationWalletId);

    if (!strategy) {
      return c.json(
        { success: false, message: "Strategy not found", data: null },
        404,
      );
    }

    // Invalidate caches
    await cacheDelete(c.env.ARTIC, [
      CacheKeys.subscriptions(body.wallet),
      CacheKeys.botActive(),
    ]);

    return c.json(
      { success: true, message: "Strategy activated", data: strategy },
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

export const publishStrategyHandler = async (c: Context<Env>) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json() as { wallet: string; priceMnt?: string };

    if (!id) {
      return c.json(
        { success: false, message: "id param required", data: null },
        400,
      );
    }

    if (!body.wallet) {
      return c.json(
        { success: false, message: "wallet required", data: null },
        400,
      );
    }

    const database = db(c.env.HYPERDRIVE.connectionString);

    // Verify user exists (authorization check could be added here)
    const user = await getUserByWallet(database, body.wallet);
    if (!user) {
      return c.json(
        { success: false, message: "User not found", data: null },
        404,
      );
    }

    const strategy = await publishStrategy(database, id, body.priceMnt);

    if (!strategy) {
      return c.json(
        { success: false, message: "Strategy not found", data: null },
        404,
      );
    }

    // Invalidate caches
    await cacheDelete(c.env.ARTIC, [CacheKeys.marketplace()]);

    return c.json(
      { success: true, message: "Strategy published", data: strategy },
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

interface EditStrategyRequest {
  wallet: string;
  name?: string;
  strategyCode?: string;
  protocols?: string[];
  priceMnt?: string;
}

export const editStrategyHandler = async (c: Context<Env>) => {
  try {
    const id = c.req.param("id");
    const body = (await c.req.json()) as EditStrategyRequest;

    if (!id) {
      return c.json(
        { success: false, message: "id param required", data: null },
        400,
      );
    }

    if (!body.wallet) {
      return c.json(
        { success: false, message: "wallet required", data: null },
        400,
      );
    }

    const database = db(c.env.HYPERDRIVE.connectionString);

    const user = await getUserByWallet(database, body.wallet);
    if (!user) {
      return c.json(
        { success: false, message: "User not found", data: null },
        404,
      );
    }

    const strategy = await editStrategy(database, id, user.id, {
      name: body.name,
      strategyCode: body.strategyCode,
      protocols: body.protocols,
      priceMnt: body.priceMnt,
    });

    // Invalidate caches
    await cacheDelete(c.env.ARTIC, [
      CacheKeys.marketplace(),
      CacheKeys.myStrategies(body.wallet),
    ]);

    return c.json(
      { success: true, message: "Strategy updated", data: strategy },
      200,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";

    if (message === "Strategy not found") {
      return c.json({ success: false, message, data: null }, 404);
    }
    if (message === "Forbidden: not the creator") {
      return c.json({ success: false, message, data: null }, 403);
    }
    if (message === "Cannot edit public strategy") {
      return c.json({ success: false, message, data: null }, 400);
    }
    if (message === "Strategy name already exists") {
      return c.json({ success: false, message, data: null }, 409);
    }

    return c.json({ success: false, message, data: null }, 500);
  }
};
