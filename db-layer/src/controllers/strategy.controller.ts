import { Context } from "hono";
import { Env, CreateStrategyRequest, CreateStrategyData, ApiResponse } from "../types";
import db from "../db";
import { createStrategy } from "../db/actions";
import { randomUUID } from "crypto";

export const createStrategyHandler = async (c: Context<Env>) => {
  try {
    const body = await c.req.json() as CreateStrategyRequest;

    if (!body.strategy || typeof body.strategy !== "string") {
      return c.json(
        {
          success: false,
          message: "strategy field is required and must be a string",
          data: null,
        } as ApiResponse,
        400
      );
    }

    if (!body.creatorWallet || typeof body.creatorWallet !== "string") {
      return c.json(
        {
          success: false,
          message: "creatorWallet field is required and must be a string",
          data: null,
        } as ApiResponse,
        400
      );
    }

    const isActive = body.activate === true;

    if (isActive && !body.delegationWallet) {
      return c.json(
        {
          success: false,
          message: "delegationWallet is required when activate is true",
          data: null,
        } as ApiResponse,
        400
      );
    }

    const database = db(c.env.DATABASE_URL);
    const strategyId = randomUUID();

    const result = await database.transaction(async (tx) => {
      const strategy = await createStrategy(
        tx,
        strategyId,
        body.strategy,
        body.creatorWallet,
        body.delegationWallet || null,
        isActive
      );

      return strategy;
    });

    return c.json(
      {
        success: true,
        message: "Strategy created successfully",
        data: result,
      } as ApiResponse<CreateStrategyData>,
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
