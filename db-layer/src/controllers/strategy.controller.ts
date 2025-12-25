import { Context } from "hono";
import { Env, ApiResponse } from "../types";
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
} from "../db/actions";

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
        } as ApiResponse,
        400,
      );
    }

    if (!body.name) {
      return c.json(
        {
          success: false,
          message: "name required",
          data: null,
        } as ApiResponse,
        400,
      );
    }

    if (!body.strategyCode) {
      return c.json(
        {
          success: false,
          message: "strategyCode required",
          data: null,
        } as ApiResponse,
        400,
      );
    }

    if (body.status === "active" && !body.delegationWalletId) {
      return c.json(
        {
          success: false,
          message: "delegationWalletId required when status is active",
          data: null,
        } as ApiResponse,
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);

    // Get user
    const user = await getUserByWallet(database, body.wallet);
    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
          data: null,
        } as ApiResponse,
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
      } as ApiResponse,
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
        } as ApiResponse,
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const strategies = await getStrategiesByCreator(database, wallet);

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
      } as ApiResponse,
      500,
    );
  }
};

export const getMarketplaceStrategies = async (c: Context<Env>) => {
  try {
    const database = db(c.env.DATABASE_URL);
    const strategies = await getPublicStrategies(database);

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
      } as ApiResponse,
      500,
    );
  }
};

// UUID validation regex

export const getStrategyDetailsHandler = async (c: Context<Env>) => {
  try {
    console.log("1");

    const id = c.req.param("id");
    const userWallet = c.req.header("X-User-Wallet");

    console.log("2", id, userWallet);

    if (!id) {
      return c.json(
        {
          success: false,
          message: "id param required",
          data: null,
        } as ApiResponse,
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);

    console.log("3");

    const details = await getStrategyDetails(database, id, userWallet);

    console.log(details);

    if (!details) {
      return c.json(
        {
          success: false,
          message: "Strategy not found",
          data: null,
        } as ApiResponse,
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
      } as ApiResponse,
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
        } as ApiResponse,
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
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
      } as ApiResponse,
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
        { success: false, message: "id param required", data: null } as ApiResponse,
        400,
      );
    }

    if (!body.wallet) {
      return c.json(
        { success: false, message: "wallet required", data: null } as ApiResponse,
        400,
      );
    }

    if (!body.delegationWalletId) {
      return c.json(
        { success: false, message: "delegationWalletId required", data: null } as ApiResponse,
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);

    const user = await getUserByWallet(database, body.wallet);
    if (!user) {
      return c.json(
        { success: false, message: "User not found", data: null } as ApiResponse,
        404,
      );
    }

    const strategy = await activateStrategy(database, id, user.id, body.delegationWalletId);

    if (!strategy) {
      return c.json(
        { success: false, message: "Strategy not found", data: null } as ApiResponse,
        404,
      );
    }

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
      } as ApiResponse,
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
        { success: false, message: "id param required", data: null } as ApiResponse,
        400,
      );
    }

    if (!body.wallet) {
      return c.json(
        { success: false, message: "wallet required", data: null } as ApiResponse,
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);

    // Verify user exists (authorization check could be added here)
    const user = await getUserByWallet(database, body.wallet);
    if (!user) {
      return c.json(
        { success: false, message: "User not found", data: null } as ApiResponse,
        404,
      );
    }

    const strategy = await publishStrategy(database, id, body.priceMnt);

    if (!strategy) {
      return c.json(
        { success: false, message: "Strategy not found", data: null } as ApiResponse,
        404,
      );
    }

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
      } as ApiResponse,
      500,
    );
  }
};
