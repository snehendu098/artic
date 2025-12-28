import { KVNamespace } from "@cloudflare/workers-types";

export type EventType =
  | "orchestrating"
  | "tools_selected"
  | "tool_call"
  | "tool_result"
  | "completed"
  | "error";

export interface EventData {
  tool?: string;
  tools?: string[];
  args?: Record<string, any>;
  result?: string;
  note?: string;
  error?: string;
}

export interface Event {
  id: string;
  type: EventType;
  timestamp: number;
  data: EventData;
}

export interface EventsState {
  status: "idle" | "running" | "completed" | "error";
  events: Event[];
}

export class EventLogger {
  constructor(
    private kv: KVNamespace,
    private subscriptionId: string,
    private delegationWalletId: string,
    private dbLayerUrl: string
  ) {}

  private get key() {
    return `events:${this.subscriptionId}`;
  }

  async emit(event: { type: EventType; data: EventData }) {
    const existing = await this.kv.get(this.key, "json") as EventsState | null;
    const data: EventsState = existing || { status: "running", events: [] };

    data.events.push({
      ...event,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    });

    await this.kv.put(this.key, JSON.stringify(data));
  }

  async setStatus(status: "running" | "completed" | "error") {
    const existing = await this.kv.get(this.key, "json") as EventsState | null;
    const data: EventsState = existing || { status: "idle", events: [] };
    data.status = status;
    await this.kv.put(this.key, JSON.stringify(data));
  }

  async flush() {
    const data = await this.kv.get(this.key, "json") as EventsState | null;

    console.log(`[${this.subscriptionId}] Flush called - events: ${data?.events?.length ?? 0}, delegationWalletId: ${this.delegationWalletId}`);

    if (!data?.events?.length) {
      console.log(`[${this.subscriptionId}] No events to flush`);
      await this.kv.delete(this.key);
      return;
    }

    // Only persist tool_result and error events
    const actions = data.events
      .filter((e) => e.type === "tool_result" || e.type === "error")
      .map((e) => ({
        subscriptionId: this.subscriptionId,
        delegationWalletId: this.delegationWalletId,
        actionType: "execution" as const,
        description: e.type === "error" ? e.data.error || "Unknown error" : e.data.result || "",
        note: e.data.note || "",
        status: e.type === "error" ? "failed" : "completed",
        createdAt: new Date(e.timestamp).toISOString(),
      }));

    console.log(`[${this.subscriptionId}] Actions after filter: ${actions.length}`);

    if (actions.length) {
      try {
        console.log(`[${this.subscriptionId}] Posting to /actions/batch:`, JSON.stringify(actions));
        await fetch(`${this.dbLayerUrl}/actions/batch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actions }),
        });
      } catch (e) {
        console.error("Failed to flush actions to db-layer:", e);
      }
    } else {
      console.log(`[${this.subscriptionId}] No tool_result or error events to save`);
    }

    // Clear KV
    await this.kv.delete(this.key);
  }
}
