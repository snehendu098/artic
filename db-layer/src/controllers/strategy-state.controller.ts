import { Context } from "hono";
import { Env, UpdateStrategyStateRequest, WalletActionData, ApiResponse } from "../types";
import db from "../db";
import { validateStrategyExists, createWalletActions } from "../db/actions";

export const updateStrategyStateHandler = async (c: Context<Env>) => {
  try {
    const body = await c.req.json() as UpdateStrategyStateRequest;

    if (!body.strategyId || typeof body.strategyId !== "string") {
      return c.json(
        {
          success: false,
          message: "strategyId field is required and must be a string",
          data: null,
        } as ApiResponse,
        400
      );
    }

    if (!body.actions || !Array.isArray(body.actions) || body.actions.length === 0) {
      return c.json(
        {
          success: false,
          message: "actions field is required and must be a non-empty array",
          data: null,
        } as ApiResponse,
        400
      );
    }

    for (const action of body.actions) {
      if (!action.action || typeof action.action !== "string") {
        return c.json(
          {
            success: false,
            message: "Each action must have an action field (string)",
            data: null,
          } as ApiResponse,
          400
        );
      }

      if (!action.stateChange || typeof action.stateChange !== "string") {
        return c.json(
          {
            success: false,
            message: "Each action must have a stateChange field (string)",
            data: null,
          } as ApiResponse,
          400
        );
      }
    }

    const database = db(c.env.DATABASE_URL);

    const result = await database.transaction(async (tx) => {
      await validateStrategyExists(tx, body.strategyId);
      const actions = await createWalletActions(tx, body.strategyId, body.actions);
      return actions;
    });

    return c.json(
      {
        success: true,
        message: "Strategy state updated successfully",
        data: result,
      } as ApiResponse<WalletActionData[]>,
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
