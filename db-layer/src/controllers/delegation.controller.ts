import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import { getDelegationsByWallet, getDelegationById, getUserByWallet } from "../db/actions";
import { cached, CacheKeys, TTL } from "../utils/cache";
import { verifyMessage } from "viem";
import { decrypt } from "../utils/crypto";

export const getDelegationsHandler = async (c: Context<Env>) => {
  try {
    const wallet = c.req.param("wallet");

    if (!wallet) {
      return c.json({
        success: false,
        message: "wallet param required",
        data: null,
      }, 400);
    }

    const delegations = await cached(
      c.env.ARTIC,
      CacheKeys.delegations(wallet),
      TTL.DELEGATIONS,
      async () => {
        const database = db(c.env.DATABASE_URL);
        return getDelegationsByWallet(database, wallet);
      }
    );

    return c.json({
      success: true,
      message: "Delegations retrieved",
      data: delegations,
    }, 200);
  } catch (error) {
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal error",
      data: null,
    }, 500);
  }
};

interface RevealKeyRequest {
  wallet: string;
  signature: string;
}

export const revealPrivateKeyHandler = async (c: Context<Env>) => {
  try {
    const delegationId = c.req.param("id");
    const body = (await c.req.json()) as RevealKeyRequest;

    if (!delegationId) {
      return c.json({ success: false, message: "delegation id required", data: null }, 400);
    }

    if (!body.wallet || !body.signature) {
      return c.json({ success: false, message: "wallet and signature required", data: null }, 400);
    }

    // Verify signature
    const message = `View private key for delegation ${delegationId}`;
    try {
      const isValid = await verifyMessage({
        address: body.wallet as `0x${string}`,
        message,
        signature: body.signature as `0x${string}`,
      });

      if (!isValid) {
        return c.json({ success: false, message: "Invalid signature", data: null }, 401);
      }
    } catch {
      return c.json({ success: false, message: "Signature verification failed", data: null }, 401);
    }

    const database = db(c.env.DATABASE_URL);

    // Get user by wallet
    const user = await getUserByWallet(database, body.wallet);
    if (!user) {
      return c.json({ success: false, message: "User not found", data: null }, 404);
    }

    // Get delegation and verify ownership
    const delegation = await getDelegationById(database, delegationId);
    if (!delegation) {
      return c.json({ success: false, message: "Delegation wallet not found", data: null }, 404);
    }

    if (delegation.userId !== user.id) {
      return c.json({ success: false, message: "Not authorized", data: null }, 403);
    }

    // Decrypt private key
    const privateKey = await decrypt(delegation.encryptedPrivateKey, c.env.ENCRYPTION_KEY);

    return c.json({
      success: true,
      message: "Private key revealed",
      data: { privateKey },
    }, 200);
  } catch (error) {
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal error",
      data: null,
    }, 500);
  }
};
