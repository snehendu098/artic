import { Context } from "hono";
import { Env } from "../types";
import db from "../db";
import {
  createSubscription,
  getSubscriptionsByWallet,
  pauseSubscription,
  activateSubscription,
  getActiveSubscriptionsForBot,
  getSubscribersForStrategy,
  getUserByWallet,
} from "../db/actions";

interface CreateSubscriptionRequest {
  wallet: string;
  strategyId: string;
  delegationWalletId: string;
}

export const createSubscriptionHandler = async (c: Context<Env>) => {
  try {
    const body = (await c.req.json()) as CreateSubscriptionRequest;

    if (!body.wallet || !body.strategyId || !body.delegationWalletId) {
      return c.json(
        {
          success: false,
          message: "wallet, strategyId, delegationWalletId required",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const user = await getUserByWallet(database, body.wallet);

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

    const subscription = await createSubscription(database, {
      strategyId: body.strategyId,
      userId: user.id,
      delegationWalletId: body.delegationWalletId,
    });

    return c.json(
      {
        success: true,
        message: "Subscription created",
        data: subscription,
      },
      201,
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

export const getSubscriptionsHandler = async (c: Context<Env>) => {
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

    const database = db(c.env.DATABASE_URL);
    const subscriptions = await getSubscriptionsByWallet(database, wallet);

    return c.json(
      {
        success: true,
        message: "Subscriptions retrieved",
        data: subscriptions,
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

export const pauseSubscriptionHandler = async (c: Context<Env>) => {
  try {
    const id = c.req.param("id");

    if (!id) {
      return c.json(
        {
          success: false,
          message: "id param required",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const subscription = await pauseSubscription(database, id);

    if (!subscription) {
      return c.json(
        {
          success: false,
          message: "Subscription not found",
          data: null,
        },
        404,
      );
    }

    return c.json(
      {
        success: true,
        message: "Subscription paused",
        data: subscription,
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

export const activateSubscriptionHandler = async (c: Context<Env>) => {
  try {
    const id = c.req.param("id");

    if (!id) {
      return c.json(
        {
          success: false,
          message: "id param required",
          data: null,
        },
        400,
      );
    }

    const database = db(c.env.DATABASE_URL);
    const subscription = await activateSubscription(database, id);

    if (!subscription) {
      return c.json(
        {
          success: false,
          message: "Subscription not found",
          data: null,
        },
        404,
      );
    }

    return c.json(
      {
        success: true,
        message: "Subscription activated",
        data: subscription,
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

export const getSubscribersHandler = async (c: Context<Env>) => {
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

    const database = db(c.env.DATABASE_URL);

    // Get user's strategies and their subscribers
    const { getStrategiesByCreator } = await import("../db/actions");
    const strategies = await getStrategiesByCreator(database, wallet);

    const allSubscribers = [];
    for (const strategy of strategies) {
      const subscribers = await getSubscribersForStrategy(
        database,
        strategy.id,
      );
      for (const sub of subscribers) {
        allSubscribers.push({
          ...sub,
          strategyId: strategy.id,
          strategyName: strategy.name,
        });
      }
    }

    return c.json(
      {
        success: true,
        message: "Subscribers retrieved",
        data: allSubscribers,
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

export const getActiveSubscriptionsForBotHandler = async (c: Context<Env>) => {
  try {
    const database = db(c.env.DATABASE_URL);
    const subscriptions = await getActiveSubscriptionsForBot(
      database,
      c.env.ENCRYPTION_KEY,
    );

    return c.json(
      {
        success: true,
        message: "Active subscriptions retrieved",
        data: subscriptions,
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
