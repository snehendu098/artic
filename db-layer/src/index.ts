import { Hono } from "hono";
import { Env } from "./types";
import { createDelegationWallet } from "./controllers/user.controller";
import { createStrategyHandler } from "./controllers/strategy.controller";
import { updateStrategyStateHandler } from "./controllers/strategy-state.controller";
import { fetchDelegationWallets, fetchStrategies, fetchStrategiesForUser } from "./controllers/fetch.controller";

const app = new Hono<Env>();

app.get("/", (c) => {
  console.log(c.env.DATABASE_URL);
  return c.text("Hello Hono!");
});

// User delegation endpoints
app.post("/users/delegation/create", createDelegationWallet);
app.post("/users/create-delegation", createDelegationWallet);
app.get("/users/delegations/:wallet", fetchDelegationWallets);

// Strategy endpoints
app.post("/strategies/create", createStrategyHandler);
app.post("/strategies/state-update", updateStrategyStateHandler);
app.get("/strategies/:creatorWallet", fetchStrategies);
app.get("/user/:userWallet/strategies", fetchStrategiesForUser);

export default app;
