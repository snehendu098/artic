import { Context } from "hono";
import { Env, CreateDelegationRequest, CreateDelegationData, ApiResponse } from "../types";
import db from "../db";
import { upsertUser, createDelegation } from "../db/actions";
import { randomUUID } from "crypto";
import { generatePrivateKey } from "viem/accounts";

export const createDelegationWallet = async (c: Context<Env>) => {
  try {
    const body = await c.req.json() as CreateDelegationRequest;

    // Validate input
    if (!body.wallet || typeof body.wallet !== "string") {
      return c.json(
        {
          success: false,
          message: "wallet field is required and must be a string",
          data: null,
        } as ApiResponse,
        400
      );
    }

    const database = db(c.env.DATABASE_URL);
    const userId = randomUUID();
    const delegationId = randomUUID();
    const delegationWalletPk = generatePrivateKey();

    const result = await database.transaction(async (tx) => {
      const user = await upsertUser(tx, userId, body.wallet);
      const delegation = await createDelegation(
        tx,
        delegationId,
        user.wallet,
        delegationWalletPk
      );

      return {
        userId: user.id,
        wallet: user.wallet,
        delegationId: delegation.delegationId,
        delegationWalletPk: delegation.delegationWalletPk,
      };
    });

    return c.json(
      {
        success: true,
        message: "Delegation wallet created successfully",
        data: result,
      } as ApiResponse<CreateDelegationData>,
      201
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
      500
    );
  }
};
