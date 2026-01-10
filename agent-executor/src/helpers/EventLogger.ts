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
  txHash?: string;
  blockNumber?: string;
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

  private mapEventTypeToActionType(type: EventType): string {
    switch (type) {
      case "orchestrating": return "orchestration";
      case "tools_selected": return "tool_selection";
      case "tool_call": return "tool_call";
      case "tool_result": return "execution";
      case "completed": return "completion";
      case "error": return "execution";
    }
  }

  private mapEventTypeToStatus(type: EventType): string {
    switch (type) {
      case "error": return "failed";
      case "completed":
      case "tool_result": return "completed";
      default: return "completed";
    }
  }

  private getDescription(e: Event): string {
    switch (e.type) {
      case "error": return e.data.error || "Unknown error";
      case "tool_result": return e.data.result || "";
      case "tools_selected": return `Selected: ${e.data.tools?.join(", ") || ""}`;
      case "orchestrating": return e.data.note || "Analyzing strategy";
      case "tool_call": return `Calling ${e.data.tool || "unknown"}`;
      case "completed": return e.data.note || "Execution completed";
      default: return "";
    }
  }

  async flush() {
    const data = await this.kv.get(this.key, "json") as EventsState | null;

    if (!data?.events?.length) {
      await this.kv.delete(this.key);
      return;
    }

    // Only persist tool_result and error to DB
    const persistableEvents = data.events.filter(
      (e) => e.type === "tool_result" || e.type === "error"
    );

    if (persistableEvents.length) {
      const actions = persistableEvents.map((e) => ({
        subscriptionId: this.subscriptionId,
        delegationWalletId: this.delegationWalletId,
        actionType: this.mapEventTypeToActionType(e.type),
        description: this.getDescription(e),
        note: e.data.note || e.data.tools?.join(", ") || "",
        txHash: e.data.txHash,
        blockNumber: e.data.blockNumber,
        status: this.mapEventTypeToStatus(e.type),
        createdAt: new Date(e.timestamp).toISOString(),
      }));

      try {
        await fetch(`${this.dbLayerUrl}/actions/batch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actions }),
        });
      } catch (e) {
        console.error("Failed to flush actions to db-layer:", e);
      }
    }

    await this.kv.delete(this.key);
  }
}
