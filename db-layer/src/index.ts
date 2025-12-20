import { Hono } from "hono";
import { Env } from "./types";
import { createDelegationWallet } from "./controllers/user.controller";
import { createStrategyHandler } from "./controllers/strategy.controller";
import { updateStrategyStateHandler } from "./controllers/strategy-state.controller";

const app = new Hono<Env>();

app.get("/", (c) => {
  console.log(c.env.DATABASE_URL);
  return c.text("Hello Hono!");
});

app.post("/users/delegation/create", createDelegationWallet);
app.post("/strategies/create", createStrategyHandler);
app.post("/strategies/state-update", updateStrategyStateHandler);

export default app;
