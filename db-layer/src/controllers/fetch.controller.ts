import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import {
  getDelegationsByWallet,
  DelegationWallet,
} from "../db/actions/delegation.actions";
import {
  getStrategiesByCreator,
  Strategy,
  StrategyDetailResponse,
} from "../db/actions/strategy.actions";
import { privateKeyToAccount } from "viem/accounts";

export interface DelegationWalletPublic {
  id: string;
  user: string;
  delegationWalletAddress: string;
  createdAt: string | null;
}

export const fetchDelegationWallets = async (c: Context<Env>) => {
  try {
    const wallet = c.req.param("wallet");

    if (!wallet || typeof wallet !== "string") {
      return c.json(
        {
          success: false,
          message: "wallet parameter is required and must be a string",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.HYPERDRIVE.connectionString);
    const delegations = await getDelegationsByWallet(database, wallet);

    // Convert private keys to public addresses
    const publicDelegations: DelegationWalletPublic[] = delegations.map(
      (delegation) => {
        const account = privateKeyToAccount(
          delegation.delegationWalletPk as `0x${string}`,
        );
        return {
          id: delegation.id,
          user: delegation.user,
          delegationWalletAddress: account.address,
          createdAt: delegation.createdAt,
        };
      },
    );

    return c.json(
      {
        success: true,
        message: "Delegation wallets retrieved successfully",
        data: publicDelegations,
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

export const fetchStrategies = async (c: Context<Env>) => {
  try {
    const creatorWallet = c.req.param("creatorWallet");

    // Validate input
    if (!creatorWallet || typeof creatorWallet !== "string") {
      return c.json(
        {
          success: false,
          message: "creatorWallet parameter is required and must be a string",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.HYPERDRIVE.connectionString);
    const strategies = await getStrategiesByCreator(database, creatorWallet);

    return c.json(
      {
        success: true,
        message: "Strategies retrieved successfully",
        data: strategies,
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

export const fetchStrategiesForUser = async (c: Context<Env>) => {
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

    const database = db(c.env.HYPERDRIVE.connectionString);
    const strategies = await getStrategiesForUser(database, userWallet);

    return c.json(
      {
        success: true,
        message: "User strategies retrieved successfully",
        data: strategies,
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

export const fetchStrategyDetailsById = async (c: Context<Env>) => {
  try {
    const strategyId = c.req.param("strategyId");
    const userWallet = c.req.header("X-User-Wallet");

    // Validate input
    if (!strategyId || typeof strategyId !== "string") {
      return c.json(
        {
          success: false,
          message: "strategyId parameter is required and must be a string",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.HYPERDRIVE.connectionString);
    const strategyDetails = await getStrategyDetailsById(
      database,
      strategyId,
      userWallet,
    );

    if (!strategyDetails) {
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
        message: "Strategy details retrieved successfully",
        data: strategyDetails,
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
