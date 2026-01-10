import { Hono } from "hono";
import { cors } from "hono/cors";
import { EventsState } from "./helpers/EventLogger";
import { RecentAction } from "./helpers/formatActions";
import { KVNamespace, DurableObjectNamespace } from "@cloudflare/workers-types";
import { buildProtocolsList } from "./helpers/listProtocols";
import { AgentExecutorDO, ExecuteRequest } from "./durable-objects/AgentExecutorDO";

interface Env {
  EVENTS: KVNamespace;
  GROQ_API_KEY: string;
  DB_LAYER_URL: string;
  GATEWAY_NAME: string;
  ACCOUNT_ID: string;
  AGENT_EXECUTOR: DurableObjectNamespace<AgentExecutorDO>;
}

interface ExecutionMetadata {
  subscriptionId: string;
  strategyId: string;
  strategyName: string;
  walletAddress: string;
  startedAt: string;
}

const app = new Hono<{ Bindings: Env }>();
app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Artic Agent Executor");
});

app.post("/send", async (c) => {
  const body = (await c.req.json()) as {
    privateKey: string;
    strategy: string;
    subscriptionId: string;
    delegationWalletId: string;
    recentActions: RecentAction[];
    strategyId?: string;
    strategyName?: string;
    walletAddress?: string;
  };

  const { subscriptionId, strategyId, strategyName, walletAddress } = body;

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

  // Use Durable Object for long-running execution (no IoContext timeout)
  const id = c.env.AGENT_EXECUTOR.idFromName(subscriptionId);
  const stub = c.env.AGENT_EXECUTOR.get(id);
  const result = await stub.execute(body as ExecuteRequest);

  return c.json(result);
});

// Batch endpoint must come before :subscriptionId to avoid matching "batch" as param
app.get("/events/batch", async (c) => {
  const idsParam = c.req.query("subscriptionIds") || "";
  const ids = idsParam.split(",").filter(Boolean);

  if (!ids.length) {
    return c.json({ events: [] });
  }

  const results = await Promise.all(
    ids.map(async (id) => {
      const data = (await c.env.EVENTS.get(
        `events:${id}`,
        "json",
      )) as EventsState | null;
      return data ? { subscriptionId: id, ...data } : null;
    }),
  );

  return c.json({
    events: results.filter((r): r is NonNullable<typeof r> => r !== null),
  });
});

app.get("/events/:subscriptionId", async (c) => {
  const subscriptionId = c.req.param("subscriptionId");
  const data = (await c.env.EVENTS.get(
    `events:${subscriptionId}`,
    "json",
  )) as EventsState | null;

  return c.json(data || { events: [], status: "idle" });
});

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

app.get("/protocols/list", async (c) => {
  try {
    const protocols = buildProtocolsList();
    const toolCount = protocols.reduce((sum, p) => sum + p.tools.length, 0);

    return c.json({
      success: true,
      data: {
        protocolCount: protocols.length,
        toolCount,
        protocols,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to list protocols";

    return c.json(
      {
        success: false,
        error: errorMessage,
      },
      500,
    );
  }
});

export default app;
export { AgentExecutorDO } from "./durable-objects/AgentExecutorDO";
