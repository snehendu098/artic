import { Hono } from "hono";
import { generatePrivateKey } from "viem/accounts";
import { Agent } from "./agent";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/send", async (c) => {
  const { strategy, actions, userWallet } = await c.req.json();

  const generate = generatePrivateKey();

  const agent = new Agent(generate, "gemini");
  await agent.execute(strategy, actions);
});

export default app;
