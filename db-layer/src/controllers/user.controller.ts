import { Context } from "hono";
import {
  Env,
  CreateDelegationRequest,
  CreateDelegationData,
  ApiResponse,
} from "../types";
import db from "../db";
import { upsertUser, createDelegation } from "../db/actions";
import { randomUUID } from "crypto";
import { generatePrivateKey } from "viem/accounts";
import { verifyMessage } from "viem";

interface CreateDelegationWithSignatureRequest {
  wallet: string;
  signature: string;
}

export const createDelegationWallet = async (c: Context<Env>) => {
  try {
    const body = (await c.req.json()) as CreateDelegationWithSignatureRequest;

    // Validate input
    if (!body.wallet || typeof body.wallet !== "string") {
      return c.json(
        {
          success: false,
          message: "wallet field is required and must be a string",
          data: null,
        } as ApiResponse,
        400,
      );
    }

    if (!body.signature || typeof body.signature !== "string") {
      return c.json(
        {
          success: false,
          message: "signature field is required and must be a string",
          data: null,
        } as ApiResponse,
        400,
      );
    }

    // Verify the signature
    const message = `Create delegation wallet for ${body.wallet}`;
    try {
      const isValid = await verifyMessage({
        address: body.wallet as `0x${string}`,
        message,
        signature: body.signature as `0x${string}`,
      });

      if (!isValid) {
        return c.json(
          {
            success: false,
            message:
              "Signature verification failed. Signature must be from the wallet owner.",
            data: null,
          } as ApiResponse,
          401,
        );
      }
    } catch (error) {
      console.error("Signature verification error:", error);
      return c.json(
        {
          success: false,
          message: "Invalid signature format or verification failed",
          data: null,
        } as ApiResponse,
        401,
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
        delegationWalletPk,
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
      201,
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
