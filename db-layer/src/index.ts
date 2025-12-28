import { Hono } from "hono";
import { Env } from "./types";
import { requireApiKey } from "./middleware/auth.middleware";

// Controllers
import { createDelegationWallet, getUser, upsertUserHandler } from "./controllers/user.controller";
import { getDelegationsHandler } from "./controllers/delegation.controller";
import {
  createStrategyHandler,
  getMyStrategies,
  getMarketplaceStrategies,
  getStrategyDetailsHandler,
  updateStrategyHandler,
  activateStrategyHandler,
  publishStrategyHandler,
  editStrategyHandler,
} from "./controllers/strategy.controller";
import {
  createSubscriptionHandler,
  getSubscriptionsHandler,
  pauseSubscriptionHandler,
  activateSubscriptionHandler,
  getSubscribersHandler,
  getActiveSubscriptionsForBotHandler,
} from "./controllers/subscription.controller";
import { createPurchaseHandler, getPurchasesHandler } from "./controllers/purchase.controller";
import { getEarningsHandler, claimEarningHandler } from "./controllers/earnings.controller";
import { createActionHandler, getActionsHandler, createBatchActionsHandler } from "./controllers/action.controller";

const app = new Hono<Env>();

app.get("/", (c) => c.text("Artic Protocol API"));

// ============================================
// USER ROUTES
// ============================================
app.post("/users", upsertUserHandler);
app.get("/users/:wallet", getUser);

// ============================================
// DELEGATION ROUTES
// ============================================
app.post("/delegations", createDelegationWallet);
app.get("/delegations/:wallet", getDelegationsHandler);

// ============================================
// STRATEGY ROUTES
// ============================================
app.post("/strategies", createStrategyHandler);
app.get("/strategies", getMarketplaceStrategies);
app.get("/strategies/mine/:wallet", getMyStrategies);
app.get("/strategies/:id", getStrategyDetailsHandler);
app.patch("/strategies/:id", updateStrategyHandler);
app.patch("/strategies/:id/edit", editStrategyHandler);
app.patch("/strategies/:id/activate", activateStrategyHandler);
app.patch("/strategies/:id/publish", publishStrategyHandler);

// ============================================
// PURCHASE ROUTES
// ============================================
app.post("/purchases", createPurchaseHandler);
app.get("/purchases/:wallet", getPurchasesHandler);

// ============================================
// SUBSCRIPTION ROUTES
// ============================================
app.post("/subscriptions", createSubscriptionHandler);
app.get("/subscriptions/:wallet", getSubscriptionsHandler);
app.patch("/subscriptions/:id/pause", pauseSubscriptionHandler);
app.patch("/subscriptions/:id/activate", activateSubscriptionHandler);

// ============================================
// SUBSCRIBER ROUTES (people subscribed to user's strategies)
// ============================================
app.get("/subscribers/:wallet", getSubscribersHandler);

// ============================================
// ACTION ROUTES
// ============================================
app.post("/actions", createActionHandler);
app.post("/actions/batch", createBatchActionsHandler);
app.get("/actions/:wallet", getActionsHandler);

// ============================================
// EARNINGS ROUTES
// ============================================
app.get("/earnings/:wallet", getEarningsHandler);
app.patch("/earnings/:id/claim", claimEarningHandler);

// ============================================
// BOT ROUTES (protected)
// ============================================
app.get("/bot/active-subscriptions", requireApiKey, getActiveSubscriptionsForBotHandler);

export default app;
