import { Hono } from "hono";
import { Agent } from "./agent";
import { EventLogger, EventsState } from "./helpers/EventLogger";
import { formatActions, RecentAction } from "./helpers/formatActions";
import { KVNamespace } from "@cloudflare/workers-types";

interface Env {
  EVENTS: KVNamespace;
  GROQ_API_KEY: string;
  DB_LAYER_URL: string;
  GATEWAY_NAME: string;
  ACCOUNT_ID: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.text("Artic Agent Executor");
});

app.post("/send", async (c) => {
  const {
    privateKey,
    strategy,
    subscriptionId,
    delegationWalletId,
    recentActions,
  } = (await c.req.json()) as {
    privateKey: string;
    strategy: string;
    subscriptionId: string;
    delegationWalletId: string;
    recentActions: RecentAction[];
  };

  // Check if subscription is already running
  const existing = (await c.env.EVENTS.get(
    `events:${subscriptionId}`,
    "json",
  )) as EventsState | null;

  if (existing?.status === "running") {
    return c.json(
      { success: false, message: "Subscription already executing" },
      409,
    );
  }

  // Mark as running immediately to prevent race conditions
  await c.env.EVENTS.put(
    `events:${subscriptionId}`,
    JSON.stringify({ status: "running", events: [] }),
  );

  // Fire and forget - execute in background
  c.executionCtx.waitUntil(
    (async () => {
      const eventLogger = new EventLogger(
        c.env.EVENTS,
        subscriptionId,
        delegationWalletId,
        c.env.DB_LAYER_URL,
      );

      try {
        const agent = new Agent(
          privateKey as `0x${string}`,
          c.env.GROQ_API_KEY,
          eventLogger,
          c.env.ACCOUNT_ID,
          c.env.GATEWAY_NAME,
        );
        await agent.execute(strategy, formatActions(recentActions));
        await eventLogger.setStatus("completed");
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "Unknown error occurred";
        await eventLogger.emit({
          type: "error",
          data: { error: errorMessage, note: "Strategy execution failed" },
        });
        await eventLogger.setStatus("error");
      }

      await eventLogger.flush();
    })(),
  );

  return c.json({ success: true, message: "Execution started" });
});

app.get("/events/:subscriptionId", async (c) => {
  const subscriptionId = c.req.param("subscriptionId");
  const data = (await c.env.EVENTS.get(
    `events:${subscriptionId}`,
    "json",
  )) as EventsState | null;

  return c.json(data || { events: [], status: "idle" });
});

export default app;
