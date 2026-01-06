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

interface ExecutionMetadata {
  subscriptionId: string;
  strategyId: string;
  strategyName: string;
  walletAddress: string;
  startedAt: string;
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
    strategyId,
    strategyName,
    walletAddress,
  } = (await c.req.json()) as {
    privateKey: string;
    strategy: string;
    subscriptionId: string;
    delegationWalletId: string;
    recentActions: RecentAction[];
    strategyId?: string;
    strategyName?: string;
    walletAddress?: string;
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

  // Store wallet-indexed execution metadata for terminal tracking
  if (walletAddress) {
    const metadata: ExecutionMetadata = {
      subscriptionId,
      strategyId: strategyId || "",
      strategyName: strategyName || "Unknown Strategy",
      walletAddress,
      startedAt: new Date().toISOString(),
    };
    await c.env.EVENTS.put(
      `execution:${walletAddress}`,
      JSON.stringify(metadata),
    );
  }

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
          // c.env.ACCOUNT_ID,
          // c.env.GATEWAY_NAME,
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

      // Clear wallet execution tracking
      if (walletAddress) {
        await c.env.EVENTS.delete(`execution:${walletAddress}`);
      }
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

// Get current execution for a wallet (for terminal monitoring)
app.get("/current-execution/:wallet", async (c) => {
  const wallet = c.req.param("wallet");
  const metadata = (await c.env.EVENTS.get(
    `execution:${wallet}`,
    "json",
  )) as ExecutionMetadata | null;

  if (!metadata) {
    return c.json({ executing: false, data: null });
  }

  // Also get the events for this execution
  const events = (await c.env.EVENTS.get(
    `events:${metadata.subscriptionId}`,
    "json",
  )) as EventsState | null;

  return c.json({
    executing: true,
    data: {
      ...metadata,
      status: events?.status || "running",
      events: events?.events || [],
    },
  });
});

export default app;
