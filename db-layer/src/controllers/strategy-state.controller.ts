import { Context } from "hono";
import {
  Env,
  UpdateStrategyStateRequest,
  WalletActionData,
} from "../types";
import db from "../db";
import { validateStrategyExists, validateSubscriptionHasDelegation, createWalletActions } from "../db/actions";

export const updateStrategyStateHandler = async (c: Context<Env>) => {
  try {
    const body = (await c.req.json()) as UpdateStrategyStateRequest;

    if (!body.strategyId || typeof body.strategyId !== "string") {
      return c.json(
        {
          success: false,
          message: "strategyId field is required and must be a string",
          data: null,
        },
        400,
      );
    }

    if (
      !body.actions ||
      !Array.isArray(body.actions) ||
      body.actions.length === 0
    ) {
      return c.json(
        {
          success: false,
          message: "actions field is required and must be a non-empty array",
          data: null,
        },
        400,
      );
    }

    for (const action of body.actions) {
      if (!action.action || typeof action.action !== "string") {
        return c.json(
          {
            success: false,
            message: "Each action must have an action field (string)",
            data: null,
          },
          400,
        );
      }

      if (
        action.stateChange !== undefined &&
        typeof action.stateChange !== "string"
      ) {
        return c.json(
          {
            success: false,
            message: "stateChange field must be a string if provided",
            data: null,
          },
          400,
        );
      }
    }

    if (!body.userWallet || typeof body.userWallet !== "string") {
      return c.json(
        {
          success: false,
          message: "userWallet field is required and must be a string",
          data: null,
        },
        400,
      );
    }

    if (
      !body.delegationWalletId ||
      typeof body.delegationWalletId !== "string"
    ) {
      return c.json(
        {
          success: false,
          message: "delegationWalletId field is required and must be a string",
          data: null,
        },
        400,
      );
    }

    if (!body.subscriptionId || typeof body.subscriptionId !== "string") {
      return c.json(
        {
          success: false,
          message: "subscriptionId field is required and must be a string",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.HYPERDRIVE.connectionString);

    const result = await database.transaction(async (tx) => {
      await validateStrategyExists(tx, body.strategyId);
      await validateSubscriptionHasDelegation(tx, body.subscriptionId);
      const actions = await createWalletActions(
        tx,
        body.strategyId,
        body.userWallet,
        body.delegationWalletId,
        body.subscriptionId,
        body.actions,
      );
      return actions;
    });

    return c.json(
      {
        success: true,
        message: "Strategy state updated successfully",
        data: result,
      },
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
      },
      500,
    );
  }
};
