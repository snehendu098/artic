import { Context } from "hono";
import { Env, ApiResponse } from "../types";
import db from "../db";
import {
  getDelegationsByWallet,
  DelegationWallet,
} from "../db/actions/delegation.actions";
import {
  getStrategiesByCreator,
  getStrategiesForUser,
  Strategy,
  StrategyInfo,
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
        } as ApiResponse,
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const delegations = await getDelegationsByWallet(database, wallet);

    // Convert private keys to public addresses
    const publicDelegations: DelegationWalletPublic[] = delegations.map(
      (delegation) => {
        const account = privateKeyToAccount(delegation.delegationWalletPk as `0x${string}`);
        return {
          id: delegation.id,
          user: delegation.user,
          delegationWalletAddress: account.address,
          createdAt: delegation.createdAt,
        };
      }
    );

    return c.json(
      {
        success: true,
        message: "Delegation wallets retrieved successfully",
        data: publicDelegations,
      } as ApiResponse<DelegationWalletPublic[]>,
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
      } as ApiResponse,
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
        } as ApiResponse,
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const strategies = await getStrategiesByCreator(database, creatorWallet);

    return c.json(
      {
        success: true,
        message: "Strategies retrieved successfully",
        data: strategies,
      } as ApiResponse<Strategy[]>,
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
      } as ApiResponse,
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
        } as ApiResponse,
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const strategies = await getStrategiesForUser(database, userWallet);

    return c.json(
      {
        success: true,
        message: "User strategies retrieved successfully",
        data: strategies,
      } as ApiResponse<StrategyInfo[]>,
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
      } as ApiResponse,
      500,
    );
  }
};
