import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import { getActiveSubscriptionsForBot } from "../db/actions/subscription.actions";

export const fetchActiveSubscriptionsHandler = async (c: Context<Env>) => {
  try {
    const database = db(c.env.DATABASE_URL);

    const activeSubscriptions = await getActiveSubscriptionsForBot(
      database,
      c.env.ENCRYPTION_KEY,
    );

    return c.json(
      {
        success: true,
        message: `Retrieved ${activeSubscriptions.length} active subscription(s)`,
        data: activeSubscriptions,
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
