import { Context } from "hono";
import { Env, ApiResponse } from "../types";
import db from "../db";
import { upsertUser, createDelegation, getUserByWallet } from "../db/actions";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { verifyMessage } from "viem";
import { encrypt } from "../utils/crypto";

interface CreateDelegationRequest {
  wallet: string;
  signature: string;
  name: string;
}

export const createDelegationWallet = async (c: Context<Env>) => {
  try {
    const body = (await c.req.json()) as CreateDelegationRequest;

    if (!body.wallet || typeof body.wallet !== "string") {
      return c.json(
        {
          success: false,
          message: "wallet field is required",
          data: null,
        } as ApiResponse,
        400,
      );
    }

    if (!body.signature || typeof body.signature !== "string") {
      return c.json(
        {
          success: false,
          message: "signature field is required",
          data: null,
        } as ApiResponse,
        400,
      );
    }

    if (!body.name || typeof body.name !== "string") {
      return c.json(
        {
          success: false,
          message: "name field is required",
          data: null,
        } as ApiResponse,
        400,
      );
    }

    // Verify signature
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
            message: "Invalid signature",
            data: null,
          } as ApiResponse,
          401,
        );
      }
    } catch {
      return c.json(
        {
          success: false,
          message: "Signature verification failed",
          data: null,
        } as ApiResponse,
        401,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    const encryptedPrivateKey = await encrypt(privateKey, c.env.ENCRYPTION_KEY);

    const result = await database.transaction(async (tx) => {
      // Upsert user
      const user = await upsertUser(tx, body.wallet);

      // Create delegation
      const delegation = await createDelegation(tx, {
        userId: user.id,
        name: body.name,
        address: account.address,
        encryptedPrivateKey,
      });

      return {
        userId: user.id,
        wallet: user.wallet,
        delegation: {
          id: delegation.id,
          name: delegation.name,
          address: delegation.address,
        },
      };
    });

    return c.json(
      {
        success: true,
        message: "Delegation wallet created",
        data: result,
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

export const getUser = async (c: Context<Env>) => {
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
    const user = await getUserByWallet(database, wallet);

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

    return c.json(
      {
        success: true,
        message: "User found",
        data: user,
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

export const upsertUserHandler = async (c: Context<Env>) => {
  try {
    const body = await c.req.json();

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

    const database = db(c.env.DATABASE_URL);
    const user = await upsertUser(database, body.wallet, body.username);

    return c.json(
      {
        success: true,
        message: "User upserted",
        data: user,
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
