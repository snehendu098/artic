import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import { upsertUser, createDelegation, getUserByWallet } from "../db/actions";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { verifyMessage } from "viem";
import { encrypt } from "../utils/crypto";
import { cached, cacheDelete, CacheKeys, TTL } from "../utils/cache";

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
        },
        400,
      );
    }

    if (!body.signature || typeof body.signature !== "string") {
      return c.json(
        {
          success: false,
          message: "signature field is required",
          data: null,
        },
        400,
      );
    }

    if (!body.name || typeof body.name !== "string") {
      return c.json(
        {
          success: false,
          message: "name field is required",
          data: null,
        },
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
          },
          401,
        );
      }
    } catch {
      return c.json(
        {
          success: false,
          message: "Signature verification failed",
          data: null,
        },
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

    // Invalidate caches
    await cacheDelete(c.env.ARTIC, [
      CacheKeys.user(body.wallet),
      CacheKeys.delegations(body.wallet),
    ]);

    return c.json(
      {
        success: true,
        message: "Delegation wallet created",
        data: result,
      },
      201,
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

export const getUser = async (c: Context<Env>) => {
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

    const user = await cached(
      c.env.ARTIC,
      CacheKeys.user(wallet),
      TTL.USER,
      async () => {
        const database = db(c.env.DATABASE_URL);
        return getUserByWallet(database, wallet);
      }
    );

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
      },
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
        },
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const user = await upsertUser(database, body.wallet, body.username);

    // Invalidate cache
    await cacheDelete(c.env.ARTIC, [CacheKeys.user(body.wallet)]);

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
      },
      500,
    );
  }
};
